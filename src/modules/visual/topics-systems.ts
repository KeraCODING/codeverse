// How programs talk to each other: HTTP, client–server APIs and relational data.
import { C, P, TT, panel, step } from "./helpers";
import type { VItem, VTopic } from "./types";

// ───────────────────────── HTTP ─────────────────────────
const L_METHOD = P("Metod", "Method", "Metot", "Метод");
const L_PATH = P("Yol", "Path", "Yol", "Путь");
const L_STATUS = P("Status", "Status", "Durum", "Статус");
const L_BODY = P("Gövdə", "Body", "Gövde", "Тело");
const L_ROUTE = P("İşləyici", "Handler", "İşleyici", "Обработчик");
const L_LOOKUP = P("Axtarış", "Lookup", "Arama", "Поиск");

const req = (n: number, focus = -1): VItem[] =>
  [
    { label: L_METHOD, value: "GET" },
    { label: L_PATH, value: "/api/users/42" },
    { label: "Host", value: "example.com" },
    { label: "Accept", value: "application/json" },
  ]
    .slice(0, n)
    .map((it, i) => (i === focus ? { ...it, tone: "accent" as const } : it));

const http: VTopic = {
  id: "http",
  title: P("HTTP sorğusu və cavabı", "HTTP request & response", "HTTP isteği ve yanıtı", "HTTP-запрос и ответ"),
  summary: C("Brauzer serverdən məlumatı necə istəyir və nə alır.", "How a browser asks a server for data and what comes back."),
  intro: C(
    "HTTP veb-in əsas protokoludur. Klient sorğu (request) göndərir: metod, yol, başlıqlar və istəyə görə gövdə. Server cavab (response) qaytarır: status kodu, başlıqlar və gövdə. Aşağıda sorğu və cavab mətn şəklində göstərilib (HTTP/1.1).",
    "HTTP is the core protocol of the web. The client sends a request: a method, a path, headers and an optional body. The server returns a response: a status code, headers and a body. Below, the request and response are shown as plain text (HTTP/1.1).",
  ),
  code: {
    lang: "plain",
    src: `GET /api/users/42 HTTP/1.1
Host: example.com
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json

{"id": 42, "name": "Aysel"}`,
  },
  steps: [
    step(
      1,
      C(
        "Brauzer sorğunun başlanğıc sətrini qurur: metod (`GET` — məlumatı oxumaq), resursun yolu (`/api/users/42`) və protokol versiyası.",
        "The browser builds the request line: the method (`GET`, to read data), the resource path (`/api/users/42`) and the protocol version.",
      ),
      [panel("client", TT.client, req(2, 0)), panel("net", TT.network, []), panel("server", TT.server, [])],
    ),
    step(
      2,
      C(
        "`Host` başlığı sorğunun hansı sayta göndərildiyini bildirir. Bir serverdə bir neçə sayt yerləşə bildiyi üçün bu başlıq vacibdir.",
        "The `Host` header says which site the request is for. It matters because one server can host several sites.",
      ),
      [panel("client", TT.client, req(3, 2)), panel("net", TT.network, []), panel("server", TT.server, [])],
    ),
    step(
      3,
      C(
        "`Accept` başlığı ilə klient hansı formatda cavab gözlədiyini bildirir — burada JSON. Başlıqlardan sonra boş sətir gəlir; `GET` sorğusunun adətən gövdəsi olmur.",
        "With the `Accept` header the client says which response format it expects, here JSON. An empty line follows the headers; a `GET` request usually has no body.",
      ),
      [panel("client", TT.client, req(4, 3)), panel("net", TT.network, []), panel("server", TT.server, [])],
    ),
    step(
      1,
      C(
        "Sorğu TCP bağlantısı üzərindən serverə göndərilir. HTTPS istifadə olunursa, məlumat yolda TLS ilə şifrələnir.",
        "The request is sent to the server over a TCP connection. With HTTPS, the data is encrypted with TLS on the way.",
      ),
      [
        panel("client", TT.client, req(4)),
        panel("net", TT.network, [{ id: "msg", label: "GET /api/users/42", value: "→", tone: "accent" }]),
        panel("server", TT.server, []),
      ],
      { arrows: [{ from: "client", to: "msg" }, { from: "msg", to: "server" }] },
    ),
    step(
      null,
      C(
        "Server sorğunu oxuyur, yola uyğun işləyicini tapır və istifadəçi 42-ni axtarır.",
        "The server reads the request, finds the handler that matches the path and looks up user 42.",
      ),
      [
        panel("client", TT.client, req(4)),
        panel("net", TT.network, []),
        panel("server", TT.server, [
          { label: L_ROUTE, value: "GET /api/users/:id" },
          { label: L_LOOKUP, value: "id = 42 → Aysel", tone: "accent" },
        ]),
      ],
    ),
    step(
      5,
      C("Cavab status sətri ilə başlayır: `200 OK` sorğunun uğurla icra olunduğunu bildirir.", "The response starts with a status line: `200 OK` means the request succeeded."),
      [
        panel("client", TT.client, req(4)),
        panel("net", TT.network, []),
        panel("server", TT.server, [{ label: L_STATUS, value: "200 OK", tone: "success" }]),
      ],
    ),
    step(
      6,
      C("`Content-Type` başlığı gövdənin formatını göstərir ki, klient onu düzgün oxuya bilsin.", "The `Content-Type` header states the body's format so the client can read it correctly."),
      [
        panel("client", TT.client, req(4)),
        panel("net", TT.network, []),
        panel("server", TT.server, [
          { label: L_STATUS, value: "200 OK" },
          { label: "Content-Type", value: "application/json", tone: "accent" },
        ]),
      ],
    ),
    step(
      8,
      C(
        "Boş sətirdən sonra gövdə gəlir — istifadəçinin JSON formatında məlumatları. Cavab klientə qayıdır və brauzer onu emal edir.",
        "After the empty line comes the body: the user's data as JSON. The response travels back and the browser processes it.",
      ),
      [
        panel("client", TT.client, [{ label: L_STATUS, value: "200 OK" }, { label: L_BODY, value: '{"id": 42, "name": "Aysel"}', tone: "success" }]),
        panel("net", TT.network, [{ id: "msg", label: "200 OK + JSON", value: "←", tone: "accent" }]),
        panel("server", TT.server, [
          { label: L_STATUS, value: "200 OK" },
          { label: "Content-Type", value: "application/json" },
        ]),
      ],
      { arrows: [{ from: "server", to: "msg" }, { from: "msg", to: "client" }] },
    ),
    step(
      null,
      C(
        "Başqa status kodları: `404 Not Found` — resurs tapılmadı, `500 Internal Server Error` — serverdə xəta baş verdi. HTTP vəziyyətsiz (stateless) protokoldur: hər sorğu müstəqildir və server əvvəlki sorğuları özü yadda saxlamır.",
        "Other status codes: `404 Not Found` means the resource does not exist, `500 Internal Server Error` means the server failed. HTTP is stateless: every request is independent and the server does not remember earlier requests by itself.",
      ),
      [
        panel("client", TT.client, [{ label: L_STATUS, value: "200 OK" }, { label: L_BODY, value: '{"id": 42, "name": "Aysel"}' }]),
        panel("net", TT.network, []),
        panel("server", TT.server, [
          { label: "404", value: "Not Found", tone: "warning" },
          { label: "500", value: "Internal Server Error", tone: "error" },
        ]),
      ],
    ),
  ],
};

// ───────────────────────── Client–server & APIs ─────────────────────────
const API_T = P("API server", "API server", "API sunucusu", "API-сервер");
const cs = (client: VItem[], server: VItem[], db: VItem[]) => [panel("client", TT.client, client), panel("api", API_T, server), panel("db", TT.database, db)];
const FETCH: VItem = { label: "fetch", value: "GET /orders?user=42" };
const clientServer: VTopic = {
  id: "clientServer",
  title: P("Klient–server arxitekturası və API", "Client–server architecture & APIs", "İstemci–sunucu mimarisi ve API'ler", "Клиент-серверная архитектура и API"),
  summary: C("Tətbiq, API və verilənlər bazası arasında sorğunun yolu.", "The path of a request between an app, an API and a database."),
  intro: C(
    "Klient–server arxitekturasında klient (brauzer, mobil tətbiq) istifadəçi ilə işləyir, server isə məlumatları və biznes qaydalarını saxlayır. Onlar API vasitəsilə danışır — serverin hansı sorğuları qəbul etdiyini və nə qaytardığını təsvir edən razılaşma.",
    "In a client–server architecture the client (a browser, a mobile app) deals with the user, while the server keeps the data and the business rules. They talk through an API: an agreement describing which requests the server accepts and what it returns.",
  ),
  code: {
    lang: "javascript",
    src: `const res = await fetch("https://api.example.com/orders?user=42");
if (!res.ok) throw new Error("HTTP " + res.status);
const orders = await res.json();
console.log(orders.length);`,
  },
  steps: [
    step(
      1,
      C(
        "Klient API-yə HTTP sorğusu göndərir. API — serverin klientlərə təqdim etdiyi razılaşdırılmış interfeysdir: hansı ünvanlar var, nə qəbul edir, nə qaytarır.",
        "The client sends an HTTP request to the API. An API is the agreed interface a server offers to clients: which endpoints exist, what they accept and what they return.",
      ),
      cs([{ ...FETCH, tone: "accent" }], [], []),
      { arrows: [{ from: "client", to: "api" }] },
    ),
    step(
      1,
      C(
        "Server sorğunu yoxlayır: parametrlər düzgündürmü, istifadəçinin bu məlumata icazəsi varmı? Klientə heç vaxt tam etibar edilmir.",
        "The server validates the request: are the parameters valid, is the user allowed to see this data? The client is never fully trusted.",
      ),
      cs([FETCH], [{ label: P("Yoxlama", "Validation", "Doğrulama", "Проверка"), value: "user = 42 ✓", tone: "accent" }], []),
    ),
    step(
      1,
      C(
        "Server verilənlər bazasına sorğu göndərir. Klient bazaya birbaşa qoşulmur — bazaya yalnız server çıxış əldə edir.",
        "The server queries the database. The client never connects to the database directly; only the server has access to it.",
      ),
      cs([FETCH], [{ label: "SQL", value: "SELECT * FROM orders WHERE user_id = 42", tone: "accent" }], []),
      { arrows: [{ from: "api", to: "db" }] },
    ),
    step(
      1,
      C("Baza uyğun sətirləri (iki sifariş) serverə qaytarır.", "The database returns the matching rows (two orders) to the server."),
      cs(
        [FETCH],
        [{ label: "SQL", value: "SELECT * FROM orders WHERE user_id = 42" }],
        [
          { label: "id 101", value: "user_id 42", tone: "success" },
          { label: "id 102", value: "user_id 42", tone: "success" },
        ],
      ),
      { arrows: [{ from: "db", to: "api" }] },
    ),
    step(
      1,
      C(
        "Server sətirləri JSON formatına çevirir və `200 OK` cavabı göndərir. `await fetch(...)` yalnız cavab gəldikdən sonra davam edir.",
        "The server turns the rows into JSON and sends a `200 OK` response. `await fetch(...)` continues only once the response has arrived.",
      ),
      cs([FETCH], [{ label: P("Cavab", "Response", "Yanıt", "Ответ"), value: "200 OK · JSON", tone: "success" }], [{ label: "id 101", value: "user_id 42" }, { label: "id 102", value: "user_id 42" }]),
      { arrows: [{ from: "api", to: "client" }] },
    ),
    step(
      2,
      C(
        "`fetch` 404 və ya 500 statusunda xəta atmır — yalnız şəbəkə xətası olanda atır. Ona görə `res.ok` əl ilə yoxlanılır.",
        "`fetch` does not throw on a 404 or 500 status, only on network errors. That is why `res.ok` is checked manually.",
      ),
      cs([FETCH, { label: "res.ok", value: "true (200)", tone: "accent" }], [], [{ label: "id 101", value: "user_id 42" }, { label: "id 102", value: "user_id 42" }]),
    ),
    step(
      3,
      C("`res.json()` cavabın gövdəsini oxuyur və JavaScript obyektlərinə çevirir.", "`res.json()` reads the response body and parses it into JavaScript objects."),
      cs([FETCH, { label: "res.ok", value: "true (200)" }, { label: "orders", value: "[{ id: 101 }, { id: 102 }]", tone: "accent" }], [], [
        { label: "id 101", value: "user_id 42" },
        { label: "id 102", value: "user_id 42" },
      ]),
    ),
    step(
      4,
      C(
        "Klient nəticəni göstərir: 2 sifariş. Eyni API-dən həm veb sayt, həm də mobil tətbiq istifadə edə bilər.",
        "The client shows the result: 2 orders. The same API can serve a website and a mobile app alike.",
      ),
      cs([FETCH, { label: "res.ok", value: "true (200)" }, { label: "orders", value: "[{ id: 101 }, { id: 102 }]" }], [], [
        { label: "id 101", value: "user_id 42" },
        { label: "id 102", value: "user_id 42" },
      ]),
      { output: ["2"] },
    ),
  ],
};

// ───────────────────────── Database relationships ─────────────────────────
const USERS_T = P("Cədvəl: users", "Table: users", "Tablo: users", "Таблица: users");
const ORDERS_T = P("Cədvəl: orders", "Table: orders", "Tablo: orders", "Таблица: orders");
type Tones = Partial<Record<string, VItem["tone"]>>;
const users = (t: Tones = {}): VItem[] => [
  { id: "u1", label: "id 1", value: "Aysel", tone: t.u1 },
  { id: "u2", label: "id 2", value: "Murad", tone: t.u2 },
];
const orders = (t: Tones = {}): VItem[] => [
  { id: "o101", label: "id 101", value: "user_id 1 · 25", tone: t.o101 },
  { id: "o102", label: "id 102", value: "user_id 1 · 40", tone: t.o102 },
  { id: "o103", label: "id 103", value: "user_id 2 · 15", tone: t.o103 },
];
const FK_ARROWS = [
  { from: "o101", to: "u1" },
  { from: "o102", to: "u1" },
  { from: "o103", to: "u2" },
];
const database: VTopic = {
  id: "database",
  title: P("Verilənlər bazasında əlaqələr", "Database relationships", "Veritabanı ilişkileri", "Связи в базе данных"),
  summary: C("Birə-çox: bir istifadəçinin çoxlu sifarişi.", "One-to-many: one user, many orders."),
  intro: C(
    "Relyasiya verilənlər bazasında məlumat cədvəllərdə saxlanılır. Cədvəllər açarlarla bağlanır: əsas açar (primary key) sətri birmənalı müəyyən edir, xarici açar (foreign key) isə başqa cədvəlin sətrinə istinad edir.",
    "In a relational database, data is stored in tables. Tables are linked by keys: a primary key identifies a row uniquely, and a foreign key refers to a row in another table.",
  ),
  code: {
    lang: "sql",
    src: `CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total REAL
);
SELECT users.name, orders.total
FROM users JOIN orders ON orders.user_id = users.id
ORDER BY orders.id;`,
  },
  steps: [
    step(
      1,
      C(
        "`users` cədvəli yaradılır. `id` əsas açardır: hər istifadəçini birmənalı müəyyən edir və təkrarlana bilməz.",
        "The `users` table is created. `id` is the primary key: it identifies each user uniquely and cannot repeat.",
      ),
      [panel("users", USERS_T, users({ u1: "success", u2: "success" })), panel("orders", ORDERS_T, [])],
    ),
    step(3, C("`orders` cədvəlinin də öz əsas açarı var.", "The `orders` table has its own primary key too."), [panel("users", USERS_T, users()), panel("orders", ORDERS_T, [])]),
    step(
      4,
      C(
        "`user_id` xarici açardır: hər sifariş `users.id` vasitəsilə bir istifadəçiyə istinad edir. Oxlar bu əlaqəni göstərir.",
        "`user_id` is a foreign key: each order points to one user through `users.id`. The arrows show this link.",
      ),
      [panel("users", USERS_T, users()), panel("orders", ORDERS_T, orders({ o101: "success", o102: "success", o103: "success" }))],
      { arrows: FK_ARROWS },
    ),
    step(
      4,
      C(
        "Bu, birə-çox (one-to-many) əlaqəsidir: Ayselin iki sifarişi var, hər sifariş isə yalnız bir istifadəçiyə aiddir. Xarici açar həmişə \"çox\" tərəfdə — `orders` cədvəlində saxlanılır.",
        "This is a one-to-many relationship: Aysel has two orders, while each order belongs to exactly one user. The foreign key always lives on the \"many\" side, in `orders`.",
      ),
      [panel("users", USERS_T, users({ u1: "accent" })), panel("orders", ORDERS_T, orders({ o101: "accent", o102: "accent" }))],
      { arrows: FK_ARROWS },
    ),
    step(
      4,
      C(
        "Mövcud olmayan istifadəçi (`user_id = 9`) üçün sifariş əlavə etmək cəhdi rədd edilir: xarici açar məhdudiyyəti məlumatların bütövlüyünü qoruyur. (SQLite-da bu yoxlama `PRAGMA foreign_keys = ON` ilə aktivləşdirilir.)",
        "An attempt to add an order for a user who does not exist (`user_id = 9`) is rejected: the foreign key constraint protects data integrity. (In SQLite this check is enabled with `PRAGMA foreign_keys = ON`.)",
      ),
      [panel("users", USERS_T, users()), panel("orders", ORDERS_T, [...orders(), { label: "id 104", value: "user_id 9 ✗", tone: "error" }])],
      { arrows: FK_ARROWS },
    ),
    step(
      8,
      C(
        "`JOIN` hər sifarişi `orders.user_id = users.id` şərtinə görə öz istifadəçisi ilə birləşdirir. Nəticədə hər sifariş üçün bir sətir alınır; `ORDER BY` isə sətirlərin sırasını müəyyən edir.",
        "`JOIN` pairs every order with its user using the condition `orders.user_id = users.id`. The result has one row per order, and `ORDER BY` fixes their order.",
      ),
      [panel("users", USERS_T, users({ u1: "accent", u2: "accent" })), panel("orders", ORDERS_T, orders({ o101: "accent", o102: "accent", o103: "accent" }))],
      { arrows: FK_ARROWS, output: ["Aysel | 25", "Aysel | 40", "Murad | 15"] },
    ),
  ],
};

export const SYSTEM_TOPICS: VTopic[] = [http, clientServer, database];
