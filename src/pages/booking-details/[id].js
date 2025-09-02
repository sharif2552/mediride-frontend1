// src/pages/booking-details/[id].js
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { authenticatedFetch } from '../../utils/api';

export default function BookingDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const fetchBookingDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      
      // Try to fetch specific booking with bids
      try {
        const response = await fetch(`${apiBaseUrl}/api/bookings/${id}/bids/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const bidsData = await response.json();
          
          // Also fetch the booking details
          const bookingResponse = await fetch(`${apiBaseUrl}/api/bookings/`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (bookingResponse.ok) {
            const bookingsData = await bookingResponse.json();
            const bookingDetail = bookingsData.find(b => b.id === parseInt(id));
            
            if (bookingDetail) {
              // Add bids to the booking object
              bookingDetail.bids = bidsData;
              setBooking(bookingDetail);
              return;
            }
          }
        }
      } catch (error) {
        console.log('Failed to fetch booking with bids, falling back to regular fetch');
      }
      
      // Fallback: fetch all bookings and filter
      const data = await authenticatedFetch(`${apiBaseUrl}/api/bookings/`);
      const bookingDetail = data.find(b => b.id === parseInt(id));
      
      if (!bookingDetail) {
        setError('Booking not found');
        return;
      }
      
      setBooking(bookingDetail);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const showFallbackMap = useCallback(() => {
    const mapElement = document.getElementById('booking-map');
    if (mapElement) {
      mapElement.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #666;">
          <div style="font-size: 2rem; margin-bottom: 1rem;">🗺️</div>
          <div style="font-weight: bold; margin-bottom: 0.5rem;">Route Information</div>
          <div style="text-align: center; line-height: 1.5;">
            <div><strong>From:</strong> ${booking.pickup_location}</div>
            <div style="margin: 0.5rem 0;">↓</div>
            <div><strong>To:</strong> ${booking.dropoff_location}</div>
          </div>
        </div>
      `;
    }
  }, [booking]);

  const addStaticMarkers = useCallback((map) => {
    // Geocode the addresses to get coordinates
    const geocoder = new window.google.maps.Geocoder();
    
    // Add pickup marker
    geocoder.geocode({ address: booking.pickup_location + ', Dhaka, Bangladesh' }, (results, status) => {
      if (status === 'OK') {
        new window.google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
          title: 'Pickup Location: ' + booking.pickup_location,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4CAF50',
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 2
          }
        });
        map.setCenter(results[0].geometry.location);
      }
    });
    
    // Add dropoff marker
    geocoder.geocode({ address: booking.dropoff_location + ', Dhaka, Bangladesh' }, (results, status) => {
      if (status === 'OK') {
        new window.google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
          title: 'Dropoff Location: ' + booking.dropoff_location,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#f44336',
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 2
          }
        });
      }
    });
  }, [booking]);

  const initializeMap = useCallback(() => {
    if (!booking || !window.google) {
      showFallbackMap();
      return;
    }

    const mapElement = document.getElementById('booking-map');
    if (!mapElement) return;

    // Center map on Dhaka, Bangladesh
    const defaultCenter = { lat: 23.8103, lng: 90.4125 };
    
    const map = new window.google.maps.Map(mapElement, {
      zoom: 12,
      center: defaultCenter,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      styles: [
        {
          featureType: "poi.business",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "transit",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      draggable: false,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#4285F4',
        strokeWeight: 5,
        strokeOpacity: 0.8
      }
    });
    directionsRenderer.setMap(map);

    // Try to get directions between pickup and dropoff
    directionsService.route({
      origin: booking.pickup_location,
      destination: booking.dropoff_location,
      travelMode: window.google.maps.TravelMode.DRIVING,
      unitSystem: window.google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result);
        
        // Add custom info window with trip details
        const route = result.routes[0];
        const leg = route.legs[0];
        
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; font-family: Arial, sans-serif;">
              <h4 style="margin: 0 0 10px 0; color: #333;">Trip Details</h4>
              <div><strong>Distance:</strong> ${leg.distance.text}</div>
              <div><strong>Duration:</strong> ${leg.duration.text}</div>
              <div><strong>From:</strong> ${leg.start_address}</div>
              <div><strong>To:</strong> ${leg.end_address}</div>
            </div>
          `
        });
        
        // Show info window on map center
        infoWindow.setPosition(route.bounds.getCenter());
        infoWindow.open(map);
      } else {
        console.error('Directions request failed:', status);
        addStaticMarkers(map);
      }
    });
  }, [booking, showFallbackMap, addStaticMarkers]);

  const loadGoogleMaps = useCallback(() => {
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      setTimeout(initializeMap, 100); // Small delay to ensure DOM is ready
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBYMuF8rOKgV9Y3oKJ_cI6ZqcZm8K8k8K8&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setMapLoaded(true);
      setTimeout(initializeMap, 100);
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps');
      setMapLoaded(true); // Still set to true to show fallback
      showFallbackMap();
    };
    document.head.appendChild(script);
  }, [initializeMap, showFallbackMap]);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token) {
      router.push("/login/userLogin");
      return;
    }
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }

    // Fetch booking details when id is available
    if (id) {
      fetchBookingDetails();
    }
  }, [id, router, fetchBookingDetails]);

  // Load Google Maps script for all bookings
  useEffect(() => {
    if (booking && !mapLoaded) {
      loadGoogleMaps();
    }
  }, [booking, mapLoaded, loadGoogleMaps]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': 
      case 'accepted': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      case 'completed': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getDriverInfo = () => {
    // Simulate driver information for non-pending bookings
    // In a real app, this would come from the API
    if (booking && booking.status !== 'pending') {
      return {
        name: 'Ahmed Rahman',
        phone: '+880123456789',
        vehicle: 'Toyota Hiace - DHA-1234',
        rating: 4.8,
        photo: '/assets/driver-avatar.png' // You would get this from the API
      };
    }
    return null;
  };

  const handleAcceptBid = async (bidId) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiBaseUrl}/api/bookings/bids/${bidId}/accept/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Refresh the booking details to show updated status
        await fetchBookingDetails();
        alert('Bid accepted successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Failed to accept bid');
      }
    } catch (error) {
      console.error('Error accepting bid:', error);
      alert('Failed to accept bid. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>Loading booking details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ color: '#dc3545', marginBottom: '20px' }}>{error}</div>
        <Link href="/BookList">
          <button className="primary-btn">Back to Bookings</button>
        </Link>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ marginBottom: '20px' }}>Booking not found</div>
        <Link href="/BookList">
          <button className="primary-btn">Back to Bookings</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <style jsx>{`
        .page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem 0;
          overflow-x: hidden;
        }

        .booking-detail-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem;
          background: transparent;
          min-height: 100vh;
        }
        
        .navigation-header {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 0;
          position: sticky;
          top: 1rem;
          z-index: 100;
        }
        
        .home-btn, .booklist-btn {
          background: rgba(255, 255, 255, 0.95);
          color: #333;
          border: none;
          padding: 12px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          backdrop-filter: blur(10px);
        }
        
        .home-btn:hover, .booklist-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          background: white;
        }
        
        .content-main {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }
        
        .detail-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0;
        }
        
        .booking-id {
          font-size: 2rem;
          font-weight: bold;
          margin: 0;
        }
        
        .status-badge {
          padding: 12px 24px;
          border-radius: 30px;
          color: white;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.9rem;
          border: 2px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(10px);
        }
        
        .main-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
          padding: 2rem;
          max-height: calc(100vh - 200px);
          overflow-y: auto;
        }
        
        .left-column {
          overflow-y: auto;
          padding-right: 1rem;
        }
        
        .right-column {
          position: sticky;
          top: 0;
          height: fit-content;
          max-height: calc(100vh - 200px);
          overflow-y: auto;
        }
        
        .priority-section {
          background: linear-gradient(135deg, #fff3cd, #ffeaa7);
          border: 2px solid #ffc107;
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 25px rgba(255,193,7,0.2);
        }
        
        .priority-title {
          font-size: 1.4rem;
          font-weight: bold;
          color: #856404;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        
        .bids-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-height: 600px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }
        
        .bid-card {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          border: 2px solid #e9ecef;
          transition: all 0.3s ease;
          position: relative;
        }

        .bid-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          border-color: #28a745;
        }

        .bid-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f8f9fa;
        }

        .driver-info-bid {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .driver-avatar-small {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background: linear-gradient(135deg, #007bff, #0056b3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.3rem;
          box-shadow: 0 4px 15px rgba(0,123,255,0.3);
        }

        .driver-details-bid {
          display: flex;
          flex-direction: column;
        }

        .driver-name-bid {
          font-weight: bold;
          font-size: 1.2rem;
          color: #2c3e50;
        }

        .driver-phone-bid {
          color: #6c757d;
          font-size: 0.95rem;
          margin-top: 0.2rem;
        }

        .bid-price {
          font-size: 2rem;
          font-weight: bold;
          color: #28a745;
          background: linear-gradient(135deg, #d4edda, #c3e6cb);
          padding: 0.8rem 1.2rem;
          border-radius: 12px;
          border: 2px solid #28a745;
          box-shadow: 0 3px 10px rgba(40,167,69,0.2);
        }

        .bid-details {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-bottom: 1.5rem;
        }

        .bid-detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f8f9fa;
        }

        .bid-label {
          font-weight: 600;
          color: #495057;
          font-size: 0.95rem;
        }

        .bid-value {
          color: #343a40;
          font-weight: 500;
        }

        .bid-actions {
          display: flex;
          gap: 1rem;
          justify-content: space-between;
        }

        .accept-bid-btn {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(40,167,69,0.3);
          flex: 1;
          font-size: 1rem;
        }

        .accept-bid-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(40,167,69,0.4);
        }

        .contact-driver-btn {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 25px;
          text-decoration: none;
          font-weight: bold;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,123,255,0.3);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .contact-driver-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,123,255,0.4);
        }

        .no-bids-message {
          text-align: center;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-radius: 15px;
          border: 2px dashed #6c757d;
        }

        .no-bids-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.7;
          animation: pulse 2s infinite;
        }

        .no-bids-message h4 {
          margin: 0 0 0.5rem 0;
          color: #495057;
          font-size: 1.2rem;
        }

        .no-bids-message p {
          margin: 0;
          color: #6c757d;
          font-size: 1rem;
        }
        
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .detail-section {
          background: linear-gradient(145deg, #f8f9fa, #ffffff);
          padding: 1.5rem;
          border-radius: 15px;
          border: 1px solid rgba(0,0,0,0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }
        
        .detail-section:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .section-title {
          font-size: 1.3rem;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding-bottom: 0.8rem;
          border-bottom: 2px solid rgba(0,0,0,0.1);
        }
        
        .detail-item {
          margin-bottom: 1.2rem;
          display: flex;
          flex-direction: column;
        }
        
        .detail-label {
          font-weight: 600;
          color: #495057;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-value {
          color: #343a40;
          font-size: 1.1rem;
          font-weight: 500;
          padding: 0.5rem;
          background: rgba(255,255,255,0.8);
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }
        
        .map-section {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          border: 1px solid rgba(0,0,0,0.1);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          margin-top: 2rem;
        }

        .driver-info {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          background: linear-gradient(145deg, #e8f5e8, #f0fff0);
          border-radius: 15px;
          margin-top: 1rem;
          box-shadow: 0 4px 20px rgba(40,167,69,0.1);
          border: 2px solid rgba(40, 167, 69, 0.2);
        }
        
        .driver-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #007bff, #0056b3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 2rem;
          box-shadow: 0 6px 20px rgba(0,123,255,0.3);
        }
        
        .driver-details {
          flex: 1;
        }
        
        .driver-name {
          font-weight: bold;
          font-size: 1.4rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        
        .driver-vehicle {
          color: #6c757d;
          margin: 0.5rem 0;
          font-size: 1.1rem;
        }
        
        .driver-rating {
          color: #ffc107;
          font-weight: bold;
          font-size: 1.2rem;
        }
        
        .call-driver-btn {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          padding: 15px 25px;
          border-radius: 25px;
          text-decoration: none;
          font-weight: bold;
          transition: transform 0.2s ease;
          box-shadow: 0 4px 15px rgba(40,167,69,0.3);
          font-size: 1.1rem;
        }
        
        .call-driver-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(40,167,69,0.4);
        }
        
        .map-container {
          width: 100%;
          height: 400px;
          border-radius: 15px;
          overflow: hidden;
          margin-top: 1rem;
          background: #f8f9fa;
          border: 2px solid rgba(0,0,0,0.1);
          position: relative;
        }
        
        #booking-map {
          width: 100%;
          height: 100%;
        }
        
        .map-loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: #6c757d;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .pending-message {
          text-align: center;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, #fff3cd, #ffeaa7);
          border-radius: 15px;
          border: 2px solid #ffc107;
          color: #856404;
          margin: 2rem 0;
          box-shadow: 0 6px 20px rgba(255,193,7,0.2);
        }
        
        .pending-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .pending-message h3 {
          margin: 0 0 1rem 0;
          font-size: 1.6rem;
          color: #856404;
        }
        
        .pending-message p {
          margin: 0;
          font-size: 1.1rem;
          line-height: 1.6;
        }
        
        .actions-section {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px solid #e9ecef;
        }
        
        .back-btn, .edit-btn {
          background: linear-gradient(135deg, #6c757d, #495057);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(108,117,125,0.3);
        }
        
        .edit-btn {
          background: linear-gradient(135deg, #007bff, #0056b3);
          box-shadow: 0 4px 15px rgba(0,123,255,0.3);
        }
        
        .back-btn:hover, .edit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(108,117,125,0.4);
        }

        .edit-btn:hover {
          box-shadow: 0 6px 20px rgba(0,123,255,0.4);
        }

        @media (max-width: 1024px) {
          .main-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .right-column {
            position: static;
            max-height: none;
          }
          
          .bids-container {
            max-height: none;
          }
        }

        @media (max-width: 768px) {
          .page-container {
            padding: 0.5rem 0;
          }

          .booking-detail-container {
            margin: 0;
            padding: 0 0.5rem;
          }
          
          .navigation-header {
            flex-direction: column;
            gap: 0.8rem;
            padding: 0;
            position: static;
          }
          
          .home-btn, .booklist-btn {
            justify-content: center;
            font-size: 0.9rem;
            padding: 12px 20px;
          }
          
          .detail-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
            padding: 1.5rem;
          }
          
          .booking-id {
            font-size: 1.6rem;
          }
          
          .main-content {
            padding: 1rem;
            grid-template-columns: 1fr;
            max-height: none;
          }
          
          .left-column, .right-column {
            padding-right: 0;
            overflow-y: visible;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .actions-section {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          
          .back-btn, .edit-btn {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }
          
          .driver-info {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
          
          .map-container {
            height: 300px;
          }

          .bid-card {
            padding: 1rem;
          }

          .bid-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .bid-actions {
            flex-direction: column;
            gap: 0.8rem;
          }

          .accept-bid-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="booking-detail-container">
        {/* Navigation Header */}
        <div className="navigation-header">
          <Link href="/">
            <button className="home-btn">🏠 Home</button>
          </Link>
          <Link href="/BookList">
            <button className="booklist-btn">📋 My Bookings</button>
          </Link>
        </div>

        <div className="content-main">
          <div className="detail-header">
            <div className="booking-id">Booking #{booking.id}</div>
            <div 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(booking.status) }}
            >
              {booking.status || 'Pending'}
            </div>
          </div>

          <div className="main-content">
            {/* Right Column - Priority: Driver Bids */}
            <div className="right-column">
              {/* Bids Section - TOP PRIORITY */}
              {booking.status === 'pending' && (
                <div className="priority-section">
                  <div className="priority-title">
                    💰 Driver Bids {booking.bids && booking.bids.length > 0 && `(${booking.bids.length})`}
                  </div>
                  
                  {booking.bids && booking.bids.length > 0 ? (
                    <div className="bids-container">
                      {booking.bids.map((bid) => (
                        <div key={bid.id} className="bid-card">
                          <div className="bid-header">
                            <div className="driver-info-bid">
                              <div className="driver-avatar-small">
                                {bid.driver_name.charAt(0)}
                              </div>
                              <div className="driver-details-bid">
                                <div className="driver-name-bid">{bid.driver_name}</div>
                                <div className="driver-phone-bid">📞 {bid.driver_phone}</div>
                              </div>
                            </div>
                            <div className="bid-price">
                              ৳{bid.price}
                            </div>
                          </div>
                          <div className="bid-details">
                            <div className="bid-detail-item">
                              <span className="bid-label">Estimated Time:</span>
                              <span className="bid-value">{bid.estimated_time} minutes</span>
                            </div>
                            {bid.notes && (
                              <div className="bid-detail-item">
                                <span className="bid-label">Driver Notes:</span>
                                <span className="bid-value">{bid.notes}</span>
                              </div>
                            )}
                            <div className="bid-detail-item">
                              <span className="bid-label">Bid Submitted:</span>
                              <span className="bid-value">{formatDate(bid.created_at)}</span>
                            </div>
                          </div>
                          <div className="bid-actions">
                            <button 
                              className="accept-bid-btn"
                              onClick={() => handleAcceptBid(bid.id)}
                            >
                              ✅ Accept Bid
                            </button>
                            <a 
                              href={`tel:${bid.driver_phone}`} 
                              className="contact-driver-btn"
                            >
                              📞 Contact
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-bids-message">
                      <div className="no-bids-icon">⏳</div>
                      <h4>No bids yet</h4>
                      <p>Your booking is visible to drivers. They will submit bids soon!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Driver Information - For confirmed bookings */}
              {booking.status !== 'pending' && getDriverInfo() && (
                <div className="priority-section">
                  <div className="priority-title">
                    🚗 Your Driver
                  </div>
                  <div className="driver-info">
                    <div className="driver-avatar">
                      {getDriverInfo().name.charAt(0)}
                    </div>
                    <div className="driver-details">
                      <div className="driver-name">{getDriverInfo().name}</div>
                      <div className="driver-vehicle">{getDriverInfo().vehicle}</div>
                      <div className="driver-rating">⭐ {getDriverInfo().rating}/5.0</div>
                    </div>
                    <div>
                      <a 
                        href={`tel:${getDriverInfo().phone}`} 
                        className="call-driver-btn"
                      >
                        📞 Call Driver
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Left Column - Booking Details */}
            <div className="left-column">
              {/* Show pending message for pending bookings */}
              {booking.status === 'pending' && (
                <div className="pending-message">
                  <div className="pending-icon">⏳</div>
                  <h3>Booking Pending</h3>
                  <p>Your booking request has been submitted and is waiting for confirmation. We&apos;ll notify you once a driver accepts your request.</p>
                </div>
              )}

              <div className="detail-grid">
                {/* Patient Information */}
                <div className="detail-section">
                  <div className="section-title">
                    👤 Patient Information
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Patient Name</span>
                    <span className="detail-value">{booking.patient_name || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone Number</span>
                    <span className="detail-value">{booking.patient_phone || 'Not specified'}</span>
                  </div>
                </div>

                {/* Booking Information */}
                <div className="detail-section">
                  <div className="section-title">
                    📋 Booking Information
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Booking Type</span>
                    <span className="detail-value">{booking.is_instant ? 'Instant Booking' : 'Scheduled Booking'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Created At</span>
                    <span className="detail-value">{formatDate(booking.created_at)}</span>
                  </div>
                  {booking.scheduled_time && (
                    <div className="detail-item">
                      <span className="detail-label">Scheduled Time</span>
                      <span className="detail-value">{formatDate(booking.scheduled_time)}</span>
                    </div>
                  )}
                </div>

                {/* Location Information */}
                <div className="detail-section">
                  <div className="section-title">
                    📍 Location Details
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Pickup Location</span>
                    <span className="detail-value">{booking.pickup_location || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Drop-off Location</span>
                    <span className="detail-value">{booking.dropoff_location || 'Not specified'}</span>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="detail-section">
                  <div className="section-title">
                    📝 Additional Information
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Notes</span>
                    <span className="detail-value">{booking.notes || 'No additional notes'}</span>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="map-section">
                <div className="section-title">
                  🗺️ Route Map
                </div>
                <div className="map-container">
                  {!mapLoaded ? (
                    <div className="map-loading">
                      <div className="loading-spinner"></div>
                      <div>Loading map...</div>
                    </div>
                  ) : (
                    <div id="booking-map"></div>
                  )}
                </div>
              </div>

              <div className="actions-section">
                <Link href="/BookList">
                  <button className="back-btn">← Back to Bookings</button>
                </Link>
                {booking.status?.toLowerCase() === 'pending' && (
                  <Link href={`/booking-request?bookingId=${booking.id}`}>
                    <button className="edit-btn">✏️ Edit Booking</button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
