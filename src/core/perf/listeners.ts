// Registry of long-lived listeners / background operations, shown on the diagnostics page.
// Anything that keeps running while the user is idle must register here, so the
// "active background operations" figure is real rather than assumed.

const active = new Map<string, number>();

export function trackBackground(name: string): () => void {
  active.set(name, (active.get(name) ?? 0) + 1);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    const n = (active.get(name) ?? 1) - 1;
    if (n <= 0) active.delete(name);
    else active.set(name, n);
  };
}

export function listBackground(): { name: string; count: number }[] {
  return [...active].map(([name, count]) => ({ name, count }));
}
