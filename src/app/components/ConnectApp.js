import React from 'react';
import styles from './css/ConnectApp.module.css';

export default function ConnectApp({ onConnectionEstablished }) {
  const handleClick = () => {
    console.log('Connect App button clicked. Implement Alloy authentication here.');
    // Placeholder for future Alloy authentication code
  };

  return (
    <div className={styles.connectContainer}>
      <button className={styles.connectButton} onClick={handleClick}>
        Connect App
      </button>
    </div>
  );
}
