"use client";
import React from "react";
import { COLORS } from "@/constants/color";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className = "", children, style, ...props }, ref) => (
  <select
    ref={ref}
    className={`w-full rounded border px-3 py-2 bg-transparent focus:outline-none ${className}`}
    style={{ ...(style || {}), borderColor: COLORS.BRAND_DARK }}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
export default Select;
