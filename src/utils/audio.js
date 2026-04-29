/**
 * Audio Manager
 * Handles Background Music (BGM)
 */

class AudioManager {
  constructor() {
    this.bgm = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.bgm = new Audio('/bgm.mp3');
    this.bgm.loop = true;
    this.bgm.volume = 0;
    this.isMuted = false;

    this.isInitialized = true;
  }

  setMute(muted) {
    this.isMuted = muted;
    if (this.bgm) {
      this.bgm.muted = muted;
    }
  }

  playBGM() {
    if (!this.bgm) this.init();

    this.bgm.play().then(() => {
      // Fade in BGM
      let volume = 0;
      const fadeIn = setInterval(() => {
        volume += 0.05;
        if (volume >= 0.5) {
          this.bgm.volume = 0.5;
          clearInterval(fadeIn);
        } else {
          this.bgm.volume = volume;
        }
      }, 200);
    }).catch(err => console.warn('BGM Playback failed:', err));
  }
}

export const audio = new AudioManager();
