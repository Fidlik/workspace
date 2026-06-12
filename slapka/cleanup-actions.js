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
renderReceipt = function renderReceiptWithGoingShortcut() {
  renderReceiptBase();

  const receipt = getCurrentReceipt();
  if (!receipt) return;

  const shortcut = document.createElement("button");
  shortcut.type = "button";
  shortcut.className = "share-all-button";
  shortcut.textContent = "Všichni co jeli";
  shortcut.addEventListener("click", () => {
    receipt.shareIds = [...getGoingRiderIds()];
    saveState();
    renderAll();
  });
  els.shareRiders.prepend(shortcut);
};

setTimeout(renderAll, 0);
