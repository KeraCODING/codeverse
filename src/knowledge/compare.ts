import type { CodeLang, L } from "../content/types";

// Language Comparison data: the same concept written idiomatically in six languages, plus a short
// profile of each language (execution model, memory, strengths, limitations). Snippets show the
// relevant lines only (no surrounding class/main boilerplate) — noted in the UI.

export type CompareLang = "python" | "javascript" | "java" | "csharp" | "cpp" | "go";

export const COMPARE_LANGS: { id: CompareLang; name: string; code: CodeLang; catalog: string }[] = [
  { id: "python", name: "Python", code: "python", catalog: "python" },
  { id: "javascript", name: "JavaScript", code: "javascript", catalog: "javascript" },
  { id: "java", name: "Java", code: "java", catalog: "java" },
  { id: "csharp", name: "C#", code: "csharp", catalog: "csharp" },
  { id: "cpp", name: "C++", code: "cpp", catalog: "cpp" },
  { id: "go", name: "Go", code: "go", catalog: "go" },
];

export interface Concept {
  id: string;
  title: L;
  note: L;
  code: Record<CompareLang, string>;
  lessons: string[];
}

export const CONCEPTS: Concept[] = [
  {
    id: "variables",
    title: { az: "Dəyişənlər", en: "Variables" },
    note: {
      az: "Python və JavaScript-də tip dəyərdən gəlir (dinamik). Java, C#, C++ və Go-da tip kompilyasiya zamanı bilinir (statik); C#-da `var`, Go-da `:=` tipi avtomatik çıxarır.",
      en: "In Python and JavaScript the type comes from the value (dynamic). In Java, C#, C++ and Go the type is known at compile time (static); C# `var` and Go `:=` infer it.",
    },
    code: {
      python: 'name = "Aysel"\nage = 20',
      javascript: 'const name = "Aysel";\nlet age = 20;',
      java: 'String name = "Aysel";\nint age = 20;',
      csharp: 'string name = "Aysel";\nvar age = 20; // inferred as int',
      cpp: 'std::string name = "Aysel";\nint age = 20;',
      go: 'name := "Aysel"\nvar age int = 20',
    },
    lessons: ["python-variables", "javascript-variables"],
  },
  {
    id: "output",
    title: { az: "Ekrana çıxış", en: "Printing output" },
    note: {
      az: "Hər dilin standart çıxış üsulu fərqlidir. C++ `#include <iostream>`, Go isə `import \"fmt\"` tələb edir.",
      en: "Each language has its own standard output call. C++ needs `#include <iostream>`; Go needs `import \"fmt\"`.",
    },
    code: {
      python: 'print("Hello")',
      javascript: 'console.log("Hello");',
      java: 'System.out.println("Hello");',
      csharp: 'Console.WriteLine("Hello");',
      cpp: 'std::cout << "Hello" << std::endl;',
      go: 'fmt.Println("Hello")',
    },
    lessons: ["python-variables", "javascript-variables"],
  },
  {
    id: "conditions",
    title: { az: "Şərtlər", en: "Conditions" },
    note: {
      az: "Python bloku girinti və iki nöqtə ilə, digərləri fiqurlu mötərizə ilə müəyyən edir. Go-da şərt ətrafında mötərizə yazılmır, amma fiqurlu mötərizə məcburidir.",
      en: "Python marks blocks with a colon and indentation; the others use braces. Go writes no parentheses around the condition, but braces are mandatory.",
    },
    code: {
      python: 'if age >= 18:\n    print("Adult")\nelse:\n    print("Minor")',
      javascript: 'if (age >= 18) {\n  console.log("Adult");\n} else {\n  console.log("Minor");\n}',
      java: 'if (age >= 18) {\n    System.out.println("Adult");\n} else {\n    System.out.println("Minor");\n}',
      csharp: 'if (age >= 18)\n{\n    Console.WriteLine("Adult");\n}\nelse\n{\n    Console.WriteLine("Minor");\n}',
      cpp: 'if (age >= 18) {\n    std::cout << "Adult\\n";\n} else {\n    std::cout << "Minor\\n";\n}',
      go: 'if age >= 18 {\n    fmt.Println("Adult")\n} else {\n    fmt.Println("Minor")\n}',
    },
    lessons: ["python-conditions", "javascript-conditions"],
  },
  {
    id: "loops",
    title: { az: "Dövrlər (1-dən 3-ə qədər)", en: "Loops (1 to 3)" },
    note: {
      az: "Python `range` ilə ardıcıllığı gəzir; C üslublu dillər `başlanğıc; şərt; addım` formasını istifadə edir. Go-da yeganə dövr açar sözü `for`-dur (`while` yoxdur).",
      en: "Python walks a `range`; C-style languages use `init; condition; step`. Go's only loop keyword is `for` (there is no `while`).",
    },
    code: {
      python: "for i in range(1, 4):\n    print(i)",
      javascript: "for (let i = 1; i <= 3; i++) {\n  console.log(i);\n}",
      java: "for (int i = 1; i <= 3; i++) {\n    System.out.println(i);\n}",
      csharp: "for (int i = 1; i <= 3; i++)\n{\n    Console.WriteLine(i);\n}",
      cpp: "for (int i = 1; i <= 3; i++) {\n    std::cout << i << \"\\n\";\n}",
      go: "for i := 1; i <= 3; i++ {\n    fmt.Println(i)\n}",
    },
    lessons: ["python-loops"],
  },
  {
    id: "functions",
    title: { az: "Funksiyalar", en: "Functions" },
    note: {
      az: "Statik tipli dillərdə parametr və nəticə tipləri yazılır. Java və C#-da funksiyalar sinfin içində metod kimi olur (burada `static` göstərilib). Go-da nəticə tipi parametrlərdən sonra yazılır.",
      en: "Statically typed languages declare parameter and return types. In Java and C# functions live inside a class as methods (shown here as `static`). Go writes the return type after the parameters.",
    },
    code: {
      python: "def add(a, b):\n    return a + b",
      javascript: "function add(a, b) {\n  return a + b;\n}",
      java: "static int add(int a, int b) {\n    return a + b;\n}",
      csharp: "static int Add(int a, int b)\n{\n    return a + b;\n}",
      cpp: "int add(int a, int b) {\n    return a + b;\n}",
      go: "func add(a int, b int) int {\n    return a + b\n}",
    },
    lessons: ["python-functions", "javascript-functions"],
  },
  {
    id: "lists",
    title: { az: "Siyahı / massiv", en: "List / array" },
    note: {
      az: "Ölçüsü dəyişən kolleksiyalar: Python `list`, JavaScript `Array`, Java `ArrayList`, C# `List<T>`, C++ `std::vector`, Go slice. Go-da `append` yeni slice qaytarır, ona görə nəticə yenidən mənimsədilir.",
      en: "Growable collections: Python `list`, JavaScript `Array`, Java `ArrayList`, C# `List<T>`, C++ `std::vector`, Go slice. Go's `append` returns a new slice, so the result is assigned back.",
    },
    code: {
      python: "nums = [1, 2, 3]\nnums.append(4)\nprint(len(nums))",
      javascript: "const nums = [1, 2, 3];\nnums.push(4);\nconsole.log(nums.length);",
      java: "List<Integer> nums = new ArrayList<>(List.of(1, 2, 3));\nnums.add(4);\nSystem.out.println(nums.size());",
      csharp: "var nums = new List<int> { 1, 2, 3 };\nnums.Add(4);\nConsole.WriteLine(nums.Count);",
      cpp: "std::vector<int> nums = {1, 2, 3};\nnums.push_back(4);\nstd::cout << nums.size();",
      go: "nums := []int{1, 2, 3}\nnums = append(nums, 4)\nfmt.Println(len(nums))",
    },
    lessons: ["python-lists", "javascript-arrays"],
  },
  {
    id: "strings",
    title: { az: "Mətnə dəyər yerləşdirmək", en: "String formatting" },
    note: {
      az: "Python f-sətir, JavaScript şablon sətir, C# `$` interpolyasiya istifadə edir. Java və Go format sətirləri (`%s`, `%d`) ilə işləyir. C++20-də `std::format` da var; burada klassik `<<` göstərilib.",
      en: "Python uses f-strings, JavaScript template literals, C# `$` interpolation. Java and Go use format strings (`%s`, `%d`). C++20 also has `std::format`; the classic `<<` is shown here.",
    },
    code: {
      python: 'print(f"{name} is {age}")',
      javascript: "console.log(`${name} is ${age}`);",
      java: 'System.out.println(String.format("%s is %d", name, age));',
      csharp: 'Console.WriteLine($"{name} is {age}");',
      cpp: 'std::cout << name << " is " << age << "\\n";',
      go: 'fmt.Printf("%s is %d\\n", name, age)',
    },
    lessons: ["python-variables", "javascript-variables"],
  },
  {
    id: "null",
    title: { az: "Dəyərin olmaması", en: "Absence of a value" },
    note: {
      az: "Python `None`, JavaScript `null` (və `undefined`), Java/C# `null`, C++ göstəricilər üçün `nullptr`, Go `nil`. C#-da `string?` dəyərin null ola biləcəyini açıq bildirir.",
      en: "Python `None`, JavaScript `null` (and `undefined`), Java/C# `null`, C++ `nullptr` for pointers, Go `nil`. In C#, `string?` states explicitly that the value may be null.",
    },
    code: {
      python: 'result = None\nif result is None:\n    print("empty")',
      javascript: 'let result = null;\nif (result === null) {\n  console.log("empty");\n}',
      java: 'String result = null;\nif (result == null) {\n    System.out.println("empty");\n}',
      csharp: 'string? result = null;\nif (result is null)\n{\n    Console.WriteLine("empty");\n}',
      cpp: 'int* result = nullptr;\nif (result == nullptr) {\n    std::cout << "empty\\n";\n}',
      go: 'var result *int = nil\nif result == nil {\n    fmt.Println("empty")\n}',
    },
    lessons: ["python-functions", "javascript-conditions"],
  },
];

export interface LangProfile {
  execution: L;
  memory: L;
  strengths: L;
  limitations: L;
}

export const PROFILES: Record<CompareLang, LangProfile> = {
  python: {
    execution: { az: "İnterpretator (CPython kodu bayt-koda çevirib icra edir).", en: "Interpreted (CPython compiles to bytecode and runs it)." },
    memory: { az: "Avtomatik: istinad sayğacı + zibil toplayıcı (garbage collector).", en: "Automatic: reference counting plus a garbage collector." },
    strengths: { az: "Oxunaqlı sintaksis, nəhəng kitabxana ekosistemi (verilənlər elmi, AI), sürətli prototipləşdirmə.", en: "Readable syntax, huge library ecosystem (data science, AI), fast prototyping." },
    limitations: { az: "Saf Python kodu kompilyasiya olunan dillərdən adətən yavaşdır; mobil və brauzer üçün təbii seçim deyil.", en: "Pure Python is usually slower than compiled languages; not a natural fit for mobile or the browser." },
  },
  javascript: {
    execution: { az: "JIT kompilyasiyası olan mühərriklər (V8, SpiderMonkey); brauzerdə və Node.js-də işləyir.", en: "JIT-compiling engines (V8, SpiderMonkey); runs in browsers and Node.js." },
    memory: { az: "Avtomatik zibil toplayıcı.", en: "Automatic garbage collection." },
    strengths: { az: "Hər brauzerdə var; frontend və backend-də eyni dil; asinxron I/O üçün güclü model.", en: "Available in every browser; one language for frontend and backend; a strong model for async I/O." },
    limitations: { az: "Zəif tiplilik (`==` kimi tələlər); böyük layihələrdə adətən TypeScript ilə tamamlanır.", en: "Weak typing (traps like `==`); large projects usually add TypeScript." },
  },
  java: {
    execution: { az: "Bayt-koda kompilyasiya olunur və JVM-də JIT ilə icra olunur.", en: "Compiled to bytecode and run on the JVM with JIT compilation." },
    memory: { az: "Avtomatik zibil toplayıcı.", en: "Automatic garbage collection." },
    strengths: { az: "Yetkin ekosistem, korporativ sistemlərdə və Android-də geniş yayılıb, platformalararası.", en: "Mature ecosystem, widespread in enterprise systems and Android, cross-platform." },
    limitations: { az: "Daha çox \"hazırlıq\" kodu; JVM başlama vaxtı və yaddaş istifadəsi kiçik proqramlar üçün böyük ola bilər.", en: "More boilerplate; JVM startup time and memory use can be heavy for small programs." },
  },
  csharp: {
    execution: { az: "Aralıq dilə (IL) kompilyasiya olunur və .NET runtime-da JIT ilə icra olunur (AOT seçimi də var).", en: "Compiled to intermediate language (IL) and JIT-compiled by the .NET runtime (AOT is also available)." },
    memory: { az: "Avtomatik zibil toplayıcı.", en: "Automatic garbage collection." },
    strengths: { az: "Zəngin standart kitabxana, güclü alətlər (Visual Studio), Windows, veb və oyun (Unity) üçün.", en: "Rich standard library, strong tooling (Visual Studio), Windows, web and games (Unity)." },
    limitations: { az: ".NET runtime tələb edir; ekosistem əsasən Microsoft ətrafında cəmləşib.", en: "Needs the .NET runtime; the ecosystem centres on Microsoft." },
  },
  cpp: {
    execution: { az: "Birbaşa maşın koduna kompilyasiya olunur.", en: "Compiled directly to machine code." },
    memory: { az: "Əl ilə və RAII ilə (smart pointer-lər: `std::unique_ptr`, `std::shared_ptr`); zibil toplayıcı yoxdur.", en: "Manual and RAII-based (smart pointers: `std::unique_ptr`, `std::shared_ptr`); no garbage collector." },
    strengths: { az: "Yüksək performans və aparat üzərində tam nəzarət; oyun mühərrikləri, brauzerlər, sistem proqramları.", en: "High performance and full control over hardware; game engines, browsers, systems software." },
    limitations: { az: "Mürəkkəb dil; yaddaş səhvləri (sızma, sərhəddən kənar müraciət) asan edilir.", en: "A complex language; memory bugs (leaks, out-of-bounds access) are easy to make." },
  },
  go: {
    execution: { az: "Maşın koduna kompilyasiya olunur; tək icra faylı yaranır.", en: "Compiled to machine code, producing a single executable." },
    memory: { az: "Avtomatik zibil toplayıcı.", en: "Automatic garbage collection." },
    strengths: { az: "Sadə dil, sürətli kompilyasiya, goroutine-lərlə rahat paralel iş; bulud və şəbəkə xidmətləri.", en: "Simple language, fast compilation, easy concurrency with goroutines; cloud and network services." },
    limitations: { az: "Bilərəkdən minimal dil: bəzi abstraksiyalar yoxdur; xəta emalı çox təkrarlanan kod yaradır.", en: "Intentionally minimal: some abstractions are missing; error handling is repetitive." },
  },
};
