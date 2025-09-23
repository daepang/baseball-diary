"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/atoms/ToastProvider";
import { PATHS } from "@/constants/path";
import { getFavoriteTeamId } from "@/lib/settings";
import type { Entry } from "@/types";
import { db, seedIfEmpty } from "@/lib/db";
import { TEAM_ORDER } from "@/constants/teamOrder";

export function useRecord(initial?: Partial<Entry>) {
  const router = useRouter();
  const { show } = useToast();
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [stadiums, setStadiums] = useState<{ id: string; name: string }[]>([]);
  const [entry, setEntry] = useState<Partial<Entry>>(
    initial ?? { date: todayISODate() }
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    seedIfEmpty();
    db.teams.toArray().then((list) => {
      const indexById: Record<string, number> = Object.fromEntries(
        TEAM_ORDER.map((id, i) => [id, i])
      );
      list.sort((a, b) => (indexById[a.id] ?? 999) - (indexById[b.id] ?? 999));
      setTeams(list);
    });
    db.stadiums.toArray().then(setStadiums);
  }, []);

  // 초기 진입 시 응원팀을 기본값으로 설정 (수정 모드가 아니고, 값이 비어있을 때)
  useEffect(() => {
    if (initial?.id) return; // 편집 모드에서는 건드리지 않음
    if (entry.favoriteTeamId) return;
    getFavoriteTeamId().then((id) => {
      if (id) setEntry((prev) => ({ ...prev, favoriteTeamId: id }));
    });
  }, [initial?.id, entry.favoriteTeamId]);

  // 초기값이 전달되면 반영합니다.
  useEffect(() => {
    if (initial) setEntry(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial?.id]);

  // 구장은 수동 선택 가능하도록 자동 설정 로직 제거

  // 응원팀/상대팀 동일 선택 방지: 응원팀 변경 시 같다면 상대팀을 초기화합니다.
  useEffect(() => {
    if (
      entry.favoriteTeamId &&
      entry.opponentTeamId &&
      entry.favoriteTeamId === entry.opponentTeamId
    ) {
      setEntry((prev) => ({ ...prev, opponentTeamId: undefined }));
    }
  }, [entry.favoriteTeamId, entry.opponentTeamId]);

  const onChange = (patch: Partial<Entry>) => {
    setEntry((prev) => ({
      ...prev,
      ...patch,
      updatedAt: new Date().toISOString(),
    }));
  };

  const resultValid = useMemo(() => {
    const r = entry.result;
    if (!r) return false;
    const hasScores =
      typeof r.favoriteScore === "number" &&
      typeof r.opponentScore === "number";
    const hasWinner = !!r.winnerTeamId;
    return hasScores || hasWinner;
  }, [entry.result]);

  const canSave = useMemo(() => {
    const notSameTeam =
      entry.favoriteTeamId && entry.opponentTeamId
        ? entry.favoriteTeamId !== entry.opponentTeamId
        : true;
    return Boolean(
      entry.date &&
        entry.favoriteTeamId &&
        entry.opponentTeamId &&
        notSameTeam &&
        entry.stadiumId &&
        resultValid
    );
  }, [
    entry.date,
    entry.favoriteTeamId,
    entry.opponentTeamId,
    entry.stadiumId,
    resultValid,
  ]);

  async function save() {
    if (!canSave) return;
    setSaving(true);
    try {
      const id = entry.id ?? crypto.randomUUID();
      const now = new Date().toISOString();
      const toSave: Entry = {
        id,
        date: entry.date!,
        createdAt: entry.createdAt ?? now,
        updatedAt: now,
        favoriteTeamId: entry.favoriteTeamId,
        opponentTeamId: entry.opponentTeamId,
        stadiumId: entry.stadiumId,
        seat: entry.seat,
        companions: entry.companions ?? [],
        rating: entry.rating,
        mood: entry.mood,
        highlight: undefined,
        notes: entry.notes,
        tags: entry.tags ?? [],
        expenses: entry.expenses ?? [],
        photos: entry.photos ?? [],
        result: entry.result,
        syncState: "local",
      };
      await db.entries.put(toSave);
      // 임시 entryId로 저장된 사진들을 실제 id로 재연결합니다.
      const photoIds = (toSave.photos ?? []).map((p) => p.photoId);
      if (photoIds.length) {
        await db.photos.where("id").anyOf(photoIds).modify({ entryId: id });
      }
      show("저장되었습니다");
      router.push(PATHS.ENTRIES.path);
    } finally {
      setSaving(false);
    }
  }

  async function onCompressedPhoto(file: File) {
    const id = crypto.randomUUID();
    await db.photos.add({
      id,
      entryId: entry.id ?? "temp",
      createdAt: new Date().toISOString(),
      mime: file.type,
      size: file.size,
      blob: file,
    });
    setEntry((prev) => ({
      ...prev,
      photos: [...(prev.photos ?? []), { photoId: id }],
    }));
  }

  async function deletePhoto(photoId: string) {
    await db.photos.delete(photoId);
    setEntry((prev) => ({
      ...prev,
      photos: (prev.photos ?? []).filter((p) => p.photoId !== photoId),
    }));
  }

  return {
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
  };
}

function todayISODate() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
