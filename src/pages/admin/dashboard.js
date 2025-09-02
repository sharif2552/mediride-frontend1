// src/pages/admin/dashboard.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (!token || !userData) {
      router.push('/admin/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
      fetchStatistics();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/admin/login');
    }
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/admin/statistics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefresh');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            <span className="logo-text">MEDIRIDE Admin</span>
          </div>
        </div>
        <div className="header-right">
          <div className="admin-info">
            <span className="admin-name">👤 {user?.first_name || user?.email}</span>
            <span className="admin-role">{user?.is_superuser ? 'Super Admin' : 'Admin'}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Sidebar */}
        <nav className="sidebar">
          <div className="nav-items">
            <button
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button
              className={`nav-item ${activeTab === 'hospitals' ? 'active' : ''}`}
              onClick={() => setActiveTab('hospitals')}
            >
              🏥 Hospitals
            </button>
            <button
              className={`nav-item ${activeTab === 'doctors' ? 'active' : ''}`}
              onClick={() => setActiveTab('doctors')}
            >
              👩‍⚕️ Doctors
            </button>
            <button
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Users
            </button>
            <Link href="/admin/bid-management" className="nav-item-link">
              🏆 Bid Management
            </Link>
            <button
              className={`nav-item ${activeTab === 'statistics' ? 'active' : ''}`}
              onClick={() => setActiveTab('statistics')}
            >
              📈 Statistics
            </button>
            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Settings
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          {activeTab === 'dashboard' && <DashboardOverview stats={stats} />}
          {activeTab === 'hospitals' && <HospitalManagement />}
          {activeTab === 'doctors' && <DoctorManagement />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'statistics' && <StatisticsView stats={stats} />}
          {activeTab === 'settings' && <AdminSettings />}
        </main>
      </div>

      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background: #f8f9fa;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .admin-header {
          background: linear-gradient(135deg, #2c3e50, #34495e);
          color: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left {
          display: flex;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .logo-icon {
          font-size: 1.5rem;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .admin-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.2rem;
        }

        .admin-name {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .admin-role {
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .logout-btn {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(231,76,60,0.3);
        }

        .dashboard-container {
          display: flex;
          min-height: calc(100vh - 80px);
        }

        .sidebar {
          width: 250px;
          background: white;
          box-shadow: 2px 0 10px rgba(0,0,0,0.05);
          padding: 2rem 0;
        }

        .nav-items {
          display: flex;
          flex-direction: column;
        }

        .nav-item {
          background: none;
          border: none;
          padding: 1rem 2rem;
          text-align: left;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: #6c757d;
          transition: all 0.3s ease;
          border-left: 3px solid transparent;
        }

        .nav-item:hover {
          background: #f8f9fa;
          color: #495057;
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1));
          color: #667eea;
          border-left-color: #667eea;
        }

        .nav-item-link {
          display: block;
          padding: 1rem 2rem;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          color: #6c757d;
          transition: all 0.3s ease;
          border-left: 3px solid transparent;
        }

        .nav-item-link:hover {
          background: #f8f9fa;
          color: #495057;
        }

        .main-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .admin-header {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .header-right {
            width: 100%;
            justify-content: space-between;
          }

          .dashboard-container {
            flex-direction: column;
          }

          .sidebar {
            width: 100%;
            padding: 1rem 0;
          }

          .nav-items {
            flex-direction: row;
            overflow-x: auto;
            padding: 0 1rem;
          }

          .nav-item {
            white-space: nowrap;
            min-width: 120px;
            padding: 0.8rem 1rem;
            text-align: center;
            border-left: none;
            border-bottom: 3px solid transparent;
          }

          .nav-item.active {
            border-left: none;
            border-bottom-color: #667eea;
          }

          .main-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview({ stats }) {
  return (
    <div className="dashboard-overview">
      <h1>Dashboard Overview</h1>
      
      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-number">{stats?.total_users || 0}</p>
          </div>
        </div>
        
        <div className="stat-card hospitals">
          <div className="stat-icon">🏥</div>
          <div className="stat-info">
            <h3>Hospitals</h3>
            <p className="stat-number">{stats?.total_hospitals || 0}</p>
          </div>
        </div>
        
        <div className="stat-card doctors">
          <div className="stat-icon">👩‍⚕️</div>
          <div className="stat-info">
            <h3>Doctors</h3>
            <p className="stat-number">{stats?.total_doctors || 0}</p>
          </div>
        </div>
        
        <div className="stat-card bookings">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>Bookings</h3>
            <p className="stat-number">{stats?.total_bookings || 0}</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link href="/admin/hospitals/add" className="action-btn primary">
            ➕ Add Hospital
          </Link>
          <Link href="/admin/doctors/add" className="action-btn secondary">
            ➕ Add Doctor
          </Link>
          <Link href="/admin/users" className="action-btn tertiary">
            👥 Manage Users
          </Link>
          <Link href="/admin/reports" className="action-btn quaternary">
            📊 View Reports
          </Link>
        </div>
      </div>

      <style jsx>{`
        .dashboard-overview h1 {
          margin: 0 0 2rem 0;
          color: #2c3e50;
          font-size: 2rem;
          font-weight: 700;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.3s ease;
          border-left: 4px solid;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.12);
        }

        .stat-card.users { border-left-color: #3498db; }
        .stat-card.hospitals { border-left-color: #e74c3c; }
        .stat-card.doctors { border-left-color: #27ae60; }
        .stat-card.bookings { border-left-color: #f39c12; }

        .stat-icon {
          font-size: 2.5rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(102,126,234,0.1);
        }

        .stat-info h3 {
          margin: 0 0 0.5rem 0;
          color: #6c757d;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-number {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .quick-actions h2 {
          margin: 0 0 1.5rem 0;
          color: #2c3e50;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .action-btn {
          padding: 1rem 1.5rem;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .action-btn.secondary {
          background: linear-gradient(135deg, #27ae60, #2ecc71);
          color: white;
        }

        .action-btn.tertiary {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
        }

        .action-btn.quaternary {
          background: linear-gradient(135deg, #f39c12, #e67e22);
          color: white;
        }
      `}</style>
    </div>
  );
}

// Other component implementations
function HospitalManagement() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await fetch('/api/admin/hospitals', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHospitals(data.results || data);
      } else {
        setError('Failed to fetch hospitals');
      }
    } catch (err) {
      setError('Error loading hospitals');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading hospitals...</div>;

  return (
    <div className="management-section">
      <div className="section-header">
        <h1>🏥 Hospital Management</h1>
        <Link href="/admin/hospitals/add" className="add-btn">➕ Add Hospital</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="data-table">
        <div className="table-header">
          <div>Name</div>
          <div>District</div>
          <div>Phone</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        
        {hospitals.map(hospital => (
          <div key={hospital.id} className="table-row">
            <div className="hospital-name">
              <strong>{hospital.name}</strong>
              <small>{hospital.address}</small>
            </div>
            <div>{hospital.district?.name || 'N/A'}</div>
            <div>{hospital.phone_number}</div>
            <div>
              <span className={`status-badge ${hospital.is_active ? 'active' : 'inactive'}`}>
                {hospital.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="actions">
              <button className="edit-btn">✏️ Edit</button>
              <button className="delete-btn">🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .management-section {
          padding: 1rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e9ecef;
        }

        .section-header h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.8rem;
        }

        .add-btn {
          background: linear-gradient(135deg, #27ae60, #2ecc71);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(39,174,96,0.3);
        }

        .data-table {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }

        .table-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          font-weight: 600;
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1.5rem;
          border-bottom: 1px solid #e9ecef;
          align-items: center;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-row:hover {
          background: #f8f9fa;
        }

        .hospital-name {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .hospital-name small {
          color: #6c757d;
          font-size: 0.8rem;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.active {
          background: #e8f5e8;
          color: #27ae60;
        }

        .status-badge.inactive {
          background: #ffeaea;
          color: #e74c3c;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
        }

        .edit-btn,
        .delete-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .edit-btn {
          background: #3498db;
          color: white;
        }

        .delete-btn {
          background: #e74c3c;
          color: white;
        }

        .edit-btn:hover,
        .delete-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: #6c757d;
        }

        .error-message {
          background: #ffeaea;
          color: #e74c3c;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 4px solid #e74c3c;
        }

        @media (max-width: 768px) {
          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          
          .section-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}

function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/admin/doctors', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDoctors(data.results || data);
      } else {
        setError('Failed to fetch doctors');
      }
    } catch (err) {
      setError('Error loading doctors');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading doctors...</div>;

  return (
    <div className="management-section">
      <div className="section-header">
        <h1>👩‍⚕️ Doctor Management</h1>
        <Link href="/admin/doctors/add" className="add-btn">➕ Add Doctor</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="data-table">
        <div className="table-header">
          <div>Doctor</div>
          <div>Specialization</div>
          <div>Hospital</div>
          <div>Experience</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        
        {doctors.map(doctor => (
          <div key={doctor.id} className="table-row">
            <div className="doctor-info">
              <strong>Dr. {doctor.name}</strong>
              <small>{doctor.qualification}</small>
            </div>
            <div>{doctor.specialization_display}</div>
            <div>{doctor.hospital?.name || 'Independent'}</div>
            <div>{doctor.experience_years} years</div>
            <div>
              <span className={`status-badge ${doctor.is_available ? 'available' : 'unavailable'}`}>
                {doctor.is_available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <div className="actions">
              <button className="edit-btn">✏️ Edit</button>
              <button className="delete-btn">🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .management-section {
          padding: 1rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e9ecef;
        }

        .section-header h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.8rem;
        }

        .add-btn {
          background: linear-gradient(135deg, #27ae60, #2ecc71);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(39,174,96,0.3);
        }

        .data-table {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }

        .table-header {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          font-weight: 600;
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1.5rem;
          border-bottom: 1px solid #e9ecef;
          align-items: center;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-row:hover {
          background: #f8f9fa;
        }

        .doctor-info {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .doctor-info small {
          color: #6c757d;
          font-size: 0.8rem;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.available {
          background: #e8f5e8;
          color: #27ae60;
        }

        .status-badge.unavailable {
          background: #ffeaea;
          color: #e74c3c;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
        }

        .edit-btn,
        .delete-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .edit-btn {
          background: #3498db;
          color: white;
        }

        .delete-btn {
          background: #e74c3c;
          color: white;
        }

        .edit-btn:hover,
        .delete-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: #6c757d;
        }

        .error-message {
          background: #ffeaea;
          color: #e74c3c;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 4px solid #e74c3c;
        }

        @media (max-width: 768px) {
          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          
          .section-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // For demo, showing user 13 as requested
    fetchUser(13);
  }, []);

  const fetchUser = async (userId) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading user data...</div>;

  return (
    <div className="management-section">
      <div className="section-header">
        <h1>👥 User Management</h1>
        <div className="user-actions">
          <Link href="/admin/users/add" className="add-btn">➕ Add User</Link>
          <input 
            type="number" 
            placeholder="User ID" 
            onChange={(e) => e.target.value && fetchUser(e.target.value)}
            className="user-search"
          />
          <button className="search-btn">🔍 Search User</button>
        </div>
      </div>

      {selectedUser && (
        <div className="user-detail-card">
          <div className="user-header">
            <div className="user-avatar">
              {selectedUser.first_name?.charAt(0) || selectedUser.email?.charAt(0) || '👤'}
            </div>
            <div className="user-info">
              <h2>{selectedUser.first_name} {selectedUser.last_name}</h2>
              <p className="user-email">{selectedUser.email}</p>
              <p className="user-id">User ID: {selectedUser.id}</p>
            </div>
            <div className="user-status">
              <span className={`status-badge ${selectedUser.is_active ? 'active' : 'inactive'}`}>
                {selectedUser.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="user-details">
            <div className="detail-grid">
              <div className="detail-item">
                <label>Phone Number</label>
                <span>{selectedUser.phone_number || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>Date Joined</label>
                <span>{new Date(selectedUser.date_joined).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <label>Last Login</label>
                <span>{selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleDateString() : 'Never'}</span>
              </div>
              <div className="detail-item">
                <label>Staff Status</label>
                <span>{selectedUser.is_staff ? 'Yes' : 'No'}</span>
              </div>
              <div className="detail-item">
                <label>Superuser</label>
                <span>{selectedUser.is_superuser ? 'Yes' : 'No'}</span>
              </div>
              <div className="detail-item">
                <label>Email Verified</label>
                <span>{selectedUser.is_verified ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          <div className="user-actions-section">
            <button className="action-btn edit">✏️ Edit User</button>
            <button className="action-btn reset">🔑 Reset Password</button>
            <button className="action-btn suspend">⛔ Suspend Account</button>
            <button className="action-btn delete">🗑️ Delete User</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .management-section {
          padding: 1rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e9ecef;
        }

        .section-header h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.8rem;
        }

        .user-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .user-search {
          padding: 8px 12px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
        }

        .search-btn {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .user-detail-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .user-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .user-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
        }

        .user-info h2 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
        }

        .user-email {
          margin: 0;
          opacity: 0.9;
          font-size: 1.1rem;
        }

        .user-id {
          margin: 0.5rem 0 0 0;
          opacity: 0.8;
          font-size: 0.9rem;
        }

        .status-badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.active {
          background: rgba(39,174,96,0.2);
          color: #27ae60;
        }

        .status-badge.inactive {
          background: rgba(231,76,60,0.2);
          color: #e74c3c;
        }

        .user-details {
          padding: 2rem;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-item label {
          font-weight: 600;
          color: #6c757d;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-item span {
          color: #2c3e50;
          font-size: 1rem;
        }

        .user-actions-section {
          padding: 1.5rem 2rem;
          background: #f8f9fa;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn.edit {
          background: #3498db;
          color: white;
        }

        .action-btn.reset {
          background: #f39c12;
          color: white;
        }

        .action-btn.suspend {
          background: #e67e22;
          color: white;
        }

        .action-btn.delete {
          background: #e74c3c;
          color: white;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: #6c757d;
        }

        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .user-actions {
            justify-content: center;
          }

          .user-header {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }

          .user-actions-section {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

function StatisticsView({ stats }) {
  return (
    <div className="statistics-section">
      <div className="section-header">
        <h1>📈 System Statistics</h1>
        <button className="refresh-btn" onClick={() => window.location.reload()}>
          🔄 Refresh Data
        </button>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats?.total_users || 0}</p>
            <small>Registered users in system</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏥</div>
          <div className="stat-content">
            <h3>Active Hospitals</h3>
            <p className="stat-number">{stats?.active_hospitals || 0}</p>
            <small>Currently operating hospitals</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👩‍⚕️</div>
          <div className="stat-content">
            <h3>Available Doctors</h3>
            <p className="stat-number">{stats?.available_doctors || 0}</p>
            <small>Doctors ready for consultation</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Total Bookings</h3>
            <p className="stat-number">{stats?.total_bookings || 0}</p>
            <small>All-time booking count</small>
          </div>
        </div>
      </div>

      <div className="detailed-stats">
        <div className="stats-section-title">
          <h2>Detailed Analytics</h2>
        </div>
        
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>📊 Booking Trends</h3>
            <div className="trend-item">
              <span>Today's Bookings</span>
              <span className="trend-value">{stats?.bookings_today || 0}</span>
            </div>
            <div className="trend-item">
              <span>This Week</span>
              <span className="trend-value">{stats?.bookings_week || 0}</span>
            </div>
            <div className="trend-item">
              <span>This Month</span>
              <span className="trend-value">{stats?.bookings_month || 0}</span>
            </div>
          </div>

          <div className="analytics-card">
            <h3>🚑 Popular Services</h3>
            <div className="service-item">
              <span>Emergency Rides</span>
              <span className="service-percentage">68%</span>
            </div>
            <div className="service-item">
              <span>Scheduled Appointments</span>
              <span className="service-percentage">24%</span>
            </div>
            <div className="service-item">
              <span>Doctor Consultations</span>
              <span className="service-percentage">8%</span>
            </div>
          </div>

          <div className="analytics-card">
            <h3>🌍 Geographic Distribution</h3>
            <div className="geo-item">
              <span>Dhaka Division</span>
              <span className="geo-percentage">45%</span>
            </div>
            <div className="geo-item">
              <span>Chittagong Division</span>
              <span className="geo-percentage">22%</span>
            </div>
            <div className="geo-item">
              <span>Other Divisions</span>
              <span className="geo-percentage">33%</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .statistics-section {
          padding: 1rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e9ecef;
        }

        .section-header h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.8rem;
        }

        .refresh-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102,126,234,0.3);
        }

        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.12);
        }

        .stat-icon {
          font-size: 2.5rem;
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1));
        }

        .stat-content h3 {
          margin: 0 0 0.5rem 0;
          color: #6c757d;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-number {
          margin: 0 0 0.5rem 0;
          font-size: 2.2rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .stat-content small {
          color: #6c757d;
          font-size: 0.8rem;
        }

        .detailed-stats {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }

        .stats-section-title h2 {
          margin: 0 0 2rem 0;
          color: #2c3e50;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .analytics-card {
          padding: 1.5rem;
          border: 2px solid #f8f9fa;
          border-radius: 12px;
          background: #fafbfc;
        }

        .analytics-card h3 {
          margin: 0 0 1.5rem 0;
          color: #2c3e50;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .trend-item,
        .service-item,
        .geo-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 0;
          border-bottom: 1px solid #e9ecef;
        }

        .trend-item:last-child,
        .service-item:last-child,
        .geo-item:last-child {
          border-bottom: none;
        }

        .trend-value {
          font-weight: 700;
          color: #667eea;
          font-size: 1.1rem;
        }

        .service-percentage,
        .geo-percentage {
          font-weight: 700;
          color: #27ae60;
          background: rgba(39,174,96,0.1);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .analytics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

function AdminSettings() {
  return (
    <div className="settings-section">
      <div className="section-header">
        <h1>⚙️ Admin Settings</h1>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <h3>🔐 Security Settings</h3>
          <div className="setting-item">
            <label>Two-Factor Authentication</label>
            <button className="toggle-btn">Enable</button>
          </div>
          <div className="setting-item">
            <label>Password Requirements</label>
            <button className="config-btn">Configure</button>
          </div>
          <div className="setting-item">
            <label>Session Timeout</label>
            <select className="setting-select">
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>2 hours</option>
            </select>
          </div>
        </div>

        <div className="settings-card">
          <h3>📧 Notification Settings</h3>
          <div className="setting-item">
            <label>Email Notifications</label>
            <button className="toggle-btn active">Enabled</button>
          </div>
          <div className="setting-item">
            <label>SMS Alerts</label>
            <button className="toggle-btn">Enable</button>
          </div>
          <div className="setting-item">
            <label>Emergency Alerts</label>
            <button className="toggle-btn active">Enabled</button>
          </div>
        </div>

        <div className="settings-card">
          <h3>🚑 System Configuration</h3>
          <div className="setting-item">
            <label>Maximum Booking Distance</label>
            <input type="number" className="setting-input" defaultValue="50" />
            <small>kilometers</small>
          </div>
          <div className="setting-item">
            <label>Emergency Response Time</label>
            <input type="number" className="setting-input" defaultValue="15" />
            <small>minutes</small>
          </div>
          <div className="setting-item">
            <label>Maintenance Mode</label>
            <button className="toggle-btn">Enable</button>
          </div>
        </div>

        <div className="settings-card">
          <h3>📊 Data & Backup</h3>
          <div className="setting-item">
            <label>Auto Backup</label>
            <button className="toggle-btn active">Enabled</button>
          </div>
          <div className="setting-item">
            <label>Data Retention Period</label>
            <select className="setting-select">
              <option>1 year</option>
              <option>2 years</option>
              <option>5 years</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Export Data</label>
            <button className="export-btn">📥 Export</button>
          </div>
        </div>
      </div>

      <div className="danger-zone">
        <h3>⚠️ Danger Zone</h3>
        <div className="danger-actions">
          <button className="danger-btn">🗑️ Clear All Logs</button>
          <button className="danger-btn">🔄 Reset System</button>
          <button className="danger-btn">💾 Factory Reset</button>
        </div>
      </div>

      <style jsx>{`
        .settings-section {
          padding: 1rem;
        }

        .section-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e9ecef;
        }

        .section-header h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.8rem;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .settings-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }

        .settings-card h3 {
          margin: 0 0 1.5rem 0;
          color: #2c3e50;
          font-size: 1.2rem;
          font-weight: 600;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f8f9fa;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #f8f9fa;
        }

        .setting-item:last-child {
          border-bottom: none;
        }

        .setting-item label {
          font-weight: 500;
          color: #495057;
        }

        .toggle-btn {
          padding: 6px 16px;
          border: 2px solid #e9ecef;
          border-radius: 20px;
          background: white;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          color: #6c757d;
          transition: all 0.3s ease;
        }

        .toggle-btn.active {
          background: linear-gradient(135deg, #27ae60, #2ecc71);
          border-color: #27ae60;
          color: white;
        }

        .toggle-btn:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .config-btn,
        .export-btn {
          padding: 6px 16px;
          border: none;
          border-radius: 8px;
          background: #3498db;
          color: white;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .config-btn:hover,
        .export-btn:hover {
          background: #2980b9;
          transform: translateY(-1px);
        }

        .setting-select,
        .setting-input {
          padding: 6px 12px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 0.9rem;
          min-width: 120px;
        }

        .setting-input {
          max-width: 80px;
          text-align: center;
        }

        .danger-zone {
          background: linear-gradient(135deg, #ffeaea, #ffcccb);
          padding: 2rem;
          border-radius: 15px;
          border: 2px solid #e74c3c;
        }

        .danger-zone h3 {
          margin: 0 0 1.5rem 0;
          color: #c0392b;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .danger-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .danger-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          background: #e74c3c;
          color: white;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .danger-btn:hover {
          background: #c0392b;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(231,76,60,0.3);
        }

        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }

          .setting-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .danger-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
