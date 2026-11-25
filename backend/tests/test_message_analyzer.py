"""Pytest suite for MessageAnalyzer and FastAPI message/stats/health endpoints."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient

from app.api.routes import stats_tracker
from app.main import app
from app.services.message_analyzer import MessageAnalyzer

analyzer = MessageAnalyzer()
client = TestClient(app)


def test_fake_job_scam():
    text = "Congratulations! Work from home job. Earn 40000 per week. Pay registration fee immediately."
    result = analyzer.analyze(text)
    assert result["score"] >= 60
    assert result["risk_level"] in ["HIGH RISK", "CRITICAL THREAT"]
    assert result["category"] == "Fake Job Scam"
    assert len(result["signals"]) >= 3
    assert len(result["highlighted_phrases"]) >= 3

    text_no_urgency = "Pay registration fee to get your work from home job, earn 40000 per week"
    result_no_urgency = analyzer.analyze(text_no_urgency)
    assert result_no_urgency["score"] >= 60
    assert result_no_urgency["risk_level"] in ["HIGH RISK", "CRITICAL THREAT"]


def test_otp_scam():
    text = "Your account will be blocked, share your OTP immediately"
    result = analyzer.analyze(text)
    assert result["score"] >= 60
    assert result["risk_level"] in ["HIGH RISK", "CRITICAL THREAT"]
    assert result["category"] == "OTP Fraud"
    signal_names = {sig["name"] for sig in result["signals"]}
    assert "OTP_REQUEST" in signal_names
    assert "ACCOUNT_THREAT" in signal_names


def test_lottery_scam():
    text = "You won a lottery, claim your prize by paying processing fee"
    result = analyzer.analyze(text)
    assert result["score"] >= 60
    assert result["risk_level"] in ["HIGH RISK", "CRITICAL THREAT"]
    assert result["category"] == "Lottery Scam"
    signal_names = {sig["name"] for sig in result["signals"]}
    assert "UNREALISTIC_OFFERS" in signal_names
    assert "REGISTRATION_FEE" in signal_names


def test_safe_message():
    text = "Your laboratory session is scheduled for tomorrow at 10 AM. Please bring your record notebook."
    result = analyzer.analyze(text)
    assert result["score"] <= 20
    assert result["risk_level"] == "LOW RISK"
    assert result["category"] == "Safe"

    for benign in [
        "Your lab session is tomorrow at 10 AM",
        "Happy birthday!",
    ]:
        res = analyzer.analyze(benign)
        assert res["score"] <= 20
        assert res["risk_level"] == "LOW RISK"


def test_safe_delivery_message():
    text = "Your order has been shipped and will be delivered by tomorrow."
    result = analyzer.analyze(text)
    assert result["score"] <= 20
    assert result["risk_level"] == "LOW RISK"
    assert result["category"] == "Safe"

    res_today = analyzer.analyze("Your order will be delivered today")
    assert res_today["score"] <= 20
    assert res_today["risk_level"] == "LOW RISK"


def test_investment_scam():
    text = "Invest now for 100% returns and guaranteed profit! Risk free investment in crypto earnings."
    result = analyzer.analyze(text)
    assert result["score"] >= 60
    assert result["risk_level"] in ["HIGH RISK", "CRITICAL THREAT"]
    assert result["category"] == "Investment Scam"

    single_cat_pitch = "Invest now! Guaranteed profit! Risk free investment! Crypto earnings!"
    res_single = analyzer.analyze(single_cat_pitch)
    assert res_single["score"] >= 60
    assert res_single["category"] == "Investment Scam"


def test_empty_input():
    for empty_text in ["", "   "]:
        result = analyzer.analyze(empty_text)
        assert result["score"] == 0
        assert result["risk_level"] == "LOW RISK"
        assert result["category"] == "Safe"
        assert result["signals"] == []
        assert 0.0 <= result["confidence"] <= 1.0


def test_single_mild_indicator_range():
    urgency_res = analyzer.analyze("Please submit the document immediately.")
    assert 15 <= urgency_res["score"] <= 25
    assert urgency_res["risk_level"] == "LOW RISK"

    payment_res = analyzer.analyze("Please pay the electricity bill.")
    assert 15 <= payment_res["score"] <= 25


def test_impersonation_needs_context():
    benign = analyzer.analyze("I visited the SBI branch today.")
    assert benign["score"] <= 20
    assert benign["category"] == "Safe"

    scam = analyzer.analyze("SBI alert: Your account will be blocked. Share your OTP immediately.")
    assert scam["score"] >= 60
    assert any(sig["name"] == "IMPERSONATION" for sig in scam["signals"])


def test_legitimate_otp_security_disclaimer():
    bank_sms = "Your OTP for transaction is 482910. Do not share your OTP with anyone."
    result = analyzer.analyze(bank_sms)
    assert result["score"] <= 20
    assert result["risk_level"] == "LOW RISK"


def test_response_structure():
    result = analyzer.analyze("You won a lottery, claim your prize by paying processing fee")
    expected_keys = {
        "score",
        "risk_level",
        "category",
        "summary",
        "signals",
        "highlighted_phrases",
        "explanations",
        "recommendations",
        "confidence",
    }
    assert expected_keys.issubset(result.keys())
    assert 0 <= result["score"] <= 100
    assert 0.0 <= result["confidence"] <= 1.0
    for sig in result["signals"]:
        assert {"name", "severity", "explanation", "matched_phrase"}.issubset(sig.keys())


def test_api_routes_integration():
    stats_tracker.reset()

    health = client.get("/api/health")
    assert health.status_code == 200
    assert health.json()["status"] == "healthy"

    scam_resp = client.post(
        "/api/analyze/message",
        json={"text": "Your account will be blocked, share your OTP immediately"},
    )
    assert scam_resp.status_code == 200
    scam_data = scam_resp.json()
    assert scam_data["score"] >= 60
    assert scam_data["category"] == "OTP Fraud"

    safe_resp = client.post(
        "/api/analyze/message",
        json={"text": "Happy birthday!"},
    )
    assert safe_resp.status_code == 200
    assert safe_resp.json()["score"] <= 20

    url_resp = client.post(
        "/api/analyze/url",
        json={"url": "http://paypa1-secure-login.tk/verify/account/confirm"},
    )
    assert url_resp.status_code == 200
    assert url_resp.json()["score"] >= 60

    stats_resp = client.get("/api/stats")
    assert stats_resp.status_code == 200
    stats = stats_resp.json()
    assert stats["total_analyses"] == 3
    assert stats["message_analyses"] == 2
    assert stats["url_analyses"] == 1
    assert stats["high_risk_detected"] == 2
    assert stats["safe_count"] == 1

    empty_resp = client.post("/api/analyze/message", json={"text": "   "})
    assert empty_resp.status_code == 422

    too_long_resp = client.post("/api/analyze/message", json={"text": "a" * 5001})
    assert too_long_resp.status_code == 422
