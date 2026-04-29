/**
 * Haptic feedback utility
 * Provides vibration feedback on supported devices (mostly Android).
 */

export function haptic(style = 'light') {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;

  switch (style) {
    case 'light':
      navigator.vibrate(8);
      break;
    case 'medium':
      navigator.vibrate(15);
      break;
    case 'heavy':
      navigator.vibrate(25);
      break;
    case 'double':
      navigator.vibrate([10, 40, 10]);
      break;
    default:
      navigator.vibrate(8);
  }
}
