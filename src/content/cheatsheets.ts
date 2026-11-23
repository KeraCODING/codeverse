// Cheat sheets: short, offline syntax references. Code is language-neutral; every entry has an
// Azerbaijani and English explanation (tr/ru optional, shown with az → en fallback).
import type { CodeLang, L, Source } from "./types";

export interface CheatEntry {
  code: string;
  note: L;
}

export interface CheatSection {
  id: string;
  title: L;
  entries: CheatEntry[];
}

export interface CheatSheet {
  id: string;
  name: string;
  lang: CodeLang;
  desc: L;
  docs: Source;
  sections: CheatSection[];
}

const e = (code: string, az: string, en: string): CheatEntry => ({ code, note: { az, en } });
const T = (az: string, en: string, tr: string, ru: string): L => ({ az, en, tr, ru });

const TITLES = {
  variables: T("Dəyişənlər", "Variables", "Değişkenler", "Переменные"),
  types: T("Məlumat tipləri", "Data types", "Veri tipleri", "Типы данных"),
  operators: T("Operatorlar", "Operators", "Operatörler", "Операторы"),
  conditions: T("Şərtlər", "Conditions", "Koşullar", "Условия"),
  loops: T("Dövrlər", "Loops", "Döngüler", "Циклы"),
  functions: T("Funksiyalar", "Functions", "Fonksiyonlar", "Функции"),
  collections: T("Massivlər və kolleksiyalar", "Arrays and collections", "Diziler ve koleksiyonlar", "Массивы и коллекции"),
  classes: T("Obyektlər və siniflər", "Objects and classes", "Nesneler ve sınıflar", "Объекты и классы"),
  methods: T("Tez-tez işlənən metodlar", "Common methods", "Sık kullanılan metotlar", "Частые методы"),
  advanced: T("Qabaqcıl sintaksis", "Advanced syntax", "İleri sözdizimi", "Продвинутый синтаксис"),
};

const PYTHON: CheatSheet = {
  id: "python",
  name: "Python",
  lang: "python",
  desc: T(
    "Python 3 sintaksisi: dəyişənlər, kolleksiyalar, funksiyalar, siniflər.",
    "Python 3 syntax: variables, collections, functions, classes.",
    "Python 3 sözdizimi: değişkenler, koleksiyonlar, fonksiyonlar, sınıflar.",
    "Синтаксис Python 3: переменные, коллекции, функции, классы.",
  ),
  docs: { title: "Python 3 Documentation", url: "https://docs.python.org/3/" },
  sections: [
    {
      id: "variables",
      title: TITLES.variables,
      entries: [
        e("x = 10\nname = \"Ali\"", "Dəyişən ilk mənimsətmə ilə yaranır; tipi elan etmək lazım deyil.", "A variable is created by its first assignment; no type declaration is needed."),
        e("a, b = 1, 2", "Bir sətirdə bir neçə dəyişənə dəyər verilir.", "Assigns several variables in one line."),
        e("a, b = b, a", "İki dəyişənin dəyərlərini qarşılıqlı dəyişir (swap).", "Swaps the values of two variables."),
        e("MAX_SIZE = 100", "Böyük hərfli ad sabit (constant) kimi qəbul olunur, amma dil bunu məcburi etmir.", "An upper-case name signals a constant by convention; the language does not enforce it."),
        e("count: int = 0", "Tip annotasiyası (type hint); işləmə zamanı yoxlanılmır.", "A type hint; it is not checked at run time."),
        e("del x", "Dəyişəni (adı) silir.", "Deletes the variable (the name)."),
      ],
    },
    {
      id: "types",
      title: TITLES.types,
      entries: [
        e("n = 42        # int\npi = 3.14     # float\nz = 2 + 3j    # complex", "Ədəd tipləri: tam (`int`), kəsr (`float`) və kompleks (`complex`).", "Numeric types: integer (`int`), floating point (`float`) and `complex`."),
        e("s = \"salam\"   # str\nok = True     # bool\nx = None      # NoneType", "Mətn (`str`), məntiqi dəyər (`True`/`False`) və boş dəyər (`None`).", "Text (`str`), booleans (`True`/`False`) and the empty value `None`."),
        e("type(42)  # <class 'int'>", "Dəyərin tipini qaytarır.", "Returns the type of a value."),
        e("int(\"5\"), float(\"2.5\"), str(10), bool(0)", "Tip çevirmə (type conversion); `bool(0)` nəticəsi `False`-dur.", "Type conversion; `bool(0)` is `False`."),
        e("isinstance(x, (int, float))", "Dəyərin verilmiş tiplərdən birinə aid olub-olmadığını yoxlayır.", "Checks whether a value is an instance of one of the given types."),
      ],
    },
    {
      id: "operators",
      title: TITLES.operators,
      entries: [
        e("7 / 2    # 3.5\n7 // 2   # 3\n7 % 2    # 1\n2 ** 3   # 8", "Bölmə, tam bölmə, qalıq və qüvvətə yüksəltmə.", "Division, floor division, remainder and exponentiation."),
        e("==  !=  <  <=  >  >=", "Müqayisə operatorları; nəticə `bool` olur.", "Comparison operators; the result is a `bool`."),
        e("a and b, a or b, not a", "Məntiqi operatorlar sözlə yazılır.", "Logical operators are written as words."),
        e("3 in [1, 2, 3]       # True\n\"x\" not in \"abc\"    # True", "Üzvlük yoxlaması (membership).", "Membership test."),
        e("x is None", "Eyni obyekt olub-olmadığını yoxlayır; `None` ilə müqayisədə istifadə olunur.", "Identity test; the idiomatic way to compare with `None`."),
        e("x += 1\nx *= 2", "Qısa mənimsətmə operatorları (augmented assignment).", "Augmented assignment operators."),
        e("1 < x < 10", "Müqayisələr zəncir şəklində yazıla bilər.", "Comparisons can be chained."),
      ],
    },
    {
      id: "conditions",
      title: TITLES.conditions,
      entries: [
        e("if age >= 18:\n    print(\"adult\")\nelif age >= 13:\n    print(\"teen\")\nelse:\n    print(\"child\")", "Şərt bloku; bloklar girinti (indentation) ilə ayrılır.", "Conditional block; blocks are defined by indentation."),
        e("label = \"even\" if n % 2 == 0 else \"odd\"", "Bir sətirlik şərt ifadəsi (ternary).", "One-line conditional expression (ternary)."),
        e("if items:\n    print(\"not empty\")", "Boş kolleksiya, `0`, `\"\"` və `None` yalan (falsy) sayılır.", "Empty collections, `0`, `\"\"` and `None` are falsy."),
        e("match command:\n    case \"start\":\n        run()\n    case \"stop\" | \"quit\":\n        stop()\n    case _:\n        print(\"unknown\")", "Nümunə uyğunlaşdırma (pattern matching), Python 3.10+; `_` qalan bütün halları tutur.", "Structural pattern matching (Python 3.10+); `_` matches everything else."),
        e("if not (0 <= i < len(items)):\n    raise IndexError(i)", "Şərti `not` ilə inkar etmək.", "Negating a condition with `not`."),
      ],
    },
    {
      id: "loops",
      title: TITLES.loops,
      entries: [
        e("for i in range(5):\n    print(i)   # 0..4", "`range(5)` 0-dan 4-ə qədər ədədlər verir.", "`range(5)` yields the numbers 0 to 4."),
        e("for i in range(10, 0, -2):\n    print(i)", "`range(start, stop, step)`: başlanğıc, son (daxil deyil) və addım.", "`range(start, stop, step)`: start, stop (exclusive) and step."),
        e("for i, item in enumerate(items):\n    print(i, item)", "Elementlə yanaşı onun indeksini də verir.", "Gives the index together with each item."),
        e("for key, value in user.items():\n    print(key, value)", "Lüğətin (dict) açar-dəyər cütləri üzərində dövr.", "Loops over the key-value pairs of a dict."),
        e("for name, score in zip(names, scores):\n    print(name, score)", "İki kolleksiyanı paralel gəzir.", "Iterates over two collections in parallel."),
        e("while n > 0:\n    n -= 1", "Şərt doğru olduqca təkrarlanır.", "Repeats while the condition is true."),
        e("for x in data:\n    if x < 0:\n        continue\n    if x > 100:\n        break", "`continue` növbəti addıma keçir, `break` dövrü dayandırır.", "`continue` skips to the next iteration, `break` exits the loop."),
      ],
    },
    {
      id: "functions",
      title: TITLES.functions,
      entries: [
        e("def greet(name: str) -> str:\n    return f\"Hello, {name}!\"", "Funksiya `def` ilə təyin olunur; `return` nəticəni qaytarır.", "Functions are defined with `def`; `return` gives back the result."),
        e("def power(base, exp=2):\n    return base ** exp", "Standart (default) dəyərli parametr.", "Parameter with a default value."),
        e("power(exp=3, base=2)", "Adlı arqumentlər (keyword arguments) istənilən sırada verilə bilər.", "Keyword arguments can be passed in any order."),
        e("def total(*args, **kwargs):\n    return sum(args)", "`*args` əlavə mövqeli, `**kwargs` əlavə adlı arqumentləri toplayır.", "`*args` collects extra positional and `**kwargs` extra keyword arguments."),
        e("square = lambda x: x * x", "Qısa anonim funksiya (lambda); yalnız bir ifadə ola bilər.", "Short anonymous function (lambda); a single expression only."),
        e("def area(r):\n    \"\"\"Return the area of a circle.\"\"\"\n    return 3.14159 * r ** 2", "Sənədləşdirmə sətri (docstring) funksiyanın ilk sətridir.", "A docstring is the first statement of a function."),
      ],
    },
    {
      id: "collections",
      title: TITLES.collections,
      entries: [
        e("nums = [1, 2, 3]\nnums.append(4)\nnums[0] = 10", "Siyahı (`list`) dəyişdirilə bilən, sıralı kolleksiyadır.", "A `list` is a mutable, ordered collection."),
        e("nums[1:3]   # 2nd and 3rd items\nnums[-1]    # last item\nnums[::-1]  # reversed copy", "Dilimləmə (slicing) və mənfi indekslər.", "Slicing and negative indexes."),
        e("point = (3, 4)\nx, y = point", "Kortej (`tuple`) dəyişdirilə bilməz; açılaraq (unpacking) dəyişənlərə verilə bilər.", "A `tuple` is immutable and can be unpacked into variables."),
        e("user = {\"name\": \"Ali\", \"age\": 20}\nuser[\"age\"] = 21\nuser.get(\"email\", \"-\")", "Lüğət (`dict`) açar-dəyər cütləri saxlayır; `get` açar yoxdursa standart dəyər qaytarır.", "A `dict` stores key-value pairs; `get` returns a default when the key is missing."),
        e("a = {1, 2, 3}\nb = {3, 4}\na | b   # union\na & b   # intersection", "Çoxluq (`set`) təkrarsız elementlər saxlayır.", "A `set` holds unique items."),
        e("squares = [x * x for x in nums if x > 1]", "Siyahı generatoru (list comprehension) filtr ilə.", "List comprehension with a filter."),
        e("lengths = {w: len(w) for w in words}", "Lüğət generatoru (dict comprehension).", "Dict comprehension."),
      ],
    },
    {
      id: "classes",
      title: TITLES.classes,
      entries: [
        e("class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def bark(self):\n        return f\"{self.name}: woof\"", "Sinif; `__init__` konstruktordur, `self` obyektin özünə işarə edir.", "A class; `__init__` is the constructor and `self` refers to the instance."),
        e("rex = Dog(\"Rex\")\nrex.bark()", "Obyekt yaradılır və metodu çağırılır.", "Creates an instance and calls a method."),
        e("class Puppy(Dog):\n    def __init__(self, name):\n        super().__init__(name)\n        self.age = 0", "Varislik (inheritance); `super()` valideyn sinfin metodunu çağırır.", "Inheritance; `super()` calls the parent class method."),
        e("from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: float\n    y: float = 0.0", "`@dataclass` `__init__`, `__repr__` və `__eq__` metodlarını avtomatik yaradır.", "`@dataclass` generates `__init__`, `__repr__` and `__eq__` automatically."),
        e("class Circle:\n    def __init__(self, r):\n        self.r = r\n\n    @property\n    def area(self):\n        return 3.14159 * self.r ** 2", "`@property` metodu atribut kimi oxumağa imkan verir: `c.area`.", "`@property` lets a method be read like an attribute: `c.area`."),
        e("class Temp:\n    @classmethod\n    def from_f(cls, f):\n        return cls()\n\n    @staticmethod\n    def valid(x):\n        return x > -273.15", "`@classmethod` sinfi (`cls`), `@staticmethod` isə heç nə qəbul etmir.", "`@classmethod` receives the class (`cls`); `@staticmethod` receives neither class nor instance."),
        e("def __repr__(self):\n    return f\"Point({self.x}, {self.y})\"", "`__repr__` obyektin mətn təsvirini qaytarır.", "`__repr__` returns a text representation of the object."),
      ],
    },
    {
      id: "methods",
      title: TITLES.methods,
      entries: [
        e("s.upper(), s.lower(), s.strip(), s.title()", "Mətni böyük/kiçik hərfə çevirir, kənar boşluqları silir.", "Changes case and trims surrounding whitespace."),
        e("\"a,b,c\".split(\",\")     # ['a', 'b', 'c']\n\"-\".join([\"a\", \"b\"])  # 'a-b'", "`split` mətni hissələrə bölür, `join` birləşdirir.", "`split` breaks text into parts, `join` glues them together."),
        e("s.replace(\"old\", \"new\")\ns.startswith(\"http\")\ns.find(\"x\")  # -1 if missing", "Əvəzetmə və axtarış metodları.", "Replace and search methods."),
        e("len(items), sum(nums), min(nums), max(nums)", "Uzunluq, cəm, minimum və maksimum.", "Length, sum, minimum and maximum."),
        e("sorted(words, key=len, reverse=True)", "Yeni sıralanmış siyahı qaytarır; `key` sıralama meyarıdır.", "Returns a new sorted list; `key` sets the sort criterion."),
        e("nums.sort()\nnums.pop()\nnums.insert(0, 99)\nnums.remove(3)", "Siyahını yerində dəyişən metodlar.", "Methods that change a list in place."),
        e("user.keys(), user.values(), user.items()\nuser.update({\"age\": 22})", "Lüğətin açarları, dəyərləri, cütləri və yenilənməsi.", "A dict's keys, values, pairs and updating it."),
        e("any(x > 0 for x in nums)\nall(x > 0 for x in nums)", "Ən azı biri / hamısı şərtə uyğundurmu.", "Whether at least one / all items satisfy a condition."),
      ],
    },
    {
      id: "advanced",
      title: TITLES.advanced,
      entries: [
        e("f\"{price:.2f}\"   # '3.50'\nf\"{n:,}\"         # '1,000,000'\nf\"{x=}\"          # 'x=5'", "f-sətir (f-string) formatlaşdırması.", "f-string formatting."),
        e("try:\n    n = int(text)\nexcept ValueError as err:\n    print(err)\nelse:\n    print(n)\nfinally:\n    print(\"done\")", "Xətaların tutulması (exception handling); `else` xəta olmadıqda, `finally` həmişə işləyir.", "Exception handling; `else` runs when no error occurred, `finally` always runs."),
        e("raise ValueError(\"negative value\")", "Xəta yaradır (raise).", "Raises an exception."),
        e("with open(\"data.txt\", encoding=\"utf-8\") as f:\n    text = f.read()", "`with` faylı avtomatik bağlayır (context manager).", "`with` closes the file automatically (context manager)."),
        e("def count_up(n):\n    for i in range(n):\n        yield i", "Generator: `yield` dəyərləri bir-bir, lazım olduqca verir.", "Generator: `yield` produces values one at a time, on demand."),
        e("first, *rest = [1, 2, 3]   # 1, [2, 3]", "Ulduzlu açma (extended unpacking).", "Extended unpacking with a star."),
        e("if (n := len(items)) > 10:\n    print(n)", "Mənimsətmə ifadəsi (walrus `:=`), Python 3.8+.", "Assignment expression (walrus `:=`), Python 3.8+."),
        e("def log(fn):\n    def wrapper(*args, **kwargs):\n        print(\"call\", fn.__name__)\n        return fn(*args, **kwargs)\n    return wrapper\n\n@log\ndef add(a, b):\n    return a + b", "Dekorator funksiyanı başqa funksiya ilə \"bükür\".", "A decorator wraps a function with another function."),
      ],
    },
  ],
};

const JAVASCRIPT: CheatSheet = {
  id: "javascript",
  name: "JavaScript",
  lang: "javascript",
  desc: T(
    "Müasir JavaScript (ES2022+): dəyişənlər, massivlər, siniflər, async.",
    "Modern JavaScript (ES2022+): variables, arrays, classes, async.",
    "Modern JavaScript (ES2022+): değişkenler, diziler, sınıflar, async.",
    "Современный JavaScript (ES2022+): переменные, массивы, классы, async.",
  ),
  docs: { title: "MDN JavaScript Reference", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference" },
  sections: [
    {
      id: "variables",
      title: TITLES.variables,
      entries: [
        e("const pi = 3.14;\nlet count = 0;\ncount = 1;", "`const` yenidən mənimsədilə bilməz, `let` bilər; hər ikisi blok əhatəlidir (block scope).", "`const` cannot be reassigned, `let` can; both are block-scoped."),
        e("var old = 1;", "Köhnə üsul: funksiya əhatəli (function scope); yeni kodda `let`/`const` istifadə edin.", "Legacy: function-scoped; prefer `let`/`const` in new code."),
        e("const { name, age = 18 } = user;", "Obyektin açılması (destructuring), standart dəyərlə.", "Object destructuring with a default value."),
        e("const [first, , third] = arr;", "Massivin açılması; boş yer elementi ötürür.", "Array destructuring; an empty slot skips an item."),
        e("[a, b] = [b, a];", "İki dəyişənin dəyərlərini qarşılıqlı dəyişir (swap).", "Swaps the values of two variables."),
        e("const list = [];\nlist.push(1); // OK", "`const` dəyişməzlik vermir: obyektin içi dəyişə bilər.", "`const` does not make the value immutable: object contents can still change."),
      ],
    },
    {
      id: "types",
      title: TITLES.types,
      entries: [
        e("42, 3.14        // number\n\"hi\", 'hi'      // string\ntrue, false     // boolean", "Əsas primitiv tiplər: ədəd, mətn, məntiqi.", "Core primitive types: number, string, boolean."),
        e("null       // intentionally empty\nundefined  // not assigned", "`null` qəsdən boş dəyər, `undefined` isə mənimsədilməmiş dəyərdir.", "`null` is an intentional empty value; `undefined` means not assigned."),
        e("const big = 9007199254740993n; // bigint\nconst id = Symbol(\"id\");      // symbol", "Böyük tam ədədlər (`bigint`) və unikal açarlar (`symbol`).", "Arbitrarily large integers (`bigint`) and unique keys (`symbol`)."),
        e("typeof 42        // \"number\"\ntypeof null      // \"object\" (historical quirk)\nArray.isArray([]) // true", "Tipi yoxlamaq; massiv üçün `Array.isArray` istifadə edin.", "Checking types; use `Array.isArray` for arrays."),
        e("Number(\"5\"), String(5), Boolean(0)", "Açıq tip çevirmə; `Boolean(0)` nəticəsi `false`-dur.", "Explicit conversion; `Boolean(0)` is `false`."),
      ],
    },
    {
      id: "operators",
      title: TITLES.operators,
      entries: [
        e("5 === \"5\"  // false\n5 == \"5\"   // true", "`===` tipi də müqayisə edir; həmişə `===` və `!==` istifadə edin.", "`===` also compares types; always prefer `===` and `!==`."),
        e("7 % 2   // 1\n2 ** 3  // 8", "Qalıq və qüvvətə yüksəltmə.", "Remainder and exponentiation."),
        e("a && b, a || b, !a", "Məntiqi operatorlar: VƏ, VƏ YA, İNKAR.", "Logical AND, OR, NOT."),
        e("const port = config.port ?? 3000;", "`??` yalnız `null`/`undefined` olduqda sağ tərəfi götürür (nullish coalescing).", "`??` uses the right side only for `null`/`undefined` (nullish coalescing)."),
        e("const city = user?.address?.city;", "Zəncirvari isteğe bağlı müraciət (optional chaining): yol yoxdursa `undefined` qaytarır.", "Optional chaining: returns `undefined` instead of throwing when a link is missing."),
        e("opts.retries ??= 3;\nname ||= \"guest\";", "Məntiqi mənimsətmə operatorları (logical assignment).", "Logical assignment operators."),
        e("const all = [...a, ...b];\nconst copy = { ...obj, x: 1 };", "Yayma operatoru (spread) massivləri və obyektləri birləşdirir.", "The spread operator merges arrays and objects."),
      ],
    },
    {
      id: "conditions",
      title: TITLES.conditions,
      entries: [
        e("if (age >= 18) {\n  console.log(\"adult\");\n} else if (age >= 13) {\n  console.log(\"teen\");\n} else {\n  console.log(\"child\");\n}", "Şərt bloku.", "Conditional block."),
        e("const label = n % 2 === 0 ? \"even\" : \"odd\";", "Üçlü operator (ternary).", "Ternary operator."),
        e("switch (day) {\n  case \"sat\":\n  case \"sun\":\n    rest();\n    break;\n  default:\n    work();\n}", "`switch`: hər `case`-dən sonra `break` yazmağı unutmayın.", "`switch`: remember `break` after each `case`."),
        e("// falsy: false, 0, -0, 0n, \"\", null, undefined, NaN\nif (items.length) { /* ... */ }", "Yalan sayılan (falsy) dəyərlər; qalan hər şey doğrudur (truthy).", "Falsy values; everything else is truthy."),
      ],
    },
    {
      id: "loops",
      title: TITLES.loops,
      entries: [
        e("for (let i = 0; i < 5; i++) {\n  console.log(i);\n}", "Klassik sayğaclı dövr.", "Classic counter loop."),
        e("for (const item of items) {\n  console.log(item);\n}", "`for...of` massivin (və digər iterable-ların) dəyərlərini gəzir.", "`for...of` iterates the values of arrays and other iterables."),
        e("for (const [i, item] of items.entries()) {\n  console.log(i, item);\n}", "İndeks və dəyəri birlikdə almaq.", "Getting the index and value together."),
        e("for (const key in obj) {\n  console.log(key, obj[key]);\n}", "`for...in` obyektin açarlarını gəzir; massivlər üçün tövsiyə olunmur.", "`for...in` iterates object keys; not recommended for arrays."),
        e("while (n > 0) {\n  n--;\n}\n\ndo {\n  n++;\n} while (n < 3);", "`while` əvvəlcə yoxlayır, `do...while` ən azı bir dəfə işləyir.", "`while` checks first; `do...while` runs at least once."),
        e("items.forEach((item, i) => console.log(i, item));", "Hər element üçün funksiya çağırır; `break` işləmir.", "Calls a function for each item; `break` is not possible."),
      ],
    },
    {
      id: "functions",
      title: TITLES.functions,
      entries: [
        e("function greet(name) {\n  return `Hello, ${name}!`;\n}", "Funksiya elanı (declaration); elandan əvvəl də çağırıla bilər (hoisting).", "Function declaration; can be called before it appears (hoisting)."),
        e("const add = (a, b) => a + b;", "Ox funksiyası (arrow function); tək ifadə avtomatik qaytarılır.", "Arrow function; a single expression is returned implicitly."),
        e("function power(base, exp = 2) {\n  return base ** exp;\n}", "Standart (default) dəyərli parametr.", "Parameter with a default value."),
        e("function sum(...nums) {\n  return nums.reduce((a, b) => a + b, 0);\n}", "Qalıq parametrlər (rest parameters) massiv kimi toplanır.", "Rest parameters are collected into an array."),
        e("function counter() {\n  let n = 0;\n  return () => ++n;\n}\nconst next = counter();", "Qapanma (closure): daxili funksiya xarici dəyişəni yadda saxlayır.", "Closure: the inner function keeps access to the outer variable."),
        e("const makeUser = ({ name, age }) => ({ name, age });", "Parametrdə açılma; obyekt qaytarmaq üçün mötərizə lazımdır.", "Destructuring in parameters; wrap a returned object literal in parentheses."),
      ],
    },
    {
      id: "collections",
      title: TITLES.collections,
      entries: [
        e("const nums = [1, 2, 3];\nnums.push(4);    // add to end\nnums.pop();      // remove last\nnums.unshift(0); // add to start\nnums.shift();    // remove first", "Massivin sonuna/əvvəlinə əlavə və silmə.", "Adding and removing at the end/start of an array."),
        e("nums.map((x) => x * 2)\nnums.filter((x) => x > 1)\nnums.reduce((sum, x) => sum + x, 0)", "Çevirmə, süzgəc və yığma; orijinal massiv dəyişmir.", "Transform, filter and reduce; the original array is unchanged."),
        e("nums.find((x) => x > 1)\nnums.findIndex((x) => x > 1)\nnums.includes(2)\nnums.some((x) => x > 2)", "Axtarış və yoxlama metodları.", "Search and test methods."),
        e("nums.at(-1)        // last item\nnums.slice(1, 3)   // copy of part\nnums.splice(1, 1)  // remove in place", "`at` mənfi indeksi qəbul edir; `slice` kopyalayır, `splice` dəyişdirir.", "`at` accepts negative indexes; `slice` copies, `splice` mutates."),
        e("const sorted = nums.toSorted((a, b) => a - b);", "Sıralanmış surət qaytarır (ES2023); `sort` isə massivi yerində dəyişir.", "Returns a sorted copy (ES2023); `sort` mutates in place."),
        e("const m = new Map();\nm.set(\"a\", 1);\nm.get(\"a\");\nm.has(\"a\");", "`Map` istənilən tipdə açar saxlayan lüğətdir.", "A `Map` is a dictionary whose keys can be of any type."),
        e("const unique = [...new Set([1, 1, 2])]; // [1, 2]", "`Set` təkrarsız dəyərlər saxlayır.", "A `Set` stores unique values."),
      ],
    },
    {
      id: "classes",
      title: TITLES.classes,
      entries: [
        e("const user = {\n  name,\n  age: 20,\n  greet() { return `Hi, ${this.name}`; },\n};", "Obyekt literalı: qısa xassə və metod sintaksisi.", "Object literal with shorthand property and method syntax."),
        e("user.email = \"a@b.c\";\nuser[\"age\"]\ndelete user.age;", "Xassə əlavə etmək, oxumaq və silmək.", "Adding, reading and deleting properties."),
        e("class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    return `${this.name} makes a sound`;\n  }\n}", "Sinif və konstruktor.", "A class with a constructor."),
        e("class Dog extends Animal {\n  speak() {\n    return `${super.speak()}: woof`;\n  }\n}", "Varislik (`extends`); `super` valideyn metodunu çağırır.", "Inheritance (`extends`); `super` calls the parent method."),
        e("class Counter {\n  #count = 0;\n  static zero = 0;\n  get value() { return this.#count; }\n  inc() { this.#count++; }\n}", "`#` ilə gizli sahə (private field), `static` və getter (ES2022).", "Private field with `#`, a `static` field and a getter (ES2022)."),
        e("Object.keys(obj)\nObject.values(obj)\nObject.entries(obj)", "Obyektin açarları, dəyərləri və cütləri massiv kimi.", "An object's keys, values and pairs as arrays."),
      ],
    },
    {
      id: "methods",
      title: TITLES.methods,
      entries: [
        e("s.trim(), s.toUpperCase(), s.toLowerCase()", "Kənar boşluqları silmək və hərf ölçüsünü dəyişmək.", "Trimming whitespace and changing case."),
        e("s.includes(\"x\"), s.startsWith(\"http\"), s.indexOf(\"x\")", "Mətndə axtarış; `indexOf` tapmadıqda `-1` qaytarır.", "Searching text; `indexOf` returns `-1` when not found."),
        e("\"a,b\".split(\",\")\n[\"a\", \"b\"].join(\"-\")\ns.replaceAll(\"a\", \"b\")", "Bölmək, birləşdirmək və bütün uyğunluqları əvəz etmək.", "Split, join and replace every occurrence."),
        e("`Total: ${price * qty}`", "Şablon sətri (template literal) ifadələri mətnə yerləşdirir.", "Template literals embed expressions in text."),
        e("\"7\".padStart(3, \"0\")  // \"007\"\n(3.14159).toFixed(2)  // \"3.14\"", "Doldurma və onluq yuvarlaqlaşdırma (nəticə mətndir).", "Padding and fixed decimals (the result is a string)."),
        e("Number.parseInt(\"42px\", 10)\nNumber.isNaN(x)", "Mətndən tam ədəd almaq və `NaN` yoxlaması.", "Parsing an integer from text and checking for `NaN`."),
        e("Math.round(x), Math.max(...nums), Math.random()", "Riyazi funksiyalar; `Math.random()` 0 ilə 1 arasında ədəd verir.", "Math helpers; `Math.random()` returns a number from 0 up to 1."),
        e("JSON.stringify(obj)\nJSON.parse(text)", "Obyekti JSON mətnə və geri çevirmək.", "Converting an object to JSON text and back."),
      ],
    },
    {
      id: "advanced",
      title: TITLES.advanced,
      entries: [
        e("async function load(url) {\n  const res = await fetch(url);\n  if (!res.ok) throw new Error(res.statusText);\n  return res.json();\n}", "`async`/`await` asinxron kodu ardıcıl yazmağa imkan verir.", "`async`/`await` lets asynchronous code read sequentially."),
        e("try {\n  risky();\n} catch (err) {\n  console.error(err.message);\n} finally {\n  cleanup();\n}", "Xətaların tutulması; `finally` həmişə işləyir.", "Error handling; `finally` always runs."),
        e("const [a, b] = await Promise.all([p1, p2]);", "Bir neçə vədi (Promise) paralel gözləmək.", "Awaiting several promises in parallel."),
        e("new Promise((resolve, reject) => {\n  setTimeout(() => resolve(\"done\"), 1000);\n});", "Vəd (Promise) yaratmaq.", "Creating a promise."),
        e("export function add(a, b) { return a + b; }\nexport default add;\n\nimport add, { add as plus } from \"./math.js\";", "ES modulları: ixrac (export) və idxal (import).", "ES modules: export and import."),
        e("function* ids() {\n  let i = 0;\n  while (true) yield i++;\n}", "Generator funksiyası dəyərləri bir-bir verir.", "A generator function yields values one at a time."),
        e("const byCity = Object.groupBy(users, (u) => u.city);", "Elementləri açara görə qruplaşdırır (ES2024).", "Groups items by a key (ES2024)."),
        e("const copy = structuredClone(original);", "Dərin kopya (deep copy) yaradır.", "Creates a deep copy."),
      ],
    },
  ],
};

const SQL: CheatSheet = {
  id: "sql",
  name: "SQL",
  lang: "sql",
  desc: T(
    "SQLite ilə uyğun SQL: sorğular, birləşmələr, cədvəllər, pəncərə funksiyaları.",
    "SQLite-compatible SQL: queries, joins, tables, window functions.",
    "SQLite uyumlu SQL: sorgular, birleştirmeler, tablolar, pencere fonksiyonları.",
    "SQL, совместимый с SQLite: запросы, соединения, таблицы, оконные функции.",
  ),
  docs: { title: "SQLite SQL Reference", url: "https://www.sqlite.org/lang.html" },
  sections: [
    {
      id: "select",
      title: T("Sorğu əsasları", "Query basics", "Sorgu temelleri", "Основы запросов"),
      entries: [
        e("SELECT * FROM users;", "Cədvəlin bütün sütunlarını seçir.", "Selects every column of a table."),
        e("SELECT name, age FROM users;", "Yalnız lazım olan sütunları seçir.", "Selects only the needed columns."),
        e("SELECT name AS full_name FROM users;", "Sütuna ləqəb (alias) verir.", "Gives a column an alias."),
        e("SELECT DISTINCT city FROM users;", "Təkrarlanan dəyərləri çıxarır.", "Removes duplicate values."),
        e("SELECT * FROM users LIMIT 10 OFFSET 20;", "Nəticəni məhdudlaşdırır: 20 sətri ötür, 10 sətir qaytar (səhifələmə).", "Limits the result: skip 20 rows, return 10 (pagination)."),
        e("-- single-line comment\n/* multi-line\n   comment */", "SQL şərhləri.", "SQL comments."),
      ],
    },
    {
      id: "types",
      title: TITLES.types,
      entries: [
        e("INTEGER, REAL, TEXT, BLOB, NULL", "SQLite-ın beş saxlama sinfi (storage class).", "SQLite's five storage classes."),
        e("SELECT typeof(3.5);  -- 'real'", "Dəyərin saxlama sinfini qaytarır (SQLite).", "Returns a value's storage class (SQLite)."),
        e("SELECT CAST('42' AS INTEGER);", "Tip çevirmə.", "Type conversion."),
        e("-- booleans are stored as 0 / 1\nSELECT * FROM tasks WHERE done = 1;", "SQLite-da ayrıca məntiqi tip yoxdur; `0` və `1` istifadə olunur.", "SQLite has no separate boolean type; `0` and `1` are used."),
        e("SELECT date('now'), datetime('now');", "Tarix və vaxt mətn (`TEXT`) kimi ISO formatında saxlanılır.", "Dates and times are stored as ISO-formatted `TEXT`."),
      ],
    },
    {
      id: "filter",
      title: T("Süzgəc və operatorlar", "Filtering and operators", "Filtreleme ve operatörler", "Фильтрация и операторы"),
      entries: [
        e("SELECT * FROM users\nWHERE age >= 18 AND city = 'Baku';", "`WHERE` sətirləri şərtə görə süzür; mətn tək dırnaqda yazılır.", "`WHERE` filters rows by a condition; text goes in single quotes."),
        e("WHERE city IN ('Baku', 'Ganja')", "Siyahıdakı dəyərlərdən birinə bərabərdir.", "Equals one of the listed values."),
        e("WHERE age BETWEEN 18 AND 30", "Aralıq yoxlaması (hər iki sərhəd daxildir).", "Range test (both ends included)."),
        e("WHERE name LIKE 'A%'   -- starts with A\nWHERE name LIKE '_li'  -- one char + 'li'", "Nümunə axtarışı: `%` istənilən sayda, `_` bir simvol.", "Pattern match: `%` any number of characters, `_` exactly one."),
        e("WHERE email IS NULL\nWHERE email IS NOT NULL", "`NULL` yoxlaması; `= NULL` işləmir.", "Testing for `NULL`; `= NULL` does not work."),
        e("=  <>  !=  <  <=  >  >=  AND  OR  NOT", "Müqayisə və məntiqi operatorlar.", "Comparison and logical operators."),
        e("SELECT first || ' ' || last FROM users;", "`||` mətnləri birləşdirir.", "`||` concatenates text."),
      ],
    },
    {
      id: "aggregate",
      title: T("Sıralama və qruplaşdırma", "Sorting and grouping", "Sıralama ve gruplama", "Сортировка и группировка"),
      entries: [
        e("SELECT * FROM users ORDER BY age DESC, name;", "Sıralama: `DESC` azalan, standart isə artan (`ASC`).", "Sorting: `DESC` descending, the default is ascending (`ASC`)."),
        e("SELECT COUNT(*) FROM users;", "Sətirlərin sayı.", "Number of rows."),
        e("SELECT SUM(total), AVG(total), MIN(total), MAX(total)\nFROM orders;", "Yığma funksiyaları (aggregate functions).", "Aggregate functions."),
        e("SELECT city, COUNT(*) AS n\nFROM users\nGROUP BY city;", "Sətirləri qruplaşdırır və hər qrup üçün hesablayır.", "Groups rows and computes per group."),
        e("SELECT city, COUNT(*) AS n\nFROM users\nGROUP BY city\nHAVING COUNT(*) > 5;", "`HAVING` qrupları süzür (`WHERE` isə sətirləri).", "`HAVING` filters groups (`WHERE` filters rows)."),
      ],
    },
    {
      id: "joins",
      title: T("Birləşmələr (JOIN)", "Joins", "Birleştirmeler (JOIN)", "Соединения (JOIN)"),
      entries: [
        e("SELECT u.name, o.total\nFROM users AS u\nJOIN orders AS o ON o.user_id = u.id;", "`JOIN` (`INNER JOIN`) yalnız uyğun gələn sətirləri birləşdirir.", "`JOIN` (`INNER JOIN`) combines only matching rows."),
        e("SELECT u.name, o.total\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id;", "`LEFT JOIN` sol cədvəlin bütün sətirlərini saxlayır; uyğunluq yoxdursa `NULL` olur.", "`LEFT JOIN` keeps every row of the left table; missing matches become `NULL`."),
        e("SELECT name FROM users\nWHERE id IN (SELECT user_id FROM orders);", "Alt sorğu (subquery).", "Subquery."),
        e("SELECT name FROM customers\nUNION\nSELECT name FROM suppliers;", "`UNION` nəticələri birləşdirib təkrarları silir; `UNION ALL` silmir.", "`UNION` merges results and removes duplicates; `UNION ALL` keeps them."),
        e("SELECT * FROM users u\nWHERE EXISTS (\n  SELECT 1 FROM orders o WHERE o.user_id = u.id\n);", "`EXISTS` alt sorğunun ən azı bir sətir qaytarıb-qaytarmadığını yoxlayır.", "`EXISTS` tests whether the subquery returns at least one row."),
      ],
    },
    {
      id: "modify",
      title: T("Məlumatın dəyişdirilməsi", "Changing data", "Veri değiştirme", "Изменение данных"),
      entries: [
        e("INSERT INTO users (name, age) VALUES ('Ali', 20);", "Yeni sətir əlavə edir.", "Inserts a new row."),
        e("INSERT INTO users (name, age) VALUES\n  ('Aysel', 22),\n  ('Murad', 25);", "Bir əmrlə bir neçə sətir əlavə edir.", "Inserts several rows in one statement."),
        e("UPDATE users SET age = age + 1 WHERE id = 7;", "Sətirləri yeniləyir; `WHERE` olmasa bütün cədvəl dəyişər.", "Updates rows; without `WHERE` the whole table changes."),
        e("DELETE FROM users WHERE id = 7;", "Sətirləri silir; `WHERE` yazmağı unutmayın.", "Deletes rows; do not forget `WHERE`."),
        e("INSERT INTO users (email, name) VALUES ('a@b.c', 'Ali')\nON CONFLICT(email) DO UPDATE SET name = excluded.name;", "Varsa yenilə, yoxdursa əlavə et (upsert), SQLite 3.24+.", "Insert or update when the key exists (upsert), SQLite 3.24+."),
        e("BEGIN;\nUPDATE accounts SET balance = balance - 10 WHERE id = 1;\nUPDATE accounts SET balance = balance + 10 WHERE id = 2;\nCOMMIT;  -- or ROLLBACK;", "Tranzaksiya: ya bütün dəyişikliklər tətbiq olunur, ya heç biri.", "Transaction: either all changes apply or none do."),
      ],
    },
    {
      id: "tables",
      title: T("Cədvəllər", "Tables", "Tablolar", "Таблицы"),
      entries: [
        e("CREATE TABLE users (\n  id INTEGER PRIMARY KEY,\n  email TEXT NOT NULL UNIQUE,\n  age INTEGER CHECK (age >= 0),\n  created TEXT DEFAULT CURRENT_TIMESTAMP\n);", "Cədvəl yaratmaq; məhdudiyyətlər (constraints) məlumatı qoruyur.", "Creates a table; constraints protect the data."),
        e("CREATE TABLE orders (\n  id INTEGER PRIMARY KEY,\n  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,\n  total REAL\n);", "Xarici açar (foreign key); SQLite-da `PRAGMA foreign_keys = ON;` ilə aktivləşir.", "Foreign key; in SQLite it is enforced after `PRAGMA foreign_keys = ON;`."),
        e("ALTER TABLE users ADD COLUMN phone TEXT;", "Mövcud cədvələ sütun əlavə edir.", "Adds a column to an existing table."),
        e("CREATE INDEX idx_users_city ON users(city);", "İndeks axtarışı sürətləndirir.", "An index speeds up lookups."),
        e("CREATE VIEW adults AS\nSELECT * FROM users WHERE age >= 18;", "Görünüş (view) saxlanılan sorğudur.", "A view is a stored query."),
        e("DROP TABLE IF EXISTS temp_data;", "Cədvəli silir (geri qaytarılmır).", "Drops a table (cannot be undone)."),
      ],
    },
    {
      id: "functions",
      title: TITLES.functions,
      entries: [
        e("length(name), upper(name), lower(name), trim(name)", "Mətn funksiyaları.", "Text functions."),
        e("substr('Hello', 1, 3)   -- 'Hel'\nreplace(s, 'a', 'b')\ninstr(s, 'x')", "Alt sətir, əvəzetmə və mövqe axtarışı; SQLite-da indeks 1-dən başlayır.", "Substring, replace and position search; SQLite indexes start at 1."),
        e("coalesce(phone, email, 'n/a')", "İlk `NULL` olmayan dəyəri qaytarır.", "Returns the first non-`NULL` value."),
        e("round(price, 2), abs(x)", "Yuvarlaqlaşdırma və mütləq qiymət.", "Rounding and absolute value."),
        e("date('now', '-7 days')\nstrftime('%Y', created)", "Tarix hesablamaları və formatlaşdırma (SQLite).", "Date arithmetic and formatting (SQLite)."),
      ],
    },
    {
      id: "advanced",
      title: TITLES.advanced,
      entries: [
        e("SELECT name,\n  CASE WHEN age < 18 THEN 'minor' ELSE 'adult' END AS grp\nFROM users;", "`CASE` sorğu daxilində şərt ifadəsidir.", "`CASE` is a conditional expression inside a query."),
        e("WITH big AS (\n  SELECT * FROM orders WHERE total > 100\n)\nSELECT user_id, COUNT(*) FROM big GROUP BY user_id;", "Ümumi cədvəl ifadəsi (CTE) sorğunu hissələrə bölür.", "A common table expression (CTE) splits a query into named steps."),
        e("SELECT name, city,\n  ROW_NUMBER() OVER (PARTITION BY city ORDER BY age DESC) AS rn\nFROM users;", "Pəncərə funksiyası (window function), SQLite 3.25+.", "Window function, SQLite 3.25+."),
        e("SELECT id, total,\n  SUM(total) OVER (ORDER BY id) AS running\nFROM orders;", "Yığılan (kumulyativ) cəm (running total).", "Running total."),
        e("WITH RECURSIVE n(x) AS (\n  SELECT 1\n  UNION ALL\n  SELECT x + 1 FROM n WHERE x < 5\n)\nSELECT x FROM n;", "Rekursiv CTE: 1-dən 5-ə qədər ədədlər.", "Recursive CTE: the numbers 1 to 5."),
      ],
    },
  ],
};

const HTML: CheatSheet = {
  id: "html",
  name: "HTML",
  lang: "plain",
  desc: T(
    "HTML5: səhifə quruluşu, mətn, keçidlər, formalar, semantik teqlər.",
    "HTML5: page structure, text, links, forms, semantic tags.",
    "HTML5: sayfa yapısı, metin, bağlantılar, formlar, anlamsal etiketler.",
    "HTML5: структура страницы, текст, ссылки, формы, семантические теги.",
  ),
  docs: { title: "MDN HTML Reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  sections: [
    {
      id: "structure",
      title: T("Səhifə quruluşu", "Page structure", "Sayfa yapısı", "Структура страницы"),
      entries: [
        e("<!DOCTYPE html>\n<html lang=\"az\">\n  <head>\n    <meta charset=\"utf-8\">\n    <title>Page title</title>\n  </head>\n  <body>\n    ...\n  </body>\n</html>", "HTML5 sənədinin əsas skeleti; `lang` səhifənin dilini bildirir.", "Basic HTML5 document skeleton; `lang` declares the page language."),
        e("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">", "Mobil cihazlarda düzgün miqyas üçün vacibdir.", "Required for correct scaling on mobile devices."),
        e("<link rel=\"stylesheet\" href=\"style.css\">", "Xarici CSS faylını qoşur.", "Links an external CSS file."),
        e("<script src=\"app.js\" defer></script>\n<script type=\"module\" src=\"main.js\"></script>", "Skript qoşmaq; `defer` HTML oxunandan sonra işə salır, modullar avtomatik təxirə salınır.", "Loads a script; `defer` runs it after parsing, modules are deferred automatically."),
        e("<!-- comment -->", "HTML şərhi; brauzerdə göstərilmir.", "HTML comment; not displayed."),
      ],
    },
    {
      id: "text",
      title: T("Mətn", "Text", "Metin", "Текст"),
      entries: [
        e("<h1>Main title</h1>\n<h2>Section</h2>", "Başlıqlar `h1`–`h6`; səviyyələri ötürməyin.", "Headings `h1`–`h6`; do not skip levels."),
        e("<p>A paragraph of text.</p>", "Abzas (paragraph).", "Paragraph."),
        e("<strong>important</strong> <em>emphasis</em>", "Vacib və vurğulanmış mətn (məna bildirir, yalnız görünüş deyil).", "Important and emphasised text (meaning, not just style)."),
        e("<code>let x</code>\n<pre><code>multi-line\ncode</code></pre>", "Sətir daxili və çoxsətirli kod.", "Inline and multi-line code."),
        e("<blockquote cite=\"https://example.com\">Quote</blockquote>", "Uzun sitat.", "Long quotation."),
        e("Line one<br>\nLine two\n<hr>", "`br` sətir keçidi, `hr` mövzu ayırıcısıdır.", "`br` is a line break, `hr` a thematic break."),
      ],
    },
    {
      id: "links",
      title: T("Keçidlər və media", "Links and media", "Bağlantılar ve medya", "Ссылки и медиа"),
      entries: [
        e("<a href=\"https://example.com\">Visit</a>\n<a href=\"#contact\">Jump to section</a>", "Keçid (link); `#id` eyni səhifədə elementə aparır.", "A link; `#id` jumps to an element on the same page."),
        e("<a href=\"https://example.com\" target=\"_blank\" rel=\"noopener\">New tab</a>", "Yeni vərəqdə açır.", "Opens in a new tab."),
        e("<img src=\"cat.jpg\" alt=\"A sleeping cat\" width=\"400\" height=\"300\">", "Şəkil; `alt` mətni əlçatanlıq (accessibility) üçün vacibdir.", "Image; the `alt` text is essential for accessibility."),
        e("<figure>\n  <img src=\"chart.png\" alt=\"Sales chart\">\n  <figcaption>Sales in 2025</figcaption>\n</figure>", "İzahlı şəkil.", "Image with a caption."),
        e("<video src=\"clip.mp4\" controls></video>\n<audio src=\"song.mp3\" controls></audio>", "Video və səs; `controls` idarəetmə düymələrini göstərir.", "Video and audio; `controls` shows the player controls."),
      ],
    },
    {
      id: "lists",
      title: T("Siyahılar və cədvəllər", "Lists and tables", "Listeler ve tablolar", "Списки и таблицы"),
      entries: [
        e("<ul>\n  <li>Item</li>\n</ul>\n<ol>\n  <li>First step</li>\n</ol>", "Nömrəsiz (`ul`) və nömrəli (`ol`) siyahılar.", "Unordered (`ul`) and ordered (`ol`) lists."),
        e("<dl>\n  <dt>HTML</dt>\n  <dd>Markup language</dd>\n</dl>", "Termin və izah siyahısı.", "Description list of terms and definitions."),
        e("<table>\n  <caption>Scores</caption>\n  <thead>\n    <tr><th scope=\"col\">Name</th><th scope=\"col\">Score</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Ali</td><td>90</td></tr>\n  </tbody>\n</table>", "Cədvəl; `th` və `scope` ekran oxuyucularına kömək edir.", "A table; `th` with `scope` helps screen readers."),
        e("<td colspan=\"2\">Wide cell</td>", "Xananı bir neçə sütuna genişləndirir.", "Makes a cell span several columns."),
      ],
    },
    {
      id: "forms",
      title: T("Formalar", "Forms", "Formlar", "Формы"),
      entries: [
        e("<form action=\"/signup\" method=\"post\">\n  ...\n</form>", "Forma; məlumatı `action` ünvanına göndərir.", "A form; it submits data to the `action` URL."),
        e("<label for=\"email\">Email</label>\n<input id=\"email\" name=\"email\" type=\"email\" required>", "`label` sahəyə `for`/`id` ilə bağlanır; `required` boş göndərməyə icazə vermir.", "A `label` is tied to its field via `for`/`id`; `required` blocks empty submission."),
        e("<input type=\"number\" min=\"1\" max=\"10\">\n<input type=\"checkbox\" name=\"terms\">\n<input type=\"date\">", "Müxtəlif giriş tipləri.", "Various input types."),
        e("<select name=\"lang\">\n  <option value=\"az\">Azərbaycanca</option>\n  <option value=\"en\">English</option>\n</select>", "Açılan siyahı.", "Drop-down list."),
        e("<textarea name=\"msg\" rows=\"4\"></textarea>", "Çoxsətirli mətn sahəsi.", "Multi-line text field."),
        e("<button type=\"submit\">Send</button>\n<button type=\"button\">Just a button</button>", "Düymə; formada standart tip `submit`-dir.", "A button; inside a form the default type is `submit`."),
        e("<input name=\"zip\" pattern=\"[0-9]{4}\" placeholder=\"1000\">", "`pattern` daxil edilən dəyəri müntəzəm ifadə (regex) ilə yoxlayır.", "`pattern` validates the value with a regular expression."),
      ],
    },
    {
      id: "semantic",
      title: T("Semantik teqlər", "Semantic tags", "Anlamsal etiketler", "Семантические теги"),
      entries: [
        e("<header>...</header>\n<nav>...</nav>\n<main>...</main>\n<footer>...</footer>", "Səhifənin əsas bölgələri; `main` səhifədə bir dəfə olur.", "Main page regions; use `main` once per page."),
        e("<article>...</article>\n<section>...</section>\n<aside>...</aside>", "Müstəqil məzmun, mövzu bölməsi və əlavə məlumat.", "Self-contained content, a thematic section and side content."),
        e("<time datetime=\"2025-05-01\">1 May</time>", "Maşınla oxunan tarix.", "Machine-readable date."),
        e("<details>\n  <summary>More</summary>\n  Hidden content\n</details>", "JavaScript-siz açılıb-bağlanan blok.", "A collapsible block without JavaScript."),
        e("<dialog id=\"box\">\n  <p>Hello</p>\n  <form method=\"dialog\"><button>Close</button></form>\n</dialog>", "Dialoq pəncərəsi; `box.showModal()` ilə açılır.", "Dialog box; opened with `box.showModal()`."),
      ],
    },
    {
      id: "attributes",
      title: T("Atributlar və əlçatanlıq", "Attributes and accessibility", "Öznitelikler ve erişilebilirlik", "Атрибуты и доступность"),
      entries: [
        e("<div id=\"main\" class=\"card wide\"></div>", "`id` unikaldır, `class` bir neçə element üçün təkrarlana bilər.", "`id` is unique; a `class` can be reused across elements."),
        e("<li data-id=\"42\">Item</li>", "Xüsusi məlumat atributu; JS-də `el.dataset.id` ilə oxunur.", "Custom data attribute; read in JS via `el.dataset.id`."),
        e("<button aria-label=\"Close\">×</button>", "Görünən mətni olmayan elementə ad verir.", "Gives an accessible name to an element without visible text."),
        e("<p hidden>Not shown</p>", "Elementi gizlədir.", "Hides an element."),
        e("<input disabled>\n<input readonly value=\"fixed\">", "Deaktiv və yalnız oxunan sahələr.", "Disabled and read-only fields."),
        e("<span lang=\"en\">cheat sheet</span>", "Bir hissənin dilini dəyişir (düzgün tələffüz üçün).", "Changes the language of a fragment (for correct pronunciation)."),
      ],
    },
  ],
};

const CSS: CheatSheet = {
  id: "css",
  name: "CSS",
  lang: "plain",
  desc: T(
    "Müasir CSS: seçicilər, qutu modeli, Flexbox, Grid, adaptiv dizayn.",
    "Modern CSS: selectors, box model, Flexbox, Grid, responsive design.",
    "Modern CSS: seçiciler, kutu modeli, Flexbox, Grid, duyarlı tasarım.",
    "Современный CSS: селекторы, блочная модель, Flexbox, Grid, адаптивность.",
  ),
  docs: { title: "MDN CSS Reference", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  sections: [
    {
      id: "selectors",
      title: T("Seçicilər", "Selectors", "Seçiciler", "Селекторы"),
      entries: [
        e("p { }\n.card { }\n#main { }\n* { }", "Teq, sinif (`.`), id (`#`) və universal seçici.", "Type, class (`.`), id (`#`) and universal selectors."),
        e("nav a { }     /* descendant */\nul > li { }   /* direct child */\nh2 + p { }    /* next sibling */", "Kombinatorlar: nəsil, birbaşa övlad, növbəti qonşu.", "Combinators: descendant, direct child, next sibling."),
        e("a:hover { }\nbutton:focus-visible { }\nli:nth-child(2n) { }\ninput:disabled { }", "Psevdo-siniflər vəziyyət və mövqeyə görə seçir.", "Pseudo-classes select by state or position."),
        e("p::first-line { }\n.req::after { content: \" *\"; }", "Psevdo-elementlər elementin hissəsini və ya əlavə məzmunu seçir.", "Pseudo-elements target part of an element or generated content."),
        e("input[type=\"email\"] { }\na[href^=\"https\"] { }", "Atribut seçiciləri.", "Attribute selectors."),
        e(":is(h1, h2, h3) { margin: 0; }\n.card:has(img) { padding: 0; }", "`:is()` seçiciləri qruplaşdırır; `:has()` daxilindəkinə görə valideyni seçir.", "`:is()` groups selectors; `:has()` selects a parent by its contents."),
      ],
    },
    {
      id: "box",
      title: T("Qutu modeli", "Box model", "Kutu modeli", "Блочная модель"),
      entries: [
        e("*, *::before, *::after { box-sizing: border-box; }", "Eni `padding` və `border` daxil hesablayır.", "Width includes `padding` and `border`."),
        e("margin: 10px;            /* all sides */\nmargin: 10px 20px;       /* vertical horizontal */\npadding: 4px 8px 4px 8px; /* top right bottom left */", "Qısa yazılış (shorthand) saat əqrəbi istiqamətində gedir.", "Shorthand goes clockwise from the top."),
        e("margin-inline: auto;\nmax-width: 60ch;", "Bloku üfüqi mərkəzləşdirir və sətir uzunluğunu məhdudlaşdırır.", "Centres a block horizontally and limits line length."),
        e("border: 1px solid #ccc;\nborder-radius: 8px;", "Çərçivə və yumru künclər.", "Border and rounded corners."),
        e("display: block | inline | inline-block | none;", "Elementin göstərilmə tipi; `none` onu tamamilə gizlədir.", "Display type; `none` removes the element from layout."),
        e("overflow: auto;", "Məzmun sığmayanda sürüşdürmə zolağı göstərir.", "Shows scrollbars when content overflows."),
      ],
    },
    {
      id: "text",
      title: T("Mətn, rəng və vahidlər", "Text, colour and units", "Metin, renk ve birimler", "Текст, цвет и единицы"),
      entries: [
        e("font-family: system-ui, sans-serif;\nfont-size: 1rem;\nfont-weight: 600;\nline-height: 1.5;", "Şrift parametrləri; `line-height` vahidsiz yazılması tövsiyə olunur.", "Font settings; a unitless `line-height` is recommended."),
        e("color: #1a73e8;\ncolor: rgb(26 115 232 / 0.8);\ncolor: hsl(217 81% 51%);", "Rəng yazılışları; `/` sonrası şəffaflıqdır.", "Colour notations; the value after `/` is opacity."),
        e("text-align: center;\ntext-decoration: underline;\ntext-transform: uppercase;", "Mətnin düzülüşü və bəzədilməsi.", "Text alignment and decoration."),
        e("px   rem   em   %   vw   vh   ch", "Vahidlər: `rem` kök şrift ölçüsünə, `em` valideynə, `vw`/`vh` ekrana nisbətən.", "Units: `rem` is relative to the root font size, `em` to the parent, `vw`/`vh` to the viewport."),
        e("white-space: nowrap;\noverflow: hidden;\ntext-overflow: ellipsis;", "Uzun mətni bir sətirdə `…` ilə kəsir.", "Truncates long text on one line with `…`."),
      ],
    },
    {
      id: "flexbox",
      title: T("Flexbox", "Flexbox", "Flexbox", "Flexbox"),
      entries: [
        e(".row {\n  display: flex;\n  gap: 12px;\n}", "Övladları bir sıraya düzür; `gap` aralarında boşluq qoyur.", "Lays children out in a row; `gap` adds space between them."),
        e("flex-direction: row | column;\nflex-wrap: wrap;", "İstiqamət və növbəti sətrə keçmə.", "Direction and wrapping."),
        e("justify-content: space-between;  /* main axis */\nalign-items: center;             /* cross axis */", "Əsas və çarpaz ox üzrə düzülüş.", "Alignment on the main and cross axes."),
        e(".center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}", "Elementi həm üfüqi, həm şaquli mərkəzləşdirir.", "Centres content both horizontally and vertically."),
        e(".item { flex: 1; }\n.sidebar { flex: 0 0 240px; }", "`flex: 1` boş yeri bölüşdürür; `0 0 240px` sabit endir.", "`flex: 1` shares free space; `0 0 240px` is a fixed width."),
      ],
    },
    {
      id: "grid",
      title: T("Grid", "Grid", "Grid", "Grid"),
      entries: [
        e(".grid {\n  display: grid;\n  grid-template-columns: 1fr 2fr;\n  gap: 16px;\n}", "İki sütunlu tor; `fr` boş yerin payıdır.", "A two-column grid; `fr` is a share of free space."),
        e("grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));", "Media sorğusuz adaptiv kart toru.", "A responsive card grid without media queries."),
        e(".wide { grid-column: 1 / -1; }", "Elementi bütün sütunlara genişləndirir.", "Makes an item span all columns."),
        e(".layout {\n  display: grid;\n  grid-template-areas:\n    \"head head\"\n    \"side main\";\n}\n.side { grid-area: side; }", "Adlandırılmış sahələr (template areas).", "Named template areas."),
        e("place-items: center;", "Tor xanalarında həm şaquli, həm üfüqi mərkəzləşdirmə.", "Centres items in their grid cells on both axes."),
      ],
    },
    {
      id: "responsive",
      title: T("Adaptiv dizayn", "Responsive design", "Duyarlı tasarım", "Адаптивный дизайн"),
      entries: [
        e("@media (max-width: 600px) {\n  .grid { grid-template-columns: 1fr; }\n}", "Media sorğusu: dar ekranlarda başqa üslub.", "Media query: different styles on narrow screens."),
        e("font-size: clamp(1rem, 2.5vw, 2rem);", "Dəyəri minimum və maksimum arasında saxlayır.", "Keeps a value between a minimum and a maximum."),
        e("width: min(100%, 800px);", "İki dəyərdən kiçiyini götürür.", "Takes the smaller of two values."),
        e("@media (prefers-color-scheme: dark) {\n  :root { --bg: #111; }\n}", "İstifadəçinin qaranlıq mövzu seçiminə uyğunlaşır.", "Adapts to the user's dark-mode preference."),
        e("@media (prefers-reduced-motion: reduce) {\n  * { animation: none; transition: none; }\n}", "Hərəkəti azaltmaq istəyən istifadəçilər üçün animasiyanı söndürür.", "Disables motion for users who prefer reduced motion."),
        e(".wrap { container-type: inline-size; }\n@container (min-width: 400px) {\n  .card { display: flex; }\n}", "Konteyner sorğusu: ekrana deyil, valideynin eninə görə.", "Container query: based on the parent's width, not the viewport."),
      ],
    },
    {
      id: "advanced",
      title: TITLES.advanced,
      entries: [
        e(":root { --accent: #1a73e8; }\n.btn { color: var(--accent, blue); }", "CSS dəyişənləri (custom properties); `var()` ikinci arqumenti ehtiyat dəyərdir.", "CSS custom properties; the second `var()` argument is a fallback."),
        e("width: calc(100% - 2rem);", "Fərqli vahidlərlə hesablama.", "Calculation mixing units."),
        e(".header { position: sticky; top: 0; }\n.badge { position: absolute; top: 4px; right: 4px; }", "`sticky` sürüşdürəndə yapışır; `absolute` ən yaxın yerləşdirilmiş valideynə görədir.", "`sticky` sticks while scrolling; `absolute` is relative to the nearest positioned ancestor."),
        e(".card {\n  padding: 1rem;\n  & h2 { margin: 0; }\n  &:hover { border-color: blue; }\n}", "Yerli iç-içə yazılış (CSS nesting), müasir brauzerlərdə.", "Native CSS nesting in modern browsers."),
        e("@layer base, components;\n@layer base {\n  a { color: inherit; }\n}", "Kaskad qatları (cascade layers) üslubların üstünlük sırasını idarə edir.", "Cascade layers control the priority order of styles."),
        e("/* specificity: id > class > type */\n#nav .link { }   /* 1-1-0 */\n.link { }        /* 0-1-0 */", "Spesifiklik: hansı qaydanın qalib gəldiyini müəyyən edir.", "Specificity decides which rule wins."),
      ],
    },
  ],
};

const GIT: CheatSheet = {
  id: "git",
  name: "Git",
  lang: "plain",
  desc: T(
    "Git 2.x əmr sətri: qurulum, commit, budaqlar, uzaq repozitoriyalar, geri qaytarma.",
    "Git 2.x command line: setup, commits, branches, remotes, undoing changes.",
    "Git 2.x komut satırı: kurulum, commit, dallar, uzak depolar, geri alma.",
    "Командная строка Git 2.x: настройка, коммиты, ветки, удалённые репозитории, откат.",
  ),
  docs: { title: "Git Documentation", url: "https://git-scm.com/docs" },
  sections: [
    {
      id: "setup",
      title: T("Qurulum", "Setup", "Kurulum", "Настройка"),
      entries: [
        e("git config --global user.name \"Your Name\"\ngit config --global user.email \"you@example.com\"", "Commit-lərdə görünən ad və e-poçtu təyin edir.", "Sets the name and email recorded in commits."),
        e("git config --global init.defaultBranch main", "Yeni repozitoriyalarda əsas budağın adını təyin edir.", "Sets the default branch name for new repositories."),
        e("git config --list", "Bütün parametrləri göstərir.", "Shows all settings."),
        e("git init", "Cari qovluqda yeni repozitoriya yaradır.", "Creates a new repository in the current folder."),
        e("git clone https://github.com/user/repo.git", "Uzaq repozitoriyanı kopyalayır.", "Copies a remote repository."),
      ],
    },
    {
      id: "basics",
      title: T("Əsas əmrlər", "Basics", "Temel komutlar", "Основные команды"),
      entries: [
        e("git status", "Dəyişmiş, hazırlanmış (staged) və izlənməyən faylları göstərir.", "Shows modified, staged and untracked files."),
        e("git add file.txt\ngit add .", "Dəyişiklikləri növbəti commit üçün hazırlayır (staging).", "Stages changes for the next commit."),
        e("git add -p", "Dəyişiklikləri hissə-hissə seçərək hazırlayır.", "Stages changes interactively, hunk by hunk."),
        e("git commit -m \"Add login form\"", "Hazırlanmış dəyişiklikləri mesajla yadda saxlayır.", "Records the staged changes with a message."),
        e("git diff\ngit diff --staged", "Hazırlanmamış və hazırlanmış dəyişikliklərin fərqi.", "Shows unstaged and staged differences."),
        e("git rm old.txt\ngit mv a.txt b.txt", "Faylı silir və ya adını dəyişir (Git-ə bildirərək).", "Removes or renames a file, recording it in Git."),
        e("# .gitignore\nnode_modules/\n*.log\n.env", "`.gitignore` izlənməməli faylları sadalayır.", "`.gitignore` lists files Git should not track."),
      ],
    },
    {
      id: "branches",
      title: T("Budaqlar", "Branches", "Dallar", "Ветки"),
      entries: [
        e("git branch", "Yerli budaqları göstərir; cari budaq `*` ilə işarələnir.", "Lists local branches; the current one is marked with `*`."),
        e("git switch -c feature/login", "Yeni budaq yaradır və ona keçir.", "Creates a new branch and switches to it."),
        e("git switch main", "Mövcud budağa keçir.", "Switches to an existing branch."),
        e("git merge feature/login", "Göstərilən budağı cari budağa birləşdirir.", "Merges the given branch into the current one."),
        e("git rebase main", "Cari budağın commit-lərini `main`-in üzərinə köçürür.", "Replays the current branch's commits on top of `main`."),
        e("git branch -d feature/login", "Birləşdirilmiş budağı silir (`-D` məcburi silir).", "Deletes a merged branch (`-D` forces deletion)."),
      ],
    },
    {
      id: "remote",
      title: T("Uzaq repozitoriya", "Remote", "Uzak depo", "Удалённый репозиторий"),
      entries: [
        e("git remote add origin https://github.com/user/repo.git\ngit remote -v", "Uzaq repozitoriya əlavə edir və siyahını göstərir.", "Adds a remote and lists remotes."),
        e("git push -u origin main", "Budağı göndərir və izləmə (upstream) əlaqəsi qurur.", "Pushes a branch and sets its upstream."),
        e("git push", "Yeni commit-ləri izlənən budağa göndərir.", "Pushes new commits to the tracked branch."),
        e("git fetch", "Uzaq dəyişiklikləri yükləyir, amma birləşdirmir.", "Downloads remote changes without merging."),
        e("git pull\ngit pull --rebase", "Yükləyir və birləşdirir (və ya rebase edir).", "Fetches and merges (or rebases)."),
        e("git push origin --delete feature/login", "Uzaq budağı silir.", "Deletes a remote branch."),
      ],
    },
    {
      id: "history",
      title: T("Tarixçə", "History", "Geçmiş", "История"),
      entries: [
        e("git log --oneline --graph --all", "Qısa, qrafik şəklində commit tarixçəsi.", "Compact, graphical commit history."),
        e("git log -p -- path/to/file", "Bir faylın dəyişiklik tarixçəsi.", "Change history of one file."),
        e("git show abc1234", "Commit-in məzmununu göstərir.", "Shows a commit's contents."),
        e("git blame file.txt", "Hər sətri kimin, hansı commit-də dəyişdiyini göstərir.", "Shows who last changed each line, and in which commit."),
        e("git tag -a v1.0.0 -m \"First release\"\ngit push origin --tags", "Versiya etiketi yaradır və göndərir.", "Creates a version tag and pushes tags."),
      ],
    },
    {
      id: "undo",
      title: T("Geri qaytarma", "Undo", "Geri alma", "Отмена изменений"),
      entries: [
        e("git restore file.txt", "Fayldakı hazırlanmamış dəyişiklikləri ləğv edir.", "Discards unstaged changes in a file."),
        e("git restore --staged file.txt", "Faylı hazırlıqdan (staging) çıxarır, dəyişikliklər qalır.", "Unstages a file; the changes are kept."),
        e("git commit --amend", "Son commit-i dəyişir (mesaj və ya məzmun); göndərilmiş commit-lərdə ehtiyatlı olun.", "Rewrites the last commit (message or contents); be careful with pushed commits."),
        e("git revert abc1234", "Commit-in əksini edən yeni commit yaradır; paylaşılan budaqlar üçün təhlükəsizdir.", "Creates a new commit that undoes the given one; safe on shared branches."),
        e("git reset --soft HEAD~1", "Son commit-i ləğv edir, dəyişiklikləri hazırlanmış saxlayır.", "Undoes the last commit, keeping its changes staged."),
        e("git reset --hard HEAD", "Bütün yerli dəyişiklikləri silir. Geri qaytarmaq çətindir!", "Throws away all local changes. Hard to recover!"),
        e("git reflog", "HEAD-in bütün hərəkətləri; \"itirilmiş\" commit-ləri tapmağa kömək edir.", "Every move of HEAD; helps recover \"lost\" commits."),
      ],
    },
    {
      id: "stash",
      title: T("Stash", "Stash", "Stash", "Stash"),
      entries: [
        e("git stash\ngit stash push -m \"wip: header\"", "Yarımçıq dəyişiklikləri müvəqqəti kənara qoyur.", "Temporarily shelves unfinished changes."),
        e("git stash list", "Saxlanılmış stash-ları göstərir.", "Lists saved stashes."),
        e("git stash pop", "Son stash-ı tətbiq edir və siyahıdan silir.", "Applies the latest stash and removes it from the list."),
        e("git stash apply stash@{1}", "Stash-ı tətbiq edir, amma siyahıda saxlayır.", "Applies a stash but keeps it in the list."),
        e("git stash drop stash@{0}", "Stash-ı silir.", "Deletes a stash."),
      ],
    },
  ],
};

export const CHEATSHEETS: CheatSheet[] = [PYTHON, JAVASCRIPT, SQL, HTML, CSS, GIT];

export const findCheatSheet = (id: string | undefined) => CHEATSHEETS.find((s) => s.id === id);

/** Favorite key for a bookmarked section. */
export const cheatKey = (sheetId: string, sectionId: string) => `cheat:${sheetId}:${sectionId}`;

const MAP: Record<string, string> = { ə: "e", ı: "i", ş: "s", ç: "c", ğ: "g", ö: "o", ü: "u", ё: "е" };

/** Case- and diacritic-insensitive form used for matching (ə→e, ş→s, …). */
export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[əışçğöüё]/g, (c) => MAP[c] ?? c)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export interface CheatHit {
  sheet: CheatSheet;
  section: CheatSection;
  entry: CheatEntry;
}

/** Searches every entry's code and explanation (all languages); every query word must match. */
export function searchCheats(query: string, sheets: CheatSheet[] = CHEATSHEETS): CheatHit[] {
  const words = normalizeText(query).split(" ").filter(Boolean);
  if (words.length === 0) return [];
  const hits: CheatHit[] = [];
  for (const sheet of sheets)
    for (const section of sheet.sections)
      for (const entry of section.entries) {
        const hay = normalizeText([sheet.name, entry.code, ...Object.values(entry.note), ...Object.values(section.title)].join(" "));
        if (words.every((w) => hay.includes(w))) hits.push({ sheet, section, entry });
      }
  return hits;
}
