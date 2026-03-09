import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, DollarSign, Clock, ArrowLeft, Share2, CheckCircle2, Building2 } from "lucide-react";
import { generateAllData } from "@/lib/data";
import SkillGap from "@/components/SkillGap";
import JobActions from "./JobActions";

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

const PERKS = [
  "Competitive salary & equity",
  "Remote-friendly / flexible hours",
  "Health, dental & vision insurance",
  "401(k) with company match",
  "Learning & development budget",
  "Home office stipend",
];

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { jobs } = generateAllData();
  const job = jobs.find(j => j.id === parseInt(params.id));
  if (!job) notFound();

  const color = COMPANY_COLORS[job.company] ?? "bg-gray-600";
  const initials = job.company.split(" ").map(w => w[0]).slice(0, 2).join("");
  const similar = jobs
    .filter(j => j.id !== job.id && (j.baseTitle === job.baseTitle || j.requiredSkills.some(s => job.requiredSkills.includes(s))))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Link>

      <div className="flex gap-8 items-start">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-5">
            <div className="flex items-start gap-4">
              <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${EXP_BADGE[job.experienceLevel]}`}>
                    {job.experienceLevel}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Posted {job.postedDaysAgo === 0 ? "today" : `${job.postedDaysAgo} days ago`}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
                <Link href={`/companies/${encodeURIComponent(job.company)}`} className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400 mt-1 font-medium hover:text-blue-600 transition-colors">
                  <Building2 className="w-4 h-4" />{job.company}
                </Link>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{job.location}</span>
                  <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" />${job.salary.toLocaleString()}/year</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />Full-time</span>
                </div>
              </div>
              <button className="p-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-300 transition-colors flex-shrink-0">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            {/* Client-side Apply + Track buttons */}
            <JobActions job={job} />
          </div>

          {/* Skill Gap (client — reads localStorage profile) */}
          <div className="mb-5">
            <SkillGap requiredSkills={job.requiredSkills} />
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About the Role</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{job.description}</p>

            <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-6 mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map(skill => (
                <span key={skill} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                  {skill}
                </span>
              ))}
            </div>

            <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-6 mb-3">What You&apos;ll Do</h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />Design and build scalable systems using {job.requiredSkills[0]} and {job.requiredSkills[1] ?? "modern tooling"}</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />Collaborate with cross-functional teams across product, design, and operations</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />Participate in code reviews and contribute to engineering best practices</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />Drive improvements to performance, reliability, and maintainability</li>
            </ul>

            <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-6 mb-3">Perks & Benefits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PERKS.map(perk => (
                <div key={perk} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />{perk}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-80 flex-shrink-0 space-y-5 hidden lg:block">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">About {job.company}</h3>
            <div className={`${color} w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-3`}>
              {initials}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {job.company} is a leading technology company focused on innovation and growth.
            </p>
            <div className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex justify-between"><span>Industry</span><span className="font-medium text-gray-700 dark:text-gray-200">Technology</span></div>
              <div className="flex justify-between"><span>Size</span><span className="font-medium text-gray-700 dark:text-gray-200">200–1,000</span></div>
              <div className="flex justify-between"><span>Founded</span><span className="font-medium text-gray-700 dark:text-gray-200">2015</span></div>
            </div>
            <Link href={`/companies/${encodeURIComponent(job.company)}`} className="block mt-4 text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              View all {job.company} jobs
            </Link>
          </div>

          {similar.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Similar Jobs</h3>
              <div className="space-y-4">
                {similar.map(j => (
                  <div key={j.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
                    <Link href={`/jobs/${j.id}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                      {j.title}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{j.company} · {j.location}</p>
                    <p className="text-xs text-gray-400 mt-0.5">${(j.salary / 1000).toFixed(0)}K/yr</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
