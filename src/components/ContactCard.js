'use client';

import styles from './Cards.module.css';

/**
 * ContactCard — Phone numbers with click-to-call.
 */
export default function ContactCard() {
  return (
    <div className={styles.glass}>
      <div className={styles.header}>
        <div className={styles.pin}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
        </div>
        <div>
          <h3 className={styles.title}>Contact Us</h3>
          <p className={styles.subtitle}>For RSVP &amp; Inquiries</p>
        </div>
      </div>

      <div className={styles.contactNumbers}>
        <a href="tel:+917001445261" className={styles.contactLink}>
          <span className={styles.contactNum}>70014 45261 (Anirban)</span>
        </a>
        <span className={styles.contactDivider}>/</span>
        <a href="tel:+917596897406" className={styles.contactLink}>
          <span className={styles.contactNum}>7596897406 (Debolina)</span>
        </a>
      </div>
    </div>
  );
}
