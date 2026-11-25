"""FastAPI route definitions and in-memory telemetry tracking for ScamShield AI."""

import logging
import threading
import time
from collections import defaultdict
from datetime import datetime, timezone
from typing import Dict

from fastapi import APIRouter, HTTPException, status

from app.core.config import settings
from app.schemas.analysis import (
    AnalysisResponse,
    HealthResponse,
    MessageRequest,
    StatsResponse,
    URLAnalysisResponse,
    URLRequest,
)
from app.services.message_analyzer import MessageAnalyzer
from app.services.url_analyzer import URLAnalyzer

logger = logging.getLogger("scamshield.api")

router = APIRouter(prefix="/api", tags=["Analysis"])


class StatsTracker:
    """Thread-safe in-memory accumulator for analysis metrics."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._start_time = time.monotonic()
        self._message_analyses = 0
        self._url_analyses = 0
        self._threats_detected = 0
        self._high_risk_detected = 0
        self._safe_count = 0
        self._score_sum = 0
        self._category_breakdown: Dict[str, int] = defaultdict(int)
        self._risk_level_breakdown: Dict[str, int] = defaultdict(int)

    def record(self, kind: str, result: dict) -> None:
        """Record an analysis outcome into accumulated counters."""
        score = int(result.get("score", 0))
        risk_level = str(result.get("risk_level", "LOW RISK"))
        category = str(result.get("category", "Safe"))

        with self._lock:
            if kind == "message":
                self._message_analyses += 1
            elif kind == "url":
                self._url_analyses += 1

            self._score_sum += score
            if score <= 20:
                self._safe_count += 1
            else:
                self._threats_detected += 1
            if score >= 61:
                self._high_risk_detected += 1

            self._category_breakdown[category] += 1
            self._risk_level_breakdown[risk_level] += 1

    def snapshot(self) -> dict:
        """Return a consistent snapshot of all accumulated counters."""
        with self._lock:
            total = self._message_analyses + self._url_analyses
            avg_score = round(self._score_sum / total, 2) if total > 0 else 0.0
            return {
                "total_analyses": total,
                "message_analyses": self._message_analyses,
                "url_analyses": self._url_analyses,
                "threats_detected": self._threats_detected,
                "high_risk_detected": self._high_risk_detected,
                "safe_count": self._safe_count,
                "average_score": avg_score,
                "category_breakdown": dict(self._category_breakdown),
                "risk_level_breakdown": dict(self._risk_level_breakdown),
                "uptime_seconds": round(time.monotonic() - self._start_time, 2),
            }

    def reset(self) -> None:
        """Reset all in-memory statistics (useful for deterministic testing)."""
        with self._lock:
            self._start_time = time.monotonic()
            self._message_analyses = 0
            self._url_analyses = 0
            self._threats_detected = 0
            self._high_risk_detected = 0
            self._safe_count = 0
            self._score_sum = 0
            self._category_breakdown.clear()
            self._risk_level_breakdown.clear()


message_analyzer = MessageAnalyzer()
url_analyzer = URLAnalyzer()
stats_tracker = StatsTracker()


@router.post(
    "/analyze/message",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze a text message for scam indicators",
)
async def analyze_message(payload: MessageRequest) -> AnalysisResponse:
    """Run weighted-indicator scam detection on a message or SMS text."""
    text = payload.text
    if len(text) > settings.MAX_TEXT_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Message text exceeds maximum length of {settings.MAX_TEXT_LENGTH} characters.",
        )

    try:
        result = message_analyzer.analyze(text)
    except Exception as exc:
        logger.exception("Message analysis failed unexpectedly")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze message content.",
        ) from exc

    stats_tracker.record(kind="message", result=result)
    logger.info(
        "Message analyzed | length=%d | score=%d | risk=%s | category=%s",
        len(text),
        result["score"],
        result["risk_level"],
        result["category"],
    )
    return AnalysisResponse(**result)


@router.post(
    "/analyze/url",
    response_model=URLAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze a URL statically for phishing and spoofing indicators",
)
async def analyze_url(payload: URLRequest) -> URLAnalysisResponse:
    """Run safe static heuristic inspection on a URL without fetching remote content."""
    url = payload.url
    if len(url) > settings.MAX_URL_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"URL exceeds maximum length of {settings.MAX_URL_LENGTH} characters.",
        )

    try:
        result = url_analyzer.analyze(url)
    except Exception as exc:
        logger.exception("URL analysis failed unexpectedly")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze URL.",
        ) from exc

    stats_tracker.record(kind="url", result=result)
    logger.info(
        "URL analyzed | domain=%s | score=%d | risk=%s | category=%s",
        result.get("domain", ""),
        result["score"],
        result["risk_level"],
        result["category"],
    )
    return URLAnalysisResponse(**result)


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health check endpoint",
)
async def health_check() -> HealthResponse:
    """Return service liveness status and metadata."""
    return HealthResponse(
        status="healthy",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@router.get(
    "/stats",
    response_model=StatsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get accumulated analysis statistics",
)
async def get_stats() -> StatsResponse:
    """Return accumulated in-memory analysis metrics."""
    return StatsResponse(**stats_tracker.snapshot())
