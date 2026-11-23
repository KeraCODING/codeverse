import type { Lesson } from "../types";

const lesson: Lesson = {
  id: "python-loops",
  language: "python",
  order: 3,
  level: "beginner",
  title: { az: "Dövrlər: for və while", en: "Loops: for and while" },
  intro: {
    what: {
      az: "Dövr (loop) eyni kod blokunu dəfələrlə işlədir. Python-da iki əsas dövr var: `for` — ardıcıllığın (siyahı, mətn, `range`) hər elementi üçün; `while` — şərt doğru olduqca.",
      en: "A loop runs the same block of code repeatedly. Python has two main loops: `for` — once for each item of a sequence (list, string, `range`); `while` — as long as a condition is true.",
    },
    why: {
      az: "100 elementi emal etmək üçün 100 sətir yazmaq əvəzinə bir dövr yazırıq. Kod qısa olur və elementlərin sayı dəyişsə də işləyir.",
      en: "Instead of writing 100 lines to process 100 items, you write one loop. The code stays short and still works when the number of items changes.",
    },
    where: {
      az: "Siyahıların emalında, faylları sətir-sətir oxumaqda, cəmləri hesablamaqda, istifadəçi düzgün cavab verənə qədər soruşmaqda.",
      en: "Processing lists, reading files line by line, computing totals, asking the user again until the answer is valid.",
    },
  },
  syntax: {
    code: 'for number in range(1, 4):\n    print(number)',
    lang: "python",
    parts: [
      { token: "for", role: { az: "Dövr açar sözü: \"hər biri üçün\".", en: "Loop keyword: \"for each\"." } },
      { token: "number", role: { az: "Dövr dəyişəni. Hər addımda ardıcıllığın növbəti elementini alır.", en: "The loop variable. On each step it takes the next item of the sequence." } },
      { token: "in", role: { az: "Hansı ardıcıllığın gəzildiyini bildirən açar söz.", en: "Keyword that names the sequence being walked through." } },
      { token: "range(1, 4)", role: { az: "1-dən başlayıb 4-ə qədər (4 daxil deyil) ədədlər verir: 1, 2, 3.", en: "Produces numbers from 1 up to, but not including, 4: 1, 2, 3." } },
      { token: ":", role: { az: "Dövr blokunun başlanğıcı.", en: "Starts the loop block." } },
      { token: "····", role: { az: "Girintili sətirlər dövrün gövdəsidir və hər addımda işləyir.", en: "Indented lines form the loop body and run on every step." } },
    ],
  },
  examples: [
    {
      title: { az: "Sadə nümunə: siyahını gəzmək", en: "Simple example: walking through a list" },
      lang: "python",
      code: 'fruits = ["apple", "pear", "plum"]\nfor fruit in fruits:\n    print(fruit)',
      lines: [
        { az: "Üç elementli siyahı.", en: "A list with three items." },
        { az: "`fruit` hər addımda siyahının növbəti elementini alır.", en: "`fruit` takes the next list item on each step." },
        { az: "Dövr gövdəsi üç dəfə işləyir və hər elementi çap edir.", en: "The body runs three times, printing each item." },
      ],
      output: "apple\npear\nplum",
    },
    {
      title: { az: "Orta nümunə: while ilə geri sayım", en: "Intermediate example: countdown with while" },
      lang: "python",
      code: 'count = 3\nwhile count > 0:\n    print(count)\n    count = count - 1\nprint("Start!")',
      lines: [
        { az: "Başlanğıc dəyər.", en: "Starting value." },
        { az: "Şərt `count > 0` doğru olduqca dövr davam edir.", en: "The loop continues while `count > 0` is true." },
        { az: "Cari dəyəri çap edir.", en: "Prints the current value." },
        { az: "Dəyəri 1 azaldır. Bu sətir olmasa şərt heç vaxt yalan olmaz və dövr sonsuz davam edər.", en: "Decreases the value by 1. Without this line the condition would never become false and the loop would run forever." },
        { az: "Girintisiz — dövr bitəndən sonra bir dəfə işləyir.", en: "Not indented — runs once after the loop ends." },
      ],
      output: "3\n2\n1\nStart!",
    },
    {
      title: { az: "Real nümunə: səbətin cəmi və break", en: "Real-world example: basket total with break" },
      lang: "python",
      code: 'prices = [4.5, 12.0, 3.25, 80.0]\ntotal = 0\nfor price in prices:\n    if total + price > 50:\n        break\n    total = total + price\nprint(total)',
      lines: [
        { az: "Məhsul qiymətlərinin siyahısı.", en: "A list of item prices." },
        { az: "Cəmi saxlamaq üçün dəyişən sıfırdan başlayır.", en: "The total starts at zero." },
        { az: "Hər qiymət üçün dövr.", en: "Loop over each price." },
        { az: "Növbəti məhsul büdcəni (50) keçirsə…", en: "If the next item would exceed the budget (50)…" },
        { az: "`break` dövrü dərhal dayandırır; qalan elementlərə baxılmır.", en: "`break` stops the loop immediately; remaining items are skipped." },
        { az: "Əks halda qiymət cəmə əlavə olunur.", en: "Otherwise the price is added to the total." },
        { az: "4.5 + 12.0 + 3.25 = 19.75; 80.0 əlavə edilsəydi 50-ni keçərdi.", en: "4.5 + 12.0 + 3.25 = 19.75; adding 80.0 would exceed 50." },
      ],
      output: "19.75",
    },
  ],
  mistakes: [
    {
      title: { az: "`range`-in son ədədi daxil etmədiyini unutmaq", en: "Forgetting that `range` excludes the end" },
      wrong: '# 1-dən 5-ə qədər / 1 to 5\nfor i in range(1, 5):\n    print(i)',
      right: 'for i in range(1, 6):\n    print(i)',
      why: {
        az: "`range(1, 5)` 1, 2, 3, 4 verir — 5 daxil deyil. 5-i də almaq üçün son həddi 6 yazın.",
        en: "`range(1, 5)` gives 1, 2, 3, 4 — 5 is not included. Use 6 as the end to include 5.",
      },
    },
    {
      title: { az: "Sonsuz while dövrü", en: "Infinite while loop" },
      wrong: 'n = 0\nwhile n < 3:\n    print(n)',
      right: 'n = 0\nwhile n < 3:\n    print(n)\n    n += 1',
      why: {
        az: "Dövr daxilində `n` dəyişmir, şərt həmişə doğru qalır və proqram dayanmır. Şərtə təsir edən dəyişəni dövrün içində yeniləyin. `n += 1` — `n = n + 1`-in qısa yazılışıdır.",
        en: "`n` never changes inside the loop, so the condition stays true and the program never stops. Update the variable the condition depends on. `n += 1` is short for `n = n + 1`.",
      },
    },
    {
      title: { az: "Dövr gövdəsinin girintisini səhv qoymaq", en: "Wrong indentation of the loop body" },
      wrong: 'total = 0\nfor x in [1, 2, 3]:\n    total += x\n    print(total)',
      right: 'total = 0\nfor x in [1, 2, 3]:\n    total += x\nprint(total)',
      why: {
        az: "Girintili `print` dövrün içindədir və hər addımda işləyir (1, 3, 6). Yalnız yekun nəticə lazımdırsa onu dövrdən sonra, girintisiz yazın.",
        en: "An indented `print` is inside the loop and runs on every step (1, 3, 6). If you only need the final result, put it after the loop without indentation.",
      },
    },
  ],
  exercise: {
    objective: { az: "`for` dövrü ilə ədədləri cəmləmək.", en: "Sum numbers with a `for` loop." },
    task: {
      az: "1-dən 10-a qədər (10 daxil) bütün ədədlərin cəmini `for` dövrü ilə hesablayıb çap edin. Nəticə 55 olmalıdır.",
      en: "Use a `for` loop to compute and print the sum of all numbers from 1 to 10 inclusive. The result should be 55.",
    },
    hints: [
      { az: "Dövrdən əvvəl `total = 0` yaradın.", en: "Create `total = 0` before the loop." },
      { az: "10-u daxil etmək üçün `range(1, 11)` istifadə edin.", en: "Use `range(1, 11)` so that 10 is included." },
    ],
    solution: 'total = 0\nfor n in range(1, 11):\n    total += n\nprint(total)',
    lang: "python",
  },
  quiz: [
    {
      kind: "predict",
      prompt: { az: "Bu kod nə çap edir?", en: "What does this code print?" },
      code: 'for i in range(3):\n    print(i)',
      lang: "python",
      options: ["1 2 3", "0 1 2", "0 1 2 3"],
      answer: 1,
      explain: { az: "Tək arqumentli `range(3)` 0-dan başlayır və 3-ü daxil etmir: 0, 1, 2 (hər biri ayrı sətirdə).", en: "`range(3)` with one argument starts at 0 and excludes 3: 0, 1, 2 (each on its own line)." },
    },
    {
      kind: "choice",
      prompt: { az: "`break` nə edir?", en: "What does `break` do?" },
      options: [
        { az: "Cari addımı ötürüb növbəti addıma keçir", en: "Skips the current step and moves to the next one" },
        { az: "Dövrü tamamilə dayandırır", en: "Stops the loop completely" },
        { az: "Proqramı bağlayır", en: "Closes the program" },
      ],
      answer: 1,
      explain: { az: "`break` dövrdən dərhal çıxır. Cari addımı ötürüb davam etmək üçün `continue` istifadə olunur.", en: "`break` exits the loop immediately. To skip just the current step and continue, use `continue`." },
    },
    {
      kind: "predict",
      prompt: { az: "Nəticə nə olacaq?", en: "What will be printed?" },
      code: 'n = 1\nwhile n < 10:\n    n = n * 2\nprint(n)',
      lang: "python",
      options: ["8", "10", "16"],
      answer: 2,
      explain: { az: "n: 1 → 2 → 4 → 8 → 16. 8 < 10 doğru olduğu üçün daha bir dəfə ikiqat olur, sonra 16 < 10 yalandır və dövr bitir.", en: "n: 1 → 2 → 4 → 8 → 16. Since 8 < 10 is true it doubles once more; then 16 < 10 is false and the loop ends." },
    },
  ],
  terms: [
    { en: "loop", local: { az: "dövr", tr: "döngü", ru: "цикл" } },
    { en: "iteration", local: { az: "iterasiya (addım)", tr: "yineleme", ru: "итерация" } },
    { en: "infinite loop", local: { az: "sonsuz dövr", tr: "sonsuz döngü", ru: "бесконечный цикл" } },
    { en: "sequence", local: { az: "ardıcıllıq", tr: "dizi", ru: "последовательность" } },
  ],
  related: ["python-lists", "python-conditions", "javascript-arrays"],
  sources: [
    { title: "The Python Tutorial — for Statements", url: "https://docs.python.org/3/tutorial/controlflow.html#for-statements" },
    { title: "The Python Tutorial — The range() Function", url: "https://docs.python.org/3/tutorial/controlflow.html#the-range-function" },
    { title: "The Python Tutorial — break and continue Statements", url: "https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements" },
  ],
  reviewedAt: "2026-11-22",
  verification: "authored",
};

export default lesson;
