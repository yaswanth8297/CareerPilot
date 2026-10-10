import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { evaluateInterviewSession } from "@/lib/ai/mockInterviewEngine";

const InterviewEvalSchema = z.object({
  sessionId: z.string(),
  roleId: z.string().default("software-developer"),
  answers: z.array(
    z.object({
      questionId: z.string(),
      userAnswer: z.string(),
      timeSpentSeconds: z.number().default(0)
    })
  )
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = InterviewEvalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const report = evaluateInterviewSession(parsed.data);
    return NextResponse.json(report);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to evaluate interview" }, { status: 500 });
  }
}
