"use client";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { COLORS } from "@/constants/color";

type ToastItem = { id: string; message: string; expiresAt: number };
type ToastContextValue = { show: (message: string, durationMs?: number) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, durationMs = 2000) => {
    const id = crypto.randomUUID();
    const expiresAt = Date.now() + durationMs;
    setToasts((prev) => [...prev, { id, message, expiresAt }]);
    // 스스로 사라짐
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, durationMs);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-16 md:bottom-20 flex justify-center z-50">
        <div className="space-y-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="pointer-events-auto mx-auto rounded-lg px-3 py-2 text-sm shadow-lg text-white"
              style={{ backgroundColor: COLORS.BRAND }}
            >
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
