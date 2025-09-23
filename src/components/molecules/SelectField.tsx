"use client";
import React from "react";
import Field from "@/components/molecules/Field";
import Select from "@/components/atoms/Select";

type Props = React.ComponentProps<typeof Select> & {
  label: React.ReactNode;
  helpText?: React.ReactNode;
};

export default function SelectField({ label, helpText, children, ...props }: Props) {
  return (
    <Field label={label} helpText={helpText}>
      <Select {...props}>{children}</Select>
    </Field>
  );
}

