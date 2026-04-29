'use client';

import styles from './ScrollHint.module.css';

/**
 * ScrollHint — Animated mouse icon with "Scroll to unveil" text.
 */
export default function ScrollHint({ visible }) {
  return (
    <div className={`${styles.wrapper} ${visible ? styles.visible : ''}`}>
      <div className={styles.mouse}>
        <div className={styles.wheel} />
      </div>
      <p>Scroll to Reveal</p>
    </div>
  );
}
