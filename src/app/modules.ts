import type { ComponentType } from "react";
import type { IconName } from "../ui/Icon";

export type ModuleStatus = "done" | "inProgress" | "notStarted";

export interface ModuleDef {
  id: string;
  icon: IconName;
  group: "overview" | "learn" | "tools" | "workspace" | "system";
  phase: number;
  status: ModuleStatus;
  /** Present only for implemented modules. Each is a separate lazy chunk. */
  load?: () => Promise<{ default: ComponentType }>;
  hidden?: boolean; // reachable by route, not listed in the sidebar
}

// Single source of truth for navigation and the status overview.
// Adding a module = one entry here + a folder under src/modules.
export const MODULES: ModuleDef[] = [
  { id: "dashboard", icon: "home", group: "overview", phase: 1, status: "done", load: () => import("../modules/dashboard/Dashboard") },
  { id: "progress", icon: "chart", group: "overview", phase: 2, status: "done", load: () => import("../modules/progress/ProgressPage") },
  { id: "roadmap", icon: "route", group: "overview", phase: 5, status: "done", load: () => import("../modules/roadmap/RoadmapPage") },

  { id: "languages", icon: "code", group: "learn", phase: 2, status: "done", load: () => import("../modules/languages/LanguagesPage") },
  { id: "fields", icon: "layers", group: "learn", phase: 2, status: "done", load: () => import("../modules/fields/FieldsPage") },
  { id: "frameworks", icon: "box", group: "learn", phase: 2, status: "done", load: () => import("../modules/frameworks/FrameworksPage") },
  { id: "interactive", icon: "play", group: "learn", phase: 4, status: "done", load: () => import("../modules/interactive/InteractivePage") },
  { id: "visual", icon: "eye", group: "learn", phase: 4, status: "done", load: () => import("../modules/visual/VisualPage") },
  { id: "flashcards", icon: "cards", group: "learn", phase: 5, status: "done", load: () => import("../modules/flashcards/FlashcardsPage") },
  { id: "cheatsheets", icon: "doc", group: "learn", phase: 5, status: "done", load: () => import("../modules/cheatsheets/CheatSheetsPage") },
  { id: "security", icon: "shield", group: "learn", phase: 8, status: "done", load: () => import("../modules/security/SecurityPage") },

  { id: "explain", icon: "spark", group: "tools", phase: 3, status: "done", load: () => import("../modules/explain/ExplainPage") },
  { id: "search", icon: "search", group: "tools", phase: 3, status: "done", load: () => import("../modules/search/SearchPage") },
  { id: "errors", icon: "alert", group: "tools", phase: 3, status: "done", load: () => import("../modules/errors/ErrorsPage") },
  { id: "compare", icon: "columns", group: "tools", phase: 3, status: "done", load: () => import("../modules/compare/ComparePage") },
  { id: "codelab", icon: "terminal", group: "tools", phase: 4, status: "done", load: () => import("../modules/codelab/CodeLabPage") },
  { id: "git", icon: "branch", group: "tools", phase: 6, status: "done", load: () => import("../modules/git/GitPage") },
  { id: "gitviz", icon: "graph", group: "tools", phase: 6, status: "done", load: () => import("../modules/gitviz/GitVizPage") },

  { id: "projects", icon: "folder", group: "workspace", phase: 6, status: "done", load: () => import("../modules/projects/ProjectsPage") },
  { id: "workspace", icon: "users", group: "workspace", phase: 7, status: "notStarted" },
  { id: "notes", icon: "note", group: "workspace", phase: 5, status: "done", load: () => import("../modules/notes/NotesPage") },
  { id: "library", icon: "bookmark", group: "workspace", phase: 5, status: "done", load: () => import("../modules/library/LibraryPage") },

  { id: "settings", icon: "gear", group: "system", phase: 1, status: "done", load: () => import("../modules/settings/SettingsPage") },
  { id: "diagnostics", icon: "gauge", group: "system", phase: 1, status: "done", load: () => import("../modules/diagnostics/DiagnosticsPage") },
];

export const GROUPS = ["overview", "learn", "tools", "workspace", "system"] as const;

export const findModule = (id: string) => MODULES.find((m) => m.id === id);
