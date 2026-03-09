"use client";
import { useProfile } from "@/hooks/useProfile";
import Link from "next/link";

interface Props {
  requiredSkills: string[];
}

export default function SkillGap({ requiredSkills }: Props) {
  const { profile, mounted } = useProfile();

  if (!mounted) return null;

  if (!profile.skills.length) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <Link href="/profile" className="font-semibold underline">Set up your profile</Link> to see how well your skills match this role.
        </p>
      </div>
    );
  }

  const userSet = new Set(profile.skills.map(s => s.toLowerCase()));
  const matched = requiredSkills.filter(s => userSet.has(s.toLowerCase()));
  const missing = requiredSkills.filter(s => !userSet.has(s.toLowerCase()));
  const pct = Math.round((matched.length / requiredSkills.length) * 100);

  const barColor = pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Your Skill Match</h2>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div className={`${barColor} h-3 rounded-full transition-all`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm font-bold text-gray-900 dark:text-white w-12 text-right">{pct}%</span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        You have {matched.length} of {requiredSkills.length} required skills
      </p>

      {matched.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1.5">You have:</p>
          <div className="flex flex-wrap gap-1.5">
            {matched.map(s => (
              <span key={s} className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                ✓ {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {missing.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-red-500 dark:text-red-400 mb-1.5">Missing:</p>
          <div className="flex flex-wrap gap-1.5">
            {missing.map(s => (
              <span key={s} className="text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium border border-red-200 dark:border-red-800">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
