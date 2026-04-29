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
 * Progressive frame loader hook.
 *
 * Phase 1: Priority-load the first N frames (critical path for preloader).
 * Phase 2: Lazy-load the rest in idle batches.
 * Phase 3: Scroll-ahead prefetcher fires on each frame draw.
 *
 * @param {object} device - From useDeviceCapability
 * @param {function} onPriorityProgress - Called with (loaded, total) during priority phase
 * @param {function} onPriorityComplete - Called when priority frames are all loaded
 */
export function useFrameLoader(device, onPriorityProgress, onPriorityComplete) {
  const framesRef = useRef([]);
  const frameLoadedRef = useRef([]);
  const totalFramesRef = useRef(0);
  const configRef = useRef(null);
  const lazyStartedRef = useRef(false);
  const initRef = useRef(false);

  // Initialize and start loading
  useEffect(() => {
    // Wait until device capability is detected (runs client-side)
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

    // Start priority loading
    loadPriorityFrames(config, framePath, totalFrames, supportsImageBitmap);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device]);

  // Load a single frame (with ImageBitmap / decode optimization)
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

  // Phase 1: Priority frames
  const loadPriorityFrames = useCallback(
    async (config, framePath, totalFrames, supportsImageBitmap) => {
      const count = Math.min(config.priorityFrames, totalFrames);
      let loaded = 0;

      const promises = [];
      for (let i = 0; i < count; i++) {
        promises.push(
          loadSingleFrame(i, framePath, config.frameStep, supportsImageBitmap).then(() => {
            loaded++;
            onPriorityProgress?.(loaded, count);
          })
        );
      }
      await Promise.all(promises);
      onPriorityComplete?.();
    },
    [loadSingleFrame, onPriorityProgress, onPriorityComplete]
  );

  // Phase 2: Lazy batch loading
  const startLazyLoading = useCallback(() => {
    if (lazyStartedRef.current || !configRef.current) return;
    lazyStartedRef.current = true;

    const { frameStep, batchSize, framePath, supportsImageBitmap } = configRef.current;
    const totalFrames = totalFramesRef.current;
    let nextSlot = configRef.current.priorityFrames;

    function loadNextBatch() {
      if (nextSlot >= totalFrames) return;

      const batchEnd = Math.min(nextSlot + batchSize, totalFrames);
      const batchPromises = [];

      for (let i = nextSlot; i < batchEnd; i++) {
        batchPromises.push(loadSingleFrame(i, framePath, frameStep, supportsImageBitmap));
      }
      nextSlot = batchEnd;

      Promise.all(batchPromises).then(() => {
        if (typeof requestIdleCallback === 'function') {
          requestIdleCallback(loadNextBatch, { timeout: 200 });
        } else {
          setTimeout(loadNextBatch, 50);
        }
      });
    }

    setTimeout(loadNextBatch, 300);
  }, [loadSingleFrame]);

  // Phase 3: Prefetch around a scroll position
  const prefetchAround = useCallback(
    (frameIndex) => {
      if (!configRef.current) return;
      const { prefetchWindow, frameStep, framePath, supportsImageBitmap } = configRef.current;
      const totalFrames = totalFramesRef.current;
      const start = Math.max(0, frameIndex - 5);
      const end = Math.min(totalFrames - 1, frameIndex + prefetchWindow);

      for (let i = start; i <= end; i++) {
        if (!frameLoadedRef.current[i]) {
          loadSingleFrame(i, framePath, frameStep, supportsImageBitmap);
        }
      }
    },
    [loadSingleFrame]
  );

  // Get a frame source (or nearest loaded fallback)
  const getFrame = useCallback((index) => {
    const totalFrames = totalFramesRef.current;
    const idx = Math.max(0, Math.min(totalFrames - 1, Math.round(index)));

    let frameSource = framesRef.current[idx];
    if (!frameSource) {
      for (let offset = 1; offset < 10; offset++) {
        if (idx - offset >= 0 && framesRef.current[idx - offset]) {
          frameSource = framesRef.current[idx - offset];
          break;
        }
        if (idx + offset < totalFrames && framesRef.current[idx + offset]) {
          frameSource = framesRef.current[idx + offset];
          break;
        }
      }
    }
    return frameSource;
  }, []);

  return {
    getFrame,
    startLazyLoading,
    prefetchAround,
    totalFrames: totalFramesRef.current,
    getTotalFrames: () => totalFramesRef.current,
  };
}
