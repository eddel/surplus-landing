import { describe, expect, it, vi } from "vitest";
import {
  WAITLIST_TELEGRAM_REDIRECT_DELAY_MS,
  scheduleWaitlistRedirect
} from "./waitlistRedirect";

describe("scheduleWaitlistRedirect", () => {
  it("redirects after the configured waitlist delay", () => {
    vi.useFakeTimers();
    const redirect = vi.fn();

    scheduleWaitlistRedirect("https://t.me/surplus", redirect);

    vi.advanceTimersByTime(WAITLIST_TELEGRAM_REDIRECT_DELAY_MS - 1);
    expect(redirect).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(redirect).toHaveBeenCalledWith("https://t.me/surplus");

    vi.useRealTimers();
  });

  it("uses a 15 second default delay", () => {
    expect(WAITLIST_TELEGRAM_REDIRECT_DELAY_MS).toBe(15000);
  });
});
