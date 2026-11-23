import type { Lesson } from "../types";

const lesson: Lesson = {
  id: "javascript-functions",
  language: "javascript",
  order: 2,
  level: "beginner",
  title: { az: "Funksiyalar", en: "Functions" },
  intro: {
    what: {
      az: "Funksiya (function) — adı olan, təkrar istifadə edilə bilən kod blokudur. Giriş dəyərləri (parametrlər) qəbul edir və `return` ilə nəticə qaytara bilər.",
      en: "A function is a named, reusable block of code. It accepts inputs (parameters) and can give back a result with `return`.",
    },
    why: {
      az: "Eyni kodu bir neçə yerdə təkrar yazmaq əvəzinə bir dəfə funksiya kimi yazıb istənilən qədər çağırırıq. Kod qısa, oxunaqlı və test etmək asan olur.",
      en: "Instead of repeating the same code in many places, you write it once as a function and call it as often as you like. Code becomes shorter, clearer and easier to test.",
    },
    where: {
      az: "Düymə kliklərinə reaksiyada, hesablamalarda, API sorğularında, React komponentlərində (onlar da funksiyadır).",
      en: "Reacting to button clicks, calculations, API requests, React components (which are functions too).",
    },
  },
  syntax: {
    code: 'function add(a, b) {\n  return a + b;\n}',
    lang: "javascript",
    parts: [
      { token: "function", role: { az: "Funksiya elanı açar sözü.", en: "The function declaration keyword." } },
      { token: "add", role: { az: "Funksiyanın adı; onu bu adla çağıracağıq.", en: "The function name; we will call it by this name." } },
      { token: "(a, b)", role: { az: "Parametrlər — funksiyaya ötürülən dəyərlər üçün yer tutan adlar.", en: "Parameters — placeholder names for the values passed in." } },
      { token: "{ }", role: { az: "Funksiyanın gövdəsi: çağırıldıqda işləyən kod.", en: "The function body: the code that runs when it is called." } },
      { token: "return", role: { az: "Nəticəni çağırana qaytarır və funksiyanı dərhal bitirir. Yoxdursa funksiya `undefined` qaytarır.", en: "Sends the result back to the caller and ends the function immediately. Without it, the function returns `undefined`." } },
    ],
  },
  examples: [
    {
      title: { az: "Sadə nümunə: elan və çağırış", en: "Simple example: declaring and calling" },
      lang: "javascript",
      code: 'function add(a, b) {\n  return a + b;\n}\nconst result = add(2, 3);\nconsole.log(result);',
      lines: [
        { az: "`add` adlı funksiya elan olunur, iki parametri var.", en: "Declares a function `add` with two parameters." },
        { az: "`a + b` hesablanır və qaytarılır.", en: "Computes `a + b` and returns it." },
        { az: "Funksiyanın gövdəsi bitir.", en: "End of the function body." },
        { az: "Funksiya çağırılır: `a` = 2, `b` = 3 (bunlar arqumentlərdir). Qaytarılan 5 `result`-a yazılır.", en: "Calls the function: `a` = 2, `b` = 3 (these are the arguments). The returned 5 is stored in `result`." },
        { az: "5 çıxır.", en: "Prints 5." },
      ],
      output: "5",
    },
    {
      title: { az: "Orta nümunə: ox funksiyası və standart parametr", en: "Intermediate example: arrow function and default parameter" },
      lang: "javascript",
      code: 'const greet = (name = "guest") => `Hello, ${name}!`;\nconsole.log(greet("Aysel"));\nconsole.log(greet());',
      lines: [
        { az: "Ox funksiyası (`=>`) `const` dəyişəninə yazılır. `name = \"guest\"` — arqument verilməsə istifadə olunan standart dəyər. Gövdə tək ifadədirsə `return` yazmadan nəticə qaytarılır.", en: "An arrow function (`=>`) stored in a `const`. `name = \"guest\"` is the default used when no argument is passed. A single-expression body is returned without writing `return`." },
        { az: "Arqument verilir: `Hello, Aysel!`.", en: "An argument is passed: `Hello, Aysel!`." },
        { az: "Arqument yoxdur, standart dəyər işləyir: `Hello, guest!`.", en: "No argument, so the default is used: `Hello, guest!`." },
      ],
      output: "Hello, Aysel!\nHello, guest!",
    },
    {
      title: { az: "Real nümunə: endirimli qiymət", en: "Real-world example: discounted price" },
      lang: "javascript",
      code: 'function finalPrice(price, discountPercent) {\n  const discount = price * discountPercent / 100;\n  return price - discount;\n}\nconsole.log(finalPrice(80, 25));',
      lines: [
        { az: "İki parametrli funksiya: qiymət və endirim faizi.", en: "A function with two parameters: price and discount percentage." },
        { az: "Endirim məbləği hesablanır: 80 * 25 / 100 = 20. `discount` yalnız funksiyanın içində görünür.", en: "Computes the discount amount: 80 * 25 / 100 = 20. `discount` exists only inside the function." },
        { az: "Yekun qiymət qaytarılır: 60.", en: "Returns the final price: 60." },
        { az: "Funksiya bitir.", en: "End of the function." },
        { az: "Funksiyanı çağırıb nəticəni çıxarır.", en: "Calls the function and prints the result." },
      ],
      output: "60",
    },
  ],
  mistakes: [
    {
      title: { az: "`return`-u unutmaq", en: "Forgetting `return`" },
      wrong: 'function double(n) {\n  n * 2;\n}\nconsole.log(double(4)); // undefined',
      right: 'function double(n) {\n  return n * 2;\n}\nconsole.log(double(4)); // 8',
      why: {
        az: "Fiqurlu mötərizəli gövdədə `return` yazılmasa funksiya `undefined` qaytarır — hesablama aparılır, amma nəticə itir.",
        en: "In a braced body, without `return` the function returns `undefined` — the calculation happens but the result is lost.",
      },
    },
    {
      title: { az: "Funksiyanı çağırmaq əvəzinə ona istinad etmək", en: "Referring to a function instead of calling it" },
      wrong: 'function now() { return Date.now(); }\nconsole.log(now);',
      right: 'function now() { return Date.now(); }\nconsole.log(now());',
      why: {
        az: "Mötərizəsiz `now` funksiyanın özüdür, nəticəsi deyil. Çağırmaq üçün `now()` yazmaq lazımdır.",
        en: "`now` without parentheses is the function itself, not its result. Write `now()` to call it.",
      },
    },
    {
      title: { az: "`const` ox funksiyasını elandan əvvəl çağırmaq", en: "Calling a `const` arrow function before its declaration" },
      wrong: 'sayHi();\nconst sayHi = () => console.log("Hi");',
      right: 'const sayHi = () => console.log("Hi");\nsayHi();',
      why: {
        az: "`function` elanları qaldırılır (hoisting) və əvvəlcədən çağırıla bilər, amma `const`-a yazılmış funksiya elan sətrindən əvvəl əlçatan deyil: `ReferenceError`.",
        en: "`function` declarations are hoisted and can be called earlier, but a function stored in a `const` is not available before its declaration line: `ReferenceError`.",
      },
    },
  ],
  exercise: {
    objective: { az: "Parametr qəbul edən və nəticə qaytaran funksiya yazmaq.", en: "Write a function that takes parameters and returns a result." },
    task: {
      az: "`area(width, height)` funksiyasını yazın: düzbucaqlının sahəsini qaytarsın. Sonra `area(4, 5)` nəticəsini konsola çıxarın (20 olmalıdır).",
      en: "Write `area(width, height)` that returns a rectangle's area. Then log the result of `area(4, 5)` (it should be 20).",
    },
    hints: [
      { az: "Sahə = en × hündürlük; JavaScript-də vurma `*` operatorudur.", en: "Area = width × height; in JavaScript, multiplication is `*`." },
      { az: "Nəticəni çap etmək yox, `return` ilə qaytarmaq lazımdır; çap etmək çağırışdan sonra gəlir.", en: "Return the result with `return`, don't print inside; printing comes after the call." },
    ],
    solution: 'function area(width, height) {\n  return width * height;\n}\nconsole.log(area(4, 5));',
    lang: "javascript",
    check: { expected: "20", starter: "function area(width, height) {\n  \n}\nconsole.log(area(4, 5));\n" },
  },
  quiz: [
    {
      kind: "predict",
      prompt: { az: "Bu kod nə çıxarır?", en: "What does this code print?" },
      code: 'function f(x) {\n  x + 1;\n}\nconsole.log(f(1));',
      lang: "javascript",
      options: ["2", "1", "undefined"],
      answer: 2,
      explain: { az: "`return` yoxdur, ona görə funksiya `undefined` qaytarır.", en: "There is no `return`, so the function returns `undefined`." },
    },
    {
      kind: "predict",
      prompt: { az: "Konsolda nə görünəcək?", en: "What will appear in the console?" },
      code: 'const square = (n) => n * n;\nconsole.log(square(3));',
      lang: "javascript",
      options: ["6", "9", "undefined"],
      answer: 1,
      explain: { az: "Tək ifadəli ox funksiyası nəticəni avtomatik qaytarır: 3 * 3 = 9.", en: "A single-expression arrow function returns its result automatically: 3 * 3 = 9." },
    },
    {
      kind: "choice",
      prompt: { az: "`add(2, 3)` çağırışında `2` və `3` necə adlanır?", en: "In the call `add(2, 3)`, what are `2` and `3` called?" },
      options: [{ az: "Parametrlər", en: "Parameters" }, { az: "Arqumentlər", en: "Arguments" }, { az: "Dəyişənlər", en: "Variables" }],
      answer: 1,
      explain: { az: "Çağırışda ötürülən dəyərlər arqumentdir; funksiya elanındakı adlar (`a`, `b`) isə parametrdir.", en: "Values passed in a call are arguments; the names in the declaration (`a`, `b`) are parameters." },
    },
  ],
  terms: [
    { en: "function", local: { az: "funksiya", tr: "fonksiyon", ru: "функция" } },
    { en: "parameter", local: { az: "parametr", tr: "parametre", ru: "параметр" } },
    { en: "argument", local: { az: "arqument", tr: "argüman", ru: "аргумент" } },
    { en: "return value", local: { az: "qaytarılan dəyər", tr: "dönüş değeri", ru: "возвращаемое значение" } },
    { en: "arrow function", local: { az: "ox funksiyası", tr: "ok fonksiyonu", ru: "стрелочная функция" } },
  ],
  related: ["javascript-variables", "javascript-arrays", "python-functions"],
  sources: [
    { title: "MDN — Functions guide", url: "https://developer.mozilla.org/docs/Web/JavaScript/Guide/Functions" },
    { title: "MDN — Arrow function expressions", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions" },
    { title: "MDN — Default parameters", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Default_parameters" },
  ],
  reviewedAt: "2026-11-22",
  verification: "authored",
};

export default lesson;
