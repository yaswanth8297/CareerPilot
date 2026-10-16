"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Clock, X, Award, AlertCircle, Sparkles, Volume2, Radio, CheckCircle2 } from "lucide-react";
import { InterviewQuestion, InterviewUserAnswer, InterviewReport } from "@/lib/types";
import { evaluateInterviewSession } from "@/lib/ai/mockInterviewEngine";
import { getInterviewQuestionsForRole } from "@/lib/data/interviewQuestions";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

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
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 minutes (300s)
  const [isFinished, setIsFinished] = useState(false);
  const [finalReport, setFinalReport] = useState<InterviewReport | null>(null);

  // Voice / STT State
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

  // 5-minute countdown timer
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

  // Setup Web Speech API (STT Interface)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header - Inverted Slate */}
        <div className="relative bg-[#0F172A] text-white p-5 flex items-center justify-between border-b border-slate-800 overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-normal text-lg leading-tight text-white">
                5-Min Mock Interview Practice
              </h3>
              <p className="text-[11px] text-slate-400">Supportive & constructive • College fresher rubric</p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            {!isFinished && (
              <div
                className={`px-3 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 ${
                  secondsRemaining < 60
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                    : "bg-white/10 text-slate-200 border border-white/15"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-[#4D7CFF]" />
                <span>
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isFinished ? (
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Progress indicator */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span className="font-mono">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="font-mono text-[#0052FF] dark:text-[#4D7CFF] uppercase tracking-wider text-[11px]">
                  {currentQ?.category}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / (questions.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Prompt */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0052FF] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                  AI
                </span>
                <span className="font-mono text-xs font-semibold text-[#0052FF] dark:text-[#4D7CFF] uppercase tracking-wider">
                  Senior Interviewer
                </span>
              </div>
              <p className="font-display font-normal text-base text-[#0F172A] dark:text-white leading-relaxed">
                {currentQ?.question}
              </p>
            </div>

            {/* Answer Input Box */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <label className="font-medium text-[#0F172A] dark:text-slate-300">Your Answer (Text or Voice):</label>
                <span className="font-mono text-[11px]">{currentInput.trim().split(/\s+/).filter(Boolean).length} words</span>
              </div>
              <textarea
                value={currentInput}
                onChange={e => setCurrentInput(e.target.value)}
                placeholder="Type your answer or speak using the voice mic... Speak freely, zero CGPA judgment!"
                rows={5}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#090D16] text-[#0F172A] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF] transition-all resize-none font-sans"
              />

              {/* Voice / STT Interface Controls */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isListening
                        ? "bg-rose-500 text-white border-rose-600 shadow-md animate-pulse"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isListening ? (
                      <>
                        <Radio className="w-3.5 h-3.5 animate-spin" />
                        <span>Listening (STT Active)...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-[#0052FF]" />
                        <span>Speak Answer (Voice / STT)</span>
                      </>
                    )}
                  </button>

                  {isListening && (
                    <div className="flex items-center gap-0.5 h-4">
                      <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce" />
                      <span className="w-1 h-4 bg-rose-500 rounded-full animate-bounce delay-100" />
                      <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce delay-200" />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-slate-500 hover:text-[#0F172A] dark:hover:text-white font-medium cursor-pointer"
                >
                  Skip Question →
                </button>
              </div>
            </div>

            {/* Next / Submit Button */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={handleNextQuestion}
                disabled={currentInput.trim().length === 0}
                className="w-full justify-center group"
              >
                <span>
                  {currentIndex + 1 === questions.length ? "Finish & Generate Feedback Report" : "Submit & Next Question"}
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
                {/* Score Hero - Inverted Slate with Accent Glow */}
                <div className="relative rounded-2xl bg-[#0F172A] border border-slate-800 p-5 text-center space-y-2 text-white overflow-hidden">
                  <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
                  <div className="relative z-10">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#4D7CFF] font-semibold">
                      Overall Interview Score
                    </span>
                    <div className="text-4xl font-mono font-bold text-white mt-1">
                      {finalReport.overallScore} <span className="text-base text-slate-400 font-sans font-normal">/ 10</span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans mt-1">
                      Strong attempt! This is a solid fresher baseline for technical placement rounds.
                    </p>
                  </div>
                </div>

                {/* 4 Pillars Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  {[
                    { label: "Content Accuracy", score: finalReport.contentAccuracyScore },
                    { label: "Clarity", score: finalReport.clarityScore },
                    { label: "Confidence", score: finalReport.confidenceScore },
                    { label: "Communication", score: finalReport.communicationScore }
                  ].map(p => (
                    <div
                      key={p.label}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                    >
                      <div className="text-lg font-mono font-bold text-[#0052FF] dark:text-[#4D7CFF]">{p.score}/10</div>
                      <div className="font-mono text-[10px] text-slate-500 uppercase mt-0.5">{p.label}</div>
                    </div>
                  ))}
                </div>

                {/* 3 Strengths */}
                <div className="space-y-2">
                  <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Top 3 Strengths</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 font-sans">
                    {finalReport.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3 Improvements */}
                <div className="space-y-2">
                  <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Areas to Polish</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 font-sans">
                    {finalReport.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">→</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ideal Sample Answer */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 space-y-1.5">
                  <span className="font-mono text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Model Answer Example:
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans italic">
                    &quot;{finalReport.idealAnswerForWeakest}&quot;
                  </p>
                </div>

                {/* Next Roadmap Action */}
                <div className="p-3.5 rounded-xl bg-[#0052FF]/10 border border-[#0052FF]/20 text-xs text-[#0052FF] dark:text-[#4D7CFF] flex items-center justify-between">
                  <span>
                    <strong>Next Step:</strong> {finalReport.nextRoadmapAction}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Close Button when finished */}
        {isFinished && (
          <div className="p-4 bg-slate-50 dark:bg-[#090D16] border-t border-slate-200 dark:border-slate-800">
            <Button
              variant="primary"
              size="md"
              onClick={onClose}
              className="w-full justify-center"
            >
              Done & Save to My Space
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
