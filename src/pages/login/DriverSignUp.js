"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Tagline() {
  const [text, setText] = useState("");

  useEffect(() => {
    // Detect browser language and set tagline on client
    const lang = navigator.language || "en";
    if (lang.startsWith("bn")) {
      setText("আপনার প্রয়োজন, আমাদের অগ্রাধিকার, যে কোনো সময়, কোথাও, প্রস্তুত");
    } else {
      setText("Drive with pride, serve with care. Ready anytime, anywhere.");
    }
  }, []);

  return <p className="tagline">{text}</p>;
}

export default function DriverSignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    license_number: "",
    password: "",
    password_confirm: "",
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

    if (formData.password !== formData.password_confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/accounts/register/driver/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.replace("/login/driverLogin");
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
        <Tagline />
        <button className="primary-btn">
          <img src="/assets/call-icon.png" alt="Call Icon" className="icon" />
          Call Now
        </button>
      </section>

      {/* Right Panel */}
      <section className="right-panel">
        <div className="login-header">
          <h1 className="welcome">
            Driver <span className="highlight">Sign Up</span>
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
              placeholder="Enter full name"
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
              placeholder="Enter email"
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
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="form-group">
            <label>License Number</label>
            <input
              type="text"
              name="license_number"
              value={formData.license_number}
              onChange={handleChange}
              placeholder="Enter license number"
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

          <Link href="/login/driverLogin" className="back-login-btn">
            ← Back to Driver Login
          </Link>
        </form>
      </section>
    </div>
  );
}
