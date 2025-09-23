"use client";
import Link from "next/link";
import Card, { GradientCard } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { PATHS } from "@/constants/path";
import { COLORS } from "@/constants/color";
import { useHome } from "./common/useHome";
import { getCheerBias } from "@/utils/result";

export default function HomePageView() {
  const { count, wl } = useHome();
  return (
    <div className="space-y-6">
      <GradientCard from={COLORS.BRAND} to={COLORS.BRAND_LIGHT}>
        <div className="text-lg font-semibold">Baseball Diary</div>
        <div className="text-sm opacity-90">
          오늘의 직관을 바로 기록해 보세요
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link href={PATHS.RECORD.path}>
            <Button>기록하기</Button>
          </Link>
          <Link href={PATHS.ENTRIES.path}>
            <Button
              variant="secondary"
              fullWidth
              style={{
                borderColor: COLORS.BASE.WHITE,
                color: COLORS.BASE.WHITE,
                backgroundColor: "transparent",
              }}
            >
              기록 목록
            </Button>
          </Link>
        </div>
      </GradientCard>
      <GradientCard from={COLORS.BRAND} to={COLORS.BRAND_LIGHT}>
        <div className="text-sm">총 기록</div>
        <div className="text-3xl font-semibold">{count}</div>
      </GradientCard>
      <Card>
        <div className="text-sm">내 직관 결과</div>
        <div className="text-lg font-medium mt-1">
          승 {wl.win} · 무 {wl.draw} · 패 {wl.loss}
        </div>
        <div className="text-sm opacity-80 flex items-center gap-2">
          <span>승률 {wl.rate}%</span>
          {(() => {
            const bias = getCheerBias(wl.win, wl.draw, wl.loss);
            if (!bias) return null;
            const cls =
              bias === "승요"
                ? "bg-emerald-600"
                : bias === "패요"
                ? "bg-rose-600"
                : "bg-slate-500";
            return (
              <span
                className={`px-2 py-0.5 rounded-full text-xs text-white ${cls}`}
              >
                {bias}
              </span>
            );
          })()}
        </div>
      </Card>
    </div>
  );
}
