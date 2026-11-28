import type { Lesson } from "../types";

const lesson: Lesson = {
  id: "javascript-variables",
  language: "javascript",
  order: 1,
  level: "absolute",
  title: { az: "Dəyişənlər: let, const və var", en: "Variables: let, const and var" },
  simple: {
    az: "Dəyişən üzərində etiket olan qutudur. `const` möhürlənmiş qutudur: içinə bir dəfə qoyursunuz, sonra başqa şeylə əvəz etmək olmur. `let` adi qutudur: içindəkini istədiyiniz vaxt dəyişə bilərsiniz. `var` köhnə üsuldur, müasir kodda demək olar istifadə olunmur.",
    en: "A variable is a box with a label. `const` is a sealed box: you put something in once and can't swap it for something else. `let` is an ordinary box: you can change what's inside whenever you like. `var` is the old way and is rarely used in modern code.",
  },
  intro: {
    what: {
      az: "JavaScript-də dəyişən üç açar sözlə elan edilir: `let` (dəyəri dəyişə bilər), `const` (yenidən mənimsədilə bilməz) və köhnə `var`.",
      en: "In JavaScript a variable is declared with one of three keywords: `let` (can be reassigned), `const` (cannot be reassigned) and the older `var`.",
    },
    why: {
      az: "Düzgün açar söz seçmək səhvlərin qarşısını alır: `const` təsadüfən dəyərin üzərinə yazmağa imkan vermir, `let` isə yalnız öz blokunda görünür.",
      en: "Choosing the right keyword prevents bugs: `const` stops accidental overwrites, and `let` is visible only inside its block.",
    },
    where: {
      az: "Brauzer skriptlərində, Node.js serverlərində, React komponentlərində — hər yerdə.",
      en: "Everywhere: browser scripts, Node.js servers, React components.",
    },
  },
  syntax: {
    code: 'const name = "Aysel";',
    lang: "javascript",
    parts: [
      { token: "const", role: { az: "Elan açar sözü. Bu ad başqa dəyərə yenidən mənimsədilə bilməz.", en: "Declaration keyword. The name cannot be reassigned to another value." } },
      { token: "name", role: { az: "Dəyişənin adı. Hərf, `_` və ya `$` ilə başlamalıdır; böyük-kiçik hərf fərqlənir.", en: "The variable name. It must start with a letter, `_` or `$`; it is case-sensitive." } },
      { token: "=", role: { az: "Mənimsətmə operatoru.", en: "The assignment operator." } },
      { token: '"Aysel"', role: { az: "Dəyər — sətir (string). Tək dırnaq, cüt dırnaq və ya `` ` `` istifadə oluna bilər.", en: "The value — a string. Single quotes, double quotes or backticks can be used." } },
      { token: ";", role: { az: "Nöqtəli vergül ifadənin sonunu bildirir. Çox vaxt avtomatik əlavə olunur, amma yazmaq tövsiyə olunur.", en: "The semicolon ends the statement. It is often inserted automatically, but writing it is recommended." } },
    ],
  },
  examples: [
    {
      title: { az: "Sadə nümunə: let və const", en: "Simple example: let and const" },
      lang: "javascript",
      code: 'let score = 10;\nscore = score + 5;\nconst max = 100;\nconsole.log(score, max);',
      lines: [
        { az: "`let` ilə dəyişən yaradılır, dəyəri 10.", en: "`let` creates a variable with the value 10." },
        { az: "`let` dəyişəni yenidən mənimsədilə bilər: indi 15-dir.", en: "A `let` variable can be reassigned: it is now 15." },
        { az: "`const` sabit ad yaradır; dəyəri dəyişməyəcək.", en: "`const` creates a binding that will not be reassigned." },
        { az: "`console.log` dəyərləri konsola çıxarır.", en: "`console.log` writes the values to the console." },
      ],
      output: "15 100",
    },
    {
      title: { az: "Orta nümunə: blok sahəsi (block scope)", en: "Intermediate example: block scope" },
      lang: "javascript",
      code: 'let message = "outside";\nif (true) {\n  let message = "inside";\n  console.log(message);\n}\nconsole.log(message);',
      lines: [
        { az: "Xarici `message` dəyişəni.", en: "The outer `message` variable." },
        { az: "Fiqurlu mötərizə yeni blok açır.", en: "The braces open a new block." },
        { az: "Blokun içində eyni adla yeni `let` dəyişəni — yalnız bu blokda mövcuddur.", en: "A new `let` variable with the same name — it exists only in this block." },
        { az: "Daxili dəyəri çıxarır: `inside`.", en: "Prints the inner value: `inside`." },
        { az: "Blok bitir; daxili dəyişən yox olur.", en: "The block ends; the inner variable disappears." },
        { az: "Xarici dəyişən dəyişməyib: `outside`.", en: "The outer variable is unchanged: `outside`." },
      ],
      output: "inside\noutside",
    },
    {
      title: { az: "Real nümunə: şablon sətir ilə salamlama", en: "Real-world example: greeting with a template literal" },
      lang: "javascript",
      code: 'const user = "Aysel";\nconst unread = 3;\nconst text = `Salam, ${user}! ${unread} yeni mesajın var.`;\nconsole.log(text);',
      lines: [
        { az: "İstifadəçinin adı dəyişməyəcək, ona görə `const`.", en: "The user's name will not change, so `const`." },
        { az: "Oxunmamış mesajların sayı.", en: "The number of unread messages." },
        { az: "Şablon sətir (template literal) `` ` `` işarəsi ilə yazılır; `${...}` içindəki ifadə mətnə qoyulur.", en: "A template literal uses backticks; the expression inside `${...}` is inserted into the text." },
        { az: "Hazır mətni çıxarır.", en: "Prints the finished text." },
      ],
      output: "Salam, Aysel! 3 yeni mesajın var.",
    },
  ],
  mistakes: [
    {
      title: { az: "`const` dəyişənini yenidən mənimsətmək", en: "Reassigning a `const`" },
      wrong: 'const total = 10;\ntotal = 20;',
      right: 'let total = 10;\ntotal = 20;',
      why: {
        az: "`const` ilə elan edilmiş ad yenidən mənimsədilə bilməz: `TypeError: Assignment to constant variable.` Dəyər dəyişəcəksə `let` istifadə edin.",
        en: "A `const` binding cannot be reassigned: `TypeError: Assignment to constant variable.` Use `let` if the value will change.",
      },
    },
    {
      title: { az: "Elan edilməmişdən əvvəl istifadə", en: "Using a variable before its declaration" },
      wrong: 'console.log(city);\nlet city = "Baku";',
      right: 'let city = "Baku";\nconsole.log(city);',
      why: {
        az: "`let` və `const` dəyişənləri elan sətrindən əvvəl əlçatan deyil (\"temporal dead zone\"): `ReferenceError: Cannot access 'city' before initialization`.",
        en: "`let` and `const` variables cannot be used before their declaration line (the \"temporal dead zone\"): `ReferenceError: Cannot access 'city' before initialization`.",
      },
    },
    {
      title: { az: "`const` obyekti tamamilə dəyişməz sanmaq", en: "Thinking a `const` object is fully immutable" },
      wrong: '// "const means the object cannot change"\nconst user = { name: "Ali" };',
      right: 'const user = { name: "Ali" };\nuser.name = "Aysel"; // allowed\n// user = {};        // TypeError',
      why: {
        az: "`const` yalnız adın başqa dəyərə bağlanmasını qadağan edir. Obyektin daxili xassələri dəyişdirilə bilər.",
        en: "`const` only prevents binding the name to another value. The object's properties can still be changed.",
      },
    },
  ],
  exercise: {
    objective: { az: "`let` və `const` arasında düzgün seçim etmək.", en: "Choose correctly between `let` and `const`." },
    task: {
      az: "Məhsulun adını (`product`, dəyişmir) və anbardakı sayını (`stock`, dəyişir, başlanğıc dəyəri 5) saxlayın. Sonra `stock`-u 1 azaldın və `Notebook: 4 left` kimi mətn çıxarın.",
      en: "Store a product name (`product`, does not change) and its stock count (`stock`, changes, starting at 5). Then decrease `stock` by 1 and log text like `Notebook: 4 left`.",
    },
    hints: [
      { az: "Dəyişməyən dəyər üçün `const`, dəyişən üçün `let`.", en: "`const` for the value that stays the same, `let` for the one that changes." },
      { az: "Azaltmaq üçün `stock = stock - 1` və ya `stock--` yazın; mətn üçün şablon sətir istifadə edin.", en: "Decrease with `stock = stock - 1` or `stock--`; use a template literal for the text." },
    ],
    solution: 'const product = "Notebook";\nlet stock = 5;\nstock = stock - 1;\nconsole.log(`${product}: ${stock} left`);',
    lang: "javascript",
    check: { expected: "Notebook: 4 left", starter: "// product and stock\n" },
  },
  quiz: [
    {
      kind: "predict",
      prompt: { az: "Bu kodun nəticəsi nədir?", en: "What is the result of this code?" },
      code: 'const a = 1;\na = 2;\nconsole.log(a);',
      lang: "javascript",
      options: ["1", "2", "TypeError"],
      answer: 2,
      explain: { az: "`const` adı yenidən mənimsədilə bilməz, ikinci sətir `TypeError` verir.", en: "A `const` binding cannot be reassigned; line two throws a `TypeError`." },
    },
    {
      kind: "choice",
      prompt: { az: "Dəyəri sonradan dəyişəcək dəyişən üçün hansı açar söz tövsiyə olunur?", en: "Which keyword is recommended for a variable whose value will change?" },
      options: ["`const`", "`let`", "`var`"],
      answer: 1,
      explain: { az: "`let` yenidən mənimsətməyə icazə verir və blok sahəsinə malikdir. `var` köhnədir və funksiya sahəsinə malikdir.", en: "`let` allows reassignment and is block-scoped. `var` is older and function-scoped." },
    },
    {
      kind: "predict",
      prompt: { az: "Konsolda nə görünəcək?", en: "What will appear in the console?" },
      code: 'const n = 3;\nconsole.log(`n = ${n * 2}`);',
      lang: "javascript",
      options: ["n = 6", "n = ${n * 2}", "n = 32"],
      answer: 0,
      explain: { az: "Şablon sətirdə `${...}` içindəki ifadə hesablanır: 3 * 2 = 6.", en: "In a template literal the expression inside `${...}` is evaluated: 3 * 2 = 6." },
    },
  ],
  terms: [
    { en: "declaration", local: { az: "elan", tr: "bildirim", ru: "объявление" } },
    { en: "scope", local: { az: "görünmə sahəsi", tr: "kapsam", ru: "область видимости" } },
    { en: "constant", local: { az: "sabit", tr: "sabit", ru: "константа" } },
    { en: "template literal", local: { az: "şablon sətir", tr: "şablon dizesi", ru: "шаблонная строка" } },
  ],
  related: ["javascript-conditions", "javascript-functions", "python-variables"],
  sources: [
    { title: "ECMAScript — Let and Const Declarations", url: "https://tc39.es/ecma262/#sec-let-and-const-declarations" },
    { title: "MDN — let", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/let" },
    { title: "MDN — const", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/const" },
    { title: "MDN — Template literals", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals" },
  ],
  reviewedAt: "2026-11-22",
  verification: "authored",
};

export default lesson;
