import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ShadowTrace"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "shadowtrace_secret_key_sih2026_demo_key_998123")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # DB Configuration: default to PostgreSQL if configured, or SQLite fallback for portable dev
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./shadowtrace.db"
    )
    
    # Normalizing postgresql:// to postgresql+psycopg:// if needed
    @property
    def sqlalchemy_database_url(self) -> str:
        url = self.DATABASE_URL
        if url.startswith("postgresql://"):
            return url.replace("postgresql://", "postgresql+psycopg://", 1)
        return url

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
