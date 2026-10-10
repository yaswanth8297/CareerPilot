import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeResumeContent } from "@/lib/ai/resumeAnalyzer";

const ResumeAuditSchema = z.object({
  resumeText: z.string().min(10, "Resume content too short to evaluate"),
  targetRole: z.string().default("software-developer"),
  isRegistered: z.boolean().default(false)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ResumeAuditSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const { resumeText, targetRole, isRegistered } = parsed.data;
    const result = analyzeResumeContent({
      resumeText,
      targetRole,
      isRegistered
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to analyze resume" }, { status: 500 });
  }
}
