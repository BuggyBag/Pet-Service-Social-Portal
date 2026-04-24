
  # 🐾 Pet Service Social Portal

A modern, interactive social platform connecting pet owners with professional pet service providers. Features a creative pet avatar system, interactive map-based discovery, and comprehensive booking management.

## ✨ Features

### 🎯 User Features
- **Account Management**
  - Secure email/password authentication via Supabase
  - Customizable user profiles
  - Password change and recovery
  - Personal dashboard with booking history

- **Pet Management**
  - Add and manage multiple pets
  - Store pet information (breed, age, medical info, etc.)
  - Track pet birthdays and medical details
  - Organize pets by type

- **Service Discovery**
  - Browse providers by category (grooming, health, training, care, daycare)
  - Search by keyword, distance, or rating
  - Quick preference selector (map or grid view)
  - Detailed provider profiles with services and reviews

- **Booking Management**
  - Book services from providers
  - View upcoming and past bookings
  - Cancel or reschedule appointments
  - Track booking status in real-time

### 🏢 Provider Features
- **Business Dashboard**
  - Manage services and availability
  - View and manage bookings
  - Edit business profile and information
  - Manage team members

- **Profile Management**
  - Comprehensive service offerings
  - Business location and hours
  - Social media integration
  - Photo gallery and team showcase

### 🎮 Interactive Map (Optional View)
- **Pet Avatars**
  - Create and customize your pet avatar
  - Interact with nearby pet avatars
  - Leave messages for other pets
  - Discover services in a fun, social way

- **Social Elements**
  - Browse nearby pets and providers
  - Connect with pet owners
  - Share pet information
  - Community-driven recommendations

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.3.1 or higher
- **pnpm** 8.0+ (or npm/yarn)
- **Supabase** account (free tier available at https://supabase.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BuggyBag/Pet-Service-Social-Portal.git
   cd Pet-Service-Social-Portal
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```
   Visit `http://localhost:5173` in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AccountSettings.tsx
│   │   ├── PetManagement.tsx
│   │   ├── UserBookingHistory.tsx
│   │   └── ...
│   ├── context/            # React Context providers
│   │   └── AuthContext.tsx
│   ├── data/               # Type definitions and mock data
│   │   └── mockData.ts
│   ├── pages/              # Route page components
│   │   ├── Root.tsx
│   │   ├── UserDashboard.tsx
│   │   ├── ProviderDashboard.tsx
│   │   ├── MapView.tsx
│   │   └── ...
│   ├── App.tsx
│   └── routes.tsx
├── lib/
│   ├── api.ts              # API client functions
│   ├── supabase.ts         # Supabase client setup
│   ├── errorHandler.ts     # Error handling utility
│   ├── validation.ts       # Form validation utilities
│   ├── petService.ts       # Pet management service
│   └── logger.ts           # Logging utility
├── styles/                 # Global styles and theme
│   ├── index.css
│   ├── tailwind.css
│   ├── theme.css
│   └── fonts.css
└── main.tsx                # Application entry point
```

## 🛠 Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | React | 18.3.1 |
| **Build Tool** | Vite | 6.3.5 |
| **Language** | TypeScript | ^19.2 |
| **Styling** | Tailwind CSS | 4.1.12 |
| **Components** | shadcn/ui | Latest |
| **Routing** | React Router | 7.13.0 |
| **Backend** | Supabase | ^2.103.0 |
| **Icons** | Lucide React | 0.487.0 |
| **Animations** | Motion | Latest |
| **Notifications** | Sonner | 2.0.3 |

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Developer setup and workflow
- **[FEATURES.md](./FEATURES.md)** - Complete feature checklist
- **[ACCOUNT_SYSTEM.md](./ACCOUNT_SYSTEM.md)** - Account management details
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Architecture overview
- **[guidelines/Guidelines.md](./guidelines/Guidelines.md)** - Development guidelines

## 🚀 Development Workflow

### Available Commands

```bash
# Development server (with hot reload)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm type-check
```

### Key Workflows

**Adding a New Feature:**
1. Create component in `src/app/components/`
2. Add TypeScript interfaces in `src/app/data/mockData.ts`
3. Create service layer in `src/lib/` if needed
4. Add route in `src/app/routes.tsx`
5. Use form validation from `src/lib/validation.ts`
6. Implement error handling with `handleError` utility

**Creating a New Page:**
1. Create `.tsx` file in `src/app/pages/`
2. Add route to `src/app/routes.tsx`
3. Use `useAuth()` hook for authentication
4. Use `useNavigate()` for navigation

**Adding API Integration:**
1. Create function in `src/lib/api.ts` or dedicated service
2. Add proper TypeScript types
3. Use `handleError()` for error handling
4. Add loading states and validation

## 🔐 Security & Best Practices

### Authentication
- Uses Supabase Auth for secure password handling
- Session tokens managed automatically
- Password reset via email verification
- Strong password requirements enforced

### Data Protection
- Supabase handles data encryption at rest
- Row-level security (RLS) policies in database
- No sensitive data exposed in client code
- Input validation on all forms

### Error Handling
- Centralized error handler utility
- User-friendly error messages
- Console logging for debugging
- Error boundaries at app root

## 🎨 UI/UX Design

### Design System
- **Color Scheme:** Purple to Pink gradient theme
- **Component Library:** shadcn/ui (Radix UI + Tailwind)
- **Typography:** System fonts with fallbacks
- **Icons:** Lucide React (100+ icons)
- **Animations:** Motion React for smooth transitions

### Responsive Design
- Mobile-first approach
- Tailwind breakpoints: `sm`, `md`, `lg`, `xl`
- Touch-friendly interactive elements
- Optimized for all screen sizes

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Make your changes and test thoroughly
3. Follow TypeScript and component conventions
4. Add proper error handling and validation
5. Update documentation if needed
6. Submit a pull request

### Code Standards
- **Language:** TypeScript (strict mode)
- **Style:** Tailwind CSS + CSS-in-JS when needed
- **Components:** Functional components with hooks
- **State:** React Context for global, hooks for local
- **Naming:** camelCase for variables/functions, PascalCase for components

## 📊 Database Schema

### Core Tables
- **profiles** - User account information
- **providers** - Service provider businesses
- **pets** - User pet profiles
- **bookings** - Service appointments
- **provider_services** - Services offered
- **provider_availability** - Business hours

See Supabase documentation for full schema.

## 🐛 Troubleshooting

### Port 5173 Already in Use
```bash
pnpm dev -- --port 3000
```

### Supabase Connection Error
- Verify VITE_SUPABASE_URL is correct
- Check VITE_SUPABASE_ANON_KEY is valid
- Ensure `.env.local` is in project root
- Restart dev server after env changes

### Build Fails
```bash
# Clear dependencies and reinstall
pnpm install --force
pnpm build
```

### TypeScript Errors
```bash
# Type check without building
pnpm type-check
```

## 🔄 Version History

### Current Version: 1.0.0
- ✅ User authentication and profiles
- ✅ Pet management system
- ✅ Provider discovery and booking
- ✅ Interactive map view
- ✅ Account management
- ⏳ Email notifications (coming soon)
- ⏳ Two-factor authentication (roadmap)
- ⏳ Social login (OAuth) (roadmap)

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙏 Credits & Attributions

- **shadcn/ui** - Component library built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Supabase** - Backend as a service
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Motion React** - Animation library
- **Original Design** - Figma design by project team

## 📞 Support

For issues, questions, or suggestions:
1. Check [QUICK_START.md](./QUICK_START.md) for common issues
2. Review [FEATURES.md](./FEATURES.md) for feature details
3. Check GitHub issues for similar problems
4. Create a new issue with detailed description

## 🚀 Deployment

### Deploy to Production
1. Build: `pnpm build`
2. Output in `dist/` folder
3. Deploy to Vercel, Netlify, or similar
4. Set environment variables in deployment platform
5. Ensure Supabase is configured for production

### Environment Variables for Production
```
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

---

**Made with ❤️ for pet lovers and service providers**
  