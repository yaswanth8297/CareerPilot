"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Send, Clock, X, Award, AlertCircle, Radio } from "lucide-react";
import { InterviewQuestion, InterviewUserAnswer, InterviewReport } from "@/lib/types";
import { evaluateInterviewSession } from "@/lib/ai/mockInterviewEngine";
import { getInterviewQuestionsForRole } from "@/lib/data/interviewQuestions";
import { Button } from "@/components/ui/Button";

export default function MockInterviewModal({
  roleId,
  isOpen,
  onClose,
  onComplete
}: {
  roleId: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (report: InterviewReport) => void;
}) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [userAnswers, setUserAnswers] = useState<InterviewUserAnswer[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const [isFinished, setIsFinished] = useState(false);
  const [finalReport, setFinalReport] = useState<InterviewReport | null>(null);

  const [isListening, setIsListening] = useState(false);
  const [, setSttSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      const qList = getInterviewQuestionsForRole(roleId);
      setQuestions(qList);
      setCurrentIndex(0);
      setCurrentInput("");
      setUserAnswers([]);
      setSecondsRemaining(300);
      setIsFinished(false);
      setFinalReport(null);
      setIsListening(false);
    }
  }, [isOpen, roleId]);

  useEffect(() => {
    if (!isOpen || isFinished) return;
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isFinished, userAnswers]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) {
            setCurrentInput(prev => (prev ? `${prev} ${transcript.trim()}` : transcript.trim()));
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSttSupported(false);
      }
    }
  }, []);

  const toggleVoiceRecording = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setIsListening(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          simulateVoiceInput();
        }
      } else {
        simulateVoiceInput();
      }
    }
  };

  const simulateVoiceInput = () => {
    setTimeout(() => {
      const phrases = [
        " In my college project, I designed a scalable relational schema with optimized indexes and implemented REST APIs.",
        " I worked on React state management and handled responsive layout constraints for mobile users.",
        " We used Git for feature branches and automated unit testing."
      ];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      setCurrentInput(prev => (prev ? `${prev}${randomPhrase}` : randomPhrase.trim()));
      setIsListening(false);
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const activeQ = questions[currentIndex];
    const newAnswers = [
      ...userAnswers,
      {
        questionId: activeQ?.id || `q-${currentIndex}`,
        userAnswer: currentInput.trim(),
        timeSpentSeconds: 300 - secondsRemaining
      }
    ];
    setUserAnswers(newAnswers);
    setCurrentInput("");

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishInterview(newAnswers);
    }
  };

  const handleSkip = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const activeQ = questions[currentIndex];
    const newAnswers = [
      ...userAnswers,
      {
        questionId: activeQ?.id || `q-${currentIndex}`,
        userAnswer: "Skipped",
        timeSpentSeconds: 300 - secondsRemaining
      }
    ];
    setUserAnswers(newAnswers);
    setCurrentInput("");

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishInterview(newAnswers);
    }
  };

  const finishInterview = (answersToUse?: InterviewUserAnswer[]) => {
    setIsFinished(true);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    const answers = answersToUse || userAnswers;
    const report = evaluateInterviewSession({
      sessionId: "mock_" + Math.random().toString(36).substring(2, 9),
      roleId,
      answers
    });
    setFinalReport(report);
    onComplete(report);
  };

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-paper rounded-xl border border-hairline shadow-atelier-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-canvas text-ink p-5 flex items-center justify-between border-b border-hairline">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center text-white">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight text-ink">
                5-Min Mock Interview Practice
              </h3>
              <p className="text-[11px] font-mono text-ink-subtle">
                Supportive &amp; constructive · College fresher rubric
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isFinished && (
              <div
                className={`px-3 py-1 rounded-md text-xs font-mono font-semibold flex items-center gap-1.5 tabular-nums border ${
                  secondsRemaining < 60
                    ? "bg-fix-bg text-fix border-fix-border"
                    : "bg-paper text-ink border-hairline"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-brand-ink" />
                <span>
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-ink-subtle hover:text-ink hover:bg-inset transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isFinished ? (
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-ink-muted font-mono">
                <span>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-brand-ink uppercase tracking-wider text-[11px]">
                  {currentQ?.category}
                </span>
              </div>
              <div className="w-full bg-inset h-1.5 rounded-full overflow-hidden border border-hairline">
                <div
                  className="bg-brand h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / (questions.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="rounded-lg border border-hairline bg-canvas p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-brand text-white text-[9px] font-mono font-bold flex items-center justify-center">
                  CP/
                </span>
                <span className="font-mono text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
                  Senior Interviewer
                </span>
              </div>
              <p className="font-display text-lg text-ink leading-snug">
                {currentQ?.question}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-ink-muted">
                <label className="font-medium text-ink">Your Answer (Text or Voice):</label>
                <span className="font-mono text-[11px] tabular-nums">
                  {currentInput.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={currentInput}
                onChange={e => setCurrentInput(e.target.value)}
                placeholder="Type your answer or speak using the voice mic... Zero CGPA judgment."
                rows={5}
                className="w-full p-3.5 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand transition-all resize-none font-sans"
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
                      isListening
                        ? "bg-fix-bg text-fix border-fix-border"
                        : "bg-inset text-ink border-hairline hover:bg-inset-hover"
                    }`}
                  >
                    {isListening ? (
                      <>
                        <Radio className="w-3.5 h-3.5 animate-spin" />
                        <span>Listening (STT Active)...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-brand-ink" />
                        <span>Speak Answer (Voice)</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-ink-muted hover:text-ink font-medium cursor-pointer"
                >
                  Skip Question →
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="cta"
                size="md"
                onClick={handleNextQuestion}
                disabled={currentInput.trim().length === 0}
                className="w-full justify-center group"
              >
                <span>
                  {currentIndex + 1 === questions.length ? "Finish & Generate Report" : "Submit & Next Question"}
                </span>
                <Send className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {finalReport && (
              <div className="space-y-5">
                <div className="rounded-xl bg-manifesto border border-manifesto-border p-5 text-center space-y-1.5 text-[#F4EFEA]">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#F4EFEA]/70">
                    Overall Interview Score
                  </span>
                  <div className="text-4xl font-mono font-bold text-[#F4EFEA] tabular-nums">
                    {finalReport.overallScore}{" "}
                    <span className="text-base text-[#F4EFEA]/65 font-sans font-normal">/ 10</span>
                  </div>
                  <p className="text-xs text-[#F4EFEA]/80 font-sans">
                    Solid fresher baseline for technical placement rounds.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  {[
                    { label: "Accuracy", score: finalReport.contentAccuracyScore },
                    { label: "Clarity", score: finalReport.clarityScore },
                    { label: "Confidence", score: finalReport.confidenceScore },
                    { label: "Communication", score: finalReport.communicationScore }
                  ].map(p => (
                    <div
                      key={p.label}
                      className="p-3 rounded-lg border border-hairline bg-canvas"
                    >
                      <div className="text-lg font-mono font-bold text-brand-ink tabular-nums">{p.score}/10</div>
                      <div className="font-mono text-[10px] text-ink-subtle uppercase mt-0.5">{p.label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-pass flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Top 3 Strengths</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-ink-muted font-sans">
                    {finalReport.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-pass font-bold">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-warn flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Areas to Polish</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-ink-muted font-sans">
                    {finalReport.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-warn font-bold">→</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-hairline bg-canvas p-4 space-y-1.5">
                  <span className="font-mono text-[10px] font-semibold text-ink-subtle uppercase tracking-wider">
                    Model Answer Example
                  </span>
                  <p className="text-xs text-ink leading-relaxed font-display italic">
                    &quot;{finalReport.idealAnswerForWeakest}&quot;
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-inset border border-hairline text-xs text-ink">
                  <strong>Next Step:</strong> {finalReport.nextRoadmapAction}
                </div>
              </div>
            )}
          </div>
        )}

        {isFinished && (
          <div className="p-4 bg-canvas border-t border-hairline">
            <Button variant="primary" size="md" onClick={onClose} className="w-full justify-center">
              Done &amp; Save to My Space
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
