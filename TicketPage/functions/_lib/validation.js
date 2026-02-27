import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, TICKET_STATUSES, TICKET_TYPES } from "./constants.js";

function asTrimmedString(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

export function validateCreateTicket(input) {
  if (!input || typeof input !== "object") return "Invalid JSON body.";

  const type = asTrimmedString(input.type);
  const title = asTrimmedString(input.title);
  const description = asTrimmedString(input.description);
  const language = asTrimmedString(input.language);
  const turnstileToken = asTrimmedString(input.turnstileToken);

  if (!TICKET_TYPES.has(type)) return "Invalid ticket type.";
  if (title.length < 3 || title.length > 120) return "Title must be 3-120 characters.";
  if (description.length > 2000) return "Description must be <= 2000 characters.";

  if (input.year !== undefined && input.year !== null && input.year !== "") {
    const year = Number(input.year);
    const maxYear = new Date().getUTCFullYear() + 1;
    if (!Number.isInteger(year) || year < 1888 || year > maxYear) {
      return "Year must be between 1888 and next calendar year.";
    }
  }

  if (language.length > 40) return "Language must be <= 40 characters.";

  if (input.genre !== undefined && input.genre !== null) {
    if (!Array.isArray(input.genre)) return "Genre must be an array of strings.";
    if (input.genre.length > 8) return "No more than 8 genres are allowed.";
    for (const item of input.genre) {
      if (typeof item !== "string" || item.trim().length < 2 || item.trim().length > 30) {
        return "Each genre must be 2-30 characters.";
      }
    }
  }

  if (!turnstileToken) return "Missing Turnstile token.";
  return null;
}

export function parseListQuery(url) {
  const type = url.searchParams.get("type")?.trim() || "";
  const status = url.searchParams.get("status")?.trim() || "";
  const q = url.searchParams.get("q")?.trim() || "";

  const page = Math.max(1, Number.parseInt(url.searchParams.get("page") || "1", 10) || 1);
  const requestedPageSize = Number.parseInt(url.searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE;
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, requestedPageSize));

  if (type && !TICKET_TYPES.has(type)) return { error: "Invalid type filter." };
  if (status && !TICKET_STATUSES.has(status)) return { error: "Invalid status filter." };

  return { type, status, q, page, pageSize };
}

export function validateAdminPatch(input) {
  if (!input || typeof input !== "object") return "Invalid JSON body.";

  const status = typeof input.status === "string" ? input.status.trim() : "";
  const adminNote = typeof input.adminNote === "string" ? input.adminNote.trim() : "";

  if (!status || !TICKET_STATUSES.has(status)) return "Invalid status.";
  if (adminNote.length > 1000) return "Admin note must be <= 1000 characters.";

  return null;
}