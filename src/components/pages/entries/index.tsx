"use client";
import Link from "next/link";
import { PATHS, buildEntryPath } from "@/constants/path";
import { useEntries } from "./common/useEntries";
import { COLORS } from "@/constants/color";
import { getOutcome, getOutcomeLabel } from "@/utils/result";

export default function EntriesPageView() {
  const { entries, teamName, stadiumName } = useEntries();
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">기록 목록</h1>
      <ul className="space-y-2">
        {entries.map((e) => (
          <li key={e.id}>
            <Link href={buildEntryPath(e.id)} className="block">
              <div
                className="rounded-2xl p-4 text-white shadow-sm hover:opacity-95 active:opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.BRAND} 0%, ${COLORS.BRAND_LIGHT} 100%)`,
                }}
              >
                <div className="text-sm opacity-90">{e.date}</div>
                <div className="text-lg font-semibold mt-0.5">
                  {teamName(e.favoriteTeamId)}{" "}
                  <span className="opacity-80">vs</span>{" "}
                  {teamName(e.opponentTeamId)}
                </div>
                <div className="text-2xl font-semibold mt-0.5">
                  {e.result?.favoriteScore ?? "-"}{" "}
                  <span className="opacity-80">:</span>{" "}
                  {e.result?.opponentScore ?? "-"}
                </div>
                {(() => {
                  const oc = getOutcome(e);
                  const text = getOutcomeLabel(oc);
                  const bg =
                    oc === "win"
                      ? COLORS.BRAND_LIGHT
                      : oc === "loss"
                      ? COLORS.BRAND_DARK
                      : COLORS.BRAND_SOFT;
                  return text ? (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs opacity-90">
                        {e.result?.winningPitcher
                          ? `승리투수: ${e.result.winningPitcher}`
                          : teamName(e.favoriteTeamId)}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs"
                        style={{
                          backgroundColor: bg,
                          color: COLORS.BASE.WHITE,
                        }}
                      >
                        {text}
                      </span>
                    </div>
                  ) : null;
                })()}
                <div className="text-sm opacity-90 mt-1">
                  {stadiumName(e.stadiumId)}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {entries.length === 0 && (
        <div className="opacity-70 text-sm">
          아직 기록이 없습니다.{" "}
          <Link className="underline" href={PATHS.RECORD.path}>
            기록하기
          </Link>
        </div>
      )}
    </div>
  );
}
