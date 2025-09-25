"use client";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/db";
import type { Team } from "@/types";
import { getFavoriteTeamId, setFavoriteTeamId } from "@/lib/settings";
import { useDownloadBlob } from "@/hooks/useDownload";
import { useToast } from "@/components/atoms/ToastProvider";

export function useSettings() {
  const downloadBlob = useDownloadBlob();
  const { show } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  // 저장된 값과 화면에서 선택 중인 값을 분리 관리
  const [storedFavoriteTeamId, setStoredFav] = useState<string>("");
  const [selectedFavoriteTeamId, setSelectedFav] = useState<string>("");

  useEffect(() => {
    db.teams.toArray().then(setTeams);
    getFavoriteTeamId().then((id) => {
      const v = id ?? "";
      setStoredFav(v);
      setSelectedFav(v);
    });
  }, []);

  async function exportData() {
    const entries = await db.entries.toArray();
    const photos = await db.photos.toArray();
    const blob = new Blob([JSON.stringify({ entries, photos }, null, 2)], {
      type: "application/json",
    });
    downloadBlob(
      blob,
      `baseball-diary-export-${new Date().toISOString().slice(0, 10)}.json`
    );
  }

  const canApplyFavoriteTeam = useMemo(
    () => selectedFavoriteTeamId !== storedFavoriteTeamId,
    [selectedFavoriteTeamId, storedFavoriteTeamId]
  );

  async function applyFavoriteTeam() {
    await setFavoriteTeamId(selectedFavoriteTeamId || undefined);
    setStoredFav(selectedFavoriteTeamId);
    show("응원팀 설정이 저장되었습니다");
  }

  return {
    exportData,
    teams,
    favoriteTeamId: selectedFavoriteTeamId,
    setSelectedFavoriteTeamId: setSelectedFav,
    applyFavoriteTeam,
    canApplyFavoriteTeam,
  };
}
