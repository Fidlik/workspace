export const TICKET_TYPES = new Set(["issue", "movie", "tv"]);
export const TICKET_STATUSES = new Set([
  "new",
  "triaged",
  "in_progress",
  "done",
  "closed",
  "rejected"
]);

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;

export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_SECONDS = 3600;