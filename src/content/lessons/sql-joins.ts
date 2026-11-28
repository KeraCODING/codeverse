import type { Lesson } from "../types";

// Examples use the practice database:
// users(id, name, city, age): (1, Aysel, Baku, 24), (2, Murad, Ganja, 31), (3, Leyla, Baku, 19), (4, Elvin, Shaki, NULL)
// orders(id, user_id, product, amount): (1, 1, Notebook, 12.5), (2, 1, Pen, 2), (3, 2, Backpack, 45), (4, 3, Notebook, 12.5)
const lesson: Lesson = {
  id: "sql-joins",
  language: "sql",
  order: 3,
  level: "intermediate",
  title: { az: "Cədvəlləri birləşdirmək: JOIN", en: "Combining tables: JOIN" },
  simple: {
    az: "İki dəftəriniz var: birində müştərilərin adları və nömrələri, digərində sifarişlər və hansı müştəri nömrəsinə aid olduğu. Kimin nə aldığını bilmək üçün sifarişdəki nömrəni müştəri dəftərində tapırsınız. `JOIN` məhz bunu edir: iki cədvəli ortaq sütuna görə yan-yana qoyur.",
    en: "You have two notebooks: one lists customers and their numbers, the other lists orders and which customer number each belongs to. To see who bought what, you look up the order's number in the customer notebook. `JOIN` does exactly that: it puts two tables side by side using a shared column.",
  },
  intro: {
    what: {
      az: "`JOIN` iki cədvəlin sətirlərini `ON` şərtinə görə birləşdirir, adətən bir cədvəldəki xarici açar (`orders.user_id`) ilə digərindəki əsas açarı (`users.id`) uyğunlaşdırır.",
      en: "`JOIN` combines rows from two tables using an `ON` condition, usually matching a foreign key in one table (`orders.user_id`) with the primary key in the other (`users.id`).",
    },
    why: {
      az: "Məlumat təkrarlanmasın deyə müxtəlif cədvəllərdə saxlanılır. Hesabat üçün isə onu yenidən bir yerə toplamaq lazımdır.",
      en: "Data is split across tables so it isn't repeated. For reports you need to bring it back together.",
    },
    where: {
      az: "Sifariş + müştəri, məhsul + kateqoriya, tələbə + qiymət — demək olar hər real sorğuda.",
      en: "Orders + customers, products + categories, students + grades — in almost every real query.",
    },
  },
  syntax: {
    code: "SELECT u.name, o.product\nFROM orders o\nJOIN users u ON u.id = o.user_id;",
    lang: "sql",
    parts: [
      { token: "orders o", role: { az: "Cədvələ qısa ad (alias) verilir: `o`.", en: "Gives the table a short name (an alias): `o`." } },
      { token: "JOIN users u", role: { az: "İkinci cədvəl; standart `JOIN` — `INNER JOIN`: yalnız uyğunluğu olan sətirlər.", en: "The second table; a plain `JOIN` is an `INNER JOIN`: only rows with a match." } },
      { token: "ON u.id = o.user_id", role: { az: "Hansı sətirlərin cüt olduğunu deyən şərt.", en: "The condition that says which rows belong together." } },
    ],
  },
  examples: [
    {
      title: { az: "Sadə nümunə: kim nə alıb?", en: "Simple example: who bought what?" },
      lang: "sql",
      code: "SELECT u.name, o.product\nFROM orders o\nJOIN users u ON u.id = o.user_id\nORDER BY o.id;",
      lines: [
        { az: "İstifadəçinin adı və məhsul.", en: "The user's name and the product." },
        { az: "Sifarişlərdən başlayırıq.", en: "Start from the orders." },
        { az: "Hər sifarişin `user_id`-si ilə uyğun istifadəçini tapırıq.", en: "Find the matching user for each order's `user_id`." },
        { az: "Sifariş nömrəsinə görə sıra.", en: "In order-number order." },
      ],
      output: "name  | product\nAysel | Notebook\nAysel | Pen\nMurad | Backpack\nLeyla | Notebook",
    },
    {
      title: { az: "Orta nümunə: LEFT JOIN — heç nə almayanlar", en: "Intermediate example: LEFT JOIN — people with no orders" },
      lang: "sql",
      code: "SELECT u.name, o.product\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nWHERE o.id IS NULL;",
      lines: [
        { az: "Ad və məhsul.", en: "Name and product." },
        { az: "Bu dəfə istifadəçilərdən başlayırıq.", en: "This time we start from the users." },
        { az: "`LEFT JOIN` soldakı (users) bütün sətirləri saxlayır; uyğun sifariş yoxdursa, sifariş sütunları NULL olur.", en: "`LEFT JOIN` keeps every row on the left (users); with no matching order, the order columns are NULL." },
        { az: "Yalnız sifarişi olmayanları saxlayırıq: Elvin.", en: "Keep only the users without an order: Elvin." },
      ],
      output: "name  | product\nElvin | NULL",
    },
    {
      title: { az: "Real nümunə: hər müştərinin xərci", en: "Real-world example: what each customer spent" },
      lang: "sql",
      code: "SELECT u.name, COUNT(o.id) AS orders, SUM(o.amount) AS total\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nGROUP BY u.id\nORDER BY total DESC;",
      lines: [
        { az: "Ad, sifarişlərin sayı və ümumi məbləğ.", en: "Name, number of orders and the total amount." },
        { az: "Bütün istifadəçilər.", en: "All users." },
        { az: "Sifarişi olmayanlar da qalsın deyə `LEFT JOIN`.", en: "`LEFT JOIN` so users without orders stay in." },
        { az: "Hər istifadəçi üçün bir sətir.", en: "One row per user." },
        { az: "Ən çox xərcləyən birinci; NULL (heç nə almayan) sonda qalır.", en: "Biggest spender first; NULL (bought nothing) ends up last." },
      ],
      output: "name  | orders | total\nMurad | 1      | 45\nAysel | 2      | 14.5\nLeyla | 1      | 12.5\nElvin | 0      | NULL",
    },
  ],
  mistakes: [
    {
      title: { az: "ON şərtini unutmaq", en: "Forgetting the ON condition" },
      wrong: "SELECT u.name, o.product\nFROM orders o, users u; -- 16 rows!",
      right: "SELECT u.name, o.product\nFROM orders o\nJOIN users u ON u.id = o.user_id;",
      why: {
        az: "Şərtsiz birləşmə hər sifarişi hər istifadəçi ilə cütləşdirir (4 × 4 = 16 sətir). Həmişə `ON` yazın.",
        en: "A join without a condition pairs every order with every user (4 × 4 = 16 rows). Always write `ON`.",
      },
    },
    {
      title: { az: "Eyni adlı sütunu cədvəlsiz yazmaq", en: "Naming a shared column without its table" },
      wrong: "SELECT id, name FROM orders o JOIN users u ON u.id = o.user_id; -- ambiguous",
      right: "SELECT o.id, u.name FROM orders o JOIN users u ON u.id = o.user_id;",
      why: {
        az: "`id` hər iki cədvəldə var; hansının nəzərdə tutulduğunu `o.` və ya `u.` ilə göstərin.",
        en: "`id` exists in both tables; say which one you mean with `o.` or `u.`.",
      },
    },
    {
      title: { az: "LEFT JOIN-u WHERE ilə INNER JOIN-a çevirmək", en: "Turning a LEFT JOIN into an INNER JOIN with WHERE" },
      wrong: "SELECT u.name, o.product FROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nWHERE o.amount > 10; -- Elvin disappears",
      right: "SELECT u.name, o.product FROM users u\nLEFT JOIN orders o ON o.user_id = u.id AND o.amount > 10;",
      why: {
        az: "`WHERE` NULL sətirləri atır. Sağ cədvəl üçün şərti `ON`-a köçürsəniz, bütün istifadəçilər qalır.",
        en: "`WHERE` drops the NULL rows. Move conditions on the right-hand table into `ON` to keep every user.",
      },
    },
  ],
  exercise: {
    objective: { az: "JOIN, WHERE və ORDER BY-ı birlikdə istifadə etmək.", en: "Use JOIN, WHERE and ORDER BY together." },
    task: {
      az: "10 AZN-dən baha sifarişlərin məhsulunu və alıcının adını göstərin; ən baha birinci, bərabər qiymətlərdə ada görə.",
      en: "Show the product and the buyer's name for orders over 10 AZN; most expensive first, and by name when prices are equal.",
    },
    hints: [
      { az: "`JOIN users u ON u.id = o.user_id`", en: "`JOIN users u ON u.id = o.user_id`" },
      { az: "`WHERE o.amount > 10 ORDER BY o.amount DESC, u.name`", en: "`WHERE o.amount > 10 ORDER BY o.amount DESC, u.name`" },
    ],
    solution: "SELECT o.product, u.name\nFROM orders o\nJOIN users u ON u.id = o.user_id\nWHERE o.amount > 10\nORDER BY o.amount DESC, u.name;",
    lang: "sql",
    check: { expected: "product  | name\nBackpack | Murad\nNotebook | Aysel\nNotebook | Leyla", starter: "SELECT o.product, u.name\nFROM orders o\n" },
  },
  quiz: [
    {
      kind: "choice",
      prompt: { az: "Uyğunluğu olmayan sol sətirləri də saxlayan hansıdır?", en: "Which keeps left-hand rows that have no match?" },
      options: ["INNER JOIN", "LEFT JOIN", "JOIN"],
      answer: 1,
      explain: { az: "`LEFT JOIN` sol cədvəlin bütün sətirlərini saxlayır.", en: "`LEFT JOIN` keeps every row of the left table." },
    },
    {
      kind: "choice",
      prompt: { az: "4 sifariş və 4 istifadəçini ON-suz birləşdirsək neçə sətir alarıq?", en: "Joining 4 orders and 4 users without ON gives how many rows?" },
      options: ["4", "8", "16"],
      answer: 2,
      explain: { az: "Hər cüt kombinasiya: 4 × 4 = 16.", en: "Every combination: 4 × 4 = 16." },
    },
    {
      kind: "choice",
      prompt: { az: "`orders.user_id` sütunu nədir?", en: "What is the `orders.user_id` column?" },
      options: [{ az: "Əsas açar", en: "A primary key" }, { az: "Xarici açar", en: "A foreign key" }, { az: "İndeks", en: "An index" }],
      answer: 1,
      explain: { az: "Başqa cədvəlin əsas açarına (`users.id`) istinad edən sütun xarici açardır.", en: "A column that refers to another table's primary key (`users.id`) is a foreign key." },
    },
  ],
  terms: [
    { en: "join", local: { az: "birləşdirmə", tr: "birleştirme", ru: "соединение" } },
    { en: "foreign key", local: { az: "xarici açar", tr: "yabancı anahtar", ru: "внешний ключ" } },
    { en: "primary key", local: { az: "əsas açar", tr: "birincil anahtar", ru: "первичный ключ" } },
    { en: "alias", local: { az: "ləqəb (qısa ad)", tr: "takma ad", ru: "псевдоним" } },
  ],
  related: ["sql-select", "sql-filter-sort"],
  sources: [
    { title: "SQLite — SELECT (join-clause)", url: "https://www.sqlite.org/lang_select.html" },
    { title: "SQLite — Aggregate functions", url: "https://www.sqlite.org/lang_aggfunc.html" },
  ],
  reviewedAt: "2026-11-28",
  verification: "authored",
};

export default lesson;
