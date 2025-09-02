// src/pages/booking-request/[bookingId].js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function BookingRequestWithId() {
  const router = useRouter();
  const { bookingId } = router.query;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  // Form data for new request
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    pickup_location: '',
    dropoff_location: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookingId) {
      setMessage('Error: No booking ID provided.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`/api/bookings/${bookingId}/new-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('New booking request submitted successfully! We will process your request shortly.');
        setFormData({
          patient_name: '',
          patient_phone: '',
          pickup_location: '',
          dropoff_location: '',
          notes: ''
        });
      } else {
        setMessage('Error: ' + (data.detail || data.error || 'Something went wrong. Please try again.'));
      }
    } catch (error) {
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container booking-request">
      {/* Left Panel */}
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
        <h1 className="welcome">
          New <span className="highlight">Request</span>
        </h1>
        
        <p className="tagline" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Submit a new request for booking #{bookingId}
        </p>

        {/* Display any messages */}
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {/* New Request Form */}
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Patient Name:</label>
            <input 
              type="text" 
              name="patient_name"
              value={formData.patient_name}
              onChange={handleChange}
              placeholder="Enter patient name" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Phone Number:</label>
            <input 
              type="tel" 
              name="patient_phone"
              value={formData.patient_phone}
              onChange={handleChange}
              placeholder="Enter contact number" 
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
              placeholder="Enter pickup location" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Drop-off Location:</label>
            <input 
              type="text" 
              name="dropoff_location"
              value={formData.dropoff_location}
              onChange={handleChange}
              placeholder="Enter drop-off location" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Additional Notes:</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information or special requirements"
              rows="3"
            />
          </div>

          <button 
            type="submit" 
            className="secondary-btn submit-btn"
            disabled={isSubmitting || !bookingId}
          >
            {isSubmitting ? 'Submitting...' : 'Submit New Request'}
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
