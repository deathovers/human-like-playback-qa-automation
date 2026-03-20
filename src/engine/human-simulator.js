const logger = require('../utils/logger');

class HumanSimulator {
  constructor(page) {
    this.page = page;
  }

  async randomDelay(min = 1000, max = 3000) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    logger.info(`Waiting for ${delay}ms...`);
    await this.page.waitForTimeout(delay);
  }

  async interactWithPlayer(selector = 'video, .play-button, [aria-label="Play"]') {
    logger.info('Attempting to interact with the player...');
    
    try {
      await this.page.waitForLoadState('networkidle');
      await this.randomDelay();

      const element = await this.page.$(selector);
      if (element) {
        logger.info('Element found, scrolling into view...');
        await element.scrollIntoViewIfNeeded();
        await this.randomDelay(500, 1500);
        
        logger.info('Clicking element...');
        const box = await element.boundingBox();
        if (box) {
          await this.page.mouse.click(
            box.x + box.width / 2,
            box.y + box.height / 2,
            { delay: Math.random() * 200 }
          );
        } else {
          await element.click({ delay: Math.random() * 200 });
        }
      } else {
        logger.warn('Player element not found for interaction.');
      }
    } catch (error) {
      logger.error(`Interaction failed: ${error.message}`);
    }
  }
}

module.exports = HumanSimulator;