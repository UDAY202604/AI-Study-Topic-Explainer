"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ExplainResponse =
  | { ok: true; explanation: string }
  | { ok: false; error: { message: string; code?: string } };

const EXAMPLE_TOPICS = [
  "Newton’s Laws",
  "Photosynthesis",
  "Binary Search",
  "World War II",
] as const;

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function MessageBubble({ role, content }: { role: ChatMessage["role"]; content: string }) {
  const isUser = role === "user";

  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isUser
            ? "max-w-[92%] rounded-2xl bg-emerald-600 px-4 py-3 text-sm leading-7 text-white shadow-sm sm:max-w-[78%]"
            : "max-w-[92%] rounded-2xl bg-white px-4 py-3 text-sm leading-7 text-slate-900 shadow-sm sm:max-w-[78%]"
        }
      >
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: uid(),
      role: "assistant",
      content: "Hi! Enter a topic and I’ll explain it in simple terms.",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const canSubmit = useMemo(() => {
    const t = topic.trim();
    return t.length > 0 && !isLoading;
  }, [topic, isLoading]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  const submit = useCallback(async () => {
    const t = topic.trim();

    if (!t) {
      setInputError("Please enter a topic to continue.");
      return;
    }

    setIsLoading(true);
    setInputError(null);

    const userMessage: ChatMessage = { id: uid(), role: "user", content: t };
    const assistantMessageId = uid();
    const pendingAssistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "Generating explanation…",
    };

    setMessages((prev) => [...prev, userMessage, pendingAssistantMessage]);
    setTopic("");

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: t }),
      });

      const data = (await res.json()) as ExplainResponse;
      if (!data.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? {
                  ...m,
                  content:
                    data.error.message || "Something went wrong. Please try again.",
                }
              : m,
          ),
        );
        return;
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? { ...m, content: data.explanation }
            : m,
        ),
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? { ...m, content: "Something went wrong. Please try again." }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  return (
    <div className="min-h-dvh bg-slate-950 text-white">
      <div className="mx-auto grid min-h-dvh w-full max-w-6xl grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-white/10 bg-slate-950/60 p-4 lg:block">
          <div className="text-sm font-semibold">AI Study Explainer</div>
          <div className="mt-4 text-xs font-medium uppercase tracking-wide text-white/60">
            Examples
          </div>
          <div className="mt-2 flex flex-col gap-2">
            {EXAMPLE_TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setTopic(t);
                  if (inputError) setInputError(null);
                }}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white/90 transition-colors hover:bg-white/10 disabled:opacity-60"
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
            Tip: Keep topics short (e.g., “Binary Search”) for best results.
          </div>
        </aside>

        <main className="flex min-h-dvh flex-col">
          <header className="border-b border-white/10 bg-slate-950/60 px-4 py-4 backdrop-blur">
            <div className="text-base font-semibold">Study chat</div>
            <div className="text-xs text-white/60">
              Ask a topic and get a simplified explanation.
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
              {messages.map((m) => (
                <MessageBubble key={m.id} role={m.role} content={m.content} />
              ))}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="border-t border-white/10 bg-slate-950/60 px-4 py-4 backdrop-blur">
            <div className="mx-auto w-full max-w-3xl">
              {inputError ? (
                <div className="mb-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {inputError}
                </div>
              ) : null}

              <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <textarea
                  value={topic}
                  disabled={isLoading}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  rows={1}
                  placeholder="Type a topic… (press Enter to send)"
                  className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent text-sm leading-7 text-white outline-none placeholder:text-white/40 disabled:opacity-60"
                />
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={submit}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Send
                </button>
              </div>

              <div className="mt-2 text-xs text-white/50">
                Enter = send · Shift+Enter = new line
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
