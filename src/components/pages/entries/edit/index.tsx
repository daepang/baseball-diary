"use client";
import { useEffect, useState } from "react";
import RecordPageView from "@/components/pages/record";
import { db } from "@/lib/db";
import type { Entry } from "@/types";

export default function EntryEditPageView({ id }: { id: string }) {
  const [initial, setInitial] = useState<Partial<Entry> | null>(null);

  useEffect(() => {
    db.entries.get(id).then((e) => {
      if (e) setInitial(e);
    });
  }, [id]);

  if (!initial) return <div className="opacity-70">로딩 중...</div>;
  return <RecordPageView initialEntry={initial} />;
}
