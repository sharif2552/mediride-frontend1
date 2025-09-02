// src/pages/api/admin/hospitals.js
export default async function handler(req, res) {
  const { method } = req;
  const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ detail: 'Authentication required' });
  }

  try {
    switch (method) {
      case 'GET':
        // Get all hospitals for admin
        const getResponse = await fetch(`${backendUrl}/hospitals/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        const getData = await getResponse.json();
        res.status(getResponse.status).json(getData);
        break;

      case 'POST':
        // Create new hospital
        const postResponse = await fetch(`${backendUrl}/hospitals/hospitals/`, {
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

      case 'PUT':
        // Update hospital
        const { id, ...updateData } = req.body;
        const putResponse = await fetch(`${backendUrl}/hospitals/${id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        });
        
        const putData = await putResponse.json();
        res.status(putResponse.status).json(putData);
        break;

      case 'DELETE':
        // Delete hospital
        const { hospitalId } = req.query;
        const deleteResponse = await fetch(`${backendUrl}/hospitals/${hospitalId}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        res.status(deleteResponse.status).json({ 
          message: deleteResponse.ok ? 'Hospital deleted successfully' : 'Failed to delete hospital' 
        });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ message: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Admin hospitals API error:', error);
    res.status(500).json({ 
      detail: 'Hospital management service unavailable. Please try again later.' 
    });
  }
}
