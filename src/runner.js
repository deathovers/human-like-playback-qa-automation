const BrowserManager = require('./engine/browser-manager');
const HumanSimulator = require('./engine/human-simulator');
const PlaybackValidator = require('./engine/playback-validator');
const Reporter = require('./utils/reporter');
const logger = require('./utils/logger');
const config = require('./config/env');

class Runner {
  constructor() {
    this.browserManager = new BrowserManager();
    this.reporter = new Reporter();
  }

  async runBatch(batchPayload) {
    logger.info(`Starting batch: ${batchPayload.batchId}`);
    const results = [];

    for (const test of batchPayload.tests) {
      const result = await this.runTest(test, batchPayload.config);
      results.push(result);
    }

    return {
      batchId: batchPayload.batchId,
      results
    };
  }

  async runTest(test, customConfig = {}) {
    logger.info(`Running test for contentId: ${test.contentId}, URL: ${test.url}`);
    let page;
    const startTime = new Date().toISOString();
    
    try {
      page = await this.browserManager.init();
      const simulator = new HumanSimulator(page);
      const validator = new PlaybackValidator(page);

      await page.goto(test.url, { waitUntil: 'domcontentloaded' });
      
      await simulator.interactWithPlayButton();
      
      const duration = customConfig.validationDuration || config.validationDuration;
      const metrics = await validator.validate(duration);

      const fullMetrics = {
        startTime,
        ...metrics
      };

      const report = await this.reporter.generateReport(test.contentId, 'SUCCESS', fullMetrics, null);
      await this.browserManager.close();
      return report;

    } catch (error) {
      logger.error(`Test failed for ${test.contentId}: ${error.message}`);
      const report = await this.reporter.generateReport(
        test.contentId, 
        'FAIL', 
        { startTime, timeToFirstFrameMs: null, playbackDurationSec: null }, 
        error, 
        page
      );
      await this.browserManager.close();
      return report;
    }
  }
}

module.exports = Runner;