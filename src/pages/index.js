// src/pages/index.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  // State for managing dropdown visibility and user authentication
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Error parsing user data:", err);
        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Handle role selection
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setDropdownVisible(false); // Hide dropdown after selection
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    setDropdownVisible(false);
  };

  return (
    <div className="container">
      {/* Left Section */}
      <section className="left-panel">
        <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="logo" />
        <p className="tagline">
          Your need, Our priority, Ready to Response, Anytime Anywhere
        </p>
        <button className="primary-btn">
          <img src="/assets/call-icon.png" alt="Call Icon" className="icon" />
          Call Now
        </button>
      </section>

      {/* Right Section */}
      <section className="right-panel">
        <header className="header">
          <div className="profile-search-wrapper">
            <img
              src="/assets/Formal Photo.jpg"
              alt="Profile"
              className="profile-pic"
            />
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
                  👤 {user?.full_name || "Profile"}
                </button>
                {dropdownVisible && (
                  <div className="dropdown">
                    <Link
                      href="/profile"
                      className="dropdown-item"
                      onClick={() => setDropdownVisible(false)}
                    >
                      👤 View Profile
                    </Link>
                    <Link
                      href="/BookList"
                      className="dropdown-item"
                      onClick={() => setDropdownVisible(false)}
                    >
                      📋 My Bookings
                    </Link>
                    <button
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                    >
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
                    <Link
                      href="/login/userLogin"
                      className="dropdown-item"
                      onClick={() => handleRoleSelect("user")}
                    >
                      Login as User
                    </Link>
                    <Link
                      href="/login/driver-login"
                      className="dropdown-item"
                      onClick={() => handleRoleSelect("driver")}
                    >
                      Login as Driver
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </header>

        <h1 className="welcome">
          Welcome to{" "}
          <span className="highlight">
            MEDI<span className="ride">RIDE</span>
          </span>
        </h1>

        <div className="action-grid">
          <div className="action-item">
            <img
              src="/assets/instant.gif"
              alt="Instant Book"
              className="action-img"
            />
            <Link href="/instant-book">
              <button className="secondary-btn">Instant Book</button>
            </Link>
          </div>

          <div className="action-item">
            <img
              src="/assets/Booking.png"
              alt="Book for Later"
              className="action-img"
            />
            <Link href="/book-later">
              <button className="secondary-btn">Book For Later</button>
            </Link>
          </div>

          <div className="action-item">
            <img
              src="/assets/List.png"
              alt="Book for Later"
              className="action-img"
            />
            <Link href="/BookList">
              <button className="secondary-btn">List of Booked</button>
            </Link>
          </div>

          <div className="action-item">
            <img
              src="/assets/Booking.png"
              alt="Booking Request"
              className="action-img"
            />
            <Link href="/booking-request">
              <button className="secondary-btn">Booking Request</button>
            </Link>
          </div>

          <div className="action-item">
            <img
              src="/assets/List.png"
              alt="Scheduled Bookings"
              className="action-img"
            />
            <Link href="/BookList">
              <button className="secondary-btn">Scheduled Bookings</button>
            </Link>
          </div>

          <div className="action-item wide">
            <img
              src="/assets/hospital.png"
              alt="Hospital Info"
              className="action-img"
            />
            <Link href="/nearest-info">
              <button className="secondary-btn">
                Info on Nearest Hospital & Doctor
              </button>
            </Link>
          </div>

          <div className="action-item">
            <img
              src="/assets/hospital.png"
              alt="All Hospitals"
              className="action-img"
            />
            <Link href="/hospitals">
              <button className="secondary-btn">Browse Hospitals</button>
            </Link>
          </div>

          <div className="action-item">
            <img
              src="/assets/doctor.png"
              alt="All Doctors"
              className="action-img"
            />
            <Link href="/doctors">
              <button className="secondary-btn">Browse Doctors</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
