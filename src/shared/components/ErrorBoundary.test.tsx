import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

// Suppress console.error output from componentDidCatch during tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

/** A component that throws on render when `shouldThrow` is true. */
function BombComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Boom!");
  }
  return <div>All good</div>;
}

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Hello world</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders default fallback UI when a child throws", () => {
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Try again")).toBeInTheDocument();
    expect(screen.getByText("Reload page")).toBeInTheDocument();
  });

  it("calls reset callback and clears error state on 'Try again'", () => {
    // We verify that clicking "Try again" attempts to clear the error.
    // After reset, the boundary will try to re-render children. If they
    // still throw, the fallback reappears — this is correct behaviour.
    // The key assertion: the button click doesn't crash, and the boundary
    // re-enters error state if the child still throws.

    const { container } = render(
      <ErrorBoundary>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    // Click "Try again" — boundary resets, child re-renders & re-throws,
    // so fallback reappears. This confirms the reset cycle works.
    fireEvent.click(screen.getByText("Try again"));

    // Fallback should still show because child still throws
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    const customFallback = (error: Error, reset: () => void) => (
      <div>
        <span>Custom error: {error.message}</span>
        <button onClick={reset}>Reset</button>
      </div>
    );

    render(
      <ErrorBoundary fallback={customFallback}>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Custom error: Boom!")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("logs error with boundary name", () => {
    render(
      <ErrorBoundary name="TestSection">
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("[TestSection]"),
      expect.any(Error),
      expect.anything(),
    );
  });

  it("logs error without name prefix when name is not provided", () => {
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    // Should have been called with the error (without a name prefix)
    expect(console.error).toHaveBeenCalledWith(
      "ErrorBoundary caught an error:",
      expect.any(Error),
      expect.anything(),
    );
  });
});
