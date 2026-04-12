# PetConnect - Feature Documentation

## Overview
PetConnect is a comprehensive pet service provider portal with dual viewing modes: a traditional browse experience (default) and an interactive Club Penguin-style map view.

## Key Features Implemented

### 1. Authentication System
- **Guest Mode (Default)**: Users can browse without signing in
- **User Accounts**: Full registration with username, email, and phone
- **Provider Accounts**: Special accounts for service providers
- **Session Persistence**: Login state saved via localStorage
- **Non-Intrusive Login**: No forced login popups - users can browse freely

#### Demo Credentials
- **Regular User**: john@example.com / password123
- **Provider**: contact@pawsitivegrooming.com / provider123

### 2. Default Browse Experience
- **Classic Scroll View** is now the default landing page
- Search and filter functionality for pet services
- Service categories: Grooming, Health, Care, Training, Daycare
- Distance-based filtering
- Sort by: Distance, Rating, Reviews, Name
- Interactive map promotion banner encouraging users to try the map view

### 3. Interactive Map View
- Club Penguin-style experience with pet avatars
- Click-to-move avatar controls
- Service stands for different categories
- Real-time "nearby pets" simulation
- Message bubbles and predefined communications
- Avatar customization (pet type, color, accessories)
- Location-based features (optional)

### 4. User Features

#### For Pet Owners:
- Browse and search service providers
- View detailed provider profiles
- **Book appointments** (requires login)
- Booking form with:
  - Service selection
  - Date and time picker
  - Pet information (name, type)
  - Additional notes
- Contact providers via phone, email, or message form

#### For Service Providers:
- **Provider Dashboard** with:
  - Booking management (view all appointments)
  - Manual booking addition
  - Analytics and performance metrics
  - Profile statistics

### 5. Provider Profile Customization

#### Customizable Widgets:
Providers can enable/disable features on their public profile:
- ✅ **Location & Map** - Address and embedded map (optional)
- ✅ **Team Members** - Staff listings with roles (optional)
- ✅ **Business Hours** - Weekly schedule (required)
- ✅ **Services Offered** - List of services (required)
- ✅ **Gallery Images** - Photo gallery (optional)
- ✅ **Social Media** - Facebook, Instagram, Twitter links (optional)

#### Profile Editor Workflow:
1. Click "Update My Profile" button
2. Confirmation modal: "Are you sure you want to make changes?"
3. Edit mode activated with:
   - ❌ X buttons to remove widgets (non-required only)
   - ➕ Plus buttons to add new features
   - "Available Features" tab showing unused widgets
   - Live preview of profile changes
4. Save changes to update public profile

### 6. Booking System
- **Guest Users**: Can view bookings but must sign in to complete
- **Logged-in Users**: Can book directly with their account
- **Provider Contact**: Providers can access customer contact info (email, phone) for cancellations
- **Status Management**: Pending, Confirmed, Cancelled, Completed
- **Manual Bookings**: Providers can add walk-in appointments

### 7. Privacy & Security
- Customer contact info only visible to providers for booking-related needs
- Session management with automatic persistence
- Guest mode allows browsing without data collection

## Technical Implementation

### Architecture
- **React Router**: Multi-page navigation with Data mode
- **Context API**: Global authentication state
- **TypeScript**: Full type safety
- **Tailwind CSS**: Responsive design with purple-to-pink gradient theming
- **Motion**: Smooth animations for map view
- **Shadcn/ui**: Component library for consistent UI

### Data Structure
```typescript
interface User {
  id: string;
  type: 'guest' | 'user' | 'provider';
  username?: string;
  email?: string;
  phone?: string;
  providerId?: string; // Links to provider profile
}

interface Booking {
  id: string;
  providerId: string;
  userId: string;
  service: string;
  date: string;
  time: string;
  petName: string;
  petType: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

interface Provider {
  id: string;
  name: string;
  type: string;
  services: string[];
  staff: StaffMember[];
  locations: Location[];
  availability: Schedule;
  profileWidgets: WidgetSettings;
  // ... more fields
}
```

### Routes
- `/` - Browse view (default)
- `/map` - Interactive map view
- `/browse` - Browse view (same as default)
- `/provider/:id` - Provider profile
- `/dashboard` - Provider dashboard (providers only)
- `/search` - Search results
- `/preferences` - Preference selector (legacy)

## User Flows

### Pet Owner Journey
1. Land on browse page (no login required)
2. Search/filter for services
3. View provider profiles
4. Click "Book Appointment"
5. If not logged in, sign up or login
6. Complete booking with pet details
7. Receive confirmation

### Provider Journey
1. Sign up as provider or login
2. Access provider dashboard
3. View upcoming bookings with customer contact info
4. Add manual bookings
5. Customize profile:
   - Click "Update My Profile"
   - Confirm edit mode
   - Add/remove widgets
   - Update information
   - Save changes
6. View analytics and performance

### Map View Discovery
1. User lands on browse page
2. See prominent banner promoting map view
3. Click "Explore Map View"
4. Create/customize pet avatar
5. Move around map
6. Interact with service stands
7. Communicate with other pets

## Future Enhancements Ready for Backend

The application is designed with backend integration in mind:

### Database Schema Ready:
- Users table (authentication)
- Providers table (business profiles)
- Bookings table (appointments)
- Profile_widgets table (customization settings)

### API Endpoints Needed:
- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication
- `GET /providers` - List providers with filters
- `GET /providers/:id` - Provider details
- `POST /bookings` - Create booking
- `GET /bookings/provider/:id` - Provider's bookings
- `PATCH /providers/:id` - Update provider profile
- `PUT /providers/:id/widgets` - Update widget settings

### Features Ready for Real-Time:
- Live avatar positions in map view
- Real-time booking notifications
- Online user count
- Message system between pets

## Design Philosophy

1. **Necessity First**: Browse experience is primary, map is fun secondary feature
2. **No Barriers**: Guest mode allows full browsing without forced registration
3. **Provider Flexibility**: Customizable profiles adapt to different business models
4. **Privacy Conscious**: Minimal data collection, purpose-limited access
5. **Progressive Enhancement**: Features unlock with authentication
6. **Responsive Design**: Works on desktop and mobile devices

## Notes for Backend Integration

When connecting to Supabase or another backend:

1. Replace mock data in `/src/app/data/mockData.ts`
2. Update `AuthContext` to use real API calls
3. Implement actual booking creation/management
4. Add real-time subscriptions for map view
5. Store provider widget preferences in database
6. Implement image upload for galleries
7. Add email notifications for bookings
8. Implement password reset functionality
