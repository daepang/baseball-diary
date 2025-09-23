"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import type { Entry } from "@/types";

export function useStats() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [stadiumCount, setStadiumCount] = useState<number>(0);

  useEffect(() => {
    db.entries.toArray().then((arr) => {
      setEntries(arr);
      const ratings = arr.map((e) => e.rating).filter((n): n is number => typeof n === "number");
      setAvgRating(ratings.length ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)) : null);
      setStadiumCount(new Set(arr.map((e) => e.stadiumId).filter(Boolean)).size);
    });
  }, []);

  return { entries, avgRating, stadiumCount };
}

