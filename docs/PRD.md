Baseball Diary – 제품 요구사항 문서 (PRD)

1) 개요
- 목적: KBO 직관 기록을 빠르고 간편하게 남기고, 누적 기록을 목록/통계로 되돌아보는 PWA.
- 대상: 현장 관람을 자주 하거나 기록을 습관화하고 싶은 야구 팬.
- 플랫폼: 모바일 퍼스트(PWA), 데스크톱에서는 430×932 에뮬레이터 프레임 중앙 정렬.

2) 목표/비목표
- 목표
  - 10초 이내 기본 기록 저장(날짜 기본값, 최소 입력)
  - 오프라인에서도 전 기능 사용 가능(로컬 DB)
  - 사진 첨부 시 자동 압축 및 저장
  - 간단한 누적 통계 확인(총 경기 수 등)
- 비목표(현재 페이즈)
  - 서버 동기화/계정 시스템
  - 공유용 퍼블릭 페이지
  - 심화 분석(세부 플레이 기록 등)

3) 핵심 플로우
- 홈 → 기록하기 → 저장 → 목록 반영
- 목록에서 이전 기록 탐색
- 통계 탭에서 누적 지표 확인
- 설정에서 데이터 백업/초기화

4) 정보 구조(IA) 및 내비게이션
- 공용 헤더: 좌측 로고 + 앱명
- 하단 탭(고정): 홈 / 기록 / 목록 / 통계 / 설정
- 주요 화면
  - 홈(/): 요약 안내 + 주요 바로가기
  - 기록(/record): 입력 폼
  - 목록(/entries): 저장된 기록 리스트 → 아이템 클릭 시 상세로 이동
  - 상세(/entries/[id]): 기록 상세(날짜/팀/구장/결과/메모)
  - 수정(/entries/[id]/edit): 기록 수정(기록하기 폼 재사용)
  - 통계(/stats): 누적/최근 지표 카드
  - 설정(/settings): 데이터 내보내기/초기화 등

5) 화면별 요구사항
- 공통
  - 모바일: 전체 화면, 하단바 fixed, 본문은 `pb`로 겹침 방지
  - 데스크톱: 중앙 430×932 프레임, 헤더/본문 스크롤/하단바 배치는 프레임 안에서 동작
  - 접근성: 라벨 연결, 키보드 포커스 가능, 대비 준수

- 기록하기(/record)
  - 필드
    - 날짜: 기본값 오늘(YYYY-MM-DD), 필수
    - 홈팀/원정팀: 선택형(시드 데이터, 동일 팀 선택 불가)
    - 구장: 홈팀 선택 시 자동 설정(수동 불가)
    - 좌석: 구역/열/번호(텍스트, 겹침 없이 3열 배치)
    - 평점: 1~5 숫자(빈 값 허용)
    - 하이라이트: 텍스트(선택)
    - 메모: 멀티라인(선택)
    - 사진: 파일 선택(카메라/앨범), 압축 후 로컬 저장
  - 검증/동작
    - 날짜/홈팀/원정팀/구장, 결과(점수 또는 승자 중 하나) 필수
    - 숫자 필드는 공백일 때 undefined로 저장
    - 저장 시 Entry 생성/업데이트, 임시 사진의 entryId relink
    - 저장 성공 시 기록 목록으로 이동

- 목록(/entries)
  - 역순(최근 → 과거) 정렬 리스트
  - 아이템: 날짜, 팀/구장 요약, 평점(있을 경우)
  - 클릭 시 상세로 이동
  - 빈 상태 안내 및 기록하기 CTA

- 상세(/entries/[id])
  - 기본 정보 표시: 날짜, 팀/구장, 점수/승자, 메모
  - 액션: 수정하기, 삭제하기(확인 후 삭제 처리)

- 수정(/entries/[id]/edit)
  - 기록하기 폼과 동일한 UI/검증 로직
  - 저장 시 토스트 표시 후 기록 목록으로 이동
  - 삭제는 상세 화면에서 수행

- 통계(/stats)
  - 현재: 총 기록 수
  - 확장안(TBD): 구장별/팀별 방문 수, 평균 평점, 태그 탑 N

- 설정(/settings)
  - 데이터 내보내기(JSON) 다운로드
  - 데이터 초기화(확인 모달 후 전체 삭제)

6) 데이터 모델(요약)
- Team { id, name, shortName? }
- Stadium { id, name, city? }
- Entry {
  id, date, createdAt, updatedAt,
  homeTeamId?, awayTeamId?, stadiumId?,
  seat?: { section?, row?, number? },
  companions?: string[], rating?: number,
  mood?: string, highlight?, notes?, tags?: string[],
  expenses?: { type, amount, currency }[],
  photos?: { photoId, caption? }[],
  result?: { homeScore?, awayScore?, winnerTeamId? },
  syncState?: 'local' | 'queued' | 'synced'
}
- Photo { id, entryId, createdAt, width?, height?, mime?, size?, exif?, blob }

7) 오프라인/PWA
- IndexedDB(Dexie) 기반 로컬 저장, 최초 진입 시 팀/구장 시드
- Service Worker: 앱셸/아이콘 캐싱, 오프라인 내비
- Manifest: standalone, 아이콘 `/logo.png`(1024)

8) 성능/품질
- 사진 첨부 시 캔버스 압축(품질 파라미터 유지)
- 폼 컨트롤은 겹침 없이 반응형 레이아웃 유지
- Lighthouse PWA 점검(오프라인 가능, manifest, SW 등록)

9) 코드 구조(요약)
- `app/<route>/page.tsx`는 서버 컴포넌트로 View만 렌더
- `components/pages/<route>/index.tsx`가 UI 조립, `components/pages/<route>/common/use*.tsx`가 로직
- 경로 상수 및 빌더는 `src/constants/path.ts`

10) 보안/프라이버시
- 모든 데이터는 로컬에 저장(현 단계)
- 내보내기 파일은 사용자 디바이스로 저장, 서버 전송 없음

11) 로깅/분석(TBD)
- 선택적 도입. 현재는 미집계

12) 출시 체크리스트
- [ ] 아이콘/스플래시 세트(192/512 등) 확정 및 manifest 반영
- [ ] 브라우저/디바이스별 하단바/스크롤 동작 확인
- [ ] 입력 검증/빈 상태/오류 상태 UX 확인
- [ ] 오프라인 첫 진입/이후 재방문 캐시 동작 확인
