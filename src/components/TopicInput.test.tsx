import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TopicInput from "@/components/TopicInput";

describe("TopicInput", () => {
  it("submits when clicking the button", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <TopicInput
        topic="Photosynthesis"
        disabled={false}
        error={null}
        onTopicChange={() => undefined}
        onSubmit={onSubmit}
      />
    );

    await user.click(screen.getByRole("button", { name: /explain topic/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders error message when provided", () => {
    render(
      <TopicInput
        topic=""
        disabled={false}
        error="Please enter a topic to continue."
        onTopicChange={() => undefined}
        onSubmit={() => undefined}
      />
    );

    expect(
      screen.getByText("Please enter a topic to continue.")
    ).toBeInTheDocument();
  });
});

