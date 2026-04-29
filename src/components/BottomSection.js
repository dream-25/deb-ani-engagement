'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './BottomSection.module.css';
import VenueCard from './VenueCard';
import ContactCard from './ContactCard';
import Watermark from './Watermark';
import DevFooter from './DevFooter';
import { haptic } from '@/utils/haptics';

/**
 * BottomSection — Container for venue/contact cards with IntersectionObserver reveal.
 */
export default function BottomSection({ active }) {
  const sectionRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!active || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !revealed) {
            setRevealed(true);
            haptic('heavy');
            setTimeout(() => haptic('double'), 1000);
            observer.unobserve(sectionRef.current);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px 50px 0px' }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [active, revealed]);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${revealed ? styles.revealed : ''}`}
    >
      <div className={styles.boxContent}>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <VenueCard />
          </div>
          <div className={styles.card}>
            <ContactCard />
          </div>
        </div>

        <Watermark />
        <DevFooter />
      </div>
    </section>
  );
}
