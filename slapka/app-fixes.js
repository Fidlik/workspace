function nextWednesdayIso() {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  const daysUntilWednesday = (3 - date.getDay() + 7) % 7 || 7;
  date.setDate(date.getDate() + daysUntilWednesday);
  return date.toISOString().slice(0, 10);
}

function addWednesdayTrip(event) {
  event.preventDefault();
  event.stopImmediatePropagation();

  const date = nextWednesdayIso();
  const id = uid("trip");
  const trip = { id, title: "Nová vyjížďka", date, start: "", map: "https://mapy.com/" };
  state.trips.push(trip);
  state.currentTripId = id;
  state.tripRiders[id] = state.riders.map((rider) => rider.id);

  const payer = state.riders[0];
  if (payer) {
    const receipt = {
      id: uid("receipt"),
      tripId: trip.id,
      payerId: payer.id,
      amount: 0,
      currency: "CZK",
      candidates: [],
      shareIds: [...state.tripRiders[id]],
      receiverAccount: payer.account || "",
      message: `Šlapka ${formatDate(trip.date)}`
    };
    state.receipts.push(receipt);
    state.currentReceiptId = receipt.id;
  }

  if (els.receiptPreview) els.receiptPreview.hidden = true;
  if (els.receiptFile) els.receiptFile.value = "";
  if (els.ocrStatus) els.ocrStatus.textContent = "Čekám na účtenku.";
  saveState();
  renderAll();
}

function renderRiders() {
  const goingIds = getGoingRiderIds();
  els.riderList.innerHTML = "";

  state.riders.forEach((rider) => {
    const chip = document.createElement("div");
    chip.className = "rider-chip rider-editor";
    chip.innerHTML = `
      <label class="rider-toggle">
        <input type="checkbox" ${goingIds.includes(rider.id) ? "checked" : ""} data-rider-going="${rider.id}" />
        <strong>${rider.name}</strong>
      </label>
      <label class="rider-account-field">
        <span>Účet pro QR</span>
        <input type="text" value="${rider.account || ""}" data-rider-account="${rider.id}" placeholder="1019741727/5500" />
      </label>
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

  els.riderList.querySelectorAll("[data-rider-account]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const rider = state.riders.find((item) => item.id === event.target.dataset.riderAccount);
      if (!rider) return;
      rider.account = event.target.value;

      const receipt = getCurrentReceipt();
      if (receipt?.payerId === rider.id) {
        receipt.receiverAccount = rider.account;
        els.receiverAccount.value = rider.account;
      }
      saveState();
      renderSettlements();
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
        if (receipt.payerId === state.riders[0]?.id) receipt.receiverAccount = state.riders[0]?.account || "";
      }
      saveState();
      renderAll();
    });
  });
}

function parseCzechAccount(rawAccount) {
  const account = String(rawAccount || "").replace(/\s+/g, "").toUpperCase();
  const slashMatch = account.match(/^([0-9]{1,6}-)?([0-9]{2,10})\/([0-9]{4})$/);
  if (slashMatch) {
    return {
      accountNumber: `${slashMatch[1] || ""}${slashMatch[2]}`,
      bankCode: slashMatch[3]
    };
  }

  const ibanMatch = account.match(/^CZ[0-9]{22}$/);
  if (ibanMatch) {
    const bban = account.slice(4);
    const bankCode = bban.slice(0, 4);
    const prefix = String(Number(bban.slice(4, 10)) || "");
    const number = String(Number(bban.slice(10)) || "");
    return {
      accountNumber: prefix ? `${prefix}-${number}` : number,
      bankCode
    };
  }

  return null;
}

function payliboUrl(amount) {
  const receipt = getCurrentReceipt();
  const parsed = parseCzechAccount(receipt?.receiverAccount);
  if (!receipt || !parsed) return null;

  const params = new URLSearchParams({
    compress: "false",
    size: "440",
    accountNumber: parsed.accountNumber,
    bankCode: parsed.bankCode,
    amount: cleanAmount(amount).toFixed(2),
    currency: receipt.currency || "CZK",
    message: receipt.message || "Šlapka"
  });

  return `https://api.paylibo.com/paylibo/generator/czech/image?${params.toString()}`;
}

function renderQrWithGenerator(box, value) {
  const qr = qrcode(0, "M");
  qr.addData(value);
  qr.make();
  box.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 1 });
  const svg = box.querySelector("svg");
  if (svg) {
    svg.setAttribute("aria-label", "QR platba");
    svg.setAttribute("role", "img");
  }
}

function renderQrCodes() {
  const boxes = els.settlementList.querySelectorAll("[data-qr]");
  const receipt = getCurrentReceipt();
  const shareCount = receipt?.shareIds?.length || 0;
  const perPerson = shareCount ? cleanAmount(receipt.amount / shareCount) : 0;
  const payliboImage = perPerson ? payliboUrl(perPerson) : null;

  boxes.forEach((box) => {
    const value = decodeURIComponent(box.dataset.qr || "");
    box.innerHTML = "";

    if (payliboImage) {
      const image = document.createElement("img");
      image.src = payliboImage;
      image.alt = "QR platba";
      image.loading = "lazy";
      image.addEventListener("error", () => {
        box.innerHTML = "";
        if (window.qrcode) renderQrWithGenerator(box, value);
        else box.textContent = "QR se nepodařilo načíst.";
      });
      box.append(image);
      return;
    }

    if (!parseCzechAccount(receipt?.receiverAccount)) {
      box.textContent = "Zadej účet ve tvaru 1019741727/5500.";
      return;
    }

    if (window.QRCode?.toCanvas) {
      window.QRCode.toCanvas(value, { width: 164, margin: 1, color: { dark: "#1f2720", light: "#f5efe4" } }, (error, canvas) => {
        if (error) {
          if (window.qrcode) renderQrWithGenerator(box, value);
          else box.textContent = "QR se nepodařilo vytvořit.";
          return;
        }
        box.append(canvas);
      });
      return;
    }

    if (window.qrcode) {
      renderQrWithGenerator(box, value);
      return;
    }

    box.textContent = "QR knihovna není dostupná.";
  });
}

function deleteTrip(tripId) {
  if (state.trips.length <= 1) {
    alert("Poslední vyjížďku nejde smazat. Nejdřív vytvoř novou.");
    return;
  }

  const trip = state.trips.find((item) => item.id === tripId);
  if (!trip) return;
  const receiptCount = getTripReceiptList(tripId).length;
  const suffix = receiptCount ? ` Smažou se i účtenky (${receiptCount}).` : "";
  if (!confirm(`Smazat vyjížďku „${trip.title}“?${suffix}`)) return;

  const removedIndex = state.trips.findIndex((item) => item.id === tripId);
  state.trips = state.trips.filter((item) => item.id !== tripId);
  state.receipts = state.receipts.filter((receipt) => receipt.tripId !== tripId);
  delete state.tripRiders[tripId];

  if (state.currentTripId === tripId) {
    const nextTrip = state.trips[Math.max(0, removedIndex - 1)] || state.trips[0];
    state.currentTripId = nextTrip.id;
    state.currentReceiptId = getTripReceiptList(nextTrip.id)[0]?.id || null;
  }

  if (els.receiptPreview) els.receiptPreview.hidden = true;
  if (els.receiptFile) els.receiptFile.value = "";
  if (els.ocrStatus) els.ocrStatus.textContent = "Čekám na účtenku.";
  saveState();
  renderAll();
}

renderTripList = function renderTripListWithDelete() {
  els.tripList.innerHTML = "";
  state.trips.forEach((trip) => {
    const receipts = getTripReceiptList(trip.id);
    const card = document.createElement("article");
    card.className = `trip-card trip-card-shell ${trip.id === state.currentTripId ? "active" : ""}`;
    card.innerHTML = `
      <button class="trip-card-main" type="button" data-open-trip="${trip.id}" aria-label="Otevřít vyjížďku ${trip.title}">
        <strong>${trip.title}</strong>
        <span>${formatDate(trip.date)}</span>
        <span>${trip.start || "Start není vyplněný"}</span>
        <div class="trip-meta">
          <span>${state.tripRiders[trip.id]?.length || 0} jezdců</span>
          <span>${receipts.length} účtenek</span>
        </div>
      </button>
      <button class="delete-trip" type="button" data-delete-trip="${trip.id}" title="Smazat vyjížďku" aria-label="Smazat vyjížďku ${trip.title}">Smazat</button>
    `;
    card.querySelector("[data-open-trip]").addEventListener("click", () => {
      state.currentTripId = trip.id;
      state.currentReceiptId = getTripReceiptList(trip.id)[0]?.id || null;
      els.receiptPreview.hidden = true;
      els.receiptFile.value = "";
      els.ocrStatus.textContent = "Čekám na účtenku.";
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      renderAll();
    });
    card.querySelector("[data-delete-trip]").addEventListener("click", () => deleteTrip(trip.id));
    els.tripList.append(card);
  });
};

const addTripButton = document.querySelector("#add-trip");
if (addTripButton) {
  addTripButton.addEventListener("click", addWednesdayTrip, true);
}

setTimeout(renderAll, 0);
setTimeout(renderQrCodes, 900);
