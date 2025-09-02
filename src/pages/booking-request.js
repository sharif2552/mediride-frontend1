// src/pages/booking-request.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authenticatedFetch } from '../utils/api';

export default function BookingRequest() {
  const router = useRouter();
  const [bookingId, setBookingId] = useState(null);
  const [user, setUser] = useState(null);
  
  const [activeTab, setActiveTab] = useState('scheduled'); // 'new-request' or 'scheduled'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  // Form data for scheduled booking
  const [scheduledFormData, setScheduledFormData] = useState({
    patient_name: '',
    patient_phone: '',
    pickup_location: '',
    dropoff_location: '',
    scheduled_time: '',
    notes: ''
  });

  // Form data for new request (when bookingId is provided)
  const [newRequestFormData, setNewRequestFormData] = useState({
    patient_name: '',
    patient_phone: '',
    pickup_location: '',
    dropoff_location: '',
    notes: ''
  });

  // Check authentication and get bookingId from URL
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      router.push("/login/userLogin");
      return;
    }

    // Test token validity by making a simple API call
    const testToken = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/bookings/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        
        if (response.status === 401) {
          // Token is invalid, clear storage and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          router.push("/login/userLogin");
          return;
        }
      } catch (error) {
        console.error("Token validation error:", error);
      }
    };

    testToken();

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Pre-fill forms with user data
      setScheduledFormData(prev => ({
        ...prev,
        patient_name: parsedUser.full_name || '',
        patient_phone: parsedUser.phone_number || ''
      }));
      
      setNewRequestFormData(prev => ({
        ...prev,
        patient_name: parsedUser.full_name || '',
        patient_phone: parsedUser.phone_number || ''
      }));
    } catch (err) {
      console.error("Error parsing user data:", err);
      router.push("/login/userLogin");
    }

    // Get bookingId from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('bookingId');
    if (id) {
      setBookingId(id);
      setActiveTab('new-request');
    }
  }, []);

  const handleScheduledChange = (e) => {
    setScheduledFormData({
      ...scheduledFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleNewRequestChange = (e) => {
    setNewRequestFormData({
      ...newRequestFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleScheduledSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Validate required fields
      if (!scheduledFormData.patient_name || !scheduledFormData.patient_phone || 
          !scheduledFormData.pickup_location || !scheduledFormData.dropoff_location || 
          !scheduledFormData.scheduled_time) {
        setMessage("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      const data = await authenticatedFetch("http://localhost:8000/api/bookings/scheduled/", {
        method: "POST",
        body: JSON.stringify({
          patient_name: scheduledFormData.patient_name,
          patient_phone: scheduledFormData.patient_phone,
          pickup_location: scheduledFormData.pickup_location,
          dropoff_location: scheduledFormData.dropoff_location,
          scheduled_time: scheduledFormData.scheduled_time,
          notes: scheduledFormData.notes || '',
        }),
      });

      setMessage('Scheduled booking created successfully! Redirecting to your bookings...');
      setScheduledFormData({
        patient_name: user?.full_name || '',
        patient_phone: user?.phone_number || '',
        pickup_location: '',
        dropoff_location: '',
        scheduled_time: '',
        notes: ''
      });
      
      // Redirect to bookings list after a short delay
      setTimeout(() => {
        router.push('/BookList');
      }, 2000);

    } catch (error) {
      console.error("Scheduled booking error:", error);
      setMessage(error.message || 'Failed to create scheduled booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewRequestSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setMessage('');

    try {
      // Validate required fields
      if (!newRequestFormData.patient_name || !newRequestFormData.patient_phone || 
          !newRequestFormData.pickup_location || !newRequestFormData.dropoff_location) {
        setMessage("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      const data = await authenticatedFetch("http://localhost:8000/api/bookings/instant/", {
        method: "POST",
        body: JSON.stringify({
          patient_name: newRequestFormData.patient_name,
          patient_phone: newRequestFormData.patient_phone,
          pickup_location: newRequestFormData.pickup_location,
          dropoff_location: newRequestFormData.dropoff_location,
          notes: newRequestFormData.notes || '',
        }),
      });

      setMessage('Booking request submitted successfully! Redirecting to your bookings...');
      setNewRequestFormData({
        patient_name: user?.full_name || '',
        patient_phone: user?.phone_number || '',
        pickup_location: '',
        dropoff_location: '',
        notes: ''
      });
      
      // Redirect to bookings list after a short delay
      setTimeout(() => {
        router.push('/BookList');
      }, 2000);

    } catch (error) {
      console.error("New request error:", error);
      setMessage(error.message || 'Failed to submit booking request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-set active tab based on bookingId presence
  React.useEffect(() => {
    if (bookingId) {
      setActiveTab('new-request');
    }
  }, [bookingId]);

  return (
    <div className="container">
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
          Booking <span className="highlight">Request</span>
        </h1>
        
        <p className="tagline" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {bookingId ? 
            `Submit a new request for booking #${bookingId}` : 
            'Schedule an ambulance ride or create a new booking request'
          }
        </p>

        {/* Tab Navigation */}
        {!bookingId && (
          <div className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'scheduled' ? 'active' : ''}`}
              onClick={() => setActiveTab('scheduled')}
            >
              Schedule Booking
            </button>
            <button 
              className={`tab-btn ${activeTab === 'new-request' ? 'active' : ''}`}
              onClick={() => setActiveTab('new-request')}
            >
              Instant Booking
            </button>
          </div>
        )}

        {/* Display any messages */}
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {/* Scheduled Booking Form */}
        {(activeTab === 'scheduled' && !bookingId) && (
          <form className="form-grid" onSubmit={handleScheduledSubmit}>
            <div className="form-group">
              <label>Patient Name:</label>
              <input 
                type="text" 
                name="patient_name"
                value={scheduledFormData.patient_name}
                onChange={handleScheduledChange}
                placeholder="Enter patient name" 
                required 
              />
            </div>

            <div className="form-group">
              <label>Phone Number:</label>
              <input 
                type="tel" 
                name="patient_phone"
                value={scheduledFormData.patient_phone}
                onChange={handleScheduledChange}
                placeholder="Enter contact number" 
                required 
              />
            </div>

            <div className="form-group">
              <label>Pickup Location:</label>
              <input 
                type="text" 
                name="pickup_location"
                value={scheduledFormData.pickup_location}
                onChange={handleScheduledChange}
                placeholder="Enter pickup location" 
                required 
              />
            </div>

            <div className="form-group">
              <label>Drop-off Location:</label>
              <input 
                type="text" 
                name="dropoff_location"
                value={scheduledFormData.dropoff_location}
                onChange={handleScheduledChange}
                placeholder="Enter drop-off location" 
                required 
              />
            </div>

            <div className="form-group">
              <label>Scheduled Date & Time:</label>
              <input 
                type="datetime-local" 
                name="scheduled_time"
                value={scheduledFormData.scheduled_time}
                onChange={handleScheduledChange}
                required 
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
        )}

        {/* New Request Form */}
        {(activeTab === 'new-request' || bookingId) && (
          <form className="form-grid" onSubmit={handleNewRequestSubmit}>
            <div className="form-group">
              <label>Patient Name:</label>
              <input 
                type="text" 
                name="patient_name"
                value={newRequestFormData.patient_name}
                onChange={handleNewRequestChange}
                placeholder="Enter patient name" 
                required 
              />
            </div>

            <div className="form-group">
              <label>Phone Number:</label>
              <input 
                type="tel" 
                name="patient_phone"
                value={newRequestFormData.patient_phone}
                onChange={handleNewRequestChange}
                placeholder="Enter contact number" 
                required 
              />
            </div>

            <div className="form-group">
              <label>Pickup Location:</label>
              <input 
                type="text" 
                name="pickup_location"
                value={newRequestFormData.pickup_location}
                onChange={handleNewRequestChange}
                placeholder="Enter pickup location" 
                required 
              />
            </div>

            <div className="form-group">
              <label>Drop-off Location:</label>
              <input 
                type="text" 
                name="dropoff_location"
                value={newRequestFormData.dropoff_location}
                onChange={handleNewRequestChange}
                placeholder="Enter drop-off location" 
                required 
              />
            </div>

            <div className="form-group">
              <label>Additional Notes:</label>
              <textarea 
                name="notes"
                value={newRequestFormData.notes}
                onChange={handleNewRequestChange}
                placeholder="Any additional information or special requirements"
                rows="3"
              />
            </div>

            <button 
              type="submit" 
              className="secondary-btn submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : (bookingId ? 'Submit Request' : 'Book Now')}
            </button>
          </form>
        )}

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
