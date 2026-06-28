# Waitlist Telegram Redirect Fix

## Problem

The vendor and buyer success screens receive the correct Telegram URL from the waitlist API, but clicking Continue does not navigate. `window.location.assign` is passed as a bare callback and invoked without its required `window.location` receiver.

## Design

Keep the existing data flow: the API selects the vendor or buyer Telegram URL from environment configuration and returns it after a successful waitlist submission. At the modal boundary, pass a wrapper callback to `continueToWaitlistTelegram` so `window.location.assign` is called as a method of `window.location`.

No automatic redirect, environment-variable rename, or unrelated form behavior will change.

## Testing

Add a regression test that uses a receiver-sensitive redirect method. The test must fail when the method is passed unbound and pass when the production callback preserves its receiver. Then run the full test suite and production build.
