// Minimal read-only syntax highlighter for lesson code (Python, JavaScript/TypeScript).
// The full editor (CodeMirror 6) arrives with Code Lab in phase 4; this keeps lessons light.
import type { CodeLang } from "../content/types";

export type TokenType = "kw" | "str" | "num" | "com" | "fn" | "text";
export interface Token {
  type: TokenType;
  text: string;
}

const KEYWORDS: Record<string, Set<string>> = {
  python: new Set(
    "False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield".split(" "),
  ),
  javascript: new Set(
    "async await break case catch class const continue debugger default delete do else export extends false finally for function if import in instanceof let new null return super switch this throw true try typeof undefined var void while yield of".split(" "),
  ),
};
// SQL keywords are matched case-insensitively (stored upper-case).
KEYWORDS.sql = new Set(
  "SELECT FROM WHERE AND OR NOT ORDER BY ASC DESC LIMIT OFFSET AS IS NULL IN LIKE BETWEEN DISTINCT INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE JOIN LEFT INNER ON GROUP HAVING COUNT SUM AVG MIN MAX".split(" "),
);
KEYWORDS.java = new Set(
  "abstract boolean break byte case catch char class continue default do double else enum extends final finally float for if implements import int interface long new null package private protected public return short static super switch this throw throws true false try var void while String".split(" "),
);
KEYWORDS.csharp = new Set(
  "abstract as bool break byte case catch char class const continue decimal default do double else enum false finally float for foreach if in int interface internal is long namespace new null object out override private protected public readonly return static string struct switch this throw true try using var virtual void while".split(" "),
);
KEYWORDS.cpp = new Set(
  "auto bool break case catch char class const continue default delete do double else enum false float for if include int long namespace new nullptr private protected public return short signed sizeof static struct switch template this throw true try typedef typename unsigned using virtual void while std".split(" "),
);
KEYWORDS.go = new Set(
  "break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var nil true false int string bool".split(" "),
);
KEYWORDS.typescript = new Set([...KEYWORDS.javascript, "interface", "type", "enum", "implements", "readonly", "as", "public", "private", "protected"]);

/** Tokenises one line. Strings and comments are line-local (enough for lesson snippets). */
export function tokenizeLine(line: string, lang: CodeLang): Token[] {
  if (lang === "plain") return [{ type: "text", text: line }];
  const kw = KEYWORDS[lang];
  const comment = lang === "python" ? "#" : lang === "sql" ? "--" : "//";
  const isKw = (w: string) => (lang === "sql" ? kw.has(w.toUpperCase()) : kw.has(w));
  const out: Token[] = [];
  let i = 0;
  const push = (type: TokenType, text: string) => {
    const last = out[out.length - 1];
    if (last && last.type === type && type === "text") last.text += text;
    else out.push({ type, text });
  };
  while (i < line.length) {
    const c = line[i];
    if (line.startsWith(comment, i)) {
      push("com", line.slice(i));
      break;
    }
    if (c === "'" || (c === '"' && lang !== "sql") || (c === "`" && lang !== "python" && lang !== "sql")) {
      let j = i + 1;
      while (j < line.length && line[j] !== c) j += line[j] === "\\" ? 2 : 1;
      // Python f-string / string prefixes are part of the identifier run before the quote.
      push("str", line.slice(i, Math.min(j + 1, line.length)));
      i = j + 1;
      continue;
    }
    if (/[0-9]/.test(c) && !/[\w$]/.test(line[i - 1] ?? "")) {
      const m = /^\d+(\.\d+)?/.exec(line.slice(i))!;
      push("num", m[0]);
      i += m[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      const m = /^[A-Za-z_$][\w$]*/.exec(line.slice(i))!;
      const word = m[0];
      const next = line[i + word.length];
      if (lang === "python" && (word === "f" || word === "r" || word === "b") && (next === '"' || next === "'")) {
        // prefix of a string literal: highlight together with the string
        const q = next;
        let j = i + 2;
        while (j < line.length && line[j] !== q) j += line[j] === "\\" ? 2 : 1;
        push("str", line.slice(i, Math.min(j + 1, line.length)));
        i = j + 1;
        continue;
      }
      push(isKw(word) ? "kw" : next === "(" ? "fn" : "text", word);
      i += word.length;
      continue;
    }
    push("text", c);
    i++;
  }
  return out;
}
