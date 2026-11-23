import { SEARCH_HISTORY_KEEP, type ActivityEvent, type ActivityKind, type Collection, type ProgressRecord, type Storage, type StoredItem } from "./types";

// SQLite adapter for the Tauri desktop shell (tauri-plugin-sql).
// The schema is created by Rust-side migrations in src-tauri/migrations/ before the
// frontend connects, so this file only issues parameterised queries.

interface SqlDb {
  select<T>(query: string, params?: unknown[]): Promise<T>;
  execute(query: string, params?: unknown[]): Promise<unknown>;
}

export async function createSqliteStorage(): Promise<Storage> {
  const { default: Database } = await import("@tauri-apps/plugin-sql");
  const db: SqlDb = await Database.load("sqlite:user.db");
  const [{ v }] = await db.select<{ v: number }[]>("SELECT COALESCE(MAX(version), 0) AS v FROM _sqlx_migrations");

  return {
    info: { backend: "sqlite", schemaVersion: v, persistent: true },
    async getSettings() {
      const rows = await db.select<{ key: string; value: string }[]>("SELECT key, value FROM settings");
      const out: Record<string, unknown> = {};
      for (const r of rows) {
        try {
          out[r.key] = JSON.parse(r.value);
        } catch {
          /* corrupt row: ignored, defaults apply */
        }
      }
      return out;
    },
    async putSettings(values) {
      const now = Date.now();
      for (const [key, value] of Object.entries(values)) {
        await db.execute(
          "INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, $3) " +
            "ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at",
          [key, JSON.stringify(value), now],
        );
      }
    },
    async clearSettings() {
      await db.execute("DELETE FROM settings");
    },
    async addActivity(kind: ActivityKind, ref = null) {
      await db.execute("INSERT INTO activity (kind, ref, created_at) VALUES ($1, $2, $3)", [kind, ref, Date.now()]);
    },
    async recentActivity(limit) {
      return db.select<ActivityEvent[]>(
        "SELECT id, kind, ref, created_at AS createdAt FROM activity ORDER BY created_at DESC, id DESC LIMIT $1",
        [limit],
      );
    },
    async countActivitySince(since) {
      const rows = await db.select<{ kind: string; n: number }[]>(
        "SELECT kind, COUNT(*) AS n FROM activity WHERE created_at >= $1 GROUP BY kind",
        [since],
      );
      return Object.fromEntries(rows.map((r) => [r.kind, r.n]));
    },
    async clearActivity() {
      await db.execute("DELETE FROM activity");
    },
    async pruneActivity(keep) {
      await db.execute(
        "DELETE FROM activity WHERE id NOT IN (SELECT id FROM activity ORDER BY created_at DESC, id DESC LIMIT $1)",
        [keep],
      );
    },
    async getAllProgress() {
      return db.select<ProgressRecord[]>(
        "SELECT lesson_id AS lessonId, state, best_score AS bestScore, attempts, updated_at AS updatedAt FROM progress",
      );
    },
    async putProgress(r) {
      await db.execute(
        "INSERT INTO progress (lesson_id, state, best_score, attempts, updated_at) VALUES ($1, $2, $3, $4, $5) " +
          "ON CONFLICT(lesson_id) DO UPDATE SET state = excluded.state, best_score = excluded.best_score, " +
          "attempts = excluded.attempts, updated_at = excluded.updated_at",
        [r.lessonId, r.state, r.bestScore, r.attempts, r.updatedAt],
      );
    },
    async clearProgress() {
      await db.execute("DELETE FROM progress");
    },
    async addSearch(query) {
      await db.execute(
        "INSERT INTO search_history (query, created_at) VALUES ($1, $2) " +
          "ON CONFLICT(query) DO UPDATE SET created_at = excluded.created_at",
        [query, Date.now()],
      );
      await db.execute(
        "DELETE FROM search_history WHERE query NOT IN (SELECT query FROM search_history ORDER BY created_at DESC LIMIT $1)",
        [SEARCH_HISTORY_KEEP],
      );
    },
    async recentSearches(limit) {
      const rows = await db.select<{ query: string }[]>("SELECT query FROM search_history ORDER BY created_at DESC LIMIT $1", [limit]);
      return rows.map((r) => r.query);
    },
    async clearSearches() {
      await db.execute("DELETE FROM search_history");
    },
    async getFavorites() {
      const rows = await db.select<{ key: string }[]>("SELECT key FROM favorites ORDER BY created_at DESC");
      return rows.map((r) => r.key);
    },
    async listItems<T extends StoredItem>(collection: Collection) {
      const rows = await db.select<{ data: string }[]>("SELECT data FROM items WHERE collection = $1", [collection]);
      const out: T[] = [];
      for (const r of rows) {
        try {
          out.push(JSON.parse(r.data) as T);
        } catch {
          /* skip a corrupt row instead of failing the whole list */
        }
      }
      return out;
    },
    async putItem(collection, item) {
      await db.execute(
        "INSERT INTO items (collection, id, data, updated_at) VALUES ($1, $2, $3, $4) " +
          "ON CONFLICT(collection, id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at",
        [collection, item.id, JSON.stringify(item), item.updatedAt],
      );
    },
    async deleteItem(collection, id) {
      await db.execute("DELETE FROM items WHERE collection = $1 AND id = $2", [collection, id]);
    },
    async clearCollection(collection) {
      await db.execute("DELETE FROM items WHERE collection = $1", [collection]);
    },
    async setFavorite(key, on) {
      if (on) await db.execute("INSERT OR REPLACE INTO favorites (key, created_at) VALUES ($1, $2)", [key, Date.now()]);
      else await db.execute("DELETE FROM favorites WHERE key = $1", [key]);
    },
  };
}
