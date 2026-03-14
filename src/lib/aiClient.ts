import "server-only";

import {
  GoogleGenerativeAI,
  GoogleGenerativeAIAbortError,
  GoogleGenerativeAIFetchError,
  GoogleGenerativeAIRequestInputError,
  GoogleGenerativeAIResponseError,
} from "@google/generative-ai";

export class AiClientError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

function getModelName() {
  const raw = process.env.GEMINI_MODEL || "gemini-flash-latest";
  return raw.startsWith("models/") ? raw.slice("models/".length) : raw;
}

export async function generateExplanation(topic: string) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new AiClientError(
      "CONFIG_MISSING",
      "Gemini is not configured. Set GOOGLE_API_KEY in .env.local and restart the dev server.",
      503,
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: getModelName() });

    const prompt = [
      `Explain the topic "${topic}" in simple terms for a student.`,
      "Constraints:",
      "- Keep it under 150 words",
      "- Use short paragraphs",
      "- Avoid jargon; if you must use a technical word, define it quickly",
      "- Prefer a friendly tone",
      "- If helpful, include one small real-world example",
    ].join("\n");

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const trimmed = text.trim();

    if (!trimmed) {
      throw new AiClientError(
        "EMPTY_RESPONSE",
        "Gemini returned an empty response. Please try again.",
        502,
      );
    }

    return trimmed;
  } catch (err) {
    if (err instanceof AiClientError) throw err;

    if (err instanceof GoogleGenerativeAIAbortError) {
      throw new AiClientError(
        "UPSTREAM_TIMEOUT",
        "Gemini timed out generating a response. Please try again.",
        504,
      );
    }

    if (err instanceof GoogleGenerativeAIRequestInputError) {
      throw new AiClientError(
        "UPSTREAM_BAD_REQUEST",
        "Gemini rejected the request. Try a shorter or simpler topic.",
        400,
      );
    }

    if (err instanceof GoogleGenerativeAIResponseError) {
      throw new AiClientError(
        "UPSTREAM_RESPONSE_ERROR",
        "Gemini returned an unusable response. Please try again.",
        502,
      );
    }

    if (err instanceof GoogleGenerativeAIFetchError) {
      const status = err.status;

      if (status === 400) {
        throw new AiClientError(
          "UPSTREAM_BAD_REQUEST",
          "Gemini rejected the request. Check your model name and try a simpler topic.",
          400,
        );
      }

      if (status === 401 || status === 403) {
        throw new AiClientError(
          "INVALID_API_KEY",
          "Gemini API key was rejected. Recreate the key and update GOOGLE_API_KEY.",
          401,
        );
      }

      if (status === 404) {
        throw new AiClientError(
          "MODEL_NOT_FOUND",
          "Gemini model was not found. Set GEMINI_MODEL (e.g., gemini-1.5-flash) and restart.",
          503,
        );
      }

      if (status === 429) {
        throw new AiClientError(
          "QUOTA_EXCEEDED",
          "Gemini rate limit or quota exceeded. Wait a bit and try again.",
          429,
        );
      }

      if (typeof status === "number" && status >= 500) {
        throw new AiClientError(
          "UPSTREAM_UNAVAILABLE",
          "Gemini service is having trouble right now. Please try again soon.",
          503,
        );
      }

      throw new AiClientError(
        "UPSTREAM_ERROR",
        "Gemini request failed. Please try again in a moment.",
        502,
      );
    }

    throw new AiClientError(
      "UPSTREAM_ERROR",
      "Gemini request failed. Please try again in a moment.",
      502,
    );
  }
}
