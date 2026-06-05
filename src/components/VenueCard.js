'use client';

import styles from './Cards.module.css';

/**
 * VenueCard — Map, date, time, address, and directions link.
 */
export default function VenueCard() {
  return (
    <div className={styles.glass}>
      <div className={styles.header}>
        <div className={styles.pin}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div>
          <h3 className={styles.title}>Venue Location</h3>
          <p className={styles.subtitle}>THE ROYAL HERITAGE BANQUET</p>
        </div>
      </div>

      <div className={styles.mapWrap}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.123!2d88.4!3d22.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM2JzAwLjAiTiA4OMKwMjQnMDAuMCJF!5e0!3m2!1sen!2sin!4v1"
          width="100%"
          height="180"
          style={{ border: 0, borderRadius: '12px' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className={styles.details}>
        <div className={styles.detailRow}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Friday, 07 August 2026</span>
        </div>
        <div className={styles.detailRow}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>5:00 PM onwards</span>
        </div>
        <div className={styles.detailRow}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>1st Floor, 19, Baghajatin Station Rd,
            SPD Block, Ajanta Park, Baghajatin Colony,
            Kolkata, West Bengal 700086</span>
        </div>
      </div>

      <a
        href="https://maps.app.goo.gl/TswXMFBRFvyG6YNe6"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.btn}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
        Get Directions
      </a>
    </div>
  );
}
