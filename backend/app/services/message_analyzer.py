"""Weighted indicator scam detection engine for messages, SMS, and emails."""

import re
from typing import Dict, List, Pattern, Tuple

CATEGORY_WEIGHTS: Dict[str, int] = {
    "URGENCY_PRESSURE": 8,
    "MONEY_REQUEST": 10,
    "REGISTRATION_FEE": 15,
    "OTP_REQUEST": 20,
    "CREDENTIAL_REQUEST": 18,
    "FAKE_JOB": 12,
    "UNREALISTIC_OFFERS": 12,
    "ACCOUNT_THREAT": 10,
    "SUSPICIOUS_URL": 8,
    "PERSONAL_INFO": 12,
    "INVESTMENT_SCAM": 14,
    "IMPERSONATION": 6,
}

# Order ensures specialized compound patterns claim text spans before generic substrings
# (e.g., "one time password" before "password", "registration fee" before "fee").
DETECTION_ORDER: List[str] = [
    "OTP_REQUEST",
    "REGISTRATION_FEE",
    "CREDENTIAL_REQUEST",
    "INVESTMENT_SCAM",
    "FAKE_JOB",
    "UNREALISTIC_OFFERS",
    "PERSONAL_INFO",
    "ACCOUNT_THREAT",
    "MONEY_REQUEST",
    "SUSPICIOUS_URL",
    "URGENCY_PRESSURE",
    "IMPERSONATION",
]

EXCLUSIVE_SPAN_PARENTS: Dict[str, str] = {
    "CREDENTIAL_REQUEST": "OTP_REQUEST",
    "MONEY_REQUEST": "REGISTRATION_FEE",
}

CATEGORY_METADATA: Dict[str, Dict[str, str]] = {
    "URGENCY_PRESSURE": {
        "severity": "medium",
        "explanation": (
            "Creates artificial time pressure to rush you into acting before verifying the request."
        ),
    },
    "MONEY_REQUEST": {
        "severity": "medium",
        "explanation": (
            "Requests direct payment, fund transfer, or upfront money, a primary goal of financial scams."
        ),
    },
    "REGISTRATION_FEE": {
        "severity": "high",
        "explanation": (
            "Demands an upfront registration, processing, or security fee—legitimate employers and prize "
            "providers do not charge fees to release jobs or winnings."
        ),
    },
    "OTP_REQUEST": {
        "severity": "critical",
        "explanation": (
            "Solicits a One-Time Password (OTP) or verification code. Sharing an OTP allows attackers "
            "to authorize transactions or hijack your account."
        ),
    },
    "CREDENTIAL_REQUEST": {
        "severity": "critical",
        "explanation": (
            "Asks for sensitive banking or authentication credentials (PIN, CVV, password, or account details)."
        ),
    },
    "FAKE_JOB": {
        "severity": "high",
        "explanation": (
            "Uses classic employment-scam hooks such as unrealistic weekly pay, no-experience guarantees, "
            "or instant remote hiring."
        ),
    },
    "UNREALISTIC_OFFERS": {
        "severity": "high",
        "explanation": (
            "Promises lottery prizes, guaranteed returns, or windfalls that are almost always fraudulent lures."
        ),
    },
    "ACCOUNT_THREAT": {
        "severity": "medium",
        "explanation": (
            "Threatens imminent account suspension, closure, or KYC block to frighten victims into compliance."
        ),
    },
    "SUSPICIOUS_URL": {
        "severity": "medium",
        "explanation": (
            "Contains an unencrypted HTTP link, IP-based link, or shortened URL that hides the true destination."
        ),
    },
    "PERSONAL_INFO": {
        "severity": "high",
        "explanation": (
            "Requests government IDs or sensitive personal information (Aadhaar, PAN, passport, SSN, DOB) "
            "which can enable identity theft."
        ),
    },
    "INVESTMENT_SCAM": {
        "severity": "high",
        "explanation": (
            "Markets guaranteed profits, risk-free returns, or quick crypto earnings—hallmarks of financial fraud."
        ),
    },
    "IMPERSONATION": {
        "severity": "medium",
        "explanation": (
            "References a trusted bank, government body, or major brand alongside suspicious demands."
        ),
    },
}

RAW_PATTERNS: Dict[str, List[str]] = {
    "URGENCY_PRESSURE": [
        r"\bimmediately\b",
        r"\burgent(?:ly)?\b",
        r"\bact\s+now\b",
        r"\blimited\s+time\b",
        r"\bexpire(?:s|d)?\s+(?:today|soon|tonight|in\s+\d+\s+(?:hour|hr|minute|min)s?)\b",
        r"\blast\s+chance\b",
        r"\bdeadline\b",
        r"\bwithin\s+\d+\s+(?:hour|hr|minute|min)s?\b",
        r"\bhurry(?:\s+up)?\b",
        r"\basap\b",
        r"\bright\s+now\b",
        r"\bfinal\s+(?:warning|notice|reminder)\b",
    ],
    "MONEY_REQUEST": [
        r"\btransfer\s+(?:money|funds|amount|cash|rs\.?|inr|\$|₹)\b",
        r"\bsend\s+(?:money|funds|cash|rs\.?|inr|\$|₹)\b",
        r"\bwire\s+(?:money|transfer|funds)\b",
        r"\bgift\s+card(?:s)?\b",
        r"\bpayment(?:s)?\b",
        r"\bdeposit\b",
        r"\b(?:pay|paying|paid)\b(?!\s+attention\b)",
        r"\bcharge(?:s|d)?\b",
        r"\bfee(?:s)?\b",
        r"\bupfront\b",
    ],
    "REGISTRATION_FEE": [
        r"\bregistration\s+fee(?:s)?\b",
        r"\bjoining\s+fee(?:s)?\b",
        r"\bprocessing\s+fee(?:s)?\b",
        r"\brefundable\s+(?:registration\s+|security\s+)?deposit\b",
        r"\bregistration\s+deposit\b",
        r"\badvance\s+payment\b",
        r"\bsecurity\s+deposit\b",
        r"\bactivation\s+fee(?:s)?\b",
        r"\bverification\s+fee(?:s)?\b",
        r"\bclearance\s+fee(?:s)?\b",
        r"\bcustoms?\s+fee(?:s)?\b",
        r"\bredelivery\s+fee(?:s)?\b",
    ],
    "OTP_REQUEST": [
        r"\b(?:share|send|enter|provide|tell|give|forward|verify)\s+(?:your\s+|the\s+)?otp\b",
        r"\bone[\s-]+time\s+password\b",
        r"\bverification\s+code\b",
        r"\b6[\s-]?digit\s+code\b",
        r"\botp\b",
    ],
    "CREDENTIAL_REQUEST": [
        r"\blogin\s+credentials\b",
        r"\bbank\s+(?:account\s+)?details\b",
        r"\baccount\s+number\b",
        r"\bcard\s+(?:number|details)\b",
        r"\bnet[\s-]?banking\s+(?:id|password|details|pin)\b",
        r"\b(?:atm|upi|bank|card)\s+pin\b",
        r"\bpassword(?:s)?\b",
        r"\bcvv\b",
        r"\bpin\b(?!\s+code\b)",
        r"\bsecret\s+code\b",
    ],
    "FAKE_JOB": [
        r"\bwork[\s-]+from[\s-]+home\b",
        r"\bearn\s+(?:from\s+home|online)\b",
        r"\bearn\s+(?:rs\.?|inr|\$|usd|₹)?\s*\d[\d,]*(?:k)?\s*(?:per|a|/)\s*(?:week|day|month|hour)\b",
        # Weekly/daily "salary" claims are an employment-scam hallmark; monthly pay is
        # deliberately excluded so legitimate payroll messages stay low risk.
        r"\bsalary\s*(?:of\s*)?(?:₹|rs\.?|inr|\$)?\s*₹?\s*\d[\d,]*(?:k)?\s*(?:per|a|/)\s*(?:week|day)\b",
        r"\bper\s+(?:day|week)\s+earning(?:s)?\b",
        r"\bno\s+experience\s+(?:required|needed)\b",
        r"\bguaranteed\s+salary\b",
        r"\bimmediate\s+joining\b",
        r"\bpart[\s-]+time\s+job\b",
        r"\bdata\s+entry\s+job\b",
        r"\beasy\s+(?:money|income|earning(?:s)?)\b",
        r"\bhiring\s+immediately\b",
    ],
    "UNREALISTIC_OFFERS": [
        r"\byou(?:'ve|\s+have)?\s+won\b",
        r"\bwon\s+(?:a|an|the)?\s*(?:lottery|prize|jackpot|reward|cash|rs\.?|inr|\$|₹)\b",
        r"\b(?:been\s+|are\s+|were\s+)?selected\s+(?:as|for)\s+(?:a\s+|the\s+)?(?:winner|prize|lottery|lucky|cash|award|offer|gift)\b",
        r"\blucky\s+(?:draw|winner|customer|user)\b",
        r"\bclaim\s+your\b",
        r"\bguaranteed\s+returns\b",
        r"\b100%\s+returns?\b",
        r"\bdouble\s+your\s+money\b",
        r"\bfree\s+(?:iphone|gift|voucher|cash|laptop)\b",
        r"\blottery\b",
        r"\bwinner\b",
        r"\bprize\b",
    ],
    "ACCOUNT_THREAT": [
        r"\baccount\s+(?:is\s+|has\s+been\s+|will\s+be\s+)?blocked\b",
        r"\baccount\s+(?:is\s+|has\s+been\s+|will\s+be\s+)?suspended\b",
        r"\baccount\s+will\s+be\s+(?:closed|terminated|deactivated|frozen)\b",
        r"\baccount\s+deactivated\b",
        r"\bverify\s+your\s+account\b",
        r"\bupdate\s+your\s+kyc\b",
        r"\bkyc\s+(?:expired|pending|suspended|blocked|update)\b",
        r"\bunauthorized\s+(?:login|access|activity|transaction)\b",
        r"\bsuspicious\s+activity\b",
        r"\blegal\s+action\b",
    ],
    "SUSPICIOUS_URL": [
        r"(?:https?://)?(?:www\.)?(?:bit\.ly|tinyurl\.com|goo\.gl|t\.co|ow\.ly|short\.io|is\.gd|buff\.ly|cutt\.ly|rb\.gy|rebrand\.ly|tiny\.cc)/\S+",
        r"https?://\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?(?:/\S*)?",
        r"https?://[^\s<>\"{}|\\^`\[\]]+",
    ],
    "PERSONAL_INFO": [
        r"\baadhaar(?:\s+(?:number|card))?\b",
        r"\bpan\s+card\b",
        r"\bpassport(?:\s+number)?\b",
        r"\bdate\s+of\s+birth\b",
        r"\bsocial\s+security(?:\s+number)?\b",
        r"\bssn\b",
        r"\bdriving\s+licen[cs]e\b",
        r"\b(?:home|residential|billing|shipping|full)\s+address\b",
        r"\b(?:share|send|confirm|update|provide|enter)\s+(?:your\s+)?address\b",
    ],
    "INVESTMENT_SCAM": [
        r"\binvest\s+now\b",
        r"\bguaranteed\s+profit(?:s)?\b",
        r"\brisk[\s-]+free\s+investment\b",
        r"\bcrypto\s+earning(?:s)?\b",
        r"\bhigh\s+returns?\b",
        r"\bpassive\s+income\b",
        r"\btrading\s+(?:bot|signal|platform|profit)\b",
        r"\bforex\s+(?:profit|trading|returns)\b",
        r"\bguaranteed\s+income\b",
        r"\broi\s+(?:of\s+)?\d+%\b",
    ],
    "IMPERSONATION": [
        r"\bgovernment\s+of\s+india\b",
        r"\bincome\s+tax(?:\s+department)?\b",
        r"\bbank\s+of\s+india\b",
        r"\bamazon\s+customer\b",
        r"\bmicrosoft\s+(?:support|security)\b",
        r"\bcustoms\s+(?:department|officer)\b",
        r"\bcyber\s+(?:crime|cell|police)\b",
        r"\brbi\b",
        r"\bsbi\b",
        r"\bhdfc\b",
        r"\bicici\b",
        r"\bpaypal\b",
        r"\bfedex\b",
        r"\bdhl\b",
        r"\bindia\s+post\b",
    ],
}

COMPILED_PATTERNS: Dict[str, List[Pattern[str]]] = {
    cat: [re.compile(pattern, re.IGNORECASE) for pattern in patterns]
    for cat, patterns in RAW_PATTERNS.items()
}

SECURITY_DISCLAIMER_PATTERN = re.compile(
    r"\b(?:do\s+not|don't|never|should\s+not|must\s+not)\s+(?:ever\s+)?share\b",
    re.IGNORECASE,
)

# Domain-specific contextual patterns used to classify the scam subtype accurately
UPI_CONTEXT_PATTERN = re.compile(
    r"\b(?:upi|gpay|google\s+pay|phonepe|paytm|bhim|collect\s+request|scan\s+qr|qr\s+code|upi\s+pin)\b",
    re.IGNORECASE,
)
DELIVERY_CONTEXT_PATTERN = re.compile(
    r"\b(?:parcel|package|courier|customs|redelivery|delivery\s+failed|undelivered|fedex|dhl|india\s+post|bluedart|tracking)\b",
    re.IGNORECASE,
)
TECH_SUPPORT_CONTEXT_PATTERN = re.compile(
    r"\b(?:virus|malware|infected|anydesk|teamviewer|remote\s+access|screen\s+share|tech(?:nical)?\s+support|windows\s+defender|helpline|system\s+compromised)\b",
    re.IGNORECASE,
)
ROMANCE_CONTEXT_PATTERN = re.compile(
    r"\b(?:my\s+love|darling|soulmate|sweetheart|stuck\s+at\s+(?:the\s+)?airport|deployed|western\s+union|gift\s+card|send\s+money\s+to\s+meet)\b",
    re.IGNORECASE,
)
BANKING_CONTEXT_PATTERN = re.compile(
    r"\b(?:bank|kyc|sbi|hdfc|icici|rbi|bank\s+of\s+india|debit\s+card|credit\s+card|atm|ifsc|net[\s-]?banking|account)\b",
    re.IGNORECASE,
)


def _overlaps(span_a: Tuple[int, int], span_b: Tuple[int, int]) -> bool:
    """Return True if two [start, end) character spans overlap."""
    return span_a[0] < span_b[1] and span_b[0] < span_a[1]


def _is_negated_before(text: str, match_start: int) -> bool:
    """Detect legitimate bank warnings like 'Do not share your OTP' before a match."""
    window_start = max(0, match_start - 50)
    clause = re.split(r"[.!?;]", text[window_start:match_start])[-1]
    return bool(
        re.search(
            r"\b(?:do\s+not|don't|never|should\s+not|must\s+not)\s+(?:ever\s+)?(?:share|disclose|give|send|reveal)?\s*$",
            clause,
            re.IGNORECASE,
        )
        or re.search(
            r"\b(?:do\s+not|don't|never|should\s+not|must\s+not)\s+(?:ever\s+)?(?:share|disclose|give|send|reveal)\b",
            clause,
            re.IGNORECASE,
        )
    )


def _is_benign_charge(text: str, match_start: int) -> bool:
    """Ignore benign non-payment uses of the word 'charge'."""
    window_start = max(0, match_start - 20)
    prefix = text[window_start:match_start]
    return bool(
        re.search(
            r"\b(?:free\s+of|at\s+no|no\s+extra|in|battery|phone|mobile)\s+$",
            prefix,
            re.IGNORECASE,
        )
    )


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


class MessageAnalyzer:
    """Explainable weighted-indicator scam detection engine for text messages."""

    def analyze(self, text: str) -> dict:
        """Analyze message text and return risk score, classification, and signals."""
        if not text or not text.strip():
            return {
                "score": 0,
                "risk_level": "LOW RISK",
                "category": "Safe",
                "summary": "No message content provided to analyze.",
                "signals": [],
                "highlighted_phrases": [],
                "explanations": ["No text content was supplied for scam detection."],
                "recommendations": [
                    "Provide a message, SMS, or email snippet to analyze for scam indicators."
                ],
                "confidence": 0.0,
            }

        has_security_disclaimer = bool(SECURITY_DISCLAIMER_PATTERN.search(text))
        category_matches: Dict[str, List[Tuple[Tuple[int, int], str]]] = {}

        for cat in DETECTION_ORDER:
            cat_spans: List[Tuple[Tuple[int, int], str]] = []
            excluded_spans: List[Tuple[int, int]] = []
            parent_cat = EXCLUSIVE_SPAN_PARENTS.get(cat)
            if parent_cat and parent_cat in category_matches:
                excluded_spans = [span for span, _ in category_matches[parent_cat]]

            for pattern in COMPILED_PATTERNS[cat]:
                for match in pattern.finditer(text):
                    span = match.span()
                    if any(_overlaps(span, existing) for existing, _ in cat_spans):
                        continue
                    if any(_overlaps(span, excluded) for excluded in excluded_spans):
                        continue
                    if cat in ("OTP_REQUEST", "CREDENTIAL_REQUEST") and _is_negated_before(
                        text, span[0]
                    ):
                        continue
                    if cat == "MONEY_REQUEST" and "charge" in match.group(0).lower() and _is_benign_charge(
                        text, span[0]
                    ):
                        continue
                    cat_spans.append((span, match.group(0)))

            if cat_spans:
                category_matches[cat] = sorted(cat_spans, key=lambda item: item[0][0])

        # Filter out legitimate bank security alerts that say "Do not share your OTP/PIN"
        # and lack any actual threat, link, urgency, or fee indicators.
        non_credential_threat_cats = [
            c
            for c in category_matches
            if c not in ("OTP_REQUEST", "CREDENTIAL_REQUEST", "IMPERSONATION")
        ]
        if has_security_disclaimer and not non_credential_threat_cats:
            category_matches.pop("OTP_REQUEST", None)
            category_matches.pop("CREDENTIAL_REQUEST", None)

        # IMPERSONATION requires supporting threat/request context to avoid flagging
        # benign mentions of banks, delivery couriers, or brands.
        non_impersonation_cats = [c for c in category_matches if c != "IMPERSONATION"]
        if "IMPERSONATION" in category_matches and not non_impersonation_cats:
            del category_matches["IMPERSONATION"]

        # Calculate weighted score with diminishing returns per category
        category_scores: Dict[str, float] = {}
        for cat, matches in category_matches.items():
            weight = float(CATEGORY_WEIGHTS[cat])
            count = len(matches)
            if count == 1:
                cat_score = 0.85 * weight
            elif count == 2:
                cat_score = 0.95 * weight
            else:
                cat_score = weight
            category_scores[cat] = min(weight, cat_score)

        raw_weighted_sum = sum(category_scores.values())
        base_score = raw_weighted_sum * 2.2

        # Multi-category synergy when multiple distinct risk categories co-occur
        has_high_severity_cat = any(CATEGORY_WEIGHTS[c] >= 12 for c in non_impersonation_cats)
        synergy_bonus = 0.0
        if len(non_impersonation_cats) >= 4:
            synergy_bonus = 12.0
        elif len(non_impersonation_cats) == 3:
            synergy_bonus = 8.0
        elif len(non_impersonation_cats) == 2 and (has_high_severity_cat or raw_weighted_sum >= 18.0):
            synergy_bonus = 8.0

        # High-severity single-category signal density escalation (3+ distinct fraud phrases)
        density_bonus = 0.0
        for cat, matches in category_matches.items():
            if CATEGORY_WEIGHTS[cat] >= 12 and len(matches) >= 3:
                density_bonus = max(density_bonus, 30.0 if len(matches) >= 4 else 22.0)

        score = min(100, int(round(base_score + synergy_bonus + density_bonus)))
        risk_level = _determine_risk_level(score)
        category = self._classify_category(text, score, category_matches)

        signals = self._build_signals(category_matches)
        highlighted_phrases = self._extract_highlighted_phrases(category_matches)
        explanations = self._build_explanations(category_matches)
        recommendations = self._build_recommendations(category, risk_level, category_matches)
        confidence = self._compute_confidence(score, category_matches)
        summary = self._build_summary(score, risk_level, category, len(signals))

        return {
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

    def _classify_category(
        self,
        text: str,
        score: int,
        category_matches: Dict[str, List[Tuple[Tuple[int, int], str]]],
    ) -> str:
        """Classify message into a specific scam taxonomy label or Safe."""
        if score <= 20:
            return "Safe"

        cats = set(category_matches.keys())

        if "FAKE_JOB" in cats:
            return "Fake Job Scam"
        if "INVESTMENT_SCAM" in cats:
            return "Investment Scam"
        if "UNREALISTIC_OFFERS" in cats and not ("OTP_REQUEST" in cats):
            return "Lottery Scam"
        if UPI_CONTEXT_PATTERN.search(text) and cats & {
            "CREDENTIAL_REQUEST",
            "MONEY_REQUEST",
            "OTP_REQUEST",
            "URGENCY_PRESSURE",
            "UNREALISTIC_OFFERS",
        }:
            return "UPI Fraud"
        if "OTP_REQUEST" in cats:
            return "OTP Fraud"
        if DELIVERY_CONTEXT_PATTERN.search(text) and cats & {
            "MONEY_REQUEST",
            "REGISTRATION_FEE",
            "SUSPICIOUS_URL",
            "PERSONAL_INFO",
            "URGENCY_PRESSURE",
            "ACCOUNT_THREAT",
        }:
            return "Delivery Scam"
        if TECH_SUPPORT_CONTEXT_PATTERN.search(text) and cats & {
            "URGENCY_PRESSURE",
            "MONEY_REQUEST",
            "CREDENTIAL_REQUEST",
            "IMPERSONATION",
            "ACCOUNT_THREAT",
        }:
            return "Tech Support Scam"
        if ROMANCE_CONTEXT_PATTERN.search(text) and cats & {
            "MONEY_REQUEST",
            "REGISTRATION_FEE",
            "URGENCY_PRESSURE",
            "PERSONAL_INFO",
        }:
            return "Romance Scam"
        if "SUSPICIOUS_URL" in cats and (
            cats & {"CREDENTIAL_REQUEST", "ACCOUNT_THREAT", "PERSONAL_INFO", "IMPERSONATION"}
        ):
            return "Phishing"
        if BANKING_CONTEXT_PATTERN.search(text) and (
            cats & {"CREDENTIAL_REQUEST", "ACCOUNT_THREAT", "PERSONAL_INFO", "MONEY_REQUEST"}
        ):
            return "Banking Scam"
        if "CREDENTIAL_REQUEST" in cats or "ACCOUNT_THREAT" in cats or "SUSPICIOUS_URL" in cats:
            return "Phishing"
        if "IMPERSONATION" in cats:
            return "Impersonation"
        if "REGISTRATION_FEE" in cats or "MONEY_REQUEST" in cats:
            return "Phishing"
        if "PERSONAL_INFO" in cats:
            return "Phishing"
        return "Phishing"

    def _build_signals(
        self, category_matches: Dict[str, List[Tuple[Tuple[int, int], str]]]
    ) -> List[Dict[str, str]]:
        """Build ordered list of individual ThreatSignal dictionaries."""
        ordered_items: List[Tuple[int, Dict[str, str]]] = []
        for cat, matches in category_matches.items():
            meta = CATEGORY_METADATA[cat]
            for span, phrase in matches:
                ordered_items.append(
                    (
                        span[0],
                        {
                            "name": cat,
                            "severity": meta["severity"],
                            "explanation": meta["explanation"],
                            "matched_phrase": phrase,
                        },
                    )
                )
        ordered_items.sort(key=lambda item: item[0])
        return [item[1] for item in ordered_items]

    def _extract_highlighted_phrases(
        self, category_matches: Dict[str, List[Tuple[Tuple[int, int], str]]]
    ) -> List[str]:
        """Collect unique matched phrases in order of appearance in text."""
        ordered: List[Tuple[int, str]] = []
        for matches in category_matches.values():
            for span, phrase in matches:
                ordered.append((span[0], phrase))
        ordered.sort(key=lambda item: item[0])

        seen = set()
        result: List[str] = []
        for _, phrase in ordered:
            key = phrase.lower()
            if key not in seen:
                seen.add(key)
                result.append(phrase)
        return result

    def _build_explanations(
        self, category_matches: Dict[str, List[Tuple[Tuple[int, int], str]]]
    ) -> List[str]:
        """Generate human-readable explanations grouped by detected category."""
        if not category_matches:
            return ["No suspicious keywords, urgent manipulation, or fraud patterns were detected."]

        explanations: List[str] = []
        sorted_cats = sorted(
            category_matches.keys(),
            key=lambda c: CATEGORY_WEIGHTS[c],
            reverse=True,
        )
        for cat in sorted_cats:
            phrases = ", ".join(f"'{phrase}'" for _, phrase in category_matches[cat])
            explanations.append(f"{cat} ({phrases}): {CATEGORY_METADATA[cat]['explanation']}")
        return explanations

    def _build_recommendations(
        self,
        category: str,
        risk_level: str,
        category_matches: Dict[str, List[Tuple[Tuple[int, int], str]]],
    ) -> List[str]:
        """Provide practical, category-specific safety actions."""
        if risk_level == "LOW RISK" and not category_matches:
            return [
                "Message appears safe based on static linguistic analysis.",
                "Always remain cautious if an unknown sender later asks for money, links, or codes.",
            ]

        recommendations: List[str] = []
        cats = set(category_matches.keys())

        if "OTP_REQUEST" in cats or "CREDENTIAL_REQUEST" in cats:
            recommendations.append(
                "Never share OTPs, PINs, CVV numbers, or passwords with anyone—even callers claiming to be bank staff."
            )
        if "REGISTRATION_FEE" in cats or category == "Fake Job Scam":
            recommendations.append(
                "Do not pay registration, processing, or security fees for jobs, loans, or prizes."
            )
        if "SUSPICIOUS_URL" in cats or category == "Phishing":
            recommendations.append(
                "Avoid clicking shortened or unverified links; navigate directly to the official app or website."
            )
        if "ACCOUNT_THREAT" in cats or "IMPERSONATION" in cats or category == "Banking Scam":
            recommendations.append(
                "Verify account alerts directly through your institution's official phone number or mobile app."
            )
        if category == "Investment Scam" or "INVESTMENT_SCAM" in cats:
            recommendations.append(
                "Be skeptical of guaranteed profits or risk-free returns; verify financial advisors with regulators."
            )
        if category == "Lottery Scam" or "UNREALISTIC_OFFERS" in cats:
            recommendations.append(
                "Ignore unsolicited lottery or prize notifications—you cannot win a contest you never entered."
            )
        if "PERSONAL_INFO" in cats:
            recommendations.append(
                "Do not share Aadhaar, PAN, passport, or Social Security numbers over unverified messages."
            )
        if not recommendations:
            recommendations.append(
                "Verify the sender independently through a trusted channel before replying or taking action."
            )

        if risk_level in ("HIGH RISK", "CRITICAL THREAT"):
            recommendations.append(
                "Block and report the sender to your mobile carrier or national cybercrime helpline."
            )
        return recommendations

    def _compute_confidence(
        self,
        score: int,
        category_matches: Dict[str, List[Tuple[Tuple[int, int], str]]],
    ) -> float:
        """Compute classification confidence between 0.0 and 1.0."""
        if not category_matches:
            return 0.9
        num_categories = len(category_matches)
        total_signals = sum(len(matches) for matches in category_matches.values())
        if score <= 20:
            return round(max(0.65, 0.85 - 0.05 * total_signals), 2)
        raw_conf = 0.55 + (0.10 * min(num_categories, 3)) + (0.04 * min(total_signals, 5))
        if score >= 75:
            raw_conf = max(raw_conf, 0.88)
        return round(min(0.99, raw_conf), 2)

    def _build_summary(
        self, score: int, risk_level: str, category: str, signal_count: int
    ) -> str:
        """Create a concise 1-sentence executive summary of the assessment."""
        if risk_level == "LOW RISK" and signal_count == 0:
            return "No scam indicators detected; this message appears safe."
        if risk_level == "LOW RISK":
            return (
                f"Low risk ({score}/100): {signal_count} mild indicator(s) found, "
                "not indicative of an active scam on their own."
            )
        return (
            f"{risk_level} ({score}/100) — Classified as {category} with "
            f"{signal_count} weighted threat signal(s) detected."
        )
