"use client";
import React from "react";
import { COLORS } from "@/constants/color";

const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", rows = 4, style, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={`w-full rounded border px-3 py-2 bg-transparent focus:outline-none ${className}`}
    style={{ ...(style || {}), borderColor: COLORS.BRAND_DARK }}
    {...props}
  />
));
TextArea.displayName = "TextArea";
export default TextArea;
