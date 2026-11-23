import type { L } from "./types";

// Learning paths for the personal roadmap. A step is either a lesson in the app (completed
// automatically when its knowledge check is passed), an app section to work through, or an
// outside goal the learner ticks off. Titles in 4 languages; step texts az + en.

export type PathStep =
  | { id: string; kind: "lesson"; ref: string }
  | { id: string; kind: "module"; ref: string; text: L }
  | { id: string; kind: "goal"; text: L };

export interface LearningPath {
  id: string;
  field: string; // FIELDS id
  title: L;
  steps: PathStep[];
}

const T = (az: string, en: string, tr: string, ru: string): L => ({ az, en, tr, ru });
const g = (id: string, az: string, en: string): PathStep => ({ id, kind: "goal", text: { az, en } });
const m = (id: string, ref: string, az: string, en: string): PathStep => ({ id, kind: "module", ref, text: { az, en } });
const l = (ref: string): PathStep => ({ id: `l-${ref}`, kind: "lesson", ref });

const JS = [l("javascript-variables"), l("javascript-conditions"), l("javascript-functions"), l("javascript-arrays")];
const PY = [l("python-variables"), l("python-conditions"), l("python-loops"), l("python-lists"), l("python-functions")];
const GIT = m("git", "git", "Git və GitHub əsasları: commit, branch, pull request", "Git and GitHub basics: commit, branch, pull request");
const GITVIZ = m("gitviz", "gitviz", "Git vizualizatorunda branch və merge ssenarilərini tamamla", "Complete the branch and merge scenarios in the Git Visualizer");
const CHAL = m("challenges", "interactive/challenges", "Ən azı 5 çağırışı həll et", "Solve at least 5 challenges");
const DEBUG = m("debug", "interactive/debug", "\"Xəta tap\" tapşırıqlarını tamamla", "Finish the Debug tasks");

export const PATHS: LearningPath[] = [
  {
    id: "frontend", field: "frontend", title: T("Frontend developer", "Frontend Developer", "Frontend Geliştirici", "Frontend-разработчик"),
    steps: [
      g("html", "HTML: semantik teqlər, formalar, əlçatanlıq", "HTML: semantic tags, forms, accessibility"),
      g("css", "CSS: qutu modeli, Flexbox, Grid, responsiv dizayn", "CSS: box model, Flexbox, Grid, responsive design"),
      ...JS, CHAL, GIT,
      m("frameworks", "frameworks/react", "Bir freymvork seç və öyrən (məs. React)", "Pick and learn one framework (e.g. React)"),
      g("portfolio", "Şəxsi portfolio saytı qur və yayımla", "Build and publish a personal portfolio site"),
    ],
  },
  {
    id: "backend", field: "backend", title: T("Backend developer", "Backend Developer", "Backend Geliştirici", "Backend-разработчик"),
    steps: [
      ...PY, l("sql-select"),
      m("http", "visual", "HTTP sorğusu və klient-server modelini vizual öyrən", "Study HTTP requests and the client–server model visually"),
      GIT,
      m("sql-chal", "interactive/challenges", "SQL çağırışlarını (JOIN daxil) həll et", "Solve the SQL challenges (including JOIN)"),
      g("framework", "Bir veb freymvork öyrən (Django, FastAPI və ya Express)", "Learn one web framework (Django, FastAPI or Express)"),
      g("api", "Autentifikasiyalı kiçik REST API qur", "Build a small REST API with authentication"),
    ],
  },
  {
    id: "fullstack", field: "fullstack", title: T("Full Stack developer", "Full Stack Developer", "Full Stack Geliştirici", "Full Stack-разработчик"),
    steps: [...JS, l("sql-select"), GIT, CHAL, g("frontend-fw", "Frontend freymvorku (React və ya Vue)", "A frontend framework (React or Vue)"), g("backend-fw", "Node.js ilə API (Express və ya NestJS)", "An API with Node.js (Express or NestJS)"), g("deploy", "Tam tətbiqi yerləşdir (deploy)", "Deploy a complete application")],
  },
  {
    id: "software-engineer", field: "software-eng", title: T("Proqram mühəndisi", "Software Engineer", "Yazılım Mühendisi", "Программный инженер"),
    steps: [...PY, ...JS.slice(0, 2), m("compare", "compare", "Dillərin müqayisəsində tipləri və yaddaş idarəetməsini öyrən", "Study typing and memory management in Language Comparison"), m("algorithms", "visual", "Alqoritmlər və məlumat strukturlarını vizual öyrən", "Study algorithms and data structures visually"), DEBUG, GIT, g("tests", "Öz kodun üçün testlər yazmağı öyrən", "Learn to write tests for your code")],
  },
  {
    id: "mobile", field: "mobile", title: T("Mobil developer", "Mobile Developer", "Mobil Geliştirici", "Мобильный разработчик"),
    steps: [...JS, GIT, m("mobile-fw", "fields/mobile", "Platforma seç: Flutter, React Native, Kotlin və ya Swift", "Choose a platform: Flutter, React Native, Kotlin or Swift"), g("ui", "Mobil interfeys və naviqasiya əsasları", "Mobile UI and navigation basics"), g("app", "Kiçik mobil tətbiq qur (məs. tapşırıq siyahısı)", "Build a small mobile app (e.g. a to-do list)")],
  },
  {
    id: "desktop", field: "desktop", title: T("Masaüstü developer", "Desktop Developer", "Masaüstü Geliştirici", "Разработчик настольных приложений"),
    steps: [...JS, GIT, m("desktop-fw", "fields/desktop", "Texnologiya seç: Tauri, Electron, WPF və ya .NET MAUI", "Choose a technology: Tauri, Electron, WPF or .NET MAUI"), g("files", "Fayllar və yerli verilənlər bazası ilə işləmək", "Working with files and a local database"), g("installer", "Quraşdırıcı (installer) hazırla", "Produce an installer")],
  },
  {
    id: "game", field: "gamedev", title: T("Oyun developeri", "Game Developer", "Oyun Geliştirici", "Разработчик игр"),
    steps: [l("python-loops"), l("python-conditions"), m("csharp", "languages/csharp", "C# dilini öyrən (Unity üçün)", "Learn C# (for Unity)"), m("engine", "frameworks/unity", "Oyun mühərriki seç: Unity, Godot və ya Unreal", "Choose an engine: Unity, Godot or Unreal"), g("loop", "Oyun dövrü, fizika və toqquşmalar", "Game loop, physics and collisions"), g("game", "Kiçik 2D oyun hazırla", "Make a small 2D game")],
  },
  {
    id: "ai", field: "ai", title: T("Süni intellekt mühəndisi", "AI Engineer", "Yapay Zekâ Mühendisi", "Инженер ИИ"),
    steps: [...PY, m("numpy", "frameworks/numpy", "NumPy və pandas ilə verilənlər", "Data with NumPy and pandas"), g("math", "Xətti cəbr, ehtimal və statistika əsasları", "Basics of linear algebra, probability and statistics"), m("ml", "frameworks/sklearn", "scikit-learn ilə ilk modellər", "First models with scikit-learn"), m("dl", "frameworks/pytorch", "PyTorch ilə dərin öyrənmə əsasları", "Deep learning basics with PyTorch"), g("ai-project", "Kiçik AI layihəsi qur və nəticəni qiymətləndir", "Build a small AI project and evaluate it")],
  },
  {
    id: "data", field: "datascience", title: T("Verilənlər alimi", "Data Scientist", "Veri Bilimci", "Специалист по данным"),
    steps: [...PY, l("sql-select"), m("sql-chal", "interactive/challenges", "SQL çağırışlarını həll et", "Solve the SQL challenges"), m("pandas", "frameworks/pandas", "pandas ilə verilənləri təmizlə və təhlil et", "Clean and analyse data with pandas"), g("stats", "Təsviri statistika və vizuallaşdırma", "Descriptive statistics and visualisation"), g("report", "Real verilənlər üzrə hesabat hazırla", "Write a report on a real dataset")],
  },
  {
    id: "security", field: "cybersecurity", title: T("Kibertəhlükəsizlik mütəxəssisi", "Cybersecurity Specialist", "Siber Güvenlik Uzmanı", "Специалист по кибербезопасности"),
    steps: [m("sec-fund", "security", "Təhlükəsizlik əsasları: CIA, autentifikasiya, şifrələmə", "Security fundamentals: CIA, authentication, encryption"), m("linux", "security", "Linux əsasları: fayl sistemi, icazələr, proseslər", "Linux basics: file system, permissions, processes"), m("net", "security", "Şəbəkə əsasları: IP, DNS, TCP/UDP, HTTP/TLS", "Networking basics: IP, DNS, TCP/UDP, HTTP/TLS"), ...PY.slice(0, 3), m("websec", "security", "Veb təhlükəsizliyi və OWASP Top 10", "Web security and the OWASP Top 10"), m("defense", "security", "Müdafiə təhlükəsizliyi: sərtləşdirmə, jurnalların təhlili", "Defensive security: hardening, log analysis"), g("lab", "Yalnız öz təhlükəsiz laboratoriyanda məşq et", "Practise only in your own safe lab")],
  },
  {
    id: "devops", field: "devops", title: T("DevOps mühəndisi", "DevOps Engineer", "DevOps Mühendisi", "DevOps-инженер"),
    steps: [m("linux", "security", "Linux və terminal əsasları", "Linux and terminal basics"), g("bash", "Bash skriptləri yazmaq", "Writing Bash scripts"), GIT, GITVIZ, ...PY.slice(0, 2), m("docker", "frameworks/docker", "Docker: konteynerlər və image-lər", "Docker: containers and images"), g("ci", "CI/CD: GitHub Actions ilə avtomatik test və yerləşdirmə", "CI/CD: automatic tests and deployment with GitHub Actions"), m("k8s", "frameworks/kubernetes", "Kubernetes əsasları", "Kubernetes basics")],
  },
  {
    id: "database", field: "dbeng", title: T("Verilənlər bazası mühəndisi", "Database Engineer", "Veritabanı Mühendisi", "Инженер баз данных"),
    steps: [l("sql-select"), m("sql-chal", "interactive/challenges", "SQL çağırışlarını (GROUP BY, JOIN) həll et", "Solve the SQL challenges (GROUP BY, JOIN)"), m("sql-debug", "interactive/debug", "SQL xəta tapşırıqlarını düzəlt", "Fix the SQL debug tasks"), m("relations", "visual", "Cədvəllər arası əlaqələri vizual öyrən", "Study table relationships visually"), g("design", "Normallaşdırma və sxem dizaynı", "Normalisation and schema design"), g("index", "İndekslər və sorğu performansı", "Indexes and query performance"), m("pg", "frameworks/postgresql", "PostgreSQL ilə işləmək", "Working with PostgreSQL")],
  },
];
