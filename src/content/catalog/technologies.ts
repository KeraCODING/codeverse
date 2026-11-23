import type { TechInfo } from "../types";

// Technology catalog: az + en descriptions, official documentation links.
const t = (id: string, name: string, category: TechInfo["category"], language: string | null, az: string, en: string, url: string): TechInfo => ({
  id, name, category, language, desc: { az, en }, docs: { title: `${name} documentation`, url },
});

export const TECHNOLOGIES: TechInfo[] = [
  // Frontend
  t("react", "React", "frontend", "javascript", "İstifadəçi interfeyslərini komponentlərdən quran JavaScript kitabxanası.", "A JavaScript library for building user interfaces from components.", "https://react.dev/"),
  t("nextjs", "Next.js", "frontend", "javascript", "Server tərəfli renderinq və marşrutlaşdırma əlavə edən React freymvorku.", "A React framework that adds server rendering and routing.", "https://nextjs.org/docs"),
  t("vue", "Vue.js", "frontend", "javascript", "Tədricən tətbiq oluna bilən, reaktiv interfeys freymvorku.", "A progressively adoptable, reactive UI framework.", "https://vuejs.org/guide/introduction.html"),
  t("angular", "Angular", "frontend", "typescript", "Google-un TypeScript əsaslı tam funksiyalı veb freymvorku.", "Google's full-featured, TypeScript-based web framework.", "https://angular.dev/"),
  t("svelte", "Svelte", "frontend", "javascript", "Komponentləri kompilyasiya zamanı səmərəli JavaScript-ə çevirən freymvork.", "A framework that compiles components into efficient JavaScript at build time.", "https://svelte.dev/docs"),
  t("tailwind", "Tailwind CSS", "frontend", "css", "Kiçik köməkçi siniflərdən (utility classes) ibarət CSS freymvorku.", "A CSS framework made of small utility classes.", "https://tailwindcss.com/docs"),
  t("bootstrap", "Bootstrap", "frontend", "css", "Hazır komponentləri və şəbəkə sistemi olan CSS freymvorku.", "A CSS framework with ready-made components and a grid system.", "https://getbootstrap.com/docs/"),
  // Backend
  t("nodejs", "Node.js", "backend", "javascript", "JavaScript-i brauzerdən kənarda, serverdə işlədən mühit.", "A runtime that runs JavaScript outside the browser, on servers.", "https://nodejs.org/docs/latest/api/"),
  t("express", "Express.js", "backend", "javascript", "Node.js üçün minimal veb server freymvorku.", "A minimal web server framework for Node.js.", "https://expressjs.com/"),
  t("nestjs", "NestJS", "backend", "typescript", "Modul quruluşlu, TypeScript əsaslı Node.js backend freymvorku.", "A modular, TypeScript-based Node.js backend framework.", "https://docs.nestjs.com/"),
  t("django", "Django", "backend", "python", "ORM, admin paneli və autentifikasiyası daxil olan Python veb freymvorku.", "A Python web framework with a built-in ORM, admin panel and authentication.", "https://docs.djangoproject.com/"),
  t("flask", "Flask", "backend", "python", "Kiçik və genişlənə bilən Python veb freymvorku.", "A small, extensible Python web framework.", "https://flask.palletsprojects.com/"),
  t("fastapi", "FastAPI", "backend", "python", "Tip annotasiyalarından avtomatik validasiya və sənəd yaradan Python API freymvorku.", "A Python API framework that derives validation and docs from type hints.", "https://fastapi.tiangolo.com/"),
  t("laravel", "Laravel", "backend", "php", "Zəngin alət dəsti olan PHP veb freymvorku.", "A PHP web framework with a rich toolset.", "https://laravel.com/docs"),
  t("symfony", "Symfony", "backend", "php", "Təkrar istifadə olunan komponentlər üzərində qurulmuş PHP freymvorku.", "A PHP framework built on reusable components.", "https://symfony.com/doc/current/index.html"),
  t("springboot", "Spring Boot", "backend", "java", "Spring tətbiqlərini minimal konfiqurasiya ilə işə salan Java freymvorku.", "A Java framework that starts Spring applications with minimal configuration.", "https://spring.io/projects/spring-boot"),
  t("aspnetcore", "ASP.NET Core", "backend", "csharp", "Microsoft-un çoxplatformalı veb və API freymvorku.", "Microsoft's cross-platform web and API framework.", "https://learn.microsoft.com/aspnet/core/"),
  t("rails", "Ruby on Rails", "backend", "ruby", "\"Konfiqurasiya əvəzinə konvensiya\" prinsipli Ruby veb freymvorku.", "A Ruby web framework built on \"convention over configuration\".", "https://guides.rubyonrails.org/"),
  // Mobile
  t("flutter", "Flutter", "mobile", "dart", "Bir kod bazasından mobil, veb və masaüstü tətbiqlər yaradan UI toolkit.", "A UI toolkit for building mobile, web and desktop apps from one codebase.", "https://docs.flutter.dev/"),
  t("reactnative", "React Native", "mobile", "javascript", "React ilə yerli (native) mobil tətbiqlər yaratmaq üçün freymvork.", "A framework for building native mobile apps with React.", "https://reactnative.dev/docs/getting-started"),
  t("swiftui", "SwiftUI", "mobile", "swift", "Apple platformaları üçün deklarativ interfeys freymvorku.", "A declarative UI framework for Apple platforms.", "https://developer.apple.com/documentation/swiftui"),
  t("compose", "Jetpack Compose", "mobile", "kotlin", "Android üçün deklarativ interfeys toolkiti.", "A declarative UI toolkit for Android.", "https://developer.android.com/compose"),
  // Desktop
  t("electron", "Electron", "desktop", "javascript", "Chromium və Node.js ilə masaüstü tətbiqlər yaratmaq üçün freymvork.", "A framework for desktop apps built on Chromium and Node.js.", "https://www.electronjs.org/docs/latest"),
  t("tauri", "Tauri", "desktop", "rust", "Sistemin veb görünüşündən (WebView) istifadə edən yüngül masaüstü freymvork; CODEVERSE də onunla qurulub.", "A lightweight desktop framework that uses the system WebView; CODEVERSE is built with it.", "https://v2.tauri.app/"),
  t("maui", ".NET MAUI", "desktop", "csharp", "Bir kod bazasından Windows, macOS, Android və iOS tətbiqləri yaradan .NET freymvorku.", "A .NET framework for Windows, macOS, Android and iOS apps from one codebase.", "https://learn.microsoft.com/dotnet/maui/"),
  t("wpf", "WPF", "desktop", "csharp", "XAML ilə Windows masaüstü tətbiqləri yaratmaq üçün .NET freymvorku.", "A .NET framework for Windows desktop apps using XAML.", "https://learn.microsoft.com/dotnet/desktop/wpf/"),
  // AI & data
  t("tensorflow", "TensorFlow", "aiData", "python", "Google-un maşın öyrənməsi platforması.", "Google's machine learning platform.", "https://www.tensorflow.org/"),
  t("pytorch", "PyTorch", "aiData", "python", "Dinamik hesablama qrafları ilə dərin öyrənmə freymvorku.", "A deep learning framework with dynamic computation graphs.", "https://pytorch.org/docs/stable/"),
  t("opencv", "OpenCV", "aiData", "cpp", "Kompüter görməsi (computer vision) kitabxanası; Python interfeysi də var.", "A computer vision library, also usable from Python.", "https://docs.opencv.org/"),
  t("sklearn", "scikit-learn", "aiData", "python", "Klassik maşın öyrənməsi alqoritmləri üçün Python kitabxanası.", "A Python library of classic machine learning algorithms.", "https://scikit-learn.org/stable/"),
  t("pandas", "pandas", "aiData", "python", "Cədvəl şəkilli verilənləri təhlil etmək üçün Python kitabxanası.", "A Python library for analysing tabular data.", "https://pandas.pydata.org/docs/"),
  t("numpy", "NumPy", "aiData", "python", "Çoxölçülü massivlər və ədədi hesablamalar üçün Python kitabxanası.", "A Python library for multi-dimensional arrays and numerical computing.", "https://numpy.org/doc/"),
  // Game development
  t("unity", "Unity", "gameDev", "csharp", "C# skriptləri ilə 2D/3D oyun mühərriki.", "A 2D/3D game engine scripted in C#.", "https://docs.unity3d.com/"),
  t("unreal", "Unreal Engine", "gameDev", "cpp", "C++ və Blueprint vizual skriptləri ilə yüksək keyfiyyətli oyun mühərriki.", "A high-end game engine using C++ and Blueprint visual scripting.", "https://dev.epicgames.com/documentation/en-us/unreal-engine"),
  t("godot", "Godot", "gameDev", null, "GDScript və C# dəstəkləyən açıq mənbəli oyun mühərriki.", "An open-source game engine supporting GDScript and C#.", "https://docs.godotengine.org/"),
  // Infrastructure
  t("docker", "Docker", "infra", null, "Tətbiqləri konteynerlərdə paketləyib işlədən platforma.", "A platform for packaging and running applications in containers.", "https://docs.docker.com/"),
  t("kubernetes", "Kubernetes", "infra", null, "Konteynerləri çoxlu serverdə idarə edən orkestrasiya sistemi.", "An orchestration system that manages containers across many servers.", "https://kubernetes.io/docs/"),
  t("git", "Git", "infra", null, "Kod dəyişikliklərinin tarixçəsini saxlayan paylanmış versiya nəzarəti sistemi.", "A distributed version control system that records code history.", "https://git-scm.com/doc"),
  t("github", "GitHub", "infra", null, "Git repozitoriyalarını yerləşdirmək və birgə işləmək üçün platforma.", "A platform for hosting Git repositories and collaborating.", "https://docs.github.com/"),
  t("gitlab", "GitLab", "infra", null, "Git hostinqi, CI/CD və layihə idarəetməsi platforması.", "A platform for Git hosting, CI/CD and project management.", "https://docs.gitlab.com/"),
  t("redis", "Redis", "infra", null, "Yaddaşda işləyən açar-dəyər verilənlər anbarı; keş üçün geniş istifadə olunur.", "An in-memory key-value data store, widely used for caching.", "https://redis.io/docs/latest/"),
  t("postgresql", "PostgreSQL", "infra", "sql", "Güclü açıq mənbəli relyasion verilənlər bazası.", "A powerful open-source relational database.", "https://www.postgresql.org/docs/"),
  t("mysql", "MySQL", "infra", "sql", "Geniş yayılmış açıq mənbəli relyasion verilənlər bazası.", "A widely used open-source relational database.", "https://dev.mysql.com/doc/"),
  t("sqlite", "SQLite", "infra", "sql", "Fayl şəklində işləyən, server tələb etməyən verilənlər bazası; CODEVERSE də ondan istifadə edir.", "A serverless, file-based database; CODEVERSE uses it too.", "https://www.sqlite.org/docs.html"),
  t("mongodb", "MongoDB", "infra", null, "Məlumatı JSON-a bənzər sənədlər kimi saxlayan NoSQL verilənlər bazası.", "A NoSQL database that stores JSON-like documents.", "https://www.mongodb.com/docs/"),
  t("supabase", "Supabase", "infra", "sql", "PostgreSQL üzərində autentifikasiya, real vaxt və saxlama təqdim edən backend platforması.", "A backend platform offering auth, realtime and storage on top of PostgreSQL.", "https://supabase.com/docs"),
  t("firebase", "Firebase", "infra", null, "Google-un autentifikasiya, verilənlər bazası və hostinq xidmətləri platforması.", "Google's platform for auth, databases and hosting.", "https://firebase.google.com/docs"),
];
