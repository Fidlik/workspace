const STORAGE_KEY = "slapka-demo-state-v2";
const API_STATE_URL = "/api/state";

const initialState = {
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

let state = loadState();
let remoteSaveTimer;

const els = {
  resetDemo: document.querySelector("#reset-demo"),
  addTrip: document.querySelector("#add-trip"),
  tripList: document.querySelector("#trip-list"),
  tripTitle: document.querySelector("#trip-title-input"),
  tripDate: document.querySelector("#trip-date"),
  tripStart: document.querySelector("#trip-start"),
  tripMap: document.querySelector("#trip-map"),
  tripDay: document.querySelector("#trip-day"),
  tripDateShort: document.querySelector("#trip-date-short"),
  mapLink: document.querySelector("#map-link"),
  autosaveNote: document.querySelector("#autosave-note"),
  addRiderForm: document.querySelector("#add-rider-form"),
  newRiderName: document.querySelector("#new-rider-name"),
  riderList: document.querySelector("#rider-list"),
  addReceipt: document.querySelector("#add-receipt"),
  receiptList: document.querySelector("#receipt-list"),
  receiptFile: document.querySelector("#receipt-file"),
  receiptPreview: document.querySelector("#receipt-preview"),
  ocrStatus: document.querySelector("#ocr-status"),
  payerSelect: document.querySelector("#payer-select"),
  amountInput: document.querySelector("#amount-input"),
  currencySelect: document.querySelector("#currency-select"),
  amountOptions: document.querySelector("#amount-options"),
  shareRiders: document.querySelector("#share-riders"),
  receiverAccount: document.querySelector("#receiver-account"),
  paymentMessage: document.querySelector("#payment-message"),
  perPerson: document.querySelector("#per-person"),
  settlementList: document.querySelector("#settlement-list")
};

function normalizeState(raw) {
  if (Array.isArray(raw?.trips)) {
    const trips = raw.trips.length ? raw.trips : structuredClone(initialState.trips);
    const riders = Array.isArray(raw.riders) && raw.riders.length ? raw.riders : structuredClone(initialState.riders);
    const tripRiders = raw.tripRiders || {};
    const receipts = Array.isArray(raw.receipts) ? raw.receipts : [];
    const currentTripId = trips.some((trip) => trip.id === raw.currentTripId) ? raw.currentTripId : trips[0].id;
    const currentReceiptId = receipts.some((receipt) => receipt.id === raw.currentReceiptId && receipt.tripId === currentTripId)
      ? raw.currentReceiptId
      : receipts.find((receipt) => receipt.tripId === currentTripId)?.id || null;

    if (!tripRiders[currentTripId]) tripRiders[currentTripId] = riders.map((rider) => rider.id);
    return { currentTripId, currentReceiptId, trips, riders, tripRiders, receipts };
  }

  const trip = { ...initialState.trips[0], ...(raw?.trip || {}) };
  const riders = Array.isArray(raw?.riders) && raw.riders.length ? raw.riders : structuredClone(initialState.riders);
  const receipt = { ...initialState.receipts[0], ...(raw?.receipt || {}), tripId: trip.id };
  return {
    currentTripId: trip.id,
    currentReceiptId: receipt.id,
    trips: [trip],
    riders: riders.map(({ going, ...rider }) => rider),
    tripRiders: { [trip.id]: riders.filter((rider) => rider.going !== false).map((rider) => rider.id) },
    receipts: [receipt]
  };
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("slapka-demo-state-v1");
    return saved ? normalizeState(JSON.parse(saved)) : structuredClone(initialState);
  } catch {
    return structuredClone(initialState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  els.autosaveNote.textContent = "Uloženo lokálně";
  scheduleRemoteSave();
}

function mergeRemoteState(remoteRaw, previousState) {
  const remote = normalizeState(remoteRaw);
  const localOrder = new Map(previousState.trips.map((trip, index) => [trip.id, index]));
  remote.trips.sort((a, b) => {
    const aOrder = localOrder.has(a.id) ? localOrder.get(a.id) : Number.MAX_SAFE_INTEGER;
    const bOrder = localOrder.has(b.id) ? localOrder.get(b.id) : Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.date.localeCompare(b.date) || a.title.localeCompare(b.title, "cs");
  });

  if (remote.trips.some((trip) => trip.id === previousState.currentTripId)) {
    remote.currentTripId = previousState.currentTripId;
  }
  if (remote.receipts.some((receipt) => receipt.id === previousState.currentReceiptId && receipt.tripId === remote.currentTripId)) {
    remote.currentReceiptId = previousState.currentReceiptId;
  } else {
    remote.currentReceiptId = remote.receipts.find((receipt) => receipt.tripId === remote.currentTripId)?.id || null;
  }
  return remote;
}

async function loadRemoteState() {
  try {
    els.autosaveNote.textContent = "Načítám databázi";
    const response = await fetch(API_STATE_URL, { headers: { accept: "application/json" }, cache: "no-store" });
    if (!response.ok) throw new Error("API není dostupné");
    state = normalizeState(await response.json());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    els.autosaveNote.textContent = "Načteno z databáze";
    renderAll();
  } catch {
    els.autosaveNote.textContent = "Lokální režim";
  }
}

function scheduleRemoteSave() {
  clearTimeout(remoteSaveTimer);
  remoteSaveTimer = setTimeout(saveRemoteState, 650);
}

async function saveRemoteState() {
  const previousState = structuredClone(state);
  try {
    const response = await fetch(API_STATE_URL, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(state)
    });
    if (!response.ok) throw new Error("Uložení selhalo");
    state = mergeRemoteState(await response.json(), previousState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    els.autosaveNote.textContent = "Uloženo do databáze";
    renderTripList();
    renderReceiptList();
  } catch {
    els.autosaveNote.textContent = "Uloženo jen lokálně";
  }
}

function nextSundayIso() {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  const daysUntilSunday = (7 - date.getDay()) % 7 || 7;
  date.setDate(date.getDate() + daysUntilSunday);
  return date.toISOString().slice(0, 10);
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function money(value, currency = getCurrentReceipt()?.currency || "CZK") {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2
  }).format(Number(value || 0));
}

function cleanAmount(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function slugId(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || `jezdec-${Date.now()}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("cs-CZ", { day: "numeric", month: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

function getCurrentTrip() {
  return state.trips.find((trip) => trip.id === state.currentTripId) || state.trips[0];
}

function getCurrentReceipt() {
  let receipt = state.receipts.find((item) => item.id === state.currentReceiptId && item.tripId === state.currentTripId);
  if (!receipt) receipt = state.receipts.find((item) => item.tripId === state.currentTripId);
  return receipt || null;
}

function getTripReceiptList(tripId = state.currentTripId) {
  return state.receipts.filter((receipt) => receipt.tripId === tripId);
}

function getGoingRiderIds() {
  return state.tripRiders[state.currentTripId] || [];
}

function getGoingRiders() {
  const ids = getGoingRiderIds();
  return state.riders.filter((rider) => ids.includes(rider.id));
}

function getShareRiders() {
  const receipt = getCurrentReceipt();
  if (!receipt) return [];
  return state.riders.filter((rider) => receipt.shareIds.includes(rider.id));
}

function getPayer() {
  const receipt = getCurrentReceipt();
  return state.riders.find((rider) => rider.id === receipt?.payerId) || state.riders[0];
}

function ensureCurrentReceipt() {
  const tripReceipts = getTripReceiptList();
  if (tripReceipts.length && !tripReceipts.some((receipt) => receipt.id === state.currentReceiptId)) {
    state.currentReceiptId = tripReceipts[0].id;
  }
}

function syncPayerDefaults() {
  const receipt = getCurrentReceipt();
  const payer = getPayer();
  if (!receipt || !payer) return;
  receipt.receiverAccount = receipt.receiverAccount || payer.account || "";
}

function renderTripList() {
  els.tripList.innerHTML = "";
  state.trips.forEach((trip) => {
    const receipts = getTripReceiptList(trip.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `trip-card ${trip.id === state.currentTripId ? "active" : ""}`;
    button.innerHTML = `
      <strong>${trip.title}</strong>
      <span>${formatDate(trip.date)}</span>
      <span>${trip.start || "Start není vyplněný"}</span>
      <div class="trip-meta">
        <span>${state.tripRiders[trip.id]?.length || 0} jezdců</span>
        <span>${receipts.length} účtenek</span>
      </div>
    `;
    button.addEventListener("click", () => {
      state.currentTripId = trip.id;
      state.currentReceiptId = getTripReceiptList(trip.id)[0]?.id || null;
      els.receiptPreview.hidden = true;
      els.receiptFile.value = "";
      els.ocrStatus.textContent = "Čekám na účtenku.";
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      renderAll();
    });
    els.tripList.append(button);
  });
}

function renderTrip() {
  const trip = getCurrentTrip();
  if (!trip) return;
  els.tripTitle.value = trip.title;
  els.tripDate.value = trip.date;
  els.tripStart.value = trip.start || "";
  els.tripMap.value = trip.map || "";
  els.mapLink.href = trip.map || "https://mapy.com/";

  const date = new Date(`${trip.date}T12:00:00`);
  els.tripDay.textContent = new Intl.DateTimeFormat("cs-CZ", { weekday: "short" }).format(date);
  els.tripDateShort.textContent = new Intl.DateTimeFormat("cs-CZ", { day: "numeric", month: "numeric" }).format(date);
}

function renderRiders() {
  const goingIds = getGoingRiderIds();
  els.riderList.innerHTML = "";

  state.riders.forEach((rider) => {
    const chip = document.createElement("label");
    chip.className = "rider-chip";
    chip.innerHTML = `
      <input type="checkbox" ${goingIds.includes(rider.id) ? "checked" : ""} data-rider-going="${rider.id}" />
      <strong>${rider.name}</strong>
      <button class="remove-rider" type="button" data-remove-rider="${rider.id}" title="Odebrat ${rider.name}" aria-label="Odebrat ${rider.name}">×</button>
    `;
    els.riderList.append(chip);
  });

  els.riderList.querySelectorAll("[data-rider-going]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const riderId = event.target.dataset.riderGoing;
      const ids = new Set(getGoingRiderIds());
      if (event.target.checked) ids.add(riderId);
      else ids.delete(riderId);
      state.tripRiders[state.currentTripId] = [...ids];

      for (const receipt of getTripReceiptList()) {
        if (event.target.checked && !receipt.shareIds.includes(riderId)) receipt.shareIds.push(riderId);
        if (!event.target.checked) receipt.shareIds = receipt.shareIds.filter((id) => id !== riderId);
      }
      saveState();
      renderAll();
    });
  });

  els.riderList.querySelectorAll("[data-remove-rider]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.removeRider;
      state.riders = state.riders.filter((rider) => rider.id !== id);
      for (const tripId of Object.keys(state.tripRiders)) state.tripRiders[tripId] = state.tripRiders[tripId].filter((riderId) => riderId !== id);
      for (const receipt of state.receipts) {
        receipt.shareIds = receipt.shareIds.filter((riderId) => riderId !== id);
        if (receipt.payerId === id) receipt.payerId = state.riders[0]?.id || "";
      }
      saveState();
      renderAll();
    });
  });
}

function renderReceiptList() {
  const receipts = getTripReceiptList();
  els.receiptList.innerHTML = "";
  if (!receipts.length) {
    els.receiptList.innerHTML = `<span class="empty-note">Tahle vyjížďka zatím nemá žádnou účtenku.</span>`;
    return;
  }

  receipts.forEach((receipt, index) => {
    const payer = state.riders.find((rider) => rider.id === receipt.payerId);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `receipt-tab ${receipt.id === state.currentReceiptId ? "active" : ""}`;
    button.innerHTML = `
      <strong>Účtenka ${index + 1}</strong>
      <span>${money(receipt.amount, receipt.currency)} · ${payer?.name || "bez plátce"}</span>
    `;
    button.addEventListener("click", () => {
      state.currentReceiptId = receipt.id;
      els.receiptPreview.hidden = true;
      els.receiptFile.value = "";
      els.ocrStatus.textContent = "Čekám na účtenku.";
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      renderAll();
    });
    els.receiptList.append(button);
  });
}

function renderPayerSelect() {
  const receipt = getCurrentReceipt();
  els.payerSelect.innerHTML = state.riders
    .map((rider) => `<option value="${rider.id}" ${rider.id === receipt?.payerId ? "selected" : ""}>${rider.name}</option>`)
    .join("");
  els.payerSelect.disabled = !receipt;
}

function renderReceipt() {
  const receipt = getCurrentReceipt();
  const hasReceipt = Boolean(receipt);
  els.amountInput.disabled = !hasReceipt;
  els.currencySelect.disabled = !hasReceipt;
  els.receiverAccount.disabled = !hasReceipt;
  els.paymentMessage.disabled = !hasReceipt;
  els.receiptFile.disabled = !hasReceipt;

  if (!receipt) {
    els.amountInput.value = "";
    els.amountOptions.innerHTML = `<span class="empty-note">Přidej první účtenku pro vybranou vyjížďku.</span>`;
    els.shareRiders.innerHTML = "";
    return;
  }

  els.amountInput.value = receipt.amount || "";
  els.currencySelect.value = receipt.currency;
  els.receiverAccount.value = receipt.receiverAccount || "";
  els.paymentMessage.value = receipt.message || "";

  els.amountOptions.innerHTML = "";
  const candidates = [...new Set(receipt.candidates.map(cleanAmount).filter(Boolean))];
  if (!candidates.length) {
    els.amountOptions.innerHTML = `<span class="empty-note">Zatím nic. Nahraj fotku nebo zadej částku ručně.</span>`;
  }
  candidates.slice(0, 5).forEach((amount) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = money(amount, receipt.currency);
    button.addEventListener("click", () => {
      receipt.amount = amount;
      saveState();
      renderAll();
    });
    els.amountOptions.append(button);
  });

  els.shareRiders.innerHTML = "";
  const goingIds = getGoingRiderIds();
  state.riders.forEach((rider) => {
    const chip = document.createElement("label");
    chip.className = "share-chip";
    const checked = receipt.shareIds.includes(rider.id);
    const hint = goingIds.includes(rider.id) ? "" : " · nejede";
    chip.innerHTML = `
      <input type="checkbox" ${checked ? "checked" : ""} data-share-rider="${rider.id}" />
      <span>${rider.name}${hint}</span>
    `;
    els.shareRiders.append(chip);
  });

  els.shareRiders.querySelectorAll("[data-share-rider]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const id = event.target.dataset.shareRider;
      if (event.target.checked) receipt.shareIds = [...new Set([...receipt.shareIds, id])];
      else receipt.shareIds = receipt.shareIds.filter((shareId) => shareId !== id);
      saveState();
      renderAll();
    });
  });
}

function buildSpdPayment(amount) {
  const receipt = getCurrentReceipt();
  const account = (receipt?.receiverAccount || "").replace(/\s+/g, "");
  const message = (receipt?.message || "Šlapka").slice(0, 60);
  return `SPD*1.0*ACC:${account}*AM:${cleanAmount(amount).toFixed(2)}*CC:${receipt?.currency || "CZK"}*MSG:${message}`;
}

function renderSettlements() {
  const receipt = getCurrentReceipt();
  if (!receipt) {
    els.perPerson.textContent = "0 Kč / osoba";
    els.settlementList.innerHTML = `<div class="empty-note">Vyber nebo přidej účtenku.</div>`;
    return;
  }

  const shareRiders = getShareRiders();
  const payer = getPayer();
  const amount = cleanAmount(receipt.amount);
  const perPerson = shareRiders.length ? cleanAmount(amount / shareRiders.length) : 0;
  els.perPerson.textContent = `${money(perPerson, receipt.currency)} / osoba`;
  els.settlementList.innerHTML = "";

  if (!amount || !shareRiders.length || !payer) {
    els.settlementList.innerHTML = `<div class="empty-note">Zadej částku a vyber lidi pro rozdělení.</div>`;
    return;
  }

  const debtors = shareRiders.filter((rider) => rider.id !== payer.id);
  if (!debtors.length) {
    els.settlementList.innerHTML = `<div class="empty-note">Platící je jediný vybraný člověk. Není co vyrovnávat.</div>`;
    return;
  }

  debtors.forEach((rider) => {
    const card = document.createElement("article");
    card.className = "payment-card";
    card.innerHTML = `
      <div>
        <h3>${rider.name} → ${payer.name}</h3>
        <p>${money(perPerson, receipt.currency)} za vyjížďku</p>
      </div>
      <div class="qr-box" data-qr="${encodeURIComponent(buildSpdPayment(perPerson))}"></div>
    `;
    els.settlementList.append(card);
  });

  renderQrCodes();
}

function renderQrCodes() {
  const boxes = els.settlementList.querySelectorAll("[data-qr]");
  boxes.forEach((box) => {
    const value = decodeURIComponent(box.dataset.qr);
    box.innerHTML = "";
    if (!window.QRCode) {
      box.textContent = "QR knihovna se načítá.";
      return;
    }
    window.QRCode.toCanvas(value, { width: 164, margin: 1, color: { dark: "#1f2720", light: "#f5efe4" } }, (error, canvas) => {
      if (error) {
        box.textContent = "QR se nepodařilo vytvořit.";
        return;
      }
      box.append(canvas);
    });
  });
}

function extractAmountCandidates(text) {
  const normalized = text.replace(/\s+/g, " ");
  const priority = [];
  const totalRegex = /(celkem|total|suma|k úhradě|k uhrade)[^0-9]{0,24}(\d{1,5}(?:[\s.]\d{3})*(?:[,.]\d{1,2})?)/gi;
  let match;
  while ((match = totalRegex.exec(normalized))) priority.push(match[2]);

  const allNumbers = [...normalized.matchAll(/\d{1,5}(?:[\s.]\d{3})*(?:[,.]\d{1,2})/g)].map((item) => item[0]);
  const parsed = [...priority, ...allNumbers]
    .map((raw) => cleanAmount(raw.replace(/\s/g, "").replace(/\.(?=\d{3})/g, "").replace(",", ".")))
    .filter((value) => value >= 10 && value < 100000);

  return [...new Set(parsed)].sort((a, b) => b - a).slice(0, 6);
}

async function runReceiptOcr(file) {
  const receipt = getCurrentReceipt();
  if (!receipt) return;
  els.ocrStatus.textContent = "Čtu účtenku. Chvilku to potrvá podle kvality fotky.";

  if (!window.Tesseract) {
    els.ocrStatus.textContent = "OCR knihovna se ještě nenačetla. Zkus to za pár vteřin nebo zadej částku ručně.";
    return;
  }

  try {
    const result = await window.Tesseract.recognize(file, "ces+eng", {
      logger: (message) => {
        if (message.status === "recognizing text") els.ocrStatus.textContent = `Čtu účtenku: ${Math.round(message.progress * 100)} %`;
      }
    });
    const candidates = extractAmountCandidates(result.data.text || "");
    receipt.candidates = candidates;
    if (candidates[0]) {
      receipt.amount = candidates[0];
      els.ocrStatus.textContent = `Našel jsem ${money(candidates[0], receipt.currency)}. Zkontroluj možnosti.`;
    } else {
      els.ocrStatus.textContent = "Částku jsem nenašel jistě. Zadej ji ručně.";
    }
    saveState();
    renderAll();
  } catch {
    els.ocrStatus.textContent = "OCR se nepovedlo. Fotku nechávám jako náhled, částku můžeš zadat ručně.";
  }
}

function addTrip() {
  const date = nextSundayIso();
  const id = uid("trip");
  const trip = { id, title: "Nová vyjížďka", date, start: "", map: "https://mapy.com/" };
  state.trips.push(trip);
  state.currentTripId = id;
  state.tripRiders[id] = state.riders.map((rider) => rider.id);
  addReceipt(false);
  saveState();
  renderAll();
}

function addReceipt(shouldSave = true) {
  const trip = getCurrentTrip();
  const payer = state.riders[0];
  if (!trip || !payer) return;
  const receipt = {
    id: uid("receipt"),
    tripId: trip.id,
    payerId: payer.id,
    amount: 0,
    currency: "CZK",
    candidates: [],
    shareIds: [...getGoingRiderIds()],
    receiverAccount: payer.account || "",
    message: `Šlapka ${formatDate(trip.date)}`
  };
  state.receipts.push(receipt);
  state.currentReceiptId = receipt.id;
  els.receiptPreview.hidden = true;
  els.receiptFile.value = "";
  els.ocrStatus.textContent = "Čekám na účtenku.";
  if (shouldSave) {
    saveState();
    renderAll();
  }
}

function renderAll() {
  ensureCurrentReceipt();
  syncPayerDefaults();
  renderTripList();
  renderTrip();
  renderRiders();
  renderReceiptList();
  renderPayerSelect();
  renderReceipt();
  renderSettlements();
}

function bindEvents() {
  els.resetDemo.addEventListener("click", () => {
    state = structuredClone(initialState);
    saveState();
    renderAll();
  });

  els.addTrip.addEventListener("click", addTrip);
  els.addReceipt.addEventListener("click", () => addReceipt(true));

  [els.tripTitle, els.tripDate, els.tripStart, els.tripMap].forEach((input) => {
    input.addEventListener("input", () => {
      const trip = getCurrentTrip();
      if (!trip) return;
      trip.title = els.tripTitle.value;
      trip.date = els.tripDate.value;
      trip.start = els.tripStart.value;
      trip.map = els.tripMap.value;
      saveState();
      renderTrip();
      renderTripList();
    });
  });

  els.addRiderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = els.newRiderName.value.trim();
    if (!name) return;
    const id = slugId(name);
    if (!state.riders.some((rider) => rider.id === id)) state.riders.push({ id, name, account: "" });
    state.tripRiders[state.currentTripId] = [...new Set([...getGoingRiderIds(), id])];
    const receipt = getCurrentReceipt();
    if (receipt) receipt.shareIds = [...new Set([...receipt.shareIds, id])];
    els.newRiderName.value = "";
    saveState();
    renderAll();
  });

  els.payerSelect.addEventListener("change", () => {
    const receipt = getCurrentReceipt();
    if (!receipt) return;
    receipt.payerId = els.payerSelect.value;
    receipt.receiverAccount = getPayer()?.account || receipt.receiverAccount;
    saveState();
    renderAll();
  });

  els.amountInput.addEventListener("input", () => {
    const receipt = getCurrentReceipt();
    if (!receipt) return;
    receipt.amount = cleanAmount(els.amountInput.value);
    saveState();
    renderSettlements();
    renderReceiptList();
  });

  els.currencySelect.addEventListener("change", () => {
    const receipt = getCurrentReceipt();
    if (!receipt) return;
    receipt.currency = els.currencySelect.value;
    saveState();
    renderAll();
  });

  els.receiverAccount.addEventListener("input", () => {
    const receipt = getCurrentReceipt();
    if (!receipt) return;
    receipt.receiverAccount = els.receiverAccount.value;
    saveState();
    renderSettlements();
  });

  els.paymentMessage.addEventListener("input", () => {
    const receipt = getCurrentReceipt();
    if (!receipt) return;
    receipt.message = els.paymentMessage.value;
    saveState();
    renderSettlements();
  });

  els.receiptFile.addEventListener("change", () => {
    const [file] = els.receiptFile.files;
    if (!file) return;
    els.receiptPreview.src = URL.createObjectURL(file);
    els.receiptPreview.hidden = false;
    runReceiptOcr(file);
  });
}

bindEvents();
renderAll();
loadRemoteState();
setTimeout(renderQrCodes, 500);
