import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../../core/i18n/i18n";
import { useSettings } from "../../core/settings/SettingsContext";
import { CodeEditor } from "../../ui/editor/CodeEditor";
import { Rich } from "../../ui/CodeBlock";

type Part = "html" | "css" | "js";

export const WEB_STARTER: Record<Part, string> = {
  html: `<main class="card">
  <h1>Salam, CODEVERSE!</h1>
  <p>Düyməyə basın: <strong id="count">0</strong></p>
  <button id="btn">+1</button>
</main>
`,
  css: `body {
  font-family: system-ui, sans-serif;
  display: grid;
  place-items: center;
  min-height: 100vh;
  margin: 0;
  background: #f3f5f8;
}
.card {
  background: white;
  padding: 24px 32px;
  border-radius: 14px;
  box-shadow: 0 8px 30px rgb(0 0 0 / 0.08);
  text-align: center;
}
button {
  font-size: 18px;
  padding: 8px 20px;
  border: 0;
  border-radius: 8px;
  background: #4f6d8f;
  color: white;
  cursor: pointer;
}
`,
  js: `const btn = document.getElementById("btn");
const count = document.getElementById("count");
let n = 0;
btn.addEventListener("click", () => {
  n++;
  count.textContent = n;
  console.log("clicked", n);
});
`,
};

const DRAFT = "cv.draft.lab.web.";

function load(part: Part): string {
  try {
    return localStorage.getItem(DRAFT + part) ?? WEB_STARTER[part];
  } catch {
    return WEB_STARTER[part];
  }
}

/**
 * Builds the preview document. A tiny bridge script forwards console output and errors to the
 * app with postMessage. The frame is sandboxed WITHOUT allow-same-origin: the page runs in an
 * opaque origin and cannot reach the app, its storage or its cookies.
 */
export function buildDoc(p: Record<Part, string>, token: string): string {
  const bridge = `<script>(()=>{const T=${JSON.stringify(token)};const send=(level,args)=>{try{parent.postMessage({__cv:T,level,text:args.map(a=>{try{return typeof a==="string"?a:JSON.stringify(a)}catch(e){return String(a)}}).join(" ")},"*")}catch(e){}};
["log","info","warn","error"].forEach(l=>{const o=console[l];console[l]=(...a)=>{send(l,a);o.apply(console,a)}});
addEventListener("error",e=>{const n=e.lineno-__OFF__;send("error",[(e.message||"Error")+(n>0?" (JavaScript, line "+n+")":"")])});
addEventListener("unhandledrejection",e=>send("error",["Unhandled promise rejection: "+(e.reason&&e.reason.message||e.reason)]));})();<\/script>`;
  // Close tags that would end our wrappers early are neutralised inside user CSS/JS.
  const css = p.css.replace(/<\/style/gi, "<\\/style");
  const js = p.js.replace(/<\/script/gi, "<\\/script");
  const before = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${bridge}<style>${css}</style></head><body>${p.html}<script>\n`;
  // Error line numbers are counted from the top of this document: subtract everything before the JS.
  const offset = before.split("\n").length - 1;
  return `${before.replace("__OFF__", String(offset))}${js}\n<\/script></body></html>`;
}

interface LogLine {
  level: string;
  text: string;
}

export function WebPreview() {
  const { t } = useI18n();
  const { settings } = useSettings();
  const [parts, setParts] = useState<Record<Part, string>>(() => ({ html: load("html"), css: load("css"), js: load("js") }));
  const [tab, setTab] = useState<Part>("html");
  const [doc, setDoc] = useState("");
  const [logs, setLogs] = useState<LogLine[]>([]);
  const frame = useRef<HTMLIFrameElement>(null);
  const token = useMemo(() => Math.random().toString(36).slice(2), []);

  // Live update, debounced so typing stays smooth.
  useEffect(() => {
    const id = setTimeout(() => {
      setLogs([]);
      setDoc(buildDoc(parts, token));
      if (settings.editorAutoSave) {
        try {
          for (const k of Object.keys(parts) as Part[]) {
            if (parts[k] === WEB_STARTER[k]) localStorage.removeItem(DRAFT + k);
            else localStorage.setItem(DRAFT + k, parts[k]);
          }
        } catch {
          /* storage unavailable */
        }
      }
    }, 450);
    return () => clearTimeout(id);
  }, [parts, token, settings.editorAutoSave]);

  useEffect(() => {
    const on = (ev: MessageEvent) => {
      const d = ev.data as { __cv?: string; level?: string; text?: string };
      if (ev.source !== frame.current?.contentWindow || d?.__cv !== token) return;
      setLogs((l) => (l.length >= 200 ? l : [...l, { level: String(d.level), text: String(d.text).slice(0, 2000) }]));
    };
    addEventListener("message", on);
    return () => removeEventListener("message", on);
  }, [token]);

  const reset = () => setParts({ ...WEB_STARTER });
  const tabs: { id: Part; label: string }[] = [
    { id: "html", label: "HTML" },
    { id: "css", label: "CSS" },
    { id: "js", label: "JavaScript" },
  ];

  return (
    <div className="web-split">
      <div>
        <div className="web-tabs" role="tablist" aria-label={t("web.files")}>
          {tabs.map((x) => (
            <button key={x.id} type="button" role="tab" className="web-tab" aria-selected={tab === x.id} onClick={() => setTab(x.id)}>
              {x.label}
            </button>
          ))}
        </div>
        <CodeEditor
          key={tab}
          value={parts[tab]}
          onChange={(v) => setParts((p) => ({ ...p, [tab]: v }))}
          lang={tab === "js" ? "javascript" : tab}
          label={t("lab.editorLabel")}
          minLines={18}
        />
        <div className="row wrap mt">
          <button type="button" className="btn" onClick={reset}>
            {t("lab.reset")}
          </button>
          <button type="button" className="btn" onClick={() => setDoc(buildDoc(parts, token) + " ")}>
            {t("web.reload")}
          </button>
          <span className="small">{t("web.live")}</span>
        </div>
      </div>
      <div>
        <iframe ref={frame} className="web-frame" title={t("web.preview")} sandbox="allow-scripts allow-modals" srcDoc={doc} />
        <div className="console web-console" role="log" aria-live="polite" aria-label={t("lab.output")}>
          <div className="console-head small">{t("web.console")}</div>
          {logs.length === 0 ? (
            <p className="muted small"><Rich text={t("web.noLogs")} /></p>
          ) : (
            <pre>
              {logs.map((l, i) => (
                <span key={i} className={l.level === "error" ? "err-text" : l.level === "warn" ? "warn-text" : undefined}>
                  {l.text}
                  {"\n"}
                </span>
              ))}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
