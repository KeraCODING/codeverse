import type { Lesson } from "../types";

const lesson: Lesson = {
  id: "javascript-conditions",
  language: "javascript",
  order: 3,
  level: "beginner",
  title: { az: "Şərtlər: if, else və müqayisə", en: "Conditions: if, else and comparison" },
  intro: {
    what: {
      az: "`if` ifadəsi şərti yoxlayır və nəticəyə görə fərqli kod işlədir. JavaScript-də şərt mötərizədə, kod bloku isə fiqurlu mötərizədə yazılır.",
      en: "An `if` statement tests a condition and runs different code depending on the result. In JavaScript the condition goes in parentheses and the block in curly braces.",
    },
    why: {
      az: "Veb səhifələr istifadəyə reaksiya verməlidir: forma düzgün doldurulubmu, istifadəçi daxil olubmu, səbət boşdurmu.",
      en: "Web pages must react to use: is the form filled in correctly, is the user logged in, is the basket empty.",
    },
    where: {
      az: "Forma validasiyası, giriş hüquqlarının yoxlanması, interfeysdə elementlərin göstərilib-gizlədilməsi.",
      en: "Form validation, permission checks, showing or hiding interface elements.",
    },
  },
  syntax: {
    code: 'if (age >= 18) {\n  console.log("Adult");\n} else if (age >= 13) {\n  console.log("Teen");\n} else {\n  console.log("Child");\n}',
    lang: "javascript",
    parts: [
      { token: "if", role: { az: "Şərt açar sözü.", en: "The condition keyword." } },
      { token: "(age >= 18)", role: { az: "Mötərizədəki şərt. Nəticə `true` (və ya \"truthy\") olarsa blok işləyir.", en: "The condition in parentheses. The block runs if it is `true` (or \"truthy\")." } },
      { token: "{ }", role: { az: "Kod bloku. Python-dan fərqli olaraq girinti deyil, fiqurlu mötərizə bloku müəyyən edir.", en: "The code block. Unlike Python, braces — not indentation — define the block." } },
      { token: "else if", role: { az: "Əvvəlki şərtlər yalan olduqda yoxlanılan növbəti şərt.", en: "The next condition, tested when the previous ones were false." } },
      { token: "else", role: { az: "Heç bir şərt ödənmədikdə işləyən blok.", en: "The block that runs when no condition matched." } },
    ],
  },
  examples: [
    {
      title: { az: "Sadə nümunə: if / else", en: "Simple example: if / else" },
      lang: "javascript",
      code: 'const temperature = 24;\nif (temperature > 20) {\n  console.log("Warm");\n} else {\n  console.log("Cool");\n}',
      lines: [
        { az: "Temperatur 24-dür.", en: "The temperature is 24." },
        { az: "24 > 20 doğrudur, ona görə bu blok seçilir.", en: "24 > 20 is true, so this block is chosen." },
        { az: "`Warm` çıxır.", en: "Prints `Warm`." },
        { az: "`else` bloku bu dəfə ötürülür.", en: "The `else` block is skipped this time." },
        { az: "İşləmir.", en: "Not executed." },
        { az: "Blok bitir.", en: "End of the block." },
      ],
      output: "Warm",
    },
    {
      title: { az: "Orta nümunə: `===` və `==` fərqi", en: "Intermediate example: `===` versus `==`" },
      lang: "javascript",
      code: 'const input = "5";\nconsole.log(input == 5);\nconsole.log(input === 5);\nconsole.log(Number(input) === 5);',
      lines: [
        { az: "Forma sahələrindən gələn dəyər həmişə sətirdir: `\"5\"`.", en: "Values from form fields are always strings: `\"5\"`." },
        { az: "`==` müqayisədən əvvəl tipləri çevirir, ona görə `true` verir.", en: "`==` converts types before comparing, so it gives `true`." },
        { az: "`===` tipi də yoxlayır: sətir ədəd deyil, nəticə `false`.", en: "`===` also checks the type: a string is not a number, so `false`." },
        { az: "Düzgün yol: əvvəl açıq şəkildə ədədə çevirib sonra `===` ilə müqayisə etmək.", en: "The correct way: convert explicitly first, then compare with `===`." },
      ],
      output: "true\nfalse\ntrue",
    },
    {
      title: { az: "Real nümunə: ternar operator ilə düymə mətni", en: "Real-world example: button label with the ternary operator" },
      lang: "javascript",
      code: 'const isLoggedIn = false;\nconst label = isLoggedIn ? "Log out" : "Log in";\nconsole.log(label);',
      lines: [
        { az: "İstifadəçi daxil olmayıb.", en: "The user is not logged in." },
        { az: "Ternar operator: `şərt ? doğrudursa : yalandırsa`. Qısa seçimlər üçün `if/else`-in ifadə formasıdır.", en: "The ternary operator: `condition ? ifTrue : ifFalse`. An expression form of `if/else` for short choices." },
        { az: "`Log in` çıxır.", en: "Prints `Log in`." },
      ],
      output: "Log in",
    },
  ],
  mistakes: [
    {
      title: { az: "Şərtdə `=` yazmaq", en: "Writing `=` in a condition" },
      wrong: 'let role = "guest";\nif (role = "admin") {\n  console.log("Welcome, admin");\n}',
      right: 'let role = "guest";\nif (role === "admin") {\n  console.log("Welcome, admin");\n}',
      why: {
        az: "JavaScript-də bu xəta vermir: `role = \"admin\"` mənimsətmədir, dəyişəni dəyişdirir və boş olmayan sətir \"truthy\" olduğu üçün blok həmişə işləyir. Müqayisə üçün `===` yazın.",
        en: "JavaScript does not report an error here: `role = \"admin\"` is an assignment, changes the variable, and a non-empty string is truthy, so the block always runs. Use `===` to compare.",
      },
    },
    {
      title: { az: "`==` ilə gözlənilməz nəticələr", en: "Surprising results with `==`" },
      wrong: 'console.log(0 == "");    // true\nconsole.log(null == undefined); // true',
      right: 'console.log(0 === "");   // false\nconsole.log(null === undefined); // false',
      why: {
        az: "`==` tipləri avtomatik çevirir və qeyri-intuitiv nəticələr verə bilir. Təhlükəsiz qayda: həmişə `===` və `!==` istifadə edin.",
        en: "`==` converts types automatically and can give unintuitive results. A safe rule: always use `===` and `!==`.",
      },
    },
    {
      title: { az: "\"Falsy\" dəyərləri unutmaq", en: "Forgetting about falsy values" },
      wrong: 'const count = 0;\nif (count) {\n  console.log("Has items");\n} else {\n  console.log("No data"); // printed for 0!\n}',
      right: 'const count = 0;\nif (count > 0) {\n  console.log("Has items");\n} else {\n  console.log("Empty");\n}',
      why: {
        az: "`0`, `\"\"`, `null`, `undefined`, `NaN` və `false` şərtdə yalan sayılır. 0 etibarlı dəyər ola bilərsə açıq müqayisə yazın.",
        en: "`0`, `\"\"`, `null`, `undefined`, `NaN` and `false` count as false in a condition. If 0 is a valid value, write an explicit comparison.",
      },
    },
  ],
  exercise: {
    objective: { az: "`if / else if / else` zənciri yazmaq.", en: "Write an `if / else if / else` chain." },
    task: {
      az: "`const score = 72;` üçün mesaj çıxarın: 90 və yuxarı — `Excellent`, 50 və yuxarı — `Passed`, qalan hallarda — `Try again`.",
      en: "For `const score = 72;`, log a message: 90 or above — `Excellent`, 50 or above — `Passed`, otherwise — `Try again`.",
    },
    hints: [
      { az: "Ən yüksək həddi birinci yoxlayın.", en: "Test the highest threshold first." },
      { az: "\"Və yuxarı\" üçün `>=` operatoru.", en: "Use `>=` for \"or above\"." },
    ],
    solution: 'const score = 72;\nif (score >= 90) {\n  console.log("Excellent");\n} else if (score >= 50) {\n  console.log("Passed");\n} else {\n  console.log("Try again");\n}',
    lang: "javascript",
    check: { expected: "Passed", starter: "const score = 72;\n" },
  },
  quiz: [
    {
      kind: "predict",
      prompt: { az: "Konsolda nə görünür?", en: "What appears in the console?" },
      code: 'console.log("3" === 3);',
      lang: "javascript",
      options: ["true", "false", "TypeError"],
      answer: 1,
      explain: { az: "`===` tipləri çevirmir: sətir və ədəd fərqlidir, nəticə `false`.", en: "`===` does not convert types: a string and a number differ, so `false`." },
    },
    {
      kind: "predict",
      prompt: { az: "Bu kod nə çıxarır?", en: "What does this code log?" },
      code: 'const items = [];\nconsole.log(items.length ? "Full" : "Empty");',
      lang: "javascript",
      options: ["Full", "Empty", "undefined"],
      answer: 1,
      explain: { az: "Boş massivin uzunluğu 0-dır, 0 \"falsy\"-dir, ona görə ternar operator ikinci dəyəri seçir.", en: "An empty array has length 0, which is falsy, so the ternary picks the second value." },
    },
    {
      kind: "choice",
      prompt: { az: "Hansı dəyər şərtdə doğru (truthy) sayılır?", en: "Which value is truthy in a condition?" },
      options: ["`0`", "`\"\"`", "`\"0\"`"],
      answer: 2,
      explain: { az: "`\"0\"` boş olmayan sətirdir, ona görə truthy-dir. `0` və boş sətir falsy-dir.", en: "`\"0\"` is a non-empty string, so it is truthy. `0` and the empty string are falsy." },
    },
  ],
  terms: [
    { en: "strict equality", local: { az: "ciddi bərabərlik", tr: "katı eşitlik", ru: "строгое равенство" } },
    { en: "type coercion", local: { az: "tipin avtomatik çevrilməsi", tr: "tür zorlaması", ru: "приведение типов" } },
    { en: "truthy / falsy", local: { az: "doğru / yalan sayılan", tr: "doğru / yanlış sayılan", ru: "истинноподобное / ложноподобное" } },
    { en: "ternary operator", local: { az: "ternar operator", tr: "üçlü operatör", ru: "тернарный оператор" } },
  ],
  related: ["javascript-variables", "python-conditions", "javascript-arrays"],
  sources: [
    { title: "MDN — if...else", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/if...else" },
    { title: "MDN — Equality comparisons and sameness", url: "https://developer.mozilla.org/docs/Web/JavaScript/Equality_comparisons_and_sameness" },
    { title: "MDN — Falsy", url: "https://developer.mozilla.org/docs/Glossary/Falsy" },
    { title: "MDN — Conditional (ternary) operator", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Conditional_operator" },
  ],
  reviewedAt: "2026-11-22",
  verification: "authored",
};

export default lesson;
