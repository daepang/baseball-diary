"use client";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/db";
import type { Team, Entry, Photo } from "@/types";
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

  function blobToDataURL(b: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(b);
    });
  }

  async function exportData() {
    const entries = await db.entries.toArray();
    const photos = await db.photos.toArray();
    const photosJson = await Promise.all(
      photos.map(async (p) => ({
        id: p.id,
        entryId: p.entryId,
        createdAt: p.createdAt,
        width: p.width,
        height: p.height,
        mime: p.mime,
        size: p.size,
        exif: p.exif,
        dataUrl: await blobToDataURL(p.blob),
      }))
    );
    const payload = { entries, photos: photosJson };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    downloadBlob(
      blob,
      `baseball-diary-export-${new Date().toISOString().slice(0, 10)}.json`
    );
  }

  function isRecord(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null;
  }

  async function importDataFromJson(file: File) {
    const text = await file.text();
    let obj: unknown;
    try {
      obj = JSON.parse(text);
    } catch (e) {
      show("유효한 JSON 파일이 아닙니다");
      return;
    }
    if (!isRecord(obj)) {
      show("JSON 형식이 올바르지 않습니다");
      return;
    }
    const entries = Array.isArray(obj.entries) ? (obj.entries as unknown[]) : [];
    const photos = Array.isArray(obj.photos) ? (obj.photos as unknown[]) : [];

    const entryRows = entries.filter(isRecord).filter((e) => typeof e.id === "string") as Array<Record<string, unknown>>;
    const photoRows = photos.filter(isRecord).filter((p) => typeof p.id === "string" && typeof p.dataUrl === "string") as Array<Record<string, unknown>>;

    const replace = confirm("기존 데이터와 합칠까요?\n'취소'를 누르면 기존 데이터를 지우고 가져옵니다.");

    await db.transaction("rw", db.entries, db.photos, async () => {
      if (!replace) {
        await db.entries.clear();
        await db.photos.clear();
      }
      if (entryRows.length) {
        // 그대로 upsert (핵심 필드는 상단에서 최소 검증)
        await db.entries.bulkPut(entryRows as unknown as Entry[]);
      }
      if (photoRows.length) {
        const toPut = await Promise.all(
          photoRows.map(async (p) => {
            const dataUrl = String(p.dataUrl);
            const b = await fetch(dataUrl).then((r) => r.blob());
            return {
              id: String(p.id),
              entryId: String(p.entryId ?? ""),
              createdAt: String(p.createdAt ?? new Date().toISOString()),
              width: typeof p.width === "number" ? p.width : undefined,
              height: typeof p.height === "number" ? p.height : undefined,
              mime: typeof p.mime === "string" ? p.mime : b.type || undefined,
              size: typeof p.size === "number" ? p.size : b.size,
              exif: isRecord(p.exif) ? (p.exif as Record<string, unknown>) : undefined,
              blob: b,
            };
          })
        );
        await db.photos.bulkPut(toPut as unknown as Photo[]);
      }
    });
    show(`가져오기 완료: 기록 ${entryRows.length}건, 사진 ${photoRows.length}장`);
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
    importDataFromJson,
  };
}
