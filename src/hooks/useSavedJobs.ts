"use client";
import { useState, useEffect } from "react";

export function useSavedJobs() {
  const [saved, setSaved] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const s = localStorage.getItem("savedJobs");
      if (s) setSaved(JSON.parse(s));
    } catch {}
  }, []);

  function toggle(jobId: number) {
    setSaved(prev => {
      const next = prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId];
      localStorage.setItem("savedJobs", JSON.stringify(next));
      return next;
    });
  }

  return {
    saved,
    toggle,
    isSaved: (id: number) => saved.includes(id),
    mounted,
  };
}
