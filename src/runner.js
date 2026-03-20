const fs = require('fs');
const BrowserManager = require('./engine/browser-manager');
const HumanSimulator = require('./engine/human-simulator');
const PlaybackValidator = require('./engine/playback-validator');
const reporter = require('./utils/reporter');
const logger = require('./utils/logger');

async function runBatch(inputJsonPath) {
  const inputData = JSON.parse(fs.readFileSync(inputJsonPath, 'utf8'));
  const { batchId, tests, config } = inputData;
  
  logger.info(`Starting batch ${batchId} with ${tests.length} tests.`);

  for (const test of tests) {
    const browserManager = new BrowserManager();
    let page;
    
    try {
      page = await browserManager.init();
      const simulator = new HumanSimulator(page);
      const validator = new PlaybackValidator(page);

      logger.info(`Navigating to ${test.url}`);
      await page.goto(test.url, { waitUntil: 'domcontentloaded' });

      await simulator.interactWithPlayer();
      
      const validationResult = await validator.validate(config.validationDuration);

      if (validationResult.success) {
        await reporter.saveResult({
          contentId: test.contentId,
          status: 'SUCCESS',
          metrics: validationResult.metrics
        });
      } else {
        const screenshotPath = await reporter.captureScreenshot(page, test.contentId);
        await reporter.saveResult({
          contentId: test.contentId,
          status: 'FAIL',
          error: {
            ...validationResult.error,
            screenshotPath
          }
        });
      }

    } catch (error) {
      logger.error(`Test failed for ${test.contentId}: ${error.message}`);
      let screenshotPath = null;
      if (page) {
        screenshotPath = await reporter.captureScreenshot(page, test.contentId);
      }
      await reporter.saveResult({
        contentId: test.contentId,
        status: 'FAIL',
        error: {
          code: 'SYSTEM_ERROR',
          message: error.message,
          screenshotPath
        }
      });
    } finally {
      await browserManager.close();
    }
  }
}

// Example usage if run directly
if (require.main === module) {
  const sampleInput = {
    batchId: "batch-001",
    tests: [
      { url: "https://test-videos.co.uk/vjs/mp4", contentId: "test-vid-1" }
    ],
    config: {
      timeout: 30000,
      validationDuration: 10000
    }
  };
  
  fs.writeFileSync('sample-input.json', JSON.stringify(sampleInput));
  runBatch('sample-input.json').then(() => console.log('Done.'));
}

module.exports = { runBatch };