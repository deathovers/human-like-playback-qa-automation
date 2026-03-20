const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class Reporter {
  constructor(outputDir = 'output') {
    this.outputDir = outputDir;
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async saveResult(result) {
    const filePath = path.join(this.outputDir, `result_${result.contentId}_${Date.now()}.json`);
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
    logger.info(`Result saved to ${filePath}`);
  }

  async captureScreenshot(page, contentId) {
    const screenshotPath = path.join(this.outputDir, `error_${contentId}_${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath });
    logger.info(`Screenshot saved to ${screenshotPath}`);
    return screenshotPath;
  }
}

module.exports = new Reporter();