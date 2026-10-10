import { InterviewReport, InterviewUserAnswer } from "../types";
import { getInterviewQuestionsForRole } from "../data/interviewQuestions";

export function evaluateInterviewSession(params: {
  sessionId: string;
  roleId: string;
  answers: InterviewUserAnswer[];
}): InterviewReport {
  const { sessionId, roleId, answers } = params;
  const questions = getInterviewQuestionsForRole(roleId);

  // Evaluate each answer against length, structure, and expected keywords
  let totalContentScore = 0;
  let totalClarityScore = 0;
  let totalConfidenceScore = 0;
  let totalCommScore = 0;

  let weakestIndex = 0;
  let lowestAnswerScore = 999;

  answers.forEach((ans, idx) => {
    const q = questions[idx];
    const text = (ans.userAnswer || "").trim().toLowerCase();
    const words = text.split(/\s+/).filter(Boolean);

    let contentScore = 5;
    let clarityScore = 6;
    let confidenceScore = 6;
    let commScore = 6;

    if (words.length < 5) {
      // Skipped or extremely short answer
      contentScore = 2;
      clarityScore = 3;
      confidenceScore = 3;
      commScore = 3;
    } else {
      // Word length score
      if (words.length >= 25 && words.length <= 150) {
        contentScore += 2;
        clarityScore += 2;
      }

      // Keyword coverage
      if (q) {
        const matches = q.expectedKeywords.filter(kw => text.includes(kw.toLowerCase()));
        if (matches.length >= 2) contentScore += 2;
        if (matches.length >= 4) contentScore += 1;
      }

      // Confident tone check (absence of excessive filler apologies)
      if (text.includes("i built") || text.includes("i implemented") || text.includes("because") || text.includes("specifically")) {
        confidenceScore += 2;
      }
      if (text.includes("firstly") || text.includes("furthermore") || text.includes("in summary") || text.includes("for example")) {
        commScore += 2;
      }
    }

    contentScore = Math.min(10, contentScore);
    clarityScore = Math.min(10, clarityScore);
    confidenceScore = Math.min(10, confidenceScore);
    commScore = Math.min(10, commScore);

    const questionTotal = (contentScore + clarityScore + confidenceScore + commScore) / 4;
    if (questionTotal < lowestAnswerScore) {
      lowestAnswerScore = questionTotal;
      weakestIndex = idx;
    }

    totalContentScore += contentScore;
    totalClarityScore += clarityScore;
    totalConfidenceScore += confidenceScore;
    totalCommScore += commScore;
  });

  const count = Math.max(1, answers.length);
  const avgContent = Number((totalContentScore / count).toFixed(1));
  const avgClarity = Number((totalClarityScore / count).toFixed(1));
  const avgConfidence = Number((totalConfidenceScore / count).toFixed(1));
  const avgComm = Number((totalCommScore / count).toFixed(1));
  const overall = Number(((avgContent + avgClarity + avgConfidence + avgComm) / 4).toFixed(1));

  const weakestQ = questions[weakestIndex] || questions[0];

  return {
    sessionId,
    overallScore: overall,
    contentAccuracyScore: avgContent,
    clarityScore: avgClarity,
    confidenceScore: avgConfidence,
    communicationScore: avgComm,
    strengths: [
      "Natural conversational delivery with authentic answers and genuine project examples.",
      "Strong grasp of core technical fundamentals and concept clarity.",
      "Successfully attempted all questions within the target 5-minute time window."
    ],
    improvements: [
      "Include deeper technical terminology and describe internal mechanisms in your answers.",
      "Apply the STAR framework (Situation → Task → Action → Result) to structure project explanations.",
      "Cite measurable outcomes and quantifiable metrics (e.g., latency, active users, test coverage)."
    ],
    weakestQuestionIndex: weakestIndex,
    idealAnswerForWeakest: weakestQ ? weakestQ.sampleIdealAnswer : "Focus on clear cause-and-effect reasoning with STAR framework.",
    nextRoadmapAction: "Check Week 10: System Design & Technical Interview Prep in your 90-day roadmap.",
    createdAt: new Date().toISOString()
  };
}
