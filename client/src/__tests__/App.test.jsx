import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "../App";

/* -----------------------------
   MOCK Google OAuth
------------------------------ */
vi.mock("@react-oauth/google", () => ({
  GoogleLogin: () => <div>Mock Google Login</div>,
}));

describe("App", () => {
  it("renders Google login when user is not authenticated", () => {
    render(<App />);

    expect(
      screen.getByText("Mock Google Login")
    ).toBeInTheDocument();
  });
});