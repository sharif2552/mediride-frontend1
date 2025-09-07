// src/pages/admin/bid-management.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function BidManagement() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBids, setLoadingBids] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [approvingBid, setApprovingBid] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('adminUser');
    const token = localStorage.getItem('adminToken');

    if (!adminData || !token) {
      router.replace('/admin/login');
      return;
    }

    try {
      const parsedAdmin = JSON.parse(adminData);
      setAdmin(parsedAdmin);
      fetchBookingsWithBids();
    } catch (error) {
      console.error('Error parsing admin data:', error);
      router.replace('/admin/login');
    }
  }, [router]);

  const fetchBookingsWithBids = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      
      const response = await fetch(`${apiBaseUrl}/api/bookings/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.filter(booking => booking.status === 'open' || booking.status === 'pending'));
      } else {
        console.error('Failed to fetch bookings');
        // Demo data for testing
        setBookings([
          {
            id: 1,
            patient_name: "John Doe",
            pickup_location: "Dhaka Medical College Hospital",
            destination: "United Hospital, Gulshan",
            booking_type: "Emergency",
            status: "open",
            created_at: new Date().toISOString(),
            estimated_fare: 500,
            user: {
              full_name: "Ahmed Rahman",
              phone_number: "+8801712345678"
            }
          },
          {
            id: 2,
            patient_name: "Jane Smith", 
            pickup_location: "Square Hospital",
            destination: "Apollo Hospital",
            booking_type: "Scheduled",
            status: "pending",
            created_at: new Date().toISOString(),
            estimated_fare: 350,
            user: {
              full_name: "Fatima Khatun",
              phone_number: "+8801987654321"
            }
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
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
            booking_id: bookingId,
            driver: {
              full_name: "Driver Ahmed",
              phone_number: "+8801712345678",
              rating: 4.8,
              total_rides: 245,
              license_number: "DH-123456"
            },
            amount: 450,
            note: "Experienced driver with medical emergency experience. Available immediately.",
            created_at: new Date().toISOString(),
            status: "pending"
          },
          {
            id: 2,
            booking_id: bookingId,
            driver: {
              full_name: "Driver Mohammad",
              phone_number: "+8801887654321",
              rating: 4.6,
              total_rides: 189,
              license_number: "DH-789012"
            },
            amount: 380,
            note: "Quick and safe transport guaranteed. Special care for patients.",
            created_at: new Date().toISOString(),
            status: "pending"
          },
          {
            id: 3,
            booking_id: bookingId,
            driver: {
              full_name: "Driver Karim",
              phone_number: "+8801555666777",
              rating: 4.9,
              total_rides: 312,
              license_number: "DH-345678"
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

  const approveBid = async (bidId) => {
    setApprovingBid(bidId);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/approve-bid`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bid_id: bidId,
          booking_id: selectedBooking.id
        }),
      });

      if (response.ok) {
        alert('Bid approved successfully! Booking has been assigned to the driver.');
        closeBidsModal();
        fetchBookingsWithBids(); // Refresh bookings list
      } else {
        alert('Failed to approve bid. Please try again.');
      }
    } catch (error) {
      console.error('Error approving bid:', error);
      alert('Error approving bid. Please try again.');
    } finally {
      setApprovingBid(null);
    }
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
        <p>Loading bid management...</p>
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
    <div className="bid-management-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <Link href="/admin/dashboard" className="back-btn">← Admin Dashboard</Link>
          <h1>🏆 Bid Management</h1>
          <div className="admin-info">
            <span>Admin: {admin?.full_name}</span>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>{bookings.length}</h3>
              <p>Active Bookings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>{bookings.filter(b => b.status === 'open').length}</h3>
              <p>Open for Bidding</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{bookings.filter(b => b.status === 'pending').length}</h3>
              <p>Pending Approval</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bookings-container">
        <h2>📋 Bookings Requiring Bid Review</h2>
        
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">✅</div>
            <h3>All Caught Up!</h3>
            <p>No bookings requiring bid approval at the moment.</p>
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
                      <strong>Patient:</strong> {booking.patient_name}
                    </div>
                    <div className="meta-item">
                      <strong>Type:</strong> {booking.booking_type}
                    </div>
                    <div className="meta-item">
                      <strong>Requester:</strong> {booking.user?.full_name}
                    </div>
                    <div className="meta-item">
                      <strong>Contact:</strong> {booking.user?.phone_number}
                    </div>
                    <div className="meta-item">
                      <strong>Est. Fare:</strong> ৳{booking.estimated_fare}
                    </div>
                    <div className="meta-item">
                      <strong>Created:</strong> {formatDateTime(booking.created_at)}
                    </div>
                  </div>

                  <div className="booking-actions">
                    <button 
                      onClick={() => viewBids(booking)}
                      className="review-bids-btn"
                    >
                      🔍 Review Bids
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bid Review Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={closeBidsModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🏆 Bid Review - Booking #{selectedBooking.id}</h3>
              <button onClick={closeBidsModal} className="close-btn">✖️</button>
            </div>

            <div className="modal-body">
              <div className="booking-summary">
                <h4>📍 Booking Details</h4>
                <div className="summary-grid">
                  <div><strong>Patient:</strong> {selectedBooking.patient_name}</div>
                  <div><strong>Type:</strong> {selectedBooking.booking_type}</div>
                  <div><strong>From:</strong> {selectedBooking.pickup_location}</div>
                  <div><strong>To:</strong> {selectedBooking.destination}</div>
                  <div><strong>Requester:</strong> {selectedBooking.user?.full_name}</div>
                  <div><strong>Contact:</strong> {selectedBooking.user?.phone_number}</div>
                </div>
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
                  <p>No drivers have placed bids on this booking yet.</p>
                </div>
              ) : (
                <div className="bids-review-section">
                  <h4>🚗 Driver Bids ({bids.length}) - Select Winner</h4>
                  <p className="review-instruction">👆 Review each bid and approve the best driver for this booking.</p>
                  
                  <div className="bids-list">
                    {bids
                      .sort((a, b) => a.amount - b.amount) // Sort by lowest bid first
                      .map((bid, index) => (
                        <div key={bid.id} className={`bid-card ${index === 0 ? 'recommended-bid' : ''}`}>
                          {index === 0 && (
                            <div className="recommended-badge">💡 Lowest Bid</div>
                          )}
                          
                          <div className="bid-header">
                            <div className="driver-info">
                              <h5>👨‍💼 {bid.driver.full_name}</h5>
                              <div className="driver-stats">
                                <span className="rating">⭐ {bid.driver.rating}</span>
                                <span className="rides">🚗 {bid.driver.total_rides} rides</span>
                                <span className="license">🪪 {bid.driver.license_number}</span>
                              </div>
                              <div className="contact-info">
                                <span className="phone">📞 {bid.driver.phone_number}</span>
                              </div>
                            </div>
                            <div className="bid-amount">
                              <strong>৳{bid.amount}</strong>
                              <small>Bid Amount</small>
                            </div>
                          </div>

                          {bid.note && (
                            <div className="bid-note">
                              <strong>💬 Driver&apos;s Note:</strong>
                              <p>{bid.note}</p>
                            </div>
                          )}

                          <div className="bid-actions">
                            <div className="bid-meta">
                              <span>🕒 {formatDateTime(bid.created_at)}</span>
                              <span className="bid-status">{bid.status}</span>
                            </div>
                            <button 
                              onClick={() => approveBid(bid.id)}
                              disabled={approvingBid === bid.id}
                              className="approve-btn"
                            >
                              {approvingBid === bid.id ? '⏳ Approving...' : '✅ Approve & Assign'}
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={closeBidsModal} className="close-modal-btn">
                ❌ Close Review
              </button>
              <div className="approval-note">
                <small>💡 Approving a bid will assign the booking to that driver and notify all parties.</small>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .bid-management-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 0;
        }

        .admin-header {
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 1.5rem 2rem;
          margin-bottom: 2rem;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
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

        .admin-header h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 2rem;
        }

        .admin-info {
          color: #666;
          font-weight: 500;
        }

        .stats-section {
          max-width: 1400px;
          margin: 0 auto 2rem;
          padding: 0 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .stat-icon {
          font-size: 2.5rem;
        }

        .stat-info h3 {
          margin: 0;
          font-size: 2rem;
          color: #2c3e50;
        }

        .stat-info p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .bookings-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem 2rem;
        }

        .bookings-container h2 {
          color: white;
          margin-bottom: 2rem;
          text-align: center;
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

        .bookings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
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
          gap: 0.8rem;
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

        .review-bids-btn {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
        }

        .review-bids-btn:hover {
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
          background: rgba(0,0,0,0.8);
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
          max-width: 900px;
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

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.8rem;
        }

        .summary-grid div {
          color: #666;
          font-size: 0.9rem;
        }

        .summary-grid strong {
          color: #2c3e50;
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

        .bids-review-section h4 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .review-instruction {
          color: #666;
          font-style: italic;
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

        .bid-card.recommended-bid {
          border-color: #28a745;
          background: linear-gradient(135deg, #d4edda, #c3e6cb);
        }

        .recommended-badge {
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

        .bid-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .driver-info h5 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
        }

        .driver-stats {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 0.5rem;
        }

        .driver-stats span {
          font-size: 0.85rem;
          color: #666;
        }

        .contact-info span {
          font-size: 0.85rem;
          color: #666;
        }

        .bid-amount {
          text-align: center;
        }

        .bid-amount strong {
          font-size: 1.8rem;
          color: #28a745;
          display: block;
        }

        .bid-amount small {
          color: #666;
          font-size: 0.8rem;
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

        .bid-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .bid-meta {
          display: flex;
          gap: 1rem;
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

        .approve-btn {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .approve-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(40,167,69,0.3);
        }

        .approve-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-top: 1px solid #e9ecef;
          background: #f8f9fa;
          border-radius: 0 0 20px 20px;
        }

        .close-modal-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .close-modal-btn:hover {
          background: #5a6268;
          transform: translateY(-2px);
        }

        .approval-note {
          color: #666;
          font-style: italic;
          max-width: 300px;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .bookings-grid {
            grid-template-columns: 1fr;
          }

          .booking-meta {
            grid-template-columns: 1fr;
          }

          .summary-grid {
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

          .bid-header {
            flex-direction: column;
            gap: 1rem;
          }

          .driver-stats {
            justify-content: center;
          }

          .bid-actions {
            flex-direction: column;
            gap: 1rem;
          }

          .modal-footer {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
