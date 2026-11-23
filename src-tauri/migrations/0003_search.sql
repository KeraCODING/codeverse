-- user.db v3: search history (local only, can be cleared) and favourite search results.
CREATE TABLE IF NOT EXISTS search_history (
  query      TEXT PRIMARY KEY NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history (created_at);

CREATE TABLE IF NOT EXISTS favorites (
  key        TEXT PRIMARY KEY NOT NULL,  -- e.g. "term:js-async", "lesson:python-loops"
  created_at INTEGER NOT NULL
);
