import { RefreshCw } from "lucide-react";

type Props = {
  topic: string;
  explanation: string | null;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
};

export default function ExplanationCard({
  topic,
  explanation,
  isLoading,
  error,
  onRetry,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex h-full min-h-[240px] flex-col gap-4">
        <div className="text-xs font-bold uppercase tracking-wide text-black/70">
          Explanation
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-black/70">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
          Generating explanation…
        </div>
        <div className="space-y-3">
          <div className="h-4 w-11/12 animate-pulse bg-black/10" />
          <div className="h-4 w-10/12 animate-pulse bg-black/10" />
          <div className="h-4 w-9/12 animate-pulse bg-black/10" />
          <div className="h-4 w-8/12 animate-pulse bg-black/10" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-[240px] flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="text-xs font-bold uppercase tracking-wide text-black/70">
            Explanation
          </div>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 border-2 border-black bg-[#B6F7D4] px-3 py-2 text-xs font-bold text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          ) : null}
        </div>
        <div className="border-2 border-black bg-[#FFD6DA] p-4 text-sm font-semibold text-black">
          {error}
        </div>
        <div className="text-sm font-medium text-black/70">
          Tip: keep your topic short and specific.
        </div>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="flex h-full min-h-[240px] flex-col gap-3">
        <div className="text-xs font-bold uppercase tracking-wide text-black/70">
          Explanation
        </div>
        <div className="text-sm font-medium text-black/70">
          Your explanation will appear here.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[240px] flex-col gap-4">
      <div className="text-xs font-bold uppercase tracking-wide text-black/70">
        Explanation
      </div>

      {topic ? (
        <div className="border-2 border-black bg-[#FFF4C7] px-3 py-2 text-sm font-semibold text-black">
          <span className="text-black/70">Topic:</span> {topic}
        </div>
      ) : null}

      <div className="whitespace-pre-wrap text-sm leading-7 text-black">
        {explanation}
      </div>
    </div>
  );
}
