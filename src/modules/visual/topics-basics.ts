// Core programming concepts: memory, functions, recursion, loops, arrays, references, objects.
import { C, P, TT, panel, step } from "./helpers";
import type { VItem, VTopic } from "./types";

const stackP = (items: VItem[]) => panel("stack", TT.stack, items, "stack");
const heapP = (items: VItem[]) => panel("heap", TT.heap, items);
const callP = (items: VItem[]) => panel("calls", TT.callStack, items, "stack");
const varsP = (items: VItem[]) => panel("vars", TT.vars, items);

// ───────────────────────── Variables & memory ─────────────────────────
const memory: VTopic = {
  id: "memory",
  title: P("Dəyişənlər və yaddaş", "Variables & memory", "Değişkenler ve bellek", "Переменные и память"),
  summary: C("Stek və heap: dəyərlər harada saxlanılır və istinad nədir.", "Stack and heap: where values live and what a reference is."),
  intro: C(
    "Proqram işləyərkən dəyişənlərin dəyərləri yaddaşda saxlanılır. Sadələşdirilmiş modeldə iki sahə var: stek — funksiyaların yerli dəyişənləri və kiçik dəyərlər üçün, heap — obyektlər və massivlər üçün. Real JavaScript mühərrikləri daha mürəkkəb optimallaşdırmalar aparır, amma bu model davranışı düzgün izah edir.",
    "While a program runs, variable values are kept in memory. In a simplified model there are two areas: the stack, for the local variables of functions and small values, and the heap, for objects and arrays. Real JavaScript engines optimise in more complex ways, but this model explains the behaviour correctly.",
  ),
  code: {
    lang: "javascript",
    src: `let age = 25;
let copy = age;
copy = 30;
let user = { name: "Aysel", age: 25 };
let scores = [90, 75];`,
  },
  steps: [
    step(
      1,
      C(
        "`age` dəyişəni yaradılır. 25 kimi primitiv dəyər birbaşa dəyişənin öz yerində (stekdə) saxlanılır.",
        "The variable `age` is created. A primitive value like 25 is stored directly in the variable's own slot (on the stack).",
      ),
      [stackP([{ label: "age", value: "25", tone: "accent" }]), heapP([])],
    ),
    step(
      2,
      C(
        "`copy = age` dəyərin surətini çıxarır: indi iki ayrı yer var və hər birində 25 yazılıb.",
        "`copy = age` copies the value: there are now two separate slots, each holding 25.",
      ),
      [stackP([{ label: "age", value: "25" }, { label: "copy", value: "25", tone: "accent" }]), heapP([])],
    ),
    step(
      3,
      C(
        "`copy` dəyişdirilir, amma `age` əvvəlki kimi 25 olaraq qalır, çünki primitivlər dəyərinə görə kopyalanır.",
        "`copy` changes, but `age` is still 25, because primitives are copied by value.",
      ),
      [stackP([{ label: "age", value: "25" }, { label: "copy", value: "30", tone: "accent" }]), heapP([])],
    ),
    step(
      4,
      C(
        "Obyekt heap-də yaradılır. `user` dəyişəni obyektin özünü deyil, ona istinadı (ünvanını, burada `#1`) saxlayır.",
        "The object is created on the heap. The variable `user` holds not the object itself but a reference to it (its address, here `#1`).",
      ),
      [
        stackP([{ label: "age", value: "25" }, { label: "copy", value: "30" }, { id: "user", label: "user", value: "→ #1", tone: "accent" }]),
        heapP([{ id: "h1", label: "#1", value: '{ name: "Aysel", age: 25 }', tone: "success" }]),
      ],
      { arrows: [{ from: "user", to: "h1" }] },
    ),
    step(
      5,
      C(
        "Massivlər də obyektdir, ona görə `[90, 75]` heap-də yerləşir, `scores` isə ona istinad edir.",
        "Arrays are objects too, so `[90, 75]` lives on the heap and `scores` refers to it.",
      ),
      [
        stackP([
          { label: "age", value: "25" },
          { label: "copy", value: "30" },
          { id: "user", label: "user", value: "→ #1" },
          { id: "scores", label: "scores", value: "→ #2", tone: "accent" },
        ]),
        heapP([
          { id: "h1", label: "#1", value: '{ name: "Aysel", age: 25 }' },
          { id: "h2", label: "#2", value: "[90, 75]", tone: "success" },
        ]),
      ],
      { arrows: [{ from: "user", to: "h1" }, { from: "scores", to: "h2" }] },
    ),
    step(
      null,
      C(
        "Xülasə: stekdə kiçik dəyərlər və istinadlar, heap-də isə obyektlər saxlanılır. Heç bir istinadı qalmayan obyekti zibil yığıcı (garbage collector) avtomatik silir.",
        "Summary: the stack holds small values and references, the heap holds objects. An object that nothing references any more is removed automatically by the garbage collector.",
      ),
      [
        stackP([
          { label: "age", value: "25" },
          { label: "copy", value: "30" },
          { id: "user", label: "user", value: "→ #1" },
          { id: "scores", label: "scores", value: "→ #2" },
        ]),
        heapP([
          { id: "h1", label: "#1", value: '{ name: "Aysel", age: 25 }' },
          { id: "h2", label: "#2", value: "[90, 75]" },
        ]),
      ],
      { arrows: [{ from: "user", to: "h1" }, { from: "scores", to: "h2" }] },
    ),
  ],
};

// ───────────────────────── Call stack ─────────────────────────
const globalFrame = (value = "result = ?"): VItem => ({ label: "global", value });
const callstack: VTopic = {
  id: "callstack",
  title: P("Çağırış steki və funksiyalar", "Call stack & functions", "Çağrı yığını ve fonksiyonlar", "Стек вызовов и функции"),
  summary: C("Funksiya çağırılanda nə baş verir və hara qayıdır.", "What happens when a function is called and where it returns to."),
  intro: C(
    "Hər funksiya çağırışı çağırış stekinə öz çərçivəsini (frame) əlavə edir: orada parametrlər və yerli dəyişənlər saxlanılır. Funksiya `return` etdikdə onun çərçivəsi stekdən çıxarılır və icra onu çağıran yerdən davam edir.",
    "Every function call pushes its own frame onto the call stack, holding its parameters and local variables. When the function returns, its frame is popped and execution continues where it was called from.",
  ),
  code: {
    lang: "javascript",
    src: `function square(n) {
  return n * n;
}
function sumOfSquares(a, b) {
  return square(a) + square(b);
}
const result = sumOfSquares(2, 3);
console.log(result);`,
  },
  steps: [
    step(
      7,
      C(
        "`sumOfSquares(2, 3)` çağırılır. Stekin üstünə yeni çərçivə əlavə olunur: orada `a = 2` və `b = 3` parametrləri saxlanılır.",
        "`sumOfSquares(2, 3)` is called. A new frame is pushed onto the stack; it holds the parameters `a = 2` and `b = 3`.",
      ),
      [callP([globalFrame(), { label: "sumOfSquares", value: "a = 2, b = 3", tone: "accent" }])],
    ),
    step(
      5,
      C(
        "`square(a)` çağırılır, ona görə `sumOfSquares` gözləyir və üstə `square` çərçivəsi (`n = 2`) qoyulur. İcra həmişə ən üstdəki çərçivədə gedir.",
        "`square(a)` is called, so `sumOfSquares` waits and a `square` frame (`n = 2`) is pushed on top. Execution always happens in the topmost frame.",
      ),
      [callP([globalFrame(), { label: "sumOfSquares", value: "a = 2, b = 3" }, { label: "square", value: "n = 2", tone: "accent" }])],
    ),
    step(
      2,
      C("`square` `2 * 2 = 4` hesablayır və `return` ilə nəticəni çağırana qaytarır.", "`square` computes `2 * 2 = 4` and hands the result back to its caller with `return`."),
      [callP([globalFrame(), { label: "sumOfSquares", value: "a = 2, b = 3" }, { label: "square", value: "n = 2 → return 4", tone: "success" }])],
    ),
    step(
      5,
      C(
        "Qayıdan funksiyanın çərçivəsi stekdən çıxarılır. `sumOfSquares` 4-ü yadda saxlayır və eyni qayda ilə `square(b)` üçün yeni çərçivə açır.",
        "The returning function's frame is popped off the stack. `sumOfSquares` keeps the 4 and, the same way, opens a new frame for `square(b)`.",
      ),
      [callP([globalFrame(), { label: "sumOfSquares", value: "4 + square(3)" }, { label: "square", value: "n = 3", tone: "accent" }])],
    ),
    step(2, C("`square(3)` `3 * 3 = 9` qaytarır.", "`square(3)` returns `3 * 3 = 9`."), [
      callP([globalFrame(), { label: "sumOfSquares", value: "4 + square(3)" }, { label: "square", value: "n = 3 → return 9", tone: "success" }]),
    ]),
    step(
      5,
      C("`sumOfSquares` `4 + 9 = 13` cəmini qaytarır və onun çərçivəsi də stekdən çıxarılır.", "`sumOfSquares` returns the sum `4 + 9 = 13`, and its frame is popped as well."),
      [callP([globalFrame(), { label: "sumOfSquares", value: "4 + 9 → return 13", tone: "success" }])],
    ),
    step(
      7,
      C("Qlobal kodda `result` dəyişəninə 13 yazılır. Stekdə yenə yalnız qlobal çərçivə qalıb.", "Back in the global code, `result` receives 13. Only the global frame is left on the stack."),
      [callP([{ label: "global", value: "result = 13", tone: "accent" }])],
    ),
    step(8, C("`console.log(result)` konsola 13 çıxarır.", "`console.log(result)` prints 13 to the console."), [callP([globalFrame("result = 13")])], {
      output: ["13"],
    }),
  ],
};

// ───────────────────────── Recursion ─────────────────────────
const fr = (n: number, value: string, tone?: VItem["tone"]): VItem => ({ label: `factorial(${n})`, value, tone });
const recursion: VTopic = {
  id: "recursion",
  title: P("Rekursiya", "Recursion", "Özyineleme", "Рекурсия"),
  summary: C("Faktorialın addım-addım hesablanması: stek böyüyür və geri açılır.", "Factorial step by step: the stack grows, then unwinds."),
  intro: C(
    "Rekursiv funksiya məsələni özünün daha kiçik nüsxəsinə bölür və özünü çağırır. Hər rekursiv funksiyanın baza halı olmalıdır — özünü daha çağırmadan cavab qaytardığı hal. Hər çağırış stekdə ayrıca çərçivə yaradır.",
    "A recursive function splits a problem into a smaller copy of itself and calls itself. Every recursive function needs a base case, where it returns an answer without calling itself again. Each call creates its own frame on the stack.",
  ),
  code: {
    lang: "javascript",
    src: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
console.log(factorial(4));`,
  },
  steps: [
    step(5, C("`factorial(4)` çağırılır və stekdə `n = 4` olan çərçivə yaranır.", "`factorial(4)` is called and a frame with `n = 4` appears on the stack."), [
      callP([{ label: "global" }, fr(4, "n = 4", "accent")]),
    ]),
    step(
      3,
      C(
        "4 > 1 olduğundan baza halı işləmir. Funksiya `4 * factorial(3)` hesablamalıdır, ona görə özünü kiçik arqumentlə yenidən çağırır.",
        "Since 4 > 1, the base case does not apply. The function must compute `4 * factorial(3)`, so it calls itself with a smaller argument.",
      ),
      [callP([{ label: "global" }, fr(4, "4 * factorial(3)"), fr(3, "n = 3", "accent")])],
    ),
    step(
      3,
      C(
        "Eyni şey `n = 3` üçün təkrarlanır: `3 * factorial(2)` gözləmədədir. Hər çağırışın öz `n` dəyişəni var.",
        "The same happens for `n = 3`: `3 * factorial(2)` is waiting. Each call has its own `n` variable.",
      ),
      [callP([{ label: "global" }, fr(4, "4 * factorial(3)"), fr(3, "3 * factorial(2)"), fr(2, "n = 2", "accent")])],
    ),
    step(
      3,
      C(
        "`n = 2` üçün `2 * factorial(1)` çağırılır. Stekdə artıq dörd `factorial` çərçivəsi var.",
        "For `n = 2`, `2 * factorial(1)` is called. There are now four `factorial` frames on the stack.",
      ),
      [callP([{ label: "global" }, fr(4, "4 * factorial(3)"), fr(3, "3 * factorial(2)"), fr(2, "2 * factorial(1)"), fr(1, "n = 1", "accent")])],
    ),
    step(
      2,
      C(
        "Baza halı: `n <= 1` doğrudur, funksiya özünü daha çağırmadan 1 qaytarır. Baza halı olmasaydı, çağırışlar heç vaxt dayanmaz və stek daşardı (stack overflow).",
        "Base case: `n <= 1` is true, so the function returns 1 without calling itself again. Without a base case the calls would never stop and the stack would overflow.",
      ),
      [callP([{ label: "global" }, fr(4, "4 * factorial(3)"), fr(3, "3 * factorial(2)"), fr(2, "2 * factorial(1)"), fr(1, "return 1", "success")])],
    ),
    step(
      3,
      C(
        "Stek geriyə açılır: `factorial(2)` gözlədiyi 1-i alır və `2 * 1 = 2` qaytarır.",
        "The stack unwinds: `factorial(2)` receives the 1 it was waiting for and returns `2 * 1 = 2`.",
      ),
      [callP([{ label: "global" }, fr(4, "4 * factorial(3)"), fr(3, "3 * factorial(2)"), fr(2, "2 * 1 → return 2", "success")])],
    ),
    step(3, C("`factorial(3)` `3 * 2 = 6` qaytarır.", "`factorial(3)` returns `3 * 2 = 6`."), [
      callP([{ label: "global" }, fr(4, "4 * factorial(3)"), fr(3, "3 * 2 → return 6", "success")]),
    ]),
    step(3, C("`factorial(4)` `4 * 6 = 24` qaytarır — bu, ilk çağırışın nəticəsidir.", "`factorial(4)` returns `4 * 6 = 24`, the result of the first call."), [
      callP([{ label: "global" }, fr(4, "4 * 6 → return 24", "success")]),
    ]),
    step(5, C("Bütün `factorial` çərçivələri stekdən çıxıb. `console.log` 24 çap edir.", "All `factorial` frames have been popped. `console.log` prints 24."), [callP([{ label: "global" }])], {
      output: ["24"],
    }),
  ],
};

// ───────────────────────── Loops ─────────────────────────
const condP = (expr: string, ok: boolean | null) =>
  panel("cond", TT.condition, ok === null ? [] : [{ label: expr, value: ok ? "true" : "false", tone: ok ? "success" : "error" }]);
const loops: VTopic = {
  id: "loops",
  title: P("Dövrlər", "Loops", "Döngüler", "Циклы"),
  summary: C("`for` dövrü: başlanğıc, şərt, gövdə və addım.", "The `for` loop: start, condition, body and update."),
  intro: C(
    "Dövr eyni kodu bir neçə dəfə təkrarlayır. `for` dövrünün üç hissəsi var: başlanğıc (bir dəfə icra olunur), şərt (hər təkrardan əvvəl yoxlanılır) və addım (hər təkrardan sonra icra olunur). Şərt yanlış olduqda dövr bitir.",
    "A loop repeats the same code several times. A `for` loop has three parts: the initialiser (runs once), the condition (checked before every pass) and the update (runs after every pass). When the condition is false, the loop ends.",
  ),
  code: {
    lang: "javascript",
    src: `let total = 0;
for (let i = 0; i < 3; i++) {
  total = total + i;
}
console.log(total);`,
  },
  steps: [
    step(1, C("`total` 0 ilə başlayır. Cəmi burada toplayacağıq.", "`total` starts at 0; we will accumulate the sum here."), [
      varsP([{ label: "total", value: "0", tone: "accent" }]),
      condP("", null),
    ]),
    step(
      2,
      C(
        "Dövr başlayır: `let i = 0` yalnız bir dəfə icra olunur. Sonra şərt yoxlanılır: `0 < 3` doğrudur, ona görə dövrün gövdəsi icra edilir.",
        "The loop starts: `let i = 0` runs only once. Then the condition is checked: `0 < 3` is true, so the loop body runs.",
      ),
      [varsP([{ label: "total", value: "0" }, { label: "i", value: "0", tone: "accent" }]), condP("0 < 3", true)],
    ),
    step(3, C("`total = 0 + 0`, yəni `total` hələ də 0-dır.", "`total = 0 + 0`, so `total` is still 0."), [
      varsP([{ label: "total", value: "0", tone: "accent" }, { label: "i", value: "0" }]),
      condP("0 < 3", true),
    ]),
    step(
      2,
      C(
        "Gövdə bitdikdən sonra `i++` icra olunur (`i` 1 olur), sonra şərt yenidən yoxlanılır: `1 < 3` doğrudur.",
        "After the body, `i++` runs (`i` becomes 1), then the condition is checked again: `1 < 3` is true.",
      ),
      [varsP([{ label: "total", value: "0" }, { label: "i", value: "1", tone: "accent" }]), condP("1 < 3", true)],
    ),
    step(3, C("`total = 0 + 1 = 1`.", "`total = 0 + 1 = 1`."), [varsP([{ label: "total", value: "1", tone: "accent" }, { label: "i", value: "1" }]), condP("1 < 3", true)]),
    step(2, C("`i` 2 olur; `2 < 3` doğrudur, dövr davam edir.", "`i` becomes 2; `2 < 3` is true, so the loop continues."), [
      varsP([{ label: "total", value: "1" }, { label: "i", value: "2", tone: "accent" }]),
      condP("2 < 3", true),
    ]),
    step(3, C("`total = 1 + 2 = 3`.", "`total = 1 + 2 = 3`."), [varsP([{ label: "total", value: "3", tone: "accent" }, { label: "i", value: "2" }]), condP("2 < 3", true)]),
    step(
      2,
      C(
        "`i` 3 olur və `3 < 3` yanlışdır. Dövr dayanır və icra ondan sonrakı sətrə keçir. Gövdə cəmi üç dəfə (i = 0, 1, 2) icra olundu.",
        "`i` becomes 3 and `3 < 3` is false. The loop stops and execution moves to the line after it. The body ran three times in total (i = 0, 1, 2).",
      ),
      [varsP([{ label: "total", value: "3" }, { label: "i", value: "3", tone: "accent" }]), condP("3 < 3", false)],
    ),
    step(
      5,
      C(
        "`let` ilə elan olunan `i` yalnız dövrün daxilində mövcuddur, ona görə artıq yoxdur. `console.log` 3 çap edir.",
        "`i`, declared with `let`, exists only inside the loop, so it is gone now. `console.log` prints 3.",
      ),
      [varsP([{ label: "total", value: "3" }]), condP("", null)],
      { output: ["3"] },
    ),
  ],
};

// ───────────────────────── Arrays ─────────────────────────
const ARR_T = P("Massiv: fruits", "Array: fruits", "Dizi: fruits", "Массив: fruits");
const cells = (values: string[], tones: Record<number, VItem["tone"]> = {}): VItem[] =>
  values.map((v, i) => ({ label: `[${i}]`, value: v, tone: tones[i] }));
const arrays: VTopic = {
  id: "arrays",
  title: P("Massivlər və indekslər", "Arrays & indexes", "Diziler ve indeksler", "Массивы и индексы"),
  summary: C("Elementlərə 0-dan başlayan indekslə müraciət.", "Reaching elements by an index that starts at 0."),
  intro: C(
    "Massiv dəyərləri ardıcıl saxlayan siyahıdır. Hər elementin indeksi — sıra nömrəsi var və nömrələmə 0-dan başlayır. Ona görə `n` elementli massivin son indeksi `n - 1`-dir.",
    "An array is a list that stores values in order. Each element has an index, its position number, and numbering starts at 0. So the last index of an array with `n` elements is `n - 1`.",
  ),
  code: {
    lang: "javascript",
    src: `const fruits = ["apple", "pear", "plum"];
console.log(fruits[0]);
fruits[1] = "kiwi";
fruits.push("fig");
console.log(fruits.length);
console.log(fruits[4]);`,
  },
  steps: [
    step(
      1,
      C(
        "Üç elementli massiv yaradılır. Elementlər ardıcıl yerləşir və hər birinin 0-dan başlayan nömrəsi — indeksi var.",
        "An array with three elements is created. The elements are stored in order, and each has a number starting from 0: its index.",
      ),
      [panel("arr", ARR_T, cells(['"apple"', '"pear"', '"plum"'], { 0: "success", 1: "success", 2: "success" }), "row")],
    ),
    step(
      2,
      C(
        "`fruits[0]` birinci elementi oxuyur. İndeks 1-dən yox, 0-dan başlayır, ona görə birinci element `[0]`-dadır.",
        "`fruits[0]` reads the first element. Indexes start at 0, not 1, so the first element is at `[0]`.",
      ),
      [panel("arr", ARR_T, cells(['"apple"', '"pear"', '"plum"'], { 0: "accent" }), "row")],
      { output: ["apple"] },
    ),
    step(
      3,
      C(
        "`fruits[1] = \"kiwi\"` indeksi 1 olan elementi əvəz edir. İndeksə görə müraciət sürətlidir: massivin uzunluğundan asılı olmayaraq eyni vaxt aparır.",
        "`fruits[1] = \"kiwi\"` replaces the element at index 1. Access by index is fast: it takes the same time no matter how long the array is.",
      ),
      [panel("arr", ARR_T, cells(['"apple"', '"kiwi"', '"plum"'], { 1: "accent" }), "row")],
      { output: ["apple"] },
    ),
    step(4, C("`push` elementi sona, yəni indeksi 3 olan yerə əlavə edir.", "`push` adds an element at the end, at index 3."), [
      panel("arr", ARR_T, cells(['"apple"', '"kiwi"', '"plum"', '"fig"'], { 3: "success" }), "row"),
    ], { output: ["apple"] }),
    step(
      5,
      C(
        "`length` 4-dür. Son elementin indeksi həmişə `length - 1`, yəni 3-dür.",
        "`length` is 4. The last element's index is always `length - 1`, which is 3.",
      ),
      [panel("arr", ARR_T, cells(['"apple"', '"kiwi"', '"plum"', '"fig"'], { 3: "accent" }), "row")],
      { output: ["apple", "4"] },
    ),
    step(
      6,
      C(
        "İndeksi 4 olan element yoxdur. JavaScript xəta vermir, `undefined` qaytarır. Bir çox başqa dillərdə (məsələn, Python və Java-da) bu, xətaya səbəb olur.",
        "There is no element at index 4. JavaScript does not throw; it returns `undefined`. In many other languages (Python or Java, for example) this raises an error.",
      ),
      [panel("arr", ARR_T, [...cells(['"apple"', '"kiwi"', '"plum"', '"fig"']), { label: "[4]", value: "—", tone: "error" }], "row")],
      { output: ["apple", "4", "undefined"] },
    ),
  ],
};

// ───────────────────────── References ─────────────────────────
const NAMES_T = P("Adlar (dəyişənlər)", "Names (variables)", "Adlar (değişkenler)", "Имена (переменные)");
const references: VTopic = {
  id: "references",
  title: P("İstinadlar (göstəricilər)", "Pointers & references", "İşaretçiler ve referanslar", "Указатели и ссылки"),
  summary: C("İki ad, bir obyekt: dəyişiklik hər iki addan görünür.", "Two names, one object: a change is visible through both."),
  intro: C(
    "Obyekt dəyişənə yazılanda dəyişən obyektin surətini yox, ona istinadı saxlayır. C və C++ dillərində bunun açıq forması göstəricidir (pointer) — yaddaş ünvanını saxlayan dəyişən. İstinadı başqa dəyişənə köçürmək eyni obyektə ikinci ad verir.",
    "When an object is assigned to a variable, the variable holds a reference to it, not a copy. In C and C++ the explicit form of this is a pointer: a variable that holds a memory address. Copying a reference to another variable gives the same object a second name.",
  ),
  code: {
    lang: "javascript",
    src: `const a = { count: 1 };
const b = a;
b.count = 2;
console.log(a.count);
const c = { count: 2 };
console.log(a === b, a === c);`,
  },
  steps: [
    step(
      1,
      C(
        "Obyekt heap-də yaradılır, `a` isə ona istinad saxlayır. İstinadı obyektin ünvanını göstərən göstərici kimi təsəvvür etmək olar.",
        "The object is created on the heap, and `a` holds a reference to it. Think of a reference as a pointer showing the object's address.",
      ),
      [panel("names", NAMES_T, [{ id: "a", label: "a", value: "→ #1", tone: "accent" }]), heapP([{ id: "o1", label: "#1", value: "{ count: 1 }", tone: "success" }])],
      { arrows: [{ from: "a", to: "o1" }] },
    ),
    step(
      2,
      C(
        "`const b = a` yeni obyekt yaratmır, yalnız istinadı kopyalayır. İndi iki ad eyni obyektə baxır — bu vəziyyət ingiliscə aliasing adlanır.",
        "`const b = a` does not create a new object; it only copies the reference. Two names now point to the same object; this is called aliasing.",
      ),
      [
        panel("names", NAMES_T, [{ id: "a", label: "a", value: "→ #1" }, { id: "b", label: "b", value: "→ #1", tone: "accent" }]),
        heapP([{ id: "o1", label: "#1", value: "{ count: 1 }" }]),
      ],
      { arrows: [{ from: "a", to: "o1" }, { from: "b", to: "o1" }] },
    ),
    step(
      3,
      C(
        "`b.count = 2` obyektin özünü dəyişir. `b` ayrıca surət olmadığı üçün dəyişiklik `a` vasitəsilə də görünür.",
        "`b.count = 2` changes the object itself. Because `b` is not a separate copy, the change is visible through `a` as well.",
      ),
      [
        panel("names", NAMES_T, [{ id: "a", label: "a", value: "→ #1" }, { id: "b", label: "b", value: "→ #1" }]),
        heapP([{ id: "o1", label: "#1", value: "{ count: 2 }", tone: "accent" }]),
      ],
      { arrows: [{ from: "a", to: "o1" }, { from: "b", to: "o1" }] },
    ),
    step(
      4,
      C("`a.count` 2 çap edir, baxmayaraq ki, `a`-ya birbaşa toxunmamışdıq.", "`a.count` prints 2, even though we never touched `a` directly."),
      [
        panel("names", NAMES_T, [{ id: "a", label: "a", value: "→ #1", tone: "accent" }, { id: "b", label: "b", value: "→ #1" }]),
        heapP([{ id: "o1", label: "#1", value: "{ count: 2 }" }]),
      ],
      { arrows: [{ from: "a", to: "o1" }, { from: "b", to: "o1" }], output: ["2"] },
    ),
    step(
      5,
      C("`c` üçün eyni məzmunlu, amma tamamilə yeni obyekt (`#2`) yaradılır.", "For `c`, a completely new object (`#2`) with the same contents is created."),
      [
        panel("names", NAMES_T, [{ id: "a", label: "a", value: "→ #1" }, { id: "b", label: "b", value: "→ #1" }, { id: "c", label: "c", value: "→ #2", tone: "accent" }]),
        heapP([{ id: "o1", label: "#1", value: "{ count: 2 }" }, { id: "o2", label: "#2", value: "{ count: 2 }", tone: "success" }]),
      ],
      { arrows: [{ from: "a", to: "o1" }, { from: "b", to: "o1" }, { from: "c", to: "o2" }], output: ["2"] },
    ),
    step(
      6,
      C(
        "Obyektlər üçün `===` məzmunu yox, istinadları müqayisə edir: `a === b` doğrudur (eyni obyekt), `a === c` isə yanlışdır (fərqli obyektlər).",
        "For objects, `===` compares references, not contents: `a === b` is true (same object), while `a === c` is false (different objects).",
      ),
      [
        panel("names", NAMES_T, [{ id: "a", label: "a", value: "→ #1" }, { id: "b", label: "b", value: "→ #1" }, { id: "c", label: "c", value: "→ #2" }]),
        heapP([{ id: "o1", label: "#1", value: "{ count: 2 }" }, { id: "o2", label: "#2", value: "{ count: 2 }" }]),
      ],
      { arrows: [{ from: "a", to: "o1" }, { from: "b", to: "o1" }, { from: "c", to: "o2" }], output: ["2", "true false"] },
    ),
  ],
};

// ───────────────────────── Objects ─────────────────────────
const OBJ_T = P("Obyekt #1", "Object #1", "Nesne #1", "Объект #1");
const objStep = (props: VItem[]) => [
  panel("names", NAMES_T, [{ id: "book", label: "book", value: "→ #1" }]),
  panel("obj", OBJ_T, props),
];
const objects: VTopic = {
  id: "objects",
  title: P("Obyektlər", "Objects", "Nesneler", "Объекты"),
  summary: C("Açar–dəyər cütləri: oxumaq, əlavə etmək, dəyişmək, silmək.", "Key–value pairs: read, add, change, delete."),
  intro: C(
    "Obyekt bir-biri ilə bağlı məlumatları adlandırılmış xassələrdə (açar–dəyər cütlərində) birləşdirir. Xassəyə nöqtə (`book.title`) və ya kvadrat mötərizə (`book[\"title\"]`) ilə müraciət olunur.",
    "An object groups related data into named properties (key–value pairs). A property is accessed with a dot (`book.title`) or with square brackets (`book[\"title\"]`).",
  ),
  code: {
    lang: "javascript",
    src: `const book = { title: "Dune", pages: 412 };
console.log(book.title);
book.year = 1965;
book["pages"] = 420;
delete book.year;
console.log("year" in book);`,
  },
  steps: [
    step(
      1,
      C(
        "Obyekt açar–dəyər cütlərindən ibarətdir: `title` açarının dəyəri `\"Dune\"`, `pages` açarınınkı isə 412-dir. `book` obyektə istinad edir.",
        "An object is a set of key–value pairs: the key `title` holds `\"Dune\"` and `pages` holds 412. `book` refers to the object.",
      ),
      objStep([{ label: "title", value: '"Dune"', tone: "success" }, { label: "pages", value: "412", tone: "success" }]),
      { arrows: [{ from: "book", to: "obj" }] },
    ),
    step(2, C("Nöqtə ilə müraciət (`book.title`) açarın dəyərini oxuyur.", "Dot notation (`book.title`) reads the value stored under a key."), objStep([
      { label: "title", value: '"Dune"', tone: "accent" },
      { label: "pages", value: "412" },
    ]), { arrows: [{ from: "book", to: "obj" }], output: ["Dune"] }),
    step(
      3,
      C(
        "Mövcud olmayan açara dəyər yazmaq yeni xassə əlavə edir. `const` yalnız `book` adının başqa obyektə yönəldilməsini qadağan edir, obyektin özünün dəyişməsini yox.",
        "Assigning to a key that does not exist adds a new property. `const` only forbids pointing `book` at another object; it does not stop the object itself from changing.",
      ),
      objStep([{ label: "title", value: '"Dune"' }, { label: "pages", value: "412" }, { label: "year", value: "1965", tone: "success" }]),
      { arrows: [{ from: "book", to: "obj" }], output: ["Dune"] },
    ),
    step(
      4,
      C(
        "Kvadrat mötərizə ilə də müraciət etmək olar: `book[\"pages\"]`. Açarın adı dəyişəndə saxlananda bu yazılış lazımdır.",
        "Bracket notation works too: `book[\"pages\"]`. You need it when the key name is stored in a variable.",
      ),
      objStep([{ label: "title", value: '"Dune"' }, { label: "pages", value: "420", tone: "accent" }, { label: "year", value: "1965" }]),
      { arrows: [{ from: "book", to: "obj" }], output: ["Dune"] },
    ),
    step(5, C("`delete` `year` xassəsini obyektdən tamamilə silir.", "`delete` removes the `year` property from the object completely."), objStep([
      { label: "title", value: '"Dune"' },
      { label: "pages", value: "420" },
    ]), { arrows: [{ from: "book", to: "obj" }], output: ["Dune"] }),
    step(
      6,
      C(
        "`in` operatoru açarın obyektdə olub-olmadığını yoxlayır: `year` artıq yoxdur, ona görə nəticə `false`-dur.",
        "The `in` operator checks whether a key exists in the object: `year` is gone, so the result is `false`.",
      ),
      objStep([{ label: "title", value: '"Dune"' }, { label: "pages", value: "420" }]),
      { arrows: [{ from: "book", to: "obj" }], output: ["Dune", "false"] },
    ),
  ],
};

export const BASIC_TOPICS: VTopic[] = [memory, callstack, recursion, loops, arrays, references, objects];
