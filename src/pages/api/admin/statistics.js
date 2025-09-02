// src/pages/api/admin/statistics.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ detail: 'Authentication required' });
    }

    // Fetch statistics from Django backend
    const response = await fetch(`${backendUrl}/accounts/statistics/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('Statistics fetch error:', error);
    res.status(500).json({ 
      detail: 'Statistics service unavailable. Please try again later.' 
    });
  }
}
