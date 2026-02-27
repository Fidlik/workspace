PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('issue', 'movie', 'tv')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'triaged', 'in_progress', 'done', 'closed', 'rejected')),
  year INTEGER,
  language TEXT,
  genre_json TEXT,
  ip_hash TEXT NOT NULL,
  ua_hash TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ticket_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('created', 'status_changed', 'admin_note')),
  event_payload TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY(ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  window_start TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_tickets_status_created ON tickets(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_type_created ON tickets(type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ticket_events_ticket_created ON ticket_events(ticket_id, created_at DESC);