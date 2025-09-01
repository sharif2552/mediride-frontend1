// src/pages/instant-book.js
import React, { useState } from 'react';
import Link from 'next/link';

export default function InstantBook() {
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    pickup_location: '',
    dropoff_location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/bookings/instant/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Booking confirmed successfully! We will contact you shortly.');
        setFormData({
          patient_name: '',
          patient_phone: '',
          pickup_location: '',
          dropoff_location: ''
        });
      } else {
        setMessage('Error: ' + (data.detail || 'Something went wrong. Please try again.'));
      }
    } catch (error) {
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      {/* Left Panel - SAME as index.js */}
      <section className="left-panel">
        <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="logo" />
        <p className="tagline">Your need, Our priority, Ready to Response, Anytime Anywhere</p>
        <button className="primary-btn">
          <img src="/assets/call-icon.png" alt="Call Icon" className="icon" />
          Call Now
        </button>
      </section>

      {/* Right Panel - Custom Booking Form */}
      <section className="right-panel">
        <h1 className="welcome">Instant <span className="highlight">Booking</span></h1>
        <p className="tagline" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Fill out the form below to request an ambulance immediately.
        </p>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Patient Name:</label>
            <input 
              type="text" 
              name="patient_name"
              value={formData.patient_name}
              onChange={handleChange}
              placeholder="Enter patient's full name" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Patient Phone:</label>
            <input 
              type="tel" 
              name="patient_phone"
              value={formData.patient_phone}
              onChange={handleChange}
              placeholder="+8801712345678" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Pickup Location:</label>
            <input 
              type="text" 
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              placeholder="From (e.g., Dhanmondi 27, Dhaka)" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Dropoff Location:</label>
            <input 
              type="text" 
              name="dropoff_location"
              value={formData.dropoff_location}
              onChange={handleChange}
              placeholder="To (e.g., BSMMU Hospital, Dhaka)" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="secondary-btn submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
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
