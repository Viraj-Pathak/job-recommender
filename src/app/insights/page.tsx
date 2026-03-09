import { generateAllData, SKILLS_POOL } from "@/lib/data";
import { BarChart2, TrendingUp, MapPin, Building2 } from "lucide-react";

function Bar({ pct, color = "bg-blue-500" }: { pct: number; color?: string }) {
  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
      <div className={`${color} h-3 rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function InsightsPage() {
  const { jobs } = generateAllData();

  // Salary by experience level
  const levels = ["Junior", "Mid", "Senior"] as const;
  const salaryByLevel = levels.map(level => {
    const grp = jobs.filter(j => j.experienceLevel === level);
    const avg = grp.reduce((s, j) => s + j.salary, 0) / (grp.length || 1);
    return { level, avg, count: grp.length };
  });
  const maxSalary = Math.max(...salaryByLevel.map(s => s.avg));

  // Top skills
  const skillCount: Record<string, number> = {};
  jobs.forEach(j => j.requiredSkills.forEach(s => { skillCount[s] = (skillCount[s] ?? 0) + 1; }));
  const topSkills = SKILLS_POOL
    .map(s => ({ skill: s, count: skillCount[s] ?? 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
  const maxSkill = Math.max(...topSkills.map(s => s.count));

  // Jobs by location
  const locCount: Record<string, number> = {};
  jobs.forEach(j => { locCount[j.location] = (locCount[j.location] ?? 0) + 1; });
  const topLocs = Object.entries(locCount).sort((a, b) => b[1] - a[1]);
  const maxLoc = Math.max(...topLocs.map(l => l[1]));

  // Jobs by company
  const compCount: Record<string, number> = {};
  jobs.forEach(j => { compCount[j.company] = (compCount[j.company] ?? 0) + 1; });
  const topComps = Object.entries(compCount).sort((a, b) => b[1] - a[1]);
  const maxComp = Math.max(...topComps.map(c => c[1]));

  const LEVEL_COLORS: Record<string, string> = {
    Junior: "bg-green-500",
    Mid: "bg-blue-500",
    Senior: "bg-purple-500",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Market Insights</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Based on {jobs.length} active job listings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary by level */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Average Salary by Level</h2>
          </div>
          <div className="space-y-4">
            {salaryByLevel.map(({ level, avg, count }) => (
              <div key={level}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{level}</span>
                  <span className="text-gray-500 dark:text-gray-400">${Math.round(avg / 1000)}K avg · {count} jobs</span>
                </div>
                <Bar pct={(avg / maxSalary) * 100} color={LEVEL_COLORS[level]} />
              </div>
            ))}
          </div>
        </div>

        {/* Top skills */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 className="w-5 h-5 text-blue-500" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Most In-Demand Skills</h2>
          </div>
          <div className="space-y-2.5">
            {topSkills.map(({ skill, count }) => (
              <div key={skill} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-300 w-28 flex-shrink-0 truncate">{skill}</span>
                <Bar pct={(count / maxSkill) * 100} color="bg-blue-500" />
                <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs by location */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-5">
            <MapPin className="w-5 h-5 text-rose-500" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Jobs by Location</h2>
          </div>
          <div className="space-y-2.5">
            {topLocs.map(([loc, count]) => (
              <div key={loc} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-300 w-28 flex-shrink-0">{loc}</span>
                <Bar pct={(count / maxLoc) * 100} color="bg-rose-400" />
                <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs by company */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="w-5 h-5 text-violet-500" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Top Hiring Companies</h2>
          </div>
          <div className="space-y-2.5">
            {topComps.map(([company, count]) => (
              <div key={company} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-300 w-28 flex-shrink-0 truncate">{company}</span>
                <Bar pct={(count / maxComp) * 100} color="bg-violet-400" />
                <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {[
          { label: "Total Jobs", value: jobs.length },
          { label: "Avg Salary", value: `$${Math.round(jobs.reduce((s, j) => s + j.salary, 0) / jobs.length / 1000)}K` },
          { label: "Remote Roles", value: jobs.filter(j => j.location === "Remote").length },
          { label: "Senior Roles", value: jobs.filter(j => j.experienceLevel === "Senior").length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
