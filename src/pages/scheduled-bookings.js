// src/pages/scheduled-bookings.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ScheduledBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScheduledBookings();
  }, []);

  const fetchScheduledBookings = async () => {
    try {
      const response = await fetch('/api/bookings/scheduled-list');
      const data = await response.json();
      
      if (response.ok) {
        setBookings(data);
      } else {
        setError('Failed to load scheduled bookings');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'accepted': return '#28a745';
      case 'completed': return '#17a2b8';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="container">
      {/* Left Section */}
      <section className="left-panel">
        <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="logo" />
        <p className="tagline">Your need, Our priority, Ready to Response, Anytime Anywhere</p>
        <button className="primary-btn">
          <img src="/assets/call-icon.png" alt="Call Icon" className="icon" />
          Call Now
        </button>
        {/* Back to Home Button */}
        <div className="back-to-home">
          <Link href="/">
            <button className="back-home-btn">Back to Home</button>
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
              <input type="text" placeholder="Search scheduled bookings" />
            </div>
          </div>
        </header>

        <h1 className="welcome">
          Scheduled <span className="highlight">Bookings</span>
        </h1>

        <p className="tagline" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          View all your scheduled ambulance bookings
        </p>

        {/* Quick Action - Create New Schedule */}
        <div className="quick-action-section">
          <Link href="/booking-request">
            <button className="create-schedule-btn">
              <span className="plus-icon">+</span>
              Create New Schedule
            </button>
          </Link>
        </div>

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">Loading scheduled bookings...</div>
        ) : (
          <div className="scheduled-bookings-list">
            {bookings.length === 0 ? (
              <div className="no-bookings">
                <div className="empty-state-icon">📅</div>
                <h3>No scheduled bookings found</h3>
                <p>You haven&apos;t scheduled any ambulance bookings yet.</p>
                <div className="empty-state-actions">
                  <Link href="/booking-request">
                    <button className="primary-action-btn">
                      <span className="btn-icon">+</span>
                      Create Your First Schedule
                    </button>
                  </Link>
                  <Link href="/instant-book">
                    <button className="secondary-action-btn">Book Instantly</button>
                  </Link>
                </div>
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="scheduled-booking-item">
                  <div className="booking-info">
                    <div className="booking-header">
                      <span className="patient-name">{booking.patient_name}</span>
                      <span 
                        className="status" 
                        style={{ backgroundColor: getStatusColor(booking.status) }}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <div className="location-info">
                        <strong>From:</strong> {booking.pickup_location}
                      </div>
                      <div className="location-info">
                        <strong>To:</strong> {booking.dropoff_location}
                      </div>
                      <div className="scheduled-time">
                        <strong>Scheduled for:</strong> {formatDateTime(booking.scheduled_time)}
                      </div>
                      <div className="booking-date">
                        <strong>Booked on:</strong> {formatDate(booking.created_at)} at {formatTime(booking.created_at)}
                      </div>
                      <div className="phone-info">
                        <strong>Contact:</strong> {booking.patient_phone}
                      </div>
                      {booking.notes && (
                        <div className="notes-info">
                          <strong>Notes:</strong> {booking.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="booking-actions">
                    <Link href={`/booking-details/${booking.id}`}>
                      <button className="details-btn">View Details</button>
                    </Link>
                    {booking.status === 'pending' && (
                      <Link href={`/booking-request/${booking.id}`}>
                        <button className="edit-btn">Edit Request</button>
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <Link href="/booking-request">
            <button className="secondary-btn">Schedule New Booking</button>
          </Link>
          <Link href="/BookList">
            <button className="secondary-btn">View All Bookings</button>
          </Link>
        </div>

        {/* Floating Action Button for Mobile */}
        <div className="fab-container">
          <Link href="/booking-request">
            <button className="fab" title="Create New Schedule">
              <span className="fab-icon">+</span>
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
