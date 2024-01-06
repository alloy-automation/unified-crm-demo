import axios from 'axios';

const YOUR_API_KEY = process.env.ALLOY_API_KEY;

export default async function handler(req, res) {
  const { method } = req;
  const connectionId = req.query.connectionId;

  if (!connectionId) {
    return res.status(400).json({ error: 'ConnectionId is required' });
  }

  switch (method) {
    case 'GET':
      try {
        const response = await axios.get(`https://embedded.runalloy.com/2023-12/one/crm/contacts?connectionId=${connectionId}`, {
          headers: {
            'Authorization': `bearer ${YOUR_API_KEY}`,
            'accept': 'application/json'
          }
        });
        res.json(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Error fetching contacts' });
      }
      break;

    case 'POST':
      try {
        const response = await axios.post(`https://embedded.runalloy.com/2023-12/one/crm/contacts?connectionId=${connectionId}`, req.body, {
          headers: {
            'Authorization': `bearer ${YOUR_API_KEY}`,
            'accept': 'application/json',
            'content-type': 'application/json'
          }
        });
        res.json(response.data);
      } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ error: 'Error creating contact' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}