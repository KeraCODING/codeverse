import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ancestors, headId, initialState, resolveRef, run, runAll, tokenize, type GitState } from "./engine";
import { layoutGraph } from "./graph";
import { FREE_SETUP, SCENARIOS, startState } from "./scenarios";

const DIR = join(process.cwd(), "src/modules/gitviz");

function deepFreeze<T>(o: T): T {
  if (o && typeof o === "object" && !Object.isFrozen(o)) {
    Object.freeze(o);
    for (const v of Object.values(o)) deepFreeze(v);
  }
  return o;
}

/** Runs commands and asserts every one succeeded. */
function ok(cmds: string[], from: GitState = initialState()): GitState {
  let s = from;
  for (const c of cmds) {
    const r = run(s, c);
    expect(r.ok, `${c}: ${r.output.join(" | ")}`).toBe(true);
    expect(r.explain.az && r.explain.en, `explain for ${c}`).toBeTruthy();
    s = r.state;
  }
  return s;
}

const base = () => ok(["git init", 'git commit -m "Initial"']);

describe("tokenizer and refs", () => {
  it("splits quoted arguments", () => {
    expect(tokenize(`git commit -m "hello world"`)).toEqual(["git", "commit", "-m", "hello world"]);
    expect(tokenize(`git commit -m 'a b'`)).toEqual(["git", "commit", "-m", "a b"]);
    expect(tokenize(`git commit -m "open`)).toBeNull();
  });
  it("resolves HEAD~n, ^2, branches and lowercase ids", () => {
    const s = ok(['git commit -m "B"', 'git commit -m "C"'], base());
    expect(resolveRef(s, "HEAD")).toBe("C2");
    expect(resolveRef(s, "HEAD~2")).toBe("C0");
    expect(resolveRef(s, "main^")).toBe("C1");
    expect(resolveRef(s, "c1")).toBe("C1");
    expect(resolveRef(s, "HEAD~5")).toBeNull();
  });
});

describe("engine", () => {
  it("is immutable: input states are never mutated", () => {
    const s = deepFreeze(base());
    expect(() => run(s, 'git commit -m "x"')).not.toThrow();
    expect(() => run(s, "git switch -c f")).not.toThrow();
    expect(s.order).toEqual(["C0"]);
  });

  it("commits with deterministic ids and parents", () => {
    const s = ok(["git init", 'git commit -m "A"', 'git commit -m "B"']);
    expect(s.order).toEqual(["C0", "C1"]);
    expect(s.commits.C0.parents).toEqual([]);
    expect(s.commits.C1.parents).toEqual(["C0"]);
    expect(s.branches.main).toBe("C1");
  });

  it("requires a repository and a message", () => {
    expect(run(initialState(), "git status").ok).toBe(false);
    expect(run(initialState(), "git commit -m x").output[0]).toMatch(/not a git repository/);
    const s = ok(["git init"]);
    expect(run(s, "git commit").ok).toBe(false);
    expect(run(s, 'git commit -m ""').ok).toBe(false);
    expect(run(s, "git log").output[0]).toMatch(/does not have any commits yet/);
    expect(run(s, "git branch x").output[0]).toMatch(/not a valid object name/);
  });

  it("stages real changes and refuses unstaged-only commits", () => {
    let s = ok(["edit a.txt"], base());
    const r = run(s, 'git commit -m "x"');
    expect(r.ok).toBe(false);
    expect(r.output.join("\n")).toMatch(/no changes added to commit/);
    s = ok(["git add a.txt", 'git commit -m "x"'], s);
    expect(s.commits[s.branches.main].files).toEqual(["a.txt"]);
    s = ok(["edit b.txt", 'git commit -am "y"'], s);
    expect(s.commits[s.branches.main].files).toEqual(["b.txt"]);
    expect(run(s, "git add missing.txt").ok).toBe(false);
  });

  it("creates branches and switches", () => {
    let s = ok(["git branch feature"], base());
    expect(s.branches.feature).toBe("C0");
    expect(s.head).toEqual({ kind: "branch", name: "main" });
    s = ok(["git switch feature", 'git commit -m "F"'], s);
    expect(s.branches.feature).toBe("C1");
    expect(s.branches.main).toBe("C0");
    s = ok(["git checkout -b other", "git switch -c third"], s);
    expect(s.head).toEqual({ kind: "branch", name: "third" });
  });

  it("explains errors for invalid branch operations", () => {
    const s = base();
    const missing = run(s, "git switch nope");
    expect(missing.ok).toBe(false);
    expect(missing.output[0]).toBe("fatal: invalid reference: nope");
    expect(missing.explain.en).toMatch(/git switch -c nope/);
    expect(run(s, "git checkout nope").output[0]).toMatch(/pathspec 'nope' did not match/);
    expect(run(s, "git switch C0").output[0]).toMatch(/a branch is expected, got commit/);
    expect(run(s, "git branch main").output[0]).toMatch(/already exists/);
    expect(run(s, "git branch bad..name").ok).toBe(false);
    expect(run(s, "git branch -d main").ok).toBe(false);
    expect(run(s, "git frobnicate").output[0]).toMatch(/is not a git command/);
    expect(run(s, "ls").output[0]).toMatch(/command not found/);
    expect(run(s, "git stash").output[0]).toMatch(/not simulated/);
    expect(run(s, "git merge nope").output[0]).toMatch(/not something we can merge/);
  });

  it("deletes merged branches with -d and refuses unmerged ones", () => {
    let s = ok(["git switch -c f", 'git commit -m "F"', "git switch main"], base());
    expect(run(s, "git branch -d f").output[0]).toMatch(/not fully merged/);
    s = ok(["git branch -D f"], s);
    expect(s.branches.f).toBeUndefined();
  });

  it("detached HEAD via checkout of a commit", () => {
    const s = ok(['git commit -m "B"', "git checkout C0"], base());
    expect(s.head).toEqual({ kind: "detached", id: "C0" });
    const t = ok(['git commit -m "exp"'], s);
    expect(t.head).toEqual({ kind: "detached", id: "C2" });
    expect(t.branches.main).toBe("C1");
  });

  it("merge fast-forwards when possible", () => {
    const s = ok(["git switch -c f", 'git commit -m "F1"', 'git commit -m "F2"', "git switch main", "git merge f"], base());
    expect(s.branches.main).toBe(s.branches.f);
    expect(s.order.length).toBe(3);
    expect(run(s, "git merge f").output[0]).toBe("Already up to date.");
  });

  it("merge --no-ff and divergent merges create a commit with two parents", () => {
    const s = ok(["git switch -c f", 'git commit -m "F"', "git switch main", 'git commit -m "M"', "git merge f"], base());
    const m = s.commits[s.branches.main];
    expect(m.parents).toEqual(["C2", "C1"]);
    expect(m.message).toBe("Merge branch 'f'");
    const nf = ok(["git switch -c g", 'git commit -m "G"', "git switch main", "git merge --no-ff g"], base());
    expect(nf.commits[nf.branches.main].parents.length).toBe(2);
    const ffo = ok(["git switch -c f", 'git commit -m "F"', "git switch main", 'git commit -m "M"'], base());
    expect(run(ffo, "git merge --ff-only f").ok).toBe(false);
  });

  it("simulates a deterministic conflict and its resolution", () => {
    const s = SCENARIOS.find((x) => x.id === "conflict")!;
    let st = startState(s.setup);
    const r = run(st, "git merge feature");
    expect(r.ok).toBe(false);
    expect(r.output.join("\n")).toMatch(/CONFLICT \(content\): Merge conflict in README.md/);
    st = r.state;
    expect(st.merge?.conflicts).toEqual(["README.md"]);
    expect(run(st, "git commit").output[0]).toMatch(/unmerged files/);
    expect(run(st, "git switch feature").ok).toBe(false);
    const aborted = ok(["git merge --abort"], st);
    expect(aborted.merge).toBeNull();
    st = ok(["git add README.md", "git commit"], st);
    expect(st.commits[st.branches.main].parents.length).toBe(2);
  });

  it("rebase replays commits with new ids", () => {
    let s = ok(["git switch -c f", 'git commit -m "F1"', 'git commit -m "F2"', "git switch main", 'git commit -m "M"', "git switch f"], base());
    const before = [s.branches.f, s.commits[s.branches.f].parents[0]];
    s = ok(["git rebase main"], s);
    const tipId = s.branches.f;
    expect(before).not.toContain(tipId);
    expect(s.commits[tipId].copyOf).toBe(before[0]);
    expect(s.commits[tipId].message).toBe("F2");
    expect(ancestors(s, tipId).has(s.branches.main)).toBe(true);
    expect([...ancestors(s, tipId)].every((c) => s.commits[c].parents.length <= 1)).toBe(true);
    expect(run(s, "git rebase main").output[0]).toMatch(/is up to date/);
    expect(run(ok(["edit x"], s), "git rebase main").ok).toBe(false);
  });

  it("reset --hard / --soft / --mixed", () => {
    const s = ok(['git commit -m "B"', 'git commit -m "C"'], base());
    const hard = ok(["git reset --hard HEAD~1"], s);
    expect(hard.branches.main).toBe("C1");
    expect(hard.modified).toEqual([]);
    const soft = ok(["git reset --soft HEAD~2"], s);
    expect(soft.branches.main).toBe("C0");
    expect(soft.staged.length).toBe(2);
    const mixed = ok(["git reset C0"], s);
    expect(mixed.modified.length).toBe(2);
    expect(run(s, "git reset --hard nope").ok).toBe(false);
  });

  it("tags and log decorations", () => {
    const s = ok(["git tag v1", 'git commit -m "B"'], base());
    expect(s.tags.v1).toBe("C0");
    expect(run(s, "git tag v1").ok).toBe(false);
    const log = run(s, "git log --oneline").output;
    expect(log[0]).toBe("C1 (HEAD -> main) B");
    expect(log[1]).toBe("C0 (tag: v1) Initial");
  });

  it("push / pull / fetch against the simulated origin, including divergence", () => {
    let s = startState(['sim teammate "Init"', "git clone https://example.com/x.git"]);
    expect(s.branches.main).toBe("C0");
    expect(s.tracking.main).toBe("C0");
    expect(s.upstream.main).toBe("main");
    s = ok(['sim teammate "Remote"', 'git commit -m "Local"'], s);
    const rejected = run(s, "git push");
    expect(rejected.ok).toBe(false);
    expect(rejected.output.join("\n")).toMatch(/\[rejected\].*fetch first/);
    s = ok(["git fetch"], s);
    expect(s.tracking.main).toBe("C1");
    expect(s.branches.main).toBe("C2");
    expect(run(s, "git status").output.join("\n")).toMatch(/have diverged/);
    expect(run(s, "git push").output.join("\n")).toMatch(/non-fast-forward/);
    expect(run(s, "git pull").output.join("\n")).toMatch(/Need to specify how to reconcile divergent branches/);
    const merged = ok(["git pull --no-rebase", "git push"], s);
    expect(merged.commits[merged.branches.main].parents.length).toBe(2);
    expect(merged.server.branches.main).toBe(merged.branches.main);
    const rebased = ok(["git pull --rebase", "git push"], s);
    expect(rebased.commits[rebased.branches.main].parents).toEqual(["C1"]);
    expect(rebased.server.branches.main).toBe(rebased.branches.main);
    expect(run(rebased, "git push").output[0]).toBe("Everything up-to-date");
  });

  it("push needs a remote and an upstream; -u sets it", () => {
    const s = base();
    expect(run(s, "git push").output[0]).toMatch(/No configured push destination/);
    expect(run(s, "git push upstream main").ok).toBe(false);
    const r = ok(["git remote add origin https://example.com/a.git"], s);
    expect(run(r, "git push").output[0]).toMatch(/has no upstream branch/);
    const p = ok(["git push -u origin main"], r);
    expect(p.server.branches.main).toBe("C0");
    expect(p.upstream.main).toBe("main");
    expect(p.tracking.main).toBe("C0");
    expect(run(p, "git fetch").output).toEqual([]);
  });

  it("switch to a remote-only branch creates a tracking branch", () => {
    let s = startState(['sim teammate "Init"', 'sim teammate "Other" --branch topic', "git clone https://example.com/x.git"]);
    s = ok(["git switch topic"], s);
    expect(s.branches.topic).toBe(s.tracking.topic);
    expect(s.upstream.topic).toBe("topic");
  });

  it("help and clear", () => {
    expect(run(initialState(), "help").output.length).toBeGreaterThan(5);
    expect(run(initialState(), "clear").clear).toBe(true);
  });
});

describe("scenarios", () => {
  it("has at least 6 scenarios with unique ids and az+en texts", () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(6);
    expect(new Set(SCENARIOS.map((s) => s.id)).size).toBe(SCENARIOS.length);
    for (const s of SCENARIOS) {
      for (const l of [s.title, s.goal, s.done, ...s.steps.map((x) => x.text), ...(s.concept ? [s.concept] : [])]) {
        expect(l.az, s.id).toBeTruthy();
        expect(l.en, s.id).toBeTruthy();
        expect(`${l.az} ${l.en}`).not.toMatch(/phase|mərhələ/i);
      }
    }
  });

  for (const sc of SCENARIOS) {
    it(`"${sc.id}" setup runs cleanly, starts unsolved and is solvable by its script`, () => {
      const { state: start, results } = runAll(initialState(), sc.setup);
      for (const r of results) expect(r.ok, r.output.join(" | ")).toBe(true);
      expect(sc.check(start)).toBe(false);
      const { state } = runAll(start, sc.solution);
      expect(sc.check(state)).toBe(true);
      // Every step command shown to the learner is part of the tested solution.
      for (const st of sc.steps) if (st.cmd) expect(sc.solution).toContain(st.cmd);
    });
  }

  it("free play setup produces a cloned repository", () => {
    const s = startState(FREE_SETUP);
    expect(s.initialized).toBe(true);
    expect(headId(s)).toBe("C0");
    expect(s.remoteUrl).toBeTruthy();
  });
});

describe("graph layout", () => {
  it("places one node per commit, edges per parent, lanes per branch", () => {
    const s = ok(["git switch -c f", 'git commit -m "F"', "git switch main", 'git commit -m "M"', "git merge f"], base());
    const g = layoutGraph(s, { labels: { [s.branches.main]: [{ text: "HEAD → main", kind: "head" }] }, headId: headId(s), reachable: new Set(s.order) });
    expect(g.nodes.length).toBe(4);
    expect(g.edges.length).toBe(4);
    expect(g.lanes.map((l) => l.name)).toEqual(["main", "f"]);
    const f = g.nodes.find((n) => n.id === "C1")!;
    const m = g.nodes.find((n) => n.id === "C2")!;
    expect(f.y).not.toBe(m.y);
  });
});

describe("i18n fragment", () => {
  const fragment = JSON.parse(readFileSync(join(process.cwd(), "i18n-fragments/gitviz.json"), "utf8")) as Record<string, string[]>;
  const ph = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

  it("every key has 4 non-empty strings with matching placeholders", () => {
    for (const [k, v] of Object.entries(fragment)) {
      expect(k.startsWith("gitviz."), k).toBe(true);
      expect(Array.isArray(v) && v.length === 4, k).toBe(true);
      for (const s of v) expect(s.trim(), k).not.toBe("");
      for (const s of v) expect(ph(s), k).toEqual(ph(v[1]));
      expect(v.join(" "), k).not.toMatch(/phase|mərhələ/i);
    }
  });

  it("every gitviz.* key used in .tsx exists", () => {
    const used = new Set<string>();
    for (const f of readdirSync(DIR).filter((x) => x.endsWith(".tsx"))) {
      const src = readFileSync(join(DIR, f), "utf8");
      for (const m of src.matchAll(/\bt\(\s*["'`](gitviz\.[\w.]+)["'`]/g)) used.add(m[1]);
    }
    expect(used.size).toBeGreaterThan(10);
    for (const k of used) expect(fragment[k], k).toBeDefined();
  });
});
