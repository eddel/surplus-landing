export function continueToWaitlistTelegram(
  url: string | undefined,
  redirect: (url: string) => void
) {
  if (!url) return;
  redirect(url);
}
