// src/pages/hospitals/[hospitalId]/doctors.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { API_ENDPOINTS, SPECIALIZATIONS } from '../../../config/api';
import { fetchData, buildQueryString } from '../../../utils/api';

export default function HospitalDoctors() {
  const router = useRouter();
  const { hospitalId } = router.query;
  
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hospitalLoading, setHospitalLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    specialization: '',
    available: 'true',
    page: 1,
    page_size: 10,
  });

  useEffect(() => {
    if (hospitalId) {
      fetchHospitalDetail();
      fetchHospitalDoctors();
    }
  }, [hospitalId, filters]);

  const fetchHospitalDetail = async () => {
    setHospitalLoading(true);
    try {
      const data = await fetchData(API_ENDPOINTS.HOSPITAL_DETAIL(hospitalId));
      setHospital(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setHospitalLoading(false);
    }
  };

  const fetchHospitalDoctors = async () => {
    setLoading(true);
    setError('');
    
    try {
      const queryString = buildQueryString(filters);
      const data = await fetchData(API_ENDPOINTS.HOSPITAL_DOCTORS(hospitalId) + queryString);
      setDoctors(data.results || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const getSpecializationDisplay = (specialization) => {
    const spec = SPECIALIZATIONS.find(s => s.value === specialization);
    return spec ? spec.label : specialization;
  };

  const DoctorCard = ({ doctor }) => (
    <div className="doctor-card">
      <div className="doctor-header">
        <h3>Dr. {doctor.name}</h3>
        <span className={`availability ${doctor.is_available ? 'available' : 'unavailable'}`}>
          {doctor.is_available ? 'Available' : 'Unavailable'}
        </span>
      </div>
      
      <div className="doctor-details">
        <p><strong>Specialization:</strong> {getSpecializationDisplay(doctor.specialization)}</p>
        <p><strong>Qualification:</strong> {doctor.qualification}</p>
        <p><strong>Experience:</strong> {doctor.experience_years} years</p>
        <p><strong>Phone:</strong> {doctor.phone_number}</p>
        {doctor.email && <p><strong>Email:</strong> {doctor.email}</p>}
      </div>
      
      <div className="doctor-actions">
        <Link href={`/doctors/${doctor.id}`}>
          <button className="btn-primary">View Profile</button>
        </Link>
        <a href={`tel:${doctor.phone_number}`} className="btn-secondary">
          Call Doctor
        </a>
        {doctor.email && (
          <a href={`mailto:${doctor.email}`} className="btn-tertiary">
            Email
          </a>
        )}
      </div>
    </div>
  );

  if (hospitalLoading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading">Loading hospital information...</div>
        </div>
      </div>
    );
  }

  if (error && !hospital) {
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
          <Link href={`/hospitals/${hospitalId}`}>
            <button className="back-home-btn">Back to Hospital</button>
          </Link>
        </div>
      </section>

      {/* Right Panel */}
      <section className="right-panel">
        <header className="header">
          <h1 className="welcome">
            Hospital <span className="highlight">Doctors</span>
          </h1>
        </header>

        {/* Hospital Info Header */}
        {hospital && (
          <div className="hospital-info-header">
            <div className="hospital-basic-info">
              <h2>{hospital.name}</h2>
              <p><strong>Address:</strong> {hospital.address}</p>
              <p><strong>Phone:</strong> {hospital.phone_number}</p>
              {hospital.emergency_contact && (
                <p><strong>Emergency:</strong> 
                  <a href={`tel:${hospital.emergency_contact}`} className="emergency-link">
                    {hospital.emergency_contact}
                  </a>
                </p>
              )}
            </div>
            <div className="hospital-actions">
              <Link href={`/hospitals/${hospital.id}`}>
                <button className="btn-primary">Hospital Details</button>
              </Link>
              <Link href="/instant-book">
                <button className="btn-secondary">Book Ambulance</button>
              </Link>
            </div>
          </div>
        )}

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="filters-section">
          <h3>Filter Doctors</h3>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Specialization:</label>
              <select name="specialization" value={filters.specialization} onChange={handleFilterChange}>
                <option value="">All Specializations</option>
                {SPECIALIZATIONS.map(spec => (
                  <option key={spec.value} value={spec.value}>
                    {spec.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Availability:</label>
              <select name="available" value={filters.available} onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Page Size:</label>
              <select name="page_size" value={filters.page_size} onChange={handleFilterChange}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Specialization Filters */}
        <div className="quick-filters">
          <h4>Quick Filters by Specialization:</h4>
          <div className="quick-filter-buttons">
            <button
              className={`quick-filter-btn ${filters.specialization === '' ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, specialization: '', page: 1 }))}
            >
              All
            </button>
            {SPECIALIZATIONS.map(spec => (
              <button
                key={spec.value}
                className={`quick-filter-btn ${filters.specialization === spec.value ? 'active' : ''}`}
                onClick={() => setFilters(prev => ({ ...prev, specialization: spec.value, page: 1 }))}
              >
                {spec.label}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor List */}
        {loading ? (
          <div className="loading">Loading doctors...</div>
        ) : (
          <div className="doctors-section">
            <div className="doctors-header">
              <h3>
                Doctors at {hospital?.name} 
                {filters.specialization && ` - ${getSpecializationDisplay(filters.specialization)}`}
                ({doctors.length} found)
              </h3>
            </div>
            
            <div className="doctors-grid">
              {doctors.length === 0 ? (
                <div className="no-results">
                  <p>No doctors found matching your criteria.</p>
                  <div className="no-results-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => setFilters({ specialization: '', available: '', page: 1, page_size: 10 })}
                    >
                      Clear Filters
                    </button>
                    <Link href="/doctors">
                      <button className="btn-secondary">Browse All Doctors</button>
                    </Link>
                  </div>
                </div>
              ) : (
                doctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))
              )}
            </div>
          </div>
        )}

        {/* Emergency Contact Section */}
        {hospital?.emergency_contact && (
          <div className="emergency-section">
            <h3>Emergency Contact</h3>
            <div className="emergency-info">
              <p>For immediate medical assistance at {hospital.name}, call:</p>
              <a 
                href={`tel:${hospital.emergency_contact}`} 
                className="emergency-call-btn"
              >
                📞 {hospital.emergency_contact}
              </a>
            </div>
          </div>
        )}
      </section>

      <style jsx>{`
        .hospital-info-header {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 2rem;
          align-items: center;
        }

        .hospital-basic-info h2 {
          margin: 0 0 1rem 0;
          color: #4CAF50;
        }

        .hospital-basic-info p {
          margin: 0.5rem 0;
          color: #666;
        }

        .emergency-link {
          color: #dc3545;
          text-decoration: none;
          font-weight: bold;
        }

        .emergency-link:hover {
          text-decoration: underline;
        }

        .hospital-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filters-section {
          background: #f9f9f9;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-group label {
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .filter-group select {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .quick-filters {
          margin-bottom: 2rem;
        }

        .quick-filters h4 {
          margin-bottom: 1rem;
          color: #333;
        }

        .quick-filter-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .quick-filter-btn {
          padding: 6px 12px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .quick-filter-btn:hover {
          background: #f0f0f0;
        }

        .quick-filter-btn.active {
          background: #4CAF50;
          color: white;
          border-color: #4CAF50;
        }

        .doctors-section {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .doctors-header h3 {
          margin: 0 0 1.5rem 0;
          color: #333;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.5rem;
        }

        .doctors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .doctor-card {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 1.5rem;
          border: 1px solid #eee;
        }

        .doctor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #ddd;
        }

        .doctor-header h3 {
          margin: 0;
          color: #333;
        }

        .availability {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
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

        .doctor-details p {
          margin: 0.5rem 0;
          color: #666;
        }

        .doctor-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #ddd;
          flex-wrap: wrap;
        }

        .btn-primary,
        .btn-secondary,
        .btn-tertiary {
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          text-align: center;
          font-size: 0.85rem;
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

        .no-results {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .no-results-actions {
          margin-top: 1rem;
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .emergency-section {
          background: #fff3cd;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #ffc107;
          margin-top: 2rem;
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

        .loading,
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
