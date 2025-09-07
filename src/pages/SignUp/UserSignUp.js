"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserSignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    district_id: 1,
    password: "",
    password_confirm: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "district_id" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.password_confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${API_BASE_URL}/accounts/register/user/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("Signup response status:", res.status);

      if (res.status === 200 || res.status === 201) {
        // ✅ redirect to OTP verify page with email in query
        router.replace(
          `/login/userOtpVerify?email=${encodeURIComponent(formData.email)}`
        );
      } else {
        const errorData = await res.json().catch(() => null);
        setError(errorData ? JSON.stringify(errorData) : "Registration failed");
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
            Create <span className="highlight">Account</span>
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
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

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
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label>District</label>
            <select
              name="district_id"
              value={formData.district_id}
              onChange={handleChange}
              required
            >
              <option value={1}>District 1</option>
              <option value={2}>District 2</option>
              <option value={3}>District 3</option>
            </select>
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

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              placeholder="Re-type password"
              required
            />
          </div>

          <button type="submit" className="secondary-btn login-btn">
            Register
          </button>

          <Link href="/login/userLogin" className="back-login-btn">
            ← Back to Login
          </Link>
        </form>
      </section>
    </div>
  );
}
