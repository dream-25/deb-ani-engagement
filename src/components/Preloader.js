'use client';

import { forwardRef } from 'react';
import styles from './Preloader.module.css';

/**
 * Preloader — Full-screen loading overlay with ring animation and progress bar.
 */
const Preloader = forwardRef(function Preloader({ hidden }, ref) {
  return (
    <div className={`${styles.overlay} ${hidden ? styles.hidden : ''}`}>
      <div className={styles.inner}>
        <div>
          <svg viewBox="0 0 100 100" className={styles.ringSvg}>
            <circle cx="38" cy="50" r="18" className={`${styles.ring} ${styles.ring1}`} />
            <circle cx="62" cy="50" r="18" className={`${styles.ring} ${styles.ring2}`} />
          </svg>
        </div>
        <p className={styles.text}>Preparing your invitation...</p>
        <div className={styles.progress}>
          <div className={styles.bar} ref={ref} />
        </div>
      </div>
    </div>
  );
});

export default Preloader;
