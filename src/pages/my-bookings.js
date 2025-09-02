// src/pages/my-bookings.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bids, setBids] = useState([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      router.replace('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchMyBookings();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.replace('/login');
    }
  }, [router]);

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      
      const response = await fetch(`${apiBaseUrl}/api/bookings/my-bookings/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        console.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Demo data for testing
      setBookings([
        {
          id: 1,
          pickup_location: "Dhaka Medical College Hospital",
          destination: "United Hospital, Gulshan",
          booking_type: "Emergency",
          status: "open",
          created_at: new Date().toISOString(),
          estimated_fare: 500,
          patient_name: "John Doe"
        },
        {
          id: 2,
          pickup_location: "Square Hospital",
          destination: "Apollo Hospital",
          booking_type: "Scheduled",
          status: "pending",
          created_at: new Date().toISOString(),
          estimated_fare: 350,
          patient_name: "Jane Smith"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBidsForBooking = async (bookingId) => {
    setLoadingBids(true);
    try {
      const response = await fetch(`/api/bids?booking_id=${bookingId}`);
      if (response.ok) {
        const data = await response.json();
        setBids(data.bids || []);
      } else {
        // Demo bids data
        setBids([
          {
            id: 1,
            driver: {
              full_name: "Ahmed Rahman",
              phone_number: "+8801712345678",
              rating: 4.8,
              total_rides: 245
            },
            amount: 450,
            note: "Experienced driver with medical emergency experience. Available immediately.",
            created_at: new Date().toISOString(),
            status: "pending"
          },
          {
            id: 2,
            driver: {
              full_name: "Mohammad Ali",
              phone_number: "+8801887654321",
              rating: 4.6,
              total_rides: 189
            },
            amount: 380,
            note: "Quick and safe transport guaranteed. Special care for patients.",
            created_at: new Date().toISOString(),
            status: "pending"
          },
          {
            id: 3,
            driver: {
              full_name: "Karim Uddin",
              phone_number: "+8801555666777",
              rating: 4.9,
              total_rides: 312
            },
            amount: 420,
            note: "Professional medical transport service with oxygen support available.",
            created_at: new Date().toISOString(),
            status: "pending"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoadingBids(false);
    }
  };

  const viewBids = (booking) => {
    setSelectedBooking(booking);
    fetchBidsForBooking(booking.id);
  };

  const closeBidsModal = () => {
    setSelectedBooking(null);
    setBids([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#28a745';
      case 'pending': return '#ffc107';
      case 'confirmed': return '#17a2b8';
      case 'completed': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">🔄</div>
        <p>Loading your bookings...</p>
        <style jsx>{`
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
        `}</style>
      </div>
    );
  }

  return (
    <div className="my-bookings-container">
      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <Link href="/dashboard" className="back-btn">← Back to Dashboard</Link>
          <h1>📋 My Bookings</h1>
          <div className="user-info">
            <span>Welcome, {user?.full_name}</span>
          </div>
        </div>
      </header>

      {/* Bookings List */}
      <div className="bookings-container">
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">📝</div>
            <h3>No Bookings Yet</h3>
            <p>You haven't made any bookings yet.</p>
            <Link href="/book-now" className="book-now-btn">
              🚑 Book Your First Ride
            </Link>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3>🚑 Booking #{booking.id}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(booking.status) }}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="route-info">
                    <div className="location-item">
                      <span className="location-icon">📍</span>
                      <div>
                        <strong>Pickup:</strong>
                        <p>{booking.pickup_location}</p>
                      </div>
                    </div>
                    <div className="route-arrow">➡️</div>
                    <div className="location-item">
                      <span className="location-icon">🏥</span>
                      <div>
                        <strong>Destination:</strong>
                        <p>{booking.destination}</p>
                      </div>
                    </div>
                  </div>

                  <div className="booking-meta">
                    <div className="meta-item">
                      <strong>Type:</strong> {booking.booking_type}
                    </div>
                    <div className="meta-item">
                      <strong>Patient:</strong> {booking.patient_name}
                    </div>
                    <div className="meta-item">
                      <strong>Estimated Fare:</strong> ৳{booking.estimated_fare}
                    </div>
                    <div className="meta-item">
                      <strong>Created:</strong> {formatDateTime(booking.created_at)}
                    </div>
                  </div>

                  <div className="booking-actions">
                    <button 
                      onClick={() => viewBids(booking)}
                      className="view-bids-btn"
                    >
                      👁️ View Bids
                    </button>
                    <Link href={`/booking-details/${booking.id}`} className="details-btn">
                      📄 View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bids Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={closeBidsModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>💰 Bids for Booking #{selectedBooking.id}</h3>
              <button onClick={closeBidsModal} className="close-btn">✖️</button>
            </div>

            <div className="modal-body">
              <div className="booking-summary">
                <h4>📍 Route Summary</h4>
                <p><strong>From:</strong> {selectedBooking.pickup_location}</p>
                <p><strong>To:</strong> {selectedBooking.destination}</p>
                <p><strong>Type:</strong> {selectedBooking.booking_type}</p>
              </div>

              {loadingBids ? (
                <div className="loading-bids">
                  <div className="loading-spinner">🔄</div>
                  <p>Loading bids...</p>
                </div>
              ) : bids.length === 0 ? (
                <div className="no-bids">
                  <div className="no-bids-icon">💭</div>
                  <h4>No Bids Yet</h4>
                  <p>No drivers have placed bids on this booking yet. Please wait for drivers to respond.</p>
                </div>
              ) : (
                <div className="bids-list">
                  <h4>🚗 Driver Bids ({bids.length})</h4>
                  {bids
                    .sort((a, b) => a.amount - b.amount) // Sort by lowest bid first
                    .map((bid, index) => (
                      <div key={bid.id} className={`bid-card ${index === 0 ? 'lowest-bid' : ''}`}>
                        {index === 0 && (
                          <div className="lowest-badge">🏆 Lowest Bid</div>
                        )}
                        
                        <div className="driver-info">
                          <div className="driver-details">
                            <h5>👨‍💼 {bid.driver.full_name}</h5>
                            <div className="driver-stats">
                              <span className="rating">⭐ {bid.driver.rating}</span>
                              <span className="rides">🚗 {bid.driver.total_rides} rides</span>
                              <span className="phone">📞 {bid.driver.phone_number}</span>
                            </div>
                          </div>
                          <div className="bid-amount">
                            <strong>৳{bid.amount}</strong>
                          </div>
                        </div>

                        {bid.note && (
                          <div className="bid-note">
                            <strong>💬 Note:</strong>
                            <p>{bid.note}</p>
                          </div>
                        )}

                        <div className="bid-meta">
                          <span>🕒 {formatDateTime(bid.created_at)}</span>
                          <span className="bid-status">{bid.status}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={closeBidsModal} className="close-modal-btn">
                ✖️ Close
              </button>
              <button className="contact-admin-btn">
                📞 Contact Admin for Approval
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .my-bookings-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 0;
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

        .user-info {
          color: #666;
          font-weight: 500;
        }

        .bookings-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem 2rem;
        }

        .no-bookings {
          text-align: center;
          background: white;
          padding: 4rem 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .no-bookings-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .no-bookings h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .no-bookings p {
          color: #666;
          margin-bottom: 2rem;
        }

        .book-now-btn {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          padding: 15px 30px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
          transition: all 0.3s ease;
        }

        .book-now-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(40,167,69,0.3);
        }

        .bookings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 2rem;
        }

        .booking-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .booking-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .booking-header {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .booking-header h3 {
          margin: 0;
          font-size: 1.3rem;
        }

        .status-badge {
          background: rgba(255,255,255,0.2);
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .booking-details {
          padding: 1.5rem;
        }

        .route-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 12px;
        }

        .location-item {
          flex: 1;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .location-icon {
          font-size: 1.2rem;
          margin-top: 2px;
        }

        .location-item strong {
          display: block;
          color: #2c3e50;
          margin-bottom: 0.25rem;
        }

        .location-item p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .route-arrow {
          font-size: 1.5rem;
          color: #28a745;
        }

        .booking-meta {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .meta-item {
          font-size: 0.9rem;
          color: #666;
        }

        .meta-item strong {
          color: #2c3e50;
        }

        .booking-actions {
          display: flex;
          gap: 1rem;
        }

        .view-bids-btn,
        .details-btn {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-bids-btn {
          background: linear-gradient(135deg, #ffc107, #ff8c00);
          color: white;
        }

        .details-btn {
          background: linear-gradient(135deg, #17a2b8, #20c997);
          color: white;
        }

        .view-bids-btn:hover,
        .details-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .modal-header {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 20px 20px 0 0;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.4rem;
        }

        .close-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: rgba(255,255,255,0.3);
        }

        .modal-body {
          padding: 2rem;
        }

        .booking-summary {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .booking-summary h4 {
          margin: 0 0 1rem 0;
          color: #2c3e50;
        }

        .booking-summary p {
          margin: 0.5rem 0;
          color: #666;
        }

        .loading-bids {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .no-bids {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .no-bids-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .bids-list h4 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
        }

        .bid-card {
          border: 2px solid #e9ecef;
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          position: relative;
          transition: all 0.3s ease;
        }

        .bid-card.lowest-bid {
          border-color: #28a745;
          background: linear-gradient(135deg, #d4edda, #c3e6cb);
        }

        .lowest-badge {
          position: absolute;
          top: -10px;
          right: 15px;
          background: #28a745;
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .driver-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .driver-details h5 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
        }

        .driver-stats {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .driver-stats span {
          font-size: 0.85rem;
          color: #666;
        }

        .bid-amount {
          font-size: 1.5rem;
          color: #28a745;
          font-weight: 700;
        }

        .bid-note {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .bid-note strong {
          display: block;
          margin-bottom: 0.5rem;
          color: #2c3e50;
        }

        .bid-note p {
          margin: 0;
          color: #666;
          font-style: italic;
        }

        .bid-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: #666;
        }

        .bid-status {
          background: #ffc107;
          color: white;
          padding: 3px 10px;
          border-radius: 12px;
          font-weight: 600;
        }

        .modal-footer {
          display: flex;
          gap: 1rem;
          padding: 1.5rem 2rem;
          border-top: 1px solid #e9ecef;
          background: #f8f9fa;
          border-radius: 0 0 20px 20px;
        }

        .close-modal-btn,
        .contact-admin-btn {
          flex: 1;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .close-modal-btn {
          background: #6c757d;
          color: white;
        }

        .contact-admin-btn {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
        }

        .close-modal-btn:hover,
        .contact-admin-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .bookings-grid {
            grid-template-columns: 1fr;
          }

          .booking-meta {
            grid-template-columns: 1fr;
          }

          .route-info {
            flex-direction: column;
            text-align: center;
          }

          .route-arrow {
            transform: rotate(90deg);
          }

          .modal-content {
            margin: 1rem;
            max-height: calc(100vh - 2rem);
          }

          .modal-header,
          .modal-body,
          .modal-footer {
            padding: 1rem;
          }

          .driver-info {
            flex-direction: column;
            gap: 1rem;
          }

          .driver-stats {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
