const STORAGE_KEY = "slapka-demo-state-v1";
const API_STATE_URL = "/api/state";

const initialState = {
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

let state = loadState();
let remoteSaveTimer;

const els = {
  resetDemo: document.querySelector("#reset-demo"),
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

function normalizeState(nextState) {
  return {
    trip: { ...initialState.trip, ...(nextState?.trip || {}) },
    riders: Array.isArray(nextState?.riders) && nextState.riders.length ? nextState.riders : structuredClone(initialState.riders),
    receipt: { ...initialState.receipt, ...(nextState?.receipt || {}) }
  };
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
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
  try {
    const response = await fetch(API_STATE_URL, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(state)
    });
    if (!response.ok) throw new Error("Uložení selhalo");
    state = normalizeState(await response.json());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    els.autosaveNote.textContent = "Uloženo do databáze";
  } catch {
    els.autosaveNote.textContent = "Uloženo jen lokálně";
  }
}

function money(value, currency = state.receipt.currency) {
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

function getGoingRiders() {
  return state.riders.filter((rider) => rider.going);
}

function getShareRiders() {
  return state.riders.filter((rider) => state.receipt.shareIds.includes(rider.id));
}

function getPayer() {
  return state.riders.find((rider) => rider.id === state.receipt.payerId) || state.riders[0];
}

function syncPayerDefaults() {
  const payer = getPayer();
  if (!payer) return;
  state.receipt.receiverAccount = state.receipt.receiverAccount || payer.account || "";
}

function renderTrip() {
  els.tripTitle.value = state.trip.title;
  els.tripDate.value = state.trip.date;
  els.tripStart.value = state.trip.start;
  els.tripMap.value = state.trip.map;
  els.mapLink.href = state.trip.map || "https://mapy.com/";

  const date = new Date(`${state.trip.date}T12:00:00`);
  els.tripDay.textContent = new Intl.DateTimeFormat("cs-CZ", { weekday: "short" }).format(date);
  els.tripDateShort.textContent = new Intl.DateTimeFormat("cs-CZ", { day: "numeric", month: "numeric" }).format(date);
}

function renderRiders() {
  els.riderList.innerHTML = "";

  state.riders.forEach((rider) => {
    const chip = document.createElement("label");
    chip.className = "rider-chip";
    chip.innerHTML = `
      <input type="checkbox" ${rider.going ? "checked" : ""} data-rider-going="${rider.id}" />
      <strong>${rider.name}</strong>
      <button class="remove-rider" type="button" data-remove-rider="${rider.id}" title="Odebrat ${rider.name}" aria-label="Odebrat ${rider.name}">×</button>
    `;
    els.riderList.append(chip);
  });

  els.riderList.querySelectorAll("[data-rider-going]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const rider = state.riders.find((item) => item.id === event.target.dataset.riderGoing);
      if (!rider) return;
      rider.going = event.target.checked;
      if (rider.going && !state.receipt.shareIds.includes(rider.id)) {
        state.receipt.shareIds.push(rider.id);
      }
      if (!rider.going) {
        state.receipt.shareIds = state.receipt.shareIds.filter((id) => id !== rider.id);
      }
      if (!getShareRiders().length) {
        state.receipt.shareIds = getGoingRiders().map((item) => item.id);
      }
      saveState();
      renderAll();
    });
  });

  els.riderList.querySelectorAll("[data-remove-rider]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.removeRider;
      state.riders = state.riders.filter((rider) => rider.id !== id);
      state.receipt.shareIds = state.receipt.shareIds.filter((shareId) => shareId !== id);
      if (state.receipt.payerId === id) {
        state.receipt.payerId = state.riders[0]?.id || "";
      }
      saveState();
      renderAll();
    });
  });
}

function renderPayerSelect() {
  els.payerSelect.innerHTML = state.riders
    .map((rider) => `<option value="${rider.id}" ${rider.id === state.receipt.payerId ? "selected" : ""}>${rider.name}</option>`)
    .join("");
}

function renderReceipt() {
  els.amountInput.value = state.receipt.amount || "";
  els.currencySelect.value = state.receipt.currency;
  els.receiverAccount.value = state.receipt.receiverAccount || "";
  els.paymentMessage.value = state.receipt.message || "";

  els.amountOptions.innerHTML = "";
  const candidates = [...new Set(state.receipt.candidates.map(cleanAmount).filter(Boolean))];
  if (!candidates.length) {
    els.amountOptions.innerHTML = `<span class="empty-note">Zatím nic. Nahraj fotku nebo zadej částku ručně.</span>`;
  }
  candidates.slice(0, 5).forEach((amount) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = money(amount);
    button.addEventListener("click", () => {
      state.receipt.amount = amount;
      saveState();
      renderAll();
    });
    els.amountOptions.append(button);
  });

  els.shareRiders.innerHTML = "";
  const goingIds = getGoingRiders().map((rider) => rider.id);
  state.riders.forEach((rider) => {
    const chip = document.createElement("label");
    chip.className = "share-chip";
    const checked = state.receipt.shareIds.includes(rider.id);
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
      if (event.target.checked) {
        state.receipt.shareIds = [...new Set([...state.receipt.shareIds, id])];
      } else {
        state.receipt.shareIds = state.receipt.shareIds.filter((shareId) => shareId !== id);
      }
      saveState();
      renderAll();
    });
  });
}

function buildSpdPayment(amount) {
  const account = (state.receipt.receiverAccount || "").replace(/\s+/g, "");
  const message = (state.receipt.message || "Šlapka").slice(0, 60);
  return `SPD*1.0*ACC:${account}*AM:${cleanAmount(amount).toFixed(2)}*CC:${state.receipt.currency}*MSG:${message}`;
}

function renderSettlements() {
  const shareRiders = getShareRiders();
  const payer = getPayer();
  const amount = cleanAmount(state.receipt.amount);
  const perPerson = shareRiders.length ? cleanAmount(amount / shareRiders.length) : 0;
  els.perPerson.textContent = `${money(perPerson)} / osoba`;
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
        <p>${money(perPerson)} za vyjížďku</p>
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
  while ((match = totalRegex.exec(normalized))) {
    priority.push(match[2]);
  }

  const allNumbers = [...normalized.matchAll(/\d{1,5}(?:[\s.]\d{3})*(?:[,.]\d{1,2})/g)].map((item) => item[0]);
  const parsed = [...priority, ...allNumbers]
    .map((raw) => cleanAmount(raw.replace(/\s/g, "").replace(/\.(?=\d{3})/g, "").replace(",", ".")))
    .filter((value) => value >= 10 && value < 100000);

  return [...new Set(parsed)].sort((a, b) => b - a).slice(0, 6);
}

async function runReceiptOcr(file) {
  els.ocrStatus.textContent = "Čtu účtenku. Chvilku to potrvá podle kvality fotky.";

  if (!window.Tesseract) {
    els.ocrStatus.textContent = "OCR knihovna se ještě nenačetla. Zkus to za pár vteřin nebo zadej částku ručně.";
    return;
  }

  try {
    const result = await window.Tesseract.recognize(file, "ces+eng", {
      logger: (message) => {
        if (message.status === "recognizing text") {
          els.ocrStatus.textContent = `Čtu účtenku: ${Math.round(message.progress * 100)} %`;
        }
      }
    });
    const candidates = extractAmountCandidates(result.data.text || "");
    state.receipt.candidates = candidates;
    if (candidates[0]) {
      state.receipt.amount = candidates[0];
      els.ocrStatus.textContent = `Našel jsem ${money(candidates[0])}. Zkontroluj možnosti.`;
    } else {
      els.ocrStatus.textContent = "Částku jsem nenašel jistě. Zadej ji ručně.";
    }
    saveState();
    renderAll();
  } catch (error) {
    els.ocrStatus.textContent = "OCR se nepovedlo. Fotku nechávám jako náhled, částku můžeš zadat ručně.";
  }
}

function renderAll() {
  syncPayerDefaults();
  renderTrip();
  renderRiders();
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

  [els.tripTitle, els.tripDate, els.tripStart, els.tripMap].forEach((input) => {
    input.addEventListener("input", () => {
      state.trip.title = els.tripTitle.value;
      state.trip.date = els.tripDate.value;
      state.trip.start = els.tripStart.value;
      state.trip.map = els.tripMap.value;
      saveState();
      renderTrip();
    });
  });

  els.addRiderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = els.newRiderName.value.trim();
    if (!name) return;
    const id = slugId(name);
    state.riders.push({ id, name, going: true, account: "" });
    state.receipt.shareIds.push(id);
    els.newRiderName.value = "";
    saveState();
    renderAll();
  });

  els.payerSelect.addEventListener("change", () => {
    state.receipt.payerId = els.payerSelect.value;
    state.receipt.receiverAccount = getPayer()?.account || state.receipt.receiverAccount;
    saveState();
    renderAll();
  });

  els.amountInput.addEventListener("input", () => {
    state.receipt.amount = cleanAmount(els.amountInput.value);
    saveState();
    renderSettlements();
  });

  els.currencySelect.addEventListener("change", () => {
    state.receipt.currency = els.currencySelect.value;
    saveState();
    renderAll();
  });

  els.receiverAccount.addEventListener("input", () => {
    state.receipt.receiverAccount = els.receiverAccount.value;
    saveState();
    renderSettlements();
  });

  els.paymentMessage.addEventListener("input", () => {
    state.receipt.message = els.paymentMessage.value;
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
