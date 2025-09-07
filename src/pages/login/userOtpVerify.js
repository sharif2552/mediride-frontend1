"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function UserOtpVerify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${API_BASE_URL}/accounts/verify/email/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          verification_code: code,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        setError(errData ? JSON.stringify(errData) : "OTP verification failed");
        return;
      }

      const data = await res.json();
      console.log("Verified:", data);

      alert("Email verified successfully! You can now log in.");
      router.replace("/login/userLogin");
    } catch (err) {
      setError("Request failed: " + err.message);
    }
  };

  return (
    <div className="container">
      <section className="right-panel">
        <div className="login-header">
          <h1 className="welcome">
            Verify <span className="highlight">Your Email</span>
          </h1>
        </div>

        {error && <p className="error">{error}</p>}

        <form className="form-grid" onSubmit={handleVerify}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Verification Code</label>
            <input
              type="text"
              placeholder="Enter the code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="secondary-btn login-btn">
            Verify
          </button>
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
