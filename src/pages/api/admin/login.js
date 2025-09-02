// src/pages/api/admin/login.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    const { phone_number, password } = req.body;

    // Call Django admin login endpoint
    const response = await fetch(`${backendUrl}/accounts/login/admin/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Check if user is staff/admin
      if (data.user && (data.user.is_staff || data.user.is_superuser)) {
        res.status(200).json(data);
      } else {
        res.status(403).json({ 
          detail: 'Access denied. Admin privileges required.' 
        });
      }
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      detail: 'Login service unavailable. Please try again later.' 
    });
  }
}
