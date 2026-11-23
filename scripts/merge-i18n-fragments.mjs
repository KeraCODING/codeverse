// Merges section string fragments (i18n-fragments/*.json, { key: [az, en, tr, ru] }) into the
// locale dictionaries. Idempotent: re-running updates values. Fails loudly on malformed entries.
// Usage: node scripts/merge-i18n-fragments.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const fragDir = join(root, "i18n-fragments");
const locDir = join(root, "src", "core", "i18n", "locales");
const LOCALES = ["az", "en", "tr", "ru"];

const merged = {};
for (const f of readdirSync(fragDir).filter((x) => x.endsWith(".json"))) {
  const data = JSON.parse(readFileSync(join(fragDir, f), "utf8"));
  for (const [k, v] of Object.entries(data)) {
    if (!Array.isArray(v) || v.length !== 4 || v.some((s) => typeof s !== "string" || !s.trim())) throw new Error(`${f}: bad entry ${k}`);
    merged[k] = v;
  }
  console.log(`${f}: ${Object.keys(data).length} keys`);
}
LOCALES.forEach((loc, i) => {
  const file = join(locDir, `${loc}.json`);
  const dict = JSON.parse(readFileSync(file, "utf8"));
  for (const [k, v] of Object.entries(merged)) dict[k] = v[i];
  writeFileSync(file, JSON.stringify(dict, null, 2) + "\n");
  console.log(`${loc}: ${Object.keys(dict).length} keys`);
});
