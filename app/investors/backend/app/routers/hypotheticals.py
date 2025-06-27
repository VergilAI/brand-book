from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import Hypothetical
from ..schemas import HypotheticalCreate, HypotheticalUpdate, HypotheticalResponse

router = APIRouter(prefix="/api/hypotheticals", tags=["hypotheticals"])


@router.get("", response_model=List[HypotheticalResponse])
def get_hypotheticals(
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Hypothetical)
    
    if is_active is not None:
        query = query.filter(Hypothetical.is_active == is_active)
    
    return query.all()


@router.post("", response_model=HypotheticalResponse)
def create_hypothetical(
    hypothetical: HypotheticalCreate,
    db: Session = Depends(get_db),
):
    db_hypothetical = Hypothetical(**hypothetical.dict())
    db.add(db_hypothetical)
    db.commit()
    db.refresh(db_hypothetical)
    return db_hypothetical


@router.put("/{hypothetical_id}", response_model=HypotheticalResponse)
def update_hypothetical(
    hypothetical_id: int,
    hypothetical: HypotheticalUpdate,
    db: Session = Depends(get_db),
):
    db_hypothetical = db.query(Hypothetical).filter(Hypothetical.id == hypothetical_id).first()
    if not db_hypothetical:
        raise HTTPException(status_code=404, detail="Hypothetical not found")
    
    update_data = hypothetical.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_hypothetical, field, value)
    
    db.commit()
    db.refresh(db_hypothetical)
    return db_hypothetical


@router.delete("/{hypothetical_id}")
def delete_hypothetical(
    hypothetical_id: int,
    db: Session = Depends(get_db),
):
    db_hypothetical = db.query(Hypothetical).filter(Hypothetical.id == hypothetical_id).first()
    if not db_hypothetical:
        raise HTTPException(status_code=404, detail="Hypothetical not found")
    
    db.delete(db_hypothetical)
    db.commit()
    return {"message": "Hypothetical deleted successfully"}


@router.patch("/{hypothetical_id}/toggle")
def toggle_hypothetical(
    hypothetical_id: int,
    db: Session = Depends(get_db),
):
    db_hypothetical = db.query(Hypothetical).filter(Hypothetical.id == hypothetical_id).first()
    if not db_hypothetical:
        raise HTTPException(status_code=404, detail="Hypothetical not found")
    
    db_hypothetical.is_active = not db_hypothetical.is_active
    db.commit()
    db.refresh(db_hypothetical)
    return {"id": db_hypothetical.id, "is_active": db_hypothetical.is_active}