"use client";
import React from "react";
import Field from "@/components/molecules/Field";
import TextArea from "@/components/atoms/TextArea";

type Props = React.ComponentProps<typeof TextArea> & {
  label: React.ReactNode;
  helpText?: React.ReactNode;
};

export default function TextAreaField({ label, helpText, ...props }: Props) {
  return (
    <Field label={label} helpText={helpText}>
      <TextArea {...props} />
    </Field>
  );
}

