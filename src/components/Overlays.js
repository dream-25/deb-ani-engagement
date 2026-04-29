'use client';

import { useEffect, useRef, forwardRef } from 'react';
import styles from './Overlays.module.css';

/**
 * Overlays — Particles, golden glow, vignette, and watermark.
 */
const Overlays = forwardRef(function Overlays({ showParticles, isLowEnd }, ref) {
  const particlesRef = useRef(null);
  const createdRef = useRef(false);

  // Create floating particles when activated
  useEffect(() => {
    if (!showParticles || createdRef.current || !particlesRef.current) return;
    createdRef.current = true;

    const count = isLowEnd ? 12 : 25;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = `${styles.particle} ${styles.particleAnimation}`;
      const size = Math.random() * 6 + 2;
      const delay = Math.random() * 15;
      const duration = 10 + Math.random() * 15;
      const left = Math.random() * 100;
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${left}%;
        animation-duration: ${duration}s;
        animation-delay: -${delay}s;
      `;
      frag.appendChild(p);
    }
    particlesRef.current.appendChild(frag);
  }, [showParticles, isLowEnd]);

  return (
    <>
      {/* Floating particles */}
      <div className={styles.particles} ref={particlesRef} />

      {/* Golden light overlay */}
      <div className={styles.goldenOverlay} ref={ref} />

      {/* Vignette */}
      <div className={styles.vignette} />

      {/* Branded watermark */}
      <div className={styles.watermark}>
        <span className={styles.wmName}>Debolina</span>
        <span className={styles.wmHeart}>❤</span>
        <span className={styles.wmName}>Anirban</span>
      </div>
    </>
  );
});

export default Overlays;
