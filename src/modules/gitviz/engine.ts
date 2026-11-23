// Pure, simulated Git engine for the Git Visualizer. It never touches a real repository or the
// file system: every command maps an immutable GitState to a new GitState plus Git-like output
// and a short explanation (az + en). Commit ids are short and deterministic (C0, C1, …).
import type { L } from "../../content/types";

export interface Commit {
  id: string;
  parents: string[];
  message: string;
  /** Branch that was checked out when the commit was created (used for graph lanes). */
  branch: string;
  /** Files the commit changed (simulated; drives conflict detection). */
  files: string[];
  author: "you" | "teammate";
  /** Set on commits created by rebase: the original commit that was replayed. */
  copyOf?: string;
}

export interface RepoData {
  commits: Record<string, Commit>;
  /** Creation order of commit ids. */
  order: string[];
  branches: Record<string, string>;
  tags: Record<string, string>;
}

export type Head = { kind: "branch"; name: string } | { kind: "detached"; id: string };

export interface MergeState {
  theirs: string;
  message: string;
  conflicts: string[];
  resolved: string[];
}

export interface GitState extends RepoData {
  initialized: boolean;
  head: Head;
  /** URL of the "origin" remote, or null when no remote is configured. */
  remoteUrl: string | null;
  /** Remote-tracking branches as last fetched: origin/<name> → commit id. */
  tracking: Record<string, string>;
  /** Local branch → remote branch it tracks on origin. */
  upstream: Record<string, string>;
  /** The simulated server repository behind "origin". */
  server: RepoData;
  modified: string[];
  staged: string[];
  merge: MergeState | null;
  counter: number;
}

export interface RunResult {
  state: GitState;
  ok: boolean;
  output: string[];
  explain: L;
  /** The UI should clear the terminal log. */
  clear?: boolean;
}

export const DEFAULT_URL = "https://example.com/team/project.git";
const WORKDIR = "/sandbox/project";

const ex = (az: string, en: string): L => ({ az, en });

// ---------------------------------------------------------------- state helpers

const emptyRepo = (): RepoData => ({ commits: {}, order: [], branches: {}, tags: {} });

export function initialState(): GitState {
  return {
    ...emptyRepo(),
    initialized: false,
    head: { kind: "branch", name: "main" },
    remoteUrl: null,
    tracking: {},
    upstream: {},
    server: emptyRepo(),
    modified: [],
    staged: [],
    merge: null,
    counter: 0,
  };
}

const copyRepo = (r: RepoData): RepoData => ({ commits: { ...r.commits }, order: [...r.order], branches: { ...r.branches }, tags: { ...r.tags } });

function copy(s: GitState): GitState {
  return {
    ...s,
    ...copyRepo(s),
    tracking: { ...s.tracking },
    upstream: { ...s.upstream },
    server: copyRepo(s.server),
    modified: [...s.modified],
    staged: [...s.staged],
    merge: s.merge ? { ...s.merge, conflicts: [...s.merge.conflicts], resolved: [...s.merge.resolved] } : null,
    head: { ...s.head },
  };
}

export function headId(s: GitState): string | null {
  return s.head.kind === "branch" ? (s.branches[s.head.name] ?? null) : s.head.id;
}

export function ancestors(repo: RepoData, id: string | null | undefined): Set<string> {
  const out = new Set<string>();
  if (!id) return out;
  const stack = [id];
  while (stack.length) {
    const c = stack.pop()!;
    if (out.has(c) || !repo.commits[c]) continue;
    out.add(c);
    stack.push(...repo.commits[c].parents);
  }
  return out;
}

export const isAncestor = (repo: RepoData, a: string, b: string) => ancestors(repo, b).has(a);

export function mergeBase(repo: RepoData, a: string, b: string): string | null {
  const A = ancestors(repo, a);
  const common = [...ancestors(repo, b)].filter((x) => A.has(x));
  const best = common.filter((c) => !common.some((o) => o !== c && ancestors(repo, o).has(c)));
  best.sort((x, y) => repo.order.indexOf(y) - repo.order.indexOf(x));
  return best[0] ?? null;
}

/** Commits reachable from `tip` but not from `base`, oldest first. */
function commitsSince(repo: RepoData, base: string | null, tip: string): string[] {
  const exclude = ancestors(repo, base);
  return [...ancestors(repo, tip)].filter((c) => !exclude.has(c)).sort((x, y) => repo.order.indexOf(x) - repo.order.indexOf(y));
}

const filesSince = (repo: RepoData, base: string | null, tip: string) => new Set(commitsSince(repo, base, tip).flatMap((c) => repo.commits[c].files));

function addCommit(s: GitState, repo: RepoData, c: Omit<Commit, "id">): string {
  const id = `C${s.counter++}`;
  repo.commits[id] = { ...c, id };
  repo.order.push(id);
  return id;
}

/** Copies commits (and their ancestors) from one repository into another. */
function transfer(from: RepoData, to: RepoData, tip: string) {
  const ids = [...ancestors(from, tip)].filter((c) => !to.commits[c]).sort((x, y) => from.order.indexOf(x) - from.order.indexOf(y));
  for (const c of ids) {
    to.commits[c] = from.commits[c];
    to.order.push(c);
  }
  return ids.length;
}

function setHeadTo(s: GitState, id: string) {
  if (s.head.kind === "branch") s.branches[s.head.name] = id;
  else s.head = { kind: "detached", id };
}

const headLabel = (s: GitState) => (s.head.kind === "branch" ? s.head.name : "detached");
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
const uniq = (xs: string[]) => [...new Set(xs)];

/** Resolves HEAD, branches, tags, origin/<branch>, commit ids and ~n / ^n suffixes. */
export function resolveRef(s: GitState, ref: string): string | null {
  const m = /^(.*?)((?:[~^]\d*)*)$/.exec(ref);
  if (!m || !m[1]) return null;
  const base = m[1];
  let id: string | null = null;
  if (base === "HEAD" || base === "@") id = headId(s);
  else if (s.branches[base]) id = s.branches[base];
  else if (s.tags[base]) id = s.tags[base];
  else if (base.startsWith("origin/") && s.tracking[base.slice(7)]) id = s.tracking[base.slice(7)];
  else if (/^c\d+$/i.test(base) && s.commits[base.toUpperCase()]) id = base.toUpperCase();
  if (!id) return null;
  for (const op of m[2].match(/[~^]\d*/g) ?? []) {
    const n = op.length > 1 ? Number(op.slice(1)) : 1;
    if (op[0] === "~") {
      for (let i = 0; i < n && id; i++) id = s.commits[id]?.parents[0] ?? null;
    } else if (n > 0) id = s.commits[id]?.parents[n - 1] ?? null;
    if (!id) return null;
  }
  return id;
}

export function isValidBranchName(name: string): boolean {
  return (
    /^[A-Za-z0-9._/-]+$/.test(name) &&
    !name.startsWith("-") &&
    !name.startsWith("/") &&
    !name.endsWith("/") &&
    !name.endsWith(".") &&
    !name.endsWith(".lock") &&
    !name.includes("..") &&
    !name.includes("//") &&
    name !== "HEAD"
  );
}

/** Shell-like split honouring single and double quotes. Returns null on an unclosed quote. */
export function tokenize(input: string): string[] | null {
  const out: string[] = [];
  let cur = "";
  let quote: string | null = null;
  let has = false;
  for (const ch of input) {
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      has = true;
    } else if (/\s/.test(ch)) {
      if (has || cur) out.push(cur);
      cur = "";
      has = false;
    } else cur += ch;
  }
  if (quote) return null;
  if (has || cur) out.push(cur);
  return out;
}

/** "HEAD -> main, origin/main, tag: v1" style decorations for a commit. */
export function decorations(s: GitState, id: string): string[] {
  const out: string[] = [];
  if (s.head.kind === "detached" && s.head.id === id) out.push("HEAD");
  for (const b of Object.keys(s.branches).sort()) {
    if (s.branches[b] !== id) continue;
    out.push(s.head.kind === "branch" && s.head.name === b ? `HEAD -> ${b}` : b);
  }
  for (const b of Object.keys(s.tracking).sort()) if (s.tracking[b] === id) out.push(`origin/${b}`);
  for (const t of Object.keys(s.tags).sort()) if (s.tags[t] === id) out.push(`tag: ${t}`);
  return out;
}

// ---------------------------------------------------------------- result helpers

const okR = (state: GitState, output: string[], explain: L): RunResult => ({ state, ok: true, output, explain });
const failR = (state: GitState, output: string[], explain: L): RunResult => ({ state, ok: false, output, explain });

const notRepo = (s: GitState) =>
  failR(s, ["fatal: not a git repository (or any of the parent directories): .git"], ex(
    "Bu qovluq hələ Git repozitoriyası deyil. Əvvəlcə `git init` ilə yeni repozitoriya yarat və ya `git clone <url>` ilə mövcud olanı köçür.",
    "This folder is not a Git repository yet. Create one with `git init` or copy an existing one with `git clone <url>`.",
  ));

const noRemote = (s: GitState, name = "origin") =>
  failR(s, [`fatal: '${name}' does not appear to be a git repository`, "fatal: Could not read from remote repository."], ex(
    `\`${name}\` adlı uzaq repozitoriya qoşulmayıb. Sınaq mühitində yalnız \`origin\` var: onu \`git remote add origin <url>\` ilə əlavə et və ya \`git clone\` istifadə et.`,
    `No remote called \`${name}\` is configured. The sandbox has a single remote, \`origin\`: add it with \`git remote add origin <url>\` or use \`git clone\`.`,
  ));

const unbornErr = (s: GitState) =>
  failR(s, [`fatal: your current branch '${headLabel(s)}' does not have any commits yet`], ex(
    "Budaqda hələ heç bir commit yoxdur. Əvvəlcə `git commit -m \"...\"` ilə ilk commit-i yarat.",
    "The branch has no commits yet. Create the first one with `git commit -m \"...\"`.",
  ));

const mergeBlock = (s: GitState, line: string) =>
  failR(s, [line], ex(
    "Yarımçıq birləşmə (merge) var. Əvvəlcə münaqişələri həll et: faylı düzəlt, `git add <fayl>` və `git commit` et. İmtina etmək üçün `git merge --abort`.",
    "A merge is in progress. Resolve the conflicts first: fix the file, run `git add <file>` and `git commit`. To give up, run `git merge --abort`.",
  ));

// ---------------------------------------------------------------- commands

function cmdInit(s: GitState): RunResult {
  if (s.initialized) return okR(s, [`Reinitialized existing Git repository in ${WORKDIR}/.git/`], ex("Repozitoriya artıq mövcuddur; heç nə dəyişmədi.", "The repository already exists; nothing changed."));
  const n = copy(s);
  n.initialized = true;
  n.head = { kind: "branch", name: "main" };
  return okR(n, [`Initialized empty Git repository in ${WORKDIR}/.git/`], ex(
    "Boş repozitoriya yaradıldı. `HEAD` hələ commit-i olmayan `main` budağını göstərir. İndi `git commit -m \"...\"` ilə ilk commit-i yarat.",
    "An empty repository was created. `HEAD` points at `main`, which has no commits yet. Now create the first commit with `git commit -m \"...\"`.",
  ));
}

function cmdCommit(s: GitState, args: string[]): RunResult {
  let msg: string | null = null;
  let all = false;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "-m" || a === "--message") {
      if (i + 1 >= args.length) return failR(s, ["error: switch `m' requires a value"], ex("`-m` sonra mesaj tələb edir: `git commit -m \"mesaj\"`.", "`-m` needs a message: `git commit -m \"message\"`."));
      msg = args[++i];
    } else if (a === "-a" || a === "--all") all = true;
    else if (a === "-am") {
      all = true;
      if (i + 1 >= args.length) return failR(s, ["error: switch `m' requires a value"], ex("`-am` sonra mesaj tələb edir.", "`-am` needs a message."));
      msg = args[++i];
    } else if (a === "--no-edit") {
      /* accepted while concluding a merge */
    } else if (a === "--amend")
      return failR(s, ["(sandbox) git commit --amend is not simulated here."], ex("`--amend` real Git əmridir, lakin bu sınaq mühitində simulyasiya edilmir.", "`--amend` is a real Git option but is not simulated in this sandbox."));
    else return failR(s, [`error: unknown option '${a}'`], ex(`\`${a}\` seçimi tanınmadı. Nümunə: \`git commit -m "mesaj"\`.`, `Unknown option \`${a}\`. Example: \`git commit -m "message"\`.`));
  }

  const n = copy(s);
  if (n.merge) {
    const open = n.merge.conflicts.filter((f) => !n.merge!.resolved.includes(f));
    if (open.length)
      return failR(s, ["error: Committing is not possible because you have unmerged files.", "hint: Fix them up in the work tree, and then use 'git add <file>'", "hint: as appropriate to mark resolution and make a commit.", "fatal: Exiting because of an unresolved conflict."], ex(
        `Hələ həll olunmamış münaqişə var: ${open.join(", ")}. Faylı düzəlt (\`edit ${open[0]}\`) və \`git add ${open[0]}\` ilə həll olunduğunu bildir.`,
        `There are unresolved conflicts: ${open.join(", ")}. Fix the file (\`edit ${open[0]}\`) and mark it resolved with \`git add ${open[0]}\`.`,
      ));
    const ours = headId(n)!;
    const id = addCommit(n, n, { parents: [ours, n.merge.theirs], message: msg ?? n.merge.message, branch: headLabel(n), files: [...n.merge.conflicts], author: "you" });
    setHeadTo(n, id);
    n.merge = null;
    n.modified = [];
    n.staged = [];
    return okR(n, [`[${headLabel(n)} ${id}] ${n.commits[id].message}`], ex(
      `Birləşmə tamamlandı: ${id} iki valideynli (${ours} və ${n.commits[id].parents[1]}) merge commit-dir. Münaqişə sənin seçdiyin həllə görə qeyd olundu.`,
      `Merge concluded: ${id} is a merge commit with two parents (${ours} and ${n.commits[id].parents[1]}). The conflict is recorded with the resolution you chose.`,
    ));
  }

  if (msg === null)
    return failR(s, ["(sandbox) No editor here: use git commit -m \"message\"."], ex(
      "Real Git mesaj yazmaq üçün redaktor açardı. Sınaq mühitində mesajı `-m` ilə ver: `git commit -m \"mesaj\"`.",
      "Real Git would open an editor for the message. In the sandbox pass it with `-m`: `git commit -m \"message\"`.",
    ));
  if (!msg.trim()) return failR(s, ["Aborting commit due to empty commit message."], ex("Commit mesajı boş ola bilməz.", "A commit message cannot be empty."));

  if (all) {
    n.staged = uniq([...n.staged, ...n.modified]);
    n.modified = [];
  }
  if (!n.staged.length && n.modified.length)
    return failR(s, [`Changes not staged for commit:`, ...n.modified.map((f) => `\tmodified:   ${f}`), "", 'no changes added to commit (use "git add" and/or "git commit -a")'], ex(
      "Dəyişikliklər var, lakin heç biri commit üçün hazırlanmayıb (staging). Əvvəlcə `git add <fayl>` və ya `git add .` et, yaxud `git commit -am \"...\"` istifadə et.",
      "There are changes but none are staged. Run `git add <file>` or `git add .` first, or use `git commit -am \"...\"`.",
    ));
  const simulated = !n.staged.length;
  const files = simulated ? [`c${n.counter}.txt`] : [...n.staged];
  const parent = headId(n);
  const id = addCommit(n, n, { parents: parent ? [parent] : [], message: msg, branch: headLabel(n), files, author: "you" });
  setHeadTo(n, id);
  n.staged = [];
  const where = n.head.kind === "branch" ? n.head.name : "detached HEAD";
  const out = [`[${where}${parent ? "" : " (root-commit)"} ${id}] ${msg}`, ` ${plural(files.length, "file")} changed`];
  const note = simulated ? ex(" (Sınaq mühiti fayl dəyişikliyini avtomatik simulyasiya etdi.)", " (The sandbox simulated a file change for you.)") : ex("", "");
  const base = parent
    ? ex(`Yeni commit ${id} yaradıldı; valideyni ${parent}-dir. ${n.head.kind === "branch" ? `\`${n.head.name}\` budağı irəli, ${id}-ə keçdi.` : "HEAD ayrılmış vəziyyətdədir: bu commit heç bir budağa aid deyil."}`, `New commit ${id} was created with parent ${parent}. ${n.head.kind === "branch" ? `Branch \`${n.head.name}\` moved forward to ${id}.` : "HEAD is detached: this commit belongs to no branch."}`)
    : ex(`İlk (root) commit ${id} yaradıldı: onun valideyni yoxdur. \`${headLabel(n)}\` budağı indi mövcuddur.`, `The first (root) commit ${id} was created: it has no parent. Branch \`${headLabel(n)}\` now exists.`);
  return okR(n, out, { az: base.az! + note.az!, en: base.en! + note.en! });
}

function cmdEdit(s: GitState, args: string[]): RunResult {
  if (!s.initialized) return notRepo(s);
  if (!args.length) return failR(s, ["usage: edit <file>..."], ex("Fayl adı yaz: `edit README.md`.", "Give a file name: `edit README.md`."));
  const n = copy(s);
  n.modified = uniq([...n.modified, ...args]);
  const conflict = n.merge ? args.filter((f) => n.merge!.conflicts.includes(f)) : [];
  return okR(n, args.map((f) => `(sandbox) edited ${f}`), conflict.length
    ? ex(`Münaqişə işarələrini (<<<<<<<, =======, >>>>>>>) sildin və ${conflict.join(", ")} faylında son variantı saxladın. İndi \`git add ${conflict[0]}\` ilə həll olunduğunu bildir.`, `You removed the conflict markers (<<<<<<<, =======, >>>>>>>) and kept the final version of ${conflict.join(", ")}. Now mark it resolved with \`git add ${conflict[0]}\`.`)
    : ex(`İş qovluğunda dəyişiklik simulyasiya edildi: ${args.join(", ")}. Bunlar hələ commit üçün hazırlanmayıb; \`git add\` ilə hazırla.`, `A change in the working tree was simulated: ${args.join(", ")}. It is not staged yet; stage it with \`git add\`.`));
}

function cmdAdd(s: GitState, args: string[]): RunResult {
  if (!args.length) return failR(s, ["Nothing specified, nothing added.", "hint: Maybe you wanted to say 'git add .'?"], ex("Hansı faylı əlavə edəcəyini yaz, məsələn `git add .`.", "Say which file to add, e.g. `git add .`."));
  const n = copy(s);
  const everything = args.some((a) => a === "." || a === "-A" || a === "--all");
  const known = new Set(Object.values(n.commits).flatMap((c) => c.files));
  const targets = everything ? uniq([...n.modified, ...(n.merge?.conflicts ?? [])]) : args;
  for (const f of targets) {
    const isConflict = !!n.merge?.conflicts.includes(f);
    if (!n.modified.includes(f) && !isConflict && !known.has(f))
      return failR(s, [`fatal: pathspec '${f}' did not match any files`], ex(`\`${f}\` adlı dəyişmiş fayl yoxdur. Sınaq mühitində faylı \`edit ${f}\` ilə dəyişə bilərsən.`, `There is no changed file called \`${f}\`. In the sandbox you can change it with \`edit ${f}\`.`));
    if (n.modified.includes(f) || isConflict) n.staged = uniq([...n.staged, f]);
    n.modified = n.modified.filter((x) => x !== f);
    if (isConflict) n.merge!.resolved = uniq([...n.merge!.resolved, f]);
  }
  const open = n.merge ? n.merge.conflicts.filter((f) => !n.merge!.resolved.includes(f)) : [];
  const text = n.merge
    ? open.length
      ? ex(`Fayl həll olunmuş kimi qeyd edildi. Qalan münaqişələr: ${open.join(", ")}.`, `File marked as resolved. Remaining conflicts: ${open.join(", ")}.`)
      : ex("Bütün münaqişələr həll olundu. Birləşməni bitirmək üçün `git commit` (və ya `git commit -m \"...\"`) et.", "All conflicts are resolved. Run `git commit` (or `git commit -m \"...\"`) to conclude the merge.")
    : ex(`Hazırlanmış (staged) fayllar: ${n.staged.join(", ") || "yoxdur"}. Növbəti \`git commit\` məhz bunları yadda saxlayacaq.`, `Staged files: ${n.staged.join(", ") || "none"}. The next \`git commit\` will record exactly these.`);
  return okR(n, [], text);
}

function trackingLines(s: GitState): { lines: string[]; ahead: number; behind: number } | null {
  if (s.head.kind !== "branch") return null;
  const b = s.head.name;
  const up = s.upstream[b];
  const local = s.branches[b];
  if (!up || !local || !s.tracking[up]) return null;
  const t = s.tracking[up];
  const ahead = commitsSince(s, t, local).length;
  const behind = commitsSince(s, local, t).length;
  const ref = `'origin/${up}'`;
  let lines: string[];
  if (!ahead && !behind) lines = [`Your branch is up to date with ${ref}.`];
  else if (ahead && !behind) lines = [`Your branch is ahead of ${ref} by ${plural(ahead, "commit")}.`, '  (use "git push" to publish your local commits)'];
  else if (!ahead) lines = [`Your branch is behind ${ref} by ${plural(behind, "commit")}, and can be fast-forwarded.`, '  (use "git pull" to update your local branch)'];
  else lines = [`Your branch and ${ref} have diverged,`, `and have ${ahead} and ${behind} different commits each, respectively.`, '  (use "git pull" if you want to integrate the remote branch with yours)'];
  return { lines, ahead, behind };
}

function cmdStatus(s: GitState): RunResult {
  const out: string[] = [];
  const hid = headId(s);
  out.push(s.head.kind === "branch" ? `On branch ${s.head.name}` : `HEAD detached at ${s.head.id}`);
  const tr = trackingLines(s);
  if (tr) out.push(...tr.lines);
  if (!hid) out.push("", "No commits yet");
  if (s.merge) {
    const open = s.merge.conflicts.filter((f) => !s.merge!.resolved.includes(f));
    if (open.length) out.push("You have unmerged paths.", '  (fix conflicts and run "git commit")', '  (use "git merge --abort" to abort the merge)', "", "Unmerged paths:", ...open.map((f) => `\tboth modified:   ${f}`));
    else out.push("All conflicts fixed but you are still merging.", '  (use "git commit" to conclude merge)');
  }
  if (s.staged.length) out.push("", "Changes to be committed:", ...s.staged.map((f) => `\tmodified:   ${f}`));
  if (s.modified.length) out.push("", "Changes not staged for commit:", ...s.modified.map((f) => `\tmodified:   ${f}`));
  if (!s.merge && !s.staged.length && !s.modified.length) out.push("", hid ? "nothing to commit, working tree clean" : 'nothing to commit (create/copy files and use "git add" to track)');

  let az = s.head.kind === "branch" ? `Sən \`${s.head.name}\` budağındasan.` : `HEAD ayrılmış vəziyyətdədir (${s.head.id}); heç bir budaq aktiv deyil.`;
  let en = s.head.kind === "branch" ? `You are on branch \`${s.head.name}\`.` : `HEAD is detached at ${s.head.id}; no branch is active.`;
  if (tr) {
    if (tr.ahead && tr.behind) [az, en] = [az + ` Yerli budaq və origin ayrılıb: ${tr.ahead} yerli, ${tr.behind} uzaq commit. \`git pull --rebase\` və ya \`git pull --no-rebase\` ilə birləşdir.`, en + ` Your branch and origin have diverged: ${tr.ahead} local and ${tr.behind} remote commits. Integrate with \`git pull --rebase\` or \`git pull --no-rebase\`.`];
    else if (tr.ahead) [az, en] = [az + ` ${tr.ahead} commit hələ göndərilməyib (\`git push\`).`, en + ` ${tr.ahead} commit(s) not pushed yet (\`git push\`).`];
    else if (tr.behind) [az, en] = [az + ` origin-də ${tr.behind} yeni commit var (\`git pull\`).`, en + ` origin has ${tr.behind} new commit(s) (\`git pull\`).`];
    else [az, en] = [az + " Son `fetch`-ə görə origin ilə eynisən.", en + " As of the last `fetch` you match origin."];
  }
  if (s.merge) [az, en] = [az + " Birləşmə davam edir.", en + " A merge is in progress."];
  else if (!s.staged.length && !s.modified.length) [az, en] = [az + " İş qovluğu təmizdir.", en + " The working tree is clean."];
  return okR(s, out, { az, en });
}

function cmdLog(s: GitState, args: string[]): RunResult {
  const oneline = args.includes("--oneline");
  const all = args.includes("--all");
  const refs = args.filter((a) => !a.startsWith("-"));
  const bad = args.find((a) => a.startsWith("-") && !["--oneline", "--all", "--graph"].includes(a));
  if (bad) return failR(s, [`fatal: unrecognized argument: ${bad}`], ex("Dəstəklənən seçimlər: `--oneline`, `--all`.", "Supported options: `--oneline`, `--all`."));
  let starts: string[];
  if (all) starts = uniq([headId(s), ...Object.values(s.branches), ...Object.values(s.tags), ...Object.values(s.tracking)].filter((x): x is string => !!x));
  else if (refs.length) {
    const id = resolveRef(s, refs[0]);
    if (!id) return failR(s, [`fatal: ambiguous argument '${refs[0]}': unknown revision or path not in the working tree.`], ex(`\`${refs[0]}\` adlı budaq, teq və ya commit tapılmadı.`, `No branch, tag or commit called \`${refs[0]}\`.`));
    starts = [id];
  } else {
    const h = headId(s);
    if (!h) return unbornErr(s);
    starts = [h];
  }
  const set = new Set<string>();
  for (const st of starts) ancestors(s, st).forEach((c) => set.add(c));
  const ids = [...set].sort((a, b) => s.order.indexOf(b) - s.order.indexOf(a));
  const out: string[] = [];
  for (const id of ids) {
    const c = s.commits[id];
    const d = decorations(s, id);
    const deco = d.length ? ` (${d.join(", ")})` : "";
    if (oneline) out.push(`${id}${deco} ${c.message}`);
    else {
      out.push(`commit ${id}${deco}`);
      if (c.parents.length > 1) out.push(`Merge: ${c.parents.join(" ")}`);
      out.push(`Author: ${c.author === "you" ? "You <you@example.com>" : "Teammate <teammate@example.com>"}`, "", `    ${c.message}`, "");
    }
  }
  return okR(s, out, ex(
    `Tarixçə yenidən köhnəyə doğru göstərilir (${ids.length} commit). Mötərizədə hansı budaq, teq və HEAD-in həmin commit-i göstərdiyi yazılır.`,
    `History is shown newest first (${ids.length} commits). The parentheses show which branches, tags and HEAD point at each commit.`,
  ));
}

function createBranch(n: GitState, name: string, startRef: string | undefined): RunResult | string {
  if (!isValidBranchName(name)) return failR(n, [`fatal: '${name}' is not a valid branch name`], ex(`\`${name}\` düzgün budaq adı deyil (boşluq, \`..\`, \`-\` ilə başlamaq və s. olmaz).`, `\`${name}\` is not a valid branch name (no spaces, \`..\`, leading \`-\`, etc.).`));
  if (n.branches[name]) return failR(n, [`fatal: a branch named '${name}' already exists`], ex(`\`${name}\` budağı artıq var. Ona keçmək üçün \`git switch ${name}\`.`, `Branch \`${name}\` already exists. Switch to it with \`git switch ${name}\`.`));
  const start = startRef ? resolveRef(n, startRef) : headId(n);
  if (!start) return failR(n, [`fatal: not a valid object name: '${startRef ?? headLabel(n)}'`], startRef ? ex(`\`${startRef}\` tapılmadı.`, `\`${startRef}\` was not found.`) : ex("Budaq yaratmaq üçün ən azı bir commit lazımdır: budaq sadəcə commit-ə göstəricidir.", "You need at least one commit to create a branch: a branch is just a pointer to a commit."));
  n.branches[name] = start;
  return start;
}

function cmdBranch(s: GitState, args: string[]): RunResult {
  const flags = args.filter((a) => a.startsWith("-"));
  const names = args.filter((a) => !a.startsWith("-"));
  if (flags.some((f) => f === "-d" || f === "-D" || f === "--delete")) {
    const force = flags.includes("-D");
    const name = names[0];
    if (!name) return failR(s, ["fatal: branch name required"], ex("Silinəcək budağın adını yaz: `git branch -d <ad>`.", "Name the branch to delete: `git branch -d <name>`."));
    if (!s.branches[name]) return failR(s, [`error: branch '${name}' not found.`], ex(`\`${name}\` adlı budaq yoxdur.`, `There is no branch called \`${name}\`.`));
    if (s.head.kind === "branch" && s.head.name === name) return failR(s, [`error: cannot delete branch '${name}' used by worktree at '${WORKDIR}'`], ex("Hazırda olduğun budağı silə bilməzsən. Əvvəlcə başqa budağa keç (`git switch main`).", "You cannot delete the branch you are on. Switch to another branch first (`git switch main`)."));
    const tip = s.branches[name];
    const h = headId(s);
    const up = s.upstream[name] ? s.tracking[s.upstream[name]] : undefined;
    const merged = (h && isAncestor(s, tip, h)) || (up && isAncestor(s, tip, up));
    if (!force && !merged) return failR(s, [`error: the branch '${name}' is not fully merged.`, `hint: If you are sure you want to delete it, run 'git branch -D ${name}'`], ex(`\`${name}\` budağında hələ birləşdirilməmiş commit-lər var; silinsə onlar heç bir budaqdan görünməz. Əminsənsə \`git branch -D ${name}\`.`, `\`${name}\` has commits that are not merged yet; deleting it would leave them unreachable. If you are sure, use \`git branch -D ${name}\`.`));
    const n = copy(s);
    delete n.branches[name];
    delete n.upstream[name];
    return okR(n, [`Deleted branch ${name} (was ${tip}).`], ex(`\`${name}\` budağı (göstəricisi) silindi. Commit-lərin özü silinmir; başqa budaqdan əlçatandırsa, tarixçədə qalır.`, `Branch \`${name}\` (the pointer) was deleted. Commits themselves are not deleted; if reachable from another branch they stay in history.`));
  }
  if (flags.length && !flags.every((f) => f === "-a" || f === "-r" || f === "--all" || f === "--remotes"))
    return failR(s, [`error: unknown option '${flags[0]}'`], ex("Dəstəklənən: `git branch`, `git branch <ad>`, `git branch -d <ad>`, `git branch -a`.", "Supported: `git branch`, `git branch <name>`, `git branch -d <name>`, `git branch -a`."));
  if (!names.length) {
    const showLocal = !flags.some((f) => f === "-r" || f === "--remotes");
    const showRemote = flags.length > 0;
    const out: string[] = [];
    if (showLocal) {
      if (s.head.kind === "detached") out.push(`* (HEAD detached at ${s.head.id})`);
      for (const b of Object.keys(s.branches).sort()) out.push(`${s.head.kind === "branch" && s.head.name === b ? "*" : " "} ${b}`);
    }
    if (showRemote) for (const b of Object.keys(s.tracking).sort()) out.push(`  ${showLocal ? "remotes/" : ""}origin/${b}`);
    return okR(s, out, ex("Budaqların siyahısı; `*` hazırda olduğun budağı göstərir.", "List of branches; `*` marks the branch you are on."));
  }
  const n = copy(s);
  const r = createBranch(n, names[0], names[1]);
  if (typeof r !== "string") return { ...r, state: s };
  return okR(n, [], ex(`\`${names[0]}\` budağı ${r} commit-ində yaradıldı. Diqqət: sən hələ də \`${headLabel(s)}\`-dəsən; keçmək üçün \`git switch ${names[0]}\`.`, `Branch \`${names[0]}\` was created at ${r}. Note: you are still on \`${headLabel(s)}\`; switch with \`git switch ${names[0]}\`.`));
}

function dirtyNote(s: GitState): L {
  return s.modified.length || s.staged.length ? ex(" Commit olunmamış dəyişikliklər də özünlə gəldi.", " Your uncommitted changes came along.") : ex("", "");
}

const cat = (a: L, b: L): L => ({ az: (a.az ?? "") + (b.az ?? ""), en: (a.en ?? "") + (b.en ?? "") });

function switchTo(s: GitState, name: string): RunResult {
  if (s.head.kind === "branch" && s.head.name === name) return okR(s, [`Already on '${name}'`], ex(`Sən artıq \`${name}\` budağındasan.`, `You are already on \`${name}\`.`));
  const n = copy(s);
  n.head = { kind: "branch", name };
  return okR(n, [`Switched to branch '${name}'`], cat(ex(`HEAD indi \`${name}\` budağını göstərir (${n.branches[name]}). Yeni commit-lər bu budağa əlavə olunacaq.`, `HEAD now points at \`${name}\` (${n.branches[name]}). New commits will be added to this branch.`), dirtyNote(s)));
}

function dwimTrack(s: GitState, name: string): RunResult | null {
  if (!s.tracking[name]) return null;
  const n = copy(s);
  n.branches[name] = s.tracking[name];
  n.upstream[name] = name;
  n.head = { kind: "branch", name };
  return okR(n, [`branch '${name}' set up to track 'origin/${name}'.`, `Switched to a new branch '${name}'`], ex(`Yerli \`${name}\` budağı yox idi, amma \`origin/${name}\` var idi: Git ondan yerli budaq yaradıb izləməni (upstream) quraşdırdı.`, `There was no local \`${name}\`, but \`origin/${name}\` exists: Git created a local branch from it and set it to track the remote.`));
}

function detachTo(s: GitState, id: string, ref: string): RunResult {
  const n = copy(s);
  n.head = { kind: "detached", id };
  return okR(n, [`Note: switching to '${ref}'.`, "", "You are in 'detached HEAD' state. You can look around, make experimental", "changes and commit them, and you can discard any commits you make in this", "state without impacting any branches by switching back to a branch.", "", `HEAD is now at ${id} ${s.commits[id].message}`], ex(
    `HEAD birbaşa ${id} commit-ini göstərir (ayrılmış HEAD). Burada etdiyin commit-lər heç bir budağa aid olmayacaq; saxlamaq istəsən \`git switch -c <ad>\` ilə budaq yarat.`,
    `HEAD points directly at commit ${id} (detached HEAD). Commits made here belong to no branch; to keep them create one with \`git switch -c <name>\`.`,
  ));
}

function cmdSwitch(s: GitState, args: string[], checkout: boolean): RunResult {
  if (s.merge) return checkout ? mergeBlock(s, "error: you need to resolve your current index first") : mergeBlock(s, "fatal: cannot switch branch while merging");
  const createFlag = checkout ? ["-b", "-B"] : ["-c", "-C", "--create"];
  const f = args[0];
  if (!f) return failR(s, [checkout ? "error: no branch specified" : "fatal: missing branch or commit argument"], ex(`Budaq adını yaz: \`git ${checkout ? "checkout" : "switch"} <ad>\`.`, `Name a branch: \`git ${checkout ? "checkout" : "switch"} <name>\`.`));
  if (createFlag.includes(f)) {
    const name = args[1];
    if (!name) return failR(s, [`error: switch \`${f.replace(/^-+/, "")}' requires a value`], ex("Yeni budağın adını yaz.", "Give the new branch a name."));
    const n = copy(s);
    if (!headId(n) && !args[2]) {
      if (!isValidBranchName(name)) return failR(s, [`fatal: '${name}' is not a valid branch name`], ex("Budaq adı düzgün deyil.", "The branch name is not valid."));
      n.head = { kind: "branch", name };
      return okR(n, [`Switched to a new branch '${name}'`], ex(`Hələ commit yoxdur, ona görə \`${name}\` ilk commit-dən sonra yaranacaq.`, `There are no commits yet, so \`${name}\` will come into existence with the first commit.`));
    }
    if ((f === "-B" || f === "-C") && n.branches[name]) delete n.branches[name];
    const r = createBranch(n, name, args[2]);
    if (typeof r !== "string") return { ...r, state: s };
    n.head = { kind: "branch", name };
    return okR(n, [`Switched to a new branch '${name}'`], cat(ex(`Yeni \`${name}\` budağı ${r}-də yaradıldı və HEAD ona keçdi. Bu, \`git branch ${name}\` + \`git switch ${name}\` ilə eynidir.`, `New branch \`${name}\` was created at ${r} and HEAD moved to it. Same as \`git branch ${name}\` + \`git switch ${name}\`.`), dirtyNote(s)));
  }
  if (!checkout && (f === "--detach" || f === "-d")) {
    const ref = args[1] ?? "HEAD";
    const id = resolveRef(s, ref);
    if (!id) return failR(s, [`fatal: invalid reference: ${ref}`], ex(`\`${ref}\` tapılmadı.`, `\`${ref}\` was not found.`));
    return detachTo(s, id, ref);
  }
  if (f.startsWith("-")) return failR(s, [`error: unknown switch '${f.replace(/^-+/, "")}'`], ex("Bu seçim sınaq mühitində dəstəklənmir.", "This option is not supported in the sandbox."));
  if (s.branches[f]) return switchTo(s, f);
  const dw = dwimTrack(s, f);
  if (dw) return dw;
  const id = resolveRef(s, f);
  if (checkout) {
    if (id) return detachTo(s, id, f);
    return failR(s, [`error: pathspec '${f}' did not match any file(s) known to git`], ex(`\`${f}\` adlı budaq, teq və ya commit yoxdur. Mövcud budaqlar: ${Object.keys(s.branches).join(", ") || "yoxdur"}. Yeni budaq üçün \`git checkout -b ${f}\`.`, `No branch, tag or commit called \`${f}\`. Existing branches: ${Object.keys(s.branches).join(", ") || "none"}. To create it use \`git checkout -b ${f}\`.`));
  }
  if (id) {
    const kind = s.tags[f] ? "tag" : "commit";
    return failR(s, [`fatal: a branch is expected, got ${kind} '${f}'`, "hint: If you want to detach HEAD at the commit, try again with the --detach option."], ex(`\`git switch\` yalnız budaqlara keçir. Commit-ə baxmaq üçün \`git switch --detach ${f}\`.`, `\`git switch\` only moves to branches. To look at a commit use \`git switch --detach ${f}\`.`));
  }
  return failR(s, [`fatal: invalid reference: ${f}`], ex(`\`${f}\` adlı budaq yoxdur. Mövcud budaqlar: ${Object.keys(s.branches).join(", ") || "yoxdur"}. Yaratmaq və keçmək üçün \`git switch -c ${f}\`.`, `There is no branch called \`${f}\`. Existing branches: ${Object.keys(s.branches).join(", ") || "none"}. To create and switch use \`git switch -c ${f}\`.`));
}

function overwriteCheck(s: GitState, incoming: Set<string>): RunResult | null {
  const hit = uniq([...s.modified, ...s.staged]).filter((f) => incoming.has(f));
  if (!hit.length) return null;
  return failR(s, ["error: Your local changes to the following files would be overwritten by merge:", ...hit.map((f) => `\t${f}`), "Please commit your changes or stash them before you merge.", "Aborting"], ex(
    `Commit olunmamış dəyişikliklərin (${hit.join(", ")}) üzərinə yazılardı, ona görə Git dayandı. Əvvəlcə commit et.`,
    `Your uncommitted changes (${hit.join(", ")}) would be overwritten, so Git stopped. Commit them first.`,
  ));
}

/** Merges `theirs` into HEAD. Shared by `git merge` and `git pull`. */
function doMerge(s: GitState, theirs: string, label: string, opts: { noFf?: boolean; ffOnly?: boolean }): RunResult {
  const ours = headId(s);
  if (ours && isAncestor(s, theirs, ours)) return okR(s, ["Already up to date."], ex(`${label} artıq cari budağın tarixçəsindədir; birləşdiriləcək yeni heç nə yoxdur.`, `${label} is already part of the current branch; there is nothing new to merge.`));
  const base = ours ? mergeBase(s, ours, theirs) : null;
  const blocked = overwriteCheck(s, filesSince(s, base, theirs));
  if (blocked) return blocked;
  const n = copy(s);
  if (!ours || (isAncestor(s, ours, theirs) && !opts.noFf)) {
    setHeadTo(n, theirs);
    return okR(n, [`Updating ${ours ?? "0000000"}..${theirs}`, "Fast-forward"], ex(
      `Fast-forward: \`${headLabel(n)}\` ayrılmamışdı, ona görə Git yeni commit yaratmadan göstəricini sadəcə ${theirs}-ə irəli çəkdi. Tarixçə xətti qaldı.`,
      `Fast-forward: \`${headLabel(n)}\` had not diverged, so Git simply moved the pointer forward to ${theirs} without creating a new commit. History stays linear.`,
    ));
  }
  if (opts.ffOnly) return failR(s, ["fatal: Not possible to fast-forward, aborting."], ex("Budaqlar ayrılıb, fast-forward mümkün deyil. `--ff-only` olmadan merge et və ya rebase istifadə et.", "The branches have diverged, so fast-forward is impossible. Merge without `--ff-only` or rebase instead."));
  const message = label.startsWith("origin/") ? `Merge remote-tracking branch '${label}'` : n.branches[label] ? `Merge branch '${label}'${headLabel(n) === "main" ? "" : ` into ${headLabel(n)}`}` : `Merge commit '${label}'`;
  const conflicts = [...filesSince(s, base, ours)].filter((f) => filesSince(s, base, theirs).has(f));
  if (conflicts.length) {
    n.merge = { theirs, message, conflicts, resolved: [] };
    return failR(n, [...conflicts.flatMap((f) => [`Auto-merging ${f}`, `CONFLICT (content): Merge conflict in ${f}`]), "Automatic merge failed; fix conflicts and then commit the result."], ex(
      `Münaqişə! Hər iki budaq ortaq əcdad ${base}-dən sonra eyni faylı (${conflicts.join(", ")}) dəyişib və Git hansını seçəcəyini bilmir. Faylda <<<<<<< (sənin), ======= və >>>>>>> (onların) işarələri yaranır. Həll: faylı əl ilə düzəlt (\`edit ${conflicts[0]}\`), \`git add ${conflicts[0]}\`, sonra \`git commit\`. İmtina: \`git merge --abort\`.`,
      `Conflict! Since their common ancestor ${base}, both branches changed the same file (${conflicts.join(", ")}) and Git cannot choose. The file gets <<<<<<< (yours), ======= and >>>>>>> (theirs) markers. To resolve: fix the file by hand (\`edit ${conflicts[0]}\`), \`git add ${conflicts[0]}\`, then \`git commit\`. To give up: \`git merge --abort\`.`,
    ));
  }
  const id = addCommit(n, n, { parents: [ours, theirs], message, branch: headLabel(n), files: [], author: "you" });
  setHeadTo(n, id);
  return okR(n, ["Merge made by the 'ort' strategy."], ex(
    `Budaqlar ayrılmışdı (ortaq əcdad ${base}), ona görə Git iki valideynli yeni merge commit ${id} yaratdı: ${ours} və ${theirs}. Hər iki tarixçə qorunur.`,
    `The branches had diverged (common ancestor ${base}), so Git created a new merge commit ${id} with two parents: ${ours} and ${theirs}. Both histories are kept.`,
  ));
}

function cmdMerge(s: GitState, args: string[]): RunResult {
  if (args.includes("--abort")) {
    if (!s.merge) return failR(s, ["fatal: There is no merge to abort (MERGE_HEAD missing)."], ex("Hazırda yarımçıq birləşmə yoxdur.", "There is no merge in progress."));
    const n = copy(s);
    n.merge = null;
    n.modified = [];
    n.staged = [];
    return okR(n, [], ex("Birləşmə ləğv edildi; hər şey `git merge`-dən əvvəlki vəziyyətə qayıtdı.", "The merge was aborted; everything is back to how it was before `git merge`."));
  }
  if (s.merge) return mergeBlock(s, "error: Merging is not possible because you have unmerged files.");
  const noFf = args.includes("--no-ff");
  const ffOnly = args.includes("--ff-only");
  const bad = args.find((a) => a.startsWith("-") && a !== "--no-ff" && a !== "--ff-only");
  if (bad) return failR(s, [`error: unknown option '${bad}'`], ex("Dəstəklənən: `--no-ff`, `--ff-only`, `--abort`.", "Supported: `--no-ff`, `--ff-only`, `--abort`."));
  let ref = args.find((a) => !a.startsWith("-"));
  if (!ref) {
    const up = s.head.kind === "branch" ? s.upstream[s.head.name] : undefined;
    if (!up || !s.tracking[up]) return failR(s, ["fatal: No remote for the current branch."], ex("Hansı budağı birləşdirəcəyini yaz: `git merge <budaq>`.", "Say which branch to merge: `git merge <branch>`."));
    ref = `origin/${up}`;
  }
  const theirs = resolveRef(s, ref);
  if (!theirs) return failR(s, [`merge: ${ref} - not something we can merge`], ex(`\`${ref}\` adlı budaq və ya commit yoxdur. Mövcud budaqlar: ${Object.keys(s.branches).join(", ") || "yoxdur"}.`, `There is no branch or commit called \`${ref}\`. Existing branches: ${Object.keys(s.branches).join(", ") || "none"}.`));
  return doMerge(s, theirs, ref, { noFf, ffOnly });
}

/** Replays HEAD's commits on top of `onto`. Shared by `git rebase` and `git pull --rebase`. */
function doRebase(s: GitState, onto: string, label: string): RunResult {
  const h = headId(s);
  if (!h) return unbornErr(s);
  if (isAncestor(s, onto, h)) return okR(s, [`Current branch ${headLabel(s)} is up to date.`], ex(`\`${headLabel(s)}\` artıq ${label} üzərində qurulub; köçürüləcək heç nə yoxdur.`, `\`${headLabel(s)}\` is already based on ${label}; nothing to replay.`));
  const n = copy(s);
  const ref = s.head.kind === "branch" ? `refs/heads/${s.head.name}` : "HEAD";
  if (isAncestor(s, h, onto)) {
    setHeadTo(n, onto);
    return okR(n, [`Successfully rebased and updated ${ref}.`], ex(`Köçürüləcək öz commit-in yox idi, ona görə \`${headLabel(n)}\` sadəcə ${onto}-ə irəli çəkildi.`, `There were no commits of your own to replay, so \`${headLabel(n)}\` simply moved forward to ${onto}.`));
  }
  const base = mergeBase(s, h, onto);
  const replay = commitsSince(s, onto, h).filter((c) => s.commits[c].parents.length < 2);
  const upstreamFiles = filesSince(s, base, onto);
  const clash = uniq(replay.flatMap((c) => s.commits[c].files)).filter((f) => upstreamFiles.has(f));
  if (clash.length)
    return failR(s, [`(sandbox) This rebase would stop with a conflict in ${clash.join(", ")}.`, "(sandbox) Rebase conflicts are not simulated; nothing was changed."], ex(
      `Bu rebase ${clash.join(", ")} faylında münaqişə ilə dayanardı. Real Git-də faylı düzəldib \`git add\` və \`git rebase --continue\` edərdin. Sınaq mühiti rebase münaqişələrini simulyasiya etmir; bunun əvəzinə \`git merge\` sına.`,
      `This rebase would stop with a conflict in ${clash.join(", ")}. In real Git you would fix the file, \`git add\` it and run \`git rebase --continue\`. The sandbox does not simulate rebase conflicts; try \`git merge\` instead.`,
    ));
  let parent = onto;
  const pairs: string[] = [];
  for (const c of replay) {
    const o = s.commits[c];
    parent = addCommit(n, n, { parents: [parent], message: o.message, branch: headLabel(s), files: o.files, author: o.author, copyOf: c });
    pairs.push(`${c}→${parent}`);
  }
  setHeadTo(n, parent);
  return okR(n, [`Successfully rebased and updated ${ref}.`], ex(
    `Rebase: ${replay.length} commit ${label} (${onto}) üzərinə yenidən tətbiq edildi və YENİ id-lər aldı (${pairs.join(", ")}). Köhnə commit-lər artıq budaqdan əlçatan deyil (qrafikdə solğun). Tarixçə xəttidir; artıq push edilmiş commit-ləri rebase etmə.`,
    `Rebase: ${replay.length} commit(s) were replayed on top of ${label} (${onto}) and got NEW ids (${pairs.join(", ")}). The old commits are no longer reachable from the branch (faded in the graph). History is linear; don't rebase commits you have already pushed.`,
  ));
}

function cmdRebase(s: GitState, args: string[]): RunResult {
  if (args.includes("--abort") || args.includes("--continue") || args.includes("--skip"))
    return failR(s, ["fatal: No rebase in progress?"], ex("Hazırda davam edən rebase yoxdur.", "There is no rebase in progress."));
  if (s.merge) return mergeBlock(s, "error: cannot rebase: You have unmerged files.");
  if (s.modified.length) return failR(s, ["error: cannot rebase: You have unstaged changes.", "error: Please commit or stash them."], ex("Rebase təmiz iş qovluğu tələb edir. Əvvəlcə dəyişiklikləri commit et.", "Rebase needs a clean working tree. Commit your changes first."));
  if (s.staged.length) return failR(s, ["error: cannot rebase: Your index contains uncommitted changes.", "error: Please commit or stash them."], ex("Hazırlanmış (staged) dəyişikliklər var. Əvvəlcə commit et.", "There are staged changes. Commit them first."));
  let ref = args.find((a) => !a.startsWith("-"));
  if (!ref) {
    const up = s.head.kind === "branch" ? s.upstream[s.head.name] : undefined;
    if (!up || !s.tracking[up]) return failR(s, ["There is no tracking information for the current branch.", "Please specify which branch you want to rebase against."], ex("Hansı budağın üzərinə rebase edəcəyini yaz: `git rebase main`.", "Say which branch to rebase onto: `git rebase main`."));
    ref = `origin/${up}`;
  }
  const onto = resolveRef(s, ref);
  if (!onto) return failR(s, [`fatal: invalid upstream '${ref}'`], ex(`\`${ref}\` adlı budaq və ya commit yoxdur.`, `There is no branch or commit called \`${ref}\`.`));
  return doRebase(s, onto, ref);
}

function cmdReset(s: GitState, args: string[]): RunResult {
  const mode = args.find((a) => a === "--hard" || a === "--soft" || a === "--mixed") ?? "--mixed";
  const bad = args.find((a) => a.startsWith("-") && !["--hard", "--soft", "--mixed"].includes(a));
  if (bad) return failR(s, [`error: unknown option '${bad}'`], ex("Dəstəklənən: `--soft`, `--mixed`, `--hard`.", "Supported: `--soft`, `--mixed`, `--hard`."));
  const ref = args.find((a) => !a.startsWith("-")) ?? "HEAD";
  const h = headId(s);
  if (!h) return failR(s, ["fatal: ambiguous argument 'HEAD': unknown revision or path not in the working tree."], ex("Hələ commit yoxdur, geri qayıtmaq üçün yer yoxdur.", "There are no commits yet, so there is nothing to go back to."));
  const target = resolveRef(s, ref);
  if (!target) return failR(s, [`fatal: ambiguous argument '${ref}': unknown revision or path not in the working tree.`], ex(`\`${ref}\` tapılmadı. Nümunələr: \`HEAD~1\`, \`C2\`, \`main\`.`, `\`${ref}\` was not found. Examples: \`HEAD~1\`, \`C2\`, \`main\`.`));
  const n = copy(s);
  const undone = commitsSince(s, target, h);
  const undoneFiles = uniq(undone.flatMap((c) => s.commits[c].files));
  setHeadTo(n, target);
  n.merge = null;
  const lost = undone.join(", ");
  if (mode === "--hard") {
    n.modified = [];
    n.staged = [];
    return okR(n, [`HEAD is now at ${target} ${s.commits[target].message}`], ex(
      `\`${headLabel(n)}\` ${target}-ə geri çəkildi, iş qovluğu və staging də sıfırlandı.${lost ? ` ${lost} artıq budaqdan görünmür (qrafikdə solğun; real Git-də hələ \`git reflog\` ilə tapmaq olar).` : ""} Diqqət: \`--hard\` commit olunmamış dəyişiklikləri birdəfəlik silir.`,
      `\`${headLabel(n)}\` was moved back to ${target}; the working tree and staging area were reset too.${lost ? ` ${lost} is no longer reachable from the branch (faded in the graph; real Git can still find it via \`git reflog\`).` : ""} Careful: \`--hard\` throws away uncommitted changes for good.`,
    ));
  }
  if (mode === "--soft") {
    n.staged = uniq([...n.staged, ...undoneFiles]);
    return okR(n, [], ex(`\`--soft\`: budaq ${target}-ə geri çəkildi, ləğv edilən commit-lərin dəyişiklikləri isə hazırlanmış (staged) qaldı.`, `\`--soft\`: the branch moved back to ${target}; the changes of the undone commits stay staged.`));
  }
  n.modified = uniq([...n.modified, ...n.staged, ...undoneFiles]);
  n.staged = [];
  return okR(n, n.modified.length ? ["Unstaged changes after reset:", ...n.modified.map((f) => `M\t${f}`)] : [], ex(`\`--mixed\` (standart): budaq ${target}-ə keçdi, dəyişikliklər iş qovluğunda qaldı, lakin staging boşaldıldı.`, `\`--mixed\` (default): the branch moved to ${target}; changes stay in the working tree but are unstaged.`));
}

function cmdTag(s: GitState, args: string[]): RunResult {
  if (args[0] === "-d") {
    const t = args[1];
    if (!t || !s.tags[t]) return failR(s, [`error: tag '${t ?? ""}' not found.`], ex("Belə teq yoxdur.", "No such tag."));
    const n = copy(s);
    delete n.tags[t];
    return okR(n, [`Deleted tag '${t}' (was ${s.tags[t]})`], ex(`\`${t}\` teqi silindi.`, `Tag \`${t}\` was deleted.`));
  }
  if (!args.length) return okR(s, Object.keys(s.tags).sort(), ex("Teqlərin siyahısı.", "List of tags."));
  const [name, ref] = args;
  if (!isValidBranchName(name)) return failR(s, [`fatal: '${name}' is not a valid tag name.`], ex("Teq adı düzgün deyil.", "The tag name is not valid."));
  if (s.tags[name]) return failR(s, [`fatal: tag '${name}' already exists`], ex(`\`${name}\` teqi artıq var.`, `Tag \`${name}\` already exists.`));
  const id = ref ? resolveRef(s, ref) : headId(s);
  if (!id) return failR(s, [`fatal: Failed to resolve '${ref ?? "HEAD"}' as a valid ref.`], ex("Teq qoymaq üçün mövcud commit lazımdır.", "You need an existing commit to tag."));
  const n = copy(s);
  n.tags[name] = id;
  return okR(n, [], ex(`\`${name}\` teqi ${id}-ə qoyuldu. Budaqdan fərqli olaraq teq yerindən tərpənmir: adətən buraxılış versiyalarını (v1.0) işarələyir.`, `Tag \`${name}\` now marks ${id}. Unlike a branch, a tag never moves: it usually marks a release (v1.0).`));
}

function cmdRemote(s: GitState, args: string[]): RunResult {
  if (!args.length) return okR(s, s.remoteUrl ? ["origin"] : [], ex(s.remoteUrl ? "Qoşulmuş uzaq repozitoriya: `origin`." : "Heç bir uzaq repozitoriya qoşulmayıb.", s.remoteUrl ? "Configured remote: `origin`." : "No remote is configured."));
  if (args[0] === "-v") return okR(s, s.remoteUrl ? [`origin\t${s.remoteUrl} (fetch)`, `origin\t${s.remoteUrl} (push)`] : [], ex("Uzaq repozitoriyaların ünvanları.", "Remote URLs."));
  if (args[0] === "add") {
    const [, name, url] = args;
    if (!name || !url) return failR(s, ["usage: git remote add <name> <url>"], ex("Nümunə: `git remote add origin https://example.com/team/project.git`.", "Example: `git remote add origin https://example.com/team/project.git`."));
    if (name !== "origin") return failR(s, [`(sandbox) Only one remote named 'origin' is simulated.`], ex("Real Git-də istənilən sayda remote ola bilər (məs. fork üçün `upstream`), lakin bu sınaq mühiti yalnız `origin`-i simulyasiya edir.", "Real Git allows any number of remotes (e.g. `upstream` for a fork), but this sandbox simulates only `origin`."));
    if (s.remoteUrl) return failR(s, ["error: remote origin already exists."], ex("`origin` artıq qoşulub.", "`origin` is already configured."));
    const n = copy(s);
    n.remoteUrl = url;
    return okR(n, [], ex("`origin` əlavə edildi. İndi `git push -u origin main` ilə budağı serverə göndərə bilərsən.", "`origin` was added. Now you can send your branch with `git push -u origin main`."));
  }
  return failR(s, [`(sandbox) git remote ${args[0]} is not simulated here.`], ex("Dəstəklənən: `git remote`, `git remote -v`, `git remote add origin <url>`.", "Supported: `git remote`, `git remote -v`, `git remote add origin <url>`."));
}

function fetchInto(n: GitState): string[] {
  const out: string[] = [];
  for (const b of Object.keys(n.server.branches).sort()) {
    const tip = n.server.branches[b];
    transfer(n.server, n, tip);
    const old = n.tracking[b];
    if (old === tip) continue;
    if (!old) out.push(` * [new branch]      ${b} -> origin/${b}`);
    else out.push(`   ${old}..${tip}  ${b} -> origin/${b}${isAncestor(n, old, tip) ? "" : " (forced update)"}`);
    n.tracking[b] = tip;
  }
  for (const t of Object.keys(n.server.tags)) {
    if (n.tags[t]) continue;
    transfer(n.server, n, n.server.tags[t]);
    n.tags[t] = n.server.tags[t];
    out.push(` * [new tag]         ${t} -> ${t}`);
  }
  if (out.length) out.unshift(`From ${n.remoteUrl}`);
  return out;
}

function cmdFetch(s: GitState, args: string[]): RunResult {
  const remote = args.find((a) => !a.startsWith("-"));
  if (!s.remoteUrl || (remote && remote !== "origin")) return noRemote(s, remote);
  const n = copy(s);
  const out = fetchInto(n);
  return okR(n, out, out.length
    ? ex("Fetch serverdən yeni commit-ləri yüklədi və `origin/*` izləmə budaqlarını yenilədi. Sənin yerli budaqların DƏYİŞMƏDİ; birləşdirmək üçün `git merge` və ya `git pull`.", "Fetch downloaded new commits and updated the `origin/*` tracking branches. Your local branches did NOT change; integrate with `git merge` or `git pull`.")
    : ex("Serverdə yeni heç nə yoxdur.", "Nothing new on the server."));
}

function cmdPull(s: GitState, args: string[]): RunResult {
  if (s.merge) return mergeBlock(s, "error: Pulling is not possible because you have unmerged files.");
  const pos = args.filter((a) => !a.startsWith("-"));
  if (!s.remoteUrl || (pos[0] && pos[0] !== "origin")) return noRemote(s, pos[0]);
  if (s.head.kind !== "branch") return failR(s, ["You are not currently on a branch.", "Please specify which branch you want to merge with."], ex("Ayrılmış HEAD-də pull etmək olmur; əvvəlcə budağa keç.", "You cannot pull with a detached HEAD; switch to a branch first."));
  const branch = s.head.name;
  const remoteBranch = pos[1] ?? s.upstream[branch];
  if (!remoteBranch)
    return failR(s, ["There is no tracking information for the current branch.", "Please specify which branch you want to merge with.", "", "If you wish to set tracking information for this branch you can do so with:", "", `    git branch --set-upstream-to=origin/<branch> ${branch}`], ex(`\`${branch}\` heç bir uzaq budağı izləmir. Bir dəfə \`git push -u origin ${branch}\` et və ya \`git pull origin main\` yaz.`, `\`${branch}\` does not track any remote branch. Run \`git push -u origin ${branch}\` once, or use \`git pull origin main\`.`));
  const n = copy(s);
  const fetched = fetchInto(n);
  const target = n.tracking[remoteBranch];
  if (!target) return failR(n, [...fetched, `fatal: couldn't find remote ref ${remoteBranch}`], ex(`Serverdə \`${remoteBranch}\` budağı yoxdur.`, `The server has no branch \`${remoteBranch}\`.`));
  const h = headId(n);
  const rebase = args.includes("--rebase") || args.includes("-r");
  const ffOnly = args.includes("--ff-only");
  const diverged = !!h && !isAncestor(n, target, h) && !isAncestor(n, h, target);
  if (diverged && !rebase && !args.includes("--no-rebase") && !ffOnly)
    return failR(n, [...fetched, "hint: You have divergent branches and need to specify how to reconcile them.", "hint: You can do so by running one of the following commands sometime before", "hint: your next pull:", "hint:", "hint:   git config pull.rebase false  # merge", "hint:   git config pull.rebase true   # rebase", "hint:   git config pull.ff only       # fast-forward only", "fatal: Need to specify how to reconcile divergent branches."], ex(
      "Fetch uğurlu oldu, lakin yerli və uzaq budaq ayrılıb. Git necə birləşdirəcəyini soruşur: `git pull --no-rebase` (merge commit yaradır) və ya `git pull --rebase` (sənin commit-lərini serverdəkilərin üstünə köçürür).",
      "The fetch worked, but your branch and the remote have diverged. Git asks how to combine them: `git pull --no-rebase` (creates a merge commit) or `git pull --rebase` (replays your commits on top of the remote's).",
    ));
  const r = rebase && diverged ? doRebase(n, target, `origin/${remoteBranch}`) : doMerge(n, target, `origin/${remoteBranch}`, { ffOnly });
  const pre = ex("`git pull` = `git fetch` + birləşdirmə. ", "`git pull` = `git fetch` + integrate. ");
  return { ...r, state: r.ok || r.state.merge ? r.state : n, output: [...fetched, ...r.output], explain: cat(pre, r.explain) };
}

function cmdPush(s: GitState, args: string[]): RunResult {
  const setUp = args.includes("-u") || args.includes("--set-upstream");
  const force = args.includes("-f") || args.includes("--force");
  const tagsAll = args.includes("--tags");
  const bad = args.find((a) => a.startsWith("-") && !["-u", "--set-upstream", "-f", "--force", "--tags"].includes(a));
  if (bad) return failR(s, [`error: unknown option '${bad}'`], ex("Dəstəklənən: `-u`, `--force`, `--tags`.", "Supported: `-u`, `--force`, `--tags`."));
  const pos = args.filter((a) => !a.startsWith("-"));
  if (!s.remoteUrl) {
    if (pos[0] && pos[0] !== "origin") return noRemote(s, pos[0]);
    return failR(s, ["fatal: No configured push destination.", "Either specify the URL from the command-line or configure a remote repository using", "", "    git remote add <name> <url>", "", "and then push using the remote name", "", "    git push <name>"], ex("Hara göndərəcəyini Git bilmir: uzaq repozitoriya qoşulmayıb. `git remote add origin <url>` et.", "Git does not know where to push: no remote is configured. Run `git remote add origin <url>`."));
  }
  if (pos[0] && pos[0] !== "origin") return noRemote(s, pos[0]);
  const url = s.remoteUrl;
  const n = copy(s);

  if (tagsAll || (pos[1] && s.tags[pos[1]] && !s.branches[pos[1]])) {
    const names = tagsAll ? Object.keys(s.tags) : [pos[1]];
    const out = [`To ${url}`];
    for (const t of names) {
      if (n.server.tags[t]) continue;
      transfer(n, n.server, n.tags[t]);
      n.server.tags[t] = n.tags[t];
      out.push(` * [new tag]         ${t} -> ${t}`);
    }
    if (out.length === 1) return okR(s, ["Everything up-to-date"], ex("Bütün teqlər artıq serverdədir.", "All tags are already on the server."));
    return okR(n, out, ex("Teqlər serverə göndərildi. Teqlər adi `git push` ilə avtomatik getmir.", "The tags were sent to the server. Tags are not sent by a plain `git push`."));
  }

  let branch: string;
  if (pos[1]) branch = pos[1];
  else {
    if (s.head.kind !== "branch") return failR(s, ["fatal: You are not currently on a branch."], ex("Ayrılmış HEAD-dən push etmək üçün budaq adı lazımdır. Əvvəlcə budaq yarat: `git switch -c <ad>`.", "Pushing from a detached HEAD needs a branch name. Create one first: `git switch -c <name>`."));
    branch = s.head.name;
    if (!s.upstream[branch] && !setUp)
      return failR(s, [`fatal: The current branch ${branch} has no upstream branch.`, "To push the current branch and set the remote as upstream, use", "", `    git push --set-upstream origin ${branch}`, ""], ex(`\`${branch}\` hələ serverdəki heç bir budağa bağlı deyil. İlk dəfə \`git push -u origin ${branch}\` et; sonra sadəcə \`git push\` kifayətdir.`, `\`${branch}\` is not linked to any branch on the server yet. The first time run \`git push -u origin ${branch}\`; after that a plain \`git push\` is enough.`));
  }
  const local = s.branches[branch];
  if (!local) return failR(s, [`error: src refspec ${branch} does not match any`, `error: failed to push some refs to '${url}'`], ex(`Yerli \`${branch}\` budağı yoxdur (və ya hələ commit-i yoxdur).`, `There is no local branch \`${branch}\` (or it has no commits yet).`));
  const remoteName = s.upstream[branch] ?? branch;
  const remoteTip = s.server.branches[remoteName];
  const out = [`To ${url}`];
  let explain: L;
  if (remoteTip === local) {
    if (setUp) n.upstream[branch] = remoteName;
    n.tracking[remoteName] = local;
    return okR(n, ["Everything up-to-date"], ex("Server artıq eyni commit-ə malikdir; göndəriləcək yeni heç nə yoxdur.", "The server already has the same commit; there is nothing new to send."));
  }
  if (remoteTip && !force) {
    const known = !!s.commits[remoteTip];
    if (!known || !isAncestor(s, remoteTip, local)) {
      const why = known ? "non-fast-forward" : "fetch first";
      return failR(s, [...out, ` ! [rejected]        ${branch} -> ${remoteName} (${why})`, `error: failed to push some refs to '${url}'`, known ? "hint: Updates were rejected because the tip of your current branch is behind" : "hint: Updates were rejected because the remote contains work that you do not", known ? "hint: its remote counterpart. Integrate the remote changes (e.g." : "hint: have locally. This is usually caused by another repository pushing to", known ? "hint: 'git pull ...') before pushing again." : "hint: the same ref. Integrate the remote changes (e.g. 'git pull ...') before pushing again."], ex(
        "Push rədd edildi: serverdə sənin yerli tarixçəndə olmayan commit-lər var (məsələn, komanda yoldaşı push edib). Git başqasının işinin üzərinə yazmır. Əvvəlcə `git pull --rebase` (və ya `git fetch` + `git merge`), sonra yenidən `git push`.",
        "Push rejected: the server has commits your local history does not contain (e.g. a teammate pushed). Git won't overwrite someone else's work. First `git pull --rebase` (or `git fetch` + `git merge`), then `git push` again.",
      ));
    }
  }
  const sent = transfer(n, n.server, local);
  n.server.branches[remoteName] = local;
  n.tracking[remoteName] = local;
  if (!remoteTip) {
    out.push(` * [new branch]      ${branch} -> ${remoteName}`);
    explain = ex(`Serverdə yeni \`${remoteName}\` budağı yaradıldı (${sent} commit göndərildi). İndi başqaları onu görə bilər; GitHub/GitLab-da buradan Pull Request açılır.`, `A new branch \`${remoteName}\` was created on the server (${sent} commit(s) sent). Others can see it now; on GitHub/GitLab you would open a Pull Request from it.`);
  } else if (force && !isAncestor(n, remoteTip, local)) {
    out.push(` + ${remoteTip}...${local} ${branch} -> ${remoteName} (forced update)`);
    explain = ex(`Məcburi push: serverdəki \`${remoteName}\` sənin versiyanla əvəz olundu; serverdəki köhnə commit-lər itdi. Komanda ilə paylaşılan budaqlarda bunu etmə!`, `Force push: \`${remoteName}\` on the server was replaced with your version; the server's old commits are gone from the branch. Never do this on shared branches!`);
  } else {
    out.push(`   ${remoteTip}..${local}  ${branch} -> ${remoteName}`);
    explain = ex(`${sent} yeni commit serverə göndərildi və \`origin/${remoteName}\` ${local}-ə irəlilədi.`, `${sent} new commit(s) were sent to the server and \`origin/${remoteName}\` moved to ${local}.`);
  }
  if (setUp) {
    n.upstream[branch] = remoteName;
    out.push(`branch '${branch}' set up to track 'origin/${remoteName}'.`);
  }
  return okR(n, out, explain);
}

function cmdClone(s: GitState, args: string[]): RunResult {
  const url = args.find((a) => !a.startsWith("-"));
  if (!url) return failR(s, ["fatal: You must specify a repository to clone."], ex(`Ünvan yaz: \`git clone ${DEFAULT_URL}\`.`, `Give a URL: \`git clone ${DEFAULT_URL}\`.`));
  const n = initialState();
  n.server = copyRepo(s.server);
  n.counter = s.counter;
  n.initialized = true;
  n.remoteUrl = url;
  const name = (url.split("/").pop() ?? "project").replace(/\.git$/, "") || "project";
  const out = [`Cloning into '${name}'...`];
  const main = n.server.branches.main ? "main" : Object.keys(n.server.branches)[0];
  for (const b of Object.keys(n.server.branches)) {
    transfer(n.server, n, n.server.branches[b]);
    n.tracking[b] = n.server.branches[b];
  }
  for (const t of Object.keys(n.server.tags)) {
    transfer(n.server, n, n.server.tags[t]);
    n.tags[t] = n.server.tags[t];
  }
  if (!main) {
    out.push("warning: You appear to have cloned an empty repository.");
    return okR(n, out, ex("Boş repozitoriya klonlandı: `origin` qoşuldu, lakin hələ commit yoxdur.", "An empty repository was cloned: `origin` is configured but there are no commits yet."));
  }
  n.branches[main] = n.tracking[main];
  n.upstream[main] = main;
  n.head = { kind: "branch", name: main };
  out.push("done.");
  return okR(n, out, ex(
    `Klon: serverdəki bütün tarixçə (${n.order.length} commit) yükləndi, \`origin\` qoşuldu, \`origin/*\` izləmə budaqları və \`${main}\` yerli budağı yaradıldı. (Real Git yeni \`${name}\` qovluğu yaradardı; sınaq mühiti sadəcə cari repozitoriyanı əvəz edir.)`,
    `Clone: the server's full history (${n.order.length} commits) was downloaded, \`origin\` was configured, and \`origin/*\` tracking branches plus a local \`${main}\` were created. (Real Git would create a new \`${name}\` folder; the sandbox just replaces the current repository.)`,
  ));
}

/** Sandbox-only helpers that simulate other people (clearly not Git commands). */
function cmdSim(s: GitState, args: string[]): RunResult {
  if (args[0] !== "teammate") return failR(s, ['usage: sim teammate "message" [--branch <name>] [--file <file>]'], ex("Sınaq mühiti əmri: `sim teammate \"mesaj\"` — komanda yoldaşının serverə push etdiyini simulyasiya edir.", "Sandbox command: `sim teammate \"message\"` simulates a teammate pushing to the server."));
  let msg: string | undefined;
  let branch = "main";
  let file: string | undefined;
  for (let i = 1; i < args.length; i++) {
    if (args[i] === "--branch") branch = args[++i] ?? "main";
    else if (args[i] === "--file") file = args[++i];
    else msg = args[i];
  }
  if (!msg) return failR(s, ['usage: sim teammate "message" [--branch <name>] [--file <file>]'], ex("Commit mesajını yaz.", "Give a commit message."));
  const n = copy(s);
  const parent = n.server.branches[branch];
  const id = addCommit(n, n.server, { parents: parent ? [parent] : [], message: msg, branch, files: [file ?? `t${n.counter}.txt`], author: "teammate" });
  n.server.branches[branch] = id;
  return okR(n, [`(sandbox) A teammate pushed ${id} "${msg}" to origin/${branch}.`], ex(
    `Komanda yoldaşı serverə yeni commit ${id} göndərdi. Sənin kompüterin bunu hələ bilmir: \`origin/${branch}\` yalnız \`git fetch\` və ya \`git pull\`-dan sonra yenilənir.`,
    `A teammate pushed a new commit ${id} to the server. Your computer does not know yet: \`origin/${branch}\` updates only after \`git fetch\` or \`git pull\`.`,
  ));
}

export const HELP_LINES = [
  "Supported commands (simulated — no real repository is touched):",
  "  git init | git clone <url>",
  '  git status | git log [--oneline] [--all]',
  '  git add <file>|. | git commit -m "msg" | git commit -am "msg"',
  "  git branch [-a] | git branch <name> | git branch -d|-D <name>",
  "  git switch <name> | git switch -c <name> | git switch --detach <commit>",
  "  git checkout <name|commit> | git checkout -b <name>",
  "  git merge <branch> [--no-ff|--ff-only] | git merge --abort",
  "  git rebase <branch>",
  "  git reset [--soft|--mixed|--hard] <commit|HEAD~1>",
  "  git tag [<name> [commit]] | git tag -d <name>",
  "  git remote [-v] | git remote add origin <url>",
  "  git fetch | git pull [--rebase|--no-rebase|--ff-only] | git push [-u] [--force] [origin <branch>] | git push --tags",
  "Sandbox helpers:",
  "  edit <file>                      simulate changing a file",
  '  sim teammate "msg" [--file f]    a teammate pushes a commit to origin',
  "  help | clear",
];

const UNSUPPORTED = new Set(["stash", "cherry-pick", "revert", "diff", "show", "restore", "rm", "mv", "config", "blame", "bisect", "reflog", "worktree", "submodule", "describe", "shortlog", "grep", "clean", "am", "apply", "format-patch", "notes", "archive", "gc", "fsck", "range-diff", "sparse-checkout", "maintenance"]);

/** Runs one command line against an immutable state. */
export function run(state: GitState, input: string): RunResult {
  const tokens = tokenize(input.trim());
  if (tokens === null) return failR(state, ["(sandbox) Unclosed quote."], ex("Dırnaq bağlanmayıb: `git commit -m \"mesaj\"` şəklində yaz.", "A quote is not closed: write it like `git commit -m \"message\"`."));
  if (!tokens.length) return okR(state, [], {});
  const [cmd, sub, ...rest] = tokens;
  if (cmd === "help" || (cmd === "git" && (sub === "help" || sub === "--help")))
    return okR(state, HELP_LINES, ex("Bu sınaq mühitində dəstəklənən əmrlər. Hamısı simulyasiyadır: heç bir real fayl və ya repozitoriyaya toxunulmur.", "Commands supported in this sandbox. Everything is simulated: no real file or repository is touched."));
  if (cmd === "clear") return { ...okR(state, [], {}), clear: true };
  if (cmd === "edit" || cmd === "touch") return cmdEdit(state, tokens.slice(1));
  if (cmd === "sim") return cmdSim(state, tokens.slice(1));
  if (cmd !== "git")
    return failR(state, [`${cmd}: command not found`], ex("Bu terminal yalnız `git ...` əmrlərini və bir neçə köməkçi əmri qəbul edir. `help` yaz.", "This terminal only accepts `git ...` commands and a few helpers. Type `help`."));
  if (!sub) return failR(state, ["usage: git <command> [<args>]"], ex("Git əmrini yaz, məsələn `git status`. Siyahı üçün `help`.", "Type a Git command, e.g. `git status`. See `help` for the list."));
  if (sub === "--version" || sub === "version") return okR(state, ["git version (simulated sandbox)"], ex("Bu, real Git deyil, öyrənmə üçün simulyasiyadır.", "This is not real Git; it is a simulation for learning."));
  if (sub === "init") return cmdInit(state);
  if (sub === "clone") return cmdClone(state, rest);
  if (UNSUPPORTED.has(sub))
    return failR(state, [`(sandbox) 'git ${sub}' is a real Git command but is not simulated here.`], ex(`\`git ${sub}\` real Git əmridir, lakin bu sınaq mühitində simulyasiya edilmir. \`help\` dəstəklənənləri göstərir.`, `\`git ${sub}\` is a real Git command but is not simulated in this sandbox. \`help\` lists what is supported.`));
  const known = ["commit", "add", "status", "log", "branch", "switch", "checkout", "merge", "rebase", "reset", "tag", "remote", "fetch", "pull", "push"];
  if (!known.includes(sub))
    return failR(state, [`git: '${sub}' is not a git command. See 'git --help'.`], ex(`\`${sub}\` adlı Git əmri yoxdur. Yazılışı yoxla və ya \`help\` yaz.`, `There is no Git command called \`${sub}\`. Check the spelling or type \`help\`.`));
  if (!state.initialized) return notRepo(state);
  switch (sub) {
    case "commit": return cmdCommit(state, rest);
    case "add": return cmdAdd(state, rest);
    case "status": return cmdStatus(state);
    case "log": return cmdLog(state, rest);
    case "branch": return cmdBranch(state, rest);
    case "switch": return cmdSwitch(state, rest, false);
    case "checkout": return cmdSwitch(state, rest, true);
    case "merge": return cmdMerge(state, rest);
    case "rebase": return cmdRebase(state, rest);
    case "reset": return cmdReset(state, rest);
    case "tag": return cmdTag(state, rest);
    case "remote": return cmdRemote(state, rest);
    case "fetch": return cmdFetch(state, rest);
    case "pull": return cmdPull(state, rest);
    default: return cmdPush(state, rest);
  }
}

/** Runs several commands in order (used for scenario setup and tests). */
export function runAll(state: GitState, commands: string[]): { state: GitState; results: RunResult[] } {
  const results: RunResult[] = [];
  let s = state;
  for (const c of commands) {
    const r = run(s, c);
    results.push(r);
    s = r.state;
  }
  return { state: s, results };
}

/** Commits not reachable from any ref (shown faded in the graph). */
export function reachableSet(s: GitState): Set<string> {
  const set = new Set<string>();
  for (const id of [headId(s), ...Object.values(s.branches), ...Object.values(s.tags), ...Object.values(s.tracking), s.merge?.theirs]) ancestors(s, id).forEach((c) => set.add(c));
  return set;
}
