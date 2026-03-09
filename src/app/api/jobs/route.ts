import { NextRequest, NextResponse } from "next/server";
import { generateAllData } from "@/lib/data";

export function GET(req: NextRequest) {
  const { jobs } = generateAllData();
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  if (id !== null) {
    const job = jobs.find(j => j.id === parseInt(id));
    return job
      ? NextResponse.json(job)
      : NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let filtered = [...jobs];

  const q = searchParams.get("q")?.toLowerCase();
  if (q) {
    filtered = filtered.filter(
      j =>
        j.title.toLowerCase().includes(q) ||
        j.requiredSkills.some(s => s.toLowerCase().includes(q)) ||
        j.company.toLowerCase().includes(q)
    );
  }

  const experience = searchParams.get("experience");
  if (experience) {
    filtered = filtered.filter(j => j.experienceLevel === experience);
  }

  const location = searchParams.get("location");
  if (location) {
    filtered = filtered.filter(j => j.location === location);
  }

  const minSalary = searchParams.get("minSalary");
  if (minSalary) {
    filtered = filtered.filter(j => j.salary >= parseInt(minSalary));
  }

  const maxSalary = searchParams.get("maxSalary");
  if (maxSalary) {
    filtered = filtered.filter(j => j.salary <= parseInt(maxSalary));
  }

  return NextResponse.json(filtered);
}
