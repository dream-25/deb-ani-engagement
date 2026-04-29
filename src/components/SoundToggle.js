'use client';

import { useState, useEffect } from 'react';
import { audio } from '@/utils/audio';
import styles from './SoundToggle.module.css';

export default function SoundToggle() {
  const [isMuted, setIsMuted] = useState(false);

  const toggle = () => {
    const muted = !isMuted;
    setIsMuted(muted);
    if (audio.bgm) {
      audio.bgm.muted = muted;
    }
  };

  return (
    <button
      className={`${styles.toggle} ${isMuted ? styles.muted : ''}`}
      onClick={toggle}
      title={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5L6 9H2V15H6L11 19V5Z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5L6 9H2V15H6L11 19V5Z" />
          <path d="M19.07 4.93C20.94 6.81 22 9.33 22 12C22 14.67 20.94 17.19 19.07 19.07" />
          <path d="M15.54 8.46C16.47 9.4 17 10.66 17 12C17 13.34 16.47 14.6 15.54 15.54" />
        </svg>
      )}
    </button>
  );
}
