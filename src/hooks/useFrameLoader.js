'use client';

import { useRef, useCallback, useEffect } from 'react';
import {
  DESKTOP_FRAME_PATH,
  MOBILE_FRAME_PATH,
  DESKTOP_FRAME_COUNT,
  MOBILE_FRAME_COUNT,
  getFrameUrl,
  getLoadingConfig,
} from '@/utils/frameConfig';

/**
 * Frame loader hook that preloads all frames upfront.
 *
 * @param {object} device - From useDeviceCapability
 * @param {function} onPriorityProgress - Called with (loaded, total) during loading
 * @param {function} onPriorityComplete - Called when all frames are loaded
 */
export function useFrameLoader(device, onPriorityProgress, onPriorityComplete) {
  const framesRef = useRef([]);
  const frameLoadedRef = useRef([]);
  const totalFramesRef = useRef(0);
  const configRef = useRef(null);
  const initRef = useRef(false);

  // Initialize and start loading
  useEffect(() => {
    if (!device.ready) return;
    if (initRef.current) return;
    initRef.current = true;

    const { isMobile, isLowEnd, isVeryLowEnd, supportsImageBitmap } = device;
    const framePath = isMobile ? MOBILE_FRAME_PATH : DESKTOP_FRAME_PATH;
    const totalAvailable = isMobile ? MOBILE_FRAME_COUNT : DESKTOP_FRAME_COUNT;
    const config = getLoadingConfig(isLowEnd, isVeryLowEnd);

    const totalFrames = Math.ceil(totalAvailable / config.frameStep);
    totalFramesRef.current = totalFrames;
    configRef.current = { ...config, framePath, supportsImageBitmap };

    framesRef.current = new Array(totalFrames).fill(null);
    frameLoadedRef.current = new Array(totalFrames).fill(false);

    // Start loading all frames
    loadAllFrames(config, framePath, totalFrames, supportsImageBitmap);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device]);

  // Load a single frame
  const loadSingleFrame = useCallback((slotIndex, framePath, frameStep, supportsImageBitmap) => {
    return new Promise((resolve) => {
      if (frameLoadedRef.current[slotIndex]) {
        resolve();
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = async () => {
        try {
          if (supportsImageBitmap) {
            const bitmap = await createImageBitmap(img);
            framesRef.current[slotIndex] = bitmap;
          } else if (img.decode) {
            await img.decode();
            framesRef.current[slotIndex] = img;
          } else {
            framesRef.current[slotIndex] = img;
          }
        } catch {
          framesRef.current[slotIndex] = img;
        }
        frameLoadedRef.current[slotIndex] = true;
        resolve();
      };

      img.onerror = () => {
        frameLoadedRef.current[slotIndex] = true;
        resolve();
      };

      img.src = getFrameUrl(slotIndex, framePath, frameStep);
    });
  }, []);

  // Load all frames with concurrency limit
  const loadAllFrames = useCallback(
    async (config, framePath, totalFrames, supportsImageBitmap) => {
      let loaded = 0;
      const { batchSize, frameStep } = config;
      
      let running = 0;
      let nextIndex = 0;

      const loadNext = () => {
        if (nextIndex >= totalFrames) {
          if (running === 0) {
            onPriorityComplete?.();
          }
          return;
        }

        while (running < batchSize && nextIndex < totalFrames) {
          const currentIndex = nextIndex++;
          running++;
          loadSingleFrame(currentIndex, framePath, frameStep, supportsImageBitmap).then(() => {
            loaded++;
            running--;
            onPriorityProgress?.(loaded, totalFrames);
            loadNext();
          });
        }
      };

      loadNext();
    },
    [loadSingleFrame, onPriorityProgress, onPriorityComplete]
  );

  // Compatible stubs
  const startLazyLoading = useCallback(() => {
    // Everything is already loading/loaded upfront
  }, []);

  const prefetchAround = useCallback((frameIndex) => {
    // Everything is already loading/loaded upfront
  }, []);

  // Get a frame source
  const getFrame = useCallback((index) => {
    const totalFrames = totalFramesRef.current;
    const idx = Math.max(0, Math.min(totalFrames - 1, Math.round(index)));
    return framesRef.current[idx];
  }, []);

  return {
    getFrame,
    startLazyLoading,
    prefetchAround,
    totalFrames: totalFramesRef.current,
    getTotalFrames: () => totalFramesRef.current,
  };
}
