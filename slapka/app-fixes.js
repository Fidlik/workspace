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
  boxes.forEach((box) => {
    const value = decodeURIComponent(box.dataset.qr);
    box.innerHTML = "";

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

const addTripButton = document.querySelector("#add-trip");
if (addTripButton) {
  addTripButton.addEventListener("click", addWednesdayTrip, true);
}

setTimeout(renderQrCodes, 900);
