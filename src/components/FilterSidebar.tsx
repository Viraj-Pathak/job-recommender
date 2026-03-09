"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { EXPERIENCE_LEVELS, LOCATIONS } from "@/lib/data";

export default function FilterSidebar() {
  const router = useRouter();
  const sp = useSearchParams();

  function update(key: string, value: string | null) {
    const params = new URLSearchParams(sp.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/jobs?${params.toString()}`);
  }

  const experience = sp.get("experience");
  const location = sp.get("location");
  const minSalary = sp.get("minSalary") ?? "";

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Filters</h2>

        {/* Experience Level */}
        <div className="mb-5">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Experience Level</h3>
          <div className="space-y-1.5">
            {EXPERIENCE_LEVELS.map(level => (
              <label key={level} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="experience"
                  checked={experience === level}
                  onChange={() => update("experience", experience === level ? null : level)}
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">{level}</span>
              </label>
            ))}
            {experience && (
              <button
                onClick={() => update("experience", null)}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="mb-5">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
          <select
            value={location ?? ""}
            onChange={e => update("location", e.target.value || null)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Locations</option>
            {LOCATIONS.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Min Salary */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Minimum Salary</h3>
          <select
            value={minSalary}
            onChange={e => update("minSalary", e.target.value || null)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any</option>
            <option value="60000">$60K+</option>
            <option value="80000">$80K+</option>
            <option value="100000">$100K+</option>
            <option value="130000">$130K+</option>
            <option value="150000">$150K+</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
