"use client";
import React from "react";
import Field from "@/components/molecules/Field";
import Input from "@/components/atoms/Input";

type Props = React.ComponentProps<typeof Input> & {
  label: React.ReactNode;
  helpText?: React.ReactNode;
};

export default function InputField({ label, helpText, ...props }: Props) {
  return (
    <Field label={label} helpText={helpText}>
      <Input {...props} />
    </Field>
  );
}

