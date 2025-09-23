"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase-browser";
import { db } from "@/lib/db";
import type { Team } from "@/types";
import { getFavoriteTeamId, setFavoriteTeamId } from "@/lib/settings";
import { useDownloadBlob } from "@/hooks/useDownload";

export function useSettings() {
  const supabase = getSupabase();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("게스트 모드(오프라인)");
  const downloadBlob = useDownloadBlob();
  const [teams, setTeams] = useState<Team[]>([]);
  const [favoriteTeamId, setFav] = useState<string>("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) {
        setStatus(`로그인: ${data.session.user.email}`);
      }
    });
  }, [supabase]);

  useEffect(() => {
    db.teams.toArray().then(setTeams);
    getFavoriteTeamId().then((id) => setFav(id ?? ""));
  }, []);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      alert("환경변수 미설정: Supabase URL/Key 를 설정해주세요");
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    if (error) alert(error.message);
    else alert("이메일로 매직 링크를 보냈습니다.");
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setStatus("게스트 모드(오프라인)");
  }

  async function exportData() {
    const entries = await db.entries.toArray();
    const photos = await db.photos.toArray();
    const blob = new Blob([JSON.stringify({ entries, photos }, null, 2)], { type: "application/json" });
    downloadBlob(blob, `baseball-diary-export-${new Date().toISOString().slice(0,10)}.json`);
  }

  return {
    email,
    setEmail,
    status,
    sendMagicLink,
    signOut,
    exportData,
    hasSupabase: Boolean(supabase),
    teams,
    favoriteTeamId,
    async saveFavoriteTeam(id: string) {
      setFav(id);
      await setFavoriteTeamId(id);
    },
  };
}
