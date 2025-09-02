// src/pages/doctors.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS, SPECIALIZATIONS } from '../config/api';
import { fetchData, buildQueryString } from '../utils/api';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    specialization: '',
    hospital: '',
    available: 'true',
    search: '',
    page: 1,
    page_size: 10,
  });

  useEffect(() => {
    fetchDoctors();
  }, [filters]);

  const fetchDoctors = async () => {
    setLoading(true);
    setError('');
    
    try {
      const queryString = buildQueryString(filters);
      const data = await fetchData(API_ENDPOINTS.DOCTORS + queryString);
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

  const DoctorCard = ({ doctor }) => (
    <div className="doctor-card">
      <div className="doctor-header">
        <div className="doctor-info">
          <h3>Dr. {doctor.name}</h3>
          <div className="doctor-specialization">
            {doctor.specialization_display || doctor.specialization}
          </div>
          <div className="doctor-hospital">
            {doctor.hospital?.name || 'Independent Practice'}
          </div>
        </div>
        <span className={`availability ${doctor.is_available ? 'available' : 'unavailable'}`}>
          {doctor.is_available ? 'Available' : 'Unavailable'}
        </span>
      </div>
      
      <div className="doctor-details">
        <p><strong>Qualification:</strong> {doctor.qualification}</p>
        <p><strong>Experience:</strong> {doctor.experience_years} years</p>
        <p><strong>Phone:</strong> {doctor.phone_number}</p>
        {doctor.email && <p><strong>Email:</strong> {doctor.email}</p>}
        
        <div className="rating">
          <div className="stars">★★★★☆</div>
          <span className="rating-text">(4.2/5 - 28 reviews)</span>
        </div>
      </div>
      
      <div className="doctor-actions">
        <Link href={`/doctors/${doctor.id}`} className="btn-primary">
          📋 Book Appointment
        </Link>
        <a href={`tel:${doctor.phone_number}`} className="btn-secondary">
          📞 Call Now
        </a>
        <Link href={`/doctors/${doctor.id}`} className="btn-tertiary">
          👤 View Profile
        </Link>
      </div>
    </div>
  );

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
          <Link href="/">
            <button className="back-home-btn">Back to Home</button>
          </Link>
        </div>
      </section>

      {/* Right Panel */}
      <section className="right-panel">
        <header className="header">
          <h1 className="welcome">
            Doctor <span className="highlight">Directory</span>
          </h1>
        </header>

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="filters-section">
          <h3>Find Doctors</h3>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Search:</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search doctors..."
              />
            </div>
            
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
              <label>Hospital ID:</label>
              <input
                type="number"
                name="hospital"
                value={filters.hospital}
                onChange={handleFilterChange}
                placeholder="Enter hospital ID"
              />
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

        {/* Quick Filters */}
        <div className="quick-filters">
          <h4>Quick Filters:</h4>
          <div className="quick-filter-buttons">
            {SPECIALIZATIONS.slice(0, 6).map(spec => (
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
          <div className="doctors-grid">
            {doctors.length === 0 ? (
              <div className="no-results">
                <p>No doctors found matching your criteria.</p>
                <Link href="/hospitals">
                  <button className="btn-primary">Browse Hospitals</button>
                </Link>
              </div>
            ) : (
              doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))
            )}
          </div>
        )}
      </section>

      <style jsx>{`
        .container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .left-panel {
          width: 300px;
          background: linear-gradient(135deg, #2c3e50, #34495e);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          color: white;
          box-shadow: 2px 0 20px rgba(0,0,0,0.1);
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          z-index: 10;
        }

        .logo {
          width: 120px;
          height: 120px;
          margin-bottom: 2rem;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid rgba(255,255,255,0.2);
        }

        .tagline {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 1.1rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.9);
        }

        .primary-btn {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 50px;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(231,76,60,0.3);
        }

        .primary-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(231,76,60,0.4);
        }

        .icon {
          width: 20px;
          height: 20px;
        }

        .right-panel {
          flex: 1;
          background: white;
          margin: 1rem 1rem 1rem 320px;
          border-radius: 20px;
          overflow-y: auto;
          max-height: calc(100vh - 2rem);
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }

        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          text-align: center;
        }

        .welcome {
          font-size: 2.5rem;
          margin: 0;
          font-weight: 700;
        }

        .highlight {
          color: #ffd700;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .filters-section {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          padding: 2rem;
          margin: 2rem;
          border-radius: 15px;
          border: 1px solid rgba(102,126,234,0.1);
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        .filters-section h3 {
          margin: 0 0 1.5rem 0;
          color: #2c3e50;
          font-size: 1.4rem;
          font-weight: 700;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-group label {
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #495057;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-group input,
        .filter-group select {
          padding: 12px 15px;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .filter-group input:focus,
        .filter-group select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
        }

        .quick-filters {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 2px solid #e9ecef;
        }

        .quick-filters h4 {
          margin-bottom: 1rem;
          color: #2c3e50;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .quick-filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
        }

        .quick-filter-btn {
          padding: 8px 16px;
          background: white;
          border: 2px solid #e9ecef;
          border-radius: 25px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          color: #6c757d;
          transition: all 0.3s ease;
        }

        .quick-filter-btn:hover,
        .quick-filter-btn.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-color: #667eea;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102,126,234,0.3);
        }

        .doctors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 2rem;
          padding: 2rem;
        }

        .doctor-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
          border: 1px solid rgba(102,126,234,0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .doctor-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .doctor-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }

        .doctor-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #f8f9fa;
        }

        .doctor-info {
          flex: 1;
        }

        .doctor-header h3 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
          font-size: 1.3rem;
          font-weight: 700;
          line-height: 1.3;
        }

        .doctor-specialization {
          background: linear-gradient(135deg, #e8f5ff, #dbeafe);
          color: #1976d2;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-block;
          margin-bottom: 0.5rem;
        }

        .doctor-hospital {
          color: #6c757d;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .availability {
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          text-align: center;
          min-width: 80px;
        }

        .availability.available {
          background: linear-gradient(135deg, #e8f5e8, #d4edda);
          color: #155724;
        }

        .availability.unavailable {
          background: linear-gradient(135deg, #ffeaea, #ffcccb);
          color: #721c24;
        }

        .doctor-details {
          margin-bottom: 1.5rem;
        }

        .doctor-details p {
          margin: 0.8rem 0;
          color: #5a6c7d;
          font-size: 1rem;
          line-height: 1.5;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .doctor-details strong {
          color: #2c3e50;
          font-weight: 600;
          min-width: 80px;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0.5rem 0;
        }

        .stars {
          color: #ffd700;
          font-size: 1.1rem;
        }

        .rating-text {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .doctor-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 2px solid #f8f9fa;
          flex-wrap: wrap;
        }

        .btn-primary,
        .btn-secondary,
        .btn-tertiary {
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-align: center;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.3s ease;
          flex: 1;
          justify-content: center;
          min-width: 120px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #27ae60, #2ecc71);
          color: white;
          box-shadow: 0 4px 15px rgba(39,174,96,0.3);
        }

        .btn-secondary {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
          box-shadow: 0 4px 15px rgba(52,152,219,0.3);
        }

        .btn-tertiary {
          background: linear-gradient(135deg, #f39c12, #e67e22);
          color: white;
          box-shadow: 0 4px 15px rgba(243,156,18,0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(39,174,96,0.4);
        }

        .btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(52,152,219,0.4);
        }

        .btn-tertiary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(243,156,18,0.4);
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: #6c757d;
          font-size: 1.1rem;
        }

        .loading::after {
          content: '';
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-left: 10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .no-results {
          text-align: center;
          padding: 3rem;
          color: #6c757d;
          font-size: 1.1rem;
        }

        .message.error {
          background: linear-gradient(135deg, #ffeaea, #ffcccb);
          color: #c0392b;
          padding: 1.5rem;
          border-radius: 10px;
          margin: 1.5rem 2rem;
          border-left: 4px solid #e74c3c;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .container {
            flex-direction: column;
          }

          .left-panel {
            position: relative;
            width: 100%;
            height: auto;
            padding: 1rem;
          }

          .right-panel {
            margin: 0.5rem;
            border-radius: 15px;
            max-height: none;
          }

          .doctors-grid {
            grid-template-columns: 1fr;
            padding: 1rem;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .doctor-actions {
            flex-direction: column;
          }

          .btn-primary,
          .btn-secondary,
          .btn-tertiary {
            flex: none;
          }

          .welcome {
            font-size: 2rem;
          }

          .doctor-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .quick-filter-buttons {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
