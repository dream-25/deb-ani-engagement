'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

// Hooks
import { useDeviceCapability } from '@/hooks/useDeviceCapability';
import { useFrameLoader } from '@/hooks/useFrameLoader';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Utils
import { haptic } from '@/utils/haptics';
import { audio } from '@/utils/audio';

// Components
import Preloader from '@/components/Preloader';
import SplashScreen from '@/components/SplashScreen';
import ScrollProgress from '@/components/ScrollProgress';
import ScrollHint from '@/components/ScrollHint';
import FrameCanvas from '@/components/FrameCanvas';
import Overlays from '@/components/Overlays';
import SceneText from '@/components/SceneText';
import BottomSection from '@/components/BottomSection';
import SoundToggle from '@/components/SoundToggle';

/**
 * Main page orchestrator.
 * Manages the lifecycle: Preloader → Splash → Scroll Animation → Bottom Section.
 */
export default function HomePage() {
  // ── State ──
  const [preloaderHidden, setPreloaderHidden] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const [scrollActive, setScrollActive] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  // ── Refs ──
  const preloaderBarRef = useRef(null);
  const canvasRef = useRef(null);
  const progressBarRef = useRef(null);
  const goldenOverlayRef = useRef(null);
  const sceneTextRef = useRef(null);

  // ── Device capability ──
  const device = useDeviceCapability();

  // Lock scroll on mount (client-side only to avoid hydration mismatch)
  useEffect(() => {
    document.body.classList.add('scroll-locked');
    window.scrollTo(0, 0);
    audio.init();
  }, []);

  // ── Frame loader callbacks ──
  const onPriorityProgress = useCallback((loaded, total) => {
    if (preloaderBarRef.current) {
      const pct = Math.round((loaded / total) * 90);
      preloaderBarRef.current.style.width = pct + '%';
    }
  }, []);

  const onPriorityComplete = useCallback(() => {
    if (preloaderBarRef.current) {
      preloaderBarRef.current.style.width = '100%';
    }
    setTimeout(() => {
      setPreloaderHidden(true);
      // Initial canvas setup happens after preloader fades
      setTimeout(() => {
        if (canvasRef.current) {
          scrollAnim.resizeCanvas();
          scrollAnim.drawFrame(0);
        }
        frameLoader.startLazyLoading();
      }, 100);
    }, 400);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Frame loader ──
  const frameLoader = useFrameLoader(device, onPriorityProgress, onPriorityComplete);

  // ── Scroll animation ──
  const scrollAnim = useScrollAnimation({
    active: scrollActive,
    frameLoader,
    isLowEnd: device.isLowEnd,
    canvasRef,
    goldenOverlayRef,
    sceneTextRef,
    progressBarRef,
  });

  // ── Scroll Hint Logic (Show when idle, hide when scrolling) ──
  const idleTimerRef = useRef(null);

  useEffect(() => {
    if (!scrollActive) return;

    const onScroll = () => {
      setShowScrollHint(false);
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        // Only show if we haven't reached the very end
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollTop < docHeight - 100) {
          setShowScrollHint(true);
        }
      }, 2500); // 2.5s idle
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(idleTimerRef.current);
    };
  }, [scrollActive]);

  // ── Splash dismiss handler ──
  const handleEnter = useCallback((soundEnabled) => {
    haptic('medium');
    audio.setMute(!soundEnabled);
    audio.playBGM();

    // Trigger Fullscreen for mobile
    if (device.isMobile) {
      try {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) docEl.requestFullscreen();
        else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
        else if (docEl.msRequestFullscreen) docEl.msRequestFullscreen();
      } catch (err) {
        console.warn('Fullscreen request failed:', err);
      }
    }

    window.scrollTo(0, 0);
    setSplashVisible(false);

    // Force a first frame draw immediately
    if (canvasRef.current) {
      scrollAnim.resizeCanvas();
      scrollAnim.drawFrame(0);
    }

    setTimeout(() => {
      // Re-draw after layout shifts (especially for fullscreen)
      if (canvasRef.current) {
        scrollAnim.resizeCanvas();
        scrollAnim.drawFrame(0);
      }
      // Unlock scrolling
      document.body.classList.remove('scroll-locked');
      setScrollActive(true);
      setShowScrollHint(true);
      setShowParticles(true);
    }, 500);
  }, [device.isMobile, scrollAnim]);

  // Resize canvas on initial mount (after preloader hidden)
  useEffect(() => {
    if (preloaderHidden && canvasRef.current) {
      scrollAnim.resizeCanvas();
      scrollAnim.drawFrame(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preloaderHidden]);

  return (
    <>
      <Preloader hidden={preloaderHidden} ref={preloaderBarRef} />

      <SplashScreen
        visible={splashVisible}
        onEnter={handleEnter}
        isLowEnd={device.isLowEnd}
      />

      <ScrollProgress visible={scrollActive} ref={progressBarRef} />
      <ScrollHint visible={showScrollHint} />

      <FrameCanvas ref={canvasRef}>
        <Overlays
          showParticles={showParticles}
          isLowEnd={device.isLowEnd}
          ref={goldenOverlayRef}
        />
        <SceneText ref={sceneTextRef} />
      </FrameCanvas>

      {!splashVisible && <SoundToggle />}
      <BottomSection active={scrollActive} />
    </>
  );
}
