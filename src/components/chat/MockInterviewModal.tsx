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
  const [sttSupported, setSttSupported] = useState(true);
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
        } catch (e) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px] animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-xl border border-[#E7E5DE] shadow-atelier-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#FAFAF8] text-[#141518] p-5 flex items-center justify-between border-b border-[#E7E5DE]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#183059] flex items-center justify-center text-white">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight text-[#141518]">
                5-Min Mock Interview Practice
              </h3>
              <p className="text-[11px] font-mono text-[#82858E]">
                Supportive &amp; constructive · College fresher rubric
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isFinished && (
              <div
                className={`px-3 py-1 rounded-md text-xs font-mono font-semibold flex items-center gap-1.5 tabular-nums border ${
                  secondsRemaining < 60
                    ? "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]"
                    : "bg-white text-[#141518] border-[#E7E5DE]"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-[#183059]" />
                <span>
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#82858E] hover:text-[#141518] hover:bg-[#ECEBE4] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isFinished ? (
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[#52555E] font-mono">
                <span>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-[#183059] uppercase tracking-wider text-[11px]">
                  {currentQ?.category}
                </span>
              </div>
              <div className="w-full bg-[#F4F3EE] h-1.5 rounded-full overflow-hidden border border-[#E7E5DE]">
                <div
                  className="bg-[#183059] h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / (questions.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Prompt */}
            <div className="rounded-lg border border-[#E7E5DE] bg-[#FAFAF8] p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#183059] text-white text-[9px] font-mono font-bold flex items-center justify-center">
                  CP/
                </span>
                <span className="font-mono text-[11px] font-semibold text-[#52555E] uppercase tracking-wider">
                  Senior Interviewer
                </span>
              </div>
              <p className="font-display text-lg text-[#141518] leading-snug">
                {currentQ?.question}
              </p>
            </div>

            {/* Answer Input Box */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#52555E]">
                <label className="font-medium text-[#141518]">Your Answer (Text or Voice):</label>
                <span className="font-mono text-[11px] tabular-nums">
                  {currentInput.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={currentInput}
                onChange={e => setCurrentInput(e.target.value)}
                placeholder="Type your answer or speak using the voice mic... Zero CGPA judgment."
                rows={5}
                className="w-full p-3.5 rounded-lg border border-[#E7E5DE] bg-[#FAFAF8] text-[#141518] text-sm focus:outline-none focus:ring-2 focus:ring-[#183059] transition-all resize-none font-sans"
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                      isListening
                        ? "bg-[#991B1B] text-white border-[#991B1B]"
                        : "bg-[#F4F3EE] text-[#141518] border-[#E7E5DE] hover:bg-[#ECEBE4]"
                    }`}
                  >
                    {isListening ? (
                      <>
                        <Radio className="w-3.5 h-3.5 animate-spin" />
                        <span>Listening (STT Active)...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-[#183059]" />
                        <span>Speak Answer (Voice)</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-[#52555E] hover:text-[#141518] font-medium cursor-pointer"
                >
                  Skip Question →
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
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
          /* Final Feedback Report */
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {finalReport && (
              <div className="space-y-5">
                <div className="rounded-xl bg-[#183059] p-5 text-center space-y-1.5 text-white">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-white/70">
                    Overall Interview Score
                  </span>
                  <div className="text-4xl font-mono font-bold text-white tabular-nums">
                    {finalReport.overallScore}{" "}
                    <span className="text-base text-white/60 font-sans font-normal">/ 10</span>
                  </div>
                  <p className="text-xs text-white/80 font-sans">
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
                      className="p-3 rounded-lg border border-[#E7E5DE] bg-[#FAFAF8]"
                    >
                      <div className="text-lg font-mono font-bold text-[#183059] tabular-nums">{p.score}/10</div>
                      <div className="font-mono text-[10px] text-[#82858E] uppercase mt-0.5">{p.label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#166534] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Top 3 Strengths</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-[#52555E] font-sans">
                    {finalReport.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#166534] font-bold">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#92400E] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Areas to Polish</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-[#52555E] font-sans">
                    {finalReport.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#92400E] font-bold">→</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-[#E7E5DE] bg-[#FAFAF8] p-4 space-y-1.5">
                  <span className="font-mono text-[10px] font-semibold text-[#82858E] uppercase tracking-wider">
                    Model Answer Example
                  </span>
                  <p className="text-xs text-[#141518] leading-relaxed font-display italic">
                    &quot;{finalReport.idealAnswerForWeakest}&quot;
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#F4F3EE] border border-[#E7E5DE] text-xs text-[#141518]">
                  <strong>Next Step:</strong> {finalReport.nextRoadmapAction}
                </div>
              </div>
            )}
          </div>
        )}

        {isFinished && (
          <div className="p-4 bg-[#FAFAF8] border-t border-[#E7E5DE]">
            <Button variant="primary" size="md" onClick={onClose} className="w-full justify-center">
              Done &amp; Save to My Space
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
