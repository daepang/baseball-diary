import Dexie, { Table } from "dexie";
import type { Entry, Photo, Stadium, Team } from "@/types";

export class BaseballDiaryDB extends Dexie {
  teams!: Table<Team, string>;
  stadiums!: Table<Stadium, string>;
  entries!: Table<Entry, string>;
  photos!: Table<Photo, string>;
  settings!: Table<{ key: string; value: string }, string>;

  constructor() {
    super("baseballDiary");
    this.version(1).stores({
      teams: "id,name,shortName",
      stadiums: "id,name,city",
      entries:
        "id,date,createdAt,updatedAt,favoriteTeamId,opponentTeamId,stadiumId,tags",
      photos: "id,entryId,createdAt",
      settings: "key",
    });
  }
}

export const db = new BaseballDiaryDB();

// 최초 1회만 팀/구장 기본 데이터를 채워 사용자 경험을 개선합니다.
export async function seedIfEmpty() {
  const count = await db.teams.count();
  if (count > 0) return;

  const teams: Team[] = [
    { id: "samsung", name: "삼성 라이온즈" },
    { id: "lotte", name: "롯데 자이언츠" },
    { id: "doosan", name: "두산 베어스" },
    { id: "nc", name: "NC 다이노스" },
    { id: "lg", name: "LG 트윈스" },
    { id: "kia", name: "KIA 타이거즈" },
    { id: "ssg", name: "SSG 랜더스" },
    { id: "kt", name: "KT 위즈" },
    { id: "kiwoom", name: "키움 히어로즈" },
    { id: "hanwha", name: "한화 이글스" },
  ];

  const stadiums: Stadium[] = [
    { id: "daegu-lions", name: "대구 삼성 라이온즈 파크", city: "Daegu" },
    { id: "sajik", name: "사직야구장", city: "Busan" },
    { id: "jamsil", name: "잠실야구장", city: "Seoul" },
    { id: "changwon-nc", name: "창원 NC 파크", city: "Changwon" },
    { id: "gwangju-kia", name: "광주 KIA 챔피언스 필드", city: "Gwangju" },
    { id: "incheon-ssg", name: "인천 SSG 랜더스 필드", city: "Incheon" },
    { id: "suwon-kt", name: "수원 KT 위즈 파크", city: "Suwon" },
    { id: "gocheok", name: "고척 스카이돔", city: "Seoul" },
    { id: "daejeon", name: "대전 한화생명 볼 파크", city: "Daejeon" },
  ];

  await db.transaction("rw", db.teams, db.stadiums, async () => {
    await db.teams.bulkAdd(teams);
    await db.stadiums.bulkAdd(stadiums);
  });
}
