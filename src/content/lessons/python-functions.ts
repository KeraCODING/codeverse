import type { Lesson } from "../types";

const lesson: Lesson = {
  id: "python-functions",
  language: "python",
  order: 5,
  level: "beginner",
  title: { az: "Funksiyalar: def və return", en: "Functions: def and return" },
  intro: {
    what: {
      az: "Funksiya `def` açar sözü ilə yaradılan, adı olan kod blokudur. Parametrlər qəbul edir, işini görür və `return` ilə nəticə qaytara bilər.",
      en: "A function is a named block of code created with the `def` keyword. It takes parameters, does its work and can send a result back with `return`.",
    },
    why: {
      az: "Funksiyalar təkrarlanan kodu bir yerə toplayır, proqramı kiçik, başa düşülən hissələrə bölür və hər hissəni ayrıca yoxlamağa imkan verir.",
      en: "Functions collect repeated code in one place, split a program into small understandable parts and let you test each part separately.",
    },
    where: {
      az: "Hesablamalar, məlumatların yoxlanması, fayl emalı; Django və FastAPI-də hər sorğu funksiya ilə emal olunur.",
      en: "Calculations, data validation, file processing; in Django and FastAPI every request is handled by a function.",
    },
  },
  syntax: {
    code: 'def greet(name):\n    return f"Hello, {name}!"',
    lang: "python",
    parts: [
      { token: "def", role: { az: "Funksiya təyin edən açar söz (define).", en: "Keyword that defines a function." } },
      { token: "greet", role: { az: "Funksiyanın adı. Adətən kiçik hərf və alt xəttlə yazılır (snake_case).", en: "The function name. Conventionally lowercase with underscores (snake_case)." } },
      { token: "(name)", role: { az: "Parametr siyahısı. Çağırışda verilən dəyər `name`-ə bağlanır.", en: "The parameter list. The value given in the call is bound to `name`." } },
      { token: ":", role: { az: "Funksiyanın gövdəsi başlayır; gövdə girintili yazılır.", en: "Starts the function body, which is indented." } },
      { token: "return", role: { az: "Nəticəni qaytarır və funksiyanı bitirir. Yoxdursa funksiya `None` qaytarır.", en: "Returns the result and ends the function. Without it the function returns `None`." } },
    ],
  },
  examples: [
    {
      title: { az: "Sadə nümunə: təyin etmək və çağırmaq", en: "Simple example: define and call" },
      lang: "python",
      code: 'def square(n):\n    return n * n\n\nprint(square(4))',
      lines: [
        { az: "Bir parametrli `square` funksiyası təyin olunur. Bu sətir funksiyanı yalnız yaradır, işlətmir.", en: "Defines `square` with one parameter. This only creates the function; it does not run it." },
        { az: "`n * n` hesablanır və qaytarılır.", en: "Computes `n * n` and returns it." },
        {},
        { az: "Funksiya 4 arqumenti ilə çağırılır; qaytarılan 16 çap olunur.", en: "Calls the function with the argument 4; the returned 16 is printed." },
      ],
      output: "16",
    },
    {
      title: { az: "Orta nümunə: standart dəyər və adlı arqument", en: "Intermediate example: default value and keyword argument" },
      lang: "python",
      code: 'def power(base, exponent=2):\n    return base ** exponent\n\nprint(power(3))\nprint(power(2, exponent=5))',
      lines: [
        { az: "`exponent=2` — arqument verilməzsə istifadə olunan standart dəyər.", en: "`exponent=2` is the default used when no argument is given." },
        { az: "`**` qüvvətə yüksəltmə operatorudur.", en: "`**` is the exponent operator." },
        {},
        { az: "Yalnız `base` verilib: 3 ** 2 = 9.", en: "Only `base` is given: 3 ** 2 = 9." },
        { az: "Adlı arqument (`exponent=5`) standart dəyəri əvəz edir: 2 ** 5 = 32.", en: "A keyword argument (`exponent=5`) overrides the default: 2 ** 5 = 32." },
      ],
      output: "9\n32",
    },
    {
      title: { az: "Real nümunə: şifrənin uzunluğunu yoxlamaq", en: "Real-world example: checking password length" },
      lang: "python",
      code: 'def is_valid_password(password):\n    if len(password) < 8:\n        return False\n    return True\n\nprint(is_valid_password("abc"))\nprint(is_valid_password("secure-pass"))',
      lines: [
        { az: "Şifrəni yoxlayan funksiya; `True` və ya `False` qaytaracaq.", en: "A function that checks a password; it will return `True` or `False`." },
        { az: "Uzunluq 8-dən azdırsa…", en: "If the length is under 8…" },
        { az: "…`return False` funksiyanı dərhal bitirir; aşağıdakı sətirlər işləmir.", en: "…`return False` ends the function immediately; the lines below do not run." },
        { az: "Yoxlamadan keçdisə `True` qaytarılır.", en: "If the check passed, `True` is returned." },
        {},
        { az: "3 simvol: `False`.", en: "3 characters: `False`." },
        { az: "11 simvol: `True`.", en: "11 characters: `True`." },
      ],
      output: "False\nTrue",
    },
  ],
  mistakes: [
    {
      title: { az: "`return` əvəzinə `print` yazmaq", en: "Using `print` instead of `return`" },
      wrong: 'def add(a, b):\n    print(a + b)\n\nresult = add(2, 3)\nprint(result * 2)',
      right: 'def add(a, b):\n    return a + b\n\nresult = add(2, 3)\nprint(result * 2)',
      why: {
        az: "`print` nəticəni yalnız ekrana yazır, funksiya isə `None` qaytarır. Sonra `None * 2` `TypeError` verir. Nəticə sonradan istifadə olunacaqsa `return` yazın.",
        en: "`print` only shows the value; the function still returns `None`. Then `None * 2` raises a `TypeError`. Use `return` when the result is needed later.",
      },
    },
    {
      title: { az: "Funksiyanı təyin edilməmişdən əvvəl çağırmaq", en: "Calling a function before it is defined" },
      wrong: 'print(double(5))\n\ndef double(n):\n    return n * 2',
      right: 'def double(n):\n    return n * 2\n\nprint(double(5))',
      why: {
        az: "Python faylı yuxarıdan aşağı icra edir. `def` sətrinə çatmadan funksiya mövcud deyil: `NameError: name 'double' is not defined`.",
        en: "Python runs a file from top to bottom. Until the `def` line runs, the function does not exist: `NameError: name 'double' is not defined`.",
      },
    },
    {
      title: { az: "Arqument sayını səhv vermək", en: "Passing the wrong number of arguments" },
      wrong: 'def area(width, height):\n    return width * height\n\narea(5)',
      right: 'def area(width, height):\n    return width * height\n\narea(5, 3)',
      why: {
        az: "Hər tələb olunan parametr üçün arqument verilməlidir, əks halda `TypeError: area() missing 1 required positional argument: 'height'` alınır.",
        en: "Every required parameter needs an argument, otherwise you get `TypeError: area() missing 1 required positional argument: 'height'`.",
      },
    },
  ],
  exercise: {
    objective: { az: "Şərt istifadə edən və nəticə qaytaran funksiya yazmaq.", en: "Write a function that uses a condition and returns a result." },
    task: {
      az: "`max_of_two(a, b)` funksiyasını yazın: iki ədəddən böyüyünü qaytarsın (daxili `max()` funksiyasından istifadə etmədən). `max_of_two(7, 3)` 7 qaytarmalıdır.",
      en: "Write `max_of_two(a, b)` that returns the larger of two numbers (without using the built-in `max()`). `max_of_two(7, 3)` should return 7.",
    },
    hints: [
      { az: "`if a > b:` ilə müqayisə edin.", en: "Compare with `if a > b:`." },
      { az: "Hər iki budaqda `return` olmalıdır.", en: "Both branches need a `return`." },
    ],
    solution: 'def max_of_two(a, b):\n    if a > b:\n        return a\n    return b\n\nprint(max_of_two(7, 3))',
    lang: "python",
  },
  quiz: [
    {
      kind: "predict",
      prompt: { az: "Bu kod nə çap edir?", en: "What does this code print?" },
      code: 'def f(x):\n    x * 3\n\nprint(f(2))',
      lang: "python",
      options: ["6", "None", "x * 3"],
      answer: 1,
      explain: { az: "`return` yoxdur, ona görə funksiya `None` qaytarır.", en: "There is no `return`, so the function returns `None`." },
    },
    {
      kind: "predict",
      prompt: { az: "Nəticə nədir?", en: "What is the result?" },
      code: 'def greet(name="friend"):\n    return "Hi " + name\n\nprint(greet())',
      lang: "python",
      options: ["Hi ", "Hi friend", "TypeError"],
      answer: 1,
      explain: { az: "Arqument verilmədiyi üçün standart dəyər (`\"friend\"`) istifadə olunur.", en: "No argument was given, so the default (`\"friend\"`) is used." },
    },
    {
      kind: "choice",
      prompt: { az: "`return` işlədikdən sonra funksiyada nə baş verir?", en: "What happens in a function after `return` runs?" },
      options: [
        { az: "Funksiya dərhal bitir", en: "The function ends immediately" },
        { az: "Qalan sətirlər yenə də işləyir", en: "The remaining lines still run" },
        { az: "Funksiya yenidən başlayır", en: "The function starts over" },
      ],
      answer: 0,
      explain: { az: "`return` funksiyanın icrasını dayandırır və dəyəri çağırana göndərir.", en: "`return` stops the function and sends the value to the caller." },
    },
  ],
  terms: [
    { en: "function definition", local: { az: "funksiyanın təyini", tr: "fonksiyon tanımı", ru: "определение функции" } },
    { en: "default value", local: { az: "standart dəyər", tr: "varsayılan değer", ru: "значение по умолчанию" } },
    { en: "keyword argument", local: { az: "adlı arqument", tr: "anahtar kelimeli argüman", ru: "именованный аргумент" } },
    { en: "return value", local: { az: "qaytarılan dəyər", tr: "dönüş değeri", ru: "возвращаемое значение" } },
  ],
  related: ["python-conditions", "javascript-functions", "python-lists"],
  sources: [
    { title: "The Python Tutorial — Defining Functions", url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions" },
    { title: "The Python Tutorial — Default Argument Values", url: "https://docs.python.org/3/tutorial/controlflow.html#default-argument-values" },
    { title: "The Python Tutorial — Keyword Arguments", url: "https://docs.python.org/3/tutorial/controlflow.html#keyword-arguments" },
  ],
  reviewedAt: "2026-11-22",
  verification: "authored",
};

export default lesson;
