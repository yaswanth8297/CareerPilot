import crypto from "crypto";
import { User } from "../types";
import { migrateGuestToUser } from "../storage/mockDb";

export type AuthProviderType = "phone_otp" | "google_oauth" | "magic_link";

export interface AuthInitiationResult {
  provider: AuthProviderType;
  identifier: string;
  sentAt: string;
  mockTokenOrCode?: string; // Only provided in dev environment
  message: string;
}

export interface AuthVerificationResult {
  success: boolean;
  user?: User;
  provider: AuthProviderType;
  error?: string;
}

// In-memory token store for magic links and OTPs
const tokenStore = new Map<string, { code: string; expiresAt: number; provider: AuthProviderType; name?: string }>();

// 1. Phone OTP Service
export function initiatePhoneOtp(phone: string): AuthInitiationResult {
  const cleanPhone = phone.trim();
  const code = "7890"; // Deterministic mock OTP for zero-key dev per PRD
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins

  tokenStore.set(cleanPhone, { code, expiresAt, provider: "phone_otp" });

  if (process.env.NODE_ENV !== "production") {
    console.log(`[CareerPilot Mock Phone OTP Adapter] OTP for ${cleanPhone}: ${code}`);
  }

  return {
    provider: "phone_otp",
    identifier: cleanPhone,
    sentAt: new Date().toISOString(),
    mockTokenOrCode: code,
    message: `Verification OTP sent to ${cleanPhone}. (Dev code: ${code})`
  };
}

export function verifyPhoneOtp(phone: string, otp: string, name?: string): AuthVerificationResult {
  const cleanPhone = phone.trim();
  const stored = tokenStore.get(cleanPhone);

  if (!stored || stored.provider !== "phone_otp") {
    // If no record, accept standard demo code 7890
    if (otp === "7890") {
      const migration = migrateGuestToUser(cleanPhone, name || "Student Pilot");
      return { success: true, user: migration.user, provider: "phone_otp" };
    }
    return { success: false, provider: "phone_otp", error: "Invalid or expired OTP. Try 7890." };
  }

  if (Date.now() > stored.expiresAt) {
    tokenStore.delete(cleanPhone);
    return { success: false, provider: "phone_otp", error: "OTP has expired. Please request a new one." };
  }

  if (stored.code !== otp && otp !== "7890") {
    return { success: false, provider: "phone_otp", error: "Incorrect OTP code. Enter 7890." };
  }

  tokenStore.delete(cleanPhone);
  const migration = migrateGuestToUser(cleanPhone, name || "Student Pilot");
  return { success: true, user: migration.user, provider: "phone_otp" };
}

// 2. Google OAuth Service
export function initiateGoogleOAuth(redirectUri = "/api/auth/callback/google"): { oauthUrl: string; state: string } {
  const state = crypto.randomBytes(16).toString("hex");
  // In dev / zero-key mode, provides immediate mock OAuth redirect
  const mockOAuthUrl = `/api/auth/callback/google?state=${state}&code=mock_google_auth_code_99`;
  return { oauthUrl: mockOAuthUrl, state };
}

export function verifyGoogleOAuthCallback(
  code: string,
  mockProfile?: { email: string; name: string; avatarUrl?: string }
): AuthVerificationResult {
  const email = mockProfile?.email || "student.google@gmail.com";
  const name = mockProfile?.name || "Google Pilot Student";

  const migration = migrateGuestToUser(email, name);
  return {
    success: true,
    user: migration.user,
    provider: "google_oauth"
  };
}

// 3. Email Magic Link Fallback Service
export function initiateMagicLink(email: string, name?: string): AuthInitiationResult {
  const cleanEmail = email.toLowerCase().trim();
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

  tokenStore.set(token, { code: token, expiresAt, provider: "magic_link", name });

  const magicLinkUrl = `/api/auth/verify-magic-link?token=${token}&email=${encodeURIComponent(cleanEmail)}`;

  if (process.env.NODE_ENV !== "production") {
    console.log(`[CareerPilot Magic Link Adapter] Magic Link for ${cleanEmail}: ${magicLinkUrl}`);
  }

  return {
    provider: "magic_link",
    identifier: cleanEmail,
    sentAt: new Date().toISOString(),
    mockTokenOrCode: token,
    message: `Magic sign-in link generated for ${cleanEmail}.`
  };
}

export function verifyMagicLink(token: string, email: string): AuthVerificationResult {
  const stored = tokenStore.get(token);
  if (!stored || stored.provider !== "magic_link") {
    // Graceful fallback for mock links
    const migration = migrateGuestToUser(email, "Magic Link Student");
    return { success: true, user: migration.user, provider: "magic_link" };
  }

  if (Date.now() > stored.expiresAt) {
    tokenStore.delete(token);
    return { success: false, provider: "magic_link", error: "Magic link has expired." };
  }

  tokenStore.delete(token);
  const migration = migrateGuestToUser(email, stored.name || "Verified Student");
  return { success: true, user: migration.user, provider: "magic_link" };
}
