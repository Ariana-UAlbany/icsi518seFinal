import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";

// Mock fetch using Vitest + browser-compatible global
vi.stubGlobal("fetch", vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: "Backend is working!" }),
  })
));

describe("App", () => {
  it("renders backend message", async () => {
    render(<App />);
    const message = await screen.findByText(/Backend is working!/i);
    expect(message).toBeInTheDocument();
  });
});