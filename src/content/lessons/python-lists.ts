import type { Lesson } from "../types";

const lesson: Lesson = {
  id: "python-lists",
  language: "python",
  order: 4,
  level: "beginner",
  title: { az: "Siyahılar (list)", en: "Lists" },
  intro: {
    what: {
      az: "Siyahı (list) bir neçə dəyəri müəyyən ardıcıllıqla saxlayan dəyişkən (mutable) kolleksiyadır. Kvadrat mötərizədə, vergüllə ayrılmış elementlərlə yazılır: `[1, 2, 3]`.",
      en: "A list is a mutable collection that keeps several values in order. It is written in square brackets with comma-separated items: `[1, 2, 3]`.",
    },
    why: {
      az: "Hər tələbə, məhsul və ya mesaj üçün ayrıca dəyişən yaratmaq mümkün deyil. Siyahı əlaqəli məlumatları bir yerdə saxlamağa, əlavə etməyə, silməyə və dövrlə emal etməyə imkan verir.",
      en: "You cannot create a separate variable for every student, product or message. A list keeps related data together and lets you add, remove and loop over items.",
    },
    where: {
      az: "İstifadəçi siyahıları, alış səbəti, fayldan oxunan sətirlər, ölçmə nəticələri.",
      en: "User lists, shopping baskets, lines read from a file, measurement results.",
    },
  },
  syntax: {
    code: 'colors = ["red", "green", "blue"]\nfirst = colors[0]',
    lang: "python",
    parts: [
      { token: "[ ]", role: { az: "Kvadrat mötərizələr siyahı yaradır.", en: "Square brackets create a list." } },
      { token: '"red", "green", "blue"', role: { az: "Elementlər vergüllə ayrılır. Fərqli tiplər də ola bilər, amma adətən eyni tipli olur.", en: "Items are separated by commas. They may be of different types, but usually share one type." } },
      { token: "colors[0]", role: { az: "İndeks ilə müraciət. İndeks 0-dan başlayır: birinci element `[0]`-dır.", en: "Access by index. Indexes start at 0: the first item is `[0]`." } },
    ],
  },
  examples: [
    {
      title: { az: "Sadə nümunə: indekslər", en: "Simple example: indexes" },
      lang: "python",
      code: 'colors = ["red", "green", "blue"]\nprint(colors[0])\nprint(colors[-1])\nprint(len(colors))',
      lines: [
        { az: "Üç elementli siyahı. İndekslər: 0, 1, 2.", en: "A three-item list. Indexes: 0, 1, 2." },
        { az: "Birinci element: `red`.", en: "The first item: `red`." },
        { az: "Mənfi indeks sondan sayır: `-1` sonuncu elementdir, `blue`.", en: "Negative indexes count from the end: `-1` is the last item, `blue`." },
        { az: "`len()` elementlərin sayını qaytarır: 3.", en: "`len()` returns the number of items: 3." },
      ],
      output: "red\nblue\n3",
    },
    {
      title: { az: "Orta nümunə: əlavə etmək, dəyişmək, silmək", en: "Intermediate example: add, change, remove" },
      lang: "python",
      code: 'tasks = ["read", "code"]\ntasks.append("test")\ntasks[0] = "review"\ntasks.remove("code")\nprint(tasks)',
      lines: [
        { az: "İki tapşırıqlı siyahı.", en: "A list with two tasks." },
        { az: "`append()` elementi siyahının sonuna əlavə edir: `[\"read\", \"code\", \"test\"]`.", en: "`append()` adds an item to the end: `[\"read\", \"code\", \"test\"]`." },
        { az: "Siyahı dəyişkəndir: 0 indeksli element əvəz olunur.", en: "Lists are mutable: the item at index 0 is replaced." },
        { az: "`remove()` göstərilən dəyərin ilk rast gəlinən nüsxəsini silir.", en: "`remove()` deletes the first occurrence of the given value." },
        { az: "Yekun siyahını çap edir.", en: "Prints the final list." },
      ],
      output: "['review', 'test']",
    },
    {
      title: { az: "Real nümunə: qiymətlərin ortası", en: "Real-world example: average grade" },
      lang: "python",
      code: 'grades = [78, 92, 85]\naverage = sum(grades) / len(grades)\nprint(round(average, 1))\nprint(92 in grades)',
      lines: [
        { az: "Tələbənin qiymətləri.", en: "A student's grades." },
        { az: "`sum()` cəmi (255), `len()` sayı (3) verir; bölmə nəticəsi 85.0-dır.", en: "`sum()` gives the total (255), `len()` the count (3); the division gives 85.0." },
        { az: "`round(x, 1)` bir onluq rəqəmə qədər yuvarlaqlaşdırır.", en: "`round(x, 1)` rounds to one decimal place." },
        { az: "`in` operatoru dəyərin siyahıda olub-olmadığını yoxlayır: `True`.", en: "The `in` operator checks whether a value is in the list: `True`." },
      ],
      output: "85.0\nTrue",
    },
  ],
  mistakes: [
    {
      title: { az: "Mövcud olmayan indeks", en: "An index that does not exist" },
      wrong: 'items = ["a", "b", "c"]\nprint(items[3])',
      right: 'items = ["a", "b", "c"]\nprint(items[2])  # or items[-1]',
      why: {
        az: "Üç elementli siyahıda son indeks 2-dir. `items[3]` `IndexError: list index out of range` verir.",
        en: "In a three-item list the last index is 2. `items[3]` raises `IndexError: list index out of range`.",
      },
    },
    {
      title: { az: "`append()` nəticəsini geri mənimsətmək", en: "Assigning the result of `append()`" },
      wrong: 'items = [1, 2]\nitems = items.append(3)\nprint(items)  # None',
      right: 'items = [1, 2]\nitems.append(3)\nprint(items)  # [1, 2, 3]',
      why: {
        az: "`append()` siyahını yerində dəyişir və `None` qaytarır. Nəticəni siyahıya yenidən mənimsətsəniz siyahı itir.",
        en: "`append()` changes the list in place and returns `None`. Assigning its result back replaces your list with `None`.",
      },
    },
    {
      title: { az: "Kopyalamaq əvəzinə eyni siyahıya ikinci ad vermək", en: "Giving a list a second name instead of copying it" },
      wrong: 'a = [1, 2]\nb = a\nb.append(3)\nprint(a)  # [1, 2, 3]',
      right: 'a = [1, 2]\nb = a.copy()\nb.append(3)\nprint(a)  # [1, 2]',
      why: {
        az: "`b = a` yeni siyahı yaratmır; hər iki ad eyni obyektə bağlanır. Ayrıca nüsxə üçün `a.copy()` və ya `list(a)` istifadə edin.",
        en: "`b = a` does not create a new list; both names refer to the same object. Use `a.copy()` or `list(a)` for a separate copy.",
      },
    },
  ],
  exercise: {
    objective: { az: "Siyahı yaratmaq, element əlavə etmək və dövrlə gəzmək.", en: "Create a list, add an item and loop over it." },
    task: {
      az: "`cities = [\"Baku\", \"Sumgait\", \"Shaki\"]` siyahısının sonuna `\"Ganja\"` əlavə edin və hər şəhəri nömrəsi ilə çap edin: `1. Baku`, `2. …`.",
      en: "Take the list `cities = [\"Baku\", \"Sumgait\", \"Shaki\"]`, append `\"Ganja\"`, then print each city with its number: `1. Baku`, `2. …`.",
    },
    hints: [
      { az: "Sona əlavə etmək üçün `append()`.", en: "Use `append()` to add to the end." },
      { az: "`enumerate(cities, start=1)` həm nömrəni, həm elementi verir: `for i, city in enumerate(...)`.", en: "`enumerate(cities, start=1)` yields both the number and the item: `for i, city in enumerate(...)`." },
    ],
    solution: 'cities = ["Baku", "Sumgait", "Shaki"]\ncities.append("Ganja")\nfor i, city in enumerate(cities, start=1):\n    print(f"{i}. {city}")',
    lang: "python",
    check: { expected: "1. Baku\n2. Sumgait\n3. Shaki\n4. Ganja", starter: 'cities = ["Baku", "Sumgait", "Shaki"]\n' },
  },
  quiz: [
    {
      kind: "predict",
      prompt: { az: "Bu kod nə çap edir?", en: "What does this code print?" },
      code: 'nums = [10, 20, 30]\nprint(nums[1])',
      lang: "python",
      options: ["10", "20", "30"],
      answer: 1,
      explain: { az: "İndeks 0-dan başlayır, ona görə `nums[1]` ikinci elementdir: 20.", en: "Indexes start at 0, so `nums[1]` is the second item: 20." },
    },
    {
      kind: "predict",
      prompt: { az: "Nəticə nədir?", en: "What is the result?" },
      code: 'nums = [1, 2, 3]\nnums.append(4)\nprint(len(nums))',
      lang: "python",
      options: ["3", "4", "None"],
      answer: 1,
      explain: { az: "`append` bir element əlavə edir, siyahıda indi 4 element var.", en: "`append` adds one item, so the list now has 4 items." },
    },
    {
      kind: "choice",
      prompt: { az: "Siyahının sonuncu elementini hansı ifadə qaytarır?", en: "Which expression returns the last item of a list?" },
      options: ["`items[len(items)]`", "`items[-1]`", "`items[last]`"],
      answer: 1,
      explain: { az: "`items[-1]` sonuncu elementdir. `items[len(items)]` həmişə `IndexError` verir, çünki son indeks `len - 1`-dir.", en: "`items[-1]` is the last item. `items[len(items)]` always raises `IndexError`, because the last index is `len - 1`." },
    },
  ],
  terms: [
    { en: "list", local: { az: "siyahı", tr: "liste", ru: "список" } },
    { en: "index", local: { az: "indeks", tr: "indeks", ru: "индекс" } },
    { en: "element / item", local: { az: "element", tr: "öğe", ru: "элемент" } },
    { en: "mutable", local: { az: "dəyişkən", tr: "değiştirilebilir", ru: "изменяемый" } },
    { en: "method", local: { az: "metod", tr: "metot", ru: "метод" } },
  ],
  related: ["python-loops", "javascript-arrays", "python-functions"],
  sources: [
    { title: "The Python Tutorial — Lists", url: "https://docs.python.org/3/tutorial/introduction.html#lists" },
    { title: "The Python Tutorial — More on Lists", url: "https://docs.python.org/3/tutorial/datastructures.html#more-on-lists" },
    { title: "Built-in Functions — len, sum, round, enumerate", url: "https://docs.python.org/3/library/functions.html" },
  ],
  reviewedAt: "2026-11-22",
  verification: "authored",
};

export default lesson;
