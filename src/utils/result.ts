import type { Entry } from "@/types";

export type Outcome = "win" | "draw" | "loss";

export function getOutcome(e: Entry): Outcome | undefined {
  const r = e.result;
  if (!r) return undefined;
  const hs = typeof r.favoriteScore === "number" ? r.favoriteScore : undefined;
  const as = typeof r.opponentScore === "number" ? r.opponentScore : undefined;
  if (hs !== undefined && as !== undefined) {
    if (hs > as) return "win";
    if (hs < as) return "loss";
    return "draw";
  }
  if (r.winnerTeamId) {
    if (r.winnerTeamId === e.favoriteTeamId) return "win";
    if (r.winnerTeamId === e.opponentTeamId) return "loss";
  }
  return undefined;
}

export type CheerBias = "승요" | "패요" | "균형";

export function getCheerBias(
  win: number,
  draw: number,
  loss: number
): CheerBias | undefined {
  const total = win + draw + loss;
  if (total <= 0) return undefined;
  const winRate = win / total;
  if (winRate > 0.5) return "승요";
  if (winRate < 0.5) return "패요";
  return "균형";
}

export function getOutcomeLabel(
  outcome: Outcome | undefined
): string | undefined {
  if (outcome === "win") return "승";
  if (outcome === "loss") return "패";
  if (outcome === "draw") return "무";
  return undefined;
}
