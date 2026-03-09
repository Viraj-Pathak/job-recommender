"use client";
import { useState, Suspense } from "react";
import { generateAllData } from "@/lib/data";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import FilterSidebar from "@/components/FilterSidebar";
import EmailAlertModal from "@/components/EmailAlertModal";
import { Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import type { ExperienceLevel } from "@/lib/data";

const PAGE_SIZE = 12;

function JobsContent() {
  const sp = useSearchParams();
  const [alertOpen, setAlertOpen] = useState(false);

  let { jobs } = generateAllData();

  const q = sp.get("q")?.toLowerCase();
  const experience = sp.get("experience") as ExperienceLevel | null;
  const location = sp.get("location");
  const minSalary = sp.get("minSalary");
  const page = Math.max(1, parseInt(sp.get("page") ?? "1"));

  if (q) jobs = jobs.filter(j =>
    j.title.toLowerCase().includes(q) ||
    j.requiredSkills.some(s => s.toLowerCase().includes(q)) ||
    j.company.toLowerCase().includes(q)
  );
  if (experience) jobs = jobs.filter(j => j.experienceLevel === experience);
  if (location) jobs = jobs.filter(j => j.location === location);
  if (minSalary) jobs = jobs.filter(j => j.salary >= parseInt(minSalary));

  const totalPages = Math.ceil(jobs.length / PAGE_SIZE);
  const paginated = jobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function pageUrl(p: number) {
    const params = new URLSearchParams(sp.toString());
    params.set("page", String(p));
    return `/jobs?${params.toString()}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Find Jobs</h1>
          <button
            onClick={() => setAlertOpen(true)}
            className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Bell className="w-4 h-4 text-blue-600" /> Set Job Alert
          </button>
        </div>
        <SearchBar />
      </div>

      <div className="flex gap-6 items-start">
        <FilterSidebar />

        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
            {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
          </p>

          {paginated.length === 0 ? (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <p className="text-lg font-medium">No jobs match your filters.</p>
              <p className="text-sm mt-1">Try adjusting your search or clearing filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginated.map(job => <JobCard key={job.id} job={job} />)}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {page > 1 ? (
                    <a href={pageUrl(page - 1)} className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </a>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-300 dark:text-gray-600 cursor-not-allowed">
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </span>
                  )}
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <a key={p} href={pageUrl(p)} className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                        p === page ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}>{p}</a>
                    ))}
                  </div>
                  {page < totalPages ? (
                    <a href={pageUrl(page + 1)} className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      Next <ChevronRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-300 dark:text-gray-600 cursor-not-allowed">
                      Next <ChevronRight className="w-4 h-4" />
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {alertOpen && <EmailAlertModal query={q} onClose={() => setAlertOpen(false)} />}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense>
      <JobsContent />
    </Suspense>
  );
}
