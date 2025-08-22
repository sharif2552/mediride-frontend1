// src/pages/driver-dashboard.js
import React, { useState } from 'react';
import Link from 'next/link';
import '../styles/globals.css';

export default function DriverDashboard() {
  // Sample schedule data for the driver
  const scheduleList = [
    { id: 1, date: '2025-07-18', time: '10:00 AM - 12:00 PM', location: 'Dhaka City' },
    { id: 2, date: '2025-07-19', time: '02:00 PM - 04:00 PM', location: 'Chittagong' },
    { id: 3, date: '2025-07-20', time: '08:00 AM - 10:00 AM', location: 'Rajshahi' },
  ];

  // State for tracking the next order being picked up
  const [nextOrder, setNextOrder] = useState(null);

  const handlePickOrder = (order) => {
    setNextOrder(order);
  };

  return (
    <div className="container">
      {/* Left Section */}
      <section className="left-panel">
        <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="logo" />
        <p className="tagline">
          আপনার প্রয়োজন, আমাদের অগ্রাধিকার, যে কোন সময়, কোথাও, প্রস্তুত
        </p>
        <button className="primary-btn">
          <img src="/assets/call-icon.png" alt="Call Icon" className="icon" />
          কল করুন
        </button>
      </section>

      {/* Right Section */}
      <section className="right-panel">
        <header className="header">
          <h1 className="welcome">ড্রাইভার ড্যাশবোর্ড</h1>
        </header>

        {/* Schedule List Section */}
        <div className="schedule-section">
          <h2>আপনার নির্ধারিত শিডিউল</h2>
          <div className="schedule-list">
            {scheduleList.map((schedule) => (
              <div key={schedule.id} className="schedule-item">
                <div className="schedule-info">
                  <p><strong>তারিখ:</strong> {schedule.date}</p>
                  <p><strong>সময়:</strong> {schedule.time}</p>
                  <p><strong>অবস্থান:</strong> {schedule.location}</p>
                </div>
                <button
                  className="secondary-btn pick-order-btn"
                  onClick={() => handlePickOrder(schedule)}
                >
                  অর্ডার নিন
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Beat Ambulance to Pick Order Section */}
        {nextOrder && (
          <div className="beat-ambulance-section">
            <h2>আপনার পরবর্তী অর্ডার</h2>
            <div className="next-order-info">
              <p><strong>তারিখ:</strong> {nextOrder.date}</p>
              <p><strong>সময়:</strong> {nextOrder.time}</p>
              <p><strong>অবস্থান:</strong> {nextOrder.location}</p>
              <button className="secondary-btn start-ambulance-btn">
                অর্ডার শুরুর জন্য পিক করুন
              </button>
            </div>
          </div>
        )}

        {/* Home Button */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link href="/" passHref legacyBehavior>
            <a className="secondary-btn back-home-btn">← হোমে ফিরে যান</a>
          </Link>
        </div>
      </section>
    </div>
  );
}
