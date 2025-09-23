"use client";
import React from "react";
import Label from "@/components/atoms/Label";

type Props = {
  label: React.ReactNode;
  children: React.ReactNode;
  helpText?: React.ReactNode;
  className?: string;
};

export default function Field({ label, children, helpText, className = "" }: Props) {
  return (
    <label className={`grid gap-1 w-full min-w-0 ${className}`}>
      <Label>{label}</Label>
      {children}
      <div className="text-xs opacity-70 min-h-4" aria-hidden={!helpText}>
        {helpText}
      </div>
    </label>
  );
}
