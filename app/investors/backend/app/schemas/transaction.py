from pydantic import BaseModel, Field
from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from typing import Optional


class TransactionType(str, Enum):
    REVENUE = "revenue"
    EXPENSE = "expense"


class TransactionCategory(str, Enum):
    ONETIME = "onetime"
    RECURRING = "recurring"


class Frequency(str, Enum):
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"


class TransactionBase(BaseModel):
    type: TransactionType
    source: str
    transaction_type: TransactionCategory
    amount: Decimal = Field(..., decimal_places=2)
    date: Optional[date] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    frequency: Optional[Frequency] = None


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    type: Optional[TransactionType] = None
    source: Optional[str] = None
    transaction_type: Optional[TransactionCategory] = None
    amount: Optional[Decimal] = Field(None, decimal_places=2)
    date: Optional[date] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    frequency: Optional[Frequency] = None


class TransactionResponse(TransactionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True