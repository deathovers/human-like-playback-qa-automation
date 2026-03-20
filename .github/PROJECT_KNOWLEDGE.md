# Project Knowledge Base: Human-like Playback QA Automation

## 1. Executive Summary
An automated QA system mimicking human behavior to validate video playback on OTT web platforms. Uses a headed Chrome environment with randomized interactions to bypass bot detection and ensure realistic testing.

## 2. Architecture & Components
The system is a modular Node.js application:
- **Runner (`src/runner.js`):** Orchestrator that processes the input JSON batch and kicks off the process.
- **BrowserManager (`src/engine/browser-manager.js`):** Singleton handling Playwright setup, ensuring a fresh, headed Chrome instance using `playwright-extra` with stealth plugins.
- **HumanSimulator (`src/engine/human-simulator.js`):** Implements human-like interactions. Uses 1-3s random delays, `element.scrollIntoViewIfNeeded()`, and randomized click durations.
- **PlaybackValidator (`src/engine/playback-validator.js`):** Monitors `HTMLVideoElement` state. Validates `readyState >= 2`, ensures `currentTime > 0` within 5s, and verifies continuous playback for 10 seconds.
- **Reporter (`src/engine/reporter.js`):** Generates JSON output and captures screenshots on failure using Winston for structured logging.

## 3. Technical Requirements
- **Browser Mode:** `headless: false` (Headed Chromium).
- **Viewport:** Randomized (e.g., 1920x1080, 1440x900).
- **User Agent:** Standard Chrome user agent string.
- **Wait Strategy:** `page.waitForLoadState('networkidle')` + random delay (1000ms-3000ms).

## 4. Data Schemas
### Input Schema (JSON)
```json
{
  "batchId": "string",
  "tests": [ { "url": "string", "contentId": "string" } ],
  "config": { "timeout": 30000, "validationDuration": 10000 }
}
```

### Output Schema (JSON)
```json
{
  "contentId": "string",
  "status": "SUCCESS | FAIL",
  "metrics": {
    "startTime": "ISO8601 Timestamp",
    "timeToFirstFrameMs": 2400,
    "playbackDurationSec": 10.2
  },
  "error": {
    "code": "PLAYER_ERROR | TIMEOUT | ELEMENT_NOT_FOUND",
    "message": "string",
    "screenshotPath": "string"
  }
}
```

## 5. Edge Cases & Error Handling
- **DRM Popups:** Detect system-level DRM errors (e.g., Widevine) in console logs.
- **Auto-play Block:** Attempt manual click on player container if auto-play is blocked.
- **Network Throttling:** Distinguish between stalling and failure.
