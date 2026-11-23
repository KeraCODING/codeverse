import type { FieldInfo, L } from "../types";

// Development fields. Names in all four languages; descriptions az + en.
// Roadmaps are written for some fields only; the rest show "not written yet".
const n = (az: string, en: string, tr: string, ru: string): L => ({ az, en, tr, ru });
const d = (az: string, en: string): L => ({ az, en });

export const FIELDS: FieldInfo[] = [
  {
    id: "frontend", name: n("Frontend inkişafı", "Frontend Development", "Frontend Geliştirme", "Frontend-разработка"),
    desc: d("İstifadəçinin brauzerdə gördüyü və toxunduğu hissəni qurmaq: səhifə quruluşu, dizayn, interaktivlik.", "Building what users see and interact with in the browser: structure, design and interactivity."),
    languages: ["html", "css", "javascript", "typescript"], technologies: ["react", "nextjs", "vue", "angular", "svelte", "tailwind", "bootstrap"],
    roadmap: [
      d("HTML: semantik teqlər, formalar, əlçatanlıq əsasları", "HTML: semantic tags, forms, accessibility basics"),
      d("CSS: qutu modeli, Flexbox, Grid, responsiv dizayn", "CSS: box model, Flexbox, Grid, responsive design"),
      d("JavaScript: dəyişənlər, funksiyalar, DOM, hadisələr, asinxron kod", "JavaScript: variables, functions, DOM, events, async code"),
      d("Git və GitHub ilə versiya nəzarəti", "Version control with Git and GitHub"),
      d("TypeScript əsasları", "TypeScript basics"),
      d("Bir freymvork: React, Vue və ya Angular", "One framework: React, Vue or Angular"),
      d("API-lərlə işləmək (fetch, JSON)", "Working with APIs (fetch, JSON)"),
      d("Test, performans və yerləşdirmə (deploy)", "Testing, performance and deployment"),
    ],
  },
  {
    id: "backend", name: n("Backend inkişafı", "Backend Development", "Backend Geliştirme", "Backend-разработка"),
    desc: d("Serverdə işləyən məntiq: verilənlər bazası, API-lər, autentifikasiya, biznes qaydaları.", "Server-side logic: databases, APIs, authentication and business rules."),
    languages: ["python", "javascript", "typescript", "java", "csharp", "go", "php", "ruby"], technologies: ["nodejs", "express", "nestjs", "django", "flask", "fastapi", "laravel", "springboot", "aspnetcore", "postgresql", "redis"],
    roadmap: [
      d("Bir backend dili seçmək və əsaslarını öyrənmək", "Pick one backend language and learn its basics"),
      d("HTTP, REST və JSON necə işləyir", "How HTTP, REST and JSON work"),
      d("SQL və relyasion verilənlər bazaları", "SQL and relational databases"),
      d("Bir veb freymvork (məs. Django, Express, ASP.NET Core)", "One web framework (e.g. Django, Express, ASP.NET Core)"),
      d("Autentifikasiya, avtorizasiya və təhlükəsizlik əsasları (OWASP)", "Authentication, authorisation and security basics (OWASP)"),
      d("Test yazmaq", "Writing tests"),
      d("Keşləmə, növbələr və performans", "Caching, queues and performance"),
      d("Docker ilə yerləşdirmə", "Deployment with Docker"),
    ],
  },
  { id: "fullstack", name: n("Full Stack inkişafı", "Full Stack Development", "Full Stack Geliştirme", "Full Stack-разработка"), desc: d("Həm frontend, həm backend hissələrini birlikdə qurmaq.", "Building both the frontend and the backend of an application."), languages: ["javascript", "typescript", "python", "sql"], technologies: ["react", "nextjs", "nodejs", "postgresql", "docker"] },
  { id: "software-dev", name: n("Proqram təminatının inkişafı", "Software Development", "Yazılım Geliştirme", "Разработка ПО"), desc: d("Proqram təminatının yazılması, test edilməsi və saxlanılmasının ümumi prosesi.", "The overall process of writing, testing and maintaining software."), languages: ["python", "java", "csharp", "cpp"], technologies: ["git", "github"] },
  { id: "software-eng", name: n("Proqram mühəndisliyi", "Software Engineering", "Yazılım Mühendisliği", "Программная инженерия"), desc: d("Proqram təminatına mühəndislik yanaşması: tələblər, dizayn, keyfiyyət, komanda prosesləri.", "An engineering approach to software: requirements, design, quality and team processes."), languages: ["java", "csharp", "python", "typescript"], technologies: ["git", "github", "docker"] },
  { id: "architecture", name: n("Proqram arxitekturası", "Software Architecture", "Yazılım Mimarisi", "Архитектура ПО"), desc: d("Sistemin böyük hissələrinin necə bölündüyü və bir-biri ilə necə əlaqə saxladığı.", "How a system is divided into major parts and how they communicate."), languages: ["java", "csharp", "go", "typescript"], technologies: ["docker", "kubernetes", "redis"] },
  { id: "web", name: n("Veb inkişafı", "Web Development", "Web Geliştirme", "Веб-разработка"), desc: d("Veb saytlar və veb tətbiqlər yaratmaq.", "Creating websites and web applications."), languages: ["html", "css", "javascript", "php"], technologies: ["react", "nodejs", "laravel", "django"] },
  { id: "mobile", name: n("Mobil inkişaf", "Mobile Development", "Mobil Geliştirme", "Мобильная разработка"), desc: d("Android və iOS üçün tətbiqlər yaratmaq.", "Building apps for Android and iOS."), languages: ["kotlin", "swift", "dart", "javascript"], technologies: ["flutter", "reactnative", "swiftui", "compose"] },
  { id: "desktop", name: n("Masaüstü inkişaf", "Desktop Development", "Masaüstü Geliştirme", "Разработка настольных приложений"), desc: d("Windows, macOS və Linux üçün masaüstü proqramlar yaratmaq.", "Building desktop applications for Windows, macOS and Linux."), languages: ["csharp", "rust", "cpp", "javascript"], technologies: ["tauri", "electron", "wpf", "maui"] },
  { id: "gamedev", name: n("Oyun inkişafı", "Game Development", "Oyun Geliştirme", "Разработка игр"), desc: d("Oyun mühərrikləri ilə 2D və 3D oyunlar yaratmaq.", "Making 2D and 3D games with game engines."), languages: ["csharp", "cpp", "lua"], technologies: ["unity", "unreal", "godot"] },
  { id: "ai", name: n("Süni intellekt", "Artificial Intelligence", "Yapay Zekâ", "Искусственный интеллект"), desc: d("Kompüterlərə öyrənmə, mühakimə və qərarvermə qabiliyyəti verən sistemlər.", "Systems that give computers the ability to learn, reason and decide."), languages: ["python", "cpp", "julia"], technologies: ["pytorch", "tensorflow", "sklearn"] },
  { id: "ml", name: n("Maşın öyrənməsi", "Machine Learning", "Makine Öğrenmesi", "Машинное обучение"), desc: d("Verilənlərdən qanunauyğunluqları öyrənən modellər qurmaq.", "Building models that learn patterns from data."), languages: ["python", "r", "julia"], technologies: ["sklearn", "pandas", "numpy", "pytorch"] },
  { id: "dl", name: n("Dərin öyrənmə", "Deep Learning", "Derin Öğrenme", "Глубокое обучение"), desc: d("Çoxqatlı neyron şəbəkələri ilə öyrənmə.", "Learning with multi-layer neural networks."), languages: ["python"], technologies: ["pytorch", "tensorflow"] },
  { id: "datascience", name: n("Verilənlər elmi", "Data Science", "Veri Bilimi", "Наука о данных"), desc: d("Verilənləri toplamaq, təmizləmək, təhlil etmək və nəticə çıxarmaq.", "Collecting, cleaning and analysing data to draw conclusions."), languages: ["python", "r", "sql"], technologies: ["pandas", "numpy", "sklearn"] },
  { id: "dataeng", name: n("Verilənlər mühəndisliyi", "Data Engineering", "Veri Mühendisliği", "Инженерия данных"), desc: d("Verilənləri daşıyan və emal edən etibarlı sistemlər (pipeline) qurmaq.", "Building reliable pipelines that move and process data."), languages: ["python", "sql", "scala"], technologies: ["postgresql", "docker"] },
  { id: "dbeng", name: n("Verilənlər bazası mühəndisliyi", "Database Engineering", "Veritabanı Mühendisliği", "Инженерия баз данных"), desc: d("Verilənlər bazalarının dizaynı, performansı və etibarlılığı.", "Designing databases and keeping them fast and reliable."), languages: ["sql"], technologies: ["postgresql", "mysql", "sqlite", "mongodb", "redis"] },
  { id: "api", name: n("API inkişafı", "API Development", "API Geliştirme", "Разработка API"), desc: d("Proqramların bir-biri ilə danışdığı interfeyslər yaratmaq.", "Creating interfaces through which programs talk to each other."), languages: ["python", "javascript", "go", "csharp"], technologies: ["fastapi", "express", "aspnetcore", "nestjs"] },
  { id: "cloud", name: n("Bulud hesablamaları", "Cloud Computing", "Bulut Bilişim", "Облачные вычисления"), desc: d("Server, yaddaş və xidmətləri internet üzərindən istifadə etmək və idarə etmək.", "Using and managing servers, storage and services over the internet."), languages: ["python", "go", "bash"], technologies: ["docker", "kubernetes", "supabase", "firebase"] },
  { id: "devops", name: n("DevOps", "DevOps", "DevOps", "DevOps"), desc: d("Proqramın qurulması, test edilməsi və yerləşdirilməsini avtomatlaşdıran təcrübələr.", "Practices that automate building, testing and deploying software."), languages: ["bash", "python", "go", "powershell"], technologies: ["docker", "kubernetes", "git", "github", "gitlab"] },
  { id: "cybersecurity", name: n("Kibertəhlükəsizlik", "Cybersecurity", "Siber Güvenlik", "Кибербезопасность"), desc: d("Sistemləri, şəbəkələri və məlumatları hücumlardan qorumaq.", "Protecting systems, networks and data from attacks."), languages: ["python", "bash", "c", "powershell"], technologies: ["docker", "git"] },
  { id: "defensive", name: n("Müdafiə təhlükəsizliyi", "Defensive Security", "Savunma Güvenliği", "Защитная безопасность"), desc: d("Sistemlərin sərtləşdirilməsi, monitorinq, jurnal təhlili və insidentlərə cavab.", "Hardening systems, monitoring, log analysis and incident response."), languages: ["bash", "powershell", "python"], technologies: [] },
  { id: "embedded", name: n("Daxili sistemlər", "Embedded Systems", "Gömülü Sistemler", "Встраиваемые системы"), desc: d("Cihazların içində işləyən, məhdud resurslu proqramlar.", "Software running inside devices with limited resources."), languages: ["c", "cpp", "rust", "assembly"], technologies: [] },
  { id: "robotics", name: n("Robototexnika", "Robotics", "Robotik", "Робототехника"), desc: d("Sensorları və mühərrikləri idarə edən proqramlar.", "Software that controls sensors and motors."), languages: ["cpp", "python", "c"], technologies: ["opencv"] },
  { id: "blockchain", name: n("Blokçeyn inkişafı", "Blockchain Development", "Blokzincir Geliştirme", "Блокчейн-разработка"), desc: d("Paylanmış reyestrlər və ağıllı müqavilələr yaratmaq.", "Building distributed ledgers and smart contracts."), languages: ["solidity", "rust", "go", "javascript"], technologies: [] },
  { id: "os", name: n("Əməliyyat sistemləri", "Operating Systems", "İşletim Sistemleri", "Операционные системы"), desc: d("Proseslər, yaddaş, fayl sistemləri və nüvə necə işləyir.", "How processes, memory, file systems and kernels work."), languages: ["c", "rust", "assembly"], technologies: [] },
  { id: "networking", name: n("Kompüter şəbəkələri", "Computer Networking", "Bilgisayar Ağları", "Компьютерные сети"), desc: d("Kompüterlərin məlumat mübadiləsi: IP, TCP/UDP, DNS, HTTP.", "How computers exchange data: IP, TCP/UDP, DNS, HTTP."), languages: ["python", "c", "go"], technologies: [] },
  { id: "graphics", name: n("Kompüter qrafikası", "Computer Graphics", "Bilgisayar Grafikleri", "Компьютерная графика"), desc: d("Ekranda 2D və 3D təsvirlərin yaradılması və renderinqi.", "Creating and rendering 2D and 3D images on screen."), languages: ["cpp", "c", "rust"], technologies: ["unreal", "godot", "opencv"] },
];
