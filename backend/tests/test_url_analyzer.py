"""Pytest suite for static URLAnalyzer phishing and spoofing checks."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.url_analyzer import URLAnalyzer

analyzer = URLAnalyzer()


def test_safe_https_urls():
    for url in [
        "https://www.google.com",
        "https://www.amazon.com/dp/B09V3KXJPB",
        "https://docs.python.org/3/library/urllib.parse.html",
        "https://github.com/login",
    ]:
        result = analyzer.analyze(url)
        assert result["score"] <= 20
        assert result["risk_level"] == "LOW RISK"
        assert result["category"] == "Safe"


def test_url_shortener_detection():
    res_https = analyzer.analyze("https://bit.ly/3xAbCd")
    assert res_https["score"] >= 21
    signal_names = {sig["name"] for sig in res_https["signals"]}
    assert "URL_SHORTENER" in signal_names

    res_http = analyzer.analyze("http://tinyurl.com/offer123")
    assert res_http["score"] >= 30
    assert {"URL_SHORTENER", "INSECURE_HTTP"}.issubset({s["name"] for s in res_http["signals"]})


def test_ip_based_urls():
    res = analyzer.analyze("http://192.168.1.10/login/verify-account")
    assert res["score"] >= 60
    assert res["risk_level"] in ["HIGH RISK", "CRITICAL THREAT"]
    signal_names = {sig["name"] for sig in res["signals"]}
    assert "IP_ADDRESS_URL" in signal_names

    res_ten = analyzer.analyze("http://10.0.0.5/banking/login")
    assert res_ten["score"] >= 50
    assert "IP_ADDRESS_URL" in {sig["name"] for sig in res_ten["signals"]}


def test_suspicious_tld_and_keywords():
    res = analyzer.analyze("http://verify-account-login.tk/secure/confirm")
    assert res["score"] >= 60
    assert res["risk_level"] in ["HIGH RISK", "CRITICAL THREAT"]
    signal_names = {sig["name"] for sig in res["signals"]}
    assert "SUSPICIOUS_TLD" in signal_names
    assert "SUSPICIOUS_KEYWORDS" in signal_names


def test_embedded_credentials():
    res = analyzer.analyze("https://google.com@evil-phish.ml/signin")
    assert res["score"] >= 70
    assert res["risk_level"] in ["HIGH RISK", "CRITICAL THREAT"]
    signal_names = {sig["name"] for sig in res["signals"]}
    assert "EMBEDDED_CREDENTIALS" in signal_names
    assert "DOMAIN_MISMATCH" in signal_names


def test_homoglyph_typosquatting():
    res_paypal = analyzer.analyze("http://paypa1-secure-login.tk/verify/account/confirm")
    assert res_paypal["score"] >= 80
    assert res_paypal["risk_level"] == "CRITICAL THREAT"
    assert "HOMOGLYPH_SPOOFING" in {sig["name"] for sig in res_paypal["signals"]}

    res_google = analyzer.analyze("https://g00gle-verify.xyz/login")
    assert res_google["score"] >= 60
    assert "HOMOGLYPH_SPOOFING" in {sig["name"] for sig in res_google["signals"]}


def test_domain_mismatch():
    res = analyzer.analyze("http://amazon.suspicious-domain.xyz/login?verify=account")
    assert res["score"] >= 60
    assert res["risk_level"] in ["HIGH RISK", "CRITICAL THREAT"]
    assert "DOMAIN_MISMATCH" in {sig["name"] for sig in res["signals"]}


def test_excessive_subdomains_and_long_url():
    long_path = "a" * 180
    url = f"http://login.secure.verify.account.example.xyz/{long_path}"
    res = analyzer.analyze(url)
    signal_names = {sig["name"] for sig in res["signals"]}
    assert "EXCESSIVE_SUBDOMAINS" in signal_names
    assert "VERY_LONG_URL" in signal_names
    assert res["score"] >= 60


def test_http_vs_https_scoring():
    http_res = analyzer.analyze("http://example.com")
    https_res = analyzer.analyze("https://example.com")
    assert http_res["score"] > https_res["score"]
    assert https_res["score"] == 0


def test_empty_and_malformed_url():
    empty_res = analyzer.analyze("")
    assert empty_res["score"] == 0
    assert empty_res["risk_level"] == "LOW RISK"
    assert empty_res["signals"] == []

    malformed_res = analyzer.analyze("http://[::1")
    assert 0 <= malformed_res["score"] <= 100
    assert "MALFORMED_URL" in {sig["name"] for sig in malformed_res["signals"]}


def test_response_structure():
    res = analyzer.analyze("http://paypa1-secure-login.tk/verify")
    expected_keys = {
        "url",
        "domain",
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
    assert expected_keys.issubset(res.keys())
    assert 0 <= res["score"] <= 100
    assert 0.0 <= res["confidence"] <= 1.0
    assert len(res["explanations"]) == len(res["signals"])
