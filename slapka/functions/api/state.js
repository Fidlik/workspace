const json = (data, init = {}) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {})
    }
  });

const cents = (value) => Math.round(Number(value || 0) * 100);
const amount = (value) => Math.round(Number(value || 0)) / 100;

const defaultState = {
  trip: {
    id: "current-trip",
    title: "Středeční šlapka",
    date: "2026-06-17",
    start: "Kompotex, parkoviště u skladu",
    map: "https://mapy.com/"
  },
  riders: [
    { id: "petr", name: "Petr", going: true, account: "CZ6508000000192000145399" },
    { id: "martin", name: "Martin", going: true, account: "CZ2401000000001234567899" },
    { id: "jana", name: "Jana", going: true, account: "CZ5503000000001234567899" },
    { id: "tomas", name: "Tomáš", going: true, account: "CZ5806000000009876543210" }
  ],
  receipt: {
    id: "current-receipt",
    payerId: "petr",
    amount: 842,
    currency: "CZK",
    candidates: [842, 842.5, 824],
    shareIds: ["petr", "martin", "jana", "tomas"],
    receiverAccount: "CZ6508000000192000145399",
    message: "Šlapka 17.6."
  }
};

function requireDb(env) {
  if (!env.DB) {
    throw new Error("Missing D1 binding DB");
  }
  return env.DB;
}

async function hasRows(db) {
  const result = await db.prepare("SELECT COUNT(*) AS count FROM trips").first();
  return Number(result?.count || 0) > 0;
}

async function saveState(db, state) {
  const trip = state.trip || defaultState.trip;
  const riders = Array.isArray(state.riders) ? state.riders : defaultState.riders;
  const receipt = state.receipt || defaultState.receipt;
  const receiptId = receipt.id || "current-receipt";
  const tripId = trip.id || "current-trip";
  const payerId = receipt.payerId || riders[0]?.id || "petr";
  const shareIds = Array.isArray(receipt.shareIds) ? receipt.shareIds : riders.filter((r) => r.going).map((r) => r.id);
  const shareCents = shareIds.length ? Math.round(cents(receipt.amount) / shareIds.length) : 0;

  const statements = [];

  for (const rider of riders) {
    statements.push(
      db
        .prepare(
          `INSERT INTO users (id, name, bank_account, payment_message, updated_at)
           VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
           ON CONFLICT(id) DO UPDATE SET
             name = excluded.name,
             bank_account = excluded.bank_account,
             payment_message = excluded.payment_message,
             updated_at = CURRENT_TIMESTAMP`
        )
        .bind(rider.id, rider.name, rider.account || null, rider.paymentMessage || null)
    );
  }

  statements.push(
    db
      .prepare(
        `INSERT INTO trips (id, title, trip_date, start_place, map_url, updated_at)
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(id) DO UPDATE SET
           title = excluded.title,
           trip_date = excluded.trip_date,
           start_place = excluded.start_place,
           map_url = excluded.map_url,
           updated_at = CURRENT_TIMESTAMP`
      )
      .bind(tripId, trip.title, trip.date, trip.start, trip.map || null)
  );

  statements.push(db.prepare("DELETE FROM trip_riders WHERE trip_id = ?").bind(tripId));
  for (const rider of riders) {
    statements.push(
      db
        .prepare("INSERT INTO trip_riders (trip_id, user_id, is_going) VALUES (?, ?, ?)")
        .bind(tripId, rider.id, rider.going ? 1 : 0)
    );
  }

  statements.push(
    db
      .prepare(
        `INSERT INTO receipts (
          id, trip_id, paid_by, amount_cents, currency, ocr_candidates_json,
          selected_amount_cents, payment_account, payment_message, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          paid_by = excluded.paid_by,
          amount_cents = excluded.amount_cents,
          currency = excluded.currency,
          ocr_candidates_json = excluded.ocr_candidates_json,
          selected_amount_cents = excluded.selected_amount_cents,
          payment_account = excluded.payment_account,
          payment_message = excluded.payment_message,
          updated_at = CURRENT_TIMESTAMP`
      )
      .bind(
        receiptId,
        tripId,
        payerId,
        cents(receipt.amount),
        receipt.currency || "CZK",
        JSON.stringify(receipt.candidates || []),
        cents(receipt.amount),
        receipt.receiverAccount || null,
        receipt.message || null
      )
  );

  statements.push(db.prepare("DELETE FROM receipt_shares WHERE receipt_id = ?").bind(receiptId));
  for (const userId of shareIds) {
    statements.push(
      db
        .prepare("INSERT INTO receipt_shares (receipt_id, user_id, share_cents) VALUES (?, ?, ?)")
        .bind(receiptId, userId, shareCents)
    );
  }

  await db.batch(statements);
}

async function loadState(db) {
  if (!(await hasRows(db))) {
    await saveState(db, defaultState);
  }

  const trip = await db
    .prepare(
      `SELECT id, title, trip_date AS date, start_place AS start, map_url AS map
       FROM trips
       ORDER BY trip_date DESC, created_at DESC
       LIMIT 1`
    )
    .first();

  const ridersResult = await db
    .prepare(
      `SELECT users.id, users.name, users.bank_account AS account, trip_riders.is_going AS going
       FROM trip_riders
       JOIN users ON users.id = trip_riders.user_id
       WHERE trip_riders.trip_id = ?
       ORDER BY users.name COLLATE NOCASE`
    )
    .bind(trip.id)
    .all();

  const receipt = await db
    .prepare(
      `SELECT id, paid_by AS payerId, amount_cents, currency, ocr_candidates_json,
              payment_account AS receiverAccount, payment_message AS message
       FROM receipts
       WHERE trip_id = ?
       ORDER BY created_at DESC
       LIMIT 1`
    )
    .bind(trip.id)
    .first();

  const shareResult = receipt
    ? await db
        .prepare("SELECT user_id FROM receipt_shares WHERE receipt_id = ?")
        .bind(receipt.id)
        .all()
    : { results: [] };

  return {
    trip,
    riders: (ridersResult.results || []).map((rider) => ({
      ...rider,
      going: Boolean(rider.going),
      account: rider.account || ""
    })),
    receipt: receipt
      ? {
          id: receipt.id,
          payerId: receipt.payerId,
          amount: amount(receipt.amount_cents),
          currency: receipt.currency,
          candidates: JSON.parse(receipt.ocr_candidates_json || "[]"),
          shareIds: (shareResult.results || []).map((row) => row.user_id),
          receiverAccount: receipt.receiverAccount || "",
          message: receipt.message || ""
        }
      : defaultState.receipt
  };
}

export async function onRequestGet({ env }) {
  try {
    const db = requireDb(env);
    return json(await loadState(db));
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const db = requireDb(env);
    const state = await request.json();
    await saveState(db, state);
    return json(await loadState(db));
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
