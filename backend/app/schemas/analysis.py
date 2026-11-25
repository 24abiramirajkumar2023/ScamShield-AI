"""Pydantic request and response schemas for ScamShield AI endpoints."""

from typing import Dict, List

from pydantic import BaseModel, Field, field_validator

from app.core.config import settings


class MessageRequest(BaseModel):
    """Request payload for message scam analysis."""

    text: str = Field(
        ...,
        description="SMS, email, chat, or social message text to analyze.",
    )

    @field_validator("text")
    @classmethod
    def validate_text(cls, value: str) -> str:
        """Ensure message text is non-empty and within configured length bounds."""
        if not value or not value.strip():
            raise ValueError("Message text cannot be empty or whitespace only.")
        if len(value) > settings.MAX_TEXT_LENGTH:
            raise ValueError(
                f"Message text exceeds maximum allowed length of {settings.MAX_TEXT_LENGTH} characters."
            )
        return value


class URLRequest(BaseModel):
    """Request payload for static URL security analysis."""

    url: str = Field(
        ...,
        description="URL string to analyze safely without fetching remote content.",
    )

    @field_validator("url")
    @classmethod
    def validate_url(cls, value: str) -> str:
        """Ensure URL string is non-empty and within configured length bounds."""
        cleaned = value.strip() if value else ""
        if not cleaned:
            raise ValueError("URL cannot be empty or whitespace only.")
        if len(cleaned) > settings.MAX_URL_LENGTH:
            raise ValueError(
                f"URL exceeds maximum allowed length of {settings.MAX_URL_LENGTH} characters."
            )
        return cleaned


class ThreatSignal(BaseModel):
    """Individual weighted threat indicator discovered during analysis."""

    name: str = Field(..., description="Identifier of the detected threat indicator.")
    severity: str = Field(..., description="Severity level: low, medium, high, or critical.")
    explanation: str = Field(..., description="Human-readable explanation of why this signal is risky.")
    matched_phrase: str = Field(..., description="Exact substring or artifact matched in the input.")


class AnalysisResponse(BaseModel):
    """Response payload returned by the message analysis endpoint."""

    score: int = Field(..., ge=0, le=100, description="Normalized risk score from 0 to 100.")
    risk_level: str = Field(..., description="Categorical risk tier based on score.")
    category: str = Field(..., description="Classified scam category or Safe.")
    summary: str = Field(..., description="Concise summary of the risk assessment.")
    signals: List[ThreatSignal] = Field(
        default_factory=list,
        description="Detected threat signals with severities and explanations.",
    )
    highlighted_phrases: List[str] = Field(
        default_factory=list,
        description="Matched phrases extracted from the input text for UI highlighting.",
    )
    explanations: List[str] = Field(
        default_factory=list,
        description="Detailed plain-English reasons supporting the risk score.",
    )
    recommendations: List[str] = Field(
        default_factory=list,
        description="Actionable safety recommendations for the user.",
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Confidence score of the classification between 0.0 and 1.0.",
    )


class URLAnalysisResponse(BaseModel):
    """Response payload returned by the URL analysis endpoint."""

    url: str = Field(default="", description="Normalized URL evaluated by the engine.")
    domain: str = Field(default="", description="Extracted hostname or domain from the URL.")
    score: int = Field(..., ge=0, le=100, description="Normalized risk score from 0 to 100.")
    risk_level: str = Field(..., description="Categorical risk tier based on score.")
    category: str = Field(..., description="Classified URL threat category or Safe.")
    summary: str = Field(..., description="Concise summary of the URL risk assessment.")
    signals: List[ThreatSignal] = Field(
        default_factory=list,
        description="Detected URL threat signals with severities and explanations.",
    )
    highlighted_phrases: List[str] = Field(
        default_factory=list,
        description="Suspicious URL components or tokens flagged during inspection.",
    )
    explanations: List[str] = Field(
        default_factory=list,
        description="Detailed explanations for each URL risk indicator.",
    )
    recommendations: List[str] = Field(
        default_factory=list,
        description="Actionable precautions before interacting with the URL.",
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Confidence score of the classification between 0.0 and 1.0.",
    )


class HealthResponse(BaseModel):
    """Service health status response."""

    status: str = Field(..., description="Service health state.")
    app_name: str = Field(..., description="Application name.")
    version: str = Field(..., description="Application version.")
    timestamp: str = Field(..., description="UTC ISO-8601 timestamp.")


class StatsResponse(BaseModel):
    """Accumulated in-memory analysis metrics response."""

    total_analyses: int = Field(..., ge=0)
    message_analyses: int = Field(..., ge=0)
    url_analyses: int = Field(..., ge=0)
    threats_detected: int = Field(..., ge=0)
    high_risk_detected: int = Field(..., ge=0)
    safe_count: int = Field(..., ge=0)
    average_score: float = Field(..., ge=0.0, le=100.0)
    category_breakdown: Dict[str, int] = Field(default_factory=dict)
    risk_level_breakdown: Dict[str, int] = Field(default_factory=dict)
    uptime_seconds: float = Field(..., ge=0.0)
