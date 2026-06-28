import { describe, expect, it, vi } from "vitest";
import {
  continueToWaitlistTelegram,
  continueToWaitlistTelegramInBrowser
} from "./waitlistRedirect";

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

  it("preserves the browser location receiver when redirecting", () => {
    const location = {
      redirectedTo: undefined as string | undefined,
      assign(this: { redirectedTo?: string }, url: string) {
        if (this !== location) {
          throw new TypeError("Location.assign called with an invalid receiver");
        }
        this.redirectedTo = url;
      }
    };

    continueToWaitlistTelegramInBrowser(
      "https://t.me/surplusvendors",
      location
    );

    expect(location.redirectedTo).toBe("https://t.me/surplusvendors");
  });
});
