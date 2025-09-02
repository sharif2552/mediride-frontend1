// src/pages/hospitals.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS } from '../config/api';
import { fetchData, buildQueryString, getCurrentLocation } from '../utils/api';

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [nearestHospitals, setNearestHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nearestLoading, setNearestLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'nearest'
  
  // Filter states
  const [filters, setFilters] = useState({
    district: '',
    is_active: 'true',
    search: '',
    page: 1,
    page_size: 10,
  });

  const [nearestFilters, setNearestFilters] = useState({
    limit: 5,
    max_distance_km: 50,
  });

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (activeTab === 'all') {
      fetchHospitals();
    }
  }, [filters, activeTab]);

  const fetchHospitals = async () => {
    setLoading(true);
    setError('');
    
    try {
      const queryString = buildQueryString(filters);
      const data = await fetchData(API_ENDPOINTS.HOSPITALS + queryString);
      setHospitals(data.results || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearestHospitals = async () => {
    setNearestLoading(true);
    setError('');
    
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      
      const queryString = buildQueryString({
        ...location,
        ...nearestFilters,
      });
      
      const data = await fetchData(API_ENDPOINTS.NEAREST_HOSPITALS + queryString);
      setNearestHospitals(data.results || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setNearestLoading(false);
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

  const handleNearestFilterChange = (e) => {
    const { name, value } = e.target;
    setNearestFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    if (tab === 'nearest' && nearestHospitals.length === 0) {
      fetchNearestHospitals();
    }
  };

  const HospitalCard = ({ hospital, showDistance = false }) => (
    <div className="hospital-card">
      <div className="hospital-header">
        <h3>{hospital.name}</h3>
        <span className={`status ${hospital.is_active ? 'active' : 'inactive'}`}>
          {hospital.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <div className="hospital-details">
        <p><strong>Address:</strong> {hospital.address}</p>
        <p><strong>District:</strong> {hospital.district?.name || 'N/A'}</p>
        <p><strong>Phone:</strong> {hospital.phone_number}</p>
        {hospital.email && <p><strong>Email:</strong> {hospital.email}</p>}
        {hospital.emergency_contact && (
          <p><strong>Emergency:</strong> {hospital.emergency_contact}</p>
        )}
        {showDistance && hospital.distance_km !== undefined && (
          <p><strong>Distance:</strong> {hospital.distance_km} km</p>
        )}
      </div>
      
      <div className="hospital-actions">
        <Link href={`/hospitals/${hospital.id}`} className="btn-primary">
          🏥 View Details
        </Link>
        <Link href={`/hospitals/${hospital.id}/doctors`} className="btn-secondary">
          👩‍⚕️ View Doctors
        </Link>
        <a href={`tel:${hospital.phone_number}`} className="btn-tertiary">
          📞 Call Hospital
        </a>
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
            Hospital <span className="highlight">Directory</span>
          </h1>
        </header>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            All Hospitals
          </button>
          <button 
            className={`tab-btn ${activeTab === 'nearest' ? 'active' : ''}`}
            onClick={() => handleTabChange('nearest')}
          >
            Nearest Hospitals
          </button>
        </div>

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        {/* All Hospitals Tab */}
        {activeTab === 'all' && (
          <div className="hospitals-section">
            {/* Filters */}
            <div className="filters-section">
              <h3>Filter Hospitals</h3>
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Search:</label>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search hospitals..."
                  />
                </div>
                
                <div className="filter-group">
                  <label>District ID:</label>
                  <input
                    type="number"
                    name="district"
                    value={filters.district}
                    onChange={handleFilterChange}
                    placeholder="Enter district ID"
                  />
                </div>
                
                <div className="filter-group">
                  <label>Status:</label>
                  <select name="is_active" value={filters.is_active} onChange={handleFilterChange}>
                    <option value="">All</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
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

            {/* Hospital List */}
            {loading ? (
              <div className="loading">Loading hospitals...</div>
            ) : (
              <div className="hospitals-grid">
                {hospitals.length === 0 ? (
                  <div className="no-results">
                    <p>No hospitals found matching your criteria.</p>
                  </div>
                ) : (
                  hospitals.map((hospital) => (
                    <HospitalCard key={hospital.id} hospital={hospital} />
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Nearest Hospitals Tab */}
        {activeTab === 'nearest' && (
          <div className="nearest-section">
            {/* Nearest Filters */}
            <div className="filters-section">
              <h3>Nearest Hospital Settings</h3>
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Max Distance (km):</label>
                  <input
                    type="number"
                    name="max_distance_km"
                    value={nearestFilters.max_distance_km}
                    onChange={handleNearestFilterChange}
                    placeholder="50"
                  />
                </div>
                
                <div className="filter-group">
                  <label>Limit:</label>
                  <select 
                    name="limit" 
                    value={nearestFilters.limit} 
                    onChange={handleNearestFilterChange}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <button 
                    className="btn-primary" 
                    onClick={fetchNearestHospitals}
                    disabled={nearestLoading}
                  >
                    {nearestLoading ? 'Finding...' : 'Find Nearest'}
                  </button>
                </div>
              </div>
            </div>

            {userLocation && (
              <div className="location-info">
                <p><strong>Your Location:</strong> {userLocation.lat.toFixed(6)}, {userLocation.lon.toFixed(6)}</p>
              </div>
            )}

            {/* Nearest Hospitals List */}
            {nearestLoading ? (
              <div className="loading">Finding nearest hospitals...</div>
            ) : (
              <div className="hospitals-grid">
                {nearestHospitals.length === 0 ? (
                  <div className="no-results">
                    <p>No nearby hospitals found. Try increasing the distance limit.</p>
                  </div>
                ) : (
                  nearestHospitals.map((hospital) => (
                    <HospitalCard key={hospital.id} hospital={hospital} showDistance={true} />
                  ))
                )}
              </div>
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

        .tab-navigation {
          display: flex;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          margin: 0;
        }

        .tab-btn {
          flex: 1;
          padding: 1.5rem 2rem;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 600;
          font-size: 1.1rem;
          color: #6c757d;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
        }

        .tab-btn:hover {
          background: rgba(102,126,234,0.1);
          color: #667eea;
        }

        .tab-btn.active {
          background: white;
          color: #667eea;
          border-bottom-color: #667eea;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
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
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
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

        .hospitals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 2rem;
          padding: 2rem;
        }

        .hospital-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
          border: 1px solid rgba(102,126,234,0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .hospital-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .hospital-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }

        .hospital-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f8f9fa;
        }

        .hospital-header h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.3rem;
          font-weight: 700;
          line-height: 1.3;
        }

        .status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status.active {
          background: linear-gradient(135deg, #27ae60, #2ecc71);
          color: white;
          box-shadow: 0 2px 8px rgba(39,174,96,0.3);
        }

        .status.inactive {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
          box-shadow: 0 2px 8px rgba(231,76,60,0.3);
        }

        .hospital-details {
          margin-bottom: 1.5rem;
        }

        .hospital-details p {
          margin: 0.8rem 0;
          color: #5a6c7d;
          font-size: 1rem;
          line-height: 1.5;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hospital-details strong {
          color: #2c3e50;
          font-weight: 600;
          min-width: 80px;
        }

        .hospital-actions {
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

        .nearest-section {
          padding: 2rem;
        }

        .nearest-section h3 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          font-size: 1.4rem;
          font-weight: 700;
        }

        .get-location-btn {
          background: linear-gradient(135deg, #9b59b6, #8e44ad);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 2rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(155,89,182,0.3);
        }

        .get-location-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(155,89,182,0.4);
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

          .hospitals-grid {
            grid-template-columns: 1fr;
            padding: 1rem;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .hospital-actions {
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
      `}</style>
    </div>
  );
}
