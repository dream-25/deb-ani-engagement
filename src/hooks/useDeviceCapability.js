'use client';

import { useState, useEffect } from 'react';

/**
 * Detects device capability: mobile, low-end, very-low-end.
 * Uses navigator.hardwareConcurrency and navigator.deviceMemory.
 */
export function useDeviceCapability() {
  const [capability, setCapability] = useState({
    isMobile: false,
    isLowEnd: false,
    isVeryLowEnd: false,
    supportsImageBitmap: false,
    ready: false,
  });

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const cores = navigator.hardwareConcurrency || 2;
    const memory = navigator.deviceMemory || 2; // GB
    const isLowEnd = cores <= 4 && memory <= 4;
    const isVeryLowEnd = cores <= 2 || memory <= 2;
    const supportsImageBitmap = typeof createImageBitmap === 'function';

    setCapability({ isMobile, isLowEnd, isVeryLowEnd, supportsImageBitmap, ready: true });
  }, []);

  return capability;
}
