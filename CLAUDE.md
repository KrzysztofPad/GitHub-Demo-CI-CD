# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A Playwright project for browser automation: end-to-end testing of web apps, ad-hoc screenshots/PDFs, and recording interactions via codegen. ESM project (`"type": "module"`), TypeScript run directly — Node 25 strips types natively, so there is **no build step**.

## Commands

```bash
npm test                              # run all specs across chromium, firefox, webkit
npm run test:chromium                 # chromium only (fastest for iterating)
npm run test:headed                   # run with a visible browser
npm run test:ui                       # interactive UI / time-travel debugger
npm run report                        # open HTML report from the last run
npm run codegen -- <url>              # click through a site, get generated test code
npm run screenshot -- <url> [out.png] [--full]   # ad-hoc screenshot

# Run a single test file / by title / a single project:
npx playwright test tests/example.spec.ts
npx playwright test -g "has title"
npx playwright test tests/example.spec.ts --project=chromium
```

After bumping `@playwright/test`, browser binaries must match the new version — run `npx playwright install` or tests fail with an "Executable doesn't exist" error pointing at a build number mismatch.

## Architecture

- **[playwright.config.ts](playwright.config.ts)** — single source of truth. Defines the three browser `projects` (chromium/firefox/webkit), the HTML reporter, and the failure-artifact policy: `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`. `retries`/`workers` switch on the `CI` env var.
- **[tests/](tests/)** — specs (`*.spec.ts`) using the `@playwright/test` runner. Each test gets an isolated `page` fixture.
- **[scripts/screenshot.ts](scripts/screenshot.ts)** — standalone automation that runs *outside* the test runner via plain `node`, importing the browser API directly from `@playwright/test`. This is the pattern to follow for one-off automation that isn't a test.

Two distinct entry points to keep separate: the **test runner** (`playwright test`, fixtures, config-driven) versus **standalone scripts** (`node scripts/*.ts`, manual `browser.launch()`/`close()`).

Generated output (`playwright-report/`, `test-results/`, `out/`) is gitignored.
