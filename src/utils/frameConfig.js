/**
 * Frame animation configuration
 * Central config for frame paths, counts, and loading strategy.
 */

// Total frames available in each directory
export const DESKTOP_FRAME_COUNT = 200;
export const MOBILE_FRAME_COUNT = 275;

// Path templates
export const DESKTOP_FRAME_PATH = '/frames-desktop/ezgif-frame-';
export const MOBILE_FRAME_PATH = '/frames-mobile/ezgif-frame-';
export const FRAME_EXT = '.jpg';

/**
 * Pad a number to 3 digits (e.g., 1 → '001')
 */
export function padNumber(n) {
  return String(n).padStart(3, '0');
}

/**
 * Build the URL for a given frame slot, accounting for frame stepping.
 */
export function getFrameUrl(slotIndex, framePath, frameStep) {
  const sourceIndex = slotIndex * frameStep + 1;
  return framePath + padNumber(sourceIndex) + FRAME_EXT;
}

/**
 * Get adaptive loading parameters based on device capability.
 */
export function getLoadingConfig(isLowEnd, isVeryLowEnd) {
  // Frame step — skip frames on weak devices
  const frameStep = isVeryLowEnd ? 3 : isLowEnd ? 2 : 1;

  // Priority frames — loaded before preloader dismisses
  const priorityFrames = 15;

  // Batch size for lazy loading
  const batchSize = isLowEnd ? 8 : 15;

  // How far ahead to prefetch from current scroll position
  const prefetchWindow = isLowEnd ? 20 : 40;

  return { frameStep, priorityFrames, batchSize, prefetchWindow };
}
