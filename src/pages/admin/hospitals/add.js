// src/pages/admin/hospitals/add.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AddHospital() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    district_id: '',
    phone_number: '',
    email: '',
    website: '',
    emergency_contact: '',
    latitude: '',
    longitude: ''
  });
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('adminUser');
    const token = localStorage.getItem('adminToken');

    if (!adminData || !token) {
      router.replace('/admin/login');
      return;
    }

    try {
      const parsedAdmin = JSON.parse(adminData);
      setAdmin(parsedAdmin);
      fetchDistricts();
    } catch (error) {
      console.error('Error parsing admin data:', error);
      router.replace('/admin/login');
    }
  }, [router]);

  const fetchDistricts = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiBaseUrl}/accounts/districts/`);
      
      if (response.ok) {
        const data = await response.json();
        setDistricts(data);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      // Demo districts
      setDistricts([
        { id: 1, name: 'Dhaka' },
        { id: 2, name: 'Chittagong' },
        { id: 3, name: 'Sylhet' },
        { id: 4, name: 'Rajshahi' },
        { id: 5, name: 'Khulna' }
      ]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      
      const response = await fetch(`${apiBaseUrl}/hospitals/hospitals/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          district_id: parseInt(formData.district_id),
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Hospital added successfully!');
        setFormData({
          name: '',
          address: '',
          district_id: '',
          phone_number: '',
          email: '',
          website: '',
          emergency_contact: '',
          latitude: '',
          longitude: ''
        });
        
        // Redirect to hospitals list after 2 seconds
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      } else {
        setError(data.detail || data.error || 'Failed to add hospital');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!admin) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">🔄</div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="add-hospital-container">
      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <Link href="/admin/dashboard" className="back-btn">← Back to Dashboard</Link>
          <h1>🏥 Add New Hospital</h1>
          <div className="admin-info">
            <span>Admin: {admin?.full_name}</span>
          </div>
        </div>
      </header>

      {/* Form Section */}
      <div className="form-container">
        <div className="form-card">
          <div className="form-header">
            <h2>Hospital Information</h2>
            <p>Fill in the details to add a new hospital to the system</p>
          </div>

          <form onSubmit={handleSubmit} className="hospital-form">
            {error && (
              <div className="error-message">
                <span>⚠️</span>
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <span>✅</span>
                {success}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>🏥 Hospital Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter hospital name"
                />
              </div>

              <div className="form-group">
                <label>🌍 District *</label>
                <select
                  name="district_id"
                  value={formData.district_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>📍 Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter complete address"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>📞 Phone Number *</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                  placeholder="01XXXXXXXXX"
                />
              </div>

              <div className="form-group">
                <label>🚨 Emergency Contact *</label>
                <input
                  type="tel"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  required
                  placeholder="Emergency contact number"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>📧 Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hospital@example.com"
                />
              </div>

              <div className="form-group">
                <label>🌐 Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://hospital-website.com"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>📍 Location Coordinates (Optional)</h3>
              <p className="section-note">For map integration and location services</p>
              
              <div className="form-row">
                <div className="form-group">
                  <label>🗺️ Latitude</label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    step="any"
                    placeholder="23.7104"
                  />
                </div>

                <div className="form-group">
                  <label>🗺️ Longitude</label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    step="any"
                    placeholder="90.3924"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <Link href="/admin/dashboard" className="cancel-btn">
                ❌ Cancel
              </Link>
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? '⏳ Adding Hospital...' : '✅ Add Hospital'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .add-hospital-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 0;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-size: 1.2rem;
          color: #666;
        }

        .loading-spinner {
          font-size: 3rem;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .page-header {
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 1.5rem 2rem;
          margin-bottom: 2rem;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .back-btn {
          background: #6c757d;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: #5a6268;
          transform: translateY(-2px);
        }

        .page-header h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 2rem;
        }

        .admin-info {
          color: #666;
          font-weight: 500;
        }

        .form-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 2rem 2rem;
        }

        .form-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .form-header {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 2rem;
          text-align: center;
        }

        .form-header h2 {
          margin: 0 0 0.5rem 0;
          font-size: 1.8rem;
        }

        .form-header p {
          margin: 0;
          opacity: 0.9;
        }

        .hospital-form {
          padding: 2rem;
        }

        .error-message,
        .success-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .success-message {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 1.5rem;
        }

        .form-group label {
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px 16px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
        }

        .form-section {
          margin: 2rem 0;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 12px;
          border-left: 4px solid #667eea;
        }

        .form-section h3 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
        }

        .section-note {
          margin: 0 0 1rem 0;
          color: #666;
          font-style: italic;
          font-size: 0.9rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e9ecef;
        }

        .cancel-btn,
        .submit-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
        }

        .submit-btn {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .cancel-btn:hover,
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .cancel-btn:hover {
          background: #5a6268;
        }

        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #229954, #28b463);
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .form-container {
            padding: 0 1rem 2rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .hospital-form,
          .form-header {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
