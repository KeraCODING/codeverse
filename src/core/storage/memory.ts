import { SEARCH_HISTORY_KEEP, type ActivityEvent, type ActivityKind, type Collection, type ProgressRecord, type Storage, type StoredItem } from "./types";

export function createMemoryStorage(now: () => number = Date.now): Storage {
  const settings = new Map<string, unknown>();
  const progress = new Map<string, ProgressRecord>();
  let searches: string[] = [];
  const favorites = new Set<string>();
  const items = new Map<Collection, Map<string, StoredItem>>();
  let events: ActivityEvent[] = [];
  let nextId = 1;

  return {
    info: { backend: "memory", schemaVersion: 6, persistent: false },
    async getSettings() {
      return Object.fromEntries(settings);
    },
    async putSettings(values) {
      for (const [k, v] of Object.entries(values)) settings.set(k, v);
    },
    async clearSettings() {
      settings.clear();
    },
    async addActivity(kind: ActivityKind, ref = null) {
      events.push({ id: nextId++, kind, ref, createdAt: now() });
    },
    async recentActivity(limit) {
      return [...events].sort((a, b) => b.createdAt - a.createdAt || b.id - a.id).slice(0, limit);
    },
    async countActivitySince(since) {
      const out: Record<string, number> = {};
      for (const e of events) if (e.createdAt >= since) out[e.kind] = (out[e.kind] ?? 0) + 1;
      return out;
    },
    async clearActivity() {
      events = [];
    },
    async pruneActivity(keep) {
      if (events.length > keep) events = events.slice(events.length - keep);
    },
    async getAllProgress() {
      return [...progress.values()].map((r) => ({ ...r }));
    },
    async putProgress(rec) {
      progress.set(rec.lessonId, { ...rec });
    },
    async clearProgress() {
      progress.clear();
    },
    async addSearch(query) {
      searches = [query, ...searches.filter((s) => s !== query)].slice(0, SEARCH_HISTORY_KEEP);
    },
    async recentSearches(limit) {
      return searches.slice(0, limit);
    },
    async clearSearches() {
      searches = [];
    },
    async getFavorites() {
      return [...favorites];
    },
    async setFavorite(key, on) {
      if (on) favorites.add(key);
      else favorites.delete(key);
    },
    async listItems<T extends StoredItem>(collection: Collection) {
      return [...(items.get(collection)?.values() ?? [])].map((x) => structuredClone(x) as T);
    },
    async putItem(collection, item) {
      if (!items.has(collection)) items.set(collection, new Map());
      items.get(collection)!.set(item.id, structuredClone(item));
    },
    async deleteItem(collection, id) {
      items.get(collection)?.delete(id);
    },
    async clearCollection(collection) {
      items.delete(collection);
    },
  };
}
