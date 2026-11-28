# CODEVERSE — Development Status

Last updated: 2026-11-28 · Version 0.2.0 (+ unreleased changes below)

## Unreleased — Modern interface, TypeScript, web preview, faster navigation (2026-11-28)

### Interface
| Item | Evidence |
|---|---|
| Redesigned sidebar: logo mark, one active highlight that glides to the current section (moved with `transform`), footer with "Search and jump" (Ctrl+K) and a light/dark switch; narrow windows stack the footer | browser, light + dark, 390 px |
| **Command palette (Ctrl+K)**: sections, all lessons and actions (run Python/TypeScript, web preview, new note, theme, sidebar), accent-insensitive filtering, ↑/↓/Enter/Esc, "search everywhere" fallback; lazy chunk (1.7 KB gzip) | browser: "pyth" → Enter opened Code Lab with Python |
| Page transitions (fade/slide 240 ms), card and button hover/press feedback, staggered dashboard entrance; all motion turns off with Reduce motion, the OS setting or low-resource mode | code review (`--dur`/`--dur-slow` → 0) |
| Dashboard hero: time-of-day greeting, "Continue: <lesson>" button, lessons / solved tasks / minutes today / streak, quick links (Python, web preview, challenges, flashcards, visual learning, Git visualizer) | browser |
| Code Lab deep links: `#/codelab?lang=python|typescript|web|sql|javascript` | browser |

### New runnable languages
| Item | Evidence |
|---|---|
| **TypeScript** in Code Lab and lessons: Sucrase removes types (lines kept, so error lines match), then the JS sandbox runs it; honest note that types are not checked; Sucrase is a lazy chunk (46 KB gzip) loaded on the first TypeScript run | tests + browser (syntax error reported on line 2) |
| **HTML + CSS + JS live preview**: three editors (CodeMirror HTML/CSS grammars, lazy), debounced live update, console and errors forwarded with the line in the learner's JS file; frame sandboxed without `allow-same-origin` | browser: storage, parent window and network all blocked inside the preview |

### New lessons (az + en, auto-checked exercise, 3 examples, 3 mistakes, quiz)
* `javascript-objects`, `python-dictionaries`, `typescript-basics` → 13 lessons; every lesson exercise is auto-checked.
* New test: **every JavaScript, TypeScript and Python example in every lesson is executed and must print exactly the documented output** (all 13 lessons pass).

### Performance
| Measurement (Chromium, production build) | Before | After |
|---|---|---|
| Opening a section for the first time | ≈ 312 ms, "Loading…" flashes | 10–47 ms, no flash |
| Opening a lesson | ≈ 353 ms | 63–83 ms |
| Startup JS | 72.4 KB gzip | 74.3 KB gzip (+palette bus, hero, study tracker) |

Cause: React 19 keeps a Suspense fallback visible for at least 300 ms. Navigation now runs as a
transition (`startTransition` in the router) with one Suspense boundary that stays mounted, so the
previous page stays visible until the next one is ready. The inner lesson boundary was removed.
The Rust release profile was already size-optimised (LTO, `opt-level = "s"`, strip, abort).

### Honest limitations
* TypeScript is not type-checked inside the app.
* HTML/CSS lessons are not written yet (the live preview is there for practice).
* New lesson texts were written by me against the cited docs and are not reviewed by a native Azerbaijani speaker; tr/ru lesson bodies remain untranslated like the others.
* Not verified inside the WebView2 desktop window (Chromium + the desktop CSP only).

## Unreleased — Python runtime and study time (2026-11-28)

### Python can now be executed (offline)
| Item | Evidence |
|---|---|
| **Python 3.14 runtime**: Pyodide 314.0.8 (CPython compiled to WebAssembly) shipped inside the app under `/pyodide/` (copied from `node_modules` by `scripts/copy-pyodide.mjs` before `dev`/`build`; not committed) — works without internet | browser: runs under the exact CSP from `tauri.conf.json` |
| Sandbox: module worker kept warm between runs (first load ≈ 2–3 s, later runs a few ms); every run gets fresh globals; network APIs removed from the worker after start-up (`js.fetch` is `None`); 5 s limit — an endless loop terminates the worker and the next run starts a new one; output capped like JS | browser: `while True` stopped at 5 s, next run worked |
| Errors: CPython-style traceback reduced to the learner's own frames (`main.py`) with source lines and the correct line number; syntax/indentation errors with their line; known errors linked to the Error Translator | tests + browser (`ZeroDivisionError` → translator card) |
| `input()` raises a clear `InputNotSupported` error with a hint (there is no keyboard in the sandbox) instead of hanging; `sys.exit()` ends the program normally | tests + browser |
| Code Lab: Python 3 option with a starter program; the interpreter preloads in the background as soon as Python is selected | browser |
| All 5 Python lesson exercises now have an in-lesson editor with automatic checking (every lesson is now auto-checked) | browser: starter fails, solution passes and is stored |
| Interactive Learning: 5 Python challenges (levels 1–3) and 3 Python debug tasks | tests run every reference solution through real Pyodide; buggy starters verified not to pass |

### Study-time tracking
| Item | Evidence |
|---|---|
| Time counts while the window is visible and the learner was active (key, click, scroll, touch) in the last 2 minutes; one tick adds at most 30 s (sleep/resume safe); no timer while the window is hidden; saved once a minute and on leaving | unit tests (fake timers) |
| Stored per local day in the generic `items` table (collection `study`) — no migration needed | tests |
| Dashboard "Daily goal" card: today's minutes vs. goal with progress bar, minutes left / goal reached, goal streak, last 7 days chart; own weekday names (Chromium/WebView2 has no Azerbaijani short weekdays) | browser, light + dark |
| Respects Settings → Privacy → "record activity"; "clear activity" also deletes study time (texts updated in 4 languages) | code review |

### Other fixes
* Progress bars (`.bar`) were nearly invisible (track colour = card colour in light mode); the track now uses the border colour.
* Help texts with `code` in the run console are rendered as code instead of raw backticks.

### Honest limitations
* **Not yet verified inside the desktop WebView2 window** — verified in Chromium with the desktop CSP. Please run `npm run tauri dev` once and open Code Lab → Python.
* The installer grows: Pyodide is ≈ 13 MB on disk (≈ 6 MB compressed), so expect an installer of roughly 8–9 MB instead of 2.6 MB (still far below the 150 MB budget). Not measured — needs a Windows build.
* Only the Python standard library is available; third-party packages (numpy, pandas…) are not bundled.
* Python tasks are checked by printed output, like JS/SQL.


## Installer (0.2.0)
* NSIS only (the English-only MSI was dropped). Installs per user into
  `%LOCALAPPDATA%\CODEVERSE` without administrator rights; Start-menu folder "CODEVERSE" and a
  desktop shortcut; uninstall entry under Apps (publisher "CODEVERSE", category Education).
* Installer languages: Turkish, English, Russian with a language selector (NSIS has no
  Azerbaijani language file; the OS language is chosen automatically). The app itself starts in
  Azerbaijani.
* Same identifier as before, so installed and development builds share the user database.
* Verified on this machine: silent install exit code 0, registry entry 0.2.0, shortcuts present,
  installed app launched and wrote its start-up record into the existing database (no data lost).
* Not code-signed: Windows SmartScreen will warn when the installer is downloaded on another PC.

## Remaining sections (user request: make every section work)

The app UI no longer mentions phases; unfinished sections are only faded in the sidebar.

### Built in this round
| Section | What works | Evidence |
|---|---|---|
| **My Notes** | create/edit/delete (with confirmation), folders, tags, favourites, search, automatic saving (700 ms debounce + on leave), safe Markdown preview (headings, lists, task lists, quotes, code fences with highlighting, links http/https only, no HTML injection), lesson- and project-linked notes, Markdown download per note, JSON export/import (validated) | browser (create → type → preview → reload persists) + tests |
| **Code Library** | snippets with title, description, language, tags, favourites, explanation (Markdown), lesson link; CodeMirror editor for JS/TS/Python/SQL; search, language filter, sort; copy; "Explain this code"; JSON export/import | tests (validators) |
| **Flashcards** | SM-2 spaced repetition (Again/Hard/Good/Easy), due queue, weak-card review, retention stats, custom cards with decks and code, starter decks generated from the keyword knowledge base (text follows the lesson language), JSON export/import; no notifications | browser (24 cards added, review lowers due count) + SM-2 tests |
| **Learning Roadmap** | 12 career paths (all specified), optional starting questions (skill level + goal), follow several paths, lesson steps complete automatically from passed knowledge checks, other steps ticked manually, custom steps, personal goal, next-step recommendation, weak-topic revision list | browser + path integrity tests |
| **Project Center** | personal projects (status, technologies, tags, repo link https-only, tasks, Markdown notes, linked notes, history), 6 project guides (calculator, to-do, portfolio, quiz, SQL report, REST API) with objectives, prerequisites, milestones, testing, evaluation and starter files; starting a guide copies milestones into tasks; JSON export/import | browser (guide → project → task done → history) |
| **Cheat Sheets** (sub-agent) | 6 sheets (Python, JavaScript, SQL, HTML, CSS, Git), 50 sections, 297 entries, cross-sheet search (diacritic-insensitive), bookmarks per section, official docs links | 11 tests |
| **Git & GitHub** (sub-agent) | 34 topics (Git 12, GitHub 13, other platforms 9) with examples, mistakes, exercise, quiz (progress `git:<id>`), docs links | 9 tests + browser |
| **Git Visualizer** (sub-agent) | pure simulated Git engine (commit, branch, switch/checkout, merge incl. conflicts, rebase, reset, tag, fetch/pull/push against a simulated origin, clone), SVG graph + text alternative, 8 guided scenarios, free play | 33 tests + browser (fast-forward scenario completed by typing commands) |
| **Visual Learning** (sub-agent) | 13 step-through diagrams (memory, call stack, recursion, loops, arrays, references, objects, HTTP, client–server, DB relations, stack/queue, linear vs binary search, event loop) with code-line highlight, keyboard ←/→, text alternatives, reduced-motion support | 91 tests (event-loop order and binary search verified by running them) + browser |
| **Cybersecurity & Kali Linux Academy** (sub-agent) | 54 educational/defensive topics in modules A–G + roadmap; vulnerabilities only as insecure-vs-fixed patterns; authorised-use notices; honest note that no Kali/WSL integration exists and nothing is executed | 9 tests + browser |
| Storage v4 | generic `items` collection table (SQLite migration 0004, IndexedDB v6 — version bump and store creation done in one edit) | tests; desktop migrations 1–4 applied, 182 activity rows kept |
| Overall | `npm test` → 12 files, **268 tests passed**; `tsc` clean; startup JS 72 KB gzip; desktop installer 2.63 MB | |

Sub-agent content notes: documentation URLs were written from memory and not fetched; OWASP Top 10
is taught in its 2021 edition with a pointer to newer editions; Azerbaijani text has not been
reviewed by a native speaker.

### Bug fixed
* Opening a lesson before saved progress had loaded (e.g. reloading on a lesson page) wrote a fresh
  "started" record over a stored "completed" one. Opens are now queued until progress has loaded.
  Verified: pass quiz → reload on the lesson page → still completed. The desktop database was
  checked and had no lost completions.

### Not built — needs a decision
* **Online Workspace** requires a cloud backend (accounts, database, realtime sync), e.g. a
  Supabase project created by the user. Not started without the user's approval and account.
* **AI provider integration** — not built (optional per spec).

---

## Phase 4 — Interactive learning

### Completed (and tested)
| Item | Evidence |
|---|---|
| CodeMirror 6 editor: highlighting, line numbers, bracket matching/closing, auto-completion, undo history, Tab indent, Ctrl+Enter to run; Settings → Editor (line numbers, wrap, brackets, tab size, font, size, auto-save) applied live; colours follow the theme | browser |
| Lazy loading: editor core 110 KB gzip loads only on pages that edit code; each language grammar (9–34 KB) only when used; SQLite WASM (341 KB gzip) only on the first SQL run. Startup JS unchanged at ~71 KB | build output |
| **JavaScript sandbox**: fresh Blob worker per run; network/storage/loading APIs removed (`fetch`, `XMLHttpRequest`, `WebSocket`, `importScripts`, `indexedDB`, … — verified `undefined` at runtime); 3 s timeout terminates infinite loops; output capped (1 000 lines / 50 000 chars); waits for pending `setTimeout`s like Node; runtime and syntax errors reported with the correct user line | browser: all cases exercised |
| **SQL sandbox**: SQLite (sql.js 1.17, WebAssembly) in a module worker; fresh in-memory practice DB (`users`, `orders`) per run; 6 s timeout; results printed as tables | browser + unit tests run real SQLite |
| Node-style output formatting (arrays, objects, Map/Set, nesting, circular) shared by the sandbox and the lessons | unit tests |
| **Code Lab**: JS / SQL, run, reset, copy, draft auto-save, "Explain this code" (hands the code to Smart Code Explanation), output console, errors linked to the Error Translator, runtime availability list, safety notes | browser |
| **Interactive Learning**: Challenges (10: 7 JS, 3 SQL, three difficulty levels), Debug mode (6 deliberately broken programs: 4 JS, 2 SQL, with "what was wrong" after fixing), Predict-the-output (all predict questions from all lessons), Lesson exercises list | browser |
| Automatic checking: output compared with the expected output; diff shown on failure; hints unlock only after a failed attempt; solution only after ≥ 2 attempts and all hints (or per Settings → Learning); solved tasks stored (`practice:<id>`) | browser: wrong → hint → correct → "solved" badge |
| All 5 JavaScript/SQL lesson exercises now have an in-lesson editor with automatic checking | browser (SQL lesson) + tests |
| "Default learning mode" setting now decides which Interactive Learning tab opens | code review |
| Desktop release rebuilt | installer 2.40 MB (CodeMirror + SQLite WASM included, loaded on demand) |

Test run: `npm test` → 6 files, **103 tests passed**. Every challenge, debug task and lesson
exercise is verified by actually running its reference solution (Node for JS, real SQLite via
sql.js for SQL) against the expected output, and each buggy starter is verified NOT to pass.

### Honest limitations of Phase 4
* **Python cannot be executed yet.** It needs an optional runtime (e.g. Pyodide, ~10 MB+). This is
  shown in Code Lab. Python exercises remain self-checked.
* Desktop: the CSP was extended (`worker-src 'self' blob:`, `'wasm-unsafe-eval'`) for the
  sandboxes; the release build compiles, but running code inside the desktop WebView has not been
  verified by me (see STATUS update after the user's check).
* Network blocking in the JS sandbox removes the APIs from the worker scope; it is not an OS-level
  firewall. In the desktop app the CSP additionally limits connections to the app itself.
* Build mode (projects) and Knowledge Assessment are not built; Visual Learning (also phase 4 in
  the spec) is not started.
* Checks compare printed output only (no unit tests of individual functions yet).

## Phase 3 — Intelligent features (local, no AI)

All four features run entirely on the device with deterministic rules and curated data. No code,
query or error text is sent anywhere. AI providers are **not** integrated (see limitations).

### Completed (and tested)
| Item | Evidence |
|---|---|
| Knowledge base: 70 keyword/operator/built-in/concept entries (Python, JavaScript, SQL, cross-language), az + en, linked to lessons | tests |
| **Universal Search**: one index over languages, lessons, keywords, errors, comparisons, technologies, fields; instant, ranked (exact > prefix > word > body > typo-tolerant), accent-insensitive (`deyisen` finds "dəyişən"), category filter, pasted error messages jump to the recognised error, contextual "meaning" cards (e.g. `async` in JS + Python + concept), keyword detail pages with related topics | tests + browser |
| Search history (last 50, de-duplicated, can be turned off and cleared in Settings → Privacy) and favourites | tests + browser (persist across reload) |
| Ctrl+K opens search from any page | code review |
| **Smart Code Explanation**: line-by-line explanation for Python, JavaScript and SQL; automatic language detection; block depth; "Words" panel explaining every known keyword and every name the code defines (variable, function, parameter, loop variable, class with its line); explain selection (line range or single word); coverage figure; unrecognised lines are labelled, never guessed | tests (sample function 100 % recognised) + browser |
| **Error Translator**: 23 patterns (Python 11, JavaScript 7, Node.js 1, SQL 3 + generic); captures names from the message, extracts the line number, separates "error type recognised" (certain) from "likely causes" (explicitly not verified); honest "not recognised" result; wrong/right examples; related lessons | every pattern has a test sample |
| **Language Comparison**: 8 concepts × 6 languages (Python, JavaScript, Java, C#, C++, Go) side by side, plus typing, execution model, memory management, strengths, limitations and uses | tests + browser |
| Related-topic discovery: keyword pages, search results, errors and comparisons link to related lessons/topics | browser |
| Read-only highlighting extended to Java, C#, C++, Go | browser |
| Storage v3: `search_history`, `favorites` (SQLite migration 0003; IndexedDB schema made idempotent/self-repairing) | browser: existing progress kept after upgrade; desktop: migrations 1–3 applied in place, 126 activity rows and 4 lesson-progress rows (written by real use of the desktop app) kept |
| Desktop release rebuilt | installer 1.89 MB |

Test run: `npm test` → 5 files, **79 tests passed**. Startup JS unchanged at ~71 KB gzip; the
Explain page is a 7.9 KB gzip chunk, loaded only when opened.

### Honest limitations of Phase 3
* **No AI integration yet.** No provider, model selection, API-key storage (Windows Credential
  Manager) or usage monitoring exists. The rule engine covers common single-line constructs only.
* Code explanation does not trace execution flow, predict output, explain complexity or suggest
  improvements/alternatives; multi-line expressions are reported as unrecognised.
* Explanation levels are not adapted to the user's skill level yet.
* Error patterns match English messages only; localised compiler output is not recognised.
* Search index is in memory (built on first open) rather than SQLite FTS5; fine at the current
  content size (~200 documents), to be revisited as content grows.
* The "Search language" setting was removed from the Settings UI because search already covers
  all four languages; the stored value is kept for compatibility.
* Development note: Vite hot-reload once applied a half-edited IndexedDB upgrade, leaving the dev
  database without new stores. The upgrade is now idempotent (creates whatever is missing).

---

## Phase 2 — Programming education

### Completed (and tested)
| Item | Evidence |
|---|---|
| Content schema (languages, fields, technologies, lessons) separate from UI; lessons load lazily per file | `src/content/`, each lesson is its own ~4 KB gzip chunk |
| Language catalog: all 33 specified languages (overview, kind, year, creators, typing, uses, official docs) | content tests |
| Development fields: all 27, names in 4 languages, related languages/technologies; roadmaps for Frontend and Backend | content tests, browser |
| Technology library: 47 frameworks/libraries/tools in 7 categories, official docs links, alternatives | content tests, browser |
| Lesson system following §8: intro (what/why/where), syntax breakdown, 3 examples with click-a-line explanations and output, common mistakes (wrong vs right), exercise, knowledge check, related lessons, sources + review date | browser: all 7 sections render, 13 clickable lines |
| 10 lessons, fully written in az + en — Python (5): variables, conditions, loops, lists, functions; JavaScript (4): variables, functions, conditions, arrays; SQL (1): SELECT | completeness test = 100 % for az and en; one explanation per code line enforced by test |
| Read-only highlighting for Python, JavaScript/TypeScript and SQL; code fonts show operators exactly as typed (ligatures off) | unit tests, browser |
| Translation tracking: per-lesson completeness computed automatically; tr/ru shown with "partially translated (N %)" notice, never as complete | test + browser (tr: 10 %) |
| Lesson language and "show English terms" settings applied | browser: `fonksiyon (function)` |
| Hints / solution follow Settings → Learning (progressive, on request, off / after hints, on request, never) | code review |
| Learning progress: completion only via ≥ 70 % on the knowledge check, best score kept, never downgraded | unit tests + browser (75 % → completed, stored in IndexedDB) |
| Progress page: completed, average, by language, weak topics, history, reset with confirmation | browser |
| Dashboard: completed lessons, "continue" link, weak-topic count | browser |
| Storage migration v2 (`progress` table) for SQLite and IndexedDB, plus cross-tab upgrade fix | IndexedDB verified in browser; desktop SQLite upgraded v1→v2 in place, all 61 existing activity rows kept |
| Desktop release rebuilt | installer 1.83 MB (was 1.78 MB) |

Test run: `npm test` → 4 files, **35 tests passed**.

### Honest limitations of Phase 2
* 10 lessons exist (Python, JavaScript, SQL). The other 30 languages show "lessons in preparation".
  The lesson engine is complete; content volume is the remaining work.
* Example outputs reflect the reference runtime (CPython 3, Node.js console format for arrays,
  generic table text for SQL); a browser console may format arrays slightly differently.
* Lesson facts were written against the cited official docs but are marked **"authored — not
  independently reviewed"** in the UI. Catalog year/creator facts were written from knowledge and
  not re-verified online.
* tr/ru: UI fully translated; lesson and catalog descriptions are az + en only.
* Exercises are self-checked; automatic checking needs Code Lab (phase 4).
* Field/technology pages have overview, links and relations; install guides, concepts, code
  examples and projects per technology are not written yet.
* Study-time tracking is not implemented (dashboard says so).
* Content is stored as bundled data modules, not yet in a `content.db` with FTS5 (planned with
  Universal Search, phase 3).

---

# Phase 1 — Core foundation

## Completed (and tested)

| Item | Evidence |
|---|---|
| Architecture plan, DB design, module structure, roadmap | `docs/ARCHITECTURE.md` |
| React 19 + TypeScript + Vite frontend | `npm run build` passes, strict TS |
| Minimalist design system (spec palette, tokens) | `src/styles/` — muted-text colour lifted for WCAG AA contrast |
| Collapsible, keyboard-accessible sidebar with all 23 sections + Diagnostics | checked in browser, desktop and 375 px width |
| Lazy loading: every page, every locale and each storage adapter is its own chunk | build output: 13 chunks |
| Dashboard with real local data (goal, today's activity, recent activity, build status) | browser check |
| Settings: general, appearance, language, learning, editor, privacy, backup, performance, about, reset | browser check + unit tests |
| Dark / Light / System themes, applied instantly; System follows OS via change events | browser check + unit test |
| Four-language interface (az default, tr, en, ru), switch without reload | browser check; key-parity test |
| Interface language independent from lesson/search language | settings fields present |
| Local database: IndexedDB adapter (web) with versioned migration | browser check: persists across reload |
| Settings export / import (validated, size-limited) and reset with confirmation | unit tests + browser check of reset |
| Diagnostics page (on demand only, no polling) | browser check |

### Test run (actually executed)
`npm test` → 3 files, **24 tests passed** (locale parity and placeholders, every `t("…")` key exists,
settings validation and CSS-injection guard, export/import round trip, theme resolution, storage
semantics, background-listener registry).

### Measurements (web build, not desktop)
* Initial JS: **238 KB raw / 75.5 KB gzip** (budget 120 KB gzip). CSS 2.6 KB gzip.
* Per-page chunks: Dashboard 1.1 KB, Settings 3.3 KB, Diagnostics 0.9 KB gzip; locales 3.9–5.4 KB gzip.
* Dev-mode startup to first paint: 76 ms; JS heap 10.3 MB (Chromium, dev server, so not representative of release).

### Desktop build (Tauri 2, Rust 1.100, release profile) — measured 2026-11-22
| Metric | Result | Budget |
|---|---|---|
| NSIS installer | **1.78 MB** | < 150 MB |
| MSI installer | 2.38 MB | — |
| `codeverse.exe` | 4.4 MB | — |
| Window ready (input idle) | 879 ms | < 1.5 s |
| Memory, private bytes (app + its WebView2 processes) | **177 MB** | < 250 MB |
| Memory, working-set sum | 366 MB (counts shared WebView2 pages several times) | — |
| Idle CPU over 10 s | ≈ 0.16 % of one core | ~0 % |

SQLite verified in the desktop app: migration v1 applied (`_sqlx_migrations`), `settings` and `activity`
tables created, activity rows written while navigating.

## In progress
* Settings write path on desktop SQLite: same code path as activity writes, but not yet observed
  with a real settings change in the desktop window.

## Blocked
* Nothing.

## Not started
Phases 2–10 (see ARCHITECTURE.md §7). Each unbuilt section opens an honest status page stating its
planned phase — no fake controls.

Settings groups deferred until their features exist: AI (phase 3), notifications (5), account & sync (7),
IDE integrations (9), updates (10). Editor, hint, solution, lesson-language and search-language
preferences are stored now and labelled with the phase that will use them.

## Known issues / limitations
* Windows 260-character path limit: in a deeply nested project folder the Rust linker fails
  (LNK1104). Build with a short target dir: `$env:CARGO_TARGET_DIR = "$env:LOCALAPPDATA\cvt"`.
* `sqlite.ts` reads tauri-plugin-sql's internal `_sqlx_migrations` table for the schema version
  (verified working with plugin 2.x; may change in a future major version).
* `tauri build` downloads NSIS and WiX from GitHub on first run (Tauri's standard bundler tools).
* Installers are not code-signed yet (phase 10); Windows SmartScreen will warn on install.
* Fonts use a system stack (`Inter`/`Segoe UI`, `JetBrains Mono`/`Cascadia Code`) instead of bundling
  font files, to save size; Inter and JetBrains Mono appear only if installed.
* Study time is not tracked yet, because there are no lessons (phase 2); the dashboard says so.
* Test coverage is unit-level only; no end-to-end test runner yet.
