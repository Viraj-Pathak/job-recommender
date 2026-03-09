"use client";
import { useState } from "react";
import { X, Upload, CheckCircle2, Briefcase } from "lucide-react";
import type { Job } from "@/lib/data";
import { useApplications } from "@/hooks/useApplications";

interface Props {
  job: Job;
  onClose: () => void;
}

export default function ApplyModal({ job, onClose }: Props) {
  const { add } = useApplications();
  const [step, setStep] = useState<"form" | "success">("form");
  const [form, setForm] = useState({ name: "", email: "", phone: "", linkedin: "", cover: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    add({ jobId: job.id, jobTitle: job.title, company: job.company });
    setStep("success");
  }

  function set(field: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Apply for this Role</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{job.title} · {job.company}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === "form" ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
              <input required value={form.name} onChange={e => set("name", e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
              <input required type="email" value={form.email} onChange={e => set("email", e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="jane@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input value={form.phone} onChange={e => set("phone", e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 555 0000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn</label>
                <input value={form.linkedin} onChange={e => set("linkedin", e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="linkedin.com/in/..." />
              </div>
            </div>
            {/* Resume upload (visual only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resume</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Drop your resume here or <span className="text-blue-600">browse</span></p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOC up to 5 MB</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Letter</label>
              <textarea value={form.cover} onChange={e => set("cover", e.target.value)} rows={4}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Tell us why you're a great fit..." />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Briefcase className="w-5 h-5" /> Submit Application
            </button>
          </form>
        ) : (
          <div className="p-10 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been sent. It&apos;s also been added to your tracker.</p>
            <button onClick={onClose} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
