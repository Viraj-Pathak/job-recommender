"use client";
import { useApplications, STATUS_ORDER, type AppStatus } from "@/hooks/useApplications";
import { generateAllData } from "@/lib/data";
import Link from "next/link";
import { Kanban, ChevronRight, ChevronLeft, Trash2, ExternalLink, Plus } from "lucide-react";

const STATUS_META: Record<AppStatus, { label: string; color: string; bg: string }> = {
  saved:        { label: "Saved",        color: "text-gray-600 dark:text-gray-300",   bg: "bg-gray-100 dark:bg-gray-700" },
  applied:      { label: "Applied",      color: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-50 dark:bg-blue-900/20" },
  interviewing: { label: "Interviewing", color: "text-yellow-700 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
  offer:        { label: "Offer",        color: "text-green-700 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
  rejected:     { label: "Rejected",     color: "text-red-600 dark:text-red-400",     bg: "bg-red-50 dark:bg-red-900/20" },
};

export default function TrackerPage() {
  const { apps, move, remove, updateNotes, add, mounted } = useApplications();
  const { jobs } = generateAllData();

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  function handleAddRandom() {
    const untracked = jobs.filter(j => !apps.some(a => a.jobId === j.id));
    if (!untracked.length) return;
    const job = untracked[Math.floor(Math.random() * untracked.length)];
    add({ jobId: job.id, jobTitle: job.title, company: job.company });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <Kanban className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Application Tracker</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{apps.length} application{apps.length !== 1 ? "s" : ""} tracked</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddRandom}
            className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Random Job
          </button>
          <Link href="/jobs" className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Browse Jobs
          </Link>
        </div>
      </div>

      {apps.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-16 text-center">
          <Kanban className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No applications tracked yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            Click &ldquo;Apply Now&rdquo; on any job to start tracking, or add one above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
          {STATUS_ORDER.map(status => {
            const meta = STATUS_META[status];
            const col = apps.filter(a => a.status === status);
            const idx = STATUS_ORDER.indexOf(status);

            return (
              <div key={status} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${meta.bg}`}>
                  <span className={`text-sm font-bold ${meta.color}`}>{meta.label}</span>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({col.length})</span>
                </div>
                <div className="p-3 space-y-3">
                  {col.length === 0 && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">None</p>
                  )}
                  {col.map(app => (
                    <div key={app.jobId} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <div className="flex-1 min-w-0">
                          <Link href={`/jobs/${app.jobId}`} className="text-xs font-semibold text-gray-900 dark:text-white hover:text-blue-600 line-clamp-2 flex items-start gap-1">
                            {app.jobTitle}
                            <ExternalLink className="w-3 h-3 flex-shrink-0 mt-0.5 opacity-50" />
                          </Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{app.company}</p>
                        </div>
                        <button onClick={() => remove(app.jobId)} className="text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                        {new Date(app.addedAt).toLocaleDateString()}
                      </p>

                      <textarea
                        value={app.notes}
                        onChange={e => updateNotes(app.jobId, e.target.value)}
                        placeholder="Notes..."
                        rows={2}
                        className="w-full text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 resize-none bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
                      />

                      <div className="flex gap-1">
                        {idx > 0 && (
                          <button
                            onClick={() => move(app.jobId, "back")}
                            className="flex-1 flex items-center justify-center gap-1 text-xs border border-gray-200 dark:border-gray-600 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                          >
                            <ChevronLeft className="w-3 h-3" />
                            {STATUS_META[STATUS_ORDER[idx - 1]].label}
                          </button>
                        )}
                        {idx < STATUS_ORDER.length - 1 && (
                          <button
                            onClick={() => move(app.jobId, "forward")}
                            className="flex-1 flex items-center justify-center gap-1 text-xs bg-blue-600 text-white py-1 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            {STATUS_META[STATUS_ORDER[idx + 1]].label}
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
