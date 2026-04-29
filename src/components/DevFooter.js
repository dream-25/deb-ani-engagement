'use client';

import styles from './DevFooter.module.css';

/**
 * DevFooter — Developer credit footer.
 */
export default function DevFooter() {
  return (
    <footer className={styles.footer}>
      <p>
        Made with <span className={styles.heart}>❤</span> by{' '}
        <a href="https://devdrm.xyz/" target="_blank" rel="noopener noreferrer">
          Mohan Biswas
        </a>
      </p>
    </footer>
  );
}
