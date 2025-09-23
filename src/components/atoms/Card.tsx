"use client";
import React from "react";
import { COLORS } from "@/constants/color";

export default function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const style: React.CSSProperties = { borderColor: COLORS.BRAND_SOFT };
  return (
    <div className={`rounded-lg border p-4 ${className}`} style={style}>
      {children}
    </div>
  );
}

export function GradientCard({
  from,
  to,
  className = "",
  children,
}: {
  from: string;
  to: string;
  className?: string;
  children: React.ReactNode;
}) {
  const style: React.CSSProperties = {
    background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
  };
  return (
    <div className={`rounded-2xl p-4 text-white ${className}`} style={style}>
      {children}
    </div>
  );
}
