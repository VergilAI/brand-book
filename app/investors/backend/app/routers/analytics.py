from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from datetime import date, datetime, timedelta
from dateutil.relativedelta import relativedelta
from typing import List, Optional
from decimal import Decimal

from ..database import get_db
from ..models import Transaction, Hypothetical, CompanyBalance
from ..models.transaction import TransactionType, TransactionCategory, Frequency
from ..models.hypothetical import HypotheticalType
from ..schemas import (
    RevenueBreakdown,
    ExpenseBreakdown,
    MonthlyAverages,
    ProjectedRevenue,
    BurnrateData,
)

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/revenue-breakdown", response_model=List[RevenueBreakdown])
def get_revenue_breakdown(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    try:
        query = db.query(Transaction).filter(Transaction.type == TransactionType.REVENUE)
        
        if start_date:
            query = query.filter(
                (Transaction.date >= start_date) | (Transaction.start_date >= start_date)
            )
        if end_date:
            query = query.filter(
                (Transaction.date <= end_date) | (Transaction.end_date <= end_date)
            )
        
        transactions = query.all()
        breakdown = []
        
        # Add actual revenue transactions
        for t in transactions:
            date_info = {}
            if t.transaction_type == TransactionCategory.ONETIME:
                date_info["date"] = t.date.isoformat() if t.date else None
            else:
                date_info["start_date"] = t.start_date.isoformat() if t.start_date else None
                date_info["end_date"] = t.end_date.isoformat() if t.end_date else None
                date_info["frequency"] = t.frequency.value if hasattr(t.frequency, 'value') else t.frequency
            
            breakdown.append(
                RevenueBreakdown(
                    source=t.source,
                    amount=float(t.amount),  # Convert Decimal to float
                    type=t.type.value,
                    transaction_type=t.transaction_type.value,
                    date_info=date_info,
                    is_hypothetical=False,  # Actual revenue
                )
            )
        
        # Add active hypothetical revenues
        active_hypotheticals = db.query(Hypothetical).filter(
            Hypothetical.type == HypotheticalType.REVENUE,
            Hypothetical.is_active == True
        ).all()
        
        for h in active_hypotheticals:
            date_info = {}
            if h.transaction_type == TransactionCategory.ONETIME:
                date_info["date"] = h.expected_date.isoformat() if h.expected_date else None
            else:
                date_info["start_date"] = h.start_date.isoformat() if h.start_date else None
                date_info["end_date"] = h.end_date.isoformat() if h.end_date else None
                date_info["frequency"] = h.frequency.value if hasattr(h.frequency, 'value') else h.frequency
            
            breakdown.append(
                RevenueBreakdown(
                    source=f"{h.name} (Hypothetical)",
                    amount=float(h.amount),
                    type="revenue",
                    transaction_type=h.transaction_type.value,
                    date_info=date_info,
                    is_hypothetical=True,  # Hypothetical revenue
                )
            )
        
        return breakdown
    except Exception as e:
        print(f"Error in revenue breakdown: {e}")
        raise


@router.get("/expense-breakdown", response_model=List[ExpenseBreakdown])
def get_expense_breakdown(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Transaction).filter(Transaction.type == TransactionType.EXPENSE)
    
    if start_date:
        query = query.filter(
            (Transaction.date >= start_date) | (Transaction.start_date >= start_date)
        )
    if end_date:
        query = query.filter(
            (Transaction.date <= end_date) | (Transaction.end_date <= end_date)
        )
    
    transactions = query.all()
    breakdown = []
    
    for t in transactions:
        date_info = {}
        if t.transaction_type == TransactionCategory.ONETIME:
            date_info["date"] = t.date.isoformat() if t.date else None
        else:
            date_info["start_date"] = t.start_date.isoformat() if t.start_date else None
            date_info["end_date"] = t.end_date.isoformat() if t.end_date else None
            date_info["frequency"] = t.frequency.value if hasattr(t.frequency, 'value') else t.frequency
        
        breakdown.append(
            ExpenseBreakdown(
                source=t.source,
                amount=float(t.amount),
                type=t.type.value if hasattr(t.type, 'value') else t.type,
                transaction_type=t.transaction_type.value if hasattr(t.transaction_type, 'value') else t.transaction_type,
                date_info=date_info,
            )
        )
    
    return breakdown


@router.get("/averages", response_model=MonthlyAverages)
def get_averages(db: Session = Depends(get_db)):
    twelve_months_ago = date.today() - timedelta(days=365)
    
    revenue_total = Decimal("0")
    expense_total = Decimal("0")
    
    revenue_transactions = db.query(Transaction).filter(
        Transaction.type == TransactionType.REVENUE,
        (Transaction.date >= twelve_months_ago) | (Transaction.start_date <= date.today())
    ).all()
    
    expense_transactions = db.query(Transaction).filter(
        Transaction.type == TransactionType.EXPENSE,
        (Transaction.date >= twelve_months_ago) | (Transaction.start_date <= date.today())
    ).all()
    
    for t in revenue_transactions:
        if t.transaction_type == TransactionCategory.ONETIME and t.date and t.date >= twelve_months_ago:
            revenue_total += t.amount
        elif t.transaction_type == TransactionCategory.RECURRING:
            monthly_amount = calculate_monthly_amount(t)
            revenue_total += monthly_amount * 12
    
    for t in expense_transactions:
        if t.transaction_type == TransactionCategory.ONETIME and t.date and t.date >= twelve_months_ago:
            expense_total += t.amount
        elif t.transaction_type == TransactionCategory.RECURRING:
            monthly_amount = calculate_monthly_amount(t)
            expense_total += monthly_amount * 12
    
    return MonthlyAverages(
        revenue_average=revenue_total / 12,
        expense_average=expense_total / 12,
        period_months=12,
    )


@router.get("/projections", response_model=ProjectedRevenue)
def get_projections(
    period: str = "1month",
    db: Session = Depends(get_db),
):
    period_multiplier = {
        "1month": 1,
        "1quarter": 3,
        "1year": 12,
    }.get(period, 1)
    
    recurring_revenue = Decimal("0")
    hypothetical_revenue = Decimal("0")
    
    # Get all recurring revenue transactions
    recurring_transactions = db.query(Transaction).filter(
        Transaction.type == TransactionType.REVENUE,
        Transaction.transaction_type == TransactionCategory.RECURRING,
        Transaction.start_date <= date.today(),
        (Transaction.end_date == None) | (Transaction.end_date >= date.today())
    ).all()
    
    for t in recurring_transactions:
        monthly_amount = calculate_monthly_amount(t)
        recurring_revenue += monthly_amount * period_multiplier
    
    # Get all active revenue hypotheticals
    active_hypotheticals = db.query(Hypothetical).filter(
        Hypothetical.type == HypotheticalType.REVENUE,
        Hypothetical.is_active == True
    ).all()
    
    # Debug logging
    print(f"Found {len(active_hypotheticals)} active revenue hypotheticals")
    for h in active_hypotheticals:
        print(f"  - {h.name}: {h.amount} ({h.transaction_type})")
    
    for h in active_hypotheticals:
        transaction_type = h.transaction_type.value if hasattr(h.transaction_type, 'value') else h.transaction_type
        if transaction_type == "onetime":
            # Include one-time hypotheticals based on period and expected date
            if h.expected_date:
                days_until = (h.expected_date - date.today()).days
                if period == "1month" and days_until <= 30:
                    hypothetical_revenue += h.amount
                elif period == "1quarter" and days_until <= 90:
                    hypothetical_revenue += h.amount
                elif period == "1year" and days_until <= 365:
                    hypothetical_revenue += h.amount
        else:
            # Recurring hypotheticals
            monthly_amount = calculate_monthly_amount(h)
            hypothetical_revenue += monthly_amount * period_multiplier
    
    result = ProjectedRevenue(
        period=period,
        recurring_revenue=recurring_revenue,
        hypothetical_revenue=hypothetical_revenue,
        total_projected=recurring_revenue + hypothetical_revenue,
    )
    
    print(f"Projection result: recurring={recurring_revenue}, hypothetical={hypothetical_revenue}, total={result.total_projected}")
    return result


@router.get("/burnrate", response_model=BurnrateData)
def get_burnrate(db: Session = Depends(get_db)):
    print("=== Calculating burnrate ===")
    monthly_revenue = Decimal("0")
    monthly_expenses = Decimal("0")
    
    # Get recurring revenue that's currently active
    revenue_transactions = db.query(Transaction).filter(
        Transaction.type == TransactionType.REVENUE
    ).filter(
        or_(
            # Include one-time transactions from last 30 days
            and_(Transaction.transaction_type == TransactionCategory.ONETIME, Transaction.date >= date.today() - timedelta(days=30)),
            # Include recurring transactions that are currently active
            and_(
                Transaction.transaction_type == TransactionCategory.RECURRING,
                or_(Transaction.start_date == None, Transaction.start_date <= date.today()),
                or_(Transaction.end_date == None, Transaction.end_date >= date.today())
            )
        )
    ).all()
    
    # Get recurring expenses that are currently active
    expense_transactions = db.query(Transaction).filter(
        Transaction.type == TransactionType.EXPENSE
    ).filter(
        or_(
            # Include one-time transactions from last 30 days
            and_(Transaction.transaction_type == TransactionCategory.ONETIME, Transaction.date >= date.today() - timedelta(days=30)),
            # Include recurring transactions that are currently active
            and_(
                Transaction.transaction_type == TransactionCategory.RECURRING,
                or_(Transaction.start_date == None, Transaction.start_date <= date.today()),
                or_(Transaction.end_date == None, Transaction.end_date >= date.today())
            )
        )
    ).all()
    
    print(f"Found {len(revenue_transactions)} revenue transactions")
    print(f"Found {len(expense_transactions)} expense transactions")
    
    # Calculate revenue (all types)
    for t in revenue_transactions:
        if t.transaction_type == TransactionCategory.ONETIME:
            monthly_revenue += t.amount
            print(f"  One-time revenue: {t.source} - {t.amount}")
        else:
            amount = calculate_monthly_amount(t)
            monthly_revenue += amount
            print(f"  Recurring revenue: {t.source} - {amount}/month (from {t.amount} {t.frequency.value if t.frequency else 'monthly'})")
    
    # Add active hypothetical revenues to monthly revenue calculation
    active_hypotheticals = db.query(Hypothetical).filter(
        Hypothetical.type == HypotheticalType.REVENUE,
        Hypothetical.is_active == True
    ).all()
    
    hypothetical_monthly_revenue = Decimal("0")
    for h in active_hypotheticals:
        if h.transaction_type == TransactionCategory.ONETIME:
            # For one-time hypotheticals, check if they're expected within the next 30 days
            if h.expected_date and h.expected_date <= date.today() + timedelta(days=30):
                hypothetical_monthly_revenue += h.amount
                print(f"  Active hypothetical revenue (one-time): {h.name} - {h.amount} on {h.expected_date}")
        else:
            # Recurring hypotheticals
            amount = calculate_monthly_amount(h)
            hypothetical_monthly_revenue += amount
            print(f"  Active hypothetical revenue (recurring): {h.name} - {amount}/month")
    
    # Add hypothetical revenue to total monthly revenue
    monthly_revenue += hypothetical_monthly_revenue
    
    # Get ALL recurring expenses for proper monthly calculation
    all_recurring_expenses = db.query(Transaction).filter(
        Transaction.type == TransactionType.EXPENSE,
        Transaction.transaction_type == TransactionCategory.RECURRING
    ).all()
    
    # Calculate monthly recurring expenses (regardless of start date for display purposes)
    for t in all_recurring_expenses:
        amount = calculate_monthly_amount(t)
        monthly_expenses += amount
        print(f"  Recurring expense: {t.source} - {amount}/month (starts {t.start_date})")
    
    # Calculate total expenses for burnrate (only active ones)
    total_monthly_expenses = Decimal("0")
    for t in expense_transactions:
        if t.transaction_type == TransactionCategory.ONETIME:
            total_monthly_expenses += t.amount
            print(f"  One-time expense: {t.source} - {t.amount}")
        else:
            amount = calculate_monthly_amount(t)
            total_monthly_expenses += amount
    
    # Burnrate equals monthly expenses (not net of revenue)
    burnrate = monthly_expenses
    
    print(f"Monthly recurring revenue: {monthly_revenue}")
    print(f"Monthly recurring expenses: {monthly_expenses}")
    print(f"Total monthly expenses (including one-time): {total_monthly_expenses}")
    print(f"Burnrate (monthly expenses): {burnrate}")
    
    # Calculate current balance based on all transactions
    current_balance = calculate_current_balance(db)
    print(f"Calculated current balance: {current_balance}")
    
    # Calculate runway based on net burn (expenses minus revenue if hypotheticals are active)
    runway_months = None
    zero_date = None
    today = date.today()
    
    # Calculate total future one-time hypothetical revenue
    future_hypothetical_revenue = Decimal("0")
    for h in active_hypotheticals:
        if h.transaction_type == TransactionCategory.ONETIME and h.expected_date and h.expected_date > today:
            future_hypothetical_revenue += h.amount
            print(f"  Future hypothetical revenue: {h.name} - {h.amount} on {h.expected_date}")
    
    # Calculate effective balance including future one-time hypotheticals
    effective_balance = current_balance + future_hypothetical_revenue
    
    # If we have active hypothetical revenue, calculate net burn rate (only recurring revenue affects monthly burn)
    recurring_hypothetical_revenue = Decimal("0")
    for h in active_hypotheticals:
        if h.transaction_type == TransactionCategory.RECURRING:
            recurring_hypothetical_revenue += calculate_monthly_amount(h)
    
    # Net burnrate only considers recurring revenues
    net_burnrate = burnrate - recurring_hypothetical_revenue
    
    if net_burnrate > 0 and effective_balance > 0:
        # Calculate runway with effective balance / net monthly burn
        runway_months = float(effective_balance / net_burnrate)
        
        # Calculate the date when balance reaches zero
        # This is approximate - actual date would need transaction-by-transaction calculation
        from datetime import datetime
        zero_date = today + relativedelta(months=int(runway_months))
        
        print(f"Current balance: {current_balance}")
        print(f"Future hypothetical revenue: {future_hypothetical_revenue}")
        print(f"Effective balance: {effective_balance}")
        print(f"Net burn rate (with recurring revenue): {net_burnrate}")
        print(f"Runway: {runway_months:.1f} months")
        print(f"Estimated zero date: {zero_date}")
    elif net_burnrate <= 0:
        # Company is cash flow positive
        runway_months = None  # Infinite runway
        zero_date = None
        print(f"Company is cash flow positive! Net burn: {net_burnrate}")
    
    # Calculate actual spending for next 30 days
    thirty_days_from_now = today + timedelta(days=30)
    
    actual_spending_this_month = Decimal("0")
    
    # Add recurring expenses that are or will be active in the next 30 days
    for t in all_recurring_expenses:
        # Check if this expense is active or will start within 30 days
        if t.start_date and t.start_date <= thirty_days_from_now:
            # Check if it hasn't ended or won't end before today
            if not t.end_date or t.end_date >= today:
                actual_spending_this_month += calculate_monthly_amount(t)
                print(f"  Recurring expense active in next 30 days: {t.source}")
    
    # Add one-time expenses in the next 30 days
    one_time_expenses = db.query(Transaction).filter(
        Transaction.type == TransactionType.EXPENSE,
        Transaction.transaction_type == TransactionCategory.ONETIME,
        Transaction.date >= today,
        Transaction.date <= thirty_days_from_now
    ).all()
    
    for t in one_time_expenses:
        actual_spending_this_month += t.amount
        print(f"  One-time expense in next 30 days: {t.source} on {t.date} - {t.amount}")
    
    return BurnrateData(
        monthly_expenses=monthly_expenses,
        monthly_revenue=monthly_revenue,
        burnrate=burnrate,
        current_balance=current_balance,
        runway_months=runway_months,
        actual_spending_this_month=actual_spending_this_month,
        zero_date=zero_date.isoformat() if zero_date else None,
    )


def calculate_current_balance(db: Session) -> Decimal:
    """Calculate current balance considering all transactions up to today."""
    # Get the initial balance
    balance_record = db.query(CompanyBalance).first()
    if not balance_record:
        return Decimal("0")
    
    initial_balance = balance_record.current_balance
    balance_date = balance_record.updated_at.date() if balance_record.updated_at else date.today()
    
    # Get all transactions
    all_transactions = db.query(Transaction).all()
    
    running_balance = initial_balance
    today = date.today()
    
    for transaction in all_transactions:
        if transaction.transaction_type == TransactionCategory.ONETIME:
            # One-time transaction
            if transaction.date and transaction.date <= today and transaction.date >= balance_date:
                if transaction.type == TransactionType.EXPENSE:
                    running_balance -= transaction.amount
                else:  # REVENUE
                    running_balance += transaction.amount
                    
        elif transaction.transaction_type == TransactionCategory.RECURRING:
            # Recurring transaction
            if not transaction.start_date:
                continue
                
            start = transaction.start_date
            end = transaction.end_date if transaction.end_date else today
            
            # Don't process if start date is in the future
            if start > today:
                continue
                
            # Calculate occurrences between start date and today (or end date)
            current_date = start
            while current_date <= min(end, today):
                if current_date >= balance_date:
                    if transaction.type == TransactionType.EXPENSE:
                        running_balance -= transaction.amount
                    else:  # REVENUE
                        running_balance += transaction.amount
                
                # Move to next occurrence based on frequency
                if transaction.frequency == Frequency.MONTHLY:
                    # Use relativedelta to handle month-end dates properly
                    current_date = current_date + relativedelta(months=1)
                elif transaction.frequency == Frequency.QUARTERLY:
                    current_date = current_date + relativedelta(months=3)
                elif transaction.frequency == Frequency.YEARLY:
                    current_date = current_date + relativedelta(years=1)
                else:
                    # Default to monthly if no frequency specified
                    current_date = current_date + relativedelta(months=1)
    
    return running_balance


def calculate_monthly_amount(transaction):
    # Handle both Transaction and Hypothetical objects
    if hasattr(transaction, 'frequency') and transaction.frequency:
        # Handle enum or string values
        if hasattr(transaction.frequency, 'value'):
            freq = transaction.frequency.value
        else:
            freq = transaction.frequency
            
        # Check against enum values or strings
        if freq == "monthly" or transaction.frequency == Frequency.MONTHLY:
            return transaction.amount
        elif freq == "quarterly" or transaction.frequency == Frequency.QUARTERLY:
            return transaction.amount / 3
        elif freq == "yearly" or transaction.frequency == Frequency.YEARLY:
            return transaction.amount / 12
    # Default to monthly if no frequency specified
    return transaction.amount