import React from "react";
import { render, screen } from "@testing-library/react";
import { ConfidenceBadge } from "./ConfidenceBadge";

describe("ConfidenceBadge", () => {
  it("renders percentage for high confidence (>=90%)", () => {
    render(<ConfidenceBadge confidence={0.95} />);
    expect(screen.getByText("95%")).toBeInTheDocument();
  });

  it("renders percentage for medium confidence (70-89%)", () => {
    render(<ConfidenceBadge confidence={0.82} />);
    expect(screen.getByText("82%")).toBeInTheDocument();
  });

  it("renders percentage for low confidence (<70%)", () => {
    render(<ConfidenceBadge confidence={0.55} />);
    expect(screen.getByText("55%")).toBeInTheDocument();
  });

  it("renders nothing when confidence is null", () => {
    const { container } = render(<ConfidenceBadge confidence={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when confidence is undefined", () => {
    const { container } = render(<ConfidenceBadge confidence={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it("rounds confidence to nearest integer", () => {
    render(<ConfidenceBadge confidence={0.876} />);
    expect(screen.getByText("88%")).toBeInTheDocument();
  });

  it("renders 100% for perfect confidence", () => {
    render(<ConfidenceBadge confidence={1.0} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("renders 0% for zero confidence", () => {
    render(<ConfidenceBadge confidence={0} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});
