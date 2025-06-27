from pydantic import BaseModel
from decimal import Decimal
from typing import List, Dict, Optional
from datetime import date


class DashboardSummary(BaseModel):
    current_balance: Decimal
    monthly_revenue: Decimal
    monthly_expenses: Decimal
    revenue_12month_avg: Decimal
    expense_12month_avg: Decimal
    burnrate: Decimal
    runway_months: Optional[float]
    actual_spending_this_month: Decimal
    zero_date: Optional[str]


class RevenueBreakdown(BaseModel):
    source: str
    amount: Decimal
    type: str
    transaction_type: str
    date_info: Optional[Dict[str, Optional[str]]]
    is_hypothetical: bool = False


class ExpenseBreakdown(BaseModel):
    source: str
    amount: Decimal
    type: str
    transaction_type: str
    date_info: Optional[Dict[str, Optional[str]]]


class MonthlyAverages(BaseModel):
    revenue_average: Decimal
    expense_average: Decimal
    period_months: int


class ProjectedRevenue(BaseModel):
    period: str
    recurring_revenue: Decimal
    hypothetical_revenue: Decimal
    total_projected: Decimal


class BurnrateData(BaseModel):
    monthly_expenses: Decimal
    monthly_revenue: Decimal
    burnrate: Decimal
    current_balance: Decimal
    runway_months: Optional[float]
    actual_spending_this_month: Decimal
    zero_date: Optional[str]