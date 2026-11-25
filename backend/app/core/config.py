"""Application configuration and logging setup for ScamShield AI."""

import json
import logging
import os
from typing import List, Optional

from dotenv import load_dotenv

load_dotenv()

DEFAULT_CORS_ORIGINS: List[str] = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

VALID_LOG_LEVELS = {"CRITICAL", "ERROR", "WARNING", "INFO", "DEBUG"}


def _parse_cors_origins(raw_value: Optional[str]) -> List[str]:
    """Parse CORS_ORIGINS from JSON array or comma-separated string."""
    if not raw_value or not raw_value.strip():
        return list(DEFAULT_CORS_ORIGINS)

    stripped = raw_value.strip()
    if stripped.startswith("["):
        try:
            parsed = json.loads(stripped)
            if isinstance(parsed, list):
                origins = [str(item).strip() for item in parsed if str(item).strip()]
                if origins:
                    return origins
        except json.JSONDecodeError:
            pass

    origins = [origin.strip() for origin in stripped.split(",") if origin.strip()]
    return origins if origins else list(DEFAULT_CORS_ORIGINS)


def _parse_positive_int(raw_value: Optional[str], default: int) -> int:
    """Parse a positive integer environment variable safely."""
    if raw_value is None:
        return default
    try:
        parsed = int(raw_value.strip())
        return parsed if parsed > 0 else default
    except (ValueError, AttributeError):
        return default


def _parse_log_level(raw_value: Optional[str]) -> str:
    """Validate and normalize log level string."""
    if not raw_value:
        return "INFO"
    normalized = raw_value.strip().upper()
    return normalized if normalized in VALID_LOG_LEVELS else "INFO"


class Settings:
    """Runtime settings loaded from environment variables."""

    def __init__(self) -> None:
        self.APP_NAME: str = os.getenv("APP_NAME", "ScamShield AI")
        self.APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
        self.APP_DESCRIPTION: str = (
            "Explainable cybersecurity engine for detecting scams, phishing, "
            "fraudulent messages, and malicious URLs."
        )
        self.CORS_ORIGINS: List[str] = _parse_cors_origins(os.getenv("CORS_ORIGINS"))
        self.API_KEY: Optional[str] = os.getenv("API_KEY") or None
        self.MAX_TEXT_LENGTH: int = _parse_positive_int(os.getenv("MAX_TEXT_LENGTH"), 5000)
        self.MAX_URL_LENGTH: int = _parse_positive_int(os.getenv("MAX_URL_LENGTH"), 5000)
        self.LOG_LEVEL: str = _parse_log_level(os.getenv("LOG_LEVEL"))


settings = Settings()


def configure_logging() -> None:
    """Configure application-wide structured logging."""
    level = getattr(logging, settings.LOG_LEVEL, logging.INFO)
    logging.basicConfig(
        level=level,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    logging.getLogger("scamshield").setLevel(level)
