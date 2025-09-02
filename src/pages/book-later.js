// src/pages/book-later.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BookLater() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    pickup_location: '',
    dropoff_location: '',
    preferred_date: '',
    preferred_time: '',
    notes: ''
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
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        patient_name: parsedUser.full_name || '',
        patient_phone: parsedUser.phone_number || ''
      }));
    } catch (err) {
      console.error("Error parsing user data:", err);
      router.push("/login/userLogin");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      
      // Combine date and time for scheduled_time
      const scheduledDateTime = new Date(`${formData.preferred_date}T${formData.preferred_time}`);
      
      const bookingData = {
        patient_name: formData.patient_name,
        patient_phone: formData.patient_phone,
        pickup_location: formData.pickup_location,
        dropoff_location: formData.dropoff_location,
        notes: formData.notes || '',
        scheduled_time: scheduledDateTime.toISOString()
      };
      
      const res = await fetch(`${API_BASE_URL}/api/bookings/scheduled/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Booking scheduled successfully! Redirecting to your bookings...");
        
        // Redirect to BookList after 2 seconds
        setTimeout(() => {
          router.push("/BookList");
        }, 2000);
      } else if (res.status === 401) {
        // Token expired, redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login/userLogin");
      } else {
        console.error("Booking error:", data);
        setError(data.detail || data.message || "Failed to schedule booking. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      {/* Left Panel (Same as index.js) */}
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
        <h1 className="welcome">Book <span className="highlight">For Later</span></h1>
        <p className="tagline" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Schedule an ambulance ride in advance by filling the form below.
        </p>

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
            <label>Patient Name:</label>
            <input 
              type="text" 
              name="patient_name"
              value={formData.patient_name}
              onChange={handleChange}
              placeholder="Enter patient name" 
              required 
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Patient Phone:</label>
            <input 
              type="tel" 
              name="patient_phone"
              value={formData.patient_phone}
              onChange={handleChange}
              placeholder="Enter patient phone number" 
              required 
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Pickup Location:</label>
            <input 
              type="text" 
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              placeholder="Enter pickup address" 
              required 
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Drop-off Location:</label>
            <input 
              type="text" 
              name="dropoff_location"
              value={formData.dropoff_location}
              onChange={handleChange}
              placeholder="Enter hospital or destination" 
              required 
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Preferred Date:</label>
            <input 
              type="date" 
              name="preferred_date"
              value={formData.preferred_date}
              onChange={handleChange}
              required 
              disabled={isSubmitting}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>Preferred Time:</label>
            <input 
              type="time" 
              name="preferred_time"
              value={formData.preferred_time}
              onChange={handleChange}
              required 
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Notes (Optional):</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any special requirements or additional information"
              disabled={isSubmitting}
              rows="3"
              style={{ 
                width: '100%', 
                padding: '1rem', 
                borderRadius: '6px', 
                border: 'none', 
                backgroundColor: '#e0e0e0',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <button 
            type="submit" 
            className="secondary-btn submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Booking'}
          </button>
        </form>

        <div className="back-home-btn-wrapper">
          <Link href="/">
            <button type="button" className="secondary-btn back-home-btn">
              ← Back to Home
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
