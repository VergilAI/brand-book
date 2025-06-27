# Vergil Investor Portal - Technical Documentation

## Current Implementation Status

### Overview
The Vergil Investor Portal is a financial dashboard built with:
- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS v4
- **Backend**: FastAPI with SQLAlchemy ORM
- **Database**: SQLite (development), PostgreSQL-ready
- **Currency**: Hungarian Forint (HUF)
- **Design**: Vergil brand system with dark theme

### Core Features Implemented

#### 1. Financial Dashboard
- **Current Balance**: 27,132,243 HUF (set via seed script)
- **Monthly Metrics**: Revenue, Expenses, Burn Rate, Runway
- **Zero Date**: Calculates when company reaches 0 balance
- **Date-based Calculations**: Expenses deducted on actual dates

#### 2. Revenue System
- **Revenue Breakdown**: Shows all revenue sources
- **Hypothetical Integration**: Active hypotheticals appear with visual distinction
- **No Actual Revenue**: Currently only hypothetical revenue exists

#### 3. Expense Tracking
- **Two-Card System**:
  - Recurring Expenses (monthly subscriptions, salaries)
  - One-Time Payments (development costs)
- **Date Tracking**: Recurring expenses deduct monthly on same day
- **Current Expenses**:
  - COMET Studio: 3,500,000 HUF (July 3, 2025, one-time)
  - Employee Salaries: 3,220,804 HUF/month (starts July 5)
  - Tharpa Salary: 720,000 HUF/month (July 5 - October 5)
  - Subscriptions: 110,000 HUF/month (starts July 3)

#### 4. Hypothetical Deals
- **Toggle System**: Activate/deactivate potential deals
- **Impact Calculations**: When active, affects:
  - Revenue breakdown (shows with dashed border)
  - Burn rate (reduces net burn)
  - Runway (extends based on deal amounts)
- **Current Hypotheticals**:
  - MBH Deal: 15,000,000 HUF (Sept 1, 2025)
  - PetraTalks: 3,500,000 HUF (Aug 1, 2025)
  - Secure IT Labs: 12,000,000 HUF (Aug 1, 2025)

### Technical Architecture

#### Backend Structure
```
/app/investors/backend/
├── app/
│   ├── models/
│   │   ├── transaction.py      # Revenue/Expense models
│   │   ├── hypothetical.py     # Hypothetical deal model
│   │   └── company_balance.py  # Balance tracking
│   ├── schemas/
│   │   ├── transaction.py      # Pydantic schemas
│   │   ├── hypothetical.py
│   │   └── analytics.py        # Dashboard data schemas
│   ├── routers/
│   │   ├── transactions.py     # CRUD operations
│   │   ├── hypotheticals.py    # Deal management
│   │   ├── analytics.py        # Calculations & projections
│   │   └── dashboard.py        # Summary endpoint
│   └── main.py                 # FastAPI app
└── scripts/
    └── seed_data.py            # Database seeding
```

#### Frontend Components
```
/components/investors/
├── FinancialSummary.tsx    # Top metric cards
├── RevenueBreakdown.tsx    # Revenue table with hypotheticals
├── RecurringExpenses.tsx   # Monthly recurring costs
├── OneTimePayments.tsx     # One-time expense list
└── HypotheticalDeals.tsx   # Toggle-able potential deals
```

#### API Endpoints
- `GET /api/dashboard/summary` - Main dashboard data
- `GET /api/analytics/burnrate` - Burn rate with hypothetical support
- `GET /api/analytics/revenue-breakdown` - Revenue + active hypotheticals
- `GET /api/analytics/expense-breakdown` - All expenses
- `GET /api/hypotheticals` - List all hypothetical deals
- `PATCH /api/hypotheticals/{id}` - Toggle hypothetical active state

### Key Implementation Details

#### 1. Balance Calculation (`calculate_current_balance`)
- Starts with initial balance from database
- Iterates through all transactions up to today
- Handles recurring transactions with proper date arithmetic
- Uses `relativedelta` for accurate month calculations

#### 2. Burn Rate Calculation
- Base burn rate = monthly recurring expenses only
- When hypotheticals active:
  - One-time deals: Added to effective balance
  - Recurring deals: Reduce monthly burn rate
- Formula: `runway = effective_balance / net_burn_rate`

#### 3. Hypothetical Revenue Integration
- Stored with `is_active` flag in database
- When active, appears in revenue breakdown with:
  - "(Hypothetical)" suffix in name
  - Dashed border styling
  - Different background color
- Affects financial projections but not current balance

#### 4. Date Handling
- One-time transactions: Single date field
- Recurring transactions: start_date, end_date, frequency
- Monthly recurrence uses same day each month
- Handles month-end edge cases (e.g., Jan 31 → Feb 28)

### Current Limitations

1. **No Admin Panel**: Removed for simplicity, using seed script
2. **No Charts**: BurnrateChart and AggregateCharts removed
3. **No Real Revenue**: Only hypothetical revenue implemented
4. **Simple Runway**: Doesn't do month-by-month projection
5. **No Authentication**: Direct access only

### Next Development Areas

#### 1. Admin Panel 2.0
- Separate admin routes with auth
- CRUD for transactions and hypotheticals
- Balance adjustment interface
- Data export functionality

#### 2. Advanced Analytics
- Month-by-month cash flow projection
- Scenario modeling (best/worst case)
- Historical trend analysis
- Revenue growth projections

#### 3. Visualization
- Runway projection chart with hypothetical overlays
- Cash flow waterfall chart
- Expense breakdown pie charts
- Revenue pipeline visualization

#### 4. Enhanced Features
- Email alerts for low runway
- Hypothetical probability scoring
- Expense categorization and tagging
- Multi-currency support

### Development Commands

```bash
# Backend (from /app/investors/backend)
uv run uvicorn app.main:app --reload --port 8000
uv run python scripts/seed_data.py  # Reset database

# Frontend (from root)
npm run dev

# Access
http://localhost:3000/investors
```

### Deployment Considerations

1. **Environment Variables**
   - `DATABASE_URL` for PostgreSQL
   - `SECRET_KEY` for sessions
   - `ALLOWED_ORIGINS` for CORS

2. **Database Migration**
   - Switch from SQLite to PostgreSQL
   - Add Alembic for migrations
   - Backup strategy for financial data

3. **Security**
   - Add authentication middleware
   - Implement role-based access
   - Audit logging for changes
   - SSL/TLS enforcement

4. **Performance**
   - Cache expensive calculations
   - Optimize date arithmetic queries
   - Add database indexes
   - Consider Redis for session storage

### Code Quality Notes

- Full TypeScript coverage on frontend
- Pydantic validation on all API endpoints
- Decimal type for all monetary values
- Comprehensive error handling
- Clean separation of concerns
- No inline styles or magic numbers
- Follows Vergil design system

This implementation provides a solid foundation for a financial dashboard with sophisticated hypothetical modeling capabilities. The architecture supports easy extension while maintaining data integrity and calculation accuracy.