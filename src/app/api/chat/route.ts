import { NextRequest } from "next/server";
import { generateChatBotLLMStream } from "@/lib/ai/chatBotEngine";
import { GeminiProvider } from "@/lib/ai/providers/geminiProvider";
import { MockLLMProvider } from "@/lib/ai/provider";

// High-speed in-memory LRU cache for frequent and identical student queries
interface CacheRecord {
  text: string;
  timestamp: number;
}
const chatResponseCache = new Map<string, CacheRecord>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

// Fast deterministic responses for instant conversational greetings
const FAST_GREETINGS: Record<string, string> = {
  hi: "Hey there! I'm CareerPilot 👋 What college branch and year are you in, and what career goals are you targeting?",
  hello: "Hello! Welcome to CareerPilot 👋 Tell me your college branch and target role, and let's build your path together!",
  hey: "Hey! Great to connect. Are you targeting software roles, data analytics, or core engineering?",
  "good morning": "Good morning! ☀️ Ready to take your career prep to the next level? Tell me what branch and year you're in!",
  "good evening": "Good evening! 🌙 Let's accelerate your placement prep. What roles or skills are you focusing on?"
};

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

    const trimmed = message.trim();
    const lower = trimmed.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();

    // 1. Instant Fast Greeting Check (< 5ms response time)
    if (FAST_GREETINGS[lower]) {
      const fastReply = FAST_GREETINGS[lower];
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          // Stream in small words with micro-delay for smooth natural feel
          const words = fastReply.split(" ");
          for (let i = 0; i < words.length; i++) {
            controller.enqueue(encoder.encode((i === 0 ? "" : " ") + words[i]));
            await new Promise((r) => setTimeout(r, 16));
          }
          controller.close();
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    // 2. In-Memory Response Cache Check (< 10ms response time)
    const cacheKey = `${lower}__${profile?.branch || ""}__${profile?.year || ""}`;
    const cached = chatResponseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          const words = cached.text.split(" ");
          for (let i = 0; i < words.length; i++) {
            controller.enqueue(encoder.encode((i === 0 ? "" : " ") + words[i]));
            await new Promise((r) => setTimeout(r, 12));
          }
          controller.close();
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    // 3. Live Optimized Multi-Model Gemini Stream
    const apiKey = process.env.GEMINI_API_KEY;
    let streamGenerator: AsyncGenerator<string, void, unknown>;

    if (apiKey && apiKey.trim().length > 0) {
      const geminiProvider = new GeminiProvider({
        apiKey,
        modelName: "gemini-1.5-flash-latest",
        fallbackToMock: true,
      });
      streamGenerator = generateChatBotLLMStream(message, profile, geminiProvider);
    } else {
      const mockProvider = new MockLLMProvider();
      streamGenerator = generateChatBotLLMStream(message, profile, mockProvider);
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let fullAccumulated = "";
        try {
          for await (const chunk of streamGenerator) {
            fullAccumulated += chunk;
            controller.enqueue(encoder.encode(chunk));
          }
          // Cache successful answer
          if (fullAccumulated.trim().length > 0) {
            chatResponseCache.set(cacheKey, {
              text: fullAccumulated,
              timestamp: Date.now(),
            });
            // Evict old cache entries if too large
            if (chatResponseCache.size > 150) {
              const firstKey = chatResponseCache.keys().next().value;
              if (firstKey) chatResponseCache.delete(firstKey);
            }
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

