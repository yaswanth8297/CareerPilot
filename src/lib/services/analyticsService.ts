import { logAnalytics as storeLogAnalytics } from "../storage/mockDb";

export type PRDAnalyticsEvent =
  | "chat_widget_opened"
  | "chat_started"
  | "onboarding_step_viewed"
  | "onboarding_step_completed"
  | "profile_created"
  | "feature_selected"
  | "resume_upload_started"
  | "resume_score_viewed"
  | "roadmap_preview_viewed"
  | "job_preview_viewed"
  | "registration_prompt_viewed"
  | "registration_started"
  | "registration_completed"
  | "mock_interview_started"
  | "mock_interview_completed"
  | "dashboard_viewed"
  | "feedback_submitted"
  | "account_deletion_requested";

export interface AnalyticsAdapter {
  name: string;
  track(eventName: PRDAnalyticsEvent, properties?: Record<string, any>, sessionId?: string): Promise<void>;
}

// 1. Automatic PII Redaction Filter per PRD Specification
export function redactPII(payload?: Record<string, any>): Record<string, any> {
  if (!payload) return {};
  const redacted: Record<string, any> = {};

  const sensitiveKeys = ["email", "phone", "phonenumber", "password", "otp", "resumetext", "token", "authcode"];

  for (const [key, value] of Object.entries(payload)) {
    const keyLower = key.toLowerCase();

    if (sensitiveKeys.some(s => keyLower.includes(s))) {
      redacted[key] = "[REDACTED_PII]";
      continue;
    }

    if (typeof value === "string") {
      // Redact email pattern
      let scrubbed = value.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED_EMAIL]");
      // Redact phone number pattern
      scrubbed = scrubbed.replace(/(\+91[\-\s]?)?[6-9]\d{9}/g, "[REDACTED_PHONE]");
      redacted[key] = scrubbed;
    } else {
      redacted[key] = value;
    }
  }

  return redacted;
}

// 2. Clean Console & MockDB Local Analytics Adapter
export class ConsoleAnalyticsAdapter implements AnalyticsAdapter {
  name = "ConsoleAnalyticsAdapter";

  async track(eventName: PRDAnalyticsEvent, properties?: Record<string, any>, sessionId = "unknown_session"): Promise<void> {
    const scrubbedProps = redactPII(properties);

    if (typeof window !== "undefined") {
      storeLogAnalytics(eventName, scrubbedProps);
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`[Telemetry Redacted Event] '${eventName}' | session=${sessionId}`, scrubbedProps);
    }
  }
}

// 3. PostHog Analytics Adapter
export class PostHogAnalyticsAdapter implements AnalyticsAdapter {
  name = "PostHogAnalyticsAdapter";
  private apiKey: string;
  private host: string;

  constructor(apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || "", host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com") {
    this.apiKey = apiKey;
    this.host = host;
  }

  async track(eventName: PRDAnalyticsEvent, properties?: Record<string, any>, sessionId = "unknown_session"): Promise<void> {
    const scrubbedProps = redactPII(properties);

    // Save locally first
    if (typeof window !== "undefined") {
      storeLogAnalytics(eventName, scrubbedProps);
    }

    if (!this.apiKey) {
      return; // Fallback silently
    }

    try {
      await fetch(`${this.host}/capture/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: this.apiKey,
          event: eventName,
          distinct_id: sessionId,
          properties: {
            ...scrubbedProps,
            $session_id: sessionId,
            source: "careerpilot-web"
          }
        })
      });
    } catch (e) {
      console.warn("[PostHog] Failed to send telemetry event:", e);
    }
  }
}

const consoleAdapterInstance = new ConsoleAnalyticsAdapter();

export function getActiveAnalyticsService(): AnalyticsAdapter {
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return new PostHogAnalyticsAdapter(process.env.NEXT_PUBLIC_POSTHOG_KEY);
  }
  return consoleAdapterInstance;
}
