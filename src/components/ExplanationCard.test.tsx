import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ExplanationCard from "@/components/ExplanationCard";

describe("ExplanationCard", () => {
  it("shows loading state", () => {
    render(
      <ExplanationCard
        topic="Photosynthesis"
        explanation={null}
        isLoading={true}
        error={null}
      />
    );

    expect(
      screen.getByText(/generating explanation/i)
    ).toBeInTheDocument();
  });

  it("renders explanation text", () => {
    render(
      <ExplanationCard
        topic="Photosynthesis"
        explanation="Plants use sunlight to make food."
        isLoading={false}
        error={null}
      />
    );

    expect(screen.getByText(/topic:/i)).toBeInTheDocument();
    expect(screen.getByText(/plants use sunlight/i)).toBeInTheDocument();
  });
});

