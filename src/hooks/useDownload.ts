"use client";
import { useCallback } from "react";

/**
 * 클라이언트 전용 파일 다운로드 유틸 훅입니다.
 * DOM 접근을 내부에 캡슐화하고 SSR 환경에서는 동작하지 않도록 가드합니다.
 */
export function useDownloadBlob() {
  return useCallback((blob: Blob, filename: string) => {
    if (typeof window === "undefined") return; // SSR 환경 가드
    const url = URL.createObjectURL(blob);
    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.rel = "noopener";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      URL.revokeObjectURL(url);
    }
  }, []);
}
