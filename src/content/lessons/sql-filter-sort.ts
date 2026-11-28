import type { Lesson } from "../types";

// Examples use the practice database:
// users(id, name, city, age): (1, Aysel, Baku, 24), (2, Murad, Ganja, 31), (3, Leyla, Baku, 19), (4, Elvin, Shaki, NULL)
// orders(id, user_id, product, amount): (1, 1, Notebook, 12.5), (2, 1, Pen, 2), (3, 2, Backpack, 45), (4, 3, Notebook, 12.5)
const lesson: Lesson = {
  id: "sql-filter-sort",
  language: "sql",
  order: 2,
  level: "beginner",
  title: { az: "Süzmə və çeşidləmə: WHERE, ORDER BY, LIMIT", en: "Filtering and sorting: WHERE, ORDER BY, LIMIT" },
  simple: {
    az: "Cədvəli böyük bir kitabxana kimi təsəvvür edin. `WHERE` kitabxanaçıya deyir: \"yalnız Bakıda yaşayan oxucuları göstər\". `ORDER BY` siyahını düzür: \"yaşa görə, böyükdən kiçiyə\". `LIMIT` isə deyir: \"yalnız ilk ikisini ver\". Sıra həmişə belədir: əvvəl süz, sonra düz, sonra kəs.",
    en: "Think of a table as a big library. `WHERE` tells the librarian: \"only show readers who live in Baku\". `ORDER BY` arranges the list: \"by age, oldest first\". `LIMIT` says: \"just give me the first two\". The order is always: filter, then sort, then cut.",
  },
  intro: {
    what: {
      az: "`WHERE` sətirləri şərtə görə süzür, `ORDER BY` nəticəni sütuna görə çeşidləyir, `LIMIT` isə qaytarılan sətirlərin sayını məhdudlaşdırır.",
      en: "`WHERE` filters rows by a condition, `ORDER BY` sorts the result by a column, and `LIMIT` caps how many rows come back.",
    },
    why: {
      az: "Real cədvəllərdə minlərlə sətir olur. Bizə adətən onların bir hissəsi lazımdır: bu ayın sifarişləri, ən bahalı 10 məhsul, aktiv istifadəçilər.",
      en: "Real tables have thousands of rows. You usually need only some: this month's orders, the 10 most expensive products, active users.",
    },
    where: {
      az: "Axtarış nəticələri, \"Top 10\" siyahıları, hesabatlar, səhifələmə (pagination).",
      en: "Search results, \"top 10\" lists, reports, pagination.",
    },
  },
  syntax: {
    code: "SELECT name FROM users\nWHERE age > 20\nORDER BY age DESC\nLIMIT 2;",
    lang: "sql",
    parts: [
      { token: "WHERE age > 20", role: { az: "Yalnız şərti ödəyən sətirlər qalır.", en: "Only rows that meet the condition are kept." } },
      { token: "ORDER BY age DESC", role: { az: "Yaşa görə çeşidlə; `DESC` — böyükdən kiçiyə, `ASC` (standart) — kiçikdən böyüyə.", en: "Sort by age; `DESC` is largest first, `ASC` (the default) smallest first." } },
      { token: "LIMIT 2", role: { az: "Ən çox 2 sətir qaytar.", en: "Return at most 2 rows." } },
    ],
  },
  examples: [
    {
      title: { az: "Sadə nümunə: AND ilə iki şərt", en: "Simple example: two conditions with AND" },
      lang: "sql",
      code: "SELECT name, age\nFROM users\nWHERE city = 'Baku' AND age >= 20;",
      lines: [
        { az: "Ad və yaş sütunları.", en: "The name and age columns." },
        { az: "`users` cədvəlindən.", en: "From the `users` table." },
        { az: "Hər iki şərt doğru olmalıdır: Bakı və 20 yaş və ya daha çox. Leyla (19) düşmür.", en: "Both conditions must be true: Baku and 20 or older. Leyla (19) is left out." },
      ],
      output: "name  | age\nAysel | 24",
    },
    {
      title: { az: "Orta nümunə: NULL, çeşidləmə və LIMIT", en: "Intermediate example: NULL, sorting and LIMIT" },
      lang: "sql",
      code: "SELECT name, age\nFROM users\nWHERE age IS NOT NULL\nORDER BY age DESC\nLIMIT 2;",
      lines: [
        { az: "Ad və yaş.", en: "Name and age." },
        { az: "`users` cədvəlindən.", en: "From `users`." },
        { az: "Yaşı məlum olanlar. NULL-u `= NULL` ilə yox, `IS NULL` / `IS NOT NULL` ilə yoxlayırıq.", en: "Only users whose age is known. NULL is checked with `IS NULL` / `IS NOT NULL`, never `= NULL`." },
        { az: "Ən böyükdən başlayaraq.", en: "Oldest first." },
        { az: "Yalnız ilk iki sətir: ən yaşlı iki istifadəçi.", en: "Only the first two rows: the two oldest users." },
      ],
      output: "name  | age\nMurad | 31\nAysel | 24",
    },
    {
      title: { az: "Real nümunə: LIKE və OR ilə sifarişlər", en: "Real-world example: orders with LIKE and OR" },
      lang: "sql",
      code: "SELECT product, amount\nFROM orders\nWHERE product LIKE 'Note%' OR amount > 40\nORDER BY amount;",
      lines: [
        { az: "Məhsul və məbləğ.", en: "Product and amount." },
        { az: "`orders` cədvəlindən.", en: "From `orders`." },
        { az: "`LIKE 'Note%'` — \"Note\" ilə başlayan; `%` istənilən simvollar deməkdir. `OR` — şərtlərdən biri kifayətdir.", en: "`LIKE 'Note%'` means starts with \"Note\"; `%` stands for any characters. `OR` means either condition is enough." },
        { az: "Məbləğə görə artan sıra ilə (standart `ASC`).", en: "Sorted by amount, smallest first (the default `ASC`)." },
      ],
      output: "product  | amount\nNotebook | 12.5\nNotebook | 12.5\nBackpack | 45",
    },
  ],
  mistakes: [
    {
      title: { az: "NULL-u `=` ilə yoxlamaq", en: "Checking NULL with `=`" },
      wrong: "SELECT name FROM users WHERE age = NULL; -- no rows",
      right: "SELECT name FROM users WHERE age IS NULL; -- Elvin",
      why: {
        az: "NULL \"naməlum\" deməkdir; heç nə ona bərabər deyil, hətta NULL da. `IS NULL` istifadə edin.",
        en: "NULL means \"unknown\"; nothing is equal to it, not even NULL. Use `IS NULL`.",
      },
    },
    {
      title: { az: "AND və OR-u mötərizəsiz qarışdırmaq", en: "Mixing AND and OR without parentheses" },
      wrong: "SELECT name FROM users\nWHERE city = 'Baku' OR city = 'Ganja' AND age > 30;",
      right: "SELECT name FROM users\nWHERE (city = 'Baku' OR city = 'Ganja') AND age > 30;",
      why: {
        az: "`AND` `OR`-dan əvvəl hesablanır, ona görə birinci sorğu Bakıdakı hamını yaşından asılı olmayaraq qaytarır. Mötərizə niyyəti aydın edir.",
        en: "`AND` is evaluated before `OR`, so the first query returns everyone in Baku regardless of age. Parentheses make the intent explicit.",
      },
    },
    {
      title: { az: "ORDER BY olmadan sıraya güvənmək", en: "Relying on row order without ORDER BY" },
      wrong: "SELECT name FROM users LIMIT 1; -- \"the first\" user?",
      right: "SELECT name FROM users ORDER BY id LIMIT 1;",
      why: {
        az: "`ORDER BY` olmadan verilənlər bazası sətirləri istənilən sırada qaytara bilər. \"Birinci\" lazımdırsa, nəyə görə birinci olduğunu yazın.",
        en: "Without `ORDER BY` the database may return rows in any order. If you need \"the first\", say what it is first by.",
      },
    },
  ],
  exercise: {
    objective: { az: "WHERE və ORDER BY birlikdə.", en: "WHERE and ORDER BY together." },
    task: {
      az: "20 yaşdan böyük istifadəçilərin ad və yaşını göstərin; ən yaşlı birinci olsun.",
      en: "Show the name and age of users older than 20, oldest first.",
    },
    hints: [
      { az: "`WHERE age > 20`", en: "`WHERE age > 20`" },
      { az: "`ORDER BY age DESC`", en: "`ORDER BY age DESC`" },
    ],
    solution: "SELECT name, age\nFROM users\nWHERE age > 20\nORDER BY age DESC;",
    lang: "sql",
    check: { expected: "name  | age\nMurad | 31\nAysel | 24", starter: "SELECT name, age\nFROM users\n" },
  },
  quiz: [
    {
      kind: "choice",
      prompt: { az: "Yaşı bilinməyən istifadəçiləri necə taparıq?", en: "How do you find users whose age is unknown?" },
      options: ["WHERE age = NULL", "WHERE age IS NULL", "WHERE age = 0"],
      answer: 1,
      explain: { az: "NULL yalnız `IS NULL` ilə yoxlanır.", en: "NULL is checked only with `IS NULL`." },
    },
    {
      kind: "choice",
      prompt: { az: "`ORDER BY amount` hansı sıra ilə çeşidləyir?", en: "In which order does `ORDER BY amount` sort?" },
      options: [{ az: "Kiçikdən böyüyə (ASC)", en: "Smallest first (ASC)" }, { az: "Böyükdən kiçiyə (DESC)", en: "Largest first (DESC)" }, { az: "Təsadüfi", en: "Random" }],
      answer: 0,
      explain: { az: "Standart istiqamət `ASC`-dir.", en: "The default direction is `ASC`." },
    },
    {
      kind: "choice",
      prompt: { az: "`LIKE 'B%'` hansı ilə uyğun gəlir?", en: "Which does `LIKE 'B%'` match?" },
      options: ["Baku", "Ganja", "aBc"],
      answer: 0,
      explain: { az: "`B%` — \"B\" ilə başlayan istənilən mətn.", en: "`B%` means any text that starts with \"B\"." },
    },
  ],
  terms: [
    { en: "filter", local: { az: "süzgəc", tr: "filtre", ru: "фильтр" } },
    { en: "sort", local: { az: "çeşidləmə", tr: "sıralama", ru: "сортировка" } },
    { en: "condition", local: { az: "şərt", tr: "koşul", ru: "условие" } },
    { en: "pattern", local: { az: "nümunə (şablon)", tr: "desen", ru: "шаблон" } },
  ],
  related: ["sql-select", "sql-joins"],
  sources: [
    { title: "SQLite — SELECT", url: "https://www.sqlite.org/lang_select.html" },
    { title: "SQLite — Expressions (LIKE, IS NULL)", url: "https://www.sqlite.org/lang_expr.html" },
  ],
  reviewedAt: "2026-11-28",
  verification: "authored",
};

export default lesson;
