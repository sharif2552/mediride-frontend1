# Booking Request System - User Guide

## Overview

The booking request system allows users to create and manage ambulance bookings with the following features:

1. **Scheduled Bookings** - Book an ambulance for a specific date and time
2. **New Requests** - Submit additional requests for existing bookings
3. **Scheduled Bookings List** - View all scheduled bookings with automatic redirect

## Features

### 1. Scheduled Booking (`/booking-request`)

This page allows users to schedule an ambulance ride in advance with the following features:

- **Patient Information**: Name and phone number
- **Location Details**: Pickup and drop-off locations
- **Scheduling**: Specific date and time selection
- **API Endpoint**: `POST /api/bookings/scheduled/`
- **Auto Redirect**: Automatically redirects to `/scheduled-bookings` after successful submission

### 2. Scheduled Bookings List (`/scheduled-bookings`)

A dedicated page to view all scheduled bookings with:

- **Comprehensive View**: Shows all scheduled ambulance bookings
- **Status Tracking**: Visual status indicators (pending, accepted, completed, cancelled)
- **Detailed Information**: Patient details, locations, scheduled times, and notes
- **Action Buttons**: View details and edit requests for pending bookings
- **API Endpoint**: `GET /api/bookings/scheduled-list/`

### 3. New Request for Existing Booking

This functionality allows users to submit additional requests for existing bookings:

- **Direct URL**: `/booking-request/[bookingId]` (e.g., `/booking-request/123`)
- **Query Parameter**: Can also be accessed via `/booking-request?bookingId=123`
- **API Endpoint**: `POST /api/bookings/[bookingId]/new-request/`

## API Endpoints

### Scheduled Booking

```
POST http://127.0.0.1:8000/api/bookings/scheduled/
```

**Request Body:**

```json
{
  "patient_name": "Jane Doe",
  "patient_phone": "01700000002",
  "pickup_location": "Mirpur 10, Dhaka",
  "dropoff_location": "Dhaka Medical College",
  "scheduled_time": "2025-08-21T10:30:00+06:00"
}
```

### New Request

```
POST http://127.0.0.1:8000/api/bookings/{{bookingId}}/new-request/
```

**Request Body:**

```json
{
  "patient_name": "John Doe",
  "patient_phone": "01700000001",
  "pickup_location": "Dhanmondi 27, Dhaka",
  "dropoff_location": "BSMMU Hospital",
  "notes": "Urgent medical condition"
}
```

## Pages and Navigation

### Main Pages

- **Home Page**: `http://localhost:3000/` - Contains navigation to all booking options
- **Booking Request**: `http://localhost:3000/booking-request` - Main booking request page with tabs
- **Specific Booking Request**: `http://localhost:3000/booking-request/[bookingId]` - For existing booking requests

### Navigation Structure

```
Home (/)
├── Instant Book (/instant-book)
├── Book For Later (/book-later)
├── List of Booked (/BookList)
├── Booking Request (/booking-request) [NEW]
└── Info on Nearest Hospital & Doctor (/nearest-info)
```

## How to Use

### For Scheduled Bookings:

1. Navigate to `http://localhost:3000/booking-request`
2. Select "Schedule Booking" tab (default)
3. Fill in all required fields:
   - Patient Name
   - Phone Number
   - Pickup Location
   - Drop-off Location
   - Scheduled Date & Time
4. Click "Schedule Booking"
5. Success message will confirm the booking

### For New Requests on Existing Bookings:

1. Navigate to `http://localhost:3000/booking-request/[bookingId]` (replace [bookingId] with actual ID)
2. Or use the "New Request" tab on the main booking request page
3. Fill in the form:
   - Patient Name
   - Phone Number
   - Pickup Location
   - Drop-off Location
   - Additional Notes (optional)
4. Click "Submit Request"
5. Success message will confirm the request

## API Proxy Routes

The frontend includes API proxy routes to handle requests:

- `/api/bookings/scheduled` - Proxies to Django backend scheduled endpoint
- `/api/bookings/[bookingId]/new-request` - Proxies to Django backend new-request endpoint

These routes handle CORS issues and provide a unified API interface.

## Error Handling

The system includes comprehensive error handling:

- **Network Errors**: Displays connection error messages
- **Validation Errors**: Shows field-specific error messages
- **Server Errors**: Displays backend error responses
- **Missing Data**: Validates required fields before submission

## UI Features

### Tab Navigation

- Clean tab interface for switching between booking types
- Active tab highlighting
- Mobile-responsive design

### Form Validation

- Required field validation
- Real-time form state management
- Disabled submit buttons during processing

### Responsive Design

- Mobile-first design approach
- Responsive grid layouts
- Optimized for various screen sizes

### Success/Error Messages

- Color-coded message system
- Success messages in green
- Error messages in red
- Clear, user-friendly messaging

## Development Notes

### Technologies Used

- **Frontend**: Next.js 15.3.4, React 18
- **Backend**: Django 4.2.7
- **Styling**: Custom CSS with responsive design
- **API**: RESTful API with JSON communication

### File Structure

```
src/pages/
├── booking-request.js                    # Main booking request page
├── booking-request/
│   └── [bookingId].js                   # Dynamic booking ID page
└── api/
    └── bookings/
        ├── scheduled.js                 # Scheduled booking API
        └── [bookingId]/
            └── new-request.js           # New request API
```

### Styling

- Custom CSS classes for booking-specific components
- Tab navigation styles
- Message styling for success/error states
- Responsive breakpoints for mobile devices

## Testing

### Test the Scheduled Booking:

1. Visit: `http://localhost:3000/booking-request`
2. Use sample data:
   ```
   Patient Name: Jane Doe
   Phone: 01700000002
   Pickup: Mirpur 10, Dhaka
   Drop-off: Dhaka Medical College
   Date/Time: Future date and time
   ```

### Test the New Request:

1. Visit: `http://localhost:3000/booking-request/123` (use any booking ID)
2. Use sample data:
   ```
   Patient Name: John Doe
   Phone: 01700000001
   Pickup: Dhanmondi 27, Dhaka
   Drop-off: BSMMU Hospital
   Notes: Urgent medical condition
   ```

## Backend Requirements

Ensure your Django backend is running on `http://127.0.0.1:8000` with the following endpoints available:

- `POST /api/bookings/scheduled/`
- `POST /api/bookings/{bookingId}/new-request/`

The backend should accept the JSON payloads as specified in the API documentation above.
