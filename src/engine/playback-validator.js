const logger = require('../utils/logger');

class PlaybackValidator {
  constructor(page) {
    this.page = page;
  }

  async validate(durationMs = 10000) {
    logger.info(`Starting playback validation for ${durationMs}ms...`);
    const startTime = Date.now();
    let timeToFirstFrameMs = null;

    try {
      // 1. Initial Check
      const videoExists = await this.page.evaluate(() => {
        const video = document.querySelector('video');
        return video && video.readyState >= 2; // HAVE_CURRENT_DATA
      });

      if (!videoExists) {
        throw new Error('Video element not found or not ready.');
      }

      // 2. Start Buffer Check
      await this.page.waitForFunction(() => {
        const video = document.querySelector('video');
        return video && video.currentTime > 0;
      }, { timeout: 5000 });
      
      timeToFirstFrameMs = Date.now() - startTime;
      logger.info(`Time to first frame: ${timeToFirstFrameMs}ms`);

      // 3. Continuity Check
      let previousTime = -1;
      let cumulativePlayback = 0;
      const checkInterval = 2000;
      const iterations = Math.ceil(durationMs / checkInterval);

      for (let i = 0; i < iterations; i++) {
        await this.page.waitForTimeout(checkInterval);
        
        const state = await this.page.evaluate(() => {
          const video = document.querySelector('video');
          if (!video) return null;
          return {
            currentTime: video.currentTime,
            paused: video.paused
          };
        });

        if (!state) throw new Error('Video element lost during playback.');
        if (state.paused) throw new Error('Video paused unexpectedly.');
        if (state.currentTime <= previousTime) throw new Error('Playback stalled, currentTime not advancing.');

        cumulativePlayback += (state.currentTime - (previousTime === -1 ? state.currentTime : previousTime));
        previousTime = state.currentTime;
        logger.info(`Playback progressing... currentTime: ${state.currentTime}`);
      }

      return {
        success: true,
        metrics: {
          startTime: new Date(startTime).toISOString(),
          timeToFirstFrameMs,
          playbackDurationSec: cumulativePlayback
        }
      };

    } catch (error) {
      logger.error(`Validation failed: ${error.message}`);
      return {
        success: false,
        error: {
          code: 'PLAYER_ERROR',
          message: error.message
        }
      };
    }
  }
}

module.exports = PlaybackValidator;