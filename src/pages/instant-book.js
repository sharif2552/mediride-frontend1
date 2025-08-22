// src/pages/instant-book.js
import React from 'react';
import Link from 'next/link';

export default function InstantBook() {
  return (
    <div className="container">
      {/* Left Panel - SAME as index.js */}
      <section className="left-panel">
        <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="logo" />
        <p className="tagline">Your need, Our priority, Ready to Response, Anytime Anywhere</p>
        <button className="primary-btn">
          <img src="/assets/call-icon.png" alt="Call Icon" className="icon" />
          Call Now
        </button>
      </section>

      {/* Right Panel - Custom Booking Form */}
      <section className="right-panel">
        <h1 className="welcome">Instant <span className="highlight">Booking</span></h1>
        <p className="tagline" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Fill out the form below to request an ambulance immediately.
        </p>

        <form className="form-grid">
          <div className="form-group">
            <label>Select Place:</label>
            <input type="text" placeholder="From" required />
          </div>

          <div className="form-group">
            <label>Select Place:</label>
            <input type="text" placeholder="To" required />
          </div>

          <div className="form-group">
            <label>Journey Date:</label>
            <input type="date" required />
          </div>

          <button type="submit" className="secondary-btn submit-btn">
            Confirm Booking
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
