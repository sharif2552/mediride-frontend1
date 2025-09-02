"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ChangePassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login/userLogin");
    }
  }, [router]);

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
      setError("New passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.new_password.length < 8) {
      setError("New password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      
      const res = await fetch(`${API_BASE_URL}/accounts/change-password/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_password: formData.old_password,
          new_password: formData.new_password,
          new_password_confirm: formData.confirm_password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Password changed successfully!");
        setFormData({
          old_password: "",
          new_password: "",
          confirm_password: ""
        });
      } else if (res.status === 401) {
        // Token expired, redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login/userLogin");
      } else {
        console.error("Password change failed:", res.status, data);
        if (data.old_password) {
          setError(data.old_password[0]);
        } else if (data.new_password) {
          setError(data.new_password[0]);
        } else if (data.new_password_confirm) {
          setError(data.new_password_confirm[0]);
        } else if (data.non_field_errors) {
          setError(data.non_field_errors[0]);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError(data.message || `Failed to change password (Status: ${res.status})`);
        }
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setError("Network error. Please try again.");
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
            Change <span className="highlight">Password</span>
          </h1>
          <p style={{ color: "#666", marginTop: "0.5rem", fontSize: "14px" }}>
            Enter your current password and choose a new one
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
            <label>Current Password</label>
            <input
              type="password"
              name="old_password"
              placeholder="Enter your current password"
              value={formData.old_password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
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
            <small style={{ color: "#666", fontSize: "12px" }}>
              Must be at least 8 characters long
            </small>
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
            {isLoading ? "Changing..." : "Change Password"}
          </button>

          <div className="inline-buttons">
            <Link href="/profile" passHref legacyBehavior>
              <a className="green-btn">← Back to Profile</a>
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
