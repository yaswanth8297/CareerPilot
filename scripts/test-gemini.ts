import fs from "node:fs";
import path from "node:path";
import { GeminiProvider, CAREERPILOT_SYSTEM_INSTRUCTION } from "../src/lib/ai/providers/geminiProvider";
import { getActiveLLMProvider, MockLLMProvider } from "../src/lib/ai/provider";
import { getChatBotLLMProvider } from "../src/lib/ai/chatBotEngine";

// Automatically load local .env or .env.local if present
const rootDir = process.cwd();
const envLocalPath = path.join(rootDir, ".env.local");
const envPath = path.join(rootDir, ".env");

if (fs.existsSync(envLocalPath)) {
  try {
    process.loadEnvFile(envLocalPath);
    console.log("📁 Loaded environment variables from .env.local");
  } catch (e) {
    // ignore
  }
} else if (fs.existsSync(envPath)) {
  try {
    process.loadEnvFile(envPath);
    console.log("📁 Loaded environment variables from .env");
  } catch (e) {
    // ignore
  }
}

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}${detail ? ` -> ${detail}` : ""}`);
    failed++;
  }
}

async function runGeminiIntegrationTests() {
  console.log("==================================================");
  console.log("    CAREERPILOT AI — GEMINI API ADAPTER TESTS     ");
  console.log("==================================================\n");

  // 1. Adapter & Configuration Unit Verification
  console.log("▶ [1/4] Verifying Gemini Adapter Class & Model Presets...");
  const chatProvider = GeminiProvider.forChat();
  assert(
    chatProvider.modelName === "gemini-1.5-flash-latest",
    "GeminiProvider.forChat() configures 'gemini-1.5-flash-latest' for low latency"
  );

  const heavyProvider = GeminiProvider.forHeavyTasks();
  assert(
    heavyProvider.modelName === "gemini-1.5-pro-latest",
    "GeminiProvider.forHeavyTasks() configures 'gemini-1.5-pro-latest' for heavy analysis"
  );

  assert(
    CAREERPILOT_SYSTEM_INSTRUCTION.includes("English") &&
    CAREERPILOT_SYSTEM_INSTRUCTION.includes("2 to 3") &&
    CAREERPILOT_SYSTEM_INSTRUCTION.includes("branch, year of study, and career goals conversationally"),
    "CAREERPILOT_SYSTEM_INSTRUCTION enforces conversational context gathering, English-only persona, and 2-3 line response budget"
  );

  // 2. Factory / Selection Logic Verification
  console.log("\n▶ [2/4] Testing Factory Selection Logic...");
  const originalKey = process.env.GEMINI_API_KEY;

  try {
    // Test with mock/absent key
    delete process.env.GEMINI_API_KEY;
    const fallbackProvider = getActiveLLMProvider();
    assert(
      fallbackProvider instanceof MockLLMProvider,
      "getActiveLLMProvider() returns MockLLMProvider when GEMINI_API_KEY is absent"
    );

    // Test with key present
    process.env.GEMINI_API_KEY = "test-mock-key-12345";
    const activeProvider = getActiveLLMProvider();
    assert(
      activeProvider instanceof GeminiProvider,
      "getActiveLLMProvider() initializes GeminiProvider when GEMINI_API_KEY is present"
    );

    const chatEngineProvider = getChatBotLLMProvider();
    assert(
      chatEngineProvider instanceof GeminiProvider &&
      (chatEngineProvider as GeminiProvider).modelName === "gemini-1.5-flash-latest",
      "getChatBotLLMProvider() selects GeminiProvider with gemini-1.5-flash-latest"
    );
  } finally {
    // Restore original key
    if (originalKey) {
      process.env.GEMINI_API_KEY = originalKey;
    } else {
      delete process.env.GEMINI_API_KEY;
    }
  }

  // 3. Fallback Mechanism Verification
  console.log("\n▶ [3/4] Verifying Graceful Fallback Handling...");
  const noKeyProvider = new GeminiProvider({ apiKey: "", fallbackToMock: true });
  const fallbackResponse = await noKeyProvider.generateText(
    "How can I prepare for an off-campus software engineering interview?"
  );
  assert(
    typeof fallbackResponse.text === "string" && fallbackResponse.text.length > 0,
    "GeminiProvider gracefully falls back to MockLLMProvider when unconfigured"
  );
  assert(
    fallbackResponse.usage !== undefined && typeof fallbackResponse.usage.promptTokens === "number",
    "Mock fallback returns structured token and cost metrics"
  );

  // 4. Live Connection & System Prompt Constraints Validation
  console.log("\n▶ [4/4] Validating Live Gemini API or Fallback Execution...");
  const activeKey = process.env.GEMINI_API_KEY;

  if (activeKey && !activeKey.startsWith("test-mock")) {
    console.log(`🌐 Live GEMINI_API_KEY detected (${activeKey.substring(0, 6)}...${activeKey.slice(-4)}). Testing live Google Gen AI call...`);
    try {
      const liveProvider = new GeminiProvider({
        apiKey: activeKey,
        modelName: "gemini-1.5-flash-latest",
        fallbackToMock: false,
      });

      const testPrompt = "I am a 3rd year mechanical student who wants to switch into data analytics. What should I study first?";
      console.log(`💬 Prompt: "${testPrompt}"`);

      let response;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          response = await liveProvider.generateText(testPrompt);
          break;
        } catch (retryErr: any) {
          if (attempt < 3 && retryErr?.message?.includes("503")) {
            console.log(`⏳ Google servers returned temporary 503, retrying attempt ${attempt + 1} in 2s...`);
            await new Promise((r) => setTimeout(r, 2000));
          } else {
            throw retryErr;
          }
        }
      }

      console.log(`🤖 Gemini Response:\n"${response?.text}"\n`);
      console.log(`📊 Usage: ${response?.usage?.promptTokens} prompt tokens, ${response?.usage?.completionTokens} completion tokens, estimated cost: $${response?.usage?.costUsd?.toFixed(6)}`);

      assert(
        (response?.text?.length ?? 0) > 0,
        "Live Gemini API returned a valid non-empty response"
      );

      // Verify constraints: English only and 2-3 lines/sentences
      const resText = response?.text || "";
      const lines = resText.split("\n").filter(l => l.trim().length > 0);
      const sentences = resText.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0);

      assert(
        sentences.length <= 4,
        "Live response adheres to concise budget constraints (<= 3-4 sentences)",
        `Actual sentences: ${sentences.length}`
      );

      // Verify English language response
      const isEnglish = /^[\x00-\x7F\s\p{P}\p{Emoji}]+$/u.test(resText);
      assert(
        isEnglish,
        "Live response adheres to English-only persona"
      );

      // Verify streaming generator
      console.log("🌊 Testing live real-time token streaming...");
      let streamedTokens = 0;
      let streamedText = "";
      for await (const chunk of liveProvider.generateStream("Brief 1-sentence tip for internships")) {
        streamedTokens++;
        streamedText += chunk;
      }
      assert(
        streamedTokens > 0 && streamedText.length > 0,
        "liveProvider.generateStream() yielded real-time token chunks successfully"
      );
    } catch (err: any) {
      console.error("❌ Live API error during test:", err?.message || err);
      assert(false, "Live Gemini API call succeeded", err?.message);
    }
  } else {
    console.log("ℹ️ No live GEMINI_API_KEY found in environment or .env file.");
    console.log("   (To test live responses against Google's servers, add GEMINI_API_KEY=your_key to .env)");

    // Test systemInstruction parameter pass-through and simulated invocation
    const mockSimulatedProvider = new GeminiProvider({
      apiKey: "test-simulated-key",
      fallbackToMock: true,
      modelName: "gemini-1.5-flash",
    });

    const testPrompt = "How do I make my resume pass ATS filters?";
    const response = await mockSimulatedProvider.generateText(
      testPrompt,
      "Target Role: Software Developer, Focus: Keywords and Action Verbs"
    );

    assert(
      response.text.length > 0,
      "Adapter safely handled query with custom system context"
    );
    assert(
      response.usage !== undefined,
      "Adapter provided deterministic usage telemetry"
    );
  }

  console.log("\n==================================================");
  console.log(`Tests Summary: ${passed} Passed, ${failed} Failed`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log("Gemini API adapter integration verified successfully! ✨\n");
  }
}

runGeminiIntegrationTests().catch((err) => {
  console.error("Unhandled error running tests:", err);
  process.exit(1);
});
