// components/CreateContact.js
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import styles from './CreateContact.module.css';

export default function CreateContact({ connectionId }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (connectionId) {
      try {
        const response = await axios.post(`/api/contacts?connectionId=${connectionId}`, {
          firstName,
          lastName,
        });
        console.log('Contact added:', response.data);
        setFirstName('');
        setLastName('');
      } catch (error) {
        console.error('Error adding contact:', error);
      }
    } else {
      console.error('No connection ID. Please connect to Salesforce first.');
    }
  };

  return (
    <div className={styles.formContainer}>
      {!connectionId && <p>Please complete Step 1 to connect an app before adding contacts.</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            First Name:
            <input
              className={styles.input}
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </label>
          <label className={styles.label}>
            Last Name:
            <input
              className={styles.input}
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </label>
        </div>
        <button className={styles.button} type="submit" disabled={!connectionId}>Add Contact</button>
      </form>
    </div>
  );
}
