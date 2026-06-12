function resetReceiptUploadUi() {
  if (els.receiptPreview) els.receiptPreview.hidden = true;
  if (els.receiptFile) els.receiptFile.value = "";
  if (els.ocrStatus) els.ocrStatus.textContent = "Čekám na účtenku.";
}

function deleteTripFromCorner(tripId) {
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

  resetReceiptUploadUi();
  saveState();
  renderAll();
}

function deleteReceipt(receiptId) {
  const receipt = state.receipts.find((item) => item.id === receiptId);
  if (!receipt) return;

  const tripReceipts = getTripReceiptList(receipt.tripId);
  const index = tripReceipts.findIndex((item) => item.id === receiptId);
  if (!confirm(`Smazat účtenku ${index + 1}?`)) return;

  state.receipts = state.receipts.filter((item) => item.id !== receiptId);
  if (state.currentReceiptId === receiptId) {
    const remaining = getTripReceiptList(receipt.tripId);
    state.currentReceiptId = remaining[Math.max(0, index - 1)]?.id || remaining[0]?.id || null;
  }

  resetReceiptUploadUi();
  saveState();
  renderAll();
}

function setRiderAccount(riderId) {
  const rider = state.riders.find((item) => item.id === riderId);
  if (!rider) return;

  const current = rider.account || "";
  const value = prompt(`Účet pro QR platby pro ${rider.name}\n\nFormát: 1019741727/5500 nebo český IBAN.\nPrázdné pole účet smaže.`, current);
  if (value === null) return;

  const cleaned = value.trim();
  if (cleaned && !parseCzechAccount(cleaned)) {
    alert("Účet není ve správném formátu. Použij například 1019741727/5500 nebo český IBAN.");
    return;
  }

  rider.account = cleaned;
  const receipt = getCurrentReceipt();
  if (receipt?.payerId === rider.id) {
    receipt.receiverAccount = cleaned;
    if (els.receiverAccount) els.receiverAccount.value = cleaned;
  }

  saveState();
  renderAll();
}

function toggleReceiptShare(riderId) {
  const receipt = getCurrentReceipt();
  if (!receipt) return;

  const ids = new Set(receipt.shareIds || []);
  if (ids.has(riderId)) ids.delete(riderId);
  else ids.add(riderId);
  receipt.shareIds = [...ids];
  saveState();
  renderAll();
}

function renderShareButtons(receipt) {
  const goingIds = getGoingRiderIds();
  els.shareRiders.innerHTML = "";

  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.className = "share-toggle share-all-button selected";
  allButton.innerHTML = `<span class="share-check">✓</span><span>Všichni co jeli</span>`;
  allButton.addEventListener("click", () => {
    receipt.shareIds = [...goingIds];
    saveState();
    renderAll();
  });
  els.shareRiders.append(allButton);

  state.riders.forEach((rider) => {
    const selected = receipt.shareIds.includes(rider.id);
    const going = goingIds.includes(rider.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `share-toggle ${selected ? "selected" : ""} ${going ? "going" : "not-going"}`;
    button.setAttribute("aria-pressed", selected ? "true" : "false");
    button.dataset.shareToggle = rider.id;
    button.innerHTML = `
      <span class="share-check" aria-hidden="true">${selected ? "✓" : ""}</span>
      <span>${rider.name}${going ? "" : " · nejede"}</span>
    `;
    button.addEventListener("click", () => toggleReceiptShare(rider.id));
    els.shareRiders.append(button);
  });
}

renderTripList = function renderTripListWithCornerDelete() {
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
      <button class="corner-delete" type="button" data-delete-trip="${trip.id}" title="Smazat vyjížďku" aria-label="Smazat vyjížďku ${trip.title}">×</button>
    `;

    card.querySelector("[data-open-trip]").addEventListener("click", () => {
      state.currentTripId = trip.id;
      state.currentReceiptId = getTripReceiptList(trip.id)[0]?.id || null;
      resetReceiptUploadUi();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      renderAll();
    });
    card.querySelector("[data-delete-trip]").addEventListener("click", () => deleteTripFromCorner(trip.id));
    els.tripList.append(card);
  });
};

renderRiders = function renderRidersWithAccountButtons() {
  const goingIds = getGoingRiderIds();
  els.riderList.innerHTML = "";

  state.riders.forEach((rider) => {
    const chip = document.createElement("div");
    chip.className = "rider-chip rider-editor rider-compact-editor";
    const accountText = rider.account ? rider.account : "Účet pro QR";
    chip.innerHTML = `
      <label class="rider-toggle">
        <input type="checkbox" ${goingIds.includes(rider.id) ? "checked" : ""} data-rider-going="${rider.id}" />
        <strong>${rider.name}</strong>
      </label>
      <button class="rider-account-button ${rider.account ? "has-account" : ""}" type="button" data-rider-account-button="${rider.id}" title="Upravit účet pro QR" aria-label="Upravit účet pro QR pro ${rider.name}">
        <span class="qr-mini" aria-hidden="true"></span>
        <span>${accountText}</span>
      </button>
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

  els.riderList.querySelectorAll("[data-rider-account-button]").forEach((button) => {
    button.addEventListener("click", () => setRiderAccount(button.dataset.riderAccountButton));
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
};

renderReceiptList = function renderReceiptListWithDelete() {
  const receipts = getTripReceiptList();
  els.receiptList.innerHTML = "";
  if (!receipts.length) {
    els.receiptList.innerHTML = `<span class="empty-note">Tahle vyjížďka zatím nemá žádnou účtenku.</span>`;
    return;
  }

  receipts.forEach((receipt, index) => {
    const payer = state.riders.find((rider) => rider.id === receipt.payerId);
    const card = document.createElement("article");
    card.className = `receipt-tab receipt-tab-shell ${receipt.id === state.currentReceiptId ? "active" : ""}`;
    card.innerHTML = `
      <button class="receipt-tab-main" type="button" data-open-receipt="${receipt.id}" aria-label="Otevřít účtenku ${index + 1}">
        <strong>Účtenka ${index + 1}</strong>
        <span>${money(receipt.amount, receipt.currency)} · ${payer?.name || "bez plátce"}</span>
      </button>
      <button class="corner-delete" type="button" data-delete-receipt="${receipt.id}" title="Smazat účtenku" aria-label="Smazat účtenku ${index + 1}">×</button>
    `;

    card.querySelector("[data-open-receipt]").addEventListener("click", () => {
      state.currentReceiptId = receipt.id;
      resetReceiptUploadUi();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      renderAll();
    });
    card.querySelector("[data-delete-receipt]").addEventListener("click", () => deleteReceipt(receipt.id));
    els.receiptList.append(card);
  });
};

const renderReceiptBase = renderReceipt;
renderReceipt = function renderReceiptWithReliableShares() {
  renderReceiptBase();

  const receipt = getCurrentReceipt();
  if (!receipt) return;
  renderShareButtons(receipt);
};

setTimeout(renderAll, 0);
