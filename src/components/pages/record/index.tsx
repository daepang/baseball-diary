"use client";
import InputField from "@/components/molecules/InputField";
import SelectField from "@/components/molecules/SelectField";
import NumberField from "@/components/molecules/NumberField";
import TextAreaField from "@/components/molecules/TextAreaField";
import Button from "@/components/atoms/Button";
import PhotoPicker from "@/components/molecules/PhotoPicker";
import { useRecord } from "./common/useRecord";

export default function RecordPageView({
  initialEntry,
}: {
  initialEntry?: Partial<import("@/types").Entry>;
}) {
  const {
    teams,
    stadiums,
    entry,
    saving,
    canSave,
    resultValid,
    onChange,
    save,
    onCompressedPhoto,
    deletePhoto,
  } = useRecord(initialEntry);

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">기록하기</h1>

      <div className="grid gap-4">
        <InputField
          label="날짜"
          type="date"
          required
          value={entry.date || ""}
          onChange={(e) => onChange({ date: e.currentTarget.value })}
          helpText={!entry.date ? "필수 항목입니다" : undefined}
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="응원팀"
            value={entry.favoriteTeamId || ""}
            onChange={(e) =>
              onChange({ favoriteTeamId: e.currentTarget.value })
            }
            required
            helpText={!entry.favoriteTeamId ? "필수 항목입니다" : undefined}
          >
            <option value="">선택</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="상대팀"
            value={entry.opponentTeamId || ""}
            onChange={(e) =>
              onChange({ opponentTeamId: e.currentTarget.value })
            }
            required
            helpText={
              !entry.opponentTeamId
                ? "필수 항목입니다"
                : entry.favoriteTeamId === entry.opponentTeamId
                ? "응원팀과 상대팀이 같을 수 없습니다"
                : undefined
            }
          >
            <option value="">선택</option>
            {teams
              .filter((t) => t.id !== entry.favoriteTeamId)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
          </SelectField>
        </div>

        <SelectField
          label="구장"
          value={entry.stadiumId || ""}
          onChange={(e) => onChange({ stadiumId: e.currentTarget.value })}
          required
          helpText={!entry.stadiumId ? "필수 항목입니다" : undefined}
        >
          <option value="">선택</option>
          {stadiums.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </SelectField>

        {/* 경기 결과 입력 */}
        <div className="space-y-2">
          <div className="text-sm opacity-80">결과</div>
          <div className="grid grid-cols-2 gap-2">
            <NumberField
              label="응원팀 점수"
              min={0}
              value={entry.result?.favoriteScore ?? ""}
              onChange={(e) => {
                const v = e.currentTarget.value;
                const favoriteScore = v === "" ? undefined : Number(v);
                const opponentScore = entry.result?.opponentScore;
                let winnerTeamId = entry.result?.winnerTeamId;
                if (
                  favoriteScore !== undefined &&
                  opponentScore !== undefined
                ) {
                  if (favoriteScore > opponentScore)
                    winnerTeamId = entry.favoriteTeamId;
                  else if (favoriteScore < opponentScore)
                    winnerTeamId = entry.opponentTeamId;
                  else winnerTeamId = undefined; // 무승부
                }
                onChange({
                  result: {
                    ...(entry.result ?? {}),
                    favoriteScore,
                    winnerTeamId,
                  },
                });
              }}
            />
            <NumberField
              label="상대팀 점수"
              min={0}
              value={entry.result?.opponentScore ?? ""}
              onChange={(e) => {
                const v = e.currentTarget.value;
                const opponentScore = v === "" ? undefined : Number(v);
                const favoriteScore = entry.result?.favoriteScore;
                let winnerTeamId = entry.result?.winnerTeamId;
                if (
                  favoriteScore !== undefined &&
                  opponentScore !== undefined
                ) {
                  if (favoriteScore > opponentScore)
                    winnerTeamId = entry.favoriteTeamId;
                  else if (favoriteScore < opponentScore)
                    winnerTeamId = entry.opponentTeamId;
                  else winnerTeamId = undefined; // 무승부
                }
                onChange({
                  result: {
                    ...(entry.result ?? {}),
                    opponentScore,
                    winnerTeamId,
                  },
                });
              }}
            />
          </div>
          <SelectField
            label="승자"
            value={entry.result?.winnerTeamId ?? ""}
            onChange={(e) =>
              onChange({
                result: {
                  ...(entry.result ?? {}),
                  winnerTeamId: e.currentTarget.value || undefined,
                },
              })
            }
            helpText={
              !resultValid ? "점수 또는 승자 중 하나는 필수입니다" : undefined
            }
          >
            <option value="">미정/무승부</option>
            {entry.favoriteTeamId && (
              <option value={entry.favoriteTeamId}>응원팀</option>
            )}
            {entry.opponentTeamId && (
              <option value={entry.opponentTeamId}>상대팀</option>
            )}
          </SelectField>
          <InputField
            label="승리투수 (선택)"
            value={entry.result?.winningPitcher ?? ""}
            onChange={(e) =>
              onChange({
                result: {
                  ...(entry.result ?? {}),
                  winningPitcher: e.currentTarget.value || undefined,
                },
              })
            }
            placeholder="예: 원태인"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <InputField
            label="구역"
            value={entry.seat?.section || ""}
            onChange={(e) =>
              onChange({
                seat: { ...entry.seat, section: e.currentTarget.value },
              })
            }
          />
          <InputField
            label="열"
            value={entry.seat?.row || ""}
            onChange={(e) =>
              onChange({ seat: { ...entry.seat, row: e.currentTarget.value } })
            }
          />
          <InputField
            label="번호"
            value={entry.seat?.number || ""}
            onChange={(e) =>
              onChange({
                seat: { ...entry.seat, number: e.currentTarget.value },
              })
            }
          />
        </div>

        <NumberField
          label="평점 (1~5)"
          min={1}
          max={5}
          value={entry.rating ?? ""}
          onChange={(e) => {
            const v = e.currentTarget.value;
            onChange({ rating: v === "" ? undefined : Number(v) });
          }}
        />

        <TextAreaField
          label="메모"
          value={entry.notes ?? ""}
          onChange={(e) => onChange({ notes: e.currentTarget.value })}
        />

        <PhotoPicker
          photoIds={(entry.photos ?? []).map((p) => p.photoId)}
          onAdd={onCompressedPhoto}
          onDelete={deletePhoto}
        />
      </div>

      <Button onClick={save} disabled={!canSave || saving}>
        {saving ? "저장 중..." : "저장"}
      </Button>
    </div>
  );
}
