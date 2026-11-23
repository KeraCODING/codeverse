// Small, safe Markdown renderer for personal notes. It builds React elements directly —
// raw HTML in notes is shown as text, never injected (no XSS from imported notes).
// Supported: # headings, paragraphs, - / * / 1. lists, > quotes, ``` code fences (highlighted),
// `inline code`, **bold**, *italic*, [links](https://…) (http/https only), --- rules.
import { Fragment, type ReactNode } from "react";
import type { CodeLang } from "../content/types";
import { CodeBlock } from "./CodeBlock";

const FENCE_LANGS: Record<string, CodeLang> = {
  py: "python", python: "python", js: "javascript", javascript: "javascript", ts: "typescript", typescript: "typescript",
  sql: "sql", java: "java", cs: "csharp", csharp: "csharp", cpp: "cpp", "c++": "cpp", go: "go",
};

export function inline(text: string, keyBase = ""): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)|(\[[^\]]+\]\((https?:\/\/[^)\s]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<Fragment key={`${keyBase}t${i++}`}>{text.slice(last, m.index)}</Fragment>);
    const tok = m[0];
    if (m[1]) out.push(<code key={`${keyBase}c${i++}`}>{tok.slice(1, -1)}</code>);
    else if (m[2]) out.push(<strong key={`${keyBase}b${i++}`}>{tok.slice(2, -2)}</strong>);
    else if (m[3]) out.push(<em key={`${keyBase}i${i++}`}>{tok.slice(1, -1)}</em>);
    else if (m[4]) {
      const label = tok.slice(1, tok.indexOf("]"));
      out.push(<a key={`${keyBase}a${i++}`} href={m[5]} target="_blank" rel="noreferrer noopener">{label}</a>);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(<Fragment key={`${keyBase}t${i++}`}>{text.slice(last)}</Fragment>);
  return out;
}

export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (i < lines.length) {
    const line = lines[i];
    const fence = /^```\s*([\w+#-]*)\s*$/.exec(line);
    if (fence) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) body.push(lines[i++]);
      i++; // closing fence (or end)
      blocks.push(<CodeBlock key={k++} code={body.join("\n")} lang={FENCE_LANGS[fence[1].toLowerCase()] ?? "plain"} />);
      continue;
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const content = inline(h[2], `h${k}`);
      blocks.push(level === 1 ? <h2 key={k++}>{content}</h2> : level === 2 ? <h3 key={k++}>{content}</h3> : <h4 key={k++}>{content}</h4>);
      i++;
      continue;
    }
    if (/^(-{3,}|\*{3,})\s*$/.test(line)) {
      blocks.push(<hr key={k++} />);
      i++;
      continue;
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*([-*]|\d+\.)\s+/, ""));
      const lis = items.map((it, j) => {
        const task = /^\[( |x)\]\s+(.*)$/i.exec(it);
        return (
          <li key={j}>
            {task ? <>{task[1].toLowerCase() === "x" ? "☑ " : "☐ "}{inline(task[2], `l${k}${j}`)}</> : inline(it, `l${k}${j}`)}
          </li>
        );
      });
      blocks.push(ordered ? <ol key={k++}>{lis}</ol> : <ul key={k++}>{lis}</ul>);
      continue;
    }
    if (/^>\s?/.test(line)) {
      const q: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push(<blockquote key={k++}>{inline(q.join(" "), `q${k}`)}</blockquote>);
      continue;
    }
    if (!line.trim()) {
      i++;
      continue;
    }
    // Always consume the current line first, so odd input (e.g. "```js extra") can never stall the loop.
    const para: string[] = [lines[i++]];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|>|\s*([-*]|\d+\.)\s+|-{3,}\s*$)/.test(lines[i])) para.push(lines[i++]);
    blocks.push(<p key={k++}>{inline(para.join(" "), `p${k}`)}</p>);
  }
  return <div className="markdown">{blocks}</div>;
}
