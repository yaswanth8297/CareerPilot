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
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

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
      initiatePhoneOtp(phone);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header - Clean Light Theme */}
        <div className="relative bg-slate-50 text-slate-900 p-6 pb-5 space-y-3 border-b border-slate-200 overflow-hidden">
          <div className="absolute inset-0 dot-pattern-light opacity-50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[70px] rounded-full pointer-events-none" />

          <div className="relative z-10 w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>

          <div className="relative z-10">
            <h3 className="text-xl font-bold tracking-tight text-slate-900">
              Save Progress & Unlock Features
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Zero-spam promise • Takes 15 seconds • 100% Free for students
            </p>
          </div>

          {/* Value Perks List */}
          <div className="relative z-10 bg-white rounded-2xl p-3 border border-slate-200 space-y-1.5 text-xs text-slate-700 shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Full 90-Day (12-Week) Personalised Roadmap</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Unlock ATS Mistakes #2 & #3 with Before/After bullets</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>5-Minute AI Senior Mock Interview with scoring report</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-5">
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-medium border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setAuthMethod("phone");
                setStep("input");
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                authMethod === "phone"
                  ? "bg-white shadow-xs text-blue-600 font-semibold"
                  : "text-slate-600 hover:text-slate-900"
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
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                authMethod === "google"
                  ? "bg-white shadow-xs text-blue-600 font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Globe className="w-3 h-3 text-blue-600" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod("magic_link");
                setStep("input");
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                authMethod === "magic_link"
                  ? "bg-white shadow-xs text-blue-600 font-semibold"
                  : "text-slate-600 hover:text-slate-900"
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
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
                      Mobile Number (India +91)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <div className="absolute left-3 top-3 text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={loading}
                    className="w-full justify-center group"
                  >
                    <span>{loading ? "Sending OTP..." : "Send Verification OTP"}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-700">
                    <span>
                      Demo Mock OTP generated: <strong>7890</strong> (Ready to submit)
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1.5">
                      Enter 4-digit OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      placeholder="7890"
                      required
                      className="w-full text-center tracking-widest text-lg font-mono py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={loading}
                    className="w-full justify-center"
                  >
                    {loading ? "Verifying & Migrating..." : "Confirm & Unlock Features"}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setStep("input")}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
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
              <p className="text-xs text-slate-600">
                Sign in with your Google account. Your guest profile and messages will migrate automatically.
              </p>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleGoogleOAuth}
                disabled={loading}
                className="w-full justify-center gap-2"
              >
                <Globe className="w-4 h-4 text-blue-600" />
                <span>{loading ? "Connecting Google..." : "Continue with Google OAuth"}</span>
              </Button>
            </div>
          )}

          {/* Method 3: Email Magic Link */}
          {authMethod === "magic_link" && (
            <>
              {step !== "magic_sent" ? (
                <form onSubmit={handleSendMagicLink} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1.5">
                      College / Personal Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="student@college.edu"
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <div className="absolute left-3 top-3 text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={loading}
                    className="w-full justify-center group"
                  >
                    <span>{loading ? "Generating Link..." : "Send Magic Link"}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-700 space-y-1">
                    <p className="font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Magic Link Sent!
                    </p>
                    <p className="text-[11px]">{magicLinkSentMsg}</p>
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleVerifyMagicLink}
                    disabled={loading}
                    className="w-full justify-center"
                  >
                    {loading ? "Verifying..." : "⚡ Simulate 1-Tap Magic Link Click"}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Quick 1-Tap Demo Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleInstantDemoVerify}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>⚡ 1-Click Instant Demo Verification</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
