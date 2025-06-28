# Vergil Investors Portal

## Project Overview

Internal investor dashboard and admin portal for monitoring Vergil's financial health metrics.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components + Radix UI primitives
- **Animations**: Framer Motion
- **Data Visualization**: D3.js
- **Storage**: AWS S3 for data persistence
- **Authentication**: JWT with secure cookies

## Architecture

### Frontend Structure
```
/app/investors/
├── layout.tsx          # Portal layout with dark theme
├── page.tsx           # Main dashboard page
├── login/             # Authentication
├── admin/             # Admin panel
├── history/           # Historical analysis
└── data/              # Local data files (development only)
```

### API Routes
```
/app/api/investors/
├── auth/              # Authentication endpoints
├── dashboard/         # Dashboard metrics
├── users/             # User management
├── revenues/          # Revenue CRUD
├── expenses/          # Expense CRUD
├── balances/          # Balance management
├── hypotheticals/     # Hypothetical scenarios
├── history/           # Historical data
└── status/            # API health check
```

### Components
```
/components/
├── ui/                # Core UI components
├── vergil/            # Brand components
└── investors/         # Portal-specific components
```

## Data Integration

### S3 Configuration
- Bucket: `generalvergilstorage`
- Path: `vergil-investor-data/production/`
- Files: users.json, revenues.json, expenses.json, balances.json, hypotheticals.json

### Environment Variables
```env
# Authentication
JWT_SECRET=your-secure-jwt-secret-here

# S3 Configuration
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=eu-north-1
S3_BUCKET=generalvergilstorage

# Development Options
USE_LOCAL_FILES=false  # Set to true for local development
NODE_ENV=production
```

## Security

- JWT authentication with secure httpOnly cookies
- Role-based access control (admin/investor)
- Rate limiting on login attempts
- Account lockout after failed attempts
- Comprehensive security event logging
- Input validation with Zod schemas

## Key Features

### Dashboard
- Real-time financial metrics
- Burn rate calculation and runway projection
- Revenue/expense breakdowns
- Interactive D3.js visualizations
- Hypothetical scenario modeling

### Admin Panel
- User management (add/remove investors)
- Data import/export functionality
- Manual balance adjustments
- Security settings and logs
- Historical data analysis

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Deployment to Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Required Environment Variables for Vercel:
- `JWT_SECRET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET`
- `USE_LOCAL_FILES=false`
- `NODE_ENV=production`

## API Security

All API endpoints require authentication except:
- `/api/investors/auth` (login)
- `/api/investors/status` (health check)

Admin-only endpoints:
- All POST/PUT/DELETE operations
- User management endpoints
- Data export functionality

## Tailwind CSS v4

This project uses Tailwind CSS v4 with the following configuration:
- Import syntax: `@import "tailwindcss"`
- Brand color tokens: cosmic-purple, electric-violet, consciousness-cyan, etc.
- Dark theme by default: bg-dark-900, bg-dark-800

## Component Architecture

### Design System
- Uses Class Variance Authority (CVA) for component variants
- Unified Card system with multiple variants
- Brand components: VergilLogo, IrisPattern
- All components fully typed with TypeScript

### Accessibility
- WCAG AA compliance
- Proper ARIA labels
- Keyboard navigation support
- Focus management

## Performance

- Automatic S3 caching with 1-minute TTL
- Service worker for offline support
- Progressive Web App ready
- Optimized D3.js visualizations