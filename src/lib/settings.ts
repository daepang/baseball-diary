import { db } from "./db";

const FAVORITE_TEAM_KEY = "favoriteTeamId" as const;

export async function getFavoriteTeamId(): Promise<string | undefined> {
  const row = await db.settings.get(FAVORITE_TEAM_KEY);
  return row?.value;
}

export async function setFavoriteTeamId(teamId?: string): Promise<void> {
  if (!teamId) {
    await db.settings.delete(FAVORITE_TEAM_KEY);
    return;
  }
  await db.settings.put({ key: FAVORITE_TEAM_KEY, value: teamId });
}

