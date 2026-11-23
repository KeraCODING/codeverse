# CODEVERSE — Architecture Plan

Status: Phase 1 (Core Foundation). Last updated 2026-11-22.

## 1. Starting point (inspection result)

The project folder was empty: no existing code, dependencies or user data to preserve.
Toolchain on the build machine: Node 24, npm 11, Git 2.56. **Rust/Cargo is not installed**,
so the Tauri desktop shell is written but has not been compiled yet (see STATUS.md → Blocked).

## 2. Technology decision

| Option | Installer size | Idle RAM | Startup | Notes |
|---|---|---|---|---|
| **Tauri 2 + Rust + WebView2** | ~5–15 MB typical | ~60–150 MB (WebView2 shared with OS) | fast | WebView2 ships with Windows 10/11. Chosen. |
| Electron | ~80–150 MB | ~150–300 MB | slower | Bundles Chromium + Node per app. Rejected for footprint. |
| .NET MAUI / WPF | 30–80 MB | 80–200 MB | medium | No shared web build; would need a second UI for the web app. |
| Flutter desktop | 20–40 MB | 100–200 MB | fast | Web build is heavy; weak code-editor ecosystem. |

Figures are typical published ranges, not measurements of CODEVERSE. Real numbers will be
recorded in STATUS.md once the desktop build runs.

Frontend: **React 19 + TypeScript + Vite**. Same code serves the desktop WebView and the web app.
Editor (Phase 4): **CodeMirror 6**, lazy-loaded; Monaco only as an optional on-demand engine.

### Dependency policy
Runtime dependencies in Phase 1: `react`, `react-dom`, `@tauri-apps/api`, `@tauri-apps/plugin-sql`
(the last two are only imported dynamically inside the desktop shell). No UI kit, no router
library, no i18n library, no state library: each is replaced by a small in-house module
(< 150 lines) because the needs are narrow.

## 3. Module structure

```
src/
  main.tsx                 entry; boots storage → settings → i18n → shell
  app/
    modules.ts             module registry (id, icon, phase, status, lazy loader)
    Shell.tsx, Sidebar.tsx collapsible navigation, keyboard accessible
  core/
    settings/              schema, defaults, validation, React context
    theme/                 dark / light / system resolution, accent, density
    i18n/                  lazy per-locale dictionaries (az default, tr, en, ru)
    storage/               Storage interface + adapters (SQLite, IndexedDB, memory)
    perf/                  on-demand diagnostics (no polling)
  modules/
    dashboard/  settings/  performance/  status/   (Phase 1)
    <future modules>/      each one is a lazy chunk, loaded only when opened
src-tauri/                 Rust shell, SQLite migrations, capabilities
docs/                      architecture, status
```

Every navigation entry maps to a registry record. Opening a module calls its `load()`
(a dynamic `import()`), so Vite emits it as a separate chunk and nothing is loaded until used.
Modules that do not exist yet render one shared, honest status page (phase + "not started")
instead of fake UI.

## 4. Storage and database design

Local-first. One `Storage` interface, three adapters:

* **SQLite** (desktop, via `tauri-plugin-sql`) — migrations in `src-tauri/migrations`.
* **IndexedDB** (web) — same logical tables as object stores.
* **Memory** (tests, private-mode fallback).

Educational content and personal data live in separate databases:
`content.db` (read-mostly, replaceable by content packs) and `user.db` (personal data).

### user.db — Phase 1 tables (implemented)
| Table | Columns | Purpose |
|---|---|---|
| `schema_version` | version, applied_at | migration tracking |
| `settings` | key PK, value JSON, updated_at | all preferences |
| `activity` | id PK, kind, ref, created_at (indexed) | recent activity on dashboard |

### user.db — planned tables
`profiles`, `progress(lesson_id, state, score, updated_at)`, `bookmarks`, `notes` + `notes_fts` (FTS5),
`note_folders`, `tags`, `snippets` + `snippets_fts`, `flashcards(ease, interval, due_at)`,
`roadmaps`, `roadmap_steps`, `search_history`, `projects`, `project_tasks`, `sync_log`.
All user rows carry `id (UUIDv7)`, `updated_at`, `deleted_at` (tombstone) and `rev` so the
Phase 7 cloud sync can do conflict-aware merges.

### Content storage — current state (phase 2)
Educational content is stored as typed data modules in `src/content/` (catalog files + one file per
lesson, lazy-loaded). This keeps the UI generic and content-driven without a server. When Universal
Search (phase 3) needs FTS5, these modules will be compiled into `content.db` at build time.

### user.db — implemented in phase 2
`progress(lesson_id PK, state CHECK(started|attempted|completed), best_score, attempts, updated_at)`
— migration `0002_progress.sql` (SQLite) / IndexedDB version 2.

### content.db — planned tables
`languages`, `fields`, `technologies`, `lessons`, `lesson_translations(lesson_id, locale, status,
reviewed_at, source_urls)`, `examples`, `exercises`, `quiz_items`, `terms`, `terms_fts` (FTS5,
one row per locale). Translation completeness is a column, so an untranslated lesson is never
shown as complete.

### Secrets
API keys are never stored in either database. Desktop: Windows Credential Manager via a Rust
command (Phase 3, `keyring` crate). Web: AI calls go through a server-side proxy only.

## 5. Theming and i18n

* Theme tokens are CSS custom properties from the spec palette; `<html data-theme>` switches them
  instantly. System mode listens to `prefers-color-scheme` change events (no polling).
* Locale dictionaries are JSON files loaded with `import()`; only the active locale is in memory.
  Missing keys fall back to English and are reported by a unit test that checks key parity.
* Interface language and lesson language are independent settings.

## 6. Performance budgets (targets, not claims)

| Metric | Target | How measured |
|---|---|---|
| Installer | < 150 MB (aim < 20 MB) | size of NSIS/MSI output |
| Initial JS (gzip) | < 120 KB | `vite build` report |
| Idle RAM | < 250 MB | Task Manager / diagnostics page |
| Idle CPU | ~0 % | no timers or polling when idle |
| Cold start | < 1.5 s on typical hardware | `performance.now()` at first render |

## 7. Roadmap

Phases follow the specification (§41). Each phase ends with tests and a STATUS.md update.

1. Core foundation — this phase.
2. Content engine: content.db, language/field/technology catalogs, lesson renderer, progress.
3. Intelligent features: FTS5 search, code explanation (local AST via Lezer first, optional AI), error translator, comparison.
4. Code Lab (CodeMirror 6), sandboxed execution of locally installed runtimes, exercises.
5. Notes, code library, cheat sheets, flashcards (SM-2), roadmap, backup/export.
6. Git academy, Git visualizer (simulated repo, never touches real repos), project center.
7. Accounts (Supabase Auth), sync, web deploy (Cloudflare Pages), workspaces (Yjs + provider abstraction).
8. Cybersecurity academy (defensive, educational), optional WSL2 detection with confirmed commands only.
9. VS Code and Visual Studio extensions (separate SDKs).
10. Optimization, security review, signed releases.
