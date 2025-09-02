"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    email: initialEmail,
    reset_code: "",
    new_password: "",
    confirm_password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validate passwords match
    if (formData.new_password !== formData.confirm_password) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.new_password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${API_BASE_URL}/accounts/reset-password/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          reset_code: formData.reset_code,
          new_password: formData.new_password
        }),
      });

      const data = await res.json();
      console.log("Reset password response:", data); // Debug log

      if (res.ok) {
        setSuccess("Password reset successful! Redirecting to login...");
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/login/userLogin");
        }, 2000);
      } else {
        console.error("Reset password error:", data); // Debug log
        // Handle specific error messages from backend
        if (data.email) {
          setError(data.email[0]);
        } else if (data.reset_code) {
          setError(data.reset_code[0]);
        } else if (data.new_password) {
          setError(data.new_password[0]);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError(data.message || "Failed to reset password. Please try again.");
        }
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Right Panel */}
      <section className="right-panel">
        <div className="login-header">
          <h1 className="welcome">
            Reset <span className="highlight">Password</span>
          </h1>
          <p style={{ color: "#666", marginTop: "0.5rem", fontSize: "14px" }}>
            Enter the reset code sent to your email and your new password
          </p>
          <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="login-logo" />
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Reset Code</label>
            <input
              type="text"
              name="reset_code"
              placeholder="Enter the 6-digit reset code"
              value={formData.reset_code}
              onChange={handleChange}
              maxLength="6"
              required
              disabled={isLoading}
            />
            <small style={{ color: "#666", fontSize: "12px" }}>
              Check your email for the reset code
            </small>
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="new_password"
              placeholder="Enter new password"
              value={formData.new_password}
              onChange={handleChange}
              minLength="8"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm new password"
              value={formData.confirm_password}
              onChange={handleChange}
              minLength="8"
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="secondary-btn login-btn"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>

          <div className="inline-buttons">
            <Link href="/login/forgotPassword" passHref legacyBehavior>
              <a className="red-btn">← Back</a>
            </Link>
            <Link href="/login/userLogin" passHref legacyBehavior>
              <a className="green-btn">Login</a>
            </Link>
          </div>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <Link href="/" passHref legacyBehavior>
            <a className="secondary-btn back-home-btn">← Back to Home</a>
          </Link>
        </div>
      </section>
    </div>
  );
}
