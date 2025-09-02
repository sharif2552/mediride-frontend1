// src/pages/test-home.js
import React, { useState } from 'react';
import Link from 'next/link';

export default function TestHome() {
  return (
    <div className="container">
      <h1>Test Home Page</h1>
      <p>If you can see this, the basic React functionality is working.</p>
      <Link href="/booking-request">
        <button>Go to Booking Request</button>
      </Link>
    </div>
  );
}
