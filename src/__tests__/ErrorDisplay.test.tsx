import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

const retry = jest.fn();

beforeEach(() => retry.mockClear());

function makeError(message: string, digest?: string) {
  const err = new Error(message) as Error & { digest?: string };
  if (digest) err.digest = digest;
  return err;
}

describe("ErrorDisplay", () => {
  it("renders the error message", () => {
    render(<ErrorDisplay error={makeError("Something went wrong")} retry={retry} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("falls back to generic text when message is empty", () => {
    const err = makeError("");
    render(<ErrorDisplay error={err} retry={retry} />);
    expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
  });

  it("renders the digest when provided", () => {
    render(<ErrorDisplay error={makeError("Oops", "abc123")} retry={retry} />);
    expect(screen.getByText(/abc123/)).toBeInTheDocument();
  });

  it("does not render the digest section when omitted", () => {
    render(<ErrorDisplay error={makeError("Oops")} retry={retry} />);
    expect(screen.queryByText(/digest:/)).not.toBeInTheDocument();
  });

  it("calls retry when the Retry button is clicked", () => {
    render(<ErrorDisplay error={makeError("Oops")} retry={retry} />);
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("renders the Error Detected heading", () => {
    render(<ErrorDisplay error={makeError("Oops")} retry={retry} />);
    expect(screen.getByText("Error Detected")).toBeInTheDocument();
  });
});
