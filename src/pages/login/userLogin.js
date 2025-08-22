// src/page/login/userLogin.js
import React from 'react';
import Link from 'next/link';


export default function Login() {
  return (
    <div className="container">
      {/* Left Panel - reused from index.js */}
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

      {/* Right Panel - Login Form */}
      <section className="right-panel">
        <div className="login-header">
          <h1 className="welcome">
            Welcome to <span className="highlight">MEDI<span className="ride">RIDE</span></span>
          </h1>
          <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="login-logo" />
        </div>

        <form className="form-grid">
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" className="secondary-btn login-btn">Log in</button>

          <div className="inline-buttons">
            <button type="button" className="red-btn">Forgot Password?</button>
            <Link href="/SignUp/UserSignUp" passHref legacyBehavior>
              <a className="green-btn">Create an account</a>
            </Link>
          </div>
        </form>

        {/* Home Button */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link href="/" passHref legacyBehavior>
            <a className="secondary-btn back-home-btn">← Back to Home</a>
          </Link>
        </div>
      </section>
    </div>
  );
}
