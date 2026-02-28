const statuses = ["new", "triaged", "in_progress", "done", "closed", "rejected"];

const TYPE_LABELS = {
  issue: "problem",
  movie: "film",
  tv: "serial"
};

const STATUS_LABELS = {
  new: "novy",
  triaged: "roztrideno",
  in_progress: "resi se",
  done: "hotovo",
  closed: "uzavreno",
  rejected: "zamitnuto"
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function labelType(type) {
  return TYPE_LABELS[type] || type;
}

function labelStatus(status) {
  return STATUS_LABELS[status] || status;
}

function statusSelect(ticketId, current) {
  const options = statuses
    .map(s => `<option value="${s}" ${s === current ? "selected" : ""}>${escapeHtml(labelStatus(s))}</option>`)
    .join("");
  return `<select data-status-id="${ticketId}">${options}</select>`;
}

function card(ticket) {
  return `<article class="ticket" data-ticket-id="${ticket.id}">
    <h3>${escapeHtml(ticket.title)}</h3>
    <small>${escapeHtml(labelType(ticket.type))} | ${escapeHtml(labelStatus(ticket.status))} | ${new Date(ticket.createdAt).toLocaleString("cs-CZ")}</small>
    <p>${escapeHtml(ticket.description || "")}</p>
    ${statusSelect(ticket.id, ticket.status)}
    <textarea data-note-id="${ticket.id}" placeholder="Poznamka spravce (volitelne)" maxlength="1000"></textarea>
    <button data-save-id="${ticket.id}" type="button">Ulozit</button>
    <p data-msg-id="${ticket.id}"></p>
  </article>`;
}

async function loadStats() {
  const res = await fetch("/api/admin/stats");
  const data = await res.json();
  document.querySelector("#stats").textContent = JSON.stringify(data, null, 2);
}

async function loadQueue() {
  const res = await fetch("/api/tickets?page=1&pageSize=50");
  const data = await res.json();
  const list = document.querySelector("#admin-list");

  if (!res.ok) {
    list.innerHTML = `<p>${escapeHtml(data.error || "Nepodarilo se nacist frontu")}</p>`;
    return;
  }

  list.innerHTML = (data.tickets || []).map(card).join("\n");

  for (const button of document.querySelectorAll("[data-save-id]")) {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-save-id");
      const status = document.querySelector(`[data-status-id='${id}']`)?.value;
      const adminNote = document.querySelector(`[data-note-id='${id}']`)?.value || "";
      const msg = document.querySelector(`[data-msg-id='${id}']`);

      const patchRes = await fetch(`/api/admin/tickets/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status, adminNote })
      });

      const patchData = await patchRes.json();
      msg.textContent = patchRes.ok ? "Ulozeno" : (patchData.error || "Chyba");

      if (patchRes.ok) {
        await loadStats();
      }
    });
  }
}

window.addEventListener("load", async () => {
  await loadStats();
  await loadQueue();
});