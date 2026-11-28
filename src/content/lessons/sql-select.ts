import type { Lesson } from "../types";

// Examples use this table (shown in the intro):
// users(id, name, city, age): (1, Aysel, Baku, 24), (2, Murad, Ganja, 31), (3, Leyla, Baku, 19), (4, Elvin, Shaki, NULL)
const lesson: Lesson = {
  id: "sql-select",
  language: "sql",
  order: 1,
  level: "absolute",
  title: { az: "SELECT: məlumatı oxumaq", en: "SELECT: reading data" },
  simple: {
    az: "Verilənlər bazası nəhəng Excel cədvəlinə bənzəyir. `SELECT` isə ona verdiyiniz sualdır: \"mənə Bakıda yaşayan istifadəçilərin adlarını göstər\". `SELECT name` hansı sütunları istədiyinizi, `FROM users` hansı cədvəldən baxılacağını, `WHERE city = 'Baku'` isə hansı sətirlərin seçiləcəyini deyir.",
    en: "A database is like a huge spreadsheet, and `SELECT` is a question you ask it: \"show me the names of users who live in Baku\". `SELECT name` says which columns you want, `FROM users` which table to look in, and `WHERE city = 'Baku'` which rows to keep.",
  },
  intro: {
    what: {
      az: "`SELECT` cədvəldən məlumat oxuyan SQL əmridir. Hansı sütunların, hansı cədvəldən, hansı şərtlə və hansı sıra ilə gətiriləcəyini deyirsiniz; verilənlər bazası isə bunu necə edəcəyinə özü qərar verir. Nümunələrdə `users` cədvəli istifadə olunur: `id`, `name`, `city`, `age` sütunları və 4 sətir (Aysel/Baku/24, Murad/Ganja/31, Leyla/Baku/19, Elvin/Shaki/yaşı məlum deyil).",
      en: "`SELECT` is the SQL statement that reads data from a table. You say which columns, from which table, under which condition and in what order; the database decides how to do it. The examples use a `users` table with columns `id`, `name`, `city`, `age` and 4 rows (Aysel/Baku/24, Murad/Ganja/31, Leyla/Baku/19, Elvin/Shaki/age unknown).",
    },
    why: {
      az: "Demək olar ki, hər tətbiq məlumatı verilənlər bazasında saxlayır. Onu göstərmək, axtarmaq və hesabat çıxarmaq üçün `SELECT` lazımdır.",
      en: "Almost every application stores data in a database. To display, search or report on it you need `SELECT`.",
    },
    where: {
      az: "Veb saytların backend-i, analitika və hesabatlar, mobil tətbiqlərdə SQLite. CODEVERSE də öz məlumatını SQLite-da saxlayır.",
      en: "Website backends, analytics and reports, SQLite in mobile apps. CODEVERSE itself stores its data in SQLite.",
    },
  },
  syntax: {
    code: "SELECT name, city\nFROM users\nWHERE age >= 20\nORDER BY name;",
    lang: "sql",
    parts: [
      { token: "SELECT name, city", role: { az: "Gətiriləcək sütunlar, vergüllə ayrılır. `*` bütün sütunlar deməkdir.", en: "The columns to return, separated by commas. `*` means all columns." } },
      { token: "FROM users", role: { az: "Məlumatın oxunduğu cədvəl.", en: "The table the data is read from." } },
      { token: "WHERE age >= 20", role: { az: "Süzgəc: yalnız şərti ödəyən sətirlər qalır. İstəyə bağlıdır.", en: "A filter: only rows that meet the condition remain. Optional." } },
      { token: "ORDER BY name", role: { az: "Nəticəni sıralayır; standart artan sıradır (`ASC`), azalan üçün `DESC`.", en: "Sorts the result; ascending (`ASC`) by default, `DESC` for descending." } },
      { token: ";", role: { az: "Əmrin sonu.", en: "End of the statement." } },
    ],
  },
  examples: [
    {
      title: { az: "Sadə nümunə: bütün sütunlar", en: "Simple example: all columns" },
      lang: "sql",
      code: "SELECT *\nFROM users;",
      lines: [
        { az: "`*` bütün sütunları seçir. Öyrənmək üçün rahatdır, amma real tətbiqlərdə lazım olan sütunları adla yazmaq daha yaxşıdır.", en: "`*` selects every column. Handy for exploring, but in real applications it is better to name the columns you need." },
        { az: "`users` cədvəlinin bütün 4 sətri qaytarılır.", en: "All 4 rows of `users` are returned." },
      ],
      output: "id | name  | city  | age\n1  | Aysel | Baku  | 24\n2  | Murad | Ganja | 31\n3  | Leyla | Baku  | 19\n4  | Elvin | Shaki | NULL",
    },
    {
      title: { az: "Orta nümunə: WHERE, AND və ORDER BY", en: "Intermediate example: WHERE, AND and ORDER BY" },
      lang: "sql",
      code: "SELECT name, age\nFROM users\nWHERE city = 'Baku' AND age >= 18\nORDER BY age DESC;",
      lines: [
        { az: "Yalnız iki sütun.", en: "Only two columns." },
        { az: "Mənbə cədvəl.", en: "The source table." },
        { az: "Mətn dəyərləri tək dırnaqla yazılır. `AND` hər iki şərtin doğru olmasını tələb edir.", en: "Text values use single quotes. `AND` requires both conditions to be true." },
        { az: "`DESC` — böyükdən kiçiyə sıralama.", en: "`DESC` sorts from largest to smallest." },
      ],
      output: "name  | age\nAysel | 24\nLeyla | 19",
    },
    {
      title: { az: "Real nümunə: NULL dəyərləri tapmaq və LIMIT", en: "Real-world example: finding NULLs and LIMIT" },
      lang: "sql",
      code: "SELECT name\nFROM users\nWHERE age IS NULL\nLIMIT 10;",
      lines: [
        { az: "Yalnız adlar.", en: "Names only." },
        { az: "Mənbə cədvəl.", en: "The source table." },
        { az: "`NULL` \"məlum deyil\" deməkdir və `=` ilə müqayisə olunmur; `IS NULL` istifadə olunur. Məs., profili natamam istifadəçiləri tapmaq üçün.", en: "`NULL` means \"unknown\" and cannot be compared with `=`; use `IS NULL`. E.g. to find users with incomplete profiles." },
        { az: "`LIMIT` qaytarılan sətirlərin sayını məhdudlaşdırır (SQLite, PostgreSQL, MySQL-də işləyir).", en: "`LIMIT` caps the number of rows returned (works in SQLite, PostgreSQL and MySQL)." },
      ],
      output: "name\nElvin",
    },
  ],
  mistakes: [
    {
      title: { az: "`= NULL` yazmaq", en: "Writing `= NULL`" },
      wrong: "SELECT name FROM users\nWHERE age = NULL;",
      right: "SELECT name FROM users\nWHERE age IS NULL;",
      why: {
        az: "`NULL` ilə istənilən `=` müqayisəsinin nəticəsi `NULL`-dur (doğru deyil), ona görə sorğu heç bir sətir qaytarmır. `IS NULL` / `IS NOT NULL` istifadə edin.",
        en: "Any `=` comparison with `NULL` evaluates to `NULL` (not true), so the query returns no rows. Use `IS NULL` / `IS NOT NULL`.",
      },
    },
    {
      title: { az: "Sütunlar arasında vergülü unutmaq", en: "Forgetting the comma between columns" },
      wrong: "SELECT name age\nFROM users;",
      right: "SELECT name, age\nFROM users;",
      why: {
        az: "Xəta çıxmır! `name age` \"`name` sütununu `age` adı ilə göstər\" kimi oxunur (ləqəb, alias). Nəticədə yalnız bir sütun olur və adı yanıltıcıdır.",
        en: "No error appears! `name age` is read as \"show column `name` under the alias `age`\". You get a single, misleadingly named column.",
      },
    },
    {
      title: { az: "Mətn üçün cüt dırnaq", en: "Double quotes for text" },
      wrong: "SELECT * FROM users\nWHERE city = \"Baku\";",
      right: "SELECT * FROM users\nWHERE city = 'Baku';",
      why: {
        az: "Standart SQL-də cüt dırnaq ad (sütun, cədvəl) üçündür, mətn üçün tək dırnaq istifadə olunur. PostgreSQL `\"Baku\"`-nu sütun adı kimi oxuyub xəta verir; SQLite bəzən buna dözür, amma buna güvənməyin.",
        en: "In standard SQL double quotes are for identifiers (columns, tables); text uses single quotes. PostgreSQL reads `\"Baku\"` as a column name and fails; SQLite sometimes tolerates it, but do not rely on that.",
      },
    },
  ],
  exercise: {
    objective: { az: "Süzgəc və sıralama ilə sorğu yazmaq.", en: "Write a query with a filter and sorting." },
    task: {
      az: "`users` cədvəlindən 30 yaşdan kiçik istifadəçilərin adını və şəhərini, adlarına görə əlifba sırası ilə seçin.",
      en: "From `users`, select the name and city of users younger than 30, sorted alphabetically by name.",
    },
    hints: [
      { az: "Şərt: `WHERE age < 30`.", en: "Condition: `WHERE age < 30`." },
      { az: "Əlifba sırası artan sıradır: `ORDER BY name` (və ya `ORDER BY name ASC`).", en: "Alphabetical is ascending: `ORDER BY name` (or `ORDER BY name ASC`)." },
    ],
    solution: "SELECT name, city\nFROM users\nWHERE age < 30\nORDER BY name;",
    lang: "sql",
    check: { expected: "name  | city\nAysel | Baku\nLeyla | Baku", starter: "SELECT\n" },
  },
  quiz: [
    {
      kind: "predict",
      prompt: { az: "Nümunə cədvəldə bu sorğu neçə sətir qaytarır?", en: "With the example table, how many rows does this query return?" },
      code: "SELECT name FROM users\nWHERE city = 'Baku';",
      lang: "sql",
      options: ["1", "2", "4"],
      answer: 1,
      explain: { az: "Bakıda iki istifadəçi var: Aysel və Leyla.", en: "Two users live in Baku: Aysel and Leyla." },
    },
    {
      kind: "choice",
      prompt: { az: "Yaşı məlum olmayan istifadəçiləri hansı şərt tapır?", en: "Which condition finds users whose age is unknown?" },
      options: ["`age = NULL`", "`age IS NULL`", "`age = ''`"],
      answer: 1,
      explain: { az: "`NULL` yalnız `IS NULL` ilə yoxlanılır. Boş sətir (`''`) `NULL` deyil.", en: "`NULL` is only tested with `IS NULL`. An empty string (`''`) is not `NULL`." },
    },
    {
      kind: "predict",
      prompt: { az: "Nəticənin birinci sətrində hansı ad olacaq?", en: "Which name is in the first row of the result?" },
      code: "SELECT name FROM users\nWHERE age IS NOT NULL\nORDER BY age DESC\nLIMIT 1;",
      lang: "sql",
      options: ["Aysel", "Murad", "Leyla"],
      answer: 1,
      explain: { az: "Yaşı məlum olanlar azalan sıra ilə sıralanır; ən böyüyü Murad-dır (31). `LIMIT 1` yalnız birinci sətri saxlayır.", en: "Users with a known age are sorted descending; the oldest is Murad (31). `LIMIT 1` keeps just the first row." },
    },
  ],
  terms: [
    { en: "query", local: { az: "sorğu", tr: "sorgu", ru: "запрос" } },
    { en: "table", local: { az: "cədvəl", tr: "tablo", ru: "таблица" } },
    { en: "column", local: { az: "sütun", tr: "sütun", ru: "столбец" } },
    { en: "row", local: { az: "sətir", tr: "satır", ru: "строка" } },
    { en: "alias", local: { az: "ləqəb (alias)", tr: "takma ad", ru: "псевдоним" } },
  ],
  related: ["python-lists", "javascript-arrays", "sql-filter-sort", "sql-joins"],
  sources: [
    { title: "SQLite — SELECT", url: "https://www.sqlite.org/lang_select.html" },
    { title: "PostgreSQL — Queries (SELECT)", url: "https://www.postgresql.org/docs/current/queries.html" },
    { title: "PostgreSQL — Comparison Functions and Operators (IS NULL)", url: "https://www.postgresql.org/docs/current/functions-comparison.html" },
    { title: "PostgreSQL — Lexical Structure (identifiers vs string constants)", url: "https://www.postgresql.org/docs/current/sql-syntax-lexical.html" },
  ],
  reviewedAt: "2026-11-22",
  verification: "authored",
};

export default lesson;
