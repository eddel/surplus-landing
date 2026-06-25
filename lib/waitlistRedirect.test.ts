import { describe, expect, it, vi } from "vitest";
import { continueToWaitlistTelegram } from "./waitlistRedirect";

describe("continueToWaitlistTelegram", () => {
  it("redirects only when a Telegram URL is available", () => {
    const redirect = vi.fn();

    continueToWaitlistTelegram("https://t.me/surplus", redirect);

    expect(redirect).toHaveBeenCalledWith("https://t.me/surplus");
  });

  it("does not redirect when no Telegram URL is available", () => {
    const redirect = vi.fn();

    continueToWaitlistTelegram(undefined, redirect);

    expect(redirect).not.toHaveBeenCalled();
  });
});
