# CODEVERSE

**Sadəcə kod yazma. Hər sətri başa düş.** — *Don't just write code. Understand every line.*

CODEVERSE proqramlaşdırmanı sıfırdan peşəkar səviyyəyə qədər öyrənmək üçün yüngül, internetsiz işləyən
masaüstü proqramdır. İnterfeys dilləri: Azərbaycan (əsas), Türk, İngilis, Rus.

## Yüklə və quraşdır (Windows 10 / 11)

1. [**Releases**](https://github.com/KeraCODING/codeverse/releases/latest) səhifəsindən
   `CODEVERSE_0.3.0_x64-setup.exe` faylını yükləyin. Python daxil olduğu üçün fayl əvvəlkindən böyükdür; internet olmadan işləyir.
2. Faylı işə salın. Administrator hüququ lazım deyil.
3. Windows "Windows protected your PC" (SmartScreen) desə: **More info → Run anyway**.
   Bu, quraşdırıcının hələ rəqəmsal imzası olmadığı üçündür.

Proqram iş masasında və Start menyusunda "CODEVERSE" qısayolu yaradır. Silmək üçün:
Windows Parametrləri → Proqramlar → CODEVERSE.

## Nələr var

- **Proqramlaşdırma dilləri, inkişaf sahələri, freymvorklar** — 33 dil, 27 sahə, 47 texnologiya
- **Dərslər** — sətir-sətir izah, tipik səhvlər, avtomatik yoxlanan tapşırıqlar və bilik yoxlaması
- **Kod laboratoriyası** — JavaScript, TypeScript, Python 3, SQL və HTML/CSS canlı önizləmə; hamısı təhlükəsiz, təcrid olunmuş mühitdə, internetsiz
- **Əmr paneli (Ctrl+K)** — istənilən bölməyə, dərsə və əmrə klaviaturadan keçid
- **Ağıllı kod izahı, Universal axtarış, Xəta tərcüməçisi, Dillərin müqayisəsi**
- **İnteraktiv öyrənmə** — çağırışlar, xəta tapma, nəticəni təxmin et
- **Qeydlərim, Kod kitabxanası, Kartlar (aralıqlı təkrar), Yol xəritəsi, Layihə mərkəzi**
- **Qısa bələdçilər, Git və GitHub, Git vizualizatoru, Vizual öyrənmə**
- **Kibertəhlükəsizlik akademiyası** — müdafiə yönümlü, təhsil məqsədli

Bütün məlumatlar yalnız sizin kompüterinizdə saxlanılır.

## Developers

```
npm install
npm run dev          # web version at http://localhost:1420
npm test             # unit tests
npm run tauri dev    # desktop window (needs Rust + MSVC build tools)
npm run tauri build  # release exe + NSIS installer
```

If the project path is very long, set a short Cargo target dir first, e.g.
`$env:CARGO_TARGET_DIR = "$env:LOCALAPPDATA\cvt"`.

Stack: Tauri 2 (Rust) · React 19 · TypeScript · Vite · SQLite · CodeMirror 6.
See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/STATUS.md](docs/STATUS.md).
