// src/pages/api/admin/users/[id].js
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
      case 'GET':
        // Get specific user details
        const getResponse = await fetch(`${backendUrl}/accounts/users/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        const getData = await getResponse.json();
        res.status(getResponse.status).json(getData);
        break;

      case 'PUT':
        // Update user
        const putResponse = await fetch(`${backendUrl}/accounts/users/${id}/`, {
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
        // Delete user
        const deleteResponse = await fetch(`${backendUrl}/accounts/users/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        res.status(deleteResponse.status).json({ 
          message: deleteResponse.ok ? 'User deleted successfully' : 'Failed to delete user' 
        });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).json({ message: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Admin user API error:', error);
    res.status(500).json({ 
      detail: 'User management service unavailable. Please try again later.' 
    });
  }
}
