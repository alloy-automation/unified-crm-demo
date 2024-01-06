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
