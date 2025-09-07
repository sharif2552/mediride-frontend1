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
    </div>
  );
}
