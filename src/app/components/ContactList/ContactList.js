// components/ContactList.js
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ContactList.module.css';

export default function ContactList({ connectionId }) {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Define fetchContacts outside of useEffect
  const fetchContacts = async () => {
    if (connectionId) {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/contacts?connectionId=${connectionId}`);
        setContacts(response.data.contacts); // Assuming the response returns an array of contacts
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setIsLoading(false);
      }
    }
  };


  return (
    <div className={styles.contactList}>
      <h2 className={styles.title}>Contacts</h2>
      {!connectionId && (
        <p>An Alloy Unified API connectionId is required. Please complete Step 1 to connect an app and view contacts.</p>
      )}
      {isLoading ? (
        <p className={styles.loading}>Loading contacts...</p>
      ) : (
        <div>
          {contacts.length > 0 ? (
            <ul className={styles.list}>
              {contacts.map(contact => (
                <li key={contact.id} className={styles.item}>
                  {contact.firstName} {contact.lastName}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noContacts}>No Contacts Found</p>
          )}
          <button className={styles.refreshButton} onClick={fetchContacts} disabled={!connectionId || isLoading}>
            Refresh Contacts
          </button>
        </div>
      )}
    </div>
  );
}
