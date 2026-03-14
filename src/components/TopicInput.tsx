type Props = {
  topic: string;
  disabled: boolean;
  error: string | null;
  onTopicChange: (value: string) => void;
  onSubmit: () => void;
};

export default function TopicInput({
  topic,
  disabled,
  error,
  onTopicChange,
  onSubmit,
}: Props) {
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor="topic"
          className="text-xs font-bold uppercase tracking-wide text-black/70"
        >
          Topic
        </label>
        <input
          id="topic"
          name="topic"
          value={topic}
          disabled={disabled}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="e.g., Photosynthesis, Binary Search"
          autoComplete="off"
          className="h-11 w-full border-2 border-black bg-white px-3 text-sm font-medium text-black outline-none placeholder:text-black/40 focus:ring-4 focus:ring-[#B6F7D4] disabled:cursor-not-allowed disabled:opacity-60"
        />
        {error ? (
          <div className="border-2 border-black bg-[#FFD6DA] px-3 py-2 text-sm font-semibold text-black">
            {error}
          </div>
        ) : (
          <div className="text-sm font-medium text-black/70">Enter a topic or question.</div>
        )}
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex h-11 w-full items-center justify-center gap-2 border-2 border-black bg-[#FF4D6D] px-4 text-sm font-black text-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {disabled ? "Generating…" : "Explain Topic"}
      </button>
    </form>
  );
}
