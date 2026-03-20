const logger = require('../utils/logger');

class PlaybackValidator {
  constructor(page) {
    this.page = page;
  }

  async validate(durationMs = 10000) {
    logger.info(`PlaybackValidator: Starting validation for ${durationMs}ms...`);
    
    const startTime = Date.now();
    let timeToFirstFrameMs = null;

    const videoExists = await this.page.evaluate(() => {
      const video = document.querySelector('video');
      return video && video.readyState >= 2;
    });

    if (!videoExists) {
      throw new Error('PLAYER_ERROR: Video element not found or readyState < 2');
    }

    let isPlaying = false;
    for (let i = 0; i < 50; i++) {
      const currentTime = await this.page.evaluate(() => {
        const video = document.querySelector('video');
        return video ? video.currentTime : 0;
      });
      
      if (currentTime > 0) {
        isPlaying = true;
        timeToFirstFrameMs = Date.now() - startTime;
        break;
      }
      await this.page.waitForTimeout(100);
    }

    if (!isPlaying) {
      throw new Error('TIMEOUT: Video failed to start playing within 5 seconds');
    }

    logger.info(`PlaybackValidator: Video started playing. Time to first frame: ${timeToFirstFrameMs}ms`);

    let previousTime = -1;
    const checkInterval = 2000;
    const checks = Math.ceil(durationMs / checkInterval);

    for (let i = 0; i < checks; i++) {
      await this.page.waitForTimeout(checkInterval);
      
      const state = await this.page.evaluate(() => {
        const video = document.querySelector('video');
        if (!video) return null;
        return {
          currentTime: video.currentTime,
          paused: video.paused
        };
      });

      if (!state) {
        throw new Error('PLAYER_ERROR: Video element disappeared during playback');
      }

      if (state.paused) {
        throw new Error('PLAYER_ERROR: Video paused unexpectedly');
      }

      if (state.currentTime <= previousTime) {
        throw new Error('PLAYER_ERROR: Video currentTime is not advancing');
      }

      logger.info(`PlaybackValidator: Continuity check passed. currentTime: ${state.currentTime}`);
      previousTime = state.currentTime;
    }

    const playbackDurationSec = (Date.now() - startTime) / 1000;
    logger.info(`PlaybackValidator: Validation successful. Total duration: ${playbackDurationSec}s`);

    return {
      timeToFirstFrameMs,
      playbackDurationSec
    };
  }
}

module.exports = PlaybackValidator;