# Waitlist Telegram Redirect Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the vendor and buyer success-screen Continue buttons navigate to the Telegram URL returned by the waitlist API.

**Architecture:** Keep URL selection in the API and the existing pure redirect helper. Add a browser adapter that invokes `location.assign` through its owning location object, then wire the modal to that adapter.

**Tech Stack:** Next.js 14, React 18, TypeScript, Vitest

---

### Task 1: Preserve the browser location receiver

**Files:**
- Modify: `lib/waitlistRedirect.test.ts`
- Modify: `lib/waitlistRedirect.ts`
- Modify: `components/WaitlistModal.tsx`

- [x] **Step 1: Write the failing regression test**

Import `continueToWaitlistTelegramInBrowser` and test it with a fake location whose `assign` method throws unless called with the fake location as `this`. Assert that the configured URL is recorded.

- [x] **Step 2: Verify the regression test fails**

Run: `npm test -- lib/waitlistRedirect.test.ts`

Expected: FAIL because `continueToWaitlistTelegramInBrowser` is not exported.

- [x] **Step 3: Implement the browser adapter and wire the modal**

Add `continueToWaitlistTelegramInBrowser(url, location)` to `lib/waitlistRedirect.ts`. It delegates to the existing helper with `(targetUrl) => location.assign(targetUrl)`. Update `WaitlistModal` to pass `window.location` to this adapter.

- [x] **Step 4: Verify the focused and complete test suites**

Run: `npm test -- lib/waitlistRedirect.test.ts`

Expected: PASS.

Run: `npm test`

Expected: all tests PASS.

- [x] **Step 5: Verify the production build**

Run: `npm run build`

Expected: exit code 0.
