"use client";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { generateAllData } from "@/lib/data";
import JobCard from "@/components/JobCard";
import Link from "next/link";
import { Bookmark, Search } from "lucide-react";

export default function SavedJobsPage() {
  const { saved, mounted } = useSavedJobs();
  const { jobs } = generateAllData();
  const savedJobs = jobs.filter(j => saved.includes(j.id));

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
          <Bookmark className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Jobs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{savedJobs.length} saved position{savedJobs.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-16 text-center">
          <Bookmark className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No saved jobs yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Tap the bookmark icon on any job card to save it here.</p>
          <Link href="/jobs" className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
            <Search className="w-4 h-4" /> Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      )}
    </div>
  );
}
