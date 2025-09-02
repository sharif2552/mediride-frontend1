// src/pages/verify-phone.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function VerifyPhone() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      router.push("/login/userLogin");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // If phone is already verified, redirect to profile
      if (parsedUser.is_phone_verified) {
        router.push("/profile");
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
      router.push("/login/userLogin");
    }
  }, [router]);

  const sendOTP = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      
      const response = await fetch(`${API_BASE_URL}/accounts/send-phone-otp/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`OTP sent successfully to ${user?.phone_number}`);
        setOtpSent(true);
        setStep(2);
        
        // Show OTP in development mode
        if (data.otp) {
          setSuccess(prev => `${prev}. OTP: ${data.otp}`);
        }
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login/userLogin");
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      
      const response = await fetch(`${API_BASE_URL}/accounts/verify-phone-otp/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Phone number verified successfully!');
        
        // Update user data in localStorage
        const updatedUser = { ...user, is_phone_verified: true };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Redirect to profile after a short delay
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login/userLogin");
      } else {
        setError(data.error || 'Failed to verify OTP');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const resendOTP = () => {
    setOtp('');
    setOtpSent(false);
    setStep(1);
    sendOTP();
  };

  if (!user) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Left Panel */}
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
        <div className="auth-header">
          <h1 className="welcome">
            Verify <span className="highlight">Phone Number</span>
          </h1>
          <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="login-logo" />
        </div>

        <div className="auth-form">
          {step === 1 ? (
            // Step 1: Send OTP
            <div className="verification-step">
              <div className="phone-display">
                <span className="phone-label">Phone Number:</span>
                <span className="phone-number">{user.phone_number}</span>
              </div>
              
              <p className="instruction">
                Click the button below to receive a verification code on your phone number.
              </p>

              {error && (
                <div className="message error">
                  {error}
                </div>
              )}

              {success && (
                <div className="message success">
                  {success}
                </div>
              )}

              <button 
                onClick={sendOTP}
                disabled={isLoading}
                className="submit-btn"
              >
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </div>
          ) : (
            // Step 2: Verify OTP
            <div className="verification-step">
              <div className="phone-display">
                <span className="phone-label">Verification code sent to:</span>
                <span className="phone-number">{user.phone_number}</span>
              </div>

              <div className="form-group">
                <label htmlFor="otp">Enter 6-digit verification code:</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="123456"
                  maxLength="6"
                  className="form-input otp-input"
                  autoComplete="one-time-code"
                />
              </div>

              {error && (
                <div className="message error">
                  {error}
                </div>
              )}

              {success && (
                <div className="message success">
                  {success}
                </div>
              )}

              <div className="form-actions">
                <button 
                  onClick={verifyOTP}
                  disabled={isLoading || otp.length !== 6}
                  className="submit-btn"
                >
                  {isLoading ? 'Verifying...' : 'Verify Phone Number'}
                </button>

                <button 
                  onClick={resendOTP}
                  disabled={isLoading}
                  className="resend-btn"
                >
                  Resend Code
                </button>
              </div>
            </div>
          )}

          <div className="auth-links">
            <Link href="/profile" className="back-link">
              ← Back to Profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
