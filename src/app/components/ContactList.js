import React, { useState } from 'react';
import styles from './css/ContactList.module.css';

export default function ContactList({ connectionId }) {
  const [contacts] = useState([]); // Keep an empty array for contacts
  const isLoading = false; // Keep isLoading false for now

  const fetchContacts = () => {
    console.log('Fetch contacts functionality will be implemented here.');
    // Placeholder for future Alloy contact fetch code
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
            contacts.map(contact => (
              <li key={contact.id} className={styles.item}>
                {contact.firstName} {contact.lastName}
              </li>
            ))
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
