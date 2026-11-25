"""Static heuristic URL security analyzer (performs zero network requests)."""

import ipaddress
import re
from typing import Dict, List, Set, Tuple
from urllib.parse import urlsplit

URL_SHORTENERS: Set[str] = {
    "bit.ly",
    "tinyurl.com",
    "goo.gl",
    "t.co",
    "ow.ly",
    "short.io",
    "is.gd",
    "buff.ly",
    "cutt.ly",
    "rb.gy",
    "rebrand.ly",
    "tiny.cc",
    "bl.ink",
    "lnkd.in",
    "trib.al",
    "clck.ru",
    "v.gd",
    "shorturl.at",
    "s.id",
    "x.co",
}

SUSPICIOUS_TLDS: Set[str] = {
    "xyz",
    "tk",
    "ml",
    "ga",
    "cf",
    "gq",
    "top",
    "click",
    "loan",
    "work",
    "bid",
    "icu",
    "vip",
    "buzz",
    "club",
    "win",
    "support",
    "cam",
    "rest",
}

SENSITIVE_KEYWORDS: List[str] = [
    "login",
    "signin",
    "verify",
    "account",
    "secure",
    "update",
    "confirm",
    "banking",
    "password",
    "otp",
    "kyc",
    "wallet",
    "refund",
    "suspended",
    "blocked",
    "webscr",
    "paypal",
    "amazon",
]

OFFICIAL_BRAND_DOMAINS: Dict[str, Set[str]] = {
    "paypal": {"paypal.com", "paypal.me"},
    "google": {
        "google.com",
        "google.co.in",
        "google.co.uk",
        "googleapis.com",
        "googleusercontent.com",
        "googledrive.com",
    },
    "amazon": {
        "amazon.com",
        "amazon.in",
        "amazon.co.uk",
        "amazon.de",
        "amazon.ca",
        "amazon.co.jp",
        "amazonaws.com",
        "amzn.to",
    },
    "microsoft": {
        "microsoft.com",
        "live.com",
        "outlook.com",
        "office.com",
        "microsoftonline.com",
        "azure.com",
    },
    "apple": {"apple.com", "icloud.com"},
    "facebook": {"facebook.com", "fb.com"},
    "netflix": {"netflix.com"},
    "instagram": {"instagram.com"},
    "linkedin": {"linkedin.com"},
    "whatsapp": {"whatsapp.com"},
    "sbi": {"sbi.co.in", "onlinesbi.sbi", "onlinesbi.com"},
    "hdfc": {"hdfcbank.com", "hdfc.com"},
    "icici": {"icicibank.com"},
    "paytm": {"paytm.com"},
    "phonepe": {"phonepe.com"},
    "chase": {"chase.com"},
    "citibank": {"citi.com", "citibank.com"},
    "dropbox": {"dropbox.com"},
    "github": {"github.com"},
}

TWO_PART_SUFFIXES: Set[str] = {
    "co.uk",
    "org.uk",
    "ac.uk",
    "gov.uk",
    "co.in",
    "org.in",
    "gov.in",
    "ac.in",
    "net.in",
    "com.au",
    "net.au",
    "org.au",
    "co.jp",
    "ne.jp",
    "com.br",
    "com.sg",
    "com.mx",
}

HOMOGLYPH_SUBS_L = str.maketrans({"0": "o", "1": "l", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b"})
HOMOGLYPH_SUBS_I = str.maketrans({"0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b"})


def _determine_risk_level(score: int) -> str:
    """Map normalized 0-100 score to ScamShield risk tier."""
    if score <= 20:
        return "LOW RISK"
    if score <= 40:
        return "CAUTION"
    if score <= 60:
        return "MODERATE RISK"
    if score <= 80:
        return "HIGH RISK"
    return "CRITICAL THREAT"


def _extract_registrable_domain(hostname: str) -> str:
    """Extract approximate eTLD+1 registrable domain from a hostname."""
    parts = [p for p in hostname.lower().split(".") if p]
    if len(parts) <= 2:
        return ".".join(parts)
    last_two = ".".join(parts[-2:])
    if last_two in TWO_PART_SUFFIXES and len(parts) >= 3:
        return ".".join(parts[-3:])
    return last_two


def _is_ip_address(hostname: str) -> Tuple[bool, bool]:
    """Return (is_ip, is_private_or_local) for a parsed hostname."""
    cleaned = hostname.strip("[]")
    if not cleaned:
        return False, False
    try:
        ip_obj = ipaddress.ip_address(cleaned)
        return True, (ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_link_local)
    except ValueError:
        pass

    # Fallback check for obfuscated decimal IPv4 (e.g. 2130706433) or raw dotted pattern
    if re.fullmatch(r"\d{1,3}(?:\.\d{1,3}){3}", cleaned):
        is_priv = cleaned.startswith(("192.168.", "10.", "127."))
        return True, is_priv
    return False, False


def _normalize_lookalike_variants(label: str) -> List[str]:
    """Generate common homoglyph-normalized forms of a domain label."""
    lowered = label.lower()
    variants = set()
    for table in (HOMOGLYPH_SUBS_L, HOMOGLYPH_SUBS_I):
        converted = lowered.translate(table)
        variants.add(converted)
        variants.add(converted.replace("rn", "m").replace("vv", "w"))
    variants.discard(lowered)
    return list(variants)


class URLAnalyzer:
    """Safe static URL analyzer inspecting lexical, structural, and spoofing cues."""

    def analyze(self, url: str) -> dict:
        """Analyze a URL statically without performing any network or DNS requests."""
        raw_url = (url or "").strip()
        if not raw_url:
            return {
                "url": "",
                "domain": "",
                "score": 0,
                "risk_level": "LOW RISK",
                "category": "Safe",
                "summary": "No URL provided to analyze.",
                "signals": [],
                "highlighted_phrases": [],
                "explanations": ["No URL string was supplied for inspection."],
                "recommendations": ["Provide a complete URL to analyze for phishing or spoofing risks."],
                "confidence": 0.0,
            }

        has_explicit_scheme = bool(re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", raw_url))
        parse_target = raw_url if has_explicit_scheme else f"http://{raw_url}"
        try:
            parsed = urlsplit(parse_target)
            raw_hostname = parsed.hostname
            raw_username = parsed.username
        except ValueError:
            parsed = urlsplit("http://invalid-url")
            raw_hostname = netloc = ""
            raw_username = None
        else:
            netloc = parsed.netloc

        scheme = parsed.scheme.lower() if has_explicit_scheme else ""
        hostname = (raw_hostname or "").lower().rstrip(".")
        registrable_domain = _extract_registrable_domain(hostname) if hostname else ""
        is_official_brand_site = any(
            registrable_domain in domains for domains in OFFICIAL_BRAND_DOMAINS.values()
        )

        signals: List[Dict[str, str]] = []
        total_weight = 0

        def add_signal(name: str, weight: int, severity: str, explanation: str, matched: str) -> None:
            nonlocal total_weight
            total_weight += weight
            signals.append(
                {
                    "name": name,
                    "severity": severity,
                    "explanation": explanation,
                    "matched_phrase": matched,
                }
            )

        if not hostname and raw_url:
            add_signal(
                "MALFORMED_URL",
                25,
                "medium",
                "URL syntax is malformed or cannot be parsed cleanly, which can indicate obfuscation.",
                raw_url[:60],
            )

        # 1. Embedded credentials (@ in authority)
        if "@" in netloc or raw_username is not None:
            userinfo = netloc.split("@", 1)[0]
            add_signal(
                "EMBEDDED_CREDENTIALS",
                35,
                "critical",
                "URL embeds credentials or '@' authority obfuscation, often used to disguise the real destination host.",
                f"{userinfo}@",
            )

        # 2. IP-based URL check
        is_ip, is_private_ip = _is_ip_address(hostname)
        if is_ip:
            ip_desc = "private/internal IP address" if is_private_ip else "raw IP address"
            add_signal(
                "IP_ADDRESS_URL",
                35,
                "critical",
                f"Uses a {ip_desc} instead of a registered domain name, commonly seen in phishing kits and malware staging.",
                hostname,
            )

        # 3. URL shortener check
        if hostname and any(
            hostname == shortener or hostname.endswith("." + shortener)
            for shortener in URL_SHORTENERS
        ):
            add_signal(
                "URL_SHORTENER",
                25,
                "medium",
                "Uses a URL shortening service that masks the final destination until clicked.",
                hostname,
            )

        # 4. IDN Punycode / non-ASCII homograph check
        if "xn--" in hostname or any(ord(ch) > 127 for ch in raw_url):
            add_signal(
                "IDN_HOMOGRAPH",
                30,
                "critical",
                "Contains Punycode ('xn--') or non-ASCII characters that may visually impersonate a trusted domain.",
                hostname or raw_url,
            )

        # 5. Character-substitution homoglyph check (e.g., paypa1, g00gle)
        homoglyph_hits: List[str] = []
        if hostname and not is_ip and not is_official_brand_site:
            labels = [lbl for lbl in hostname.split(".") if lbl]
            for label in labels[:-1] if len(labels) > 1 else labels:
                tokens = re.split(r"[-_]", label)
                for token in tokens:
                    if not token:
                        continue
                    for variant in _normalize_lookalike_variants(token):
                        for brand in OFFICIAL_BRAND_DOMAINS:
                            if brand not in token and (
                                variant == brand or (len(brand) >= 5 and brand in variant)
                            ):
                                homoglyph_hits.append(f"{token} (mimics {brand})")
                                break
        if homoglyph_hits:
            add_signal(
                "HOMOGLYPH_SPOOFING",
                32,
                "critical",
                "Domain uses look-alike character substitutions (typosquatting) to impersonate a well-known brand.",
                ", ".join(dict.fromkeys(homoglyph_hits)),
            )

        # 6. Brand / domain mismatch (e.g., amazon.suspicious-domain.com or google.com@evil.ml)
        brand_mismatch_hits: List[str] = []
        if hostname and not is_ip:
            authority_prefix = netloc.split("@", 1)[0].lower() if "@" in netloc else ""
            subdomain_part = ""
            if registrable_domain and hostname.endswith(registrable_domain):
                subdomain_part = hostname[: -len(registrable_domain)].rstrip(".")
            domain_body = registrable_domain.rsplit(".", 1)[0] if "." in registrable_domain else registrable_domain

            for brand, official_domains in OFFICIAL_BRAND_DOMAINS.items():
                if registrable_domain in official_domains:
                    continue
                # Check authority userinfo spoofing (e.g., google.com@evil.ml)
                if authority_prefix and brand in authority_prefix:
                    brand_mismatch_hits.append(brand)
                    continue
                # Check brand in subdomain or hyphenated compound domain
                sub_tokens = set(re.split(r"[.\-_]", subdomain_part)) if subdomain_part else set()
                dom_tokens = set(re.split(r"[.\-_]", domain_body)) if domain_body else set()
                if len(brand) <= 4:
                    matched_brand = brand in sub_tokens or brand in dom_tokens
                else:
                    matched_brand = (
                        brand in sub_tokens
                        or brand in dom_tokens
                        or (subdomain_part and brand in subdomain_part)
                        or (domain_body and brand in domain_body)
                    )
                if matched_brand:
                    brand_mismatch_hits.append(brand)

        if brand_mismatch_hits:
            add_signal(
                "DOMAIN_MISMATCH",
                28,
                "high",
                "References a major brand inside a subdomain or third-party domain that does not belong to the official organization.",
                ", ".join(dict.fromkeys(brand_mismatch_hits)),
            )

        # 7. Suspicious TLD check
        if hostname and not is_ip and "." in hostname:
            tld = hostname.rsplit(".", 1)[-1]
            if tld in SUSPICIOUS_TLDS:
                add_signal(
                    "SUSPICIOUS_TLD",
                    20,
                    "high",
                    f"Uses top-level domain '.{tld}', which is disproportionately abused by phishing campaigns.",
                    f".{tld}",
                )

        # 8. HTTP vs HTTPS check
        if scheme == "http":
            add_signal(
                "INSECURE_HTTP",
                10,
                "medium",
                "Uses unencrypted HTTP instead of HTTPS, leaving transmitted data exposed.",
                "http://",
            )
        elif not has_explicit_scheme:
            add_signal(
                "MISSING_SCHEME",
                6,
                "low",
                "URL omits an explicit HTTPS scheme; transport encryption cannot be verified.",
                raw_url.split("/", 1)[0],
            )

        # 9. Excessive subdomains check
        if hostname and not is_ip:
            sub_part = (
                hostname[: -len(registrable_domain)].rstrip(".")
                if registrable_domain and hostname.endswith(registrable_domain)
                else ""
            )
            sub_labels = [lbl for lbl in sub_part.split(".") if lbl and lbl != "www"] if sub_part else []
            dot_count = hostname.count(".")
            if len(sub_labels) >= 3 or dot_count >= 4:
                add_signal(
                    "EXCESSIVE_SUBDOMAINS",
                    15,
                    "medium",
                    "Contains an unusually deep chain of subdomains, often used to obscure the true root domain.",
                    sub_part or hostname,
                )

        # 10. Phishing / sensitive keywords in URL
        keyword_hits: List[str] = []
        searchable_parts = f"{hostname}{parsed.path}?{parsed.query}".lower()
        for kw in SENSITIVE_KEYWORDS:
            # Skip brand keyword if this is the official site itself or already caught as domain mismatch
            if kw in OFFICIAL_BRAND_DOMAINS and (
                is_official_brand_site or kw in brand_mismatch_hits
            ):
                continue
            if re.search(rf"(?<![a-z0-9]){re.escape(kw)}(?![a-z0-9])", searchable_parts) or (
                len(kw) >= 5 and kw in searchable_parts
            ):
                keyword_hits.append(kw)

        if keyword_hits:
            kw_count = len(keyword_hits)
            if kw_count >= 4:
                kw_weight, kw_sev = 22, "high"
            elif kw_count == 3:
                kw_weight, kw_sev = 18, "high"
            elif kw_count == 2:
                kw_weight, kw_sev = 12, "medium"
            else:
                kw_weight, kw_sev = 6, "low"
            add_signal(
                "SUSPICIOUS_KEYWORDS",
                kw_weight,
                kw_sev,
                "URL includes account, authentication, or action keywords commonly targeted in credential harvesting.",
                ", ".join(keyword_hits[:5]),
            )

        # 11. Excessive URL length
        url_len = len(raw_url)
        if url_len > 200:
            add_signal(
                "VERY_LONG_URL",
                18,
                "high",
                f"URL length ({url_len} characters) is excessively long, a common technique to hide malicious payloads or redirects.",
                f"{url_len} chars",
            )
        elif url_len > 100:
            add_signal(
                "LONG_URL",
                10,
                "medium",
                f"URL length ({url_len} characters) exceeds normal length and may conceal tracking or redirect parameters.",
                f"{url_len} chars",
            )

        # 12. Special characters / excessive hyphens / non-standard port / obfuscation
        if hostname and not is_ip:
            hyphen_count = hostname.count("-")
            if hyphen_count >= 2:
                add_signal(
                    "EXCESSIVE_HYPHENS",
                    10,
                    "medium",
                    "Domain contains multiple hyphens, typical of deceptive look-alike registrations.",
                    hostname,
                )
            elif hyphen_count == 1 and (keyword_hits or homoglyph_hits or brand_mismatch_hits):
                add_signal(
                    "HYPHENATED_SUSPICIOUS_DOMAIN",
                    5,
                    "low",
                    "Hyphenated domain combined with sensitive keywords warrants verification.",
                    hostname,
                )

        try:
            port = parsed.port
        except ValueError:
            port = None
        if port is not None and port not in (80, 443):
            add_signal(
                "NON_STANDARD_PORT",
                10,
                "medium",
                f"Connects over non-standard port :{port} instead of standard web ports (80/443).",
                f":{port}",
            )

        if "//" in parsed.path or raw_url.count("%") >= 5:
            add_signal(
                "URL_OBFUSCATION",
                8,
                "medium",
                "Contains unusual path slashes or heavy percent-encoding used to evade filters.",
                raw_url[:60],
            )

        score = min(100, total_weight)
        risk_level = _determine_risk_level(score)
        category = self._classify_category(score, signals)

        highlighted_phrases = list(
            dict.fromkeys(sig["matched_phrase"] for sig in signals if sig["matched_phrase"])
        )
        explanations = (
            [f"{sig['name']}: {sig['explanation']}" for sig in signals]
            if signals
            else ["Uses HTTPS and exhibits no suspicious structural, lexical, or spoofing indicators."]
        )
        recommendations = self._build_recommendations(score, risk_level, signals)
        confidence = self._compute_confidence(score, signals)
        summary = self._build_summary(score, risk_level, category, len(signals))

        return {
            "url": raw_url,
            "domain": hostname,
            "score": score,
            "risk_level": risk_level,
            "category": category,
            "summary": summary,
            "signals": signals,
            "highlighted_phrases": highlighted_phrases,
            "explanations": explanations,
            "recommendations": recommendations,
            "confidence": confidence,
        }

    def _classify_category(self, score: int, signals: List[Dict[str, str]]) -> str:
        """Assign an appropriate URL threat classification."""
        if score <= 20:
            return "Safe"

        names = {sig["name"] for sig in signals}
        if "HOMOGLYPH_SPOOFING" in names or "IDN_HOMOGRAPH" in names:
            return "Homoglyph / Brand Spoofing"
        if "EMBEDDED_CREDENTIALS" in names:
            return "Credential Obfuscation URL"
        if "IP_ADDRESS_URL" in names:
            return "Suspicious IP URL"
        if "DOMAIN_MISMATCH" in names:
            return "Phishing / Brand Impersonation"
        if "URL_SHORTENER" in names and len(names) <= 2:
            return "Shortened URL"
        return "Phishing URL"

    def _build_recommendations(
        self, score: int, risk_level: str, signals: List[Dict[str, str]]
    ) -> List[str]:
        """Generate actionable URL safety recommendations."""
        if score <= 20:
            return [
                "No major phishing or spoofing indicators detected via static URL analysis.",
                "Verify the domain spelling carefully before entering sensitive credentials.",
            ]

        names = {sig["name"] for sig in signals}
        recs: List[str] = []

        if "URL_SHORTENER" in names:
            recs.append("Expand shortened URLs with a link-preview tool before opening them.")
        if "HOMOGLYPH_SPOOFING" in names or "DOMAIN_MISMATCH" in names or "IDN_HOMOGRAPH" in names:
            recs.append(
                "Do not log in here—navigate to the service manually by typing the official website address."
            )
        if "IP_ADDRESS_URL" in names or "EMBEDDED_CREDENTIALS" in names:
            recs.append("Avoid opening links pointing to raw IP addresses or containing '@' obfuscation.")
        if "INSECURE_HTTP" in names:
            recs.append("Never submit passwords, payment details, or personal info over unencrypted HTTP.")
        if "SUSPICIOUS_TLD" in names or "SUSPICIOUS_KEYWORDS" in names:
            recs.append("Verify the link source through official channels before interacting with the page.")
        if risk_level in ("HIGH RISK", "CRITICAL THREAT"):
            recs.append("Do not click this link; delete the message and report it as phishing.")

        return recs or ["Exercise caution and verify the sender before opening this URL."]

    def _compute_confidence(self, score: int, signals: List[Dict[str, str]]) -> float:
        """Calculate confidence score between 0.0 and 1.0."""
        if not signals:
            return 0.9
        if score <= 20:
            return 0.78
        conf = 0.60 + 0.08 * min(len(signals), 4)
        if score >= 70:
            conf = max(conf, 0.90)
        return round(min(0.99, conf), 2)

    def _build_summary(
        self, score: int, risk_level: str, category: str, signal_count: int
    ) -> str:
        """Construct concise human-readable summary of URL evaluation."""
        if risk_level == "LOW RISK" and signal_count == 0:
            return "No suspicious structural or phishing URL indicators detected."
        if risk_level == "LOW RISK":
            return (
                f"Low risk ({score}/100): {signal_count} minor indicator(s) observed; "
                "appears safe when from a trusted source."
            )
        return (
            f"{risk_level} ({score}/100) — Flagged as {category} based on "
            f"{signal_count} static URL indicator(s)."
        )
