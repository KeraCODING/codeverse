// Pure layout for the commit graph: one horizontal lane per branch-at-creation, one column per commit.
import type { Commit, RepoData } from "./engine";

export type LabelKind = "head" | "branch" | "remote" | "tag";
export interface GraphLabel {
  text: string;
  kind: LabelKind;
  width: number;
}
export interface GraphNode {
  id: string;
  commit: Commit;
  x: number;
  y: number;
  lane: string;
  reachable: boolean;
  isHead: boolean;
  labels: GraphLabel[];
}
export interface GraphEdge {
  key: string;
  d: string;
  faded: boolean;
}
export interface GraphLayout {
  nodes: GraphNode[];
  edges: GraphEdge[];
  lanes: { name: string; y: number }[];
  width: number;
  height: number;
}

export interface GraphRefs {
  /** label kind + text per commit id */
  labels: Record<string, { text: string; kind: LabelKind }[]>;
  headId: string | null;
  reachable: Set<string>;
}

export const NODE_R = 12;
const LANE_X = 96;
const LABEL_H = 18;

const labelWidth = (text: string) => Math.round(text.length * 6.6 + 12);

export function layoutGraph(repo: RepoData, refs: GraphRefs): GraphLayout {
  const laneNames: string[] = [];
  for (const id of repo.order) {
    const b = repo.commits[id].branch;
    if (!laneNames.includes(b)) laneNames.push(b);
  }
  laneNames.sort((a, b) => (a === "main" ? -1 : b === "main" ? 1 : 0));

  const maxLabels: Record<string, number> = {};
  let widest = 0;
  for (const id of repo.order) {
    const ls = refs.labels[id] ?? [];
    const lane = repo.commits[id].branch;
    maxLabels[lane] = Math.max(maxLabels[lane] ?? 0, ls.length);
    for (const l of ls) widest = Math.max(widest, labelWidth(l.text));
  }
  const colW = Math.min(150, Math.max(64, widest + 10));

  const laneY: Record<string, number> = {};
  let y = 30;
  for (const name of laneNames) {
    laneY[name] = y;
    y += 2 * NODE_R + 22 + (maxLabels[name] ?? 0) * (LABEL_H + 3);
  }

  const pos: Record<string, { x: number; y: number }> = {};
  const nodes: GraphNode[] = repo.order.map((id, i) => {
    const commit = repo.commits[id];
    const p = { x: LANE_X + colW / 2 + i * colW, y: laneY[commit.branch] };
    pos[id] = p;
    return {
      id,
      commit,
      ...p,
      lane: commit.branch,
      reachable: refs.reachable.has(id),
      isHead: refs.headId === id,
      labels: (refs.labels[id] ?? []).map((l) => ({ ...l, width: labelWidth(l.text) })),
    };
  });

  const edges: GraphEdge[] = [];
  for (const n of nodes) {
    for (const p of n.commit.parents) {
      const a = pos[p];
      if (!a) continue;
      const b = { x: n.x, y: n.y };
      const xm = (a.x + b.x) / 2;
      const d = a.y === b.y ? `M${a.x} ${a.y}L${b.x} ${b.y}` : `M${a.x} ${a.y}C${xm} ${a.y} ${xm} ${b.y} ${b.x} ${b.y}`;
      edges.push({ key: `${p}-${n.id}`, d, faded: !n.reachable });
    }
  }

  return {
    nodes,
    edges,
    lanes: laneNames.map((name) => ({ name, y: laneY[name] })),
    width: LANE_X + Math.max(1, repo.order.length) * colW + 16,
    height: Math.max(80, y - 8),
  };
}
