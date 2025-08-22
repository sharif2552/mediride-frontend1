// src/pages/login/driver-login.js
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Importing the useRouter hook


export default function DriverLogin() {
  const [otpSent, setOtpSent] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const router = useRouter(); // Initializing the router

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // You can add validation here for OTP and mobile number
    if (mobileNumber && otp) {
      // If login is successful, navigate to the Driver Dashboard
      router.push('/DriverDashboard'); // Redirect to DriverDashboard
    } else {
      alert('Please enter both mobile number and OTP');
    }
  };

  return (
    <div className="container">
      {/* Left Panel - reused from index.js */}
      <section className="left-panel">
        <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="logo" />
        <p className="tagline">
          আপনার প্রয়োজন, আমাদের অগ্রাধিকার, যে কোন সময়, কোথাও, প্রস্তুত
        </p>
        <button className="primary-btn">
          <img src="/assets/call-icon.png" alt="Call Icon" className="icon" />
          কল করুন
        </button>
      </section>

      {/* Right Panel - Driver Login Form */}
      <section className="right-panel">
        <div className="login-header">
          <h1 className="welcome">
            MEDIRIDE-এ স্বাগতম <span className="highlight">ড্রাইভার</span>
          </h1>
          <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="login-logo" />
        </div>

        <form className="form-grid" onSubmit={handleLogin}>
          <div className="form-group">
            <label>মোবাইল নম্বর</label>
            <input
              type="text"
              placeholder="আপনার মোবাইল নম্বর লিখুন"
              required
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)} // Set mobile number state
            />
          </div>

          {!otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              className="secondary-btn login-btn"
            >
              OTP পাঠান
            </button>
          ) : (
            <div className="form-group">
              <label>OTP</label>
              <input
                type="text"
                placeholder="আপনার OTP কোড লিখুন"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)} // Set OTP state
              />
              <button type="submit" className="secondary-btn login-btn">
                লগ ইন করুন
              </button>
            </div>
          )}

          <div className="social-buttons">
            <button className="social-btn fb-btn">
              <img src="/assets/facebook.png" alt="Facebook Icon" className="social-icon" />
              Facebook দিয়ে প্রবেশ করুন
            </button>
            <button className="social-btn google-btn">
              <img src="/assets/google.png" alt="Google Icon" className="social-icon" />
              Google দিয়ে প্রবেশ করুন
            </button>
          </div>
        </form>

        {/* Home Button */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link href="/" passHref legacyBehavior>
            <a className="secondary-btn back-home-btn">← হোমে ফিরে যান</a>
          </Link>
        </div>
      </section>
    </div>
  );
}
