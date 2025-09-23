"use client";
import React from "react";
import { COLORS } from "@/constants/color";

export default function Label({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={`text-sm ${className}`} style={{ color: COLORS.BRAND_DARK }}>
      {children}
    </span>
  );
}
