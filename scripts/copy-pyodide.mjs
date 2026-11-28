// Copies the Pyodide runtime (CPython compiled to WebAssembly) from node_modules into
// public/pyodide so it ships inside the app and Python runs without an internet connection.
// Runs automatically before `npm run dev` and `npm run build`.
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const FILES = ["pyodide.mjs", "pyodide.asm.mjs", "pyodide.asm.wasm", "python_stdlib.zip", "pyodide-lock.json"];

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const src = dirname(require.resolve("pyodide/package.json"));
const dest = join(root, "public", "pyodide");
mkdirSync(dest, { recursive: true });

let copied = 0;
for (const f of FILES) {
  const from = join(src, f);
  const to = join(dest, f);
  if (existsSync(to) && statSync(to).size === statSync(from).size && statSync(to).mtimeMs >= statSync(from).mtimeMs) continue;
  copyFileSync(from, to);
  copied++;
}
console.log(`pyodide: ${copied} file(s) copied to public/pyodide`);
