const statuses = ["new", "triaged", "in_progress", "done", "closed", "rejected"];
const COMPLETED_STATUSES = new Set(["done", "closed", "rejected"]);
let cachedTickets = [];

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

function apiError(data, fallback) {
  if (data?.error === "Unauthorized") return "Nemate opravneni. Prihlaste se jako admin.";
  return data?.error || fallback;
}

async function readJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
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
    <div class="admin-actions">
      <button data-save-id="${ticket.id}" type="button">Ulozit</button>
      <button data-delete-id="${ticket.id}" class="danger-btn" type="button">Smazat</button>
    </div>
    <p data-msg-id="${ticket.id}"></p>
  </article>`;
}

async function loadStats() {
  const res = await fetch("/api/admin/stats");
  const data = await readJsonSafe(res);
  const stats = document.querySelector("#stats");

  if (!res.ok) {
    stats.textContent = apiError(data, "Nepodarilo se nacist statistiky.");
    return false;
  }

  stats.textContent = JSON.stringify(data, null, 2);
  return true;
}

function filteredTickets() {
  const hideCompleted = document.querySelector("#hide-completed")?.checked;
  if (!hideCompleted) return cachedTickets;
  return cachedTickets.filter(ticket => !COMPLETED_STATUSES.has(ticket.status));
}

function renderQueue() {
  const list = document.querySelector("#admin-list");
  const tickets = filteredTickets();

  if (!tickets.length) {
    list.innerHTML = "<p>Ve fronte nejsou zadne viditelne pozadavky.</p>";
    return;
  }

  list.innerHTML = tickets.map(card).join("\n");

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

      const patchData = await readJsonSafe(patchRes);
      msg.textContent = patchRes.ok ? "Ulozeno" : apiError(patchData, "Chyba");

      if (patchRes.ok) {
        await loadQueue();
        await loadStats();
      }
    });
  }

  for (const button of document.querySelectorAll("[data-delete-id]")) {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-delete-id");
      const msg = document.querySelector(`[data-msg-id='${id}']`);

      if (!confirm("Opravdu chcete tento pozadavek smazat?")) {
        return;
      }

      const delRes = await fetch(`/api/admin/tickets/${id}`, {
        method: "DELETE"
      });

      const delData = await readJsonSafe(delRes);

      if (!delRes.ok) {
        msg.textContent = apiError(delData, "Mazani se nezdarilo.");
        return;
      }

      msg.textContent = "Smazano";
      await loadQueue();
      await loadStats();
    });
  }
}

async function loadQueue() {
  const res = await fetch("/api/tickets?page=1&pageSize=50");
  const data = await readJsonSafe(res);
  const list = document.querySelector("#admin-list");

  if (!res.ok) {
    list.innerHTML = `<p>${escapeHtml(apiError(data, "Nepodarilo se nacist frontu"))}</p>`;
    return;
  }

  cachedTickets = data.tickets || [];
  renderQueue();
}

window.addEventListener("load", async () => {
  const hideCompleted = document.querySelector("#hide-completed");
  hideCompleted?.addEventListener("change", () => {
    renderQueue();
  });

  await loadStats();
  await loadQueue();
});
