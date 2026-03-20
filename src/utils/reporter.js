const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class Reporter {
  constructor(outputDir = './output') {
    this.outputDir = outputDir;
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generateReport(contentId, status, metrics, error, page = null) {
    const report = {
      contentId,
      status,
      metrics: metrics || {
        startTime: new Date().toISOString(),
        timeToFirstFrameMs: null,
        playbackDurationSec: null
      }
    };

    if (error) {
      report.error = {
        code: error.message.split(':')[0] || 'UNKNOWN_ERROR',
        message: error.message,
        screenshotPath: null
      };

      if (page) {
        const screenshotName = `error_${contentId}_${Date.now()}.png`;
        const screenshotPath = path.join(this.outputDir, screenshotName);
        await page.screenshot({ path: screenshotPath });
        report.error.screenshotPath = screenshotPath;
        logger.info(`Screenshot saved to ${screenshotPath}`);
      }
    }

    const reportPath = path.join(this.outputDir, `report_${contentId}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    logger.info(`Report generated at ${reportPath}`);
    
    return report;
  }
}

module.exports = Reporter;