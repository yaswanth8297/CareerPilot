import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generatePersonalizedRoadmap } from "@/lib/ai/roadmapGenerator";

const RoadmapReqSchema = z.object({
  targetRoleKey: z.string().default("software-developer"),
  userSkills: z.array(z.string()).default([]),
  year: z.enum(["1", "2", "3", "4", "passed_out"]).default("3"),
  isRegistered: z.boolean().default(false)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RoadmapReqSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const { targetRoleKey, userSkills, year, isRegistered } = parsed.data;
    const roadmap = generatePersonalizedRoadmap({
      targetRoleKey,
      userSkills,
      year,
      isRegistered
    });

    return NextResponse.json(roadmap);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate roadmap" }, { status: 500 });
  }
}
