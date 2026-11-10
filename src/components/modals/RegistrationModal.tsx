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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-paper rounded-xl border border-hairline shadow-atelier-lg overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-lg text-ink-subtle hover:text-ink hover:bg-inset transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="bg-canvas text-ink p-6 pb-5 space-y-3 border-b border-hairline">
          <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center text-white">
            <ShieldCheck className="w-4 h-4" />
          </div>

          <div>
            <h3 className="text-lg font-semibold tracking-tight text-ink">
              Save Progress &amp; Unlock Features
            </h3>
            <p className="text-xs text-ink-muted mt-1 font-mono">
              Zero spam · Takes 15 seconds · 100% Free
            </p>
          </div>

          <div className="bg-paper rounded-lg p-3 border border-hairline space-y-1.5 text-xs text-ink-muted">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-ink shrink-0" />
              <span>Full 90-Day (12-Week) Personalised Roadmap</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-ink shrink-0" />
              <span>Unlock ATS Mistakes #2 &amp; #3 with Before/After diffs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-ink shrink-0" />
              <span>5-Minute Mock Interview with full scoring report</span>
            </div>
          </div>
        </div>

        <div className="px-6 pt-5">
          <div className="flex rounded-lg bg-inset p-1 text-xs font-medium border border-hairline">
            <button
              type="button"
              onClick={() => {
                setAuthMethod("phone");
                setStep("input");
              }}
              className={`flex-1 py-1.5 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                authMethod === "phone"
                  ? "bg-paper shadow-xs text-brand-ink font-semibold"
                  : "text-ink-muted hover:text-ink"
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
                  ? "bg-paper shadow-xs text-brand-ink font-semibold"
                  : "text-ink-muted hover:text-ink"
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
                  ? "bg-paper shadow-xs text-brand-ink font-semibold"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <Mail className="w-3 h-3" />
              <span>Magic Link</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {authMethod === "phone" && (
            <>
              {step === "input" ? (
                <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-ink block mb-1.5">
                      Mobile Number (India +91)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      <div className="absolute left-3 top-3 text-ink-subtle">
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
                  <div className="p-3 bg-inset rounded-lg border border-hairline text-xs text-ink">
                    Demo OTP generated: <strong className="font-mono">7890</strong>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-ink block mb-1.5">
                      Enter 4-digit OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      placeholder="7890"
                      required
                      className="w-full text-center tracking-widest text-lg font-mono py-2 rounded-lg border border-hairline bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-brand"
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
                    className="w-full text-center text-xs text-ink-muted hover:text-ink font-medium cursor-pointer"
                  >
                    ← Change number
                  </button>
                </form>
              )}
            </>
          )}

          {authMethod === "google" && (
            <div className="space-y-3 py-2 text-center">
              <p className="text-xs text-ink-muted">
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
                <Globe className="w-4 h-4 text-brand-ink" />
                <span>{loading ? "Connecting Google..." : "Continue with Google"}</span>
              </Button>
            </div>
          )}

          {authMethod === "magic_link" && (
            <>
              {step !== "magic_sent" ? (
                <form onSubmit={handleSendMagicLink} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-ink block mb-1.5">
                      College / Personal Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="student@college.edu"
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      <div className="absolute left-3 top-3 text-ink-subtle">
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
                  <div className="p-3 bg-pass-bg rounded-lg border border-pass-border text-xs text-pass space-y-1">
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

          <div className="pt-3 border-t border-hairline">
            <button
              type="button"
              onClick={handleInstantDemoVerify}
              className="w-full py-2.5 rounded-full bg-inset hover:bg-inset-hover text-ink font-medium text-xs transition-colors flex items-center justify-center gap-1.5 border border-hairline cursor-pointer"
            >
              <span>1-Click Instant Demo Verification</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
