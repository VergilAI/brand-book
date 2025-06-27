# Vergil AI Investor Portal

Internal dashboard for reviewing company financial health and projections.

## Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd app/investors/backend
```

2. Create virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -e .
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

The frontend runs as part of the main Next.js application.

1. From the project root:
```bash
npm install
npm run dev
```

2. Access the investor portal at: http://localhost:3000/investors

## Features

- **Financial Dashboard**: Real-time balance and metrics
- **Revenue/Expense Breakdown**: Detailed transaction views
- **Burnrate Visualization**: Runway projections with D3.js charts
- **Hypothetical Deals**: Toggle potential revenue/expenses
- **Aggregate Analytics**: Filtered data visualizations

## API Endpoints

Backend runs on http://localhost:8000

- `GET /api/dashboard/summary` - Main dashboard metrics
- `GET /api/transactions` - Transaction list
- `GET /api/hypotheticals` - Hypothetical deals
- `GET /api/analytics/*` - Various analytics endpoints

## Security Notes

- This portal is for internal use only
- Implement proper authentication before deployment
- Never expose to public internet without security measures

## Deployment

For production deployment:

1. Use PostgreSQL instead of SQLite
2. Implement authentication middleware
3. Use the `.gitignore.investors` file for isolated deployment
4. Deploy backend and frontend separately or as a monolith