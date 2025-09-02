// src/pages/doctors/[doctorId].js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { API_ENDPOINTS, SPECIALIZATIONS } from '../../config/api';
import { fetchData } from '../../utils/api';

export default function DoctorDetail() {
  const router = useRouter();
  const { doctorId } = router.query;
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (doctorId) {
      fetchDoctorDetail();
    }
  }, [doctorId]);

  const fetchDoctorDetail = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await fetchData(API_ENDPOINTS.DOCTOR_DETAIL(doctorId));
      setDoctor(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSpecializationDisplay = (specialization) => {
    const spec = SPECIALIZATIONS.find(s => s.value === specialization);
    return spec ? spec.label : specialization;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading">Loading doctor details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <div className="message error">{error}</div>
          <Link href="/doctors">
            <button className="btn-primary">Back to Doctors</button>
          </Link>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container">
        <div className="error-container">
          <div className="message error">Doctor not found</div>
          <Link href="/doctors">
            <button className="btn-primary">Back to Doctors</button>
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
          <Link href="/doctors">
            <button className="back-home-btn">Back to Doctors</button>
          </Link>
        </div>
      </section>

      {/* Right Panel */}
      <section className="right-panel">
        <header className="header">
          <h1 className="welcome">
            Doctor <span className="highlight">Profile</span>
          </h1>
        </header>

        <div className="doctor-detail-container">
          <div className="doctor-header">
            <div className="doctor-title">
              <h2>Dr. {doctor.name}</h2>
              <span className={`availability ${doctor.is_available ? 'available' : 'unavailable'}`}>
                {doctor.is_available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <div className="specialization-badge">
              {getSpecializationDisplay(doctor.specialization)}
            </div>
          </div>

          <div className="doctor-info-grid">
            <div className="info-section">
              <h3>Contact Information</h3>
              <div className="info-item">
                <strong>Phone:</strong> 
                <a href={`tel:${doctor.phone_number}`}>{doctor.phone_number}</a>
              </div>
              {doctor.email && (
                <div className="info-item">
                  <strong>Email:</strong> 
                  <a href={`mailto:${doctor.email}`}>{doctor.email}</a>
                </div>
              )}
              <div className="info-item">
                <strong>Availability:</strong> 
                <span className={doctor.is_available ? 'text-success' : 'text-danger'}>
                  {doctor.is_available ? 'Currently Available' : 'Currently Unavailable'}
                </span>
              </div>
            </div>

            <div className="info-section">
              <h3>Professional Information</h3>
              <div className="info-item">
                <strong>Specialization:</strong> {getSpecializationDisplay(doctor.specialization)}
              </div>
              <div className="info-item">
                <strong>Qualification:</strong> {doctor.qualification}
              </div>
              <div className="info-item">
                <strong>Experience:</strong> {doctor.experience_years} years
              </div>
              <div className="info-item">
                <strong>Registered:</strong> {new Date(doctor.created_at).toLocaleDateString()}
              </div>
            </div>

            {doctor.hospital && (
              <div className="info-section">
                <h3>Hospital Information</h3>
                <div className="info-item">
                  <strong>Hospital:</strong> {doctor.hospital.name}
                </div>
                <div className="info-item">
                  <strong>Address:</strong> {doctor.hospital.address}
                </div>
                <div className="info-item">
                  <strong>Hospital Phone:</strong> 
                  <a href={`tel:${doctor.hospital.phone_number}`}>{doctor.hospital.phone_number}</a>
                </div>
                {doctor.hospital.emergency_contact && (
                  <div className="info-item emergency">
                    <strong>Emergency Contact:</strong> 
                    <a href={`tel:${doctor.hospital.emergency_contact}`}>{doctor.hospital.emergency_contact}</a>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="actions-section">
            <h3>Contact Doctor</h3>
            <div className="action-buttons">
              <a href={`tel:${doctor.phone_number}`} className="btn-primary">
                📞 Call Doctor
              </a>
              {doctor.email && (
                <a href={`mailto:${doctor.email}`} className="btn-secondary">
                  ✉️ Send Email
                </a>
              )}
              {doctor.hospital && (
                <Link href={`/hospitals/${doctor.hospital.id}`}>
                  <button className="btn-tertiary">View Hospital</button>
                </Link>
              )}
              <Link href="/instant-book">
                <button className="btn-quaternary">Book Ambulance</button>
              </Link>
            </div>
          </div>

          {/* Availability Notice */}
          {!doctor.is_available && (
            <div className="availability-notice">
              <h3>Doctor Currently Unavailable</h3>
              <p>
                Dr. {doctor.name} is currently not available for consultations. 
                Please contact the hospital directly for alternative arrangements or emergency care.
              </p>
              {doctor.hospital && doctor.hospital.emergency_contact && (
                <a 
                  href={`tel:${doctor.hospital.emergency_contact}`} 
                  className="emergency-call-btn"
                >
                  📞 Call Hospital Emergency: {doctor.hospital.emergency_contact}
                </a>
              )}
            </div>
          )}

          {/* Doctor Stats */}
          <div className="stats-section">
            <h3>Quick Info</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{doctor.experience_years}</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{getSpecializationDisplay(doctor.specialization)}</div>
                <div className="stat-label">Specialization</div>
              </div>
              <div className="stat-item">
                <div className={`stat-value ${doctor.is_available ? 'available' : 'unavailable'}`}>
                  {doctor.is_available ? 'Available' : 'Unavailable'}
                </div>
                <div className="stat-label">Current Status</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .doctor-detail-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .doctor-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #eee;
        }

        .doctor-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .doctor-title h2 {
          margin: 0;
          color: #333;
          font-size: 2rem;
        }

        .availability {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .availability.available {
          background: #e8f5e8;
          color: #4CAF50;
        }

        .availability.unavailable {
          background: #ffeaea;
          color: #f44336;
        }

        .specialization-badge {
          background: #2196F3;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 500;
          display: inline-block;
        }

        .doctor-info-grid {
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
        .btn-tertiary,
        .btn-quaternary {
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

        .btn-quaternary {
          background: #9c27b0;
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

        .btn-quaternary:hover {
          background: #7b1fa2;
        }

        .availability-notice {
          background: #ffeaea;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #f44336;
          margin-bottom: 2rem;
        }

        .availability-notice h3 {
          margin: 0 0 1rem 0;
          color: #c62828;
        }

        .availability-notice p {
          margin: 0 0 1rem 0;
          color: #c62828;
        }

        .emergency-call-btn {
          display: inline-block;
          background: #dc3545;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
        }

        .emergency-call-btn:hover {
          background: #c82333;
        }

        .stats-section {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stats-section h3 {
          margin: 0 0 1rem 0;
          color: #333;
          text-align: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .stat-value.available {
          color: #4CAF50;
        }

        .stat-value.unavailable {
          color: #f44336;
        }

        .stat-label {
          color: #666;
          font-size: 0.9rem;
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
