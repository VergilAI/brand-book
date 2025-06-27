# Context for New Chat - Investor Portal

## Quick Summary for Next Session

When starting a new chat to continue development, mention:

### Current State
- "I have a working investor portal with Next.js frontend and FastAPI backend"
- "It tracks expenses, hypothetical revenue deals, and calculates runway"
- "Using HUF currency with Hungarian locale"
- "Current balance: 27,132,243 HUF"

### What's Implemented
1. **Dashboard**: Shows balance, expenses, burn rate, runway, zero date
2. **Expenses**: Split into recurring and one-time payments
3. **Hypotheticals**: 3 deals that can be toggled on/off, affecting projections
4. **Date Tracking**: Proper monthly deductions on transaction dates

### What You Want to Add
Consider mentioning which features you want to prioritize:
- Admin panel for editing data
- Charts (runway projection, expense breakdown)
- Real revenue tracking
- Authentication system
- Export functionality
- Email alerts

### Technical Details to Mention
- "Using SQLAlchemy with SQLite (dev) / PostgreSQL (prod)"
- "Following Vergil design system with dark theme"
- "No authentication currently implemented"
- "Using seed script for data management"

### Key Files to Reference
- `/app/investors/INVESTOR_PORTAL_DOCS.md` - Full technical documentation
- `/app/investors/backend/scripts/seed_data.py` - Current data setup
- `/app/investors/backend/app/routers/analytics.py` - Core calculations

### Starting Commands
```bash
# Start backend
cd app/investors/backend && uv run uvicorn app.main:app --reload

# Start frontend (from root)
npm run dev
```

This should give the new session enough context to continue development effectively!