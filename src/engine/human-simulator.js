const logger = require('../utils/logger');

class HumanSimulator {
  constructor(page) {
    this.page = page;
  }

  async randomDelay(min = 1000, max = 3000) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    logger.info(`HumanSimulator: Waiting for ${delay}ms...`);
    await this.page.waitForTimeout(delay);
  }

  async interactWithPlayButton(selector = '.play-button, video') {
    logger.info('HumanSimulator: Waiting for network idle...');
    await this.page.waitForLoadState('networkidle');
    
    await this.randomDelay(1000, 3000);

    try {
      const element = this.page.locator(selector).first();
      await element.waitFor({ state: 'visible', timeout: 10000 });
      
      logger.info('HumanSimulator: Scrolling element into view...');
      await element.scrollIntoViewIfNeeded();
      
      await this.randomDelay(500, 1500);
      
      logger.info('HumanSimulator: Clicking element...');
      await element.click({ delay: Math.random() * 200 });
    } catch (error) {
      logger.error(`HumanSimulator: Failed to interact with play button: ${error.message}`);
      throw error;
    }
  }
}

module.exports = HumanSimulator;