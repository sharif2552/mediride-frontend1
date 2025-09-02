// src/pages/nearest-info.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS, SPECIALIZATIONS } from '../config/api';
import { fetchData, buildQueryString, getCurrentLocation } from '../utils/api';

export default function NearestInfo() {
  const [nearestHospitals, setNearestHospitals] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('hospitals'); // 'hospitals' or 'doctors'

  // Search states
  const [searchFilters, setSearchFilters] = useState({
    maxDistance: 50,
    limit: 10,
    specialization: '',
  });

  useEffect(() => {
    loadNearestInfo();
  }, []);

  const loadNearestInfo = async () => {
    setLoading(true);
    setError('');

    try {
      const location = await getCurrentLocation();
      setUserLocation(location);

      // Fetch nearest hospitals
      await fetchNearestHospitals(location);
      
      // Fetch available doctors
      await fetchAvailableDoctors();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearestHospitals = async (location = userLocation) => {
    if (!location) return;

    try {
      const queryString = buildQueryString({
        lat: location.lat,
        lon: location.lon,
        limit: searchFilters.limit,
        max_distance_km: searchFilters.maxDistance,
      });

      const data = await fetchData(API_ENDPOINTS.NEAREST_HOSPITALS + queryString);
      setNearestHospitals(data.results || data);
    } catch (err) {
      console.error('Error fetching nearest hospitals:', err);
    }
  };

  const fetchAvailableDoctors = async () => {
    try {
      const queryString = buildQueryString({
        available: true,
        specialization: searchFilters.specialization,
        page_size: searchFilters.limit,
      });

      const data = await fetchData(API_ENDPOINTS.DOCTORS + queryString);
      setAvailableDoctors(data.results || data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRefresh = () => {
    if (activeTab === 'hospitals' && userLocation) {
      fetchNearestHospitals();
    } else if (activeTab === 'doctors') {
      fetchAvailableDoctors();
    }
  };

  const getSpecializationDisplay = (specialization) => {
    const spec = SPECIALIZATIONS.find(s => s.value === specialization);
    return spec ? spec.label : specialization;
  };

  return (
    <div className="container">
      {/* Left Section */}
      <section className="left-panel">
        <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="logo" />
        <p className="tagline">Your need, Our priority, Ready to Response, Anytime Anywhere</p>
        <div className="back-home-btn-wrapper">
          <Link href="/">
            <button type="button" className="secondary-btn back-home-btn">
              ← Back to Home
            </button>
          </Link>
        </div>
      </section>

      {/* Right Section */}
      <section className="right-panel">
        <header className="header">
          <div className="profile-search-wrapper">
            <img src="/assets/Formal Photo.jpg" alt="Profile" className="profile-pic" />
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search Hospitals or Doctors" />
            </div>
          </div>
        </header>

        <h1 className="welcome">
          Nearest <span className="highlight">Hospital & <span className="ride">Doctor Info</span></span>
        </h1>

        {error && (
          <div className="message error">
            {error}
            <button className="retry-btn" onClick={loadNearestInfo}>
              Try Again
            </button>
          </div>
        )}

        {userLocation && (
          <div className="location-info">
            <p><strong>Your Location:</strong> {userLocation.lat.toFixed(6)}, {userLocation.lon.toFixed(6)}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'hospitals' ? 'active' : ''}`}
            onClick={() => setActiveTab('hospitals')}
          >
            Nearest Hospitals ({nearestHospitals.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            Available Doctors ({availableDoctors.length})
          </button>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            {activeTab === 'hospitals' && (
              <>
                <div className="filter-group">
                  <label>Max Distance (km):</label>
                  <input
                    type="number"
                    name="maxDistance"
                    value={searchFilters.maxDistance}
                    onChange={handleFilterChange}
                    min="1"
                    max="200"
                  />
                </div>
              </>
            )}
            
            {activeTab === 'doctors' && (
              <div className="filter-group">
                <label>Specialization:</label>
                <select 
                  name="specialization" 
                  value={searchFilters.specialization} 
                  onChange={handleFilterChange}
                >
                  <option value="">All Specializations</option>
                  {SPECIALIZATIONS.map(spec => (
                    <option key={spec.value} value={spec.value}>
                      {spec.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="filter-group">
              <label>Results Limit:</label>
              <select name="limit" value={searchFilters.limit} onChange={handleFilterChange}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </div>
            
            <div className="filter-group">
              <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh Results'}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading nearest information...</div>
        ) : (
          <div className="info-list">
            {/* Hospitals Tab */}
            {activeTab === 'hospitals' && (
              <>
                {nearestHospitals.length === 0 ? (
                  <div className="no-results">
                    <p>No nearby hospitals found. Try increasing the distance limit.</p>
                  </div>
                ) : (
                  nearestHospitals.map((hospital) => (
                    <div key={hospital.id} className="info-card hospital-card">
                      <div className="card-header">
                        <h3>{hospital.name}</h3>
                        <span className="distance-badge">
                          {hospital.distance_km} km away
                        </span>
                      </div>
                      <p><strong>Address:</strong> {hospital.address}</p>
                      <p><strong>Phone:</strong> 
                        <a href={`tel:${hospital.phone_number}`}>{hospital.phone_number}</a>
                      </p>
                      {hospital.emergency_contact && (
                        <p><strong>Emergency:</strong> 
                          <a href={`tel:${hospital.emergency_contact}`} className="emergency-link">
                            {hospital.emergency_contact}
                          </a>
                        </p>
                      )}
                      <div className="card-actions">
                        <Link href={`/hospitals/${hospital.id}`}>
                          <button className="btn-primary">View Details</button>
                        </Link>
                        <Link href={`/hospitals/${hospital.id}/doctors`}>
                          <button className="btn-secondary">View Doctors</button>
                        </Link>
                        {hospital.latitude && hospital.longitude && (
                          <button 
                            className="btn-tertiary"
                            onClick={() => {
                              const url = `https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`;
                              window.open(url, '_blank');
                            }}
                          >
                            Directions
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* Doctors Tab */}
            {activeTab === 'doctors' && (
              <>
                {availableDoctors.length === 0 ? (
                  <div className="no-results">
                    <p>No available doctors found for the selected criteria.</p>
                  </div>
                ) : (
                  availableDoctors.map((doctor) => (
                    <div key={doctor.id} className="info-card doctor-card">
                      <div className="card-header">
                        <h3>Dr. {doctor.name}</h3>
                        <span className="specialization-badge">
                          {getSpecializationDisplay(doctor.specialization)}
                        </span>
                      </div>
                      <p><strong>Hospital:</strong> {doctor.hospital?.name || 'N/A'}</p>
                      <p><strong>Qualification:</strong> {doctor.qualification}</p>
                      <p><strong>Experience:</strong> {doctor.experience_years} years</p>
                      <p><strong>Phone:</strong> 
                        <a href={`tel:${doctor.phone_number}`}>{doctor.phone_number}</a>
                      </p>
                      <div className="card-actions">
                        <Link href={`/doctors/${doctor.id}`}>
                          <button className="btn-primary">View Profile</button>
                        </Link>
                        <a href={`tel:${doctor.phone_number}`} className="btn-secondary">
                          Call Doctor
                        </a>
                        {doctor.hospital && (
                          <Link href={`/hospitals/${doctor.hospital.id}`}>
                            <button className="btn-tertiary">Hospital Info</button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Link href="/hospitals">
              <button className="action-btn">Browse All Hospitals</button>
            </Link>
            <Link href="/doctors">
              <button className="action-btn">Browse All Doctors</button>
            </Link>
            <Link href="/instant-book">
              <button className="action-btn primary">Book Ambulance</button>
            </Link>
          </div>
        </div>

        <style jsx>{`
          .message.error {
            background: #ffeaea;
            color: #f44336;
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .retry-btn {
            background: #f44336;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
          }

          .location-info {
            background: #e8f5e8;
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1rem;
            text-align: center;
          }

          .tab-navigation {
            display: flex;
            margin-bottom: 1rem;
            border-bottom: 1px solid #ddd;
          }

          .tab-btn {
            padding: 10px 20px;
            border: none;
            background: none;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            font-weight: 500;
          }

          .tab-btn.active {
            border-bottom-color: #4CAF50;
            color: #4CAF50;
          }

          .filters-section {
            background: #f9f9f9;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 2rem;
          }

          .filters-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
          }

          .filter-group {
            display: flex;
            flex-direction: column;
          }

          .filter-group label {
            margin-bottom: 0.5rem;
            font-weight: 500;
            font-size: 0.9rem;
          }

          .filter-group input,
          .filter-group select {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }

          .refresh-btn {
            padding: 8px 16px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          .refresh-btn:hover {
            background: #45a049;
          }

          .refresh-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .distance-badge,
          .specialization-badge {
            background: #2196F3;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
          }

          .distance-badge {
            background: #ff9800;
          }

          .emergency-link {
            color: #f44336;
            font-weight: bold;
          }

          .card-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
            flex-wrap: wrap;
          }

          .btn-primary,
          .btn-secondary,
          .btn-tertiary {
            padding: 6px 12px;
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

          .quick-actions {
            margin-top: 2rem;
            padding: 1rem;
            background: #f9f9f9;
            border-radius: 8px;
          }

          .quick-actions h3 {
            margin: 0 0 1rem 0;
            color: #333;
          }

          .action-buttons {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .action-btn {
            padding: 10px 20px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
          }

          .action-btn.primary {
            background: #4CAF50;
            color: white;
            border-color: #4CAF50;
          }

          .action-btn:hover {
            background: #f0f0f0;
          }

          .action-btn.primary:hover {
            background: #45a049;
          }

          .loading,
          .no-results {
            text-align: center;
            padding: 2rem;
            color: #666;
          }
        `}</style>
      </section>
    </div>
  );
}
