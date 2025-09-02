# Hospital and Doctor API Frontend Implementation

This document describes the frontend implementation for all hospital and doctor API endpoints.

## 🏥 Backend API Endpoints Implemented

### Hospital Endpoints

1. **GET** `{{baseUrl}}/hospitals/?district={{districtId}}&is_active=true&page_size=5`
   - List hospitals with filtering options
2. **GET** `{{baseUrl}}/hospitals/{{hospitalId}}/`
   - Get detailed information about a specific hospital
3. **GET** `{{baseUrl}}/hospitals/nearest/?lat={{lat}}&lon={{lon}}&limit=5&max_distance_km=50`
   - Find nearest hospitals based on user location

### Doctor Endpoints

4. **GET** `{{baseUrl}}/hospitals/doctors/?specialization={{specialization}}&hospital={{hospitalId}}&available=true&page_size=5`
   - List doctors with filtering options
5. **GET** `{{baseUrl}}/hospitals/doctors/{{doctorId}}/`
   - Get detailed information about a specific doctor
6. **GET** `{{baseUrl}}/hospitals/hospitals/{{hospitalId}}/doctors/?specialization={{specialization}}&available=true&page_size=5`
   - List doctors at a specific hospital with filtering

## 🚀 Frontend Pages Created

### 1. Hospital Directory (`/hospitals`)

- **File**: `src/pages/hospitals.js`
- **Features**:
  - Tab-based interface (All Hospitals / Nearest Hospitals)
  - Advanced filtering (district, status, search, page size)
  - Geolocation-based nearest hospital search
  - Distance calculation and display
  - Hospital cards with contact info and actions

### 2. Hospital Detail Page (`/hospitals/[hospitalId]`)

- **File**: `src/pages/hospitals/[hospitalId].js`
- **Features**:
  - Complete hospital information display
  - Contact details with clickable phone/email
  - Emergency contact highlighting
  - Quick actions (view doctors, book ambulance, map directions)
  - Address and location information

### 3. Doctor Directory (`/doctors`)

- **File**: `src/pages/doctors.js`
- **Features**:
  - Advanced filtering (specialization, hospital, availability, search)
  - Quick filter buttons for specializations
  - Doctor cards with professional information
  - Hospital association display
  - Direct contact options

### 4. Doctor Detail Page (`/doctors/[doctorId]`)

- **File**: `src/pages/doctors/[doctorId].js`
- **Features**:
  - Complete doctor profile
  - Professional credentials and experience
  - Hospital information integration
  - Availability status
  - Contact options (call, email)
  - Emergency contact fallback

### 5. Hospital Doctors Page (`/hospitals/[hospitalId]/doctors`)

- **File**: `src/pages/hospitals/[hospitalId]/doctors.js`
- **Features**:
  - Hospital-specific doctor listing
  - Specialization filtering
  - Hospital context information
  - Quick specialization filter buttons
  - Emergency contact section

### 6. Enhanced Nearest Info Page (`/nearest-info`)

- **File**: `src/pages/nearest-info.js` (updated)
- **Features**:
  - Real-time geolocation
  - Dual tabs (hospitals/doctors)
  - Dynamic filtering
  - Distance-based hospital search
  - Available doctors listing

## 🔧 Configuration and Utilities

### API Configuration (`src/config/api.js`)

- Centralized API endpoint definitions
- Environment-based URL configuration
- Specialization constants
- Frontend/backend URL management

### API Utilities (`src/utils/api.js`)

- Reusable fetch wrapper with error handling
- Query string builder utility
- Geolocation helper functions
- Consistent error management

## 🌐 API Route Proxies

### Hospital API Routes

- `src/pages/api/hospitals/index.js` - Hospital listing
- `src/pages/api/hospitals/[hospitalId].js` - Hospital details
- `src/pages/api/hospitals/nearest.js` - Nearest hospitals
- `src/pages/api/hospitals/[hospitalId]/doctors.js` - Hospital doctors

### Doctor API Routes

- `src/pages/api/doctors/index.js` - Doctor listing
- `src/pages/api/doctors/[doctorId].js` - Doctor details

## 🎨 Features Implemented

### Search and Filtering

- **Text Search**: Name, address, phone, email, qualification
- **Specialization Filter**: All medical specializations
- **Location Filter**: District-based and geolocation-based
- **Availability Filter**: Active/inactive status
- **Distance Filter**: Configurable radius for nearest search

### User Experience

- **Responsive Design**: Mobile-friendly layouts
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages
- **Quick Actions**: One-click calling, emailing, directions
- **Tab Navigation**: Organized content presentation
- **Pagination**: Configurable page sizes

### Data Display

- **Distance Calculation**: Real-time distance to hospitals
- **Contact Integration**: Direct phone/email links
- **Map Integration**: Google Maps directions
- **Emergency Highlighting**: Special styling for emergency contacts
- **Professional Information**: Credentials, experience, qualifications

## 🚦 Usage Examples

### Finding Nearest Hospitals

```javascript
// User visits /nearest-info
// Automatically requests location permission
// Shows hospitals within 50km by default
// Allows customization of distance and limit
```

### Browsing Doctors

```javascript
// User visits /doctors
// Can filter by specialization (e.g., cardiology)
// Can search by name or hospital
// Quick filter buttons for common specializations
```

### Hospital-Specific Information

```javascript
// User visits /hospitals/1
// Shows complete hospital details
// Emergency contact prominently displayed
// Quick access to hospital doctors
```

## 🔗 Navigation Integration

Updated the main navigation (`src/pages/index.js`) to include:

- Link to hospital directory
- Link to doctor directory
- Enhanced nearest info page

## 🛠️ Technical Implementation

### State Management

- React hooks for component state
- URL-based filtering state
- Geolocation state management
- Loading and error states

### Performance Optimizations

- Conditional API calls based on active tabs
- Debounced search inputs
- Efficient re-rendering with proper dependencies
- Lazy loading of geolocation

### Error Handling

- Network error recovery
- Backend connection fallbacks
- User-friendly error messages
- Retry mechanisms

## 📱 Mobile Responsiveness

All pages are fully responsive with:

- Grid layouts that adapt to screen size
- Touch-friendly buttons and links
- Optimized spacing for mobile devices
- Readable typography on all screen sizes

## 🔐 Environment Configuration

Required environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000  # Backend URL
BACKEND_URL=http://127.0.0.1:8000              # Server-side backend URL
```

## 🚀 Getting Started

1. Ensure all files are in place
2. Install dependencies: `npm install`
3. Set environment variables
4. Start development server: `npm run dev`
5. Visit any of the new pages:
   - `/hospitals` - Hospital directory
   - `/doctors` - Doctor directory
   - `/nearest-info` - Enhanced nearest info

## 📋 API Response Handling

The frontend handles all response formats from the backend:

- Paginated responses with `results` array
- Direct array responses
- Error responses with proper status codes
- Empty result sets with appropriate messaging

This implementation provides a complete frontend interface for all the hospital and doctor API endpoints, with a focus on user experience, performance, and maintainability.
