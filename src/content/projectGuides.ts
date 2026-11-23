import type { L } from "./types";

// Project-based learning guides. Starting a guide copies its milestones into a personal
// project as tasks. Starter files are small templates shown for copying (no dependencies).

export interface ProjectGuide {
  id: string;
  level: "beginner" | "intermediate" | "advanced";
  title: L;
  description: L;
  tech: string[];
  objectives: L[];
  prerequisites: string[]; // lesson ids
  milestones: L[];
  testing: L[];
  evaluation: L[];
  starter: { name: string; code: string }[];
}

const d = (az: string, en: string): L => ({ az, en });

export const PROJECT_GUIDES: ProjectGuide[] = [
  {
    id: "calculator", level: "beginner", tech: ["JavaScript"],
    title: { az: "Kalkulyator", en: "Calculator", tr: "Hesap makinesi", ru: "Калькулятор" },
    description: d("Dörd əməli yerinə yetirən və səhv girişi düzgün emal edən kalkulyator.", "A calculator for the four operations that handles invalid input correctly."),
    objectives: [d("Funksiyaları parametr və qaytarılan dəyərlə yazmaq", "Write functions with parameters and return values"), d("Şərtlərlə səhv halları (sıfıra bölmə) emal etmək", "Handle error cases (division by zero) with conditions")],
    prerequisites: ["javascript-functions", "javascript-conditions"],
    milestones: [
      d("`add`, `subtract`, `multiply`, `divide` funksiyalarını yaz", "Write `add`, `subtract`, `multiply`, `divide` functions"),
      d("Sıfıra bölmədə aydın xəta mesajı qaytar", "Return a clear error message on division by zero"),
      d("`calculate(a, op, b)` funksiyası ilə əməliyyatı seç", "Choose the operation with a `calculate(a, op, b)` function"),
      d("Ədəd olmayan girişləri `Number.isNaN` ilə yoxla", "Reject non-numeric input with `Number.isNaN`"),
      d("Kod laboratoriyasında bütün halları sına", "Test every case in Code Lab"),
      d("Əlavə: son 5 hesablamanın tarixçəsini saxla", "Extra: keep a history of the last 5 calculations"),
    ],
    testing: [d("`calculate(6, \"/\", 3)` → 2; `calculate(1, \"/\", 0)` → xəta mesajı", "`calculate(6, \"/\", 3)` → 2; `calculate(1, \"/\", 0)` → error message")],
    evaluation: [d("Bütün əməllər düzgün nəticə verir", "All operations give correct results"), d("Səhv giriş proqramı çökdürmür", "Invalid input never crashes the program")],
    starter: [{ name: "calculator.js", code: 'function calculate(a, op, b) {\n  // TODO: + - * /\n}\n\nconsole.log(calculate(6, "/", 3));\n' }],
  },
  {
    id: "todo", level: "beginner", tech: ["JavaScript", "HTML"],
    title: { az: "Tapşırıq siyahısı (To-Do)", en: "To-Do list", tr: "Yapılacaklar listesi", ru: "Список дел" },
    description: d("Tapşırıq əlavə etmək, tamamlamaq, silmək və süzgəcləmək mümkün olan siyahı.", "A list where tasks can be added, completed, deleted and filtered."),
    objectives: [d("Massiv və obyektlərlə məlumat modeli qurmaq", "Model data with arrays and objects"), d("`map`/`filter` ilə siyahını emal etmək", "Process the list with `map`/`filter`")],
    prerequisites: ["javascript-arrays", "javascript-functions"],
    milestones: [
      d("Tapşırıq modelini seç: `{ id, text, done }`", "Choose a task model: `{ id, text, done }`"),
      d("`addTask`, `toggleTask`, `removeTask` funksiyalarını yaz", "Write `addTask`, `toggleTask`, `removeTask`"),
      d("\"Hamısı / Aktiv / Tamamlanmış\" süzgəci əlavə et", "Add an \"All / Active / Done\" filter"),
      d("HTML forma və siyahı ilə interfeys qur", "Build a UI with an HTML form and list"),
      d("Brauzerdə `localStorage` ilə yadda saxla", "Persist in the browser with `localStorage`"),
    ],
    testing: [d("Boş mətnli tapşırıq əlavə olunmur", "Tasks with empty text are not added"), d("Səhifə yenilənəndən sonra tapşırıqlar qalır", "Tasks survive a page reload")],
    evaluation: [d("Bütün əməliyyatlar işləyir və kod funksiyalara bölünüb", "All operations work and the code is split into functions")],
    starter: [{ name: "todo.js", code: 'const tasks = [];\n\nfunction addTask(text) {\n  // TODO\n}\n\naddTask("Learn arrays");\nconsole.log(tasks);\n' }],
  },
  {
    id: "portfolio", level: "beginner", tech: ["HTML", "CSS"],
    title: { az: "Şəxsi portfolio saytı", en: "Personal portfolio", tr: "Kişisel portfolyo", ru: "Личное портфолио" },
    description: d("Özünüz və layihələriniz haqqında responsiv, əlçatan bir səhifəlik sayt.", "A responsive, accessible one-page site about you and your projects."),
    objectives: [d("Semantik HTML və responsiv CSS", "Semantic HTML and responsive CSS"), d("Saytı GitHub Pages ilə yayımlamaq", "Publishing with GitHub Pages")],
    prerequisites: [],
    milestones: [
      d("Bölmələri planla: haqqımda, layihələr, əlaqə", "Plan the sections: about, projects, contact"),
      d("Semantik teqlərlə HTML yaz (`header`, `main`, `section`, `footer`)", "Write HTML with semantic tags (`header`, `main`, `section`, `footer`)"),
      d("Flexbox və ya Grid ilə düzülüş qur", "Build the layout with Flexbox or Grid"),
      d("Mobil ekran üçün media query əlavə et", "Add a media query for mobile screens"),
      d("Şəkillərə `alt` mətni və kifayət qədər rəng kontrastı ver", "Give images `alt` text and ensure enough colour contrast"),
      d("Git ilə repozitoriya yarat və GitHub Pages-də yayımla", "Create a Git repository and publish on GitHub Pages"),
    ],
    testing: [d("375 px enində üfüqi sürüşmə yoxdur", "No horizontal scrolling at 375 px width"), d("Bütün səhifə yalnız klaviatura ilə gəzilə bilir", "The whole page can be navigated with the keyboard only")],
    evaluation: [d("Sayt açıq linklə əlçatandır", "The site is reachable via a public link")],
    starter: [{ name: "index.html", code: '<!doctype html>\n<html lang="az">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>Portfolio</title>\n</head>\n<body>\n  <header><h1>Ad Soyad</h1></header>\n  <main>\n    <section id="about"></section>\n    <section id="projects"></section>\n  </main>\n  <footer></footer>\n</body>\n</html>\n' }],
  },
  {
    id: "quiz", level: "intermediate", tech: ["JavaScript"],
    title: { az: "Test (quiz) tətbiqi", en: "Quiz app", tr: "Test uygulaması", ru: "Приложение-викторина" },
    description: d("Sualları göstərən, cavabları yoxlayan və nəticəni hesablayan tətbiq.", "An app that shows questions, checks answers and computes the score."),
    objectives: [d("Məlumatı kodun məntiqindən ayırmaq", "Separate data from logic"), d("Massivləri qarışdırmaq və nəticə hesablamaq", "Shuffle arrays and compute results")],
    prerequisites: ["javascript-arrays", "javascript-conditions", "javascript-functions"],
    milestones: [
      d("Sualları massivdə saxla: `{ question, options, answer }`", "Store questions in an array: `{ question, options, answer }`"),
      d("Sualları qarışdıran funksiya yaz (Fisher–Yates)", "Write a shuffle function (Fisher–Yates)"),
      d("Cavabı yoxla və balı hesabla", "Check answers and compute the score"),
      d("Nəticədə səhv cavabları izahla göstər", "Show wrong answers with explanations at the end"),
      d("Əlavə: vaxt limiti", "Extra: a time limit"),
    ],
    testing: [d("Bütün sualları düzgün cavablandıranda bal 100%-dir", "Answering everything correctly gives 100%")],
    evaluation: [d("Sual əlavə etmək üçün yalnız məlumat massivi dəyişir", "Adding a question only changes the data array")],
    starter: [{ name: "quiz.js", code: 'const questions = [\n  { question: "2 + 2?", options: ["3", "4"], answer: 1 },\n];\n\nfunction score(answers) {\n  // TODO\n}\n' }],
  },
  {
    id: "sql-report", level: "intermediate", tech: ["SQL"],
    title: { az: "SQL satış hesabatı", en: "SQL sales report", tr: "SQL satış raporu", ru: "SQL-отчёт о продажах" },
    description: d("Məşq bazasındakı `users` və `orders` cədvəllərindən hesabat sorğuları.", "Report queries over the `users` and `orders` tables of the practice database."),
    objectives: [d("`GROUP BY`, `JOIN` və aqreqat funksiyalar", "`GROUP BY`, `JOIN` and aggregate functions")],
    prerequisites: ["sql-select"],
    milestones: [
      d("Hər şəhər üzrə istifadəçi sayı", "User count per city"),
      d("Hər istifadəçinin ümumi xərci (`JOIN` + `SUM`)", "Total spending per user (`JOIN` + `SUM`)"),
      d("Ən çox satılan məhsul", "The best-selling product"),
      d("Heç sifariş verməyən istifadəçilər (`LEFT JOIN` + `IS NULL`)", "Users with no orders (`LEFT JOIN` + `IS NULL`)"),
      d("Nəticələri qısa hesabat kimi yaz", "Write the results up as a short report"),
    ],
    testing: [d("Hər sorğunu Kod laboratoriyasında SQL rejimində işlət", "Run every query in Code Lab's SQL mode")],
    evaluation: [d("Sorğular düzgün nəticə verir və oxunaqlıdır", "Queries return correct results and are readable")],
    starter: [{ name: "report.sql", code: "-- 1. Users per city\nSELECT city, COUNT(*) AS total\nFROM users\nGROUP BY city;\n" }],
  },
  {
    id: "rest-api", level: "advanced", tech: ["Python", "FastAPI"],
    title: { az: "REST API", en: "REST API", tr: "REST API", ru: "REST API" },
    description: d("Qeydlər üçün CRUD əməliyyatları olan, validasiyalı və testli kiçik API.", "A small API with CRUD for notes, with validation and tests."),
    objectives: [d("HTTP metodları və status kodları", "HTTP methods and status codes"), d("Girişin validasiyası və testlər", "Input validation and tests")],
    prerequisites: ["python-functions", "python-lists"],
    milestones: [
      d("Endpoint-ləri planla: `GET/POST /notes`, `GET/PUT/DELETE /notes/{id}`", "Plan endpoints: `GET/POST /notes`, `GET/PUT/DELETE /notes/{id}`"),
      d("FastAPI layihəsi qur və ilk endpoint-i yaz", "Set up a FastAPI project and write the first endpoint"),
      d("Pydantic modeli ilə girişi yoxla", "Validate input with a Pydantic model"),
      d("Düzgün status kodları qaytar (201, 404, 422)", "Return correct status codes (201, 404, 422)"),
      d("SQLite-a qoşul", "Connect to SQLite"),
      d("pytest ilə testlər yaz", "Write tests with pytest"),
    ],
    testing: [d("Mövcud olmayan qeyd üçün 404 qaytarılır", "A missing note returns 404")],
    evaluation: [d("Bütün testlər keçir və API sənədləri (`/docs`) açılır", "All tests pass and the API docs (`/docs`) open")],
    starter: [{ name: "main.py", code: 'from fastapi import FastAPI\n\napp = FastAPI()\n\n\n@app.get("/notes")\ndef list_notes():\n    return []\n' }],
  },
];
