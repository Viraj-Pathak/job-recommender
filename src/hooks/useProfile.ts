"use client";
import { useState, useEffect } from "react";

export type SkillLevel = "Beginner" | "Intermediate" | "Expert";
export type WorkType = "Remote" | "Hybrid" | "On-site";
export type Availability = "Immediately" | "2 weeks" | "1 month" | "3+ months" | "Not looking";

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface UserProfile {
  // Identity
  name: string;
  title: string;
  bio: string;
  location: string;
  avatarColor: string;

  // Skills & Experience
  skills: string[];
  skillLevels: Record<string, SkillLevel>;
  experienceYears: number;

  // Job Preferences
  desiredRoles: string[];
  preferredLocations: string[];
  workTypes: WorkType[];
  salaryMin: number;
  salaryMax: number;
  availability: Availability;

  // Education
  degree: string;
  fieldOfStudy: string;
  university: string;
  graduationYear: string;

  // Certifications
  certifications: Certification[];

  // Links
  github: string;
  linkedin: string;
  portfolio: string;
}

export const DEFAULT_PROFILE: UserProfile = {
  name: "",
  title: "",
  bio: "",
  location: "",
  avatarColor: "from-blue-600 to-indigo-600",
  skills: [],
  skillLevels: {},
  experienceYears: 0,
  desiredRoles: [],
  preferredLocations: [],
  workTypes: [],
  salaryMin: 60000,
  salaryMax: 120000,
  availability: "Immediately",
  degree: "",
  fieldOfStudy: "",
  university: "",
  graduationYear: "",
  certifications: [],
  github: "",
  linkedin: "",
  portfolio: "",
};

export const AVATAR_COLORS = [
  "from-blue-600 to-indigo-600",
  "from-violet-600 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-rose-600",
  "from-pink-500 to-fuchsia-600",
  "from-sky-500 to-cyan-600",
];

export function computeCompleteness(p: UserProfile): number {
  let score = 0;
  if (p.name) score += 10;
  if (p.title) score += 10;
  if (p.bio && p.bio.length > 20) score += 10;
  if (p.location) score += 5;
  if (p.skills.length >= 3) score += 20;
  if (p.experienceYears > 0) score += 5;
  if (p.workTypes.length > 0) score += 5;
  if (p.preferredLocations.length > 0) score += 5;
  if (p.salaryMin > 0 && p.salaryMax > 0) score += 5;
  if (p.availability) score += 5;
  if (p.degree && p.university) score += 10;
  if (p.certifications.length > 0) score += 5;
  if (p.github || p.linkedin || p.portfolio) score += 5;
  return Math.min(score, 100);
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const s = localStorage.getItem("userProfile");
      if (s) {
        const parsed = JSON.parse(s);
        // Merge with defaults to handle old data missing new fields
        setProfile({ ...DEFAULT_PROFILE, ...parsed });
      }
    } catch {}
  }, []);

  function save(p: UserProfile) {
    setProfile(p);
    localStorage.setItem("userProfile", JSON.stringify(p));
  }

  return { profile, save, mounted };
}
