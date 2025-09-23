"use client";
import Card from "@/components/atoms/Card";
import { useStats } from "./common/useStats";

export default function StatsPageView() {
  const { entries, avgRating, stadiumCount } = useStats();
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">요약 통계</h1>
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <div className="text-sm opacity-70">총 기록</div>
          <div className="text-2xl font-semibold">{entries.length}</div>
        </Card>
        <Card>
          <div className="text-sm opacity-70">평균 평점</div>
          <div className="text-2xl font-semibold">{avgRating ?? "-"}</div>
        </Card>
        <Card>
          <div className="text-sm opacity-70">방문 구장 수</div>
          <div className="text-2xl font-semibold">{stadiumCount}</div>
        </Card>
      </div>
    </div>
  );
}

