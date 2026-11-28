import { useEffect, useState } from "react";
import { MODULES } from "../../app/modules";
import { useI18n } from "../../core/i18n/i18n";
import { useSettings } from "../../core/settings/SettingsContext";
import type { ActivityEvent } from "../../core/storage";
import { useProgress } from "../../core/progress/ProgressContext";
import { findLessonMeta, LESSON_INDEX } from "../../content";
import { useContent } from "../../content/useContent";
import { useStudyDays } from "../../core/study/useStudy";
import { Icon, type IconName } from "../../ui/Icon";
import { openPalette } from "../../app/paletteBus";
import { dayKey, goalStreak, lastDays } from "../../core/study/studyTime";

const QUICK: { href: string; icon: IconName; title: string; sub: string }[] = [
  { href: "#/codelab?lang=python", icon: "terminal", title: "hero.q.python", sub: "hero.q.pythonSub" },
  { href: "#/codelab?lang=web", icon: "globe", title: "hero.q.web", sub: "hero.q.webSub" },
  { href: "#/interactive", icon: "play", title: "module.interactive.title", sub: "hero.q.challengesSub" },
  { href: "#/flashcards", icon: "cards", title: "module.flashcards.title", sub: "hero.q.cardsSub" },
  { href: "#/visual", icon: "eye", title: "module.visual.title", sub: "hero.q.visualSub" },
  { href: "#/gitviz", icon: "graph", title: "module.gitviz.title", sub: "hero.q.gitSub" },
];

function greetingKey(h: number) {
  return h < 5 ? "hero.night" : h < 12 ? "hero.morning" : h < 18 ? "hero.afternoon" : "hero.evening";
}

/** Welcome panel: greeting, "continue" call to action and the four numbers that matter. */
function Hero({ completed, resumeHref, resumeTitle }: { completed: number; resumeHref: string; resumeTitle: string | null }) {
  const { t } = useI18n();
  const { settings } = useSettings();
  const { records } = useProgress();
  const days = useStudyDays();
  const now = Date.now();
  const todayMin = Math.floor((days?.get(dayKey(now)) ?? 0) / 60);
  const streak = days ? goalStreak(days, settings.dailyGoalMinutes * 60, now) : 0;
  const solved = [...records.values()].filter((r) => r.lessonId.startsWith("practice:") && r.state === "completed").length;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div>
        <h2 id="hero-title" className="hero-title">{t(greetingKey(new Date().getHours()))}</h2>
        <p className="muted">{t("app.philosophy")}</p>
        <div className="hero-actions">
          <a className="btn primary" href={resumeHref}>
            <Icon name="arrow" /> {resumeTitle ? t("hero.continue", { lesson: resumeTitle }) : t("hero.start")}
          </a>
          <button type="button" className="btn" onClick={openPalette}>
            <Icon name="search" /> {t("palette.open")} <kbd>Ctrl K</kbd>
          </button>
        </div>
      </div>
      <div className="hero-stats">
        <div className="hero-stat"><b>{completed}/{LESSON_INDEX.length}</b><span>{t("hero.stat.lessons")}</span></div>
        <div className="hero-stat"><b>{solved}</b><span>{t("hero.stat.solved")}</span></div>
        <div className="hero-stat"><b>{days ? todayMin : "—"}</b><span>{t("hero.stat.today")}</span></div>
        <div className="hero-stat"><b>{days ? streak : "—"}</b><span>{t("hero.stat.streak")}</span></div>
      </div>
    </section>
  );
}

function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export default function Dashboard() {
  const { t, formatDateTime } = useI18n();
  const { settings, storage, activityRev } = useSettings();
  const [recent, setRecent] = useState<ActivityEvent[] | null>(null);
  const [today, setToday] = useState<Record<string, number>>({});

  useEffect(() => {
    let live = true;
    Promise.all([storage.recentActivity(8), storage.countActivitySince(startOfToday())]).then(([r, c]) => {
      if (!live) return;
      setRecent(r);
      setToday(c);
    });
    return () => {
      live = false;
    };
  }, [storage, activityRev]);

  const { records } = useProgress();
  const { tx } = useContent();
  const completed = LESSON_INDEX.filter((l) => records.get(l.id)?.state === "completed").length;
  const weak = [...records.values()].filter((r) => r.state === "attempted" && !r.lessonId.startsWith("practice:")).length;
  const lastOpen = [...records.values()].filter((r) => r.state !== "completed" && !r.lessonId.startsWith("practice:")).sort((a, b) => b.updatedAt - a.updatedAt)[0];
  // Resume the most recent unfinished lesson; otherwise suggest the next unopened one.
  const resume = lastOpen
    ? findLessonMeta(lastOpen.lessonId)
    : completed > 0
      ? LESSON_INDEX.find((l) => !records.has(l.id))
      : undefined;

  const ready = MODULES.filter((m) => m.status === "done" && !["dashboard", "settings", "diagnostics"].includes(m.id));
  const builtCount = MODULES.filter((m) => m.status === "done").length;

  return (
    <section className="page" aria-labelledby="page-title">
      <Hero completed={completed} resumeHref={resume ? `#/languages/${resume.language}/${resume.id}` : "#/languages"} resumeTitle={resume ? tx(resume.title) : null} />
      <h1 id="page-title" className="sr-only">{t("dashboard.title")}</h1>

      <nav className="quick stagger" aria-label={t("hero.quick")}>
        {QUICK.map((q) => (
          <a key={q.href} href={q.href}>
            <span className="quick-icon"><Icon name={q.icon} /></span>
            <span>
              <b>{t(q.title)}</b>
              <small>{t(q.sub)}</small>
            </span>
          </a>
        ))}
      </nav>

      <div className="grid stagger">
        <GoalCard goalMinutes={settings.dailyGoalMinutes} />

        <article className="card">
          <h2>{t("dashboard.today.title")}</h2>
          <dl className="kv">
            <dt>{t("dashboard.today.sessions")}</dt>
            <dd>{today.appOpened ?? 0}</dd>
            <dt>{t("dashboard.today.modules")}</dt>
            <dd>{today.moduleOpened ?? 0}</dd>
          </dl>
          {!settings.recordActivity && <p className="muted small">{t("dashboard.activityOff")}</p>}
        </article>

        <article className="card">
          <h2>{t("dashboard.learning.title")}</h2>
          <p className="stat">{t("dashboard.learning.completed", { done: completed, total: LESSON_INDEX.length })}</p>
          {resume ? (
            <a className="link" href={`#/languages/${resume.language}/${resume.id}`}>
              {t("dashboard.learning.continue")}: {tx(resume.title)} →
            </a>
          ) : (
            <a className="link" href="#/languages">{t("dashboard.learning.start")} →</a>
          )}
          {weak > 0 && <p className="small">{t("dashboard.learning.weak", { n: weak })}</p>}
        </article>

        <article className="card">
          <h2>{t("dashboard.level.title")}</h2>
          <p className="stat">{t(`learning.level.${settings.skillLevel}`)}</p>
          <p className="muted small">{t("dashboard.level.note")}</p>
        </article>
      </div>

      <div className="grid two">
        <article className="card">
          <h2>{t("dashboard.recent.title")}</h2>
          {recent === null ? (
            <p className="muted">{t("common.loading")}</p>
          ) : recent.length === 0 ? (
            <p className="muted">{t("dashboard.recent.empty")}</p>
          ) : (
            <ul className="list">
              {recent.map((e) => (
                <li key={e.id}>
                  <span>
                    {t(`activity.${e.kind}`, {
                      module: e.kind === "moduleOpened" && e.ref ? t(`module.${e.ref}.title`) : "",
                      lesson: e.kind === "lessonCompleted" && e.ref ? tx(findLessonMeta(e.ref)?.title) || e.ref : "",
                    })}
                  </span>
                  <time className="muted small" dateTime={new Date(e.createdAt).toISOString()}>
                    {formatDateTime(e.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="card">
          <h2>{t("dashboard.build.title")}</h2>
          <p className="muted small">{t("dashboard.build.summary", { done: builtCount, total: MODULES.length })}</p>
          <ul className="chips">
            {ready.map((m) => (
              <li key={m.id}>
                <a href={`#/${m.id}`}>{t(`module.${m.id}.title`)}</a>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

/** Daily goal with real study time: today's minutes, progress bar, streak and the last 7 days. */
function GoalCard({ goalMinutes }: { goalMinutes: number }) {
  const { t } = useI18n();
  const days = useStudyDays();
  const now = Date.now();
  const goalSec = goalMinutes * 60;
  const todaySec = days?.get(dayKey(now)) ?? 0;
  const todayMin = Math.floor(todaySec / 60);
  const pct = Math.min(100, Math.round((todaySec / goalSec) * 100));
  const week = days ? lastDays(days, 7, now) : [];
  const streak = days ? goalStreak(days, goalSec, now) : 0;
  // Own short names: browsers (incl. WebView2) lack Azerbaijani short weekdays and fall back to English.
  const weekdays = t("dashboard.goal.weekdays").split(",");
  const peak = Math.max(goalSec, ...week.map((d) => d.seconds));

  return (
    <article className="card">
      <h2>{t("dashboard.goal.title")}</h2>
      {days ? (
        <>
          <p className="stat">{t("dashboard.goal.today", { n: todayMin, goal: goalMinutes })}</p>
          <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={t("dashboard.goal.title")}>
            <span style={{ width: `${pct}%` }} />
          </div>
          <p className="small">
            {todaySec >= goalSec ? `✓ ${t("dashboard.goal.reached")}` : t("dashboard.goal.left", { n: Math.max(1, goalMinutes - todayMin) })}
            {streak > 0 && ` · ${t("dashboard.goal.streak", { n: streak })}`}
          </p>
          <div className="study-week" aria-label={t("dashboard.goal.week")}>
            {week.map((d) => {
              const label = weekdays[(new Date(`${d.key}T12:00:00`).getDay() + 6) % 7] ?? "";
              const mins = Math.floor(d.seconds / 60);
              return (
                <div key={d.key} className="study-day" title={`${label}: ${t("dashboard.goal.minutes", { n: mins })}`}>
                  <span className={`study-col${d.seconds >= goalSec ? " met" : ""}`} style={{ height: `${Math.max(4, Math.round((d.seconds / peak) * 100))}%` }} />
                  <span className="small">{label}</span>
                </div>
              );
            })}
          </div>
          <p className="muted small">{t("dashboard.goal.note")}</p>
        </>
      ) : (
        <>
          <p className="stat">{t("dashboard.goal.minutes", { n: goalMinutes })}</p>
          <p className="muted small">{t("dashboard.goal.off")}</p>
        </>
      )}
      <a className="link" href="#/settings">
        {t("dashboard.goal.change")}
      </a>
    </article>
  );
}

