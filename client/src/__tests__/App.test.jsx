import { render, screen } from "@testing-library/react";
import App from "../App";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              _id: "1",
              text: "Test journal entry",
              mood: "happy",
            },
          ]),
      })
    )
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("App", () => {
  it("renders journal entries from API", async () => {
    render(<App />);

    const entry = await screen.findByText(/Test journal entry/i);
    expect(entry).toBeInTheDocument();
  });
});