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

function ticketCard(ticket) {
  return `<article class="ticket">
    <h3>${escapeHtml(ticket.title)}</h3>
    <small>${escapeHtml(labelType(ticket.type))} | ${escapeHtml(labelStatus(ticket.status))} | ${new Date(ticket.createdAt).toLocaleString("cs-CZ")}</small>
    <p>${escapeHtml(ticket.description || "")}</p>
  </article>`;
}

async function loadRecent() {
  const res = await fetch("/api/tickets?status=new&page=1&pageSize=10");
  const data = await res.json();
  const container = document.querySelector("#recent-list");

  if (!Array.isArray(data.tickets) || data.tickets.length === 0) {
    container.innerHTML = "<p>Zatim zadne otevrene pozadavky.</p>";
    return;
  }

  container.innerHTML = data.tickets.map(ticketCard).join("\n");
}

function setupTurnstile() {
  const siteKey = window.APP_CONFIG?.turnstileSiteKey;
  const widget = document.querySelector("#turnstile-widget");
  if (!siteKey || !widget || typeof turnstile === "undefined") return;

  turnstile.render(widget, {
    sitekey: siteKey,
    theme: "auto"
  });
}

async function submitForm(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const message = document.querySelector("#form-message");
  const formData = new FormData(form);

  const token = typeof turnstile !== "undefined" ? turnstile.getResponse() : "";
  if (!token) {
    message.textContent = "Dokoncete prosim overeni Turnstile.";
    return;
  }

  const payload = {
    type: String(formData.get("type") || "").trim(),
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    year: String(formData.get("year") || "").trim(),
    language: String(formData.get("language") || "").trim(),
    turnstileToken: token
  };

  if (!payload.year) delete payload.year;
  if (!payload.language) delete payload.language;

  const res = await fetch("/api/tickets", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    message.textContent = data.error || "Odeslani se nezdarilo.";
    return;
  }

  form.reset();
  if (typeof turnstile !== "undefined") turnstile.reset();
  message.textContent = `Odeslano: ${data.id}`;
  await loadRecent();
}

window.addEventListener("load", () => {
  setupTurnstile();
  loadRecent().catch(() => {
    const container = document.querySelector("#recent-list");
    container.innerHTML = "<p>Nepodarilo se nacist posledni pozadavky.</p>";
  });

  document.querySelector("#ticket-form")?.addEventListener("submit", submitForm);
});