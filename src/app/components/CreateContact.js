// components/CreateContact.js
'use client';

import React, { useState } from 'react';
import styles from './css/CreateContact.module.css';

export default function CreateContact({ connectionId }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Create contact functionality will be implemented here.', { firstName, lastName });
    // Placeholder for future Alloy contact creation code
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
