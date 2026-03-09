// Deterministic seeded RNG (mulberry32)
function createRng(seed: number) {
  let s = seed;
  return () => {
    s = Math.imul(s ^ (s >>> 15), s | 1);
    s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
    return ((s ^ (s >>> 14)) >>> 0) / 0x100000000;
  };
}

function rngChoice<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function rngInt(min: number, max: number, rng: () => number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function rngSample<T>(arr: T[], k: number, rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, k);
}

export const SKILLS_POOL = [
  "python", "java", "javascript", "sql", "machine learning", "deep learning",
  "data analysis", "react", "node.js", "aws", "docker", "kubernetes",
  "project management", "agile", "communication", "excel", "tableau",
  "tensorflow", "pytorch", "nlp", "computer vision", "c++", "rust",
  "product management", "ux design", "figma", "marketing", "seo",
];

const JOB_TITLES: [string, string[]][] = [
  ["Data Scientist", ["python", "machine learning", "sql", "data analysis", "tensorflow", "nlp"]],
  ["Software Engineer", ["python", "java", "javascript", "docker", "aws", "c++"]],
  ["Frontend Developer", ["javascript", "react", "figma", "ux design"]],
  ["Backend Developer", ["python", "node.js", "sql", "docker", "aws", "java"]],
  ["ML Engineer", ["python", "machine learning", "deep learning", "pytorch", "docker", "kubernetes"]],
  ["Data Analyst", ["sql", "excel", "tableau", "data analysis", "python", "communication"]],
  ["DevOps Engineer", ["docker", "kubernetes", "aws", "python", "agile"]],
  ["Product Manager", ["product management", "agile", "communication", "project management", "ux design"]],
  ["NLP Engineer", ["python", "nlp", "deep learning", "tensorflow", "machine learning", "pytorch"]],
  ["Computer Vision Engineer", ["python", "computer vision", "deep learning", "pytorch", "c++", "tensorflow"]],
  ["Marketing Analyst", ["marketing", "seo", "excel", "tableau", "communication", "data analysis"]],
  ["Rust Developer", ["rust", "c++", "python", "docker", "aws"]],
];

const COMPANIES = [
  "TechCorp", "DataFlow Inc", "CloudBase", "InnovateTech",
  "NextGen AI", "ByteWorks", "PixelSoft", "AgileHub",
];

export const LOCATIONS = ["Remote", "New York", "San Francisco", "Austin", "Seattle", "London", "Berlin"];

export const EXPERIENCE_LEVELS = ["Junior", "Mid", "Senior"] as const;
export type ExperienceLevel = typeof EXPERIENCE_LEVELS[number];

export interface Job {
  id: number;
  title: string;
  baseTitle: string;
  company: string;
  location: string;
  salary: number;
  experienceLevel: ExperienceLevel;
  requiredSkills: string[];
  description: string;
  postedDaysAgo: number;
}

export interface User {
  id: number;
  name: string;
  skills: string[];
  experienceYears: number;
  experienceLevel: ExperienceLevel;
}

export interface Interaction {
  userId: number;
  jobId: number;
}

export interface AppData {
  jobs: Job[];
  users: User[];
  interactions: Interaction[];
}

let cached: AppData | null = null;

export function generateAllData(): AppData {
  if (cached) return cached;

  const rng = createRng(42);

  // Generate jobs
  const jobs: Job[] = [];
  for (let i = 0; i < 50; i++) {
    const [baseTitle, coreSkills] = rngChoice(JOB_TITLES, rng);
    const extraCount = rngInt(1, 3, rng);
    const extra = rngSample(SKILLS_POOL, extraCount, rng);
    const requiredSkills = [...new Set([...coreSkills, ...extra])];
    const expLevel = rngChoice(EXPERIENCE_LEVELS, rng) as ExperienceLevel;
    const salary = rngInt(50, 200, rng) * 1000;
    const company = rngChoice(COMPANIES, rng);
    const location = rngChoice(LOCATIONS, rng);
    const postedDaysAgo = rngInt(0, 30, rng);

    jobs.push({
      id: i,
      title: `${expLevel} ${baseTitle}`,
      baseTitle,
      company,
      location,
      salary,
      experienceLevel: expLevel,
      requiredSkills,
      description: `${expLevel} ${baseTitle} at ${company} in ${location}. We are looking for a talented ${baseTitle} to join our growing team. You will work on exciting projects leveraging ${requiredSkills.slice(0, 3).join(", ")} and more. Competitive salary of $${salary.toLocaleString()}/year with full benefits.`,
      postedDaysAgo,
    });
  }

  // Generate users
  const users: User[] = [];
  for (let i = 0; i < 30; i++) {
    const numSkills = rngInt(3, 8, rng);
    const skills = rngSample(SKILLS_POOL, numSkills, rng);
    const expYears = rngInt(0, 15, rng);
    const expLevel: ExperienceLevel = expYears < 2 ? "Junior" : expYears < 6 ? "Mid" : "Senior";
    users.push({ id: i, name: `User_${i}`, skills, experienceYears: expYears, experienceLevel: expLevel });
  }

  // Generate interactions
  const interactions: Interaction[] = [];
  const rng2 = createRng(99);
  for (const user of users) {
    const userSkillSet = new Set(user.skills);
    for (const job of jobs) {
      const jobSkillSet = new Set(job.requiredSkills);
      const overlap = [...userSkillSet].filter(s => jobSkillSet.has(s)).length / Math.max(jobSkillSet.size, 1);
      const prob = overlap > 0 ? Math.min(overlap * 0.8 + 0.05, 1.0) : 0.045;
      if (rng2() < prob) {
        interactions.push({ userId: user.id, jobId: job.id });
      }
    }
  }

  cached = { jobs, users, interactions };
  return cached;
}
