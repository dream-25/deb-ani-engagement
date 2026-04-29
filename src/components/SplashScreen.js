'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import styles from './SplashScreen.module.css';

/**
 * SplashScreen — Landing page with names, date, ornaments, particles, and enter button.
 */
export default function SplashScreen({ visible, onEnter, isLowEnd }) {
  const particlesRef = useRef(null);
  const [gone, setGone] = useState(false);

  // Create floating particles inside splash
  useEffect(() => {
    if (!particlesRef.current) return;
    const count = isLowEnd ? 15 : 30;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = styles.particleAnimation;
      const size = Math.random() * 4 + 1;
      const duration = 8 + Math.random() * 12;
      const delay = Math.random() * 10;
      p.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        background: radial-gradient(circle, rgba(201,168,76,${0.3 + Math.random() * 0.5}), transparent);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-duration: ${duration}s;
        animation-delay: -${delay}s;
      `;
      frag.appendChild(p);
    }
    particlesRef.current.appendChild(frag);
  }, [isLowEnd]);

  // Hide from DOM after transition
  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => setGone(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClick = useCallback(() => {
    onEnter?.();
  }, [onEnter]);

  const wrapperClass = [
    styles.wrapper,
    !visible ? styles.hidden : '',
    gone ? styles.displayNone : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClass}>
      <div className={styles.bg} />
      <div className={styles.particles} ref={particlesRef} />
      <div className={styles.content}>
        <div className={`${styles.ornament} ${styles.topLeft}`} />
        <div className={`${styles.ornament} ${styles.topRight}`} />
        <div className={`${styles.ornament} ${styles.bottomLeft}`} />
        <div className={`${styles.ornament} ${styles.bottomRight}`} />

        <p className={styles.subtitle}>You are invited to</p>

        <h1 className={styles.names}>
          <span className={styles.nameLine}>Debolina</span>
          <span className={styles.ampersand}>&amp;</span>
          <span className={styles.nameLine}>Anirban</span>
        </h1>

        <p className={styles.event}>Engagement Ceremony</p>

        <div className={styles.date}>
          <span>FRIDAY</span>
          <span className={styles.dateDivider}>|</span>
          <span>07</span>
          <span className={styles.dateDivider}>|</span>
          <span>AUG</span>
          <span className={styles.dateDivider}>|</span>
          <span>2026</span>
        </div>

        <button className={styles.enterBtn} onClick={handleClick}>
          <span>Open Invitation</span>
          <span className={styles.btnIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
