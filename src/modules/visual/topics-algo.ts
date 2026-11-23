// Data structures, searching and asynchronous execution.
import { C, P, TT, panel, step } from "./helpers";
import type { VItem, VStep, VTopic } from "./types";

// ───────────────────────── Stack & queue ─────────────────────────
const TOP = P("üst", "top", "üst", "верх");
const FRONT = P("ön", "front", "ön", "начало");
const BACK = P("arxa", "back", "arka", "конец");
const sItems = (xs: string[], hl?: VItem["tone"]): VItem[] =>
  xs.map((x, i) => ({ label: x, tag: i === xs.length - 1 ? TOP : undefined, tone: i === xs.length - 1 ? hl : undefined }));
const qItems = (xs: string[], hlIndex = -1, hl?: VItem["tone"]): VItem[] =>
  xs.map((x, i) => ({
    label: x,
    tag: xs.length === 1 ? P("ön / arxa", "front / back", "ön / arka", "начало / конец") : i === 0 ? FRONT : i === xs.length - 1 ? BACK : undefined,
    tone: i === hlIndex ? hl : undefined,
  }));
const sq = (stack: VItem[], queue: VItem[] | null) => [
  panel("stack", TT.stack, stack, "stack"),
  ...(queue ? [panel("queue", TT.queue, queue, "row")] : []),
];

const structures: VTopic = {
  id: "structures",
  title: P("Verilənlər strukturları: stek və növbə", "Data structures: stack & queue", "Veri yapıları: yığın ve kuyruk", "Структуры данных: стек и очередь"),
  summary: C("LIFO və FIFO: `push`, `pop` və `shift`.", "LIFO and FIFO: `push`, `pop` and `shift`."),
  intro: C(
    "Stek və növbə elementlərin hansı sırayla götürüldüyünə görə fərqlənir. Stekdə sonuncu əlavə olunan element birinci götürülür, növbədə isə ilk əlavə olunan. JavaScript-də hər ikisini massivlə modelləşdirmək olar.",
    "A stack and a queue differ in the order elements are taken out. A stack gives back the most recently added element first; a queue gives back the earliest. In JavaScript both can be modelled with an array.",
  ),
  code: {
    lang: "javascript",
    src: `const stack = [];
stack.push("A");
stack.push("B");
stack.pop();
const queue = [];
queue.push("A");
queue.push("B");
queue.shift();`,
  },
  steps: [
    step(
      1,
      C(
        "Boş stek yaradılır. Stek LIFO prinsipi ilə işləyir: sonuncu girən birinci çıxır (Last In, First Out) — boşqab qalağı kimi.",
        "An empty stack is created. A stack is LIFO: last in, first out, like a pile of plates.",
      ),
      sq([], null),
    ),
    step(2, C("`push(\"A\")` elementi stekin üstünə qoyur.", "`push(\"A\")` puts the element on top of the stack."), sq(sItems(["A"], "success"), null)),
    step(3, C("`B` `A`-nın üstünə qoyulur və indi ən üstdədir.", "`B` goes on top of `A` and is now the top element."), sq(sItems(["A", "B"], "success"), null)),
    step(
      4,
      C(
        "`pop()` yalnız üstdəki elementi götürür və `B`-ni qaytarır. Əvvəl əlavə olunan `A` yerində qalır.",
        "`pop()` takes only the top element and returns `B`. `A`, which was added first, stays.",
      ),
      sq(sItems(["A"], "accent"), null),
    ),
    step(
      5,
      C(
        "İndi növbə. Növbə FIFO prinsipi ilə işləyir: birinci girən birinci çıxır (First In, First Out) — kassadakı növbə kimi.",
        "Now a queue. A queue is FIFO: first in, first out, like a line at a checkout.",
      ),
      sq(sItems(["A"]), []),
    ),
    step(6, C("`push(\"A\")` elementi növbənin sonuna əlavə edir.", "`push(\"A\")` adds the element to the back of the queue."), sq(sItems(["A"]), qItems(["A"], 0, "success"))),
    step(7, C("`B` `A`-nın arxasında dayanır.", "`B` lines up behind `A`."), sq(sItems(["A"]), qItems(["A", "B"], 1, "success"))),
    step(
      8,
      C(
        "`shift()` növbənin önündəki elementi — `A`-nı götürür, çünki o birinci gəlmişdi. Böyük massivlərdə `shift()` yavaş işləyir (qalan bütün elementlər sürüşdürülür), ona görə real növbələr başqa üsullarla qurulur.",
        "`shift()` takes the element at the front, `A`, because it arrived first. On large arrays `shift()` is slow (every remaining element is moved), so real queues are built differently.",
      ),
      sq(sItems(["A"]), qItems(["B"], 0, "accent")),
    ),
  ],
};

// ───────────────────────── Linear vs binary search ─────────────────────────
export const SEARCH_ARR = [3, 8, 12, 17, 23, 31, 42, 56, 64, 77, 85, 91];
export const SEARCH_TARGET = 77;
const ARR_T = P("Sıralanmış massiv", "Sorted array", "Sıralı dizi", "Отсортированный массив");

interface CellView {
  active?: [number, number]; // lo..hi, others are muted
  probe?: number;
  found?: boolean;
  lo?: number;
  hi?: number;
}
const searchCells = (v: CellView): VItem[] =>
  SEARCH_ARR.map((x, i) => {
    const out = v.active && (i < v.active[0] || i > v.active[1]);
    const tags = [i === v.lo ? "lo" : "", i === v.probe && v.lo !== undefined ? "mid" : "", i === v.hi ? "hi" : ""].filter(Boolean).join(" ");
    return {
      label: `[${i}]`,
      value: String(x),
      tag: tags || undefined,
      tone: i === v.probe ? (v.found ? "success" : "accent") : out ? "muted" : undefined,
    };
  });
const arrPanel = (v: CellView) => [panel("arr", ARR_T, searchCells(v), "row")];

/** Runs binary search and records every probe (deterministic, done once at module load). */
export function binaryTrace(arr: number[], target: number) {
  const probes: { lo: number; hi: number; mid: number }[] = [];
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    probes.push({ lo, hi, mid });
    if (arr[mid] === target) return { probes, index: mid };
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return { probes, index: -1 };
}

/** Azerbaijani ordinal suffix after a numeral (vowel harmony of the spoken number), e.g. 3-cü, 10-cu. */
export function azOrdinal(n: number): string {
  const ones = ["", "ci", "ci", "cü", "cü", "ci", "cı", "ci", "ci", "cu"];
  const tens = ["", "cu", "ci", "cu", "cı", "ci", "cı", "ci", "ci", "cı"];
  const suffix = n % 10 !== 0 ? ones[n % 10] : n % 100 !== 0 ? tens[(n / 10) % 10] : "cü";
  return `${n}-${suffix}`;
}

function searchSteps(): VStep[] {
  const t = SEARCH_TARGET;
  const linearIndex = SEARCH_ARR.indexOf(t);
  const steps: VStep[] = [
    step(
      3,
      C(
        `Hədəf: ${t}. Xətti axtarış elementləri əvvəldən bir-bir yoxlayır: \`arr[0]\` = ${SEARCH_ARR[0]}, ${t} deyil.`,
        `Target: ${t}. Linear search checks the elements one by one from the start: \`arr[0]\` = ${SEARCH_ARR[0]}, not ${t}.`,
      ),
      arrPanel({ probe: 0 }),
      { probe: { algo: "linear", index: 0 } },
    ),
    step(3, C(`\`arr[1]\` = ${SEARCH_ARR[1]}, yenə də deyil. Növbəti elementə keçilir.`, `\`arr[1]\` = ${SEARCH_ARR[1]}, still not it. On to the next element.`), arrPanel({ probe: 1 }), {
      probe: { algo: "linear", index: 1 },
    }),
    step(
      3,
      C(
        `Eyni qayda ilə \`arr[2]\`…\`arr[${linearIndex - 1}]\` yoxlanılır. ${t} yalnız ${azOrdinal(linearIndex + 1)} müqayisədə tapılır: \`arr[${linearIndex}]\` = ${t}.`,
        `The same goes on for \`arr[2]\`…\`arr[${linearIndex - 1}]\`. ${t} is found only at comparison ${linearIndex + 1}, at \`arr[${linearIndex}]\`.`,
      ),
      arrPanel({ probe: linearIndex, found: true }),
      { probe: { algo: "linear", index: linearIndex } },
    ),
    step(
      9,
      C(
        `İndi ikili axtarış. O yalnız sıralanmış massivdə işləyir. Axtarış sahəsi bütün massivdir: \`lo = 0\`, \`hi = ${SEARCH_ARR.length - 1}\`.`,
        `Now binary search. It only works on a sorted array. The search range is the whole array: \`lo = 0\`, \`hi = ${SEARCH_ARR.length - 1}\`.`,
      ),
      arrPanel({ active: [0, SEARCH_ARR.length - 1], lo: 0, hi: SEARCH_ARR.length - 1 }),
    ),
  ];
  const { probes } = binaryTrace(SEARCH_ARR, t);
  probes.forEach(({ lo, hi, mid }, k) => {
    const v = SEARCH_ARR[mid];
    const head = { az: `${azOrdinal(k + 1)} müqayisə: \`mid = floor((${lo} + ${hi}) / 2) = ${mid}\`, \`arr[${mid}]\` = ${v}. `, en: `Comparison ${k + 1}: \`mid = floor((${lo} + ${hi}) / 2) = ${mid}\`, \`arr[${mid}]\` = ${v}. ` };
    const view: CellView = { active: [lo, hi], lo, hi, probe: mid };
    if (v === t) {
      steps.push(
        step(12, C(`${head.az}Hədəf tapıldı, funksiya ${mid} qaytarır.`, `${head.en}Target found; the function returns ${mid}.`), arrPanel({ ...view, found: true }), {
          probe: { algo: "binary", index: mid },
        }),
      );
    } else if (v < t) {
      steps.push(
        step(
          13,
          C(`${head.az}${v} < ${t}, ona görə sol yarı atılır: \`lo = ${mid + 1}\`.`, `${head.en}${v} < ${t}, so the left half is dropped: \`lo = ${mid + 1}\`.`),
          arrPanel(view),
          { probe: { algo: "binary", index: mid } },
        ),
      );
    } else {
      steps.push(
        step(
          14,
          C(`${head.az}${v} > ${t}, ona görə sağ yarı atılır: \`hi = ${mid - 1}\`.`, `${head.en}${v} > ${t}, so the right half is dropped: \`hi = ${mid - 1}\`.`),
          arrPanel(view),
          { probe: { algo: "binary", index: mid } },
        ),
      );
    }
  });
  steps.push(
    step(
      null,
      C(
        `Nəticə: xətti axtarışa ${linearIndex + 1}, ikili axtarışa isə ${probes.length} müqayisə lazım oldu. n elementli massivdə xətti axtarış ən pis halda n addım atır, ikili axtarış isə hər addımda sahəni yarıya bölür və təxminən log₂(n) addım atır: 1 000 000 element üçün cəmi 20-yə qədər.`,
        `Result: linear search needed ${linearIndex + 1} comparisons, binary search only ${probes.length}. With n elements, linear search takes up to n steps in the worst case, while binary search halves the range every time and takes about log₂(n) steps: at most 20 for 1,000,000 elements.`,
      ),
      arrPanel({ probe: SEARCH_ARR.indexOf(t), found: true }),
    ),
  );
  return steps;
}

const search: VTopic = {
  id: "search",
  title: P("Alqoritmlər: xətti və ikili axtarış", "Algorithms: linear vs binary search", "Algoritmalar: doğrusal ve ikili arama", "Алгоритмы: линейный и двоичный поиск"),
  summary: C("Eyni məsələ, fərqli sürət: n və log₂(n) addım.", "Same problem, different speed: n versus log₂(n) steps."),
  intro: C(
    "Alqoritm məsələni həll etmək üçün dəqiq addımlar ardıcıllığıdır. Eyni məsələnin fərqli alqoritmləri ola bilər: xətti axtarış hər elementə baxır, ikili axtarış isə sıralanmış massivdə ortadakı elementi yoxlayır və hər dəfə yarısını atır.",
    "An algorithm is a precise sequence of steps that solves a problem. One problem can have different algorithms: linear search looks at every element, while binary search checks the middle of a sorted array and throws away half of it each time.",
  ),
  code: {
    lang: "javascript",
    src: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
  },
  steps: searchSteps(),
  meta: { search: { arr: SEARCH_ARR, target: SEARCH_TARGET } },
};

// ───────────────────────── Event loop ─────────────────────────
const EV_CODE = `console.log("A: start");
setTimeout(() => {
  console.log("D: timeout");
}, 0);
Promise.resolve().then(() => {
  console.log("C: promise");
});
console.log("B: end");`;
const CB_TIMER = P("taymer callback-i", "timer callback", "zamanlayıcı geri çağrısı", "колбэк таймера");
const CB_THEN = P(".then callback-i", ".then callback", ".then geri çağrısı", "колбэк .then");
const ev = (o: { stack?: VItem[]; web?: VItem[]; micro?: VItem[]; tasks?: VItem[] }) => [
  panel("cs", TT.callStack, o.stack ?? [], "stack"),
  panel("web", TT.webApis, o.web ?? []),
  panel("micro", TT.microtasks, o.micro ?? [], "row"),
  panel("tasks", TT.tasks, o.tasks ?? [], "row"),
];
const G: VItem = { label: P("skript (qlobal kod)", "script (global code)", "betik (genel kod)", "скрипт (глобальный код)") };

const eventloop: VTopic = {
  id: "eventloop",
  title: P("Asinxron icra: hadisə dövrü", "Asynchronous execution: the event loop", "Asenkron yürütme: olay döngüsü", "Асинхронное выполнение: цикл событий"),
  summary: C("`setTimeout` və `Promise` hansı sırayla işləyir.", "In what order `setTimeout` and `Promise` run."),
  intro: C(
    "JavaScript bir axında işləyir: eyni anda yalnız bir kod parçası icra olunur. Gözləmə tələb edən işlər (taymerlər, şəbəkə) gözləməni mühitə həvalə edir, onların callback-ləri isə növbələrdə gözləyir. Hadisə dövrü (event loop) çağırış steki boşaldıqda əvvəlcə bütün mikrotapşırıqları (`Promise.then`), sonra növbəti tapşırığı (məsələn, taymer callback-ini) icra edir.",
    "JavaScript runs on a single thread: only one piece of code executes at a time. Work that has to wait (timers, network) hands the waiting to the environment, and its callbacks wait in queues. When the call stack is empty, the event loop first runs all microtasks (`Promise.then`), then the next task (for example a timer callback).",
  ),
  code: { lang: "javascript", src: EV_CODE },
  steps: [
    step(
      1,
      C(
        "Skript çağırış stekində sinxron icra olunmağa başlayır. Birinci `console.log` dərhal \"A: start\" çap edir.",
        "The script starts running synchronously on the call stack. The first `console.log` prints \"A: start\" at once.",
      ),
      ev({ stack: [G, { label: 'console.log("A: start")', tone: "accent" }] }),
      { output: ["A: start"] },
    ),
    step(
      2,
      C(
        "`setTimeout` taymeri brauzerin (və ya Node.js-in) taymer mexanizminə verir və dərhal qayıdır. Callback funksiyası indi icra olunmur.",
        "`setTimeout` hands the timer to the browser's (or Node.js's) timer mechanism and returns immediately. The callback does not run now.",
      ),
      ev({ stack: [G, { label: "setTimeout(…, 0)", tone: "accent" }], web: [{ label: "0 ms", value: CB_TIMER, tone: "success" }] }),
      { output: ["A: start"] },
    ),
    step(
      2,
      C(
        "0 ms gecikmə \"dərhal\" demək deyil: vaxt bitəndə callback tapşırıq növbəsinə (task queue) düşür və çağırış steki boşalana qədər orada gözləyir.",
        "A 0 ms delay does not mean \"immediately\": when it expires, the callback moves to the task queue and waits there until the call stack is empty.",
      ),
      ev({ stack: [G], tasks: [{ label: CB_TIMER, value: "D", tone: "accent" }] }),
      { output: ["A: start"] },
    ),
    step(
      5,
      C(
        "`Promise.resolve()` artıq yerinə yetirilmiş promise-dir, ona görə `.then` callback-i dərhal mikrotapşırıq növbəsinə (microtask queue) əlavə olunur, amma hələ icra edilmir.",
        "`Promise.resolve()` is already fulfilled, so the `.then` callback goes into the microtask queue right away, but it does not run yet.",
      ),
      ev({ stack: [G, { label: "Promise.resolve().then(…)", tone: "accent" }], micro: [{ label: CB_THEN, value: "C", tone: "success" }], tasks: [{ label: CB_TIMER, value: "D" }] }),
      { output: ["A: start"] },
    ),
    step(
      8,
      C(
        "Sinxron kod davam edir: \"B: end\" çap olunur. Növbələrdə gözləyən callback-lər sinxron kodu heç vaxt yarımçıq kəsmir.",
        "Synchronous code continues: \"B: end\" is printed. Callbacks waiting in queues never interrupt synchronous code.",
      ),
      ev({ stack: [G, { label: 'console.log("B: end")', tone: "accent" }], micro: [{ label: CB_THEN, value: "C" }], tasks: [{ label: CB_TIMER, value: "D" }] }),
      { output: ["A: start", "B: end"] },
    ),
    step(
      null,
      C(
        "Skript bitdi, çağırış steki boşdur. İndi hadisə dövrü işə düşür: o, əvvəlcə mikrotapşırıq növbəsini tamamilə boşaldır.",
        "The script has finished and the call stack is empty. Now the event loop takes over: first it drains the microtask queue completely.",
      ),
      ev({ micro: [{ label: CB_THEN, value: "C", tone: "accent" }], tasks: [{ label: CB_TIMER, value: "D" }] }),
      { output: ["A: start", "B: end"] },
    ),
    step(
      6,
      C(
        "Promise callback-i stekə keçir və \"C: promise\" çap edir. Taymer daha əvvəl hazır olsa da, mikrotapşırıqlar həmişə növbəti tapşırıqdan əvvəl icra olunur.",
        "The promise callback moves onto the stack and prints \"C: promise\". Even though the timer was ready earlier, microtasks always run before the next task.",
      ),
      ev({ stack: [{ label: CB_THEN, value: "C", tone: "accent" }], tasks: [{ label: CB_TIMER, value: "D" }] }),
      { output: ["A: start", "B: end", "C: promise"] },
    ),
    step(
      3,
      C(
        "Mikrotapşırıq növbəsi boşdur, ona görə hadisə dövrü tapşırıq növbəsindən növbəti tapşırığı götürür: taymer callback-i \"D: timeout\" çap edir.",
        "The microtask queue is empty, so the event loop takes the next task from the task queue: the timer callback prints \"D: timeout\".",
      ),
      ev({ stack: [{ label: CB_TIMER, value: "D", tone: "accent" }] }),
      { output: ["A: start", "B: end", "C: promise", "D: timeout"] },
    ),
    step(
      null,
      C(
        "Yekun sıra: A, B (sinxron kod), C (mikrotapşırıq — Promise), D (tapşırıq — taymer). Qayda: əvvəlcə bütün sinxron kod, sonra bütün mikrotapşırıqlar, sonra taymerlər.",
        "Final order: A, B (synchronous code), C (microtask: Promise), D (task: timer). The rule: all synchronous code first, then all microtasks, then timers.",
      ),
      ev({}),
      { output: ["A: start", "B: end", "C: promise", "D: timeout"] },
    ),
  ],
  meta: { logKinds: { "A: start": "sync", "B: end": "sync", "C: promise": "micro", "D: timeout": "timer" } },
};

export const ALGO_TOPICS: VTopic[] = [structures, search, eventloop];
