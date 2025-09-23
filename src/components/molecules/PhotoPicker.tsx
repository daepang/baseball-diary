"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { compressImage } from "@/lib/image";
import { COLORS } from "@/constants/color";

type Props = {
  photoIds: string[];
  onAdd: (file: File) => void | Promise<void>;
  onDelete: (photoId: string) => void | Promise<void>;
  capture?: "environment" | "user";
};

export default function PhotoPicker({
  photoIds,
  onAdd,
  onDelete,
  capture = "environment",
}: Props) {
  const [busy, setBusy] = useState(false);
  const [urls, setUrls] = useState<Record<string, string>>({});

  // Load thumbnails for provided photoIds
  // 의존성 배열의 정적 비교를 위해 id 리스트를 문자열로 캐시
  const ids = photoIds.join(",");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const map: Record<string, string> = {};
      for (const id of photoIds) {
        const p = await db.photos.get(id);
        if (p?.blob) {
          map[id] = URL.createObjectURL(p.blob);
        }
      }
      if (!cancelled)
        setUrls((prev) => {
          // revoke old urls not used anymore
          Object.entries(prev).forEach(([id, url]) => {
            if (!map[id]) URL.revokeObjectURL(url);
          });
          return map;
        });
    })();
    return () => {
      cancelled = true;
    };
  }, [ids, photoIds]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const inputEl = e.currentTarget;
    const file = inputEl.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const compressed = await compressImage(file, {
        maxSize: 1600,
        quality: 0.8,
      });
      await onAdd(compressed);
    } finally {
      setBusy(false);
      // React SyntheticEvent는 비동기 이후 currentTarget이 null일 수 있어 참조를 저장해 둡니다.
      if (inputEl) inputEl.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-sm opacity-80">사진</div>
      <div className="grid grid-cols-3 gap-2">
        {photoIds.map((id) => (
          <div
            key={id}
            className="relative w-full pb-[100%] overflow-hidden rounded border border-black/10 dark:border-white/10"
          >
            {urls[id] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={urls[id]}
                alt="photo"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs opacity-60">
                로딩중…
              </div>
            )}
            <button
              type="button"
              className="absolute top-1 right-1 rounded-full px-2 py-1 text-xs text-white shadow"
              style={{ backgroundColor: COLORS.BRAND }}
              onClick={(e) => {
                e.preventDefault();
                onDelete(id);
              }}
              aria-label="사진 삭제"
            >
              삭제
            </button>
          </div>
        ))}
        <label
          className="relative flex items-center justify-center w-full pb-[100%] rounded border-2 border-dashed cursor-pointer"
          style={{
            borderColor: COLORS.BRAND,
            backgroundColor: COLORS.BRAND_SOFT,
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center text-sm"
            style={{ color: COLORS.BASE.WHITE }}
          >
            {busy ? "업로드 중…" : "+ 사진 추가"}
          </div>
          <input
            className="hidden"
            type="file"
            accept="image/*"
            capture={capture}
            onChange={onFile}
            disabled={busy}
          />
        </label>
      </div>
    </div>
  );
}
