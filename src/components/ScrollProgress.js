'use client';

import { forwardRef } from 'react';
import styles from './ScrollProgress.module.css';

/**
 * ScrollProgress — Fixed top bar showing scroll percentage.
 */
const ScrollProgress = forwardRef(function ScrollProgress({ visible }, ref) {
  return (
    <div className={`${styles.wrapper} ${visible ? styles.visible : ''}`}>
      <div className={styles.bar} ref={ref} />
    </div>
  );
});

export default ScrollProgress;
