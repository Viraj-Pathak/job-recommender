"use client";
import { useState, useEffect } from "react";
import { Zap, Loader2, ChevronDown, ChevronUp, BarChart2, Info } from "lucide-react";
import { SKILLS_POOL } from "@/lib/data";
import type { ScoredJob } from "@/lib/recommender";
import JobCard from "@/components/JobCard";
import { useProfile } from "@/hooks/useProfile";
import Link from "next/link";

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-gray-600 dark:text-gray-300 w-8 text-right font-medium">{pct}%</span>
    </div>
  );
}

function ScoredJobCard({ job }: { job: ScoredJob }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="flex flex-col">
      <JobCard job={job} matchScore={job.hybridScore} />
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-center gap-1 text-xs text-blue-600 py-1.5 bg-blue-50 dark:bg-blue-900/10 rounded-b-xl border border-t-0 border-blue-100 dark:border-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
      >
        <BarChart2 className="w-3.5 h-3.5" />
        {expanded ? "Hide" : "Show"} score breakdown
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      {expanded && (
        <div className="bg-white dark:bg-gray-800 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-xl px-4 py-3 space-y-2">
          <ScoreBar label="Content" value={job.contentScore} color="bg-blue-500" />
          <ScoreBar label="Collab" value={job.collabScore} color="bg-indigo-500" />
          <ScoreBar label="Hybrid" value={job.hybridScore} color="bg-amber-500" />
          <p className="text-xs text-gray-400 dark:text-gray-500 pt-1 flex items-start gap-1">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            Content: skill overlap · Collab: similar users liked this · Hybrid: 50/50 blend
          </p>
        </div>
      )}
    </div>
  );
}

export default function RecommendPage() {
  const { profile, mounted } = useProfile();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [expYears, setExpYears] = useState(0);
  const [results, setResults] = useState<ScoredJob[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAllSkills, setShowAllSkills] = useState(false);

  useEffect(() => {
    if (mounted && profile.skills.length > 0) {
      setSelectedSkills(profile.skills);
      setExpYears(profile.experienceYears);
    }
  }, [mounted, profile]);

  const visibleSkills = showAllSkills ? SKILLS_POOL : SKILLS_POOL.slice(0, 15);
  const expLevel = expYears < 2 ? "Junior" : expYears < 6 ? "Mid" : "Senior";

  function toggleSkill(skill: string) {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSkills.length) { setError("Please select at least one skill."); return; }
    setError("");
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: selectedSkills, experienceYears: expYears }),
      });
      setResults(await res.json());
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          <Zap className="w-4 h-4" /> AI-Powered Matching
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Find Jobs Tailored for You
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
          Tell us your skills and experience — our hybrid ML engine will recommend your best-fit roles.
        </p>
        {mounted && profile.skills.length > 0 && (
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
            ✓ Pre-filled from your <Link href="/profile" className="underline">saved profile</Link>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="mb-6">
          <label className="block text-base font-semibold text-gray-900 dark:text-white mb-1">
            Your Skills <span className="ml-2 text-sm font-normal text-gray-400">({selectedSkills.length} selected)</span>
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Select all that apply:</p>
          <div className="flex flex-wrap gap-2">
            {visibleSkills.map(skill => (
              <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  selectedSkills.includes(skill)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:text-blue-600"
                }`}
              >{skill}</button>
            ))}
          </div>
          <button type="button" onClick={() => setShowAllSkills(!showAllSkills)} className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1">
            {showAllSkills ? <><ChevronUp className="w-4 h-4" />Show less</> : <><ChevronDown className="w-4 h-4" />Show all {SKILLS_POOL.length} skills</>}
          </button>
          {selectedSkills.length > 0 && (
            <button type="button" onClick={() => setSelectedSkills([])} className="mt-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 block">Clear all</button>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-base font-semibold text-gray-900 dark:text-white mb-3">
            Years of Experience <span className="ml-3 text-blue-600">{expYears} yr{expYears !== 1 ? "s" : ""}</span>
            <span className="ml-2 text-sm font-normal text-gray-400">({expLevel})</span>
          </label>
          <input type="range" min={0} max={20} value={expYears} onChange={e => setExpYears(parseInt(e.target.value))} className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span><span>Junior (&lt;2)</span><span>Mid (2–5)</span><span>Senior (6+)</span><span>20</span>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-base">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Finding your matches...</> : <><Zap className="w-5 h-5" />Get My Recommendations</>}
        </button>
      </form>

      {results !== null && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Your Top Matches</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Ranked by hybrid score — expand any card to see the content vs. collaborative breakdown.
          </p>
          {results.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-10 text-center text-gray-500">
              No matches found. Try adding more skills.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map(job => <ScoredJobCard key={job.id} job={job} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
