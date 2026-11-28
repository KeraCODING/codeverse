import type { Lesson } from "../types";

const lesson: Lesson = {
  id: "python-variables",
  language: "python",
  order: 1,
  level: "absolute",
  title: { az: "Dəyişənlər və məlumat tipləri", en: "Variables and data types" },
  simple: {
    az: "Dəyişəni üzərində ad yazılmış qutu kimi təsəvvür edin. `age = 24` deyəndə \"age\" adlı qutuya 24 qoyursunuz. Sonra `age` yazdıqda Python qutunu açıb içindəkini götürür. Qutuya yeni dəyər qoysanız, köhnəsi çıxarılır. Məlumat tipi isə qutunun içindəkinin növüdür: ədəd (`int`, `float`), mətn (`str`) və ya bəli/xeyr (`bool`).",
    en: "Think of a variable as a box with a name written on it. `age = 24` puts 24 into the box called \"age\". Later, writing `age` makes Python open the box and take out what is inside. Put a new value in and the old one is taken out. The data type is what kind of thing is inside: a number (`int`, `float`), text (`str`) or yes/no (`bool`).",
  },
  intro: {
    what: {
      az: "Dəyişən (variable) — dəyərə verilən addır. Python-da `ad = dəyər` yazanda Python dəyəri yaddaşda yaradır və `ad` sözünü ona bağlayır.",
      en: "A variable is a name given to a value. When you write `name = value`, Python creates the value in memory and binds the name to it.",
    },
    why: {
      az: "Proqramlar məlumatla işləyir: istifadəçinin adı, qiymət, nəticə. Dəyişənlər bu məlumatı yadda saxlamağa və sonra adla istifadə etməyə imkan verir.",
      en: "Programs work with data: a user's name, a price, a result. Variables let you keep that data and refer to it later by name.",
    },
    where: {
      az: "Demək olar ki, hər Python proqramında: hesablamalarda, istifadəçi daxiletməsində, faylların emalında, veb tətbiqlərdə.",
      en: "In almost every Python program: calculations, user input, file processing, web applications.",
    },
  },
  syntax: {
    code: 'age = 20',
    lang: "python",
    parts: [
      { token: "age", role: { az: "Dəyişənin adı (identifikator). Hərf və ya alt xətt (_) ilə başlamalıdır.", en: "The variable name (identifier). It must start with a letter or an underscore (_)." } },
      { token: "=", role: { az: "Mənimsətmə operatoru. Bərabərlik yoxlaması deyil: sağdakı dəyəri soldakı ada bağlayır.", en: "The assignment operator. Not an equality check: it binds the value on the right to the name on the left." } },
      { token: "20", role: { az: "Dəyər. Burada tam ədəddir, tipi `int`-dir.", en: "The value. Here it is a whole number of type `int`." } },
    ],
  },
  examples: [
    {
      title: { az: "Sadə nümunə: dörd əsas tip", en: "Simple example: four basic types" },
      lang: "python",
      code: 'name = "Aysel"\nage = 20\nheight = 1.68\nis_student = True\nprint(type(age))',
      lines: [
        { az: "`name` dəyişəninə mətn (`str`) mənimsədilir. Mətn dırnaq içində yazılır.", en: "`name` is assigned text (`str`). Text is written in quotes." },
        { az: "`age` tam ədəddir (`int`). Dırnaq yoxdur, çünki bu ədəddir.", en: "`age` is a whole number (`int`). No quotes, because it is a number." },
        { az: "`height` kəsr ədəddir (`float`). Python-da onluq ayırıcı nöqtədir, vergül deyil.", en: "`height` is a decimal number (`float`). Python uses a dot as the decimal separator, not a comma." },
        { az: "`is_student` məntiqi dəyərdir (`bool`): yalnız `True` və ya `False`. Böyük hərflə yazılır.", en: "`is_student` is a boolean (`bool`): only `True` or `False`, capitalised." },
        { az: "`type()` dəyərin tipini qaytarır, `print()` isə onu ekrana çıxarır.", en: "`type()` returns the value's type and `print()` shows it on screen." },
      ],
      output: "<class 'int'>",
    },
    {
      title: { az: "Orta nümunə: dəyişəni yeniləmək və f-sətir", en: "Intermediate example: updating a variable and f-strings" },
      lang: "python",
      code: 'count = 3\ncount = count + 2\nlabel = f"Count: {count}"\nprint(label)',
      lines: [
        { az: "`count` dəyişəni 3 dəyərini alır.", en: "`count` gets the value 3." },
        { az: "Sağ tərəf əvvəl hesablanır (3 + 2 = 5), sonra nəticə yenidən `count` adına bağlanır.", en: "The right side is evaluated first (3 + 2 = 5), then the result is bound to `count` again." },
        { az: "`f\"...\"` — f-sətir (f-string). Fiqurlu mötərizədəki `{count}` dəyişənin dəyəri ilə əvəz olunur.", en: "`f\"...\"` is an f-string. `{count}` inside the braces is replaced by the variable's value." },
        { az: "Hazır mətni ekrana çıxarır.", en: "Prints the finished text." },
      ],
      output: "Count: 5",
    },
    {
      title: { az: "Real nümunə: sifarişin cəmi", en: "Real-world example: order total" },
      lang: "python",
      code: 'price = 12.5\nquantity = 3\ntotal = price * quantity\nprint(f"Total: {total} AZN")',
      lines: [
        { az: "Bir məhsulun qiyməti (`float`).", en: "The price of one item (`float`)." },
        { az: "Neçə ədəd alındığı (`int`).", en: "How many items were bought (`int`)." },
        { az: "`*` vurma operatorudur. `float` və `int` vurulanda nəticə `float` olur: 37.5.", en: "`*` multiplies. Multiplying a `float` by an `int` gives a `float`: 37.5." },
        { az: "Nəticəni valyuta ilə birlikdə göstərir.", en: "Shows the result together with the currency." },
      ],
      output: "Total: 37.5 AZN",
    },
  ],
  mistakes: [
    {
      title: { az: "Mətnlə ədədi birləşdirmək", en: "Joining text and a number" },
      wrong: 'age = 20\nprint("Age: " + age)',
      right: 'age = 20\nprint("Age: " + str(age))\n# or: print(f"Age: {age}")',
      why: {
        az: "Python `str` ilə `int`-i avtomatik birləşdirmir və `TypeError: can only concatenate str (not \"int\") to str` xətası verir. Ədədi `str()` ilə mətnə çevirin və ya f-sətir istifadə edin.",
        en: "Python does not join `str` and `int` automatically and raises `TypeError: can only concatenate str (not \"int\") to str`. Convert with `str()` or use an f-string.",
      },
    },
    {
      title: { az: "Rəqəmlə başlayan ad", en: "A name that starts with a digit" },
      wrong: '1st_place = "Ali"',
      right: 'first_place = "Ali"',
      why: {
        az: "Dəyişən adı rəqəmlə başlaya bilməz — `SyntaxError` alınır. Adlarda hərf, rəqəm və `_` ola bilər, amma birinci simvol hərf və ya `_` olmalıdır.",
        en: "A variable name cannot start with a digit — you get a `SyntaxError`. Names may contain letters, digits and `_`, but must start with a letter or `_`.",
      },
    },
    {
      title: { az: "Təyin edilməmiş dəyişən və böyük-kiçik hərf", en: "Undefined variable and letter case" },
      wrong: 'name = "Aysel"\nprint(Name)',
      right: 'name = "Aysel"\nprint(name)',
      why: {
        az: "Python böyük və kiçik hərfləri fərqləndirir: `name` və `Name` fərqli adlardır. Mövcud olmayan ad `NameError: name 'Name' is not defined` xətası verir.",
        en: "Python is case-sensitive: `name` and `Name` are different names. Using a name that does not exist raises `NameError: name 'Name' is not defined`.",
      },
    },
  ],
  exercise: {
    objective: { az: "Müxtəlif tipli dəyişənlər yaratmaq və onları f-sətirdə birləşdirmək.", en: "Create variables of different types and combine them in an f-string." },
    task: {
      az: "`city` (mətn) və `temperature` (kəsr ədəd) dəyişənlərini yaradın. Sonra dəyişənlərdən istifadə edərək dəqiq bu cümləni çap edin: `Baku: 18.5 °C`.",
      en: "Create `city` (text) and `temperature` (decimal number) variables. Then use the variables to print exactly: `Baku: 18.5 °C`.",
    },
    hints: [
      { az: "Mətn dırnaq içində yazılır, kəsr ədəd isə nöqtə ilə: `18.5`.", en: "Text goes in quotes; a decimal uses a dot: `18.5`." },
      { az: "f-sətirdə dəyişənləri fiqurlu mötərizədə yazın: `f\"{city}: ...\"`.", en: "In an f-string, put variables in braces: `f\"{city}: ...\"`." },
    ],
    solution: 'city = "Baku"\ntemperature = 18.5\nprint(f"{city}: {temperature} °C")',
    lang: "python",
    check: { expected: "Baku: 18.5 °C", starter: '# city and temperature\n' },
  },
  quiz: [
    {
      kind: "choice",
      prompt: { az: "`is_ready = True` sətrində `is_ready` dəyişəninin tipi nədir?", en: "In `is_ready = True`, what is the type of `is_ready`?" },
      options: ["`str`", "`bool`", "`int`"],
      answer: 1,
      explain: { az: "`True` və `False` məntiqi (`bool`) dəyərlərdir. Dırnaq içində olsaydı (`\"True\"`) mətn olardı.", en: "`True` and `False` are boolean (`bool`) values. In quotes (`\"True\"`) it would be text." },
    },
    {
      kind: "predict",
      prompt: { az: "Bu kod ekrana nə çıxarır?", en: "What does this code print?" },
      code: 'x = 4\nx = x * 2\nprint(x)',
      lang: "python",
      options: ["4", "8", "x * 2"],
      answer: 1,
      explain: { az: "İkinci sətirdə əvvəl `x * 2` = 8 hesablanır, sonra `x` adı 8-ə bağlanır.", en: "On line two, `x * 2` = 8 is evaluated first, then `x` is bound to 8." },
    },
    {
      kind: "choice",
      prompt: { az: "Hansı dəyişən adı düzgündür?", en: "Which variable name is valid?" },
      options: ["`2total`", "`total-sum`", "`total_sum`"],
      answer: 2,
      explain: { az: "Ad rəqəmlə başlaya bilməz, defis (`-`) isə çıxma operatoru kimi oxunur. Söz ayırmaq üçün alt xətt istifadə olunur.", en: "A name cannot start with a digit, and a hyphen (`-`) is read as minus. Use underscores to separate words." },
    },
    {
      kind: "predict",
      prompt: { az: "Bu kodun nəticəsi nədir?", en: "What is the result of this code?" },
      code: 'age = 20\nprint("Age: " + age)',
      lang: "python",
      options: ["Age: 20", "Age: age", "TypeError"],
      answer: 2,
      explain: { az: "`str` ilə `int` `+` ilə birləşdirilə bilməz, Python `TypeError` verir.", en: "A `str` and an `int` cannot be joined with `+`; Python raises a `TypeError`." },
    },
  ],
  terms: [
    { en: "variable", local: { az: "dəyişən", tr: "değişken", ru: "переменная" } },
    { en: "assignment", local: { az: "mənimsətmə", tr: "atama", ru: "присваивание" } },
    { en: "data type", local: { az: "məlumat tipi", tr: "veri tipi", ru: "тип данных" } },
    { en: "string", local: { az: "sətir (mətn)", tr: "dize (metin)", ru: "строка" } },
    { en: "integer", local: { az: "tam ədəd", tr: "tam sayı", ru: "целое число" } },
    { en: "boolean", local: { az: "məntiqi tip", tr: "mantıksal tip", ru: "логический тип" } },
  ],
  related: ["python-conditions", "python-lists", "javascript-variables"],
  sources: [
    { title: "The Python Tutorial — An Informal Introduction to Python", url: "https://docs.python.org/3/tutorial/introduction.html" },
    { title: "Built-in Types", url: "https://docs.python.org/3/library/stdtypes.html" },
    { title: "Lexical analysis — Identifiers", url: "https://docs.python.org/3/reference/lexical_analysis.html#identifiers" },
  ],
  reviewedAt: "2026-11-22",
  verification: "authored",
};

export default lesson;
