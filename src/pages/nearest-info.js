// src/pages/nearest-info.js
import React from 'react';
import Link from 'next/link';
import '../styles/globals.css';

export default function NearestInfo() {
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
            <img src="/assets/Formal photo.jpg" alt="Profile" className="profile-pic" />
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search Hospitals or Doctors" />
            </div>
          </div>
        </header>

        <h1 className="welcome">
          Nearest <span className="highlight">Hospital & <span className="ride">Doctor Info</span></span>
        </h1>

        <div className="info-list">
          {/* Example cards — Replace with dynamic or API-based content */}
          <div className="info-card">
            <h3>Dhaka Medical College Hospital</h3>
            <p>Location: Dhaka, Bangladesh</p>
            <p>Contact: +880 1234 567890</p>
          </div>

          <div className="info-card">
            <h3>Dr. Arif Hossain (Cardiologist)</h3>
            <p>Chamber: Square Hospital</p>
            <p>Time: 10 AM - 1 PM</p>
          </div>

          <div className="info-card">
            <h3>United Hospital Ltd.</h3>
            <p>Location: Gulshan, Dhaka</p>
            <p>24/7 Emergency Available</p>
          </div>
        </div>
      </section>
    </div>
  );
}
