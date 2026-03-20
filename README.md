# Human-like Playback QA Automation (Web)

## Overview
The **Human-like Playback QA Automation** is a high-fidelity testing suite designed to validate video playback on OTT (Over-The-Top) web platforms. Unlike traditional headless automation, this system operates in a **headed browser environment** and employs randomized interaction patterns to mimic real human behavior, effectively bypassing basic bot detection and ensuring the most realistic testing scenario possible.

## Key Features
- **Headed Execution:** Runs in a visible Chrome instance to replicate actual user experience.
- **Human-like Interaction:** Implements randomized delays (1s–3s), smooth scrolling, and variable click durations.
- **Robust Playback Validation:** Monitors `HTMLVideoElement` state to ensure `currentTime` advances for a minimum of 10 seconds.
- **Automated Evidence Capture:** Automatically captures screenshots and console logs upon failure.
- **Structured Reporting:** Outputs detailed JSON reports including performance metrics like Time to First Frame (TTFF).

## System Requirements
- **Node.js:** v20 or higher.
- **Browser:** Chromium (installed via Playwright).
- **OS:** Local workstation (Windows/macOS/Linux) or CI/CD with GPU/Display support (e.g., GitHub Actions with `xvfb`).

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd human-like-playback-qa
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright Browsers:**
   ```bash
   npx playwright install chromium
   ```

## Usage

### Running Tests
The system is designed to process batch requests via a JSON interface.

```bash
node src/index.js --input=batch_request.json
```

### Configuration
Configuration can be adjusted within the input JSON or via environment variables for the logger (`LOG_LEVEL`).

## Architecture
- **Browser Manager:** Configures the Chromium instance with randomized viewports and human-like user agents.
- **Interaction Engine:** Handles navigation, scrolling, and clicking with non-deterministic delays.
- **Validation Engine:** Periodically samples the video element state to verify playback continuity.
- **Reporting Module:** Uses `winston` for structured logging and generates the final JSON output.

## License
Proprietary - Internal Use Only.
