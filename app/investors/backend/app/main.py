from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine
from .models import Base
from .routers import (
    transactions_router,
    hypotheticals_router,
    balance_router,
    analytics_router,
    dashboard_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Vergil Investors API",
    version="0.1.0",
    description="Backend API for Vergil AI Investor Dashboard",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)
app.include_router(transactions_router)
app.include_router(hypotheticals_router)
app.include_router(balance_router)
app.include_router(analytics_router)


@app.get("/")
def read_root():
    return {"message": "Vergil Investors API"}