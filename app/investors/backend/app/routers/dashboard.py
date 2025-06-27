from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from decimal import Decimal

from ..database import get_db
from ..schemas import DashboardSummary
from .analytics import get_burnrate, get_averages

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    burnrate_data = get_burnrate(db)
    averages_data = get_averages(db)
    
    return DashboardSummary(
        current_balance=burnrate_data.current_balance,
        monthly_revenue=burnrate_data.monthly_revenue,
        monthly_expenses=burnrate_data.monthly_expenses,
        revenue_12month_avg=averages_data.revenue_average,
        expense_12month_avg=averages_data.expense_average,
        burnrate=burnrate_data.burnrate,
        runway_months=burnrate_data.runway_months,
        actual_spending_this_month=burnrate_data.actual_spending_this_month,
        zero_date=burnrate_data.zero_date,
    )