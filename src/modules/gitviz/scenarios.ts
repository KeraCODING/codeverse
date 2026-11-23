// Guided Git scenarios. Each one starts from a scripted setup, shows the steps, and checks
// whether the goal state was reached. `solution` is a command sequence that solves it (tested).
import type { L } from "../../content/types";
import { ancestors, DEFAULT_URL, initialState, runAll, type GitState } from "./engine";

export interface ScenarioStep {
  text: L;
  cmd?: string;
}

export interface Scenario {
  id: string;
  title: L;
  goal: L;
  /** Extra concept explanation (shown under the steps). */
  concept?: L;
  steps: ScenarioStep[];
  setup: string[];
  solution: string[];
  check: (s: GitState) => boolean;
  done: L;
}

const tip = (s: GitState, b: string) => (s.branches[b] ? s.commits[s.branches[b]] : undefined);
const hasMerge = (s: GitState, id: string | undefined) => [...ancestors(s, id)].some((c) => s.commits[c].parents.length > 1);

export const FREE_SETUP = ['sim teammate "Initial commit"', `git clone ${DEFAULT_URL}`];

export const SCENARIOS: Scenario[] = [
  {
    id: "first-commits",
    title: { az: "İlk commit-lər", en: "First commits" },
    goal: { az: "Yeni repozitoriya yarat və `main` budağında ən azı iki commit et.", en: "Create a new repository and make at least two commits on `main`." },
    steps: [
      { text: { az: "Boş repozitoriya yarat.", en: "Create an empty repository." }, cmd: "git init" },
      { text: { az: "İlk commit-i et (sınaq mühiti fayl dəyişikliyini simulyasiya edir).", en: "Make the first commit (the sandbox simulates a file change)." }, cmd: 'git commit -m "Add README"' },
      { text: { az: "Faylı dəyiş, hazırla (stage) və ikinci commit-i et.", en: "Change a file, stage it and make a second commit." }, cmd: "edit index.html" },
      { text: { az: "Dəyişikliyi commit üçün hazırla.", en: "Stage the change." }, cmd: "git add index.html" },
      { text: { az: "İkinci commit.", en: "Second commit." }, cmd: 'git commit -m "Add index page"' },
      { text: { az: "Tarixçəyə bax.", en: "Look at the history." }, cmd: "git log --oneline" },
    ],
    setup: [],
    solution: ["git init", 'git commit -m "Add README"', "edit index.html", "git add index.html", 'git commit -m "Add index page"', "git log --oneline"],
    check: (s) => s.initialized && ancestors(s, s.branches.main).size >= 2,
    done: { az: "Əla! Hər commit əvvəlkini valideyn kimi göstərir və `main` ən sonuncunu göstərir.", en: "Great! Each commit points to the previous one as its parent, and `main` points at the newest." },
  },
  {
    id: "fast-forward",
    title: { az: "Budaq və birləşmə (fast-forward)", en: "Branch and merge (fast-forward)" },
    goal: { az: "`feature` budağında iki commit et və onu `main`-ə fast-forward ilə birləşdir.", en: "Make two commits on a `feature` branch and fast-forward `main` to it." },
    steps: [
      { text: { az: "Yeni budaq yarat və ona keç.", en: "Create a new branch and switch to it." }, cmd: "git switch -c feature" },
      { text: { az: "Budaqda iki commit et.", en: "Make two commits on the branch." }, cmd: 'git commit -m "Add page"' },
      { text: { az: "İkinci commit.", en: "Second commit." }, cmd: 'git commit -m "Style page"' },
      { text: { az: "`main`-ə qayıt.", en: "Go back to `main`." }, cmd: "git switch main" },
      { text: { az: "Birləşdir: `main` ayrılmadığı üçün göstərici sadəcə irəli gedəcək.", en: "Merge: since `main` has not diverged, the pointer just moves forward." }, cmd: "git merge feature" },
    ],
    setup: ["git init", 'git commit -m "Initial commit"'],
    solution: ["git switch -c feature", 'git commit -m "Add page"', 'git commit -m "Style page"', "git switch main", "git merge feature"],
    check: (s) =>
      !!s.branches.feature && s.branches.main === s.branches.feature && ancestors(s, s.branches.main).size >= 3 && !hasMerge(s, s.branches.main) && s.head.kind === "branch" && s.head.name === "main",
    done: { az: "Fast-forward oldu: yeni commit yaranmadı, `main` sadəcə `feature`-in yerinə keçdi.", en: "Fast-forward done: no new commit was created, `main` simply moved to where `feature` is." },
  },
  {
    id: "merge-commit",
    title: { az: "Merge commit", en: "Merge commit" },
    goal: { az: "`main`-də ayrıca commit et ki, budaqlar ayrılsın, sonra `feature`-i birləşdirib iki valideynli merge commit yarat.", en: "Commit on `main` so the branches diverge, then merge `feature` to create a merge commit with two parents." },
    steps: [
      { text: { az: "Sən `main`-dəsən; burada da commit et.", en: "You are on `main`; commit here too." }, cmd: 'git commit -m "Fix footer"' },
      { text: { az: "İndi iki budaq ayrılıb. `feature`-i birləşdir.", en: "The two branches have now diverged. Merge `feature`." }, cmd: "git merge feature" },
      { text: { az: "Tarixçədə `Merge:` sətrinə bax.", en: "Look for the `Merge:` line in the history." }, cmd: "git log" },
    ],
    setup: ["git init", 'git commit -m "Initial commit"', "git switch -c feature", 'git commit -m "Add search"', "git switch main"],
    solution: ['git commit -m "Fix footer"', "git merge feature", "git log"],
    check: (s) => {
      const t = tip(s, "main");
      return !!t && t.parents.length === 2 && !!s.branches.feature && ancestors(s, t.id).has(s.branches.feature);
    },
    done: { az: "Merge commit yarandı: onun iki valideyni var və hər iki budağın tarixçəsi qorunub.", en: "A merge commit was created: it has two parents and both branches' histories are kept." },
  },
  {
    id: "conflict",
    title: { az: "Birləşmə münaqişəsi", en: "Merge conflict" },
    goal: { az: "Hər iki budaq `README.md`-ni dəyişib. Birləşdir, münaqişəni həll et və birləşməni tamamla.", en: "Both branches changed `README.md`. Merge, resolve the conflict and conclude the merge." },
    concept: {
      az: "Münaqişə o deməkdir ki, Git eyni yerdəki iki fərqli dəyişiklikdən hansını saxlayacağını bilmir. Faylda belə işarələr yaranır: `<<<<<<< HEAD` (sənin versiyan), `=======`, `>>>>>>> feature` (onların versiyası). Sən faylı redaktorda açır, düzgün nəticəni yazır, işarələri silir, sonra `git add` ilə \"həll olundu\" deyir və `git commit` edirsən.",
      en: "A conflict means Git cannot tell which of two different changes to the same place to keep. The file gets markers: `<<<<<<< HEAD` (your version), `=======`, `>>>>>>> feature` (their version). You open the file, write the correct result, delete the markers, then mark it resolved with `git add` and run `git commit`.",
    },
    steps: [
      { text: { az: "Birləşdirməyə cəhd et — münaqişə yaranacaq.", en: "Try to merge — a conflict will appear." }, cmd: "git merge feature" },
      { text: { az: "Vəziyyətə bax: \"both modified\".", en: "Check the status: \"both modified\"." }, cmd: "git status" },
      { text: { az: "Faylı düzəlt (işarələri sil, son variantı saxla).", en: "Fix the file (remove markers, keep the final version)." }, cmd: "edit README.md" },
      { text: { az: "Həll olunduğunu bildir.", en: "Mark it as resolved." }, cmd: "git add README.md" },
      { text: { az: "Birləşməni tamamla.", en: "Conclude the merge." }, cmd: 'git commit -m "Merge feature"' },
    ],
    setup: ["git init", "edit README.md", "git add README.md", 'git commit -m "Add README"', "git switch -c feature", "edit README.md", 'git commit -am "Describe feature in README"', "git switch main", "edit README.md", 'git commit -am "Update README title"'],
    solution: ["git merge feature", "git status", "edit README.md", "git add README.md", 'git commit -m "Merge feature"'],
    check: (s) => {
      const t = tip(s, "main");
      return !!t && !s.merge && t.parents.length === 2 && t.files.includes("README.md");
    },
    done: { az: "Münaqişə həll olundu! Merge commit sənin seçdiyin son variantı saxlayır.", en: "Conflict resolved! The merge commit stores the final version you chose." },
  },
  {
    id: "rebase",
    title: { az: "Rebase", en: "Rebase" },
    goal: { az: "`feature`-i `main`-in üzərinə rebase et ki, tarixçə xətti olsun, sonra `main`-i fast-forward et.", en: "Rebase `feature` onto `main` so history is linear, then fast-forward `main`." },
    concept: {
      az: "Rebase commit-ləri \"köçürmür\" — onları yeni bazanın üzərində yenidən yaradır, ona görə id-lər dəyişir. Qızıl qayda: başqaları ilə paylaşdığın (push etdiyin) commit-ləri rebase etmə.",
      en: "Rebase does not \"move\" commits — it re-creates them on the new base, so their ids change. Golden rule: don't rebase commits you have already shared (pushed).",
    },
    steps: [
      { text: { az: "Sən `feature`-dəsən. Onu `main`-in üzərinə köçür.", en: "You are on `feature`. Replay it on top of `main`." }, cmd: "git rebase main" },
      { text: { az: "Köhnə commit-lər solğun göründü; yeniləri yeni id aldı. `main`-ə keç.", en: "The old commits are faded; the copies got new ids. Switch to `main`." }, cmd: "git switch main" },
      { text: { az: "İndi birləşmə sadəcə fast-forward olacaq.", en: "Now the merge is a plain fast-forward." }, cmd: "git merge feature" },
    ],
    setup: ["git init", 'git commit -m "Initial commit"', "git switch -c feature", 'git commit -m "Add login form"', 'git commit -m "Validate input"', "git switch main", 'git commit -m "Fix typo on main"', "git switch feature"],
    solution: ["git rebase main", "git switch main", "git merge feature"],
    check: (s) => !!s.branches.feature && s.branches.main === s.branches.feature && !hasMerge(s, s.branches.main) && [...ancestors(s, s.branches.main)].some((c) => !!s.commits[c].copyOf),
    done: { az: "Tarixçə xəttidir: `feature` commit-ləri yeni id-lərlə `main`-in üstündədir, merge commit lazım olmadı.", en: "History is linear: the `feature` commits sit on top of `main` with new ids, and no merge commit was needed." },
  },
  {
    id: "remote",
    title: { az: "Push, Pull və Fetch (origin)", en: "Push, Pull and Fetch with origin" },
    goal: { az: "Öz commit-ini serverə göndər. Komanda yoldaşı artıq push edib, ona görə əvvəlcə onun işini götürməlisən.", en: "Send your commit to the server. A teammate already pushed, so you have to get their work first." },
    concept: {
      az: "`origin/main` — serverin son bildiyin vəziyyətidir və yalnız `git fetch`/`git pull` ilə yenilənir. `fetch` sadəcə yükləyir; `pull` = `fetch` + birləşdirmə; `push` sənin commit-lərini serverə göndərir, amma yalnız serverdəki iş itmirsə.",
      en: "`origin/main` is the server state as you last saw it and only updates with `git fetch`/`git pull`. `fetch` only downloads; `pull` = `fetch` + integrate; `push` sends your commits, but only if no work on the server would be lost.",
    },
    steps: [
      { text: { az: "Öz commit-ini et.", en: "Make your own commit." }, cmd: 'git commit -m "My feature"' },
      { text: { az: "Göndərməyə cəhd et — rədd ediləcək.", en: "Try to push — it will be rejected." }, cmd: "git push" },
      { text: { az: "Serverdəki yenilikləri yüklə (yerli budaq dəyişmir).", en: "Download what is new on the server (your branch does not change)." }, cmd: "git fetch" },
      { text: { az: "Vəziyyət: budaqlar ayrılıb.", en: "Status: the branches have diverged." }, cmd: "git status" },
      { text: { az: "Commit-ini serverdəkinin üstünə köçür.", en: "Replay your commit on top of the server's." }, cmd: "git pull --rebase" },
      { text: { az: "İndi push uğurlu olacaq.", en: "Now the push succeeds." }, cmd: "git push" },
    ],
    setup: ['sim teammate "Initial commit"', `git clone ${DEFAULT_URL}`, 'sim teammate "Teammate: update docs"'],
    solution: ['git commit -m "My feature"', "git push", "git fetch", "git status", "git pull --rebase", "git push"],
    check: (s) => {
      const server = s.server.branches.main;
      if (!server || server !== s.branches.main) return false;
      const all = [...ancestors(s.server, server)].map((c) => s.server.commits[c]);
      return all.filter((c) => c.author === "teammate").length >= 2 && all.some((c) => c.author === "you");
    },
    done: { az: "Hazırdır! Server həm komanda yoldaşının, həm də sənin commit-ini saxlayır, `origin/main` isə yerli `main` ilə eynidir.", en: "Done! The server holds both your teammate's commit and yours, and `origin/main` equals your local `main`." },
  },
  {
    id: "fork",
    title: { az: "Fork anlayışı", en: "The fork concept" },
    goal: { az: "Fork-unu klonla, düzəliş üçün budaq yarat, commit et və budağı fork-a push et — Pull Request üçün hazır.", en: "Clone your fork, create a fix branch, commit, and push the branch to your fork — ready for a Pull Request." },
    concept: {
      az: "Fork Git əmri deyil: GitHub/GitLab kimi platformada başqasının repozitoriyasının SƏNİN hesabında server tərəfli surətidir. Burada simulyasiya edilmiş server (`origin`) sənin fork-undur. Sən fork-u klonlayır, budaqda işləyir, fork-a push edir və saytda orijinal layihəyə Pull Request açırsan. Real həyatda orijinal repozitoriyanı adətən ikinci remote kimi (`upstream`) əlavə edirlər; bu sınaq mühiti yalnız bir remote simulyasiya edir.",
      en: "A fork is not a Git command: it is a server-side copy of someone else's repository under YOUR account on a platform like GitHub/GitLab. Here the simulated server (`origin`) is your fork. You clone it, work on a branch, push to your fork and open a Pull Request to the original project on the website. In real life you usually add the original repository as a second remote (`upstream`); this sandbox simulates only one remote.",
    },
    steps: [
      { text: { az: "Fork-unu kompüterə klonla.", en: "Clone your fork to your computer." }, cmd: "git clone https://example.com/you/project-fork.git" },
      { text: { az: "Düzəliş üçün ayrıca budaq yarat.", en: "Create a separate branch for the fix." }, cmd: "git switch -c fix-typo" },
      { text: { az: "Düzəlişi commit et.", en: "Commit the fix." }, cmd: 'git commit -m "Fix typo in docs"' },
      { text: { az: "Budağı fork-una göndər və izləməni quraşdır.", en: "Push the branch to your fork and set up tracking." }, cmd: "git push -u origin fix-typo" },
      { text: { az: "İndi saytda `fix-typo` budağından orijinal layihəyə Pull Request açardın (bu addım Git-dən kənardadır)." , en: "Now you would open a Pull Request from `fix-typo` to the original project on the website (that step is outside Git)." } },
    ],
    setup: ['sim teammate "Initial commit"', 'sim teammate "Add docs"'],
    solution: ["git clone https://example.com/you/project-fork.git", "git switch -c fix-typo", 'git commit -m "Fix typo in docs"', "git push -u origin fix-typo"],
    check: (s) =>
      s.initialized &&
      Object.entries(s.server.branches).some(([b, id]) => b !== "main" && !ancestors(s.server, s.server.branches.main).has(id) && s.upstream[b] === b),
    done: { az: "Budaq fork-undadır. Növbəti addım platformada Pull Request açmaqdır ki, layihə sahibləri dəyişikliyi nəzərdən keçirsin.", en: "The branch is on your fork. Next you open a Pull Request on the platform so the project owners can review it." },
  },
  {
    id: "reset",
    title: { az: "Reset ilə geri qayıtmaq və teq", en: "Undo with reset, then tag" },
    goal: { az: "Səhv son commit-i `git reset --hard HEAD~1` ilə ləğv et və düzgün commit-i `v1.0` teqi ilə işarələ.", en: "Undo the wrong last commit with `git reset --hard HEAD~1` and mark the correct commit with tag `v1.0`." },
    concept: {
      az: "`reset --hard` budağı geri çəkir və commit olunmamış işi silir. Push edilmiş commit-lər üçün əvəzinə `git revert` istifadə olunur ki, başqalarının tarixçəsi pozulmasın.",
      en: "`reset --hard` moves the branch back and discards uncommitted work. For commits already pushed, use `git revert` instead so others' history is not broken.",
    },
    steps: [
      { text: { az: "Tarixçəyə bax.", en: "Look at the history." }, cmd: "git log --oneline" },
      { text: { az: "Son commit-i ləğv et.", en: "Undo the last commit." }, cmd: "git reset --hard HEAD~1" },
      { text: { az: "Düzgün commit-i teqlə.", en: "Tag the correct commit." }, cmd: "git tag v1.0" },
    ],
    setup: ["git init", 'git commit -m "Initial commit"', 'git commit -m "Add feature"', 'git commit -m "Oops: debug code"'],
    solution: ["git log --oneline", "git reset --hard HEAD~1", "git tag v1.0"],
    check: (s) => {
      const t = tip(s, "main");
      return !!t && t.message === "Add feature" && Object.values(s.tags).includes(t.id);
    },
    done: { az: "Səhv commit budaqdan çıxdı (qrafikdə solğun), `v1.0` isə düzgün vəziyyəti işarələyir.", en: "The wrong commit is off the branch (faded in the graph) and `v1.0` marks the correct state." },
  },
];

export function startState(setup: string[]): GitState {
  return runAll(initialState(), setup).state;
}

export const findScenario = (id: string | undefined) => SCENARIOS.find((s) => s.id === id);
