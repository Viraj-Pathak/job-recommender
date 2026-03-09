"use client";
import { useState, useEffect } from "react";

export type AppStatus = "saved" | "applied" | "interviewing" | "offer" | "rejected";

export interface Application {
  jobId: number;
  jobTitle: string;
  company: string;
  status: AppStatus;
  addedAt: string;
  notes: string;
}

const STATUS_ORDER: AppStatus[] = ["saved", "applied", "interviewing", "offer", "rejected"];

export function useApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const s = localStorage.getItem("applications");
      if (s) setApps(JSON.parse(s));
    } catch {}
  }, []);

  function persist(next: Application[]) {
    setApps(next);
    localStorage.setItem("applications", JSON.stringify(next));
  }

  function add(app: Omit<Application, "addedAt" | "status" | "notes">) {
    const existing = apps.find(a => a.jobId === app.jobId);
    if (existing) return;
    persist([...apps, { ...app, status: "applied", addedAt: new Date().toISOString(), notes: "" }]);
  }

  function move(jobId: number, direction: "forward" | "back") {
    persist(apps.map(a => {
      if (a.jobId !== jobId) return a;
      const idx = STATUS_ORDER.indexOf(a.status);
      const next = direction === "forward"
        ? STATUS_ORDER[Math.min(idx + 1, STATUS_ORDER.length - 1)]
        : STATUS_ORDER[Math.max(idx - 1, 0)];
      return { ...a, status: next };
    }));
  }

  function remove(jobId: number) {
    persist(apps.filter(a => a.jobId !== jobId));
  }

  function updateNotes(jobId: number, notes: string) {
    persist(apps.map(a => a.jobId === jobId ? { ...a, notes } : a));
  }

  function isTracked(jobId: number) {
    return apps.some(a => a.jobId === jobId);
  }

  return { apps, add, move, remove, updateNotes, isTracked, mounted };
}

export { STATUS_ORDER };
