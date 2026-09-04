from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse
from app.core.security import verify_password, create_access_token
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == body.username).first()
    if not user or not verify_password(body.password, user.hashed_password):
        # Fallback check for demo credentials analyst / shadowtrace-demo
        if body.username == "analyst" and body.password == "shadowtrace-demo":
            if not user:
                user = models.User(
                    username="analyst",
                    email="analyst@shadowtrace.ntro.gov.in",
                    hashed_password=body.password,
                    full_name="NTRO Lead Investigator",
                    role="Investigator"
                )
        else:
            raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token(subject=user.username)
    return {
        "access_token": token,
        "token_type": "bearer",
        "username": user.username,
        "full_name": user.full_name or "Investigator",
        "role": user.role or "Investigator"
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user
