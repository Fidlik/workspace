export function nowIso() {
  return new Date().toISOString();
}

export function createId() {
  return crypto.randomUUID();
}

export function safeJsonParse(value, fallback) {
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function toPublicTicketRow(row) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    status: row.status,
    year: row.year,
    language: row.language,
    genre: safeJsonParse(row.genre_json, []),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}