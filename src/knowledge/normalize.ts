// Accent-insensitive normalisation shared by every search box (tiny, no content imports).
const MAP: Record<string, string> = { ə: "e", ı: "i", ş: "s", ç: "c", ğ: "g", ö: "o", ü: "u", İ: "i", ё: "е" };

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[əışçğöüİё]/g, (c) => MAP[c] ?? c)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
