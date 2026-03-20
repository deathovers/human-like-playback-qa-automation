const Runner = require('./src/runner');
const logger = require('./src/utils/logger');
require('./src/config/env');

async function main() {
  try {
    const runner = new Runner();
    
    const payload = {
      batchId: "batch-001",
      tests: [
        { url: "https://www.w3schools.com/html/html5_video.asp", contentId: "vid-123" }
      ],
      config: {
        timeout: 30000,
        validationDuration: 10000
      }
    };

    const results = await runner.runBatch(payload);
    logger.info(`Batch completed: ${JSON.stringify(results, null, 2)}`);
  } catch (error) {
    logger.error(`Fatal error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = main;