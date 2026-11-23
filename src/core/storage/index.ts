import { createMemoryStorage } from "./memory";
import type { Storage } from "./types";

export * from "./types";

export const isTauri = (): boolean => typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

/** Chooses the best available adapter. Each adapter is a separate lazy chunk. */
export async function openStorage(): Promise<{ storage: Storage; fallbackReason?: string }> {
  try {
    if (isTauri()) {
      const { createSqliteStorage } = await import("./sqlite");
      return { storage: await createSqliteStorage() };
    }
    if (typeof indexedDB !== "undefined") {
      const { createIndexedDbStorage } = await import("./indexeddb");
      return { storage: await createIndexedDbStorage() };
    }
    return { storage: createMemoryStorage(), fallbackReason: "noIndexedDb" };
  } catch (err) {
    // Private windows or blocked storage: keep the app usable, warn the user.
    console.error("Storage unavailable, using memory", err);
    return { storage: createMemoryStorage(), fallbackReason: String(err) };
  }
}
