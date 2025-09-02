// src/pages/api/hospitals/[hospitalId].js
export default async function handler(req, res) {
  const { method, query } = req;
  const { hospitalId } = query;
  
  if (method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    const url = `${backendUrl}/hospitals/${hospitalId}/`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('Backend connection error:', error);
    res.status(500).json({ 
      detail: 'Unable to connect to hospital service. Please try again later.' 
    });
  }
}
