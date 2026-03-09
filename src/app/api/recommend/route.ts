import { NextRequest, NextResponse } from "next/server";
import { generateAllData } from "@/lib/data";
import { hybridRecommend } from "@/lib/recommender";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { skills, experienceYears } = body as { skills: string[]; experienceYears: number };

  if (!skills?.length) {
    return NextResponse.json({ error: "skills is required" }, { status: 400 });
  }

  const { jobs, users, interactions } = generateAllData();
  const recommendations = hybridRecommend(skills, experienceYears ?? 0, users, jobs, interactions, 10);

  return NextResponse.json(recommendations);
}
