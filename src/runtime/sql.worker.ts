/// <reference lib="webworker" />
// SQL sandbox worker: an in-memory SQLite (sql.js / WebAssembly). No file system, no network.
import initSqlJs from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm-browser.wasm?url";
import { SAMPLE_DB_SQL } from "./sampleDb";
import { formatTable } from "./format";

const MAX_ROWS = 500;

self.onmessage = async (ev: MessageEvent<{ code: string }>) => {
  try {
    // Standard SQLite math functions (as in real SQLite), not sql.js's legacy ones.
    const SQL = await initSqlJs({ locateFile: () => wasmUrl, useOldExtensionFunctions: false });
    const db = new SQL.Database();
    db.exec(SAMPLE_DB_SQL);
    const results = db.exec(ev.data.code);
    let truncated = false;
    const blocks = results.map((r) => {
      if (r.values.length > MAX_ROWS) truncated = true;
      return formatTable(r.columns, r.values.slice(0, MAX_ROWS));
    });
    const changes = db.getRowsModified();
    db.close();
    postMessage({ ok: true, output: blocks.join("\n\n"), changes, truncated });
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    postMessage({ ok: false, error: { name: "SQLError", message: err.message, line: null } });
  }
};
