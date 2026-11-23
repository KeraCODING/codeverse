import type { Lesson } from "../types";

const lesson: Lesson = {
  id: "javascript-arrays",
  language: "javascript",
  order: 4,
  level: "beginner",
  title: { az: "Massivlər (array)", en: "Arrays" },
  intro: {
    what: {
      az: "Massiv (array) dəyərləri sıra ilə saxlayan obyektdir. Kvadrat mötərizədə yazılır, elementlərə 0-dan başlayan indekslə müraciət olunur.",
      en: "An array is an object that stores values in order. It is written in square brackets, and items are accessed by an index starting at 0.",
    },
    why: {
      az: "Siyahı şəklində məlumat — məhsullar, şərhlər, nəticələr — massivdə saxlanılır. Massiv metodları (`map`, `filter`, `includes`) bu məlumatı qısa və aydın kodla emal etməyə imkan verir.",
      en: "List-shaped data — products, comments, results — lives in arrays. Array methods (`map`, `filter`, `includes`) let you process it with short, clear code.",
    },
    where: {
      az: "API-dən gələn JSON siyahıları, React-də siyahıların göstərilməsi, səbətdəki məhsullar.",
      en: "JSON lists from APIs, rendering lists in React, items in a shopping cart.",
    },
  },
  syntax: {
    code: 'const fruits = ["apple", "pear"];\nfruits.push("plum");',
    lang: "javascript",
    parts: [
      { token: "[ ]", role: { az: "Massiv literalı.", en: "An array literal." } },
      { token: '"apple", "pear"', role: { az: "Vergüllə ayrılmış elementlər.", en: "Comma-separated items." } },
      { token: "fruits.push(…)", role: { az: "Metod çağırışı: `push` elementi massivin sonuna əlavə edir və yeni uzunluğu qaytarır.", en: "A method call: `push` adds an item to the end and returns the new length." } },
    ],
  },
  examples: [
    {
      title: { az: "Sadə nümunə: indeks və uzunluq", en: "Simple example: index and length" },
      lang: "javascript",
      code: 'const colors = ["red", "green", "blue"];\nconsole.log(colors[0]);\nconsole.log(colors.length);\nconsole.log(colors[colors.length - 1]);',
      lines: [
        { az: "Üç elementli massiv.", en: "A three-item array." },
        { az: "Birinci element: `red`.", en: "The first item: `red`." },
        { az: "`length` elementlərin sayıdır: 3.", en: "`length` is the number of items: 3." },
        { az: "Son elementin indeksi `length - 1`-dir: `blue`.", en: "The last item's index is `length - 1`: `blue`." },
      ],
      output: "red\n3\nblue",
    },
    {
      title: { az: "Orta nümunə: for...of və includes", en: "Intermediate example: for...of and includes" },
      lang: "javascript",
      code: 'const tags = ["js", "css", "html"];\nfor (const tag of tags) {\n  console.log(tag.toUpperCase());\n}\nconsole.log(tags.includes("css"));',
      lines: [
        { az: "Teqlər massivi.", en: "An array of tags." },
        { az: "`for...of` massivin hər elementini növbə ilə `tag`-a verir.", en: "`for...of` gives each item to `tag` in turn." },
        { az: "`toUpperCase()` sətri böyük hərflərə çevirir.", en: "`toUpperCase()` converts the string to capitals." },
        { az: "Dövr bitir.", en: "End of the loop." },
        { az: "`includes` dəyərin massivdə olub-olmadığını yoxlayır: `true`.", en: "`includes` checks whether the value is in the array: `true`." },
      ],
      output: "JS\nCSS\nHTML\ntrue",
    },
    {
      title: { az: "Real nümunə: map və filter ilə qiymətlər", en: "Real-world example: prices with map and filter" },
      lang: "javascript",
      code: 'const prices = [12, 45, 8, 30];\nconst withTax = prices.map((p) => p * 1.18);\nconst cheap = prices.filter((p) => p < 20);\nconsole.log(cheap);\nconsole.log(withTax.length);',
      lines: [
        { az: "Qiymətlər massivi.", en: "An array of prices." },
        { az: "`map` hər elementə funksiya tətbiq edib **yeni** massiv qaytarır (18% ƏDV əlavə olunur). Orijinal massiv dəyişmir.", en: "`map` applies a function to every item and returns a **new** array (adding 18% VAT). The original is unchanged." },
        { az: "`filter` yalnız şərti ödəyən elementlərdən yeni massiv yaradır.", en: "`filter` builds a new array of only the items that pass the test." },
        { az: "`[12, 8]` çıxır.", en: "Logs `[12, 8]`." },
        { az: "`map` həmişə eyni sayda element qaytarır: 4.", en: "`map` always returns the same number of items: 4." },
      ],
      output: "[ 12, 8 ]\n4",
    },
  ],
  mistakes: [
    {
      title: { az: "`length` indeksini son element sanmaq", en: "Treating `length` as the last index" },
      wrong: 'const a = [1, 2, 3];\nconsole.log(a[a.length]); // undefined',
      right: 'const a = [1, 2, 3];\nconsole.log(a[a.length - 1]); // 3\nconsole.log(a.at(-1));       // 3',
      why: {
        az: "İndekslər 0-dan başladığı üçün son indeks `length - 1`-dir. JavaScript xəta vermir, sadəcə `undefined` qaytarır — bu, səhvi gizlədir. `at(-1)` sondan saymağın müasir yoludur.",
        en: "Because indexes start at 0, the last index is `length - 1`. JavaScript does not throw — it quietly returns `undefined`, hiding the bug. `at(-1)` is the modern way to count from the end.",
      },
    },
    {
      title: { az: "`map` nəticəsini istifadə etməmək", en: "Ignoring the result of `map`" },
      wrong: 'const nums = [1, 2, 3];\nnums.map((n) => n * 2);\nconsole.log(nums); // [1, 2, 3]',
      right: 'const nums = [1, 2, 3];\nconst doubled = nums.map((n) => n * 2);\nconsole.log(doubled); // [2, 4, 6]',
      why: {
        az: "`map` orijinal massivi dəyişmir, yeni massiv qaytarır. Nəticəni dəyişənə yazmasanız iş itir.",
        en: "`map` does not modify the original array; it returns a new one. If you do not store the result, the work is lost.",
      },
    },
    {
      title: { az: "`const` massivin dəyişməz olduğunu düşünmək", en: "Thinking a `const` array cannot change" },
      wrong: '// "const array cannot be modified"\nconst list = [1];',
      right: 'const list = [1];\nlist.push(2);   // allowed: [1, 2]\n// list = [3]; // TypeError',
      why: {
        az: "`const` yalnız `list` adının başqa massivə bağlanmasını qadağan edir; massivin içi dəyişdirilə bilər.",
        en: "`const` only stops `list` from being bound to another array; the array's contents can still change.",
      },
    },
  ],
  exercise: {
    objective: { az: "`filter` və `map` ilə massivi emal etmək.", en: "Process an array with `filter` and `map`." },
    task: {
      az: "`const nums = [3, 8, 15, 4, 10];` massivindən 5-dən böyük ədədləri seçin, onları 10-a vurun və nəticəni çıxarın: `[80, 150, 100]`.",
      en: "From `const nums = [3, 8, 15, 4, 10];` select the numbers greater than 5, multiply them by 10 and log the result: `[80, 150, 100]`.",
    },
    hints: [
      { az: "Əvvəl `filter((n) => n > 5)`.", en: "First `filter((n) => n > 5)`." },
      { az: "Metodları zəncirləmək olar: `nums.filter(...).map(...)`.", en: "Methods can be chained: `nums.filter(...).map(...)`." },
    ],
    solution: 'const nums = [3, 8, 15, 4, 10];\nconst result = nums.filter((n) => n > 5).map((n) => n * 10);\nconsole.log(result);',
    lang: "javascript",
    check: { expected: "[ 80, 150, 100 ]", starter: "const nums = [3, 8, 15, 4, 10];\n" },
  },
  quiz: [
    {
      kind: "predict",
      prompt: { az: "Konsolda nə görünür?", en: "What appears in the console?" },
      code: 'const a = ["x", "y", "z"];\nconsole.log(a[1]);',
      lang: "javascript",
      options: ["x", "y", "z"],
      answer: 1,
      explain: { az: "İndeks 0-dan başlayır: `a[1]` ikinci elementdir.", en: "Indexes start at 0: `a[1]` is the second item." },
    },
    {
      kind: "predict",
      prompt: { az: "Nəticə nədir?", en: "What is the result?" },
      code: 'const n = [1, 2, 3, 4];\nconsole.log(n.filter((x) => x % 2 === 0));',
      lang: "javascript",
      options: ["[ 1, 3 ]", "[ 2, 4 ]", "2"],
      answer: 1,
      explain: { az: "`x % 2 === 0` cüt ədədləri seçir; `filter` massiv qaytarır: `[2, 4]`.", en: "`x % 2 === 0` selects even numbers; `filter` returns an array: `[2, 4]`." },
    },
    {
      kind: "choice",
      prompt: { az: "Hansı metod massivin sonuna element əlavə edir?", en: "Which method adds an item to the end of an array?" },
      options: ["`push`", "`pop`", "`map`"],
      answer: 0,
      explain: { az: "`push` sona əlavə edir, `pop` sonuncu elementi silir, `map` isə yeni massiv yaradır.", en: "`push` adds to the end, `pop` removes the last item, and `map` creates a new array." },
    },
  ],
  terms: [
    { en: "array", local: { az: "massiv", tr: "dizi", ru: "массив" } },
    { en: "index", local: { az: "indeks", tr: "indeks", ru: "индекс" } },
    { en: "method chaining", local: { az: "metodların zəncirlənməsi", tr: "metot zincirleme", ru: "цепочка методов" } },
    { en: "callback", local: { az: "geri çağırış funksiyası", tr: "geri çağırma fonksiyonu", ru: "функция обратного вызова" } },
  ],
  related: ["javascript-functions", "python-lists", "javascript-conditions"],
  sources: [
    { title: "MDN — Array", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array" },
    { title: "MDN — Array.prototype.map()", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map" },
    { title: "MDN — Array.prototype.filter()", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter" },
    { title: "MDN — for...of", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/for...of" },
  ],
  reviewedAt: "2026-11-22",
  verification: "authored",
};

export default lesson;
