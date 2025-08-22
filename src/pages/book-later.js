// src/pages/book-later.js
import React from 'react';
import '../styles/globals.css';
import Link from 'next/link';

export default function BookLater() {
  return (
    <div className="container">
      {/* Left Panel (Same as index.js) */}
      <section className="left-panel">
        <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="logo" />
        <p className="tagline">Your need, Our priority, Ready to Response, Anytime Anywhere</p>
        <button className="primary-btn">
          <img src="/assets/call-icon.png" alt="Call Icon" className="icon" />
          Call Now
        </button>
      </section>

      {/* Right Panel */}
      <section className="right-panel">
        <h1 className="welcome">Book <span className="highlight">For Later</span></h1>
        <p className="tagline" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Schedule an ambulance ride in advance by filling the form below.
        </p>

        <form className="form-grid">
          <div className="form-group">
            <label>Full Name:</label>
            <input type="text" placeholder="Enter your name" required />
          </div>

          <div className="form-group">
            <label>Phone Number:</label>
            <input type="tel" placeholder="Enter contact number" required />
          </div>

          <div className="form-group">
            <label>Pickup Address:</label>
            <input type="text" placeholder="Enter pickup location" required />
          </div>

          <div className="form-group">
            <label>Drop-off Hospital:</label>
            <input type="text" placeholder="Enter hospital name" required />
          </div>

          <div className="form-group">
            <label>Preferred Date:</label>
            <input type="date" required />
          </div>

          <div className="form-group">
            <label>Preferred Time:</label>
            <input type="time" required />
          </div>

          <button type="submit" className="secondary-btn submit-btn">
            Schedule Booking
          </button>
        </form>

        <div className="back-home-btn-wrapper">
          <Link href="/">
            <button type="button" className="secondary-btn back-home-btn">
              ← Back to Home
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
