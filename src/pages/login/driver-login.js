"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DriverLogin() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/accounts/login/user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();

        // Store token in localStorage (or cookies if you prefer)
        localStorage.setItem("driverToken", data.access || data.token);

        // Redirect to driver dashboard (adjust path as needed)
        router.replace("/driver/dashboard");
      } else {
        const errorData = await res.json().catch(() => null);
        setError(errorData ? JSON.stringify(errorData) : "Login failed");
      }
    } catch (err) {
      setError("Request failed: " + err.message);
    }
  };

  return (
    <div className="container">
      {/* Left Panel */}
      <section className="left-panel">
        <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="logo" />
        <p className="tagline">
          Welcome back, drive safe and serve with care.
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
            Driver <span className="highlight">Login</span>
          </h1>
          <img
            src="/assets/logo.png"
            alt="MEDIRIDE Logo"
            className="login-logo"
          />
        </div>

        {error && <p className="error">{error}</p>}

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="secondary-btn login-btn">
            Login
          </button>

          <Link href="/signup/driverSignUp" className="back-login-btn">
            ← Back to Driver Sign Up
          </Link>
        </form>
      </section>
    </div>
  );
}
