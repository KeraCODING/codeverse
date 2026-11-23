import type { CodeLang, L } from "../content/types";

// Keyword / operator / built-in knowledge base. Powers Universal Search ("what does `async` mean?")
// and the word-level part of Smart Code Explanation. Written in az + en, checked against the
// language references linked from each lesson.

export type TermKind = "keyword" | "operator" | "builtin" | "method" | "concept";

export interface TermEntry {
  id: string;
  token: string; // as written in code
  lang: CodeLang | null; // null = cross-language concept
  kind: TermKind;
  meaning: L;
  examples: Partial<Record<CodeLang, string>>;
  lessons: string[];
  aliases?: string[]; // extra search words (other spellings, local-language names)
}

const e = (
  id: string, token: string, lang: CodeLang | null, kind: TermKind,
  az: string, en: string, examples: TermEntry["examples"], lessons: string[] = [], aliases?: string[],
): TermEntry => ({ id, token, lang, kind, meaning: { az, en }, examples, lessons, aliases });

export const TERMS: TermEntry[] = [
  // ---------- Python ----------
  e("py-def", "def", "python", "keyword", "Funksiya təyin edir: `def ad(parametrlər):` və altında girintili gövdə.", "Defines a function: `def name(parameters):` followed by an indented body.", { python: "def greet(name):\n    return \"Hi \" + name" }, ["python-functions"], ["function", "funksiya"]),
  e("py-return", "return", "python", "keyword", "Funksiyadan dəyər qaytarır və funksiyanı bitirir. Yoxdursa funksiya `None` qaytarır.", "Returns a value from a function and ends it. Without it the function returns `None`.", { python: "def square(n):\n    return n * n" }, ["python-functions"]),
  e("py-if", "if", "python", "keyword", "Şərt doğru olduqda girintili bloku işlədir. Sətir iki nöqtə ilə bitir.", "Runs the indented block when the condition is true. The line ends with a colon.", { python: "if age >= 18:\n    print(\"Adult\")" }, ["python-conditions"], ["şərt", "condition"]),
  e("py-elif", "elif", "python", "keyword", "\"else if\": əvvəlki şərtlər yalan olduqda yeni şərt yoxlayır.", "\"else if\": tests a new condition when the previous ones were false.", { python: "if x > 0:\n    print(\"+\")\nelif x < 0:\n    print(\"-\")" }, ["python-conditions"]),
  e("py-else", "else", "python", "keyword", "Heç bir şərt doğru olmadıqda işləyən blok.", "The block that runs when no condition was true.", { python: "if ok:\n    print(\"yes\")\nelse:\n    print(\"no\")" }, ["python-conditions"]),
  e("py-for", "for", "python", "keyword", "Ardıcıllığın (siyahı, mətn, `range`) hər elementi üçün bloku təkrarlayır.", "Repeats the block for each item of a sequence (list, string, `range`).", { python: "for fruit in [\"apple\", \"pear\"]:\n    print(fruit)" }, ["python-loops"], ["loop", "dövr"]),
  e("py-while", "while", "python", "keyword", "Şərt doğru olduqca bloku təkrarlayır. Şərti dəyişməyi unutmayın, əks halda dövr sonsuz olar.", "Repeats the block while the condition is true. Remember to change the condition or the loop never ends.", { python: "n = 3\nwhile n > 0:\n    n -= 1" }, ["python-loops"]),
  e("py-break", "break", "python", "keyword", "Dövrü dərhal dayandırır.", "Exits the loop immediately.", { python: "for n in nums:\n    if n < 0:\n        break" }, ["python-loops"]),
  e("py-continue", "continue", "python", "keyword", "Cari addımın qalanını ötürüb dövrün növbəti addımına keçir.", "Skips the rest of the current step and moves to the next iteration.", { python: "for n in nums:\n    if n == 0:\n        continue\n    print(10 / n)" }, ["python-loops"]),
  e("py-in", "in", "python", "operator", "Üzvlük yoxlaması (`x in items` → `True`/`False`) və `for` dövründə \"içində\" mənası.", "Membership test (`x in items` → `True`/`False`) and the \"in\" of a `for` loop.", { python: "print(\"a\" in [\"a\", \"b\"])  # True" }, ["python-lists", "python-loops"]),
  e("py-range", "range", "python", "builtin", "Ədəd ardıcıllığı yaradır. `range(1, 4)` → 1, 2, 3: son hədd daxil deyil.", "Creates a sequence of numbers. `range(1, 4)` → 1, 2, 3: the end is excluded.", { python: "for i in range(3):\n    print(i)  # 0 1 2" }, ["python-loops"]),
  e("py-print", "print", "python", "builtin", "Dəyərləri ekrana (standart çıxışa) yazır.", "Writes values to the screen (standard output).", { python: "print(\"Hello\", 42)" }, ["python-variables"]),
  e("py-len", "len", "python", "builtin", "Siyahının, mətnin və s. elementlərinin sayını qaytarır.", "Returns the number of items in a list, string, etc.", { python: "len([1, 2, 3])  # 3" }, ["python-lists"]),
  e("py-input", "input", "python", "builtin", "İstifadəçidən mətn oxuyur. Nəticə həmişə `str`-dir; ədəd lazımdırsa `int()` ilə çevirin.", "Reads text from the user. The result is always a `str`; convert with `int()` if you need a number.", { python: "age = int(input(\"Age: \"))" }, ["python-variables"]),
  e("py-type", "type", "python", "builtin", "Dəyərin tipini qaytarır.", "Returns the type of a value.", { python: "type(3.5)  # <class 'float'>" }, ["python-variables"]),
  e("py-none", "None", "python", "keyword", "\"Dəyər yoxdur\" deməkdir. `is None` ilə yoxlanılır.", "Means \"no value\". Test it with `is None`.", { python: "result = None\nif result is None:\n    print(\"empty\")" }, ["python-functions"], ["null"]),
  e("py-true", "True", "python", "keyword", "Məntiqi doğru dəyəri (`bool`). `False` ilə birlikdə yeganə iki `bool` dəyəridir.", "The boolean true value (`bool`). Together with `False` it is one of the only two `bool` values.", { python: "is_ready = True" }, ["python-variables"], ["False", "bool"]),
  e("py-and", "and", "python", "operator", "Məntiqi \"və\": hər iki tərəf doğru olduqda doğrudur. `or` — biri doğru olsa kifayətdir; `not` — tərsinə çevirir.", "Logical \"and\": true when both sides are true. `or` — one is enough; `not` — negates.", { python: "if age >= 18 and has_ticket:\n    print(\"Enter\")" }, ["python-conditions"], ["or", "not"]),
  e("py-import", "import", "python", "keyword", "Başqa moduldan (kitabxanadan) kod gətirir.", "Brings in code from another module (library).", { python: "import math\nprint(math.sqrt(16))" }),
  e("py-class", "class", "python", "keyword", "Yeni sinif (obyekt tipi) təyin edir.", "Defines a new class (a type of object).", { python: "class User:\n    def __init__(self, name):\n        self.name = name" }, [], ["sinif"]),
  e("py-lambda", "lambda", "python", "keyword", "Adsız, tək ifadəli qısa funksiya yaradır.", "Creates a short, anonymous, single-expression function.", { python: "double = lambda n: n * 2" }, ["python-functions"]),
  e("py-try", "try", "python", "keyword", "Xəta baş verə biləcək kodu əhatə edir; xəta `except` blokunda tutulur.", "Wraps code that may fail; the error is caught in an `except` block.", { python: "try:\n    n = int(text)\nexcept ValueError:\n    print(\"Not a number\")" }, [], ["except", "exception"]),
  e("py-fstring", "f\"…\"", "python", "concept", "f-sətir: `{ }` içindəki ifadələr dəyərləri ilə əvəz olunur.", "f-string: expressions inside `{ }` are replaced by their values.", { python: "print(f\"Total: {price * qty}\")" }, ["python-variables"], ["f-string", "fstring", "format"]),
  e("py-append", "append", "python", "method", "Siyahının sonuna element əlavə edir. Siyahını yerində dəyişir və `None` qaytarır.", "Adds an item to the end of a list. Changes the list in place and returns `None`.", { python: "items.append(4)" }, ["python-lists"]),
  e("py-is", "is", "python", "operator", "Eyni obyekt olub-olmadığını yoxlayır. Əsasən `is None` üçün istifadə olunur; dəyər bərabərliyi üçün `==` yazın.", "Tests whether two names refer to the same object. Mainly used for `is None`; use `==` for value equality.", { python: "if value is None:\n    ..." }, ["python-conditions"]),
  e("py-async", "async", "python", "keyword", "Asinxron funksiya (`async def`) təyin edir; daxilində `await` ilə gözləmə edilə bilər. `asyncio` ilə işlədilir.", "Defines an asynchronous function (`async def`) that can pause with `await`. Run with `asyncio`.", { python: "import asyncio\n\nasync def main():\n    await asyncio.sleep(1)\n    print(\"done\")\n\nasyncio.run(main())" }, [], ["await", "asyncio"]),

  // ---------- JavaScript ----------
  e("js-let", "let", "javascript", "keyword", "Yenidən mənimsədilə bilən, blok sahəli dəyişən elan edir.", "Declares a block-scoped variable that can be reassigned.", { javascript: "let count = 0;\ncount = count + 1;" }, ["javascript-variables"], ["variable", "dəyişən"]),
  e("js-const", "const", "javascript", "keyword", "Yenidən mənimsədilə bilməyən ad elan edir. Obyekt və massivin içi isə dəyişdirilə bilər.", "Declares a binding that cannot be reassigned. Object and array contents can still change.", { javascript: "const max = 100;" }, ["javascript-variables"]),
  e("js-var", "var", "javascript", "keyword", "Köhnə, funksiya sahəli dəyişən elanı. Yeni kodda `let` və `const` tövsiyə olunur.", "The older, function-scoped declaration. Prefer `let` and `const` in new code.", { javascript: "var legacy = true;" }, ["javascript-variables"]),
  e("js-function", "function", "javascript", "keyword", "Funksiya elan edir. `function` elanları qaldırılır (hoisting) və elandan əvvəl də çağırıla bilər.", "Declares a function. `function` declarations are hoisted and can be called before the declaration line.", { javascript: "function add(a, b) {\n  return a + b;\n}" }, ["javascript-functions"], ["funksiya"]),
  e("js-arrow", "=>", "javascript", "operator", "Ox funksiyası: `(parametrlər) => ifadə`. Tək ifadəli gövdə avtomatik qaytarılır.", "Arrow function: `(params) => expression`. A single-expression body is returned automatically.", { javascript: "const square = (n) => n * n;" }, ["javascript-functions"], ["arrow function"]),
  e("js-return", "return", "javascript", "keyword", "Funksiyadan dəyər qaytarır və onu bitirir. Yoxdursa nəticə `undefined`-dir.", "Returns a value and ends the function. Without it the result is `undefined`.", { javascript: "function f() {\n  return 42;\n}" }, ["javascript-functions"]),
  e("js-if", "if", "javascript", "keyword", "Mötərizədəki şərt truthy olduqda bloku işlədir.", "Runs the block when the condition in parentheses is truthy.", { javascript: "if (age >= 18) {\n  console.log(\"Adult\");\n}" }, ["javascript-conditions"]),
  e("js-strict-eq", "===", "javascript", "operator", "Ciddi bərabərlik: dəyər və tip eyni olmalıdır. `!==` — ciddi bərabər deyil.", "Strict equality: value and type must match. `!==` — strictly not equal.", { javascript: "\"5\" === 5  // false" }, ["javascript-conditions"], ["!=="]),
  e("js-loose-eq", "==", "javascript", "operator", "Boş bərabərlik: müqayisədən əvvəl tipləri çevirir və gözlənilməz nəticələr verə bilər. `===` tövsiyə olunur.", "Loose equality: converts types before comparing and can surprise you. Prefer `===`.", { javascript: "\"5\" == 5  // true" }, ["javascript-conditions"]),
  e("js-for-of", "for...of", "javascript", "keyword", "Massiv və digər iterasiya olunan obyektlərin elementlərini növbə ilə gəzir.", "Walks through the items of an array or other iterable.", { javascript: "for (const tag of tags) {\n  console.log(tag);\n}" }, ["javascript-arrays"], ["for", "loop", "dövr"]),
  e("js-while", "while", "javascript", "keyword", "Şərt truthy olduqca bloku təkrarlayır.", "Repeats the block while the condition is truthy.", { javascript: "let n = 3;\nwhile (n > 0) {\n  n--;\n}" }),
  e("js-console-log", "console.log", "javascript", "method", "Dəyərləri brauzer və ya Node.js konsoluna yazır.", "Writes values to the browser or Node.js console.", { javascript: "console.log(\"Hello\", 42);" }, ["javascript-variables"], ["print", "log"]),
  e("js-typeof", "typeof", "javascript", "operator", "Dəyərin tipini sətir kimi qaytarır: `\"number\"`, `\"string\"` və s.", "Returns a value's type as a string: `\"number\"`, `\"string\"`, etc.", { javascript: "typeof 42  // \"number\"" }, ["javascript-variables"]),
  e("js-null", "null", "javascript", "keyword", "Bilərəkdən verilmiş \"dəyər yoxdur\". `undefined` isə dəyərin heç təyin edilmədiyini bildirir.", "An intentional \"no value\". `undefined` means a value was never assigned.", { javascript: "let user = null;\nlet x;  // undefined" }, ["javascript-conditions"], ["undefined"]),
  e("js-async", "async", "javascript", "keyword", "Funksiyanı asinxron edir: o həmişə Promise qaytarır və daxilində `await` istifadə oluna bilər. Şəbəkə sorğuları kimi gözləmə tələb edən işlər üçündür.", "Makes a function asynchronous: it always returns a Promise and may use `await` inside. Used for work that waits, such as network requests.", { javascript: "async function load() {\n  const res = await fetch(\"/api/data\");\n  return res.json();\n}" }, [], ["await", "promise"]),
  e("js-await", "await", "javascript", "keyword", "Promise tamamlanana qədər `async` funksiyanın icrasını dayandırır və nəticəni qaytarır. Bu müddətdə səhifə donmur.", "Pauses an `async` function until a Promise settles and gives back its result. The page does not freeze meanwhile.", { javascript: "const data = await response.json();" }, [], ["async"]),
  e("js-map", "map", "javascript", "method", "Hər elementə funksiya tətbiq edib yeni massiv qaytarır; orijinal dəyişmir.", "Applies a function to every item and returns a new array; the original is unchanged.", { javascript: "[1, 2, 3].map((n) => n * 2)  // [2, 4, 6]" }, ["javascript-arrays"]),
  e("js-filter", "filter", "javascript", "method", "Yalnız şərti ödəyən elementlərdən yeni massiv yaradır.", "Builds a new array of the items that pass the test.", { javascript: "[1, 2, 3, 4].filter((n) => n % 2 === 0)  // [2, 4]" }, ["javascript-arrays"]),
  e("js-push", "push", "javascript", "method", "Massivin sonuna element əlavə edir və yeni uzunluğu qaytarır.", "Adds items to the end of an array and returns the new length.", { javascript: "list.push(4);" }, ["javascript-arrays"]),
  e("js-template", "`${…}`", "javascript", "concept", "Şablon sətir: `` ` `` işarələri arasında `${ifadə}` dəyərlə əvəz olunur.", "Template literal: between backticks, `${expression}` is replaced by its value.", { javascript: "const msg = `Hi, ${name}!`;" }, ["javascript-variables"], ["template literal", "şablon"]),
  e("js-and", "&&", "javascript", "operator", "Məntiqi \"və\". `||` — \"və ya\", `!` — inkar.", "Logical \"and\". `||` — \"or\", `!` — not.", { javascript: "if (isAdmin && isActive) { … }" }, ["javascript-conditions"], ["||", "!"]),
  e("js-ternary", "? :", "javascript", "operator", "Ternar operator: `şərt ? doğrudursa : yalandırsa`.", "Ternary operator: `condition ? ifTrue : ifFalse`.", { javascript: "const label = ok ? \"Yes\" : \"No\";" }, ["javascript-conditions"], ["ternary"]),
  e("js-class", "class", "javascript", "keyword", "Sinif təyin edir: konstruktor və metodları olan obyekt şablonu.", "Defines a class: a template for objects with a constructor and methods.", { javascript: "class User {\n  constructor(name) {\n    this.name = name;\n  }\n}" }, [], ["sinif"]),
  e("js-try", "try", "javascript", "keyword", "Xəta verə biləcək kodu əhatə edir; xəta `catch` blokunda tutulur.", "Wraps code that may throw; the error is caught in the `catch` block.", { javascript: "try {\n  JSON.parse(text);\n} catch (err) {\n  console.error(err.message);\n}" }, [], ["catch", "exception"]),

  // ---------- SQL ----------
  e("sql-select", "SELECT", "sql", "keyword", "Cədvəldən hansı sütunların oxunacağını bildirir. `*` — bütün sütunlar.", "Names the columns to read from a table. `*` means all columns.", { sql: "SELECT name, city FROM users;" }, ["sql-select"]),
  e("sql-from", "FROM", "sql", "keyword", "Məlumatın oxunduğu cədvəli göstərir.", "Names the table the data comes from.", { sql: "SELECT * FROM users;" }, ["sql-select"]),
  e("sql-where", "WHERE", "sql", "keyword", "Sətirləri şərtə görə süzür.", "Filters rows by a condition.", { sql: "SELECT * FROM users WHERE age >= 18;" }, ["sql-select"]),
  e("sql-order", "ORDER BY", "sql", "keyword", "Nəticəni sıralayır: `ASC` artan (standart), `DESC` azalan.", "Sorts the result: `ASC` ascending (default), `DESC` descending.", { sql: "SELECT * FROM users ORDER BY age DESC;" }, ["sql-select"]),
  e("sql-limit", "LIMIT", "sql", "keyword", "Qaytarılan sətirlərin sayını məhdudlaşdırır (SQLite, PostgreSQL, MySQL).", "Caps how many rows are returned (SQLite, PostgreSQL, MySQL).", { sql: "SELECT * FROM users LIMIT 10;" }, ["sql-select"]),
  e("sql-null", "IS NULL", "sql", "operator", "Dəyərin məlum olmadığını (`NULL`) yoxlayır. `= NULL` heç vaxt doğru olmur.", "Tests whether a value is unknown (`NULL`). `= NULL` is never true.", { sql: "SELECT * FROM users WHERE age IS NULL;" }, ["sql-select"], ["NULL", "IS NOT NULL"]),
  e("sql-and", "AND", "sql", "operator", "Hər iki şərt doğru olmalıdır. `OR` — biri kifayətdir.", "Both conditions must be true. `OR` — either is enough.", { sql: "WHERE city = 'Baku' AND age >= 18" }, ["sql-select"], ["OR"]),
  e("sql-join", "JOIN", "sql", "keyword", "İki cədvəli əlaqəli sütun üzrə birləşdirir (`ON` ilə).", "Combines two tables on a related column (with `ON`).", { sql: "SELECT o.id, u.name\nFROM orders o\nJOIN users u ON u.id = o.user_id;" }),
  e("sql-group", "GROUP BY", "sql", "keyword", "Eyni dəyərli sətirləri qruplaşdırır; `COUNT`, `SUM` kimi funksiyalarla istifadə olunur.", "Groups rows with equal values; used with functions like `COUNT` and `SUM`.", { sql: "SELECT city, COUNT(*) FROM users GROUP BY city;" }, [], ["COUNT", "SUM", "AVG"]),
  e("sql-insert", "INSERT INTO", "sql", "keyword", "Cədvələ yeni sətir əlavə edir.", "Adds a new row to a table.", { sql: "INSERT INTO users (name, city) VALUES ('Nigar', 'Baku');" }),
  e("sql-update", "UPDATE", "sql", "keyword", "Mövcud sətirləri dəyişir. `WHERE` olmadan bütün sətirlər dəyişir!", "Changes existing rows. Without `WHERE` every row changes!", { sql: "UPDATE users SET city = 'Baku' WHERE id = 2;" }),
  e("sql-delete", "DELETE", "sql", "keyword", "Sətirləri silir. `WHERE` olmadan cədvəldəki bütün sətirlər silinir!", "Deletes rows. Without `WHERE` every row in the table is deleted!", { sql: "DELETE FROM users WHERE id = 4;" }),

  // ---------- Cross-language concepts ----------
  e("c-variable", "variable", null, "concept", "Dəyişən — dəyərə verilən ad. Dəyəri saxlamağa və sonra adla istifadə etməyə imkan verir.", "A variable is a name for a value, so it can be stored and used later by name.", { python: "age = 20", javascript: "let age = 20;" }, ["python-variables", "javascript-variables"], ["dəyişən", "değişken", "переменная"]),
  e("c-function", "function", null, "concept", "Funksiya — adı olan, təkrar istifadə edilən kod bloku; giriş alır, nəticə qaytarır.", "A function is a named, reusable block of code that takes input and returns a result.", { python: "def add(a, b):\n    return a + b", javascript: "function add(a, b) {\n  return a + b;\n}" }, ["python-functions", "javascript-functions"], ["funksiya", "fonksiyon", "функция"]),
  e("c-loop", "loop", null, "concept", "Dövr — kod blokunu təkrar-təkrar işlətmək.", "A loop runs a block of code repeatedly.", { python: "for i in range(3):\n    print(i)", javascript: "for (let i = 0; i < 3; i++) {\n  console.log(i);\n}" }, ["python-loops", "javascript-arrays"], ["dövr", "döngü", "цикл"]),
  e("c-condition", "condition", null, "concept", "Şərt — doğru/yalan nəticə verən ifadə; proqramın qərar verməsini təmin edir.", "A condition is an expression that is true or false, letting a program make decisions.", { python: "if x > 0:\n    print(\"positive\")", javascript: "if (x > 0) {\n  console.log(\"positive\");\n}" }, ["python-conditions", "javascript-conditions"], ["şərt", "koşul", "условие"]),
  e("c-array", "array / list", null, "concept", "Massiv/siyahı — dəyərləri sıra ilə saxlayan kolleksiya; elementlərə indekslə müraciət olunur.", "An array/list is an ordered collection of values accessed by index.", { python: "nums = [1, 2, 3]", javascript: "const nums = [1, 2, 3];" }, ["python-lists", "javascript-arrays"], ["massiv", "siyahı", "dizi", "liste", "массив", "список"]),
  e("c-async", "async", null, "concept", "Asinxron proqramlaşdırma — gözləmə tələb edən işləri (şəbəkə, fayl) proqramı dondurmadan icra etmək. JavaScript-də Promise + `async/await`, Python-da `asyncio` + `async/await` istifadə olunur.", "Asynchronous programming runs work that waits (network, files) without freezing the program. JavaScript uses Promises + `async/await`; Python uses `asyncio` + `async/await`.", {
    javascript: "async function load() {\n  const res = await fetch(\"/api/data\");\n  return res.json();\n}",
    python: "import asyncio\n\nasync def main():\n    await asyncio.sleep(1)\n\nasyncio.run(main())",
  }, [], ["asinxron", "asenkron", "асинхронный", "await", "promise"]),
];

const norm = (s: string) => s.toLowerCase();

/** Looks up a token as written in code for a given language. */
export function findTerm(token: string, lang: CodeLang): TermEntry | undefined {
  const t = token.trim();
  const exact = TERMS.find((x) => x.lang === lang && (x.token === t || (lang === "sql" && norm(x.token) === norm(t))));
  if (exact) return exact;
  return TERMS.find((x) => x.lang === lang && x.aliases?.some((a) => a === t || (lang === "sql" && norm(a) === norm(t))));
}
