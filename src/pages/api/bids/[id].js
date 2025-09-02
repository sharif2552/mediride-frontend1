// src/pages/api/bids/[id].js
export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;
  const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ detail: 'Authentication required' });
  }

  try {
    switch (method) {
      case 'PUT':
        // Update bid
        const putResponse = await fetch(`${backendUrl}/api/bookings/bids/${id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(req.body),
        });
        
        const putData = await putResponse.json();
        res.status(putResponse.status).json(putData);
        break;

      case 'DELETE':
        // Cancel bid
        const deleteResponse = await fetch(`${backendUrl}/api/bookings/bids/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        res.status(deleteResponse.status).json({ 
          message: deleteResponse.ok ? 'Bid cancelled successfully' : 'Failed to cancel bid' 
        });
        break;

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).json({ message: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Bid management API error:', error);
    res.status(500).json({ 
      detail: 'Bid management service unavailable. Please try again later.' 
    });
  }
}
