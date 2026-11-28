import type { Lesson } from "../types";

const lesson: Lesson = {
  id: "javascript-objects",
  language: "javascript",
  order: 5,
  level: "beginner",
  title: { az: "Obyektlər (object)", en: "Objects" },
  simple: {
    az: "Obyekt şəxsiyyət vəsiqəsinə bənzəyir: bir insan haqqında məlumat bir kartda, hər biri öz başlığı altında yazılıb (`name: \"Aysel\"`, `age: 24`). Massivdən fərqli olaraq lazım olanı nömrə ilə yox, başlıqla tapırsınız: `user.name`.",
    en: "An object is like an ID card: all the facts about one person are on one card, each under its own heading (`name: \"Aysel\"`, `age: 24`). Unlike an array, you find what you need by its heading, not by a number: `user.name`.",
  },
  intro: {
    what: {
      az: "Obyekt — açar–dəyər cütlərindən ibarət məlumat quruluşudur: `{ name: \"Aysel\", age: 24 }`. Hər açar (xüsusiyyət, property) bir dəyərə bağlanır.",
      en: "An object is a data structure made of key–value pairs: `{ name: \"Aysel\", age: 24 }`. Each key (a property) is bound to a value.",
    },
    why: {
      az: "Bir şeyi təsvir edən bütün məlumatı (istifadəçi, məhsul, sifariş) bir yerdə və adlarla saxlamağa imkan verir. Massiv sıraya görə, obyekt ada görə işləyir.",
      en: "It keeps all the data describing one thing (a user, a product, an order) together, under names. Arrays work by position; objects work by name.",
    },
    where: {
      az: "API cavabları (JSON), React komponentlərinin props və state-i, parametrlər, konfiqurasiya faylları.",
      en: "API responses (JSON), React component props and state, settings, configuration files.",
    },
  },
  syntax: {
    code: 'const user = { name: "Aysel", age: 24 };\nconsole.log(user.name);',
    lang: "javascript",
    parts: [
      { token: "{ }", role: { az: "Obyekt literalı: obyekti birbaşa yaradır.", en: "An object literal: creates the object directly." } },
      { token: "name: \"Aysel\"", role: { az: "Xüsusiyyət: soldakı açar, iki nöqtədən sonra isə dəyər.", en: "A property: the key on the left, the value after the colon." } },
      { token: ",", role: { az: "Xüsusiyyətləri bir-birindən ayırır.", en: "Separates properties from each other." } },
      { token: "user.name", role: { az: "Nöqtə ilə xüsusiyyətin dəyərini oxumaq.", en: "Reading a property's value with a dot." } },
    ],
  },
  examples: [
    {
      title: { az: "Sadə nümunə: oxumaq və dəyişmək", en: "Simple example: reading and changing" },
      lang: "javascript",
      code: 'const book = { title: "Dune", pages: 412 };\nbook.pages = 420;\nbook.year = 1965;\nconsole.log(book.title, book.pages);\nconsole.log(book);',
      lines: [
        { az: "İki xüsusiyyəti olan obyekt yaradılır.", en: "Creates an object with two properties." },
        { az: "Mövcud xüsusiyyət dəyişdirilir. `const` obyektin özünü yox, dəyişənin başqa obyektə bağlanmasını qadağan edir.", en: "Changes an existing property. `const` stops the variable from pointing to another object, not the object from changing." },
        { az: "Olmayan açara dəyər yazmaq yeni xüsusiyyət əlavə edir.", en: "Assigning to a missing key adds a new property." },
        { az: "İki dəyər yan-yana çıxır: `Dune 420`.", en: "Prints two values side by side: `Dune 420`." },
        { az: "Bütün obyekt çıxır.", en: "Prints the whole object." },
      ],
      output: "Dune 420\n{ title: 'Dune', pages: 420, year: 1965 }",
    },
    {
      title: { az: "Orta nümunə: dinamik açar və gəzinti", en: "Intermediate example: dynamic keys and iterating" },
      lang: "javascript",
      code: 'const scores = { math: 90, physics: 75 };\nconst subject = "math";\nconsole.log(scores[subject]);\nfor (const [key, value] of Object.entries(scores)) {\n  console.log(`${key}: ${value}`);\n}',
      lines: [
        { az: "Fənn adları açar, ballar dəyərdir.", en: "Subject names are the keys, scores are the values." },
        { az: "Açarın adı dəyişəndə saxlanılır.", en: "The key's name is stored in a variable." },
        { az: "Kvadrat mötərizə dəyişəndəki açarı oxuyur: `scores[\"math\"]` → 90. `scores.subject` isə `subject` adlı açarı axtarardı.", en: "Square brackets read the key held in the variable: `scores[\"math\"]` → 90. `scores.subject` would look for a key literally named `subject`." },
        { az: "`Object.entries` `[açar, dəyər]` cütlərinin massivini verir; hər cüt iki dəyişənə ayrılır.", en: "`Object.entries` gives an array of `[key, value]` pairs; each pair is split into two variables." },
        { az: "Hər cüt bir sətirdə çıxır.", en: "Prints each pair on its own line." },
        { az: "Dövr bitir.", en: "End of the loop." },
      ],
      output: "90\nmath: 90\nphysics: 75",
    },
    {
      title: { az: "Real nümunə: səbətin cəmi", en: "Real-world example: cart total" },
      lang: "javascript",
      code: 'const cart = [\n  { name: "Pen", price: 1.5, qty: 4 },\n  { name: "Notebook", price: 3, qty: 2 },\n];\nconst total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);\nconsole.log(`Total: ${total} AZN`);',
      lines: [
        { az: "Obyektlərdən ibarət massiv başlayır — real proqramlarda ən çox rast gəlinən forma.", en: "An array of objects starts — the most common shape in real programs." },
        { az: "Hər məhsul ad, qiymət və say xüsusiyyətləri olan obyektdir.", en: "Each product is an object with name, price and quantity." },
        { az: "İkinci məhsul.", en: "The second product." },
        { az: "Massiv bağlanır.", en: "The array ends." },
        { az: "`reduce` hər məhsulun `price * qty` dəyərini 0-dan başlayaraq toplayır: 6 + 6 = 12.", en: "`reduce` adds up each item's `price * qty`, starting from 0: 6 + 6 = 12." },
        { az: "Nəticə çıxır.", en: "Prints the result." },
      ],
      output: "Total: 12 AZN",
    },
  ],
  mistakes: [
    {
      title: { az: "Dəyişəndəki açarı nöqtə ilə oxumaq", en: "Reading a key from a variable with a dot" },
      wrong: 'const key = "age";\nconst user = { age: 24 };\nconsole.log(user.key); // undefined',
      right: 'const key = "age";\nconst user = { age: 24 };\nconsole.log(user[key]); // 24',
      why: {
        az: "`user.key` sözün özü olan `key` adlı açarı axtarır. Dəyişənin dəyəri açar olmalıdırsa, kvadrat mötərizə lazımdır.",
        en: "`user.key` looks for a key literally named `key`. When the key is the variable's value, use square brackets.",
      },
    },
    {
      title: { az: "Obyekti `===` ilə müqayisə etmək", en: "Comparing objects with `===`" },
      wrong: 'console.log({ a: 1 } === { a: 1 }); // false',
      right: 'const x = { a: 1 };\nconst y = x;\nconsole.log(x === y); // true (same object)',
      why: {
        az: "Obyektlər məzmuna görə yox, istinada görə müqayisə olunur: eyni görünən iki ayrı obyekt bərabər deyil.",
        en: "Objects are compared by reference, not by content: two separate objects that look the same are not equal.",
      },
    },
    {
      title: { az: "Kopyalamaq əvəzinə eyni obyekti dəyişmək", en: "Changing the same object instead of a copy" },
      wrong: 'const a = { n: 1 };\nconst b = a;\nb.n = 2;\nconsole.log(a.n); // 2',
      right: 'const a = { n: 1 };\nconst b = { ...a };\nb.n = 2;\nconsole.log(a.n); // 1',
      why: {
        az: "`b = a` yeni obyekt yaratmır, eyni obyektə ikinci ad verir. Səthi kopya üçün yayma sintaksisi `{ ...a }` istifadə olunur.",
        en: "`b = a` does not create a new object; it gives the same object a second name. Use spread syntax `{ ...a }` for a shallow copy.",
      },
    },
  ],
  exercise: {
    objective: { az: "Obyekt yaratmaq, xüsusiyyət oxumaq və əlavə etmək.", en: "Create an object, read a property and add one." },
    task: {
      az: "`product` obyektinə `stock: 7` xüsusiyyətini əlavə edin və dəqiq bu sətri çıxarın: `Laptop costs 1200 AZN, 7 left`.",
      en: "Add a `stock: 7` property to `product` and print exactly: `Laptop costs 1200 AZN, 7 left`.",
    },
    hints: [
      { az: "Yeni xüsusiyyət: `product.stock = 7;`", en: "A new property: `product.stock = 7;`" },
      { az: "Şablon sətri: `` `${product.name} costs ${product.price} AZN, ${product.stock} left` ``", en: "A template string: `` `${product.name} costs ${product.price} AZN, ${product.stock} left` ``" },
    ],
    solution: 'const product = { name: "Laptop", price: 1200 };\nproduct.stock = 7;\nconsole.log(`${product.name} costs ${product.price} AZN, ${product.stock} left`);',
    lang: "javascript",
    check: { expected: "Laptop costs 1200 AZN, 7 left", starter: 'const product = { name: "Laptop", price: 1200 };\n' },
  },
  quiz: [
    {
      kind: "predict",
      prompt: { az: "Bu kod nə çıxarır?", en: "What does this code print?" },
      code: 'const p = { x: 1 };\nconst q = p;\nq.x = 5;\nconsole.log(p.x);',
      lang: "javascript",
      options: ["1", "5", "undefined"],
      answer: 1,
      explain: { az: "`q` eyni obyektə istinad edir, ona görə dəyişiklik `p`-də də görünür.", en: "`q` refers to the same object, so the change is visible through `p` too." },
    },
    {
      kind: "predict",
      prompt: { az: "Konsolda nə görünəcək?", en: "What will appear in the console?" },
      code: 'const user = { name: "Leyla" };\nconsole.log(user.age);',
      lang: "javascript",
      options: ["null", "undefined", "ReferenceError"],
      answer: 1,
      explain: { az: "Olmayan xüsusiyyəti oxumaq xəta vermir, `undefined` qaytarır.", en: "Reading a missing property is not an error; it gives `undefined`." },
    },
    {
      kind: "choice",
      prompt: { az: "Açarın adı `field` dəyişənindədirsə, dəyəri necə oxuyarıq?", en: "If the key's name is in the variable `field`, how do you read the value?" },
      options: ["obj.field", "obj[field]", "obj->field"],
      answer: 1,
      explain: { az: "Kvadrat mötərizə içindəki ifadəni hesablayır və nəticəni açar kimi istifadə edir.", en: "Square brackets evaluate the expression inside and use the result as the key." },
    },
  ],
  terms: [
    { en: "object", local: { az: "obyekt", tr: "nesne", ru: "объект" } },
    { en: "property", local: { az: "xüsusiyyət", tr: "özellik", ru: "свойство" } },
    { en: "key", local: { az: "açar", tr: "anahtar", ru: "ключ" } },
    { en: "reference", local: { az: "istinad", tr: "referans", ru: "ссылка" } },
    { en: "spread syntax", local: { az: "yayma sintaksisi", tr: "yayma sözdizimi", ru: "spread-синтаксис" } },
  ],
  related: ["javascript-arrays", "javascript-variables", "typescript-basics", "python-dictionaries"],
  sources: [
    { title: "MDN — Working with objects", url: "https://developer.mozilla.org/docs/Web/JavaScript/Guide/Working_with_objects" },
    { title: "MDN — Object.entries()", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/entries" },
    { title: "MDN — Spread syntax", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Spread_syntax" },
  ],
  reviewedAt: "2026-11-28",
  verification: "authored",
};

export default lesson;
