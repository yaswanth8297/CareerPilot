"use client";

import { useState } from "react";
import { X, CheckCircle2, Sparkles, Phone, Mail, ArrowRight, Globe, Check } from "lucide-react";
import {
  initiatePhoneOtp,
  verifyPhoneOtp,
  initiateMagicLink,
  verifyMagicLink,
  verifyGoogleOAuthCallback
} from "@/lib/services/authService";

export default function RegistrationModal({
  isOpen,
  onClose,
  onSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [authMethod, setAuthMethod] = useState<"phone" | "google" | "magic_link">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"input" | "otp" | "magic_sent">("input");
  const [loading, setLoading] = useState(false);
  const [magicLinkSentMsg, setMagicLinkSentMsg] = useState("");
  const [mockToken, setMockToken] = useState("");

  if (!isOpen) return null;

  // 1. Phone OTP Flow
  const handleSendPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const res = initiatePhoneOtp(phone);
      setStep("otp");
      setLoading(false);
    }, 300);
  };

  const handleVerifyPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const res = verifyPhoneOtp(phone, otp || "7890");
      setLoading(false);
      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      }
    }, 300);
  };

  // 2. Google OAuth Flow
  const handleGoogleOAuth = () => {
    setLoading(true);
    setTimeout(() => {
      // Complete mock Google OAuth callback per PRD
      const res = verifyGoogleOAuthCallback("mock_google_code_123", {
        email: "google.student@gmail.com",
        name: "Google Student Pilot"
      });
      setLoading(false);
      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      }
    }, 450);
  };

  // 3. Email Magic Link Flow
  const handleSendMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const res = initiateMagicLink(email);
      setMockToken(res.mockTokenOrCode || "mock_token_123");
      setMagicLinkSentMsg(res.message);
      setStep("magic_sent");
      setLoading(false);
    }, 350);
  };

  const handleVerifyMagicLink = () => {
    setLoading(true);
    setTimeout(() => {
      const res = verifyMagicLink(mockToken, email);
      setLoading(false);
      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      }
    }, 300);
  };

  // 4. Instant 1-Tap Demo
  const handleInstantDemoVerify = () => {
    verifyPhoneOtp("+91 98765 43210", "7890", "Demo Student Pilot");
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-b from-orange-50/80 via-white to-white dark:from-orange-950/20 dark:via-zinc-900 dark:to-zinc-900 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Sparkles className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Save Progress & Unlock Features
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Zero-spam promise • Takes 15 seconds • 100% Free for Tier 2/3 students
            </p>
          </div>

          {/* Value Perks List */}
          <div className="bg-orange-50 dark:bg-orange-950/30 rounded-2xl p-3 border border-orange-200 dark:border-orange-900/40 space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Full 90-Day (12-Week) Personalised Roadmap</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Unlock ATS Mistakes #2 & #3 with Before/After bullets</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>5-Minute AI Senior Mock Interview with scoring report</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-6">
          <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMethod("phone");
                setStep("input");
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                authMethod === "phone"
                  ? "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-white"
                  : "text-zinc-500"
              }`}
            >
              <Phone className="w-3 h-3" />
              <span>Phone OTP</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod("google");
                setStep("input");
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                authMethod === "google"
                  ? "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-white"
                  : "text-zinc-500"
              }`}
            >
              <Globe className="w-3 h-3 text-red-500" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod("magic_link");
                setStep("input");
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                authMethod === "magic_link"
                  ? "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-white"
                  : "text-zinc-500"
              }`}
            >
              <Mail className="w-3 h-3" />
              <span>Magic Link</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-4">
          {/* Method 1: Phone OTP */}
          {authMethod === "phone" && (
            <>
              {step === "input" ? (
                <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                      Mobile Number (India +91)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <div className="absolute left-3 top-3 text-zinc-400">
                        <Phone className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{loading ? "Sending OTP..." : "Send Verification OTP"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-3">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
                    <span>
                      Demo Mock OTP generated: <strong>7890</strong> (Printed to dev console)
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                      Enter 4-digit OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      placeholder="7890"
                      required
                      className="w-full text-center tracking-widest text-lg font-mono py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md transition-all"
                  >
                    {loading ? "Verifying & Migrating..." : "Confirm & Unlock Features"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("input")}
                    className="w-full text-center text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium"
                  >
                    ← Change number
                  </button>
                </form>
              )}
            </>
          )}

          {/* Method 2: Google OAuth */}
          {authMethod === "google" && (
            <div className="space-y-3 py-2 text-center">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Sign in with your Google account. Your guest profile and messages will migrate automatically.
              </p>
              <button
                type="button"
                onClick={handleGoogleOAuth}
                disabled={loading}
                className="w-full py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 font-bold text-xs text-zinc-800 dark:text-white shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4 text-red-500" />
                <span>{loading ? "Connecting Google..." : "Continue with Google OAuth"}</span>
              </button>
            </div>
          )}

          {/* Method 3: Email Magic Link */}
          {authMethod === "magic_link" && (
            <>
              {step !== "magic_sent" ? (
                <form onSubmit={handleSendMagicLink} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                      College / Personal Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="student@college.edu"
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <div className="absolute left-3 top-3 text-zinc-400">
                        <Mail className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{loading ? "Generating Link..." : "Send Magic Link"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Magic Link Sent!
                    </p>
                    <p className="text-[11px]">{magicLinkSentMsg}</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyMagicLink}
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                  >
                    {loading ? "Verifying..." : "⚡ Simulate 1-Tap Magic Link Click"}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Quick 1-Tap Demo Button */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={handleInstantDemoVerify}
              className="w-full py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>⚡ 1-Click Instant Demo Verification</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
