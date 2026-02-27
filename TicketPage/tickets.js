let page = 1;
let totalPages = 1;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function ticketCard(ticket) {
  return `<article class="ticket">
    <h3>${escapeHtml(ticket.title)}</h3>
    <small>${escapeHtml(ticket.type)} | ${escapeHtml(ticket.status)} | ${new Date(ticket.createdAt).toLocaleString()}</small>
    <p>${escapeHtml(ticket.description || "")}</p>
  </article>`;
}

async function loadTickets() {
  const filters = new FormData(document.querySelector("#filters"));
  const params = new URLSearchParams({ page: String(page), pageSize: "20" });

  const q = String(filters.get("q") || "").trim();
  const type = String(filters.get("type") || "").trim();
  const status = String(filters.get("status") || "").trim();

  if (q) params.set("q", q);
  if (type) params.set("type", type);
  if (status) params.set("status", status);

  const res = await fetch(`/api/tickets?${params.toString()}`);
  const data = await res.json();

  const list = document.querySelector("#ticket-list");
  if (!res.ok) {
    list.innerHTML = `<p>${escapeHtml(data.error || "Failed to load.")}</p>`;
    return;
  }

  const tickets = Array.isArray(data.tickets) ? data.tickets : [];
  totalPages = data.pagination?.totalPages || 1;

  list.innerHTML = tickets.length ? tickets.map(ticketCard).join("\n") : "<p>No tickets match this filter.</p>";
  document.querySelector("#pager-info").textContent = `Page ${page} / ${totalPages}`;

  document.querySelector("#prev").disabled = page <= 1;
  document.querySelector("#next").disabled = page >= totalPages;
}

window.addEventListener("load", () => {
  document.querySelector("#filters")?.addEventListener("submit", async event => {
    event.preventDefault();
    page = 1;
    await loadTickets();
  });

  document.querySelector("#prev")?.addEventListener("click", async () => {
    if (page <= 1) return;
    page -= 1;
    await loadTickets();
  });

  document.querySelector("#next")?.addEventListener("click", async () => {
    if (page >= totalPages) return;
    page += 1;
    await loadTickets();
  });

  loadTickets();
});