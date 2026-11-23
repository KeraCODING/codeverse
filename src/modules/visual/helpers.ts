import type { L } from "../../content/types";
import type { VItem, VPanel, VStep } from "./types";

/** Four-language text (titles, panel names). */
export const P = (az: string, en: string, tr: string, ru: string): L => ({ az, en, tr, ru });

/** Caption: Azerbaijani + English (other locales fall back through the content chain). */
export const C = (az: string, en: string): L => ({ az, en });

export const panel = (id: string, title: L, items: VItem[], layout?: VPanel["layout"]): VPanel => ({ id, title, items, layout });

export const step = (line: number | null, caption: L, panels: VPanel[], extra: Partial<Omit<VStep, "line" | "caption" | "panels">> = {}): VStep => ({
  line,
  caption,
  panels,
  ...extra,
});

/** Shared panel titles. */
export const TT = {
  stack: P("Stek", "Stack", "Yığın (stack)", "Стек"),
  heap: P("Heap (dinamik yaddaş)", "Heap", "Heap (öbek)", "Куча (heap)"),
  callStack: P("Çağırış steki", "Call stack", "Çağrı yığını", "Стек вызовов"),
  vars: P("Dəyişənlər", "Variables", "Değişkenler", "Переменные"),
  condition: P("Şərt", "Condition", "Koşul", "Условие"),
  client: P("Klient", "Client", "İstemci", "Клиент"),
  server: P("Server", "Server", "Sunucu", "Сервер"),
  network: P("Şəbəkə", "Network", "Ağ", "Сеть"),
  database: P("Verilənlər bazası", "Database", "Veritabanı", "База данных"),
  queue: P("Növbə", "Queue", "Kuyruk", "Очередь"),
  webApis: P("Taymerlər (Web API)", "Timers (Web APIs)", "Zamanlayıcılar (Web API)", "Таймеры (Web API)"),
  microtasks: P("Mikrotapşırıq növbəsi", "Microtask queue", "Mikro görev kuyruğu", "Очередь микрозадач"),
  tasks: P("Tapşırıq növbəsi", "Task queue", "Görev kuyruğu", "Очередь задач"),
};
