# 데이터 모델 (MVP)

본 MVP는 서버 동기화 없이 로컬 우선(IndexedDB/Dexie)으로 동작합니다. 추후 서버 동기화가 들어오면 동일 스키마를 기준으로 확장합니다.

## 엔터티 개요
- Team: KBO 팀 메타데이터
- Stadium: KBO 구장 메타데이터
- Entry: 직관 기록(핵심)
- Photo: 사진 메타 + Blob(또는 FileRef)

## Dexie 스키마 제안
- DB 명: `baseballDiary`
- 스토어
  - `teams`: `id, name, shortName`
  - `stadiums`: `id, name, city`
  - `entries`: `id, date, createdAt, updatedAt, homeTeamId, awayTeamId, stadiumId, seat, companions, rating, mood, highlight, notes, tags, expenses, photos, result`
  - `photos`: `id, entryId, createdAt, width, height, mime, size, exif, blob`

## Entry 구조(JSON 예시)
```
{
  "id": "ulid",
  "date": "2025-04-10",
  "createdAt": "2025-04-10T18:22:33.123Z",
  "updatedAt": "2025-04-10T18:25:01.000Z",
  "homeTeamId": "ktw",
  "awayTeamId": "lgt",
  "stadiumId": "suwon-kt",
  "seat": { "section": "112", "row": "F", "number": "14" },
  "companions": ["친구1", "친구2"],
  "rating": 4,
  "mood": "happy", // enum: happy|neutral|sad 등
  "highlight": "9회말 끝내기!",
  "notes": "비가 조금 와서 추웠다",
  "tags": ["개막전", "비"],
  "expenses": [
    { "type": "ticket", "amount": 25000, "currency": "KRW" },
    { "type": "food", "amount": 12000, "currency": "KRW" }
  ],
  "photos": [
    { "photoId": "01H...", "caption": "응원타임" }
  ],
  "result": {
    "homeScore": 3,
    "awayScore": 2,
    "winnerTeamId": "ktw" // 선택 입력
  }
}
```

## 인덱스/키
- `entries`
  - PK: `id`
  - 보조 인덱스: `date`, `homeTeamId`, `awayTeamId`, `stadiumId`, `tags`(array index)
- `photos`
  - PK: `id`
  - 보조 인덱스: `entryId`

## 통계 계산 소스
- 방문 구장 수: `distinct(entry.stadiumId)`
- 팀별 방문: `count(homeTeamId==X or awayTeamId==X)`
- 평균 평점: `avg(rating)`
- 월간 히트맵: `groupBy(month(date)).count()`

## 서버 동기화(후속)
- `syncStatus`: entries/photos에 `syncState`(local|queued|synced) 필드 추가
- 충돌 정책: `updatedAt` 비교, 수동 병합 UI 제공(후속)

