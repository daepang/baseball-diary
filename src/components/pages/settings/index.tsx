"use client";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SelectField from "@/components/molecules/SelectField";
import { useSettings } from "./common/useSettings";

export default function SettingsPageView() {
  const {
    exportData,
    teams,
    favoriteTeamId,
    setSelectedFavoriteTeamId,
    applyFavoriteTeam,
    canApplyFavoriteTeam,
  } = useSettings();
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">설정</h1>

      <Card className="space-y-3">
        <div className="text-sm opacity-70">개인화</div>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-2">
          <SelectField
            label="응원팀"
            value={favoriteTeamId}
            onChange={(e) => setSelectedFavoriteTeamId(e.currentTarget.value)}
            className="h-10"
          >
            <option value="">선택</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </SelectField>
          <Button
            onClick={applyFavoriteTeam}
            disabled={!canApplyFavoriteTeam}
            aria-label="응원팀 설정 적용"
            className="h-10"
          >
            응원팀 설정
          </Button>
        </div>
      </Card>

      <Card className="space-y-3">
        <div className="text-sm opacity-70">데이터</div>
        <Button onClick={exportData}>JSON 내보내기</Button>
      </Card>
    </div>
  );
}
