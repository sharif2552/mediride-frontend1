"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetCode, setResetCode] = useState(""); // Store reset code separately

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${API_BASE_URL}/accounts/forgot-password/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log("Forgot password response:", data); // Debug log

      if (res.ok) {
        // In development mode, show the reset code if returned
        if (data.reset_code) {
          setSuccess("Password reset code generated successfully!");
          setResetCode(data.reset_code);
          // Also log it for easy copying
          console.log(`🔑 Reset code for ${email}: ${data.reset_code}`);
          alert(`Your reset code is: ${data.reset_code}\n\nCopy this code for the next page!`);
        } else {
          setSuccess("Password reset code sent to your email. Please check your inbox.");
        }
        
        // Redirect to reset password page after 5 seconds (more time to see the code)
        setTimeout(() => {
          router.push(`/login/resetPassword?email=${encodeURIComponent(email)}`);
        }, 5000);
      } else {
        console.error("Forgot password error:", data); // Debug log
        // Handle specific error messages from backend
        if (data.email) {
          setError(data.email[0]);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError(data.message || "Failed to send reset code. Please try again.");
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
            Forgot <span className="highlight">Password?</span>
          </h1>
          <p style={{ color: "#666", marginTop: "0.5rem", fontSize: "14px" }}>
            Enter your email address and we&apos;ll send you a reset code
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

          {resetCode && (
            <div className="reset-code-display">
              <h3>🔑 Your Reset Code:</h3>
              <div className="reset-code">{resetCode}</div>
              <p>Copy this code to use on the next page!</p>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="secondary-btn login-btn"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Code"}
          </button>

          <div className="inline-buttons">
            <Link href="/login/userLogin" passHref legacyBehavior>
              <a className="green-btn">← Back to Login</a>
            </Link>
            <Link href={`/login/resetPassword?email=${encodeURIComponent(email)}`} passHref legacyBehavior>
              <a className="blue-btn">Go to Reset →</a>
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
