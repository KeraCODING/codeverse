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
  {
    id: "py-average", lang: "python", level: 1,
    title: { az: "Orta bal", en: "Average score" },
    task: { az: "`scores` siyahısındakı balların ortasını hesablayıb çap edin.", en: "Compute and print the average of the scores in `scores`." },
    starter: "scores = [72, 85, 90, 64, 89]\n",
    expected: "80.0",
    hints: [
      { az: "`sum(scores)` cəmi, `len(scores)` say verir.", en: "`sum(scores)` gives the total, `len(scores)` the count." },
      { az: "Bölmə `/` Python 3-də həmişə kəsr ədəd qaytarır: `print(sum(scores) / len(scores))`.", en: "Division `/` always gives a float in Python 3: `print(sum(scores) / len(scores))`." },
    ],
    solution: "scores = [72, 85, 90, 64, 89]\nprint(sum(scores) / len(scores))",
    lessons: ["python-lists", "python-variables"],
  },
  {
    id: "py-evens", lang: "python", level: 1,
    title: { az: "Cüt ədədlər", en: "Even numbers" },
    task: { az: "1-dən 20-yə qədər (20 daxil) cüt ədədlərdən ibarət siyahı yaradıb çap edin.", en: "Build and print a list of the even numbers from 1 to 20 inclusive." },
    starter: "evens = []\n",
    expected: "[2, 4, 6, 8, 10, 12, 14, 16, 18, 20]",
    hints: [
      { az: "Ədəd cütdürsə, 2-yə bölünəndə qalıq 0 olur: `n % 2 == 0`.", en: "A number is even when the remainder after dividing by 2 is 0: `n % 2 == 0`." },
      { az: "`for n in range(1, 21):` dövründə şərti yoxlayıb `evens.append(n)` edin.", en: "Inside `for n in range(1, 21):` check the condition and call `evens.append(n)`." },
    ],
    solution: "evens = []\nfor n in range(1, 21):\n    if n % 2 == 0:\n        evens.append(n)\nprint(evens)",
    lessons: ["python-loops", "python-conditions", "python-lists"],
  },
  {
    id: "py-grade", lang: "python", level: 2,
    title: { az: "Qiymət hərfi", en: "Letter grade" },
    task: {
      az: "`grade(score)` funksiyasını yazın: 90 və yuxarı `A`, 75 və yuxarı `B`, 60 və yuxarı `C`, qalanı `F` qaytarsın. Sonra `[95, 80, 61, 42]` üçün nəticələri bir sətirdə çap edin.",
      en: "Write `grade(score)`: 90 and above returns `A`, 75 and above `B`, 60 and above `C`, anything else `F`. Then print the results for `[95, 80, 61, 42]` on one line.",
    },
    starter: "def grade(score):\n    pass\n\nscores = [95, 80, 61, 42]\n",
    expected: "A B C F",
    hints: [
      { az: "Şərtləri böyükdən kiçiyə yoxlayın: `if`, `elif`, `elif`, `else`.", en: "Check the conditions from highest to lowest: `if`, `elif`, `elif`, `else`." },
      { az: "Bir sətirdə çap etmək üçün: `print(*[grade(s) for s in scores])` və ya `\" \".join(...)`.", en: "To print on one line: `print(*[grade(s) for s in scores])` or `\" \".join(...)`." },
    ],
    solution: 'def grade(score):\n    if score >= 90:\n        return "A"\n    elif score >= 75:\n        return "B"\n    elif score >= 60:\n        return "C"\n    return "F"\n\nscores = [95, 80, 61, 42]\nprint(" ".join(grade(s) for s in scores))',
    lessons: ["python-functions", "python-conditions"],
  },
  {
    id: "py-letter-count", lang: "python", level: 2,
    title: { az: "Hərfləri say", en: "Count the letters" },
    task: { az: "`word` sözündə hər hərfin neçə dəfə təkrarlandığını lüğətdə toplayıb çap edin.", en: "Count how many times each letter appears in `word` using a dictionary, then print the dictionary." },
    starter: 'word = "banana"\n',
    expected: "{'b': 1, 'a': 3, 'n': 2}",
    hints: [
      { az: "Boş lüğətlə başlayın: `counts = {}`.", en: "Start with an empty dictionary: `counts = {}`." },
      { az: "Hər hərf üçün: `counts[ch] = counts.get(ch, 0) + 1`.", en: "For each letter: `counts[ch] = counts.get(ch, 0) + 1`." },
    ],
    solution: 'word = "banana"\ncounts = {}\nfor ch in word:\n    counts[ch] = counts.get(ch, 0) + 1\nprint(counts)',
    lessons: ["python-loops"],
  },
  {
    id: "py-palindrome", lang: "python", level: 3,
    title: { az: "Polindrom", en: "Palindrome" },
    task: {
      az: "`is_palindrome(text)` funksiyasını yazın: boşluqları və böyük-kiçik hərf fərqini nəzərə almadan mətn tərsinə də eyni oxunursa `True` qaytarsın. Hər söz üçün nəticəni ayrı sətirdə çap edin.",
      en: "Write `is_palindrome(text)` that returns `True` when the text reads the same backwards, ignoring spaces and letter case. Print the result for each word on its own line.",
    },
    starter: 'words = ["Kayak", "Never odd or even", "Python"]\n',
    expected: "True\nTrue\nFalse",
    hints: [
      { az: "Əvvəlcə mətni təmizləyin: `text.replace(\" \", \"\").lower()`.", en: "Clean the text first: `text.replace(\" \", \"\").lower()`." },
      { az: "Sətri tərsinə çevirmək: `s[::-1]`. Sonra `s == s[::-1]` qaytarın.", en: "Reverse a string with `s[::-1]`, then return `s == s[::-1]`." },
    ],
    solution: 'def is_palindrome(text):\n    s = text.replace(" ", "").lower()\n    return s == s[::-1]\n\nwords = ["Kayak", "Never odd or even", "Python"]\nfor w in words:\n    print(is_palindrome(w))',
    lessons: ["python-functions", "python-loops"],
  },
  {
    id: "js-even-squares", lang: "javascript", level: 2,
    title: { az: "Cüt ədədlərin kvadratları", en: "Squares of even numbers" },
    task: { az: "`nums` massivindən yalnız cüt ədədləri götürün, onların kvadratlarından yeni massiv düzəldib çap edin.", en: "Take only the even numbers from `nums`, build a new array of their squares and print it." },
    starter: "const nums = [1, 2, 3, 4, 5, 6];\n",
    expected: "[ 4, 16, 36 ]",
    hints: [
      { az: "`filter((n) => n % 2 === 0)` cüt ədədləri saxlayır.", en: "`filter((n) => n % 2 === 0)` keeps the even numbers." },
      { az: "Sonra `map((n) => n * n)` və `console.log(...)`.", en: "Then `map((n) => n * n)` and `console.log(...)`." },
    ],
    solution: "const nums = [1, 2, 3, 4, 5, 6];\nconst squares = nums.filter((n) => n % 2 === 0).map((n) => n * n);\nconsole.log(squares);",
    lessons: ["javascript-arrays", "javascript-functions"],
  },
  {
    id: "js-average-object", lang: "javascript", level: 3,
    title: { az: "Obyektdəki balların ortası", en: "Average of the scores in an object" },
    task: { az: "`scores` obyektindəki bütün balların ortasını tam ədədə yuvarlaqlaşdırıb `Average: 85` formasında çap edin.", en: "Print the average of all scores in `scores`, rounded to a whole number, as `Average: 85`." },
    starter: "const scores = { math: 92, physics: 78, history: 85 };\n",
    expected: "Average: 85",
    hints: [
      { az: "`Object.values(scores)` yalnız dəyərlərin massivini verir.", en: "`Object.values(scores)` gives an array of just the values." },
      { az: "Cəmi `reduce` ilə tapın, saya bölün, `Math.round` edin.", en: "Add them with `reduce`, divide by the count, then `Math.round`." },
    ],
    solution: "const scores = { math: 92, physics: 78, history: 85 };\nconst values = Object.values(scores);\nconst avg = values.reduce((a, b) => a + b, 0) / values.length;\nconsole.log(`Average: ${Math.round(avg)}`);",
    lessons: ["javascript-objects", "javascript-arrays"],
  },
  {
    id: "py-title-case", lang: "python", level: 1,
    title: { az: "Hər sözün baş hərfi", en: "Capitalise every word" },
    task: { az: "`text` cümləsindəki hər sözün birinci hərfini böyük edib çap edin.", en: "Print `text` with the first letter of every word in capitals." },
    starter: 'text = "hello world from baku"\n',
    expected: "Hello World From Baku",
    hints: [
      { az: "Mətnlərin hazır metodu var: `title()`.", en: "Strings have a ready-made method: `title()`." },
      { az: "`print(text.title())`", en: "`print(text.title())`" },
    ],
    solution: 'text = "hello world from baku"\nprint(text.title())',
    lessons: ["python-strings"],
  },
  {
    id: "py-fizzbuzz", lang: "python", level: 2,
    title: { az: "FizzBuzz", en: "FizzBuzz" },
    task: {
      az: "1-dən 15-ə qədər ədədləri çap edin; 3-ə bölünənlərin yerinə `Fizz`, 5-ə bölünənlərin yerinə `Buzz`, hər ikisinə bölünənlərin yerinə `FizzBuzz` yazın.",
      en: "Print the numbers 1 to 15; print `Fizz` instead of multiples of 3, `Buzz` instead of multiples of 5 and `FizzBuzz` for multiples of both.",
    },
    starter: "for n in range(1, 16):\n    pass\n",
    expected: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
    hints: [
      { az: "Əvvəlcə 15-ə bölünməni yoxlayın (`n % 15 == 0`), sonra 3 və 5.", en: "Check divisibility by 15 first (`n % 15 == 0`), then 3 and 5." },
      { az: "`if` / `elif` / `elif` / `else` istifadə edin.", en: "Use `if` / `elif` / `elif` / `else`." },
    ],
    solution: 'for n in range(1, 16):\n    if n % 15 == 0:\n        print("FizzBuzz")\n    elif n % 3 == 0:\n        print("Fizz")\n    elif n % 5 == 0:\n        print("Buzz")\n    else:\n        print(n)',
    lessons: ["python-loops", "python-conditions"],
  },
  {
    id: "sql-product-count", lang: "sql", level: 2,
    title: { az: "Hansı məhsul neçə dəfə alınıb?", en: "How often was each product bought?" },
    task: { az: "Hər məhsulun neçə dəfə sifariş edildiyini `times` adlı sütunla göstərin; ən çox alınan birinci, bərabər olduqda ada görə.", en: "Show how many times each product was ordered as a column named `times`; most frequent first, then by name." },
    starter: "SELECT product\nFROM orders;\n",
    expected: "product  | times\nNotebook | 2\nBackpack | 1\nPen      | 1",
    hints: [
      { az: "`COUNT(*) AS times` və `GROUP BY product`.", en: "`COUNT(*) AS times` and `GROUP BY product`." },
      { az: "`ORDER BY times DESC, product`", en: "`ORDER BY times DESC, product`" },
    ],
    solution: "SELECT product, COUNT(*) AS times\nFROM orders\nGROUP BY product\nORDER BY times DESC, product;",
    lessons: ["sql-select", "sql-filter-sort"],
  },
  {
    id: "ts-cart-total", lang: "typescript", level: 2,
    title: { az: "Tipli səbət", en: "A typed cart" },
    task: {
      az: "`Item` interfeysini (`price: number`, `qty: number`) və `total(items: Item[]): number` funksiyasını yazın. `Total: 19` çap edin.",
      en: "Write an `Item` interface (`price: number`, `qty: number`) and a `total(items: Item[]): number` function. Print `Total: 19`.",
    },
    starter: "const cart = [\n  { price: 5, qty: 2 },\n  { price: 3, qty: 3 },\n];\n",
    expected: "Total: 19",
    hints: [
      { az: "`interface Item { price: number; qty: number }`", en: "`interface Item { price: number; qty: number }`" },
      { az: "`items.reduce((sum, i) => sum + i.price * i.qty, 0)`", en: "`items.reduce((sum, i) => sum + i.price * i.qty, 0)`" },
    ],
    solution: "interface Item {\n  price: number;\n  qty: number;\n}\n\nfunction total(items: Item[]): number {\n  return items.reduce((sum, i) => sum + i.price * i.qty, 0);\n}\n\nconst cart: Item[] = [\n  { price: 5, qty: 2 },\n  { price: 3, qty: 3 },\n];\nconsole.log(`Total: ${total(cart)}`);",
    lessons: ["typescript-basics"],
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
  {
    id: "dbg-py-indent", lang: "python", level: 1,
    title: { az: "Girinti xətası", en: "Indentation error" },
    task: { az: "Kod `Hello, Aysel!` çap etməlidir, amma işə düşmür. Səhvi tapıb düzəldin.", en: "The code should print `Hello, Aysel!` but does not even start. Find and fix the bug." },
    starter: 'def greet(name):\nprint(f"Hello, {name}!")\n\ngreet("Aysel")\n',
    expected: "Hello, Aysel!",
    hints: [{ az: "Python blokları mötərizə ilə yox, girinti (4 boşluq) ilə ayırır.", en: "Python marks blocks with indentation (4 spaces), not braces." }],
    solution: 'def greet(name):\n    print(f"Hello, {name}!")\n\ngreet("Aysel")',
    why: { az: "Funksiyanın gövdəsi `def` sətrindən içəri girintili olmalıdır; əks halda `IndentationError` yaranır.", en: "A function body must be indented under its `def` line; otherwise Python raises `IndentationError`." },
    lessons: ["python-functions"],
  },
  {
    id: "dbg-py-str-int", lang: "python", level: 1,
    title: { az: "Mətn + ədəd", en: "Text + number" },
    task: { az: "Kod `Age next year: 25` çap etməlidir, amma `TypeError` verir.", en: "The code should print `Age next year: 25` but raises a `TypeError`." },
    starter: 'age = "24"  # value read from a form\nprint("Age next year:", age + 1)\n',
    expected: "Age next year: 25",
    hints: [{ az: "`age` dəyişəninin tipi nədir? `int()` ilə ədədə çevirin.", en: "What type is `age`? Convert it with `int()`." }],
    solution: 'age = "24"  # value read from a form\nprint("Age next year:", int(age) + 1)',
    why: { az: "Python mətni ədədə avtomatik çevirmir: `\"24\" + 1` xətadır. Əvvəlcə `int(age)` lazımdır.", en: "Python never converts text to a number on its own: `\"24\" + 1` is an error. Use `int(age)` first." },
    lessons: ["python-variables"],
  },
  {
    id: "dbg-py-range", lang: "python", level: 2,
    title: { az: "Bir ədəd əskik", en: "One number short" },
    task: { az: "Kod 1-dən 5-ə qədər ədədlərin cəmini (`15`) çap etməlidir, amma `10` çıxır.", en: "The code should print the sum of 1 to 5 (`15`), but prints `10`." },
    starter: "total = 0\nfor n in range(1, 5):\n    total += n\nprint(total)\n",
    expected: "15",
    hints: [{ az: "`range(1, 5)` hansı ədədləri verir? Son ədəd daxildirmi?", en: "Which numbers does `range(1, 5)` produce? Is the end included?" }],
    solution: "total = 0\nfor n in range(1, 6):\n    total += n\nprint(total)",
    why: { az: "`range(start, stop)` `stop`-u daxil etmir: `range(1, 5)` = 1, 2, 3, 4. 5-i daxil etmək üçün `range(1, 6)` lazımdır.", en: "`range(start, stop)` excludes `stop`: `range(1, 5)` is 1, 2, 3, 4. To include 5 use `range(1, 6)`." },
    lessons: ["python-loops"],
  },
];
