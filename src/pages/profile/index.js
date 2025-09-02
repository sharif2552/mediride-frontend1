"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    district: ""
  });

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      router.push("/login/userLogin");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsLoggedIn(true);
      setFormData({
        full_name: parsedUser.full_name || "",
        email: parsedUser.email || "",
        phone_number: parsedUser.phone_number || "",
        district: parsedUser.district?.name || ""
      });
    } catch (err) {
      console.error("Error parsing user data:", err);
      router.push("/login/userLogin");
      return;
    }

    fetchProfile();
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownVisible && !event.target.closest('.login-wrapper')) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownVisible]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      
      const res = await fetch(`${API_BASE_URL}/accounts/profile/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setFormData({
          full_name: data.full_name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          district: data.district?.name || ""
        });
      } else if (res.status === 401) {
        handleLogout();
      } else {
        setError("Failed to load profile data");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      
      const res = await fetch(`${API_BASE_URL}/accounts/profile/`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone_number: formData.phone_number
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Profile updated successfully!");
        setUser(data.user);
        setIsEditing(false);
        
        // Update localStorage with new user data
        localStorage.setItem("user", JSON.stringify(data.user));
      } else if (res.status === 401) {
        handleLogout();
      } else {
        if (data.full_name) {
          setError(data.full_name[0]);
        } else if (data.phone_number) {
          setError(data.phone_number[0]);
        } else {
          setError(data.message || "Failed to update profile");
        }
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    setDropdownVisible(false);
    router.push("/");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError("");
    setSuccess("");
    // Reset form data to original values
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        district: user.district?.name || ""
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

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
        <header className="header">
          <div className="profile-search-wrapper">
            <img src="/assets/Formal Photo.jpg" alt="Profile" className="profile-pic" />
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search" />
            </div>
          </div>
          
          {/* Login/Profile Button with Dropdown */}
          <div className="login-wrapper">
            {isLoggedIn ? (
              <>
                <button className="profile-btn" onClick={toggleDropdown}>
                  👤 {user?.full_name || 'Profile'}
                </button>
                {dropdownVisible && (
                  <div className="dropdown">
                    <Link href="/BookList" className="dropdown-item" onClick={() => setDropdownVisible(false)}>
                      📋 My Bookings
                    </Link>
                    <Link href="/" className="dropdown-item" onClick={() => setDropdownVisible(false)}>
                      🏠 Home
                    </Link>
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <button className="login-btn" onClick={toggleDropdown}>
                  Login
                </button>
                {dropdownVisible && (
                  <div className="dropdown">
                    <Link href="/login/userLogin" className="dropdown-item">
                      Login as User
                    </Link>
                    <Link href="/login/driver-login" className="dropdown-item">
                      Login as Driver
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </header>

        <div className="profile-header">
          <h1 className="welcome">
            {isEditing ? "Edit " : ""}
            <span className="highlight">Profile</span>
          </h1>
          <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="login-logo" />
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

        {!isEditing ? (
          // View Mode
          <div className="profile-view">
            <div className="profile-info">
              <div className="info-group">
                <label>Full Name</label>
                <div className="info-value">{user?.full_name}</div>
              </div>

              <div className="info-group">
                <label>Email</label>
                <div className="info-value">{user?.email}</div>
              </div>

              <div className="info-group">
                <label>Phone Number</label>
                <div className="info-value">{user?.phone_number}</div>
              </div>

              <div className="info-group">
                <label>District</label>
                <div className="info-value">{user?.district?.name || "Not specified"}</div>
              </div>

              <div className="info-group">
                <label>Account Status</label>
                <div className="status-badges">
                  <span className={`badge ${user?.is_email_verified ? 'verified' : 'unverified'}`}>
                    Email {user?.is_email_verified ? 'Verified' : 'Unverified'}
                  </span>
                  <span className={`badge ${user?.is_phone_verified ? 'verified' : 'unverified'}`}>
                    Phone {user?.is_phone_verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button 
                className="secondary-btn edit-btn"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>

              <Link href="/profile/change-password" passHref legacyBehavior>
                <a className="blue-btn change-password-btn">
                  🔒 Change Password
                </a>
              </Link>

              {!user?.is_phone_verified && (
                <Link href="/verify-phone" passHref legacyBehavior>
                  <a className="green-btn verify-phone-btn">
                    📱 Verify Phone Number
                  </a>
                </Link>
              )}
              
              <button 
                className="red-btn logout-btn"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        ) : (
          // Edit Mode
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
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Email cannot be changed"
                disabled
                className="disabled-field"
              />
              <small>Email cannot be modified</small>
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
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label>District</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                placeholder="District cannot be changed"
                disabled
                className="disabled-field"
              />
              <small>District cannot be modified</small>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="secondary-btn save-btn"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "💾 Save Changes"}
              </button>
              
              <button 
                type="button" 
                className="gray-btn cancel-btn"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <Link href="/" passHref legacyBehavior>
            <a className="secondary-btn back-home-btn">← Back to Home</a>
          </Link>
        </div>
      </section>
    </div>
  );
}
