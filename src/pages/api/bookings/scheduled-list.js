// Next.js API route for fetching scheduled bookings
// This proxies requests to the Django backend

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Replace with your actual Django backend URL
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    
    // Fetch all bookings and filter for scheduled ones on the frontend
    // since the backend booking_list view returns all bookings
    const response = await fetch(`${backendUrl}/api/bookings/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      // Filter for scheduled bookings (where is_instant = false)
      const scheduledBookings = data.filter(booking => !booking.is_instant);
      res.status(200).json(scheduledBookings);
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
