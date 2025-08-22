// src/pages/index.js
import React, { useState } from 'react';
import '../styles/globals.css';
import Link from 'next/link';

export default function Home() {
  // State for managing dropdown visibility
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Handle role selection
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setDropdownVisible(false); // Hide dropdown after selection
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
      </section>

      {/* Right Section */}
      <section className="right-panel">
        <header className="header">
          <div className="profile-search-wrapper">
            <img src="/assets/Formal photo.jpg" alt="Profile" className="profile-pic" />
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search" />
            </div>
          </div>
          
          {/* Login Button with Dropdown */}
          <div className="login-wrapper">
            <button className="login-btn" onClick={toggleDropdown}>
              Login
            </button>
            {dropdownVisible && (
              <div className="dropdown">
                <Link href="/login/userLogin">
                  <button className="dropdown-item" onClick={() => handleRoleSelect('user')}>
                    Login as User
                  </button>
                </Link>
                <Link href="/login/driver-login">
                  <button className="dropdown-item" onClick={() => handleRoleSelect('driver')}>
                    Login as Driver
                  </button>
                </Link>
              </div>
            )}
          </div>
        </header>

        <h1 className="welcome">
          Welcome to <span className="highlight">MEDI<span className="ride">RIDE</span></span>
        </h1>

        <div className="action-grid">
          <div className="action-item">
            <img src="/assets/instant.gif" alt="Instant Book" className="action-img" />
            <Link href="/instant-book">
              <button className="secondary-btn">Instant Book</button>
            </Link>
          </div>

          <div className="action-item">
            <img src="/assets/Booking.png" alt="Book for Later" className="action-img" />
            <Link href="/book-later">
              <button className="secondary-btn">Book For Later</button>
            </Link>
          </div>

          <div className="action-item">
            <img src="/assets/List.png" alt="Book for Later" className="action-img" />
            <Link href="/BookList">
              <button className="secondary-btn">List of Booked</button>
            </Link>
          </div>

          <div className="action-item wide">
            <img src="/assets/hospital.png" alt="Hospital Info" className="action-img" />
            <Link href="/nearest-info">
              <button className="secondary-btn">
                Info on Nearest Hospital & Doctor
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
