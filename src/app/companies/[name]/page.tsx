import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Users, Briefcase } from "lucide-react";
import { generateAllData } from "@/lib/data";
import JobCard from "@/components/JobCard";

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

export default function CompanyPage({ params }: { params: { name: string } }) {
  const companyName = decodeURIComponent(params.name);
  const { jobs } = generateAllData();
  const companyJobs = jobs.filter(j => j.company === companyName);

  if (!companyJobs.length) notFound();

  const color = COMPANY_COLORS[companyName] ?? "bg-gray-600";
  const initials = companyName.split(" ").map(w => w[0]).slice(0, 2).join("");
  const avgSalary = Math.round(companyJobs.reduce((s, j) => s + j.salary, 0) / companyJobs.length);
  const locations = [...new Set(companyJobs.map(j => j.location))];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Link>

      {/* Company header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
        <div className="flex items-start gap-6 flex-wrap">
          <div className={`${color} w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0`}>
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{companyName}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Leading technology company driving innovation.</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-gray-400" />{companyJobs.length} open positions</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" />{locations.join(", ")}</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-gray-400" />200–1,000 employees</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">${Math.round(avgSalary / 1000)}K</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Avg. salary</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(["Junior", "Mid", "Senior"] as const).map(level => {
          const count = companyJobs.filter(j => j.experienceLevel === level).length;
          return (
            <div key={level} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">{count}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{level} roles</div>
            </div>
          );
        })}
      </div>

      {/* Jobs */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Open Positions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companyJobs.map(job => <JobCard key={job.id} job={job} />)}
      </div>
    </div>
  );
}
