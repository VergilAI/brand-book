from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime, Enum
from sqlalchemy.sql import func
import enum
from .base import Base


class TransactionType(str, enum.Enum):
    REVENUE = "revenue"
    EXPENSE = "expense"


class TransactionCategory(str, enum.Enum):
    ONETIME = "onetime"
    RECURRING = "recurring"


class Frequency(str, enum.Enum):
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(TransactionType), nullable=False)
    source = Column(String, nullable=False)
    transaction_type = Column(Enum(TransactionCategory), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    date = Column(Date, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    frequency = Column(Enum(Frequency), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())