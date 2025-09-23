import type { Stadium, Team } from "@/types";

export type IdName = { id: string; name: string };

export function toNameMap(list: IdName[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const it of list) map[it.id] = it.name;
  return map;
}

export function getName(
  map: Record<string, string>,
  id: string | undefined,
  fallbackIfEmpty = "-",
  fallbackIfMissing?: string
): string {
  if (!id) return fallbackIfEmpty;
  return map[id] ?? fallbackIfMissing ?? id;
}

export function teamName(map: Record<string, string>, id?: Team["id"], fallback?: string) {
  return getName(map, id, "-", fallback);
}

export function stadiumName(map: Record<string, string>, id?: Stadium["id"], fallback?: string) {
  return getName(map, id, "구장 미지정", fallback);
}

