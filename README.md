# Baseball Diary (KBO 직관 기록 서비스)

모바일 웹(PWA) 기반의 개인 직관 기록 서비스입니다. 오프라인에서도 기록이 끊기지 않도록 설계했습니다.

## 상태

- 설계 초안 완료 → 스캐폴드 및 구현 단계 진행

## 실행 방법

- 의존성 설치: `pnpm i`
- 개발 서버: `pnpm dev` → http://localhost:3000

## 환경 변수(.env.local)

- 예시 파일 복사: `cp .env.local.example .env.local`
- 선택: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정 시 이메일 로그인 사용 가능

## 주요 경로

- `/` 홈: 빠른 이동/요약
- `/record` 기록하기: 날짜/팀/구장/좌석/메모/사진(압축)
- `/entries` 목록: 저장된 기록 리스트
- `/stats` 통계: 간단 요약
- `/settings` 설정: 게스트 모드/이메일 로그인, JSON 내보내기
