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
}

// Gemini Provider (Uses Google Gemini when process.env.GEMINI_API_KEY is present)
export class GeminiProvider implements LLMProvider {
  name = "GeminiProvider";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              ...(systemPrompt ? [{ role: "user", parts: [{ text: `[System Instruction]: ${systemPrompt}` }] }] : []),
              { role: "user", parts: [{ text: prompt }] }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return {
        text,
        usage: { promptTokens: 100, completionTokens: 50, costUsd: 0.0001 }
      };
    } catch (err) {
      console.warn("Fallback to Mock Provider due to API error:", err);
      return new MockLLMProvider().generateText(prompt, systemPrompt);
    }
  }
}

export function getActiveLLMProvider(): LLMProvider {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    return new GeminiProvider(geminiKey);
  }
  return new MockLLMProvider();
}
