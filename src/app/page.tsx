import Link from "next/link";
import { TrendingUp, Users, Briefcase, Star, ArrowRight, Zap } from "lucide-react";
import { generateAllData } from "@/lib/data";
import JobCard from "@/components/JobCard";
import HeroSearch from "@/components/HeroSearch";

const CATEGORIES = [
  { label: "Engineering", icon: "⚙️", count: 18 },
  { label: "Data & AI", icon: "🤖", count: 12 },
  { label: "Design", icon: "🎨", count: 6 },
  { label: "Product", icon: "📦", count: 5 },
  { label: "Marketing", icon: "📣", count: 4 },
  { label: "DevOps", icon: "☁️", count: 5 },
];

export default function HomePage() {
  const { jobs } = generateAllData();
  const featured = jobs.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Zap className="w-4 h-4" />
            AI-Powered Job Matching
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Find Your <span className="text-yellow-300">Dream Job</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Personalized job recommendations powered by machine learning. Match your skills to the perfect role.
          </p>
          <HeroSearch />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-1 text-blue-600"><Briefcase className="w-6 h-6" /></div>
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-500">Open Positions</div>
            </div>
            <div>
              <div className="flex justify-center mb-1 text-blue-600"><Users className="w-6 h-6" /></div>
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-500">Top Companies</div>
            </div>
            <div>
              <div className="flex justify-center mb-1 text-blue-600"><TrendingUp className="w-6 h-6" /></div>
              <div className="text-2xl font-bold text-gray-900">AI</div>
              <div className="text-sm text-gray-500">Hybrid Matching</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(({ label, icon, count }) => (
            <Link
              key={label}
              href={`/jobs?q=${encodeURIComponent(label)}`}
              className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-600">{label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{count} jobs</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Jobs</h2>
          <Link href="/jobs" className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <Star className="w-10 h-10 mx-auto mb-4 text-yellow-300" />
          <h2 className="text-3xl font-bold mb-3">Get Personalized Recommendations</h2>
          <p className="text-blue-100 mb-7 text-lg">
            Enter your skills and experience — our hybrid ML engine finds your best-fit roles.
          </p>
          <Link
            href="/recommend"
            className="bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Find My Jobs
          </Link>
        </div>
      </section>
    </div>
  );
}
