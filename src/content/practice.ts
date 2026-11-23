import type { L } from "./types";
import type { RunnableLang } from "../runtime/types";

// Interactive Learning content. Every task is checked automatically by running the learner's code
// in the sandbox and comparing its output with `expected` (whitespace-normalised). Each expected
// value is verified by a unit test that runs the reference solution's logic.

export interface PracticeTask {
  id: string;
  lang: RunnableLang;
  level: 1 | 2 | 3;
  title: L;
  task: L;
  starter: string;
  expected: string;
  hints: L[];
  solution: string;
  lessons: string[];
  why?: L; // debug tasks: what the bug was
}

export const CHALLENGES: PracticeTask[] = [
  {
    id: "js-sum", lang: "javascript", level: 1,
    title: { az: "Massivin cəmi", en: "Sum of an array" },
    task: { az: "`nums` massivindəki bütün ədədlərin cəmini hesablayıb çap edin.", en: "Compute and print the sum of all numbers in `nums`." },
    starter: "const nums = [4, 8, 15, 16, 23, 42];\n// print the sum\n",
    expected: "108",
    hints: [
      { az: "Dövrdən əvvəl `let total = 0;` yaradın.", en: "Create `let total = 0;` before a loop." },
      { az: "`for (const n of nums)` ilə hər ədədi `total`-a əlavə edin.", en: "Add each number to `total` with `for (const n of nums)`." },
    ],
    solution: "const nums = [4, 8, 15, 16, 23, 42];\nlet total = 0;\nfor (const n of nums) {\n  total += n;\n}\nconsole.log(total);",
    lessons: ["javascript-arrays"],
  },
  {
    id: "js-largest", lang: "javascript", level: 1,
    title: { az: "Ən böyük ədəd", en: "Largest number" },
    task: { az: "`Math.max` istifadə etmədən `nums` massivindəki ən böyük ədədi tapıb çap edin.", en: "Find and print the largest number in `nums` without using `Math.max`." },
    starter: "const nums = [12, 7, 31, 4, 19];\n",
    expected: "31",
    hints: [
      { az: "Birinci elementi \"indiyə qədərki ən böyük\" kimi saxlayın.", en: "Keep the first item as the \"largest so far\"." },
      { az: "Hər elementi müqayisə edin: `if (n > largest) largest = n;`", en: "Compare each item: `if (n > largest) largest = n;`" },
    ],
    solution: "const nums = [12, 7, 31, 4, 19];\nlet largest = nums[0];\nfor (const n of nums) {\n  if (n > largest) largest = n;\n}\nconsole.log(largest);",
    lessons: ["javascript-arrays", "javascript-conditions"],
  },
  {
    id: "js-reverse", lang: "javascript", level: 1,
    title: { az: "Sözü tərsinə çevir", en: "Reverse a word" },
    task: { az: "`word` sətrini tərsinə çevirib çap edin.", en: "Print `word` reversed." },
    starter: 'const word = "proqram";\n',
    expected: "marqorp",
    hints: [
      { az: "Sətri `split(\"\")` ilə hərflər massivinə çevirin.", en: "Turn the string into an array of letters with `split(\"\")`." },
      { az: "`reverse()` və `join(\"\")` ilə yenidən birləşdirin.", en: "Use `reverse()` and `join(\"\")` to put it back together." },
    ],
    solution: 'const word = "proqram";\nconsole.log(word.split("").reverse().join(""));',
    lessons: ["javascript-arrays"],
  },
  {
    id: "js-fizzbuzz", lang: "javascript", level: 2,
    title: { az: "FizzBuzz (1–15)", en: "FizzBuzz (1–15)" },
    task: {
      az: "1-dən 15-ə qədər hər ədəd üçün bir sətir çap edin: 3-ə bölünürsə `Fizz`, 5-ə bölünürsə `Buzz`, hər ikisinə bölünürsə `FizzBuzz`, əks halda ədədin özü.",
      en: "For each number from 1 to 15 print one line: `Fizz` if divisible by 3, `Buzz` if divisible by 5, `FizzBuzz` if by both, otherwise the number.",
    },
    starter: "for (let i = 1; i <= 15; i++) {\n  // ...\n}\n",
    expected: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
    hints: [
      { az: "Bölünməni `%` (qalıq) ilə yoxlayın: `i % 3 === 0`.", en: "Test divisibility with `%` (remainder): `i % 3 === 0`." },
      { az: "\"Hər ikisi\" halını birinci yoxlayın, yoxsa heç vaxt çatmazsınız.", en: "Check the \"both\" case first, or you will never reach it." },
    ],
    solution: 'for (let i = 1; i <= 15; i++) {\n  if (i % 15 === 0) console.log("FizzBuzz");\n  else if (i % 3 === 0) console.log("Fizz");\n  else if (i % 5 === 0) console.log("Buzz");\n  else console.log(i);\n}',
    lessons: ["javascript-conditions"],
  },
  {
    id: "js-vowels", lang: "javascript", level: 2,
    title: { az: "Saitləri say", en: "Count the vowels" },
    task: { az: "`text` içində neçə sait (a, e, i, o, u) olduğunu sayıb çap edin.", en: "Count how many vowels (a, e, i, o, u) are in `text` and print the number." },
    starter: 'const text = "Programming is fun";\n',
    expected: "5",
    hints: [
      { az: "Saitləri bir sətirdə saxlayın: `const vowels = \"aeiou\";`", en: "Keep the vowels in a string: `const vowels = \"aeiou\";`" },
      { az: "Hər hərf üçün `vowels.includes(ch.toLowerCase())` yoxlayın.", en: "For each letter check `vowels.includes(ch.toLowerCase())`." },
    ],
    solution: 'const text = "Programming is fun";\nconst vowels = "aeiou";\nlet count = 0;\nfor (const ch of text) {\n  if (vowels.includes(ch.toLowerCase())) count++;\n}\nconsole.log(count);',
    lessons: ["javascript-arrays", "javascript-conditions"],
  },
  {
    id: "js-half-price", lang: "javascript", level: 2,
    title: { az: "Endirimli qiymətlər", en: "Discounted prices" },
    task: { az: "10-dan baha olan qiymətləri seçin, onları yarıya endirin və nəticə massivini çap edin.", en: "Select the prices above 10, halve them, and print the resulting array." },
    starter: "const prices = [5, 25, 12, 40];\n",
    expected: "[ 12.5, 6, 20 ]",
    hints: [
      { az: "Əvvəl `filter`, sonra `map`.", en: "First `filter`, then `map`." },
      { az: "`prices.filter((p) => p > 10).map((p) => p / 2)`", en: "`prices.filter((p) => p > 10).map((p) => p / 2)`" },
    ],
    solution: "const prices = [5, 25, 12, 40];\nconsole.log(prices.filter((p) => p > 10).map((p) => p / 2));",
    lessons: ["javascript-arrays", "javascript-functions"],
  },
  {
    id: "js-word-count", lang: "javascript", level: 3,
    title: { az: "Sözlərin tezliyi", en: "Word frequency" },
    task: { az: "Hər sözün neçə dəfə təkrarlandığını obyekt şəklində çap edin, məsələn `{ js: 3, … }`.", en: "Print how many times each word occurs, as an object such as `{ js: 3, … }`." },
    starter: 'const words = ["js", "sql", "js", "py", "js"];\n',
    expected: "{ js: 3, sql: 1, py: 1 }",
    hints: [
      { az: "Boş obyektlə başlayın: `const counts = {};`", en: "Start with an empty object: `const counts = {};`" },
      { az: "Hər söz üçün: `counts[w] = (counts[w] ?? 0) + 1;`", en: "For each word: `counts[w] = (counts[w] ?? 0) + 1;`" },
    ],
    solution: 'const words = ["js", "sql", "js", "py", "js"];\nconst counts = {};\nfor (const w of words) {\n  counts[w] = (counts[w] ?? 0) + 1;\n}\nconsole.log(counts);',
    lessons: ["javascript-arrays"],
  },
  {
    id: "sql-baku", lang: "sql", level: 1,
    title: { az: "Bakıdan olan istifadəçilər", en: "Users from Baku" },
    task: { az: "Bakıda yaşayan istifadəçilərin yalnız adlarını, ada görə sıralanmış şəkildə seçin.", en: "Select only the names of users who live in Baku, sorted by name." },
    starter: "SELECT\n",
    expected: "name\nAysel\nLeyla",
    hints: [
      { az: "Şərt: `WHERE city = 'Baku'` (tək dırnaq).", en: "Condition: `WHERE city = 'Baku'` (single quotes)." },
      { az: "Sonda `ORDER BY name`.", en: "Finish with `ORDER BY name`." },
    ],
    solution: "SELECT name\nFROM users\nWHERE city = 'Baku'\nORDER BY name;",
    lessons: ["sql-select"],
  },
  {
    id: "sql-per-city", lang: "sql", level: 2,
    title: { az: "Şəhərlər üzrə say", en: "Users per city" },
    task: { az: "Hər şəhərdə neçə istifadəçi olduğunu göstərin. Sütunlar: `city` və `total`; şəhər adına görə sıralayın.", en: "Show how many users live in each city. Columns: `city` and `total`; sort by city." },
    starter: "SELECT city,\n",
    expected: "city  | total\nBaku  | 2\nGanja | 1\nShaki | 1",
    hints: [
      { az: "`COUNT(*) AS total` və `GROUP BY city`.", en: "`COUNT(*) AS total` and `GROUP BY city`." },
      { az: "Sıra: `SELECT … FROM … GROUP BY … ORDER BY …`", en: "Order: `SELECT … FROM … GROUP BY … ORDER BY …`" },
    ],
    solution: "SELECT city, COUNT(*) AS total\nFROM users\nGROUP BY city\nORDER BY city;",
    lessons: ["sql-select"],
  },
  {
    id: "sql-spent", lang: "sql", level: 3,
    title: { az: "Kim nə qədər xərcləyib? (JOIN)", en: "Who spent how much? (JOIN)" },
    task: {
      az: "`users` və `orders` cədvəllərini birləşdirib hər istifadəçinin ümumi xərcini göstərin. Sütunlar: `name`, `spent`; ən çox xərcləyən birinci.",
      en: "Join `users` and `orders` and show each user's total spending. Columns: `name`, `spent`; the biggest spender first.",
    },
    starter: "SELECT u.name,\n",
    expected: "name  | spent\nMurad | 45\nAysel | 14.5\nLeyla | 12.5",
    hints: [
      { az: "`JOIN orders o ON o.user_id = u.id`", en: "`JOIN orders o ON o.user_id = u.id`" },
      { az: "`SUM(o.amount) AS spent`, `GROUP BY u.name`, `ORDER BY spent DESC`.", en: "`SUM(o.amount) AS spent`, `GROUP BY u.name`, `ORDER BY spent DESC`." },
    ],
    solution: "SELECT u.name, SUM(o.amount) AS spent\nFROM users u\nJOIN orders o ON o.user_id = u.id\nGROUP BY u.name\nORDER BY spent DESC;",
    lessons: ["sql-select"],
  },
];

export const DEBUG_TASKS: PracticeTask[] = [
  {
    id: "dbg-const", lang: "javascript", level: 1,
    title: { az: "Sayğac işləmir", en: "The counter does not work" },
    task: { az: "Kod `3` çap etməlidir, amma xəta verir. Səhvi tapıb düzəldin.", en: "The code should print `3` but throws an error. Find and fix the bug." },
    starter: "const count = 0;\nfor (let i = 0; i < 3; i++) {\n  count = count + 1;\n}\nconsole.log(count);\n",
    expected: "3",
    hints: [{ az: "Xəta mesajını oxuyun: hansı dəyişən yenidən mənimsədilir?", en: "Read the error: which variable is being reassigned?" }],
    solution: "let count = 0;\nfor (let i = 0; i < 3; i++) {\n  count = count + 1;\n}\nconsole.log(count);",
    why: { az: "`const` yenidən mənimsədilə bilməz; dəyişəcək sayğac `let` ilə elan olunmalıdır.", en: "A `const` cannot be reassigned; a changing counter must be declared with `let`." },
    lessons: ["javascript-variables"],
  },
  {
    id: "dbg-off-by-one", lang: "javascript", level: 1,
    title: { az: "Bir addım artıq", en: "One step too far" },
    task: { az: "Kod `A`, `B`, `C` çap etməlidir, amma sonda çökür.", en: "The code should print `A`, `B`, `C`, but it crashes at the end." },
    starter: 'const items = ["a", "b", "c"];\nfor (let i = 0; i <= items.length; i++) {\n  console.log(items[i].toUpperCase());\n}\n',
    expected: "A\nB\nC",
    hints: [{ az: "3 elementli massivdə son indeks neçədir?", en: "What is the last index of a 3-item array?" }],
    solution: 'const items = ["a", "b", "c"];\nfor (let i = 0; i < items.length; i++) {\n  console.log(items[i].toUpperCase());\n}',
    why: { az: "`<=` dövrü `i = 3`-də də işlədir; `items[3]` `undefined`-dır və onun metodu yoxdur. `<` olmalıdır.", en: "`<=` also runs the loop for `i = 3`; `items[3]` is `undefined` and has no methods. It must be `<`." },
    lessons: ["javascript-arrays"],
  },
  {
    id: "dbg-return", lang: "javascript", level: 2,
    title: { az: "`undefined` haradan gəlir?", en: "Where does `undefined` come from?" },
    task: { az: "Funksiya `12` qaytarmalıdır, amma `undefined` çap olunur.", en: "The function should give `12`, but `undefined` is printed." },
    starter: "function total(prices) {\n  let sum = 0;\n  for (const p of prices) sum += p;\n}\nconsole.log(total([3, 4, 5]));\n",
    expected: "12",
    hints: [{ az: "Funksiya nəticəni çağırana necə göndərir?", en: "How does a function send its result back to the caller?" }],
    solution: "function total(prices) {\n  let sum = 0;\n  for (const p of prices) sum += p;\n  return sum;\n}\nconsole.log(total([3, 4, 5]));",
    why: { az: "`return` olmadan funksiya `undefined` qaytarır.", en: "Without `return` a function returns `undefined`." },
    lessons: ["javascript-functions"],
  },
  {
    id: "dbg-concat", lang: "javascript", level: 2,
    title: { az: "5 + 10 = 510?", en: "5 + 10 = 510?" },
    task: { az: "Kod `15` çap etməlidir, amma `510` çıxır.", en: "The code should print `15`, but prints `510`." },
    starter: 'const a = "5"; // value from a form field\nconst b = 10;\nconsole.log(a + b);\n',
    expected: "15",
    hints: [{ az: "`a`-nın tipi nədir? `+` sətirlə işləyəndə nə edir?", en: "What type is `a`? What does `+` do with a string?" }],
    solution: 'const a = "5";\nconst b = 10;\nconsole.log(Number(a) + b);',
    why: { az: "Bir tərəf sətirdirsə `+` birləşdirmə aparır. Əvvəlcə `Number()` ilə ədədə çevirin.", en: "If one side is a string, `+` concatenates. Convert with `Number()` first." },
    lessons: ["javascript-conditions", "javascript-variables"],
  },
  {
    id: "dbg-null", lang: "sql", level: 1,
    title: { az: "Sorğu heç nə qaytarmır", en: "The query returns nothing" },
    task: { az: "Yaşı məlum olmayan istifadəçini (Elvin) tapmalı idi, amma nəticə boşdur.", en: "It should find the user whose age is unknown (Elvin), but the result is empty." },
    starter: "SELECT name FROM users\nWHERE age = NULL;\n",
    expected: "name\nElvin",
    hints: [{ az: "`NULL` adi dəyər kimi müqayisə olunurmu?", en: "Can `NULL` be compared like a normal value?" }],
    solution: "SELECT name FROM users\nWHERE age IS NULL;",
    why: { az: "`= NULL` heç vaxt doğru olmur; `IS NULL` istifadə olunmalıdır.", en: "`= NULL` is never true; use `IS NULL`." },
    lessons: ["sql-select"],
  },
  {
    id: "dbg-comma", lang: "sql", level: 2,
    title: { az: "Bir sütun yoxa çıxıb", en: "A column went missing" },
    task: { az: "İki sütun (`name`, `city`) gözlənilir, amma bir sütun gəlir.", en: "Two columns (`name`, `city`) are expected, but only one comes back." },
    starter: "SELECT name city FROM users\nWHERE id = 1;\n",
    expected: "name  | city\nAysel | Baku",
    hints: [{ az: "Sütunlar arasında nə çatmır?", en: "What is missing between the columns?" }],
    solution: "SELECT name, city FROM users\nWHERE id = 1;",
    why: { az: "Vergül olmadan `city` sütun deyil, `name` üçün ləqəb (alias) sayılır.", en: "Without the comma, `city` is read as an alias for `name`, not as a column." },
    lessons: ["sql-select"],
  },
];
