-- user.db v2: lesson progress. Completion requires passing the knowledge check.
CREATE TABLE IF NOT EXISTS progress (
  lesson_id  TEXT PRIMARY KEY NOT NULL,
  state      TEXT NOT NULL CHECK (state IN ('started', 'attempted', 'completed')),
  best_score INTEGER CHECK (best_score BETWEEN 0 AND 100),
  attempts   INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);
