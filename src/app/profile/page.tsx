"use client";
import { useState, useEffect } from "react";
import {
  useProfile, computeCompleteness, AVATAR_COLORS,
  type UserProfile, type SkillLevel, type WorkType, type Availability,
} from "@/hooks/useProfile";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { useApplications } from "@/hooks/useApplications";
import { SKILLS_POOL, LOCATIONS } from "@/lib/data";
import Link from "next/link";
import {
  Pencil, Check, X, Plus, Trash2, Zap, ExternalLink,
  Github, Linkedin, Globe, MapPin, Briefcase, GraduationCap,
  Award, DollarSign, Clock, ChevronDown, ChevronUp, Star,
  Bookmark, LayoutList, TrendingUp,
} from "lucide-react";

// ── helpers ───────────────────────────────────────────────────────────
const SKILL_LEVEL_COLORS: Record<SkillLevel, string> = {
  Beginner:     "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
  Intermediate: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  Expert:       "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
};
const WORK_TYPES: WorkType[] = ["Remote", "Hybrid", "On-site"];
const AVAILABILITIES: Availability[] = ["Immediately", "2 weeks", "1 month", "3+ months", "Not looking"];

function SectionCard({ title, icon, children, onEdit, editing, onSave, onCancel }: {
  title: string; icon: React.ReactNode; children: React.ReactNode;
  onEdit?: () => void; editing?: boolean; onSave?: () => void; onCancel?: () => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
          <span className="text-blue-600">{icon}</span>{title}
        </div>
        {!editing && onEdit && (
          <button onClick={onEdit} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
        )}
        {editing && (
          <div className="flex gap-2">
            <button onClick={onSave} className="flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
              <Check className="w-3.5 h-3.5" /> Save
            </button>
            <button onClick={onCancel} className="flex items-center gap-1 text-xs border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          </div>
        )}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function FInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { profile, save, mounted } = useProfile();
  const { saved: savedJobs } = useSavedJobs();
  const { apps } = useApplications();

  const [draft, setDraft] = useState<UserProfile>(profile);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [newCert, setNewCert] = useState({ name: "", issuer: "", year: "" });
  const [newRole, setNewRole] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => { if (mounted) setDraft({ ...profile }); }, [mounted, profile]);

  if (!mounted) return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  );

  const completeness = computeCompleteness(draft);
  const expLevel = draft.experienceYears < 2 ? "Junior" : draft.experienceYears < 6 ? "Mid" : "Senior";
  const initials = draft.name ? draft.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : "U";
  const visibleSkills = showAllSkills ? SKILLS_POOL : SKILLS_POOL.slice(0, 18);

  function set<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setDraft(prev => ({ ...prev, [key]: value }));
  }
  function startEdit(s: string) { setEditing(prev => ({ ...prev, [s]: true })); }
  function saveSection(s: string) {
    save(draft);
    setEditing(prev => ({ ...prev, [s]: false }));
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  }
  function cancelSection(s: string) { setDraft({ ...profile }); setEditing(prev => ({ ...prev, [s]: false })); }

  function toggleSkill(skill: string) {
    if (draft.skills.includes(skill)) {
      set("skills", draft.skills.filter(s => s !== skill));
      const levels = { ...draft.skillLevels };
      delete levels[skill];
      set("skillLevels", levels);
    } else {
      set("skills", [...draft.skills, skill]);
      set("skillLevels", { ...draft.skillLevels, [skill]: "Intermediate" });
    }
  }
  function cycleLevel(skill: string) {
    const order: SkillLevel[] = ["Beginner", "Intermediate", "Expert"];
    const cur = draft.skillLevels[skill] ?? "Intermediate";
    set("skillLevels", { ...draft.skillLevels, [skill]: order[(order.indexOf(cur) + 1) % order.length] });
  }
  function toggleWorkType(wt: WorkType) {
    set("workTypes", draft.workTypes.includes(wt) ? draft.workTypes.filter(w => w !== wt) : [...draft.workTypes, wt]);
  }
  function togglePrefLoc(loc: string) {
    set("preferredLocations", draft.preferredLocations.includes(loc)
      ? draft.preferredLocations.filter(l => l !== loc)
      : [...draft.preferredLocations, loc]);
  }
  function addCert() {
    if (!newCert.name) return;
    set("certifications", [...draft.certifications, newCert]);
    setNewCert({ name: "", issuer: "", year: "" });
  }
  function addRole() {
    if (newRole.trim() && !draft.desiredRoles.includes(newRole.trim()))
      set("desiredRoles", [...draft.desiredRoles, newRole.trim()]);
    setNewRole("");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-5">

      {/* ─── HERO CARD ─── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4 flex-wrap gap-3">
            {/* Avatar + color picker */}
            <div className="relative">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${draft.avatarColor} flex items-center justify-center text-white font-bold text-2xl ring-4 ring-white dark:ring-gray-800 shadow-lg`}>
                {initials}
              </div>
              {editing.hero && (
                <div className="absolute -bottom-3 left-0 flex gap-1 mt-1 flex-wrap">
                  {AVATAR_COLORS.map(c => (
                    <button key={c} onClick={() => set("avatarColor", c)}
                      className={`w-5 h-5 rounded-full bg-gradient-to-br ${c} ring-2 ${draft.avatarColor === c ? "ring-blue-500 scale-110" : "ring-white dark:ring-gray-700"} transition-all`} />
                  ))}
                </div>
              )}
            </div>
            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-2">
              {savedFlash && <span className="text-sm text-green-600 flex items-center gap-1"><Check className="w-4 h-4" />Saved!</span>}
              {!editing.hero
                ? <button onClick={() => startEdit("hero")} className="flex items-center gap-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Pencil className="w-4 h-4" /> Edit Profile
                  </button>
                : <>
                    <button onClick={() => saveSection("hero")} className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                      <Check className="w-4 h-4" /> Save
                    </button>
                    <button onClick={() => cancelSection("hero")} className="flex items-center gap-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </>
              }
              <Link href="/recommend" className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                <Zap className="w-4 h-4" /> Get Jobs
              </Link>
            </div>
          </div>

          {editing.hero ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <FInput label="Full Name" value={draft.name} onChange={v => set("name", v)} placeholder="Jane Doe" />
              <FInput label="Job Title / Headline" value={draft.title} onChange={v => set("title", v)} placeholder="Senior ML Engineer" />
              <FInput label="Location" value={draft.location} onChange={v => set("location", v)} placeholder="San Francisco, CA" />
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Bio</label>
                <textarea value={draft.bio} onChange={e => set("bio", e.target.value)} rows={3} placeholder="A short summary about you and what you are looking for..."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
          ) : (
            <div>
              {draft.name
                ? <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{draft.name}</h1>
                : <p className="text-gray-400 dark:text-gray-500 italic text-sm">Click &ldquo;Edit Profile&rdquo; to add your name</p>}
              {draft.title && <p className="text-blue-600 dark:text-blue-400 font-medium mt-0.5">{draft.title}</p>}
              {draft.location && <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1"><MapPin className="w-4 h-4" />{draft.location}</p>}
              {draft.bio
                ? <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed max-w-2xl">{draft.bio}</p>
                : <p className="text-sm text-gray-400 italic mt-3">Add a bio to stand out to recruiters.</p>}
              <div className="flex gap-4 mt-3 flex-wrap">
                {draft.github && <a href={`https://github.com/${draft.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"><Github className="w-4 h-4" />{draft.github}</a>}
                {draft.linkedin && <a href={`https://linkedin.com/in/${draft.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"><Linkedin className="w-4 h-4" />{draft.linkedin}</a>}
                {draft.portfolio && <a href={draft.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"><Globe className="w-4 h-4" />Portfolio<ExternalLink className="w-3 h-3" /></a>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── COMPLETENESS ─── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" /> Profile Strength
          </span>
          <span className={`text-sm font-bold ${completeness >= 80 ? "text-green-600" : completeness >= 50 ? "text-blue-600" : "text-amber-600"}`}>
            {completeness}% — {completeness >= 80 ? "All Star" : completeness >= 50 ? "Intermediate" : "Beginner"}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div className={`h-2.5 rounded-full transition-all ${completeness >= 80 ? "bg-green-500" : completeness >= 50 ? "bg-blue-500" : "bg-amber-500"}`}
            style={{ width: `${completeness}%` }} />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {!draft.name && <span className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">+ Add name</span>}
          {!draft.bio && <span className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">+ Add bio</span>}
          {draft.skills.length < 3 && <span className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">+ Add 3+ skills</span>}
          {!draft.university && <span className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">+ Add education</span>}
          {!draft.github && !draft.linkedin && <span className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">+ Add a link</span>}
          {completeness === 100 && <span className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">✓ Profile complete!</span>}
        </div>
      </div>

      {/* ─── STATS ROW ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: <Bookmark className="w-5 h-5" />, label: "Saved Jobs",       value: savedJobs.length, href: "/saved",    color: "text-blue-600" },
          { icon: <LayoutList className="w-5 h-5" />, label: "Applications",   value: apps.length,       href: "/tracker",  color: "text-indigo-600" },
          { icon: <Star className="w-5 h-5" />,       label: "Skills",         value: draft.skills.length, href: undefined, color: "text-purple-600" },
          { icon: <TrendingUp className="w-5 h-5" />, label: "Profile Score",  value: `${completeness}%`, href: undefined, color: "text-amber-600" },
        ].map(({ icon, label, value, href, color }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className={`flex justify-center mb-1 ${color}`}>{icon}</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
            {href && <Link href={href} className="text-xs text-blue-600 hover:underline mt-0.5 block">View →</Link>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">

          {/* ─── SKILLS ─── */}
          <SectionCard title="Skills & Expertise" icon={<TrendingUp className="w-4 h-4" />}
            editing={editing.skills} onEdit={() => startEdit("skills")}
            onSave={() => saveSection("skills")} onCancel={() => cancelSection("skills")}>

            {/* Experience bar */}
            <div className="mb-5">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Years of Experience</span>
                <span className="text-sm font-bold text-blue-600">{draft.experienceYears} yr{draft.experienceYears !== 1 ? "s" : ""} · {expLevel}</span>
              </div>
              {editing.skills
                ? <input type="range" min={0} max={20} value={draft.experienceYears} onChange={e => set("experienceYears", parseInt(e.target.value))} className="w-full accent-blue-600" />
                : <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${(draft.experienceYears / 20) * 100}%` }} /></div>}
            </div>

            {editing.skills && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Toggle skills · Click the level badge to cycle Beginner → Intermediate → Expert</p>
                <div className="flex flex-wrap gap-1.5">
                  {visibleSkills.map(skill => {
                    const sel = draft.skills.includes(skill);
                    const level = draft.skillLevels[skill] ?? "Intermediate";
                    return (
                      <div key={skill} className="flex items-stretch">
                        <button onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 text-sm font-medium border transition-all ${sel ? "rounded-l-full bg-blue-600 text-white border-blue-600" : "rounded-full bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400"}`}>
                          {skill}
                        </button>
                        {sel && (
                          <button onClick={() => cycleLevel(skill)}
                            className={`px-2 py-1.5 rounded-r-full text-xs font-bold border-y border-r border-blue-600 ${SKILL_LEVEL_COLORS[level]} transition-all`}>
                            {level === "Beginner" ? "B" : level === "Intermediate" ? "I" : "E"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => setShowAllSkills(!showAllSkills)} className="mt-2 text-xs text-blue-600 hover:underline flex items-center gap-1">
                  {showAllSkills ? <><ChevronUp className="w-3.5 h-3.5" />Show less</> : <><ChevronDown className="w-3.5 h-3.5" />Show all {SKILLS_POOL.length}</>}
                </button>
              </div>
            )}

            {draft.skills.length === 0
              ? <p className="text-sm text-gray-400 italic">No skills added yet.</p>
              : <div className="flex flex-wrap gap-2">
                  {draft.skills.map(skill => {
                    const level = draft.skillLevels[skill] ?? "Intermediate";
                    return (
                      <span key={skill} className={`inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full font-medium ${SKILL_LEVEL_COLORS[level]}`}>
                        {skill}
                        <span className="text-xs opacity-60">· {level}</span>
                      </span>
                    );
                  })}
                </div>
            }
          </SectionCard>

          {/* ─── JOB PREFERENCES ─── */}
          <SectionCard title="Job Preferences" icon={<Briefcase className="w-4 h-4" />}
            editing={editing.prefs} onEdit={() => startEdit("prefs")}
            onSave={() => saveSection("prefs")} onCancel={() => cancelSection("prefs")}>

            {editing.prefs ? (
              <div className="space-y-5">
                {/* Desired roles */}
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-2">Desired Roles</label>
                  <div className="flex gap-2 mb-2">
                    <input value={newRole} onChange={e => setNewRole(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addRole(); } }}
                      placeholder="e.g. ML Engineer" className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button onClick={addRole} className="px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {draft.desiredRoles.map(r => (
                      <span key={r} className="flex items-center gap-1 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                        {r} <button onClick={() => set("desiredRoles", draft.desiredRoles.filter(x => x !== r))}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
                {/* Work type */}
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-2">Work Type</label>
                  <div className="flex gap-2 flex-wrap">
                    {WORK_TYPES.map(wt => (
                      <button key={wt} onClick={() => toggleWorkType(wt)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${draft.workTypes.includes(wt) ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400"}`}>
                        {wt}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Preferred locations */}
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-2">Preferred Locations</label>
                  <div className="flex flex-wrap gap-2">
                    {LOCATIONS.map(loc => (
                      <button key={loc} onClick={() => togglePrefLoc(loc)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-all ${draft.preferredLocations.includes(loc) ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400"}`}>
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Salary */}
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-2">
                    Target Salary: <span className="text-blue-600 font-semibold">${(draft.salaryMin / 1000).toFixed(0)}K – ${(draft.salaryMax / 1000).toFixed(0)}K</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-gray-400">Minimum</span>
                      <input type="range" min={30000} max={200000} step={5000} value={draft.salaryMin} onChange={e => set("salaryMin", parseInt(e.target.value))} className="w-full accent-blue-600 mt-1" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Maximum</span>
                      <input type="range" min={30000} max={300000} step={5000} value={draft.salaryMax} onChange={e => set("salaryMax", parseInt(e.target.value))} className="w-full accent-blue-600 mt-1" />
                    </div>
                  </div>
                </div>
                {/* Availability */}
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-2">Availability to Start</label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABILITIES.map(a => (
                      <button key={a} onClick={() => set("availability", a)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-all ${draft.availability === a ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400"}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                {draft.desiredRoles.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-wrap gap-1.5">{draft.desiredRoles.map(r => <span key={r} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">{r}</span>)}</div>
                  </div>
                )}
                {draft.workTypes.length > 0 && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />{draft.workTypes.join(" · ")}</div>}
                {draft.preferredLocations.length > 0 && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />{draft.preferredLocations.join(", ")}</div>}
                {(draft.salaryMin || draft.salaryMax) && <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />${(draft.salaryMin / 1000).toFixed(0)}K – ${(draft.salaryMax / 1000).toFixed(0)}K/year</div>}
                {draft.availability && <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />Available: {draft.availability}</div>}
                {!draft.desiredRoles.length && !draft.workTypes.length && <p className="text-gray-400 italic text-sm">No preferences set yet.</p>}
              </div>
            )}
          </SectionCard>

          {/* ─── EDUCATION ─── */}
          <SectionCard title="Education" icon={<GraduationCap className="w-4 h-4" />}
            editing={editing.edu} onEdit={() => startEdit("edu")}
            onSave={() => saveSection("edu")} onCancel={() => cancelSection("edu")}>
            {editing.edu ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FInput label="Degree" value={draft.degree} onChange={v => set("degree", v)} placeholder="Bachelor of Science" />
                <FInput label="Field of Study" value={draft.fieldOfStudy} onChange={v => set("fieldOfStudy", v)} placeholder="Computer Science" />
                <FInput label="University / Institution" value={draft.university} onChange={v => set("university", v)} placeholder="MIT" />
                <FInput label="Graduation Year" value={draft.graduationYear} onChange={v => set("graduationYear", v)} placeholder="2022" />
              </div>
            ) : draft.university ? (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{draft.university}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{draft.degree}{draft.fieldOfStudy ? ` in ${draft.fieldOfStudy}` : ""}</p>
                  {draft.graduationYear && <p className="text-xs text-gray-400 mt-0.5">Class of {draft.graduationYear}</p>}
                </div>
              </div>
            ) : <p className="text-sm text-gray-400 italic">No education added yet.</p>}
          </SectionCard>

          {/* ─── CERTIFICATIONS ─── */}
          <SectionCard title="Licenses & Certifications" icon={<Award className="w-4 h-4" />}
            editing={editing.certs} onEdit={() => startEdit("certs")}
            onSave={() => saveSection("certs")} onCancel={() => cancelSection("certs")}>
            {draft.certifications.length > 0 && (
              <div className="space-y-2 mb-4">
                {draft.certifications.map((cert, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{cert.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{cert.issuer}{cert.year ? ` · ${cert.year}` : ""}</p>
                    </div>
                    {editing.certs && (
                      <button onClick={() => set("certifications", draft.certifications.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {editing.certs && (
              <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 space-y-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Add Certification</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input value={newCert.name} onChange={e => setNewCert(p => ({ ...p, name: e.target.value }))} placeholder="AWS Solutions Architect"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input value={newCert.issuer} onChange={e => setNewCert(p => ({ ...p, issuer: e.target.value }))} placeholder="Amazon"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <div className="flex gap-2">
                    <input value={newCert.year} onChange={e => setNewCert(p => ({ ...p, year: e.target.value }))} placeholder="2024"
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button onClick={addCert} className="px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            )}
            {!editing.certs && draft.certifications.length === 0 && <p className="text-sm text-gray-400 italic">No certifications added yet.</p>}
          </SectionCard>
        </div>

        {/* ─── RIGHT SIDEBAR ─── */}
        <div className="space-y-5">
          {/* Links */}
          <SectionCard title="Links" icon={<Globe className="w-4 h-4" />}
            editing={editing.links} onEdit={() => startEdit("links")}
            onSave={() => saveSection("links")} onCancel={() => cancelSection("links")}>
            {editing.links ? (
              <div className="space-y-3">
                {[
                  { label: "GitHub username", icon: <Github className="w-3.5 h-3.5" />, field: "github" as const, ph: "octocat" },
                  { label: "LinkedIn username", icon: <Linkedin className="w-3.5 h-3.5" />, field: "linkedin" as const, ph: "janedoe" },
                  { label: "Portfolio URL", icon: <Globe className="w-3.5 h-3.5" />, field: "portfolio" as const, ph: "https://janedoe.dev" },
                ].map(({ label, icon, field, ph }) => (
                  <div key={field}>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">{icon}{label}</label>
                    <input value={draft[field]} onChange={e => set(field, e.target.value)} placeholder={ph}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {[
                  { icon: <Github className="w-4 h-4" />, label: "GitHub", value: draft.github, href: draft.github ? `https://github.com/${draft.github}` : "" },
                  { icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn", value: draft.linkedin, href: draft.linkedin ? `https://linkedin.com/in/${draft.linkedin}` : "" },
                  { icon: <Globe className="w-4 h-4" />, label: "Portfolio", value: draft.portfolio, href: draft.portfolio },
                ].map(({ icon, label, value, href }) => (
                  <div key={label} className={`flex items-center gap-2 text-sm ${value ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"}`}>
                    <span className={value ? "text-gray-500 dark:text-gray-400" : "text-gray-300 dark:text-gray-600"}>{icon}</span>
                    {value && href
                      ? <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 flex items-center gap-1 truncate">{value}<ExternalLink className="w-3 h-3 flex-shrink-0" /></a>
                      : <span className="italic text-xs">Add {label}</span>}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Quick actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/recommend" className="flex items-center gap-2 w-full text-sm font-medium bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
                <Zap className="w-4 h-4" /> Get Job Matches
              </Link>
              <Link href="/saved" className="flex items-center gap-2 w-full text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Bookmark className="w-4 h-4" /> Saved Jobs ({savedJobs.length})
              </Link>
              <Link href="/tracker" className="flex items-center gap-2 w-full text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <LayoutList className="w-4 h-4" /> Applications ({apps.length})
              </Link>
              <Link href="/insights" className="flex items-center gap-2 w-full text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <TrendingUp className="w-4 h-4" /> Market Insights
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
