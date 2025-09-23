"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import type { Entry, Team, Stadium } from "@/types";
import { toNameMap, teamName as tn, stadiumName as sn } from "@/utils/team";

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [teams, setTeams] = useState<Record<string, string>>({});
  const [stadiums, setStadiums] = useState<Record<string, string>>({});

  useEffect(() => {
    db.entries.orderBy("date").reverse().toArray().then(setEntries);
    db.teams.toArray().then((list: Team[]) => setTeams(toNameMap(list)));
    db.stadiums.toArray().then((list: Stadium[]) => setStadiums(toNameMap(list)));
  }, []);

  const teamName = (id?: string) => tn(teams, id);
  const stadiumName = (id?: string) => sn(stadiums, id);

  return { entries, teamName, stadiumName };
}
