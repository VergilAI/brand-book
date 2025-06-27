from sqlalchemy import Column, Integer, Numeric, DateTime
from sqlalchemy.sql import func
from .base import Base


class CompanyBalance(Base):
    __tablename__ = "company_balance"

    id = Column(Integer, primary_key=True, index=True)
    current_balance = Column(Numeric(12, 2), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())