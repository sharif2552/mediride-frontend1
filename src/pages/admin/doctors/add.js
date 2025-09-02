// src/pages/admin/doctors/add.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AddDoctor() {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    hospital_id: '',
    phone_number: '',
    email: '',
    qualification: '',
    experience_years: ''
  });
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const specializationChoices = [
    { value: 'emergency', label: 'Emergency Medicine' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'general', label: 'General Medicine' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'other', label: 'Other' }
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
      fetchHospitals();
    } catch (error) {
      console.error('Error parsing admin data:', error);
      router.replace('/admin/login');
    }
  }, [router]);

  const fetchHospitals = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiBaseUrl}/hospitals/`);
      
      if (response.ok) {
        const data = await response.json();
        setHospitals(data.results || data);
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      // Demo hospitals
      setHospitals([
        { id: 1, name: 'Dhaka Medical College Hospital' },
        { id: 2, name: 'United Hospital' },
        { id: 3, name: 'Square Hospital' },
        { id: 4, name: 'Apollo Hospital' },
        { id: 5, name: 'Labaid Hospital' }
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
      
      const response = await fetch(`${apiBaseUrl}/hospitals/doctors/create/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          hospital_id: parseInt(formData.hospital_id),
          experience_years: parseInt(formData.experience_years)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Doctor added successfully!');
        setFormData({
          name: '',
          specialization: '',
          hospital_id: '',
          phone_number: '',
          email: '',
          qualification: '',
          experience_years: ''
        });
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      } else {
        setError(data.detail || data.error || 'Failed to add doctor');
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
    <div className="add-doctor-container">
      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <Link href="/admin/dashboard" className="back-btn">← Back to Dashboard</Link>
          <h1>👩‍⚕️ Add New Doctor</h1>
          <div className="admin-info">
            <span>Admin: {admin?.full_name}</span>
          </div>
        </div>
      </header>

      {/* Form Section */}
      <div className="form-container">
        <div className="form-card">
          <div className="form-header">
            <h2>Doctor Information</h2>
            <p>Fill in the details to add a new doctor to the system</p>
          </div>

          <form onSubmit={handleSubmit} className="doctor-form">
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
                <label>👨‍⚕️ Doctor Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Dr. John Doe"
                />
              </div>

              <div className="form-group">
                <label>🏥 Hospital *</label>
                <select
                  name="hospital_id"
                  value={formData.hospital_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Hospital</option>
                  {hospitals.map(hospital => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>🩺 Specialization *</label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Specialization</option>
                  {specializationChoices.map(choice => (
                    <option key={choice.value} value={choice.value}>
                      {choice.label}
                    </option>
                  ))}
                </select>
              </div>

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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>📧 Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="doctor@hospital.com"
                />
              </div>

              <div className="form-group">
                <label>⏰ Experience (Years) *</label>
                <input
                  type="number"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleChange}
                  required
                  min="0"
                  max="50"
                  placeholder="5"
                />
              </div>
            </div>

            <div className="form-group">
              <label>🎓 Qualifications *</label>
              <textarea
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
                placeholder="MBBS, MD, Specialized certifications..."
                rows="3"
              />
            </div>

            <div className="form-actions">
              <Link href="/admin/dashboard" className="cancel-btn">
                ❌ Cancel
              </Link>
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? '⏳ Adding Doctor...' : '✅ Add Doctor'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .add-doctor-container {
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

        .doctor-form {
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

          .doctor-form,
          .form-header {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
