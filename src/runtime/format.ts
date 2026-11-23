// Formats values like Node.js `console.log` (simplified), so lesson outputs and Code Lab output
// look the same. IMPORTANT: this function must stay self-contained (no references to anything
// outside its body) because the JS sandbox embeds it into the worker via `String(formatValue)`.
export function formatValue(value: unknown, top = true): string {
  const seen = new Set<unknown>();
  const fmt = (v: unknown, depth: number, nested: boolean): string => {
    if (typeof v === "string") return nested ? `'${v.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n")}'` : v;
    if (typeof v === "number") return Object.is(v, -0) ? "-0" : String(v);
    if (typeof v === "bigint") return `${v}n`;
    if (typeof v === "boolean" || v === null || v === undefined) return String(v);
    if (typeof v === "symbol") return v.toString();
    if (typeof v === "function") return v.name ? `[Function: ${v.name}]` : "[Function (anonymous)]";
    if (seen.has(v)) return "[Circular]";
    if (v instanceof Error) return v.stack && !nested ? `${v.name}: ${v.message}` : `[${v.name}: ${v.message}]`;
    if (v instanceof Date) return isNaN(v.getTime()) ? "Invalid Date" : v.toISOString();
    if (v instanceof RegExp) return String(v);
    if (depth > 2) return Array.isArray(v) ? "[Array]" : "[Object]";
    seen.add(v);
    try {
      if (Array.isArray(v)) {
        if (v.length === 0) return "[]";
        const items = v.slice(0, 100).map((x) => fmt(x, depth + 1, true));
        if (v.length > 100) items.push(`... ${v.length - 100} more items`);
        return `[ ${items.join(", ")} ]`;
      }
      if (v instanceof Map) {
        const items = [...v].map(([k, x]) => `${fmt(k, depth + 1, true)} => ${fmt(x, depth + 1, true)}`);
        return `Map(${v.size}) ${items.length ? `{ ${items.join(", ")} }` : "{}"}`;
      }
      if (v instanceof Set) {
        const items = [...v].map((x) => fmt(x, depth + 1, true));
        return `Set(${v.size}) ${items.length ? `{ ${items.join(", ")} }` : "{}"}`;
      }
      const keys = Object.keys(v as object);
      const ctor = (v as object).constructor;
      const prefix = ctor && ctor !== Object && ctor.name ? `${ctor.name} ` : "";
      if (keys.length === 0) return `${prefix}{}`;
      const body = keys
        .slice(0, 50)
        .map((k) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`}: ${fmt((v as Record<string, unknown>)[k], depth + 1, true)}`);
      return `${prefix}{ ${body.join(", ")} }`;
    } finally {
      seen.delete(v);
    }
  };
  return fmt(value, 0, !top);
}

/** Joins console.log arguments the way Node does: strings raw, everything else formatted. */
export function formatArgs(args: unknown[]): string {
  return args.map((a) => formatValue(a, true)).join(" ");
}

/** Normalises output for comparison in exercise checks: line endings, trailing spaces/lines. */
export function normalizeOutput(s: string): string {
  return s
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .replace(/\n+$/, "")
    .trim();
}

/** Text table in the same style as lesson outputs: `a | b` columns padded, NULL for null. */
export function formatTable(columns: string[], rows: unknown[][]): string {
  const cell = (v: unknown) => (v === null || v === undefined ? "NULL" : String(v));
  const widths = columns.map((c, i) => Math.max(c.length, ...rows.map((r) => cell(r[i]).length)));
  const line = (cells: string[]) => cells.map((c, i) => c.padEnd(widths[i])).join(" | ").trimEnd();
  return [line(columns), ...rows.map((r) => line(r.map(cell)))].join("\n");
}
