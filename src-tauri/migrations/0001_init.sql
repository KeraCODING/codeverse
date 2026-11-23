-- user.db v1: personal data only. Educational content lives in a separate content.db.
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY NOT NULL,
  value      TEXT NOT NULL,          -- JSON-encoded, validated by the app on read
  updated_at INTEGER NOT NULL        -- epoch ms
);

CREATE TABLE IF NOT EXISTS activity (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  kind       TEXT NOT NULL,
  ref        TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_activity_created_at ON activity (created_at);
