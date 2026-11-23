// Practice database used by Code Lab and SQL exercises. Recreated fresh for every run, so
// learners can INSERT/UPDATE/DELETE freely. Matches the table used in the SQL lessons.
export const SAMPLE_DB_SQL = `
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT, age INTEGER);
INSERT INTO users (id, name, city, age) VALUES
  (1, 'Aysel', 'Baku', 24),
  (2, 'Murad', 'Ganja', 31),
  (3, 'Leyla', 'Baku', 19),
  (4, 'Elvin', 'Shaki', NULL);
CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), product TEXT NOT NULL, amount REAL NOT NULL);
INSERT INTO orders (id, user_id, product, amount) VALUES
  (1, 1, 'Notebook', 12.5),
  (2, 1, 'Pen', 2.0),
  (3, 2, 'Backpack', 45.0),
  (4, 3, 'Notebook', 12.5);
`;

export const SAMPLE_DB_TABLES = [
  { name: "users", columns: "id, name, city, age" },
  { name: "orders", columns: "id, user_id, product, amount" },
];
