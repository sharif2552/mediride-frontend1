import React from 'react';
import Link from 'next/link';
import '../../styles/globals.css'; // Adjusted path to reach globals.css

export default function UserSignUp() {
  return (
    <div className="container">
      {/* Left Panel */}
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

      {/* Right Panel - Sign Up Form */}
      <section className="right-panel">
        <div className="login-header">
          <h1 className="welcome">
            Create <span className="highlight">Account</span>
          </h1>
          <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="login-logo" />
        </div>

        <form className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your full name" required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" placeholder="Enter your phone number" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter password" required />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="Re-type password" required />
          </div>

          <button type="submit" className="secondary-btn login-btn">
            Register
          </button>

          <Link href="/login/userLogin">
            <button type="button" className="back-login-btn">← Back to Login</button>
          </Link>
        </form>
      </section>
    </div>
  );
}
