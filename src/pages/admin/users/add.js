// src/pages/admin/users/add.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AddUser() {
  const [formData, setFormData] = useState({
    phone_number: '',
    full_name: '',
    email: '',
    user_type: 'user',
    password: '',
    confirm_password: '',
    district: '',
    address: '',
    date_of_birth: '',
    nid_number: '',
    driving_license_number: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const districts = [
    'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet',
    'Rangpur', 'Mymensingh', 'Comilla', 'Gazipur', 'Narayanganj'
  ];

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
    } catch (error) {
      console.error('Error parsing admin data:', error);
      router.replace('/admin/login');
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.user_type === 'driver' && !formData.driving_license_number) {
      setError('Driving license number is required for drivers');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      
      const endpoint = formData.user_type === 'driver' 
        ? `${apiBaseUrl}/accounts/admin/create-driver/`
        : `${apiBaseUrl}/accounts/admin/create-user/`;

      const submitData = {
        phone_number: formData.phone_number,
        password: formData.password,
        full_name: formData.full_name,
        email: formData.email || undefined,
        district: formData.district,
        address: formData.address || undefined,
        date_of_birth: formData.date_of_birth || undefined,
        nid_number: formData.nid_number || undefined,
        emergency_contact_name: formData.emergency_contact_name || undefined,
        emergency_contact_phone: formData.emergency_contact_phone || undefined
      };

      // Add driver-specific fields
      if (formData.user_type === 'driver') {
        submitData.driving_license_number = formData.driving_license_number;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`${formData.user_type.charAt(0).toUpperCase() + formData.user_type.slice(1)} added successfully!`);
        setFormData({
          phone_number: '',
          full_name: '',
          email: '',
          user_type: 'user',
          password: '',
          confirm_password: '',
          district: '',
          address: '',
          date_of_birth: '',
          nid_number: '',
          driving_license_number: '',
          emergency_contact_name: '',
          emergency_contact_phone: ''
        });
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      } else {
        setError(data.detail || data.error || `Failed to add ${formData.user_type}`);
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
    <div className="add-user-container">
      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <Link href="/admin/dashboard" className="back-btn">← Back to Dashboard</Link>
          <h1>👤 Add New {formData.user_type === 'driver' ? 'Driver' : 'User'}</h1>
          <div className="admin-info">
            <span>Admin: {admin?.full_name}</span>
          </div>
        </div>
      </header>

      {/* Form Section */}
      <div className="form-container">
        <div className="form-card">
          <div className="form-header">
            <h2>User Information</h2>
            <p>Fill in the details to add a new user to the system</p>
          </div>

          <form onSubmit={handleSubmit} className="user-form">
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

            {/* User Type Selection */}
            <div className="form-group user-type-section">
              <label>👥 User Type *</label>
              <div className="user-type-tabs">
                <button
                  type="button"
                  className={formData.user_type === 'user' ? 'active' : ''}
                  onClick={() => setFormData({...formData, user_type: 'user'})}
                >
                  👤 Regular User
                </button>
                <button
                  type="button"
                  className={formData.user_type === 'driver' ? 'active' : ''}
                  onClick={() => setFormData({...formData, user_type: 'driver'})}
                >
                  🚗 Driver
                </button>
              </div>
            </div>

            {/* Basic Information */}
            <div className="form-row">
              <div className="form-group">
                <label>📱 Phone Number *</label>
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
                <label>👤 Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>🔒 Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="At least 6 characters"
                />
              </div>

              <div className="form-group">
                <label>🔒 Confirm Password *</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                  placeholder="Re-enter password"
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
                  placeholder="user@example.com"
                />
              </div>

              <div className="form-group">
                <label>🏘️ District *</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>🏠 Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address..."
                rows="2"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>📅 Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>🆔 NID Number</label>
                <input
                  type="text"
                  name="nid_number"
                  value={formData.nid_number}
                  onChange={handleChange}
                  placeholder="National ID Number"
                />
              </div>
            </div>

            {/* Driver-specific fields */}
            {formData.user_type === 'driver' && (
              <div className="driver-section">
                <h3>🚗 Driver Information</h3>
                <div className="form-group">
                  <label>🪪 Driving License Number *</label>
                  <input
                    type="text"
                    name="driving_license_number"
                    value={formData.driving_license_number}
                    onChange={handleChange}
                    required={formData.user_type === 'driver'}
                    placeholder="DL123456789"
                  />
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            <div className="emergency-section">
              <h3>🚨 Emergency Contact</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>👤 Emergency Contact Name</label>
                  <input
                    type="text"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleChange}
                    placeholder="Emergency contact name"
                  />
                </div>

                <div className="form-group">
                  <label>📞 Emergency Contact Phone</label>
                  <input
                    type="tel"
                    name="emergency_contact_phone"
                    value={formData.emergency_contact_phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <Link href="/admin/dashboard" className="cancel-btn">
                ❌ Cancel
              </Link>
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? `⏳ Adding ${formData.user_type}...` : `✅ Add ${formData.user_type.charAt(0).toUpperCase() + formData.user_type.slice(1)}`}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .add-user-container {
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
          max-width: 900px;
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

        .user-form {
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

        .user-type-section {
          margin-bottom: 2rem;
        }

        .user-type-tabs {
          display: flex;
          gap: 1rem;
        }

        .user-type-tabs button {
          flex: 1;
          padding: 1rem;
          border: 2px solid #e9ecef;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          font-size: 1rem;
        }

        .user-type-tabs button.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: transparent;
        }

        .user-type-tabs button:hover:not(.active) {
          background: #f8f9fa;
          border-color: #667eea;
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

        .driver-section,
        .emergency-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e9ecef;
        }

        .driver-section h3,
        .emergency-section h3 {
          margin: 0 0 1rem 0;
          color: #2c3e50;
          font-size: 1.3rem;
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

          .user-type-tabs {
            flex-direction: column;
          }

          .form-actions {
            flex-direction: column;
          }

          .user-form,
          .form-header {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
