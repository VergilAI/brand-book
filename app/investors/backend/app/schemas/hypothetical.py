from pydantic import BaseModel, Field
from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from .transaction import TransactionType, TransactionCategory, Frequency


class HypotheticalBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: TransactionType
    transaction_type: TransactionCategory
    amount: Decimal = Field(..., decimal_places=2)
    expected_date: Optional[date] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    frequency: Optional[Frequency] = None
    is_active: bool = True


class HypotheticalCreate(HypotheticalBase):
    pass


class HypotheticalUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[TransactionType] = None
    transaction_type: Optional[TransactionCategory] = None
    amount: Optional[Decimal] = Field(None, decimal_places=2)
    expected_date: Optional[date] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    frequency: Optional[Frequency] = None
    is_active: Optional[bool] = None


class HypotheticalResponse(HypotheticalBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True