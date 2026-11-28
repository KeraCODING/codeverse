import type { Lesson } from "../types";

const lesson: Lesson = {
  id: "typescript-basics",
  language: "typescript",
  order: 1,
  level: "beginner",
  title: { az: "TypeScript əsasları: tiplər və interfeyslər", en: "TypeScript basics: types and interfaces" },
  simple: {
    az: "TypeScript JavaScript-ə yazılmış qeyd-etiketlərdir: \"bu qutuya yalnız ədəd qoyulur\", \"bu funksiya mətn qaytarır\". Səhv şey qoymağa çalışsanız, redaktor dərhal qırmızı xəttlə xəbərdarlıq edir, hələ proqram işə düşməmiş. İşə salanda etiketlər çıxarılır və adi JavaScript qalır.",
    en: "TypeScript is labels stuck on JavaScript: \"only numbers go in this box\", \"this function returns text\". Try to put the wrong thing in and the editor warns you with a red underline before the program even runs. When it runs, the labels are removed and plain JavaScript is left.",
  },
  intro: {
    what: {
      az: "TypeScript — JavaScript-ə tiplər əlavə edən dildir. Dəyişənin, parametrin və nəticənin hansı tipdə olduğunu yazırsınız; kompilyator (`tsc`) səhvləri kod işə düşməzdən əvvəl tapır, sonra tipləri silib adi JavaScript yaradır.",
      en: "TypeScript is JavaScript with types. You write what type a variable, parameter or result has; the compiler (`tsc`) finds mistakes before the code runs, then removes the types and produces plain JavaScript.",
    },
    why: {
      az: "Böyük layihələrdə səhvlərin çoxu səhv tipdən yaranır: mətn əvəzinə ədəd, olmayan xüsusiyyət, unudulmuş parametr. Tiplər bunları redaktorda dərhal göstərir və avtomatik tamamlamanı gücləndirir.",
      en: "In large projects many bugs come from wrong types: a number instead of text, a missing property, a forgotten parameter. Types show these in the editor right away and make auto-completion much better.",
    },
    where: {
      az: "React, Angular, Next.js və Node.js layihələrinin əksəriyyəti; VS Code-un özü də TypeScript ilə yazılıb.",
      en: "Most React, Angular, Next.js and Node.js projects; VS Code itself is written in TypeScript.",
    },
  },
  syntax: {
    code: 'let age: number = 24;\nfunction greet(name: string): string {\n  return "Hi " + name;\n}',
    lang: "typescript",
    parts: [
      { token: ": number", role: { az: "Tip annotasiyası: `age` yalnız ədəd saxlaya bilər.", en: "A type annotation: `age` may only hold a number." } },
      { token: "name: string", role: { az: "Parametrin tipi: çağırarkən mətn verilməlidir.", en: "The parameter's type: callers must pass text." } },
      { token: "): string", role: { az: "Qaytarılan dəyərin tipi.", en: "The type of the returned value." } },
    ],
  },
  examples: [
    {
      title: { az: "Sadə nümunə: əsas tiplər", en: "Simple example: basic types" },
      lang: "typescript",
      code: 'const city: string = "Baku";\nlet temperature: number = 18.5;\nconst isOpen: boolean = true;\nconst tags: string[] = ["sea", "old town"];\nconsole.log(city, temperature, isOpen, tags.length);',
      lines: [
        { az: "`string` — mətn tipi.", en: "`string` — the text type." },
        { az: "`number` — tam və kəsr ədədlər üçün bir tip.", en: "`number` — one type for both whole and decimal numbers." },
        { az: "`boolean` — `true` və ya `false`.", en: "`boolean` — `true` or `false`." },
        { az: "`string[]` — yalnız mətnlərdən ibarət massiv.", en: "`string[]` — an array that contains only text." },
        { az: "İşləyəndə tiplər silinir, kod adi JavaScript kimi işləyir.", en: "When it runs the types are gone and it works as plain JavaScript." },
      ],
      output: "Baku 18.5 true 2",
    },
    {
      title: { az: "Orta nümunə: interfeys", en: "Intermediate example: an interface" },
      lang: "typescript",
      code: 'interface Student {\n  name: string;\n  score: number;\n  email?: string;\n}\nconst s: Student = { name: "Murad", score: 88 };\nconsole.log(`${s.name}: ${s.score}`);',
      lines: [
        { az: "`interface` obyektin formasını təsvir edir: hansı xüsusiyyətlər, hansı tiplərlə.", en: "An `interface` describes an object's shape: which properties, with which types." },
        { az: "`name` mətn olmalıdır.", en: "`name` must be text." },
        { az: "`score` ədəd olmalıdır.", en: "`score` must be a number." },
        { az: "`?` — xüsusiyyət məcburi deyil.", en: "`?` — the property is optional." },
        { az: "İnterfeys bitir (işləyəndə tamamilə silinir).", en: "End of the interface (it disappears completely at run time)." },
        { az: "Obyekt `Student` formasına uyğun olmalıdır; `score`-u unutsanız `tsc` xəta verər.", en: "The object must match `Student`; forget `score` and `tsc` reports an error." },
        { az: "`Murad: 88` çıxır.", en: "Prints `Murad: 88`." },
      ],
      output: "Murad: 88",
    },
    {
      title: { az: "Real nümunə: union tip və tipli funksiya", en: "Real-world example: a union type and a typed function" },
      lang: "typescript",
      code: 'type Status = "pending" | "paid" | "shipped";\nfunction label(status: Status): string {\n  return status === "paid" ? "Paid ✓" : status.toUpperCase();\n}\nconsole.log(label("paid"));\nconsole.log(label("shipped"));',
      lines: [
        { az: "`type` yeni tip adı yaradır; `|` (union) — yalnız bu üç mətndən biri ola bilər.", en: "`type` creates a type name; `|` (a union) means only one of these three strings is allowed." },
        { az: "Parametr yalnız `Status` qəbul edir: `label(\"lost\")` yazsanız `tsc` xəta verər.", en: "The parameter accepts only a `Status`: `label(\"lost\")` would be a `tsc` error." },
        { az: "Ödənilibsə xüsusi mətn, əks halda böyük hərflərlə status qaytarılır.", en: "Returns a special label when paid, otherwise the status in capitals." },
        { az: "Funksiya bitir.", en: "End of the function." },
        { az: "`Paid ✓` çıxır.", en: "Prints `Paid ✓`." },
        { az: "`SHIPPED` çıxır.", en: "Prints `SHIPPED`." },
      ],
      output: "Paid ✓\nSHIPPED",
    },
  ],
  mistakes: [
    {
      title: { az: "Hər yerdə `any` yazmaq", en: "Writing `any` everywhere" },
      wrong: 'function total(items: any): any {\n  return items.reduce((a: any, b: any) => a + b.price, 0);\n}',
      right: 'interface Item { price: number }\nfunction total(items: Item[]): number {\n  return items.reduce((a, b) => a + b.price, 0);\n}',
      why: {
        az: "`any` tip yoxlamasını söndürür — TypeScript-in bütün faydası itir. Konkret tip və ya interfeys yazın.",
        en: "`any` switches type checking off — you lose everything TypeScript gives you. Write a concrete type or an interface.",
      },
    },
    {
      title: { az: "Tiplərin işləmə zamanı yoxlandığını düşünmək", en: "Thinking types are checked while the program runs" },
      wrong: '// The API may send "42" (text)\nconst n: number = JSON.parse(\'"42"\');\nconsole.log(n + 1); // "421"',
      right: 'const raw: unknown = JSON.parse(\'"42"\');\nconst n = Number(raw);\nconsole.log(n + 1); // 43',
      why: {
        az: "Tiplər yalnız kompilyasiya zamanı mövcuddur. Xaricdən gələn məlumat (API, forma) üçün `unknown` istifadə edib dəyəri özünüz yoxlayın və çevirin.",
        en: "Types exist only at compile time. For outside data (APIs, forms) use `unknown` and check or convert the value yourself.",
      },
    },
    {
      title: { az: "Məcburi olmayan xüsusiyyəti yoxlamadan istifadə etmək", en: "Using an optional property without checking it" },
      wrong: 'interface User { email?: string }\nconst u: User = {};\nconsole.log(u.email.length); // crash',
      right: 'interface User { email?: string }\nconst u: User = {};\nconsole.log(u.email?.length ?? 0); // 0',
      why: {
        az: "`?` olan xüsusiyyət `undefined` ola bilər. İsteğe bağlı zəncir `?.` və `??` təhlükəsiz standart dəyər verir.",
        en: "A `?` property can be `undefined`. Optional chaining `?.` and `??` give a safe default.",
      },
    },
  ],
  exercise: {
    objective: { az: "İnterfeys və tipli funksiya yazmaq.", en: "Write an interface and a typed function." },
    task: {
      az: "`Product` interfeysini (`name: string`, `price: number`) və `describe(p: Product): string` funksiyasını yazın. Funksiya `Tea — 3 AZN` formasında mətn qaytarsın. `describe({ name: \"Tea\", price: 3 })` nəticəsini çıxarın.",
      en: "Write a `Product` interface (`name: string`, `price: number`) and a `describe(p: Product): string` function that returns text like `Tea — 3 AZN`. Print `describe({ name: \"Tea\", price: 3 })`.",
    },
    hints: [
      { az: "`interface Product { name: string; price: number; }`", en: "`interface Product { name: string; price: number; }`" },
      { az: "Funksiyanın içində: `` return `${p.name} — ${p.price} AZN`; ``", en: "Inside the function: `` return `${p.name} — ${p.price} AZN`; ``" },
    ],
    solution: 'interface Product {\n  name: string;\n  price: number;\n}\n\nfunction describe(p: Product): string {\n  return `${p.name} — ${p.price} AZN`;\n}\n\nconsole.log(describe({ name: "Tea", price: 3 }));',
    lang: "typescript",
    check: { expected: "Tea — 3 AZN", starter: "interface Product {\n  \n}\n\n" },
  },
  quiz: [
    {
      kind: "choice",
      prompt: { az: "TypeScript tipləri nə vaxt yoxlanılır?", en: "When are TypeScript types checked?" },
      options: [{ az: "Proqram işləyərkən", en: "While the program runs" }, { az: "Kompilyasiya zamanı (`tsc`, redaktor)", en: "At compile time (`tsc`, the editor)" }, { az: "Heç vaxt", en: "Never" }],
      answer: 1,
      explain: { az: "Tiplər kompilyasiya zamanı yoxlanılır və silinir; işləyən kod adi JavaScript-dir.", en: "Types are checked at compile time and then removed; the running code is plain JavaScript." },
    },
    {
      kind: "choice",
      prompt: { az: "`email?: string` nə deməkdir?", en: "What does `email?: string` mean?" },
      options: [{ az: "`email` məcburidir", en: "`email` is required" }, { az: "`email` ya mətndir, ya da yoxdur (`undefined`)", en: "`email` is text or missing (`undefined`)" }, { az: "`email` boş mətn olmalıdır", en: "`email` must be an empty string" }],
      answer: 1,
      explain: { az: "`?` xüsusiyyəti isteğe bağlı edir.", en: "`?` makes the property optional." },
    },
    {
      kind: "predict",
      prompt: { az: "Tiplər silindikdən sonra bu kod nə çıxarır?", en: "After the types are removed, what does this print?" },
      code: 'type Level = "low" | "high";\nconst lv: Level = "high";\nconsole.log(lv.length);',
      lang: "typescript",
      options: ["2", "4", "high"],
      answer: 1,
      explain: { az: "`lv` adi mətndir: \"high\" sözündə 4 hərf var.", en: "`lv` is an ordinary string: \"high\" has 4 letters." },
    },
  ],
  terms: [
    { en: "type annotation", local: { az: "tip annotasiyası", tr: "tip açıklaması", ru: "аннотация типа" } },
    { en: "interface", local: { az: "interfeys", tr: "arayüz", ru: "интерфейс" } },
    { en: "union type", local: { az: "birləşmə tipi", tr: "birleşim tipi", ru: "объединённый тип" } },
    { en: "optional property", local: { az: "isteğe bağlı xüsusiyyət", tr: "isteğe bağlı özellik", ru: "необязательное свойство" } },
    { en: "compiler", local: { az: "kompilyator", tr: "derleyici", ru: "компилятор" } },
  ],
  related: ["javascript-objects", "javascript-functions", "javascript-variables"],
  sources: [
    { title: "TypeScript Handbook — Everyday Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html" },
    { title: "TypeScript Handbook — Object Types", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html" },
    { title: "TypeScript Handbook — Narrowing", url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html" },
  ],
  reviewedAt: "2026-11-28",
  verification: "authored",
};

export default lesson;
