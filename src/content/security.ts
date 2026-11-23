// Cybersecurity & Kali Linux Academy — educational, defensive content.
// Rules for this file: no attack walkthroughs, no exploit code, no payloads. Vulnerable patterns
// appear only as a short "code smell" next to the fixed version. Kali tools are described by
// category and purpose only. Explanatory text: az + en; titles: az, en, tr, ru.
import type { CodeLang, L, QuizQuestion, Source } from "./types";

export type SecModuleId = "fundamentals" | "linux" | "networking" | "kali" | "defense" | "web" | "labs" | "roadmap";

export interface SecModule {
  id: SecModuleId;
  letter: string;
  title: L;
  desc: L;
}

export interface SecConcept {
  name: L;
  text: L;
}

export interface SecExample {
  title: L;
  lang: CodeLang;
  code: string;
  explain: L;
}

export interface SecMistake {
  title: L;
  why: L;
  /** Optional short code smell (wrong) next to the fixed version (right). */
  wrong?: string;
  right?: string;
  lang?: CodeLang;
}

export interface SecExercise {
  task: L;
  /** Read-only material to study (sample log, snippet). Nothing is executed. */
  material?: { code: string; lang: CodeLang };
  hints: L[];
  answer: L;
}

export interface SecTopic {
  id: string;
  module: SecModuleId;
  title: L;
  intro: L;
  concepts: SecConcept[];
  examples: SecExample[];
  mistakes: SecMistake[];
  exercise: SecExercise;
  quiz: QuizQuestion[];
  refs: Source[];
}

const l = (az: string, en: string): L => ({ az, en });
const t4 = (az: string, en: string, tr: string, ru: string): L => ({ az, en, tr, ru });
const c = (nameAz: string, nameEn: string, az: string, en: string): SecConcept => ({ name: l(nameAz, nameEn), text: l(az, en) });
const q = (prompt: L, options: (L | string)[], answer: number, explain: L): QuizQuestion => ({ kind: "choice", prompt, options, answer, explain });
const ref = (title: string, url: string): Source => ({ title, url });

export const SECURITY_MODULES: SecModule[] = [
  {
    id: "fundamentals",
    letter: "A",
    title: t4("Təhlükəsizlik əsasları", "Security fundamentals", "Güvenlik temelleri", "Основы безопасности"),
    desc: l(
      "Bütün sahələr üçün ortaq anlayışlar: CIA üçlüyü, autentifikasiya, şifrələmə, giriş nəzarəti və təhdid modelləşdirməsi.",
      "Shared ideas for every area: the CIA triad, authentication, encryption, access control and threat modeling.",
    ),
  },
  {
    id: "linux",
    letter: "B",
    title: t4("Linux əsasları", "Linux fundamentals", "Linux temelleri", "Основы Linux"),
    desc: l(
      "Linux arxitekturası, fayl sistemi, terminal, istifadəçilər, icazələr, proseslər, xidmətlər, paketlər və jurnallar.",
      "Linux architecture, file system, terminal, users, permissions, processes, services, packages and logs.",
    ),
  },
  {
    id: "networking",
    letter: "C",
    title: t4("Şəbəkə əsasları", "Networking", "Ağ temelleri", "Основы сетей"),
    desc: l(
      "IP ünvanları, DNS, TCP və UDP, HTTP/HTTPS və TLS, portlar, marşrutlaşdırma və firewall-lar.",
      "IP addresses, DNS, TCP and UDP, HTTP/HTTPS and TLS, ports, routing and firewalls.",
    ),
  },
  {
    id: "kali",
    letter: "D",
    title: t4("Kali Linux ilə tanışlıq", "Introduction to Kali Linux", "Kali Linux'a giriş", "Знакомство с Kali Linux"),
    desc: l(
      "Kali Linux nədir, kim tərəfindən saxlanılır, alət kateqoriyaları və yalnız icazəli, təcrid olunmuş laboratoriyada istifadə.",
      "What Kali Linux is, who maintains it, tool categories, and use only with authorisation in an isolated lab.",
    ),
  },
  {
    id: "defense",
    letter: "E",
    title: t4("Müdafiə təhlükəsizliyi", "Defensive security", "Savunma güvenliği", "Защитная безопасность"),
    desc: l(
      "Sistemlərin sərtləşdirilməsi, monitorinq, jurnal təhlili, zəiflik idarəetməsi, insidentə cavab və ehtiyat nüsxələr.",
      "Hardening, monitoring, log analysis, vulnerability management, incident response and backups.",
    ),
  },
  {
    id: "web",
    letter: "F",
    title: t4("Veb təhlükəsizliyi", "Web security", "Web güvenliği", "Веб-безопасность"),
    desc: l(
      "OWASP Top 10, təhlükəsiz autentifikasiya və sessiyalar, giriş məlumatlarının yoxlanması, SQL injection və XSS-in qarşısının alınması.",
      "OWASP Top 10, secure authentication and sessions, input validation, preventing SQL injection and XSS.",
    ),
  },
  {
    id: "labs",
    letter: "G",
    title: t4("Təhlükəsiz laboratoriyalar", "Safe labs", "Güvenli laboratuvarlar", "Безопасные лаборатории"),
    desc: l(
      "Təhlükəsiz məşq mühiti və müdafiə tapşırıqları: jurnal oxumaq, təhlükəsiz olmayan kodu düzəltmək, düzgün icazələr seçmək.",
      "Safe practice environments and defensive exercises: read logs, fix insecure code, choose correct permissions.",
    ),
  },
  {
    id: "roadmap",
    letter: "I",
    title: t4("Öyrənmə yol xəritəsi", "Learning roadmap", "Öğrenme yol haritası", "Дорожная карта обучения"),
    desc: l("Modullar üzrə ardıcıl öyrənmə yolu.", "An ordered learning path through the modules."),
  },
];

// ───────────────────────────── A · Fundamentals ─────────────────────────────
const A: SecTopic[] = [
  {
    id: "cia-triad",
    module: "fundamentals",
    title: t4("CIA üçlüyü", "The CIA triad", "CIA üçlüsü", "Триада CIA"),
    intro: l(
      "CIA üçlüyü informasiya təhlükəsizliyinin üç əsas məqsədini təsvir edir: məxfilik (confidentiality), bütövlük (integrity) və əlçatanlıq (availability). Hər bir təhlükəsizlik tədbiri bu məqsədlərdən ən azı birini qoruyur.",
      "The CIA triad describes the three core goals of information security: confidentiality, integrity and availability. Every security control protects at least one of them.",
    ),
    concepts: [
      c("Məxfilik (confidentiality)", "Confidentiality", "Məlumatı yalnız icazəsi olan şəxslər görə bilər. Vasitələr: şifrələmə, giriş nəzarəti.", "Only authorised people can read the data. Tools: encryption, access control."),
      c("Bütövlük (integrity)", "Integrity", "Məlumat icazəsiz və ya təsadüfən dəyişdirilməyib. Vasitələr: hash, rəqəmsal imza, versiya nəzarəti.", "Data has not been changed without authorisation or by accident. Tools: hashes, digital signatures, version control."),
      c("Əlçatanlıq (availability)", "Availability", "Sistem və məlumat lazım olanda istifadə üçün hazırdır. Vasitələr: ehtiyat nüsxə, ehtiyat avadanlıq, monitorinq.", "Systems and data are usable when needed. Tools: backups, redundancy, monitoring."),
    ],
    examples: [
      {
        title: l("Faylın bütövlüyünü hash ilə yoxlamaq", "Checking file integrity with a hash"),
        lang: "plain",
        code: "sha256sum ubuntu.iso\n# compare the result with the checksum published by the vendor",
        explain: l(
          "`sha256sum` faylın SHA-256 hash dəyərini hesablayır. Nəticə rəsmi saytda dərc olunan dəyərlə eynidirsə, fayl yükləmə zamanı dəyişməyib — bu, bütövlüyün yoxlanmasıdır.",
          "`sha256sum` computes the file's SHA-256 hash. If it matches the value published on the official site, the file was not altered in transit — an integrity check.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Yalnız məxfiliyə fokuslanmaq", "Focusing only on confidentiality"),
        why: l(
          "Ehtiyat nüsxəsi olmayan, lakin yaxşı şifrələnmiş sistem disk xarab olanda bütün məlumatı itirir. Üç məqsəd birlikdə planlaşdırılmalıdır.",
          "A well-encrypted system without backups still loses everything when a disk fails. All three goals must be planned together.",
        ),
      },
    ],
    exercise: {
      task: l(
        "Hər hadisə üçün CIA məqsədlərindən hansının pozulduğunu müəyyən edin: (1) müştəri siyahısı ictimai linkdə yayıldı; (2) veb sayt 3 saat açılmadı; (3) qiymət cədvəlində rəqəmlər icazəsiz dəyişdirildi.",
        "For each incident, name the CIA goal that was violated: (1) a customer list leaked through a public link; (2) the website was down for 3 hours; (3) prices in a spreadsheet were changed without authorisation.",
      ),
      hints: [l("Kim görə bilər? İşləyirmi? Düzgündürmü?", "Who can see it? Does it work? Is it correct?")],
      answer: l("(1) məxfilik, (2) əlçatanlıq, (3) bütövlük.", "(1) confidentiality, (2) availability, (3) integrity."),
    },
    quiz: [
      q(
        l("Rəqəmsal imza əsasən hansı məqsədi qoruyur?", "A digital signature mainly protects which goal?"),
        [l("Əlçatanlıq", "Availability"), l("Bütövlük", "Integrity"), l("Heç birini", "None")],
        1,
        l("İmza məlumatın dəyişmədiyini və mənbəyini təsdiq edir — bu, bütövlükdür.", "A signature proves the data is unchanged and shows its origin — that is integrity."),
      ),
      q(
        l("DDoS hücumu ilk növbədə hansı məqsədə təsir edir?", "A DDoS attack primarily affects which goal?"),
        [l("Əlçatanlıq", "Availability"), l("Məxfilik", "Confidentiality"), l("Bütövlük", "Integrity")],
        0,
        l("Xidmətin istifadəçilər üçün əlçatmaz olması əlçatanlığın pozulmasıdır.", "Making a service unreachable for users violates availability."),
      ),
    ],
    refs: [
      ref("NIST Cybersecurity Framework", "https://www.nist.gov/cyberframework"),
      ref("NIST CSRC Glossary — confidentiality", "https://csrc.nist.gov/glossary/term/confidentiality"),
    ],
  },
  {
    id: "authn-vs-authz",
    module: "fundamentals",
    title: t4("Autentifikasiya və avtorizasiya", "Authentication vs authorization", "Kimlik doğrulama ve yetkilendirme", "Аутентификация и авторизация"),
    intro: l(
      "Autentifikasiya (authentication) \"Sən kimsən?\" sualına, avtorizasiya (authorization) isə \"Sənə nə etməyə icazə var?\" sualına cavab verir. Əvvəlcə kimlik təsdiqlənir, sonra hüquqlar yoxlanır.",
      "Authentication answers \"Who are you?\"; authorization answers \"What are you allowed to do?\". Identity is verified first, then permissions are checked.",
    ),
    concepts: [
      c("Autentifikasiya (authentication)", "Authentication", "Kimliyin sübutu: parol, açar, sertifikat, biometrika.", "Proof of identity: password, key, certificate, biometrics."),
      c("Avtorizasiya (authorization)", "Authorization", "Təsdiqlənmiş istifadəçinin hansı resurslara və əməliyyatlara icazəsi olduğu.", "Which resources and actions an authenticated user may access."),
      c("Hesabatlılıq (accounting)", "Accounting / auditing", "Kimin nə etdiyinin jurnala yazılması — sonradan araşdırma üçün vacibdir.", "Recording who did what — essential for later investigation."),
    ],
    examples: [
      {
        title: l("HTTP status kodları fərqi göstərir", "HTTP status codes show the difference"),
        lang: "plain",
        code: "401 Unauthorized  -> not authenticated (log in first)\n403 Forbidden     -> authenticated, but not allowed",
        explain: l(
          "Adına baxmayaraq 401 əslində \"autentifikasiya yoxdur\" deməkdir. 403 isə istifadəçi tanınır, amma bu resursa hüququ yoxdur.",
          "Despite its name, 401 actually means \"not authenticated\". 403 means the user is known but lacks the right to this resource.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Giriş etmək = hər şeyə icazə", "Logged in = allowed everything"),
        why: l(
          "Yalnız istifadəçinin daxil olub-olmadığını yoxlamaq kifayət deyil; hər sorğuda konkret resursa hüququ server tərəfində yoxlanmalıdır.",
          "Checking only that a user is logged in is not enough; the right to the specific resource must be checked on the server for every request.",
        ),
        wrong: "if (user) return getInvoice(req.params.id);",
        right: "const inv = getInvoice(req.params.id);\nif (!user || inv.ownerId !== user.id) return deny(403);\nreturn inv;",
        lang: "javascript",
      },
    ],
    exercise: {
      task: l(
        "Bunlardan hansı autentifikasiya, hansı avtorizasiyadır: (a) SSH açarı ilə daxil olmaq; (b) `sudo` qrupuna üzv olmaq; (c) bank tətbiqində barmaq izi; (d) yalnız administratorun istifadəçi silə bilməsi.",
        "Which are authentication and which are authorization: (a) logging in with an SSH key; (b) being a member of the `sudo` group; (c) a fingerprint in a banking app; (d) only admins can delete users.",
      ),
      hints: [l("Kimliyi sübut edən şey autentifikasiyadır.", "Whatever proves identity is authentication.")],
      answer: l("(a) və (c) autentifikasiya; (b) və (d) avtorizasiya.", "(a) and (c) are authentication; (b) and (d) are authorization."),
    },
    quiz: [
      q(
        l("İstifadəçi daxil olub, lakin başqasının faylını aça bilmir. Hansı status kodu uyğundur?", "A user is logged in but cannot open someone else's file. Which status fits?"),
        ["401", "403", "200"],
        1,
        l("Kimlik məlumdur, hüquq yoxdur — 403 Forbidden.", "Identity is known, permission is missing — 403 Forbidden."),
      ),
      q(
        l("Hansı ardıcıllıq düzgündür?", "Which order is correct?"),
        [l("Əvvəl avtorizasiya, sonra autentifikasiya", "Authorization, then authentication"), l("Əvvəl autentifikasiya, sonra avtorizasiya", "Authentication, then authorization")],
        1,
        l("Kim olduğunu bilmədən hüquqları yoxlamaq mümkün deyil.", "You cannot check rights without knowing who the user is."),
      ),
    ],
    refs: [
      ref("OWASP Authentication Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"),
      ref("OWASP Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"),
      ref("MDN — HTTP response status codes", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"),
    ],
  },
  {
    id: "encryption-vs-hashing",
    module: "fundamentals",
    title: t4("Şifrələmə və hash", "Encryption vs hashing", "Şifreleme ve hash", "Шифрование и хеширование"),
    intro: l(
      "Şifrələmə (encryption) iki istiqamətlidir: açarla məlumatı gizlədib yenidən aça bilərsiniz. Hash (hashing) bir istiqamətlidir: girişdən sabit uzunluqlu \"barmaq izi\" alınır və geri qaytarmaq nəzərdə tutulmayıb.",
      "Encryption is two-way: with the key you can hide data and recover it. Hashing is one-way: input becomes a fixed-length \"fingerprint\" that is not meant to be reversed.",
    ),
    concepts: [
      c("Simmetrik şifrələmə (symmetric)", "Symmetric encryption", "Eyni açar həm şifrələyir, həm açır (məsələn, AES). Sürətlidir.", "The same key encrypts and decrypts (e.g. AES). Fast."),
      c("Asimmetrik şifrələmə (asymmetric)", "Asymmetric encryption", "Açıq açar (public key) şifrələyir, gizli açar (private key) açır (məsələn, RSA, ECC). Açar mübadiləsi və imzalar üçün.", "A public key encrypts, a private key decrypts (e.g. RSA, ECC). Used for key exchange and signatures."),
      c("Hash funksiyası (hash function)", "Hash function", "SHA-256 kimi funksiyalar bütövlüyü yoxlamaq üçündür. Parollar üçün isə yavaş, duzlu (salted) alqoritmlər lazımdır: Argon2id, scrypt, bcrypt.", "Functions like SHA-256 check integrity. Passwords need slow, salted algorithms: Argon2id, scrypt, bcrypt."),
    ],
    examples: [
      {
        title: l("Parolu duz və scrypt ilə saxlamaq (Python standart kitabxanası)", "Storing a password with salt and scrypt (Python standard library)"),
        lang: "python",
        code: "import hashlib, hmac, os\n\nsalt = os.urandom(16)\nhashed = hashlib.scrypt(password.encode(), salt=salt, n=2**14, r=8, p=1)\n# store salt + hashed; to verify, recompute and compare:\nok = hmac.compare_digest(hashed, hashlib.scrypt(attempt.encode(), salt=salt, n=2**14, r=8, p=1))",
        explain: l(
          "Hər parol üçün təsadüfi duz (salt) yaradılır, scrypt isə qəsdən yavaşdır. `hmac.compare_digest` müqayisəni sabit vaxtda edir. Real layihələrdə çox vaxt Argon2id və ya bcrypt kitabxanası istifadə olunur.",
          "A random salt is created per password and scrypt is deliberately slow. `hmac.compare_digest` compares in constant time. Real projects often use an Argon2id or bcrypt library.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Parolu sürətli hash ilə saxlamaq", "Storing passwords with a fast hash"),
        why: l(
          "MD5 və SHA-256 sürətli olduğu üçün sızmış bazada parolları təxmin etmək asanlaşır. Parollar üçün xüsusi, yavaş və duzlu funksiya istifadə edin.",
          "MD5 and SHA-256 are fast, so guessing passwords from a leaked database is easy. Use a dedicated slow, salted password function.",
        ),
        wrong: "stored = hashlib.md5(password.encode()).hexdigest()",
        right: "stored = hashlib.scrypt(password.encode(), salt=salt, n=2**14, r=8, p=1)",
        lang: "python",
      },
      {
        title: l("Base64-ü şifrələmə hesab etmək", "Treating Base64 as encryption"),
        why: l("Base64 sadəcə kodlaşdırmadır (encoding); açar tələb etmir və hər kəs onu geri çevirə bilər.", "Base64 is only encoding; it needs no key and anyone can reverse it."),
      },
    ],
    exercise: {
      task: l(
        "Hər vəziyyət üçün şifrələmə, hash və ya parol hash-i seçin: (1) noutbuk diskini qorumaq; (2) yüklənmiş faylı yoxlamaq; (3) istifadəçi parollarını bazada saxlamaq.",
        "Choose encryption, hashing or password hashing for each: (1) protecting a laptop disk; (2) verifying a downloaded file; (3) storing user passwords in a database.",
      ),
      hints: [l("Məlumatı sonra geri oxumaq lazımdırmı?", "Do you need to read the data back later?")],
      answer: l("(1) şifrələmə (məsələn, LUKS); (2) hash (SHA-256); (3) parol hash-i (Argon2id/scrypt/bcrypt).", "(1) encryption (e.g. LUKS); (2) hashing (SHA-256); (3) password hashing (Argon2id/scrypt/bcrypt)."),
    },
    quiz: [
      q(
        l("Hansı ifadə doğrudur?", "Which statement is true?"),
        [l("Hash açarla geri açılır", "A hash is reversed with a key"), l("Şifrələmə açarla geri açılır", "Encryption is reversed with a key"), l("Base64 təhlükəsiz şifrələmədir", "Base64 is secure encryption")],
        1,
        l("Şifrələmə iki istiqamətlidir; hash bir istiqamətlidir; Base64 isə kodlaşdırmadır.", "Encryption is two-way; hashing is one-way; Base64 is just encoding."),
      ),
      q(
        l("Duz (salt) nə üçündür?", "What is a salt for?"),
        [l("Hash-i qısaltmaq üçün", "To shorten the hash"), l("Eyni parolların eyni hash verməməsi üçün", "So identical passwords do not give identical hashes"), l("Parolu şifrələmək üçün", "To encrypt the password")],
        1,
        l("Təsadüfi duz hər hash-i unikal edir və əvvəlcədən hesablanmış cədvəlləri yararsız edir.", "A random salt makes every hash unique and defeats precomputed tables."),
      ),
    ],
    refs: [
      ref("OWASP Password Storage Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html"),
      ref("OWASP Cryptographic Storage Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html"),
      ref("Python docs — hashlib", "https://docs.python.org/3/library/hashlib.html"),
    ],
  },
  {
    id: "mfa",
    module: "fundamentals",
    title: t4("Çoxfaktorlu autentifikasiya (MFA)", "Multi-factor authentication (MFA)", "Çok faktörlü kimlik doğrulama (MFA)", "Многофакторная аутентификация (MFA)"),
    intro: l(
      "MFA girişdə ən azı iki fərqli növ sübut tələb edir. Parol oğurlansa belə, ikinci faktor olmadan hesaba daxil olmaq çətinləşir.",
      "MFA requires at least two different kinds of proof at login. Even if a password is stolen, the account is hard to access without the second factor.",
    ),
    concepts: [
      c("Bildiyin şey (knowledge)", "Something you know", "Parol, PIN.", "Password, PIN."),
      c("Sahib olduğun şey (possession)", "Something you have", "Telefonda TOTP tətbiqi, FIDO2/WebAuthn təhlükəsizlik açarı.", "A TOTP app on a phone, a FIDO2/WebAuthn security key."),
      c("Olduğun şey (inherence)", "Something you are", "Barmaq izi, üz tanıma.", "Fingerprint, face recognition."),
      c("Fişinqə davamlı MFA (phishing-resistant)", "Phishing-resistant MFA", "FIDO2/WebAuthn açarları saytın domeninə bağlıdır, ona görə saxta saytda işləmir — SMS kodlarından daha güclüdür.", "FIDO2/WebAuthn keys are bound to the site's domain, so they do not work on a fake site — stronger than SMS codes."),
    ],
    examples: [
      {
        title: l("TOTP necə işləyir (konseptual)", "How TOTP works (conceptually)"),
        lang: "plain",
        code: "shared secret (set up once via QR code)\n+ current time / 30 s\n= 6-digit code (RFC 6238)",
        explain: l(
          "Server və tətbiq eyni gizli açarı paylaşır. Hər 30 saniyədən bir hər ikisi eyni kodu hesablayır, ona görə kod şəbəkə ilə əvvəlcədən göndərilmir.",
          "The server and the app share a secret. Every 30 seconds both compute the same code, so the code is never sent in advance.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Ehtiyat (recovery) kodlarını saxlamamaq", "Not keeping recovery codes"),
        why: l("Telefon itəndə hesabı bərpa etmək üçün ehtiyat kodlarını təhlükəsiz yerdə (parol menecerində) saxlayın.", "When a phone is lost, recovery codes restore access — keep them somewhere safe, such as a password manager."),
      },
      {
        title: l("Gözlənilməz MFA sorğusunu təsdiqləmək", "Approving an unexpected MFA prompt"),
        why: l("Sizin başlatmadığınız təsdiq sorğusu parolunuzun başqasında olduğunu göstərə bilər. Rədd edin və parolu dəyişin.", "A prompt you did not start may mean someone else has your password. Deny it and change the password."),
      },
    ],
    exercise: {
      task: l(
        "Bu kombinasiyalardan hansılar həqiqi MFA-dır: (a) parol + təhlükəsizlik sualı; (b) parol + TOTP kodu; (c) PIN + barmaq izi?",
        "Which combinations are real MFA: (a) password + security question; (b) password + TOTP code; (c) PIN + fingerprint?",
      ),
      hints: [l("Faktorlar fərqli növlərdən olmalıdır.", "The factors must be of different kinds.")],
      answer: l("(b) və (c). (a) iki \"bildiyin şey\"dir, yəni eyni faktor növüdür.", "(b) and (c). (a) is two \"something you know\" factors — the same kind."),
    },
    quiz: [
      q(
        l("Hansı faktor fişinqə ən davamlıdır?", "Which factor resists phishing best?"),
        [l("SMS kodu", "SMS code"), l("FIDO2/WebAuthn açarı", "FIDO2/WebAuthn key"), l("E-poçt linki", "Email link")],
        1,
        l("WebAuthn imzası saytın domeninə bağlıdır, saxta domendə işləmir.", "A WebAuthn signature is bound to the site's domain and fails on a fake domain."),
      ),
      q(
        l("TOTP kodu adətən nə qədər müddətə etibarlıdır?", "How long is a TOTP code usually valid?"),
        [l("30 saniyə", "30 seconds"), l("24 saat", "24 hours"), l("Həmişəlik", "Forever")],
        0,
        l("RFC 6238 adətən 30 saniyəlik vaxt addımı istifadə edir.", "RFC 6238 typically uses a 30-second time step."),
      ),
    ],
    refs: [
      ref("OWASP Multifactor Authentication Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"),
      ref("RFC 6238 — TOTP", "https://www.rfc-editor.org/rfc/rfc6238"),
      ref("CISA — More than a password", "https://www.cisa.gov/MFA"),
    ],
  },
  {
    id: "password-security",
    module: "fundamentals",
    title: t4("Parol təhlükəsizliyi", "Password security", "Parola güvenliği", "Безопасность паролей"),
    intro: l(
      "Güclü parol uzun, unikal və təxmin edilməsi çətin olandır. Müasir tövsiyələr mürəkkəb qaydalardan çox uzunluğa, parol menecerinə və sızmış parolların yoxlanmasına üstünlük verir.",
      "A strong password is long, unique and hard to guess. Modern guidance favours length, password managers and checking against breached passwords over complex composition rules.",
    ),
    concepts: [
      c("Uzunluq (length)", "Length", "Bir neçə təsadüfi sözdən ibarət uzun parol ifadəsi (passphrase) qısa, mürəkkəb paroldan daha güclüdür.", "A long passphrase of several random words beats a short complex password."),
      c("Unikallıq (uniqueness)", "Uniqueness", "Hər sayt üçün ayrı parol: bir sayt sızsa, digər hesablar təhlükəsiz qalır.", "A separate password per site: if one site leaks, other accounts stay safe."),
      c("Parol meneceri (password manager)", "Password manager", "Uzun, təsadüfi parollar yaradır və saxlayır; siz yalnız bir əsas parolu yadda saxlayırsınız.", "Generates and stores long random passwords; you remember only one master password."),
      c("Sızma yoxlaması (breach check)", "Breach checking", "NIST SP 800-63B xidmətlərə yeni parolu məlum sızmış parol siyahıları ilə yoxlamağı tövsiyə edir.", "NIST SP 800-63B recommends services check new passwords against lists of known breached passwords."),
    ],
    examples: [
      {
        title: l("Linux-da öz parolunuzu dəyişmək", "Changing your own password on Linux"),
        lang: "plain",
        code: "passwd\n# you are asked for the current password, then the new one twice",
        explain: l(
          "`passwd` cari istifadəçinin parolunu dəyişir. Parollar `/etc/shadow` faylında hash şəklində saxlanır və bu faylı yalnız root oxuya bilər.",
          "`passwd` changes the current user's password. Passwords are stored as hashes in `/etc/shadow`, which only root can read.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Parolu kodun içində saxlamaq", "Hard-coding a password in source code"),
        why: l("Kod repozitoriyaya düşəndə parol da yayılır. Sirləri mühit dəyişənlərində və ya sirr menecerində saxlayın.", "When code reaches a repository, the password spreads with it. Keep secrets in environment variables or a secrets manager."),
        wrong: "DB_PASSWORD = \"Summer2024!\"",
        right: "DB_PASSWORD = os.environ[\"DB_PASSWORD\"]",
        lang: "python",
      },
      {
        title: l("Məcburi dövri dəyişiklik", "Forced periodic changes"),
        why: l("NIST sızma əlaməti olmadan parolların müntəzəm məcburi dəyişdirilməsini tövsiyə etmir — bu, zəif, ardıcıl parollara gətirib çıxarır.", "NIST does not recommend forced periodic changes without signs of compromise — it leads to weak, predictable passwords."),
      },
    ],
    exercise: {
      task: l(
        "Ən güclüdən ən zəifə sıralayın: `P@ss1`, `correct-horse-battery-staple-lamp`, `Qwerty2024!`.",
        "Rank from strongest to weakest: `P@ss1`, `correct-horse-battery-staple-lamp`, `Qwerty2024!`.",
      ),
      hints: [l("Uzunluğa və lüğətdə tez-tez rast gəlinən nümunələrə baxın.", "Look at length and common dictionary patterns.")],
      answer: l(
        "Ən güclü: uzun parol ifadəsi; sonra `Qwerty2024!` (məşhur klaviatura nümunəsidir); ən zəif: `P@ss1` (çox qısadır). Əslində, real həyatda nümunə kimi dərc olunmuş parolu heç vaxt istifadə etməyin.",
        "Strongest: the long passphrase; then `Qwerty2024!` (a well-known keyboard pattern); weakest: `P@ss1` (too short). In real life, never use any password that has been published as an example.",
      ),
    },
    quiz: [
      q(
        l("Parolun gücünə ən çox nə təsir edir?", "What affects password strength the most?"),
        [l("Uzunluq və təsadüfilik", "Length and randomness"), l("Bir simvol əlavə etmək", "Adding one symbol"), l("Hər ay dəyişmək", "Changing it every month")],
        0,
        l("Uzun və təsadüfi parolu təxmin etmək üçün lazım olan cəhd sayı kəskin artır.", "Length and randomness sharply increase the number of guesses needed."),
      ),
      q(
        l("Linux-da parol hash-ləri harada saxlanır?", "Where are password hashes stored on Linux?"),
        ["/etc/passwd", "/etc/shadow", "/home/passwords"],
        1,
        l("`/etc/passwd` hamı tərəfindən oxunur və hash saxlamır; hash-lər `/etc/shadow`-dadır.", "`/etc/passwd` is world-readable and holds no hashes; hashes live in `/etc/shadow`."),
      ),
    ],
    refs: [
      ref("NIST SP 800-63B — Authentication and Authenticator Management", "https://pages.nist.gov/800-63-4/sp800-63b.html"),
      ref("man7.org — shadow(5)", "https://man7.org/linux/man-pages/man5/shadow.5.html"),
      ref("OWASP Authentication Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"),
    ],
  },
  {
    id: "access-control",
    module: "fundamentals",
    title: t4("Giriş nəzarəti", "Access control", "Erişim kontrolü", "Управление доступом"),
    intro: l(
      "Giriş nəzarəti (access control) kimin hansı resursa necə daxil ola biləcəyini müəyyən edir. Əsas prinsip ən az imtiyazdır (least privilege): hər kəsə yalnız işi üçün lazım olan qədər hüquq verilir.",
      "Access control decides who can access which resource and how. The core principle is least privilege: everyone gets only the rights their job needs.",
    ),
    concepts: [
      c("Ən az imtiyaz (least privilege)", "Least privilege", "Hesab və proseslər minimum hüquqla işləyir; administrator hüququ yalnız lazım olanda istifadə olunur.", "Accounts and processes run with minimum rights; admin rights are used only when needed."),
      c("DAC", "DAC (discretionary)", "Resursun sahibi icazələri təyin edir — Linux fayl icazələri buna nümunədir.", "The owner of a resource sets permissions — Linux file permissions are an example."),
      c("RBAC", "RBAC (role-based)", "Hüquqlar rollara verilir (məsələn, \"redaktor\"), istifadəçilər isə rollara əlavə olunur.", "Rights are given to roles (e.g. \"editor\") and users are assigned roles."),
      c("Default deny", "Default deny", "Açıq şəkildə icazə verilməyən hər şey qadağandır.", "Anything not explicitly allowed is denied."),
    ],
    examples: [
      {
        title: l("Sadə RBAC yoxlaması", "A simple RBAC check"),
        lang: "javascript",
        code: "const ROLE_PERMS = { viewer: [\"read\"], editor: [\"read\", \"write\"] };\n\nfunction can(user, action) {\n  return (ROLE_PERMS[user.role] ?? []).includes(action);\n}",
        explain: l(
          "Hər rolun icazə siyahısı var. Naməlum rol üçün boş siyahı qaytarılır — bu, \"default deny\" prinsipidir.",
          "Each role has a permission list. An unknown role gets an empty list — the \"default deny\" principle.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Gündəlik iş üçün administrator hesabı", "Using an admin account for daily work"),
        why: l("Adi hesabla işləyin və lazım olanda `sudo` istifadə edin; beləliklə səhv və ya zərərli proqram bütün sistemə təsir etmir.", "Work as a normal user and use `sudo` when needed, so a mistake or malicious program cannot affect the whole system."),
      },
    ],
    exercise: {
      task: l(
        "Kiçik bloq üçün üç rol təklif edin (oxucu, müəllif, admin) və hər birinə \"oxumaq\", \"yazmaq\", \"silmək\", \"istifadəçi idarə etmək\" hüquqlarından hansıları lazım olduğunu yazın.",
        "Propose three roles for a small blog (reader, author, admin) and list which of \"read\", \"write\", \"delete\", \"manage users\" each needs.",
      ),
      hints: [l("Hər rol üçün minimumdan başlayın.", "Start from the minimum for each role.")],
      answer: l("Oxucu: oxumaq. Müəllif: oxumaq, yazmaq (öz yazıları). Admin: hamısı. Silmək və istifadəçi idarəsi yalnız adminə verilir.", "Reader: read. Author: read, write (own posts). Admin: all. Delete and user management go only to admin."),
    },
    quiz: [
      q(
        l("\"Ən az imtiyaz\" nə deməkdir?", "What does \"least privilege\" mean?"),
        [l("Hamıya eyni hüquq", "Equal rights for all"), l("Yalnız iş üçün lazım olan hüquq", "Only the rights the job needs"), l("Hüquqsuz iş", "Working with no rights")],
        1,
        l("Minimum hüquq səhvlərin və hücumların təsirini azaldır.", "Minimal rights reduce the impact of mistakes and attacks."),
      ),
      q(
        l("Linux fayl icazələri hansı modelə nümunədir?", "Linux file permissions are an example of which model?"),
        ["DAC", "RBAC", l("Heç biri", "Neither")],
        0,
        l("Faylın sahibi icazələri özü dəyişə bilir — bu, DAC-dır.", "A file's owner can change its permissions — that is DAC."),
      ),
    ],
    refs: [
      ref("OWASP Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"),
      ref("NIST CSRC Glossary — least privilege", "https://csrc.nist.gov/glossary/term/least_privilege"),
    ],
  },
  {
    id: "threat-modeling",
    module: "fundamentals",
    title: t4("Təhdid modelləşdirməsi", "Threat modeling", "Tehdit modelleme", "Моделирование угроз"),
    intro: l(
      "Təhdid modelləşdirməsi (threat modeling) sistem qurulmazdan əvvəl \"Nə səhv gedə bilər?\" sualını sistemli şəkildə soruşmaqdır. Məqsəd riskləri erkən tapıb müdafiə tədbirlərini planlaşdırmaqdır.",
      "Threat modeling is systematically asking \"What can go wrong?\" before a system is built. The goal is to find risks early and plan defences.",
    ),
    concepts: [
      c("Dörd sual", "Four questions", "Nə üzərində işləyirik? Nə səhv gedə bilər? Bununla bağlı nə edəcəyik? Yaxşı iş gördükmü?", "What are we working on? What can go wrong? What are we going to do about it? Did we do a good job?"),
      c("STRIDE", "STRIDE", "Təhdid növləri: Spoofing (saxtalaşdırma), Tampering (dəyişdirmə), Repudiation (inkar), Information disclosure (məlumat sızması), Denial of service (xidmətdən imtina), Elevation of privilege (imtiyaz artırma).", "Threat types: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege."),
      c("Etibar sərhədi (trust boundary)", "Trust boundary", "Məlumatın daha az etibarlı zonadan daha etibarlı zonaya keçdiyi yer (məsələn, brauzerdən serverə). Yoxlamalar burada aparılır.", "Where data moves from a less trusted to a more trusted zone (e.g. browser to server). Checks happen here."),
    ],
    examples: [
      {
        title: l("Giriş forması üçün mini STRIDE cədvəli", "A mini STRIDE table for a login form"),
        lang: "plain",
        code: "Spoofing        -> stolen password      -> MFA\nTampering       -> modified request     -> server-side validation\nRepudiation     -> \"I didn't log in\"    -> audit logs\nInfo disclosure -> traffic sniffing     -> HTTPS (TLS)\nDenial of svc   -> login flood          -> rate limiting\nElevation       -> role change in form  -> server-side authorization",
        explain: l(
          "Hər STRIDE kateqoriyası üçün bir təhdid və ona qarşı bir müdafiə yazılır. Bu cədvəl dizayn zamanı müzakirə üçün sadə başlanğıcdır.",
          "For each STRIDE category one threat and one defence is written down. This table is a simple starting point for design discussions.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Təhdid modelini bir dəfə edib unutmaq", "Doing it once and forgetting it"),
        why: l("Sistem dəyişdikcə (yeni API, yeni inteqrasiya) model də yenilənməlidir.", "As the system changes (new API, new integration) the model must be updated."),
      },
    ],
    exercise: {
      task: l(
        "Fayl yükləmə funksiyası üçün STRIDE-dan ən azı üç təhdid və hər biri üçün bir müdafiə yazın.",
        "Write at least three STRIDE threats for a file-upload feature and one defence for each.",
      ),
      hints: [l("Faylın ölçüsü, növü və kimin onu görə biləcəyi barədə düşünün.", "Think about file size, file type and who can see the file.")],
      answer: l(
        "Nümunə: Tampering — faylın növünü saxtalaşdırmaq → server tərəfində növ və ölçü yoxlaması; Information disclosure — başqasının faylını açmaq → hər faylda sahib yoxlaması; Denial of service — çox böyük fayllar → ölçü limiti və sürət məhdudiyyəti.",
        "Example: Tampering — faking the file type → server-side type and size checks; Information disclosure — opening someone else's file → owner check on every file; Denial of service — huge files → size limits and rate limiting.",
      ),
    },
    quiz: [
      q(
        l("STRIDE-da \"E\" nəyi bildirir?", "What does the \"E\" in STRIDE stand for?"),
        ["Encryption", "Elevation of privilege", "Exploitation"],
        1,
        l("E — Elevation of privilege, yəni icazəsiz yüksək hüquq əldə etmək.", "E is Elevation of privilege — gaining higher rights without permission."),
      ),
      q(
        l("Təhdid modelləşdirməsini nə vaxt etmək ən səmərəlidir?", "When is threat modeling most effective?"),
        [l("Dizayn zamanı", "During design"), l("Yalnız insidentdən sonra", "Only after an incident"), l("Heç vaxt", "Never")],
        0,
        l("Dizayn zamanı tapılan problemi düzəltmək ən ucuz başa gəlir.", "Problems found during design are the cheapest to fix."),
      ),
    ],
    refs: [
      ref("OWASP Threat Modeling Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"),
      ref("OWASP — Threat Modeling", "https://owasp.org/www-community/Threat_Modeling"),
      ref("Threat Modeling Manifesto", "https://www.threatmodelingmanifesto.org/"),
    ],
  },
  {
    id: "security-policies",
    module: "fundamentals",
    title: t4("Təhlükəsizlik siyasətləri", "Security policies", "Güvenlik politikaları", "Политики безопасности"),
    intro: l(
      "Təhlükəsizlik siyasəti (security policy) təşkilatın qaydalarını yazılı şəkildə müəyyən edir: kim nəyə cavabdehdir, hansı davranış qəbul ediləndir və insident baş verəndə nə edilir.",
      "A security policy writes down an organisation's rules: who is responsible for what, which behaviour is acceptable and what happens during an incident.",
    ),
    concepts: [
      c("Siyasət, standart, prosedur", "Policy, standard, procedure", "Siyasət \"nə\" və \"niyə\"ni deyir, standart konkret tələbləri, prosedur isə addım-addım \"necə\"ni.", "A policy states \"what\" and \"why\", a standard gives concrete requirements, a procedure gives the step-by-step \"how\"."),
      c("Məqbul istifadə siyasəti (AUP)", "Acceptable use policy", "İşçilərin cihaz və şəbəkədən necə istifadə edə biləcəyini müəyyən edir.", "Defines how staff may use devices and the network."),
      c("Risk idarəetməsi (risk management)", "Risk management", "Risk = ehtimal × təsir. Siyasətlər hansı riskin qəbul, azaldılma, ötürülmə və ya qaçınma yolu ilə idarə olunacağını müəyyən edir.", "Risk = likelihood × impact. Policies decide whether a risk is accepted, reduced, transferred or avoided."),
    ],
    examples: [
      {
        title: l("security.txt — zəiflik bildirmə siyasəti", "security.txt — a vulnerability disclosure policy"),
        lang: "plain",
        code: "# https://example.com/.well-known/security.txt\nContact: mailto:security@example.com\nExpires: 2027-12-31T23:00:00.000Z\nPolicy: https://example.com/security-policy\nPreferred-Languages: en, az",
        explain: l(
          "RFC 9116 standartı tədqiqatçıların zəiflikləri kimə və necə bildirəcəyini göstərən faylı təsvir edir. `Contact` və `Expires` sahələri məcburidir.",
          "RFC 9116 defines a file that tells researchers whom to contact and how to report vulnerabilities. `Contact` and `Expires` are required fields.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Heç kimin oxumadığı siyasət", "A policy nobody reads"),
        why: l("Siyasət qısa, aydın olmalı, təlimlə dəstəklənməli və müntəzəm yenilənməlidir; əks halda yalnız kağız üzərində qalır.", "A policy must be short, clear, backed by training and reviewed regularly; otherwise it exists only on paper."),
      },
    ],
    exercise: {
      task: l(
        "Kiçik komanda üçün parol siyasətindən 4 qısa qayda yazın.",
        "Write 4 short rules for a small team's password policy.",
      ),
      hints: [l("Uzunluq, unikallıq, MFA və sızma halında nə ediləcəyini düşünün.", "Think about length, uniqueness, MFA and what to do after a leak.")],
      answer: l(
        "Nümunə: (1) ən azı 15 simvol və ya parol ifadəsi; (2) hər xidmət üçün unikal parol, parol meneceri ilə; (3) bütün iş hesablarında MFA; (4) sızma şübhəsi olduqda dərhal dəyişmək və təhlükəsizlik məsul şəxsinə bildirmək.",
        "Example: (1) at least 15 characters or a passphrase; (2) a unique password per service, using a password manager; (3) MFA on all work accounts; (4) change immediately and report to the security contact when a leak is suspected.",
      ),
    },
    quiz: [
      q(
        l("Addım-addım təlimatı hansı sənəd verir?", "Which document gives step-by-step instructions?"),
        [l("Siyasət", "Policy"), l("Prosedur", "Procedure"), l("Standart", "Standard")],
        1,
        l("Prosedur konkret addımları təsvir edir.", "A procedure describes concrete steps."),
      ),
      q(
        l("security.txt faylı adətən harada yerləşir?", "Where is security.txt usually located?"),
        ["/.well-known/security.txt", "/etc/security.txt", "/admin/security.txt"],
        0,
        l("RFC 9116 `/.well-known/` yolunu müəyyən edir.", "RFC 9116 specifies the `/.well-known/` path."),
      ),
    ],
    refs: [
      ref("RFC 9116 — security.txt", "https://www.rfc-editor.org/rfc/rfc9116"),
      ref("NIST Cybersecurity Framework", "https://www.nist.gov/cyberframework"),
    ],
  },
];

// ───────────────────────────── B · Linux fundamentals ─────────────────────────────
const B: SecTopic[] = [
  {
    id: "linux-architecture",
    module: "linux",
    title: t4("Linux arxitekturası", "Linux architecture", "Linux mimarisi", "Архитектура Linux"),
    intro: l(
      "Linux əslində nüvədir (kernel); paylanmalar (distributions — Debian, Ubuntu, Fedora, Kali) nüvəni istifadəçi proqramları, paket meneceri və init sistemi ilə birləşdirir.",
      "Linux is strictly the kernel; distributions (Debian, Ubuntu, Fedora, Kali) combine it with user programs, a package manager and an init system.",
    ),
    concepts: [
      c("Nüvə (kernel)", "Kernel", "Avadanlığı, yaddaşı, prosesləri və fayl sistemlərini idarə edir. Proqramlar nüvə ilə sistem çağırışları (system calls) vasitəsilə danışır.", "Manages hardware, memory, processes and file systems. Programs talk to it through system calls."),
      c("İstifadəçi sahəsi (user space)", "User space", "Shell, kitabxanalar və proqramlar burada işləyir və avadanlığa birbaşa çıxışı yoxdur.", "Shells, libraries and programs run here without direct hardware access."),
      c("Init sistemi (systemd)", "Init system (systemd)", "Nüvədən sonra ilk başlayan proses (PID 1); xidmətləri işə salır və idarə edir.", "The first process after the kernel (PID 1); it starts and manages services."),
    ],
    examples: [
      {
        title: l("Sistem haqqında məlumat", "Information about the system"),
        lang: "plain",
        code: "uname -r            # kernel version\ncat /etc/os-release # distribution name and version\nps -p 1 -o comm=    # name of PID 1 (usually systemd)",
        explain: l(
          "Bu əmrlər yalnız məlumat oxuyur, heç nəyi dəyişmir. Nüvə versiyasını bilmək yeniləmələri və təhlükəsizlik bildirişlərini izləmək üçün vacibdir.",
          "These commands only read information and change nothing. Knowing the kernel version matters for tracking updates and security advisories.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Nüvə yeniləməsindən sonra yenidən başlatmamaq", "Not rebooting after a kernel update"),
        why: l("Yeni nüvə yalnız yenidən başlatmadan sonra işə düşür; o vaxta qədər köhnə, zəif nüvə işləməyə davam edir.", "A new kernel runs only after a reboot; the old, vulnerable kernel keeps running until then."),
      },
    ],
    exercise: {
      task: l(
        "Aşağıdakıları nüvə və ya istifadəçi sahəsi kimi qruplaşdırın: disk drayveri, `bash`, yaddaş idarəsi, mətn redaktoru.",
        "Group these as kernel or user space: disk driver, `bash`, memory management, a text editor.",
      ),
      hints: [l("Avadanlıqla birbaşa işləyən hissə nüvədir.", "The part that works directly with hardware is the kernel.")],
      answer: l("Nüvə: disk drayveri, yaddaş idarəsi. İstifadəçi sahəsi: `bash`, mətn redaktoru.", "Kernel: disk driver, memory management. User space: `bash`, text editor."),
    },
    quiz: [
      q(
        l("PID 1 adətən hansı prosesdir?", "Which process is usually PID 1?"),
        ["bash", "systemd", "sshd"],
        1,
        l("Müasir paylanmaların əksəriyyətində PID 1 systemd-dir.", "On most modern distributions PID 1 is systemd."),
      ),
      q(
        l("Kali Linux hansı paylanmaya əsaslanır?", "Which distribution is Kali Linux based on?"),
        ["Debian", "Fedora", "Arch"],
        0,
        l("Kali Debian əsaslıdır və `apt` istifadə edir.", "Kali is Debian-based and uses `apt`."),
      ),
    ],
    refs: [
      ref("The Linux Kernel documentation", "https://docs.kernel.org/"),
      ref("man7.org — uname(1)", "https://man7.org/linux/man-pages/man1/uname.1.html"),
      ref("man7.org — os-release(5)", "https://man7.org/linux/man-pages/man5/os-release.5.html"),
    ],
  },
  {
    id: "linux-filesystem",
    module: "linux",
    title: t4("Fayl sistemi", "The file system", "Dosya sistemi", "Файловая система"),
    intro: l(
      "Linux-da hər şey kök qovluqdan (`/`) başlayan bir ağacdır. Qovluqların təyinatını bilmək konfiqurasiyanı, jurnalları və riskli icazələri tapmağa kömək edir.",
      "On Linux everything is one tree starting at the root directory (`/`). Knowing what each directory is for helps you find configuration, logs and risky permissions.",
    ),
    concepts: [
      c("/etc", "/etc", "Sistem konfiqurasiya faylları (məsələn, `/etc/ssh/sshd_config`).", "System configuration files (e.g. `/etc/ssh/sshd_config`)."),
      c("/var/log", "/var/log", "Jurnal faylları; təhlükəsizlik araşdırmasında ilk baxılan yerlərdən biri.", "Log files; one of the first places to look during an investigation."),
      c("/home və /root", "/home and /root", "İstifadəçilərin şəxsi qovluqları; `/root` administratorun qovluğudur.", "Users' personal directories; `/root` belongs to the administrator."),
      c("/tmp", "/tmp", "Hamının yaza biləcəyi müvəqqəti qovluq; \"sticky bit\" sayəsində istifadəçilər bir-birinin faylını silə bilmir.", "A world-writable temporary directory; the sticky bit stops users deleting each other's files."),
    ],
    examples: [
      {
        title: l("Qovluqlara baxmaq", "Looking at directories"),
        lang: "plain",
        code: "ls -ld /tmp     # drwxrwxrwt ... the final t is the sticky bit\nls -l /etc/ssh  # SSH configuration files\ndf -h           # disk usage per file system",
        explain: l(
          "`ls -ld` qovluğun özünün icazələrini göstərir. `df -h` disk doluluğunu oxunaqlı ölçülərlə göstərir — dolu disk əlçatanlıq problemidir.",
          "`ls -ld` shows the permissions of the directory itself. `df -h` shows disk usage in readable units — a full disk is an availability problem.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Həssas faylları /tmp-də saxlamaq", "Keeping sensitive files in /tmp"),
        why: l("`/tmp` paylaşılan qovluqdur; orada yaradılan faylın icazələri düzgün qurulmasa, digər istifadəçilər onu oxuya bilər.", "`/tmp` is shared; if permissions are not set correctly, other users can read files created there."),
      },
    ],
    exercise: {
      task: l(
        "Hansı qovluğa baxardınız: (1) SSH server parametrləri; (2) giriş cəhdlərinin jurnalı; (3) `alice` istifadəçisinin sənədləri?",
        "Which directory would you check for: (1) SSH server settings; (2) a log of login attempts; (3) user `alice`'s documents?",
      ),
      hints: [l("Konfiqurasiya, jurnal, şəxsi qovluq.", "Configuration, logs, personal directory.")],
      answer: l("(1) `/etc/ssh/`; (2) `/var/log/` (və ya `journalctl`); (3) `/home/alice/`.", "(1) `/etc/ssh/`; (2) `/var/log/` (or `journalctl`); (3) `/home/alice/`."),
    },
    quiz: [
      q(
        l("Konfiqurasiya faylları adətən harada olur?", "Where do configuration files usually live?"),
        ["/etc", "/bin", "/tmp"],
        0,
        l("`/etc` sistem konfiqurasiyası üçündür.", "`/etc` is for system configuration."),
      ),
      q(
        l("`/tmp` qovluğundakı `t` hərfi nəyi göstərir?", "What does the `t` on `/tmp` indicate?"),
        [l("Sticky bit", "Sticky bit"), l("Müvəqqəti şifrələmə", "Temporary encryption"), l("Mətn faylı", "Text file")],
        0,
        l("Sticky bit-li qovluqda faylı yalnız onun sahibi (və ya root) silə bilər.", "In a sticky directory only a file's owner (or root) can delete it."),
      ),
    ],
    refs: [
      ref("man7.org — hier(7)", "https://man7.org/linux/man-pages/man7/hier.7.html"),
      ref("Filesystem Hierarchy Standard", "https://refspecs.linuxfoundation.org/fhs.shtml"),
    ],
  },
  {
    id: "linux-terminal",
    module: "linux",
    title: t4("Terminal", "The terminal", "Terminal", "Терминал"),
    intro: l(
      "Terminal mətn əmrləri ilə sistemi idarə etməyə imkan verir. Əmrlər çox vaxt `əmr -seçimlər arqumentlər` formasında olur və `|` (pipe) ilə bir-birinə birləşdirilə bilər.",
      "The terminal lets you control the system with text commands. Commands usually look like `command -options arguments` and can be chained with `|` (pipe).",
    ),
    concepts: [
      c("Naviqasiya (navigation)", "Navigation", "`pwd` harada olduğunuzu, `ls` məzmunu göstərir, `cd` qovluğu dəyişir.", "`pwd` shows where you are, `ls` lists contents, `cd` changes directory."),
      c("Pipe və yönləndirmə (redirection)", "Pipes and redirection", "`|` bir əmrin çıxışını digərinə ötürür; `>` faylı üzərinə yazır, `>>` sonuna əlavə edir.", "`|` passes one command's output to another; `>` overwrites a file, `>>` appends."),
      c("Kömək (help)", "Help", "`man əmr` rəsmi təlimatı açır; `əmr --help` qısa kömək göstərir.", "`man command` opens the manual; `command --help` shows short help."),
    ],
    examples: [
      {
        title: l("Faylda axtarış", "Searching in a file"),
        lang: "plain",
        code: "grep -i \"error\" app.log | less\ngrep -c \"error\" app.log      # count matching lines\nman grep",
        explain: l(
          "`grep -i` böyük-kiçik hərfə baxmadan axtarır, nəticə `less` ilə səhifə-səhifə göstərilir. `-c` uyğun sətirlərin sayını verir.",
          "`grep -i` searches case-insensitively and `less` pages the result. `-c` prints the number of matching lines.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("İnternetdən kopyalanan əmri anlamadan işlətmək", "Running a copied command without understanding it"),
        why: l("Xüsusilə `sudo` ilə başlayan və ya skripti birbaşa shell-ə ötürən əmrlər sistemi dəyişə bilər. Əvvəlcə `man` ilə hər hissəni yoxlayın.", "Commands starting with `sudo` or piping a script straight into a shell can change the system. Check every part with `man` first."),
        wrong: "curl -s https://unknown.example/install.sh | sudo bash",
        right: "curl -sO https://trusted.example/install.sh\nless install.sh   # read it first, verify the source and checksum",
        lang: "plain",
      },
    ],
    exercise: {
      task: l(
        "`notes.txt` faylında \"todo\" sözü olan sətirləri tapan və nəticəni `todo.txt` faylına yazan əmri yazın.",
        "Write a command that finds lines containing \"todo\" in `notes.txt` and writes the result to `todo.txt`.",
      ),
      hints: [l("`grep` və `>` istifadə edin.", "Use `grep` and `>`.")],
      answer: l("`grep -i \"todo\" notes.txt > todo.txt`", "`grep -i \"todo\" notes.txt > todo.txt`"),
    },
    quiz: [
      q(
        l("`>>` nə edir?", "What does `>>` do?"),
        [l("Faylı silir", "Deletes the file"), l("Çıxışı faylın sonuna əlavə edir", "Appends output to the file"), l("Faylı üzərinə yazır", "Overwrites the file")],
        1,
        l("`>>` əlavə edir, `>` isə faylı üzərinə yazır.", "`>>` appends, `>` overwrites."),
      ),
      q(
        l("Əmrin rəsmi təlimatını necə açırsınız?", "How do you open a command's manual?"),
        ["man ls", "help -ls", "ls ?"],
        0,
        l("`man` təlimat səhifəsini açır.", "`man` opens the manual page."),
      ),
    ],
    refs: [
      ref("GNU Bash Reference Manual", "https://www.gnu.org/software/bash/manual/bash.html"),
      ref("man7.org — grep(1)", "https://man7.org/linux/man-pages/man1/grep.1.html"),
    ],
  },
  {
    id: "linux-users-groups",
    module: "linux",
    title: t4("İstifadəçilər və qruplar", "Users and groups", "Kullanıcılar ve gruplar", "Пользователи и группы"),
    intro: l(
      "Linux çoxistifadəçili sistemdir. Hər istifadəçinin UID-i, hər qrupun GID-i var; fayllara və əmrlərə giriş bu identifikatorlar əsasında yoxlanır.",
      "Linux is multi-user. Every user has a UID and every group a GID; access to files and commands is checked against these identifiers.",
    ),
    concepts: [
      c("root (UID 0)", "root (UID 0)", "Məhdudiyyətsiz administrator. Gündəlik işdə onunla daxil olmaq tövsiyə edilmir.", "The unrestricted administrator. Logging in as root for daily work is discouraged."),
      c("sudo", "sudo", "İcazəli istifadəçiyə ayrıca əmri root hüququ ilə icra etməyə imkan verir və hər istifadəni jurnala yazır.", "Lets an authorised user run a single command as root and logs each use."),
      c("/etc/passwd və /etc/group", "/etc/passwd and /etc/group", "Hesablar və qrup üzvlükləri burada saxlanır; parol hash-ləri isə `/etc/shadow`-dadır.", "Accounts and group memberships are stored here; password hashes are in `/etc/shadow`."),
    ],
    examples: [
      {
        title: l("İstifadəçi və qrup idarəsi", "Managing users and groups"),
        lang: "plain",
        code: "id                                  # your UID, GID and groups\nsudo adduser alice                  # create a user (Debian/Kali)\nsudo usermod -aG developers alice   # add alice to a supplementary group\ngetent group developers             # who is in the group",
        explain: l(
          "`usermod -aG` istifadəçini əlavə qrupa daxil edir; `-a` (append) olmadan digər əlavə qruplar əvəz olunur. Dəyişiklik istifadəçi yenidən daxil olduqdan sonra qüvvəyə minir.",
          "`usermod -aG` adds the user to a supplementary group; without `-a` (append) the other supplementary groups are replaced. It takes effect after the user logs in again.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("`-a` olmadan `usermod -G`", "`usermod -G` without `-a`"),
        why: l("`-G` qrup siyahısını tamamilə əvəz edir və istifadəçi, məsələn, `sudo` qrupundan çıxa bilər.", "`-G` replaces the whole group list, so the user may drop out of groups such as `sudo`."),
        wrong: "sudo usermod -G developers alice",
        right: "sudo usermod -aG developers alice",
        lang: "plain",
      },
    ],
    exercise: {
      task: l(
        "`bob` adlı istifadəçi `docs` qrupuna əlavə edilməlidir, amma digər qruplarını itirməməlidir. Hansı əmri işlədərsiniz və dəyişikliyi necə yoxlayarsınız?",
        "User `bob` must be added to group `docs` without losing his other groups. Which command do you run and how do you verify it?",
      ),
      hints: [l("Append seçimini unutmayın.", "Remember the append option.")],
      answer: l("`sudo usermod -aG docs bob`, sonra `id bob` və ya `groups bob` ilə yoxlamaq.", "`sudo usermod -aG docs bob`, then check with `id bob` or `groups bob`."),
    },
    quiz: [
      q(
        l("root istifadəçisinin UID-i nədir?", "What is root's UID?"),
        ["0", "1", "1000"],
        0,
        l("UID 0 həmişə root-dur.", "UID 0 is always root."),
      ),
      q(
        l("Hansı əmr cari istifadəçinin qruplarını göstərir?", "Which command shows the current user's groups?"),
        ["id", "whoami -g", "ls -g"],
        0,
        l("`id` UID, GID və bütün qrupları göstərir (`groups` əmri də işləyir).", "`id` shows UID, GID and all groups (`groups` also works)."),
      ),
    ],
    refs: [
      ref("man7.org — credentials(7)", "https://man7.org/linux/man-pages/man7/credentials.7.html"),
      ref("man7.org — passwd(5)", "https://man7.org/linux/man-pages/man5/passwd.5.html"),
      ref("man7.org — usermod(8)", "https://man7.org/linux/man-pages/man8/usermod.8.html"),
    ],
  },
  {
    id: "linux-permissions",
    module: "linux",
    title: t4("Fayl icazələri: chmod və chown", "File permissions: chmod and chown", "Dosya izinleri: chmod ve chown", "Права доступа: chmod и chown"),
    intro: l(
      "Hər faylın sahibi (user), qrupu (group) və digərləri (others) üçün oxumaq (r), yazmaq (w) və icra (x) icazələri var. Rəqəmsal formada r=4, w=2, x=1 toplanır.",
      "Every file has read (r), write (w) and execute (x) permissions for its owner (user), group and others. In numeric form r=4, w=2, x=1 are added up.",
    ),
    concepts: [
      c("Rəqəmsal rejim (numeric mode)", "Numeric mode", "Hər rəqəm bir sinif üçündür: `640` = sahib rw- (6), qrup r-- (4), digərləri --- (0).", "Each digit is one class: `640` = owner rw- (6), group r-- (4), others --- (0)."),
      c("Simvolik rejim (symbolic mode)", "Symbolic mode", "`u+x` sahibə icra hüququ əlavə edir, `o-r` digərlərindən oxuma hüququnu götürür.", "`u+x` adds execute for the owner, `o-r` removes read from others."),
      c("Qovluqlarda x", "x on directories", "Qovluqda `x` içəri daxil olmağa (`cd`), `r` isə siyahını görməyə imkan verir.", "On a directory `x` lets you enter it (`cd`); `r` lets you list it."),
      c("chown", "chown", "Faylın sahibini və qrupunu dəyişir: `chown alice:developers fayl`.", "Changes a file's owner and group: `chown alice:developers file`."),
    ],
    examples: [
      {
        title: l("Tipik təhlükəsiz icazələr", "Typical safe permissions"),
        lang: "plain",
        code: "chmod 700 ~/.ssh                 # rwx------ only you\nchmod 600 ~/.ssh/id_ed25519      # rw------- private key\nchmod 644 index.html             # rw-r--r-- public web file\nsudo chown www-data:www-data /srv/app/uploads\nls -l ~/.ssh",
        explain: l(
          "Gizli açar yalnız sahib tərəfindən oxunmalıdır (600); OpenSSH icazələri çox açıq olan açarı rədd edir. Veb faylları hamı üçün oxunaqlı ola bilər, lakin yazmaq hüququ yalnız sahibdə qalır.",
          "A private key must be readable only by its owner (600); OpenSSH refuses keys whose permissions are too open. Web files can be world-readable, but only the owner can write.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Problemi `chmod 777` ilə \"həll etmək\"", "\"Fixing\" problems with `chmod 777`"),
        why: l("777 hər kəsə yazmaq və icra hüququ verir. Əvəzində düzgün sahibi təyin edin və minimum icazə verin.", "777 gives everyone write and execute rights. Set the correct owner and grant the minimum instead."),
        wrong: "chmod -R 777 /var/www",
        right: "sudo chown -R www-data:www-data /var/www/app/uploads\nchmod 750 /var/www/app/uploads",
        lang: "plain",
      },
    ],
    exercise: {
      task: l(
        "`config.env` faylında verilənlər bazasının parolu var. Sahib oxuyub yaza bilməli, `app` qrupu yalnız oxumalı, digərləri heç nə edə bilməməlidir. Rəqəmsal rejim nədir?",
        "`config.env` contains a database password. The owner must read and write, group `app` only read, and others nothing. What is the numeric mode?",
      ),
      hints: [l("rw- = 4+2, r-- = 4, --- = 0.", "rw- = 4+2, r-- = 4, --- = 0.")],
      answer: l("`chmod 640 config.env` (və `chown istifadəçi:app config.env`).", "`chmod 640 config.env` (and `chown user:app config.env`)."),
    },
    quiz: [
      q(
        l("`chmod 755` hansı icazələri verir?", "Which permissions does `chmod 755` give?"),
        ["rwxr-xr-x", "rwxrwxrwx", "rw-r--r--"],
        0,
        l("7 = rwx, 5 = r-x.", "7 = rwx, 5 = r-x."),
      ),
      q(
        l("SSH gizli açarı üçün tövsiyə olunan rejim hansıdır?", "Which mode is recommended for an SSH private key?"),
        ["644", "600", "777"],
        1,
        l("600 — yalnız sahib oxuyub yaza bilər.", "600 — only the owner can read and write."),
      ),
      q(
        l("Qovluğa `cd` ilə daxil olmaq üçün hansı icazə lazımdır?", "Which permission is needed to `cd` into a directory?"),
        ["r", "w", "x"],
        2,
        l("Qovluqlarda `x` keçid (search) hüququdur.", "On directories `x` is the search (traverse) right."),
      ),
    ],
    refs: [
      ref("man7.org — chmod(1)", "https://man7.org/linux/man-pages/man1/chmod.1.html"),
      ref("man7.org — chown(1)", "https://man7.org/linux/man-pages/man1/chown.1.html"),
      ref("man7.org — inode(7) (file type and mode)", "https://man7.org/linux/man-pages/man7/inode.7.html"),
    ],
  },
  {
    id: "linux-processes",
    module: "linux",
    title: t4("Proseslər", "Processes", "Süreçler", "Процессы"),
    intro: l(
      "Proses işləyən proqramdır. Hər prosesin PID-i, sahibi və valideyni (parent) var. Prosesləri izləmək gözlənilməz və ya çox resurs istifadə edən proqramları tapmağa kömək edir.",
      "A process is a running program. Each has a PID, an owner and a parent. Watching processes helps you spot unexpected or resource-hungry programs.",
    ),
    concepts: [
      c("PID və PPID", "PID and PPID", "Prosesin və onun valideyninin identifikatorları.", "Identifiers of the process and its parent."),
      c("Siqnallar (signals)", "Signals", "`SIGTERM` (15) prosesdən səliqəli dayanmağı xahiş edir; `SIGKILL` (9) onu dərhal dayandırır və son çarədir.", "`SIGTERM` (15) asks a process to stop cleanly; `SIGKILL` (9) stops it immediately and is a last resort."),
      c("Ön və arxa plan (foreground/background)", "Foreground and background", "`&` əmri arxa planda başladır; `jobs`, `fg`, `bg` onları idarə edir.", "`&` starts a command in the background; `jobs`, `fg`, `bg` manage them."),
    ],
    examples: [
      {
        title: l("Prosesləri görmək və dayandırmaq", "Viewing and stopping processes"),
        lang: "plain",
        code: "ps aux --sort=-%cpu | head -5   # top CPU users\npgrep -a python                 # PIDs and command lines\nkill 4242                       # send SIGTERM to PID 4242\ntop                             # live view (q to quit)",
        explain: l(
          "`ps aux` bütün prosesləri göstərir; `--sort=-%cpu` onları CPU istifadəsinə görə azalan sıra ilə düzür. `kill` default olaraq SIGTERM göndərir.",
          "`ps aux` lists all processes; `--sort=-%cpu` sorts them by CPU use, descending. `kill` sends SIGTERM by default.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Dərhal `kill -9` istifadə etmək", "Reaching for `kill -9` first"),
        why: l("SIGKILL prosesə faylları bağlamağa və məlumatı yadda saxlamağa imkan vermir. Əvvəlcə SIGTERM göndərin.", "SIGKILL gives the process no chance to close files or save data. Send SIGTERM first."),
        wrong: "kill -9 4242",
        right: "kill 4242      # SIGTERM; use -9 only if it does not stop",
        lang: "plain",
      },
    ],
    exercise: {
      task: l(
        "Serverdə tanımadığınız, `root` adından işləyən və çox CPU istifadə edən proses görürsünüz. Onu dayandırmazdan əvvəl hansı məlumatları toplayardınız?",
        "You see an unknown process running as `root` and using a lot of CPU. What information would you collect before stopping it?",
      ),
      hints: [l("PID, tam əmr sətri, valideyn proses, başlama vaxtı.", "PID, full command line, parent process, start time.")],
      answer: l(
        "`ps -o pid,ppid,user,lstart,cmd -p PID` ilə əmr sətrini, valideyni və başlama vaxtını qeyd edin, jurnallara baxın və insident kimi bildirin. Sübutları qorumaq üçün tələsik heç nə silməyin.",
        "Record the command line, parent and start time with `ps -o pid,ppid,user,lstart,cmd -p PID`, check the logs and report it as an incident. Do not hastily delete anything — preserve evidence.",
      ),
    },
    quiz: [
      q(
        l("`kill PID` default olaraq hansı siqnalı göndərir?", "Which signal does `kill PID` send by default?"),
        ["SIGKILL", "SIGTERM", "SIGHUP"],
        1,
        l("Default siqnal SIGTERM-dir (15).", "The default signal is SIGTERM (15)."),
      ),
      q(
        l("Hansı əmr canlı resurs istifadəsini göstərir?", "Which command shows live resource use?"),
        ["top", "ls", "cat"],
        0,
        l("`top` (və ya `htop`) prosesləri canlı göstərir.", "`top` (or `htop`) shows processes live."),
      ),
    ],
    refs: [
      ref("man7.org — ps(1)", "https://man7.org/linux/man-pages/man1/ps.1.html"),
      ref("man7.org — kill(1)", "https://man7.org/linux/man-pages/man1/kill.1.html"),
      ref("man7.org — signal(7)", "https://man7.org/linux/man-pages/man7/signal.7.html"),
    ],
  },
  {
    id: "linux-services",
    module: "linux",
    title: t4("Xidmətlər və systemd", "Services and systemd", "Servisler ve systemd", "Службы и systemd"),
    intro: l(
      "Xidmət (service) arxa planda daim işləyən prosesdir (veb server, SSH). systemd xidmətləri unit faylları vasitəsilə idarə edir. Lazım olmayan xidmətləri söndürmək hücum səthini (attack surface) azaldır.",
      "A service is a long-running background process (web server, SSH). systemd manages services through unit files. Disabling unneeded services reduces the attack surface.",
    ),
    concepts: [
      c("Unit faylı (unit file)", "Unit file", "Xidmətin necə başladığını təsvir edir: `ExecStart`, `User`, `Restart` və s.", "Describes how a service starts: `ExecStart`, `User`, `Restart`, etc."),
      c("start/stop və enable/disable", "start/stop vs enable/disable", "`start` xidməti indi işə salır; `enable` isə sistem açılanda avtomatik başlamasını təmin edir.", "`start` runs it now; `enable` makes it start automatically at boot."),
      c("Xidmətin hüquqları", "Service privileges", "Xidməti ayrıca, imtiyazsız istifadəçi adından işlətmək (`User=`) ən az imtiyaz prinsipinə uyğundur.", "Running a service as a dedicated unprivileged user (`User=`) follows least privilege."),
    ],
    examples: [
      {
        title: l("Xidmətləri yoxlamaq və idarə etmək", "Checking and managing services"),
        lang: "plain",
        code: "systemctl status ssh\nsystemctl list-units --type=service --state=running\nsudo systemctl restart ssh\nsudo systemctl disable --now cups   # stop and disable an unneeded service",
        explain: l(
          "`status` xidmətin vəziyyətini və son jurnal sətirlərini göstərir. `disable --now` xidməti həm dayandırır, həm də avtomatik başlamasını söndürür.",
          "`status` shows the state and the latest log lines. `disable --now` both stops the service and prevents it starting at boot.",
        ),
      },
      {
        title: l("İmtiyazsız istifadəçi ilə unit faylı", "A unit file with an unprivileged user"),
        lang: "plain",
        code: "[Unit]\nDescription=Example web app\n\n[Service]\nUser=webapp\nExecStart=/opt/webapp/bin/server\nRestart=on-failure\nNoNewPrivileges=yes\n\n[Install]\nWantedBy=multi-user.target",
        explain: l(
          "`User=webapp` xidməti root olmadan işlədir; `NoNewPrivileges=yes` prosesin yeni imtiyaz qazanmasının qarşısını alır.",
          "`User=webapp` runs the service without root; `NoNewPrivileges=yes` stops the process from gaining new privileges.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Hər xidməti root kimi işlətmək", "Running every service as root"),
        why: l("Xidmətdə zəiflik olarsa, root kimi işləyən proses bütün sistemi təhlükəyə atır.", "If the service has a vulnerability, a root process puts the whole system at risk."),
      },
    ],
    exercise: {
      task: l(
        "Serverdə yalnız SSH və veb server lazımdır, lakin `systemctl list-units --type=service --state=running` çap xidmətini (`cups`) də göstərir. Nə edərdiniz?",
        "A server needs only SSH and a web server, but `systemctl list-units --type=service --state=running` also shows the printing service (`cups`). What would you do?",
      ),
      hints: [l("Həm dayandırmaq, həm də avtomatik başlamanı söndürmək lazımdır.", "You need to both stop it and stop it starting at boot.")],
      answer: l("`sudo systemctl disable --now cups`, sonra `systemctl status cups` ilə yoxlamaq. Ümumiyyətlə lazım deyilsə, paketi silmək də olar.", "`sudo systemctl disable --now cups`, then verify with `systemctl status cups`. If it is not needed at all, remove the package."),
    },
    quiz: [
      q(
        l("Xidmətin sistem açılanda başlaması üçün hansı əmr lazımdır?", "Which command makes a service start at boot?"),
        ["systemctl start", "systemctl enable", "systemctl status"],
        1,
        l("`enable` avtomatik başlamanı aktivləşdirir.", "`enable` turns on starting at boot."),
      ),
      q(
        l("Lazımsız xidmətləri söndürmək nəyi azaldır?", "What does disabling unneeded services reduce?"),
        [l("Hücum səthini", "The attack surface"), l("Disk ölçüsünü", "Disk size"), l("İstifadəçi sayını", "The number of users")],
        0,
        l("Hər işləyən xidmət potensial giriş nöqtəsidir.", "Every running service is a potential entry point."),
      ),
    ],
    refs: [
      ref("man7.org — systemctl(1)", "https://man7.org/linux/man-pages/man1/systemctl.1.html"),
      ref("man7.org — systemd.service(5)", "https://man7.org/linux/man-pages/man5/systemd.service.5.html"),
      ref("man7.org — systemd.exec(5)", "https://man7.org/linux/man-pages/man5/systemd.exec.5.html"),
    ],
  },
  {
    id: "linux-packages",
    module: "linux",
    title: t4("Paket idarəsi: apt", "Package management: apt", "Paket yönetimi: apt", "Управление пакетами: apt"),
    intro: l(
      "Debian əsaslı sistemlərdə (Ubuntu, Kali) proqramlar `apt` ilə rəsmi repozitoriyalardan quraşdırılır. Repozitoriyalar imzalanır və `apt` imzaları avtomatik yoxlayır. Müntəzəm yeniləmə ən vacib müdafiə tədbirlərindən biridir.",
      "On Debian-based systems (Ubuntu, Kali) software is installed with `apt` from official repositories. Repositories are signed and `apt` verifies the signatures automatically. Regular updates are one of the most important defences.",
    ),
    concepts: [
      c("Repozitoriya (repository)", "Repository", "Paketlərin imzalanmış siyahısı olan server. Mənbələr `/etc/apt/sources.list` faylında və `/etc/apt/sources.list.d/` qovluğunda göstərilir.", "A server with a signed package list. Sources are listed in `/etc/apt/sources.list` and `/etc/apt/sources.list.d/`."),
      c("update və upgrade", "update vs upgrade", "`apt update` paket siyahılarını yeniləyir; `apt upgrade` quraşdırılmış paketləri yeni versiyaya keçirir.", "`apt update` refreshes package lists; `apt upgrade` installs newer versions of installed packages."),
      c("Asılılıqlar (dependencies)", "Dependencies", "`apt` paketin tələb etdiyi digər paketləri avtomatik quraşdırır.", "`apt` installs the other packages a package requires."),
    ],
    examples: [
      {
        title: l("Əsas apt əmrləri", "Core apt commands"),
        lang: "plain",
        code: "sudo apt update\nsudo apt upgrade\napt search ufw\napt show ufw\nsudo apt install ufw\nsudo apt remove telnet\nsudo apt autoremove",
        explain: l(
          "Əvvəl siyahılar, sonra paketlər yenilənir. `apt show` paketin təsvirini və mənbəyini göstərir. `autoremove` artıq lazım olmayan asılılıqları silir.",
          "Lists are refreshed first, then packages. `apt show` displays a package's description and origin. `autoremove` removes dependencies that are no longer needed.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Naməlum mənbələrdən .deb faylı quraşdırmaq", "Installing .deb files from unknown sources"),
        why: l("Rəsmi repozitoriyadan kənar paket imza yoxlamasından keçmir və quraşdırma zamanı istənilən kodu root kimi işlədə bilər.", "A package from outside the official repositories skips signature checks and can run any code as root during installation."),
      },
      {
        title: l("`apt update` etmədən `upgrade`", "`upgrade` without `update`"),
        why: l("Köhnə siyahı ilə ən son təhlükəsizlik yeniləmələri görünmür.", "With an old list, the latest security updates are not visible."),
      },
    ],
    exercise: {
      task: l(
        "Yeni Debian serverində sistemi yeniləmək və köhnə, şifrələmə istifadə etməyən `telnet` klientini silmək üçün əmrləri ardıcıl yazın.",
        "On a new Debian server, write the commands in order to update the system and remove the old, unencrypted `telnet` client.",
      ),
      hints: [l("update → upgrade → remove.", "update → upgrade → remove.")],
      answer: l("`sudo apt update`, `sudo apt upgrade`, `sudo apt remove telnet`, sonra `sudo apt autoremove`.", "`sudo apt update`, `sudo apt upgrade`, `sudo apt remove telnet`, then `sudo apt autoremove`."),
    },
    quiz: [
      q(
        l("Hansı əmr yalnız paket siyahılarını yeniləyir?", "Which command only refreshes package lists?"),
        ["apt upgrade", "apt update", "apt install"],
        1,
        l("`update` siyahıları yeniləyir, heç nə quraşdırmır.", "`update` refreshes lists and installs nothing."),
      ),
      q(
        l("apt paketlərin həqiqiliyini necə yoxlayır?", "How does apt verify packages are genuine?"),
        [l("Rəqəmsal imzalarla", "With digital signatures"), l("Fayl adına görə", "By file name"), l("Yoxlamır", "It does not")],
        0,
        l("Repozitoriya metadata-sı imzalanır, paketlər isə orada olan hash-lərlə yoxlanır.", "Repository metadata is signed and packages are checked against the hashes it contains."),
      ),
    ],
    refs: [
      ref("Debian manpages — apt(8)", "https://manpages.debian.org/stable/apt/apt.8.en.html"),
      ref("Debian Wiki — SecureApt", "https://wiki.debian.org/SecureApt"),
      ref("Kali Docs — Updating Kali", "https://www.kali.org/docs/general-use/updating-kali/"),
    ],
  },
  {
    id: "linux-logs",
    module: "linux",
    title: t4("Jurnallar və journalctl", "Logs and journalctl", "Günlükler ve journalctl", "Журналы и journalctl"),
    intro: l(
      "Jurnallar (logs) sistemdə nə baş verdiyini qeyd edir: girişlər, xətalar, xidmət hadisələri. systemd istifadə edən sistemlərdə əsas vasitə `journalctl`-dır; bəzi sistemlərdə əlavə olaraq `/var/log/` altında mətn faylları olur.",
      "Logs record what happens on a system: logins, errors, service events. On systemd systems the main tool is `journalctl`; some systems also keep text files under `/var/log/`.",
    ),
    concepts: [
      c("systemd journal", "systemd journal", "Bütün xidmətlərin jurnallarını strukturlaşdırılmış şəkildə saxlayır; vaxt, xidmət və prioritetə görə süzmək olar.", "Stores logs from all services in structured form; filter by time, unit and priority."),
      c("Prioritet (priority)", "Priority", "0 (emerg) ilə 7 (debug) arasında; `-p err` yalnız xətaları və daha ciddi mesajları göstərir.", "From 0 (emerg) to 7 (debug); `-p err` shows errors and more severe messages only."),
      c("auth jurnalı", "Auth log", "Debian/Ubuntu-da rsyslog quraşdırılıbsa, giriş hadisələri `/var/log/auth.log` faylına da yazılır.", "On Debian/Ubuntu with rsyslog installed, login events are also written to `/var/log/auth.log`."),
    ],
    examples: [
      {
        title: l("journalctl ilə süzgəc", "Filtering with journalctl"),
        lang: "plain",
        code: "journalctl -u ssh --since \"1 hour ago\"   # SSH service, last hour\njournalctl -p err -b                     # errors since the current boot\njournalctl -f                            # follow new entries live\nsudo grep \"Failed password\" /var/log/auth.log | tail -n 20",
        explain: l(
          "`-u` xidmətə, `--since` vaxta, `-p` prioritetə, `-b` cari yükləməyə görə süzür. Jurnalların çoxunu oxumaq üçün `sudo` və ya `adm`/`systemd-journal` qrupuna üzvlük lazımdır.",
          "`-u` filters by unit, `--since` by time, `-p` by priority, `-b` by current boot. Reading most logs requires `sudo` or membership of the `adm`/`systemd-journal` group.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Jurnalları yalnız problem olanda açmaq", "Opening logs only when something breaks"),
        why: l("Normal vəziyyəti bilmədən anomaliyanı görmək çətindir. Mütəmadi baxış və avtomatik xəbərdarlıqlar qurun.", "Without knowing what normal looks like, anomalies are hard to see. Set up regular review and automatic alerts."),
      },
    ],
    exercise: {
      task: l(
        "Bu gün `nginx` xidmətində baş vermiş xətaları göstərən `journalctl` əmrini yazın.",
        "Write a `journalctl` command that shows today's errors from the `nginx` service.",
      ),
      hints: [l("`-u`, `-p` və `--since` seçimlərini birləşdirin.", "Combine `-u`, `-p` and `--since`.")],
      answer: l("`journalctl -u nginx -p err --since today`", "`journalctl -u nginx -p err --since today`"),
    },
    quiz: [
      q(
        l("`journalctl -f` nə edir?", "What does `journalctl -f` do?"),
        [l("Yeni qeydləri canlı izləyir", "Follows new entries live"), l("Jurnalı silir", "Deletes the journal"), l("Faylı düzəldir", "Fixes a file")],
        0,
        l("`-f` (follow) `tail -f` kimi işləyir.", "`-f` (follow) works like `tail -f`."),
      ),
      q(
        l("Yalnız xətaları göstərmək üçün hansı seçim istifadə olunur?", "Which option shows only errors?"),
        ["-p err", "-u err", "-b err"],
        0,
        l("`-p` prioritetə görə süzür.", "`-p` filters by priority."),
      ),
    ],
    refs: [
      ref("man7.org — journalctl(1)", "https://man7.org/linux/man-pages/man1/journalctl.1.html"),
      ref("OWASP Logging Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"),
    ],
  },
  {
    id: "bash-basics",
    module: "linux",
    title: t4("Shell və Bash əsasları", "Shell and Bash basics", "Kabuk ve Bash temelleri", "Основы оболочки и Bash"),
    intro: l(
      "Bash həm interaktiv shell, həm də skript dilidir. Kiçik skriptlər təkrarlanan inzibati işləri avtomatlaşdırır: ehtiyat nüsxə, jurnal yoxlaması, hesabat.",
      "Bash is both an interactive shell and a scripting language. Small scripts automate repetitive admin tasks: backups, log checks, reports.",
    ),
    concepts: [
      c("Shebang", "Shebang", "Skriptin ilk sətri `#!/usr/bin/env bash` hansı interpretatorun istifadə olunacağını göstərir.", "The first line `#!/usr/bin/env bash` says which interpreter runs the script."),
      c("Dəyişənlər və dırnaqlar (quoting)", "Variables and quoting", "`\"$var\"` ifadəsini həmişə dırnaq içində yazın; əks halda boşluq və xüsusi simvollar gözlənilməz nəticə verir.", "Always write `\"$var\"` in quotes; otherwise spaces and special characters cause surprises."),
      c("Daha təhlükəsiz rejim", "Safer settings", "`set -euo pipefail` xəta olduqda skripti dayandırır və təyin olunmamış dəyişənləri xəta sayır.", "`set -euo pipefail` stops the script on errors and treats unset variables as errors."),
    ],
    examples: [
      {
        title: l("Uğursuz girişləri sayan kiçik skript", "A small script that counts failed logins"),
        lang: "plain",
        code: "#!/usr/bin/env bash\nset -euo pipefail\n\nlog=\"${1:-/var/log/auth.log}\"\ncount=$(grep -c \"Failed password\" \"$log\" || true)\necho \"Failed logins in $log: $count\"",
        explain: l(
          "Skript arqument kimi jurnal faylını qəbul edir (verilməyibsə, default yol istifadə olunur). `grep -c` uyğun sətirləri sayır; `|| true` heç nə tapılmadıqda `set -e`-nin skripti dayandırmasının qarşısını alır. Skript yalnız oxuyur.",
          "The script takes a log file as an argument (default path otherwise). `grep -c` counts matches; `|| true` stops `set -e` from aborting when nothing matches. The script only reads.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Silmə əmrində dırnaqsız dəyişən", "An unquoted variable in a delete command"),
        why: l("Dəyişən boş olsa və ya boşluq ehtiva etsə, əmr gözlənilməz yolları silə bilər. Dırnaq və `${var:?}` istifadə edin.", "If the variable is empty or contains spaces, the command may delete unexpected paths. Use quotes and `${var:?}`."),
        wrong: "rm -rf $dir/",
        right: "rm -rf -- \"${dir:?}/\"",
        lang: "plain",
      },
    ],
    exercise: {
      task: l(
        "Arqument kimi qovluq qəbul edən və orada neçə fayl olduğunu çap edən Bash skripti yazın. Qovluq yoxdursa, xəta mesajı versin.",
        "Write a Bash script that takes a directory argument and prints how many files it contains. If the directory does not exist, print an error.",
      ),
      hints: [l("`[[ -d \"$dir\" ]]` qovluğu yoxlayır; `find \"$dir\" -maxdepth 1 -type f | wc -l` faylları sayır.", "`[[ -d \"$dir\" ]]` checks the directory; `find \"$dir\" -maxdepth 1 -type f | wc -l` counts the files.")],
      answer: l(
        "`#!/usr/bin/env bash` / `set -euo pipefail` / `dir=\"${1:?usage: count.sh DIR}\"` / `[[ -d \"$dir\" ]] || { echo \"not a directory: $dir\" >&2; exit 1; }` / `find \"$dir\" -maxdepth 1 -type f | wc -l`",
        "`#!/usr/bin/env bash` / `set -euo pipefail` / `dir=\"${1:?usage: count.sh DIR}\"` / `[[ -d \"$dir\" ]] || { echo \"not a directory: $dir\" >&2; exit 1; }` / `find \"$dir\" -maxdepth 1 -type f | wc -l`",
      ),
    },
    quiz: [
      q(
        l("`set -u` nə edir?", "What does `set -u` do?"),
        [l("Təyin olunmamış dəyişəni xəta sayır", "Treats unset variables as errors"), l("Skripti root kimi işlədir", "Runs the script as root"), l("Çıxışı gizlədir", "Hides output")],
        0,
        l("`-u` (nounset) adı səhv yazılmış dəyişənləri erkən tutur.", "`-u` (nounset) catches misspelled variable names early."),
      ),
      q(
        l("Skriptə verilən birinci arqument hansı dəyişəndədir?", "Which variable holds a script's first argument?"),
        ["$0", "$1", "$#"],
        1,
        l("`$0` skriptin adı, `$1` birinci arqument, `$#` isə arqumentlərin sayıdır.", "`$0` is the script name, `$1` the first argument, `$#` the argument count."),
      ),
    ],
    refs: [
      ref("GNU Bash Reference Manual", "https://www.gnu.org/software/bash/manual/bash.html"),
      ref("man7.org — bash(1)", "https://man7.org/linux/man-pages/man1/bash.1.html"),
      ref("ShellCheck", "https://www.shellcheck.net/"),
    ],
  },
];

// ───────────────────────────── C · Networking ─────────────────────────────
const C: SecTopic[] = [
  {
    id: "net-ip",
    module: "networking",
    title: t4("IP ünvanları", "IP addresses", "IP adresleri", "IP-адреса"),
    intro: l(
      "IP ünvanı şəbəkədə cihazı müəyyən edir. IPv4 32 bitlik (məsələn, `192.168.1.10`), IPv6 isə 128 bitlikdir (məsələn, `2001:db8::1`). Alt şəbəkə (subnet) maskası ünvanın hansı hissəsinin şəbəkəyə aid olduğunu göstərir.",
      "An IP address identifies a device on a network. IPv4 is 32 bits (e.g. `192.168.1.10`), IPv6 is 128 bits (e.g. `2001:db8::1`). The subnet mask shows which part of the address is the network.",
    ),
    concepts: [
      c("CIDR", "CIDR notation", "`192.168.1.0/24` — ilk 24 bit şəbəkədir, 256 ünvan (254 istifadə olunan host).", "`192.168.1.0/24` — the first 24 bits are the network, 256 addresses (254 usable hosts)."),
      c("Özəl ünvanlar (private ranges)", "Private ranges", "RFC 1918: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` — internetdə birbaşa marşrutlaşdırılmır.", "RFC 1918: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` — not routed on the public internet."),
      c("NAT", "NAT", "Router daxili özəl ünvanları bir ictimai ünvana çevirir.", "A router translates internal private addresses to one public address."),
      c("Loopback", "Loopback", "`127.0.0.1` və `::1` cihazın özünə aiddir — lokal laboratoriya xidmətləri çox vaxt burada işləyir.", "`127.0.0.1` and `::1` refer to the device itself — local lab services often run here."),
    ],
    examples: [
      {
        title: l("Öz ünvanlarınızı görmək", "Seeing your own addresses"),
        lang: "plain",
        code: "ip addr show      # interfaces and addresses\nip -4 addr        # IPv4 only\nping -c 4 127.0.0.1",
        explain: l(
          "`ip addr` interfeysləri və onlara təyin olunmuş ünvanları göstərir. `ping -c 4` yalnız 4 paket göndərir; loopback-ə ping şəbəkə stekinin işlədiyini yoxlayır.",
          "`ip addr` lists interfaces and their addresses. `ping -c 4` sends only 4 packets; pinging loopback checks that the network stack works.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Özəl ünvanı \"gizli\" hesab etmək", "Treating a private address as \"secret\""),
        why: l("Özəl ünvan təhlükəsizlik tədbiri deyil; daxili şəbəkədəki xidmətlər də autentifikasiya və firewall ilə qorunmalıdır.", "A private address is not a security control; services on an internal network still need authentication and a firewall."),
      },
    ],
    exercise: {
      task: l(
        "Bu ünvanlardan hansılar özəldir: `10.4.2.1`, `172.20.0.5`, `8.8.8.8`, `192.168.0.100`, `172.32.0.1`?",
        "Which of these are private: `10.4.2.1`, `172.20.0.5`, `8.8.8.8`, `192.168.0.100`, `172.32.0.1`?",
      ),
      hints: [l("`172.16.0.0/12` aralığı 172.16–172.31-i əhatə edir.", "`172.16.0.0/12` covers 172.16–172.31.")],
      answer: l("Özəl: `10.4.2.1`, `172.20.0.5`, `192.168.0.100`. İctimai: `8.8.8.8`, `172.32.0.1`.", "Private: `10.4.2.1`, `172.20.0.5`, `192.168.0.100`. Public: `8.8.8.8`, `172.32.0.1`."),
    },
    quiz: [
      q(
        l("`/24` şəbəkəsində neçə ünvan var?", "How many addresses are in a `/24` network?"),
        ["256", "24", "1024"],
        0,
        l("32 − 24 = 8 bit host üçün qalır, 2⁸ = 256.", "32 − 24 = 8 host bits, 2⁸ = 256."),
      ),
      q(
        l("IPv6 ünvanı neçə bitdir?", "How many bits is an IPv6 address?"),
        ["32", "64", "128"],
        2,
        l("IPv6 128 bitlikdir.", "IPv6 addresses are 128 bits."),
      ),
    ],
    refs: [
      ref("RFC 1918 — Address Allocation for Private Internets", "https://www.rfc-editor.org/rfc/rfc1918"),
      ref("RFC 8200 — IPv6 Specification", "https://www.rfc-editor.org/rfc/rfc8200"),
      ref("man7.org — ip(8)", "https://man7.org/linux/man-pages/man8/ip.8.html"),
    ],
  },
  {
    id: "net-dns",
    module: "networking",
    title: t4("DNS", "DNS", "DNS", "DNS"),
    intro: l(
      "DNS (Domain Name System) domen adlarını (`example.com`) IP ünvanlarına çevirir. Demək olar ki, hər bağlantı DNS sorğusu ilə başlayır, ona görə DNS həm etibarlılıq, həm də təhlükəsizlik üçün vacibdir.",
      "DNS (Domain Name System) translates domain names (`example.com`) into IP addresses. Almost every connection starts with a DNS query, so DNS matters for both reliability and security.",
    ),
    concepts: [
      c("Qeyd növləri (record types)", "Record types", "`A` (IPv4), `AAAA` (IPv6), `CNAME` (ləqəb), `MX` (poçt), `TXT` (mətn, məsələn, SPF).", "`A` (IPv4), `AAAA` (IPv6), `CNAME` (alias), `MX` (mail), `TXT` (text, e.g. SPF)."),
      c("Resolver", "Resolver", "Sizin adınıza sorğunu kök, TLD və avtoritativ serverlərə göndərən və nəticəni keşləyən server.", "A server that queries root, TLD and authoritative servers for you and caches the answer."),
      c("DNSSEC", "DNSSEC", "DNS cavablarını rəqəmsal imza ilə qoruyur ki, saxtalaşdırılmış cavab aşkar edilsin.", "Protects DNS answers with digital signatures so forged answers are detected."),
    ],
    examples: [
      {
        title: l("DNS sorğusu", "A DNS query"),
        lang: "plain",
        code: "dig example.com A +short\ndig example.com MX\ncat /etc/resolv.conf   # which resolver this machine uses",
        explain: l(
          "`dig` (Debian-da `dnsutils` və ya `bind9-dnsutils` paketindədir) DNS qeydlərini sorğulayır; `+short` yalnız cavabı göstərir. `/etc/resolv.conf` istifadə olunan resolveri göstərir.",
          "`dig` (in the `dnsutils` or `bind9-dnsutils` package on Debian) queries DNS records; `+short` prints only the answer. `/etc/resolv.conf` shows the resolver in use.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Domen adını vizual yoxlamaqla kifayətlənmək", "Trusting a domain name at a glance"),
        why: l("Oxşar görünən domenlər (məsələn, `rn` və `m`) fişinqdə istifadə olunur. Ünvanı diqqətlə oxuyun və əlfəcinlərdən istifadə edin.", "Look-alike domains (e.g. `rn` vs `m`) are used for phishing. Read addresses carefully and use bookmarks."),
      },
    ],
    exercise: {
      task: l(
        "Bir domenin poçt serverlərini və IPv6 ünvanını öyrənmək üçün hansı qeyd növlərini sorğulayardınız?",
        "Which record types would you query to find a domain's mail servers and its IPv6 address?",
      ),
      hints: [l("Poçt — mail exchanger.", "Mail — mail exchanger.")],
      answer: l("`MX` (poçt serverləri) və `AAAA` (IPv6): `dig example.com MX`, `dig example.com AAAA`.", "`MX` (mail servers) and `AAAA` (IPv6): `dig example.com MX`, `dig example.com AAAA`."),
    },
    quiz: [
      q(
        l("Hansı qeyd IPv4 ünvanını saxlayır?", "Which record holds an IPv4 address?"),
        ["A", "AAAA", "MX"],
        0,
        l("`A` — IPv4, `AAAA` — IPv6.", "`A` is IPv4, `AAAA` is IPv6."),
      ),
      q(
        l("DNSSEC nəyi təmin edir?", "What does DNSSEC provide?"),
        [l("Cavabların həqiqiliyini", "Authenticity of answers"), l("Sorğuların şifrələnməsini", "Encryption of queries"), l("Daha sürətli DNS", "Faster DNS")],
        0,
        l("DNSSEC imzalar əlavə edir, lakin sorğuları şifrələmir (bunun üçün DoH/DoT var).", "DNSSEC adds signatures but does not encrypt queries (DoH/DoT do that)."),
      ),
    ],
    refs: [
      ref("RFC 1034 — Domain Names: Concepts and Facilities", "https://www.rfc-editor.org/rfc/rfc1034"),
      ref("ICANN — DNSSEC: What is it and why is it important?", "https://www.icann.org/resources/pages/dnssec-what-is-it-why-important-2019-03-05-en"),
      ref("man7.org — resolv.conf(5)", "https://man7.org/linux/man-pages/man5/resolv.conf.5.html"),
    ],
  },
  {
    id: "net-tcp-udp",
    module: "networking",
    title: t4("TCP və UDP", "TCP vs UDP", "TCP ve UDP", "TCP и UDP"),
    intro: l(
      "TCP etibarlı, ardıcıl çatdırılma təmin edən bağlantılı protokoldur; UDP isə bağlantısız, yüngül və sürətlidir, amma çatdırılmaya zəmanət vermir.",
      "TCP is connection-oriented and provides reliable, ordered delivery; UDP is connectionless, lightweight and fast, but does not guarantee delivery.",
    ),
    concepts: [
      c("Üç addımlı əl sıxma (three-way handshake)", "Three-way handshake", "TCP bağlantısı SYN → SYN-ACK → ACK ilə qurulur.", "A TCP connection is set up with SYN → SYN-ACK → ACK."),
      c("TCP istifadəsi", "TCP uses", "Veb (HTTP/HTTPS), SSH, e-poçt — itkinin qəbul edilmədiyi yerlərdə.", "Web (HTTP/HTTPS), SSH, email — where loss is not acceptable."),
      c("UDP istifadəsi", "UDP uses", "DNS sorğuları, səs/video axını, oyunlar, QUIC (HTTP/3 UDP üzərində işləyir).", "DNS queries, voice/video streaming, games, QUIC (HTTP/3 runs over UDP)."),
    ],
    examples: [
      {
        title: l("Öz kompüterinizdə dinləyən portlar", "Listening ports on your own machine"),
        lang: "plain",
        code: "ss -tuln     # TCP and UDP sockets in LISTEN state, numeric\nsudo ss -tulpn   # also show which process owns each socket",
        explain: l(
          "`ss` öz sisteminizin soketlərini göstərir: `-t` TCP, `-u` UDP, `-l` dinləyənlər, `-n` rəqəmsal, `-p` proses. Bu, öz serverinizdə gözlənilməz xidmətləri tapmaq üçün müdafiə yoxlamasıdır.",
          "`ss` shows your own system's sockets: `-t` TCP, `-u` UDP, `-l` listening, `-n` numeric, `-p` process. This is a defensive check for unexpected services on your own server.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("UDP-ni firewall qaydalarında unutmaq", "Forgetting UDP in firewall rules"),
        why: l("Yalnız TCP-ni məhdudlaşdırmaq UDP xidmətlərini (məsələn, açıq DNS və ya SNMP) qorunmasız qoya bilər.", "Restricting only TCP can leave UDP services (e.g. open DNS or SNMP) unprotected."),
      },
    ],
    exercise: {
      task: l(
        "Hər tətbiq üçün TCP və ya UDP seçin və səbəbini yazın: fayl yükləmə, canlı video zəng, DNS sorğusu, SSH.",
        "Choose TCP or UDP for each and explain why: file download, live video call, DNS query, SSH.",
      ),
      hints: [l("İtki qəbul olunurmu? Gecikmə vacibdirmi?", "Is loss acceptable? Does latency matter?")],
      answer: l("Fayl yükləmə və SSH — TCP (etibarlılıq). Video zəng — UDP (aşağı gecikmə). DNS — adətən UDP, böyük cavablar üçün TCP.", "File download and SSH — TCP (reliability). Video call — UDP (low latency). DNS — usually UDP, TCP for large answers."),
    },
    quiz: [
      q(
        l("TCP əl sıxmasının ilk paketi hansıdır?", "What is the first packet of the TCP handshake?"),
        ["ACK", "SYN", "FIN"],
        1,
        l("Ardıcıllıq SYN → SYN-ACK → ACK-dir.", "The order is SYN → SYN-ACK → ACK."),
      ),
      q(
        l("HTTP/3 hansı protokol üzərində işləyir?", "Which transport does HTTP/3 use?"),
        [l("UDP (QUIC)", "UDP (QUIC)"), l("Yalnız TCP", "TCP only"), "ICMP"],
        0,
        l("HTTP/3 UDP üzərində işləyən QUIC protokolundan istifadə edir.", "HTTP/3 uses QUIC, which runs over UDP."),
      ),
    ],
    refs: [
      ref("RFC 9293 — Transmission Control Protocol", "https://www.rfc-editor.org/rfc/rfc9293"),
      ref("RFC 768 — User Datagram Protocol", "https://www.rfc-editor.org/rfc/rfc768"),
      ref("man7.org — ss(8)", "https://man7.org/linux/man-pages/man8/ss.8.html"),
    ],
  },
  {
    id: "net-http-tls",
    module: "networking",
    title: t4("HTTP, HTTPS və TLS", "HTTP, HTTPS and TLS", "HTTP, HTTPS ve TLS", "HTTP, HTTPS и TLS"),
    intro: l(
      "HTTP vebin sorğu-cavab protokoludur. HTTPS HTTP-nin TLS ilə şifrələnmiş formasıdır: məlumat yolda oxuna və dəyişdirilə bilmir, sertifikat isə serverin həqiqiliyini təsdiqləyir.",
      "HTTP is the web's request-response protocol. HTTPS is HTTP encrypted with TLS: data cannot be read or changed in transit, and the certificate proves the server's identity.",
    ),
    concepts: [
      c("Metodlar və status kodları", "Methods and status codes", "`GET` oxuyur, `POST` yaradır; 2xx uğur, 3xx yönləndirmə, 4xx klient xətası, 5xx server xətası.", "`GET` reads, `POST` creates; 2xx success, 3xx redirect, 4xx client error, 5xx server error."),
      c("TLS sertifikatı", "TLS certificate", "Etibarlı sertifikat mərkəzi (CA) tərəfindən imzalanır və domen adına bağlıdır.", "Signed by a trusted certificate authority (CA) and bound to the domain name."),
      c("HSTS", "HSTS", "`Strict-Transport-Security` başlığı brauzerə saytı yalnız HTTPS ilə açmağı əmr edir.", "The `Strict-Transport-Security` header tells the browser to use HTTPS only."),
      c("TLS versiyaları", "TLS versions", "TLS 1.2 və 1.3 istifadə edin; SSL və TLS 1.0/1.1 köhnəlib.", "Use TLS 1.2 and 1.3; SSL and TLS 1.0/1.1 are deprecated."),
    ],
    examples: [
      {
        title: l("Cavab başlıqlarına baxmaq", "Looking at response headers"),
        lang: "plain",
        code: "curl -I https://example.com\n# HTTP/2 200\n# content-type: text/html\n# strict-transport-security: max-age=31536000; includeSubDomains",
        explain: l(
          "`curl -I` yalnız başlıqları (HEAD sorğusu) göstərir. Öz saytınızda HSTS, `Content-Security-Policy` kimi təhlükəsizlik başlıqlarının olub-olmadığını beləcə yoxlaya bilərsiniz.",
          "`curl -I` fetches headers only (a HEAD request). You can use it to check whether your own site sends security headers such as HSTS and `Content-Security-Policy`.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Sertifikat yoxlamasını söndürmək", "Disabling certificate verification"),
        why: l("`verify=False` kimi parametrlər şifrələməni saxlayır, lakin kimlə danışdığınızı yoxlamır — ortadakı adam (man-in-the-middle) hücumuna yol açır.", "Options like `verify=False` keep encryption but stop checking who you are talking to — opening the door to man-in-the-middle attacks."),
        wrong: "requests.get(url, verify=False)",
        right: "requests.get(url)  # verification is on by default",
        lang: "python",
      },
    ],
    exercise: {
      task: l(
        "Brauzer \"sertifikat etibarsızdır\" xəbərdarlığı göstərir. Mümkün üç səbəb yazın və nə etməli olduğunuzu izah edin.",
        "The browser shows a \"certificate not valid\" warning. List three possible causes and explain what you should do.",
      ),
      hints: [l("Müddət, domen adı, imzalayan.", "Expiry, domain name, issuer.")],
      answer: l(
        "Sertifikatın müddəti bitib, domen adı uyğun gəlmir və ya etibarlı CA tərəfindən imzalanmayıb (yaxud bağlantı ələ keçirilib). Xəbərdarlığı keçməyin, həssas məlumat daxil etməyin və sayt sahibinə bildirin.",
        "The certificate has expired, the name does not match, or it is not signed by a trusted CA (or the connection is intercepted). Do not click through, do not enter sensitive data, and notify the site owner.",
      ),
    },
    quiz: [
      q(
        l("HTTPS standart olaraq hansı portu istifadə edir?", "Which port does HTTPS use by default?"),
        ["80", "443", "22"],
        1,
        l("HTTP — 80, HTTPS — 443.", "HTTP is 80, HTTPS is 443."),
      ),
      q(
        l("HSTS başlığı nə edir?", "What does the HSTS header do?"),
        [l("Brauzeri yalnız HTTPS istifadə etməyə məcbur edir", "Forces the browser to use HTTPS only"), l("Kukiləri silir", "Deletes cookies"), l("Keşi söndürür", "Disables caching")],
        0,
        l("HSTS HTTP-yə geri düşməyin qarşısını alır.", "HSTS prevents downgrades to plain HTTP."),
      ),
    ],
    refs: [
      ref("MDN — HTTP", "https://developer.mozilla.org/en-US/docs/Web/HTTP"),
      ref("RFC 8446 — TLS 1.3", "https://www.rfc-editor.org/rfc/rfc8446"),
      ref("OWASP Transport Layer Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html"),
    ],
  },
  {
    id: "net-ports",
    module: "networking",
    title: t4("Portlar və xidmətlər", "Ports and services", "Portlar ve servisler", "Порты и службы"),
    intro: l(
      "Port bir cihazdakı konkret xidməti müəyyən edən rəqəmdir (0–65535). IP ünvanı \"bina\", port isə \"mənzil nömrəsi\"dir. Hər açıq port potensial giriş nöqtəsidir.",
      "A port is a number (0–65535) that identifies a specific service on a device. The IP address is the \"building\", the port the \"flat number\". Every open port is a potential entry point.",
    ),
    concepts: [
      c("Tanınmış portlar (well-known ports)", "Well-known ports", "0–1023: 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS. IANA bu reyestri aparır.", "0–1023: 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS. IANA maintains the registry."),
      c("Verilənlər bazası portları", "Database ports", "3306 MySQL, 5432 PostgreSQL, 6379 Redis — internetə açıq olmamalıdır.", "3306 MySQL, 5432 PostgreSQL, 6379 Redis — should never be exposed to the internet."),
      c("Bağlama ünvanı (bind address)", "Bind address", "`127.0.0.1`-ə bağlanan xidmət yalnız lokal əlçatandır; `0.0.0.0` bütün interfeyslərdə dinləyir.", "A service bound to `127.0.0.1` is local only; `0.0.0.0` listens on all interfaces."),
    ],
    examples: [
      {
        title: l("Verilənlər bazasını yalnız lokal dinləməyə məcbur etmək", "Making a database listen locally only"),
        lang: "plain",
        code: "# /etc/postgresql/<version>/main/postgresql.conf\nlisten_addresses = 'localhost'\n\n# then check on your own server:\nsudo ss -tlnp | grep 5432",
        explain: l(
          "PostgreSQL yalnız `localhost`-da dinləyəndə xarici şəbəkədən birbaşa əlçatmaz olur. `ss` nəticəsində `127.0.0.1:5432` görünməlidir, `0.0.0.0:5432` yox.",
          "When PostgreSQL listens only on `localhost`, it is unreachable directly from outside. `ss` should show `127.0.0.1:5432`, not `0.0.0.0:5432`.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Portu dəyişməyi təhlükəsizlik hesab etmək", "Treating a changed port as security"),
        why: l("SSH-ı 22-dən başqa porta keçirmək avtomatik səs-küyü azalda bilər, lakin güclü autentifikasiyanı əvəz etmir (\"gizlilik vasitəsilə təhlükəsizlik\" — security through obscurity).", "Moving SSH off port 22 may reduce automated noise but does not replace strong authentication (security through obscurity)."),
      },
    ],
    exercise: {
      task: l(
        "Öz serverinizdə `ss -tln` belə nəticə verir: `0.0.0.0:22`, `0.0.0.0:80`, `0.0.0.0:6379`. Hansını düzəltmək lazımdır və necə?",
        "On your own server `ss -tln` shows: `0.0.0.0:22`, `0.0.0.0:80`, `0.0.0.0:6379`. Which one needs fixing and how?",
      ),
      hints: [l("6379 hansı xidmətdir?", "Which service uses 6379?")],
      answer: l("6379 (Redis) bütün interfeyslərdə açıqdır. Onu `127.0.0.1`-ə bağlayın (`bind 127.0.0.1`), autentifikasiyanı aktivləşdirin və firewall ilə bağlayın.", "6379 (Redis) is open on all interfaces. Bind it to `127.0.0.1` (`bind 127.0.0.1`), enable authentication and block it in the firewall."),
    },
    quiz: [
      q(
        l("SSH standart olaraq hansı portdadır?", "Which port is SSH by default?"),
        ["21", "22", "23"],
        1,
        l("21 FTP, 22 SSH, 23 Telnet.", "21 FTP, 22 SSH, 23 Telnet."),
      ),
      q(
        l("Hansı bağlama ünvanı xidməti yalnız lokal edir?", "Which bind address makes a service local-only?"),
        ["0.0.0.0", "127.0.0.1", "255.255.255.255"],
        1,
        l("`127.0.0.1` loopback-dir.", "`127.0.0.1` is loopback."),
      ),
    ],
    refs: [
      ref("IANA Service Name and Port Number Registry", "https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml"),
      ref("PostgreSQL docs — Connections and Authentication", "https://www.postgresql.org/docs/current/runtime-config-connection.html"),
    ],
  },
  {
    id: "net-routing",
    module: "networking",
    title: t4("Marşrutlaşdırma", "Routing", "Yönlendirme", "Маршрутизация"),
    intro: l(
      "Marşrutlaşdırma (routing) paketlərin bir şəbəkədən digərinə hansı yolla getdiyini müəyyən edir. Hər cihazda marşrut cədvəli var; tanınmayan təyinatlar default şlüzə (default gateway) göndərilir.",
      "Routing decides which path packets take from one network to another. Every device has a routing table; unknown destinations go to the default gateway.",
    ),
    concepts: [
      c("Default gateway", "Default gateway", "Lokal şəbəkədən kənara gedən trafiki qəbul edən router.", "The router that takes traffic leaving the local network."),
      c("Hop", "Hop", "Paketin keçdiyi hər router bir \"hop\"dur; TTL hər hop-da 1 azalır.", "Each router a packet crosses is a hop; TTL drops by 1 at each hop."),
      c("Seqmentasiya (segmentation)", "Segmentation", "Şəbəkəni hissələrə (VLAN, alt şəbəkə) bölüb aralarındakı trafiki məhdudlaşdırmaq hücumun yayılmasını çətinləşdirir.", "Splitting a network into parts (VLANs, subnets) and restricting traffic between them limits how far an attack can spread."),
    ],
    examples: [
      {
        title: l("Marşrut cədvəli", "The routing table"),
        lang: "plain",
        code: "ip route\n# default via 192.168.1.1 dev wlan0\n# 192.168.1.0/24 dev wlan0 proto kernel scope link src 192.168.1.23\nip route get 1.1.1.1   # which route a destination would use",
        explain: l(
          "`default via` sətri default gateway-i göstərir. `ip route get` konkret təyinat üçün hansı interfeys və şlüzün seçiləcəyini göstərir.",
          "The `default via` line is the default gateway. `ip route get` shows which interface and gateway a specific destination would use.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("\"Düz\" (flat) şəbəkə", "A flat network"),
        why: l("Bütün cihazlar bir şəbəkədə olduqda, bir sındırılmış cihaz hamısına çata bilər. Serverləri, istifadəçiləri və IoT cihazlarını ayırın.", "When every device sits on one network, one compromised device can reach all others. Separate servers, users and IoT devices."),
      },
    ],
    exercise: {
      task: l(
        "Kiçik ofis üçün üç seqment təklif edin və hansı trafikə icazə veriləcəyini yazın.",
        "Propose three segments for a small office and write which traffic is allowed between them.",
      ),
      hints: [l("İşçilər, serverlər, qonaq Wi-Fi.", "Staff, servers, guest Wi-Fi.")],
      answer: l(
        "İşçilər → serverlər: yalnız lazım olan portlar (məsələn, 443). Qonaq Wi-Fi → yalnız internet, daxili şəbəkəyə yox. Serverlər → işçilərə yeni bağlantı açmır.",
        "Staff → servers: only needed ports (e.g. 443). Guest Wi-Fi → internet only, no internal access. Servers do not open new connections to staff devices.",
      ),
    },
    quiz: [
      q(
        l("Naməlum təyinata gedən paket hara göndərilir?", "Where does a packet for an unknown destination go?"),
        [l("Default gateway-ə", "To the default gateway"), l("Loopback-ə", "To loopback"), l("Atılır", "It is dropped")],
        0,
        l("Xüsusi marşrut yoxdursa, default marşrut istifadə olunur.", "Without a specific route, the default route is used."),
      ),
      q(
        l("Şəbəkə seqmentasiyası nəyə kömək edir?", "What does network segmentation help with?"),
        [l("Hücumun yayılmasını məhdudlaşdırmağa", "Limiting the spread of an attack"), l("İnterneti sürətləndirməyə", "Making the internet faster"), l("Parolları əvəz etməyə", "Replacing passwords")],
        0,
        l("Seqmentlər arası qaydalar yanal hərəkəti (lateral movement) çətinləşdirir.", "Rules between segments make lateral movement harder."),
      ),
    ],
    refs: [
      ref("man7.org — ip-route(8)", "https://man7.org/linux/man-pages/man8/ip-route.8.html"),
      ref("RFC 1812 — Requirements for IP Version 4 Routers", "https://www.rfc-editor.org/rfc/rfc1812"),
    ],
  },
  {
    id: "net-firewalls",
    module: "networking",
    title: t4("Firewall-lar", "Firewalls", "Güvenlik duvarları", "Межсетевые экраны"),
    intro: l(
      "Firewall qaydalara əsasən trafikə icazə verir və ya onu bloklayır. Ən təhlükəsiz yanaşma \"default deny\"dir: gələn trafik qadağandır, yalnız lazım olan xidmətlər açılır.",
      "A firewall allows or blocks traffic based on rules. The safest approach is \"default deny\": incoming traffic is blocked and only needed services are opened.",
    ),
    concepts: [
      c("Paket süzgəci (packet filter)", "Packet filter", "Ünvan, port və protokola görə qərar verir.", "Decides by address, port and protocol."),
      c("Vəziyyətli firewall (stateful)", "Stateful firewall", "Qurulmuş bağlantıları izləyir; cavab paketlərini avtomatik buraxır.", "Tracks established connections and automatically allows reply packets."),
      c("Host və şəbəkə firewall-u", "Host vs network firewall", "Host firewall-u (ufw, nftables, Windows Defender Firewall) bir cihazı, şəbəkə firewall-u isə bütün seqmenti qoruyur.", "A host firewall (ufw, nftables, Windows Defender Firewall) protects one device; a network firewall protects a whole segment."),
    ],
    examples: [
      {
        title: l("ufw ilə default deny", "Default deny with ufw"),
        lang: "plain",
        code: "sudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow 22/tcp\nsudo ufw allow 443/tcp\nsudo ufw enable\nsudo ufw status verbose",
        explain: l(
          "Əvvəl default siyasətlər qurulur, sonra yalnız SSH və HTTPS açılır. Uzaq serverdə `enable` etməzdən əvvəl SSH qaydasını əlavə edin, yoxsa bağlantınız kəsilə bilər.",
          "Default policies are set first, then only SSH and HTTPS are opened. On a remote server, add the SSH rule before `enable`, or you may lock yourself out.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("\"Hamısına icazə\" qaydası ilə test edib unutmaq", "Testing with an allow-all rule and forgetting it"),
        why: l("Müvəqqəti açılan qaydalar çox vaxt qalıcı olur. Qaydaları sənədləşdirin və müntəzəm yoxlayın.", "Temporary rules often become permanent. Document rules and review them regularly."),
      },
    ],
    exercise: {
      task: l(
        "Yalnız HTTPS veb serveri olan və SSH ilə yalnız ofis şəbəkəsindən (`203.0.113.0/24`) idarə olunan server üçün ufw qaydalarını yazın.",
        "Write ufw rules for a server that runs only an HTTPS web server and is administered over SSH only from the office network (`203.0.113.0/24`).",
      ),
      hints: [l("`ufw allow from ŞƏBƏKƏ to any port 22 proto tcp`", "`ufw allow from NETWORK to any port 22 proto tcp`")],
      answer: l(
        "`sudo ufw default deny incoming`, `sudo ufw default allow outgoing`, `sudo ufw allow 443/tcp`, `sudo ufw allow from 203.0.113.0/24 to any port 22 proto tcp`, `sudo ufw enable`.",
        "`sudo ufw default deny incoming`, `sudo ufw default allow outgoing`, `sudo ufw allow 443/tcp`, `sudo ufw allow from 203.0.113.0/24 to any port 22 proto tcp`, `sudo ufw enable`.",
      ),
    },
    quiz: [
      q(
        l("\"Default deny\" nə deməkdir?", "What does \"default deny\" mean?"),
        [l("Açıq icazə verilməyən hər şey bloklanır", "Everything not explicitly allowed is blocked"), l("Hər şeyə icazə var", "Everything is allowed"), l("Firewall söndürülüb", "The firewall is off")],
        0,
        l("Yalnız açıq qaydalar trafikə icazə verir.", "Only explicit rules allow traffic."),
      ),
      q(
        l("Vəziyyətli firewall nəyi izləyir?", "What does a stateful firewall track?"),
        [l("Bağlantıların vəziyyətini", "Connection state"), l("İstifadəçi parollarını", "User passwords"), l("Disk sahəsini", "Disk space")],
        0,
        l("O, qurulmuş bağlantılara aid cavab trafikini tanıyır.", "It recognises reply traffic belonging to established connections."),
      ),
    ],
    refs: [
      ref("Ubuntu manpage — ufw(8)", "https://manpages.ubuntu.com/manpages/noble/man8/ufw.8.html"),
      ref("man7.org — nft(8)", "https://man7.org/linux/man-pages/man8/nft.8.html"),
      ref("NIST SP 800-41 Rev. 1 — Guidelines on Firewalls", "https://csrc.nist.gov/pubs/sp/800/41/r1/final"),
    ],
  },
  {
    id: "net-architecture",
    module: "networking",
    title: t4("Şəbəkə arxitekturası", "Network architecture", "Ağ mimarisi", "Сетевая архитектура"),
    intro: l(
      "Şəbəkə arxitekturası komponentlərin necə yerləşdiyini təsvir edir: internetə açıq hissə (DMZ), daxili şəbəkə, idarəetmə şəbəkəsi. Yaxşı arxitektura bir neçə müdafiə qatından (defense in depth) ibarətdir.",
      "Network architecture describes how components are arranged: the internet-facing part (DMZ), the internal network, the management network. Good architecture uses several layers of defence (defense in depth).",
    ),
    concepts: [
      c("OSI və TCP/IP modelləri", "OSI and TCP/IP models", "Şəbəkəni qatlara bölür: fiziki, kanal, şəbəkə (IP), nəqliyyat (TCP/UDP), tətbiq (HTTP, DNS).", "Split networking into layers: physical, link, network (IP), transport (TCP/UDP), application (HTTP, DNS)."),
      c("DMZ", "DMZ", "İctimai xidmətlərin (veb server) daxili şəbəkədən ayrıca yerləşdiyi zona.", "A zone where public services (web servers) sit apart from the internal network."),
      c("Dərin müdafiə (defense in depth)", "Defense in depth", "Bir qat uğursuz olsa, digəri qoruyur: firewall + yeniləmələr + MFA + monitorinq + ehtiyat nüsxə.", "If one layer fails, another protects: firewall + updates + MFA + monitoring + backups."),
      c("Sıfır etibar (zero trust)", "Zero trust", "Şəbəkədəki yerə görə avtomatik etibar yoxdur; hər sorğu kimlik və cihaz vəziyyətinə görə yoxlanır.", "No automatic trust based on network location; every request is checked by identity and device state."),
    ],
    examples: [
      {
        title: l("Sadə üç zonalı dizayn", "A simple three-zone design"),
        lang: "plain",
        code: "Internet\n   |  (firewall: allow 443 only)\n  DMZ  -> reverse proxy / web server\n   |  (firewall: allow app port only)\nInternal -> application server -> database (5432, internal only)\n   |\nManagement network -> SSH / admin access with MFA",
        explain: l(
          "Hər zona arasında firewall var və yalnız lazım olan port açılır. Verilənlər bazası internetdən heç vaxt birbaşa görünmür.",
          "A firewall sits between every zone and only the needed port is open. The database is never directly visible from the internet.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Daxili şəbəkəyə tam etibar etmək", "Fully trusting the internal network"),
        why: l("Hücumçu bir işçi kompüterini ələ keçirsə, \"daxili\" artıq təhlükəsiz deyil. Daxili xidmətlərdə də autentifikasiya və şifrələmə istifadə edin.", "If an attacker compromises one staff computer, \"internal\" is no longer safe. Use authentication and encryption for internal services too."),
      },
    ],
    exercise: {
      task: l(
        "Kiçik onlayn mağaza üçün dərin müdafiənin beş qatını sadalayın.",
        "List five layers of defense in depth for a small online shop.",
      ),
      hints: [l("Şəbəkə, host, tətbiq, insan, bərpa.", "Network, host, application, people, recovery.")],
      answer: l(
        "Nümunə: (1) firewall və seqmentasiya; (2) yenilənmiş, sərtləşdirilmiş serverlər; (3) təhlükəsiz kod və WAF; (4) admin hesablarında MFA və təlim; (5) monitorinq və sınaqdan keçirilmiş ehtiyat nüsxələr.",
        "Example: (1) firewall and segmentation; (2) updated, hardened servers; (3) secure code and a WAF; (4) MFA on admin accounts and training; (5) monitoring and tested backups.",
      ),
    },
    quiz: [
      q(
        l("Veb server adətən hansı zonada yerləşir?", "Which zone usually holds the web server?"),
        ["DMZ", l("Daxili", "Internal"), l("İdarəetmə", "Management")],
        0,
        l("İctimai xidmətlər DMZ-də yerləşdirilir.", "Public services are placed in the DMZ."),
      ),
      q(
        l("Sıfır etibar modelində əsas prinsip nədir?", "What is the core principle of zero trust?"),
        [l("Hər sorğunu yoxlamaq", "Verify every request"), l("Daxili şəbəkəyə tam etibar", "Fully trust the internal network"), l("Firewall-suz iş", "Work without firewalls")],
        0,
        l("\"Heç vaxt etibar etmə, həmişə yoxla\" (never trust, always verify).", "\"Never trust, always verify.\""),
      ),
    ],
    refs: [
      ref("NIST SP 800-207 — Zero Trust Architecture", "https://csrc.nist.gov/pubs/sp/800/207/final"),
      ref("NIST CSRC Glossary — defense-in-depth", "https://csrc.nist.gov/glossary/term/defense_in_depth"),
    ],
  },
];

// ───────────────────────────── D · Kali Linux (introductory) ─────────────────────────────
const D: SecTopic[] = [
  {
    id: "kali-what",
    module: "kali",
    title: t4("Kali Linux nədir?", "What is Kali Linux?", "Kali Linux nedir?", "Что такое Kali Linux?"),
    intro: l(
      "Kali Linux təhlükəsizlik mütəxəssisləri üçün hazırlanmış, Debian əsaslı Linux paylanmasıdır. Onu OffSec (əvvəlki adı Offensive Security) şirkəti saxlayır və maliyyələşdirir. Kali 2013-cü ildə BackTrack-in davamçısı kimi buraxılıb və icazəli sızma testləri (penetration testing), təhlükəsizlik tədqiqatı, rəqəmsal kriminalistika (digital forensics) və tərs mühəndislik üçün nəzərdə tutulub.",
      "Kali Linux is a Debian-based Linux distribution built for security professionals. It is maintained and funded by OffSec (formerly Offensive Security). Kali was released in 2013 as the successor to BackTrack and is intended for authorised penetration testing, security research, digital forensics and reverse engineering.",
    ),
    concepts: [
      c("Debian əsaslı (Debian-based)", "Debian-based", "Kali Debian Testing budağına əsaslanır və eyni `apt` paket sistemindən istifadə edir.", "Kali is based on the Debian Testing branch and uses the same `apt` package system."),
      c("Rolling release", "Rolling release", "`kali-rolling` repozitoriyası davamlı yenilənir; ayrıca \"böyük versiyaya keçid\" lazım deyil.", "The `kali-rolling` repository is updated continuously; there is no separate \"major upgrade\"."),
      c("Kim üçündür?", "Who is it for?", "Rəsmi sənədlərə görə Kali gündəlik ümumi istifadə üçün deyil; Linux-u yeni öyrənənlər əvvəlcə Debian və ya Ubuntu kimi ümumi paylanma ilə başlamalıdır.", "According to the official docs, Kali is not meant as a general daily-use system; Linux beginners should start with a general distribution such as Debian or Ubuntu."),
    ],
    examples: [
      {
        title: l("Paylanmanı tanımaq", "Identifying the distribution"),
        lang: "plain",
        code: "cat /etc/os-release\n# ID=kali\n# ID_LIKE=debian\n# VERSION_CODENAME=kali-rolling",
        explain: l(
          "`ID_LIKE=debian` Kali-nin Debian ailəsinə aid olduğunu göstərir. Bu əmr yalnız faylı oxuyur. Qeyd: bu tətbiq heç bir əmri icra etmir — nümunələr yalnız oxumaq üçündür.",
          "`ID_LIKE=debian` shows that Kali belongs to the Debian family. The command only reads a file. Note: this app never executes commands — examples are for reading only.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Kali-ni \"hakerlik əməliyyat sistemi\" hesab etmək", "Thinking of Kali as a \"hacking OS\""),
        why: l(
          "Kali peşəkar alətlər toplusudur; alətlər öz-özlüyündə heç nəyi qanuni etmir. Onlardan yalnız sahibi olduğunuz və ya yazılı icazə aldığınız sistemlərdə istifadə etmək olar.",
          "Kali is a professional toolkit; the tools do not make anything legal by themselves. They may be used only on systems you own or have written permission to test.",
        ),
      },
      {
        title: l("Linux-u Kali ilə öyrənməyə başlamaq", "Learning Linux on Kali first"),
        why: l("Əvvəlcə ümumi paylanmada Linux əsaslarını öyrənin (B modulu), sonra Kali-yə keçin.", "Learn Linux basics on a general distribution first (module B), then move to Kali."),
      },
    ],
    exercise: {
      task: l(
        "Kali Linux haqqında üç faktı yazın: kim saxlayır, hansı paylanmaya əsaslanır və hansı məqsədlər üçün nəzərdə tutulub.",
        "Write three facts about Kali Linux: who maintains it, which distribution it is based on, and what it is intended for.",
      ),
      hints: [l("Rəsmi sənəd: kali.org/docs → \"What is Kali Linux?\"", "Official doc: kali.org/docs → \"What is Kali Linux?\"")],
      answer: l("OffSec saxlayır; Debian (Testing) əsaslıdır; icazəli sızma testi, təhlükəsizlik tədqiqatı, kriminalistika və tərs mühəndislik üçündür.", "Maintained by OffSec; based on Debian (Testing); intended for authorised penetration testing, security research, forensics and reverse engineering."),
    },
    quiz: [
      q(
        l("Kali Linux-u hansı təşkilat saxlayır?", "Which organisation maintains Kali Linux?"),
        ["OffSec", "Canonical", "Red Hat"],
        0,
        l("Kali OffSec (keçmiş Offensive Security) tərəfindən saxlanılır.", "Kali is maintained by OffSec (formerly Offensive Security)."),
      ),
      q(
        l("Kali hansı layihənin davamçısıdır?", "Kali is the successor of which project?"),
        ["BackTrack", "Knoppix", "Slackware"],
        0,
        l("Kali 2013-cü ildə BackTrack-i əvəz edib.", "Kali replaced BackTrack in 2013."),
      ),
      q(
        l("Kali Linux-dakı aləti istifadə etmək nə vaxt qanunidir?", "When is using a tool from Kali Linux legal?"),
        [l("Həmişə", "Always"), l("Yalnız öz sisteminizdə və ya yazılı icazə ilə", "Only on your own systems or with written permission"), l("Sayt açıq olduqda", "When a website is public")],
        1,
        l("Qanunilik alətdən yox, icazədən asılıdır.", "Legality depends on authorisation, not on the tool."),
      ),
    ],
    refs: [
      ref("Kali Docs — What is Kali Linux?", "https://www.kali.org/docs/introduction/what-is-kali-linux/"),
      ref("Kali Docs — Should I use Kali Linux?", "https://www.kali.org/docs/introduction/should-i-use-kali-linux/"),
      ref("Kali Linux Documentation", "https://www.kali.org/docs/"),
    ],
  },
  {
    id: "kali-desktop-packages",
    module: "kali",
    title: t4("Kali: masaüstü və paket idarəsi", "Kali: desktop and package management", "Kali: masaüstü ve paket yönetimi", "Kali: рабочий стол и управление пакетами"),
    intro: l(
      "Kali-nin default masaüstü Xfce-dir (GNOME və KDE də mövcuddur). 2020-ci ildən etibarən default olaraq root yox, adi istifadəçi ilə işləyir. Proqramlar `apt` və metapaketlər (metapackages) vasitəsilə quraşdırılır.",
      "Kali's default desktop is Xfce (GNOME and KDE are also available). Since 2020 it uses a normal user by default instead of root. Software is installed with `apt` and metapackages.",
    ),
    concepts: [
      c("Metapaketlər (metapackages)", "Metapackages", "Bir neçə paketi birlikdə quraşdıran boş paketlər: `kali-linux-core`, `kali-linux-default`, `kali-linux-large`, `kali-linux-everything`, və kateqoriyalar üzrə `kali-tools-*`.", "Empty packages that pull in a set of packages: `kali-linux-core`, `kali-linux-default`, `kali-linux-large`, `kali-linux-everything`, and per-category `kali-tools-*`."),
      c("Rəsmi repozitoriya", "Official repository", "Default mənbə `kali-rolling`-dir; Debian və ya Ubuntu repozitoriyalarını əlavə etmək sistemi poza bilər.", "The default source is `kali-rolling`; adding Debian or Ubuntu repositories can break the system."),
      c("Adi istifadəçi + sudo", "Normal user + sudo", "Gündəlik iş adi hesabla aparılır, inzibati əmrlər `sudo` ilə — ən az imtiyaz prinsipi.", "Daily work uses a normal account and admin commands use `sudo` — least privilege."),
    ],
    examples: [
      {
        title: l("Kali-ni yeniləmək (rəsmi tövsiyə)", "Updating Kali (official recommendation)"),
        lang: "plain",
        code: "sudo apt update\nsudo apt full-upgrade\napt show kali-linux-default   # read what a metapackage contains",
        explain: l(
          "Kali sənədləri yeniləmə üçün `apt full-upgrade` tövsiyə edir, çünki rolling sistemdə asılılıqlar tez-tez dəyişir. `apt show` yalnız məlumatı oxuyur. Bu tətbiq bu əmrləri icra etmir.",
          "Kali's docs recommend `apt full-upgrade` because dependencies change often on a rolling system. `apt show` only reads information. This app does not run these commands.",
        ),
      },
      {
        title: l("Rəsmi mənbə sətri", "The official source line"),
        lang: "plain",
        code: "# /etc/apt/sources.list\ndeb http://http.kali.org/kali kali-rolling main contrib non-free non-free-firmware",
        explain: l(
          "Bu, Kali sənədlərində göstərilən standart repozitoriya sətridir. Paketlər imza ilə yoxlanır; buraya digər paylanmaların repozitoriyalarını qarışdırmayın.",
          "This is the standard repository line from the Kali docs. Packages are signature-checked; do not mix in other distributions' repositories here.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Kali-yə Ubuntu/Debian repozitoriyası əlavə etmək", "Adding Ubuntu/Debian repositories to Kali"),
        why: l("Fərqli paylanmaların paketləri uyğunsuz asılılıqlar yaradır və sistemi yenilənməz edə bilər. Yalnız rəsmi Kali mənbəyindən istifadə edin.", "Packages from different distributions create conflicting dependencies and can make the system impossible to update. Use only the official Kali source."),
      },
      {
        title: l("Hər şeyi root kimi işlətmək", "Running everything as root"),
        why: l("Köhnə Kali versiyalarında root default idi; indi adi istifadəçi defaultdur. Bunu dəyişməyin.", "Old Kali versions defaulted to root; now a normal user is the default. Keep it that way."),
      },
    ],
    exercise: {
      task: l(
        "Laboratoriya virtual maşınınızda yalnız kriminalistika (forensics) alətləri lazımdır. Kali sənədlərindəki metapaketlər səhifəsinə əsasən hansı metapaket adı uyğundur və onu quraşdırmazdan əvvəl məzmununu necə oxuyardınız?",
        "Your lab VM needs only forensics tools. Based on the metapackages page in the Kali docs, which metapackage name fits, and how would you read its contents before installing it?",
      ),
      hints: [l("Kateqoriya metapaketləri `kali-tools-` ilə başlayır.", "Category metapackages start with `kali-tools-`.")],
      answer: l("`kali-tools-forensics`; əvvəlcə `apt show kali-tools-forensics` ilə təsvirini və asılılıqlarını oxumaq.", "`kali-tools-forensics`; first read its description and dependencies with `apt show kali-tools-forensics`."),
    },
    quiz: [
      q(
        l("Kali-nin default masaüstü hansıdır?", "What is Kali's default desktop?"),
        ["Xfce", "Unity", "Cinnamon"],
        0,
        l("2019.4 versiyasından bəri default Xfce-dir.", "Xfce has been the default since 2019.4."),
      ),
      q(
        l("Kali-ni yeniləmək üçün sənədlər hansı əmri tövsiyə edir?", "Which command do the docs recommend for updating Kali?"),
        ["sudo apt full-upgrade", "sudo dnf upgrade", "sudo pacman -Syu"],
        0,
        l("Kali Debian əsaslıdır və `apt full-upgrade` istifadə edir.", "Kali is Debian-based and uses `apt full-upgrade`."),
      ),
    ],
    refs: [
      ref("Kali Docs — Metapackages", "https://www.kali.org/docs/general-use/metapackages/"),
      ref("Kali Docs — Updating Kali", "https://www.kali.org/docs/general-use/updating-kali/"),
      ref("Kali Docs — Kali Linux Network Repositories", "https://www.kali.org/docs/general-use/kali-linux-sources-list-repositories/"),
    ],
  },
  {
    id: "kali-tool-categories",
    module: "kali",
    title: t4("Kali alət kateqoriyaları", "Kali tool categories", "Kali araç kategorileri", "Категории инструментов Kali"),
    intro: l(
      "Kali menyusu alətləri məqsədə görə kateqoriyalara bölür. Bu dərs alətlərin necə işlədiyini öyrətmir; yalnız hər kateqoriyanın peşəkar təhlükəsizlik işində nə üçün istifadə olunduğunu izah edir. Hər hansı qiymətləndirmə yalnız yazılı icazə və razılaşdırılmış əhatə dairəsi (scope) çərçivəsində aparılır.",
      "The Kali menu groups tools by purpose. This lesson does not teach how the tools work; it only explains what each category is used for in professional security work. Any assessment happens only with written authorisation and an agreed scope.",
    ),
    concepts: [
      c("Məlumat toplama (information gathering)", "Information gathering", "Sahibinin icazəsi ilə hansı aktivlərin (domenlər, serverlər) mövcud olduğunu sənədləşdirmək — müdafiəçilər bunu öz aktiv inventarlarını yoxlamaq üçün edir.", "Documenting which assets (domains, servers) exist, with the owner's permission — defenders do this to check their own asset inventory."),
      c("Zəiflik təhlili (vulnerability analysis)", "Vulnerability analysis", "Məlum zəiflikləri və köhnə proqram versiyalarını tapmaq ki, onlar yenilənsin.", "Finding known weaknesses and outdated software versions so they can be patched."),
      c("Veb tətbiq təhlili (web application analysis)", "Web application analysis", "Öz tətbiqinizin təhlükəsizliyini (məsələn, lokal test mühitində) yoxlamaq üçün.", "Checking the security of your own application (for example, in a local test environment)."),
      c("Parol yoxlaması (password attacks)", "Password attacks", "İcazəli auditdə təşkilatın parol siyasətinin zəif parolların qarşısını alıb-almadığını ölçmək.", "In an authorised audit, measuring whether an organisation's password policy actually prevents weak passwords."),
      c("Simsiz şəbəkə (wireless)", "Wireless", "Öz Wi-Fi şəbəkənizin konfiqurasiyasını (məsələn, WPA3 istifadəsi) yoxlamaq.", "Checking your own Wi-Fi configuration (e.g. use of WPA3)."),
      c("Kriminalistika (forensics)", "Forensics", "İnsidentdən sonra sübutları dəyişdirmədən toplamaq və təhlil etmək — tamamilə müdafiə yönümlüdür.", "Collecting and analysing evidence after an incident without altering it — entirely defensive."),
      c("Tərs mühəndislik (reverse engineering)", "Reverse engineering", "Proqramın necə işlədiyini başa düşmək, məsələn, şübhəli faylın təhlükəsiz təhlili.", "Understanding how a program works, e.g. safely analysing a suspicious file."),
      c("Hesabat (reporting)", "Reporting", "Tapıntıları sənədləşdirmək və düzəliş tövsiyələri vermək — hər qiymətləndirmənin əsas nəticəsi.", "Documenting findings and fix recommendations — the main deliverable of every assessment."),
    ],
    examples: [
      {
        title: l("Kateqoriya metapaketini oxumaq (quraşdırmadan)", "Reading a category metapackage (without installing)"),
        lang: "plain",
        code: "apt show kali-tools-forensics\napt show kali-tools-reporting",
        explain: l(
          "`apt show` yalnız paketin təsvirini və hansı alətləri ehtiva etdiyini göstərir. Bu, kateqoriyaları öyrənməyin təhlükəsiz yoludur. Alətlərin tam siyahısı və təsviri kali.org/tools səhifəsindədir.",
          "`apt show` only displays the package description and which tools it includes. This is a safe way to explore categories. The full list and descriptions are on kali.org/tools.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("\"Sadəcə yoxlayıram\" deyərək başqasının sisteminə alət tətbiq etmək", "Running a tool against someone else's system \"just to check\""),
        why: l(
          "İcazəsiz skan və ya yoxlama bir çox ölkədə, o cümlədən Azərbaycanda, qanunla cəzalandırıla bilər və xidmətlərə zərər verə bilər. Yalnız öz laboratoriyanızda və ya yazılı icazə ilə işləyin.",
          "Unauthorised scanning or testing can be a criminal offence in many countries, including Azerbaijan, and can harm services. Work only in your own lab or with written permission.",
        ),
      },
      {
        title: l("Bütün alətləri quraşdırmaq", "Installing every tool"),
        why: l("`kali-linux-everything` çox böyükdür və hücum səthini artırır. Yalnız işiniz üçün lazım olan kateqoriyanı quraşdırın.", "`kali-linux-everything` is very large and increases the attack surface. Install only the category your work needs."),
      },
    ],
    exercise: {
      task: l(
        "Şirkətinizdə zərərli proqram insidenti olub. Hansı iki Kali kateqoriyası müdafiə komandasına ən çox kömək edər və niyə?",
        "Your company had a malware incident. Which two Kali categories help the defensive team most, and why?",
      ),
      hints: [l("Sübut toplamaq və nəticəni sənədləşdirmək.", "Collecting evidence and documenting results.")],
      answer: l(
        "Kriminalistika (sübutları dəyişdirmədən toplamaq və təhlil etmək) və hesabat (nə baş verdiyini və düzəlişləri sənədləşdirmək). Şübhəli faylın təhlili lazım olarsa, tərs mühəndislik də təcrid olunmuş mühitdə istifadə oluna bilər.",
        "Forensics (collecting and analysing evidence without altering it) and reporting (documenting what happened and the fixes). If a suspicious file needs analysis, reverse engineering can also be used in an isolated environment.",
      ),
    },
    quiz: [
      q(
        l("Hansı kateqoriya tamamilə müdafiə yönümlüdür?", "Which category is entirely defensive?"),
        [l("Kriminalistika", "Forensics"), l("Parol yoxlaması", "Password attacks"), l("Simsiz", "Wireless")],
        0,
        l("Kriminalistika insidentdən sonra sübut toplamaq və təhlil üçündür.", "Forensics collects and analyses evidence after an incident."),
      ),
      q(
        l("Hər icazəli qiymətləndirmənin əsas nəticəsi nədir?", "What is the main deliverable of every authorised assessment?"),
        [l("Düzəliş tövsiyələri olan hesabat", "A report with fix recommendations"), l("Ekran görüntüləri", "Screenshots"), l("Alət siyahısı", "A list of tools")],
        0,
        l("Məqsəd sistemi daha təhlükəsiz etməkdir; bu, aydın hesabatla olur.", "The goal is a safer system, which requires a clear report."),
      ),
    ],
    refs: [
      ref("Kali Tools", "https://www.kali.org/tools/"),
      ref("Kali Docs — Metapackages", "https://www.kali.org/docs/general-use/metapackages/"),
      ref("NIST SP 800-115 — Technical Guide to Information Security Testing and Assessment", "https://csrc.nist.gov/pubs/sp/800/115/final"),
    ],
  },
  {
    id: "kali-legal-ethics",
    module: "kali",
    title: t4("Qanuni və etik istifadə", "Legal and ethical use", "Yasal ve etik kullanım", "Законное и этичное использование"),
    intro: l(
      "Təhlükəsizlik alətləri ilə işləməyin ən vacib qaydası icazədir. Sistemin sahibindən yazılı icazə, aydın əhatə dairəsi (scope) və iş qaydaları (rules of engagement) olmadan heç bir test aparılmır. Bu, peşəkar etikanın və qanunun tələbidir.",
      "The most important rule for working with security tools is authorisation. No testing happens without written permission from the system owner, a clear scope and rules of engagement. This is required by professional ethics and by law.",
    ),
    concepts: [
      c("Yazılı icazə (written authorisation)", "Written authorisation", "Sistemin həqiqi sahibi tərəfindən imzalanmış sənəd: nəyi, nə vaxt, kim test edir.", "A document signed by the real system owner stating what is tested, when and by whom."),
      c("Əhatə dairəsi (scope)", "Scope", "Hansı ünvanlar, domenlər və tətbiqlər daxildir, hansılar xaricdir. Əhatədən kənara çıxmaq icazəsiz girişdir.", "Which addresses, domains and applications are in and out. Going outside the scope is unauthorised access."),
      c("Məsuliyyətli açıqlama (responsible disclosure)", "Responsible disclosure", "Təsadüfən tapılan zəifliyi istismar etmədən sahibinə (məsələn, security.txt vasitəsilə) bildirmək.", "Reporting a vulnerability you found by chance to its owner (e.g. via security.txt) without exploiting it."),
      c("Bug bounty proqramları", "Bug bounty programmes", "Şirkətin açıq şəkildə dərc etdiyi qaydalar çərçivəsində icazəli test; qaydalar mütləq oxunmalıdır.", "Authorised testing under rules a company publishes; the rules must be read and followed."),
    ],
    examples: [
      {
        title: l("İcazə sənədinin əsas hissələri", "Key parts of an authorisation document"),
        lang: "plain",
        code: "Client / owner:     Example LLC (signed by: IT Director)\nTester:             Jane Doe\nIn scope:           test.example.com, 10.10.0.0/24 (lab)\nOut of scope:       production database, third-party services\nTime window:        2026-12-01 09:00 - 2026-12-03 18:00\nAllowed activities: as listed in the signed agreement\nEmergency contact:  +994 ... (24/7)\nReporting:          written report within 5 working days",
        explain: l(
          "Bu, peşəkar qiymətləndirmədən əvvəl razılaşdırılan sənədin sadələşdirilmiş nümunəsidir. Əhatə, vaxt və təcili əlaqə aydın olmalıdır. Hüquqi sənədlər üçün hüquqşünasla məsləhətləşin.",
          "This is a simplified example of what is agreed before a professional assessment. Scope, time window and emergency contact must be clear. For legal documents, consult a lawyer.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Şifahi icazə ilə kifayətlənmək", "Relying on verbal permission"),
        why: l("Problem yaranarsa, şifahi razılığı sübut etmək mümkün deyil. Həmişə yazılı, imzalı icazə alın.", "If something goes wrong, verbal consent cannot be proven. Always get signed, written permission."),
      },
      {
        title: l("İcazəni yanlış şəxsdən almaq", "Getting permission from the wrong person"),
        why: l("Bir işçinin \"icazə verirəm\" deməsi kifayət deyil; sistemin həqiqi sahibi və ya səlahiyyətli nümayəndəsi imzalamalıdır. Bulud xidmətlərində provayderin qaydaları da tətbiq olunur.", "An employee saying \"go ahead\" is not enough; the real owner or an authorised representative must sign. Cloud providers' rules also apply."),
      },
    ],
    exercise: {
      task: l(
        "Hansı hallarda test etmək olar: (a) öz noutbukunuzda işləyən OWASP Juice Shop; (b) dostunuzun \"yoxla görüm\" dediyi şirkət saytı; (c) şirkətinizin imzalı icazə verdiyi test serveri; (d) qonşunun Wi-Fi şəbəkəsi?",
        "In which cases may you test: (a) OWASP Juice Shop running on your own laptop; (b) a company website a friend said to \"just check\"; (c) a test server your company authorised in writing; (d) a neighbour's Wi-Fi?",
      ),
      hints: [l("Sahiblik və yazılı icazə.", "Ownership and written permission.")],
      answer: l(
        "Yalnız (a) və (c). (b) dostunuz saytın sahibi deyil və yazılı icazə yoxdur; (d) icazəsiz girişdir.",
        "Only (a) and (c). In (b) your friend is not the owner and there is no written permission; (d) is unauthorised access.",
      ),
    },
    quiz: [
      q(
        l("Testdən əvvəl ən vacib şey nədir?", "What is the most important thing before testing?"),
        [l("Sahibin yazılı icazəsi", "Written permission from the owner"), l("Ən yeni alət", "The newest tool"), l("Sürətli internet", "Fast internet")],
        0,
        l("İcazə olmadan test icazəsiz girişdir.", "Testing without permission is unauthorised access."),
      ),
      q(
        l("Təsadüfən zəiflik tapsanız, nə etməlisiniz?", "If you find a vulnerability by chance, what should you do?"),
        [l("İstismar edib sübut etmək", "Exploit it to prove it"), l("Sahibinə məsuliyyətlə bildirmək", "Report it responsibly to the owner"), l("Sosial şəbəkədə paylaşmaq", "Post it on social media")],
        1,
        l("Məsuliyyətli açıqlama sahibinə problemi düzəltmək imkanı verir.", "Responsible disclosure gives the owner the chance to fix it."),
      ),
    ],
    refs: [
      ref("NIST SP 800-115 — Technical Guide to Information Security Testing and Assessment", "https://csrc.nist.gov/pubs/sp/800/115/final"),
      ref("OWASP — Vulnerability Disclosure Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html"),
      ref("RFC 9116 — security.txt", "https://www.rfc-editor.org/rfc/rfc9116"),
    ],
  },
  {
    id: "kali-safe-lab",
    module: "kali",
    title: t4("Təhlükəsiz laboratoriya qurmaq", "Setting up a safe lab", "Güvenli bir laboratuvar kurmak", "Создание безопасной лаборатории"),
    intro: l(
      "Təhlükəsizliyi öyrənmək üçün yalnız sizə məxsus, təcrid olunmuş mühit istifadə edin: virtual maşınlar (VirtualBox, VMware, Hyper-V) və öz kompüterinizdə lokal işləyən, qəsdən zəif hazırlanmış təlim tətbiqləri (məsələn, OWASP Juice Shop). Kali sənədləri virtual maşın və WSL quraşdırmasını ətraflı izah edir. Bu tətbiq Kali və ya WSL ilə inteqrasiya olunmur və heç bir əmri icra etmir.",
      "To learn security, use only an isolated environment that belongs to you: virtual machines (VirtualBox, VMware, Hyper-V) and intentionally vulnerable training apps running locally on your own computer (e.g. OWASP Juice Shop). The Kali docs explain VM and WSL setup in detail. This app does not integrate with Kali or WSL and never executes commands.",
    ),
    concepts: [
      c("Virtual maşın (VM)", "Virtual machine", "Ayrı əməliyyat sistemi kimi işləyir; snapshot ilə səhvdən sonra təmiz vəziyyətə qayıtmaq olur.", "Runs as a separate operating system; snapshots let you return to a clean state after a mistake."),
      c("Şəbəkə rejimləri", "Network modes", "\"Host-only\" və ya daxili şəbəkə VM-ləri yalnız bir-biri və host ilə əlaqələndirir. \"Bridged\" rejim VM-i real lokal şəbəkəyə qoşur — təlim üçün tövsiyə edilmir.", "\"Host-only\" or internal networks connect VMs only to each other and the host. \"Bridged\" puts the VM on your real LAN — not recommended for training."),
      c("WSL (konseptual)", "WSL (conceptually)", "Windows Subsystem for Linux Windows-da Kali kimi paylanmaları işlətməyə imkan verir, lakin WSL 2 şəbəkəni host ilə paylaşır, yəni tam təcrid deyil. Quraşdırma üçün kali.org/docs/wsl səhifəsinə baxın.", "Windows Subsystem for Linux runs distributions such as Kali on Windows, but WSL 2 shares networking with the host, so it is not full isolation. See kali.org/docs/wsl for setup."),
      c("Qəsdən zəif tətbiqlər", "Intentionally vulnerable apps", "OWASP Juice Shop kimi təlim tətbiqləri yalnız `127.0.0.1`-də işlədilməli və heç vaxt internetə açılmamalıdır.", "Training apps like OWASP Juice Shop must run only on `127.0.0.1` and never be exposed to the internet."),
    ],
    examples: [
      {
        title: l("Juice Shop-u yalnız lokal işlətmək (Docker)", "Running Juice Shop locally only (Docker)"),
        lang: "plain",
        code: "docker run --rm -p 127.0.0.1:3000:3000 bkimminich/juice-shop\n# open http://127.0.0.1:3000 in your browser",
        explain: l(
          "`-p 127.0.0.1:3000:3000` portu yalnız loopback interfeysinə bağlayır, ona görə tətbiq şəbəkədəki digər cihazlardan görünmür. `--rm` konteyner dayandıqda onu silir. Rəsmi təlimat OWASP Juice Shop layihə səhifəsindədir. Bu tətbiq əmri sizin üçün icra etmir.",
          "`-p 127.0.0.1:3000:3000` binds the port to loopback only, so the app is not reachable from other devices on the network. `--rm` removes the container when it stops. The official guide is on the OWASP Juice Shop project page. This app does not run the command for you.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Zəif tətbiqi bütün interfeyslərdə açmaq", "Exposing a vulnerable app on all interfaces"),
        why: l("Portu `0.0.0.0`-a bağlamaq qəsdən zəif tətbiqi lokal şəbəkədəki hər kəs üçün əlçatan edir.", "Binding to `0.0.0.0` makes an intentionally vulnerable app reachable by everyone on your network."),
        wrong: "docker run -p 3000:3000 bkimminich/juice-shop",
        right: "docker run --rm -p 127.0.0.1:3000:3000 bkimminich/juice-shop",
        lang: "plain",
      },
      {
        title: l("Laboratoriyanı real şəbəkəyə qoşmaq", "Connecting the lab to a real network"),
        why: l("Bridged rejim və ya iş şəbəkəsi təlim trafiki ilə real sistemləri təsadüfən təsirləndirə bilər. Host-only/daxili şəbəkə istifadə edin.", "Bridged mode or a work network can accidentally affect real systems with training traffic. Use host-only/internal networking."),
      },
    ],
    exercise: {
      task: l(
        "Təhlükəsiz laboratoriya üçün yoxlama siyahısı hazırlayın (ən azı 5 bənd).",
        "Prepare a checklist for a safe lab (at least 5 items).",
      ),
      hints: [l("Sahiblik, təcrid, snapshot, lokal bağlama, yeniləmələr.", "Ownership, isolation, snapshots, local binding, updates.")],
      answer: l(
        "(1) Yalnız öz cihazım və öz VM-lərim; (2) host-only/daxili şəbəkə; (3) təmiz snapshot; (4) zəif tətbiqlər yalnız `127.0.0.1`-də; (5) real parol və şəxsi məlumat yoxdur; (6) iş bitəndə zəif tətbiqləri dayandırmaq.",
        "(1) Only my own device and my own VMs; (2) host-only/internal networking; (3) a clean snapshot; (4) vulnerable apps bound to `127.0.0.1` only; (5) no real passwords or personal data; (6) stop vulnerable apps when finished.",
      ),
    },
    quiz: [
      q(
        l("Təlim VM-i üçün ən təhlükəsiz şəbəkə rejimi hansıdır?", "Which network mode is safest for a training VM?"),
        ["Bridged", "Host-only", l("İctimai Wi-Fi", "Public Wi-Fi")],
        1,
        l("Host-only VM-i real şəbəkədən ayırır.", "Host-only keeps the VM away from your real network."),
      ),
      q(
        l("WSL 2 tam təcrid olunmuş laboratoriyadırmı?", "Is WSL 2 a fully isolated lab?"),
        [l("Bəli", "Yes"), l("Xeyr, şəbəkəni host ilə paylaşır", "No, it shares networking with the host")],
        1,
        l("WSL rahatdır, lakin təcrid lazım olanda VM daha uyğundur.", "WSL is convenient, but a VM is better when isolation matters."),
      ),
    ],
    refs: [
      ref("Kali Docs — Virtualization", "https://www.kali.org/docs/virtualization/"),
      ref("Kali Docs — WSL", "https://www.kali.org/docs/wsl/"),
      ref("OWASP Juice Shop", "https://owasp.org/www-project-juice-shop/"),
      ref("Microsoft Learn — WSL networking", "https://learn.microsoft.com/en-us/windows/wsl/networking"),
    ],
  },
];

// ───────────────────────────── E · Defensive security ─────────────────────────────
const E: SecTopic[] = [
  {
    id: "def-hardening",
    module: "defense",
    title: t4("Sistemin sərtləşdirilməsi", "System hardening", "Sistem sıkılaştırma", "Усиление защиты системы"),
    intro: l(
      "Sərtləşdirmə (hardening) sistemdə lazımsız hər şeyi söndürmək və qalanları təhlükəsiz parametrlərlə konfiqurasiya etməkdir. Məqsəd hücum səthini kiçiltməkdir.",
      "Hardening means turning off everything a system does not need and configuring the rest securely. The goal is a smaller attack surface.",
    ),
    concepts: [
      c("Minimal quraşdırma", "Minimal install", "Yalnız lazım olan paket və xidmətlər.", "Only the packages and services you need."),
      c("Təhlükəsiz SSH", "Secure SSH", "Açarla giriş, root girişini və parol autentifikasiyasını söndürmək.", "Key-based login, root login and password authentication turned off."),
      c("Avtomatik təhlükəsizlik yeniləmələri", "Automatic security updates", "Debian/Ubuntu-da `unattended-upgrades` paketi.", "The `unattended-upgrades` package on Debian/Ubuntu."),
      c("Benchmark-lar", "Benchmarks", "CIS Benchmarks kimi sənədlər yoxlanıla bilən sərtləşdirmə tövsiyələri verir.", "Documents such as the CIS Benchmarks give checkable hardening recommendations."),
    ],
    examples: [
      {
        title: l("SSH server parametrləri", "SSH server settings"),
        lang: "plain",
        code: "# /etc/ssh/sshd_config\nPermitRootLogin no\nPasswordAuthentication no\nPubkeyAuthentication yes\n\n# test the config before restarting:\nsudo sshd -t && sudo systemctl restart ssh",
        explain: l(
          "Root ilə birbaşa giriş və parolla giriş söndürülür, yalnız açar qalır. `sshd -t` sintaksisi yoxlayır; xəta yoxdursa xidmət yenidən başladılır. Əvvəlcə açarla girişin işlədiyini başqa sessiyada yoxlayın.",
          "Direct root login and password login are disabled; only keys remain. `sshd -t` checks the syntax; the service restarts only if it is valid. Confirm key login works in a second session first.",
        ),
      },
      {
        title: l("Avtomatik təhlükəsizlik yeniləmələri", "Automatic security updates"),
        lang: "plain",
        code: "sudo apt install unattended-upgrades\nsudo dpkg-reconfigure -plow unattended-upgrades",
        explain: l(
          "Paket təhlükəsizlik yeniləmələrini avtomatik quraşdırır; ikinci əmr onu interaktiv şəkildə aktivləşdirir.",
          "The package installs security updates automatically; the second command enables it interactively.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Konfiqurasiyanı yoxlamadan xidməti yenidən başlatmaq", "Restarting a service without testing the config"),
        why: l("Səhv `sshd_config` uzaq serverə girişinizi kəsə bilər. Həmişə `sshd -t` və ikinci açıq sessiya istifadə edin.", "A broken `sshd_config` can lock you out of a remote server. Always use `sshd -t` and keep a second session open."),
      },
    ],
    exercise: {
      task: l(
        "Yeni Debian web serveri üçün beş sərtləşdirmə addımını prioritet sırası ilə yazın.",
        "Write five hardening steps for a new Debian web server in priority order.",
      ),
      hints: [l("Yeniləmə, SSH, firewall, xidmətlər, monitorinq.", "Updates, SSH, firewall, services, monitoring.")],
      answer: l(
        "(1) `apt update && apt upgrade` və avtomatik yeniləmələr; (2) SSH: açar, root və parol girişi söndürülür; (3) ufw: default deny, yalnız 22 və 443; (4) lazımsız xidmətləri `systemctl disable --now` ilə söndürmək; (5) jurnal monitorinqi və xəbərdarlıqlar.",
        "(1) `apt update && apt upgrade` plus automatic updates; (2) SSH: keys only, root and password login off; (3) ufw: default deny, only 22 and 443; (4) disable unneeded services with `systemctl disable --now`; (5) log monitoring and alerts.",
      ),
    },
    quiz: [
      q(
        l("`sshd -t` nə edir?", "What does `sshd -t` do?"),
        [l("Konfiqurasiyanı yoxlayır", "Tests the configuration"), l("SSH-ı söndürür", "Turns SSH off"), l("Açar yaradır", "Creates a key")],
        0,
        l("`-t` test rejimidir: sintaksis və açarları yoxlayır.", "`-t` is test mode: it checks syntax and keys."),
      ),
      q(
        l("Sərtləşdirmənin əsas məqsədi nədir?", "What is the main goal of hardening?"),
        [l("Hücum səthini azaltmaq", "Reducing the attack surface"), l("Sistemi sürətləndirmək", "Speeding up the system"), l("Daha çox xidmət əlavə etmək", "Adding more services")],
        0,
        l("Daha az komponent — daha az zəiflik.", "Fewer components mean fewer weaknesses."),
      ),
    ],
    refs: [
      ref("CIS Benchmarks", "https://www.cisecurity.org/cis-benchmarks"),
      ref("Debian Wiki — UnattendedUpgrades", "https://wiki.debian.org/UnattendedUpgrades"),
      ref("OpenBSD manpage — sshd_config(5)", "https://man.openbsd.org/sshd_config"),
    ],
  },
  {
    id: "def-monitoring",
    module: "defense",
    title: t4("Monitorinq", "Monitoring", "İzleme", "Мониторинг"),
    intro: l(
      "Monitorinq sistemlərin vəziyyətini və təhlükəsizlik hadisələrini daim izləməkdir. Yaxşı monitorinq problemi istifadəçilərdən və ya hücumçudan əvvəl görməyə imkan verir.",
      "Monitoring is continuously watching systems' health and security events. Good monitoring lets you see a problem before users — or an attacker — do.",
    ),
    concepts: [
      c("Mərkəzləşdirilmiş jurnallar", "Centralised logging", "Jurnallar ayrıca serverə və ya SIEM sisteminə göndərilir ki, sındırılmış hostda silinsə belə nüsxə qalsın.", "Logs are shipped to a separate server or SIEM so a copy survives even if a compromised host deletes them."),
      c("Xəbərdarlıqlar (alerts)", "Alerts", "Vacib hadisələr (çoxlu uğursuz giriş, yeni admin istifadəçi) üçün avtomatik bildiriş.", "Automatic notifications for key events (many failed logins, a new admin user)."),
      c("Əsas xətt (baseline)", "Baseline", "Normal trafik və resurs istifadəsinin təsviri; anomaliyalar bununla müqayisə edilir.", "A description of normal traffic and resource use; anomalies are compared against it."),
    ],
    examples: [
      {
        title: l("Sadə sağlamlıq yoxlaması", "A simple health check"),
        lang: "plain",
        code: "uptime                 # load average\nfree -h                # memory\ndf -h /                # root disk usage\nsystemctl --failed     # services that failed",
        explain: l(
          "Bu əmrlər yalnız vəziyyəti oxuyur. Real mühitdə bu yoxlamalar avtomatlaşdırılır və hədd keçiləndə xəbərdarlıq göndərilir.",
          "These commands only read state. In production these checks are automated and send alerts when thresholds are crossed.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Çox sayda faydasız xəbərdarlıq", "Too many useless alerts"),
        why: l("\"Xəbərdarlıq yorğunluğu\" (alert fatigue) vacib siqnalların gözdən qaçmasına səbəb olur. Hər xəbərdarlıq konkret əməliyyat tələb etməlidir.", "Alert fatigue makes important signals get missed. Every alert should require a concrete action."),
      },
    ],
    exercise: {
      task: l(
        "Kiçik server üçün üç təhlükəsizlik xəbərdarlığı və hər biri üçün bir cavab tədbiri təklif edin.",
        "Propose three security alerts for a small server and one response for each.",
      ),
      hints: [l("Girişlər, istifadəçilər, xidmətlər.", "Logins, users, services.")],
      answer: l(
        "(1) 5 dəqiqədə bir ünvandan 20+ uğursuz SSH girişi → ünvanı müvəqqəti bloklamaq və yoxlamaq; (2) `sudo` qrupuna yeni üzv → dəyişikliyin icazəli olduğunu təsdiqləmək; (3) veb xidmətinin dayanması → yenidən başlatmaq və səbəbini jurnalda araşdırmaq.",
        "(1) 20+ failed SSH logins from one address in 5 minutes → temporarily block and investigate; (2) a new member of the `sudo` group → confirm the change was authorised; (3) the web service stopped → restart it and find the cause in the logs.",
      ),
    },
    quiz: [
      q(
        l("Jurnalları niyə ayrıca serverə göndərmək lazımdır?", "Why send logs to a separate server?"),
        [l("Hücumçu hostdakı jurnalları silə bilər", "An attacker may delete logs on the host"), l("Disk sahəsinə qənaət üçün", "To save disk space"), l("Lazım deyil", "It is not needed")],
        0,
        l("Mərkəzləşdirilmiş nüsxə sübutu qoruyur.", "A central copy preserves evidence."),
      ),
      q(
        l("Hansı əmr uğursuz systemd xidmətlərini göstərir?", "Which command lists failed systemd services?"),
        ["systemctl --failed", "ps --failed", "journalctl --failed"],
        0,
        l("`systemctl --failed` uğursuz unit-ləri göstərir.", "`systemctl --failed` lists failed units."),
      ),
    ],
    refs: [
      ref("OWASP Logging Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"),
      ref("NIST SP 800-92 — Guide to Computer Security Log Management", "https://csrc.nist.gov/pubs/sp/800/92/final"),
    ],
  },
  {
    id: "def-log-analysis",
    module: "defense",
    title: t4("Jurnal təhlili", "Log analysis", "Günlük analizi", "Анализ журналов"),
    intro: l(
      "Jurnal təhlili hadisələr arasında nümunələri tapmaqdır: kim, nə vaxt, haradan, nə etdi. Bu dərsdə nümunə SSH jurnalını oxuyub şübhəli fəaliyyəti müəyyən edəcəksiniz.",
      "Log analysis means finding patterns in events: who did what, when and from where. In this lesson you will read a sample SSH log and identify suspicious activity.",
    ),
    concepts: [
      c("Brute force nümunəsi", "Brute-force pattern", "Bir ünvandan qısa müddətdə çoxlu uğursuz giriş, çox vaxt müxtəlif istifadəçi adları ilə.", "Many failed logins from one address in a short time, often with varied usernames."),
      c("\"Invalid user\"", "\"Invalid user\"", "Sistemdə olmayan istifadəçi adı ilə cəhd — avtomatlaşdırılmış təxminin əlaməti.", "An attempt with a username that does not exist — a sign of automated guessing."),
      c("Uğurlu girişdən sonra korrelyasiya", "Correlation after success", "Çoxlu uğursuz cəhddən sonra eyni ünvandan uğurlu giriş ən təcili əlamətdir.", "A successful login from the same address after many failures is the most urgent signal."),
    ],
    examples: [
      {
        title: l("Uğursuz girişləri ünvana görə saymaq", "Counting failed logins per address"),
        lang: "plain",
        code: "sudo grep \"Failed password\" /var/log/auth.log \\\n  | grep -oE \"from [0-9.]+\" | sort | uniq -c | sort -rn | head",
        explain: l(
          "`grep -oE` yalnız \"from IP\" hissəsini çıxarır, `sort | uniq -c` təkrarları sayır, `sort -rn` ən çoxdan aza düzür. Nəticə hansı ünvanların ən çox cəhd etdiyini göstərir. systemd jurnalı üçün `journalctl -u ssh` çıxışını eyni cür süzmək olar.",
          "`grep -oE` extracts only the \"from IP\" part, `sort | uniq -c` counts repeats, `sort -rn` orders from most to least. The result shows which addresses tried most. For the systemd journal, filter the output of `journalctl -u ssh` the same way.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Yalnız uğursuz girişlərə baxmaq", "Looking only at failed logins"),
        why: l("Ən təhlükəli sətir uğurlu girişdir (`Accepted`) — xüsusilə gözlənilməz ünvandan və ya vaxtda.", "The most dangerous line is a successful login (`Accepted`) — especially from an unexpected address or time."),
      },
    ],
    exercise: {
      task: l(
        "Nümunə jurnalı oxuyun (ünvanlar sənədləşdirmə üçün ayrılmış aralıqlardandır). Hansı ünvan şübhəlidir, hansı sətir ən təcilidir və nə edərdiniz?",
        "Read the sample log (addresses are from ranges reserved for documentation). Which address is suspicious, which line is most urgent, and what would you do?",
      ),
      material: {
        lang: "plain",
        code: "Dec  1 03:12:01 web1 sshd[811]: Failed password for invalid user admin from 203.0.113.45 port 52344 ssh2\nDec  1 03:12:03 web1 sshd[811]: Failed password for invalid user test from 203.0.113.45 port 52350 ssh2\nDec  1 03:12:06 web1 sshd[815]: Failed password for root from 203.0.113.45 port 52361 ssh2\nDec  1 03:12:09 web1 sshd[815]: Failed password for deploy from 203.0.113.45 port 52370 ssh2\nDec  1 03:12:12 web1 sshd[820]: Accepted password for deploy from 203.0.113.45 port 52388 ssh2\nDec  1 09:01:44 web1 sshd[902]: Accepted publickey for alice from 198.51.100.7 port 50122 ssh2",
      },
      hints: [
        l("Eyni ünvanı və vaxt aralığını müqayisə edin.", "Compare the same address and time window."),
        l("Uğursuz cəhdlərdən sonra nə baş verib?", "What happened after the failures?"),
      ],
      answer: l(
        "`203.0.113.45` gecə saat 3-də 11 saniyə ərzində müxtəlif istifadəçi adları ilə cəhd edib (brute force). Ən təcili sətir 03:12:12 — eyni ünvandan `deploy` hesabına parolla uğurlu giriş. Cavab: insident kimi qeydə almaq, `deploy` hesabını kilidləmək və parolunu dəyişmək, sessiyaları dayandırmaq, həmin vaxtdan sonrakı fəaliyyəti araşdırmaq, SSH-da parol autentifikasiyasını söndürmək. `alice`-in açarla girişi iş saatında normal görünür.",
        "`203.0.113.45` tried several usernames within 11 seconds at 3 a.m. (brute force). The most urgent line is 03:12:12 — a successful password login to `deploy` from the same address. Response: record it as an incident, lock `deploy` and reset its password, terminate its sessions, investigate activity after that time, and disable SSH password authentication. `alice`'s key login during working hours looks normal.",
      ),
    },
    quiz: [
      q(
        l("Hansı sətir ən böyük narahatlıq yaradır?", "Which line is the biggest concern?"),
        [l("Bir uğursuz giriş", "One failed login"), l("Çoxlu uğursuzluqdan sonra eyni ünvandan uğurlu giriş", "A successful login from the same address after many failures"), l("İş saatında açarla giriş", "A key login during working hours")],
        1,
        l("Bu, təxminin uğurlu olduğunu göstərə bilər.", "It may mean the guessing succeeded."),
      ),
      q(
        l("`uniq -c` nə edir?", "What does `uniq -c` do?"),
        [l("Ardıcıl təkrarları sayır", "Counts consecutive duplicates"), l("Faylı silir", "Deletes a file"), l("Sətirləri şifrələyir", "Encrypts lines")],
        0,
        l("Ona görə əvvəlcə `sort` istifadə olunur.", "That is why `sort` comes first."),
      ),
      q(
        l("Nümunədə `203.0.113.45` ünvanı niyə seçilib?", "Why is `203.0.113.45` used in the sample?"),
        [l("Sənədləşdirmə üçün ayrılmış aralıqdandır (RFC 5737)", "It is from a range reserved for documentation (RFC 5737)"), l("Real hücumçunun ünvanıdır", "It is a real attacker's address")],
        0,
        l("RFC 5737 nümunələr üçün `192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` aralıqlarını ayırır.", "RFC 5737 reserves `192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` for examples."),
      ),
    ],
    refs: [
      ref("NIST SP 800-92 — Guide to Computer Security Log Management", "https://csrc.nist.gov/pubs/sp/800/92/final"),
      ref("RFC 5737 — IPv4 Address Blocks Reserved for Documentation", "https://www.rfc-editor.org/rfc/rfc5737"),
      ref("man7.org — uniq(1)", "https://man7.org/linux/man-pages/man1/uniq.1.html"),
    ],
  },
  {
    id: "def-access-management",
    module: "defense",
    title: t4("Giriş idarəetməsi", "Access management", "Erişim yönetimi", "Управление доступом к учётным записям"),
    intro: l(
      "Giriş idarəetməsi (identity and access management, IAM) hesabların bütün həyat dövrünü əhatə edir: yaradılma, hüquq verilməsi, müntəzəm yoxlama və işdən çıxanda dərhal bağlanma.",
      "Access management (identity and access management, IAM) covers the whole account lifecycle: creation, granting rights, regular review and immediate removal when someone leaves.",
    ),
    concepts: [
      c("Joiner–mover–leaver", "Joiner–mover–leaver", "İşə gələndə hesab yaradılır, vəzifə dəyişəndə hüquqlar yenilənir, gedəndə hesab bağlanır.", "Accounts are created on joining, rights updated on role change, accounts closed on leaving."),
      c("Müntəzəm yoxlama (access review)", "Access review", "Hər neçə aydan bir kimin nəyə çıxışı olduğunu yoxlamaq.", "Every few months, checking who has access to what."),
      c("İmtiyazlı hesablar (privileged accounts)", "Privileged accounts", "Admin hesabları ayrıca, MFA ilə və jurnala yazılaraq istifadə olunur.", "Admin accounts are separate, use MFA and are logged."),
    ],
    examples: [
      {
        title: l("Linux-da hesabı bağlamaq", "Disabling an account on Linux"),
        lang: "plain",
        code: "sudo usermod -L bob                 # lock the password\nsudo usermod -e 1 bob               # expire the account\ngetent group sudo                   # review who has sudo\nsudo last -n 20                     # recent logins",
        explain: l(
          "`-L` parolu kilidləyir, `-e 1` hesabın müddətini keçmişə qoyur (SSH açarlarına qarşı da işləyir). Sonra `sudo` qrupunun üzvlərini və son girişləri yoxlayırıq.",
          "`-L` locks the password and `-e 1` sets the expiry in the past (which also stops SSH key logins). Then we review `sudo` members and recent logins.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Ortaq (paylaşılan) admin hesabı", "A shared admin account"),
        why: l("Bir neçə nəfər eyni hesabı istifadə edəndə kimin nə etdiyini müəyyən etmək mümkün olmur. Hər kəsə şəxsi hesab və `sudo` verin.", "When several people use one account, you cannot tell who did what. Give everyone a personal account and `sudo`."),
      },
    ],
    exercise: {
      task: l(
        "İşçi bu gün şirkətdən gedir. Onun girişini bağlamaq üçün yoxlama siyahısı yazın.",
        "An employee leaves today. Write a checklist to remove their access.",
      ),
      hints: [l("Hesablar, açarlar, ortaq parollar, cihazlar.", "Accounts, keys, shared passwords, devices.")],
      answer: l(
        "Əsas hesabı və SSO-nu bağlamaq; SSH açarlarını `authorized_keys`-dən silmək; API tokenlərini ləğv etmək; onun bildiyi ortaq parolları dəyişmək; cihazları geri almaq; bütün addımları qeyd etmək.",
        "Disable the main account and SSO; remove SSH keys from `authorized_keys`; revoke API tokens; rotate any shared passwords they knew; collect devices; record every step.",
      ),
    },
    quiz: [
      q(
        l("İşçi gedəndə hesab nə vaxt bağlanmalıdır?", "When should a leaver's account be disabled?"),
        [l("Dərhal", "Immediately"), l("Bir ay sonra", "After a month"), l("Heç vaxt", "Never")],
        0,
        l("Aktiv qalan köhnə hesablar tez-tez sui-istifadə olunur.", "Old accounts left active are often abused."),
      ),
      q(
        l("`usermod -L` nə edir?", "What does `usermod -L` do?"),
        [l("Parolu kilidləyir", "Locks the password"), l("İstifadəçini silir", "Deletes the user"), l("Qrup əlavə edir", "Adds a group")],
        0,
        l("`-L` parol hash-inin əvvəlinə `!` qoyur; SSH açarları üçün əlavə olaraq hesabın müddətini bitirin.", "`-L` puts `!` in front of the password hash; also expire the account to stop SSH keys."),
      ),
    ],
    refs: [
      ref("man7.org — usermod(8)", "https://man7.org/linux/man-pages/man8/usermod.8.html"),
      ref("NIST SP 800-53 Rev. 5 — AC family", "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final"),
    ],
  },
  {
    id: "def-firewall-policy",
    module: "defense",
    title: t4("Firewall siyasəti", "Firewall policy", "Güvenlik duvarı politikası", "Политика межсетевого экрана"),
    intro: l(
      "Firewall qaydaları yazılı siyasətə əsaslanmalıdır: hansı xidmət kimə, hansı səbəbdən açıqdır. Gələn və çıxan trafik üçün ayrıca qərarlar verilir və hər qaydanın sahibi olur.",
      "Firewall rules should follow a written policy: which service is open to whom and why. Inbound and outbound traffic get separate decisions, and every rule has an owner.",
    ),
    concepts: [
      c("Gələn (ingress) və çıxan (egress)", "Ingress and egress", "Çıxan trafiki məhdudlaşdırmaq sındırılmış serverin xarici serverlərlə əlaqə qurmasını çətinləşdirir.", "Restricting outbound traffic makes it harder for a compromised server to contact outside servers."),
      c("Qayda sırası", "Rule order", "Firewall-lar adətən qaydaları yuxarıdan aşağı yoxlayır; ilk uyğun qayda qərar verir.", "Firewalls usually evaluate rules top-down; the first match decides."),
      c("Qaydaların yoxlanması", "Rule review", "Lazımsız qaydalar müntəzəm silinir; hər qaydada səbəb və tarix qeyd olunur.", "Unneeded rules are removed regularly; every rule records a reason and date."),
    ],
    examples: [
      {
        title: l("nftables ilə minimal giriş siyasəti", "A minimal inbound policy with nftables"),
        lang: "plain",
        code: "table inet filter {\n  chain input {\n    type filter hook input priority 0; policy drop;\n    ct state established,related accept\n    iif \"lo\" accept\n    tcp dport { 22, 443 } accept\n  }\n}",
        explain: l(
          "Default siyasət `drop`-dur. Qurulmuş bağlantıların cavabları və loopback buraxılır, yeni bağlantılar yalnız 22 və 443 portlarına icazəlidir.",
          "The default policy is `drop`. Replies on established connections and loopback are accepted; new connections are allowed only to ports 22 and 443.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Səbəbi yazılmayan qaydalar", "Rules with no recorded reason"),
        why: l("Bir il sonra heç kim qaydanın niyə açıldığını bilmir və onu silməyə cəsarət etmir. Hər qaydaya şərh əlavə edin.", "A year later nobody knows why a rule exists and nobody dares to remove it. Add a comment to every rule."),
        wrong: "sudo ufw allow 8080",
        right: "sudo ufw allow 8080/tcp comment 'staging API, owner: team-web, until 2027-01'",
        lang: "plain",
      },
    ],
    exercise: {
      task: l(
        "Veb server yalnız verilənlər bazası serverinə (`10.0.2.10:5432`) və yeniləmələr üçün HTTPS-ə çıxmalıdır. Çıxan trafik siyasətini sözlə təsvir edin.",
        "A web server should only reach the database (`10.0.2.10:5432`) and HTTPS for updates. Describe the outbound policy in words.",
      ),
      hints: [l("Default deny outgoing, sonra istisnalar.", "Default deny outgoing, then exceptions.")],
      answer: l(
        "Çıxan trafik üçün default deny; icazə: `10.0.2.10` TCP 5432, DNS resolverə 53, HTTPS (443) paket repozitoriyalarına; qalan hər şey bloklanır və jurnala yazılır.",
        "Default deny for outbound; allow: TCP 5432 to `10.0.2.10`, port 53 to the DNS resolver, HTTPS (443) to package repositories; everything else is blocked and logged.",
      ),
    },
    quiz: [
      q(
        l("Çıxan trafiki məhdudlaşdırmaq niyə faydalıdır?", "Why restrict outbound traffic?"),
        [l("Sındırılmış serverin xaricə əlaqəsini çətinləşdirir", "It hinders a compromised server from calling out"), l("Saytı sürətləndirir", "It speeds up the site"), l("Faydası yoxdur", "It has no benefit")],
        0,
        l("Egress süzgəci məlumat sızmasını və uzaqdan idarəni çətinləşdirir.", "Egress filtering makes data exfiltration and remote control harder."),
      ),
      q(
        l("nftables nümunəsində `policy drop` nəyi bildirir?", "What does `policy drop` mean in the nftables example?"),
        [l("Uyğun qayda olmayan paketlər atılır", "Packets with no matching rule are dropped"), l("Bütün paketlər qəbul olunur", "All packets are accepted")],
        0,
        l("Bu, \"default deny\" prinsipidir.", "This is the \"default deny\" principle."),
      ),
    ],
    refs: [
      ref("nftables wiki — Simple ruleset for a server", "https://wiki.nftables.org/wiki-nftables/index.php/Simple_ruleset_for_a_server"),
      ref("NIST SP 800-41 Rev. 1 — Guidelines on Firewalls", "https://csrc.nist.gov/pubs/sp/800/41/r1/final"),
    ],
  },
  {
    id: "def-vuln-management",
    module: "defense",
    title: t4("Zəiflik idarəetməsi", "Vulnerability management", "Zafiyet yönetimi", "Управление уязвимостями"),
    intro: l(
      "Zəiflik idarəetməsi davamlı dövrdür: aktivləri bilmək, zəiflikləri tapmaq, risk əsasında prioritet vermək, düzəltmək və nəticəni yoxlamaq.",
      "Vulnerability management is a continuous cycle: know your assets, find weaknesses, prioritise by risk, fix, and verify the result.",
    ),
    concepts: [
      c("CVE", "CVE", "Hər açıq məlum zəifliyin unikal identifikatoru (məsələn, CVE-2024-XXXX formatı).", "A unique identifier for each publicly known vulnerability (format CVE-YYYY-NNNN)."),
      c("CVSS", "CVSS", "Ciddiliyi 0–10 şkalası ilə qiymətləndirir; prioritet üçün öz mühitinizin kontekstini də nəzərə alın.", "Scores severity from 0 to 10; also consider your own environment when prioritising."),
      c("KEV", "KEV catalogue", "CISA-nın \"real hücumlarda istifadə olunan məlum zəifliklər\" kataloqu — bunlar birinci düzəldilir.", "CISA's catalogue of Known Exploited Vulnerabilities — fix these first."),
      c("Aktiv inventarı (asset inventory)", "Asset inventory", "Bilmədiyiniz sistemi yeniləyə bilməzsiniz.", "You cannot patch a system you do not know about."),
    ],
    examples: [
      {
        title: l("Yenilənə bilən paketlərin siyahısı", "Listing upgradable packages"),
        lang: "plain",
        code: "sudo apt update\napt list --upgradable\nnpm audit            # in your own Node.js project\npip-audit            # in your own Python project (if installed)",
        explain: l(
          "Bu əmrlər öz sisteminizdə və öz layihənizdə köhnə və zəif komponentləri göstərir. `npm audit` asılılıqları məlum zəifliklər bazası ilə müqayisə edir.",
          "These commands show outdated and vulnerable components on your own system and in your own projects. `npm audit` compares dependencies with a known-vulnerability database.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Yalnız CVSS balına baxmaq", "Looking only at the CVSS score"),
        why: l("İnternetə açıq sistemdə real hücumlarda istifadə olunan orta ballı zəiflik, təcrid olunmuş sistemdəki yüksək ballı zəiflikdən daha təcili ola bilər.", "A medium-score flaw that is actively exploited on an internet-facing system can be more urgent than a high-score flaw on an isolated one."),
      },
    ],
    exercise: {
      task: l(
        "Üç zəifliyi prioritetə görə sıralayın: (A) daxili test serverində CVSS 9.8; (B) internetə açıq VPN-də CVSS 7.5, KEV kataloqunda var; (C) noutbukda CVSS 5.0.",
        "Rank three vulnerabilities by priority: (A) CVSS 9.8 on an internal test server; (B) CVSS 7.5 on an internet-facing VPN, listed in KEV; (C) CVSS 5.0 on a laptop.",
      ),
      hints: [l("Real istismar və internetə açıqlıq ən vacib amillərdir.", "Active exploitation and internet exposure matter most.")],
      answer: l("B → A → C. B real hücumlarda istifadə olunur və internetə açıqdır; A ciddidir, lakin daxilidir.", "B → A → C. B is actively exploited and internet-facing; A is severe but internal."),
    },
    quiz: [
      q(
        l("CISA KEV kataloqu nəyi siyahıya alır?", "What does the CISA KEV catalogue list?"),
        [l("Real hücumlarda istifadə olunan zəiflikləri", "Vulnerabilities exploited in the wild"), l("Bütün proqramları", "All software"), l("Yalnız Windows xətalarını", "Only Windows bugs")],
        0,
        l("KEV = Known Exploited Vulnerabilities.", "KEV = Known Exploited Vulnerabilities."),
      ),
      q(
        l("Zəiflik idarəetməsinin ilk addımı nədir?", "What is the first step of vulnerability management?"),
        [l("Aktiv inventarı", "Asset inventory"), l("Düzəliş", "Patching"), l("Hesabat", "Reporting")],
        0,
        l("Əvvəlcə nəyin olduğunu bilmək lazımdır.", "You must first know what you have."),
      ),
    ],
    refs: [
      ref("CVE Program", "https://www.cve.org/"),
      ref("FIRST — CVSS", "https://www.first.org/cvss/"),
      ref("CISA — Known Exploited Vulnerabilities Catalog", "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"),
    ],
  },
  {
    id: "def-secure-config",
    module: "defense",
    title: t4("Təhlükəsiz konfiqurasiya", "Secure configuration", "Güvenli yapılandırma", "Безопасная конфигурация"),
    intro: l(
      "Bir çox insident zəif koddan yox, səhv konfiqurasiyadan baş verir: default parollar, açıq admin panelləri, istehsalatda (production) debug rejimi. Konfiqurasiyanı kod kimi idarə etmək və yoxlamaq lazımdır.",
      "Many incidents come not from bad code but from misconfiguration: default passwords, exposed admin panels, debug mode in production. Configuration should be managed and reviewed like code.",
    ),
    concepts: [
      c("Default-ları dəyişmək", "Change defaults", "Default parollar, istifadəçi adları və nümunə səhifələr ilk gün dəyişdirilir və ya silinir.", "Default passwords, usernames and sample pages are changed or removed on day one."),
      c("İstehsalatda debug yoxdur", "No debug in production", "Debug rejimi daxili məlumatları (stack trace, konfiqurasiya) göstərə bilər.", "Debug mode can reveal internals (stack traces, configuration)."),
      c("Sirlər koddan kənarda", "Secrets outside code", "Parollar və açarlar mühit dəyişənlərində və ya sirr menecerində saxlanır, repozitoriyada yox.", "Passwords and keys live in environment variables or a secrets manager, not the repository."),
      c("Infrastructure as code", "Infrastructure as code", "Konfiqurasiya versiya nəzarətində saxlanır, dəyişikliklər nəzərdən keçirilir.", "Configuration is kept in version control and changes are reviewed."),
    ],
    examples: [
      {
        title: l("Veb server: versiyanı gizlətmək və təhlükəsizlik başlıqları", "Web server: hiding the version and adding security headers"),
        lang: "plain",
        code: "# nginx server block\nserver_tokens off;\nadd_header X-Content-Type-Options \"nosniff\" always;\nadd_header Referrer-Policy \"strict-origin-when-cross-origin\" always;\nadd_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;",
        explain: l(
          "`server_tokens off` xəta səhifələrində nginx versiyasını göstərmir. Başlıqlar brauzerə əlavə qoruma qaydaları verir. Dəyişiklikdən sonra `sudo nginx -t` ilə yoxlayın.",
          "`server_tokens off` hides the nginx version on error pages. The headers give the browser extra protection rules. Check with `sudo nginx -t` after changes.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("İstehsalatda debug rejimi", "Debug mode in production"),
        why: l("Django/Flask-da debug rejimi xəta səhifəsində həssas məlumat göstərə bilər.", "In Django/Flask, debug mode can show sensitive information on error pages."),
        wrong: "DEBUG = True",
        right: "DEBUG = os.environ.get(\"DJANGO_DEBUG\") == \"1\"  # off unless explicitly enabled",
        lang: "python",
      },
    ],
    exercise: {
      task: l(
        "Yeni quraşdırılmış verilənlər bazası serveri üçün beş konfiqurasiya yoxlaması yazın.",
        "Write five configuration checks for a newly installed database server.",
      ),
      hints: [l("Parol, şəbəkə, istifadəçilər, şifrələmə, ehtiyat nüsxə.", "Password, network, users, encryption, backups.")],
      answer: l(
        "(1) Default admin parolu dəyişdirilib; (2) yalnız daxili ünvanda dinləyir; (3) tətbiq üçün minimum hüquqlu ayrıca istifadəçi; (4) bağlantılar TLS ilə; (5) avtomatik, sınaqdan keçirilmiş ehtiyat nüsxə.",
        "(1) The default admin password is changed; (2) it listens only on an internal address; (3) a separate least-privilege user for the application; (4) connections use TLS; (5) automatic, tested backups.",
      ),
    },
    quiz: [
      q(
        l("OWASP Top 10-da \"Security Misconfiguration\" nəyə aiddir?", "What does \"Security Misconfiguration\" in the OWASP Top 10 cover?"),
        [l("Default parollar, açıq debug, lazımsız funksiyalar", "Default passwords, open debug, unneeded features"), l("Yalnız SQL injection", "Only SQL injection"), l("Yalnız fişinq", "Only phishing")],
        0,
        l("Səhv və ya natamam konfiqurasiya ümumi riskdir.", "Wrong or incomplete configuration is a common risk."),
      ),
      q(
        l("Sirləri harada saxlamaq daha yaxşıdır?", "Where is it better to keep secrets?"),
        [l("Sirr menecerində və ya mühit dəyişənlərində", "In a secrets manager or environment variables"), l("Git repozitoriyasında", "In the Git repository"), l("README faylında", "In the README")],
        0,
        l("Repozitoriyaya düşən sirr uzun müddət tarixçədə qalır.", "A secret committed to a repository stays in history for a long time."),
      ),
    ],
    refs: [
      ref("OWASP Top 10 — Security Misconfiguration", "https://owasp.org/Top10/A05_2021-Security_Misconfiguration/"),
      ref("OWASP Secrets Management Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html"),
      ref("OWASP HTTP Headers Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html"),
    ],
  },
  {
    id: "def-incident-response",
    module: "defense",
    title: t4("İnsidentə cavab əsasları", "Incident response basics", "Olay müdahalesi temelleri", "Основы реагирования на инциденты"),
    intro: l(
      "İnsidentə cavab (incident response) təhlükəsizlik hadisəsi baş verəndə nə edəcəyinizi əvvəlcədən planlaşdırmaqdır. Plan təlaşı azaldır, sübutları qoruyur və bərpanı sürətləndirir.",
      "Incident response is planning in advance what you will do when a security event happens. A plan reduces panic, preserves evidence and speeds up recovery.",
    ),
    concepts: [
      c("Hazırlıq (preparation)", "Preparation", "Əlaqə siyahısı, rollar, alətlər, ehtiyat nüsxələr və məşqlər.", "Contact list, roles, tools, backups and exercises."),
      c("Aşkarlama və təhlil (detection & analysis)", "Detection and analysis", "Hadisənin həqiqətən insident olduğunu təsdiqləmək və əhatəsini müəyyən etmək.", "Confirming that an event really is an incident and determining its scope."),
      c("Məhdudlaşdırma, aradan qaldırma, bərpa", "Containment, eradication, recovery", "Yayılmanı dayandırmaq, səbəbi aradan qaldırmaq, sistemləri təmiz vəziyyətə qaytarmaq.", "Stop the spread, remove the cause, restore systems to a clean state."),
      c("Sonrakı dərslər (lessons learned)", "Lessons learned", "Nə baş verdi, nə yaxşı işlədi, nəyi dəyişməliyik — günahlandırmadan.", "What happened, what worked, what to change — without blame."),
    ],
    examples: [
      {
        title: l("İlk saat üçün qısa qeyd şablonu", "A short note template for the first hour"),
        lang: "plain",
        code: "Time detected:   2026-12-01 03:20 UTC\nDetected by:     alert \"successful login after failures\"\nAffected:        web1 (account: deploy)\nActions:         03:25 account locked; 03:27 sessions terminated\nEvidence kept:   copy of auth logs, process list (ps output)\nInformed:        security lead, system owner\nNext steps:      check for changes since 03:12, rotate secrets",
        explain: l(
          "Hər addımın vaxtını yazmaq sonrakı təhlil və hesabat üçün vacibdir. Sübutlar dəyişdirilmədən saxlanır.",
          "Writing down the time of each step is essential for later analysis and reporting. Evidence is kept unaltered.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Sistemi dərhal silib yenidən qurmaq", "Wiping and rebuilding immediately"),
        why: l("Sübutlar itirsə, hücumçunun necə daxil olduğunu bilməyəcəksiniz və eyni yol açıq qalacaq. Əvvəlcə təcrid edin və sübut toplayın.", "If evidence is lost, you will not know how the attacker got in and the same path stays open. Isolate and collect evidence first."),
      },
    ],
    exercise: {
      task: l(
        "\"Jurnal təhlili\" dərsindəki hadisəni (uğurlu `deploy` girişi) NIST-in insidentə cavab addımlarına görə qısa planla təsvir edin.",
        "Describe the event from the log analysis lesson (successful `deploy` login) as a short plan following NIST's incident steps.",
      ),
      hints: [l("Aşkarlama → məhdudlaşdırma → aradan qaldırma → bərpa → dərslər.", "Detection → containment → eradication → recovery → lessons.")],
      answer: l(
        "Aşkarlama: jurnal xəbərdarlığı. Məhdudlaşdırma: hesabı kilidləmək, sessiyaları dayandırmaq, lazım olsa, serveri şəbəkədən ayırmaq. Aradan qaldırma: zəif parolu və parolla SSH girişini aradan qaldırmaq, dəyişiklikləri yoxlamaq. Bərpa: təmiz vəziyyəti təsdiqləmək, monitorinqi gücləndirmək. Dərslər: SSH yalnız açarla, MFA, xəbərdarlıqlar.",
        "Detection: the log alert. Containment: lock the account, end sessions, isolate the server if needed. Eradication: remove the weak password and SSH password login, check for changes. Recovery: confirm a clean state, increase monitoring. Lessons: SSH keys only, MFA, alerts.",
      ),
    },
    quiz: [
      q(
        l("İnsidentdə ilk prioritet nədir?", "What is the first priority in an incident?"),
        [l("Yayılmanı məhdudlaşdırmaq və sübutu qorumaq", "Contain the spread and preserve evidence"), l("Hər şeyi silmək", "Delete everything"), l("Heç kimə deməmək", "Tell no one")],
        0,
        l("Məhdudlaşdırma zərəri azaldır, sübut isə səbəbi tapmağa kömək edir.", "Containment limits damage; evidence helps find the cause."),
      ),
      q(
        l("\"Lessons learned\" görüşünün məqsədi nədir?", "What is the purpose of a \"lessons learned\" meeting?"),
        [l("Prosesi yaxşılaşdırmaq", "Improving the process"), l("Günahkar tapmaq", "Finding someone to blame")],
        0,
        l("Məqsəd təkrarlanmanın qarşısını almaqdır.", "The goal is to prevent a repeat."),
      ),
    ],
    refs: [
      ref("NIST SP 800-61 Rev. 3 — Incident Response Recommendations", "https://csrc.nist.gov/pubs/sp/800/61/r3/final"),
      ref("NIST Cybersecurity Framework", "https://www.nist.gov/cyberframework"),
    ],
  },
  {
    id: "def-backup-recovery",
    module: "defense",
    title: t4("Ehtiyat nüsxə və bərpa", "Backup and recovery", "Yedekleme ve kurtarma", "Резервное копирование и восстановление"),
    intro: l(
      "Ehtiyat nüsxə (backup) əlçatanlığı və bütövlüyü qoruyan son müdafiə xəttidir — xüsusilə ransomware-ə qarşı. Sınaqdan keçirilməmiş ehtiyat nüsxə isə yalnız ümiddir.",
      "Backups are the last line of defence for availability and integrity — especially against ransomware. A backup that has never been restored is only a hope.",
    ),
    concepts: [
      c("3-2-1 qaydası", "The 3-2-1 rule", "3 nüsxə, 2 fərqli daşıyıcıda, 1-i başqa yerdə (offsite).", "3 copies, on 2 different media, 1 offsite."),
      c("Dəyişməz/oflayn nüsxə", "Immutable/offline copy", "Hücumçunun silə və ya şifrələyə bilmədiyi nüsxə (oflayn disk, immutable saxlama).", "A copy an attacker cannot delete or encrypt (offline disk, immutable storage)."),
      c("RPO və RTO", "RPO and RTO", "RPO — nə qədər məlumat itkisi qəbul olunur; RTO — bərpa nə qədər vaxt ala bilər.", "RPO — how much data loss is acceptable; RTO — how long recovery may take."),
    ],
    examples: [
      {
        title: l("rsync ilə sadə ehtiyat nüsxə və yoxlama", "A simple backup with rsync and a check"),
        lang: "plain",
        code: "rsync -a --delete /srv/app/data/ /mnt/backup/app-data/\n# test a restore into a separate folder:\nrsync -a /mnt/backup/app-data/ /tmp/restore-test/\ndiff -r /srv/app/data /tmp/restore-test && echo \"restore OK\"",
        explain: l(
          "`-a` icazələri və vaxtları saxlayır, `--delete` mənbədə silinən faylları nüsxədən də silir — ona görə bu güzgüdür, tarixçə deyil; versiyalı nüsxələr üçün ayrıca alət istifadə edin. Bərpa testi nüsxənin həqiqətən işlədiyini göstərir.",
          "`-a` keeps permissions and times; `--delete` removes files from the copy that were deleted at the source — so this is a mirror, not history; use a versioned backup tool for that. The restore test proves the copy actually works.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Ehtiyat nüsxəni eyni serverdə saxlamaq", "Keeping the backup on the same server"),
        why: l("Disk xarab olsa və ya server şifrələnsə, nüsxə də itir.", "If the disk fails or the server is encrypted, the backup is lost too."),
      },
      {
        title: l("Bərpanı heç vaxt sınamamaq", "Never testing a restore"),
        why: l("Problem yalnız insident zamanı üzə çıxır. Bərpanı cədvəl üzrə məşq edin.", "Problems surface only during an incident. Practise restores on a schedule."),
      },
    ],
    exercise: {
      task: l(
        "Kiçik biznesin mühasibat faylları üçün 3-2-1 planı qurun.",
        "Design a 3-2-1 plan for a small business's accounting files.",
      ),
      hints: [l("Əsas nüsxə, lokal ikinci nüsxə, offsite/oflayn nüsxə.", "Primary copy, a local second copy, an offsite/offline copy.")],
      answer: l(
        "(1) Əsas fayllar serverdə; (2) gündəlik nüsxə NAS-a (fərqli daşıyıcı); (3) həftəlik şifrələnmiş nüsxə bulud saxlamasına (dəyişməz rejim) və ya oflayn diskə. Ayda bir bərpa testi.",
        "(1) Primary files on the server; (2) a daily copy to a NAS (different media); (3) a weekly encrypted copy to cloud storage (immutable mode) or an offline disk. A restore test every month.",
      ),
    },
    quiz: [
      q(
        l("3-2-1 qaydasında \"1\" nəyi bildirir?", "In the 3-2-1 rule, what does the \"1\" mean?"),
        [l("Bir nüsxə başqa yerdə", "One copy offsite"), l("Bir disk", "One disk"), l("Bir gün", "One day")],
        0,
        l("Ən azı bir nüsxə fiziki olaraq başqa yerdə saxlanır.", "At least one copy is kept physically elsewhere."),
      ),
      q(
        l("RTO nəyi ölçür?", "What does RTO measure?"),
        [l("Bərpa üçün icazə verilən vaxtı", "The allowed time to recover"), l("Məlumatın ölçüsünü", "The size of data"), l("Parol uzunluğunu", "Password length")],
        0,
        l("RTO — Recovery Time Objective.", "RTO — Recovery Time Objective."),
      ),
    ],
    refs: [
      ref("CISA — Ransomware Guide (#StopRansomware)", "https://www.cisa.gov/stopransomware/ransomware-guide"),
      ref("rsync documentation", "https://rsync.samba.org/documentation.html"),
    ],
  },
  {
    id: "def-secure-sdlc",
    module: "defense",
    title: t4("Təhlükəsiz proqram təminatı həyat dövrü (SDLC)", "Secure SDLC", "Güvenli yazılım geliştirme yaşam döngüsü", "Безопасный жизненный цикл разработки"),
    intro: l(
      "Təhlükəsiz SDLC təhlükəsizliyi proqram yaradılmasının hər addımına daxil edir: tələblər, dizayn, kod, test, buraxılış və istismar. Problem nə qədər tez tapılsa, düzəltmək bir o qədər ucuzdur.",
      "A secure SDLC builds security into every step of creating software: requirements, design, code, testing, release and operation. The earlier a problem is found, the cheaper the fix.",
    ),
    concepts: [
      c("Shift left", "Shift left", "Təhlükəsizlik yoxlamalarını prosesin əvvəlinə köçürmək (dizayn, kod nəzərdən keçirmə).", "Moving security checks earlier (design, code review)."),
      c("SAST, DAST, SCA", "SAST, DAST, SCA", "SAST mənbə kodunu, DAST işləyən tətbiqi (öz test mühitinizdə), SCA isə asılılıqları yoxlayır.", "SAST checks source code, DAST checks the running app (in your own test environment), SCA checks dependencies."),
      c("Kod nəzərdən keçirmə (code review)", "Code review", "Hər dəyişikliyə ikinci göz; təhlükəsizlik yoxlama siyahısı ilə.", "A second pair of eyes on every change, with a security checklist."),
      c("NIST SSDF", "NIST SSDF", "SP 800-218 təhlükəsiz proqram inkişafı üçün tövsiyələr toplusudur.", "SP 800-218 is a set of recommended secure software development practices."),
    ],
    examples: [
      {
        title: l("CI-da asılılıq və sirr yoxlaması (konseptual)", "Dependency and secret checks in CI (conceptual)"),
        lang: "plain",
        code: "# .github/workflows/security.yml (simplified)\non: [pull_request]\njobs:\n  checks:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm audit --audit-level=high\n      - run: npm test",
        explain: l(
          "Hər pull request-də asılılıqlar yoxlanır və yüksək səviyyəli zəiflik varsa, yoxlama uğursuz olur. Bu, problemin istehsalata çatmasının qarşısını alır.",
          "Every pull request checks dependencies and fails if a high-severity vulnerability is found, stopping the problem before it reaches production.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Təhlükəsizliyi buraxılışdan bir gün əvvəl yoxlamaq", "Checking security the day before release"),
        why: l("Son anda tapılan dizayn problemini düzəltmək çox baha başa gəlir və çox vaxt təxirə salınır.", "A design problem found at the last minute is very expensive to fix and is often postponed."),
      },
    ],
    exercise: {
      task: l(
        "Hər SDLC addımına bir təhlükəsizlik fəaliyyəti əlavə edin: tələblər, dizayn, kod, test, buraxılış, istismar.",
        "Add one security activity to each SDLC step: requirements, design, code, test, release, operation.",
      ),
      hints: [l("Əvvəlki dərslərdən: təhdid modeli, monitorinq, yeniləmə.", "From earlier lessons: threat model, monitoring, updates.")],
      answer: l(
        "Tələblər: təhlükəsizlik tələbləri (məsələn, OWASP ASVS). Dizayn: təhdid modeli. Kod: kod nəzərdən keçirmə və SAST. Test: SCA və öz test mühitində DAST. Buraxılış: imzalanmış artefaktlar, sirr yoxlaması. İstismar: monitorinq və zəiflik idarəetməsi.",
        "Requirements: security requirements (e.g. OWASP ASVS). Design: threat model. Code: code review and SAST. Test: SCA and DAST in your own test environment. Release: signed artefacts, secret scanning. Operation: monitoring and vulnerability management.",
      ),
    },
    quiz: [
      q(
        l("SCA nəyi yoxlayır?", "What does SCA check?"),
        [l("Üçüncü tərəf asılılıqları", "Third-party dependencies"), l("Şəbəkə kabellərini", "Network cables"), l("İstifadəçi parollarını", "User passwords")],
        0,
        l("Software Composition Analysis istifadə olunan kitabxanaları yoxlayır.", "Software Composition Analysis checks the libraries you use."),
      ),
      q(
        l("\"Shift left\" nə deməkdir?", "What does \"shift left\" mean?"),
        [l("Təhlükəsizliyi prosesin daha erkən hissəsinə köçürmək", "Moving security earlier"), l("Testi ləğv etmək", "Cancelling tests"), l("Kodu sola düzləmək", "Left-aligning code")],
        0,
        l("Erkən yoxlamalar daha ucuzdur.", "Early checks are cheaper."),
      ),
    ],
    refs: [
      ref("NIST SP 800-218 — Secure Software Development Framework", "https://csrc.nist.gov/pubs/sp/800/218/final"),
      ref("OWASP SAMM", "https://owasp.org/www-project-samm/"),
      ref("OWASP ASVS", "https://owasp.org/www-project-application-security-verification-standard/"),
    ],
  },
];

// ───────────────────────────── F · Web security ─────────────────────────────
const F: SecTopic[] = [
  {
    id: "web-owasp-top10",
    module: "web",
    title: t4("OWASP Top 10 icmalı", "OWASP Top 10 overview", "OWASP Top 10'a genel bakış", "Обзор OWASP Top 10"),
    intro: l(
      "OWASP Top 10 veb tətbiqlər üçün ən kritik təhlükəsizlik risklərinin siyahısıdır. Bu, testlər üçün alət yox, maarifləndirmə sənədidir: komandalar ondan prioritetləri müəyyən etmək üçün istifadə edir. Aşağıda geniş istinad olunan 2021 nəşri göstərilib; OWASP 2025 nəşrini də dərc edib — ən son versiya üçün owasp.org/Top10 səhifəsinə baxın.",
      "The OWASP Top 10 is a list of the most critical security risks for web applications. It is an awareness document, not a testing tool: teams use it to set priorities. The widely referenced 2021 edition is shown below; OWASP has also published a 2025 edition — see owasp.org/Top10 for the latest version.",
    ),
    concepts: [
      c("A01 Broken Access Control", "A01 Broken Access Control", "İstifadəçi icazəsi olmayan məlumata və ya funksiyaya çata bilir.", "Users can reach data or functions they are not allowed to."),
      c("A02 Cryptographic Failures", "A02 Cryptographic Failures", "Həssas məlumatın şifrələnməməsi və ya zəif şifrələnməsi.", "Sensitive data not encrypted or weakly encrypted."),
      c("A03 Injection", "A03 Injection", "Etibarsız məlumatın əmr və ya sorğunun bir hissəsi kimi şərh olunması (SQL injection, XSS bu qrupa daxildir).", "Untrusted data interpreted as part of a command or query (SQL injection and XSS belong here)."),
      c("A04–A06", "A04–A06", "Təhlükəsiz olmayan dizayn, səhv konfiqurasiya, köhnə və zəif komponentlər.", "Insecure design, security misconfiguration, vulnerable and outdated components."),
      c("A07–A10", "A07–A10", "Autentifikasiya xətaları, proqram və məlumat bütövlüyü xətaları, jurnal və monitorinq çatışmazlığı, SSRF (server tərəfindən saxta sorğu).", "Authentication failures, software and data integrity failures, logging and monitoring failures, SSRF (server-side request forgery)."),
    ],
    examples: [
      {
        title: l("Riski müdafiə ilə əlaqələndirmək", "Mapping risks to defences"),
        lang: "plain",
        code: "A01 Broken Access Control  -> deny by default, check ownership on the server\nA02 Cryptographic Failures -> TLS everywhere, Argon2id/bcrypt for passwords\nA03 Injection              -> parameterised queries, output encoding\nA05 Misconfiguration       -> hardened defaults, no debug in production\nA06 Outdated Components    -> SCA (npm audit), regular updates\nA09 Logging Failures       -> log security events, alert on anomalies",
        explain: l(
          "Hər risk üçün əsas müdafiə tədbiri göstərilir. Növbəti dərslər bunların bir neçəsini ətraflı izah edir.",
          "Each risk is paired with its main defence. The next lessons explain several of them in detail.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Top 10-u tam yoxlama siyahısı hesab etmək", "Treating the Top 10 as a complete checklist"),
        why: l("Top 10 yalnız ən geniş yayılmış riskləri göstərir. Ətraflı tələblər üçün OWASP ASVS istifadə edin.", "The Top 10 shows only the most common risks. For detailed requirements, use OWASP ASVS."),
      },
    ],
    exercise: {
      task: l(
        "Hər problemi Top 10 kateqoriyasına aid edin: (1) `/admin` səhifəsi giriş olmadan açılır; (2) parollar MD5 ilə saxlanır; (3) 3 il yenilənməmiş kitabxana; (4) uğursuz girişlər jurnala yazılmır.",
        "Map each problem to a Top 10 category: (1) `/admin` opens without login; (2) passwords stored with MD5; (3) a library not updated for 3 years; (4) failed logins are not logged.",
      ),
      hints: [l("A01, A02, A06, A09.", "A01, A02, A06, A09.")],
      answer: l("(1) A01 Broken Access Control; (2) A02 Cryptographic Failures; (3) A06 Vulnerable and Outdated Components; (4) A09 Security Logging and Monitoring Failures.", "(1) A01 Broken Access Control; (2) A02 Cryptographic Failures; (3) A06 Vulnerable and Outdated Components; (4) A09 Security Logging and Monitoring Failures."),
    },
    quiz: [
      q(
        l("2021 nəşrində birinci yerdə hansı risk var?", "Which risk is first in the 2021 edition?"),
        ["Injection", "Broken Access Control", "SSRF"],
        1,
        l("A01 — Broken Access Control.", "A01 is Broken Access Control."),
      ),
      q(
        l("XSS hansı kateqoriyaya daxildir (2021)?", "Which category includes XSS (2021)?"),
        ["A03 Injection", "A07 Authentication Failures", "A10 SSRF"],
        0,
        l("2021 nəşrində XSS Injection kateqoriyasına birləşdirilib.", "In 2021 XSS was merged into the Injection category."),
      ),
    ],
    refs: [
      ref("OWASP Top 10", "https://owasp.org/Top10/"),
      ref("OWASP Top Ten project", "https://owasp.org/www-project-top-ten/"),
      ref("OWASP ASVS", "https://owasp.org/www-project-application-security-verification-standard/"),
    ],
  },
  {
    id: "web-auth-sessions",
    module: "web",
    title: t4("Təhlükəsiz autentifikasiya və sessiyalar", "Secure authentication and sessions", "Güvenli kimlik doğrulama ve oturumlar", "Безопасная аутентификация и сессии"),
    intro: l(
      "Girişdən sonra server istifadəçini sessiya identifikatoru ilə tanıyır. Bu identifikator parol qədər dəyərlidir, ona görə təhlükəsiz yaradılmalı, saxlanmalı və vaxtında ləğv edilməlidir.",
      "After login the server recognises the user by a session identifier. That identifier is as valuable as a password, so it must be created, stored and expired securely.",
    ),
    concepts: [
      c("Kuki atributları", "Cookie attributes", "`Secure` (yalnız HTTPS), `HttpOnly` (JavaScript oxuya bilmir), `SameSite` (saytlararası sorğuları məhdudlaşdırır).", "`Secure` (HTTPS only), `HttpOnly` (not readable by JavaScript), `SameSite` (limits cross-site requests)."),
      c("Sessiyanın yenilənməsi", "Session regeneration", "Girişdən sonra yeni sessiya ID-si yaradılır ki, əvvəlki ID ilə sessiya ələ keçirilməsin (session fixation).", "A new session ID is issued after login so an earlier ID cannot be used to hijack the session (session fixation)."),
      c("Vaxt limiti və çıxış", "Timeouts and logout", "Aktivlik olmadıqda sessiya bitir; çıxış serverdə sessiyanı ləğv edir.", "Sessions expire when idle; logout invalidates the session on the server."),
      c("Giriş cəhdlərinin məhdudlaşdırılması", "Login rate limiting", "Uğursuz cəhdləri məhdudlaşdırmaq parol təxminini çətinləşdirir.", "Limiting failed attempts makes password guessing harder."),
    ],
    examples: [
      {
        title: l("Təhlükəsiz sessiya kukisi", "A secure session cookie"),
        lang: "plain",
        code: "Set-Cookie: session=<random 128+ bit value>; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=3600",
        explain: l(
          "Dəyər təsadüfi və uzundur, kuki yalnız HTTPS ilə göndərilir, JavaScript-ə görünmür və saytlararası sorğularda məhdudlaşdırılır. `Max-Age` sessiyanın ömrünü təyin edir.",
          "The value is long and random, the cookie is sent only over HTTPS, hidden from JavaScript and restricted on cross-site requests. `Max-Age` sets its lifetime.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Ümumi xəta mesajı əvəzinə ətraflı mesaj", "Detailed messages instead of a generic one"),
        why: l("\"Belə istifadəçi yoxdur\" mesajı hücumçuya hansı hesabların mövcud olduğunu göstərir. Eyni mesaj qaytarın.", "\"No such user\" tells an attacker which accounts exist. Return the same message for both cases."),
        wrong: "if (!user) return res.status(401).send(\"No such user\");\nif (!ok) return res.status(401).send(\"Wrong password\");",
        right: "if (!user || !ok) return res.status(401).send(\"Invalid username or password\");",
        lang: "javascript",
      },
      {
        title: l("Sessiya tokenini localStorage-də saxlamaq", "Storing session tokens in localStorage"),
        why: l("XSS olduqda JavaScript localStorage-i oxuya bilər; `HttpOnly` kuki isə skriptlər üçün görünməzdir.", "If XSS happens, JavaScript can read localStorage; an `HttpOnly` cookie is invisible to scripts."),
      },
    ],
    exercise: {
      task: l(
        "Bu kukidə nə çatışmır və niyə vacibdir: `Set-Cookie: sid=12345; Path=/`?",
        "What is missing from this cookie and why does it matter: `Set-Cookie: sid=12345; Path=/`?",
      ),
      hints: [l("Dəyərin özünə də baxın.", "Look at the value itself too.")],
      answer: l(
        "Dəyər təxmin edilə biləndir (təsadüfi və uzun olmalıdır); `Secure`, `HttpOnly`, `SameSite` və müddət (`Max-Age`) yoxdur.",
        "The value is guessable (it must be long and random); `Secure`, `HttpOnly`, `SameSite` and a lifetime (`Max-Age`) are missing.",
      ),
    },
    quiz: [
      q(
        l("Hansı atribut kukini JavaScript-dən gizlədir?", "Which attribute hides a cookie from JavaScript?"),
        ["Secure", "HttpOnly", "Path"],
        1,
        l("`HttpOnly` `document.cookie` vasitəsilə oxunmanın qarşısını alır.", "`HttpOnly` prevents reading via `document.cookie`."),
      ),
      q(
        l("Girişdən sonra niyə yeni sessiya ID-si yaradılır?", "Why issue a new session ID after login?"),
        [l("Session fixation-ın qarşısını almaq üçün", "To prevent session fixation"), l("Saytı sürətləndirmək üçün", "To speed up the site")],
        0,
        l("Əvvəlcədən məlum ID ilə sessiya ələ keçirilə bilməz.", "A previously known ID can no longer take over the session."),
      ),
    ],
    refs: [
      ref("OWASP Session Management Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html"),
      ref("OWASP Authentication Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"),
      ref("MDN — Set-Cookie", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie"),
    ],
  },
  {
    id: "web-input-validation",
    module: "web",
    title: t4("Giriş məlumatlarının yoxlanması", "Input validation", "Girdi doğrulama", "Проверка входных данных"),
    intro: l(
      "Klientdən gələn hər şey (forma, URL, başlıq, fayl, JSON) etibarsızdır. Server onu gözlənilən format, növ, uzunluq və aralığa görə yoxlamalıdır. Yoxlama vacibdir, lakin injection-a qarşı əsas müdafiəni (parametrləşdirilmiş sorğu, çıxışın kodlaşdırılması) əvəz etmir.",
      "Everything from the client (forms, URLs, headers, files, JSON) is untrusted. The server must check it against the expected format, type, length and range. Validation matters, but it does not replace the main injection defences (parameterised queries, output encoding).",
    ),
    concepts: [
      c("Allowlist", "Allowlist", "İcazə verilən dəyərləri müəyyən etmək (məsələn, yalnız rəqəmlər) qadağan olunanları sadalamaqdan etibarlıdır.", "Defining what is allowed (e.g. digits only) is more reliable than listing what is forbidden."),
      c("Server tərəfində yoxlama", "Server-side validation", "Brauzerdəki yoxlama rahatlıq üçündür; təhlükəsizlik üçün server yoxlaması məcburidir.", "Browser checks are for convenience; server checks are required for security."),
      c("Sxem yoxlaması", "Schema validation", "JSON sorğuları üçün sxem (növlər, məcburi sahələr, uzunluq) tətbiq etmək.", "Applying a schema (types, required fields, lengths) to JSON requests."),
    ],
    examples: [
      {
        title: l("Allowlist ilə yoxlama (TypeScript)", "Allowlist validation (TypeScript)"),
        lang: "typescript",
        code: "const USERNAME = /^[a-z0-9_]{3,20}$/;\n\nfunction parseAge(raw: unknown): number | null {\n  const n = Number(raw);\n  return Number.isInteger(n) && n >= 13 && n <= 120 ? n : null;\n}\n\nif (!USERNAME.test(body.username)) return badRequest(\"invalid username\");",
        explain: l(
          "İstifadəçi adı yalnız kiçik hərf, rəqəm və `_` ola bilər, uzunluğu 3–20. Yaş tam ədəd və məntiqli aralıqda olmalıdır; əks halda sorğu rədd edilir.",
          "A username may contain only lowercase letters, digits and `_`, 3–20 long. Age must be an integer in a sensible range; otherwise the request is rejected.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Yalnız brauzerdə yoxlamaq", "Validating only in the browser"),
        why: l("HTML `required` və ya JavaScript yoxlamasını istifadəçi asanlıqla keçə bilər; sorğu birbaşa serverə göndərilə bilər.", "HTML `required` or JavaScript checks are easily bypassed; a request can be sent straight to the server."),
        wrong: "<input name=\"age\" type=\"number\" min=\"13\">  <!-- only check -->",
        right: "// server: const age = parseAge(req.body.age); if (age === null) return badRequest();",
        lang: "javascript",
      },
    ],
    exercise: {
      task: l(
        "Sifariş formasında `quantity` sahəsi var (1–99 arası tam ədəd). Server tərəfində yoxlama qaydasını sözlə yazın.",
        "An order form has a `quantity` field (an integer from 1 to 99). Describe the server-side validation rule in words.",
      ),
      hints: [l("Növ, aralıq, rədd cavabı.", "Type, range, rejection response.")],
      answer: l(
        "Dəyəri ədədə çevirmək; tam ədəd deyilsə və ya 1–99 aralığından kənardırsa, 400 Bad Request qaytarmaq; qiyməti heç vaxt klientdən qəbul etməmək, serverdə hesablamaq.",
        "Convert the value to a number; if it is not an integer or is outside 1–99, return 400 Bad Request; never accept the price from the client — compute it on the server.",
      ),
    },
    quiz: [
      q(
        l("Hansı yanaşma daha etibarlıdır?", "Which approach is more reliable?"),
        [l("Allowlist", "Allowlist"), l("Blocklist", "Blocklist")],
        0,
        l("Bütün təhlükəli variantları sadalamaq mümkün deyil.", "You cannot list every dangerous variant."),
      ),
      q(
        l("Giriş yoxlaması SQL injection-a qarşı əsas müdafiədirmi?", "Is input validation the main defence against SQL injection?"),
        [l("Xeyr, əsas müdafiə parametrləşdirilmiş sorğulardır", "No, parameterised queries are"), l("Bəli, yeganə müdafiədir", "Yes, the only one")],
        0,
        l("Yoxlama əlavə qatdır; əsas müdafiə parametrləşdirmədir.", "Validation is an extra layer; parameterisation is the main defence."),
      ),
    ],
    refs: [
      ref("OWASP Input Validation Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"),
      ref("OWASP ASVS", "https://owasp.org/www-project-application-security-verification-standard/"),
    ],
  },
  {
    id: "web-access-control",
    module: "web",
    title: t4("Veb tətbiqdə giriş nəzarəti", "Access control in web apps", "Web uygulamalarında erişim kontrolü", "Управление доступом в веб-приложениях"),
    intro: l(
      "Broken Access Control OWASP Top 10 2021-də birinci yerdədir. Hər sorğuda server istifadəçinin bu konkret obyektə və əməliyyata hüququ olub-olmadığını yoxlamalıdır. Düyməni gizlətmək təhlükəsizlik deyil.",
      "Broken Access Control is first in the OWASP Top 10 2021. On every request the server must check whether the user may perform this action on this specific object. Hiding a button is not security.",
    ),
    concepts: [
      c("IDOR", "IDOR", "Insecure Direct Object Reference: tətbiq ID-ni dəyişən istifadəçiyə başqasının məlumatını göstərir, çünki sahiblik yoxlanmır.", "Insecure Direct Object Reference: the app shows someone else's data to a user who changes an ID, because ownership is not checked."),
      c("Default deny", "Default deny", "Hər endpoint default olaraq qadağandır; yalnız açıq qaydalar icazə verir.", "Every endpoint is denied by default; only explicit rules allow access."),
      c("Mərkəzləşdirilmiş yoxlama", "Centralised checks", "İcazə məntiqi bir yerdə (middleware, policy) yazılır ki, unudulmasın.", "Authorisation logic lives in one place (middleware, policy) so it is not forgotten."),
    ],
    examples: [
      {
        title: l("Sahiblik yoxlaması ilə sorğu", "A query with an ownership check"),
        lang: "sql",
        code: "-- the user id comes from the server-side session, never from the request\nSELECT id, total, created_at\nFROM orders\nWHERE id = $1 AND user_id = $2;",
        explain: l(
          "Sifariş yalnız ID və cari istifadəçinin ID-si birlikdə uyğun gələndə qaytarılır. `$2` sessiyadan gəlir, sorğu parametrlərindən yox. Nəticə boşdursa, 404 qaytarmaq olar.",
          "The order is returned only when both its ID and the current user's ID match. `$2` comes from the session, not from request parameters. If nothing is found, return 404.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Rolu klientdən qəbul etmək", "Trusting a role sent by the client"),
        why: l("İstifadəçi sorğudakı istənilən sahəni dəyişə bilər. Rol və ID yalnız server tərəfindəki sessiyadan götürülür.", "Users can change any field in a request. Role and ID must come only from the server-side session."),
        wrong: "if (req.body.role === \"admin\") deleteUser(req.params.id);",
        right: "if (req.session.user?.role === \"admin\") deleteUser(req.params.id);\nelse res.sendStatus(403);",
        lang: "javascript",
      },
    ],
    exercise: {
      task: l(
        "`GET /api/invoices/:id` endpoint-i yalnız giriş yoxlayır. Hansı problem var və necə düzəldilir?",
        "The `GET /api/invoices/:id` endpoint only checks that the user is logged in. What is the problem and how is it fixed?",
      ),
      hints: [l("İstifadəçi ID-ni dəyişsə nə olar?", "What happens if the user changes the ID?")],
      answer: l(
        "IDOR: istənilən daxil olmuş istifadəçi başqasının fakturasını aça bilər. Düzəliş: sorğuda `WHERE id = $1 AND owner_id = $2` (sessiyadan), uyğun gəlməzsə 404/403.",
        "IDOR: any logged-in user can open another user's invoice. Fix: query with `WHERE id = $1 AND owner_id = $2` (from the session); return 404/403 when it does not match.",
      ),
    },
    quiz: [
      q(
        l("IDOR-un əsas səbəbi nədir?", "What is the root cause of IDOR?"),
        [l("Obyekt səviyyəsində sahiblik yoxlamasının olmaması", "Missing object-level ownership checks"), l("Zəif parol", "A weak password"), l("Yavaş server", "A slow server")],
        0,
        l("Server ID-nin istifadəçiyə aid olduğunu yoxlamır.", "The server does not check the ID belongs to the user."),
      ),
      q(
        l("Admin düyməsini gizlətmək kifayətdirmi?", "Is hiding the admin button enough?"),
        [l("Xeyr", "No"), l("Bəli", "Yes")],
        0,
        l("Sorğu birbaşa göndərilə bilər; yoxlama serverdə olmalıdır.", "Requests can be sent directly; the check must be on the server."),
      ),
    ],
    refs: [
      ref("OWASP Top 10 — A01 Broken Access Control", "https://owasp.org/Top10/A01_2021-Broken_Access_Control/"),
      ref("OWASP Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"),
    ],
  },
  {
    id: "web-api-design",
    module: "web",
    title: t4("Təhlükəsiz API dizaynı", "Secure API design", "Güvenli API tasarımı", "Проектирование безопасных API"),
    intro: l(
      "API-lər tətbiqin məlumatına birbaşa çıxış verir, ona görə hər endpoint autentifikasiya, avtorizasiya, giriş yoxlaması və sürət məhdudiyyəti tələb edir. OWASP API Security Top 10 API-yə xas riskləri təsvir edir.",
      "APIs give direct access to an application's data, so every endpoint needs authentication, authorisation, input validation and rate limiting. The OWASP API Security Top 10 describes API-specific risks.",
    ),
    concepts: [
      c("BOLA", "BOLA", "Broken Object Level Authorization — API-lərdə ən geniş yayılmış risk (IDOR-un API forması).", "Broken Object Level Authorization — the most common API risk (IDOR in API form)."),
      c("Minimal cavab", "Minimal responses", "Yalnız lazım olan sahələri qaytarmaq; daxili sahələri (parol hash-i, rol) heç vaxt göndərməmək.", "Return only the fields needed; never send internal fields (password hash, role)."),
      c("Sürət məhdudiyyəti (rate limiting)", "Rate limiting", "Hər klient üçün sorğu sayını məhdudlaşdırmaq — sui-istifadəyə və resurs tükənməsinə qarşı.", "Limiting requests per client — against abuse and resource exhaustion."),
      c("Mass assignment", "Mass assignment", "Klientin göndərdiyi bütün sahələri birbaşa obyektə yazmamaq; icazə verilən sahələri açıq seçmək.", "Not copying every client field straight into an object; explicitly pick allowed fields."),
    ],
    examples: [
      {
        title: l("İcazə verilən sahələri açıq seçmək", "Explicitly picking allowed fields"),
        lang: "javascript",
        code: "app.patch(\"/api/me\", requireAuth, (req, res) => {\n  const { displayName, bio } = req.body;      // allowlist\n  const user = updateUser(req.session.userId, { displayName, bio });\n  res.json({ id: user.id, displayName: user.displayName, bio: user.bio });\n});",
        explain: l(
          "Yalnız `displayName` və `bio` yenilənir; klient `role` və ya `isAdmin` göndərsə belə nəzərə alınmır. Cavabda da yalnız ictimai sahələr qaytarılır.",
          "Only `displayName` and `bio` are updated; even if the client sends `role` or `isAdmin`, they are ignored. The response also contains only public fields.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Bütün obyekti qaytarmaq", "Returning the whole object"),
        why: l("Frontend lazımsız sahələri göstərməsə belə, onlar şəbəkə cavabında görünür.", "Even if the frontend does not show extra fields, they are visible in the network response."),
        wrong: "res.json(user);  // includes passwordHash, role, ...",
        right: "res.json({ id: user.id, displayName: user.displayName });",
        lang: "javascript",
      },
      {
        title: l("Mass assignment", "Mass assignment"),
        why: l("Sorğunun bütün gövdəsini bazaya yazmaq istifadəçiyə öz rolunu dəyişməyə imkan verə bilər.", "Writing the whole request body to the database may let a user change their own role."),
        wrong: "updateUser(id, req.body);",
        right: "const { displayName, bio } = req.body;\nupdateUser(id, { displayName, bio });",
        lang: "javascript",
      },
    ],
    exercise: {
      task: l(
        "Yeni `POST /api/comments` endpoint-i üçün dörd təhlükəsizlik tələbi yazın.",
        "Write four security requirements for a new `POST /api/comments` endpoint.",
      ),
      hints: [l("Kim, nə, nə qədər, necə göstərilir.", "Who, what, how much, how it is displayed.")],
      answer: l(
        "(1) Autentifikasiya tələb olunur; müəllif ID-si sessiyadan götürülür. (2) Mətn uzunluğu yoxlanır (məsələn, 1–2000 simvol). (3) Hər istifadəçi üçün sürət məhdudiyyəti. (4) Göstərilərkən mətn HTML üçün kodlaşdırılır (XSS-in qarşısını almaq).",
        "(1) Authentication is required; the author ID comes from the session. (2) Text length is validated (e.g. 1–2000 characters). (3) Per-user rate limiting. (4) The text is HTML-encoded when displayed (prevents XSS).",
      ),
    },
    quiz: [
      q(
        l("OWASP API Security Top 10 (2023) siyahısında birinci risk hansıdır?", "What is the first risk in the OWASP API Security Top 10 (2023)?"),
        ["BOLA", "SQL injection", "CSRF"],
        0,
        l("API1:2023 — Broken Object Level Authorization.", "API1:2023 is Broken Object Level Authorization."),
      ),
      q(
        l("Mass assignment-a qarşı əsas müdafiə nədir?", "What is the main defence against mass assignment?"),
        [l("İcazə verilən sahələri açıq seçmək", "Explicitly picking allowed fields"), l("Daha uzun parol", "Longer passwords"), l("HTTPS", "HTTPS")],
        0,
        l("Allowlist yalnız gözlənilən sahələrin yazılmasına imkan verir.", "An allowlist lets only expected fields be written."),
      ),
    ],
    refs: [
      ref("OWASP API Security Project", "https://owasp.org/API-Security/"),
      ref("OWASP REST Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html"),
      ref("OWASP Mass Assignment Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html"),
    ],
  },
  {
    id: "web-sqli",
    module: "web",
    title: t4("SQL injection: anlayış və qarşısının alınması", "SQL injection: concept and prevention", "SQL enjeksiyonu: kavram ve önleme", "SQL-инъекция: суть и защита"),
    intro: l(
      "SQL injection istifadəçi məlumatı SQL sorğusuna mətn kimi birləşdiriləndə baş verir: verilənlər bazası məlumatı əmrin bir hissəsi kimi şərh edə bilər. Həll sadədir və etibarlıdır — parametrləşdirilmiş sorğular (prepared statements). Bu dərs yalnız qarşısının alınmasını öyrədir.",
      "SQL injection happens when user data is concatenated into an SQL query as text: the database may interpret the data as part of the command. The fix is simple and reliable — parameterised queries (prepared statements). This lesson teaches prevention only.",
    ),
    concepts: [
      c("Kök səbəb", "Root cause", "Məlumat və kod (SQL) eyni mətndə qarışdırılır.", "Data and code (SQL) are mixed in the same string."),
      c("Parametrləşdirilmiş sorğu", "Parameterised query", "SQL mətni və məlumat ayrıca göndərilir; məlumat heç vaxt əmr kimi şərh olunmur.", "The SQL text and the data are sent separately; data is never interpreted as a command."),
      c("Ən az imtiyaz", "Least privilege", "Tətbiqin DB istifadəçisi yalnız lazım olan cədvəllərə və əməliyyatlara çıxış əldə edir — zərəri məhdudlaşdırır.", "The app's DB user gets only the tables and operations it needs — limiting damage."),
      c("ORM", "ORM", "ORM-lər default olaraq parametrləşdirir, lakin \"raw\" sorğu funksiyalarında yenə diqqət lazımdır.", "ORMs parameterise by default, but \"raw\" query functions still need care."),
    ],
    examples: [
      {
        title: l("Python sqlite3: parametrləşdirilmiş sorğu", "Python sqlite3: a parameterised query"),
        lang: "python",
        code: "cur.execute(\n    \"SELECT id, name FROM users WHERE email = ?\",\n    (email,),\n)",
        explain: l(
          "`?` yer tutucudur; `email` dəyəri ayrıca ötürülür. Dəyərdə hansı simvol olursa olsun, o, yalnız məlumat kimi müqayisə olunur.",
          "`?` is a placeholder; the `email` value is passed separately. Whatever characters it contains, it is compared only as data.",
        ),
      },
      {
        title: l("Node.js (node-postgres): parametrləşdirilmiş sorğu", "Node.js (node-postgres): a parameterised query"),
        lang: "javascript",
        code: "const { rows } = await client.query(\n  \"SELECT id, name FROM users WHERE email = $1\",\n  [email],\n);",
        explain: l(
          "PostgreSQL-də yer tutucular `$1`, `$2` formasındadır; dəyərlər massiv kimi ötürülür.",
          "PostgreSQL placeholders are `$1`, `$2`; values are passed as an array.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Sorğunu mətn birləşdirmə ilə qurmaq (code smell)", "Building a query by string concatenation (code smell)"),
        why: l(
          "İstifadəçi məlumatı birbaşa SQL mətninə düşür. Kodda belə nümunə görəndə onu dərhal parametrləşdirilmiş sorğu ilə əvəz edin.",
          "User data goes straight into the SQL text. When you see this pattern in code, replace it with a parameterised query at once.",
        ),
        wrong: "cur.execute(\"SELECT * FROM users WHERE email = '\" + email + \"'\")",
        right: "cur.execute(\"SELECT * FROM users WHERE email = ?\", (email,))",
        lang: "python",
      },
      {
        title: l("Dırnaqları \"təmizləməyə\" çalışmaq", "Trying to \"clean\" quotes manually"),
        why: l("Əl ilə escape etmək asanlıqla səhv olur və verilənlər bazasından asılıdır. Parametrləşdirmə yeganə etibarlı əsas müdafiədir.", "Manual escaping is error-prone and database-specific. Parameterisation is the only reliable primary defence."),
      },
    ],
    exercise: {
      task: l(
        "Bu funksiyanı təhlükəsiz edin (sqlite3): `def find_product(cur, name): cur.execute(f\"SELECT * FROM products WHERE name = '{name}'\")`",
        "Make this function safe (sqlite3): `def find_product(cur, name): cur.execute(f\"SELECT * FROM products WHERE name = '{name}'\")`",
      ),
      hints: [l("f-string də mətn birləşdirməsidir.", "An f-string is also string concatenation.")],
      answer: l(
        "`cur.execute(\"SELECT id, name, price FROM products WHERE name = ?\", (name,))` — həmçinin `SELECT *` əvəzinə lazım olan sütunları seçmək.",
        "`cur.execute(\"SELECT id, name, price FROM products WHERE name = ?\", (name,))` — and select only the needed columns instead of `SELECT *`.",
      ),
    },
    quiz: [
      q(
        l("SQL injection-a qarşı əsas müdafiə hansıdır?", "What is the primary defence against SQL injection?"),
        [l("Parametrləşdirilmiş sorğular", "Parameterised queries"), l("Gizli cədvəl adları", "Secret table names"), l("Uzun parollar", "Long passwords")],
        0,
        l("Məlumat və SQL ayrıca göndərilir.", "Data and SQL are sent separately."),
      ),
      q(
        l("Python-da f-string ilə SQL qurmaq təhlükəsizdirmi?", "Is building SQL with a Python f-string safe?"),
        [l("Xeyr", "No"), l("Bəli", "Yes")],
        0,
        l("f-string də məlumatı SQL mətninə birləşdirir.", "An f-string also concatenates data into SQL text."),
      ),
      q(
        l("Tətbiqin DB istifadəçisinə hansı hüquqlar verilməlidir?", "What rights should the app's DB user have?"),
        [l("Yalnız lazım olanlar", "Only what is needed"), l("Superuser", "Superuser")],
        0,
        l("Ən az imtiyaz mümkün zərəri azaldır.", "Least privilege reduces possible damage."),
      ),
    ],
    refs: [
      ref("OWASP SQL Injection Prevention Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"),
      ref("OWASP Query Parameterization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html"),
      ref("Python docs — sqlite3 placeholders", "https://docs.python.org/3/library/sqlite3.html#sqlite3-placeholders"),
    ],
  },
  {
    id: "web-xss",
    module: "web",
    title: t4("XSS: anlayış və qarşısının alınması", "XSS: concept and prevention", "XSS: kavram ve önleme", "XSS: суть и защита"),
    intro: l(
      "Cross-site scripting (XSS) istifadəçi məlumatı səhifəyə HTML kimi daxil ediləndə baş verir: brauzer onu başqa istifadəçinin səhifəsində kod kimi işlədə bilər. Müdafiə: kontekstə uyğun çıxış kodlaşdırması (output encoding), təhlükəsiz DOM API-ləri və Content Security Policy (CSP). Bu dərs yalnız qarşısının alınmasını öyrədir.",
      "Cross-site scripting (XSS) happens when user data is inserted into a page as HTML: the browser may run it as code in another user's page. Defences: context-aware output encoding, safe DOM APIs and a Content Security Policy (CSP). This lesson teaches prevention only.",
    ),
    concepts: [
      c("Növlər", "Types", "Stored (saxlanmış), reflected (əks olunan) və DOM-based XSS — hamısının kökü eynidir: məlumat kod kimi şərh olunur.", "Stored, reflected and DOM-based XSS — the root is the same: data is interpreted as code."),
      c("Çıxış kodlaşdırması", "Output encoding", "`<` → `&lt;` kimi çevirmə məlumatı mətn kimi göstərir. React, Vue, Angular kimi framework-lər bunu default edir.", "Converting `<` to `&lt;` displays data as text. Frameworks like React, Vue and Angular do this by default."),
      c("Təhlükəsiz DOM API", "Safe DOM APIs", "`textContent` mətn yazır; `innerHTML` isə HTML kimi şərh edir.", "`textContent` writes text; `innerHTML` parses HTML."),
      c("CSP", "CSP", "Brauzerə hansı mənbələrdən skript yükləməyə icazə olduğunu deyən başlıq — əlavə müdafiə qatı.", "A header telling the browser which sources may load scripts — an extra layer of defence."),
    ],
    examples: [
      {
        title: l("Mətni təhlükəsiz göstərmək", "Displaying text safely"),
        lang: "javascript",
        code: "const el = document.querySelector(\"#comment\");\nel.textContent = comment.text;   // shown as plain text",
        explain: l(
          "`textContent` dəyəri HTML kimi şərh etmir, ona görə məzmun hər zaman mətn kimi göstərilir.",
          "`textContent` never parses the value as HTML, so the content is always shown as text.",
        ),
      },
      {
        title: l("Content Security Policy başlığı", "A Content-Security-Policy header"),
        lang: "plain",
        code: "Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
        explain: l(
          "Skriptlər yalnız öz domeninizdən yüklənə bilər, inline skriptlər və plaginlər bloklanır, sayt başqa saytların çərçivəsində açılmır. CSP kodlaşdırmanı əvəz etmir, əlavə qatdır.",
          "Scripts may load only from your own origin, inline scripts and plugins are blocked, and the site cannot be framed by others. CSP does not replace encoding; it is an extra layer.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("İstifadəçi məlumatını innerHTML ilə yazmaq (code smell)", "Writing user data with innerHTML (code smell)"),
        why: l("Məlumat HTML kimi şərh olunur. `textContent` istifadə edin; HTML həqiqətən lazımdırsa, etibarlı sanitizer kitabxanası (məsələn, DOMPurify) ilə təmizləyin.", "The data is parsed as HTML. Use `textContent`; if HTML is truly needed, clean it with a trusted sanitiser library (e.g. DOMPurify)."),
        wrong: "el.innerHTML = comment.text;",
        right: "el.textContent = comment.text;",
        lang: "javascript",
      },
      {
        title: l("React-da dangerouslySetInnerHTML", "dangerouslySetInnerHTML in React"),
        why: l("Adı xəbərdarlıqdır: React-ın avtomatik kodlaşdırmasını söndürür. Adi JSX ifadəsindən istifadə edin.", "The name is a warning: it turns off React's automatic encoding. Use a normal JSX expression."),
        wrong: "<div dangerouslySetInnerHTML={{ __html: comment.text }} />",
        right: "<div>{comment.text}</div>",
        lang: "javascript",
      },
    ],
    exercise: {
      task: l(
        "Axtarış səhifəsi istifadəçinin sorğusunu belə göstərir: `results.innerHTML = \"Results for: \" + query;`. Problemi izah edin və iki səviyyədə düzəliş təklif edin.",
        "A search page shows the user's query like this: `results.innerHTML = \"Results for: \" + query;`. Explain the problem and suggest fixes at two levels.",
      ),
      hints: [l("Kod səviyyəsi və HTTP başlığı səviyyəsi.", "Code level and HTTP header level.")],
      answer: l(
        "Sorğu HTML kimi şərh olunur (reflected/DOM XSS). Kod: `results.textContent = \"Results for: \" + query;`. Əlavə qat: inline skriptləri bloklayan CSP başlığı (`script-src 'self'`).",
        "The query is parsed as HTML (reflected/DOM XSS). Code: `results.textContent = \"Results for: \" + query;`. Extra layer: a CSP header that blocks inline scripts (`script-src 'self'`).",
      ),
    },
    quiz: [
      q(
        l("İstifadəçi mətnini göstərmək üçün hansı DOM xassəsi təhlükəsizdir?", "Which DOM property is safe for displaying user text?"),
        ["innerHTML", "textContent", "outerHTML"],
        1,
        l("`textContent` HTML-i şərh etmir.", "`textContent` does not parse HTML."),
      ),
      q(
        l("CSP nədir?", "What is CSP?"),
        [l("Skript mənbələrini məhdudlaşdıran HTTP başlığı", "An HTTP header that restricts script sources"), l("Şifrələmə alqoritmi", "An encryption algorithm"), l("Verilənlər bazası", "A database")],
        0,
        l("Content Security Policy brauzerə yükləmə qaydaları verir.", "Content Security Policy gives the browser loading rules."),
      ),
      q(
        l("CSP çıxış kodlaşdırmasını əvəz edirmi?", "Does CSP replace output encoding?"),
        [l("Xeyr, əlavə qatdır", "No, it is an extra layer"), l("Bəli", "Yes")],
        0,
        l("Dərin müdafiə: həm kodlaşdırma, həm CSP.", "Defense in depth: both encoding and CSP."),
      ),
    ],
    refs: [
      ref("OWASP Cross Site Scripting Prevention Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html"),
      ref("OWASP Content Security Policy Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html"),
      ref("MDN — Content Security Policy (CSP)", "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP"),
    ],
  },
  {
    id: "web-secure-coding",
    module: "web",
    title: t4("Təhlükəsiz kodlaşdırma təcrübələri", "Secure coding practices", "Güvenli kodlama uygulamaları", "Практики безопасного программирования"),
    intro: l(
      "Təhlükəsiz kod bir neçə sadə vərdişə əsaslanır: etibarsız məlumata etibar etməmək, xətaları təhlükəsiz idarə etmək, sirləri qorumaq, yoxlanılmış kitabxanalardan istifadə etmək və hər dəyişikliyi nəzərdən keçirmək.",
      "Secure code rests on a few simple habits: never trust untrusted data, handle errors safely, protect secrets, use well-tested libraries and review every change.",
    ),
    concepts: [
      c("Təhlükəsiz xəta idarəsi", "Safe error handling", "İstifadəçiyə ümumi mesaj, jurnala ətraflı məlumat; stack trace istifadəçiyə göstərilmir.", "A generic message to the user, details to the log; no stack traces shown to users."),
      c("Kriptoqrafiyanı özünüz yazmayın", "Do not roll your own crypto", "Standart kitabxanalardan və tövsiyə olunan alqoritmlərdən istifadə edin.", "Use standard libraries and recommended algorithms."),
      c("Təhlükəsiz təsadüfilik", "Secure randomness", "Token üçün `Math.random()` yox, kriptoqrafik generator (`crypto.randomUUID()`, Python `secrets`).", "For tokens use a cryptographic generator (`crypto.randomUUID()`, Python `secrets`), not `Math.random()`."),
      c("Asılılıqların gigiyenası", "Dependency hygiene", "Az, etibarlı, yenilənən asılılıqlar; lock faylları.", "Few, trusted, maintained dependencies; lock files."),
    ],
    examples: [
      {
        title: l("Təhlükəsiz token yaratmaq (Python)", "Generating a secure token (Python)"),
        lang: "python",
        code: "import secrets\n\nreset_token = secrets.token_urlsafe(32)   # ~256 bits of randomness",
        explain: l(
          "`secrets` modulu kriptoqrafik cəhətdən təhlükəsiz təsadüfi ədədlər üçündür; `random` modulu isə təxmin edilə biləndir və təhlükəsizlik üçün yararsızdır.",
          "The `secrets` module is for cryptographically secure randomness; the `random` module is predictable and unsuitable for security.",
        ),
      },
      {
        title: l("Ümumi xəta cavabı (Express)", "A generic error response (Express)"),
        lang: "javascript",
        code: "app.use((err, req, res, next) => {\n  logger.error({ err, path: req.path });          // details to the log\n  res.status(500).json({ error: \"Something went wrong\" });\n});",
        explain: l(
          "Xətanın təfərrüatı yalnız jurnala yazılır; istifadəçi ümumi mesaj görür. Jurnala parol və ya token yazmayın.",
          "Error details go only to the log; the user sees a generic message. Never log passwords or tokens.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Təhlükəsizlik tokeni üçün Math.random()", "Math.random() for security tokens"),
        why: l("`Math.random()` kriptoqrafik deyil və nəticələri proqnozlaşdırıla bilər.", "`Math.random()` is not cryptographic and its output can be predicted."),
        wrong: "const token = Math.random().toString(36).slice(2);",
        right: "const token = crypto.randomUUID();",
        lang: "javascript",
      },
    ],
    exercise: {
      task: l(
        "Kod nəzərdən keçirmə üçün 6 bəndlik təhlükəsizlik yoxlama siyahısı yazın.",
        "Write a 6-item security checklist for code review.",
      ),
      hints: [l("Əvvəlki F dərslərinə baxın.", "Look back at the earlier F lessons.")],
      answer: l(
        "(1) Bütün SQL sorğuları parametrləşdirilib; (2) istifadəçi məlumatı kodlaşdırılaraq göstərilir, `innerHTML` yoxdur; (3) hər endpoint-də autentifikasiya və obyekt səviyyəsində avtorizasiya; (4) giriş server tərəfində yoxlanır; (5) kodda sirr yoxdur; (6) xətalar istifadəçiyə ətraflı göstərilmir və jurnalda həssas məlumat yoxdur.",
        "(1) All SQL is parameterised; (2) user data is encoded on output, no `innerHTML`; (3) authentication and object-level authorisation on every endpoint; (4) input is validated on the server; (5) no secrets in code; (6) errors are not shown in detail to users and logs contain no sensitive data.",
      ),
    },
    quiz: [
      q(
        l("Parol sıfırlama tokeni üçün Python-da hansı modul uyğundur?", "Which Python module suits a password-reset token?"),
        ["random", "secrets", "math"],
        1,
        l("`secrets` kriptoqrafik təsadüfilik verir.", "`secrets` provides cryptographic randomness."),
      ),
      q(
        l("İstifadəçiyə stack trace göstərmək niyə pisdir?", "Why is showing a stack trace to users bad?"),
        [l("Daxili məlumatı açır", "It reveals internals"), l("Sayt yavaşlayır", "It slows the site")],
        0,
        l("Yollar, versiyalar və sorğular hücumçuya kömək edə bilər.", "Paths, versions and queries can help an attacker."),
      ),
    ],
    refs: [
      ref("OWASP Secure Coding Practices — Quick Reference Guide", "https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/"),
      ref("OWASP Error Handling Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html"),
      ref("Python docs — secrets", "https://docs.python.org/3/library/secrets.html"),
    ],
  },
];

// ───────────────────────────── G · Safe labs (defensive exercises) ─────────────────────────────
const G: SecTopic[] = [
  {
    id: "lab-safe-environments",
    module: "labs",
    title: t4("Təhlükəsiz məşq mühitləri", "Safe practice environments", "Güvenli pratik ortamları", "Безопасные среды для практики"),
    intro: l(
      "Təhlükəsizlik bacarıqları yalnız qanuni və təcrid olunmuş mühitdə məşq edilir: öz virtual maşınlarınız, öz kompüterinizdə lokal işləyən qəsdən zəif təlim tətbiqləri və rəsmi təlim platformaları. Bu modulun tapşırıqları tamamilə müdafiə yönümlüdür və tətbiqin içində heç bir əmr icra olunmur.",
      "Security skills are practised only in legal, isolated environments: your own virtual machines, intentionally vulnerable training apps running locally on your own computer, and official training platforms. The exercises in this module are entirely defensive, and nothing is executed inside the app.",
    ),
    concepts: [
      c("Öz mühitiniz", "Your own environment", "Sahibi olduğunuz cihaz və VM-lər; real məlumat və real parollar yoxdur.", "Devices and VMs you own; no real data or real passwords."),
      c("Təlim tətbiqləri", "Training apps", "OWASP Juice Shop kimi layihələr təlim üçün qəsdən zəif hazırlanıb və yalnız lokal işlədilməlidir.", "Projects such as OWASP Juice Shop are deliberately vulnerable for training and must run locally only."),
      c("Müdafiə tapşırıqları", "Defensive exercises", "Jurnal oxumaq, zəif kodu düzəltmək, icazələri seçmək, konfiqurasiyanı sərtləşdirmək.", "Reading logs, fixing weak code, choosing permissions, hardening configuration."),
    ],
    examples: [
      {
        title: l("Laboratoriya qaydaları", "Lab rules"),
        lang: "plain",
        code: "1. Only my own machine and my own VMs\n2. Vulnerable apps bound to 127.0.0.1\n3. Host-only / internal VM networking\n4. Snapshot before every exercise\n5. No real credentials or personal data\n6. Stop everything when finished",
        explain: l(
          "Bu qaydalar hər məşqdən əvvəl yoxlanır. Bu tətbiq Kali və ya WSL ilə inteqrasiya olunmur və heç bir əmri icra etmir — bütün tapşırıqlar oxumaq və düşünmək üzərində qurulub.",
          "Check these rules before every exercise. This app does not integrate with Kali or WSL and never executes commands — all exercises are based on reading and reasoning.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("İctimai saytı \"məşq yeri\" hesab etmək", "Treating a public website as a practice target"),
        why: l("İnternetdə açıq olan sayt sizə məxsus deyil. Məşq yalnız öz mühitinizdə və ya icazəli təlim platformalarında aparılır.", "A website being public does not make it yours. Practise only in your own environment or on authorised training platforms."),
      },
    ],
    exercise: {
      task: l(
        "Hansı mühitlər məşq üçün uyğundur: (a) öz noutbukunuzdakı VM; (b) universitetin şəbəkəsi; (c) `127.0.0.1:3000`-də işləyən Juice Shop; (d) işəgötürənin istehsalat serveri (icazəsiz)?",
        "Which environments are suitable for practice: (a) a VM on your own laptop; (b) the university network; (c) Juice Shop on `127.0.0.1:3000`; (d) your employer's production server (without permission)?",
      ),
      hints: [l("Sahiblik və təcrid.", "Ownership and isolation.")],
      answer: l("(a) və (c). (b) və (d) sizə məxsus deyil və icazə yoxdur.", "(a) and (c). (b) and (d) are not yours and there is no permission."),
    },
    quiz: [
      q(
        l("Qəsdən zəif tətbiq hansı ünvanda işləməlidir?", "Which address should an intentionally vulnerable app use?"),
        ["127.0.0.1", "0.0.0.0", l("İctimai IP", "A public IP")],
        0,
        l("Loopback onu şəbəkədən gizli saxlayır.", "Loopback keeps it off the network."),
      ),
      q(
        l("Bu tətbiq laboratoriya əmrlərini icra edirmi?", "Does this app execute lab commands?"),
        [l("Xeyr", "No"), l("Bəli", "Yes")],
        0,
        l("Tətbiq yalnız öyrədir; heç bir əmr icra etmir və Kali/WSL inteqrasiyası yoxdur.", "The app only teaches; it runs no commands and has no Kali/WSL integration."),
      ),
    ],
    refs: [
      ref("OWASP Juice Shop", "https://owasp.org/www-project-juice-shop/"),
      ref("Kali Docs — Virtualization", "https://www.kali.org/docs/virtualization/"),
    ],
  },
  {
    id: "lab-auth-logs",
    module: "labs",
    title: t4("Laboratoriya: auth jurnalını oxumaq", "Lab: reading an auth log", "Laboratuvar: auth günlüğünü okumak", "Практикум: чтение журнала аутентификации"),
    intro: l(
      "Bu tapşırıqda nümunə autentifikasiya jurnalını oxuyub şübhəli nümunələri tapacaqsınız. Jurnal uydurmadır; ünvanlar sənədləşdirmə üçün ayrılmış aralıqlardandır (RFC 5737).",
      "In this exercise you read a sample authentication log and find suspicious patterns. The log is fictional; addresses come from ranges reserved for documentation (RFC 5737).",
    ),
    concepts: [
      c("Vaxt nümunələri", "Time patterns", "Qeyri-adi saatlarda fəaliyyət və saniyələr ərzində çoxlu cəhd.", "Activity at unusual hours and many attempts within seconds."),
      c("Ünvan nümunələri", "Address patterns", "Eyni ünvandan müxtəlif istifadəçi adları və ya bir hesaba çoxlu ünvandan cəhdlər.", "Many usernames from one address, or one account tried from many addresses."),
      c("İmtiyaz dəyişiklikləri", "Privilege changes", "`sudo` istifadəsi, yeni istifadəçi və ya qrup üzvlüyü — xüsusilə şübhəli girişdən sonra.", "`sudo` use, a new user or group membership — especially after a suspicious login."),
    ],
    examples: [
      {
        title: l("Faydalı süzgəclər (öz sisteminizdə)", "Useful filters (on your own system)"),
        lang: "plain",
        code: "sudo grep -E \"Accepted|Failed\" /var/log/auth.log\nsudo grep \"sudo:\" /var/log/auth.log\njournalctl -u ssh --since today",
        explain: l(
          "Birinci əmr uğurlu və uğursuz girişləri, ikinci `sudo` istifadəsini göstərir. rsyslog olmayan sistemlərdə eyni məlumat `journalctl` ilə əldə edilir.",
          "The first command shows successful and failed logins, the second shows `sudo` use. On systems without rsyslog the same information comes from `journalctl`.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Bir sətrə görə nəticə çıxarmaq", "Concluding from a single line"),
        why: l("Bir uğursuz giriş adi yazı səhvi ola bilər. Nümunəyə baxın: say, vaxt, ünvan və sonrakı hadisələr.", "One failed login may just be a typo. Look at the pattern: count, timing, address and what followed."),
      },
    ],
    exercise: {
      task: l(
        "Jurnalı oxuyun və üç şübhəli müşahidəni yazın. Hər biri üçün müdafiə tədbiri təklif edin.",
        "Read the log and write down three suspicious observations. Suggest a defensive action for each.",
      ),
      material: {
        lang: "plain",
        code: "Dec  2 02:58:10 app1 sshd[1201]: Failed password for invalid user oracle from 192.0.2.77 port 40112 ssh2\nDec  2 02:58:11 app1 sshd[1203]: Failed password for invalid user postgres from 192.0.2.77 port 40118 ssh2\nDec  2 02:58:12 app1 sshd[1205]: Failed password for invalid user git from 192.0.2.77 port 40121 ssh2\nDec  2 08:30:02 app1 sshd[1400]: Accepted publickey for maria from 198.51.100.20 port 51000 ssh2\nDec  2 08:31:15 app1 sudo:    maria : TTY=pts/0 ; PWD=/home/maria ; USER=root ; COMMAND=/usr/bin/apt update\nDec  2 23:47:40 app1 sshd[2210]: Accepted password for backup from 203.0.113.9 port 60222 ssh2\nDec  2 23:48:05 app1 sudo:   backup : TTY=pts/1 ; PWD=/tmp ; USER=root ; COMMAND=/usr/sbin/useradd -m support2\nDec  2 23:48:30 app1 sudo:   backup : TTY=pts/1 ; PWD=/tmp ; USER=root ; COMMAND=/usr/sbin/usermod -aG sudo support2",
      },
      hints: [
        l("Gündüz və gecə fəaliyyətini müqayisə edin.", "Compare daytime and night-time activity."),
        l("`backup` hesabı nə üçün yeni istifadəçi yaradır?", "Why would the `backup` account create a new user?"),
      ],
      answer: l(
        "(1) 02:58-də `192.0.2.77` saniyədə bir müxtəlif xidmət adları ilə cəhd edir — avtomatlaşdırılmış təxmin; tədbir: parolla SSH girişini söndürmək, sürət məhdudiyyəti. (2) 23:47-də `backup` hesabına parolla, tanış olmayan ünvandan uğurlu giriş — xidmət hesabının interaktiv girişi gözlənilməzdir; tədbir: hesabı kilidləmək, parolu dəyişmək, insident açmaq. (3) Dərhal sonra `support2` istifadəçisi yaradılıb və `sudo` qrupuna əlavə edilib — mümkün davamlı giriş cəhdi; tədbir: `support2`-ni kilidləmək və sübut kimi saxlamaq, bütün dəyişiklikləri araşdırmaq. `maria`-nın səhər açarla girişi və `apt update` normal görünür.",
        "(1) At 02:58 `192.0.2.77` tries different service names every second — automated guessing; action: disable SSH password login, add rate limiting. (2) At 23:47 a successful password login to `backup` from an unfamiliar address — interactive login to a service account is unexpected; action: lock the account, reset the password, open an incident. (3) Right after, user `support2` is created and added to `sudo` — a likely attempt to keep access; action: lock `support2` and keep it as evidence, investigate all changes. `maria`'s morning key login and `apt update` look normal.",
      ),
    },
    quiz: [
      q(
        l("Jurnalda ən təhlükəli ardıcıllıq hansıdır?", "Which sequence in the log is most dangerous?"),
        [l("Gecə uğurlu giriş + yeni sudo istifadəçisi", "Night login + new sudo user"), l("Səhər açarla giriş", "Morning key login"), l("`apt update`", "`apt update`")],
        0,
        l("Bu, hesabın ələ keçirildiyini və girişin saxlanmağa çalışıldığını göstərir.", "It suggests a compromised account and an attempt to keep access."),
      ),
      q(
        l("Şübhəli yeni istifadəçini nə etmək lazımdır?", "What should you do with a suspicious new user?"),
        [l("Kilidləmək və sübut kimi saxlamaq", "Lock it and keep it as evidence"), l("Dərhal silib unutmaq", "Delete it and forget it")],
        0,
        l("Silmək sübutu məhv edir; əvvəlcə kilidləyin və sənədləşdirin.", "Deleting destroys evidence; lock and document first."),
      ),
    ],
    refs: [
      ref("RFC 5737 — IPv4 Address Blocks Reserved for Documentation", "https://www.rfc-editor.org/rfc/rfc5737"),
      ref("NIST SP 800-92 — Guide to Computer Security Log Management", "https://csrc.nist.gov/pubs/sp/800/92/final"),
    ],
  },
  {
    id: "lab-fix-code",
    module: "labs",
    title: t4("Laboratoriya: təhlükəsiz olmayan kodu düzəltmək", "Lab: fixing insecure code", "Laboratuvar: güvensiz kodu düzeltmek", "Практикум: исправление небезопасного кода"),
    intro: l(
      "Bu tapşırıqda kiçik kod parçasında bir neçə təhlükəsizlik problemi var. Məqsəd onları tapmaq və düzgün, təhlükəsiz versiyanı yazmaqdır. Kod tətbiqdə işlədilmir.",
      "In this exercise a small code snippet contains several security problems. The goal is to find them and write the correct, secure version. The code is not run in the app.",
    ),
    concepts: [
      c("Injection", "Injection", "SQL sorğusunda mətn birləşdirməsi.", "String concatenation in an SQL query."),
      c("XSS", "XSS", "İstifadəçi məlumatının kodlaşdırılmadan HTML-ə yazılması.", "User data written into HTML without encoding."),
      c("Parol saxlanması", "Password storage", "Sürətli hash və ya açıq mətn.", "A fast hash or plain text."),
      c("Sirlər", "Secrets", "Kodda saxlanan parol və açarlar.", "Passwords and keys kept in code."),
    ],
    examples: [
      {
        title: l("Düzəldilmiş versiya (Python, Flask)", "The fixed version (Python, Flask)"),
        lang: "python",
        code: "import os, hashlib, hmac\nfrom markupsafe import escape\n\nSECRET_KEY = os.environ[\"SECRET_KEY\"]\n\ndef find_user(cur, email):\n    cur.execute(\"SELECT id, name, salt, pw_hash FROM users WHERE email = ?\", (email,))\n    return cur.fetchone()\n\ndef check_password(row, attempt):\n    calc = hashlib.scrypt(attempt.encode(), salt=row[\"salt\"], n=2**14, r=8, p=1)\n    return hmac.compare_digest(calc, row[\"pw_hash\"])\n\ndef greeting(name):\n    return f\"<p>Hello, {escape(name)}</p>\"",
        explain: l(
          "Sirr mühit dəyişənindən oxunur; sorğu parametrləşdirilib; parol duzlu scrypt ilə yoxlanır və müqayisə sabit vaxtdadır; ad HTML-ə yazılmazdan əvvəl `escape` ilə kodlaşdırılır. Real Flask şablonları (Jinja2) bunu avtomatik edir.",
          "The secret comes from an environment variable; the query is parameterised; the password is checked with salted scrypt in constant time; the name is HTML-encoded with `escape` before output. Real Flask templates (Jinja2) do this automatically.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Bir problemi düzəldib digərlərini unutmaq", "Fixing one problem and missing the rest"),
        why: l("Kod nəzərdən keçirmədə yoxlama siyahısından istifadə edin: injection, çıxış, parol, sirlər, xətalar.", "Use a checklist during review: injection, output, passwords, secrets, errors."),
      },
    ],
    exercise: {
      task: l(
        "Aşağıdakı kodda dörd təhlükəsizlik problemini tapın və hər biri üçün düzəlişi yazın.",
        "Find four security problems in the code below and write the fix for each.",
      ),
      material: {
        lang: "python",
        code: "SECRET_KEY = \"dev-secret-123\"\n\ndef find_user(cur, email):\n    cur.execute(\"SELECT * FROM users WHERE email = '\" + email + \"'\")\n    return cur.fetchone()\n\ndef check_password(row, attempt):\n    return row[\"pw\"] == hashlib.md5(attempt.encode()).hexdigest()\n\ndef greeting(name):\n    return \"<p>Hello, \" + name + \"</p>\"",
      },
      hints: [
        l("Hər funksiyaya ayrıca baxın.", "Look at each function separately."),
        l("Yuxarıdakı \"Düzəldilmiş versiya\" nümunəsi ilə müqayisə edin.", "Compare with the \"fixed version\" example above."),
      ],
      answer: l(
        "(1) `SECRET_KEY` kodda yazılıb → mühit dəyişənindən oxumaq. (2) SQL mətn birləşdirməsi → `?` parametri ilə sorğu. (3) MD5, duzsuz, adi `==` müqayisəsi → scrypt/Argon2id/bcrypt, duz və `hmac.compare_digest`. (4) `name` HTML-ə kodlaşdırılmadan yazılır (XSS) → `escape(name)` və ya avtomatik kodlaşdıran şablon.",
        "(1) `SECRET_KEY` is hard-coded → read it from an environment variable. (2) SQL string concatenation → a query with a `?` parameter. (3) MD5, unsalted, plain `==` comparison → scrypt/Argon2id/bcrypt with a salt and `hmac.compare_digest`. (4) `name` is written into HTML unencoded (XSS) → `escape(name)` or an auto-escaping template.",
      ),
    },
    quiz: [
      q(
        l("Parol hash-lərini müqayisə etmək üçün hansı funksiya tövsiyə olunur?", "Which function is recommended for comparing password hashes?"),
        ["hmac.compare_digest", "==", "str.startswith"],
        0,
        l("Sabit vaxtlı müqayisə vaxt fərqinə əsaslanan sızmanın qarşısını alır.", "Constant-time comparison prevents timing leaks."),
      ),
      q(
        l("`markupsafe.escape` nə edir?", "What does `markupsafe.escape` do?"),
        [l("HTML üçün xüsusi simvolları kodlaşdırır", "Encodes special characters for HTML"), l("Məlumatı şifrələyir", "Encrypts data"), l("SQL-i yoxlayır", "Validates SQL")],
        0,
        l("`<`, `>`, `&`, dırnaqlar HTML entity-lərinə çevrilir.", "`<`, `>`, `&` and quotes become HTML entities."),
      ),
    ],
    refs: [
      ref("OWASP SQL Injection Prevention Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"),
      ref("OWASP Password Storage Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html"),
      ref("MarkupSafe documentation", "https://markupsafe.palletsprojects.com/"),
    ],
  },
  {
    id: "lab-permissions",
    module: "labs",
    title: t4("Laboratoriya: düzgün fayl icazələrini seçmək", "Lab: choosing correct file permissions", "Laboratuvar: doğru dosya izinlerini seçmek", "Практикум: выбор правильных прав доступа"),
    intro: l(
      "Bu tapşırıqda hər fayl üçün ən az imtiyaz prinsipinə uyğun icazələri seçəcəksiniz. Əvvəlcə \"Fayl icazələri\" dərsini (B modulu) təkrarlayın.",
      "In this exercise you choose least-privilege permissions for each file. Review the \"File permissions\" lesson (module B) first.",
    ),
    concepts: [
      c("Sirlər: 600 və ya 640", "Secrets: 600 or 640", "Yalnız sahib (və lazım olsa, xidmətin qrupu) oxuyur.", "Only the owner (and, if needed, the service's group) can read."),
      c("Skriptlər: 750 və ya 755", "Scripts: 750 or 755", "İcra lazımdır, amma yazmaq yalnız sahibə.", "Execute is needed, but only the owner writes."),
      c("İctimai fayllar: 644", "Public files: 644", "Hamı oxuyur, yalnız sahib yazır.", "Everyone reads, only the owner writes."),
    ],
    examples: [
      {
        title: l("İcazələri yoxlamaq", "Checking permissions"),
        lang: "plain",
        code: "ls -l /srv/app\nstat -c \"%a %U:%G %n\" /srv/app/*      # numeric mode, owner, group, name\nfind /srv/app -perm -o+w -type f      # files writable by others",
        explain: l(
          "`stat -c \"%a ...\"` rəqəmsal rejimi göstərir. `find -perm -o+w` hamı tərəfindən yazıla bilən faylları tapır — bunlar adətən səhvdir.",
          "`stat -c \"%a ...\"` prints the numeric mode. `find -perm -o+w` finds world-writable files — usually a mistake.",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Sirr faylını hamıya oxunaqlı qoymaq", "Leaving a secrets file world-readable"),
        why: l("644 rejimində serverdəki hər istifadəçi parolu oxuya bilər.", "With mode 644 every user on the server can read the password."),
        wrong: "-rw-r--r-- 1 app app  .env    (644)",
        right: "-rw-r----- 1 app app  .env    (640)",
        lang: "plain",
      },
    ],
    exercise: {
      task: l(
        "`app` istifadəçisi və `app` qrupu üçün rejimləri seçin: (1) `.env` (DB parolu, yalnız tətbiq oxuyur); (2) `deploy.sh` (yalnız `app` icra edir); (3) `public/index.html`; (4) `~/.ssh/authorized_keys`; (5) `uploads/` qovluğu (tətbiq yazır, veb server qrupu oxuyur).",
        "Choose modes for user `app` and group `app`: (1) `.env` (DB password, only the app reads it); (2) `deploy.sh` (only `app` runs it); (3) `public/index.html`; (4) `~/.ssh/authorized_keys`; (5) the `uploads/` directory (the app writes, the web server group reads).",
      ),
      hints: [
        l("r=4, w=2, x=1. Qovluqlarda daxil olmaq üçün x lazımdır.", "r=4, w=2, x=1. Directories need x to be entered."),
      ],
      answer: l(
        "(1) `600` (və ya qrup oxuması lazımdırsa `640`); (2) `700`; (3) `644`; (4) `600`; (5) `750` — sahib rwx, qrup r-x (daxil olub oxuya bilər), digərləri heç nə.",
        "(1) `600` (or `640` if the group must read); (2) `700`; (3) `644`; (4) `600`; (5) `750` — owner rwx, group r-x (can enter and read), others nothing.",
      ),
    },
    quiz: [
      q(
        l("`authorized_keys` faylı üçün uyğun rejim hansıdır?", "Which mode suits `authorized_keys`?"),
        ["600", "666", "777"],
        0,
        l("OpenSSH-ın `StrictModes` yoxlaması çox açıq icazələri rədd edə bilər.", "OpenSSH's `StrictModes` check may reject permissions that are too open."),
      ),
      q(
        l("Hansı əmr hamı tərəfindən yazıla bilən faylları tapır?", "Which command finds world-writable files?"),
        ["find /srv -perm -o+w -type f", "ls -world", "chmod -find"],
        0,
        l("`-perm -o+w` \"digərləri\" üçün yazma bitini yoxlayır.", "`-perm -o+w` tests the write bit for others."),
      ),
      q(
        l("`750` qovluq üçün qrupa nə verir?", "What does `750` give the group on a directory?"),
        [l("Daxil olmaq və oxumaq", "Enter and read"), l("Yazmaq", "Write"), l("Heç nə", "Nothing")],
        0,
        l("5 = r-x: siyahını görmək və daxil olmaq.", "5 = r-x: list and enter."),
      ),
    ],
    refs: [
      ref("man7.org — chmod(1)", "https://man7.org/linux/man-pages/man1/chmod.1.html"),
      ref("man7.org — find(1)", "https://man7.org/linux/man-pages/man1/find.1.html"),
      ref("man7.org — stat(1)", "https://man7.org/linux/man-pages/man1/stat.1.html"),
    ],
  },
];

// ───────────────────────────── I · Roadmap ─────────────────────────────
const I: SecTopic[] = [
  {
    id: "security-roadmap",
    module: "roadmap",
    title: t4("Kibertəhlükəsizlik öyrənmə yolu", "Cybersecurity learning path", "Siber güvenlik öğrenme yolu", "Путь изучения кибербезопасности"),
    intro: l(
      "Bu yol modulları məntiqi ardıcıllıqla birləşdirir: əvvəlcə anlayışlar, sonra Linux və şəbəkə, sonra müdafiə və veb təhlükəsizliyi, ən sonda isə Kali Linux ilə tanışlıq və təhlükəsiz laboratoriya məşqləri. Hər addımda biliklərinizi test ilə yoxlayın.",
      "This path connects the modules in a logical order: concepts first, then Linux and networking, then defensive and web security, and finally an introduction to Kali Linux and safe lab exercises. Check your knowledge with the quiz at each step.",
    ),
    concepts: [
      c("1. Əsaslar (A)", "1. Fundamentals (A)", "CIA, autentifikasiya, şifrələmə, giriş nəzarəti — bütün sonrakı mövzuların dili.", "CIA, authentication, encryption, access control — the language of everything that follows."),
      c("2. Linux (B)", "2. Linux (B)", "Terminal, icazələr, xidmətlər, jurnallar — serverlərin əksəriyyəti Linux-da işləyir.", "Terminal, permissions, services, logs — most servers run Linux."),
      c("3. Şəbəkə (C)", "3. Networking (C)", "IP, DNS, TCP/UDP, TLS, firewall — məlumatın necə hərəkət etdiyini anlamaq.", "IP, DNS, TCP/UDP, TLS, firewalls — understanding how data moves."),
      c("4. Müdafiə (E)", "4. Defense (E)", "Sərtləşdirmə, monitorinq, jurnal təhlili, insidentə cavab, ehtiyat nüsxə.", "Hardening, monitoring, log analysis, incident response, backups."),
      c("5. Veb təhlükəsizliyi (F)", "5. Web security (F)", "OWASP Top 10, sessiyalar, SQL injection və XSS-in qarşısının alınması.", "OWASP Top 10, sessions, preventing SQL injection and XSS."),
      c("6. Kali Linux (D)", "6. Kali Linux (D)", "Kali nədir, alət kateqoriyaları, qanuni istifadə və təhlükəsiz laboratoriya.", "What Kali is, tool categories, legal use and a safe lab."),
      c("7. Laboratoriyalar (G)", "7. Labs (G)", "Jurnal oxumaq, kodu düzəltmək, icazələri seçmək — müdafiə məşqləri.", "Reading logs, fixing code, choosing permissions — defensive practice."),
    ],
    examples: [
      {
        title: l("Həftəlik plan nümunəsi", "A sample weekly plan"),
        lang: "plain",
        code: "Week 1-2  A Fundamentals + B Linux (terminal, permissions)\nWeek 3-4  B Linux (services, logs, Bash) + C Networking\nWeek 5-6  E Defensive security\nWeek 7-8  F Web security (OWASP Top 10, SQLi/XSS prevention)\nWeek 9    D Kali Linux introduction + safe lab setup\nWeek 10   G Labs, then review weak topics",
        explain: l(
          "Bu, təxmini plandır; öz tempinizlə irəliləyin. Növbəti addım üçün rəsmi sənədləri (OWASP, kali.org/docs, man7.org, NIST) oxumağa davam edin.",
          "This is a rough plan; go at your own pace. For the next step keep reading official docs (OWASP, kali.org/docs, man7.org, NIST).",
        ),
      },
    ],
    mistakes: [
      {
        title: l("Əsasları keçib birbaşa alətlərə tələsmək", "Skipping the basics and rushing to tools"),
        why: l("Linux və şəbəkəni başa düşmədən alətlərin nəticəsini düzgün şərh etmək mümkün deyil.", "Without understanding Linux and networking, you cannot interpret any tool's results correctly."),
      },
    ],
    exercise: {
      task: l(
        "Öz öyrənmə planınızı yazın: hər modul üçün bir məqsəd və bir tarix.",
        "Write your own learning plan: one goal and one date for each module.",
      ),
      hints: [l("Ölçülə bilən məqsəd: \"B modulunun bütün testlərindən 70%+\".", "A measurable goal: \"70%+ on every quiz in module B\".")],
      answer: l(
        "Nümunə: A — 1 həftə, bütün testlər 70%+; B — 2 həftə, `chmod` rejimlərini əzbər bilmək; C — 1 həftə, öz serverimdə `ss -tuln` nəticəsini izah etmək; E — 2 həftə, nümunə jurnalı təhlil etmək; F — 2 həftə, SQLi/XSS düzəlişlərini yazmaq; D və G — 2 həftə, təhlükəsiz lokal laboratoriya qurmaq.",
        "Example: A — 1 week, all quizzes 70%+; B — 2 weeks, know `chmod` modes by heart; C — 1 week, explain `ss -tuln` output on my own server; E — 2 weeks, analyse the sample log; F — 2 weeks, write SQLi/XSS fixes; D and G — 2 weeks, set up a safe local lab.",
      ),
    },
    quiz: [
      q(
        l("Bu yolda Kali Linux niyə sonlara yaxın gəlir?", "Why does Kali Linux come near the end of this path?"),
        [l("Linux, şəbəkə və müdafiə əsasları əvvəlcə lazımdır", "Linux, networking and defence basics come first"), l("Kali çətin quraşdırılır", "Kali is hard to install"), l("Təsadüfən", "By chance")],
        0,
        l("Alətləri anlamaq üçün əsaslar lazımdır.", "You need the basics to understand the tools."),
      ),
      q(
        l("Bir mövzunu tamamlamaq üçün testdə minimum nə qədər nəticə lazımdır?", "What minimum quiz score completes a topic?"),
        ["50%", "70%", "100%"],
        1,
        l("Tətbiqdə keçid balı 70%-dir.", "The app's passing score is 70%."),
      ),
    ],
    refs: [
      ref("NIST NICE Framework", "https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center"),
      ref("OWASP Top 10", "https://owasp.org/Top10/"),
      ref("Kali Linux Documentation", "https://www.kali.org/docs/"),
    ],
  },
];

export const SECURITY_TOPICS: SecTopic[] = [...A, ...B, ...C, ...D, ...E, ...F, ...G, ...I];

/** Topics shown with the "authorised and legal use only" notice. */
export const LEGAL_NOTICE_MODULES: readonly SecModuleId[] = ["kali", "web", "labs"];

export function topicsOf(module: SecModuleId): SecTopic[] {
  return SECURITY_TOPICS.filter((t) => t.module === module);
}

export function findSecurityTopic(id: string): SecTopic | undefined {
  return SECURITY_TOPICS.find((t) => t.id === id);
}

/** Progress id used with useProgress().recordQuiz. */
export const securityProgressId = (topicId: string) => `security:${topicId}`;
