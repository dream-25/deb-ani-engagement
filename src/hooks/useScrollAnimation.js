'use client';

import { useRef, useCallback, useEffect } from 'react';
import { haptic } from '@/utils/haptics';
import { audio } from '@/utils/audio';

/**
 * Scroll animation hook.
 * Maps scroll progress → frame index, drives canvas rendering and overlay effects.
 *
 * @param {object} params
 * @param {boolean} params.active       - Whether scroll tracking is active
 * @param {object}  params.frameLoader  - From useFrameLoader
 * @param {boolean} params.isLowEnd     - Throttle to 30fps on low-end
 * @param {React.RefObject} params.canvasRef
 * @param {React.RefObject} params.goldenOverlayRef
 * @param {React.RefObject} params.sceneTextRef
 * @param {React.RefObject} params.progressBarRef
 */
export function useScrollAnimation({
  active,
  frameLoader,
  isLowEnd,
  canvasRef,
  goldenOverlayRef,
  sceneTextRef,
  progressBarRef,
}) {
  const currentFrameRef = useRef(-1);
  const lastHapticRef = useRef(-1);
  const tickingRef = useRef(false);
  const lastTickTimeRef = useRef(0);
  const ctxRef = useRef(null);

  const TICK_INTERVAL = isLowEnd ? 33 : 16;

  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current && !ctxRef.current) {
      ctxRef.current = canvasRef.current.getContext('2d', { alpha: false });
    }
  }, [canvasRef]);

  // Resize canvas to match viewport
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, isLowEnd ? 1 : 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.scale(dpr, dpr);
    ctxRef.current = ctx;

    // Force redraw on next drawFrame call
    currentFrameRef.current = -1;
  }, [canvasRef, isLowEnd]);

  // Draw a frame onto the canvas
  const drawFrame = useCallback(
    (index) => {
      const totalFrames = frameLoader.getTotalFrames();
      const idx = Math.max(0, Math.min(totalFrames - 1, Math.round(index)));

      if (idx === currentFrameRef.current) return;
      currentFrameRef.current = idx;

      const frameSource = frameLoader.getFrame(idx);
      if (!frameSource) return;

      const ctx = ctxRef.current;
      if (!ctx) return;

      const cw = parseInt(canvasRef.current.style.width) || window.innerWidth;
      const ch = parseInt(canvasRef.current.style.height) || window.innerHeight;

      let iw, ih;
      if (frameSource instanceof ImageBitmap) {
        iw = frameSource.width;
        ih = frameSource.height;
      } else {
        iw = frameSource.naturalWidth;
        ih = frameSource.naturalHeight;
        if (!iw || !ih) return;
      }

      // Contain fit
      const scale = Math.min(cw / iw, ch / ih);
      const sw = iw * scale;
      const sh = ih * scale;
      const sx = (cw - sw) / 2;
      const sy = (ch - sh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(frameSource, sx, sy, sw, sh);

      // Prefetch frames around current position
      frameLoader.prefetchAround(idx);
    },
    [frameLoader, canvasRef]
  );

  // Scroll handler
  const onScroll = useCallback(() => {
    if (!active) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, scrollTop / docHeight));

    // Update progress bar
    if (progressBarRef.current) {
      progressBarRef.current.style.width = progress * 100 + '%';
    }

    // Map scroll → frame
    const totalFrames = frameLoader.getTotalFrames();
    const frameIndex = Math.floor(progress * (totalFrames - 1));

    drawFrame(frameIndex);

    // Haptic at scene transitions (every 25 frames)
    const hapticMilestone = Math.floor(frameIndex / 25);
    if (hapticMilestone !== lastHapticRef.current && frameIndex > 0) {
      lastHapticRef.current = hapticMilestone;
      haptic('light');
    }

    // Golden overlay intensity
    if (goldenOverlayRef.current) {
      const goldenIntensity =
        progress > 0.3 && progress < 0.7
          ? Math.sin(((progress - 0.3) / 0.4) * Math.PI) * 0.15
          : 0;
      goldenOverlayRef.current.style.opacity = goldenIntensity;
    }

    // Scene 1 text fade
    if (sceneTextRef.current) {
      sceneTextRef.current.style.opacity = progress < 0.08 ? 1 - progress / 0.08 : 0;
    }
  }, [active, frameLoader, drawFrame, progressBarRef, goldenOverlayRef, sceneTextRef]);

  // RAF loop with throttling
  useEffect(() => {
    if (!active) return;

    const requestTick = () => {
      if (!tickingRef.current) {
        requestAnimationFrame((now) => {
          if (now - lastTickTimeRef.current >= TICK_INTERVAL) {
            onScroll();
            lastTickTimeRef.current = now;
          }
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });

    return () => {
      window.removeEventListener('scroll', requestTick);
    };
  }, [active, onScroll, TICK_INTERVAL]);

  // Handle resizing and fullscreen transitions (always active)
  useEffect(() => {
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const lastFrame = currentFrameRef.current;
        resizeCanvas();
        // resizeCanvas sets currentFrameRef to -1, so we draw the last valid frame
        drawFrame(lastFrame >= 0 ? lastFrame : 0);
      }, 150);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('fullscreenchange', onResize);
    window.addEventListener('webkitfullscreenchange', onResize);
    window.addEventListener('mozfullscreenchange', onResize);
    window.addEventListener('MSFullscreenChange', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('fullscreenchange', onResize);
      window.removeEventListener('webkitfullscreenchange', onResize);
      window.removeEventListener('mozfullscreenchange', onResize);
      window.removeEventListener('MSFullscreenChange', onResize);
      clearTimeout(resizeTimer);
    };
  }, [resizeCanvas, drawFrame]);

  return { resizeCanvas, drawFrame };
}
