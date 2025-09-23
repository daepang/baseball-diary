"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import type { Entry, Team, Stadium } from "@/types";
import { toNameMap, teamName as tn, stadiumName as sn } from "@/utils/team";

export function useEntryDetail(id: string) {
  const [entry, setEntry] = useState<Entry | null>(null);
  const [teams, setTeams] = useState<Record<string, string>>({});
  const [stadiums, setStadiums] = useState<Record<string, string>>({});
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  useEffect(() => {
    db.entries.get(id).then((e) => setEntry(e ?? null));
    db.teams.toArray().then((list: Team[]) => setTeams(toNameMap(list)));
    db.stadiums.toArray().then((list: Stadium[]) => setStadiums(toNameMap(list)));
    let revoked: string[] = [];
    db.photos.where('entryId').equals(id).toArray().then((arr) => {
      const urls = arr.map((p) => URL.createObjectURL(p.blob));
      setPhotoUrls(urls);
      revoked = urls;
    });
    return () => {
      revoked.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [id]);

  const teamName = (tid?: string) => tn(teams, tid);
  const stadiumName = (sid?: string) => sn(stadiums, sid);

  return { entry, teamName, stadiumName, photoUrls };
}
