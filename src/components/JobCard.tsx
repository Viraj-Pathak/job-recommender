"use client";
import Link from "next/link";
import { MapPin, DollarSign, Clock, Bookmark, BookmarkCheck } from "lucide-react";
import type { Job } from "@/lib/data";
import { useSavedJobs } from "@/hooks/useSavedJobs";

const COMPANY_COLORS: Record<string, string> = {
  TechCorp: "bg-blue-600",
  "DataFlow Inc": "bg-emerald-600",
  CloudBase: "bg-sky-600",
  InnovateTech: "bg-violet-600",
  "NextGen AI": "bg-orange-500",
  ByteWorks: "bg-rose-600",
  PixelSoft: "bg-pink-600",
  AgileHub: "bg-teal-600",
};

const EXP_BADGE: Record<string, string> = {
  Junior: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Mid: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Senior: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

function formatSalary(n: number) {
  return `$${(n / 1000).toFixed(0)}K`;
}

interface Props {
  job: Job;
  matchScore?: number;
}

export default function JobCard({ job, matchScore }: Props) {
  const { isSaved, toggle, mounted } = useSavedJobs();
  const saved = mounted && isSaved(job.id);

  const initials = job.company
    .split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("");
  const color = COMPANY_COLORS[job.company] ?? "bg-gray-600";
  const visibleSkills = job.requiredSkills.slice(0, 4);
  const extra = job.requiredSkills.length - visibleSkills.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group">
      <div className="flex items-start justify-between gap-3">
        {/* Company avatar */}
        <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${EXP_BADGE[job.experienceLevel]}`}>
              {job.experienceLevel}
            </span>
            {matchScore !== undefined && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                {Math.round(matchScore * 100)}% match
              </span>
            )}
          </div>
          <Link href={`/jobs/${job.id}`}>
            <h3 className="font-semibold text-gray-900 dark:text-white mt-1 group-hover:text-blue-600 transition-colors leading-snug">
              {job.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{job.company}</p>
        </div>

        <button
          onClick={() => toggle(job.id)}
          className={`flex-shrink-0 mt-1 transition-colors ${saved ? "text-blue-600" : "text-gray-400 hover:text-blue-600"}`}
          title={saved ? "Unsave" : "Save job"}
        >
          {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5" />
          {formatSalary(job.salary)}/yr
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {job.postedDaysAgo === 0 ? "Today" : `${job.postedDaysAgo}d ago`}
        </span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {visibleSkills.map(skill => (
          <span key={skill} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
            {skill}
          </span>
        ))}
        {extra > 0 && (
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 px-2 py-0.5 rounded-full">
            +{extra} more
          </span>
        )}
      </div>

      {/* Apply button */}
      <div className="mt-4">
        <Link
          href={`/jobs/${job.id}`}
          className="block text-center bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
}
