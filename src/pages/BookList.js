// src/pages/booked-list.js
import React from 'react';
import Link from 'next/link';


export default function BookList() {
  const bookedAmbulances = [
    { id: 1, date: '2025-07-18', schedule: '10:00 AM - 12:00 PM' },
    { id: 2, date: '2025-07-19', schedule: '02:00 PM - 04:00 PM' },
    { id: 3, date: '2025-07-20', schedule: '08:00 AM - 10:00 AM' },
  ];

  return (
    <div className="container">
      {/* Left Section */}
      <section className="left-panel">
        <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="logo" />
        <p className="tagline">Your need, Our priority, Ready to Response, Anytime Anywhere</p>
        <button className="primary-btn">
          <img src="/assets/call-icon.png" alt="Call Icon" className="icon" />
          Call Now
        </button>
        {/* Back to Home Button */}
        <div className="back-to-home">
          <Link href="/">
            <button className="back-home-btn">Back to Home</button>
          </Link>
        </div>
      </section>

      {/* Right Section */}
      <section className="right-panel">
        <header className="header">
          <div className="profile-search-wrapper">
            <img src="/assets/Formal photo.jpg" alt="Profile" className="profile-pic" />
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search" />
            </div>
          </div>
        </header>

        

        <h1 className="booked-list-title">
          Booked Ambulance List
        </h1>

        {/* Booked Ambulance List */}
        <div className="booked-list">
          {bookedAmbulances.map((ambulance) => (
            <div key={ambulance.id} className="booked-item">
              <div className="booked-date">{ambulance.date}</div>
              <div className="booked-schedule">{ambulance.schedule}</div>
              <Link href={`/booked-details/${ambulance.id}`}>
                <button className="details-btn">View Details</button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
