-- user.db v4: personal data collections (notes, snippets, flashcards, projects, roadmaps).
-- Each row stores one validated JSON document; the app owns its shape.
CREATE TABLE IF NOT EXISTS items (
  collection TEXT NOT NULL,
  id         TEXT NOT NULL,
  data       TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (collection, id)
);
CREATE INDEX IF NOT EXISTS idx_items_collection ON items (collection, updated_at);
