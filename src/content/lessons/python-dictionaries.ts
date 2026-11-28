import type { Lesson } from "../types";

const lesson: Lesson = {
  id: "python-dictionaries",
  language: "python",
  order: 6,
  level: "beginner",
  title: { az: "Lüğətlər (dict)", en: "Dictionaries (dict)" },
  intro: {
    what: {
      az: "Lüğət (`dict`) — açar–dəyər cütlərini saxlayan quruluşdur: `{\"name\": \"Aysel\", \"age\": 24}`. Dəyərə sıra nömrəsi ilə yox, açarla müraciət olunur.",
      en: "A dictionary (`dict`) stores key–value pairs: `{\"name\": \"Aysel\", \"age\": 24}`. You reach a value by its key, not by a position.",
    },
    why: {
      az: "Ad ilə axtarış çox sürətlidir və məlumatı mənalı adlarla saxlamaq kodu oxunaqlı edir: telefon kitabçası, sözlük, sayğaclar, parametrlər.",
      en: "Looking things up by name is very fast, and naming the data makes code readable: phone books, word counts, counters, settings.",
    },
    where: {
      az: "JSON ilə işləmək, API cavabları, hesablamaq (hər sözdən neçə dənə), keş, konfiqurasiya.",
      en: "Working with JSON, API responses, counting (how many of each word), caches, configuration.",
    },
  },
  syntax: {
    code: 'user = {"name": "Aysel", "age": 24}\nprint(user["name"])',
    lang: "python",
    parts: [
      { token: "{ }", role: { az: "Lüğət literalı.", en: "A dictionary literal." } },
      { token: "\"name\": \"Aysel\"", role: { az: "Cüt: açar, iki nöqtə, dəyər. Açar adətən mətndir.", en: "A pair: key, colon, value. Keys are usually strings." } },
      { token: "user[\"name\"]", role: { az: "Açara görə dəyəri oxumaq.", en: "Reading the value for a key." } },
    ],
  },
  examples: [
    {
      title: { az: "Sadə nümunə: oxumaq, dəyişmək, əlavə etmək", en: "Simple example: read, change, add" },
      lang: "python",
      code: 'prices = {"tea": 3, "coffee": 5}\nprices["coffee"] = 6\nprices["juice"] = 4\nprint(prices["tea"])\nprint(prices)\nprint(len(prices))',
      lines: [
        { az: "İki cütlü lüğət yaradılır.", en: "Creates a dictionary with two pairs." },
        { az: "Mövcud açarın dəyəri dəyişdirilir.", en: "Changes the value of an existing key." },
        { az: "Olmayan açara yazmaq yeni cüt əlavə edir.", en: "Writing to a missing key adds a new pair." },
        { az: "`3` çıxır.", en: "Prints `3`." },
        { az: "Bütün lüğət əlavə olunma sırası ilə çıxır.", en: "Prints the whole dictionary in insertion order." },
        { az: "Cütlərin sayı: 3.", en: "The number of pairs: 3." },
      ],
      output: "3\n{'tea': 3, 'coffee': 6, 'juice': 4}\n3",
    },
    {
      title: { az: "Orta nümunə: təhlükəsiz oxumaq və gəzmək", en: "Intermediate example: safe reads and iterating" },
      lang: "python",
      code: 'stock = {"apples": 12, "pears": 0}\nprint(stock.get("plums", 0))\nfor fruit, count in stock.items():\n    status = "in stock" if count > 0 else "sold out"\n    print(f"{fruit}: {status}")',
      lines: [
        { az: "Meyvələrin sayı.", en: "Fruit counts." },
        { az: "`get` açar yoxdursa xəta əvəzinə standart dəyər (0) qaytarır. `stock[\"plums\"]` isə `KeyError` verərdi.", en: "`get` returns a default (0) instead of an error when the key is missing. `stock[\"plums\"]` would raise `KeyError`." },
        { az: "`items()` `(açar, dəyər)` cütlərini verir; hər cüt iki dəyişənə ayrılır.", en: "`items()` gives `(key, value)` pairs; each is unpacked into two variables." },
        { az: "Şərti ifadə ilə status seçilir.", en: "Chooses the status with a conditional expression." },
        { az: "Hər meyvə üçün sətir çıxır.", en: "Prints one line per fruit." },
      ],
      output: "0\napples: in stock\npears: sold out",
    },
    {
      title: { az: "Real nümunə: sözləri saymaq", en: "Real-world example: counting words" },
      lang: "python",
      code: 'text = "to be or not to be"\ncounts = {}\nfor word in text.split():\n    counts[word] = counts.get(word, 0) + 1\nprint(counts)\nprint(max(counts, key=counts.get))',
      lines: [
        { az: "Sayılacaq mətn.", en: "The text to count." },
        { az: "Boş lüğət: hələ heç bir söz yoxdur.", en: "An empty dictionary: no words yet." },
        { az: "`split()` mətni boşluqlara görə sözlərə bölür.", en: "`split()` breaks the text into words at the spaces." },
        { az: "Sözün indiki sayını götürür (yoxdursa 0) və 1 artırır — ən çox istifadə olunan sayğac üsulu.", en: "Takes the word's current count (0 if new) and adds 1 — the classic counter pattern." },
        { az: "Nəticə: hər sözün sayı.", en: "The result: a count for every word." },
        { az: "`max` açarlar arasında dəyəri ən böyük olanı seçir; bərabərlikdə birinci tapılan qalır: `to`.", en: "`max` picks the key with the largest value; on a tie the first one found wins: `to`." },
      ],
      output: "{'to': 2, 'be': 2, 'or': 1, 'not': 1}\nto",
    },
  ],
  mistakes: [
    {
      title: { az: "Olmayan açarı kvadrat mötərizə ilə oxumaq", en: "Reading a missing key with square brackets" },
      wrong: 'ages = {"Aysel": 24}\nprint(ages["Murad"])  # KeyError',
      right: 'ages = {"Aysel": 24}\nprint(ages.get("Murad", "unknown"))',
      why: {
        az: "Açar yoxdursa `[]` `KeyError` verir. Açarın olmaya biləcəyini bilirsinizsə `get` və ya `in` yoxlaması istifadə edin.",
        en: "`[]` raises `KeyError` when the key is missing. If the key might not exist, use `get` or an `in` check.",
      },
    },
    {
      title: { az: "Lüğəti gəzərkən ölçüsünü dəyişmək", en: "Changing a dictionary's size while looping over it" },
      wrong: 'd = {"a": 0, "b": 1}\nfor k in d:\n    if d[k] == 0:\n        del d[k]  # RuntimeError',
      right: 'd = {"a": 0, "b": 1}\nd = {k: v for k, v in d.items() if v != 0}\nprint(d)',
      why: {
        az: "Dövr zamanı açar silmək və ya əlavə etmək `RuntimeError` yaradır. Yeni lüğət qurun (dict comprehension) və ya açarların siyahısını gəzin: `for k in list(d)`.",
        en: "Deleting or adding keys during the loop raises `RuntimeError`. Build a new dictionary (a dict comprehension) or loop over a copy of the keys: `for k in list(d)`.",
      },
    },
    {
      title: { az: "Siyahını açar kimi istifadə etmək", en: "Using a list as a key" },
      wrong: 'seen = {}\nseen[[1, 2]] = True  # TypeError',
      right: 'seen = {}\nseen[(1, 2)] = True\nprint(seen)',
      why: {
        az: "Açar dəyişməz (hashable) olmalıdır: mətn, ədəd, tuple. Siyahı dəyişə bildiyi üçün açar ola bilməz.",
        en: "Keys must be immutable (hashable): strings, numbers, tuples. A list can change, so it cannot be a key.",
      },
    },
  ],
  exercise: {
    objective: { az: "Lüğəti gəzmək və dəyərləri toplamaq.", en: "Loop over a dictionary and add up the values." },
    task: {
      az: "`cart` lüğətində məhsulun adı açar, qiyməti dəyərdir. Bütün qiymətlərin cəmini hesablayıb dəqiq bu formada çıxarın: `Total: 14 AZN`.",
      en: "In `cart`, product names are keys and prices are values. Add up all prices and print exactly: `Total: 14 AZN`.",
    },
    hints: [
      { az: "`cart.values()` yalnız dəyərləri verir.", en: "`cart.values()` gives just the values." },
      { az: "`total = sum(cart.values())`, sonra `print(f\"Total: {total} AZN\")`.", en: "`total = sum(cart.values())`, then `print(f\"Total: {total} AZN\")`." },
    ],
    solution: 'cart = {"bread": 2, "milk": 3, "cheese": 9}\ntotal = sum(cart.values())\nprint(f"Total: {total} AZN")',
    lang: "python",
    check: { expected: "Total: 14 AZN", starter: 'cart = {"bread": 2, "milk": 3, "cheese": 9}\n' },
  },
  quiz: [
    {
      kind: "predict",
      prompt: { az: "Bu kod nə çap edir?", en: "What does this code print?" },
      code: 'd = {"x": 1}\nd["x"] = d.get("x", 0) + 5\nprint(d["x"])',
      lang: "python",
      options: ["5", "6", "1"],
      answer: 1,
      explain: { az: "`get` mövcud dəyəri (1) qaytarır, 5 əlavə olunur: 6.", en: "`get` returns the existing value (1), plus 5 makes 6." },
    },
    {
      kind: "choice",
      prompt: { az: "Açar yoxdursa xəta əvəzinə standart dəyər hansı ilə alınır?", en: "Which gives a default value instead of an error when a key is missing?" },
      options: ['d["key"]', 'd.get("key", 0)', 'd.key'],
      answer: 1,
      explain: { az: "`get` ikinci arqumenti standart dəyər kimi qaytarır.", en: "`get` returns its second argument as the default." },
    },
    {
      kind: "choice",
      prompt: { az: "Hansı lüğət açarı ola bilməz?", en: "Which cannot be a dictionary key?" },
      options: ['"name"', "(1, 2)", "[1, 2]"],
      answer: 2,
      explain: { az: "Siyahı dəyişkəndir (hashable deyil), ona görə açar ola bilməz.", en: "A list is mutable (not hashable), so it cannot be a key." },
    },
  ],
  terms: [
    { en: "dictionary", local: { az: "lüğət", tr: "sözlük", ru: "словарь" } },
    { en: "key", local: { az: "açar", tr: "anahtar", ru: "ключ" } },
    { en: "value", local: { az: "dəyər", tr: "değer", ru: "значение" } },
    { en: "hashable", local: { az: "heşlənə bilən", tr: "hash'lenebilir", ru: "хешируемый" } },
    { en: "comprehension", local: { az: "qısa yaradılma ifadəsi", tr: "kavrama ifadesi", ru: "генератор (comprehension)" } },
  ],
  related: ["python-lists", "python-loops", "javascript-objects"],
  sources: [
    { title: "Python Tutorial — Dictionaries", url: "https://docs.python.org/3/tutorial/datastructures.html#dictionaries" },
    { title: "Python Library — Mapping Types: dict", url: "https://docs.python.org/3/library/stdtypes.html#mapping-types-dict" },
  ],
  reviewedAt: "2026-11-28",
  verification: "authored",
};

export default lesson;
