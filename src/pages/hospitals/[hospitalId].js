// src/pages/hospitals/[hospitalId].js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { API_ENDPOINTS } from '../../config/api';
import { fetchData } from '../../utils/api';

export default function HospitalDetail() {
  const router = useRouter();
  const { hospitalId } = router.query;
  
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hospitalId) {
      fetchHospitalDetail();
    }
  }, [hospitalId]);

  const fetchHospitalDetail = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await fetchData(API_ENDPOINTS.HOSPITAL_DETAIL(hospitalId));
      setHospital(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading">Loading hospital details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <div className="message error">{error}</div>
          <Link href="/hospitals">
            <button className="btn-primary">Back to Hospitals</button>
          </Link>
        </div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="container">
        <div className="error-container">
          <div className="message error">Hospital not found</div>
          <Link href="/hospitals">
            <button className="btn-primary">Back to Hospitals</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Left Panel */}
      <section className="left-panel">
        <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="logo" />
        <p className="tagline">Your need, Our priority, Ready to Response, Anytime Anywhere</p>
        <button className="primary-btn">
          <img src="/assets/call-icon.png" alt="Call Icon" className="icon" />
          Call Now
        </button>
        <div className="back-to-home">
          <Link href="/hospitals">
            <button className="back-home-btn">Back to Hospitals</button>
          </Link>
        </div>
      </section>

      {/* Right Panel */}
      <section className="right-panel">
        <header className="header">
          <h1 className="welcome">
            Hospital <span className="highlight">Details</span>
          </h1>
        </header>

        <div className="hospital-detail-container">
          <div className="hospital-header">
            <div className="hospital-title">
              <h2>{hospital.name}</h2>
              <span className={`status ${hospital.is_active ? 'active' : 'inactive'}`}>
                {hospital.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="hospital-info-grid">
            <div className="info-section">
              <h3>Contact Information</h3>
              <div className="info-item">
                <strong>Phone:</strong> 
                <a href={`tel:${hospital.phone_number}`}>{hospital.phone_number}</a>
              </div>
              {hospital.emergency_contact && (
                <div className="info-item emergency">
                  <strong>Emergency Contact:</strong> 
                  <a href={`tel:${hospital.emergency_contact}`}>{hospital.emergency_contact}</a>
                </div>
              )}
              {hospital.email && (
                <div className="info-item">
                  <strong>Email:</strong> 
                  <a href={`mailto:${hospital.email}`}>{hospital.email}</a>
                </div>
              )}
              {hospital.website && (
                <div className="info-item">
                  <strong>Website:</strong> 
                  <a href={hospital.website} target="_blank" rel="noopener noreferrer">
                    {hospital.website}
                  </a>
                </div>
              )}
            </div>

            <div className="info-section">
              <h3>Location</h3>
              <div className="info-item">
                <strong>Address:</strong> {hospital.address}
              </div>
              <div className="info-item">
                <strong>District:</strong> {hospital.district?.name || 'N/A'}
              </div>
              {hospital.latitude && hospital.longitude && (
                <div className="info-item">
                  <strong>Coordinates:</strong> {hospital.latitude}, {hospital.longitude}
                </div>
              )}
            </div>

            <div className="info-section">
              <h3>Hospital Information</h3>
              <div className="info-item">
                <strong>Status:</strong> 
                <span className={hospital.is_active ? 'text-success' : 'text-danger'}>
                  {hospital.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="info-item">
                <strong>Created:</strong> {new Date(hospital.created_at).toLocaleDateString()}
              </div>
              <div className="info-item">
                <strong>Last Updated:</strong> {new Date(hospital.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="actions-section">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <Link href={`/hospitals/${hospital.id}/doctors`}>
                <button className="btn-primary">View Doctors</button>
              </Link>
              <Link href="/instant-book">
                <button className="btn-secondary">Book Ambulance</button>
              </Link>
              {hospital.latitude && hospital.longitude && (
                <button 
                  className="btn-tertiary"
                  onClick={() => {
                    const url = `https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`;
                    window.open(url, '_blank');
                  }}
                >
                  View on Map
                </button>
              )}
            </div>
          </div>

          {/* Emergency Contact Section */}
          {hospital.emergency_contact && (
            <div className="emergency-section">
              <h3>Emergency Contact</h3>
              <div className="emergency-info">
                <p>For immediate medical assistance, call:</p>
                <a 
                  href={`tel:${hospital.emergency_contact}`} 
                  className="emergency-call-btn"
                >
                  📞 {hospital.emergency_contact}
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .hospital-detail-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .hospital-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #eee;
        }

        .hospital-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .hospital-title h2 {
          margin: 0;
          color: #333;
          font-size: 2rem;
        }

        .status {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .status.active {
          background: #e8f5e8;
          color: #4CAF50;
        }

        .status.inactive {
          background: #ffeaea;
          color: #f44336;
        }

        .hospital-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .info-section {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .info-section h3 {
          margin: 0 0 1rem 0;
          color: #4CAF50;
          font-size: 1.2rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.5rem;
        }

        .info-item {
          margin: 1rem 0;
          padding: 0.5rem 0;
        }

        .info-item strong {
          color: #333;
          margin-right: 0.5rem;
        }

        .info-item a {
          color: #2196F3;
          text-decoration: none;
        }

        .info-item a:hover {
          text-decoration: underline;
        }

        .info-item.emergency {
          background: #fff3cd;
          padding: 1rem;
          border-radius: 4px;
          border-left: 4px solid #ffc107;
        }

        .text-success {
          color: #4CAF50;
        }

        .text-danger {
          color: #f44336;
        }

        .actions-section {
          background: #f9f9f9;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .actions-section h3 {
          margin: 0 0 1rem 0;
          color: #333;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-primary,
        .btn-secondary,
        .btn-tertiary {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          text-align: center;
          font-weight: 500;
        }

        .btn-primary {
          background: #4CAF50;
          color: white;
        }

        .btn-secondary {
          background: #2196F3;
          color: white;
        }

        .btn-tertiary {
          background: #ff9800;
          color: white;
        }

        .btn-primary:hover {
          background: #45a049;
        }

        .btn-secondary:hover {
          background: #1976D2;
        }

        .btn-tertiary:hover {
          background: #f57c00;
        }

        .emergency-section {
          background: #fff3cd;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #ffc107;
        }

        .emergency-section h3 {
          margin: 0 0 1rem 0;
          color: #856404;
        }

        .emergency-info p {
          margin: 0 0 1rem 0;
          color: #856404;
        }

        .emergency-call-btn {
          display: inline-block;
          background: #dc3545;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          font-size: 1.1rem;
        }

        .emergency-call-btn:hover {
          background: #c82333;
        }

        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
        }

        .loading {
          color: #666;
          font-size: 1.1rem;
        }

        .message.error {
          background: #ffeaea;
          color: #f44336;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
