import { SEARCH_HISTORY_KEEP, type ActivityEvent, type ActivityKind, type Collection, type ProgressRecord, type Storage, type StoredItem } from "./types";

// IndexedDB adapter for the web build. Mirrors the SQLite schema:
//   settings  (keyPath "key")            ↔ settings table
//   activity  (autoIncrement, idx createdAt) ↔ activity table
const DB_NAME = "codeverse-user";
// v5 = v3 schema; bumps re-run the idempotent upgrade below, which repairs a database that
// reached a version without all of its stores (happened during development via hot reload).
const DB_VERSION = 6; // v6: generic "items" store (notes, snippets, flashcards, projects, roadmaps)

/** Every store and index the app needs. Upgrades create whatever is missing (idempotent). */
const SCHEMA: { name: string; options: IDBObjectStoreParameters; indexes?: string[] }[] = [
  { name: "items", options: { keyPath: ["collection", "id"] }, indexes: ["collection"] },
  { name: "settings", options: { keyPath: "key" } },
  { name: "activity", options: { keyPath: "id", autoIncrement: true }, indexes: ["createdAt"] },
  { name: "progress", options: { keyPath: "lessonId" } },
  // keyed by query so a repeated search just updates its timestamp
  { name: "searches", options: { keyPath: "query" }, indexes: ["createdAt"] },
  { name: "favorites", options: { keyPath: "key" } },
];

function req<T>(r: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(DB_NAME, DB_VERSION);
    r.onupgradeneeded = () => {
      const db = r.result;
      const tx = r.transaction!;
      // Additive, idempotent migration: existing data is never touched.
      for (const s of SCHEMA) {
        const store = db.objectStoreNames.contains(s.name) ? tx.objectStore(s.name) : db.createObjectStore(s.name, s.options);
        for (const idx of s.indexes ?? []) if (!store.indexNames.contains(idx)) store.createIndex(idx, idx);
      }
    };
    r.onsuccess = () => {
      const db = r.result;
      // Let a newer version (another tab after an update) upgrade instead of being blocked.
      db.onversionchange = () => db.close();
      resolve(db);
    };
    r.onerror = () => reject(r.error);
    r.onblocked = () => reject(new Error("IndexedDB upgrade blocked by another tab"));
  });
}

export async function createIndexedDbStorage(): Promise<Storage> {
  const db = await open();
  let persistent = false;
  try {
    persistent = (await navigator.storage?.persisted?.()) ?? false;
  } catch {
    /* not supported */
  }

  return {
    info: { backend: "indexeddb", schemaVersion: DB_VERSION, persistent },
    async getSettings() {
      const tx = db.transaction("settings", "readonly");
      const rows = await req(tx.objectStore("settings").getAll() as IDBRequest<{ key: string; value: unknown }[]>);
      return Object.fromEntries(rows.map((r) => [r.key, r.value]));
    },
    async putSettings(values) {
      const tx = db.transaction("settings", "readwrite");
      const store = tx.objectStore("settings");
      const updatedAt = Date.now();
      for (const [key, value] of Object.entries(values)) store.put({ key, value, updatedAt });
      await done(tx);
    },
    async clearSettings() {
      const tx = db.transaction("settings", "readwrite");
      tx.objectStore("settings").clear();
      await done(tx);
    },
    async addActivity(kind: ActivityKind, ref = null) {
      const tx = db.transaction("activity", "readwrite");
      tx.objectStore("activity").add({ kind, ref, createdAt: Date.now() });
      await done(tx);
    },
    async recentActivity(limit) {
      const tx = db.transaction("activity", "readonly");
      const idx = tx.objectStore("activity").index("createdAt");
      const out: ActivityEvent[] = [];
      await new Promise<void>((resolve, reject) => {
        const c = idx.openCursor(null, "prev");
        c.onsuccess = () => {
          const cur = c.result;
          if (!cur || out.length >= limit) return resolve();
          out.push(cur.value as ActivityEvent);
          cur.continue();
        };
        c.onerror = () => reject(c.error);
      });
      return out;
    },
    async countActivitySince(since) {
      const tx = db.transaction("activity", "readonly");
      const rows = await req(
        tx.objectStore("activity").index("createdAt").getAll(IDBKeyRange.lowerBound(since)) as IDBRequest<ActivityEvent[]>,
      );
      const out: Record<string, number> = {};
      for (const e of rows) out[e.kind] = (out[e.kind] ?? 0) + 1;
      return out;
    },
    async clearActivity() {
      const tx = db.transaction("activity", "readwrite");
      tx.objectStore("activity").clear();
      await done(tx);
    },
    async pruneActivity(keep) {
      const tx = db.transaction("activity", "readwrite");
      const store = tx.objectStore("activity");
      const count = await req(store.count());
      let toDelete = count - keep;
      if (toDelete <= 0) return;
      await new Promise<void>((resolve, reject) => {
        const c = store.index("createdAt").openCursor();
        c.onsuccess = () => {
          const cur = c.result;
          if (!cur || toDelete <= 0) return resolve();
          cur.delete();
          toDelete--;
          cur.continue();
        };
        c.onerror = () => reject(c.error);
      });
      await done(tx);
    },
    async getAllProgress() {
      const tx = db.transaction("progress", "readonly");
      return req(tx.objectStore("progress").getAll() as IDBRequest<ProgressRecord[]>);
    },
    async putProgress(rec) {
      const tx = db.transaction("progress", "readwrite");
      tx.objectStore("progress").put(rec);
      await done(tx);
    },
    async clearProgress() {
      const tx = db.transaction("progress", "readwrite");
      tx.objectStore("progress").clear();
      await done(tx);
    },
    async addSearch(query) {
      const tx = db.transaction("searches", "readwrite");
      const store = tx.objectStore("searches");
      store.put({ query, createdAt: Date.now() });
      // keep only the newest SEARCH_HISTORY_KEEP entries
      let seen = 0;
      const c = store.index("createdAt").openCursor(null, "prev");
      c.onsuccess = () => {
        const cur = c.result;
        if (!cur) return;
        if (++seen > SEARCH_HISTORY_KEEP) cur.delete();
        cur.continue();
      };
      await done(tx);
    },
    async recentSearches(limit) {
      const tx = db.transaction("searches", "readonly");
      const out: string[] = [];
      await new Promise<void>((resolve, reject) => {
        const c = tx.objectStore("searches").index("createdAt").openCursor(null, "prev");
        c.onsuccess = () => {
          const cur = c.result;
          if (!cur || out.length >= limit) return resolve();
          out.push((cur.value as { query: string }).query);
          cur.continue();
        };
        c.onerror = () => reject(c.error);
      });
      return out;
    },
    async clearSearches() {
      const tx = db.transaction("searches", "readwrite");
      tx.objectStore("searches").clear();
      await done(tx);
    },
    async getFavorites() {
      const tx = db.transaction("favorites", "readonly");
      const rows = await req(tx.objectStore("favorites").getAll() as IDBRequest<{ key: string }[]>);
      return rows.map((r) => r.key);
    },
    async listItems<T extends StoredItem>(collection: Collection) {
      const tx = db.transaction("items", "readonly");
      const rows = await req(tx.objectStore("items").index("collection").getAll(collection) as IDBRequest<{ data: T }[]>);
      return rows.map((r) => r.data);
    },
    async putItem(collection, item) {
      const tx = db.transaction("items", "readwrite");
      tx.objectStore("items").put({ collection, id: item.id, data: item, updatedAt: item.updatedAt });
      await done(tx);
    },
    async deleteItem(collection, id) {
      const tx = db.transaction("items", "readwrite");
      tx.objectStore("items").delete([collection, id]);
      await done(tx);
    },
    async clearCollection(collection) {
      const tx = db.transaction("items", "readwrite");
      const store = tx.objectStore("items");
      const keys = await req(store.index("collection").getAllKeys(collection));
      for (const k of keys) store.delete(k);
      await done(tx);
    },
    async setFavorite(key, on) {
      const tx = db.transaction("favorites", "readwrite");
      if (on) tx.objectStore("favorites").put({ key, createdAt: Date.now() });
      else tx.objectStore("favorites").delete(key);
      await done(tx);
    },
  };
}
