#!/usr/bin/env python3
"""Seed the database with sample investor data."""

import sys
import os
from datetime import date, timedelta
from decimal import Decimal

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine
from app.models import Base, Transaction, Hypothetical, CompanyBalance
from app.models.transaction import TransactionType, TransactionCategory, Frequency
from app.models.hypothetical import HypotheticalType

def seed_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(Transaction).delete()
        db.query(Hypothetical).delete()
        db.query(CompanyBalance).delete()
        
        # Add company balance
        balance = CompanyBalance(current_balance=Decimal("27132243.00"))  # 27,132,243 HUF
        db.add(balance)
        
        # Add revenue transactions (to be provided by user)
        revenues = []
        
        # Add expense transactions
        expenses = [
            {
                "type": TransactionType.EXPENSE,
                "source": "COMET Studio - Front-end development",
                "transaction_type": TransactionCategory.ONETIME,
                "amount": Decimal("3500000.00"),
                "date": date(2025, 7, 3)
            },
            {
                "type": TransactionType.EXPENSE,
                "source": "Salaries for employees (3 employees)",
                "transaction_type": TransactionCategory.RECURRING,
                "amount": Decimal("3220804.00"),
                "start_date": date(2025, 7, 5),
                "frequency": Frequency.MONTHLY
            },
            {
                "type": TransactionType.EXPENSE,
                "source": "Tharpa salary (or potential buyout)",
                "transaction_type": TransactionCategory.RECURRING,
                "amount": Decimal("720000.00"),
                "start_date": date(2025, 7, 5),
                "end_date": date(2025, 10, 5),
                "frequency": Frequency.MONTHLY
            },
            {
                "type": TransactionType.EXPENSE,
                "source": "Subscriptions",
                "transaction_type": TransactionCategory.RECURRING,
                "amount": Decimal("110000.00"),
                "start_date": date(2025, 7, 3),
                "frequency": Frequency.MONTHLY
            }
        ]
        
        # Add hypothetical deals
        hypotheticals = [
            {
                "name": "MBH Deal",
                "type": HypotheticalType.REVENUE,
                "transaction_type": TransactionCategory.ONETIME,
                "amount": Decimal("15000000.00"),  # 15M HUF
                "expected_date": date(2025, 9, 1),
                "is_active": False
            },
            {
                "name": "PetraTalks",
                "type": HypotheticalType.REVENUE,
                "transaction_type": TransactionCategory.ONETIME,
                "amount": Decimal("3500000.00"),  # 3.5M HUF
                "expected_date": date(2025, 8, 1),
                "is_active": False
            },
            {
                "name": "Secure IT Labs",
                "type": HypotheticalType.REVENUE,
                "transaction_type": TransactionCategory.ONETIME,
                "amount": Decimal("12000000.00"),  # 12M HUF
                "expected_date": date(2025, 8, 1),
                "is_active": False
            }
        ]
        
        # Insert all data
        for rev in revenues:
            db.add(Transaction(**rev))
        
        for exp in expenses:
            db.add(Transaction(**exp))
            
        for hyp in hypotheticals:
            db.add(Hypothetical(**hyp))
        
        db.commit()
        print("✓ Database seeded successfully!")
        print(f"  - Added {len(revenues)} revenue transactions")
        print(f"  - Added {len(expenses)} expense transactions")
        print(f"  - Added {len(hypotheticals)} hypothetical deals")
        print(f"  - Set company balance to 27,132,243 HUF")
        
    except Exception as e:
        print(f"✗ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()