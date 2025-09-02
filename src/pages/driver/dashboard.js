"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function DriverDashboard() {
  const router = useRouter();
  const [driver, setDriver] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [acceptingBooking, setAcceptingBooking] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeTab, setActiveTab] = useState('available');
  const [myBids, setMyBids] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidNote, setBidNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check if driver is logged in
    const driverData = localStorage.getItem('driver');
    const token = localStorage.getItem('driverToken');

    if (!driverData || !token) {
      router.push('/login/driver-login');
      return;
    }

    try {
      const parsedDriver = JSON.parse(driverData);
      setDriver(parsedDriver);
      fetchBookings();
      fetchMyBids();
    } catch (error) {
      console.error('Error parsing driver data:', error);
      router.push('/login/driver-login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('driverToken');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      
      const response = await fetch(`${apiBaseUrl}/api/bookings/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.filter(booking => booking.status === 'pending'));
        setIsDemoMode(false);
        return; // Successfully fetched from backend
      }
    } catch (error) {
      // Backend is not available, fall back to demo mode
      console.log('Backend not available, using demo data');
    }
    
    // Fallback to mock data for demo purposes (either due to error or non-ok response)
    setIsDemoMode(true);
    const mockBookings = [
      {
        id: 1,
        pickup_location: "Dhaka Medical College Hospital",
        destination: "Apollo Hospital, Dhaka",
        patient_name: "Ahmed Rahman",
        patient_phone: "01700000001",
        booking_type: "Emergency",
        status: "pending",
        distance: 12.5,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        pickup_location: "Square Hospital, Dhaka",
        destination: "Holy Family Red Crescent Hospital",
        patient_name: "Fatima Khatun",
        patient_phone: "01700000002",
        booking_type: "Scheduled",
        status: "pending",
        distance: 8.3,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        pickup_location: "Mirpur General Hospital",
        destination: "National Institute of Cardiovascular Diseases",
        patient_name: "Mohammad Ali",
        patient_phone: "01700000003",
        booking_type: "Emergency",
        status: "pending",
        distance: 15.7,
        created_at: new Date().toISOString()
      }
    ];
    
    setBookings(mockBookings);
  };

  const acceptBooking = async (bookingId) => {
    setAcceptingBooking(bookingId);
    
    try {
      const token = localStorage.getItem('driverToken');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      
      const response = await fetch(`${apiBaseUrl}/api/bookings/accept/${bookingId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const acceptedBooking = bookings.find(b => b.id === bookingId);
        setActiveBooking(acceptedBooking);
        setBookings(bookings.filter(b => b.id !== bookingId));
        alert('Booking accepted successfully!');
        setAcceptingBooking(null);
        return;
      }
    } catch (error) {
      console.log('Backend not available, using demo mode for booking acceptance');
    }
    
    // Demo mode - simulate accepting booking
    const acceptedBooking = bookings.find(b => b.id === bookingId);
    if (acceptedBooking) {
      // Update booking status to accepted
      const updatedBooking = {
        ...acceptedBooking,
        status: 'accepted',
        driver_id: driver?.id || 1,
        accepted_at: new Date().toISOString()
      };
      
      setActiveBooking(updatedBooking);
      setBookings(bookings.filter(b => b.id !== bookingId));
      alert('Booking accepted successfully! (Demo Mode)');
    } else {
      alert('Failed to accept booking - booking not found');
    }
    
    setAcceptingBooking(null);
  };

  const completeBooking = async () => {
    if (!activeBooking) return;
    
    try {
      const token = localStorage.getItem('driverToken');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      
      const response = await fetch(`${apiBaseUrl}/api/bookings/complete/${activeBooking.id}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setActiveBooking(null);
        alert('Booking completed successfully!');
        fetchBookings(); // Refresh available bookings
        return;
      }
    } catch (error) {
      console.log('Backend not available, using demo mode for booking completion');
    }
    
    // Demo mode - simulate completing booking
    setActiveBooking(null);
    alert('Booking completed successfully! (Demo Mode)');
    fetchBookings(); // Refresh available bookings
  };

  const contactPatient = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_self');
    } else {
      alert('Patient phone number not available');
    }
  };

  const logout = () => {
    localStorage.removeItem('driver');
    localStorage.removeItem('driverToken');
    localStorage.removeItem('driverRefreshToken');
    router.replace('/login/driver-login');
  };

  // Bidding Functions
  const fetchMyBids = async () => {
    try {
      const token = localStorage.getItem('driverToken');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      
      const response = await fetch(`${apiBaseUrl}/api/bids/my-bids/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMyBids(data.results || data);
        return;
      }
    } catch (error) {
      console.log('Backend not available for fetching bids');
    }
    
    // Demo mode - mock bids
    setMyBids([
      {
        id: 1,
        booking_id: 1,
        bid_amount: 350,
        status: 'pending',
        notes: 'Quick service guaranteed',
        created_at: new Date().toISOString(),
        is_winner: false
      },
      {
        id: 2,
        booking_id: 2,
        bid_amount: 280,
        status: 'approved',
        notes: 'Experienced driver',
        created_at: new Date().toISOString(),
        is_winner: true
      }
    ]);
  };

  const handlePlaceBid = async (bookingId) => {
    if (!bidAmount) {
      alert('Please enter a bid amount');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('driverToken');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      
      const response = await fetch(`${apiBaseUrl}/api/bids/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          booking_id: bookingId,
          bid_amount: parseFloat(bidAmount),
          notes: bidNote,
        }),
      });

      if (response.ok) {
        alert('Bid placed successfully!');
        setBidAmount('');
        setBidNote('');
        setSelectedBooking(null);
        fetchMyBids();
        return;
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to place bid');
      }
    } catch (error) {
      console.log('Backend not available, using demo mode for bidding');
      // Demo mode - simulate bid placement
      const newBid = {
        id: myBids.length + 1,
        booking_id: bookingId,
        bid_amount: parseFloat(bidAmount),
        status: 'pending',
        notes: bidNote,
        created_at: new Date().toISOString(),
        is_winner: false
      };
      setMyBids([...myBids, newBid]);
      alert('Bid placed successfully! (Demo Mode)');
      setBidAmount('');
      setBidNote('');
      setSelectedBooking(null);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchBidsForBooking = async (bookingId) => {
    try {
      const response = await fetch(`/api/bids?booking_id=${bookingId}`);
      if (response.ok) {
        const data = await response.json();
        return data.results || data;
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
    return [];
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (!driver) {
    return null;
  }

  return (
    <div className="driver-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="logo" />
          <h1>Driver Dashboard</h1>
          {isDemoMode && (
            <span className="demo-badge">Demo Mode</span>
          )}
        </div>
        <div className="header-right">
          <span className="driver-name">Welcome, {driver.full_name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Navigation Tabs */}
        <nav className="dashboard-nav">
          <button
            className={`nav-tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            📋 Available Bookings
          </button>
          <button
            className={`nav-tab ${activeTab === 'my-bids' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-bids')}
          >
            💰 My Bids ({myBids.length})
          </button>
          <button
            className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
        </nav>

        {/* Active Booking Section */}
        {activeBooking && (
          <section className="active-booking-section">
            <h2>🚨 Active Booking</h2>
            <div className="booking-card active">
              <div className="booking-info">
                <h3>Booking #{activeBooking.id}</h3>
                <p><strong>Pickup:</strong> {activeBooking.pickup_location}</p>
                <p><strong>Destination:</strong> {activeBooking.destination}</p>
                <p><strong>Patient:</strong> {activeBooking.patient_name}</p>
                <p><strong>Phone:</strong> {activeBooking.patient_phone}</p>
                <p><strong>Type:</strong> {activeBooking.booking_type}</p>
                <p><strong>Status:</strong> {activeBooking.status}</p>
              </div>
              <div className="booking-actions">
                <button 
                  className="complete-btn"
                  onClick={completeBooking}
                >
                  Mark Complete
                </button>
                <button 
                  className="contact-btn"
                  onClick={() => contactPatient(activeBooking.patient_phone)}
                >
                  Contact Patient
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Tab Content */}
        {activeTab === 'available' && (
          <AvailableBookingsTab 
            bookings={bookings}
            acceptingBooking={acceptingBooking}
            acceptBooking={acceptBooking}
            onPlaceBid={setSelectedBooking}
            fetchBidsForBooking={fetchBidsForBooking}
          />
        )}

        {activeTab === 'my-bids' && (
          <MyBidsTab bids={myBids} onRefresh={fetchMyBids} />
        )}

        {activeTab === 'profile' && (
          <ProfileTab driver={driver} isDemoMode={isDemoMode} />
        )}

        {/* Bid Modal */}
        {selectedBooking && (
          <BidModal
            booking={selectedBooking}
            bidAmount={bidAmount}
            setBidAmount={setBidAmount}
            bidNote={bidNote}
            setBidNote={setBidNote}
            onSubmit={() => handlePlaceBid(selectedBooking.id)}
            onClose={() => setSelectedBooking(null)}
            submitting={submitting}
          />
        )}
      </div>

      <style jsx>{`
        .driver-dashboard {
          min-height: 100vh;
          background: #f5f5f5;
        }

        .dashboard-header {
          background: white;
          padding: 1rem 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-left .logo {
          height: 40px;
        }

        .header-left h1 {
          margin: 0;
          color: #333;
        }

        .demo-badge {
          background: #ffc107;
          color: #212529;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: bold;
          margin-left: 1rem;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .driver-name {
          font-weight: 500;
          color: #333;
        }

        .logout-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .logout-btn:hover {
          background: #c82333;
        }

        .dashboard-content {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .profile-section, .active-booking-section, .bookings-section, .quick-actions {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .profile-section h2, .bookings-section h2, .quick-actions h2, .active-booking-section h2 {
          margin-top: 0;
          color: #333;
          border-bottom: 2px solid #28a745;
          padding-bottom: 0.5rem;
        }

        .profile-card {
          display: flex;
          gap: 1rem;
        }

        .profile-info p {
          margin: 0.5rem 0;
        }

        .status.verified {
          color: #28a745;
          font-weight: bold;
        }

        .status.unverified {
          color: #dc3545;
          font-weight: bold;
        }

        .no-bookings {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .refresh-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 1rem;
        }

        .bookings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }

        .booking-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          background: #f9f9f9;
        }

        .booking-card.active {
          border-color: #28a745;
          background: #f8fff9;
        }

        .booking-card h3 {
          margin-top: 0;
          color: #333;
        }

        .booking-info p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
        }

        .booking-actions {
          margin-top: 1rem;
          display: flex;
          gap: 0.5rem;
        }

        .accept-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          flex: 1;
        }

        .accept-btn:hover {
          background: #218838;
        }

        .complete-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          flex: 1;
        }

        .contact-btn {
          background: #ffc107;
          color: #212529;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          flex: 1;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .action-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
        }

        .action-btn:hover {
          background: #5a6268;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
          }

          .dashboard-content {
            padding: 1rem;
          }

          .bookings-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Navigation Tabs Styling */
        .dashboard-nav {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          display: flex;
          gap: 1rem;
        }

        .nav-tab {
          background: none;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: #6c757d;
          transition: all 0.3s ease;
          flex: 1;
          text-align: center;
        }

        .nav-tab:hover {
          background: #f8f9fa;
          color: #495057;
        }

        .nav-tab.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102,126,234,0.3);
        }

        @media (max-width: 768px) {
          .dashboard-nav {
            flex-direction: column;
            gap: 0.5rem;
          }

          .nav-tab {
            flex: none;
          }
        }
      `}</style>
    </div>
  );
}

// Available Bookings Tab Component
function AvailableBookingsTab({ bookings, acceptingBooking, acceptBooking, onPlaceBid, fetchBidsForBooking }) {
  const [bidsData, setBidsData] = useState({});

  const handleViewBids = async (bookingId) => {
    if (bidsData[bookingId]) {
      setBidsData({ ...bidsData, [bookingId]: null });
      return;
    }

    const bids = await fetchBidsForBooking(bookingId);
    setBidsData({ ...bidsData, [bookingId]: bids });
  };

  return (
    <section className="bookings-section">
      <h2>📋 Available Bookings</h2>
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>🚫 No pending bookings available at the moment.</p>
          <p>Check back later for new opportunities!</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card enhanced">
              <div className="booking-header">
                <h3>🚑 Booking #{booking.id}</h3>
                <span className={`booking-type ${booking.booking_type?.toLowerCase()}`}>
                  {booking.booking_type}
                </span>
              </div>
              
              <div className="route-info">
                <div className="location pickup">
                  <span className="icon">📍</span>
                  <div>
                    <strong>Pickup:</strong>
                    <p>{booking.pickup_location}</p>
                  </div>
                </div>
                <div className="route-arrow">⬇️</div>
                <div className="location destination">
                  <span className="icon">🎯</span>
                  <div>
                    <strong>Destination:</strong>
                    <p>{booking.destination}</p>
                  </div>
                </div>
              </div>

              <div className="booking-details">
                <p><strong>👤 Patient:</strong> {booking.patient_name}</p>
                <p><strong>📱 Phone:</strong> {booking.patient_phone}</p>
                <p><strong>📏 Distance:</strong> {booking.distance}km</p>
                <p><strong>⏰ Created:</strong> {new Date(booking.created_at).toLocaleString()}</p>
              </div>

              <div className="booking-actions">
                <button 
                  onClick={() => acceptBooking(booking.id)}
                  className="accept-btn"
                  disabled={acceptingBooking === booking.id}
                >
                  {acceptingBooking === booking.id ? '⏳ Accepting...' : '✅ Accept Now'}
                </button>
                <button 
                  onClick={() => onPlaceBid(booking)}
                  className="bid-btn"
                >
                  💰 Place Bid
                </button>
                <button 
                  onClick={() => handleViewBids(booking.id)}
                  className="view-bids-btn"
                >
                  👁️ {bidsData[booking.id] ? 'Hide' : 'View'} Bids
                </button>
              </div>

              {bidsData[booking.id] && (
                <div className="bids-display">
                  <h4>💰 Current Bids:</h4>
                  {bidsData[booking.id].length === 0 ? (
                    <p>No bids yet. Be the first to bid!</p>
                  ) : (
                    <div className="bids-list">
                      {bidsData[booking.id]
                        .sort((a, b) => a.bid_amount - b.bid_amount)
                        .map((bid, index) => (
                          <div key={bid.id} className={`bid-item ${index === 0 ? 'lowest' : ''}`}>
                            <div className="bid-info">
                              <strong>৳{bid.bid_amount}</strong>
                              <span>by {bid.driver_name}</span>
                              {index === 0 && <span className="badge">Lowest</span>}
                            </div>
                            {bid.notes && <small>{bid.notes}</small>}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .bookings-section {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .bookings-section h2 {
          margin-top: 0;
          color: #2c3e50;
          font-size: 1.8rem;
          padding-bottom: 1rem;
          border-bottom: 3px solid linear-gradient(135deg, #667eea, #764ba2);
        }

        .no-bookings {
          text-align: center;
          padding: 3rem;
          color: #6c757d;
        }

        .no-bookings p {
          font-size: 1.1rem;
          margin: 0.5rem 0;
        }

        .bookings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 2rem;
        }

        .booking-card.enhanced {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          border-left: 4px solid #667eea;
          transition: all 0.3s ease;
        }

        .booking-card.enhanced:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f8f9fa;
        }

        .booking-header h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.2rem;
        }

        .booking-type {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .booking-type.emergency {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
        }

        .booking-type.scheduled {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
        }

        .route-info {
          margin-bottom: 1.5rem;
        }

        .location {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .location .icon {
          font-size: 1.5rem;
        }

        .location strong {
          display: block;
          color: #495057;
          margin-bottom: 0.3rem;
        }

        .location p {
          margin: 0;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .route-arrow {
          text-align: center;
          font-size: 1.2rem;
          margin: 0.5rem 0;
        }

        .booking-details {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .booking-details p {
          margin: 0.5rem 0;
          color: #5a6c7d;
          font-size: 0.9rem;
        }

        .booking-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .accept-btn, .bid-btn, .view-bids-btn {
          flex: 1;
          min-width: 100px;
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .accept-btn {
          background: linear-gradient(135deg, #27ae60, #2ecc71);
          color: white;
        }

        .bid-btn {
          background: linear-gradient(135deg, #f39c12, #e67e22);
          color: white;
        }

        .view-bids-btn {
          background: linear-gradient(135deg, #9b59b6, #8e44ad);
          color: white;
        }

        .accept-btn:hover, .bid-btn:hover, .view-bids-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .accept-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .bids-display {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 2px solid #f8f9fa;
        }

        .bids-display h4 {
          margin: 0 0 1rem 0;
          color: #2c3e50;
          font-size: 1rem;
        }

        .bids-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .bid-item {
          background: #f8f9fa;
          padding: 0.8rem;
          border-radius: 8px;
          border-left: 3px solid #e9ecef;
        }

        .bid-item.lowest {
          background: linear-gradient(135deg, #e8f5e8, #d4edda);
          border-left-color: #27ae60;
        }

        .bid-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.3rem;
        }

        .badge {
          background: #27ae60;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .bid-item small {
          color: #6c757d;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .bookings-grid {
            grid-template-columns: 1fr;
          }

          .booking-actions {
            flex-direction: column;
          }

          .accept-btn, .bid-btn, .view-bids-btn {
            flex: none;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}

// My Bids Tab Component
function MyBidsTab({ bids, onRefresh }) {
  return (
    <section className="my-bids-section">
      <div className="section-header">
        <h2>💰 My Bids</h2>
        <button onClick={onRefresh} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {bids.length === 0 ? (
        <div className="no-bids">
          <p>📭 You haven't placed any bids yet.</p>
          <p>Browse available bookings to start bidding!</p>
        </div>
      ) : (
        <div className="bids-grid">
          {bids.map(bid => (
            <div key={bid.id} className="bid-card">
              <div className="bid-header">
                <h3>🚑 Booking #{bid.booking_id}</h3>
                <div className="bid-amount">৳{bid.bid_amount}</div>
              </div>
              
              <div className="bid-details">
                <p><strong>📅 Submitted:</strong> {new Date(bid.created_at).toLocaleString()}</p>
                <p><strong>📝 Status:</strong> 
                  <span className={`status-badge ${bid.status}`}>{bid.status}</span>
                </p>
                {bid.notes && <p><strong>💬 Notes:</strong> {bid.notes}</p>}
              </div>

              <div className="bid-status">
                {bid.is_winner ? (
                  <div className="status-indicator winner">
                    🏆 <span>Winning Bid!</span>
                  </div>
                ) : bid.status === 'approved' ? (
                  <div className="status-indicator approved">
                    ✅ <span>Approved</span>
                  </div>
                ) : (
                  <div className="status-indicator pending">
                    ⏳ <span>Pending Review</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .my-bids-section {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 3px solid #f8f9fa;
        }

        .section-header h2 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.8rem;
        }

        .refresh-btn {
          background: linear-gradient(135deg, #3498db, #2980b9);
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
          box-shadow: 0 4px 15px rgba(52,152,219,0.3);
        }

        .no-bids {
          text-align: center;
          padding: 3rem;
          color: #6c757d;
        }

        .no-bids p {
          font-size: 1.1rem;
          margin: 0.5rem 0;
        }

        .bids-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .bid-card {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          border-left: 4px solid #f39c12;
          transition: all 0.3s ease;
        }

        .bid-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.12);
        }

        .bid-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f8f9fa;
        }

        .bid-header h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.1rem;
        }

        .bid-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f39c12;
        }

        .bid-details {
          margin-bottom: 1.5rem;
        }

        .bid-details p {
          margin: 0.5rem 0;
          color: #5a6c7d;
          font-size: 0.9rem;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.pending {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.approved {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.rejected {
          background: #f8d7da;
          color: #721c24;
        }

        .bid-status {
          padding-top: 1rem;
          border-top: 2px solid #f8f9fa;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 12px 16px;
          border-radius: 10px;
          font-weight: 600;
        }

        .status-indicator.winner {
          background: linear-gradient(135deg, #f39c12, #e67e22);
          color: white;
        }

        .status-indicator.approved {
          background: linear-gradient(135deg, #27ae60, #2ecc71);
          color: white;
        }

        .status-indicator.pending {
          background: linear-gradient(135deg, #95a5a6, #7f8c8d);
          color: white;
        }

        @media (max-width: 768px) {
          .bids-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
        }
      `}</style>
    </section>
  );
}

// Profile Tab Component
function ProfileTab({ driver, isDemoMode }) {
  return (
    <section className="profile-section">
      <h2>👤 Driver Profile</h2>
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-info">
            <div className="info-item">
              <strong>📛 Name:</strong>
              <span>{driver.full_name}</span>
            </div>
            <div className="info-item">
              <strong>📱 Phone:</strong>
              <span>{driver.phone_number}</span>
            </div>
            <div className="info-item">
              <strong>✉️ Email:</strong>
              <span>{driver.email || 'Not provided'}</span>
            </div>
            <div className="info-item">
              <strong>✅ Verification Status:</strong>
              <span className={`status ${driver.is_phone_verified ? 'verified' : 'unverified'}`}>
                {driver.is_phone_verified ? '✅ Verified' : '❌ Unverified'}
              </span>
            </div>
            {isDemoMode && (
              <div className="info-item">
                <strong>🔧 Mode:</strong>
                <span className="demo-indicator">Demo Mode - Backend Unavailable</span>
              </div>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <h3>📊 Quick Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">Total Rides</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">Completed Bookings</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">৳0</div>
              <div className="stat-label">Total Earnings</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5.0</div>
              <div className="stat-label">Rating</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-section {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .profile-section h2 {
          margin-top: 0;
          color: #2c3e50;
          font-size: 1.8rem;
          padding-bottom: 1rem;
          border-bottom: 3px solid #f8f9fa;
        }

        .profile-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .profile-card {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem;
          background: white;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .info-item strong {
          color: #495057;
          font-size: 0.9rem;
        }

        .info-item span {
          color: #6c757d;
          font-weight: 500;
        }

        .status.verified {
          color: #27ae60;
          font-weight: 600;
        }

        .status.unverified {
          color: #e74c3c;
          font-weight: 600;
        }

        .demo-indicator {
          background: #ffc107;
          color: #212529;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .profile-stats {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .profile-stats h3 {
          margin: 0 0 1.5rem 0;
          color: #2c3e50;
          font-size: 1.2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .stat-item {
          background: white;
          padding: 1rem;
          border-radius: 10px;
          text-align: center;
          border-left: 4px solid #667eea;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #6c757d;
          font-size: 0.9rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .profile-content {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

// Bid Modal Component
function BidModal({ booking, bidAmount, setBidAmount, bidNote, setBidNote, onSubmit, onClose, submitting }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>💰 Place Your Bid</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="modal-body">
          <div className="booking-summary">
            <h4>🚑 Booking #{booking.id}</h4>
            <div className="route-summary">
              <p><strong>📍 From:</strong> {booking.pickup_location}</p>
              <p><strong>🎯 To:</strong> {booking.destination}</p>
              <p><strong>👤 Patient:</strong> {booking.patient_name}</p>
              <p><strong>📏 Distance:</strong> {booking.distance}km</p>
            </div>
          </div>

          <div className="bid-form">
            <div className="form-group">
              <label>💵 Bid Amount (৳)</label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter your competitive bid amount"
                min="0"
                step="10"
              />
              <small>💡 Tip: Lower bids have higher chances of winning</small>
            </div>

            <div className="form-group">
              <label>📝 Notes (Optional)</label>
              <textarea
                value={bidNote}
                onChange={(e) => setBidNote(e.target.value)}
                placeholder="Add any special offers, guarantees, or comments..."
                rows="4"
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="cancel-btn">❌ Cancel</button>
          <button onClick={onSubmit} disabled={submitting} className="submit-btn">
            {submitting ? '⏳ Placing Bid...' : '🚀 Place Bid'}
          </button>
        </div>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .modal-content {
            background: white;
            border-radius: 20px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideUp 0.3s ease-out;
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem;
            border-bottom: 3px solid #f8f9fa;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-radius: 20px 20px 0 0;
          }

          .modal-header h3 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 600;
          }

          .close-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: white;
            padding: 8px;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
          }

          .close-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: rotate(90deg);
          }

          .modal-body {
            padding: 2rem;
          }

          .booking-summary {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            padding: 1.5rem;
            border-radius: 15px;
            margin-bottom: 2rem;
            border-left: 4px solid #667eea;
          }

          .booking-summary h4 {
            margin: 0 0 1rem 0;
            color: #2c3e50;
            font-size: 1.2rem;
          }

          .route-summary p {
            margin: 0.5rem 0;
            color: #5a6c7d;
            font-size: 0.95rem;
          }

          .bid-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }

          .form-group label {
            margin-bottom: 0.8rem;
            font-weight: 600;
            color: #495057;
            font-size: 1rem;
          }

          .form-group input,
          .form-group textarea {
            padding: 15px 20px;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.3s ease;
            font-family: inherit;
          }

          .form-group input:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102,126,234,0.1);
            transform: translateY(-1px);
          }

          .form-group small {
            margin-top: 0.5rem;
            color: #6c757d;
            font-style: italic;
          }

          .modal-footer {
            display: flex;
            gap: 1rem;
            padding: 2rem;
            border-top: 3px solid #f8f9fa;
            background: #f8f9fa;
            border-radius: 0 0 20px 20px;
          }

          .cancel-btn,
          .submit-btn {
            flex: 1;
            padding: 15px 30px;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .cancel-btn {
            background: #6c757d;
            color: white;
          }

          .submit-btn {
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
          }

          .submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .cancel-btn:hover,
          .submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          }

          .cancel-btn:hover {
            background: #5a6268;
          }

          .submit-btn:hover:not(:disabled) {
            background: linear-gradient(135deg, #229954, #28b463);
          }

          @media (max-width: 768px) {
            .modal-content {
              width: 95%;
              margin: 1rem;
            }

            .modal-header,
            .modal-body,
            .modal-footer {
              padding: 1.5rem;
            }

            .modal-footer {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
