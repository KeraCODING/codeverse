// CodeMirror 6 editor. This file (and CodeMirror itself) is only loaded by pages that edit code.
// One EditorView per mounted editor; it is destroyed on unmount (no leaked listeners).
import { useEffect, useRef } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from "@codemirror/view";
import { Compartment, EditorState, type Extension } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { bracketMatching, indentOnInput, indentUnit, syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { closeBrackets, closeBracketsKeymap, autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { tags } from "@lezer/highlight";
import { useSettings } from "../../core/settings/SettingsContext";

export type EditorLang = "javascript" | "typescript" | "python" | "sql" | "html" | "css";

// Colours come from the app's CSS variables, so light/dark/accent apply without reconfiguring.
const highlight = HighlightStyle.define([
  { tag: [tags.keyword, tags.controlKeyword, tags.operatorKeyword, tags.definitionKeyword, tags.moduleKeyword], color: "var(--accent)", fontWeight: "600" },
  { tag: [tags.string, tags.special(tags.string)], color: "var(--success)" },
  { tag: [tags.number, tags.bool, tags.null], color: "var(--warning)" },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: "var(--muted)", fontStyle: "italic" },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], textDecoration: "underline dotted var(--border)" },
]);

const baseTheme = EditorView.theme({
  "&": { backgroundColor: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "var(--code-font-size)" },
  "&.cm-focused": { outline: "2px solid var(--accent)", outlineOffset: "1px" },
  ".cm-scroller": { fontFamily: "var(--code-font)", lineHeight: "1.6", fontVariantLigatures: "none" },
  ".cm-content": { caretColor: "var(--text)", padding: "8px 0" },
  ".cm-gutters": { backgroundColor: "var(--bg)", color: "var(--muted)", border: "none" },
  ".cm-activeLine, .cm-activeLineGutter": { backgroundColor: "var(--bg-2)" },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": { backgroundColor: "color-mix(in srgb, var(--accent) 30%, transparent) !important" },
  ".cm-matchingBracket": { backgroundColor: "color-mix(in srgb, var(--accent) 25%, transparent)", outline: "none" },
  ".cm-tooltip": { backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" },
  ".cm-tooltip-autocomplete ul li[aria-selected]": { backgroundColor: "var(--bg-2)", color: "var(--text)" },
});

// Each language parser is its own lazy chunk: opening a SQL exercise never loads the JS grammar.
const languageExt = async (lang: EditorLang): Promise<Extension> => {
  if (lang === "javascript") return (await import("@codemirror/lang-javascript")).javascript();
  if (lang === "typescript") return (await import("@codemirror/lang-javascript")).javascript({ typescript: true });
  if (lang === "html") return (await import("@codemirror/lang-html")).html();
  if (lang === "css") return (await import("@codemirror/lang-css")).css();
  if (lang === "python") return (await import("@codemirror/lang-python")).python();
  const m = await import("@codemirror/lang-sql");
  return m.sql({ dialect: m.SQLite, upperCaseKeywords: true });
};

export function CodeEditor({
  value,
  onChange,
  lang,
  label,
  minLines = 8,
  onRun,
}: {
  value: string;
  onChange: (v: string) => void;
  lang: EditorLang;
  label: string;
  minLines?: number;
  onRun?: () => void; // Ctrl+Enter
}) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);
  onChangeRef.current = onChange;
  onRunRef.current = onRun;
  const { settings: s } = useSettings();
  const conf = useRef({ lang: new Compartment(), opts: new Compartment() });

  const optionExts = (): Extension[] => [
    s.editorLineNumbers ? [lineNumbers(), highlightActiveLineGutter()] : [],
    s.editorWordWrap ? EditorView.lineWrapping : [],
    s.editorBracketMatching ? [bracketMatching(), closeBrackets()] : [],
    indentUnit.of(" ".repeat(s.editorTabSize)),
    EditorState.tabSize.of(s.editorTabSize),
  ];

  // Create once.
  useEffect(() => {
    const v = new EditorView({
      parent: host.current!,
      state: EditorState.create({
        doc: value,
        extensions: [
          history(),
          drawSelection(),
          highlightActiveLine(),
          indentOnInput(),
          autocompletion(),
          syntaxHighlighting(highlight),
          baseTheme,
          keymap.of([
            { key: "Mod-Enter", run: () => (onRunRef.current?.(), true) },
            indentWithTab,
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
            ...completionKeymap,
          ]),
          conf.current.lang.of([]), // filled in as soon as the grammar chunk has loaded
          conf.current.opts.of(optionExts()),
          EditorView.contentAttributes.of({ "aria-label": label, spellcheck: "false" }),
          EditorView.theme({ ".cm-content": { minHeight: `${minLines * 1.6}em` } }),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) onChangeRef.current(u.state.doc.toString());
          }),
        ],
      }),
    });
    view.current = v;
    return () => {
      v.destroy();
      view.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reconfigure instead of recreating when language or editor settings change.
  useEffect(() => {
    let live = true;
    void languageExt(lang).then((ext) => {
      if (live) view.current?.dispatch({ effects: conf.current.lang.reconfigure(ext) });
    });
    return () => {
      live = false;
    };
  }, [lang]);
  useEffect(() => {
    view.current?.dispatch({ effects: conf.current.opts.reconfigure(optionExts()) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.editorLineNumbers, s.editorWordWrap, s.editorBracketMatching, s.editorTabSize]);

  // External value changes (reset, sample switch) replace the document.
  useEffect(() => {
    const v = view.current;
    if (v && v.state.doc.toString() !== value) v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
  }, [value]);

  return <div ref={host} className="code-editor" />;
}

export default CodeEditor;
