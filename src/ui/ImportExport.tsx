import { useRef, useState } from "react";
import { useI18n } from "../core/i18n/i18n";
import { downloadText, readTextFile } from "../core/storage/useCollection";
import { buildExport, parseExport } from "../personal/models";

/** Export all items as JSON and import a previously exported file (validated, never overwrites by default). */
export function ImportExport<T>({
  format,
  filename,
  items,
  validate,
  onImport,
  extraExport,
}: {
  format: string;
  filename: string;
  items: T[];
  validate: (x: unknown) => T | null;
  onImport: (items: T[]) => Promise<number>;
  extraExport?: React.ReactNode;
}) {
  const { t } = useI18n();
  const ref = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const doImport = async (file: File) => {
    try {
      const { items: parsed, skipped } = parseExport(await readTextFile(file), format, validate);
      const added = await onImport(parsed);
      setMsg({ ok: true, text: t("data.imported", { added, skipped: skipped + (parsed.length - added) }) });
    } catch (e) {
      const code = (e as Error).message;
      setMsg({ ok: false, text: t(`settings.data.error.${["tooLarge", "invalidJson", "wrongFormat", "unsupportedVersion"].includes(code) ? code : "invalidJson"}`) });
    }
  };

  return (
    <div className="row wrap">
      <button type="button" className="btn" disabled={items.length === 0} onClick={() => downloadText(`${filename}-${new Date().toISOString().slice(0, 10)}.json`, buildExport(format, items))}>
        {t("data.exportJson")}
      </button>
      {extraExport}
      <button type="button" className="btn" onClick={() => ref.current?.click()}>{t("data.importJson")}</button>
      <input
        ref={ref}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) void doImport(f);
        }}
      />
      {msg && <span className={`small ${msg.ok ? "ok-text" : "err-text"}`} role="status">{msg.text}</span>}
    </div>
  );
}
