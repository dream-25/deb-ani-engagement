'use client';

import { forwardRef } from 'react';
import styles from './SceneText.module.css';

/**
 * SceneText — "A celebration of love" overlay text.
 */
const SceneText = forwardRef(function SceneText(props, ref) {
  return (
    <div className={styles.container}>
      <div className={styles.sceneText} ref={ref}>
        <p className={styles.label}>✦ A celebration of love ✦</p>
      </div>
    </div>
  );
});

export default SceneText;
