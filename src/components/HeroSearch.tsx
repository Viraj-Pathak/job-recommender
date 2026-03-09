"use client";
import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const POPULAR_SEARCHES = [
  "React Developer", "Data Scientist", "ML Engineer", "DevOps", "Product Manager",
];

export default function HeroSearch() {
  const [value, setValue] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/jobs?q=${encodeURIComponent(value.trim())}`);
    } else {
      router.push("/jobs");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-2 flex gap-2 max-w-2xl mx-auto shadow-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Job title, skill, or company"
            className="w-full pl-10 pr-4 py-3 text-gray-900 rounded-xl focus:outline-none text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          Search Jobs
        </button>
      </form>

      <div className="flex flex-wrap gap-2 justify-center mt-5">
        <span className="text-blue-200 text-sm">Popular:</span>
        {POPULAR_SEARCHES.map(s => (
          <Link
            key={s}
            href={`/jobs?q=${encodeURIComponent(s)}`}
            className="text-white text-sm bg-white/20 hover:bg-white/30 transition px-3 py-1 rounded-full"
          >
            {s}
          </Link>
        ))}
      </div>
    </>
  );
}
