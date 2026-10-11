export interface LLMResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    costUsd: number;
  };
}

export interface LLMProvider {
  name: string;
  generateText(prompt: string, systemPrompt?: string): Promise<LLMResponse>;
  generateStream?(prompt: string, systemPrompt?: string): AsyncGenerator<string, void, unknown>;
}

// Deterministic Mock Provider (Zero paid keys required per PRD)
export class MockLLMProvider implements LLMProvider {
  name = "MockDeterministicProvider";

  async generateText(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    // Return grounded simulated response adhering to the 2-3 line personal career guide rule
    return {
      text: "Absolutely! I'm here to help. Let's review your next milestone and accelerate your career journey! 🚀",
      usage: {
        promptTokens: 42,
        completionTokens: 28,
        costUsd: 0.0
      }
    };
  }

  async *generateStream(prompt: string, systemPrompt?: string): AsyncGenerator<string, void, unknown> {
    const fullText = "Absolutely! I'm here to help. Let's review your next milestone and accelerate your career journey! 🚀";
    const words = fullText.split(" ");
    for (let i = 0; i < words.length; i++) {
      yield (i === 0 ? "" : " ") + words[i];
    }
  }
}

// Re-export Gemini Provider from dedicated adapter
export {
  GeminiProvider,
  type GeminiProviderOptions,
  CAREERPILOT_SYSTEM_INSTRUCTION
} from "./providers/geminiProvider";

import { GeminiProvider } from "./providers/geminiProvider";

export interface ActiveProviderOptions {
  modelName?: string;
  task?: "chat" | "heavy";
}

export function getActiveLLMProvider(options?: ActiveProviderOptions): LLMProvider {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    const modelName =
      options?.modelName || (options?.task === "heavy" ? "gemini-1.5-pro-latest" : "gemini-1.5-flash-latest");
    return new GeminiProvider({ apiKey: geminiKey, modelName });
  }
  return new MockLLMProvider();
}

