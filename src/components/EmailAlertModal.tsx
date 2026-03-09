"use client";
import { useState } from "react";
import { X, Bell, CheckCircle2 } from "lucide-react";

interface Props {
  query?: string;
  onClose: () => void;
}

export default function EmailAlertModal({ query, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Job Alert</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get notified instantly</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              We&apos;ll email you when new{query ? ` <strong>${query}</strong>` : ""} jobs are posted matching your preferences.
            </p>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button type="submit" className="flex-1 bg-blue-600 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
                Set Alert
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Alert Set!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">We&apos;ll notify <strong>{email}</strong> when matching jobs are posted.</p>
            <button onClick={onClose} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
