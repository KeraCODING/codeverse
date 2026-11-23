import type { Lesson } from "../types";

const lesson: Lesson = {
  id: "python-conditions",
  language: "python",
  order: 2,
  level: "beginner",
  title: { az: "Şərtlər: if, elif, else", en: "Conditions: if, elif, else" },
  intro: {
    what: {
      az: "Şərt operatoru (`if`) proqrama qərar verməyə imkan verir: şərt doğrudursa (`True`) bir kod bloku, deyilsə başqası işləyir.",
      en: "A conditional statement (`if`) lets a program make decisions: if a condition is true (`True`) one block runs, otherwise another.",
    },
    why: {
      az: "Real proqramlar müxtəlif vəziyyətlərə fərqli reaksiya verməlidir: parol düzdürmü, balans kifayətdirmi, istifadəçi neçə yaşındadır.",
      en: "Real programs must react differently to different situations: is the password correct, is the balance enough, how old is the user.",
    },
    where: {
      az: "Giriş yoxlamalarında, formaların validasiyasında, oyun məntiqində, endirim hesablamalarında.",
      en: "Login checks, form validation, game logic, discount calculations.",
    },
  },
  syntax: {
    code: 'if temperature > 30:\n    print("Hot")\nelif temperature > 15:\n    print("Warm")\nelse:\n    print("Cold")',
    lang: "python",
    parts: [
      { token: "if", role: { az: "Açar söz (keyword): \"əgər\". Ardınca yoxlanılan şərt gəlir.", en: "Keyword meaning \"if\". The condition to test follows it." } },
      { token: "temperature > 30", role: { az: "Şərt: `True` və ya `False` nəticə verən ifadə. `>` müqayisə operatorudur.", en: "The condition: an expression that gives `True` or `False`. `>` is a comparison operator." } },
      { token: ":", role: { az: "İki nöqtə blokun başladığını bildirir. Unudulsa `SyntaxError` alınır.", en: "The colon marks the start of a block. Forgetting it causes a `SyntaxError`." } },
      { token: "····", role: { az: "Girinti (indentation). Python-da blok fiqurlu mötərizə ilə yox, girinti ilə müəyyən olunur. Standart: 4 boşluq.", en: "Indentation. Python defines blocks by indentation, not braces. The convention is 4 spaces." } },
      { token: "elif", role: { az: "\"else if\" qısaltması: əvvəlki şərtlər yalan olduqda yeni şərt yoxlanılır. İstənilən sayda ola bilər.", en: "Short for \"else if\": tests a new condition when the previous ones were false. You can have any number." } },
      { token: "else", role: { az: "Heç bir şərt doğru olmadıqda işləyən blok. Şərti yoxdur və istəyə bağlıdır.", en: "The block that runs when no condition was true. It has no condition and is optional." } },
    ],
  },
  examples: [
    {
      title: { az: "Sadə nümunə: yaş yoxlaması", en: "Simple example: age check" },
      lang: "python",
      code: 'age = 17\nif age >= 18:\n    print("Adult")\nelse:\n    print("Minor")',
      lines: [
        { az: "`age` dəyişəninə 17 mənimsədilir.", en: "`age` is set to 17." },
        { az: "`>=` \"böyük və ya bərabər\" deməkdir. 17 >= 18 yalandır (`False`).", en: "`>=` means \"greater than or equal\". 17 >= 18 is `False`." },
        { az: "Şərt yalan olduğu üçün bu sətir işləmir.", en: "The condition is false, so this line is skipped." },
        { az: "`else` bloku başlayır.", en: "The `else` block starts." },
        { az: "Bu sətir işləyir və `Minor` çıxır.", en: "This line runs and prints `Minor`." },
      ],
      output: "Minor",
    },
    {
      title: { az: "Orta nümunə: qiymət şkalası", en: "Intermediate example: grade scale" },
      lang: "python",
      code: 'score = 76\nif score >= 90:\n    grade = "A"\nelif score >= 75:\n    grade = "B"\nelif score >= 60:\n    grade = "C"\nelse:\n    grade = "F"\nprint(grade)',
      lines: [
        { az: "Balı saxlayırıq.", en: "Store the score." },
        { az: "76 >= 90 yalandır, növbəti şərtə keçilir.", en: "76 >= 90 is false; move to the next condition." },
        { az: "İşləmir.", en: "Skipped." },
        { az: "76 >= 75 doğrudur — bu blok seçilir.", en: "76 >= 75 is true — this block is chosen." },
        { az: "`grade` \"B\" olur.", en: "`grade` becomes \"B\"." },
        { az: "Doğru şərt artıq tapıldığı üçün qalan `elif`/`else` yoxlanılmır.", en: "A true condition was already found, so the remaining `elif`/`else` are not checked." },
        { az: "İşləmir.", en: "Skipped." },
        { az: "İşləmir.", en: "Skipped." },
        { az: "İşləmir.", en: "Skipped." },
        { az: "Girintisiz sətir — `if` blokundan kənardadır və həmişə işləyir.", en: "Not indented — outside the `if` statement, so it always runs." },
      ],
      output: "B",
    },
    {
      title: { az: "Real nümunə: pulsuz çatdırılma", en: "Real-world example: free delivery" },
      lang: "python",
      code: 'total = 45.0\nis_member = True\nif total >= 50 or is_member:\n    delivery = 0\nelse:\n    delivery = 3.5\nprint(f"Delivery: {delivery} AZN")',
      lines: [
        { az: "Səbətin cəmi.", en: "The basket total." },
        { az: "Müştəri üzvdürmü.", en: "Whether the customer is a member." },
        { az: "`or` — iki şərtdən biri doğru olsa kifayətdir. 45 >= 50 yalandır, amma `is_member` doğrudur, nəticə `True`.", en: "`or` — one true condition is enough. 45 >= 50 is false but `is_member` is true, so the result is `True`." },
        { az: "Çatdırılma pulsuzdur.", en: "Delivery is free." },
        { az: "Digər hal.", en: "Otherwise." },
        { az: "Bu sətir bu dəfə işləmir.", en: "Not executed this time." },
        { az: "Nəticəni göstərir.", en: "Shows the result." },
      ],
      output: "Delivery: 0 AZN",
    },
  ],
  mistakes: [
    {
      title: { az: "`=` ilə `==`-ni qarışdırmaq", en: "Mixing up `=` and `==`" },
      wrong: 'if age = 18:\n    print("18")',
      right: 'if age == 18:\n    print("18")',
      why: {
        az: "`=` mənimsətmədir, `==` isə bərabərlik yoxlamasıdır. Şərtdə `=` yazmaq `SyntaxError` verir.",
        en: "`=` assigns, `==` compares for equality. Writing `=` in a condition is a `SyntaxError`.",
      },
    },
    {
      title: { az: "İki nöqtəni unutmaq", en: "Forgetting the colon" },
      wrong: 'if age >= 18\n    print("Adult")',
      right: 'if age >= 18:\n    print("Adult")',
      why: {
        az: "`if`, `elif` və `else` sətirləri iki nöqtə ilə bitməlidir, əks halda `SyntaxError` alınır.",
        en: "`if`, `elif` and `else` lines must end with a colon, otherwise you get a `SyntaxError`.",
      },
    },
    {
      title: { az: "Girinti xətası", en: "Indentation error" },
      wrong: 'if age >= 18:\nprint("Adult")',
      right: 'if age >= 18:\n    print("Adult")',
      why: {
        az: "Blokun içindəki sətirlər girintili olmalıdır. Girinti yoxdursa Python `IndentationError: expected an indented block` verir.",
        en: "Lines inside a block must be indented. Without indentation Python raises `IndentationError: expected an indented block`.",
      },
    },
  ],
  exercise: {
    objective: { az: "`if`/`elif`/`else` ilə üç vəziyyəti ayırmaq.", en: "Separate three cases with `if`/`elif`/`else`." },
    task: {
      az: "`number` dəyişəni üçün yoxlayın: müsbətdirsə `Positive`, mənfidirsə `Negative`, sıfırdırsa `Zero` çap edin.",
      en: "For a variable `number`, print `Positive` if it is above zero, `Negative` if below, and `Zero` if it equals zero.",
    },
    hints: [
      { az: "Üç hal var, deməli `if`, bir `elif` və `else` lazımdır.", en: "There are three cases, so you need `if`, one `elif` and `else`." },
      { az: "Müqayisə operatorları: `>`, `<`, `==`.", en: "Comparison operators: `>`, `<`, `==`." },
    ],
    solution: 'number = -4\nif number > 0:\n    print("Positive")\nelif number < 0:\n    print("Negative")\nelse:\n    print("Zero")',
    lang: "python",
  },
  quiz: [
    {
      kind: "predict",
      prompt: { az: "Bu kod nə çıxarır?", en: "What does this code print?" },
      code: 'x = 10\nif x > 5:\n    print("A")\nelif x > 8:\n    print("B")\nelse:\n    print("C")',
      lang: "python",
      options: ["A", "B", "A B"],
      answer: 0,
      explain: { az: "İlk doğru şərt (`x > 5`) seçilir; ondan sonrakı `elif` yoxlanılmır, ona görə yalnız `A` çıxır.", en: "The first true condition (`x > 5`) wins; the following `elif` is not checked, so only `A` is printed." },
    },
    {
      kind: "choice",
      prompt: { az: "Python-da kod blokunu nə müəyyən edir?", en: "What defines a code block in Python?" },
      options: [{ az: "Fiqurlu mötərizələr `{ }`", en: "Curly braces `{ }`" }, { az: "Girinti (indentation)", en: "Indentation" }, { az: "`end` açar sözü", en: "The `end` keyword" }],
      answer: 1,
      explain: { az: "Python blokları girinti ilə ayırır; standart 4 boşluqdur.", en: "Python delimits blocks with indentation; the convention is 4 spaces." },
    },
    {
      kind: "choice",
      prompt: { az: "Bərabərliyi yoxlamaq üçün hansı operator istifadə olunur?", en: "Which operator checks equality?" },
      options: ["`=`", "`==`", "`===`"],
      answer: 1,
      explain: { az: "`==` bərabərliyi yoxlayır. `=` mənimsətmədir, `===` isə Python-da yoxdur (JavaScript-dədir).", en: "`==` checks equality. `=` assigns, and `===` does not exist in Python (it is JavaScript)." },
    },
  ],
  terms: [
    { en: "condition", local: { az: "şərt", tr: "koşul", ru: "условие" } },
    { en: "indentation", local: { az: "girinti", tr: "girinti", ru: "отступ" } },
    { en: "comparison operator", local: { az: "müqayisə operatoru", tr: "karşılaştırma operatörü", ru: "оператор сравнения" } },
    { en: "block", local: { az: "blok", tr: "blok", ru: "блок" } },
  ],
  related: ["python-variables", "python-loops", "javascript-conditions"],
  sources: [
    { title: "The Python Tutorial — More Control Flow Tools (if Statements)", url: "https://docs.python.org/3/tutorial/controlflow.html#if-statements" },
    { title: "The Python Language Reference — The if statement", url: "https://docs.python.org/3/reference/compound_stmts.html#the-if-statement" },
  ],
  reviewedAt: "2026-11-22",
  verification: "authored",
};

export default lesson;
