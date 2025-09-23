"use client";
import Link from "next/link";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { useEntryDetail } from "./common/useEntryDetail";
import { buildEntryEditPath, PATHS } from "@/constants/path";
import { db } from "@/lib/db";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/atoms/ToastProvider";
import { COLORS } from "@/constants/color";
import { getOutcome, getOutcomeLabel } from "@/utils/result";

export default function EntryDetailPageView({ id }: { id: string }) {
  const { entry, teamName, stadiumName, photoUrls } = useEntryDetail(id);
  const router = useRouter();
  const { show } = useToast();
  if (!entry) return <div className="opacity-70">로딩 중...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">기록 상세</h1>
      <Card className="space-y-1">
        <div className="text-sm opacity-70">날짜</div>
        <div>{entry.date}</div>
      </Card>
      <Card className="space-y-1">
        <div className="text-sm opacity-70">경기</div>
        <div className="font-medium">
          {teamName(entry.favoriteTeamId)} vs {teamName(entry.opponentTeamId)}
        </div>
        <div className="text-sm opacity-80">
          구장: {stadiumName(entry.stadiumId)}
        </div>
        {entry.result && (
          <div className="text-sm opacity-80 space-y-0.5">
            <div>
              결과: {entry.result.favoriteScore ?? "-"} :{" "}
              {entry.result.opponentScore ?? "-"}
            </div>
            {entry.result.winningPitcher && (
              <div>승리투수: {entry.result.winningPitcher}</div>
            )}
            {(() => {
              const oc = getOutcome(entry);
              const text = getOutcomeLabel(oc);
              const bg =
                oc === "win"
                  ? COLORS.BRAND_LIGHT
                  : oc === "loss"
                  ? COLORS.BRAND_DARK
                  : COLORS.BRAND_SOFT;
              return text ? (
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{ backgroundColor: bg, color: COLORS.BASE.WHITE }}
                  >
                    {text}
                  </span>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </Card>
      {entry.notes && (
        <Card>
          <div className="text-sm opacity-70">메모</div>
          <div className="whitespace-pre-wrap">{entry.notes}</div>
        </Card>
      )}
      {photoUrls.length > 0 && (
        <Card>
          <div className="text-sm opacity-70 mb-2">사진</div>
          <div className="grid grid-cols-3 gap-2">
            {photoUrls.map((u, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={idx}
                src={u}
                alt="photo"
                className="w-full h-auto rounded"
              />
            ))}
          </div>
        </Card>
      )}
      <div className="grid grid-cols-2 gap-2">
        <Link href={buildEntryEditPath(entry.id)}>
          <Button className="w-full">수정하기</Button>
        </Link>
        <Button
          variant="secondary"
          onClick={async () => {
            if (!confirm("이 기록을 삭제할까요?")) return;
            await db.entries.delete(entry.id);
            await db.photos.where("entryId").equals(entry.id).delete();
            show("삭제되었습니다");
            router.push(PATHS.ENTRIES.path);
          }}
        >
          삭제
        </Button>
      </div>
    </div>
  );
}
