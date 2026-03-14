import { NextRequest, NextResponse } from "next/server";
import { AiClientError, generateExplanation } from "@/lib/aiClient";

type ExplainResponse =
  | { ok: true; explanation: string }
  | { ok: false; error: { message: string; code?: string } };

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    const payload: ExplainResponse = {
      ok: false,
      error: { message: "Invalid JSON body.", code: "INVALID_JSON" },
    };
    return NextResponse.json(payload, { status: 400 });
  }

  const topic =
    typeof (body as { topic?: unknown })?.topic === "string"
      ? (body as { topic: string }).topic.trim()
      : "";

  if (!topic) {
    const payload: ExplainResponse = {
      ok: false,
      error: { message: "Please enter a topic to continue.", code: "EMPTY_TOPIC" },
    };
    return NextResponse.json(payload, { status: 400 });
  }

  if (topic.length > 160) {
    const payload: ExplainResponse = {
      ok: false,
      error: {
        message: "Please keep the topic under 160 characters.",
        code: "TOPIC_TOO_LONG",
      },
    };
    return NextResponse.json(payload, { status: 400 });
  }

  try {
    const explanation = await generateExplanation(topic);
    const payload: ExplainResponse = { ok: true, explanation };
    return NextResponse.json(payload);
  } catch (err) {
    if (err instanceof AiClientError) {
      const payload: ExplainResponse = {
        ok: false,
        error: { message: err.message, code: err.code },
      };
      return NextResponse.json(payload, { status: err.status });
    }

    const payload: ExplainResponse = {
      ok: false,
      error: { message: "Failed to generate explanation.", code: "GENERATION_FAILED" },
    };
    return NextResponse.json(payload, { status: 500 });
  }
}
