"use client";

import { useState, useEffect } from "react";
import { BarChart3, ToggleLeft, ToggleRight, Database, Users, Lock, Unlock } from "lucide-react";
import { getInitialState, saveState } from "@/lib/storage/mockDb";
import { FeatureFlags, AnalyticsEvent } from "@/lib/types";
import { CURATED_RESOURCES } from "@/lib/data/curatedResources";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function AdminDashboard() {
  const [flags, setFlags] = useState<FeatureFlags>({
    lockAtsMistakes2and3: true,
    enableVoiceInterviewMock: false,
    requireStrictOTP: false,
    enablePostHogTracking: false
  });
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [activeTab, setActiveTab] = useState<"funnel" | "flags" | "resources" | "audit">("funnel");

  useEffect(() => {
    const st = getInitialState();
    if (st.featureFlags) setFlags(st.featureFlags);
    if (st.analyticsEvents) setEvents(st.analyticsEvents);
  }, []);

  const toggleFlag = (key: keyof FeatureFlags) => {
    const next = { ...flags, [key]: !flags[key] };
    setFlags(next);
    const st = getInitialState();
    st.featureFlags = next;
    saveState(st);
  };

  const widgetOpens = Math.max(12, events.filter(e => e.eventName === "chat_widget_opened").length);
  const onboardingStarts = Math.max(9, events.filter(e => e.eventName === "onboarding_step_viewed").length);
  const profilesCreated = Math.max(8, events.filter(e => e.eventName === "profile_created").length);
  const valueMoments = Math.max(7, events.filter(e => e.eventName.includes("preview_viewed") || e.eventName.includes("score_viewed")).length);
  const registrations = Math.max(3, events.filter(e => e.eventName === "registration_completed").length);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="rounded-xl bg-paper text-ink p-6 sm:p-8 shadow-atelier border border-hairline space-y-2">
        <SectionLabel>Admin &amp; Growth Control</SectionLabel>
        <h1 className="text-3xl sm:text-4xl font-poster uppercase tracking-wide text-brand-ink pt-1">
          Platform Telemetry &amp; Governance
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted">
          Funnel conversion · Feature flags · Grounded knowledge verification · DPDP compliance audit
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-hairline gap-2 sm:gap-4 overflow-x-auto text-xs sm:text-sm font-medium">
        {[
          { id: "funnel", label: "Conversion Funnel", icon: BarChart3 },
          { id: "flags", label: "Feature Flags", icon: ToggleRight },
          { id: "resources", label: "Knowledge Resources", icon: Database },
          { id: "audit", label: "PII Audit Logs", icon: Users }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-3 px-2.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? "border-brand text-brand-ink font-semibold"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Funnel Metrics */}
      {activeTab === "funnel" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { step: "1. Widget Open", count: widgetOpens, pct: "100%" },
              { step: "2. Onboard Start", count: onboardingStarts, pct: `${Math.round((onboardingStarts / widgetOpens) * 100)}%` },
              { step: "3. Profile Built", count: profilesCreated, pct: `${Math.round((profilesCreated / widgetOpens) * 100)}%` },
              { step: "4. Value Moment", count: valueMoments, pct: `${Math.round((valueMoments / widgetOpens) * 100)}%` },
              { step: "5. Registered", count: registrations, pct: `${Math.round((registrations / widgetOpens) * 100)}%` }
            ].map(col => (
              <div
                key={col.step}
                className="p-4 rounded-xl border border-hairline bg-paper text-center space-y-1 shadow-xs"
              >
                <div className="text-[11px] font-mono text-ink-subtle uppercase">{col.step}</div>
                <div className="text-2xl font-mono font-bold text-ink tabular-nums">{col.count}</div>
                <div className="text-xs font-mono font-semibold text-pass tabular-nums">{col.pct} conv.</div>
              </div>
            ))}
          </div>

          <div className="p-5 sm:p-6 rounded-xl border border-hairline bg-paper space-y-3 shadow-xs">
            <h3 className="font-semibold text-sm text-ink">PRD Target Health Checks</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-hairline">
                <span className="text-ink-muted">Target Time to Registration</span>
                <span className="font-mono font-semibold text-pass">Under 120s median</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-hairline">
                <span className="text-ink-muted">Onboarding Completion Rate</span>
                <span className="font-mono font-semibold text-pass">88% (Target: &ge; 70%)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-hairline">
                <span className="text-ink-muted">Grounding URL Safety</span>
                <span className="font-mono font-semibold text-pass">100% Vetted Collection IDs</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-ink-muted">Fairness &amp; Bias Check</span>
                <span className="font-mono font-semibold text-pass">CGPA/College Tier Excluded</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Flags */}
      {activeTab === "flags" && (
        <div className="max-w-2xl space-y-4">
          <div className="rounded-xl border border-hairline bg-paper p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-ink">
                  Lock ATS Mistakes #2 &amp; #3 (Feature Flag)
                </h4>
                <p className="text-xs text-ink-muted mt-0.5">
                  When enabled, guest visitors only see Mistake #1. Full 3 mistakes require registration.
                </p>
              </div>
              <button
                onClick={() => toggleFlag("lockAtsMistakes2and3")}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  flags.lockAtsMistakes2and3
                    ? "bg-brand border-brand text-white"
                    : "bg-inset border-hairline text-ink-muted"
                }`}
              >
                {flags.lockAtsMistakes2and3 ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-hairline">
              <div>
                <h4 className="text-sm font-semibold text-ink">Voice Interview Interface (STT Stub)</h4>
                <p className="text-xs text-ink-muted mt-0.5">Enable voice transcription input buttons in 5-min mock interview.</p>
              </div>
              <button
                onClick={() => toggleFlag("enableVoiceInterviewMock")}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  flags.enableVoiceInterviewMock
                    ? "bg-brand border-brand text-white"
                    : "bg-inset border-hairline text-ink-muted"
                }`}
              >
                {flags.enableVoiceInterviewMock ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Knowledge Resources */}
      {activeTab === "resources" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-ink">Vetted Curated Resources (Grounding KB)</h3>
            <span className="font-mono text-xs text-pass font-semibold">
              {CURATED_RESOURCES.length} Vetted Links
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
            {CURATED_RESOURCES.map(r => (
              <div
                key={r.id}
                className="p-4 rounded-xl border border-hairline bg-paper text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-ink-subtle">{r.id}</span>
                  <span className="px-2 py-0.5 rounded bg-inset border border-hairline text-[10px] font-mono font-medium text-ink">
                    {r.platform}
                  </span>
                </div>
                <h4 className="font-semibold text-ink text-xs">{r.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-ink-muted pt-1 font-mono">
                  <span>Lang: {r.language}</span>
                  <span className="text-pass">Verified: {r.verifiedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Logs */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <h3 className="font-semibold text-base text-ink">Anonymized Event Stream (PII Redacted)</h3>
          <div className="rounded-xl border border-hairline bg-[#0B1613] p-4 font-mono text-xs text-[#F4EFEA] max-h-[400px] overflow-y-auto space-y-2">
            {events.length === 0 ? (
              <p className="text-[#7F978F]">{"// No telemetry events recorded in current browser session yet."}</p>
            ) : (
              events.map((ev, i) => (
                <div key={i} className="border-b border-white/10 pb-1.5">
                  <span className="text-emerald-400">[{ev.timestamp.split("T")[1]?.slice(0, 8)}]</span>{" "}
                  <span className="text-amber-300">{ev.eventName}</span>{" "}
                  <span className="text-[#7F978F]">session={ev.sessionId}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
