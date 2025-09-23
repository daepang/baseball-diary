export type ID = string;

export type Team = {
  id: string; // 예: "doosan", "lg"
  name: string;
  shortName?: string;
};

export type Stadium = {
  id: string; // 예: "jamsil"
  name: string;
  city?: string;
};

export type Seat = {
  section?: string;
  row?: string;
  number?: string;
};

export type Expense = {
  type: "ticket" | "food" | "goods" | "other";
  amount: number;
  currency: string; // 예: "KRW"
};

export type PhotoRef = {
  photoId: ID;
  caption?: string;
};

export type Entry = {
  id: ID;
  date: string; // YYYY-MM-DD 형식
  createdAt: string; // ISO 문자열
  updatedAt: string; // ISO 문자열
  favoriteTeamId?: string; // 응원팀
  opponentTeamId?: string; // 상대팀
  stadiumId?: string;
  seat?: Seat;
  companions?: string[];
  rating?: number; // 1~5 점수
  mood?: "happy" | "neutral" | "sad" | "excited" | "tired" | string;
  highlight?: string;
  notes?: string;
  tags?: string[];
  expenses?: Expense[];
  photos?: PhotoRef[];
  result?: {
    favoriteScore?: number;
    opponentScore?: number;
    winnerTeamId?: string; // 응원팀/상대팀 중 하나의 팀 ID
    winningPitcher?: string; // 선택 입력: 승리 투수 이름
  };
  // 향후 동기화 상태 표현(현재는 로컬 전용)
  syncState?: "local" | "queued" | "synced";
};

export type Photo = {
  id: ID;
  entryId: ID;
  createdAt: string;
  width?: number;
  height?: number;
  mime?: string;
  size?: number;
  exif?: Record<string, unknown>;
  blob: Blob; // 로컬에 저장되는 원본/압축 이미지
};
