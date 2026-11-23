// Git & GitHub academy: Git fundamentals, GitHub and other developer platforms.
// Explanatory text is written in Azerbaijani and English; topic titles in all four locales.
// Commands target Git 2.x (2.28+ for `git init -b`, 2.23+ for `git switch` / `git restore`).
import type { CodeLang, L, QuizQuestion, Source } from "./types";

export type GitGroup = "git" | "github" | "platforms";

export interface GitExample {
  code: string;
  lang: CodeLang;
  /** What the snippet does and why. */
  explain: L;
}

export interface GitTopic {
  id: string;
  group: GitGroup;
  title: L;
  /** One-sentence summary used on tiles. */
  summary: L;
  /** What it is and why it matters. */
  what: L;
  how: L;
  examples: GitExample[];
  mistakes: L[];
  exercise: L;
  quiz: QuizQuestion[];
  docs: Source[];
  /** Shows a link to the interactive Git Visualizer (#/gitviz). */
  viz?: boolean;
}

export const GIT_GROUPS: GitGroup[] = ["git", "github", "platforms"];

const l = (az: string, en: string): L => ({ az, en });
const t4 = (az: string, en: string, tr: string, ru: string): L => ({ az, en, tr, ru });
const code = (...lines: string[]) => lines.join("\n");
const ex = (c: string, explain: L, lang: CodeLang = "plain"): GitExample => ({ code: c, lang, explain });
const q = (prompt: L, options: (L | string)[], answer: number, explain: L): QuizQuestion => ({ kind: "choice", prompt, options, answer, explain });
const doc = (title: string, url: string): Source => ({ title, url });

// ---------------------------------------------------------------------------
// 1. Git fundamentals
// ---------------------------------------------------------------------------

const GIT: GitTopic[] = [
  {
    id: "what-is-git",
    group: "git",
    viz: true,
    title: t4("Git nədir?", "What is Git?", "Git nedir?", "Что такое Git?"),
    summary: l(
      "Git — layihənin bütün dəyişiklik tarixçəsini saxlayan paylanmış versiya nəzarəti sistemidir (version control system).",
      "Git is a distributed version control system that keeps the full history of a project's changes.",
    ),
    what: l(
      "Git faylların dəyişikliklərini zaman üzrə izləyən versiya nəzarəti sistemidir. Onun sayəsində istənilən köhnə vəziyyətə qayıtmaq, kimin nəyi və niyə dəyişdiyini görmək və bir neçə nəfərlə eyni layihə üzərində paralel işləmək mümkündür. Git paylanmışdır (distributed): hər developerin kompüterində bütün tarixçə ilə birlikdə tam kopya olur, ona görə də işin çoxu internet olmadan görülür. Git demək olar ki, bütün müasir proqram layihələrində standartdır.",
      "Git is a version control system that tracks changes to files over time. It lets you return to any earlier state, see who changed what and why, and work in parallel with other people on the same project. Git is distributed: every developer's machine holds a complete copy including the full history, so most work happens offline. Git is the standard in almost every modern software project.",
    ),
    how: l(
      "Git layihə qovluğunda gizli `.git` qovluğu yaradır və tarixçəni orada saxlayır. Faylları üç sahə arasında hərəkət etdirirsiniz: işçi qovluq (working tree) — redaktə etdiyiniz fayllar; hazırlıq sahəsi (staging area / index) — növbəti commit-ə daxil ediləcək dəyişikliklər; repozitoriya (repository) — yadda saxlanmış commit-lər. `git add` dəyişikliyi hazırlıq sahəsinə, `git commit` isə onu tarixçəyə yazır. Hər commit layihənin tam “şəklini” (snapshot) saxlayır və unikal SHA identifikatoru ilə tanınır.",
      "Git creates a hidden `.git` folder in the project and stores the history there. You move changes between three areas: the working tree (the files you edit), the staging area or index (changes that will go into the next commit) and the repository (saved commits). `git add` moves a change to the staging area and `git commit` writes it into history. Every commit stores a full snapshot of the project and is identified by a unique SHA hash.",
    ),
    examples: [
      ex(
        code("git --version", "git config --global user.name \"Aysel Mammadova\"", "git config --global user.email \"aysel@example.com\"", "git config --global init.defaultBranch main"),
        l(
          "Quraşdırılmış versiyanı yoxlayır və bir dəfəlik qlobal ayarları edir: ad və e-poçt hər commit-ə yazılır, yeni repozitoriyaların əsas branch-ı isə `main` adlanacaq.",
          "Checks the installed version and makes one-time global settings: the name and email are written into every commit, and new repositories will start with a branch called `main`.",
        ),
      ),
      ex(
        code("git status", "git log --oneline"),
        l(
          "`git status` hansı faylların dəyişdiyini və hansıların hazırlıq sahəsində olduğunu göstərir; `git log --oneline` commit tarixçəsini qısa formada çıxarır.",
          "`git status` shows which files changed and which are staged; `git log --oneline` prints the commit history in a compact form.",
        ),
      ),
    ],
    mistakes: [
      l(
        "Git ilə GitHub-u eyni şey hesab etmək. Git kompüterinizdəki alətdir, GitHub isə Git repozitoriyalarını saxlayan onlayn xidmətdir.",
        "Thinking Git and GitHub are the same thing. Git is a tool on your computer; GitHub is an online service that hosts Git repositories.",
      ),
      l(
        "`user.name` və `user.email` ayarlamadan commit etmək — commit-lər səhv və ya boş müəllif məlumatı ilə yazılır.",
        "Committing before setting `user.name` and `user.email`, so commits get wrong or missing author information.",
      ),
    ],
    exercise: l(
      "Git-i quraşdırın, `git --version` ilə yoxlayın, adınızı və e-poçtunuzu qlobal olaraq ayarlayın və `git config --global --list` ilə nəticəni yoxlayın.",
      "Install Git, check it with `git --version`, set your name and email globally and verify them with `git config --global --list`.",
    ),
    quiz: [
      q(
        l("Git-in “paylanmış” (distributed) olması nə deməkdir?", "What does it mean that Git is “distributed”?"),
        [
          l("Hər developerdə tarixçə ilə birlikdə repozitoriyanın tam kopyası olur", "Every developer has a full copy of the repository including history"),
          l("Fayllar yalnız mərkəzi serverdə saxlanır", "Files are stored only on a central server"),
          l("Git yalnız internetlə işləyir", "Git only works online"),
        ],
        0,
        l("Hər klon tam repozitoriyadır, ona görə commit, log və branch əməliyyatları lokal işləyir.", "Every clone is a complete repository, so commit, log and branch operations work locally."),
      ),
      q(
        l("Dəyişikliyi növbəti commit üçün hazırlıq sahəsinə hansı əmr əlavə edir?", "Which command adds a change to the staging area for the next commit?"),
        ["git add", "git commit", "git push"],
        0,
        l("`git add` dəyişikliyi index-ə (staging area) qoyur; `git commit` onu tarixçəyə yazır.", "`git add` puts the change into the index (staging area); `git commit` then records it."),
      ),
    ],
    docs: [doc("Pro Git: What is Git?", "https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F"), doc("git-config", "https://git-scm.com/docs/git-config")],
  },
  {
    id: "repository",
    group: "git",
    viz: true,
    title: t4("Repozitoriya", "Repository", "Depo (Repository)", "Репозиторий"),
    summary: l("Repozitoriya — layihənin faylları və onların bütün tarixçəsidir.", "A repository is a project's files together with their complete history."),
    what: l(
      "Repozitoriya (repository, qısaca “repo”) Git-in izlədiyi layihədir: fayllar, commit tarixçəsi, branch-lar və tag-lar. Lokal repozitoriya kompüterinizdə, uzaq repozitoriya (remote) isə GitHub, GitLab kimi serverdə olur. Komanda işi adətən bir uzaq repozitoriya ətrafında qurulur və hər kəs ona öz lokal kopyası ilə qoşulur.",
      "A repository (“repo”) is a project tracked by Git: its files, commit history, branches and tags. A local repository lives on your computer; a remote repository lives on a server such as GitHub or GitLab. Team work usually revolves around one remote repository that everyone connects to with their own local copy.",
    ),
    how: l(
      "Yeni repozitoriya `git init` ilə yaradılır — bu, qovluqda `.git` alt qovluğunu yaradır. Mövcud repozitoriyanın kopyası `git clone` ilə alınır. Uzaq repozitoriyaların siyahısı `git remote` ilə idarə olunur; ənənəvi olaraq əsas remote `origin` adlanır. `.git` qovluğunu silsəniz, bütün tarixçə itir, fayllar isə adi qovluq kimi qalır.",
      "A new repository is created with `git init`, which adds a `.git` subfolder. A copy of an existing repository is made with `git clone`. Remote repositories are managed with `git remote`; by convention the main remote is called `origin`. If you delete the `.git` folder, the whole history is gone and only plain files remain.",
    ),
    examples: [
      ex(
        code("mkdir my-app", "cd my-app", "git init -b main", "git status"),
        l(
          "Yeni qovluq yaradır və onu əsas branch-ı `main` olan Git repozitoriyasına çevirir (`-b` seçimi Git 2.28-dən mövcuddur).",
          "Creates a folder and turns it into a Git repository whose initial branch is `main` (`-b` is available since Git 2.28).",
        ),
      ),
      ex(
        code("git remote add origin https://github.com/USER/my-app.git", "git remote -v"),
        l(
          "Lokal repozitoriyanı `origin` adlı uzaq repozitoriyaya bağlayır və bağlantıları göstərir.",
          "Connects the local repository to a remote called `origin` and lists the configured remotes.",
        ),
      ),
    ],
    mistakes: [
      l(
        "Ev qovluğunda (məsələn, `C:\\Users\\ad`) `git init` etmək — bütün şəxsi fayllar bir repozitoriyaya düşür.",
        "Running `git init` in your home folder (e.g. `C:\\Users\\name`), so all personal files end up in one repository.",
      ),
      l(
        "Mövcud repozitoriyanın içində yenidən `git init` edib iç-içə repozitoriyalar yaratmaq.",
        "Running `git init` again inside an existing repository and creating nested repositories by accident.",
      ),
    ],
    exercise: l(
      "`practice-repo` adlı qovluq yaradın, `git init -b main` ilə repozitoriya edin, `README.md` faylı əlavə edin və `git status` çıxışını oxuyub faylın “untracked” olduğunu müəyyən edin.",
      "Create a folder `practice-repo`, make it a repository with `git init -b main`, add a `README.md` file and read the `git status` output to confirm the file is “untracked”.",
    ),
    quiz: [
      q(
        l("Git tarixçəni harada saxlayır?", "Where does Git store the history?"),
        [l("Layihə qovluğundakı gizli `.git` qovluğunda", "In the hidden `.git` folder of the project"), l("Yalnız GitHub-da", "Only on GitHub"), l("Hər faylın içində", "Inside each file")],
        0,
        l("Bütün commit-lər, branch-lar və ayarlar `.git` qovluğundadır.", "All commits, branches and settings live in the `.git` folder."),
      ),
      q(
        l("Əsas uzaq repozitoriyanın ənənəvi adı nədir?", "What is the conventional name of the main remote?"),
        ["origin", "master", "upstream"],
        0,
        l("`git clone` remote-u avtomatik olaraq `origin` adlandırır. `upstream` adətən fork-un mənbəyi üçün istifadə olunur.", "`git clone` names the remote `origin` automatically. `upstream` is commonly used for the source of a fork."),
      ),
    ],
    docs: [doc("git-init", "https://git-scm.com/docs/git-init"), doc("git-remote", "https://git-scm.com/docs/git-remote")],
  },
  {
    id: "commit",
    group: "git",
    viz: true,
    title: t4("Commit", "Commit", "Commit", "Коммит"),
    summary: l("Commit — layihənin müəyyən anda yadda saxlanmış vəziyyəti və onun izahıdır.", "A commit is a saved snapshot of the project with a message explaining it."),
    what: l(
      "Commit layihənin müəyyən andakı “şəklidir” (snapshot): hansı faylların necə olduğu, müəllif, tarix və izah mesajı. Commit-lər tarixçəni təşkil edir və hər biri əvvəlki commit-ə (parent) istinad edir. Yaxşı commit-lər kiçik və məntiqi bütöv olur, mesajı isə dəyişikliyin nə üçün edildiyini izah edir — bu, səhv axtarışını və kod baxışını (code review) xeyli asanlaşdırır.",
      "A commit is a snapshot of the project at a point in time: the state of the files, the author, the date and a message. Commits form the history, each pointing to its previous (parent) commit. Good commits are small and logically complete, and their message explains why the change was made — this makes debugging and code review much easier.",
    ),
    how: l(
      "Əvvəlcə dəyişiklikləri `git add` ilə seçirsiniz, sonra `git commit -m \"mesaj\"` ilə yadda saxlayırsınız. Səhvən hazırlığa əlavə edilmiş faylı `git restore --staged` geri çıxarır. Hələ push edilməmiş son commit-i `git commit --amend` ilə düzəltmək olar. Hər commit-in SHA identifikatoru var; `git show <sha>` onun məzmununu göstərir.",
      "First you choose changes with `git add`, then save them with `git commit -m \"message\"`. `git restore --staged` removes a file from the staging area if you added it by mistake. The last commit, if not pushed yet, can be fixed with `git commit --amend`. Every commit has a SHA; `git show <sha>` displays its contents.",
    ),
    examples: [
      ex(
        code("git add index.html style.css", "git commit -m \"Add landing page layout\"", "git log --oneline -3"),
        l("İki faylı hazırlayır, onları bir commit kimi yadda saxlayır və son üç commit-i göstərir.", "Stages two files, saves them as one commit and shows the last three commits."),
      ),
      ex(
        code("git restore --staged secrets.txt", "git restore style.css", "git commit --amend -m \"Add landing page layout and header\""),
        l(
          "Birinci sətir faylı hazırlıq sahəsindən çıxarır (fayl dəyişmir); ikinci sətir işçi qovluqdakı commit olunmamış dəyişiklikləri silir (geri qaytarılmır!); üçüncü sətir son commit-in mesajını dəyişir.",
          "The first line unstages a file (the file itself is unchanged); the second discards uncommitted changes in the working tree (this cannot be undone!); the third rewrites the last commit's message.",
        ),
      ),
    ],
    mistakes: [
      l("“fix”, “update” kimi heç nə izah etməyən commit mesajları yazmaq.", "Writing messages like “fix” or “update” that explain nothing."),
      l("Bir commit-ə bir-biri ilə əlaqəsiz çoxlu dəyişiklik yığmaq — sonra onları ayrıca geri qaytarmaq olmur.", "Packing many unrelated changes into one commit, so they cannot be reverted separately."),
      l("Artıq push edilmiş commit-i `--amend` ilə dəyişmək — başqalarının tarixçəsi ilə uyğunsuzluq yaranır.", "Amending a commit that was already pushed, which makes your history diverge from everyone else's."),
    ],
    exercise: l(
      "Repozitoriyanızda iki fayl yaradın, onları iki ayrı commit kimi yadda saxlayın (hər biri aydın mesajla), sonra `git log --oneline` ilə iki commit-in görünməsini yoxlayın.",
      "Create two files in your repository, save them as two separate commits with clear messages, then confirm with `git log --oneline` that both commits appear.",
    ),
    quiz: [
      q(
        l("Faylı hazırlıq sahəsindən çıxarmaq, amma dəyişikliyi saxlamaq üçün hansı əmr istifadə olunur?", "Which command unstages a file but keeps its changes?"),
        ["git restore --staged file", "git restore file", "git rm file"],
        0,
        l("`--staged` yalnız index-i dəyişir; `git restore file` isə işçi qovluqdakı dəyişikliyi silir.", "`--staged` only changes the index; `git restore file` discards the working-tree change."),
      ),
      q(
        l("Yaxşı commit mesajı nəyi izah etməlidir?", "What should a good commit message explain?"),
        [l("Dəyişikliyin nə etdiyini və niyə edildiyini", "What the change does and why"), l("Yalnız fayl adlarını", "Only the file names"), l("Commit-in tarixini", "The commit date")],
        0,
        l("Fayllar və tarix Git tərəfindən onsuz da yazılır; mesaj məqsədi izah etməlidir.", "Git already records files and dates; the message should explain the intent."),
      ),
    ],
    docs: [doc("git-commit", "https://git-scm.com/docs/git-commit"), doc("git-restore", "https://git-scm.com/docs/git-restore")],
  },
  {
    id: "branch",
    group: "git",
    viz: true,
    title: t4("Branch (budaq)", "Branch", "Dal (Branch)", "Ветка (branch)"),
    summary: l("Branch — əsas kodu pozmadan ayrıca xətdə işləməyə imkan verən göstəricidir.", "A branch is a pointer that lets you work on a separate line without breaking the main code."),
    what: l(
      "Branch (budaq) müstəqil inkişaf xəttidir. Yeni funksiya və ya düzəliş üçün ayrıca branch açırsınız, əsas `main` branch-ı isə stabil qalır. İş bitəndə branch əsas xəttə birləşdirilir (merge). Git-də branch çox ucuzdur: o, sadəcə bir commit-ə işarə edən göstəricidir (pointer), ona görə yaratmaq və silmək dərhal baş verir.",
      "A branch is an independent line of development. You open a branch for a new feature or fix while `main` stays stable, and merge it back when the work is done. Branches are cheap in Git: a branch is just a pointer to a commit, so creating and deleting one is instant.",
    ),
    how: l(
      "`HEAD` hazırda olduğunuz branch-ı göstərir. Yeni commit etdikdə cari branch-ın göstəricisi irəli hərəkət edir. `git switch -c ad` yeni branch yaradıb ona keçir, `git switch ad` mövcud branch-a keçir. Birləşdirilmiş branch-ı `git branch -d` silir; birləşdirilməmiş branch-ı silmək üçün `-D` lazımdır və bu, commit-lərin itirilməsinə səbəb ola bilər.",
      "`HEAD` points to the branch you are on. When you commit, the current branch pointer moves forward. `git switch -c name` creates a branch and switches to it; `git switch name` switches to an existing one. `git branch -d` deletes a merged branch; an unmerged branch needs `-D`, which can lose commits.",
    ),
    examples: [
      ex(
        code("git switch -c feature/login", "git add login.js", "git commit -m \"Add login form\"", "git switch main"),
        l("`feature/login` branch-ını yaradır, orada commit edir və `main`-ə qayıdır. `main` bu commit-i hələ görmür.", "Creates `feature/login`, commits on it and returns to `main`, which does not contain that commit yet."),
      ),
      ex(
        code("git branch", "git branch -d feature/login"),
        l("Lokal branch-ları sadalayır (cari branch `*` ilə işarələnir) və birləşdirilmiş branch-ı silir.", "Lists local branches (the current one is marked with `*`) and deletes a merged branch."),
      ),
    ],
    mistakes: [
      l("Bütün işi birbaşa `main` üzərində görmək — yarımçıq kod əsas xəttə düşür.", "Doing all work directly on `main`, so unfinished code lands in the main line."),
      l("Commit olunmamış dəyişikliklərlə branch dəyişmək və onların yeni branch-a “keçdiyini” görüb təəccüblənmək. Əvvəlcə commit edin və ya `git stash` istifadə edin.", "Switching branches with uncommitted changes and being surprised they “follow” you. Commit first or use `git stash`."),
    ],
    exercise: l(
      "`main`-dən `feature/about` branch-ı açın, orada `about.md` faylı yaradıb commit edin, `main`-ə qayıdın və faylın orada olmadığını yoxlayın.",
      "Create `feature/about` from `main`, add and commit an `about.md` file there, switch back to `main` and confirm the file is not present.",
    ),
    quiz: [
      q(
        l("Yeni branch yaradıb dərhal ona keçən əmr hansıdır?", "Which command creates a new branch and switches to it?"),
        ["git switch -c feature", "git branch -d feature", "git merge feature"],
        0,
        l("`-c` (create) yeni branch yaradır. Köhnə ekvivalenti `git checkout -b feature`-dir.", "`-c` (create) makes the branch. The older equivalent is `git checkout -b feature`."),
      ),
      q(
        l("Git-də branch əslində nədir?", "What is a branch in Git, technically?"),
        [l("Bir commit-ə işarə edən yüngül göstərici", "A lightweight pointer to a commit"), l("Layihənin tam surəti olan qovluq", "A folder with a full copy of the project"), l("Ayrıca server", "A separate server")],
        0,
        l("Branch sadəcə commit SHA-sını saxlayan göstəricidir, ona görə çox ucuzdur.", "A branch just stores a commit SHA, which is why branches are cheap."),
      ),
    ],
    docs: [doc("git-branch", "https://git-scm.com/docs/git-branch"), doc("git-switch", "https://git-scm.com/docs/git-switch")],
  },
  {
    id: "merge",
    group: "git",
    viz: true,
    title: t4("Merge (birləşdirmə)", "Merge", "Birleştirme (Merge)", "Слияние (merge)"),
    summary: l("Merge bir branch-ın dəyişikliklərini digərinə birləşdirir.", "Merge combines the changes of one branch into another."),
    what: l(
      "Merge iki inkişaf xəttini birləşdirir: məsələn, hazır funksiya branch-ını `main`-ə. Bu, komanda işinin əsasıdır — hər kəs öz branch-ında işləyir, nəticələr isə merge ilə bir yerə toplanır. Merge tarixçəni silmir; hər iki tərəfin commit-ləri saxlanılır.",
      "Merge joins two lines of development, for example a finished feature branch into `main`. It is the basis of team work: everyone works on their own branch and results are brought together by merging. Merging does not erase history; commits from both sides are kept.",
    ),
    how: l(
      "Hədəf branch-a keçirsiniz və `git merge mənbə` icra edirsiniz. Hədəf branch ayrıldıqdan sonra dəyişməyibsə, Git sadəcə göstəricini irəli çəkir (fast-forward). Hər iki tərəfdə yeni commit-lər varsa, Git iki valideyni olan xüsusi merge commit yaradır. Eyni sətirlər hər iki tərəfdə fərqli dəyişibsə, konflikt (conflict) yaranır və onu əl ilə həll etmək lazımdır.",
      "You switch to the target branch and run `git merge source`. If the target has not changed since the branch was created, Git just moves the pointer forward (fast-forward). If both sides have new commits, Git creates a merge commit with two parents. If the same lines changed differently on both sides, a conflict occurs and you resolve it by hand.",
    ),
    examples: [
      ex(
        code("git switch main", "git merge feature/login"),
        l("`feature/login`-dəki commit-ləri `main`-ə birləşdirir. Mümkündürsə fast-forward, deyilsə merge commit yaradılır.", "Merges the commits of `feature/login` into `main`, as a fast-forward when possible and with a merge commit otherwise."),
      ),
      ex(
        code("git merge --no-ff feature/login", "git merge --abort"),
        l(
          "`--no-ff` fast-forward mümkün olsa belə merge commit yaradır ki, funksiyanın tarixçədə ayrıca qrup kimi görünsün. `--abort` konfliktli yarımçıq merge-i ləğv edib əvvəlki vəziyyətə qaytarır.",
          "`--no-ff` always creates a merge commit so the feature stays visible as a group in history. `--abort` cancels a conflicted merge in progress and restores the previous state.",
        ),
      ),
    ],
    mistakes: [
      l("Yanlış branch-da olarkən merge etmək. Merge cari branch-a edilir — əvvəlcə `git status` ilə yoxlayın.", "Merging while on the wrong branch. Merge goes into the current branch — check with `git status` first."),
      l("Commit olunmamış dəyişikliklərlə merge başlamaq — konflikt zamanı vəziyyət qarışıq olur.", "Starting a merge with uncommitted changes, which makes conflicts confusing."),
    ],
    exercise: l(
      "Bir funksiya branch-ında iki commit edin, `main`-ə qayıdıb `git merge` icra edin və `git log --oneline --graph` ilə nəticənin fast-forward olub-olmadığını müəyyən edin.",
      "Make two commits on a feature branch, return to `main`, run `git merge` and use `git log --oneline --graph` to tell whether it was a fast-forward.",
    ),
    quiz: [
      q(
        l("Fast-forward merge nə vaxt mümkündür?", "When is a fast-forward merge possible?"),
        [
          l("Hədəf branch ayrılmadan sonra yeni commit almayıbsa", "When the target branch has no new commits since the branch split off"),
          l("Hər iki branch-da yeni commit-lər olanda", "When both branches have new commits"),
          l("Yalnız konflikt olanda", "Only when there is a conflict"),
        ],
        0,
        l("Bu halda Git sadəcə göstəricini irəli çəkir və yeni commit yaratmır.", "Git then just moves the pointer forward and creates no new commit."),
      ),
      q(
        l("Konfliktli merge-i ləğv etmək üçün hansı əmr var?", "Which command cancels a conflicted merge?"),
        ["git merge --abort", "git merge --no-ff", "git branch -D"],
        0,
        l("`git merge --abort` merge-dən əvvəlki vəziyyəti bərpa edir.", "`git merge --abort` restores the state from before the merge."),
      ),
    ],
    docs: [doc("git-merge", "https://git-scm.com/docs/git-merge"), doc("Pro Git: Basic Branching and Merging", "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging")],
  },
  {
    id: "clone",
    group: "git",
    title: t4("Clone (klonlama)", "Clone", "Klonlama (Clone)", "Клонирование (clone)"),
    summary: l("Clone uzaq repozitoriyanın tam lokal kopyasını yaradır.", "Clone creates a full local copy of a remote repository."),
    what: l(
      "`git clone` mövcud repozitoriyanı (məsələn, GitHub-dakı) bütün tarixçəsi ilə birlikdə kompüterinizə endirir. Açıq mənbəli layihəni öyrənmək, komandanın layihəsinə qoşulmaq və ya öz repozitoriyanızı başqa kompüterdə işlətmək üçün ilk addım budur.",
      "`git clone` downloads an existing repository (for example from GitHub) with its full history to your computer. It is the first step to study an open-source project, join a team project or work on your own repository from another machine.",
    ),
    how: l(
      "Git yeni qovluq yaradır, bütün obyektləri endirir, uzaq repozitoriyanı `origin` adı ilə qeyd edir və standart branch-ı (adətən `main`) işçi qovluğa çıxarır. Ünvan HTTPS (`https://...`) və ya SSH (`git@github.com:...`) ola bilər. SSH üçün əvvəlcə SSH açarını hesabınıza əlavə etməlisiniz.",
      "Git creates a new folder, downloads all objects, registers the remote as `origin` and checks out the default branch (usually `main`). The URL can be HTTPS (`https://...`) or SSH (`git@github.com:...`); SSH requires adding an SSH key to your account first.",
    ),
    examples: [
      ex(
        code("git clone https://github.com/USER/project.git", "cd project", "git remote -v"),
        l("Repozitoriyanı `project` qovluğuna klonlayır və `origin` bağlantısını göstərir.", "Clones the repository into a `project` folder and shows the `origin` remote."),
      ),
      ex(
        code("git clone git@github.com:USER/project.git my-folder", "git clone --depth 1 https://github.com/USER/big-project.git"),
        l(
          "Birinci əmr SSH ilə öz seçdiyiniz qovluğa klonlayır. İkinci əmr yalnız son commit-i endirən “dayaz” (shallow) klon yaradır — böyük layihələrə tez baxmaq üçün faydalıdır.",
          "The first clones over SSH into a folder of your choice. The second makes a shallow clone with only the latest commit — handy for a quick look at large projects.",
        ),
      ),
    ],
    mistakes: [
      l("Repozitoriyanı başqa repozitoriyanın içinə klonlamaq — iç-içə repozitoriya yaranır.", "Cloning a repository inside another repository, creating a nested repo."),
      l("Başqasının layihəsinə töhfə vermək üçün birbaşa onu klonlayıb push etməyə çalışmaq. Yazma icazəniz yoxdursa, əvvəlcə fork edin.", "Cloning someone else's project and trying to push to it. Without write access, fork it first."),
    ],
    exercise: l(
      "İstənilən açıq GitHub repozitoriyasını klonlayın, `git log --oneline -5` ilə son commit-lərə baxın və `git branch -a` ilə uzaq branch-ları sadalayın.",
      "Clone any public GitHub repository, view its latest commits with `git log --oneline -5` and list remote branches with `git branch -a`.",
    ),
    quiz: [
      q(
        l("`git clone` uzaq repozitoriyanı hansı adla qeyd edir?", "Under which name does `git clone` register the remote?"),
        ["origin", "main", "remote"],
        0,
        l("Klonlamadan sonra `origin` mənbə repozitoriyaya işarə edir.", "After cloning, `origin` points to the source repository."),
      ),
      q(
        l("`--depth 1` seçimi nə edir?", "What does `--depth 1` do?"),
        [l("Yalnız son commit-i endirir", "Downloads only the latest commit"), l("Yalnız bir faylı endirir", "Downloads only one file"), l("Bir branch silir", "Deletes one branch")],
        0,
        l("Dayaz klon tarixçəni qısaldır və endirməni sürətləndirir.", "A shallow clone truncates history and speeds up the download."),
      ),
    ],
    docs: [doc("git-clone", "https://git-scm.com/docs/git-clone"), doc("GitHub Docs: Cloning a repository", "https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository")],
  },
  {
    id: "push",
    group: "git",
    viz: true,
    title: t4("Push (göndərmə)", "Push", "Gönderme (Push)", "Отправка (push)"),
    summary: l("Push lokal commit-ləri uzaq repozitoriyaya göndərir.", "Push sends your local commits to a remote repository."),
    what: l(
      "Commit-lər əvvəlcə yalnız kompüterinizdə olur. `git push` onları uzaq repozitoriyaya (məsələn, GitHub-a) göndərir ki, komanda yoldaşları görə bilsin, ehtiyat nüsxə yaransın və CI/CD işə düşsün.",
      "Commits exist only on your machine at first. `git push` sends them to the remote repository (for example GitHub) so teammates can see them, a backup exists and CI/CD can run.",
    ),
    how: l(
      "`git push origin main` lokal `main`-i `origin`-dəki `main`-ə göndərir. Yeni branch-ı ilk dəfə göndərərkən `-u` (`--set-upstream`) izlənən branch əlaqəsini qurur; bundan sonra sadəcə `git push` kifayətdir. Uzaq branch-da sizdə olmayan commit-lər varsa, Git push-u rədd edir (rejected) — əvvəlcə onları pull/fetch etməlisiniz.",
      "`git push origin main` sends local `main` to `main` on `origin`. When pushing a new branch the first time, `-u` (`--set-upstream`) sets up tracking so plain `git push` works afterwards. If the remote branch has commits you do not have, Git rejects the push — you must pull or fetch them first.",
    ),
    examples: [
      ex(
        code("git push -u origin main", "git push"),
        l("İlk push zamanı `main`-i `origin/main` ilə əlaqələndirir; sonrakı push-lar üçün qısa forma işləyir.", "The first push links `main` with `origin/main`; later pushes can use the short form."),
      ),
      ex(
        code("git switch -c fix/typo", "git commit -am \"Fix typo in README\"", "git push -u origin fix/typo"),
        l(
          "Yeni branch yaradır, izlənən fayllardakı dəyişiklikləri commit edir (`-a` yeni faylları əlavə etmir) və branch-ı GitHub-a göndərir ki, pull request açmaq olsun.",
          "Creates a branch, commits changes to tracked files (`-a` does not add new files) and pushes the branch so a pull request can be opened.",
        ),
      ),
      ex(
        code("git push --force-with-lease"),
        l(
          "Tarixçəni dəyişdikdən sonra (məsələn, rebase) yalnız öz branch-ınızı məcburi yeniləyir. `--force`-dan fərqli olaraq, başqası arada push edibsə, imtina edir.",
          "After rewriting history (e.g. a rebase) it force-updates your own branch, but unlike `--force` it refuses if someone else pushed in the meantime.",
        ),
      ),
    ],
    mistakes: [
      l("Push rədd ediləndə `--force` istifadə etmək — başqalarının commit-ləri silinə bilər.", "Using `--force` when a push is rejected, which can delete other people's commits."),
      l("Commit etmədən push etməyə çalışmaq. Push yalnız commit-ləri göndərir, yadda saxlanmamış dəyişiklikləri yox.", "Trying to push without committing. Push only sends commits, not unsaved changes."),
    ],
    exercise: l(
      "GitHub-da boş repozitoriya yaradın, lokal repozitoriyanızı `git remote add origin ...` ilə bağlayın və `git push -u origin main` ilə göndərin. Sonra brauzerdə faylları yoxlayın.",
      "Create an empty repository on GitHub, connect your local one with `git remote add origin ...`, push with `git push -u origin main` and check the files in the browser.",
    ),
    quiz: [
      q(
        l("`git push -u origin main`-dəki `-u` nə edir?", "What does `-u` do in `git push -u origin main`?"),
        [
          l("Lokal branch üçün izlənən (upstream) branch təyin edir", "Sets the upstream (tracking) branch for the local branch"),
          l("Bütün commit-ləri silir", "Deletes all commits"),
          l("Push-u məcburi edir", "Forces the push"),
        ],
        0,
        l("Bundan sonra `git push` və `git pull` hansı uzaq branch-ı nəzərdə tutduğunuzu bilir.", "Afterwards `git push` and `git pull` know which remote branch you mean."),
      ),
      q(
        l("Push “rejected” olduqda adətən ilk addım nədir?", "What is usually the first step when a push is rejected?"),
        [l("Uzaq dəyişiklikləri `git pull` ilə almaq", "Get the remote changes with `git pull`"), l("`git push --force`", "`git push --force`"), l("Repozitoriyanı silmək", "Delete the repository")],
        0,
        l("Rədd, uzaqda sizdə olmayan commit-lər olduğunu bildirir; onları inteqrasiya edib yenidən push edin.", "A rejection means the remote has commits you lack; integrate them, then push again."),
      ),
    ],
    docs: [doc("git-push", "https://git-scm.com/docs/git-push"), doc("GitHub Docs: Pushing commits", "https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository")],
  },
  {
    id: "pull",
    group: "git",
    viz: true,
    title: t4("Pull (çəkmə)", "Pull", "Çekme (Pull)", "Получение (pull)"),
    summary: l("Pull uzaq dəyişiklikləri endirib cari branch-a birləşdirir.", "Pull downloads remote changes and integrates them into the current branch."),
    what: l(
      "Komanda yoldaşlarınız push etdikcə uzaq repozitoriya dəyişir. `git pull` bu dəyişiklikləri sizin branch-a gətirir ki, ən son kodla işləyəsiniz. Gündə bir neçə dəfə, xüsusən işə başlamazdan və push etməzdən əvvəl pull etmək yaxşı vərdişdir.",
      "As teammates push, the remote repository changes. `git pull` brings those changes into your branch so you work on the latest code. Pulling several times a day, especially before starting work and before pushing, is a good habit.",
    ),
    how: l(
      "`git pull` əslində iki addımdır: `git fetch` (yeni commit-ləri endirmək) və ardınca `git merge` (və ya `--rebase` ilə `git rebase`). Lokal və uzaq branch ayrılıbsa, merge commit və ya konflikt yarana bilər. Davranışı `pull.rebase` ayarı ilə seçə bilərsiniz; ayar yoxdursa və branch-lar ayrılıbsa, yeni Git versiyaları dayanıb seçim etməyinizi istəyir.",
      "`git pull` is really two steps: `git fetch` (download new commits) followed by `git merge` (or `git rebase` with `--rebase`). If local and remote have diverged, a merge commit or a conflict can result. You can choose the behaviour with the `pull.rebase` setting; if it is not set and the branches have diverged, recent Git versions stop and ask you to choose.",
    ),
    examples: [
      ex(code("git switch main", "git pull"), l("`main`-i `origin/main`-dəki son dəyişikliklərlə yeniləyir.", "Updates `main` with the latest changes from `origin/main`.")),
      ex(
        code("git pull --rebase", "git config --global pull.rebase true"),
        l(
          "Birinci əmr lokal commit-lərinizi endirilmiş commit-lərin üstünə köçürür (merge commit yaratmır). İkinci əmr bunu standart davranış edir.",
          "The first replays your local commits on top of the downloaded ones (no merge commit). The second makes that the default behaviour.",
        ),
      ),
    ],
    mistakes: [
      l("Uzun müddət pull etməmək — sonra böyük və çətin konfliktlər yaranır.", "Not pulling for a long time, which leads to large, painful conflicts."),
      l("Commit olunmamış dəyişikliklərlə pull etmək; Git imtina edə bilər. Əvvəlcə commit edin və ya `git stash` edin.", "Pulling with uncommitted changes; Git may refuse. Commit or `git stash` first."),
    ],
    exercise: l(
      "GitHub veb interfeysində README-ni redaktə edib commit edin, sonra lokal olaraq `git pull` icra edin və dəyişikliyin kompüterinizə gəldiyini yoxlayın.",
      "Edit the README in the GitHub web interface and commit, then run `git pull` locally and confirm the change arrived on your machine.",
    ),
    quiz: [
      q(
        l("`git pull` hansı iki əməliyyatın birləşməsidir?", "Which two operations does `git pull` combine?"),
        ["git fetch + git merge", "git add + git commit", "git clone + git push"],
        0,
        l("Pull əvvəlcə fetch edir, sonra merge (və ya rebase) edir.", "Pull fetches first, then merges (or rebases)."),
      ),
      q(
        l("`git pull --rebase` nə edir?", "What does `git pull --rebase` do?"),
        [
          l("Lokal commit-ləri uzaq commit-lərin üstünə köçürür", "Replays local commits on top of the remote commits"),
          l("Uzaq branch-ı silir", "Deletes the remote branch"),
          l("Yalnız endirir, birləşdirmir", "Only downloads, does not integrate"),
        ],
        0,
        l("Nəticədə xətti tarixçə alınır və merge commit yaranmır.", "The result is a linear history without a merge commit."),
      ),
    ],
    docs: [doc("git-pull", "https://git-scm.com/docs/git-pull")],
  },
  {
    id: "fetch",
    group: "git",
    viz: true,
    title: t4("Fetch (endirmə)", "Fetch", "Getirme (Fetch)", "Загрузка (fetch)"),
    summary: l("Fetch uzaq dəyişiklikləri endirir, amma sizin branch-a toxunmur.", "Fetch downloads remote changes without touching your branches."),
    what: l(
      "`git fetch` uzaq repozitoriyadakı yeni commit və branch-ları endirir, lakin işçi qovluğunuzu və lokal branch-larınızı dəyişmir. Bu, “əvvəlcə bax, sonra qərar ver” üsuludur: başqalarının nə etdiyini təhlükəsiz şəkildə görür, sonra merge və ya rebase edirsiniz.",
      "`git fetch` downloads new commits and branches from the remote but does not change your working tree or local branches. It is the “look before you leap” approach: you safely see what others did, then decide to merge or rebase.",
    ),
    how: l(
      "Fetch uzaq izləmə branch-larını (remote-tracking branches), məsələn `origin/main`-i yeniləyir. Sonra `git log main..origin/main` ilə sizdə olmayan commit-lərə, `git diff main origin/main` ilə fərqlərə baxa bilərsiniz. `--prune` serverdə silinmiş branch-ların lokal izlərini təmizləyir.",
      "Fetch updates remote-tracking branches such as `origin/main`. Then `git log main..origin/main` shows commits you do not have yet and `git diff main origin/main` shows the differences. `--prune` removes local references to branches deleted on the server.",
    ),
    examples: [
      ex(
        code("git fetch origin", "git log --oneline main..origin/main"),
        l("Yenilikləri endirir və `origin/main`-də olub lokal `main`-də olmayan commit-ləri göstərir.", "Downloads updates and lists commits that are on `origin/main` but not on local `main`."),
      ),
      ex(
        code("git fetch --prune", "git merge origin/main"),
        l("Silinmiş uzaq branch-ları təmizləyir, sonra endirilmiş dəyişiklikləri cari branch-a birləşdirir.", "Cleans up deleted remote branches, then merges the downloaded changes into the current branch."),
      ),
    ],
    mistakes: [
      l("Fetch-dən sonra faylların dəyişəcəyini gözləmək. Fetch yalnız endirir; birləşdirmək üçün merge/rebase lazımdır.", "Expecting files to change after fetch. Fetch only downloads; you still need merge or rebase."),
      l("`origin/main`-i adi branch kimi redaktə etməyə çalışmaq — o, yalnız uzaq vəziyyətin “şəklidir”.", "Trying to work on `origin/main` as a normal branch — it is only a snapshot of the remote state."),
    ],
    exercise: l(
      "GitHub-da yeni commit edin, lokal olaraq `git fetch` icra edin, `git status` çıxışında “behind” sözünü tapın, sonra `git merge origin/main` ilə yeniləyin.",
      "Make a commit on GitHub, run `git fetch` locally, find the word “behind” in `git status`, then update with `git merge origin/main`.",
    ),
    quiz: [
      q(
        l("`git fetch` ilə `git pull` arasında əsas fərq nədir?", "What is the main difference between `git fetch` and `git pull`?"),
        [
          l("Fetch yalnız endirir, pull həm də birləşdirir", "Fetch only downloads; pull also integrates"),
          l("Fetch göndərir, pull endirir", "Fetch uploads; pull downloads"),
          l("Heç bir fərq yoxdur", "There is no difference"),
        ],
        0,
        l("Pull = fetch + merge/rebase.", "Pull = fetch + merge/rebase."),
      ),
      q(
        l("Fetch hansı branch-ları yeniləyir?", "Which branches does fetch update?"),
        [l("`origin/main` kimi uzaq izləmə branch-larını", "Remote-tracking branches like `origin/main`"), l("Cari lokal branch-ı", "The current local branch"), l("Bütün lokal branch-ları", "All local branches")],
        0,
        l("Lokal branch-larınız dəyişməz qalır.", "Your local branches stay unchanged."),
      ),
    ],
    docs: [doc("git-fetch", "https://git-scm.com/docs/git-fetch")],
  },
  {
    id: "rebase",
    group: "git",
    viz: true,
    title: t4("Rebase", "Rebase", "Rebase", "Rebase (перебазирование)"),
    summary: l("Rebase commit-ləri başqa bazanın üstünə köçürüb xətti tarixçə yaradır.", "Rebase moves commits onto a new base to produce a linear history."),
    what: l(
      "Rebase branch-ınızın commit-lərini götürüb başqa commit-in (məsələn, ən son `main`-in) üstündə yenidən tətbiq edir. Nəticədə tarixçə sanki işə ən son koddan başlamısınız kimi düz xətt olur. İnteraktiv rebase (`-i`) isə commit-ləri birləşdirməyə, yenidən adlandırmağa və sıralamağa imkan verir — pull request-dən əvvəl tarixçəni səliqəyə salmaq üçün faydalıdır.",
      "Rebase takes your branch's commits and re-applies them on top of another commit (for example the latest `main`). The history becomes a straight line, as if you had started from the newest code. Interactive rebase (`-i`) lets you squash, reword and reorder commits — useful for tidying history before a pull request.",
    ),
    how: l(
      "Rebase yeni commit-lər yaradır (SHA-lar dəyişir), yəni tarixçəni yenidən yazır. Buna görə əsas qayda: başqalarının artıq istifadə etdiyi (paylaşılmış) branch-ları rebase etməyin. Konflikt olarsa, faylı düzəldib `git add` edirsiniz və `git rebase --continue` ilə davam edirsiniz; ləğv etmək üçün `git rebase --abort`. Rebase-dən sonra artıq push edilmiş branch üçün `git push --force-with-lease` lazımdır.",
      "Rebase creates new commits (the SHAs change), so it rewrites history. The golden rule: do not rebase branches others are already using. On a conflict, fix the file, `git add` it and run `git rebase --continue`; `git rebase --abort` cancels. After rebasing an already-pushed branch you need `git push --force-with-lease`.",
    ),
    examples: [
      ex(
        code("git switch feature/login", "git fetch origin", "git rebase origin/main"),
        l("Funksiya branch-ını ən son `origin/main`-in üstünə köçürür.", "Moves the feature branch on top of the latest `origin/main`."),
      ),
      ex(
        code("git rebase -i HEAD~3"),
        l(
          "Son üç commit üçün redaktor açır: `pick`-i `squash` (və ya `s`) ilə əvəz edib commit-ləri birləşdirə, `reword` ilə mesajı dəyişə bilərsiniz.",
          "Opens an editor for the last three commits: change `pick` to `squash` (or `s`) to combine commits, or `reword` to change a message.",
        ),
      ),
      ex(code("git add login.js", "git rebase --continue"), l("Konflikti həll etdikdən sonra rebase-i davam etdirir.", "Continues the rebase after resolving a conflict.")),
    ],
    mistakes: [
      l("Paylaşılmış `main` branch-ını rebase edib force push etmək — komandanın tarixçəsi pozulur.", "Rebasing the shared `main` and force-pushing it, breaking the team's history."),
      l("Rebase zamanı panikaya düşmək. `git rebase --abort` hər şeyi rebase-dən əvvəlki vəziyyətə qaytarır.", "Panicking in the middle of a rebase. `git rebase --abort` returns everything to the state before it."),
    ],
    exercise: l(
      "Funksiya branch-ında üç kiçik commit edin, `git rebase -i HEAD~3` ilə onları bir commit-ə birləşdirin və `git log --oneline` ilə nəticəni yoxlayın.",
      "Make three small commits on a feature branch, squash them into one with `git rebase -i HEAD~3` and check the result with `git log --oneline`.",
    ),
    quiz: [
      q(
        l("Rebase-in əsas qaydası nədir?", "What is the golden rule of rebasing?"),
        [
          l("Başqalarının istifadə etdiyi paylaşılmış branch-ları rebase etməyin", "Do not rebase shared branches others are using"),
          l("Həmişə `main`-i rebase edin", "Always rebase `main`"),
          l("Rebase-dən sonra repozitoriyanı yenidən klonlayın", "Re-clone the repository after rebasing"),
        ],
        0,
        l("Rebase commit SHA-larını dəyişir, paylaşılmış tarixçəni yenidən yazmaq başqalarına problem yaradır.", "Rebase changes commit SHAs; rewriting shared history causes problems for others."),
      ),
      q(
        l("Konflikti həll etdikdən sonra rebase necə davam etdirilir?", "How do you continue a rebase after resolving a conflict?"),
        ["git rebase --continue", "git commit --amend", "git merge --continue"],
        0,
        l("Faylı `git add` edin, sonra `git rebase --continue`.", "`git add` the file, then `git rebase --continue`."),
      ),
      q(
        l("Rebase edilmiş, artıq push olunmuş branch-ı göndərmək üçün ən təhlükəsiz yol hansıdır?", "What is the safest way to push a rebased branch that was already pushed?"),
        ["git push --force-with-lease", "git push --force", "git push -u"],
        0,
        l("`--force-with-lease` başqasının arada etdiyi push-u silməkdən qoruyur.", "`--force-with-lease` protects against overwriting someone else's push."),
      ),
    ],
    docs: [doc("git-rebase", "https://git-scm.com/docs/git-rebase"), doc("Pro Git: Rebasing", "https://git-scm.com/book/en/v2/Git-Branching-Rebasing")],
  },
  {
    id: "conflicts",
    group: "git",
    viz: true,
    title: t4("Merge konfliktləri", "Merge conflicts", "Birleştirme çakışmaları", "Конфликты слияния"),
    summary: l("Konflikt eyni sətirlər iki tərəfdə fərqli dəyişəndə yaranır və əl ilə həll olunur.", "A conflict happens when the same lines changed differently on both sides and must be resolved by hand."),
    what: l(
      "Merge konflikti (merge conflict) Git-in hansı versiyanı saxlamağı özü qərar verə bilmədiyi vəziyyətdir: məsələn, siz və komanda yoldaşınız eyni faylın eyni sətrini fərqli dəyişmisiniz. Konflikt səhv deyil — komanda işinin normal hissəsidir. Onu sakit və düzgün həll etmək hər developer üçün vacib bacarıqdır.",
      "A merge conflict is a situation where Git cannot decide on its own which version to keep — for example, you and a teammate changed the same line of the same file differently. A conflict is not an error; it is a normal part of team work, and resolving it calmly and correctly is an essential skill.",
    ),
    how: l(
      "Git konfliktli faylları `git status`-da “both modified” kimi göstərir və faylın içinə işarələr qoyur: `<<<<<<<` ilə `=======` arası sizin versiyanız, `=======` ilə `>>>>>>>` arası gələn versiyadır. Faylı redaktə edib düzgün nəticəni saxlayırsınız, bütün işarələri silirsiniz, sonra `git add` və `git commit` (və ya `git merge --continue`) edirsiniz. VS Code kimi redaktorlar bunun üçün düymələr təklif edir.",
      "Git lists conflicted files as “both modified” in `git status` and inserts markers into the file: between `<<<<<<<` and `=======` is your version, between `=======` and `>>>>>>>` is the incoming one. You edit the file to the correct result, remove all markers, then `git add` and `git commit` (or `git merge --continue`). Editors such as VS Code offer buttons for this.",
    ),
    examples: [
      ex(
        code("<<<<<<< HEAD", "<h1>Welcome to CODEVERSE</h1>", "=======", "<h1>Welcome, developer!</h1>", ">>>>>>> feature/greeting"),
        l("Konfliktli faylın görünüşü: yuxarıda cari branch-ın (HEAD), aşağıda birləşdirilən branch-ın versiyası.", "What a conflicted file looks like: the current branch (HEAD) version on top, the merged branch's version below."),
      ),
      ex(
        code("git status", "# edit index.html, keep the right lines, delete the markers", "git add index.html", "git commit"),
        l("Konfliktli faylları tapır, həll edilmiş faylı hazırlayır və merge commit-i tamamlayır.", "Finds the conflicted files, stages the resolved file and completes the merge commit."),
      ),
    ],
    mistakes: [
      l("`<<<<<<<`, `=======`, `>>>>>>>` işarələrini faylda unudub commit etmək — kod sınır.", "Committing with `<<<<<<<`, `=======` or `>>>>>>>` markers still in the file, which breaks the code."),
      l("Düşünmədən həmişə “öz versiyamı saxla” seçmək və komanda yoldaşının işini silmək.", "Always choosing “keep mine” without thinking and deleting a teammate's work."),
      l("Həll etdikdən sonra layihəni işə salıb test etməmək.", "Not running and testing the project after resolving."),
    ],
    exercise: l(
      "Bilərəkdən konflikt yaradın: iki branch-da eyni sətri fərqli dəyişib commit edin, sonra birini digərinə merge edin, konflikti həll edin və merge-i tamamlayın.",
      "Create a conflict on purpose: change the same line differently on two branches and commit, merge one into the other, resolve the conflict and finish the merge.",
    ),
    quiz: [
      q(
        l("Konfliktli faylda `=======` nəyi bildirir?", "What does `=======` mean in a conflicted file?"),
        [l("İki versiyanın sərhədini", "The boundary between the two versions"), l("Faylın sonunu", "The end of the file"), l("Silinmiş sətri", "A deleted line")],
        0,
        l("Yuxarıda cari versiya, aşağıda gələn versiya yerləşir.", "The current version is above it, the incoming one below."),
      ),
      q(
        l("Konflikti həll etdikdən sonra Git-ə bunu necə bildirirsiniz?", "How do you tell Git a conflict is resolved?"),
        [l("Faylı `git add` ilə hazırlamaqla", "By staging the file with `git add`"), l("Faylı silməklə", "By deleting the file"), l("`git fetch` ilə", "With `git fetch`")],
        0,
        l("Hazırlanmış fayl həll olunmuş hesab edilir; sonra commit və ya `--continue` edirsiniz.", "A staged file counts as resolved; then you commit or `--continue`."),
      ),
    ],
    docs: [
      doc("git-merge: How conflicts are presented", "https://git-scm.com/docs/git-merge#_how_conflicts_are_presented"),
      doc("GitHub Docs: Resolving a merge conflict using the command line", "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/resolving-a-merge-conflict-using-the-command-line"),
    ],
  },
  {
    id: "workflows",
    group: "git",
    viz: true,
    title: t4("Git iş axınları", "Git workflows", "Git iş akışları", "Рабочие процессы Git"),
    summary: l("İş axını komandanın branch, review və release üçün razılaşdığı qaydalardır.", "A workflow is the set of rules a team agrees on for branches, reviews and releases."),
    what: l(
      "Git çox çevikdir, ona görə komandalar branch-lardan necə istifadə edəcəkləri barədə razılaşırlar. Ən populyar modellər: GitHub Flow — `main` həmişə işlək vəziyyətdədir, hər dəyişiklik qısa ömürlü branch və pull request ilə gəlir; trunk-based development — çox kiçik dəyişikliklər tez-tez əsas xəttə birləşdirilir; Git Flow — `develop`, `release`, `hotfix` kimi uzunömürlü branch-ları olan daha ağır model, planlı buraxılışlar üçün.",
      "Git is very flexible, so teams agree on how to use branches. The most popular models are: GitHub Flow — `main` is always deployable and every change arrives through a short-lived branch and a pull request; trunk-based development — very small changes are merged into the main line frequently; Git Flow — a heavier model with long-lived branches such as `develop`, `release` and `hotfix`, suited to scheduled releases.",
    ),
    how: l(
      "GitHub Flow addımları: `main`-dən branch açın, kiçik commit-lər edin, branch-ı push edin, pull request açın, review və avtomatik testlərdən keçin, merge edin, branch-ı silin. Branch adlarında razılaşma (`feature/...`, `fix/...`) və qorunan branch (branch protection) qaydaları prosesi möhkəmləndirir.",
      "GitHub Flow steps: branch off `main`, make small commits, push the branch, open a pull request, pass review and automated tests, merge, delete the branch. Branch naming conventions (`feature/...`, `fix/...`) and branch protection rules make the process robust.",
    ),
    examples: [
      ex(
        code(
          "git switch main",
          "git pull",
          "git switch -c feature/search",
          "git commit -am \"Add search box\"",
          "git push -u origin feature/search",
          "# open a pull request, get a review, merge on GitHub",
          "git switch main",
          "git pull",
          "git branch -d feature/search",
        ),
        l("GitHub Flow-un tam dövrü: yenilə, branch aç, commit et, push et, PR ilə merge et, təmizlə.", "A full GitHub Flow cycle: update, branch, commit, push, merge via PR, clean up."),
      ),
    ],
    mistakes: [
      l("Kiçik komanda üçün çox mürəkkəb model (Git Flow) seçmək — proses işdən ağır olur.", "Choosing a heavy model such as Git Flow for a small team, making the process heavier than the work."),
      l("Həftələrlə yaşayan böyük branch-lar — merge zamanı nəhəng konfliktlər yaranır.", "Huge branches that live for weeks, leading to enormous conflicts at merge time."),
    ],
    exercise: l(
      "Öz repozitoriyanızda GitHub Flow ilə bir dəyişiklik edin: branch açın, push edin, GitHub-da pull request yaradıb özünüz merge edin və lokal branch-ı silin.",
      "Make one change in your repository with GitHub Flow: create a branch, push it, open a pull request on GitHub, merge it yourself and delete the local branch.",
    ),
    quiz: [
      q(
        l("GitHub Flow-da `main` branch haqqında hansı qayda var?", "Which rule applies to `main` in GitHub Flow?"),
        [l("O həmişə işlək (deploy edilə bilən) vəziyyətdə olmalıdır", "It must always be deployable"), l("Ona birbaşa push edilir", "Everyone pushes to it directly"), l("O yalnız ildə bir dəfə yenilənir", "It is updated once a year")],
        0,
        l("Dəyişikliklər branch və pull request ilə gəlir, ona görə `main` stabil qalır.", "Changes arrive via branches and pull requests, so `main` stays stable."),
      ),
      q(
        l("Hansı model `develop` və `release` kimi uzunömürlü branch-lardan istifadə edir?", "Which model uses long-lived branches like `develop` and `release`?"),
        ["Git Flow", "GitHub Flow", "Trunk-based development"],
        0,
        l("Git Flow planlı buraxılışlar üçün nəzərdə tutulmuş daha ağır modeldir.", "Git Flow is a heavier model designed for scheduled releases."),
      ),
    ],
    docs: [doc("GitHub Docs: GitHub flow", "https://docs.github.com/en/get-started/using-github/github-flow"), doc("Pro Git: Branching Workflows", "https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows")],
  },
];

// ---------------------------------------------------------------------------
// 2. GitHub
// ---------------------------------------------------------------------------

const GITHUB: GitTopic[] = [
  {
    id: "github-account",
    group: "github",
    title: t4("Hesab və profil", "Accounts and profiles", "Hesap ve profil", "Аккаунт и профиль"),
    summary: l("GitHub hesabı sizin developer kimliyiniz və portfoliyonuzdur.", "A GitHub account is your developer identity and portfolio."),
    what: l(
      "GitHub Git repozitoriyalarını saxlamaq və birgə işləmək üçün ən böyük platformadır. Hesab sizə repozitoriya yaratmağa, başqa layihələrə töhfə verməyə və profil vasitəsilə işinizi göstərməyə imkan verir. İşəgötürənlər tez-tez namizədin GitHub profilinə baxırlar, ona görə səliqəli profil real karyera üstünlüyüdür.",
      "GitHub is the largest platform for hosting Git repositories and collaborating. An account lets you create repositories, contribute to other projects and show your work through your profile. Employers often look at a candidate's GitHub profile, so a tidy profile is a real career advantage.",
    ),
    how: l(
      "Qeydiyyatdan sonra iki addımlı doğrulamanı (2FA) aktivləşdirin — GitHub bunu tələb edir. Profil şəkli, qısa bio və ən yaxşı işlərinizi “pinned” repozitoriyalar kimi əlavə edin. İstifadəçi adınızla eyni adlı xüsusi repozitoriya (`USERNAME/USERNAME`) yaradıb README əlavə etsəniz, o, profil səhifənizdə göstərilir. Kompüterdən push üçün HTTPS ilə şəxsi giriş tokeni (personal access token) və ya SSH açarı istifadə olunur; adi parol işləmir.",
      "After signing up, enable two-factor authentication (2FA), which GitHub requires. Add a profile picture, a short bio and pin your best repositories. If you create a special repository named after your username (`USERNAME/USERNAME`) with a README, it appears on your profile page. Pushing from your computer uses a personal access token over HTTPS or an SSH key; your account password does not work.",
    ),
    examples: [
      ex(
        code("ssh-keygen -t ed25519 -C \"you@example.com\"", "ssh -T git@github.com"),
        l(
          "SSH açar cütü yaradır (açıq açarı GitHub → Settings → SSH and GPG keys bölməsinə əlavə edirsiniz) və bağlantını yoxlayır.",
          "Generates an SSH key pair (you add the public key under GitHub → Settings → SSH and GPG keys) and tests the connection.",
        ),
      ),
      ex(
        code("# Hi, I'm Aysel 👋", "", "- Learning TypeScript and React", "- Currently building: a recipe app", "- Contact: aysel@example.com"),
        l("Profil README-si (`USERNAME/USERNAME` repozitoriyasında `README.md`) üçün sadə nümunə.", "A simple profile README (`README.md` in the `USERNAME/USERNAME` repository)."),
      ),
    ],
    mistakes: [
      l("Özəl SSH açarını (`id_ed25519`, `.pub` olmayan) kimsə ilə paylaşmaq və ya repozitoriyaya yükləmək.", "Sharing or uploading the private SSH key (`id_ed25519`, the file without `.pub`)."),
      l("Ciddi olmayan istifadəçi adı seçmək — profil işəgötürənlərə göstəriləcək.", "Choosing an unprofessional username, even though the profile will be shown to employers."),
    ],
    exercise: l(
      "GitHub hesabı yaradın, 2FA-nı aktivləşdirin, SSH açarı əlavə edib `ssh -T git@github.com` ilə yoxlayın və profil README-si yaradın.",
      "Create a GitHub account, enable 2FA, add an SSH key and test it with `ssh -T git@github.com`, then create a profile README.",
    ),
    quiz: [
      q(
        l("Profil səhifəsində README göstərmək üçün repozitoriya necə adlanmalıdır?", "What must the repository be called to show a README on your profile?"),
        [l("İstifadəçi adınızla eyni", "The same as your username"), "profile", "README"],
        0,
        l("`USERNAME/USERNAME` repozitoriyasındakı README profil səhifəsində göstərilir.", "The README in `USERNAME/USERNAME` is shown on the profile page."),
      ),
      q(
        l("HTTPS ilə push edərkən parol əvəzinə nə istifadə olunur?", "What do you use instead of a password when pushing over HTTPS?"),
        [l("Şəxsi giriş tokeni (personal access token)", "A personal access token"), l("E-poçt ünvanı", "Your email address"), l("Heç nə", "Nothing")],
        0,
        l("GitHub Git əməliyyatları üçün hesab parolunu qəbul etmir.", "GitHub does not accept the account password for Git operations."),
      ),
    ],
    docs: [
      doc("GitHub Docs: Creating an account on GitHub", "https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github"),
      doc("GitHub Docs: Managing your profile README", "https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme"),
      doc("GitHub Docs: Connecting to GitHub with SSH", "https://docs.github.com/en/authentication/connecting-to-github-with-ssh"),
    ],
  },
  {
    id: "github-create-repo",
    group: "github",
    title: t4("Repozitoriya yaratmaq", "Creating repositories", "Depo oluşturma", "Создание репозитория"),
    summary: l("GitHub-da yeni repozitoriya bir neçə kliklə və ya `gh` CLI ilə yaradılır.", "A new GitHub repository takes a few clicks or one `gh` CLI command."),
    what: l(
      "GitHub repozitoriyası layihənizin onlayn evidir: kod, tarixçə, issue-lar, pull request-lər və ayarlar orada olur. Repozitoriya açıq (public — hamı görür) və ya özəl (private — yalnız icazə verdiyiniz şəxslər) ola bilər.",
      "A GitHub repository is your project's online home: code, history, issues, pull requests and settings live there. A repository can be public (visible to everyone) or private (only people you allow).",
    ),
    how: l(
      "Veb interfeysdə sağ yuxarıdakı “+” → “New repository” seçin, ad, təsvir və görünürlük seçin. Repozitoriyanı README, `.gitignore` şablonu və lisenziya ilə yarada bilərsiniz. Lokal layihəni yükləyəcəksinizsə, konfliktlərin qarşısını almaq üçün repozitoriyanı boş yaradın. Alternativ: rəsmi `gh` CLI ilə terminaldan yaratmaq.",
      "In the web interface choose “+” → “New repository” at the top right, then a name, description and visibility. You can initialise it with a README, a `.gitignore` template and a license. If you are going to upload an existing local project, create the repository empty to avoid conflicts. Alternatively, create it from the terminal with the official `gh` CLI.",
    ),
    examples: [
      ex(
        code("gh auth login", "gh repo create my-app --public --clone"),
        l("`gh` ilə giriş edir, yeni açıq repozitoriya yaradır və onu dərhal klonlayır.", "Logs in with `gh`, creates a new public repository and clones it immediately."),
      ),
    ],
    mistakes: [
      l("Lokal layihəni yükləməzdən əvvəl GitHub-da README ilə repozitoriya yaratmaq — ilk push “rejected” olur, çünki tarixçələr fərqlidir.", "Creating the repository with a README before uploading a local project — the first push is rejected because the histories differ."),
      l("Şirkət və ya şəxsi məlumat olan kodu səhvən açıq repozitoriyada yaratmaq.", "Accidentally creating a public repository for code that contains company or personal data."),
    ],
    exercise: l(
      "GitHub-da `hello-codeverse` adlı açıq repozitoriya yaradın (README, Node `.gitignore` və MIT lisenziyası ilə), sonra onu klonlayın.",
      "Create a public repository `hello-codeverse` on GitHub with a README, the Node `.gitignore` and the MIT license, then clone it.",
    ),
    quiz: [
      q(
        l("Özəl (private) repozitoriyanı kim görə bilər?", "Who can see a private repository?"),
        [l("Yalnız siz və icazə verdiyiniz şəxslər", "Only you and the people you grant access"), l("Hamı", "Everyone"), l("Yalnız GitHub işçiləri", "Only GitHub staff")],
        0,
        l("Özəl repozitoriyaya giriş collaborator və ya təşkilat icazələri ilə verilir.", "Access to a private repository is granted through collaborator or organisation permissions."),
      ),
      q(
        l("Lokal layihəni yükləyəcəksinizsə, GitHub repozitoriyasını necə yaratmaq daha yaxşıdır?", "How should you create the GitHub repository if you will upload an existing local project?"),
        [l("Boş (README olmadan)", "Empty (without a README)"), l("README və lisenziya ilə", "With a README and license"), l("Fork edərək", "By forking")],
        0,
        l("Boş repozitoriyaya ilk push problemsiz keçir.", "The first push into an empty repository goes through without problems."),
      ),
    ],
    docs: [
      doc("GitHub Docs: Creating a new repository", "https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository"),
      doc("GitHub CLI: gh repo create", "https://cli.github.com/manual/gh_repo_create"),
    ],
  },
  {
    id: "github-upload",
    group: "github",
    viz: true,
    title: t4("Layihəni yükləmək", "Uploading a project", "Projeyi yükleme", "Загрузка проекта"),
    summary: l("Kompüterdəki layihə bir neçə Git əmri ilə GitHub-a yüklənir.", "A project on your computer reaches GitHub with a handful of Git commands."),
    what: l(
      "Çox vaxt layihəni əvvəlcə kompüterdə yazırsınız, sonra GitHub-a yükləmək istəyirsiniz — portfoliyo, ehtiyat nüsxə və ya komanda ilə paylaşmaq üçün. Bunun ən doğru yolu fayl yükləmə düyməsi deyil, Git-dir: tarixçə saxlanılır və sonrakı dəyişiklikləri asanlıqla göndərirsiniz.",
      "Often you write a project locally first and later want it on GitHub — for a portfolio, a backup or to share with a team. The right way is Git, not the file-upload button: history is preserved and later changes are easy to push.",
    ),
    how: l(
      "1) Lazımsız faylları istisna etmək üçün `.gitignore` yaradın. 2) `git init -b main`, `git add .`, `git commit`. 3) GitHub-da boş repozitoriya yaradın. 4) `git remote add origin URL` ilə bağlayın. 5) `git push -u origin main`. `gh repo create` bu addımların bir hissəsini bir əmrlə edir.",
      "1) Create a `.gitignore` to exclude unwanted files. 2) `git init -b main`, `git add .`, `git commit`. 3) Create an empty repository on GitHub. 4) Connect it with `git remote add origin URL`. 5) `git push -u origin main`. `gh repo create` can do several of these steps in one command.",
    ),
    examples: [
      ex(
        code(
          "cd my-project",
          "git init -b main",
          "git add .",
          "git commit -m \"Initial commit\"",
          "git remote add origin https://github.com/USER/my-project.git",
          "git push -u origin main",
        ),
        l("Mövcud qovluğu repozitoriyaya çevirir, ilk commit-i edir və boş GitHub repozitoriyasına göndərir.", "Turns an existing folder into a repository, makes the first commit and pushes it to an empty GitHub repository."),
      ),
      ex(
        code("gh repo create my-project --public --source=. --remote=origin --push"),
        l("Cari qovluqdakı (artıq commit-i olan) repozitoriya üçün GitHub-da repo yaradır, `origin`-i əlavə edir və push edir.", "Creates a GitHub repository for the current folder (which already has commits), adds `origin` and pushes."),
      ),
    ],
    mistakes: [
      l("`.gitignore` olmadan `git add .` etmək və `node_modules`, `.env` kimi faylları yükləmək.", "Running `git add .` without a `.gitignore` and uploading `node_modules` or `.env` files."),
      l("Yanlış URL ilə remote əlavə etmək; `git remote set-url origin YENİ_URL` ilə düzəldilir.", "Adding a remote with the wrong URL; fix it with `git remote set-url origin NEW_URL`."),
    ],
    exercise: l(
      "Kompüterinizdəki kiçik bir layihəni (və ya yeni yaratdığınız qovluğu) `.gitignore` ilə birlikdə GitHub-a yükləyin və brauzerdə `node_modules` kimi lazımsız qovluqların olmadığını yoxlayın.",
      "Upload a small project from your computer (or a new folder) to GitHub together with a `.gitignore`, and check in the browser that folders like `node_modules` are absent.",
    ),
    quiz: [
      q(
        l("Lokal repozitoriyanı GitHub-dakı repozitoriyaya hansı əmr bağlayır?", "Which command connects a local repository to the GitHub repository?"),
        ["git remote add origin URL", "git clone URL", "git init URL"],
        0,
        l("`git remote add` uzaq repozitoriyanı ad (`origin`) altında qeyd edir.", "`git remote add` registers the remote under a name (`origin`)."),
      ),
      q(
        l("`node_modules` qovluğunun yüklənməsinin qarşısını nə alır?", "What prevents `node_modules` from being uploaded?"),
        [l("`.gitignore` faylındakı qayda", "A rule in `.gitignore`"), "README.md", "git push -u"],
        0,
        l("`.gitignore`-a `node_modules/` yazmaq kifayətdir.", "Writing `node_modules/` in `.gitignore` is enough."),
      ),
    ],
    docs: [
      doc("GitHub Docs: Adding locally hosted code to GitHub", "https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github"),
    ],
  },
  {
    id: "readme",
    group: "github",
    title: t4("README", "README", "README", "README"),
    summary: l("README layihənin “vitrini”dir: nə olduğunu və necə istifadə edildiyini izah edir.", "The README is a project's shop window: it explains what the project is and how to use it."),
    what: l(
      "README (adətən `README.md`) repozitoriyaya girən hər kəsin ilk gördüyü sənəddir. O, layihənin nə etdiyini, necə quraşdırılıb işə salındığını, necə töhfə verildiyini və hansı lisenziya ilə paylaşıldığını izah edir. Yaxşı README olmayan layihədən insanlar adətən istifadə etmir.",
      "The README (usually `README.md`) is the first thing anyone visiting the repository sees. It explains what the project does, how to install and run it, how to contribute and under which license it is shared. People rarely use a project without a good README.",
    ),
    how: l(
      "README Markdown dilində yazılır: `#` başlıq, `-` siyahı, üç backtick kod bloku, `[mətn](link)` keçid, `![alt](şəkil.png)` şəkil. GitHub README-ni kök qovluqda, `.github/` və ya `docs/` qovluğunda tapıb repozitoriyanın ana səhifəsində göstərir. Tipik bölmələr: təsvir, ekran görüntüsü, quraşdırma, istifadə, töhfə, lisenziya.",
      "A README is written in Markdown: `#` for headings, `-` for lists, triple backticks for code blocks, `[text](link)` for links, `![alt](image.png)` for images. GitHub finds a README in the root, `.github/` or `docs/` folder and shows it on the repository home page. Typical sections: description, screenshot, installation, usage, contributing, license.",
    ),
    examples: [
      ex(
        code(
          "# Recipe Finder",
          "",
          "Search recipes by the ingredients you already have.",
          "",
          "## Installation",
          "",
          "```bash",
          "npm install",
          "npm run dev",
          "```",
          "",
          "## License",
          "",
          "MIT",
        ),
        l("Minimal, amma faydalı README: bir cümləlik təsvir, quraşdırma əmrləri və lisenziya.", "A minimal but useful README: a one-sentence description, installation commands and the license."),
      ),
    ],
    mistakes: [
      l("README-ni GitHub-un yaratdığı tək başlıq kimi saxlamaq.", "Leaving the README as the single heading GitHub generated."),
      l("Quraşdırma addımlarını yazmamaq və ya köhnəlmiş əmrlər saxlamaq.", "Omitting installation steps or keeping outdated commands."),
    ],
    exercise: l(
      "Öz layihənizə təsvir, quraşdırma, istifadə və lisenziya bölmələri olan README yazın və GitHub-da necə göründüyünü yoxlayın.",
      "Write a README for your project with description, installation, usage and license sections, and check how it renders on GitHub.",
    ),
    quiz: [
      q(
        l("README adətən hansı formatda yazılır?", "In which format is a README usually written?"),
        ["Markdown", "HTML", "JSON"],
        0,
        l("`README.md` faylını GitHub Markdown kimi formatlayıb göstərir.", "GitHub renders `README.md` as formatted Markdown."),
      ),
      q(
        l("Markdown-da ikinci səviyyəli başlıq necə yazılır?", "How do you write a second-level heading in Markdown?"),
        ["## Title", "<<Title>>", "**Title**"],
        0,
        l("`#` sayı başlığın səviyyəsini göstərir; `**...**` qalın mətndir.", "The number of `#` sets the level; `**...**` is bold text."),
      ),
    ],
    docs: [
      doc("GitHub Docs: About READMEs", "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes"),
      doc("GitHub Docs: Basic writing and formatting syntax", "https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"),
    ],
  },
  {
    id: "gitignore",
    group: "github",
    title: t4(".gitignore", ".gitignore", ".gitignore", ".gitignore"),
    summary: l("`.gitignore` Git-ə hansı faylları izləməməli olduğunu deyir.", "`.gitignore` tells Git which files it should not track."),
    what: l(
      "Hər layihədə repozitoriyaya düşməməli fayllar olur: asılılıqlar (`node_modules/`), build nəticələri (`dist/`), məxfi açarlar (`.env`), redaktor və əməliyyat sistemi faylları (`.DS_Store`, `Thumbs.db`). `.gitignore` bu faylları qaydalarla istisna edir, beləcə repozitoriya kiçik, təmiz və təhlükəsiz qalır.",
      "Every project has files that should not go into the repository: dependencies (`node_modules/`), build output (`dist/`), secrets (`.env`), editor and OS files (`.DS_Store`, `Thumbs.db`). `.gitignore` excludes them by pattern, keeping the repository small, clean and safe.",
    ),
    how: l(
      "`.gitignore` hər sətirdə bir nümunə (pattern) olan mətn faylıdır: `*.log` bütün log fayllarını, `dist/` qovluğu, `!keep.log` isə istisnadan istisnanı bildirir; `#` şərhdir. Vacib məqam: `.gitignore` yalnız hələ izlənməyən fayllara təsir edir. Artıq commit edilmiş faylı istisna etmək üçün onu `git rm --cached` ilə izləmədən çıxarmalısınız. GitHub-un `github/gitignore` repozitoriyasında hazır şablonlar var.",
      "`.gitignore` is a text file with one pattern per line: `*.log` matches all log files, `dist/` a folder, `!keep.log` re-includes a file; `#` starts a comment. Important: `.gitignore` only affects files that are not tracked yet. To ignore an already committed file you must untrack it with `git rm --cached`. GitHub's `github/gitignore` repository has ready-made templates.",
    ),
    examples: [
      ex(
        code("# dependencies", "node_modules/", "", "# build output", "dist/", "", "# secrets", ".env", ".env.*", "!.env.example", "", "# logs and OS files", "*.log", ".DS_Store"),
        l("JavaScript layihəsi üçün tipik `.gitignore`: `.env.example` nümunə fayl kimi saxlanılır, real `.env` isə yox.", "A typical `.gitignore` for a JavaScript project: `.env.example` is kept as a template while real `.env` files are ignored."),
      ),
      ex(
        code("git rm --cached .env", "git commit -m \"Stop tracking .env\"", "git check-ignore -v .env"),
        l(
          "Artıq commit olunmuş `.env`-i izləmədən çıxarır (fayl diskdə qalır) və hansı qaydanın onu istisna etdiyini göstərir.",
          "Untracks an already committed `.env` (the file stays on disk) and shows which rule ignores it.",
        ),
      ),
    ],
    mistakes: [
      l(
        "Məxfi açar artıq push edildikdən sonra onu sadəcə `.gitignore`-a əlavə etmək. Açar tarixçədə qalır — onu dərhal ləğv edib (revoke) yenisini yaradın.",
        "Just adding a secret to `.gitignore` after it was pushed. It stays in history — revoke the key immediately and create a new one.",
      ),
      l("`.gitignore` faylının özünü commit etməyi unutmaq.", "Forgetting to commit the `.gitignore` file itself."),
    ],
    exercise: l(
      "Layihənizdə `.gitignore` yaradın, `secret.txt` və `build/` qovluğunu istisna edin, sonra `git status` ilə onların görünmədiyini və `git check-ignore -v secret.txt` ilə qaydanı yoxlayın.",
      "Create a `.gitignore` that excludes `secret.txt` and the `build/` folder, then confirm with `git status` that they are hidden and check the rule with `git check-ignore -v secret.txt`.",
    ),
    quiz: [
      q(
        l("Artıq commit edilmiş faylı `.gitignore`-a əlavə etdikdə nə baş verir?", "What happens when you add an already committed file to `.gitignore`?"),
        [
          l("Git onu izləməyə davam edir; `git rm --cached` lazımdır", "Git keeps tracking it; you need `git rm --cached`"),
          l("Fayl avtomatik silinir", "The file is deleted automatically"),
          l("Fayl tarixçədən silinir", "The file is removed from history"),
        ],
        0,
        l("`.gitignore` yalnız izlənməyən fayllara təsir edir.", "`.gitignore` only affects untracked files."),
      ),
      q(
        l("`!.env.example` sətri nə edir?", "What does the line `!.env.example` do?"),
        [l("Əvvəlki qaydanın istisna etdiyi faylı yenidən daxil edir", "Re-includes a file excluded by an earlier rule"), l("Faylı silir", "Deletes the file"), l("Şərhdir", "It is a comment")],
        0,
        l("`!` inkar nümunəsidir (negation pattern).", "`!` is a negation pattern."),
      ),
    ],
    docs: [doc("gitignore", "https://git-scm.com/docs/gitignore"), doc("GitHub Docs: Ignoring files", "https://docs.github.com/en/get-started/git-basics/ignoring-files"), doc("github/gitignore templates", "https://github.com/github/gitignore")],
  },
  {
    id: "issues",
    group: "github",
    title: t4("Issues", "Issues", "Issues (sorunlar)", "Issues (задачи)"),
    summary: l("Issue-lar səhvləri, ideyaları və tapşırıqları izləmək üçündür.", "Issues track bugs, ideas and tasks."),
    what: l(
      "Issue repozitoriyaya bağlı tapşırıq kartıdır: səhv hesabatı (bug report), yeni funksiya təklifi, sual və ya iş planı. Hər issue-nun nömrəsi, müzakirəsi, etiketləri (labels), məsul şəxsi (assignee) və hədəf tarixi olan qrupu (milestone) ola bilər. Issue-lar layihədə nə edildiyini və nə gözlədiyini şəffaf göstərir.",
      "An issue is a task card attached to a repository: a bug report, a feature request, a question or a work item. Each issue has a number, a discussion and can have labels, assignees and a milestone. Issues make it transparent what is being done and what is pending.",
    ),
    how: l(
      "“Issues” tabında “New issue” ilə yaradılır. Yaxşı səhv hesabatı: qısa başlıq, təkrarlama addımları, gözlənilən və faktiki nəticə, versiya və mühit. Commit və ya pull request mətnində `Fixes #12` yazsanız, PR əsas branch-a merge olunanda issue avtomatik bağlanır. Issue şablonları `.github/ISSUE_TEMPLATE/` qovluğunda saxlanılır.",
      "Create one with “New issue” in the “Issues” tab. A good bug report has a short title, steps to reproduce, expected and actual results, and version/environment. Writing `Fixes #12` in a pull request description closes the issue automatically when the PR is merged into the default branch. Issue templates live in `.github/ISSUE_TEMPLATE/`.",
    ),
    examples: [
      ex(
        code("gh issue create --title \"Login button does nothing on Safari\" --body \"Steps: open /login, click Login. Expected: form submits.\"", "gh issue list --label bug"),
        l("Terminaldan issue yaradır və `bug` etiketli issue-ları sadalayır.", "Creates an issue from the terminal and lists issues labelled `bug`."),
      ),
      ex(
        code("git commit -m \"Fix Safari login submit (fixes #12)\""),
        l("Bu commit standart branch-a düşəndə 12 nömrəli issue avtomatik bağlanır.", "When this commit reaches the default branch, issue #12 is closed automatically."),
      ),
    ],
    mistakes: [
      l("“İşləmir” kimi heç bir detal olmayan issue yazmaq.", "Writing an issue that only says “it doesn't work” with no details."),
      l("Yeni issue açmazdan əvvəl oxşar issue-nun olub-olmadığını axtarmamaq (dublikatlar).", "Not searching for an existing issue before opening a new one, creating duplicates."),
    ],
    exercise: l(
      "Öz repozitoriyanızda `bug` etiketli bir issue açın, sonra onu düzəldən commit-də `fixes #N` yazıb push edin və issue-nun bağlandığını yoxlayın.",
      "Open an issue labelled `bug` in your repository, then push a commit to the default branch with `fixes #N` in its message and confirm the issue closes.",
    ),
    quiz: [
      q(
        l("Pull request-də `Fixes #12` yazmaq nə edir?", "What does writing `Fixes #12` in a pull request do?"),
        [l("PR merge olunanda 12 nömrəli issue-nu bağlayır", "Closes issue #12 when the PR is merged"), l("12 nömrəli issue-nu silir", "Deletes issue #12"), l("Heç nə", "Nothing")],
        0,
        l("`fixes`, `closes`, `resolves` kimi açar sözlər issue-nu avtomatik bağlayır.", "Keywords like `fixes`, `closes` and `resolves` close the issue automatically."),
      ),
      q(
        l("Yaxşı səhv hesabatında nə mütləq olmalıdır?", "What must a good bug report include?"),
        [l("Təkrarlama addımları və gözlənilən/faktiki nəticə", "Steps to reproduce and expected vs actual result"), l("Yalnız ekran görüntüsü", "Only a screenshot"), l("Developerin adı", "The developer's name")],
        0,
        l("Səhvi təkrarlaya bilməyən şəxs onu düzəldə bilməz.", "Nobody can fix a bug they cannot reproduce."),
      ),
    ],
    docs: [doc("GitHub Docs: About issues", "https://docs.github.com/en/issues/tracking-your-work-with-issues/about-issues"), doc("GitHub Docs: Linking a pull request to an issue", "https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue")],
  },
  {
    id: "pull-requests",
    group: "github",
    viz: true,
    title: t4("Pull request", "Pull requests", "Pull request (çekme isteği)", "Pull request (запрос на слияние)"),
    summary: l("Pull request branch-dakı dəyişiklikləri review və merge üçün təklif edir.", "A pull request proposes a branch's changes for review and merging."),
    what: l(
      "Pull request (PR) “mənim branch-ımdakı dəyişiklikləri `main`-ə birləşdirin” təklifidir. PR-da fərqlər (diff) göstərilir, komanda yoldaşları sətir-sətir şərh yazır, avtomatik testlər (CI) işləyir və yalnız bundan sonra merge edilir. PR-lar kod keyfiyyətinin və bilik paylaşımının əsas alətidir.",
      "A pull request (PR) is a proposal: “please merge the changes from my branch into `main`”. The PR shows the diff, teammates comment line by line, automated tests (CI) run, and only then is it merged. PRs are the main tool for code quality and knowledge sharing.",
    ),
    how: l(
      "Branch-ı push edin, GitHub-da “Compare & pull request” düyməsini basın, başlıq və təsvir yazın (nə və niyə dəyişdi, necə test etmək olar). Reviewer-lər “Approve” və ya “Request changes” edir. Əlavə commit-ləri eyni branch-a push etdikdə PR avtomatik yenilənir. Merge üsulları: merge commit, squash and merge (hamısı bir commit), rebase and merge. Hələ hazır olmayan iş üçün “Draft” PR açmaq olar.",
      "Push the branch, click “Compare & pull request” on GitHub and write a title and description (what changed and why, how to test). Reviewers choose “Approve” or “Request changes”. Pushing more commits to the same branch updates the PR automatically. Merge options: merge commit, squash and merge (everything into one commit), rebase and merge. Work in progress can be opened as a “Draft” PR.",
    ),
    examples: [
      ex(
        code("git push -u origin feature/dark-mode", "gh pr create --title \"Add dark mode\" --body \"Adds a theme toggle. Fixes #31\"", "gh pr checkout 42"),
        l(
          "Branch-ı göndərir, PR yaradır; son əmr isə başqasının 42 nömrəli PR-ını lokal olaraq yoxlamaq üçün endirir.",
          "Pushes the branch and creates a PR; the last command checks out someone else's PR #42 locally for testing.",
        ),
      ),
    ],
    mistakes: [
      l("Yüzlərlə faylı dəyişən nəhəng PR açmaq — onu düzgün review etmək mümkün olmur.", "Opening a huge PR touching hundreds of files that nobody can review properly."),
      l("Təsviri boş buraxmaq; reviewer nəyi niyə yoxladığını bilmir.", "Leaving the description empty, so reviewers don't know what to check or why."),
    ],
    exercise: l(
      "Kiçik dəyişiklik üçün branch açın, push edin, təsvirində “nə, niyə, necə test etmək” olan PR yaradın və “Squash and merge” ilə birləşdirin.",
      "Make a small change on a branch, push it, open a PR whose description covers what, why and how to test, and merge it with “Squash and merge”.",
    ),
    quiz: [
      q(
        l("PR açıq ikən eyni branch-a yeni commit push etsəniz nə olur?", "What happens if you push new commits to the branch while its PR is open?"),
        [l("PR avtomatik yenilənir", "The PR updates automatically"), l("Yeni PR açmaq lazımdır", "You must open a new PR"), l("PR bağlanır", "The PR closes")],
        0,
        l("PR branch-a bağlıdır, ona görə yeni commit-lər dərhal görünür.", "A PR is tied to its branch, so new commits appear right away."),
      ),
      q(
        l("“Squash and merge” nə edir?", "What does “Squash and merge” do?"),
        [l("PR-ın bütün commit-lərini bir commit kimi birləşdirir", "Combines all the PR's commits into one commit"), l("Branch-ı silir və merge etmir", "Deletes the branch without merging"), l("Konfliktləri avtomatik həll edir", "Resolves conflicts automatically")],
        0,
        l("Əsas branch-da səliqəli, bir-commit-bir-dəyişiklik tarixçəsi alınır.", "The main branch gets a tidy one-commit-per-change history."),
      ),
    ],
    docs: [
      doc("GitHub Docs: About pull requests", "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests"),
      doc("GitHub Docs: About pull request merges", "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges"),
    ],
  },
  {
    id: "forks",
    group: "github",
    title: t4("Fork", "Forks", "Fork (çatallama)", "Форк (fork)"),
    summary: l("Fork başqasının repozitoriyasının sizin hesabınızdakı surətidir.", "A fork is a copy of someone else's repository under your account."),
    what: l(
      "Yazma icazəniz olmayan layihəyə (məsələn, açıq mənbəli kitabxanaya) töhfə vermək üçün onu fork edirsiniz: GitHub repozitoriyanın surətini hesabınızda yaradır. Siz fork-da sərbəst işləyir, sonra orijinal layihəyə pull request göndərirsiniz. Fork həm də layihəni öz ehtiyaclarınız üçün dəyişmək üçün istifadə olunur.",
      "To contribute to a project you cannot write to (for example an open-source library), you fork it: GitHub copies the repository into your account. You work freely in the fork and then send a pull request to the original project. Forks are also used to adapt a project to your own needs.",
    ),
    how: l(
      "Repozitoriya səhifəsində “Fork” düyməsini basın, sonra fork-u klonlayın. Orijinal repozitoriyanı `upstream` adı ilə əlavə edin ki, onun yeniliklərini ala biləsiniz. İşi ayrıca branch-da görün, fork-a push edin və orijinal repozitoriyaya PR açın. Fork-u GitHub-dakı “Sync fork” düyməsi ilə də yeniləmək olar.",
      "Click “Fork” on the repository page, then clone your fork. Add the original repository as `upstream` so you can pull its updates. Work on a separate branch, push to your fork and open a PR against the original. You can also update the fork with the “Sync fork” button on GitHub.",
    ),
    examples: [
      ex(
        code(
          "git clone https://github.com/YOU/awesome-lib.git",
          "cd awesome-lib",
          "git remote add upstream https://github.com/OWNER/awesome-lib.git",
          "git fetch upstream",
          "git switch main",
          "git merge upstream/main",
        ),
        l("Fork-u klonlayır, orijinalı `upstream` kimi əlavə edir və fork-un `main`-ini orijinalla sinxronlaşdırır.", "Clones the fork, adds the original as `upstream` and syncs the fork's `main` with it."),
      ),
      ex(code("gh repo fork OWNER/awesome-lib --clone"), l("`gh` ilə fork yaradıb dərhal klonlayır; `upstream` avtomatik qurulur.", "Forks and clones in one step with `gh`; `upstream` is configured automatically.")),
    ],
    mistakes: [
      l("Fork-un `main` branch-ında birbaşa işləmək — sonra orijinalla sinxronlaşdırmaq çətinləşir.", "Working directly on the fork's `main`, which makes syncing with the original harder."),
      l("Fork-u heç vaxt yeniləməmək və köhnə kod üzərində PR göndərmək.", "Never updating the fork and sending PRs based on outdated code."),
    ],
    exercise: l(
      "Açıq bir məşq repozitoriyasını (məsələn, `firstcontributions/first-contributions`) fork edin, klonlayın, `upstream` əlavə edin, təlimata uyğun dəyişiklik edib PR göndərin.",
      "Fork a practice repository (for example `firstcontributions/first-contributions`), clone it, add `upstream`, make the change its guide describes and open a PR.",
    ),
    quiz: [
      q(
        l("Fork-da orijinal repozitoriya üçün ənənəvi remote adı nədir?", "What is the conventional remote name for the original repository in a fork?"),
        ["upstream", "origin", "fork"],
        0,
        l("`origin` sizin fork-unuz, `upstream` isə orijinal layihədir.", "`origin` is your fork; `upstream` is the original project."),
      ),
      q(
        l("Nə vaxt fork lazımdır?", "When do you need a fork?"),
        [l("Yazma icazəniz olmayan repozitoriyaya töhfə verəndə", "When contributing to a repository you cannot write to"), l("Öz repozitoriyanızda branch açanda", "When opening a branch in your own repository"), l("Commit edəndə", "When committing")],
        0,
        l("Komanda üzvü kimi icazəniz varsa, adətən sadəcə branch kifayətdir.", "If you have write access as a team member, a branch is usually enough."),
      ),
    ],
    docs: [
      doc("GitHub Docs: Fork a repository", "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo"),
      doc("GitHub Docs: Syncing a fork", "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork"),
    ],
  },
  {
    id: "releases",
    group: "github",
    title: t4("Release-lər", "Releases", "Sürümler (Releases)", "Релизы"),
    summary: l("Release layihənin adlandırılmış, versiyalı buraxılışıdır.", "A release is a named, versioned edition of a project."),
    what: l(
      "Release istifadəçilərə “bu versiya hazırdır” demək üsuludur. Git-də versiya tag ilə (məsələn, `v1.2.0`) işarələnir, GitHub isə tag əsasında release səhifəsi yaradır: dəyişikliklər siyahısı (release notes) və yüklənə bilən fayllar (məsələn, quraşdırıcılar). Versiyalama üçün çox vaxt semantik versiyalama (SemVer: MAJOR.MINOR.PATCH) istifadə olunur.",
      "A release tells users “this version is ready”. In Git a version is marked with a tag (e.g. `v1.2.0`), and GitHub builds a release page from it: release notes and downloadable assets such as installers. Versions often follow semantic versioning (SemVer: MAJOR.MINOR.PATCH).",
    ),
    how: l(
      "Annotasiyalı tag (`git tag -a`) müəllif, tarix və mesaj saxlayır. Tag-lar adi `git push` ilə göndərilmir — ayrıca push etmək lazımdır. Sonra GitHub-da “Releases → Draft a new release” və ya `gh release create` ilə release yaradılır; `--generate-notes` birləşdirilmiş PR-lardan qeydləri avtomatik yazır. SemVer: uyğunsuz API dəyişikliyi → MAJOR, yeni funksiya → MINOR, düzəliş → PATCH.",
      "An annotated tag (`git tag -a`) stores the author, date and a message. Tags are not sent by a plain `git push`; push them separately. Then create the release on GitHub via “Releases → Draft a new release” or `gh release create`; `--generate-notes` writes notes from merged PRs. SemVer: breaking API change → MAJOR, new feature → MINOR, fix → PATCH.",
    ),
    examples: [
      ex(
        code("git tag -a v1.0.0 -m \"First stable release\"", "git push origin v1.0.0", "git tag --list"),
        l("`v1.0.0` annotasiyalı tag-ını yaradır, onu GitHub-a göndərir və bütün tag-ları göstərir.", "Creates the annotated tag `v1.0.0`, pushes it to GitHub and lists all tags."),
      ),
      ex(
        code("gh release create v1.0.0 ./dist/app-setup.exe --title \"v1.0.0\" --generate-notes"),
        l("`v1.0.0` tag-ı üçün release yaradır, quraşdırıcı faylı əlavə edir və qeydləri avtomatik yaradır.", "Creates a release for tag `v1.0.0`, attaches an installer and generates the notes."),
      ),
    ],
    mistakes: [
      l("Tag yaradıb onu push etməyi unutmaq — GitHub tag-ı görmür.", "Creating a tag but forgetting to push it, so GitHub never sees it."),
      l("Uyğunsuz (breaking) dəyişikliyi PATCH versiyası kimi buraxmaq.", "Shipping a breaking change as a PATCH version."),
    ],
    exercise: l(
      "Repozitoriyanızda `v0.1.0` annotasiyalı tag yaradın, push edin və GitHub-da qısa qeydlərlə release dərc edin.",
      "Create an annotated tag `v0.1.0` in your repository, push it and publish a release with short notes on GitHub.",
    ),
    quiz: [
      q(
        l("SemVer-ə görə yeni, geriyə uyğun funksiya versiyanın hansı hissəsini artırır?", "Under SemVer, which part does a new backward-compatible feature bump?"),
        ["MINOR", "MAJOR", "PATCH"],
        0,
        l("1.4.2 → 1.5.0. MAJOR uyğunsuz dəyişiklik, PATCH isə düzəliş üçündür.", "1.4.2 → 1.5.0. MAJOR is for breaking changes, PATCH for fixes."),
      ),
      q(
        l("`v1.0.0` tag-ını GitHub-a necə göndərmək olar?", "How do you send the tag `v1.0.0` to GitHub?"),
        ["git push origin v1.0.0", "git commit v1.0.0", "git fetch v1.0.0"],
        0,
        l("Tag-lar ayrıca push edilir (və ya `git push --tags` ilə hamısı).", "Tags are pushed explicitly (or all of them with `git push --tags`)."),
      ),
    ],
    docs: [
      doc("GitHub Docs: About releases", "https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases"),
      doc("git-tag", "https://git-scm.com/docs/git-tag"),
      doc("Semantic Versioning", "https://semver.org/"),
    ],
  },
  {
    id: "github-actions",
    group: "github",
    title: t4("GitHub Actions", "GitHub Actions", "GitHub Actions", "GitHub Actions"),
    summary: l("GitHub Actions push və PR zamanı test, build və deploy-u avtomatlaşdırır.", "GitHub Actions automates tests, builds and deployments on pushes and PRs."),
    what: l(
      "GitHub Actions GitHub-a daxil edilmiş CI/CD (davamlı inteqrasiya və çatdırılma) xidmətidir. Hər push və ya pull request zamanı avtomatik olaraq testləri işə salır, layihəni build edir və ya serverə deploy edir. Beləcə səhvlər `main`-ə düşməzdən əvvəl tutulur və təkrarlanan işlər əl ilə görülmür.",
      "GitHub Actions is the CI/CD (continuous integration and delivery) service built into GitHub. On every push or pull request it can run tests, build the project or deploy it. Bugs are caught before they reach `main`, and repetitive work stops being manual.",
    ),
    how: l(
      "İş axınları (workflows) `.github/workflows/` qovluğunda YAML faylları kimi saxlanılır. `on` hadisəni (push, pull_request, schedule), `jobs` işləri, `runs-on` virtual maşını, `steps` isə addımları təyin edir. Addım ya hazır action (`uses: actions/checkout@v4`), ya da shell əmri (`run: npm test`) olur. Nəticələr “Actions” tabında görünür, PR-da isə yaşıl ✓ və ya qırmızı ✗ kimi.",
      "Workflows are YAML files in `.github/workflows/`. `on` sets the trigger (push, pull_request, schedule), `jobs` the jobs, `runs-on` the virtual machine and `steps` the steps. A step is either a ready-made action (`uses: actions/checkout@v4`) or a shell command (`run: npm test`). Results appear in the “Actions” tab and as a green ✓ or red ✗ on the PR.",
    ),
    examples: [
      ex(
        code(
          "# .github/workflows/ci.yml",
          "name: CI",
          "on:",
          "  push:",
          "    branches: [main]",
          "  pull_request:",
          "jobs:",
          "  test:",
          "    runs-on: ubuntu-latest",
          "    steps:",
          "      - uses: actions/checkout@v4",
          "      - uses: actions/setup-node@v4",
          "        with:",
          "          node-version: 20",
          "      - run: npm ci",
          "      - run: npm test",
        ),
        l(
          "`main`-ə hər push və hər PR zamanı kodu yükləyir, Node.js 20 quraşdırır, asılılıqları `npm ci` ilə təmiz quraşdırır və testləri işə salır.",
          "On every push to `main` and every PR it checks out the code, installs Node.js 20, does a clean install with `npm ci` and runs the tests.",
        ),
      ),
    ],
    mistakes: [
      l("YAML-da girintiləri (indentation) səhv qoymaq — iş axını ümumiyyətlə işə düşmür.", "Getting YAML indentation wrong, so the workflow does not run at all."),
      l(
        "Parol və tokenləri workflow faylına birbaşa yazmaq. Onları “Settings → Secrets and variables → Actions” bölməsində saxlayıb `secrets.AD` kimi istifadə edin.",
        "Writing passwords or tokens directly into the workflow file. Store them under “Settings → Secrets and variables → Actions” and reference them as `secrets.NAME`.",
      ),
    ],
    exercise: l(
      "Repozitoriyanıza yuxarıdakı kimi `ci.yml` əlavə edin (testiniz yoxdursa `run: echo \"Hello CI\"` yazın), push edin və “Actions” tabında işin yaşıl bitdiyini yoxlayın.",
      "Add a `ci.yml` like the one above to your repository (if you have no tests use `run: echo \"Hello CI\"`), push it and check in the “Actions” tab that the run turns green.",
    ),
    quiz: [
      q(
        l("Workflow faylları harada saxlanılır?", "Where are workflow files stored?"),
        [".github/workflows/", ".git/hooks/", "src/actions/"],
        0,
        l("GitHub yalnız `.github/workflows/` qovluğundakı YAML fayllarını oxuyur.", "GitHub only reads YAML files in `.github/workflows/`."),
      ),
      q(
        l("API açarını workflow-da necə təhlükəsiz istifadə etmək olar?", "How do you use an API key safely in a workflow?"),
        [l("Repozitoriya secret-i kimi saxlayıb `secrets.AD` ilə", "Store it as a repository secret and use `secrets.NAME`"), l("YAML faylına birbaşa yazaraq", "Write it directly in the YAML"), l("README-yə yazaraq", "Write it in the README")],
        0,
        l("Secret-lər şifrələnmiş saxlanılır və loglarda gizlədilir.", "Secrets are stored encrypted and masked in logs."),
      ),
    ],
    docs: [
      doc("GitHub Docs: GitHub Actions", "https://docs.github.com/en/actions"),
      doc("GitHub Docs: Workflow syntax", "https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax"),
    ],
  },
  {
    id: "github-pages",
    group: "github",
    title: t4("GitHub Pages", "GitHub Pages", "GitHub Pages", "GitHub Pages"),
    summary: l("GitHub Pages repozitoriyadan pulsuz statik veb sayt yayımlayır.", "GitHub Pages publishes a free static website from a repository."),
    what: l(
      "GitHub Pages repozitoriyadakı HTML, CSS və JavaScript fayllarını pulsuz veb sayt kimi yayımlayır — portfoliyo, layihə sənədləri və ya kiçik veb tətbiq üçün ideal. Sayt `USERNAME.github.io` və ya `USERNAME.github.io/REPO` ünvanında açılır. Pages yalnız statik fayllar üçündür: server tərəfində kod (PHP, verilənlər bazası) işləmir.",
      "GitHub Pages publishes the HTML, CSS and JavaScript in a repository as a free website — ideal for a portfolio, project docs or a small web app. The site is served at `USERNAME.github.io` or `USERNAME.github.io/REPO`. Pages is for static files only: server-side code (PHP, databases) does not run.",
    ),
    how: l(
      "“Settings → Pages” bölməsində mənbə seçirsiniz: ya müəyyən branch-ın kök və ya `/docs` qovluğu, ya da GitHub Actions workflow-u. Vite/React kimi build tələb edən layihələr üçün Actions ilə build edib nəticəni (`dist/`) yayımlamaq daha doğrudur. Layihə saytı alt yolda (`/REPO/`) açıldığı üçün build alətində əsas yolu (Vite-də `base`) uyğunlaşdırmaq lazımdır.",
      "Under “Settings → Pages” you choose a source: the root or `/docs` folder of a branch, or a GitHub Actions workflow. For projects that need a build step, such as Vite/React, building with Actions and publishing the output (`dist/`) is the better choice. Because a project site lives under a sub-path (`/REPO/`), set the base path in your build tool (`base` in Vite).",
    ),
    examples: [
      ex(
        code(
          "# .github/workflows/pages.yml",
          "name: Deploy to Pages",
          "on:",
          "  push:",
          "    branches: [main]",
          "permissions:",
          "  contents: read",
          "  pages: write",
          "  id-token: write",
          "jobs:",
          "  deploy:",
          "    runs-on: ubuntu-latest",
          "    environment:",
          "      name: github-pages",
          "    steps:",
          "      - uses: actions/checkout@v4",
          "      - uses: actions/setup-node@v4",
          "        with:",
          "          node-version: 20",
          "      - run: npm ci",
          "      - run: npm run build",
          "      - uses: actions/upload-pages-artifact@v3",
          "        with:",
          "          path: dist",
          "      - uses: actions/deploy-pages@v4",
        ),
        l(
          "`main`-ə hər push-da layihəni build edir və `dist/` qovluğunu Pages-ə yayımlayır. “Settings → Pages”-da mənbə “GitHub Actions” seçilməlidir.",
          "On every push to `main` it builds the project and publishes `dist/` to Pages. The source under “Settings → Pages” must be set to “GitHub Actions”.",
        ),
      ),
    ],
    mistakes: [
      l("Vite-də `base` ayarlamamaq — sayt açılır, amma CSS və JS faylları 404 verir.", "Not setting `base` in Vite, so the page loads but CSS and JS return 404."),
      l("Pages-in server kodu (məsələn, Node.js API) işlədəcəyini gözləmək.", "Expecting Pages to run server code such as a Node.js API."),
    ],
    exercise: l(
      "Bir `index.html` faylı olan repozitoriya yaradın, “Settings → Pages”-da `main` branch-ının kökünü mənbə seçin və saytın `USERNAME.github.io/REPO` ünvanında açıldığını yoxlayın.",
      "Create a repository with an `index.html`, choose the root of `main` as the source under “Settings → Pages” and check that the site opens at `USERNAME.github.io/REPO`.",
    ),
    quiz: [
      q(
        l("GitHub Pages hansı növ saytları yayımlaya bilər?", "Which kind of sites can GitHub Pages host?"),
        [l("Yalnız statik (HTML, CSS, JS)", "Static only (HTML, CSS, JS)"), l("PHP və MySQL ilə dinamik", "Dynamic with PHP and MySQL"), l("İstənilən server tətbiqi", "Any server application")],
        0,
        l("Pages faylları olduğu kimi verir; server tərəfində kod icra olunmur.", "Pages serves files as they are; no server-side code runs."),
      ),
      q(
        l("Layihə saytı `USERNAME.github.io/REPO` ünvanındadırsa, Vite-də nə ayarlanmalıdır?", "If a project site lives at `USERNAME.github.io/REPO`, what must be set in Vite?"),
        [l("`base: \"/REPO/\"`", "`base: \"/REPO/\"`"), l("`port: 80`", "`port: 80`"), l("Heç nə", "Nothing")],
        0,
        l("Əks halda fayl yolları domen kökünə işarə edir və tapılmır.", "Otherwise asset paths point to the domain root and are not found."),
      ),
    ],
    docs: [
      doc("GitHub Docs: GitHub Pages", "https://docs.github.com/en/pages"),
      doc("GitHub Docs: Configuring a publishing source", "https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site"),
      doc("Vite: Deploying a static site", "https://vite.dev/guide/static-deploy"),
    ],
  },
  {
    id: "collaborators",
    group: "github",
    title: t4("Əməkdaşlar (collaborators)", "Collaborators", "Ortak çalışanlar (Collaborators)", "Соавторы (collaborators)"),
    summary: l("Collaborator-lar repozitoriyaya birbaşa yazma icazəsi olan şəxslərdir.", "Collaborators are people with direct write access to a repository."),
    what: l(
      "Şəxsi repozitoriyanızda başqaları ilə birgə işləmək üçün onları collaborator kimi dəvət edirsiniz — onlar fork etmədən birbaşa branch push edə və PR-ları merge edə bilirlər. Təşkilatlarda (organizations) isə giriş komandalar (teams) və rollar (read, triage, write, maintain, admin) ilə daha dəqiq idarə olunur.",
      "To work with others on your personal repository you invite them as collaborators — they can push branches and merge PRs directly, without forking. In organisations, access is managed more precisely with teams and roles (read, triage, write, maintain, admin).",
    ),
    how: l(
      "“Settings → Collaborators” bölməsində “Add people” ilə istifadəçi adı və ya e-poçt daxil edirsiniz; şəxs dəvəti qəbul etməlidir. `main`-i qorumaq üçün “Settings → Branches” (və ya “Rules → Rulesets”) bölməsində qayda qurun: birbaşa push qadağası, PR və ən azı bir təsdiq (approval) tələbi, CI-ın keçməsi. `CODEOWNERS` faylı müəyyən qovluqlar üçün reviewer-ləri avtomatik təyin edir.",
      "Under “Settings → Collaborators” choose “Add people” and enter a username or email; the person must accept the invitation. Protect `main` under “Settings → Branches” (or “Rules → Rulesets”): block direct pushes, require a PR with at least one approval and passing CI. A `CODEOWNERS` file assigns reviewers for certain paths automatically.",
    ),
    examples: [
      ex(
        code("# .github/CODEOWNERS", "*            @team-lead", "/docs/       @aysel", "*.css        @design-team"),
        l(
          "Hər fayl üçün `@team-lead`, `docs/` üçün `@aysel`, CSS faylları üçün dizayn komandası avtomatik reviewer olur (sonuncu uyğun qayda qalib gəlir).",
          "`@team-lead` reviews everything, `@aysel` reviews `docs/` and the design team reviews CSS files (the last matching rule wins).",
        ),
      ),
    ],
    mistakes: [
      l("Hər kəsə admin hüququ vermək — minimum lazımi icazə prinsipini (least privilege) pozur.", "Giving everyone admin rights, which breaks the principle of least privilege."),
      l("Komandada `main` üçün qoruma qaydası qurmamaq — kimsə səhvən birbaşa push edə bilər.", "Not protecting `main` in a team, so someone can push directly by mistake."),
    ],
    exercise: l(
      "Dostunuzu repozitoriyanıza collaborator kimi dəvət edin və `main` üçün “PR tələb olunur, 1 təsdiq” qaydası qurun. Sonra birbaşa push etməyə çalışıb rədd edildiyini yoxlayın.",
      "Invite a friend as a collaborator and add a rule for `main` requiring a PR with one approval. Then try a direct push and confirm it is rejected.",
    ),
    quiz: [
      q(
        l("Collaborator-un fork etmədən edə biləcəyi şey hansıdır?", "What can a collaborator do without forking?"),
        [l("Repozitoriyaya birbaşa branch push etmək", "Push branches directly to the repository"), l("Repozitoriyanı silmək", "Delete the repository"), l("Hesabınızın parolunu dəyişmək", "Change your account password")],
        0,
        l("Collaborator yazma icazəsi alır; repozitoriyanı silmək sahibin/adminin hüququdur.", "A collaborator gets write access; deleting the repository is for the owner or admin."),
      ),
      q(
        l("`CODEOWNERS` faylı nə edir?", "What does a `CODEOWNERS` file do?"),
        [l("Müəyyən fayllar üçün reviewer-ləri avtomatik təyin edir", "Automatically requests reviewers for certain files"), l("Faylların müəllif hüququnu qeyd edir", "Registers copyright for files"), l("Faylları gizlədir", "Hides files")],
        0,
        l("PR uyğun faylları dəyişəndə həmin şəxslərdən review istənilir.", "When a PR touches matching files, those owners are asked to review."),
      ),
    ],
    docs: [
      doc("GitHub Docs: Inviting collaborators to a personal repository", "https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository"),
      doc("GitHub Docs: About protected branches", "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches"),
      doc("GitHub Docs: About code owners", "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners"),
    ],
  },
  {
    id: "open-source",
    group: "github",
    title: t4("Açıq mənbə", "Open source", "Açık kaynak", "Открытый исходный код"),
    summary: l("Açıq mənbəli layihələrin kodu hamı üçün açıqdır və hər kəs töhfə verə bilər.", "Open-source projects publish their code so anyone can use it and contribute."),
    what: l(
      "Açıq mənbəli (open source) proqramın kodu ictimaidir və lisenziya onun istifadəsinə, dəyişdirilməsinə və paylaşılmasına icazə verir. React, Linux, VS Code, Python kimi alətlərin hamısı açıq mənbəlidir. Töhfə vermək təcrübə qazanmağın, real kodu oxumağın, komanda ilə işləməyi öyrənməyin və portfoliyo qurmağın ən yaxşı yollarından biridir.",
      "Open-source software has public code and a license that allows using, modifying and sharing it. Tools like React, Linux, VS Code and Python are all open source. Contributing is one of the best ways to gain experience, read real code, learn team work and build a portfolio.",
    ),
    how: l(
      "Başlamaq üçün `good first issue` etiketli issue-ları axtarın, `README` və `CONTRIBUTING.md` fayllarını oxuyun, `CODE_OF_CONDUCT.md` qaydalarına riayət edin. İşə başlamazdan əvvəl issue-da yazın ki, onu götürürsünüz. Töhfə yalnız kod deyil: sənədləri düzəltmək, tərcümə, səhv hesabatı da töhfədir. Lisenziya (MIT, Apache-2.0, GPL-3.0) kodla nə edə biləcəyinizi müəyyən edir; lisenziyası olmayan kodu istifadə etmək hüquqi baxımdan riskli ola bilər.",
      "To begin, look for issues labelled `good first issue`, read the `README` and `CONTRIBUTING.md`, and follow the `CODE_OF_CONDUCT.md`. Comment on the issue before starting so others know you are working on it. Contributions are not only code: fixing docs, translations and bug reports count too. The license (MIT, Apache-2.0, GPL-3.0) defines what you may do with the code; using code without any license can be legally risky.",
    ),
    examples: [
      ex(
        code("is:open is:issue label:\"good first issue\" language:TypeScript"),
        l("GitHub axtarışında TypeScript layihələrində yeni başlayanlar üçün açıq issue-ları tapan sorğu.", "A GitHub search query that finds open beginner-friendly issues in TypeScript projects."),
      ),
      ex(
        code("gh repo fork OWNER/project --clone", "cd project", "git switch -c docs/fix-typo", "git commit -am \"docs: fix typo in installation guide\"", "git push -u origin docs/fix-typo", "gh pr create --fill"),
        l("Tipik ilk töhfə: fork, branch, kiçik sənəd düzəlişi, push və PR (`--fill` başlığı commit-dən götürür).", "A typical first contribution: fork, branch, a small docs fix, push and PR (`--fill` takes the title from the commit)."),
      ),
    ],
    mistakes: [
      l("`CONTRIBUTING.md`-ni oxumadan böyük PR göndərmək — layihənin qaydalarına uymur və rədd edilir.", "Sending a big PR without reading `CONTRIBUTING.md`, so it ignores the project's rules and gets rejected."),
      l("Maintainer-lərdən dərhal cavab gözləmək; onlar çox vaxt könüllüdür.", "Expecting instant replies from maintainers, who are often volunteers."),
    ],
    exercise: l(
      "Sevdiyiniz açıq mənbəli layihədə bir `good first issue` və ya sənəddə səhv tapın, layihənin `CONTRIBUTING.md` qaydalarına uyğun olaraq PR göndərin.",
      "Find a `good first issue` or a documentation mistake in an open-source project you like and send a PR following its `CONTRIBUTING.md`.",
    ),
    quiz: [
      q(
        l("Layihəyə necə töhfə veriləcəyi adətən hansı faylda yazılır?", "Which file usually explains how to contribute to a project?"),
        ["CONTRIBUTING.md", "package-lock.json", ".gitignore"],
        0,
        l("`CONTRIBUTING.md` branch, test və PR qaydalarını izah edir.", "`CONTRIBUTING.md` explains branch, test and PR conventions."),
      ),
      q(
        l("Kodu istifadə etməyə nə icazə verir?", "What grants permission to use the code?"),
        [l("Lisenziya", "The license"), l("Ulduz (star) sayı", "The star count"), l("README-nin uzunluğu", "The README's length")],
        0,
        l("Açıq kod belə yalnız lisenziyanın icazə verdiyi qədər istifadə edilə bilər.", "Even public code may only be used as far as its license allows."),
      ),
    ],
    docs: [
      doc("Open Source Guides: How to Contribute", "https://opensource.guide/how-to-contribute/"),
      doc("GitHub Docs: Finding ways to contribute to open source", "https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github"),
      doc("Choose a License", "https://choosealicense.com/"),
    ],
  },
];

// ---------------------------------------------------------------------------
// 3. Other platforms
// ---------------------------------------------------------------------------

const PLATFORMS: GitTopic[] = [
  {
    id: "gitlab",
    group: "platforms",
    title: t4("GitLab", "GitLab", "GitLab", "GitLab"),
    summary: l("GitLab — daxili CI/CD-si olan və öz serverinizdə də qurula bilən Git platformasıdır.", "GitLab is a Git platform with built-in CI/CD that can also be self-hosted."),
    what: l(
      "GitLab GitHub-a bənzər platformadır: repozitoriyalar, issue-lar, kod review və CI/CD bir yerdədir. Onun fərqli tərəfi odur ki, şirkətlər GitLab-ı öz serverlərində (self-managed) qura bilirlər — bu, məlumatın şirkət daxilində qalmalı olduğu bank və dövlət layihələrində populyardır. GitLab-da pull request “merge request” (MR) adlanır.",
      "GitLab is a platform similar to GitHub: repositories, issues, code review and CI/CD in one place. Its distinguishing feature is that companies can run it on their own servers (self-managed) — popular in banking and government projects where data must stay in-house. On GitLab a pull request is called a “merge request” (MR).",
    ),
    how: l(
      "Git əmrləri eynidir — yalnız remote ünvanı `gitlab.com` və ya şirkət serveri olur. CI/CD repozitoriyanın kökündəki `.gitlab-ci.yml` faylı ilə qurulur: `stages` iş qruplarının (stages) icra sırasını, hər job isə `stage` və `script` təyin edir. Job-lar GitLab Runner adlı agentlərdə icra olunur.",
      "Git commands are the same — only the remote URL points to `gitlab.com` or a company server. CI/CD is configured with `.gitlab-ci.yml` in the repository root: `stages` sets the order and each job defines a `stage` and a `script`. Jobs run on agents called GitLab Runners.",
    ),
    examples: [
      ex(
        code("# .gitlab-ci.yml", "stages:", "  - test", "", "unit-tests:", "  stage: test", "  image: node:20", "  script:", "    - npm ci", "    - npm test"),
        l("Node.js 20 konteynerində asılılıqları quraşdırıb testləri işə salan sadə GitLab CI konfiqurasiyası.", "A simple GitLab CI configuration that installs dependencies and runs tests in a Node.js 20 container."),
      ),
      ex(
        code("git push -u origin feature/api -o merge_request.create -o merge_request.target=main"),
        l("Branch-ı push edir və GitLab push seçimləri (push options) ilə dərhal `main`-ə merge request yaradır.", "Pushes the branch and immediately creates a merge request into `main` using GitLab push options."),
      ),
    ],
    mistakes: [
      l("GitHub Actions YAML-ını `.gitlab-ci.yml`-ə köçürmək — sintaksis tamamilə fərqlidir.", "Copying GitHub Actions YAML into `.gitlab-ci.yml` — the syntax is completely different."),
    ],
    exercise: l(
      "gitlab.com-da layihə yaradın, yerli repozitoriyanızı ikinci remote kimi (`git remote add gitlab URL`) əlavə edib push edin və sadə `.gitlab-ci.yml` ilə pipeline işə salın.",
      "Create a project on gitlab.com, add it as a second remote (`git remote add gitlab URL`), push, and run a pipeline with a simple `.gitlab-ci.yml`.",
    ),
    quiz: [
      q(
        l("GitLab-da pull request necə adlanır?", "What is a pull request called on GitLab?"),
        ["Merge request", "Push request", "Fork request"],
        0,
        l("Mahiyyət eynidir: branch-ı review edib birləşdirmək təklifi.", "Same idea: a proposal to review and merge a branch."),
      ),
      q(
        l("GitLab CI konfiqurasiyası hansı fayldadır?", "Which file holds the GitLab CI configuration?"),
        [".gitlab-ci.yml", ".github/workflows/ci.yml", "Jenkinsfile"],
        0,
        l("GitLab repozitoriyanın kökündəki `.gitlab-ci.yml`-i oxuyur.", "GitLab reads `.gitlab-ci.yml` from the repository root."),
      ),
    ],
    docs: [doc("GitLab Docs", "https://docs.gitlab.com/"), doc("GitLab CI/CD", "https://docs.gitlab.com/ci/"), doc("GitLab push options", "https://docs.gitlab.com/user/project/push_options/")],
  },
  {
    id: "bitbucket",
    group: "platforms",
    title: t4("Bitbucket", "Bitbucket", "Bitbucket", "Bitbucket"),
    summary: l("Bitbucket — Jira ilə sıx inteqrasiyası olan Atlassian Git platformasıdır.", "Bitbucket is Atlassian's Git platform, tightly integrated with Jira."),
    what: l(
      "Bitbucket Atlassian şirkətinin Git hostinq xidmətidir. Onun əsas üstünlüyü Jira (tapşırıq izləmə) və Confluence (sənədləşmə) ilə inteqrasiyadır, ona görə bu alətlərdən istifadə edən şirkətlərdə tez-tez rast gəlinir. Bitbucket Cloud və öz serverdə qurulan Data Center versiyaları var.",
      "Bitbucket is Atlassian's Git hosting service. Its main strength is integration with Jira (issue tracking) and Confluence (documentation), so it is common in companies that use those tools. It comes as Bitbucket Cloud and a self-hosted Data Center edition.",
    ),
    how: l(
      "Git iş prosesi eynidir; pull request-lər burada da “pull request” adlanır. Jira tapşırıq açarını (məsələn, `SHOP-142`) branch adına və ya commit mesajına yazsanız, Jira tapşırığında avtomatik görünür. CI/CD Bitbucket Pipelines ilə `bitbucket-pipelines.yml` faylında qurulur.",
      "The Git workflow is the same and pull requests are also called “pull requests”. If you include a Jira issue key (e.g. `SHOP-142`) in a branch name or commit message, it shows up in the Jira issue automatically. CI/CD is configured with Bitbucket Pipelines in `bitbucket-pipelines.yml`.",
    ),
    examples: [
      ex(
        code("git switch -c feature/SHOP-142-cart-total", "git commit -m \"SHOP-142 Fix cart total rounding\""),
        l("Branch və commit-də Jira açarı (`SHOP-142`) istifadə edir ki, iş Jira tapşırığına bağlansın.", "Uses the Jira key (`SHOP-142`) in the branch and commit so the work is linked to the Jira issue."),
      ),
      ex(
        code("# bitbucket-pipelines.yml", "image: node:20", "pipelines:", "  default:", "    - step:", "        name: Test", "        script:", "          - npm ci", "          - npm test"),
        l("Hər push-da Node.js 20 obrazında testləri işə salan Bitbucket Pipelines konfiqurasiyası.", "A Bitbucket Pipelines configuration that runs the tests in a Node.js 20 image on every push."),
      ),
    ],
    mistakes: [
      l("Commit mesajında Jira açarını səhv yazmaq (`shop142`) — tapşırıqla əlaqə qurulmur.", "Mistyping the Jira key in a commit (`shop142`), so the link to the issue is not created."),
    ],
    exercise: l(
      "Bitbucket Cloud-da repozitoriya yaradın, layihənizi push edin və sadə `bitbucket-pipelines.yml` əlavə edərək ilk pipeline-ı işə salın.",
      "Create a repository on Bitbucket Cloud, push your project and add a simple `bitbucket-pipelines.yml` to run your first pipeline.",
    ),
    quiz: [
      q(
        l("Bitbucket-in ən güclü inteqrasiyası hansı alətlədir?", "Which tool is Bitbucket most tightly integrated with?"),
        ["Jira", "npm", "Docker Hub"],
        0,
        l("Hər ikisi Atlassian məhsuludur.", "Both are Atlassian products."),
      ),
      q(
        l("Bitbucket-də CI/CD hansı fayl ilə qurulur?", "Which file configures CI/CD on Bitbucket?"),
        ["bitbucket-pipelines.yml", ".gitlab-ci.yml", "package.json"],
        0,
        l("Bitbucket Pipelines repozitoriyanın kökündəki bu faylı oxuyur.", "Bitbucket Pipelines reads this file from the repository root."),
      ),
    ],
    docs: [
      doc("Bitbucket Cloud documentation", "https://support.atlassian.com/bitbucket-cloud/"),
      doc("Get started with Bitbucket Pipelines", "https://support.atlassian.com/bitbucket-cloud/docs/get-started-with-bitbucket-pipelines/"),
    ],
  },
  {
    id: "stack-overflow",
    group: "platforms",
    title: t4("Stack Overflow", "Stack Overflow", "Stack Overflow", "Stack Overflow"),
    summary: l("Stack Overflow proqramçılar üçün sual-cavab platformasıdır.", "Stack Overflow is a question-and-answer site for programmers."),
    what: l(
      "Stack Overflow proqramlaşdırma suallarının və cavablarının ən böyük bazasıdır. Səhv mesajını axtarışa yazsanız, çox vaxt eyni problemi yaşamış birinin sualına və səs verilmiş (upvoted) cavaba çıxırsınız. Yaxşı sual vermək bacarığı, hətta göndərmədən əvvəl, çox vaxt problemi özünüz həll etməyinizə kömək edir.",
      "Stack Overflow is the largest collection of programming questions and answers. Searching an error message often leads to someone who had the same problem and an upvoted answer. The skill of asking a good question often helps you solve the problem yourself, even before posting.",
    ),
    how: l(
      "Sual verməzdən əvvəl axtarış edin. Sualda: konkret başlıq, nə etmək istədiyiniz, nə sınadığınız, tam səhv mesajı (mətn kimi, şəkil yox) və minimal, təkrarlana bilən nümunə (minimal reproducible example) olmalıdır. Uyğun teqlər (`git`, `reactjs`) əlavə edin. Cavab kömək edəndə onu qəbul edin (accept). Kopyaladığınız kodu başa düşdüyünüzə və lisenziya (CC BY-SA) şərtlərinə əməl etdiyinizə əmin olun.",
      "Search before asking. A question should have a specific title, what you want to achieve, what you tried, the full error message (as text, not a screenshot) and a minimal reproducible example. Add the right tags (`git`, `reactjs`). Accept the answer that helped. Make sure you understand code you copy and respect its license (CC BY-SA).",
    ),
    examples: [
      ex(
        code(
          "Title: git push rejected with \"non-fast-forward\" after editing README on GitHub",
          "",
          "I edited README.md on github.com, then committed locally and ran:",
          "  git push origin main",
          "Error:",
          "  ! [rejected]        main -> main (non-fast-forward)",
          "What I tried: git push again (same error).",
          "Git version: 2.47, Windows 11.",
        ),
        l("Yaxşı sual strukturu: konkret başlıq, addımlar, tam səhv mətni, sınanan həll və mühit.", "A good question structure: specific title, steps, full error text, what was tried and the environment."),
      ),
    ],
    mistakes: [
      l("Kodu və səhvi ekran görüntüsü kimi yerləşdirmək — onu axtarmaq və kopyalamaq olmur.", "Posting code and errors as screenshots, which can't be searched or copied."),
      l("Cavabdakı kodu başa düşmədən layihəyə köçürmək.", "Pasting an answer's code into your project without understanding it."),
    ],
    exercise: l(
      "Son qarşılaşdığınız səhvi götürün və onun üçün Stack Overflow qaydalarına uyğun sual qaralaması yazın (göndərmək məcburi deyil). Çox vaxt yazarkən həlli özünüz tapacaqsınız.",
      "Take the last error you hit and draft a Stack Overflow question for it following the guidelines (posting is optional). Often you will find the fix while writing.",
    ),
    quiz: [
      q(
        l("Yaxşı sualda mütləq nə olmalıdır?", "What must a good question include?"),
        [l("Minimal, təkrarlana bilən nümunə və tam səhv mətni", "A minimal reproducible example and the full error text"), l("Bütün layihənin kodu", "The whole project's code"), l("Yalnız “kömək edin” sözü", "Just the words “please help”")],
        0,
        l("Başqaları problemi təkrarlaya bilməlidir.", "Others need to be able to reproduce the problem."),
      ),
      q(
        l("Səhv mesajını necə paylaşmaq lazımdır?", "How should you share an error message?"),
        [l("Mətn kimi, kod bloku içində", "As text in a code block"), l("Telefonla çəkilmiş şəkil kimi", "As a phone photo"), l("Ümumiyyətlə paylaşmamaq", "Not at all")],
        0,
        l("Mətn axtarıla, kopyalana və ekran oxuyucuları ilə oxuna bilər.", "Text can be searched, copied and read by screen readers."),
      ),
    ],
    docs: [doc("Stack Overflow: How do I ask a good question?", "https://stackoverflow.com/help/how-to-ask"), doc("Stack Overflow: Minimal reproducible example", "https://stackoverflow.com/help/minimal-reproducible-example")],
  },
  {
    id: "npm",
    group: "platforms",
    title: t4("npm", "npm", "npm", "npm"),
    summary: l("npm JavaScript paketlərinin reyestri və paket menecerdir.", "npm is the JavaScript package registry and package manager."),
    what: l(
      "npm (Node Package Manager) iki şeydir: dünyanın ən böyük JavaScript paket reyestri (npmjs.com) və Node.js ilə gələn komanda xətti aləti. React, Vite kimi kitabxanaları layihəyə npm ilə əlavə edirsiniz, öz kitabxananızı da npm-də dərc edə bilərsiniz.",
      "npm (Node Package Manager) is two things: the world's largest JavaScript package registry (npmjs.com) and the command-line tool that ships with Node.js. You add libraries such as React or Vite to a project with npm, and you can publish your own library there.",
    ),
    how: l(
      "`package.json` layihənin adını, versiyasını, skriptlərini və asılılıqlarını (dependencies) saxlayır. `npm install paket` paketi `node_modules/`-a yükləyir və `package.json` ilə `package-lock.json`-a yazır. Lock faylı dəqiq versiyaları qeyd edir — onu commit edin, `node_modules/`-u isə yox. CI-da `npm ci` lock faylına uyğun təmiz quraşdırma edir. Versiya aralıqları: `^1.2.3` 1.x.x daxilində yeniləmələrə icazə verir.",
      "`package.json` stores the project's name, version, scripts and dependencies. `npm install pkg` downloads the package into `node_modules/` and records it in `package.json` and `package-lock.json`. The lock file pins exact versions — commit it, but not `node_modules/`. In CI, `npm ci` does a clean install that matches the lock file. Version ranges: `^1.2.3` allows updates within 1.x.x.",
    ),
    examples: [
      ex(
        code("npm init -y", "npm install react", "npm install --save-dev vitest", "npm run test"),
        l("`package.json` yaradır, React-i adi asılılıq, Vitest-i isə yalnız inkişaf (dev) asılılığı kimi əlavə edir və `test` skriptini işə salır.", "Creates `package.json`, adds React as a dependency and Vitest as a dev dependency, then runs the `test` script."),
      ),
      ex(
        code("npm login", "npm version patch", "npm publish --access public"),
        l("Öz paketinizi dərc etmək: daxil olun, versiyanı PATCH artırın (git tag da yaradır) və açıq paket kimi dərc edin.", "Publishing your own package: log in, bump the PATCH version (this also creates a git tag) and publish it as public."),
      ),
    ],
    mistakes: [
      l("`node_modules/`-u commit etmək və `package-lock.json`-u isə `.gitignore`-a qoymaq — tam əksi olmalıdır.", "Committing `node_modules/` while ignoring `package-lock.json` — it should be the other way round."),
      l("Adı məşhur paketə oxşayan (typosquatting) paketi yoxlamadan quraşdırmaq.", "Installing a package whose name imitates a popular one (typosquatting) without checking."),
    ],
    exercise: l(
      "Yeni qovluqda `npm init -y` edin, `dayjs` paketini quraşdırın, `package.json`-da asılılığın necə yazıldığına baxın və `npm ls` ilə quraşdırılmış paketləri sadalayın.",
      "Run `npm init -y` in a new folder, install `dayjs`, look at how the dependency appears in `package.json` and list installed packages with `npm ls`.",
    ),
    quiz: [
      q(
        l("Hansı fayl commit edilməlidir?", "Which file should be committed?"),
        ["package-lock.json", "node_modules/", ".npm/"],
        0,
        l("Lock faylı hamının eyni versiyaları quraşdırmasını təmin edir.", "The lock file ensures everyone installs the same versions."),
      ),
      q(
        l("CI-da təmiz, lock faylına uyğun quraşdırma üçün hansı əmr istifadə olunur?", "Which command does a clean install matching the lock file in CI?"),
        ["npm ci", "npm update", "npm publish"],
        0,
        l("`npm ci` `node_modules`-u silib lock faylından dəqiq quraşdırır.", "`npm ci` removes `node_modules` and installs exactly from the lock file."),
      ),
    ],
    docs: [doc("npm Docs", "https://docs.npmjs.com/"), doc("npm Docs: package.json", "https://docs.npmjs.com/cli/configuring-npm/package-json")],
  },
  {
    id: "pypi",
    group: "platforms",
    title: t4("PyPI", "PyPI", "PyPI", "PyPI"),
    summary: l("PyPI Python paketlərinin rəsmi reyestridir; paketlər `pip` ilə quraşdırılır.", "PyPI is the official Python package index; packages are installed with `pip`."),
    what: l(
      "PyPI (Python Package Index, pypi.org) Python kitabxanalarının rəsmi anbarıdır: `requests`, `numpy`, `django` və yüz minlərlə başqası. `pip install` əmri paketləri buradan endirir. Öz Python kitabxananızı da PyPI-də dərc edə bilərsiniz.",
      "PyPI (Python Package Index, pypi.org) is the official repository of Python libraries: `requests`, `numpy`, `django` and hundreds of thousands more. `pip install` downloads packages from it. You can publish your own Python library there as well.",
    ),
    how: l(
      "Hər layihə üçün virtual mühit (virtual environment) yaradın ki, paketlər sistem Python-u ilə qarışmasın. Asılılıqları `requirements.txt` və ya `pyproject.toml`-da qeyd edin. Paket dərc etmək üçün `pyproject.toml`-da metadata yazılır, `python -m build` ilə paylama faylları (`dist/`) yaradılır və `twine` ilə yüklənir; əvvəlcə TestPyPI-də sınamaq tövsiyə olunur.",
      "Create a virtual environment per project so packages don't mix with the system Python. Record dependencies in `requirements.txt` or `pyproject.toml`. To publish, write metadata in `pyproject.toml`, build distributions into `dist/` with `python -m build` and upload them with `twine`; trying TestPyPI first is recommended.",
    ),
    examples: [
      ex(
        code("python -m venv .venv", "# Windows: .venv\\Scripts\\activate   macOS/Linux: source .venv/bin/activate", "pip install requests", "pip freeze > requirements.txt"),
        l("Virtual mühit yaradıb aktivləşdirir, `requests` paketini quraşdırır və dəqiq versiyaları `requirements.txt`-ə yazır.", "Creates and activates a virtual environment, installs `requests` and writes exact versions to `requirements.txt`."),
      ),
      ex(
        code("[project]", "name = \"codeverse-hello\"", "version = \"0.1.0\"", "requires-python = \">=3.9\"", "", "[build-system]", "requires = [\"hatchling\"]", "build-backend = \"hatchling.build\""),
        l("Dərc ediləcək paket üçün minimal `pyproject.toml`.", "A minimal `pyproject.toml` for a package you want to publish."),
      ),
      ex(
        code("python -m pip install --upgrade build twine", "python -m build", "python -m twine upload --repository testpypi dist/*"),
        l("Paketi build edir və əvvəlcə sınaq üçün TestPyPI-yə yükləyir.", "Builds the package and uploads it to TestPyPI first for testing."),
      ),
    ],
    mistakes: [
      l("Virtual mühit olmadan qlobal `pip install` etmək — layihələrin versiyaları toqquşur.", "Running global `pip install` without a virtual environment, so project versions clash."),
      l("`.venv/` qovluğunu commit etmək; onu `.gitignore`-a əlavə edin.", "Committing the `.venv/` folder; add it to `.gitignore`."),
    ],
    exercise: l(
      "Yeni layihədə virtual mühit yaradın, `requests` quraşdırın, `requirements.txt` yaradın və başqa qovluqda `pip install -r requirements.txt` ilə eyni mühiti bərpa edin.",
      "Create a virtual environment in a new project, install `requests`, generate `requirements.txt`, and recreate the environment in another folder with `pip install -r requirements.txt`.",
    ),
    quiz: [
      q(
        l("Python layihəsi üçün paketləri təcrid etməyin standart yolu nədir?", "What is the standard way to isolate packages for a Python project?"),
        [l("Virtual mühit (`python -m venv`)", "A virtual environment (`python -m venv`)"), l("Paketləri layihə qovluğuna əl ilə köçürmək", "Copying packages into the project by hand"), l("Hər şeyi qlobal quraşdırmaq", "Installing everything globally")],
        0,
        l("Hər layihənin öz asılılıq dəsti olur.", "Each project gets its own set of dependencies."),
      ),
      q(
        l("Paketi PyPI-yə yükləmək üçün hansı alət istifadə olunur?", "Which tool uploads a package to PyPI?"),
        ["twine", "pip freeze", "venv"],
        0,
        l("`python -m build` faylları yaradır, `twine upload` isə yükləyir.", "`python -m build` creates the files and `twine upload` uploads them."),
      ),
    ],
    docs: [
      doc("Python Packaging User Guide", "https://packaging.python.org/en/latest/"),
      doc("Packaging Python Projects (tutorial)", "https://packaging.python.org/en/latest/tutorials/packaging-projects/"),
      doc("pip documentation", "https://pip.pypa.io/en/stable/"),
    ],
  },
  {
    id: "maven-central",
    group: "platforms",
    title: t4("Maven Central", "Maven Central", "Maven Central", "Maven Central"),
    summary: l("Maven Central Java/Kotlin kitabxanalarının əsas ictimai reyestridir.", "Maven Central is the main public repository for Java and Kotlin libraries."),
    what: l(
      "Maven Central JVM dünyasının (Java, Kotlin, Scala) paket anbarıdır. Spring, JUnit, Jackson kimi kitabxanalar buradan gəlir. Maven və Gradle build alətləri asılılıqları avtomatik olaraq Maven Central-dan endirir. Hər kitabxana üç koordinatla tanınır: `groupId`, `artifactId`, `version`.",
      "Maven Central is the package repository of the JVM world (Java, Kotlin, Scala). Libraries such as Spring, JUnit and Jackson come from it. The Maven and Gradle build tools download dependencies from Maven Central automatically. Every library is identified by three coordinates: `groupId`, `artifactId` and `version`.",
    ),
    how: l(
      "Maven-də asılılıq `pom.xml`-də `<dependency>` kimi, Gradle-da isə `build.gradle.kts`-də `implementation(\"group:artifact:version\")` kimi yazılır. Build zamanı alət kitabxananı və onun asılılıqlarını endirib lokal keşdə (`~/.m2`) saxlayır. Maven Central-da dərc etmək üçün Sonatype Central Portal-da namespace (adətən sahib olduğunuz domen) doğrulanmalı, artefaktlar isə imzalanmalıdır.",
      "In Maven a dependency is a `<dependency>` in `pom.xml`; in Gradle it is `implementation(\"group:artifact:version\")` in `build.gradle.kts`. During the build the tool downloads the library and its dependencies and caches them locally (`~/.m2`). Publishing to Maven Central requires verifying a namespace (usually a domain you own) on the Sonatype Central Portal and signing the artifacts.",
    ),
    examples: [
      ex(
        code("<dependency>", "  <groupId>org.junit.jupiter</groupId>", "  <artifactId>junit-jupiter</artifactId>", "  <version>5.11.0</version>", "  <scope>test</scope>", "</dependency>"),
        l("`pom.xml`-də JUnit 5-i yalnız testlər üçün (`test` scope) asılılıq kimi əlavə edir.", "Adds JUnit 5 to `pom.xml` as a test-only (`test` scope) dependency."),
      ),
      ex(
        code("dependencies {", "    testImplementation(\"org.junit.jupiter:junit-jupiter:5.11.0\")", "}"),
        l("Eyni asılılığın Gradle Kotlin DSL (`build.gradle.kts`) ilə yazılışı.", "The same dependency written in the Gradle Kotlin DSL (`build.gradle.kts`)."),
      ),
      ex(code("mvn package", "mvn dependency:tree"), l("Layihəni build edir və asılılıq ağacını göstərir.", "Builds the project and prints the dependency tree.")),
    ],
    mistakes: [
      l("Versiyanı göstərməmək və ya `LATEST` kimi dəyişkən versiyalardan istifadə etmək — build təkrarlana bilən olmur.", "Omitting the version or using moving versions like `LATEST`, making builds non-reproducible."),
    ],
    exercise: l(
      "search.maven.org (central.sonatype.com) saytında `jackson-databind` kitabxanasını tapın, onun Maven və Gradle koordinatlarını müqayisə edin və bir Java layihəsinə əlavə edin.",
      "Find `jackson-databind` on central.sonatype.com, compare its Maven and Gradle coordinates and add it to a Java project.",
    ),
    quiz: [
      q(
        l("Maven artefaktını hansı üç koordinat müəyyən edir?", "Which three coordinates identify a Maven artifact?"),
        ["groupId, artifactId, version", "name, author, license", "url, branch, commit"],
        0,
        l("Məsələn, `org.junit.jupiter:junit-jupiter:5.11.0`.", "For example `org.junit.jupiter:junit-jupiter:5.11.0`."),
      ),
      q(
        l("Maven asılılıqları hansı faylda yazılır?", "Which file lists Maven dependencies?"),
        ["pom.xml", "package.json", "requirements.txt"],
        0,
        l("Gradle-da bunun ekvivalenti `build.gradle(.kts)`-dir.", "The Gradle equivalent is `build.gradle(.kts)`."),
      ),
    ],
    docs: [
      doc("Sonatype Central Documentation", "https://central.sonatype.org/"),
      doc("Maven: Introduction to the Dependency Mechanism", "https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html"),
      doc("Gradle: Declaring dependencies", "https://docs.gradle.org/current/userguide/declaring_dependencies.html"),
    ],
  },
  {
    id: "nuget",
    group: "platforms",
    title: t4("NuGet", "NuGet", "NuGet", "NuGet"),
    summary: l("NuGet .NET (C#, F#) paketlərinin menecerdir və reyestridir.", "NuGet is the package manager and registry for .NET (C#, F#)."),
    what: l(
      "NuGet .NET ekosisteminin paket sistemidir. nuget.org reyestrində `Newtonsoft.Json`, `Serilog`, Entity Framework Core kimi minlərlə kitabxana var. Paketləri `dotnet` CLI, Visual Studio və ya JetBrains Rider vasitəsilə əlavə edirsiniz.",
      "NuGet is the package system of the .NET ecosystem. The nuget.org registry hosts thousands of libraries such as `Newtonsoft.Json`, `Serilog` and Entity Framework Core. You add packages through the `dotnet` CLI, Visual Studio or JetBrains Rider.",
    ),
    how: l(
      "`dotnet add package` paketi layihə faylına (`.csproj`) `<PackageReference>` kimi yazır; `dotnet restore` (build zamanı avtomatik) paketləri endirir. Öz paketinizi `dotnet pack` ilə `.nupkg` faylına çevirib nuget.org-dan aldığınız API açarı ilə `dotnet nuget push` edirsiniz. API açarını heç vaxt repozitoriyaya yazmayın.",
      "`dotnet add package` writes a `<PackageReference>` into the project file (`.csproj`); `dotnet restore` (automatic during build) downloads the packages. You turn your own library into a `.nupkg` with `dotnet pack` and upload it with `dotnet nuget push` using an API key from nuget.org. Never commit that API key.",
    ),
    examples: [
      ex(
        code("dotnet new console -n HelloNuGet", "cd HelloNuGet", "dotnet add package Newtonsoft.Json", "dotnet run"),
        l("Konsol layihəsi yaradır, `Newtonsoft.Json` paketini əlavə edir və tətbiqi işə salır.", "Creates a console project, adds the `Newtonsoft.Json` package and runs the app."),
      ),
      ex(
        code("<ItemGroup>", "  <PackageReference Include=\"Newtonsoft.Json\" Version=\"13.0.3\" />", "</ItemGroup>"),
        l("`dotnet add package`-in `.csproj` faylına əlavə etdiyi sətir.", "The line `dotnet add package` adds to the `.csproj` file."),
      ),
      ex(
        code("dotnet pack -c Release", "dotnet nuget push bin/Release/MyLib.1.0.0.nupkg --api-key $NUGET_API_KEY --source https://api.nuget.org/v3/index.json"),
        l("Kitabxananı paketləyir və açarı mühit dəyişənindən (environment variable) götürərək nuget.org-a yükləyir.", "Packs the library and uploads it to nuget.org, taking the key from an environment variable."),
      ),
    ],
    mistakes: [
      l("`bin/` və `obj/` qovluqlarını commit etmək — onlar build nəticələridir və `.gitignore`-da olmalıdır.", "Committing the `bin/` and `obj/` folders — they are build output and belong in `.gitignore`."),
    ],
    exercise: l(
      "Yeni konsol layihəsi yaradın, `Humanizer` paketini əlavə edin, `.csproj` faylında `PackageReference` sətrini tapın və paketdən bir metodu çağırın.",
      "Create a new console project, add the `Humanizer` package, find the `PackageReference` line in the `.csproj` and call one of the package's methods.",
    ),
    quiz: [
      q(
        l("NuGet paketi layihəyə hansı əmrlə əlavə olunur?", "Which command adds a NuGet package to a project?"),
        ["dotnet add package", "npm install", "pip install"],
        0,
        l("Əmr `.csproj`-a `PackageReference` yazır.", "The command writes a `PackageReference` into the `.csproj`."),
      ),
      q(
        l("NuGet paket faylının uzantısı nədir?", "What is the file extension of a NuGet package?"),
        [".nupkg", ".jar", ".whl"],
        0,
        l("`.jar` Java, `.whl` isə Python paket formatıdır.", "`.jar` is a Java format and `.whl` a Python one."),
      ),
    ],
    docs: [doc("NuGet documentation", "https://learn.microsoft.com/en-us/nuget/"), doc("dotnet add package", "https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-add-package")],
  },
  {
    id: "docker-hub",
    group: "platforms",
    title: t4("Docker Hub", "Docker Hub", "Docker Hub", "Docker Hub"),
    summary: l("Docker Hub konteyner obrazlarının (images) ən böyük ictimai reyestridir.", "Docker Hub is the largest public registry of container images."),
    what: l(
      "Docker tətbiqi bütün asılılıqları ilə birlikdə konteyner obrazına (image) yığır ki, o, hər yerdə eyni cür işləsin. Docker Hub bu obrazları saxlayan və paylaşan reyestrdir: `nginx`, `postgres`, `node`, `python` kimi rəsmi obrazlar və istifadəçilərin öz obrazları buradadır.",
      "Docker packages an application with all its dependencies into a container image so it runs the same everywhere. Docker Hub is the registry that stores and shares these images: official images such as `nginx`, `postgres`, `node` and `python`, as well as users' own images.",
    ),
    how: l(
      "Obraz adı `istifadəçi/ad:tag` formasındadır (rəsmi obrazlarda istifadəçi hissəsi yoxdur). `docker pull` obrazı endirir, `docker run` ondan konteyner işə salır. Öz obrazınızı `Dockerfile` ilə `docker build` edir, `docker login`-dən sonra `docker push` ilə Docker Hub-a göndərirsiniz. `latest` tag-ı “ən yeni” demək deyil, sadəcə standart addır — istehsalda dəqiq versiya tag-ı istifadə edin.",
      "An image name has the form `user/name:tag` (official images have no user part). `docker pull` downloads an image and `docker run` starts a container from it. You build your own image from a `Dockerfile` with `docker build` and, after `docker login`, upload it with `docker push`. The `latest` tag does not mean “newest”, it is just the default name — use an explicit version tag in production.",
    ),
    examples: [
      ex(
        code("docker pull nginx:1.27", "docker run -d -p 8080:80 --name web nginx:1.27"),
        l("Rəsmi `nginx` obrazını endirir və konteynerin 80-ci portunu kompüterinizin 8080-ci portuna bağlayaraq fonda işə salır.", "Downloads the official `nginx` image and runs it in the background, mapping container port 80 to port 8080 on your machine."),
      ),
      ex(
        code("FROM node:20-alpine", "WORKDIR /app", "COPY package*.json ./", "RUN npm ci", "COPY . .", "CMD [\"node\", \"server.js\"]"),
        l("Node.js tətbiqi üçün sadə `Dockerfile`: əvvəlcə asılılıqlar, sonra kod kopyalanır ki, keş (cache) səmərəli işləsin.", "A simple `Dockerfile` for a Node.js app: dependencies are copied before the code so the build cache works well."),
      ),
      ex(code("docker build -t USER/my-app:1.0 .", "docker login", "docker push USER/my-app:1.0"), l("Obrazı build edir, Docker Hub-a daxil olur və obrazı göndərir.", "Builds the image, logs in to Docker Hub and pushes the image.")),
    ],
    mistakes: [
      l("Obraza `.env` faylını və ya parolları kopyalamaq — açıq obrazı hər kəs endirib görə bilər. `.dockerignore` istifadə edin.", "Copying `.env` files or passwords into the image — anyone can pull a public image and read them. Use `.dockerignore`."),
      l("İstehsalda `latest` tag-ına güvənmək.", "Relying on the `latest` tag in production."),
    ],
    exercise: l(
      "Docker Desktop quraşdırın, `docker run -d -p 8080:80 nginx:1.27` icra edib brauzerdə `http://localhost:8080` açın, sonra `docker ps` və `docker stop` ilə konteyneri dayandırın.",
      "Install Docker Desktop, run `docker run -d -p 8080:80 nginx:1.27`, open `http://localhost:8080` in a browser, then stop the container using `docker ps` and `docker stop`.",
    ),
    quiz: [
      q(
        l("`-p 8080:80` nə deməkdir?", "What does `-p 8080:80` mean?"),
        [
          l("Kompüterin 8080 portu konteynerin 80 portuna yönləndirilir", "Host port 8080 is forwarded to container port 80"),
          l("Konteyner 8080 saniyə işləyir", "The container runs for 8080 seconds"),
          l("80 nüsxə konteyner yaradılır", "80 copies of the container are created"),
        ],
        0,
        l("Format `host:konteyner`-dir.", "The format is `host:container`."),
      ),
      q(
        l("`latest` tag-ı haqqında hansı fikir doğrudur?", "Which statement about the `latest` tag is true?"),
        [l("Bu, sadəcə standart tag adıdır, ən yeni versiyaya zəmanət vermir", "It is just the default tag name and does not guarantee the newest version"), l("Həmişə ən yeni stabil versiyadır", "It is always the newest stable version"), l("Docker Hub-da qadağandır", "It is forbidden on Docker Hub")],
        0,
        l("Təkrarlana bilən deploy üçün dəqiq versiya tag-ı istifadə edin.", "Use explicit version tags for reproducible deployments."),
      ),
    ],
    docs: [doc("Docker Hub documentation", "https://docs.docker.com/docker-hub/"), doc("Dockerfile reference", "https://docs.docker.com/reference/dockerfile/")],
  },
  {
    id: "hugging-face",
    group: "platforms",
    title: t4("Hugging Face", "Hugging Face", "Hugging Face", "Hugging Face"),
    summary: l("Hugging Face Hub süni intellekt modelləri, dataset-lər və demolar üçün platformadır.", "The Hugging Face Hub is a platform for AI models, datasets and demos."),
    what: l(
      "Hugging Face Hub maşın öyrənməsi (machine learning) üçün “GitHub” kimidir: yüz minlərlə hazır model (mətn, şəkil, səs), dataset və Spaces adlanan interaktiv demolar burada paylaşılır. Hər model və dataset əslində Git repozitoriyasıdır; böyük fayllar Git LFS (və ya Xet) ilə saxlanılır. `transformers` kimi kitabxanalar modelləri birbaşa Hub-dan yükləyir.",
      "The Hugging Face Hub is like GitHub for machine learning: hundreds of thousands of ready-made models (text, image, audio), datasets and interactive demos called Spaces are shared there. Every model and dataset is actually a Git repository; large files are stored with Git LFS (or Xet). Libraries such as `transformers` load models directly from the Hub.",
    ),
    how: l(
      "Modeli kodda adı ilə (`təşkilat/model`) çağırırsınız — kitabxana onu ilk dəfə endirib lokal keşdə saxlayır. Model kartı (model card, yəni README) modelin nə üçün nəzərdə tutulduğunu, məhdudiyyətlərini və lisenziyasını izah edir — istifadə etməzdən əvvəl oxuyun. Öz modelinizi və ya dataset-inizi yükləmək üçün hesab və giriş tokeni (access token) lazımdır.",
      "In code you refer to a model by name (`org/model`) — the library downloads it the first time and caches it locally. The model card (the README) explains the intended use, limitations and license — read it before use. Uploading your own model or dataset requires an account and an access token.",
    ),
    examples: [
      ex(
        code(
          "# pip install transformers torch",
          "from transformers import pipeline",
          "",
          "classifier = pipeline(\"sentiment-analysis\", model=\"distilbert/distilbert-base-uncased-finetuned-sst-2-english\")",
          "print(classifier(\"I love learning Git!\"))",
        ),
        l("Hub-dan hissiyyat təhlili (sentiment analysis) modelini endirib bir cümləni təsnif edir.", "Downloads a sentiment-analysis model from the Hub and classifies one sentence."),
        "python",
      ),
      ex(
        code("git lfs install", "git clone https://huggingface.co/distilbert/distilbert-base-uncased-finetuned-sst-2-english"),
        l("Model repozitoriyasını adi Git kimi klonlayır; böyük model faylları Git LFS ilə gəlir.", "Clones a model repository with plain Git; the large model files come through Git LFS."),
      ),
    ],
    mistakes: [
      l("Model kartını və lisenziyanı oxumadan modeli kommersiya layihəsində istifadə etmək.", "Using a model in a commercial project without reading its model card and license."),
      l("Giriş tokenini koda və ya notebook-a yazıb paylaşmaq.", "Writing the access token into code or a notebook and sharing it."),
    ],
    exercise: l(
      "huggingface.co saytında bir mətn təsnifatı modeli tapın, onun model kartını oxuyun (lisenziya, məhdudiyyətlər) və yuxarıdakı `pipeline` nümunəsi ilə öz cümlənizi sınayın.",
      "Find a text-classification model on huggingface.co, read its model card (license, limitations) and try your own sentence with the `pipeline` example above.",
    ),
    quiz: [
      q(
        l("Hugging Face Hub-da hər model əslində nədir?", "What is each model on the Hugging Face Hub, technically?"),
        [l("Git repozitoriyası", "A Git repository"), l("Docker obrazı", "A Docker image"), l("npm paketi", "An npm package")],
        0,
        l("Ona görə də modeli `git clone` ilə də endirmək olar.", "That is why a model can also be downloaded with `git clone`."),
      ),
      q(
        l("Modelin məqsədi, məhdudiyyətləri və lisenziyası harada yazılır?", "Where are a model's intended use, limitations and license described?"),
        [l("Model kartında (README)", "In the model card (README)"), l("`.gitignore`-da", "In `.gitignore`"), l("Heç yerdə", "Nowhere")],
        0,
        l("Model kartını oxumaq məsuliyyətli istifadənin ilk addımıdır.", "Reading the model card is the first step of responsible use."),
      ),
    ],
    docs: [
      doc("Hugging Face Hub documentation", "https://huggingface.co/docs/hub/index"),
      doc("Hugging Face Hub: Model Cards", "https://huggingface.co/docs/hub/model-cards"),
      doc("Transformers: Pipelines", "https://huggingface.co/docs/transformers/main_classes/pipelines"),
    ],
  },
];

export const GIT_TOPICS: GitTopic[] = [...GIT, ...GITHUB, ...PLATFORMS];

export function findGitTopic(id: string): GitTopic | undefined {
  return GIT_TOPICS.find((t) => t.id === id);
}

export const gitProgressId = (topicId: string) => `git:${topicId}`;
