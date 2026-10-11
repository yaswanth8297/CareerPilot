import { NextRequest } from "next/server";
import { generateChatBotLLMStream } from "@/lib/ai/chatBotEngine";
import { GeminiProvider } from "@/lib/ai/providers/geminiProvider";
import { MockLLMProvider } from "@/lib/ai/provider";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, profile } = body;

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let streamGenerator: AsyncGenerator<string, void, unknown>;

    if (apiKey && apiKey.trim().length > 0) {
      console.log("🤖 Routing message to Gemini LLM (Streaming)...");
      const geminiProvider = new GeminiProvider({
        apiKey,
        modelName: "gemini-1.5-flash-latest",
        fallbackToMock: true,
      });
      streamGenerator = generateChatBotLLMStream(message, profile, geminiProvider);
    } else {
      console.log("⚠️ Using Mock Provider (Streaming)...");
      const mockProvider = new MockLLMProvider();
      streamGenerator = generateChatBotLLMStream(message, profile, mockProvider);
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamGenerator) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (streamError) {
          console.error("Stream controller error:", streamError);
          controller.error(streamError);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    console.error("Unhandled error in /api/chat:", err);
    console.log("⚠️ Using Mock Provider (Streaming)...");
    const fallbackMock = new MockLLMProvider();
    const stream = fallbackMock.generateStream("Hello");
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    });
    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  }
}
