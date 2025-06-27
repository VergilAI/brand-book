from pydantic import BaseModel, Field
from datetime import datetime
from decimal import Decimal


class CompanyBalanceUpdate(BaseModel):
    current_balance: Decimal = Field(..., decimal_places=2)


class CompanyBalanceResponse(BaseModel):
    id: int
    current_balance: Decimal
    updated_at: datetime

    class Config:
        from_attributes = True