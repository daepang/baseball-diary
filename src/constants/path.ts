export type RouteMeta = {
  path: string;
  name: string;
};

export const PATHS = {
  HOME: { path: "/", name: "홈" },
  RECORD: { path: "/record", name: "기록" },
  ENTRIES: { path: "/entries", name: "목록" },
  STATS: { path: "/stats", name: "통계" },
  SETTINGS: { path: "/settings", name: "설정" },
} as const;

export type PathKey = keyof typeof PATHS;

export const NAV_ITEMS: ReadonlyArray<{ path: string; name: string }> = [
  PATHS.HOME,
  PATHS.RECORD,
  PATHS.ENTRIES,
  PATHS.STATS,
  PATHS.SETTINGS,
];

// 동적 경로 빌더
export const buildEntryPath = (id: string) => `/entries/${id}`;
export const buildEntryEditPath = (id: string) => `/entries/${id}/edit`;
