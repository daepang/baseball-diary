# PWA 아키텍처 / 오프라인 전략

## 목표
- 오프라인에서도 기록하기 흐름 100% 동작
- 앱 셸 즉시 로드, 네트워크 상태 무관한 기본 내비게이션

## 기술 스택 제안
- Next.js 14(App Router) + TypeScript + Tailwind
- IndexedDB(Dexie) 로컬 저장
- Service Worker(Workbox) + Precache + Runtime Cache
- 이미지 클라이언트 리사이즈/압축: `canvas`/`createImageBitmap`/`browser-image-compression` 등

## 캐시 전략
- App Shell(정적 자원): Precache(최신 빌드 해시 기반)
- 폰트/아이콘: Stale-While-Revalidate
- 이미지(thumbnail): Cache First + 만료 정책(용량/기간)
- 페이지/데이터: Network First(온라인), Offline Fallback(오프라인)

## 오프라인 데이터 설계
- 초안 자동 저장: 입력 변화 감지 → Debounce(예: 500ms) → Dexie `entries`에 upsert
- 사진: 업로드 즉시 압축 → `photos.blob` 저장, 썸네일 별도 생성 가능
- 참조 무결성: `photos.entryId`로 역참조, 삭제 시 사진도 정리

## 동기화(후속 단계)
- 로그인 존재 시, 백그라운드 동기화(Background Sync 또는 앱 포그라운드 시)
- 충돌 정책: `updatedAt` 최신 우선, 수동 병합 UI 제공
- 업로드 큐: 사진 대량 업로드 시 직렬 처리 + 진행 표시

## 권한/에러 처리
- 카메라 권한: 명확한 요청 문구, 거부 시 대체 업로드 경로 제공
- 저장 용량: 사용량 표시, 오래된 캐시 정리 버튼
- 네트워크 배지: 상단 배너로 온라인/오프라인 상태 표시

## 성능
- 이미지: 긴 변 1600px, 품질 0.8 기본(가이드), 썸네일 320px
- 코드 스플리팅: 페이지 단위, 이미지 처리 유틸은 지연 로딩
- 지표: FCP/LCP, TTI, Input Latency 모니터링(후속)

