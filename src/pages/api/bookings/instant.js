// Next.js API route for instant bookings
// This proxies requests to the Django backend

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Replace with your actual Django backend URL
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/api/bookings/instant/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (response.ok) {
      res.status(201).json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('Backend connection error:', error);
    res.status(500).json({ 
      detail: 'Unable to connect to booking service. Please try again later.' 
    });
  }
}
