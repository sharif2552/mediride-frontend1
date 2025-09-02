// src/pages/index.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  // State for managing dropdown visibility and user authentication
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Error parsing user data:", err);
        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Handle role selection
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setDropdownVisible(false); // Hide dropdown after selection
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    setDropdownVisible(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
      {/* Modern Navigation */}
      <nav className="nav">
        <div className="container nav-container">
          <Link href="/" className="nav-brand">
            🚑 MEDIRIDE
          </Link>
          
          <div className="flex items-center gap-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="relative md-hidden">
              <input 
                type="text" 
                placeholder="Search hospitals, doctors..." 
                className="input w-64 pl-10 pr-4 py-2"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                🔍
              </div>
            </div>
            
            {/* Login/Profile Section */}
            <div className={`dropdown ${dropdownVisible ? 'open' : ''}`}>
              {isLoggedIn ? (
                <>
                  <button 
                    className="btn btn-ghost dropdown-trigger flex items-center gap-2" 
                    onClick={toggleDropdown}
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      👤
                    </div>
                    <span className="sm-hidden">{user?.full_name || 'Profile'}</span>
                    <span className="text-xs">▼</span>
                  </button>
                  <div className="dropdown-menu">
                    <Link href="/profile" className="dropdown-item" onClick={() => setDropdownVisible(false)}>
                      👤 View Profile
                    </Link>
                    <Link href="/BookList" className="dropdown-item" onClick={() => setDropdownVisible(false)}>
                      📋 My Bookings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item text-error" onClick={handleLogout}>
                      🚪 Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button className="btn btn-primary dropdown-trigger" onClick={toggleDropdown}>
                    Login
                  </button>
                  <div className="dropdown-menu">
                    <Link href="/login/userLogin" className="dropdown-item" onClick={() => handleRoleSelect('user')}>
                      👨‍⚕️ Login as User
                    </Link>
                    <Link href="/login/driver-login" className="dropdown-item" onClick={() => handleRoleSelect('driver')}>
                      🚗 Login as Driver
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content animate-fade-in">
          <h1 className="hero-title">
            Welcome to <span className="text-secondary-300">MEDI</span><span className="text-accent-300">RIDE</span>
          </h1>
          <p className="hero-subtitle">
            Your need, Our priority. Ready to respond, Anytime Anywhere. 
            Fast, reliable emergency medical transportation at your fingertips.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="btn btn-accent btn-lg">
              📞 Emergency Call
            </button>
            <Link href="/instant-book">
              <button className="btn btn-secondary btn-lg">
                🚑 Book Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Our Services</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Choose from our comprehensive range of medical transportation services designed to meet your urgent healthcare needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Instant Book */}
          <div className="card">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚨</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Book</h3>
              <p className="text-neutral-600 mb-4">
                Need immediate medical transport? Book an ambulance instantly for emergency situations.
              </p>
              <Link href="/instant-book">
                <button className="btn btn-primary w-full">Book Instantly</button>
              </Link>
            </div>
          </div>

          {/* Book for Later */}
          <div className="card">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Book for Later</h3>
              <p className="text-neutral-600 mb-4">
                Schedule your medical transport in advance for planned medical appointments.
              </p>
              <Link href="/book-later">
                <button className="btn btn-secondary w-full">Schedule Booking</button>
              </Link>
            </div>
          </div>

          {/* View Bookings */}
          <div className="card">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">My Bookings</h3>
              <p className="text-neutral-600 mb-4">
                Track and manage all your current and past medical transport bookings.
              </p>
              <Link href="/BookList">
                <button className="btn btn-accent w-full">View Bookings</button>
              </Link>
            </div>
          </div>

          {/* Hospital Finder */}
          <div className="card">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Hospitals</h3>
              <p className="text-neutral-600 mb-4">
                Locate the nearest hospitals and get detailed information about their services.
              </p>
              <Link href="/hospitals">
                <button className="btn btn-outline w-full">Browse Hospitals</button>
              </Link>
            </div>
          </div>

          {/* Doctor Directory */}
          <div className="card">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Doctors</h3>
              <p className="text-neutral-600 mb-4">
                Search for qualified doctors by specialty and availability in your area.
              </p>
              <Link href="/doctors">
                <button className="btn btn-outline w-full">Browse Doctors</button>
              </Link>
            </div>
          </div>

          {/* Emergency Info */}
          <div className="card">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Nearest Info</h3>
              <p className="text-neutral-600 mb-4">
                Get instant information about the nearest hospitals and available doctors.
              </p>
              <Link href="/nearest-info">
                <button className="btn btn-outline w-full">Get Info</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Why Choose MEDIRIDE?</h2>
            <p className="text-lg text-neutral-600">
              We&apos;re committed to providing the fastest, most reliable medical transport services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Response</h3>
              <p className="text-neutral-600">
                Our ambulances are strategically located to ensure the fastest response times in emergency situations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Reliable & Safe</h3>
              <p className="text-neutral-600">
                All our vehicles are equipped with modern medical equipment and operated by certified professionals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Affordable</h3>
              <p className="text-neutral-600">
                Transparent pricing with no hidden fees. Quality medical transport at competitive rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-8">
        <div className="container text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="text-2xl">🚑</span>
            <span className="text-xl font-bold">MEDIRIDE</span>
          </div>
          <p className="text-neutral-400 mb-4">
            Your trusted partner for emergency medical transportation
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">Contact Us</a>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-800">
            <p className="text-neutral-500 text-sm">
              © 2025 MEDIRIDE. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
