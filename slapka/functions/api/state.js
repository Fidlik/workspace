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
  currentTripId: "trip-2026-06-17",
  currentReceiptId: "receipt-2026-06-17-1",
  trips: [
    {
      id: "trip-2026-06-17",
      title: "Středeční šlapka",
      date: "2026-06-17",
      start: "Kompotex, parkoviště u skladu",
      map: "https://mapy.com/"
    }
  ],
  riders: [
    { id: "petr", name: "Petr", account: "CZ6508000000192000145399" },
    { id: "martin", name: "Martin", account: "CZ2401000000001234567899" },
    { id: "jana", name: "Jana", account: "CZ5503000000001234567899" },
    { id: "tomas", name: "Tomáš", account: "CZ5806000000009876543210" }
  ],
  tripRiders: {
    "trip-2026-06-17": ["petr", "martin", "jana", "tomas"]
  },
  receipts: [
    {
      id: "receipt-2026-06-17-1",
      tripId: "trip-2026-06-17",
      payerId: "petr",
      amount: 842,
      currency: "CZK",
      candidates: [842, 842.5, 824],
      shareIds: ["petr", "martin", "jana", "tomas"],
      receiverAccount: "CZ6508000000192000145399",
      message: "Šlapka 17.6."
    }
  ]
};

function requireDb(env) {
  if (!env.DB) throw new Error("Missing D1 binding DB");
  return env.DB;
}

function getCookie(request, name) {
  const cookie = request.headers.get("cookie") || "";
  return (
    cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${name}=`))
      ?.slice(name.length + 1) || ""
  );
}

function accessPassword(env) {
  return env.ACCESS_PASSWORD || env.ADMIN_PASSWORD || "";
}

function requireAccess(request, env) {
  const password = accessPassword(env);
  if (!password) {
    return json({ error: "ACCESS_PASSWORD is not configured" }, { status: 403 });
  }

  const cookiePassword = decodeURIComponent(getCookie(request, "slapka_access"));
  const headerPassword = request.headers.get("x-slapka-admin") || "";
  if (cookiePassword !== password && headerPassword !== password) {
    return json({ error: "Access password required" }, { status: 401 });
  }

  return null;
}

function normalizeIncoming(raw) {
  if (Array.isArray(raw?.trips)) {
    return {
      ...defaultState,
      ...raw,
      trips: raw.trips.length ? raw.trips : defaultState.trips,
      riders: Array.isArray(raw.riders) && raw.riders.length ? raw.riders : defaultState.riders,
      tripRiders: raw.tripRiders || defaultState.tripRiders,
      receipts: Array.isArray(raw.receipts) ? raw.receipts : []
    };
  }

  const trip = raw?.trip || defaultState.trips[0];
  const riders = Array.isArray(raw?.riders) && raw.riders.length ? raw.riders : defaultState.riders;
  const receipt = raw?.receipt || defaultState.receipts[0];
  return {
    currentTripId: trip.id || "current-trip",
    currentReceiptId: receipt.id || "current-receipt",
    trips: [trip],
    riders: riders.map(({ going, ...rider }) => rider),
    tripRiders: {
      [trip.id || "current-trip"]: riders.filter((rider) => rider.going !== false).map((rider) => rider.id)
    },
    receipts: [{ ...receipt, tripId: trip.id || "current-trip" }]
  };
}

async function hasRows(db) {
  const result = await db.prepare("SELECT COUNT(*) AS count FROM trips").first();
  return Number(result?.count || 0) > 0;
}

async function saveState(db, rawState) {
  const state = normalizeIncoming(rawState);
  const statements = [
    db.prepare("DELETE FROM receipt_shares"),
    db.prepare("DELETE FROM receipts"),
    db.prepare("DELETE FROM trip_riders"),
    db.prepare("DELETE FROM trips"),
    db.prepare("DELETE FROM users")
  ];

  for (const rider of state.riders) {
    statements.push(
      db
        .prepare(
          `INSERT INTO users (id, name, bank_account, payment_message, updated_at)
           VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`
        )
        .bind(rider.id, rider.name, rider.account || null, rider.paymentMessage || null)
    );
  }

  for (const trip of state.trips) {
    statements.push(
      db
        .prepare(
          `INSERT INTO trips (id, title, trip_date, start_place, map_url, note, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
        )
        .bind(trip.id, trip.title, trip.date, trip.start || "", trip.map || null, trip.note || null)
    );

    const riderIds = state.tripRiders?.[trip.id] || [];
    for (const userId of riderIds) {
      statements.push(
        db.prepare("INSERT INTO trip_riders (trip_id, user_id, is_going) VALUES (?, ?, 1)").bind(trip.id, userId)
      );
    }
  }

  for (const receipt of state.receipts) {
    const payerId = receipt.payerId || state.riders[0]?.id;
    if (!payerId || !receipt.tripId) continue;
    statements.push(
      db
        .prepare(
          `INSERT INTO receipts (
            id, trip_id, paid_by, amount_cents, currency, ocr_candidates_json,
            selected_amount_cents, payment_account, payment_message, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
        )
        .bind(
          receipt.id,
          receipt.tripId,
          payerId,
          cents(receipt.amount),
          receipt.currency || "CZK",
          JSON.stringify(receipt.candidates || []),
          cents(receipt.amount),
          receipt.receiverAccount || null,
          receipt.message || null
        )
    );

    const shareIds = Array.isArray(receipt.shareIds) ? receipt.shareIds : [];
    const shareCents = shareIds.length ? Math.round(cents(receipt.amount) / shareIds.length) : 0;
    for (const userId of shareIds) {
      statements.push(
        db.prepare("INSERT INTO receipt_shares (receipt_id, user_id, share_cents) VALUES (?, ?, ?)").bind(receipt.id, userId, shareCents)
      );
    }
  }

  await db.batch(statements);
  return state;
}

async function loadState(db, selection = {}) {
  if (!(await hasRows(db))) await saveState(db, defaultState);

  const tripsResult = await db
    .prepare(
      `SELECT id, title, trip_date AS date, start_place AS start, map_url AS map, note
       FROM trips
       ORDER BY trip_date ASC, title COLLATE NOCASE ASC`
    )
    .all();

  const ridersResult = await db
    .prepare("SELECT id, name, bank_account AS account, payment_message AS paymentMessage FROM users ORDER BY name COLLATE NOCASE")
    .all();

  const tripRidersResult = await db.prepare("SELECT trip_id, user_id FROM trip_riders WHERE is_going = 1").all();

  const receiptsResult = await db
    .prepare(
      `SELECT id, trip_id AS tripId, paid_by AS payerId, amount_cents, currency,
              ocr_candidates_json, payment_account AS receiverAccount, payment_message AS message
       FROM receipts
       ORDER BY created_at ASC`
    )
    .all();

  const sharesResult = await db.prepare("SELECT receipt_id, user_id FROM receipt_shares").all();

  const trips = tripsResult.results || [];
  const riders = (ridersResult.results || []).map((rider) => ({ ...rider, account: rider.account || "" }));
  const tripRiders = {};
  for (const row of tripRidersResult.results || []) {
    tripRiders[row.trip_id] ||= [];
    tripRiders[row.trip_id].push(row.user_id);
  }

  const receiptShares = {};
  for (const row of sharesResult.results || []) {
    receiptShares[row.receipt_id] ||= [];
    receiptShares[row.receipt_id].push(row.user_id);
  }

  const receipts = (receiptsResult.results || []).map((receipt) => ({
    id: receipt.id,
    tripId: receipt.tripId,
    payerId: receipt.payerId,
    amount: amount(receipt.amount_cents),
    currency: receipt.currency,
    candidates: JSON.parse(receipt.ocr_candidates_json || "[]"),
    shareIds: receiptShares[receipt.id] || [],
    receiverAccount: receipt.receiverAccount || "",
    message: receipt.message || ""
  }));

  const currentTripId = trips.some((trip) => trip.id === selection.currentTripId)
    ? selection.currentTripId
    : trips[0]?.id || defaultState.currentTripId;
  const currentReceiptId = receipts.some((receipt) => receipt.id === selection.currentReceiptId && receipt.tripId === currentTripId)
    ? selection.currentReceiptId
    : receipts.find((receipt) => receipt.tripId === currentTripId)?.id || null;

  return { currentTripId, currentReceiptId, trips, riders, tripRiders, receipts };
}

export async function onRequestGet({ env }) {
  try {
    return json(await loadState(requireDb(env)));
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const authError = requireAccess(request, env);
    if (authError) return authError;

    const db = requireDb(env);
    const incoming = normalizeIncoming(await request.json());
    await saveState(db, incoming);
    return json(await loadState(db, incoming));
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
