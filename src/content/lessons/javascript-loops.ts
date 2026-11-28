import type { Lesson } from "../types";

const lesson: Lesson = {
  id: "javascript-loops",
  language: "javascript",
  order: 6,
  level: "beginner",
  title: { az: "Dövrlər: for, for...of və while", en: "Loops: for, for...of and while" },
  simple: {
    az: "Dövr eyni işi təkrarlamaq üçündür, sanki pilləkənlə qalxırsınız: hər addımda eyni hərəkət, sadəcə pillənin nömrəsi dəyişir. `for` neçə pillə olduğunu əvvəlcədən bilir, `for...of` səbətdəki hər şeyi bir-bir götürür, `while` isə \"hələ çatmamışam\" dediyi müddətcə davam edir.",
    en: "A loop repeats the same job, like climbing stairs: the same move on every step, only the step number changes. `for` knows how many steps there are, `for...of` takes each item from a basket one by one, and `while` keeps going as long as it says \"not there yet\".",
  },
  intro: {
    what: {
      az: "Dövr (loop) bir kod blokunu şərt doğru olduğu müddətcə və ya kolleksiyadakı hər element üçün təkrar işlədir.",
      en: "A loop runs a block of code repeatedly: while a condition is true, or once for every item in a collection.",
    },
    why: {
      az: "100 dəfə eyni sətri yazmaq əvəzinə bir dəfə yazırıq. Siyahıları emal etmək, cəm hesablamaq, axtarmaq — hamısı dövrlə edilir.",
      en: "Instead of writing the same line 100 times, you write it once. Processing lists, adding up totals, searching — all of it uses loops.",
    },
    where: {
      az: "Məhsul siyahısını göstərmək, cədvəl sətirlərini emal etmək, oyunun hər kadrı, API-dən gələn məlumatı gəzmək.",
      en: "Showing a product list, processing table rows, every frame of a game, walking through data from an API.",
    },
  },
  syntax: {
    code: "for (let i = 0; i < 3; i++) {\n  console.log(i);\n}",
    lang: "javascript",
    parts: [
      { token: "let i = 0", role: { az: "Başlanğıc: sayğac 0-dan başlayır (bir dəfə işləyir).", en: "Start: the counter begins at 0 (runs once)." } },
      { token: "i < 3", role: { az: "Şərt: hər addımdan əvvəl yoxlanır; `false` olanda dövr bitir.", en: "Condition: checked before every step; the loop ends when it is `false`." } },
      { token: "i++", role: { az: "Hər addımdan sonra sayğacı 1 artırır.", en: "Adds 1 to the counter after every step." } },
      { token: "{ }", role: { az: "Dövrün gövdəsi: hər addımda işləyən kod.", en: "The loop body: the code that runs on every step." } },
    ],
  },
  examples: [
    {
      title: { az: "Sadə nümunə: sayğaclı for", en: "Simple example: a counting for loop" },
      lang: "javascript",
      code: "for (let i = 1; i <= 3; i++) {\n  console.log(`Step ${i}`);\n}",
      lines: [
        { az: "`i` 1-dən başlayır, 3-ə qədər (3 daxil) hər dəfə 1 artır.", en: "`i` starts at 1 and goes up by 1 until 3 (inclusive)." },
        { az: "Hər addımda addımın nömrəsi çıxır.", en: "Prints the step number on every pass." },
        { az: "Dövr bitir.", en: "End of the loop." },
      ],
      output: "Step 1\nStep 2\nStep 3",
    },
    {
      title: { az: "Orta nümunə: for...of və continue", en: "Intermediate example: for...of and continue" },
      lang: "javascript",
      code: 'const fruits = ["apple", "pear", "plum"];\nfor (const fruit of fruits) {\n  if (fruit === "pear") continue;\n  console.log(fruit.toUpperCase());\n}',
      lines: [
        { az: "Üç meyvəli massiv.", en: "An array of three fruits." },
        { az: "`for...of` massivin hər elementini növbə ilə `fruit`-a verir — indeks lazım deyil.", en: "`for...of` hands each item to `fruit` in turn — no index needed." },
        { az: "`continue` bu addımı atlayıb növbətiyə keçir: armud çap olunmayacaq.", en: "`continue` skips the rest of this step and moves on: the pear is not printed." },
        { az: "Qalan meyvələr böyük hərflə çıxır.", en: "The other fruits are printed in capitals." },
        { az: "Dövr bitir.", en: "End of the loop." },
      ],
      output: "APPLE\nPLUM",
    },
    {
      title: { az: "Real nümunə: əmanət neçə aya böyüyür?", en: "Real-world example: how many months until savings grow?" },
      lang: "javascript",
      code: "let balance = 100;\nlet months = 0;\nwhile (balance < 150) {\n  balance = balance * 1.1;\n  months++;\n}\nconsole.log(months, Math.round(balance));",
      lines: [
        { az: "Başlanğıc məbləğ: 100.", en: "Starting amount: 100." },
        { az: "Ay sayğacı.", en: "A month counter." },
        { az: "`while` addımların sayını əvvəlcədən bilmədikdə istifadə olunur: məbləğ 150-yə çatana qədər davam et.", en: "`while` is used when you don't know the number of steps in advance: keep going until the balance reaches 150." },
        { az: "Hər ay 10% artım.", en: "10% growth every month." },
        { az: "Bir ay keçdi. Bu sətir olmasaydı dövr heç vaxt bitməzdi.", en: "One more month. Without changing `balance` the loop would never end." },
        { az: "Dövr bitir.", en: "End of the loop." },
        { az: "5 ay lazımdır; məbləğ təxminən 161 olur.", en: "It takes 5 months; the balance is about 161." },
      ],
      output: "5 161",
    },
  ],
  mistakes: [
    {
      title: { az: "Sonsuz dövr", en: "An endless loop" },
      wrong: "let i = 0;\nwhile (i < 3) {\n  console.log(i);\n}",
      right: "let i = 0;\nwhile (i < 3) {\n  console.log(i);\n  i++;\n}",
      why: {
        az: "Şərtdəki dəyişən dövrün içində dəyişmirsə, şərt həmişə doğru qalır və proqram donur. Code Lab belə kodu 3 saniyədən sonra dayandırır.",
        en: "If the variable in the condition never changes inside the loop, the condition stays true and the program hangs. Code Lab stops such code after 3 seconds.",
      },
    },
    {
      title: { az: "`<=` ilə massivdən kənara çıxmaq", en: "Going past the end with `<=`" },
      wrong: 'const a = ["x", "y"];\nfor (let i = 0; i <= a.length; i++) console.log(a[i]);',
      right: 'const a = ["x", "y"];\nfor (let i = 0; i < a.length; i++) console.log(a[i]);',
      why: {
        az: "Son indeks `length - 1`-dir. `<=` bir addım artıq gedir və `undefined` çıxır.",
        en: "The last index is `length - 1`. `<=` takes one step too many and prints `undefined`.",
      },
    },
    {
      title: { az: "Massiv üçün `for...in` istifadə etmək", en: "Using `for...in` on an array" },
      wrong: 'for (const x in ["a", "b"]) console.log(x); // "0", "1"',
      right: 'for (const x of ["a", "b"]) console.log(x); // "a", "b"',
      why: {
        az: "`for...in` açarları (indeksləri mətn kimi) verir, `for...of` isə dəyərləri. Massivlər üçün demək olar həmişə `for...of` lazımdır.",
        en: "`for...in` gives the keys (indexes, as strings); `for...of` gives the values. For arrays you almost always want `for...of`.",
      },
    },
  ],
  exercise: {
    objective: { az: "`for` dövrü ilə ardıcıl sətirlər çıxarmaq.", en: "Print a series of lines with a `for` loop." },
    task: {
      az: "`n = 7` üçün vurma cədvəlinin ilk 5 sətrini çıxarın: `7 x 1 = 7`, `7 x 2 = 14`, … `7 x 5 = 35`.",
      en: "For `n = 7`, print the first 5 lines of its multiplication table: `7 x 1 = 7`, `7 x 2 = 14`, … `7 x 5 = 35`.",
    },
    hints: [
      { az: "`for (let i = 1; i <= 5; i++)`", en: "`for (let i = 1; i <= 5; i++)`" },
      { az: "Dövrün içində: `` console.log(`${n} x ${i} = ${n * i}`); ``", en: "Inside the loop: `` console.log(`${n} x ${i} = ${n * i}`); ``" },
    ],
    solution: "const n = 7;\nfor (let i = 1; i <= 5; i++) {\n  console.log(`${n} x ${i} = ${n * i}`);\n}",
    lang: "javascript",
    check: { expected: "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35", starter: "const n = 7;\n" },
  },
  quiz: [
    {
      kind: "predict",
      prompt: { az: "Bu kod nə çıxarır?", en: "What does this code print?" },
      code: "let s = 0;\nfor (let i = 1; i <= 4; i++) s += i;\nconsole.log(s);",
      lang: "javascript",
      options: ["4", "10", "6"],
      answer: 1,
      explain: { az: "1 + 2 + 3 + 4 = 10.", en: "1 + 2 + 3 + 4 = 10." },
    },
    {
      kind: "choice",
      prompt: { az: "Addımların sayı əvvəlcədən bilinmirsə, adətən hansı dövr seçilir?", en: "Which loop do you usually pick when the number of steps isn't known in advance?" },
      options: ["for", "while", "for...of"],
      answer: 1,
      explain: { az: "`while` şərt doğru olduğu müddətcə işləyir, addım sayından asılı deyil.", en: "`while` runs as long as its condition is true, regardless of a step count." },
    },
    {
      kind: "predict",
      prompt: { az: "Konsolda nə görünəcək?", en: "What appears in the console?" },
      code: "for (const n of [1, 2, 3, 4]) {\n  if (n === 3) break;\n  console.log(n);\n}",
      lang: "javascript",
      options: ["1 2", "1 2 3", "1 2 4"],
      answer: 0,
      explain: { az: "`break` dövrü tamamilə dayandırır: 3-də çıxırıq, ona görə yalnız 1 və 2 çap olunur (ayrı sətirlərdə).", en: "`break` stops the loop entirely: we leave at 3, so only 1 and 2 are printed (on separate lines)." },
    },
  ],
  terms: [
    { en: "loop", local: { az: "dövr", tr: "döngü", ru: "цикл" } },
    { en: "iteration", local: { az: "iterasiya (addım)", tr: "yineleme", ru: "итерация" } },
    { en: "counter", local: { az: "sayğac", tr: "sayaç", ru: "счётчик" } },
    { en: "infinite loop", local: { az: "sonsuz dövr", tr: "sonsuz döngü", ru: "бесконечный цикл" } },
  ],
  related: ["javascript-arrays", "javascript-conditions", "python-loops"],
  sources: [
    { title: "MDN — Loops and iteration", url: "https://developer.mozilla.org/docs/Web/JavaScript/Guide/Loops_and_iteration" },
    { title: "MDN — for...of", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/for...of" },
  ],
  reviewedAt: "2026-11-28",
  verification: "authored",
};

export default lesson;
