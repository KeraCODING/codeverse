import { startTransition, useEffect, useState } from "react";

// Hash routing (#/languages/python/python-variables): works from file://, inside Tauri and on
// static hosting. The first segment selects the module; the rest are module parameters.
function segments(hash: string = location.hash): string[] {
  return hash
    .replace(/^#\/?/, "")
    .split("?")[0]
    .split("/")
    .filter(Boolean)
    .map((s) => decodeURIComponent(s));
}

export function currentRoute(): string {
  return segments()[0] ?? "";
}

export function navigate(path: string) {
  const target = `#/${path}`;
  if (location.hash !== target) location.hash = target;
}

function useHash(): string {
  const [hash, setHash] = useState(() => location.hash);
  useEffect(() => {
    // A transition keeps the current page on screen while the next one loads, instead of
    // flashing the loading placeholder (which React keeps visible for at least 300 ms).
    const on = () => startTransition(() => setHash(location.hash));
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return hash;
}

export function useRoute(fallback: string): string {
  const hash = useHash();
  return segments(hash)[0] || fallback;
}

/** Parameters after the module id, e.g. ["python", "python-variables"]. */
export function useRouteParams(): string[] {
  const hash = useHash();
  return segments(hash).slice(1);
}
