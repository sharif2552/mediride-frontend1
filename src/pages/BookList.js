// src/pages/BookList.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function BookList() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token) {
      router.push("/login/userLogin");
      return;
    }
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
    
    fetchBookings();
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownVisible && !event.target.closest('.login-wrapper')) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownVisible]);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    setDropdownVisible(false);
    router.push("/");
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view your bookings");
        setLoading(false);
        return;
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${API_BASE_URL}/api/bookings/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else if (response.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else {
        setError("Failed to load bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Network error. Please try again.");
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
              <input type="text" placeholder="Search" />
            </div>
          </div>
          
          {/* Login/Profile Button with Dropdown */}
          <div className="login-wrapper">
            {isLoggedIn ? (
              <>
                <button className="profile-btn" onClick={toggleDropdown}>
                  👤 {user?.full_name || 'Profile'}
                </button>
                {dropdownVisible && (
                  <div className="dropdown">
                    <Link href="/profile" className="dropdown-item" onClick={() => setDropdownVisible(false)}>
                      👤 View Profile
                    </Link>
                    <Link href="/" className="dropdown-item" onClick={() => setDropdownVisible(false)}>
                      🏠 Home
                    </Link>
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <button className="login-btn" onClick={toggleDropdown}>
                  Login
                </button>
                {dropdownVisible && (
                  <div className="dropdown">
                    <Link href="/login/userLogin" className="dropdown-item">
                      Login as User
                    </Link>
                    <Link href="/login/driver-login" className="dropdown-item">
                      Login as Driver
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </header>

        <h1 className="booked-list-title">
          Booked Ambulance List
        </h1>

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">Loading bookings...</div>
        ) : (
          <div className="booked-list">
            {bookings.length === 0 ? (
              <div className="no-bookings">
                <p>No bookings found.</p>
                <Link href="/instant-book">
                  <button className="secondary-btn">Make a Booking</button>
                </Link>
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="booked-item">
                  <div className="booking-info">
                    <div className="booking-header">
                      <span className="patient-name">{booking.patient_name}</span>
                      <span className={`status ${booking.status}`}>{booking.status}</span>
                    </div>
                    <div className="booking-details">
                      <div className="location-info">
                        <strong>From:</strong> {booking.pickup_location}
                      </div>
                      <div className="location-info">
                        <strong>To:</strong> {booking.dropoff_location}
                      </div>
                      <div className="booking-date">
                        <strong>Booked:</strong> {formatDate(booking.created_at)} at {formatTime(booking.created_at)}
                      </div>
                      <div className="booking-type">
                        <strong>Type:</strong> {booking.is_instant ? 'Instant Booking' : 'Scheduled Booking'}
                      </div>
                      {booking.scheduled_time && (
                        <div className="scheduled-time">
                          <strong>Scheduled for:</strong> {formatDate(booking.scheduled_time)} at {formatTime(booking.scheduled_time)}
                        </div>
                      )}
                      <div className="phone-info">
                        <strong>Contact:</strong> {booking.patient_phone}
                      </div>
                    </div>
                  </div>
                  <div className="booking-actions">
                    <Link href={`/booking-details/${booking.id}`}>
                      <button className="details-btn">View Details</button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
