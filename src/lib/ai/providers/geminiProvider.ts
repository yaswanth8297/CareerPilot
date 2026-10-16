import { GoogleGenerativeAI } from "@google/generative-ai";
import { LLMProvider, LLMResponse, MockLLMProvider } from "../provider";

/**
 * Strict System Instruction enforcing CareerPilot AI persona:
 * 1. Professional English-only communication
 * 2. Strict 2-3 line response budget
 * 3. Empathetic, supportive tone with zero judgment regarding college tier or CGPA
 */
export const CAREERPILOT_SYSTEM_INSTRUCTION = `You are CareerPilot, a professional personal career guide and co-pilot for college students.
STRICT GUIDELINES:
1. Conversational Context Gathering: You are a professional career guide. Naturally ask the user about their branch, year of study, and career goals conversationally. Once you have enough context, recommend they try one of the platform features: ATS Resume Check, 90-Day Roadmap, Job Matches, or Mock Interview.
2. Language: Communicate strictly in clear, professional English at all times.
3. Length Budget: Strictly keep your responses concise, between 2 to 3 short lines (maximum 3 concise sentences). Never exceed 3 sentences.
4. Tone: Be encouraging, empathetic, and solution-oriented. Never judge the student by their college tier, backlogs, marks, or CGPA.
5. Actionability: Focus on practical skills, real-world projects, and concrete next steps.`;

export interface GeminiProviderOptions {
  apiKey?: string;
  modelName?: "gemini-1.5-flash-latest" | "gemini-1.5-pro-latest" | "gemini-flash-latest" | string;
  systemInstruction?: string;
  temperature?: number;
  fallbackToMock?: boolean;
}

export class GeminiProvider implements LLMProvider {
  public readonly name = "GeminiProvider";
  public readonly modelName: string;
  private readonly apiKey: string;
  private readonly genAI: GoogleGenerativeAI | null = null;
  private readonly defaultSystemInstruction: string;
  private readonly fallbackToMock: boolean;
  private readonly temperature: number;

  constructor(optionsOrApiKey?: string | GeminiProviderOptions) {
    let options: GeminiProviderOptions = {};
    if (typeof optionsOrApiKey === "string") {
      options = { apiKey: optionsOrApiKey };
    } else if (optionsOrApiKey) {
      options = optionsOrApiKey;
    }

    this.apiKey = options.apiKey || process.env.GEMINI_API_KEY || "";
    this.modelName = options.modelName || "gemini-1.5-flash-latest";
    this.defaultSystemInstruction = options.systemInstruction || CAREERPILOT_SYSTEM_INSTRUCTION;
    this.fallbackToMock = options.fallbackToMock !== false;
    this.temperature = options.temperature ?? 0.7;

    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  /**
   * Resolves candidate models to ensure maximum speed and compatibility.
   */
  private getCandidateModels(): string[] {
    if (this.modelName.includes("pro")) {
      return ["gemini-pro-latest", "gemini-3.5-flash"];
    }
    return ["gemini-flash-lite-latest", "gemini-3.5-flash", "gemini-3.5-flash-lite"];
  }

  /**
   * Generates text response using Google Generative AI SDK with configured systemInstruction.
   */
  async generateText(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    if (!this.genAI || !this.apiKey) {
      if (this.fallbackToMock) {
        console.warn("[GeminiProvider] GEMINI_API_KEY is not set. Gracefully falling back to MockLLMProvider.");
        return new MockLLMProvider().generateText(prompt, systemPrompt);
      }
      throw new Error("Gemini API key is required but not configured.");
    }

    const effectiveSystemInstruction = systemPrompt
      ? `${this.defaultSystemInstruction}\n\n[Task Context]:\n${systemPrompt}`
      : this.defaultSystemInstruction;

    const modelsToTry = this.getCandidateModels();
    let lastError: unknown = null;

    for (const candidateModel of modelsToTry) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: candidateModel,
          systemInstruction: effectiveSystemInstruction,
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 160,
          },
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text()?.trim() || "";

        const promptTokens = response.usageMetadata?.promptTokenCount ?? 0;
        const completionTokens = response.usageMetadata?.candidatesTokenCount ?? 0;

        const costPerMillionPrompt = this.modelName.includes("pro") ? 3.5 : 0.075;
        const costPerMillionCompletion = this.modelName.includes("pro") ? 10.5 : 0.30;
        const costUsd =
          (promptTokens * costPerMillionPrompt + completionTokens * costPerMillionCompletion) / 1_000_000;

        return {
          text,
          usage: {
            promptTokens,
            completionTokens,
            costUsd,
          },
        };
      } catch (err: any) {
        lastError = err;
        console.warn(`[GeminiProvider] Model '${candidateModel}' encountered error (${err?.status || err?.message}). Trying fallback...`);
      }
    }

    if (this.fallbackToMock) {
      console.warn("[GeminiProvider] All Gemini models failed. Falling back to MockLLMProvider. Error:", lastError);
      return new MockLLMProvider().generateText(prompt, systemPrompt);
    }
    throw lastError;
  }

  /**
   * Generates real-time streaming text chunks using Google Generative AI SDK's generateContentStream.
   */
  async *generateStream(prompt: string, systemPrompt?: string): AsyncGenerator<string, void, unknown> {
    if (!this.genAI || !this.apiKey) {
      if (this.fallbackToMock) {
        console.warn("[GeminiProvider] GEMINI_API_KEY is not set. Falling back to Mock streaming.");
        const mock = new MockLLMProvider();
        for await (const chunk of mock.generateStream(prompt, systemPrompt)) {
          yield chunk;
        }
        return;
      }
      throw new Error("Gemini API key is required but not configured.");
    }

    const effectiveSystemInstruction = systemPrompt
      ? `${this.defaultSystemInstruction}\n\n[Task Context]:\n${systemPrompt}`
      : this.defaultSystemInstruction;

    const modelsToTry = this.getCandidateModels();
    let lastError: unknown = null;

    for (const candidateModel of modelsToTry) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: candidateModel,
          systemInstruction: effectiveSystemInstruction,
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 160,
          },
        });

        const responseStream = await model.generateContentStream(prompt);
        let yielded = false;

        for await (const chunk of responseStream.stream) {
          const text = chunk.text();
          if (text) {
            yielded = true;
            yield text;
          }
        }

        if (yielded) {
          return;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[GeminiProvider] Stream model '${candidateModel}' failed (${err?.status || err?.message}). Trying fallback...`);
      }
    }

    if (this.fallbackToMock) {
      console.warn("[GeminiProvider] Streaming API error across all models. Falling back to Mock streaming. Error:", lastError);
      const mock = new MockLLMProvider();
      for await (const chunk of mock.generateStream(prompt, systemPrompt)) {
        yield chunk;
      }
      return;
    }
    throw lastError;
  }


  /**
   * Factory method for low-latency chat interactions (gemini-1.5-flash-latest)
   */
  static forChat(apiKey?: string): GeminiProvider {
    return new GeminiProvider({
      apiKey,
      modelName: "gemini-1.5-flash-latest",
    });
  }

  /**
   * Factory method for heavy analytical tasks like deep ATS Resume auditing (gemini-1.5-pro-latest)
   */
  static forHeavyTasks(apiKey?: string): GeminiProvider {
    return new GeminiProvider({
      apiKey,
      modelName: "gemini-1.5-pro-latest",
    });
  }
}
