// Smart Code Explanation — local, rule-based engine. No network, no AI.
// It recognises common statement shapes line by line (Python, JavaScript, SQL), explains every
// keyword/built-in it knows from the knowledge base, and tracks names the code defines itself.
// Lines it does not recognise are reported as such — never guessed.
import type { L } from "../content/types";
import { tokenizeLine } from "../ui/highlight";
import { findTerm, type TermEntry } from "./keywords";

export type ExplainLang = "python" | "javascript" | "sql";

export interface LineExplanation {
  line: number; // 1-based
  code: string;
  kind: "blank" | "comment" | "known" | "unknown";
  text: L; // already filled, may be empty for blank lines
  depth: number; // block nesting depth (indentation / braces)
}

export interface WordInfo {
  token: string;
  term?: TermEntry;
  definedAt?: { line: number; as: "variable" | "function" | "parameter" | "loopVar" | "class" };
  lines: number[];
}

export interface Explanation {
  lang: ExplainLang;
  lines: LineExplanation[];
  words: WordInfo[];
  recognised: number; // share (0–100) of non-blank, non-comment lines recognised
}

type Rule = { re: RegExp; text: (m: RegExpMatchArray) => L };
const T = (az: string, en: string): L => ({ az, en });
const q = (s: string) => "`" + s.trim() + "`";

// ---------------------------------------------------------------- Python
const PY: Rule[] = [
  { re: /^def\s+(\w+)\s*\((.*)\)\s*(?:->\s*[^:]+)?:\s*$/, text: (m) => m[2].trim()
      ? T(`${q(m[1])} adlı funksiya təyin edir; parametrləri: ${q(m[2])}. Gövdəsi aşağıdakı girintili sətirlərdir.`, `Defines a function ${q(m[1])} with parameters ${q(m[2])}. Its body is the indented lines below.`)
      : T(`Parametrsiz ${q(m[1])} funksiyasını təyin edir.`, `Defines a function ${q(m[1])} with no parameters.`) },
  { re: /^class\s+(\w+)(?:\((.*)\))?:\s*$/, text: (m) => T(`${q(m[1])} adlı sinif təyin edir${m[2] ? `; ${q(m[2])} sinfindən törəyir` : ""}.`, `Defines a class ${q(m[1])}${m[2] ? ` that inherits from ${q(m[2])}` : ""}.`) },
  { re: /^for\s+(.+?)\s+in\s+range\((.*)\):\s*$/, text: (m) => T(`Dövr: ${q(m[1])} növbə ilə ${q(`range(${m[2]})`)} ədədlərini alır (son hədd daxil deyil).`, `Loop: ${q(m[1])} takes each number of ${q(`range(${m[2]})`)} in turn (the end is excluded).`) },
  { re: /^for\s+(.+?)\s+in\s+(.+):\s*$/, text: (m) => T(`Dövr: ${q(m[2])} ardıcıllığının hər elementi növbə ilə ${q(m[1])} adına verilir.`, `Loop: each item of ${q(m[2])} is given to ${q(m[1])} in turn.`) },
  { re: /^while\s+(.+):\s*$/, text: (m) => T(`${q(m[1])} şərti doğru olduqca aşağıdakı bloku təkrarlayır.`, `Repeats the block below while ${q(m[1])} is true.`) },
  { re: /^if\s+(.+):\s*$/, text: (m) => T(`Şərt: ${q(m[1])} doğrudursa aşağıdakı girintili blok işləyir.`, `Condition: if ${q(m[1])} is true, the indented block below runs.`) },
  { re: /^elif\s+(.+):\s*$/, text: (m) => T(`Əvvəlki şərtlər yalan idisə, ${q(m[1])} yoxlanılır.`, `If the previous conditions were false, ${q(m[1])} is tested.`) },
  { re: /^else\s*:\s*$/, text: () => T("Yuxarıdakı şərtlərin heç biri doğru olmadıqda bu blok işləyir.", "This block runs when none of the conditions above were true.") },
  { re: /^return\s*$/, text: () => T("Funksiyanı bitirir və `None` qaytarır.", "Ends the function and returns `None`.") },
  { re: /^return\s+(.+)$/, text: (m) => T(`${q(m[1])} dəyərini hesablayıb çağırana qaytarır və funksiyanı bitirir.`, `Computes ${q(m[1])}, returns it to the caller and ends the function.`) },
  { re: /^break\s*$/, text: () => T("Ən yaxın dövrü dərhal dayandırır.", "Stops the nearest loop immediately.") },
  { re: /^continue\s*$/, text: () => T("Dövrün cari addımının qalanını ötürüb növbəti addıma keçir.", "Skips the rest of this loop step and moves to the next.") },
  { re: /^pass\s*$/, text: () => T("Heç nə etmir; boş blok üçün yer tutucudur.", "Does nothing; a placeholder for an empty block.") },
  { re: /^import\s+(.+)$/, text: (m) => T(`${q(m[1])} modulunu idxal edir ki, onun funksiyaları istifadə olunsun.`, `Imports the module ${q(m[1])} so its functions can be used.`) },
  { re: /^from\s+(\S+)\s+import\s+(.+)$/, text: (m) => T(`${q(m[1])} modulundan yalnız ${q(m[2])} gətirir.`, `Imports only ${q(m[2])} from the module ${q(m[1])}.`) },
  { re: /^try\s*:\s*$/, text: () => T("Xəta verə biləcək kodu başladır; xəta olarsa `except` bloku işləyir.", "Starts code that may fail; if it does, the `except` block runs.") },
  { re: /^except\s*(.*?)\s*(?:as\s+(\w+))?\s*:\s*$/, text: (m) => T(`${m[1] ? q(m[1]) + " tipli" : "İstənilən"} xəta baş verdikdə bu blok işləyir${m[2] ? `; xəta obyekti ${q(m[2])} adlanır` : ""}.`, `Runs when ${m[1] ? "a " + q(m[1]) : "any"} error occurs${m[2] ? `; the error object is named ${q(m[2])}` : ""}.`) },
  { re: /^print\((.*)\)\s*$/, text: (m) => T(`${q(m[1] || "''")} dəyərini ekrana çap edir.`, `Prints ${q(m[1] || "''")} to the screen.`) },
  { re: /^(\w+)\s*([+\-*/%]|\/\/|\*\*)=\s*(.+)$/, text: (m) => T(`${q(m[1])} dəyərini yeniləyir: ${q(`${m[1]} = ${m[1]} ${m[2]} ${m[3]}`)} ilə eynidir.`, `Updates ${q(m[1])}: same as ${q(`${m[1]} = ${m[1]} ${m[2]} ${m[3]}`)}.`) },
  { re: /^(\w+(?:\s*,\s*\w+)+)\s*=\s*(.+)$/, text: (m) => T(`Bir neçə ada eyni anda dəyər verir: ${q(m[1])} ← ${q(m[2])}.`, `Assigns several names at once: ${q(m[1])} ← ${q(m[2])}.`) },
  { re: /^(\w+)\s*=\s*(\w+)\.(\w+)\((.*)\)$/, text: (m) => T(`${q(m[2])} üzərində ${q(m[3])} metodunu çağırır və nəticəni ${q(m[1])} dəyişəninə yazır.`, `Calls the ${q(m[3])} method on ${q(m[2])} and stores the result in ${q(m[1])}.`) },
  { re: /^(\w+)\s*=\s*(.+)$/, text: (m) => T(`${q(m[2])} ifadəsinin dəyərini hesablayıb ${q(m[1])} adına bağlayır (mənimsətmə).`, `Evaluates ${q(m[2])} and binds the result to the name ${q(m[1])} (assignment).`) },
  { re: /^(\w+)\[(.+)\]\s*=\s*(.+)$/, text: (m) => T(`${q(m[1])} kolleksiyasında ${q(m[2])} mövqeyinə/açarına ${q(m[3])} yazır.`, `Stores ${q(m[3])} at position/key ${q(m[2])} of ${q(m[1])}.`) },
  { re: /^(\w+)\.(\w+)\((.*)\)\s*$/, text: (m) => T(`${q(m[1])} obyekti üzərində ${q(m[2])} metodunu ${m[3] ? q(m[3]) + " arqumenti ilə" : "arqumentsiz"} çağırır.`, `Calls the ${q(m[2])} method on ${q(m[1])}${m[3] ? " with " + q(m[3]) : ""}.`) },
  { re: /^(\w+)\((.*)\)\s*$/, text: (m) => T(`${q(m[1])} funksiyasını ${m[2] ? q(m[2]) + " arqumenti ilə" : "arqumentsiz"} çağırır.`, `Calls the function ${q(m[1])}${m[2] ? " with " + q(m[2]) : " with no arguments"}.`) },
];

// ---------------------------------------------------------------- JavaScript
const JS: Rule[] = [
  { re: /^\}\s*$/, text: () => T("Blokun sonu.", "End of the block.") },
  { re: /^(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\((.*)\)\s*\{?\s*$/, text: (m) => m[2].trim()
      ? T(`${q(m[1])} funksiyasını elan edir; parametrləri: ${q(m[2])}.`, `Declares the function ${q(m[1])} with parameters ${q(m[2])}.`)
      : T(`Parametrsiz ${q(m[1])} funksiyasını elan edir.`, `Declares the function ${q(m[1])} with no parameters.`) },
  { re: /^(?:export\s+)?(const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\(?([\w\s,=]*)\)?\s*=>\s*(.*)$/, text: (m) => T(`${q(m[2])} adlı ox funksiyası yaradır (${q(m[1])})${m[3].trim() ? `; parametrləri: ${q(m[3])}` : ""}${m[4] && !m[4].startsWith("{") ? `; ${q(m[4].replace(/;$/, ""))} nəticəsini qaytarır` : ""}.`, `Creates an arrow function ${q(m[2])} (${q(m[1])})${m[3].trim() ? ` with parameters ${q(m[3])}` : ""}${m[4] && !m[4].startsWith("{") ? ` that returns ${q(m[4].replace(/;$/, ""))}` : ""}.`) },
  { re: /^(?:export\s+)?(const|let|var)\s+(\w+)\s*=\s*await\s+(.+?);?$/, text: (m) => T(`${q(m[3])} tamamlanana qədər gözləyir və nəticəni ${q(m[2])} adına yazır (${q(m[1])}).`, `Waits for ${q(m[3])} to finish and stores the result in ${q(m[2])} (${q(m[1])}).`) },
  { re: /^(?:export\s+)?(const|let|var)\s+(\w+)\s*=\s*(.+?);?$/, text: (m) => ({
      az: `${q(m[1])} ilə ${q(m[2])} ${m[1] === "const" ? "sabit adını" : "dəyişənini"} elan edir və ${q(m[3])} dəyərini verir.${m[1] === "const" ? " Yenidən mənimsədilə bilməz." : m[1] === "var" ? " `var` köhnə üsuldur; `let`/`const` tövsiyə olunur." : ""}`,
      en: `Declares ${m[1] === "const" ? "the constant" : "the variable"} ${q(m[2])} with ${q(m[1])} and gives it ${q(m[3])}.${m[1] === "const" ? " It cannot be reassigned." : m[1] === "var" ? " `var` is the old way; prefer `let`/`const`." : ""}`,
    }) },
  { re: /^(const|let|var)\s+(\w+)\s*;?$/, text: (m) => T(`${q(m[2])} dəyişənini dəyərsiz elan edir; dəyəri \`undefined\`-dır.`, `Declares ${q(m[2])} without a value; it is \`undefined\`.`) },
  { re: /^(?:\}\s*)?else\s+if\s*\((.+)\)\s*\{?\s*$/, text: (m) => T(`Əvvəlki şərtlər yalan idisə, ${q(m[1])} yoxlanılır.`, `If the previous conditions were false, ${q(m[1])} is tested.`) },
  { re: /^if\s*\((.+)\)\s*\{?\s*$/, text: (m) => T(`Şərt: ${q(m[1])} doğrudursa (truthy) blok işləyir.`, `Condition: if ${q(m[1])} is truthy, the block runs.`) },
  { re: /^(?:\}\s*)?else\s*\{?\s*$/, text: () => T("Yuxarıdakı şərtlər ödənmədikdə işləyən blok.", "The block that runs when the conditions above were not met.") },
  { re: /^for\s*\(\s*(const|let|var)\s+(\w+)\s+of\s+(.+)\)\s*\{?\s*$/, text: (m) => T(`Dövr: ${q(m[3])} içindəki hər element növbə ilə ${q(m[2])} adına verilir.`, `Loop: each item of ${q(m[3])} is given to ${q(m[2])} in turn.`) },
  { re: /^for\s*\(\s*(const|let|var)\s+(\w+)\s+in\s+(.+)\)\s*\{?\s*$/, text: (m) => T(`Dövr: ${q(m[3])} obyektinin hər açarı (xassə adı) ${q(m[2])} adına verilir.`, `Loop: each key (property name) of ${q(m[3])} is given to ${q(m[2])}.`) },
  { re: /^for\s*\((.*);(.*);(.*)\)\s*\{?\s*$/, text: (m) => T(`Klassik dövr: başlanğıc ${q(m[1])}; ${q(m[2])} doğru olduqca təkrarlanır; hər addımdan sonra ${q(m[3])}.`, `Classic loop: starts with ${q(m[1])}; repeats while ${q(m[2])}; after each step runs ${q(m[3])}.`) },
  { re: /^while\s*\((.+)\)\s*\{?\s*$/, text: (m) => T(`${q(m[1])} doğru olduqca bloku təkrarlayır.`, `Repeats the block while ${q(m[1])} is true.`) },
  { re: /^return\s*;?$/, text: () => T("Funksiyanı bitirir; nəticə `undefined`-dir.", "Ends the function; the result is `undefined`.") },
  { re: /^return\s+(.+?);?$/, text: (m) => T(`${q(m[1])} dəyərini qaytarır və funksiyanı bitirir.`, `Returns ${q(m[1])} and ends the function.`) },
  { re: /^break\s*;?$/, text: () => T("Dövrü (və ya `switch`-i) dərhal dayandırır.", "Stops the loop (or `switch`) immediately.") },
  { re: /^continue\s*;?$/, text: () => T("Dövrün növbəti addımına keçir.", "Moves to the next loop iteration.") },
  { re: /^console\.(log|error|warn|info)\((.*)\);?$/, text: (m) => T(`${q(m[2])} dəyərini konsola yazır (${q("console." + m[1])}).`, `Writes ${q(m[2])} to the console (${q("console." + m[1])}).`) },
  { re: /^import\s+(.+)\s+from\s+['"](.+)['"];?$/, text: (m) => T(`${q(m[2])} modulundan ${q(m[1])} idxal edir.`, `Imports ${q(m[1])} from the module ${q(m[2])}.`) },
  { re: /^(?:export\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?\s*\{?\s*$/, text: (m) => T(`${q(m[1])} sinfini elan edir${m[2] ? `; ${q(m[2])} sinfindən törəyir` : ""}.`, `Declares the class ${q(m[1])}${m[2] ? ` extending ${q(m[2])}` : ""}.`) },
  { re: /^try\s*\{?\s*$/, text: () => T("Xəta verə biləcək kod başlayır; xəta `catch` blokunda tutulacaq.", "Starts code that may throw; errors will be caught in `catch`.") },
  { re: /^(?:\}\s*)?catch\s*(?:\((\w+)\))?\s*\{?\s*$/, text: (m) => T(`Xəta baş verdikdə işləyən blok${m[1] ? `; xəta ${q(m[1])} adlanır` : ""}.`, `Runs if an error was thrown${m[1] ? `; the error is named ${q(m[1])}` : ""}.`) },
  { re: /^await\s+(.+?);?$/, text: (m) => T(`${q(m[1])} tamamlanana qədər gözləyir (yalnız \`async\` funksiyada).`, `Waits for ${q(m[1])} to finish (only inside an \`async\` function).`) },
  { re: /^(\w+)(\+\+|--);?$/, text: (m) => T(`${q(m[1])} dəyərini 1 ${m[2] === "++" ? "artırır" : "azaldır"}.`, `${m[2] === "++" ? "Increases" : "Decreases"} ${q(m[1])} by 1.`) },
  { re: /^(\w+)\s*([+\-*/%])=\s*(.+?);?$/, text: (m) => T(`${q(m[1])} dəyərini yeniləyir: ${q(`${m[1]} = ${m[1]} ${m[2]} ${m[3]}`)}.`, `Updates ${q(m[1])}: ${q(`${m[1]} = ${m[1]} ${m[2]} ${m[3]}`)}.`) },
  { re: /^([\w.]+)\s*=\s*(.+?);?$/, text: (m) => T(`${q(m[1])}-ə yeni dəyər verir: ${q(m[2])}.`, `Assigns a new value to ${q(m[1])}: ${q(m[2])}.`) },
  { re: /^(\w+)\.(\w+)\((.*)\);?$/, text: (m) => T(`${q(m[1])} üzərində ${q(m[2])} metodunu çağırır${m[3] ? ` (${q(m[3])})` : ""}.`, `Calls the ${q(m[2])} method on ${q(m[1])}${m[3] ? ` (${q(m[3])})` : ""}.`) },
  { re: /^(\w+)\((.*)\);?$/, text: (m) => T(`${q(m[1])} funksiyasını çağırır${m[2] ? ` (${q(m[2])})` : ""}.`, `Calls the function ${q(m[1])}${m[2] ? ` (${q(m[2])})` : ""}.`) },
];

// ---------------------------------------------------------------- SQL (clause per line)
const SQL: Rule[] = [
  { re: /^select\s+distinct\s+(.+?),?$/i, text: (m) => T(`Təkrarsız (\`DISTINCT\`) dəyərləri seçir: ${q(m[1])}.`, `Selects distinct values of ${q(m[1])}.`) },
  { re: /^select\s+\*\s*(?:from\s+(\w+))?;?$/i, text: (m) => T(`Bütün sütunları seçir${m[1] ? `, ${q(m[1])} cədvəlindən` : ""}.`, `Selects all columns${m[1] ? ` from ${q(m[1])}` : ""}.`) },
  { re: /^select\s+(.+?)\s+from\s+(\w+)(.*)$/i, text: (m) => T(`${q(m[2])} cədvəlindən ${q(m[1])} sütunlarını seçir${m[3].trim() ? " " + q(m[3]) : ""}.`, `Selects ${q(m[1])} from the table ${q(m[2])}${m[3].trim() ? " " + q(m[3]) : ""}.`) },
  { re: /^select\s+(.+?),?$/i, text: (m) => T(`Nəticədə göstəriləcək sütunlar: ${q(m[1])}.`, `Columns to return: ${q(m[1])}.`) },
  { re: /^from\s+(\w+)(?:\s+(?:as\s+)?(\w+))?;?$/i, text: (m) => T(`Məlumat ${q(m[1])} cədvəlindən oxunur${m[2] ? `; qısa adı ${q(m[2])}` : ""}.`, `Data is read from the table ${q(m[1])}${m[2] ? `, aliased ${q(m[2])}` : ""}.`) },
  { re: /^(?:(inner|left|right|full)\s+)?join\s+(\w+)(?:\s+(?:as\s+)?(\w+))?\s+on\s+(.+?);?$/i, text: (m) => T(`${q(m[2])} cədvəlini ${q(m[4])} şərti ilə birləşdirir${m[1] ? ` (${m[1].toUpperCase()} JOIN)` : ""}.`, `Joins the table ${q(m[2])} on ${q(m[4])}${m[1] ? ` (${m[1].toUpperCase()} JOIN)` : ""}.`) },
  { re: /^where\s+(.+?);?$/i, text: (m) => T(`Yalnız ${q(m[1])} şərtini ödəyən sətirlər saxlanılır.`, `Keeps only the rows where ${q(m[1])}.`) },
  { re: /^(and|or)\s+(.+?);?$/i, text: (m) => T(`Şərtə əlavə: ${m[1].toUpperCase() === "AND" ? "həm də" : "və ya"} ${q(m[2])}.`, `Adds to the condition: ${m[1].toUpperCase() === "AND" ? "and also" : "or"} ${q(m[2])}.`) },
  { re: /^group\s+by\s+(.+?);?$/i, text: (m) => T(`Sətirləri ${q(m[1])} dəyərlərinə görə qruplaşdırır.`, `Groups rows by ${q(m[1])}.`) },
  { re: /^having\s+(.+?);?$/i, text: (m) => T(`Qrupları ${q(m[1])} şərti ilə süzür.`, `Filters groups by ${q(m[1])}.`) },
  { re: /^order\s+by\s+(.+?);?$/i, text: (m) => T(`Nəticəni ${q(m[1])} üzrə sıralayır (\`DESC\` — azalan, əks halda artan).`, `Sorts the result by ${q(m[1])} (\`DESC\` descending, otherwise ascending).`) },
  { re: /^limit\s+(\d+)(?:\s+offset\s+(\d+))?;?$/i, text: (m) => T(`Ən çox ${m[1]} sətir qaytarır${m[2] ? `, ilk ${m[2]} sətri ötürərək` : ""}.`, `Returns at most ${m[1]} rows${m[2] ? `, skipping the first ${m[2]}` : ""}.`) },
  { re: /^insert\s+into\s+(\w+)\s*(?:\((.+)\))?.*$/i, text: (m) => T(`${q(m[1])} cədvəlinə yeni sətir əlavə edir${m[2] ? `; sütunlar: ${q(m[2])}` : ""}.`, `Inserts a new row into ${q(m[1])}${m[2] ? `; columns: ${q(m[2])}` : ""}.`) },
  { re: /^values\s*(.+?);?$/i, text: (m) => T(`Əlavə olunacaq dəyərlər: ${q(m[1])}.`, `The values to insert: ${q(m[1])}.`) },
  { re: /^update\s+(\w+)\s*;?$/i, text: (m) => T(`${q(m[1])} cədvəlindəki sətirləri dəyişəcək. \`WHERE\` olmasa bütün sətirlər dəyişir!`, `Will change rows in ${q(m[1])}. Without \`WHERE\`, every row changes!`) },
  { re: /^set\s+(.+?);?$/i, text: (m) => T(`Yeni dəyərlər: ${q(m[1])}.`, `New values: ${q(m[1])}.`) },
  { re: /^delete\s+from\s+(\w+)\s*;?$/i, text: (m) => T(`${q(m[1])} cədvəlindən sətirləri silir. \`WHERE\` olmasa hamısı silinir!`, `Deletes rows from ${q(m[1])}. Without \`WHERE\`, all of them are deleted!`) },
  { re: /^create\s+table\s+(?:if\s+not\s+exists\s+)?(\w+)/i, text: (m) => T(`${q(m[1])} adlı yeni cədvəl yaradır.`, `Creates a new table ${q(m[1])}.`) },
];

/** Guesses the language from the code. Returns null when unsure (UI then asks the user). */
export function detectLanguage(code: string): ExplainLang | null {
  const c = code.trim();
  if (!c) return null;
  if (/^\s*(select|insert\s+into|update\s+\w+|delete\s+from|create\s+table|with\s+\w+\s+as)\b/im.test(c) && !/[{}]|=>|\bdef\b/.test(c)) return "sql";
  const py = (c.match(/^\s*(def |elif |import |from \S+ import |print\(|for \w+ in )|:\s*$|\bNone\b|\bTrue\b|\bFalse\b|#/gm) ?? []).length;
  const js = (c.match(/\b(const|let|var|function|console\.log|=>|===|!==|null|undefined)\b|[{};]\s*$|\/\//gm) ?? []).length;
  if (py === 0 && js === 0) return null;
  return py > js ? "python" : "javascript";
}

function depthsFor(lines: string[], lang: ExplainLang): number[] {
  if (lang === "python") {
    // Indentation levels, normalised to the smallest non-zero indent.
    const indents = lines.map((l) => (l.trim() ? l.match(/^\s*/)![0].replace(/\t/g, "    ").length : -1));
    const unit = Math.min(...indents.filter((n) => n > 0), 4) || 4;
    return indents.map((n) => (n < 0 ? 0 : Math.round(n / unit)));
  }
  if (lang === "javascript") {
    let d = 0;
    return lines.map((l) => {
      const t = l.trim();
      const startsClosing = t.startsWith("}");
      const here = Math.max(0, startsClosing ? d - 1 : d);
      for (const ch of t.replace(/(["'`]).*?\1/g, "")) {
        if (ch === "{") d++;
        else if (ch === "}") d = Math.max(0, d - 1);
      }
      return here;
    });
  }
  return lines.map(() => 0);
}

function collectDefinitions(lines: string[], lang: ExplainLang): Map<string, WordInfo["definedAt"]> {
  const defs = new Map<string, WordInfo["definedAt"]>();
  const add = (name: string, line: number, as: NonNullable<WordInfo["definedAt"]>["as"]) => {
    if (!defs.has(name)) defs.set(name, { line, as });
  };
  lines.forEach((raw, i) => {
    const l = raw.trim();
    const n = i + 1;
    let m: RegExpMatchArray | null;
    if (lang === "python") {
      if ((m = l.match(/^def\s+(\w+)\s*\((.*)\)/))) {
        add(m[1], n, "function");
        m[2].split(",").map((p) => p.split(/[=:]/)[0].trim()).filter(Boolean).forEach((p) => add(p, n, "parameter"));
      } else if ((m = l.match(/^class\s+(\w+)/))) add(m[1], n, "class");
      else if ((m = l.match(/^for\s+(.+?)\s+in\s/))) m[1].split(",").forEach((v) => add(v.trim(), n, "loopVar"));
      else if ((m = l.match(/^(\w+(?:\s*,\s*\w+)*)\s*=[^=]/))) m[1].split(",").forEach((v) => add(v.trim(), n, "variable"));
    } else if (lang === "javascript") {
      if ((m = l.match(/function\s+(\w+)\s*\((.*?)\)/))) {
        add(m[1], n, "function");
        m[2].split(",").map((p) => p.split("=")[0].trim()).filter(Boolean).forEach((p) => add(p, n, "parameter"));
      } else if ((m = l.match(/^(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\(?([\w\s,=]*)\)?\s*=>/))) {
        add(m[1], n, "function");
        m[2].split(",").map((p) => p.split("=")[0].trim()).filter(Boolean).forEach((p) => add(p, n, "parameter"));
      } else if ((m = l.match(/^(?:export\s+)?(?:const|let|var)\s+(\w+)/))) add(m[1], n, "variable");
      else if ((m = l.match(/^for\s*\(\s*(?:const|let|var)\s+(\w+)/))) add(m[1], n, "loopVar");
      else if ((m = l.match(/^(?:export\s+)?class\s+(\w+)/))) add(m[1], n, "class");
    }
  });
  return defs;
}

/** Explains code line by line, plus every known keyword and every name the code defines. */
export function explainCode(code: string, lang: ExplainLang): Explanation {
  const raw = code.replace(/\r\n?/g, "\n").split("\n");
  const rules = lang === "python" ? PY : lang === "javascript" ? JS : SQL;
  const depths = depthsFor(raw, lang);
  const commentRe = lang === "python" ? /^#/ : lang === "sql" ? /^--/ : /^(\/\/|\/\*|\*)/;

  const lines: LineExplanation[] = raw.map((codeLine, i) => {
    const t = codeLine.trim();
    const base = { line: i + 1, code: codeLine, depth: depths[i] };
    if (!t) return { ...base, kind: "blank", text: {} };
    if (commentRe.test(t)) return { ...base, kind: "comment", text: T("Şərh (comment): proqram onu icra etmir, yalnız insanlar üçündür.", "A comment: the program ignores it; it is for humans.") };
    // Strip a trailing comment before matching (outside strings is good enough for teaching snippets).
    const code = t.replace(lang === "python" ? /\s+#.*$/ : lang === "sql" ? /\s+--.*$/ : /\s+\/\/.*$/, "");
    for (const r of rules) {
      const m = code.match(r.re);
      if (m) return { ...base, kind: "known", text: r.text(m) };
    }
    return { ...base, kind: "unknown", text: T("Bu sətrin forması tanınmadı. Aşağıdakı \"Sözlər\" bölməsində ayrı-ayrı açar sözlərin izahına baxın.", "This line's shape was not recognised. See the \"Words\" panel for explanations of its individual keywords.") };
  });

  // Words: known terms + names defined in this code.
  const defs = collectDefinitions(raw, lang);
  const words = new Map<string, WordInfo>();
  const tokenLang = lang;
  raw.forEach((l, i) => {
    for (const tok of tokenizeLine(l, tokenLang)) {
      if (tok.type === "str" || tok.type === "com" || tok.type === "num") continue;
      for (const w of tok.text.match(/[A-Za-z_][\w]*|===|!==|==|=>|&&|\|\|/g) ?? []) {
        const term = findTerm(w, lang) ?? (lang === "javascript" && w === "log" && /console\.log/.test(l) ? findTerm("console.log", lang) : undefined);
        const def = defs.get(w);
        if (!term && !def) continue;
        const key = term ? term.id : `def:${w}`;
        const entry = words.get(key) ?? { token: term ? term.token : w, term, definedAt: def, lines: [] };
        if (!entry.lines.includes(i + 1)) entry.lines.push(i + 1);
        words.set(key, entry);
      }
    }
  });
  // SQL multi-word keywords (ORDER BY, GROUP BY, IS NULL, INSERT INTO)
  if (lang === "sql") {
    raw.forEach((l, i) => {
      for (const kw of ["ORDER BY", "GROUP BY", "IS NULL", "INSERT INTO"]) {
        if (new RegExp(kw.replace(" ", "\\s+"), "i").test(l)) {
          const term = findTerm(kw, "sql");
          if (!term) continue;
          const entry = words.get(term.id) ?? { token: term.token, term, lines: [] };
          if (!entry.lines.includes(i + 1)) entry.lines.push(i + 1);
          words.set(term.id, entry);
        }
      }
    });
  }

  const meaningful = lines.filter((l) => l.kind === "known" || l.kind === "unknown");
  const recognised = meaningful.length ? Math.round((meaningful.filter((l) => l.kind === "known").length / meaningful.length) * 100) : 100;
  return { lang, lines, words: [...words.values()].sort((a, b) => a.lines[0] - b.lines[0]), recognised };
}
