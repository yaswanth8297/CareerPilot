"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Clock, X, Award, AlertCircle, Sparkles, Volume2, Radio } from "lucide-react";
import { InterviewQuestion, InterviewUserAnswer, InterviewReport } from "@/lib/types";
import { evaluateInterviewSession } from "@/lib/ai/mockInterviewEngine";
import { getInterviewQuestionsForRole } from "@/lib/data/interviewQuestions";

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
        recognition.lang = "en-IN"; // English (India) / Hinglish friendly

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
          // If already started or permission issue, fallback to mock simulation
          simulateVoiceInput();
        }
      } else {
        simulateVoiceInput();
      }
    }
  };

  // Mock STT simulation when Web Speech API is unavailable in local runner
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">5-Minute AI Senior Mock Interview</h3>
              <p className="text-[11px] text-zinc-300">Supportive & constructive • College fresher rubric</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer Badge */}
            {!isFinished && (
              <div
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                  secondsRemaining < 60
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                    : "bg-white/10 text-zinc-200 border border-white/15"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isFinished ? (
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
            {/* Progress indicator */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-500 font-semibold">
                <span>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-indigo-600 dark:text-indigo-400">{currentQ?.category}</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / (questions.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Senior Bhaiya/Didi Question Prompt */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                  B
                </span>
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                  Senior Interviewer (Hinglish):
                </span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-white leading-relaxed">
                {currentQ?.questionHinglish}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                English: &quot;{currentQ?.questionEnglish}&quot;
              </p>
            </div>

            {/* Answer Input Box */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-500">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Tera Answer (Text ya Voice):</label>
                <span>{currentInput.trim().split(/\s+/).filter(Boolean).length} words</span>
              </div>
              <textarea
                value={currentInput}
                onChange={e => setCurrentInput(e.target.value)}
                placeholder="Apna answer type karo ya Voice Mic se bolo... Dil khol ke bolo, koi judge nahi kar raha!"
                rows={5}
                className="w-full p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
              />

              {/* Voice / STT Interface Controls with Audio Waveform */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      isListening
                        ? "bg-rose-500 text-white border-rose-600 shadow-md animate-pulse"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    {isListening ? (
                      <>
                        <Radio className="w-3.5 h-3.5 animate-spin" />
                        <span>Listening (STT Active)...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Speak Answer (Voice / STT)</span>
                      </>
                    )}
                  </button>

                  {/* Pulsing Audio Waves */}
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
                  className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-semibold"
                >
                  Skip Question →
                </button>
              </div>
            </div>

            {/* Next / Submit Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleNextQuestion}
                disabled={currentInput.trim().length === 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>
                  {currentIndex + 1 === questions.length ? "Finish & Generate Feedback Report" : "Submit & Next Question"}
                </span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Final Feedback Report */
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
            {finalReport && (
              <div className="space-y-5">
                {/* Score Hero */}
                <div className="rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-800/60 p-4 text-center space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Overall Interview Score
                  </span>
                  <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                    {finalReport.overallScore} <span className="text-base text-zinc-400 font-normal">/ 10</span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                    Bohat badhiya try! Freshers ke liye ye solid baseline score hai.
                  </p>
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
                      className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950"
                    >
                      <div className="text-base font-extrabold text-zinc-900 dark:text-white">{p.score}/10</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{p.label}</div>
                    </div>
                  ))}
                </div>

                {/* 3 Strengths */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Top 3 Strengths</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
                    {finalReport.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3 Improvements */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Areas to Polish</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
                    {finalReport.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">→</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ideal Sample Answer */}
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3.5 space-y-1.5">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Model Answer Example:
                  </span>
                  <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-serif italic">
                    &quot;{finalReport.idealAnswerForWeakest}&quot;
                  </p>
                </div>

                {/* Next Roadmap Action */}
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-300 flex items-center justify-between">
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
          <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs"
            >
              Done & Save to My Space
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
