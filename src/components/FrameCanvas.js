'use client';

import { forwardRef } from 'react';
import styles from './FrameCanvas.module.css';

/**
 * FrameCanvas — The main scroll container with the animation canvas.
 * Contains canvas + overlay slots passed as children.
 */
const FrameCanvas = forwardRef(function FrameCanvas({ children }, ref) {
  return (
    <main className={styles.container}>
      <div className={styles.stickyWrapper}>
        <canvas ref={ref} className={styles.canvas} />
        {children}
      </div>
    </main>
  );
});

export default FrameCanvas;
