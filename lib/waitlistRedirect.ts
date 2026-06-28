export function continueToWaitlistTelegram(
  url: string | undefined,
  redirect: (url: string) => void
) {
  if (!url) return;
  redirect(url);
}

type BrowserLocation = {
  assign(url: string): void;
};

export function continueToWaitlistTelegramInBrowser(
  url: string | undefined,
  location: BrowserLocation
) {
  continueToWaitlistTelegram(url, (targetUrl) => location.assign(targetUrl));
}
