import type { CodeLang, L } from "../content/types";

// Error Translator pattern library. A match identifies the error TYPE with certainty (the message
// text is recognisable); the causes listed are LIKELY causes — the UI says so explicitly.
// `{1}`, `{2}` in texts are replaced by the regex capture groups (e.g. the missing name).

export interface ErrorPattern {
  id: string;
  tech: "python" | "javascript" | "sql" | "node";
  re: RegExp;
  title: L;
  meaning: L;
  causes: L[];
  fixes: L[];
  example?: { lang: CodeLang; wrong: string; right: string };
  lessons: string[];
}

const p = (x: ErrorPattern) => x;

export const ERROR_PATTERNS: ErrorPattern[] = [
  // ---------- Python ----------
  p({
    id: "py-nameerror", tech: "python", re: /NameError: name '([^']+)' is not defined/,
    title: { az: "NameError — ad tapılmadı", en: "NameError — name not found" },
    meaning: { az: "Python `{1}` adını tanımır: bu adda dəyişən, funksiya və ya modul bu nöqtədə mövcud deyil.", en: "Python does not know the name `{1}`: no variable, function or module with that name exists at this point." },
    causes: [
      { az: "Adda yazı səhvi və ya böyük-kiçik hərf fərqi (`Name` ≠ `name`).", en: "A typo or a letter-case difference (`Name` ≠ `name`)." },
      { az: "Dəyişən istifadə olunduğu sətirdən sonra yaradılıb.", en: "The variable is created after the line that uses it." },
      { az: "Modul `import` edilməyib.", en: "A module was not imported." },
      { az: "Mətn dırnaqsız yazılıb (`print(hello)` əvəzinə `print(\"hello\")`).", en: "Text written without quotes (`print(hello)` instead of `print(\"hello\")`)." },
    ],
    fixes: [
      { az: "`{1}` adının yazılışını təyin olunduğu yerlə müqayisə edin.", en: "Compare the spelling of `{1}` with where it is defined." },
      { az: "Təyini istifadədən əvvələ köçürün və ya lazımi `import`-u əlavə edin.", en: "Move the definition above its use or add the missing `import`." },
    ],
    example: { lang: "python", wrong: 'name = "Aysel"\nprint(Name)', right: 'name = "Aysel"\nprint(name)' },
    lessons: ["python-variables"],
  }),
  p({
    id: "py-concat", tech: "python", re: /TypeError: can only concatenate str \(not "([^"]+)"\) to str/,
    title: { az: "TypeError — mətnlə {1} birləşdirilə bilməz", en: "TypeError — cannot join text and {1}" },
    meaning: { az: "`+` ilə `str` və `{1}` tipli dəyər birləşdirilməyə çalışılıb. Python tipləri avtomatik çevirmir.", en: "`+` was used to join a `str` with a `{1}` value. Python does not convert types automatically." },
    causes: [{ az: "Ədəd mətnə `+` ilə əlavə olunub.", en: "A number was added to text with `+`." }],
    fixes: [
      { az: "Dəyəri `str()` ilə çevirin və ya f-sətir istifadə edin: `f\"Age: {age}\"`.", en: "Convert with `str()` or use an f-string: `f\"Age: {age}\"`." },
    ],
    example: { lang: "python", wrong: 'print("Age: " + 20)', right: 'print("Age: " + str(20))\nprint(f"Age: {20}")' },
    lessons: ["python-variables"],
  }),
  p({
    id: "py-unsupported-operand", tech: "python", re: /TypeError: unsupported operand type\(s\) for ([^:]+): '([^']+)' and '([^']+)'/,
    title: { az: "TypeError — `{1}` operatoru bu tiplərlə işləmir", en: "TypeError — operator `{1}` does not work with these types" },
    meaning: { az: "`{1}` əməliyyatı `{2}` və `{3}` tipli dəyərlər arasında təyin olunmayıb.", en: "The `{1}` operation is not defined between `{2}` and `{3}` values." },
    causes: [
      { az: "Dəyərlərdən biri gözlənilmədən `None`-dur (məs., `return` olmayan funksiyanın nəticəsi).", en: "One value is unexpectedly `None` (e.g. the result of a function without `return`)." },
      { az: "`input()`-dan gələn mətn ədəd kimi istifadə olunub.", en: "Text from `input()` was used as a number." },
    ],
    fixes: [
      { az: "Hər dəyərin tipini `type()` ilə yoxlayın və lazım olduqda `int()` / `float()` ilə çevirin.", en: "Check each value's type with `type()` and convert with `int()` / `float()` where needed." },
      { az: "Funksiyanın `return` etdiyinə əmin olun.", en: "Make sure the function actually `return`s a value." },
    ],
    lessons: ["python-functions", "python-variables"],
  }),
  p({
    id: "py-indent", tech: "python", re: /IndentationError: (expected an indented block|unexpected indent|unindent does not match any outer indentation level)/,
    title: { az: "IndentationError — girinti xətası", en: "IndentationError — indentation problem" },
    meaning: { az: "Python blokları girinti ilə müəyyən edir və girinti burada qaydaya uyğun deyil: \"{1}\".", en: "Python defines blocks by indentation, and the indentation here breaks the rules: \"{1}\"." },
    causes: [
      { az: "`if`, `for`, `def` sətrindən sonra blok girintisiz yazılıb.", en: "The block after an `if`, `for` or `def` line is not indented." },
      { az: "Səbəbsiz əlavə boşluq var.", en: "There is extra indentation without a reason." },
      { az: "Tab və boşluqlar qarışdırılıb.", en: "Tabs and spaces are mixed." },
    ],
    fixes: [
      { az: "Blokdakı bütün sətirləri eyni sayda boşluqla (standart 4) girintiləyin; redaktorda \"tab-ı boşluğa çevir\" seçimini aktiv edin.", en: "Indent every line of the block by the same number of spaces (4 by convention); enable \"convert tabs to spaces\" in your editor." },
    ],
    example: { lang: "python", wrong: 'if ok:\nprint("yes")', right: 'if ok:\n    print("yes")' },
    lessons: ["python-conditions"],
  }),
  p({
    // Excludes the wording V8/JavaScript uses, so a JS SyntaxError is not reported as Python.
    id: "py-syntax", tech: "python", re: /SyntaxError: (?!Unexpected |Invalid or unexpected|missing \) )(.+)/,
    title: { az: "SyntaxError — sintaksis xətası", en: "SyntaxError — invalid syntax" },
    meaning: { az: "Kod Python qrammatikasına uyğun deyil və heç işə düşmür. Python-un mesajı: \"{1}\".", en: "The code does not follow Python's grammar and cannot run at all. Python says: \"{1}\"." },
    causes: [
      { az: "`if`, `for`, `def`, `else` sətrinin sonunda iki nöqtə yoxdur.", en: "A colon is missing at the end of an `if`, `for`, `def` or `else` line." },
      { az: "Şərtdə `==` əvəzinə `=` yazılıb.", en: "`=` was written instead of `==` in a condition." },
      { az: "Mötərizə və ya dırnaq bağlanmayıb.", en: "A bracket or quote was not closed." },
    ],
    fixes: [
      { az: "Göstərilən sətrə və ondan bir əvvəlki sətrə baxın: çatışmayan iki nöqtə, mötərizə və ya dırnaq çox vaxt oradadır.", en: "Look at the reported line and the line before it: a missing colon, bracket or quote is usually there." },
    ],
    example: { lang: "python", wrong: 'if age = 18\n    print("18")', right: 'if age == 18:\n    print("18")' },
    lessons: ["python-conditions"],
  }),
  p({
    id: "py-index", tech: "python", re: /IndexError: (list|string|tuple) index out of range/,
    title: { az: "IndexError — indeks hüdudlardan kənardadır", en: "IndexError — index out of range" },
    meaning: { az: "Mövcud olmayan mövqeyə ({1}) müraciət olunub. N elementli ardıcıllıqda indekslər 0-dan N−1-ə qədərdir.", en: "A position that does not exist was accessed ({1}). In a sequence of N items, indexes run from 0 to N−1." },
    causes: [
      { az: "Son element `items[len(items)]` kimi götürülüb.", en: "The last item was read as `items[len(items)]`." },
      { az: "Siyahı gözləniləndən qısadır və ya boşdur.", en: "The list is shorter than expected or empty." },
    ],
    fixes: [
      { az: "Sonuncu element üçün `items[-1]` istifadə edin; müraciətdən əvvəl `len()` ilə uzunluğu yoxlayın.", en: "Use `items[-1]` for the last item; check `len()` before indexing." },
    ],
    example: { lang: "python", wrong: "items = [1, 2, 3]\nprint(items[3])", right: "items = [1, 2, 3]\nprint(items[-1])" },
    lessons: ["python-lists"],
  }),
  p({
    id: "py-key", tech: "python", re: /KeyError: (.+)/,
    title: { az: "KeyError — açar lüğətdə yoxdur", en: "KeyError — key not in dictionary" },
    meaning: { az: "Lüğətdə (`dict`) {1} açarı yoxdur.", en: "The dictionary (`dict`) has no key {1}." },
    causes: [{ az: "Açarın adında yazı səhvi və ya açar heç əlavə edilməyib.", en: "A typo in the key, or the key was never added." }],
    fixes: [
      { az: "`d.get(açar, standart)` istifadə edin və ya əvvəlcə `if açar in d:` ilə yoxlayın.", en: "Use `d.get(key, default)` or check first with `if key in d:`." },
    ],
    lessons: [],
  }),
  p({
    id: "py-zero", tech: "python", re: /ZeroDivisionError: (division by zero|float division by zero|integer division or modulo by zero|integer modulo by zero)/,
    title: { az: "ZeroDivisionError — sıfıra bölmə", en: "ZeroDivisionError — division by zero" },
    meaning: { az: "Ədəd sıfıra bölünüb; bu riyazi cəhətdən təyin olunmayıb.", en: "A number was divided by zero, which is mathematically undefined." },
    causes: [{ az: "Bölən dəyişən (məs., elementlərin sayı) 0-dır.", en: "The divisor variable (e.g. an item count) is 0." }],
    fixes: [{ az: "Bölmədən əvvəl yoxlayın: `if count > 0:`.", en: "Check before dividing: `if count > 0:`." }],
    example: { lang: "python", wrong: "avg = total / count", right: "avg = total / count if count > 0 else 0" },
    lessons: ["python-conditions"],
  }),
  p({
    id: "py-module", tech: "python", re: /ModuleNotFoundError: No module named '([^']+)'/,
    title: { az: "ModuleNotFoundError — `{1}` modulu tapılmadı", en: "ModuleNotFoundError — module `{1}` not found" },
    meaning: { az: "Python `{1}` modulunu tapa bilmir.", en: "Python cannot find the module `{1}`." },
    causes: [
      { az: "Paket quraşdırılmayıb.", en: "The package is not installed." },
      { az: "Paket başqa Python mühitinə (virtual environment) quraşdırılıb.", en: "The package was installed into a different Python environment (virtual environment)." },
      { az: "Modul adında yazı səhvi; bəzi paketlərin quraşdırma adı modul adından fərqlidir.", en: "A typo in the module name; some packages are installed under a different name than they are imported." },
    ],
    fixes: [
      { az: "Eyni Python ilə quraşdırın: `python -m pip install <paket>` (paketin adını onun rəsmi sənədindən yoxlayın).", en: "Install with the same Python: `python -m pip install <package>` (check the package name in its official docs)." },
    ],
    lessons: [],
  }),
  p({
    id: "py-attr-none", tech: "python", re: /AttributeError: 'NoneType' object has no attribute '([^']+)'/,
    title: { az: "AttributeError — `None` üzərində `{1}`", en: "AttributeError — `{1}` on `None`" },
    meaning: { az: "Dəyər `None`-dur, ona görə onun `{1}` atributu/metodu yoxdur.", en: "The value is `None`, so it has no `{1}` attribute or method." },
    causes: [
      { az: "Dəyişən `append()`, `sort()` kimi `None` qaytaran metodun nəticəsi ilə əvəz olunub.", en: "The variable was overwritten with the result of a method that returns `None`, such as `append()` or `sort()`." },
      { az: "Funksiyada `return` yoxdur.", en: "A function has no `return`." },
    ],
    fixes: [{ az: "`x = x.append(...)` əvəzinə sadəcə `x.append(...)` yazın; funksiyalara `return` əlavə edin.", en: "Write `x.append(...)` instead of `x = x.append(...)`; add `return` to functions." }],
    example: { lang: "python", wrong: "items = items.append(3)\nitems.append(4)", right: "items.append(3)\nitems.append(4)" },
    lessons: ["python-lists", "python-functions"],
  }),
  p({
    id: "py-value-int", tech: "python", re: /ValueError: invalid literal for int\(\) with base 10: '([^']*)'/,
    title: { az: "ValueError — '{1}' tam ədədə çevrilə bilmir", en: "ValueError — '{1}' cannot become an integer" },
    meaning: { az: "`int()` '{1}' mətnini tam ədədə çevirə bilmədi.", en: "`int()` could not convert the text '{1}' into an integer." },
    causes: [
      { az: "İstifadəçi rəqəm əvəzinə mətn və ya boş sətir daxil edib.", en: "The user entered text or an empty string instead of digits." },
      { az: "Kəsr ədəd (`\"3.5\"`) `int()`-ə verilib.", en: "A decimal (`\"3.5\"`) was passed to `int()`." },
    ],
    fixes: [{ az: "Çevirməni `try/except ValueError` ilə əhatə edin; kəsr üçün `float()` istifadə edin.", en: "Wrap the conversion in `try/except ValueError`; use `float()` for decimals." }],
    lessons: ["python-variables"],
  }),

  // ---------- JavaScript ----------
  p({
    id: "js-not-defined", tech: "javascript", re: /ReferenceError: (\w+) is not defined/,
    title: { az: "ReferenceError — `{1}` təyin olunmayıb", en: "ReferenceError — `{1}` is not defined" },
    meaning: { az: "JavaScript `{1}` adında dəyişən və ya funksiya tapmadı.", en: "JavaScript found no variable or function named `{1}`." },
    causes: [
      { az: "Yazı səhvi və ya böyük-kiçik hərf fərqi.", en: "A typo or a letter-case difference." },
      { az: "Dəyişən başqa blokda/funksiyada elan edilib və burada görünmür.", en: "The variable was declared in another block or function and is not visible here." },
      { az: "Skript və ya kitabxana yüklənməyib (məs., `<script>` sırası).", en: "A script or library was not loaded (e.g. `<script>` order)." },
    ],
    fixes: [{ az: "`{1}` adının elanını tapın və istifadə yerinin onun görünmə sahəsində olduğunu yoxlayın.", en: "Find where `{1}` is declared and check that its use is inside that scope." }],
    lessons: ["javascript-variables"],
  }),
  p({
    id: "js-tdz", tech: "javascript", re: /ReferenceError: Cannot access '(\w+)' before initialization/,
    title: { az: "ReferenceError — `{1}` elandan əvvəl istifadə olunub", en: "ReferenceError — `{1}` used before its declaration" },
    meaning: { az: "`let`/`const` ilə elan edilmiş `{1}` elan sətrinə çatmadan oxunub (\"temporal dead zone\").", en: "`{1}`, declared with `let`/`const`, was read before its declaration line ran (the \"temporal dead zone\")." },
    causes: [{ az: "İstifadə elan sətrindən yuxarıdadır; və ya `const` ilə yazılmış funksiya elandan əvvəl çağırılıb.", en: "The use is above the declaration; or a function stored in a `const` was called before it." }],
    fixes: [{ az: "Elanı istifadədən əvvələ köçürün.", en: "Move the declaration above its use." }],
    example: { lang: "javascript", wrong: 'console.log(city);\nlet city = "Baku";', right: 'let city = "Baku";\nconsole.log(city);' },
    lessons: ["javascript-variables", "javascript-functions"],
  }),
  p({
    id: "js-const-assign", tech: "javascript", re: /TypeError: Assignment to constant variable/,
    title: { az: "TypeError — `const` yenidən mənimsədilib", en: "TypeError — reassigning a `const`" },
    meaning: { az: "`const` ilə elan edilmiş ad başqa dəyərə bağlana bilməz.", en: "A name declared with `const` cannot be bound to another value." },
    causes: [{ az: "Dəyəri dəyişməli olan dəyişən `const` ilə elan edilib (məs., sayğac).", en: "A variable that must change (e.g. a counter) was declared with `const`." }],
    fixes: [{ az: "Dəyər dəyişəcəksə `let` istifadə edin.", en: "Use `let` if the value will change." }],
    example: { lang: "javascript", wrong: "const total = 0;\ntotal = 10;", right: "let total = 0;\ntotal = 10;" },
    lessons: ["javascript-variables"],
  }),
  p({
    id: "js-read-undefined", tech: "javascript", re: /TypeError: Cannot read propert(?:y|ies) of (undefined|null)(?: \(reading '([^']+)'\))?/,
    title: { az: "TypeError — {1} üzərində xassə oxunub", en: "TypeError — reading a property of {1}" },
    meaning: { az: "`{1}` dəyərinin `{2}` xassəsi oxunmağa çalışılıb. `{1}` obyekt deyil və xassəsi yoxdur.", en: "The code tried to read `{2}` from `{1}`. `{1}` is not an object and has no properties." },
    causes: [
      { az: "Obyekt hələ yüklənməyib (məs., API cavabı gəlməmiş istifadə).", en: "The object has not loaded yet (e.g. used before an API response arrived)." },
      { az: "Massivdə mövcud olmayan indeks (`arr[arr.length]`).", en: "A missing array index (`arr[arr.length]`)." },
      { az: "`document.querySelector` heç bir element tapmayıb və `null` qaytarıb.", en: "`document.querySelector` found no element and returned `null`." },
    ],
    fixes: [
      { az: "Xassədən əvvəl dəyəri yoxlayın və ya isteğe bağlı zəncir istifadə edin: `user?.name`.", en: "Check the value first or use optional chaining: `user?.name`." },
    ],
    example: { lang: "javascript", wrong: "const user = undefined;\nconsole.log(user.name);", right: "const user = undefined;\nconsole.log(user?.name); // undefined" },
    lessons: ["javascript-arrays", "javascript-conditions"],
  }),
  p({
    id: "js-not-function", tech: "javascript", re: /TypeError: ([\w.$[\]]+) is not a function/,
    title: { az: "TypeError — `{1}` funksiya deyil", en: "TypeError — `{1}` is not a function" },
    meaning: { az: "`{1}` mötərizə ilə çağırılıb, amma dəyəri funksiya deyil.", en: "`{1}` was called with parentheses, but its value is not a function." },
    causes: [
      { az: "Metod adında yazı səhvi (məs., `forEach` əvəzinə `foreach`).", en: "A typo in a method name (e.g. `foreach` instead of `forEach`)." },
      { az: "Massiv metodu massiv olmayan dəyərdə çağırılıb.", en: "An array method was called on something that is not an array." },
      { az: "Eyni ad dəyişən üçün də istifadə olunub və funksiyanın üzərinə yazılıb.", en: "The same name was reused for a variable, overwriting the function." },
    ],
    fixes: [{ az: "`typeof` ilə dəyərin tipini yoxlayın və metod adını rəsmi sənəddə yoxlayın.", en: "Check the value with `typeof` and verify the method name in the documentation." }],
    lessons: ["javascript-functions", "javascript-arrays"],
  }),
  p({
    id: "js-unexpected-token", tech: "javascript", re: /SyntaxError: Unexpected token '?([^'\s]*)'?/,
    title: { az: "SyntaxError — gözlənilməz simvol", en: "SyntaxError — unexpected token" },
    meaning: { az: "Kodu oxuyan parser bu nöqtədə `{1}` simvolunu gözləmirdi.", en: "The parser did not expect `{1}` at this point." },
    causes: [
      { az: "Mötərizə `( ) { } [ ]` cütlərindən biri bağlanmayıb və ya artıqdır.", en: "A bracket pair `( ) { } [ ]` is unclosed or extra." },
      { az: "JSON gözlənilən yerdə HTML gəlib (`Unexpected token '<'`).", en: "HTML arrived where JSON was expected (`Unexpected token '<'`)." },
      { az: "Obyekt və ya massivdə vergül çatmır.", en: "A comma is missing in an object or array." },
    ],
    fixes: [{ az: "Redaktorun mötərizə cütləşdirməsindən istifadə edib cütləri yoxlayın; API cavabının həqiqətən JSON olduğunu yoxlayın.", en: "Use the editor's bracket matching to check pairs; verify that the API response is really JSON." }],
    lessons: [],
  }),
  p({
    id: "js-unhandled-promise", tech: "javascript", re: /Uncaught \(in promise\)(.*)/,
    title: { az: "Promise xətası tutulmayıb", en: "Unhandled Promise rejection" },
    meaning: { az: "Asinxron əməliyyat uğursuz olub və xəta heç yerdə tutulmayıb.{1}", en: "An asynchronous operation failed and nobody handled the error.{1}" },
    causes: [{ az: "`await` `try/catch` olmadan istifadə olunub və ya Promise-ə `.catch()` əlavə edilməyib.", en: "`await` was used without `try/catch`, or the Promise has no `.catch()`." }],
    fixes: [{ az: "`try { await ... } catch (err) { ... }` və ya `.catch(err => ...)` əlavə edin.", en: "Add `try { await ... } catch (err) { ... }` or `.catch(err => ...)`." }],
    lessons: [],
  }),

  // ---------- Node.js ----------
  p({
    id: "node-module", tech: "node", re: /Cannot find module '([^']+)'/,
    title: { az: "Node.js — `{1}` modulu tapılmadı", en: "Node.js — cannot find module `{1}`" },
    meaning: { az: "Node.js `{1}` modulunu və ya faylını tapa bilmir.", en: "Node.js cannot find the module or file `{1}`." },
    causes: [
      { az: "Paket quraşdırılmayıb (`node_modules` yoxdur).", en: "The package is not installed (`node_modules` is missing)." },
      { az: "Nisbi yol səhvdir və ya fayl adının hərfləri fərqlidir.", en: "The relative path is wrong or the file name's letter case differs." },
    ],
    fixes: [{ az: "Layihə qovluğunda `npm install` işlədin; nisbi yolları `./` ilə başlayaraq yoxlayın.", en: "Run `npm install` in the project folder; check relative paths starting with `./`." }],
    lessons: [],
  }),

  // ---------- SQL (SQLite / PostgreSQL wording) ----------
  p({
    id: "sql-no-table", tech: "sql", re: /no such table: (\S+)|relation "([^"]+)" does not exist/,
    title: { az: "SQL — cədvəl tapılmadı", en: "SQL — table not found" },
    meaning: { az: "Sorğu verilənlər bazasında olmayan cədvələ müraciət edir: `{1}{2}`.", en: "The query refers to a table that does not exist in the database: `{1}{2}`." },
    causes: [
      { az: "Cədvəl adında yazı səhvi.", en: "A typo in the table name." },
      { az: "Cədvəl hələ yaradılmayıb (miqrasiya işlədilməyib).", en: "The table has not been created yet (migrations not run)." },
      { az: "Başqa verilənlər bazasına qoşulub.", en: "Connected to a different database." },
    ],
    fixes: [{ az: "Cədvəl siyahısını yoxlayın (SQLite: `.tables`; PostgreSQL: `\\dt`).", en: "List the tables (SQLite: `.tables`; PostgreSQL: `\\dt`)." }],
    lessons: ["sql-select"],
  }),
  p({
    id: "sql-no-column", tech: "sql", re: /no such column: (\S+)|column "([^"]+)" does not exist/,
    title: { az: "SQL — sütun tapılmadı", en: "SQL — column not found" },
    meaning: { az: "Cədvəldə `{1}{2}` adlı sütun yoxdur.", en: "The table has no column named `{1}{2}`." },
    causes: [
      { az: "Sütun adında yazı səhvi.", en: "A typo in the column name." },
      { az: "Mətn dəyəri cüt dırnaqla yazılıb və sütun adı kimi oxunub (`\"Baku\"` əvəzinə `'Baku'`).", en: "A text value was written in double quotes and read as a column name (`\"Baku\"` instead of `'Baku'`)." },
    ],
    fixes: [{ az: "Mətn dəyərləri üçün tək dırnaq istifadə edin; sütun adlarını cədvəlin sxemi ilə müqayisə edin.", en: "Use single quotes for text values; compare column names with the table schema." }],
    example: { lang: "sql", wrong: "SELECT * FROM users WHERE city = \"Baku\";", right: "SELECT * FROM users WHERE city = 'Baku';" },
    lessons: ["sql-select"],
  }),
  p({
    id: "sql-syntax", tech: "sql", re: /(?:near "([^"]+)": syntax error|syntax error at or near "([^"]+)")/,
    title: { az: "SQL — sintaksis xətası", en: "SQL — syntax error" },
    meaning: { az: "Sorğu `{1}{2}` sözünün yaxınlığında SQL qrammatikasına uyğun deyil.", en: "The query breaks SQL grammar near `{1}{2}`." },
    causes: [
      { az: "Bəndlərin sırası səhvdir (məs., `WHERE` `ORDER BY`-dan sonra yazılıb).", en: "Clauses are in the wrong order (e.g. `WHERE` after `ORDER BY`)." },
      { az: "Sütunlar arasında vergül artıq və ya çatmır.", en: "A comma between columns is extra or missing." },
      { az: "Ehtiyatda olan söz (məs., `order`, `group`) dırnaqsız ad kimi istifadə olunub.", en: "A reserved word (e.g. `order`, `group`) is used as a name without quoting." },
    ],
    fixes: [{ az: "Sıra belədir: `SELECT … FROM … WHERE … GROUP BY … ORDER BY … LIMIT …`.", en: "The order is: `SELECT … FROM … WHERE … GROUP BY … ORDER BY … LIMIT …`." }],
    lessons: ["sql-select"],
  }),
];

export interface ErrorMatch {
  pattern: ErrorPattern;
  groups: string[];
  line: number | null;
}

/** Extracts a line number from common formats: Python tracebacks, JS stack traces, compilers. */
export function extractLine(text: string): number | null {
  const m =
    /line (\d+)/i.exec(text) ??
    /\.(?:js|mjs|cjs|ts|tsx|jsx|py):(\d+)(?::\d+)?/.exec(text) ??
    /:(\d+):\d+\)?\s*$/m.exec(text);
  return m ? Number(m[1]) : null;
}

/** All patterns matching the text, most specific first (library order encodes specificity). */
export function matchErrors(text: string): ErrorMatch[] {
  const out: ErrorMatch[] = [];
  const line = extractLine(text);
  for (const pattern of ERROR_PATTERNS) {
    const m = pattern.re.exec(text);
    if (m) out.push({ pattern, groups: m.slice(1).map((g) => g ?? ""), line });
  }
  // The generic Python SyntaxError is dropped when a more specific error matched, or when the
  // text is clearly from a browser/Node ("Uncaught", JavaScript patterns).
  const jsLike = /Uncaught|at .+\.(m?js|ts|tsx|jsx):\d+/.test(text) || out.some((x) => x.pattern.tech === "javascript");
  return out.filter((x, _i, all) => !(x.pattern.id === "py-syntax" && (jsLike || all.some((y) => y.pattern.id === "py-indent"))));
}

/** Replaces {1}, {2}… with capture groups. */
export function fillGroups(text: string, groups: string[]): string {
  return text.replace(/\{(\d)\}/g, (_, n) => groups[Number(n) - 1] ?? "");
}
