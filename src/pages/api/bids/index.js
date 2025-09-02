// src/pages/api/bids/index.js
export default async function handler(req, res) {
  const { method } = req;
  const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
  
  try {
    switch (method) {
      case 'GET':
        // Get all bids for a booking
        const { booking_id } = req.query;
        const getResponse = await fetch(`${backendUrl}/api/bookings/${booking_id}/bids/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const getData = await getResponse.json();
        res.status(getResponse.status).json(getData);
        break;

      case 'POST':
        // Create new bid
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
          return res.status(401).json({ detail: 'Authentication required' });
        }

        const postResponse = await fetch(`${backendUrl}/api/bookings/bids/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(req.body),
        });
        
        const postData = await postResponse.json();
        res.status(postResponse.status).json(postData);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ message: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Bidding API error:', error);
    res.status(500).json({ 
      detail: 'Bidding service unavailable. Please try again later.' 
    });
  }
}
