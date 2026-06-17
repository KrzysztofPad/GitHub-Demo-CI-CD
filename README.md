# Browser Auto AI

Browser automation with [Playwright](https://playwright.dev/) — testing web apps, taking screenshots, and recording interactions.

## Setup

Already done, but to reproduce on a fresh machine:

```bash
npm install
npx playwright install   # download the browser binaries
```

## Common tasks

### Run tests

```bash
npm test                 # all browsers (chromium, firefox, webkit)
npm run test:chromium    # chromium only — fastest
npm run test:headed      # watch the browser while tests run
npm run test:ui          # interactive UI mode (time-travel debugging)
npm run report           # open the HTML report from the last run
```

Tests live in [tests/](tests/). Add a new file like `tests/my-feature.spec.ts`.

### Take a screenshot (ad-hoc)

```bash
npm run screenshot -- https://example.com
npm run screenshot -- https://example.com out/page.png --full
```

Or use Playwright's built-in CLI directly:

```bash
npx playwright screenshot https://example.com shot.png
npx playwright pdf https://example.com page.pdf
```

### Record a test by clicking through a site

```bash
npm run codegen -- https://example.com
```

A browser opens; your clicks/typing are turned into Playwright code you can paste
into a test.

## Layout

| Path                   | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| `playwright.config.ts` | Browsers, reporters, trace/screenshot-on-failure |
| `tests/`               | Test specs (`*.spec.ts`)                         |
| `scripts/screenshot.ts`| Standalone screenshot grabber                    |
| `playwright-report/`   | Generated HTML report (gitignored)               |
| `test-results/`        | Traces, videos, failure artifacts (gitignored)   |
