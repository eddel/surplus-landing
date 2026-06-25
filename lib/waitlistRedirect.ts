export const WAITLIST_TELEGRAM_REDIRECT_DELAY_MS = 15000;

export function scheduleWaitlistRedirect(
  url: string,
  redirect: (url: string) => void,
  delayMs = WAITLIST_TELEGRAM_REDIRECT_DELAY_MS
) {
  return window.setTimeout(() => redirect(url), delayMs);
}
