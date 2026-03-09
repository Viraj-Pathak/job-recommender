import type { Job, User, Interaction, ExperienceLevel } from "./data";

export interface ScoredJob extends Job {
  contentScore: number;
  collabScore: number;
  hybridScore: number;
}

function normalize(arr: number[]): number[] {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  if (max === min) return arr.map(() => 0);
  return arr.map(v => (v - min) / (max - min));
}

function jaccardSim(a: Set<string>, b: Set<string>): number {
  const inter = [...a].filter(x => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

// Content-based: skill + experience level overlap scoring
function contentScores(
  userSkills: string[],
  userExpLevel: ExperienceLevel,
  jobs: Job[]
): number[] {
  const userSet = new Set(userSkills.map(s => s.toLowerCase()));
  return jobs.map(job => {
    const jobSet = new Set(job.requiredSkills.map(s => s.toLowerCase()));
    const skillSim = jaccardSim(userSet, jobSet);
    const expBonus = job.experienceLevel === userExpLevel ? 0.25 : 0;
    return skillSim + expBonus;
  });
}

// Collaborative: user-based CF using Jaccard similarity on skill profiles
// then weight job scores by similar users' interactions
function collabScores(
  userSkills: string[],
  users: User[],
  jobs: Job[],
  interactions: Interaction[]
): number[] {
  const userSet = new Set(userSkills.map(s => s.toLowerCase()));

  // Build user→job interaction map
  const userJobMap = new Map<number, Set<number>>();
  for (const { userId, jobId } of interactions) {
    if (!userJobMap.has(userId)) userJobMap.set(userId, new Set());
    userJobMap.get(userId)!.add(jobId);
  }

  // Compute similarity to each existing user
  const sims = users.map(u => {
    const uSet = new Set(u.skills.map(s => s.toLowerCase()));
    return { userId: u.id, sim: jaccardSim(userSet, uSet) };
  });

  // Score jobs
  const jobScoreMap = new Map<number, number>();
  for (const { userId, sim } of sims) {
    if (sim <= 0) continue;
    for (const jobId of userJobMap.get(userId) ?? []) {
      jobScoreMap.set(jobId, (jobScoreMap.get(jobId) ?? 0) + sim);
    }
  }

  return jobs.map(j => jobScoreMap.get(j.id) ?? 0);
}

export function hybridRecommend(
  userSkills: string[],
  experienceYears: number,
  users: User[],
  jobs: Job[],
  interactions: Interaction[],
  topN = 10,
  contentWeight = 0.5,
  collabWeight = 0.5
): ScoredJob[] {
  const expLevel: ExperienceLevel =
    experienceYears < 2 ? "Junior" : experienceYears < 6 ? "Mid" : "Senior";

  const rawContent = contentScores(userSkills, expLevel, jobs);
  const rawCollab = collabScores(userSkills, users, jobs, interactions);

  const normContent = normalize(rawContent);
  const normCollab = normalize(rawCollab);

  return jobs
    .map((job, i) => ({
      ...job,
      contentScore: normContent[i],
      collabScore: normCollab[i],
      hybridScore: contentWeight * normContent[i] + collabWeight * normCollab[i],
    }))
    .sort((a, b) => b.hybridScore - a.hybridScore)
    .slice(0, topN);
}
