// src/pages/api/admin/approve-bid.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ detail: 'Authentication required' });
  }

  try {
    const { bid_id, booking_id } = req.body;

    // Approve bid and finalize booking
    const response = await fetch(`${backendUrl}/api/bookings/bids/${bid_id}/approve/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ booking_id }),
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('Bid approval error:', error);
    res.status(500).json({ 
      detail: 'Bid approval service unavailable. Please try again later.' 
    });
  }
}
