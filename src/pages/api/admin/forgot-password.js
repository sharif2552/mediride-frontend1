// src/pages/api/admin/forgot-password.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    const { email } = req.body;

    // Call Django password reset endpoint
    const response = await fetch(`${backendUrl}/accounts/password-reset/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ 
        message: 'Password reset instructions sent successfully' 
      });
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ 
      detail: 'Password reset service unavailable. Please try again later.' 
    });
  }
}
