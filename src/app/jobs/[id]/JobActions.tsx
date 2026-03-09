"use client";
import { useState } from "react";
import { Kanban, CheckCircle2 } from "lucide-react";
import type { Job } from "@/lib/data";
import ApplyModal from "@/components/ApplyModal";
import { useApplications } from "@/hooks/useApplications";

interface Props {
  job: Job;
}

export default function JobActions({ job }: Props) {
  const [applyOpen, setApplyOpen] = useState(false);
  const { add, isTracked, mounted } = useApplications();
  const tracked = mounted && isTracked(job.id);

  return (
    <>
      <div className="flex gap-3 mt-5">
        <button
          onClick={() => setApplyOpen(true)}
          className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Apply Now
        </button>
        <button
          onClick={() => add({ jobId: job.id, jobTitle: job.title, company: job.company })}
          disabled={tracked}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm border-2 transition-colors ${
            tracked
              ? "border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 cursor-default"
              : "border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          }`}
        >
          {tracked ? <><CheckCircle2 className="w-4 h-4" /> Tracked</> : <><Kanban className="w-4 h-4" /> Track</>}
        </button>
      </div>

      {applyOpen && <ApplyModal job={job} onClose={() => setApplyOpen(false)} />}
    </>
  );
}
