"use client";

import { useState } from "react";
import { X, CheckCircle2, Phone, Mail, ArrowRight, Globe, Check, ShieldCheck } from "lucide-react";
import {
  initiatePhoneOtp,
  verifyPhoneOtp,
  initiateMagicLink,
  verifyMagicLink,
  verifyGoogleOAuthCallback
} from "@/lib/services/authService";
import { Button } from "@/components/ui/Button";

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

  const handleInstantDemoVerify = () => {
    verifyPhoneOtp("+91 98765 43210", "7890", "Demo Student Pilot");
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px] animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-xl border border-[#E7E5DE] shadow-atelier-lg overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-lg text-[#82858E] hover:text-[#141518] hover:bg-[#ECEBE4] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-[#FAFAF8] text-[#141518] p-6 pb-5 space-y-3 border-b border-[#E7E5DE]">
          <div className="w-9 h-9 rounded-lg bg-[#183059] flex items-center justify-center text-white">
            <ShieldCheck className="w-4 h-4" />
          </div>

          <div>
            <h3 className="text-lg font-semibold tracking-tight text-[#141518]">
              Save Progress &amp; Unlock Features
            </h3>
            <p className="text-xs text-[#52555E] mt-1 font-mono">
              Zero spam · Takes 15 seconds · 100% Free
            </p>
          </div>

          {/* Value Perks List */}
          <div className="bg-white rounded-lg p-3 border border-[#E7E5DE] space-y-1.5 text-xs text-[#52555E]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#183059] shrink-0" />
              <span>Full 90-Day (12-Week) Personalised Roadmap</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#183059] shrink-0" />
              <span>Unlock ATS Mistakes #2 &amp; #3 with Before/After diffs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#183059] shrink-0" />
              <span>5-Minute Mock Interview with full scoring report</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-5">
          <div className="flex rounded-lg bg-[#F4F3EE] p-1 text-xs font-medium border border-[#E7E5DE]">
            <button
              type="button"
              onClick={() => {
                setAuthMethod("phone");
                setStep("input");
              }}
              className={`flex-1 py-1.5 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                authMethod === "phone"
                  ? "bg-white shadow-xs text-[#183059] font-semibold"
                  : "text-[#52555E] hover:text-[#141518]"
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
              className={`flex-1 py-1.5 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                authMethod === "google"
                  ? "bg-white shadow-xs text-[#183059] font-semibold"
                  : "text-[#52555E] hover:text-[#141518]"
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod("magic_link");
                setStep("input");
              }}
              className={`flex-1 py-1.5 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                authMethod === "magic_link"
                  ? "bg-white shadow-xs text-[#183059] font-semibold"
                  : "text-[#52555E] hover:text-[#141518]"
              }`}
            >
              <Mail className="w-3 h-3" />
              <span>Magic Link</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-4">
          {authMethod === "phone" && (
            <>
              {step === "input" ? (
                <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-[#141518] block mb-1.5">
                      Mobile Number (India +91)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#E7E5DE] bg-[#FAFAF8] text-[#141518] text-sm focus:outline-none focus:ring-2 focus:ring-[#183059]"
                      />
                      <div className="absolute left-3 top-3 text-[#82858E]">
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
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-3">
                  <div className="p-3 bg-[#F4F3EE] rounded-lg border border-[#E7E5DE] text-xs text-[#141518]">
                    Demo OTP generated: <strong className="font-mono">7890</strong>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#141518] block mb-1.5">
                      Enter 4-digit OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      placeholder="7890"
                      required
                      className="w-full text-center tracking-widest text-lg font-mono py-2 rounded-lg border border-[#E7E5DE] bg-[#FAFAF8] text-[#141518] focus:outline-none focus:ring-2 focus:ring-[#183059]"
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
                    className="w-full text-center text-xs text-[#52555E] hover:text-[#141518] font-medium cursor-pointer"
                  >
                    ← Change number
                  </button>
                </form>
              )}
            </>
          )}

          {authMethod === "google" && (
            <div className="space-y-3 py-2 text-center">
              <p className="text-xs text-[#52555E]">
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
                <Globe className="w-4 h-4 text-[#183059]" />
                <span>{loading ? "Connecting Google..." : "Continue with Google"}</span>
              </Button>
            </div>
          )}

          {authMethod === "magic_link" && (
            <>
              {step !== "magic_sent" ? (
                <form onSubmit={handleSendMagicLink} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-[#141518] block mb-1.5">
                      College / Personal Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="student@college.edu"
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#E7E5DE] bg-[#FAFAF8] text-[#141518] text-sm focus:outline-none focus:ring-2 focus:ring-[#183059]"
                      />
                      <div className="absolute left-3 top-3 text-[#82858E]">
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
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-[#F0FDF4] rounded-lg border border-[#BBF7D0] text-xs text-[#166534] space-y-1">
                    <p className="font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Magic Link Sent
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
                    {loading ? "Verifying..." : "Simulate 1-Tap Magic Link Click"}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Quick 1-Tap Demo Button */}
          <div className="pt-3 border-t border-[#E7E5DE]">
            <button
              type="button"
              onClick={handleInstantDemoVerify}
              className="w-full py-2.5 rounded-lg bg-[#F4F3EE] hover:bg-[#ECEBE4] text-[#141518] font-medium text-xs transition-colors flex items-center justify-center gap-1.5 border border-[#E7E5DE] cursor-pointer"
            >
              <span>1-Click Instant Demo Verification</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
