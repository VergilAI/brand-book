from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import CompanyBalance
from ..schemas import CompanyBalanceUpdate, CompanyBalanceResponse

router = APIRouter(prefix="/api/balance", tags=["balance"])


@router.get("", response_model=CompanyBalanceResponse)
def get_balance(db: Session = Depends(get_db)):
    balance = db.query(CompanyBalance).first()
    if not balance:
        raise HTTPException(status_code=404, detail="Company balance not found")
    return balance


@router.put("", response_model=CompanyBalanceResponse)
def update_balance(
    balance_update: CompanyBalanceUpdate,
    db: Session = Depends(get_db),
):
    balance = db.query(CompanyBalance).first()
    if not balance:
        balance = CompanyBalance(current_balance=balance_update.current_balance)
        db.add(balance)
    else:
        balance.current_balance = balance_update.current_balance
    
    db.commit()
    db.refresh(balance)
    return balance