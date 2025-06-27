# Vergil Investors Portal - Module Documentation

## Overview

Internal investor dashboard built with Next.js frontend and FastAPI backend, showcasing financial health metrics using the Vergil design system.

## Architecture

### Frontend Structure
```
/app/investors/
├── layout.tsx       # Portal layout with dark theme
├── page.tsx        # Main dashboard page
└── README.md       # Setup instructions
```

### Backend Structure
```
/app/investors/backend/
├── app/
│   ├── models/     # SQLAlchemy models
│   ├── schemas/    # Pydantic schemas
│   ├── routers/    # API endpoints
│   └── main.py     # FastAPI app
└── pyproject.toml  # Python dependencies
```

### Components
```
/components/investors/
├── FinancialSummary.tsx    # Key metrics cards
├── RevenueBreakdown.tsx    # Revenue table
├── ExpenseBreakdown.tsx    # Expense table
├── BurnrateChart.tsx       # D3.js runway chart
├── ProjectedRevenue.tsx    # Revenue projections
├── HypotheticalDeals.tsx   # Deal management
├── HypotheticalModal.tsx   # Deal creation form
└── AggregateCharts.tsx     # Bar chart analytics
```

## Design Implementation

### Component Usage
- Uses unified Card system with `metric`, `gradient`, and `interactive` variants
- Applies brand colors: cosmic-purple, electric-violet, consciousness-cyan
- Implements breathing animations on metric cards
- Dark theme consistency (bg-dark-900, bg-dark-800)

### Data Visualization
- D3.js for burnrate/runway projections
- Custom bar charts for revenue/expense aggregation
- Real-time updates with fetch API
- Responsive SVG charts

## API Integration

### Key Endpoints
- `/api/dashboard/summary` - Main metrics
- `/api/analytics/burnrate` - Burnrate calculations
- `/api/hypotheticals` - Deal management
- `/api/analytics/projections` - Revenue forecasting

### Data Flow
1. Frontend fetches from localhost:8000 (development)
2. Components handle loading/error states
3. Real-time calculations in backend
4. D3.js renders complex visualizations

## Security Considerations

- Internal access only (implement auth before production)
- Sensitive financial data handling
- CORS configured for local development
- Environment variables for secrets

## Development Workflow

1. Start backend: `cd backend && uvicorn app.main:app --reload`
2. Start frontend: `npm run dev` (from root)
3. Access at: http://localhost:3000/investors

## Deployment

Use `.gitignore.investors` for isolated deployment:
```bash
git checkout -b deploy-investors
cp .gitignore.investors .gitignore
git add . && git commit -m "Deploy investors portal"
```

Configure environment for:
- PostgreSQL in production
- Authentication middleware
- Secure API endpoints
- HTTPS only access