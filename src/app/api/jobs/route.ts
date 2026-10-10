import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { filterAndRankJobs } from "@/lib/data/demoJobs";

const JobSearchSchema = z.object({
  targetRole: z.string().optional(),
  userSkills: z.array(z.string()).default([]),
  jobType: z.string().default("all"),
  remoteOnly: z.boolean().default(false)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = JobSearchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const jobs = filterAndRankJobs(parsed.data);
    return NextResponse.json({ jobs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to search jobs" }, { status: 500 });
  }
}
