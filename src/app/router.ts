import { useEffect, useState } from "react";

// Hash routing (#/languages/python/python-variables): works from file://, inside Tauri and on
// static hosting. The first segment selects the module; the rest are module parameters.
function segments(): string[] {
  return location.hash
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
    const on = () => setHash(location.hash);
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return hash;
}

export function useRoute(fallback: string): string {
  useHash();
  return currentRoute() || fallback;
}

/** Parameters after the module id, e.g. ["python", "python-variables"]. */
export function useRouteParams(): string[] {
  useHash();
  return segments().slice(1);
}
