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
   * Resolves the model name to ensure compatibility with Google Generative AI v1beta endpoints.
   */
  private getResolvedModelName(): string {
    if (
      this.modelName === "gemini-1.5-flash" ||
      this.modelName === "gemini-1.5-flash-latest" ||
      this.modelName === "gemini-1.5-flash-001" ||
      this.modelName === "gemini-flash-latest" ||
      this.modelName === "gemini-flash-lite-latest"
    ) {
      return "gemini-flash-lite-latest";
    }
    if (
      this.modelName === "gemini-1.5-pro" ||
      this.modelName === "gemini-1.5-pro-latest"
    ) {
      return "gemini-pro-latest";
    }
    return this.modelName;
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

    try {
      // Compose system instruction: combine core persona with any custom task-specific instruction
      const effectiveSystemInstruction = systemPrompt
        ? `${this.defaultSystemInstruction}\n\n[Task Context]:\n${systemPrompt}`
        : this.defaultSystemInstruction;

      const resolvedModel = this.getResolvedModelName();
      const model = this.genAI.getGenerativeModel({
        model: resolvedModel,
        systemInstruction: effectiveSystemInstruction,
        generationConfig: {
          temperature: this.temperature,
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text()?.trim() || "";

      const promptTokens = response.usageMetadata?.promptTokenCount ?? 0;
      const completionTokens = response.usageMetadata?.candidatesTokenCount ?? 0;

      // Approximate cost calculation (flash vs pro)
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
    } catch (err: unknown) {
      if (this.fallbackToMock) {
        console.warn("[GeminiProvider] Google Gen AI API call failed. Falling back to MockLLMProvider. Error:", err);
        return new MockLLMProvider().generateText(prompt, systemPrompt);
      }
      throw err;
    }
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

    try {
      const effectiveSystemInstruction = systemPrompt
        ? `${this.defaultSystemInstruction}\n\n[Task Context]:\n${systemPrompt}`
        : this.defaultSystemInstruction;

      const resolvedModel = this.getResolvedModelName();
      const model = this.genAI.getGenerativeModel({
        model: resolvedModel,
        systemInstruction: effectiveSystemInstruction,
        generationConfig: {
          temperature: this.temperature,
        },
      });

      const responseStream = await model.generateContentStream(prompt);
      for await (const chunk of responseStream.stream) {
        const text = chunk.text();
        if (text) {
          yield text;
        }
      }
    } catch (err: unknown) {
      if (this.fallbackToMock) {
        console.warn("[GeminiProvider] Streaming API error. Falling back to Mock streaming. Error:", err);
        const mock = new MockLLMProvider();
        for await (const chunk of mock.generateStream(prompt, systemPrompt)) {
          yield chunk;
        }
        return;
      }
      throw err;
    }
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
