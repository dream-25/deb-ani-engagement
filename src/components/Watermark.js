'use client';

import styles from './Overlays.module.css';

/**
 * Watermark — Bottom section branded watermark.
 */
export default function Watermark() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '6px 16px',
        margin: '4px auto 0',
        borderRadius: '20px',
        width: 'fit-content',
        background: 'rgba(201,168,76,0.08)',
        border: '1px solid rgba(201,168,76,0.2)',
      }}
    >
      <span className={styles.wmName}>Debolina</span>
      <span className={styles.wmHeart}>❤</span>
      <span className={styles.wmName}>Anirban</span>
    </div>
  );
}
