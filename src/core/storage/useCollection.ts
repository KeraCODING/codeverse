import { useCallback, useEffect, useState } from "react";
import { useSettings } from "../settings/SettingsContext";
import type { Collection, StoredItem } from "./types";

/** Loads a personal-data collection once and keeps it in sync with local storage. */
export function useCollection<T extends StoredItem>(collection: Collection) {
  const { storage } = useSettings();
  const [items, setItems] = useState<T[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    storage.listItems<T>(collection).then((rows) => {
      if (!live) return;
      setItems(rows.sort((a, b) => b.updatedAt - a.updatedAt));
      setReady(true);
    });
    return () => {
      live = false;
    };
  }, [storage, collection]);

  const save = useCallback(
    async (item: T) => {
      const next = { ...item, updatedAt: Date.now() };
      setItems((list) => [next, ...list.filter((x) => x.id !== item.id)]);
      await storage.putItem(collection, next);
      return next;
    },
    [storage, collection],
  );

  const remove = useCallback(
    async (id: string) => {
      setItems((list) => list.filter((x) => x.id !== id));
      await storage.deleteItem(collection, id);
    },
    [storage, collection],
  );

  /** Adds many items at once (import). Existing ids are replaced only when `replace` is true. */
  const importMany = useCallback(
    async (incoming: T[], replace: boolean) => {
      const existing = new Set(items.map((x) => x.id));
      let added = 0;
      for (const it of incoming) {
        if (existing.has(it.id) && !replace) continue;
        await storage.putItem(collection, it);
        added++;
      }
      const rows = await storage.listItems<T>(collection);
      setItems(rows.sort((a, b) => b.updatedAt - a.updatedAt));
      return added;
    },
    [storage, collection, items],
  );

  return { items, ready, save, remove, importMany };
}

/** Saves text as a file through the browser/WebView download mechanism. */
export function downloadText(filename: string, text: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** Reads a small, user-chosen text file (≤ 5 MB). */
export async function readTextFile(file: File): Promise<string> {
  if (file.size > 5 * 1024 * 1024) throw new Error("tooLarge");
  return file.text();
}
