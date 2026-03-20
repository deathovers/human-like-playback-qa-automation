# User Guide: Human-like Playback QA Automation

This guide provides instructions on how to use the Playback QA Automation tool to verify video streams.

## Getting Started

### 1. Environment Setup
Ensure you are running in an environment that supports a headed browser. 
- **Local:** Works out of the box on Windows, macOS, and Linux (with Desktop).
- **CI/CD:** Use a virtual framebuffer like `xvfb` if running on a headless Linux server.

### 2. Preparing Your Test Batch
Create a JSON file (e.g., `my_tests.json`) containing the URLs you wish to test. Refer to the [API Documentation](API.md) for the exact format.

## Running the Test

Execute the following command in your terminal:

```bash
node src/index.js --input=my_tests.json
```

The browser will open automatically. **Do not close the browser window manually**, as this will cause the test to fail.

## How the Validation Works

1. **Navigation:** The tool navigates to the URL and waits for the network to become idle.
2. **Human Interaction:** It waits for a random period (1-3 seconds) and scrolls the player into view.
3. **Playback Start:** It looks for the `HTMLVideoElement`. If autoplay is blocked, it will attempt to click the player container.
4. **Verification:** Once the video starts, the tool checks every 2 seconds to ensure `currentTime` is increasing and the video is not paused.
5. **Completion:** After 10 seconds of successful playback, the test passes.

## Troubleshooting

### Common Error Codes
- `PLAYER_ERROR`: The video element reported an internal error (often DRM or source issues). Check the console logs.
- `TIMEOUT`: The video did not start playing within the configured timeout (default 30s).
- `ELEMENT_NOT_FOUND`: The tool could not find a `<video>` tag on the page.

### DRM Issues
If you see "Protected Content" errors, ensure the environment supports Widevine DRM. Headed Chrome usually supports this, but some Linux environments may require additional libraries.

### Autoplay Blocks
The tool is designed to attempt a manual click if autoplay fails. If the video still doesn't play, ensure the "Play" button is not obscured by an overlay.
