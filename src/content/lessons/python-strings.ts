import type { Lesson } from "../types";

const lesson: Lesson = {
  id: "python-strings",
  language: "python",
  order: 7,
  level: "beginner",
  title: { az: "Mətnlər (str) və onların metodları", en: "Strings (str) and their methods" },
  simple: {
    az: "Mətn hərflərdən düzülmüş muncuq sapına bənzəyir: hər muncuğun öz yeri (indeksi) var, birincisi 0-dır. Sapdan istənilən hissəni kəsib götürə (`text[0:3]`), bütün muncuqları böyük hərfə çevirə (`upper()`) və ya kənardakı boş muncuqları ata (`strip()`) bilərsiniz. Amma sapın özü dəyişmir — hər əməliyyat yeni sap yaradır.",
    en: "A string is like beads on a thread: each bead (character) has its own position (index), and the first one is 0. You can cut any piece off (`text[0:3]`), turn every bead into a capital (`upper()`) or drop empty beads at the ends (`strip()`). The thread itself never changes — every operation makes a new one.",
  },
  intro: {
    what: {
      az: "Mətn (`str`) — dırnaq içində yazılmış simvollar ardıcıllığıdır: `\"Salam\"`. Python-da mətnlər dəyişməzdir (immutable): metodlar köhnəni dəyişmir, yeni mətn qaytarır.",
      en: "A string (`str`) is a sequence of characters in quotes: `\"Hello\"`. Python strings are immutable: methods never change the old string; they return a new one.",
    },
    why: {
      az: "İstifadəçi adları, e-poçtlar, mesajlar, fayl məzmunu — proqramların işlədiyi məlumatın böyük hissəsi mətndir. Onu təmizləmək, yoxlamaq və formatlamaq lazımdır.",
      en: "User names, emails, messages, file contents — much of the data programs handle is text. It has to be cleaned, checked and formatted.",
    },
    where: {
      az: "Formadan gələn məlumatı təmizləmək, hesabat çap etmək, faylları emal etmək, axtarış.",
      en: "Cleaning form input, printing reports, processing files, searching.",
    },
  },
  syntax: {
    code: 'name = "aysel"\nprint(name.upper(), name[0], len(name))',
    lang: "python",
    parts: [
      { token: "name.upper()", role: { az: "Metod: bütün hərfləri böyük edən yeni mətn qaytarır.", en: "A method: returns a new string in capitals." } },
      { token: "name[0]", role: { az: "İndeks: 0-cı (birinci) simvol.", en: "An index: character number 0 (the first)." } },
      { token: "len(name)", role: { az: "Simvolların sayı.", en: "The number of characters." } },
    ],
  },
  examples: [
    {
      title: { az: "Sadə nümunə: indeks və uzunluq", en: "Simple example: index and length" },
      lang: "python",
      code: 'name = "aysel"\nprint(name.capitalize())\nprint(len(name))\nprint(name[0], name[-1])',
      lines: [
        { az: "Kiçik hərflə yazılmış ad.", en: "A name in lower case." },
        { az: "`capitalize()` birinci hərfi böyük edir: `Aysel`. `name` özü dəyişmir.", en: "`capitalize()` makes the first letter a capital: `Aysel`. `name` itself is unchanged." },
        { az: "5 hərf var.", en: "There are 5 letters." },
        { az: "`[0]` birinci, `[-1]` sonuncu simvoldur.", en: "`[0]` is the first character and `[-1]` the last." },
      ],
      output: "Aysel\n5\na l",
    },
    {
      title: { az: "Orta nümunə: formadan gələn e-poçtu təmizləmək", en: "Intermediate example: cleaning an email from a form" },
      lang: "python",
      code: 'email = "  Murad@Mail.com "\nclean = email.strip().lower()\nprint(clean)\nprint(clean.endswith(".com"))\nuser, domain = clean.split("@")\nprint(user, domain)',
      lines: [
        { az: "İstifadəçi boşluqlarla və böyük hərflərlə yazıb.", en: "The user typed spaces and capital letters." },
        { az: "`strip()` kənar boşluqları silir, `lower()` kiçik hərfə çevirir; metodlar zəncir kimi ardıcıl çağırılır.", en: "`strip()` removes outer spaces and `lower()` makes it lower case; methods are chained one after another." },
        { az: "Təmiz e-poçt çıxır.", en: "Prints the clean email." },
        { az: "`.com` ilə bitirmi? `True`.", en: "Does it end with `.com`? `True`." },
        { az: "`split(\"@\")` mətni `@` işarəsindən iki hissəyə bölür; hissələr iki dəyişənə ayrılır.", en: "`split(\"@\")` breaks the text at `@` into two parts, unpacked into two variables." },
        { az: "İstifadəçi adı və domen çıxır.", en: "Prints the user name and the domain." },
      ],
      output: "murad@mail.com\nTrue\nmurad mail.com",
    },
    {
      title: { az: "Real nümunə: qəbz formatlamaq", en: "Real-world example: formatting a receipt" },
      lang: "python",
      code: 'price = 12.5\nqty = 3\nprint(f"Total: {price * qty:.2f} AZN")\nprint("-" * 20)\nprint("Baku".center(20, "*"))',
      lines: [
        { az: "Bir ədədin qiyməti.", en: "The price of one item." },
        { az: "Say.", en: "The quantity." },
        { az: "f-sətirdə `:.2f` nəticəni vergüldən sonra 2 rəqəmlə göstərir: `37.50`.", en: "`:.2f` inside an f-string shows the result with 2 decimal places: `37.50`." },
        { az: "Mətni ədədə vurmaq onu təkrarlayır: 20 tire.", en: "Multiplying a string repeats it: 20 dashes." },
        { az: "`center` mətni 20 simvolluq sahənin ortasına qoyur, boşluqları `*` ilə doldurur.", en: "`center` puts the text in the middle of a 20-character field, filling the rest with `*`." },
      ],
      output: "Total: 37.50 AZN\n--------------------\n********Baku********",
    },
  ],
  mistakes: [
    {
      title: { az: "Mətni yerində dəyişməyə çalışmaq", en: "Trying to change a string in place" },
      wrong: 'word = "cat"\nword[0] = "b"  # TypeError',
      right: 'word = "cat"\nword = "b" + word[1:]\nprint(word)  # bat',
      why: {
        az: "Mətnlər dəyişməzdir: simvolu birbaşa əvəz etmək olmaz. Yeni mətn qurub dəyişənə yenidən yazın.",
        en: "Strings are immutable: you can't replace a character directly. Build a new string and assign it again.",
      },
    },
    {
      title: { az: "Metodun nəticəsini itirmək", en: "Throwing away a method's result" },
      wrong: 'name = " leyla "\nname.strip()\nprint(name)  # " leyla "',
      right: 'name = " leyla "\nname = name.strip()\nprint(name)  # "leyla"',
      why: {
        az: "`strip()` yeni mətn qaytarır, köhnəni dəyişmir. Nəticəni dəyişənə yazmasanız itir.",
        en: "`strip()` returns a new string; it doesn't change the old one. If you don't store the result, it is lost.",
      },
    },
    {
      title: { az: "Mətnlə ədədi `+` ilə birləşdirmək", en: "Joining text and a number with `+`" },
      wrong: 'age = 24\nprint("Age: " + age)  # TypeError',
      right: 'age = 24\nprint(f"Age: {age}")',
      why: {
        az: "Python ədədi mətnə avtomatik çevirmir. f-sətir və ya `str(age)` istifadə edin.",
        en: "Python doesn't convert numbers to text automatically. Use an f-string or `str(age)`.",
      },
    },
  ],
  exercise: {
    objective: { az: "Kəsmə (slicing) və `len` ilə işləmək.", en: "Use slicing and `len`." },
    task: {
      az: "`word` sözünü tərsinə çevirib uzunluğu ilə birlikdə bir sətirdə çap edin: `gnimmargorp 11`.",
      en: "Print `word` reversed together with its length on one line: `gnimmargorp 11`.",
    },
    hints: [
      { az: "Tərsinə kəsmə: `word[::-1]`.", en: "Reverse slicing: `word[::-1]`." },
      { az: "`print(word[::-1], len(word))`", en: "`print(word[::-1], len(word))`" },
    ],
    solution: 'word = "programming"\nprint(word[::-1], len(word))',
    lang: "python",
    check: { expected: "gnimmargorp 11", starter: 'word = "programming"\n' },
  },
  quiz: [
    {
      kind: "predict",
      prompt: { az: "Bu kod nə çap edir?", en: "What does this code print?" },
      code: 'text = "Python"\nprint(text[1:4])',
      lang: "python",
      options: ["Pyt", "yth", "ytho"],
      answer: 1,
      explain: { az: "Kəsmə 1-dən başlayır və 4-ü daxil etmir: indekslər 1, 2, 3 → `yth`.", en: "The slice starts at 1 and stops before 4: indexes 1, 2, 3 → `yth`." },
    },
    {
      kind: "predict",
      prompt: { az: "Nəticə nədir?", en: "What is the result?" },
      code: 'print("a-b-c".split("-"))',
      lang: "python",
      options: ["['a', 'b', 'c']", "a b c", "['a-b-c']"],
      answer: 0,
      explain: { az: "`split` hissələrin siyahısını qaytarır.", en: "`split` returns a list of the parts." },
    },
    {
      kind: "choice",
      prompt: { az: "`s.strip()` çağırdıqdan sonra `s` dəyişirmi?", en: "Does `s` change after calling `s.strip()`?" },
      options: [{ az: "Bəli", en: "Yes" }, { az: "Xeyr, yeni mətn qaytarılır", en: "No, a new string is returned" }],
      answer: 1,
      explain: { az: "Mətnlər dəyişməzdir; nəticəni yeni dəyişənə və ya eyni dəyişənə yazmaq lazımdır.", en: "Strings are immutable; store the result in a variable (or the same one)." },
    },
  ],
  terms: [
    { en: "string", local: { az: "mətn (sətir)", tr: "metin (dize)", ru: "строка" } },
    { en: "index", local: { az: "indeks", tr: "indeks", ru: "индекс" } },
    { en: "slice", local: { az: "kəsmə", tr: "dilimleme", ru: "срез" } },
    { en: "immutable", local: { az: "dəyişməz", tr: "değiştirilemez", ru: "неизменяемый" } },
    { en: "method", local: { az: "metod", tr: "metot", ru: "метод" } },
  ],
  related: ["python-variables", "python-lists", "python-functions"],
  sources: [
    { title: "Python Tutorial — Text (strings)", url: "https://docs.python.org/3/tutorial/introduction.html#text" },
    { title: "Python Library — String methods", url: "https://docs.python.org/3/library/stdtypes.html#string-methods" },
  ],
  reviewedAt: "2026-11-28",
  verification: "authored",
};

export default lesson;
