import { useEffect, useMemo, useRef, useState } from "react";
import { MODULES } from "./modules";
import { Icon, type IconName } from "../ui/Icon";
import { useI18n } from "../core/i18n/i18n";
import { useSettings } from "../core/settings/SettingsContext";
import { LESSON_INDEX } from "../content";
import { useContent } from "../content/useContent";
import { normalize } from "../knowledge/search";
import { resolveTheme, systemPrefersDark } from "../core/theme/theme";

interface Item {
  id: string;
  group: "actions" | "sections" | "lessons" | "search";
  icon: IconName;
  label: string;
  hint?: string;
  run: () => void;
}

const go = (path: string) => {
  location.hash = `#/${path}`;
};

/** Keyboard-first launcher: sections, lessons and actions in one filtered list. */
export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const { tx } = useContent();
  const { settings, update } = useSettings();
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const all = useMemo<Item[]>(() => {
    const dark = resolveTheme(settings.theme, systemPrefersDark()) === "dark";
    const actions: Item[] = [
      { id: "a-py", group: "actions", icon: "terminal", label: t("palette.runPython"), run: () => go("codelab?lang=python") },
      { id: "a-web", group: "actions", icon: "globe", label: t("palette.webPreview"), run: () => go("codelab?lang=web") },
      { id: "a-ts", group: "actions", icon: "code", label: t("palette.runTs"), run: () => go("codelab?lang=typescript") },
      { id: "a-note", group: "actions", icon: "note", label: t("palette.newNote"), run: () => go("notes") },
      { id: "a-theme", group: "actions", icon: dark ? "sun" : "moon", label: dark ? t("palette.lightTheme") : t("palette.darkTheme"), run: () => void update({ theme: dark ? "light" : "dark" }) },
      { id: "a-side", group: "actions", icon: "menu", label: settings.sidebarCollapsed ? t("nav.expand") : t("nav.collapse"), run: () => void update({ sidebarCollapsed: !settings.sidebarCollapsed }) },
    ];
    const sections: Item[] = MODULES.filter((m) => m.status === "done" && !m.hidden).map((m) => ({
      id: `m-${m.id}`,
      group: "sections",
      icon: m.icon,
      label: t(`module.${m.id}.title`),
      hint: t(`nav.group.${m.group}`),
      run: () => go(m.id),
    }));
    const lessons: Item[] = LESSON_INDEX.map((l) => ({
      id: `l-${l.id}`,
      group: "lessons",
      icon: "doc",
      label: tx(l.title),
      hint: l.language,
      run: () => go(`languages/${l.language}/${l.id}`),
    }));
    return [...actions, ...sections, ...lessons];
  }, [t, tx, settings.theme, settings.sidebarCollapsed, update]);

  const items = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return all.filter((x) => x.group !== "lessons").concat(all.filter((x) => x.group === "lessons").slice(0, 5));
    const scored = all
      .map((x) => {
        const label = normalize(x.label);
        const hint = normalize(x.hint ?? "");
        const score = label.startsWith(q) ? 3 : label.split(/\s+/).some((w) => w.startsWith(q)) ? 2 : label.includes(q) || hint.includes(q) ? 1 : 0;
        return { x, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
    const out = scored.map((r) => r.x);
    out.push({ id: "search", group: "search", icon: "search", label: t("palette.searchAll", { q: query.trim() }), run: () => go(`search?q=${encodeURIComponent(query.trim())}`) });
    return out;
  }, [all, query, t]);

  useEffect(() => setSel(0), [query]);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => prev?.focus?.();
  }, []);
  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  const choose = (it: Item | undefined) => {
    if (!it) return;
    onClose();
    it.run();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(items.length - 1, s + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(0, s - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(items[sel]);
    } else if (e.key === "Tab") {
      e.preventDefault(); // focus stays in the palette
    }
  };

  let lastGroup = "";
  return (
    <div className="palette-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="palette" role="dialog" aria-modal="true" aria-label={t("palette.title")} onKeyDown={onKey}>
        <input
          ref={inputRef}
          className="palette-input"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={items[sel] ? `pal-${items[sel].id}` : undefined}
          placeholder={t("palette.placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul className="palette-list" id="palette-list" role="listbox" ref={listRef}>
          {items.length === 0 && <li className="palette-empty">{t("palette.empty")}</li>}
          {items.map((it, i) => {
            const head = it.group !== lastGroup ? <li className="palette-group" role="presentation">{t(`palette.group.${it.group}`)}</li> : null;
            lastGroup = it.group;
            return [
              head,
              <li
                key={it.id}
                id={`pal-${it.id}`}
                role="option"
                aria-selected={i === sel}
                className="palette-item"
                onMouseMove={() => i !== sel && setSel(i)}
                onClick={() => choose(it)}
              >
                <Icon name={it.icon} />
                <span>{it.label}</span>
                {it.hint && <span className="hint">{it.hint}</span>}
              </li>,
            ];
          })}
        </ul>
        <div className="palette-foot" aria-hidden="true">
          <span><kbd>↑</kbd> <kbd>↓</kbd> {t("palette.move")}</span>
          <span><kbd>Enter</kbd> {t("palette.choose")}</span>
          <span><kbd>Esc</kbd> {t("palette.close")}</span>
        </div>
      </div>
    </div>
  );
}
