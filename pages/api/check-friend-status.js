import axios from 'axios';

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const response = await axios.get('https://api.line.me/v2/bot/friendship/status', {
      headers: {
        'Authorization': `Bearer ${process.env.LIFF_CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      params: {
        userId: userId
      }
    });

    return res.status(200).json({ friendFlag: response.data.friendFlag });
  } catch (error) {
    console.error('Error checking friendship status:', error.response ? error.response.data : error.message);
    return res.status(500).json({ error: 'Failed to check friend status' });
  }
}