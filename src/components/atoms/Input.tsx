"use client";
import React from "react";
import { COLORS } from "@/constants/color";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", style, ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full rounded border px-3 py-2 bg-transparent focus:outline-none ${className}`}
    style={{ ...(style || {}), borderColor: COLORS.BRAND_DARK }}
    {...props}
  />
));
Input.displayName = "Input";
export default Input;
