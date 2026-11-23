import { listBackground } from "./listeners";

let startupMs: number | null = null;

/** Called once after the first frame is painted. */
export function markStartup() {
  if (startupMs === null) startupMs = Math.round(performance.now());
}

export interface Snapshot {
  takenAt: number;
  startupMs: number | null;
  heapUsed: number | null; // bytes; Chromium/WebView2 only
  heapLimit: number | null;
  storageUsage: number | null; // bytes used by this origin
  storageQuota: number | null;
  scripts: { count: number; bytes: number };
  styles: { count: number; bytes: number };
  domNodes: number;
  background: { name: string; count: number }[];
}

/** Collects a one-off snapshot. Nothing here runs on a timer. */
export async function takeSnapshot(): Promise<Snapshot> {
  const mem = (performance as Performance & { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
  let storageUsage: number | null = null;
  let storageQuota: number | null = null;
  try {
    const est = await navigator.storage?.estimate?.();
    storageUsage = est?.usage ?? null;
    storageQuota = est?.quota ?? null;
  } catch {
    /* unsupported */
  }
  const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
  const sum = (ext: RegExp) => {
    const list = res.filter((r) => ext.test(new URL(r.name, location.href).pathname));
    return { count: list.length, bytes: list.reduce((a, r) => a + (r.decodedBodySize || 0), 0) };
  };
  return {
    takenAt: Date.now(),
    startupMs,
    heapUsed: mem?.usedJSHeapSize ?? null,
    heapLimit: mem?.jsHeapSizeLimit ?? null,
    storageUsage,
    storageQuota,
    scripts: sum(/\.(m?js|tsx?)$/),
    styles: sum(/\.css$/),
    domNodes: document.getElementsByTagName("*").length,
    background: listBackground(),
  };
}

export function formatBytes(n: number | null, fmt: (n: number, o?: Intl.NumberFormatOptions) => string): string {
  if (n === null) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${fmt(v, { maximumFractionDigits: i === 0 ? 0 : 1 })} ${units[i]}`;
}
