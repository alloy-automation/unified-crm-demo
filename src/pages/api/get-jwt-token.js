import axios from 'axios';
import os from 'os';
// read the API key from the ALLOY_API_KEY environment variable
const YOUR_API_KEY = process.env.ALLOY_API_KEY;
const userId = process.env.ALLOY_USER_ID;

export default async function handler(req, res) {
  // Replace with your actual Alloy API key and user ID
  

  try {
    const response = await axios.get(`https://embedded.runalloy.com/2023-12/users/${userId}/token`, {
      headers: {
        'Authorization': `Bearer ${YOUR_API_KEY}`,
        'accept': 'application/json'
      }
    });
    res.status(200).json({ token: response.data.token });
  } catch (error) {
    console.error('Error generating JWT token:', error);
    res.status(500).json({ error: 'Error generating JWT token' });
  }
}
