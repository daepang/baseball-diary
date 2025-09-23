"use client";
import { useEffect, useState } from "react";
import { db, seedIfEmpty } from "@/lib/db";

export function useHome() {
  const [count, setCount] = useState<number>(0);
  const [wl, setWl] = useState<{
    win: number;
    draw: number;
    loss: number;
    rate: number;
  }>({ win: 0, draw: 0, loss: 0, rate: 0 });

  useEffect(() => {
    seedIfEmpty();
    db.entries.count().then(setCount);
    db.entries.toArray().then((arr) => {
      let win = 0,
        loss = 0,
        draw = 0;
      for (const e of arr) {
        const r = e.result;
        if (!r) continue;
        const hs =
          typeof r.favoriteScore === "number" ? r.favoriteScore : undefined;
        const as =
          typeof r.opponentScore === "number" ? r.opponentScore : undefined;
        if (hs !== undefined && as !== undefined) {
          if (hs > as) win++;
          else if (hs < as) loss++;
          else draw++;
          continue;
        }
        if (r.winnerTeamId) {
          if (r.winnerTeamId === e.favoriteTeamId) win++;
          else if (r.winnerTeamId === e.opponentTeamId) loss++;
        }
      }
      const total = win + loss + draw;
      const rate = total ? Math.round((win / total) * 1000) / 10 : 0;
      setWl({ win, draw, loss, rate });
    });
  }, []);

  return { count, wl };
}
