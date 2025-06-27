from sqlalchemy import Column, Integer, String, Text, Numeric, Date, DateTime, Boolean, Enum
from sqlalchemy.sql import func
import enum
from .base import Base


class HypotheticalType(str, enum.Enum):
    REVENUE = "revenue"
    EXPENSE = "expense"


class TransactionCategory(str, enum.Enum):
    ONETIME = "onetime"
    RECURRING = "recurring"


class Frequency(str, enum.Enum):
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"


class Hypothetical(Base):
    __tablename__ = "hypotheticals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)  # Optional name for the hypothetical
    description = Column(Text, nullable=True)  # Optional description
    type = Column(Enum(HypotheticalType), nullable=False)
    transaction_type = Column(Enum(TransactionCategory), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    expected_date = Column(Date, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    frequency = Column(Enum(Frequency), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())