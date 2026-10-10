import crypto from "crypto";
import { JobListing } from "../types";

export interface RawJobPayload {
  rawTitle: string;
  companyName: string;
  locationRaw?: string;
  descriptionText: string;
  sourceUrl: string;
  salaryText?: string;
  contactEmail?: string;
  requiredSkills?: string[];
  cgpaCriteria?: number;
}

export interface JobIngestionResult {
  totalProcessed: number;
  acceptedCount: number;
  duplicateCount: number;
  scamCount: number;
  normalizedJobs: JobListing[];
}

export interface JobIngestionAdapter {
  name: string;
  ingest(rawJobs: RawJobPayload[]): Promise<JobIngestionResult>;
}

export class LiveJobIngestionAdapter implements JobIngestionAdapter {
  name = "LiveJobIngestionAdapter";
  private seenHashes: Set<string> = new Set();

  async ingest(rawJobs: RawJobPayload[]): Promise<JobIngestionResult> {
    const normalized: JobListing[] = [];
    let duplicates = 0;
    let scams = 0;

    for (const raw of rawJobs) {
      // 1. Deduplication Hash
      const hash = crypto
        .createHash("md5")
        .update(`${raw.companyName.toLowerCase()}:${raw.rawTitle.toLowerCase()}:${(raw.locationRaw || "").toLowerCase()}`)
        .digest("hex");

      if (this.seenHashes.has(hash)) {
        duplicates++;
        continue;
      }
      this.seenHashes.add(hash);

      // 2. Scam Heuristics Detection per PRD
      const scamReasons: string[] = [];
      const descLower = (raw.descriptionText || "").toLowerCase();
      const emailLower = (raw.contactEmail || "").toLowerCase();

      // Check 1: Upfront money or deposit requested
      const depositKeywords = ["security deposit", "registration fee", "laptop processing fee", "pay ₹", "pay rs", "training fee"];
      if (depositKeywords.some(k => descLower.includes(k))) {
        scamReasons.push("Job description asks for upfront security deposit, training fee, or registration payment.");
      }

      // Check 2: Free email domain for supposedly established company
      const freeEmailDomains = ["@gmail.com", "@yahoo.com", "@hotmail.com", "@outlook.com"];
      if (freeEmailDomains.some(d => emailLower.includes(d))) {
        scamReasons.push(`Recruiter contact uses free email domain (${raw.contactEmail}) instead of corporate company domain.`);
      }

      // Check 3: Unrealistic fresher salary claim
      if (descLower.includes("data entry") || descLower.includes("typing") || descLower.includes("chat assistant")) {
        if ((raw.salaryText || "").includes("45,000/month") || (raw.salaryText || "").includes("30 LPA")) {
          scamReasons.push("Unrealistically high salary promise for unqualified data entry work.");
        }
      }

      const isScam = scamReasons.length > 0;
      if (isScam) scams++;

      // 3. High CGPA Flagging (Flagged, not hidden per PRD)
      const hasCgpaFilter = (raw.cgpaCriteria !== undefined && raw.cgpaCriteria >= 8.0) || descLower.includes("cgpa > 8");

      // 4. Normalized Job Card
      const job: JobListing = {
        id: `ingest_${hash.slice(0, 8)}`,
        title: raw.rawTitle.trim(),
        company: raw.companyName.trim(),
        location: raw.locationRaw || "India",
        isRemote: (raw.locationRaw || "").toLowerCase().includes("remote") || descLower.includes("work from home"),
        jobType: raw.rawTitle.toLowerCase().includes("intern") ? "Internship" : "Fresher",
        matchPercent: isScam ? 35 : 85,
        whyItMatches: `Matched based on technical role title and foundational skill tags.`,
        matchedSkills: raw.requiredSkills || ["Problem Solving", "Core Concepts"],
        missingSkills: [],
        hasCgpaFilter,
        minCgpaRequired: raw.cgpaCriteria,
        isScamSuspicious: isScam,
        scamReasons: isScam ? scamReasons : undefined,
        applyUrl: raw.sourceUrl,
        postedDate: "Recent Ingestion",
        salaryRange: raw.salaryText || "Competitive (Fresher standard)"
      };

      normalized.push(job);
    }

    return {
      totalProcessed: rawJobs.length,
      acceptedCount: normalized.length,
      duplicateCount: duplicates,
      scamCount: scams,
      normalizedJobs: normalized
    };
  }
}
