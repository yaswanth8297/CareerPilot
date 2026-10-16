# CareerPilot AI 🚀
### Personal Career Co-Pilot Chatbot for College Students

CareerPilot AI turns an anonymous visitor into a registered user in under 2 minutes by delivering personalised career value first and asking for registration only after value lands. Built with a supportive personal career guide tone, clear professional English, and zero judgment about college tier or CGPA.

---

## 🌟 Key Features Delivered (Per PRD)

1. **Friendly Personal Career Guide Chat Shell**:
   - **Professional English-Only** conversation experience.
   - Strict response length budget: max 2 to 3 short lines before interactive quick-reply chips.
   - Dual surfaces: Floating bottom-right widget and dedicated full-screen chat (`/chat`).
   - 4-step progressive onboarding (Branch → Year → Skills → Career Goal) in under 30 seconds.

2. **📄 Resume Check & ATS Score (Feature A)**:
   - Deterministic 100-point rubric breakdown (Formatting 20, Keyword 30, Impact 20, Completeness 15, Clarity 15).
   - Circular score gauge, friendly senior verdict, and **exactly 3 fixable mistakes** (contract verified).
   - Each mistake has: What is wrong, Why it hurts, How to fix, and Before → After bullet rewrite.
   - **Safety**: Rejects experience fabrication requests with genuine project suggestions.
   - **Gating**: Mistake #1 free preview; Mistakes #2 & #3 unlock on free registration (feature-flagged).

3. **🗺️ Personalised 90-Day Roadmap (Feature B)**:
   - 10 supported student tracks (Web Dev, Data Analyst, Python Dev, QA/Testing, Java, Digital Marketing, Core Mech, Core Civil, Core Electrical, Sales/BDA).
   - 3 phases across 12 weeks: **Phase 1: Foundation (Days 1-30)**, **Phase 2: Build (Days 31-60)**, **Phase 3: Job Ready (Days 61-90)**.
   - **Grounding Guarantee**: 100% of resource URLs trace to verified IDs in the vetted curated collection.
   - **Gating**: Weeks 1-2 free preview; full 12 weeks with interactive task progress saving on registration.

4. **💼 Skill-Based Job Matching (Feature C)**:
   - 25 realistic seeded demo jobs.
   - **Fairness Guarantee**: Ranking arithmetic depends strictly on skills and experience gap — completely unbiased by CGPA or college tier.
   - **Scam Heuristics**: Detects and warns against upfront deposit scams and free email domain postings.
   - Explicit high-CGPA postings are flagged with warning badges, not hidden.

5. **🎙️ 5-Minute Mock Interview (Feature D)**:
   - 5:00 countdown timer, 5-6 questions tuned for freshers (Intro, 2-3 Technical, Project, HR/Behavioral).
   - Instant comprehensive report: Score /10, 4-pillar breakdown, 3 strengths, 3 improvements, and model sample answer for weakest question.

6. **Student Dashboard ("My Space" - `/dashboard`)**:
   - Profile management, resume audit history, roadmap task tracker, saved jobs, interview reports.
   - **India DPDP Act Compliance**: Download My Complete Data (JSON), Account Deletion Request, and Consent Preference toggles (Model training opt-in off by default).

7. **Admin Dashboard (`/admin`)**:
   - Funnel telemetry & drop-off tracking across 5 steps.
   - Feature flags management (toggle ATS Mistakes #2 & #3 locking, voice interview stub).
   - Grounded knowledge base inspection and PII-redacted event stream.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS, Lucide React icons, Canvas Confetti
- **Validation**: Zod on all API endpoints and schemas
- **Storage & State**: Zero-configuration client/server store (runs with zero paid keys!)

---

## 🚀 Quick Start (Local Run with Zero Paid Keys)

### 1. Install dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🏗️ Architecture & Core Services

1. **Storage & Upload Security Pipeline** (`src/lib/services/storageService.ts`):
   - **Magic Bytes Verification**: Inspects file headers (`%PDF-` for PDF, `PK\x03\x04` for DOCX, UTF-8/ASCII for plain text; rejects unauthorized binaries).
   - **Malware Scanner Hook**: Stubs scanning layer with clean/quarantine flags.
   - **S3 & Local Storage Adapters**: S3/R2 object storage with zero-key local storage fallback and short-lived signed URLs.
   - **Upload Endpoint**: `/api/upload` handles validated uploads.

2. **Authentication Expansion** (`src/lib/services/authService.ts`):
   - **Phone OTP**: Mock code `7890` printed to local dev console.
   - **Google OAuth**: 1-click mock OAuth popup/redirect flow.
   - **Email Magic Link**: Secure token generation with 1-click verification simulation.
   - Unified transaction migrates all guest session records to the authenticated student account.

3. **Mock Interview Voice / STT Interface** (`src/components/chat/MockInterviewModal.tsx`):
   - Integrated Web Speech API (`webkitSpeechRecognition`) for hands-free speech input into the 5-minute mock interview.
   - Features animated audio waveforms and realistic local STT simulation fallback.

4. **Hybrid Retrieval System** (`src/lib/ai/hybridRetrieval.ts`):
   - Combines BM25 token keyword search with cosine similarity ranking.
   - Fuses rankings using **Reciprocal Rank Fusion (RRF)**:
     $$RRF(d) = \frac{1}{60 + rank_{keyword}} + \frac{1}{60 + rank_{vector}}$$
   - Generates cleanly delineated grounded context strictly citing internal resource IDs (`[res-xxx]`).

---

## ⚙️ Environment Variables (Optional)

Copy `.env.example` to `.env`:
```bash
# To run with Google Gemini:
GEMINI_API_KEY=your_gemini_api_key

# Object Storage (S3 / R2):
STORAGE_ACCESS_KEY=your_key
STORAGE_SECRET_KEY=your_secret
```

### Environment Variable Manifest

| Variable | Required? | Default / Fallback | Description |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Optional | `MockLLMProvider` | Google Gen AI API Key. When provided, initializes `GeminiProvider` using `@google/generative-ai` SDK (`gemini-1.5-flash` for low-latency chat, `gemini-1.5-pro` for deep tasks). If absent, gracefully falls back to deterministic zero-cost Mock Provider. |
| `STORAGE_ACCESS_KEY` | Optional | Local storage | S3 / Cloudflare R2 access key for resume uploads. Falls back to local secure storage. |
| `STORAGE_SECRET_KEY` | Optional | Local storage | S3 / Cloudflare R2 secret key for resume uploads. |

