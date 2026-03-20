const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const logger = require('../utils/logger');

chromium.use(stealth);

class BrowserManager {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async init() {
    logger.info('Initializing browser in headed mode...');
    this.browser = await chromium.launch({
      headless: false, // Must use headed Chrome
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1440, height: 900 },
      { width: 1366, height: 768 }
    ];
    const viewport = viewports[Math.floor(Math.random() * viewports.length)];

    this.context = await this.browser.newContext({
      viewport,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });

    this.page = await this.context.newPage();
    logger.info(`Browser initialized with viewport ${viewport.width}x${viewport.height}`);
    return this.page;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      logger.info('Browser closed.');
    }
  }
}

module.exports = BrowserManager;