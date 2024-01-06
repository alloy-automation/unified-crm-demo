import React, { useEffect } from 'react';
import axios from 'axios';
import styles from './ConnectApp.module.css';

export default function ConnectApp({ onConnectionEstablished }) {
  useEffect(() => {
    // Load the Alloy SDK script
    const loadAlloySDK = () => {
      const script = document.createElement('script');
      script.src = "https://cdn.runalloy.com/scripts/embedded.js";
      script.type = "text/javascript";
      script.onload = () => console.log("Alloy SDK loaded");
      document.body.appendChild(script);
    };

    loadAlloySDK();
  }, []);

  const fetchTokenAndAuthenticate = async () => {
    try {
      const response = await axios.get('/api/get-jwt-token');
      if (window.Alloy) {
        window.Alloy.setToken(response.data.token);
        window.Alloy.authenticate({
          category: 'crm',
          callback: (data) => {
            if (data.success) {
              localStorage.setItem('connectionId', data.connectionId);
              onConnectionEstablished(data.connectionId);
            }
          }
        });
      } else {
        console.error('Alloy SDK not found');
      }
    } catch (error) {
      console.error('Error fetching JWT token:', error);
    }
  };

  return (
    <div className={styles.connectContainer}>
      <button className={styles.connectButton} onClick={fetchTokenAndAuthenticate}>
        Connect App
      </button>
    </div>
  );
}
