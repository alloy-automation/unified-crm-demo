# Alloy CRM Integration with Next.js - Unified API Tutorial

## Introduction

Welcome to our tutorial on building a CRM integration using Next.js and Alloy. This guide will walk you through the process of adding Alloy functionality to a pre-built Next.js project. The project allows users to connect to a CRM system, list contacts, and create new contacts. If you're new to Next.js -- no worries, it's built on React and should be familiar for Javascript developers.

## Getting Started

1.  **Clone the Starting Repository**:
    
    Start by cloning the provided repository. This contains the basic structure and components you'll need.
        
    ```
    git clone https://github.com/your-repository/practice-crm-app.git
    cd practice-crm-app
    ``` 
    
2.  **Install Dependencies**:
    
    Run the following command to install the necessary dependencies.
        
    `npm install` 
    
3.  **Run the Application**:
    
    Use the following command to start the application. This will let you view the UI components in their initial, non-functional state.
        
    `npm run dev` 
    
    Visit `http://localhost:3000` in your browser to see the application. In the tutorial UI, you'll see 3 steps. Each represents a Javascript Component, which we'll fill in the functionality for.
    <div align="center">
         <img src="https://github.com/kellygold/temp-crm-demo/assets/28990947/b95c0aa1-adf9-4a17-8952-44b56ae75173" width="600"/>
    </div>

## Tutorial Steps


### Step 1: Establishing a Connection
To create a connection to a 3rd party from your/an app, Alloy requires that we fetch a JWT token for an Alloy user and pass the JWT to the frontend SDK via `alloy.authenticate()`. 

1.  **Modify `token.js` API Route**:
    
    Update the `token.js` file in the `pages/api` directory to generate a JWT token using Alloy's API.
    
    **Updated Code for `token.js`:**
    
    
    ```
    // pages/api/token.js
    export default async function handler(req, res) {
      const YOUR_API_KEY = process.env.ALLOY_API_KEY;
      const userId = process.env.ALLOY_USER_ID;
    
      try {
        const response = await fetch(`https://embedded.runalloy.com/2023-12/users/${userId}/token`, {
          headers: {
            'Authorization': `Bearer ${YOUR_API_KEY}`,
            'Accept': 'application/json'
          }
        });
        const data = await response.json();
        res.status(200).json({ token: data.token });
      } catch (error) {
        console.error('Error generating JWT token:', error);
        res.status(500).json({ error: 'Error generating JWT token' });
      }
    }
    ```
    
    
    **Key Points:**
    
    -   Ensure you have set `ALLOY_API_KEY` and `ALLOY_USER_ID` in your environment variables.
    -   This code fetches a JWT token from Alloy and returns it in the response. This token is required for authenticating with the Alloy SDK.

	This setup is crucial for the next step, where you'll integrate the JWT token generation with the front-end `ConnectApp.js` component.

2.  **Set Up `ConnectApp.js`**:
        
    Implement Alloy authentication logic in the `ConnectApp.js` file within the `src/app/components` directory.
    
    **Updated Code for `ConnectApp.js`:**
        
    ```
    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import Alloy from 'alloy-frontend';
    import styles from './css/ConnectApp.module.css';
    
    export default function ConnectApp({ onConnectionEstablished }) {
      const [alloy, setAlloy] = useState(null);
    
      useEffect(() => {
        setAlloy(Alloy());
      }, []);
    
      const fetchTokenAndAuthenticate = async () => {
        if (!alloy) {
          console.error('Alloy SDK not initialized');
          return;
        }
    
        try {
          const response = await axios.get('/api/token');
          alloy.setToken(response.data.token);
          alloy.authenticate({
            category: 'crm',
            callback: (data) => {
              if (data.success) {
                localStorage.setItem('connectionId', data.connectionId);
                onConnectionEstablished(data.connectionId);
              }
            }
          });
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
    ``` 
    
    **Key Points:**
    
    -   The `useEffect` hook initializes the Alloy SDK.
    -   `fetchTokenAndAuthenticate` function fetches the JWT token from the `/api/token` route and uses it to authenticate with Alloy.
    -   Upon successful authentication, the connection ID is stored and the `onConnectionEstablished` callback is triggered.

Once authenticated, it allows further actions such as listing and creating contacts.
    


### Step 2: Implementing Contacts API Routes

1.  **Update `contacts.js` API Route**:
    
    Refactor the `contacts.js` file in the `pages/api` directory to manage fetching and creating contacts using Alloy's API.
    
    **Initial Code Template for `contacts.js`:**
    
    
    ```
    export default function handler(req, res) {
      console.log('Contacts API endpoint hit. Implement Alloy contacts functionality here.');
      res.status(200).json({ message: 'This is where Alloy contacts functionality will be implemented.' });
    }
    ``` 
    
    **Updated `contacts.js` with Alloy API Integration:**
    
    
    ```
    // pages/api/contacts.js
    export default async function handler(req, res) {
      const YOUR_API_KEY = process.env.ALLOY_API_KEY;
      const connectionId = req.query.connectionId;
    
      if (!connectionId) {
        return res.status(400).json({ error: 'ConnectionId is required' });
      }
    
      const headers = {
        'Authorization': `bearer ${YOUR_API_KEY}`,
        'Accept': 'application/json'
      };
    
      switch (req.method) {
        case 'GET':
          try {
            const response = await fetch(`https://embedded.runalloy.com/2023-12/one/crm/contacts?connectionId=${connectionId}`, { headers });
            const data = await response.json();
            res.status(200).json(data);
          } catch (error) {
            console.error('Error fetching contacts:', error);
            res.status(500).json({ error: 'Error fetching contacts' });
          }
          break;
    
        case 'POST':
          try {
            const response = await fetch(`https://embedded.runalloy.com/2023-12/one/crm/contacts?connectionId=${connectionId}`, {
              method: 'POST',
              headers: { ...headers, 'Content-Type': 'application/json' },
              body: JSON.stringify(req.body)
            });
            const data = await response.json();
            res.status(200).json(data);
          } catch (error) {
            console.error('Error creating contact:', error);
            res.status(500).json({ error: 'Error creating contact' });
          }
          break;
    
        default:
          res.setHeader('Allow', ['GET', 'POST']);
          res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    }
    ``` 
    
    **Instructions:**
    
    -   This API route handles GET requests for fetching existing contacts and POST requests for creating new contacts.
    -   The `switch` statement directs the request based on the method (GET or POST).
    -   Both requests use Alloy's API and require a valid `connectionId`.
    -   The `headers` include the necessary authorization and accept headers for the API requests.
    
    This API route is crucial for managing contacts in the CRM integration. It interacts with Alloy's API to retrieve and store contact information.
    


### Step 3: Setting Up Contact Components

1.  **Configure `ContactList.js`**:
    
    Update `ContactList.js` in the `src/app/components` directory to interact with your `contacts.js` API route for fetching contacts.
    
    **Initial Template for `ContactList.js`:**
        
    ```
    import React, { useState } from 'react';
    import styles from './css/ContactList.module.css';
    
    export default function ContactList({ connectionId }) {
      const [contacts] = useState([]); // Placeholder array for contacts
      const isLoading = false; // Placeholder for loading state
    
      const fetchContacts = () => {
        console.log('Fetch contacts functionality will be implemented here.');
        // Future Alloy contact fetch code will be added here
      };
    
      // Component UI remains the same
    }
    ``` 
    
    **Completed `ContactList.js` with Alloy Integration:**
    
    
    ```
    // components/ContactList.js
    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import styles from './css/ContactList.module.css';
    
    export default function ContactList({ connectionId }) {
      const [contacts, setContacts] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
    
      const fetchContacts = async () => {
        if (connectionId) {
          setIsLoading(true);
          try {
            const response = await axios.get(`/api/contacts?connectionId=${connectionId}`);
            setContacts(response.data.contacts);
            setIsLoading(false);
          } catch (error) {
            console.error('Error fetching contacts:', error);
            setIsLoading(false);
          }
        }
      };
    
      // Rest of the component remains the same
    }
    ``` 
    
2.  **Configure `CreateContact.js`**:
    
    Adapt `CreateContact.js` in the `src/app/components` directory to utilize your `contacts.js` API route for creating new contacts.
    
    **Initial Template for `CreateContact.js`:**
        
    ```
    import React, { useState } from 'react';
    import styles from './css/CreateContact.module.css';
    
    export default function CreateContact({ connectionId }) {
      const [firstName, setFirstName] = useState('');
      const [lastName, setLastName] = useState('');
    
      const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Create contact functionality will be implemented here.', { firstName, lastName });
        // Future Alloy contact creation code will be added here
      };
    
      // Component UI remains the same
    }
    ``` 
    
    **Completed `CreateContact.js` with Alloy Integration:**
        
    ```
    // components/CreateContact.js
    import React, { useState } from 'react';
    import axios from 'axios';
    import styles from './css/CreateContact.module.css';
    
    export default function CreateContact({ connectionId }) {
      const [firstName, setFirstName] = useState('');
      const [lastName, setLastName] = useState('');
    
      const handleSubmit = async (event) => {
        event.preventDefault();
        if (connectionId) {
          try {
            const response = await axios.post(`/api/contacts?connectionId=${connectionId}`, { firstName, lastName });
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
    
      // Rest of the component remains the same
     
    }
    ``` 
    
    **Instructions:**
    
    -   In `ContactList.js`, the `fetchContacts` function is implemented to fetch contacts using Axios.
    -   In `CreateContact.js`, the `handleSubmit` function is updated to create a new contact and interact with the API.
    -   Ensure that the connection ID is checked before making API calls.
    

## Conclusion

By following these steps, you will integrate Alloy functionalities into the Next.js application. This project will help you learn how to connect to a CRM system, manage contacts, and understand the integration of front-end and back-end in a Next.js application. By using the APIs and SDKs we used today, Alloy fits into a broad range of tech-stacks beyond the framework used today.
