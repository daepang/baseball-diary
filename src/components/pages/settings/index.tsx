"use client";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import InputField from "@/components/molecules/InputField";
import SelectField from "@/components/molecules/SelectField";
import { useSettings } from "./common/useSettings";

export default function SettingsPageView() {
  const { email, setEmail, status, sendMagicLink, signOut, exportData, hasSupabase, teams, favoriteTeamId, saveFavoriteTeam } = useSettings();
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">설정</h1>
      <Card className="space-y-3">
        <div className="text-sm opacity-70">계정</div>
        <div>{status}</div>
        <form onSubmit={sendMagicLink} className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
          <InputField
            label="이메일"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <Button type="submit" variant="secondary">로그인 링크 보내기</Button>
        </form>
        {hasSupabase && (
          <button onClick={signOut} className="text-sm underline opacity-80">로그아웃</button>
        )}
      </Card>

      <Card className="space-y-3">
        <div className="text-sm opacity-70">데이터</div>
        <Button onClick={exportData}>JSON 내보내기</Button>
      </Card>

      <Card className="space-y-3">
        <div className="text-sm opacity-70">개인화</div>
        <SelectField label="응원팀" value={favoriteTeamId} onChange={(e) => saveFavoriteTeam(e.currentTarget.value)}>
          <option value="">선택</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </SelectField>
      </Card>
    </div>
  );
}
