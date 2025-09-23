"use client";
import React from "react";
import { COLORS } from "@/constants/color";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
};

export default function Button({
  className = "",
  variant = "primary",
  fullWidth = true,
  ...rest
}: Props) {
  const base =
    "rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:opacity-95 active:opacity-90";
  const map: Record<NonNullable<Props["variant"]>, string> = {
    primary: "text-white",
    secondary: "border bg-transparent text-current",
    ghost: "bg-transparent text-current",
  };
  const width = fullWidth ? "w-full" : "";
  const style: React.CSSProperties =
    variant === "primary"
      ? { backgroundColor: COLORS.BRAND, color: COLORS.BASE.WHITE }
      : variant === "secondary"
      ? { borderColor: COLORS.BRAND, color: COLORS.BRAND }
      : {};
  return (
    <button
      className={`${base} ${map[variant]} ${width} ${className}`}
      style={style}
      {...rest}
    />
  );
}
