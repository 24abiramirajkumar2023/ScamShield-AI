# 🛡️ SCAMSHIELD AI

> **"Detect the Threat. Stop the Scam."**

An advanced AI-powered cybersecurity platform for detecting scam messages, phishing attempts, fake job offers, fraudulent URLs, and online threats in real-time.

Built for the **36-Hour International Hackathon — Build Without Limit.**

---

## 🔥 Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Message Scanner** | Analyze suspicious SMS, WhatsApp, email, and social media messages |
| 🌐 **URL Threat Intelligence** | Detect phishing URLs, shortened links, and malicious domains |
| 📊 **Threat Dashboard** | Real-time threat intelligence center with charts and history |
| 🎓 **Threat Education Center** | Learn about 11+ types of online scams |
| 💬 **AI Security Assistant** | Interactive chatbot for cybersecurity guidance |
| 📜 **Scan History** | Local scan history with search and filter |
| 🎯 **Demo Mode** | One-click demo examples for judges |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** — Premium red & black cybersecurity theme
- **Framer Motion** — Smooth animations
- **Lucide React** — Icons
- **Recharts** — Data visualizations
- **React Router DOM** — Client-side routing
- **Axios** — API communication

### Backend
- **Python 3.9+** + **FastAPI**
- **Pydantic v2** — Schema validation
- **Uvicorn** — ASGI server
- **Hybrid AI Engine** — Rule-based NLP + weighted indicator analysis

---

## 📁 Project Structure

```
SCAMSHIELD AI/
├── frontend/              # React/TypeScript frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route pages
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API service layer
│   │   └── utils/        # Utility functions
│   ├── .env.example
│   └── package.json
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/          # Route handlers
│   │   ├── core/         # Configuration
│   │   ├── services/     # AI detection engine
│   │   └── schemas/      # Pydantic models
│   ├── tests/            # Unit tests
│   ├── requirements.txt
│   └── run.py
├── .env.example
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** 18+
- **Python** 3.9+
- **npm** or **yarn**

### 1. Clone / Navigate to project
```bash
cd "SCAMSHIELD AI"
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python run.py
# Backend runs at http://localhost:8000
# If port 8000 is already in use on your machine, run on another port:
#   python run.py --port 8001
# and set VITE_API_URL=http://localhost:8001 in frontend/.env to match.
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

### 4. Open the app
Navigate to **http://localhost:5173**

---

## 🌍 Environment Variables

### Backend (`backend/.env`)
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
LOG_LEVEL=INFO
OPENAI_API_KEY=          # Optional: for LLM-enhanced analysis
MAX_TEXT_LENGTH=5000
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000   # Must match the backend port (e.g. 8001 if 8000 is taken)
VITE_OPENAI_KEY=         # Optional
```

---

## 🔌 API Documentation

### Base URL: `http://localhost:8000` (or the port you started the backend on, e.g. `http://localhost:8001`)

#### `POST /api/analyze/message`
Analyze a suspicious text message.

**Request:**
```json
{ "text": "Suspicious message text..." }
```

**Response:**
```json
{
  "score": 85,
  "risk_level": "CRITICAL THREAT",
  "category": "Fake Job Scam",
  "summary": "...",
  "signals": [
    {
      "name": "Registration Fee Request",
      "severity": "CRITICAL",
      "explanation": "...",
      "matched_phrase": "pay registration fee"
    }
  ],
  "highlighted_phrases": ["pay registration fee", "work from home"],
  "explanations": ["..."],
  "recommendations": ["..."],
  "confidence": 0.92
}
```

#### `POST /api/analyze/url`
Analyze a suspicious URL (locally, no actual fetching).

**Request:**
```json
{ "url": "http://bit.ly/suspicious-link" }
```

#### `GET /api/health`
Health check endpoint.

#### `GET /api/stats`
Get accumulated scan statistics.

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Test Coverage
- ✅ Fake job scam messages (high risk)
- ✅ OTP phishing messages (critical)
- ✅ Lottery scams (high risk)
- ✅ Investment scams (high risk)
- ✅ Safe college announcements (low risk)
- ✅ Safe delivery notifications (low risk)
- ✅ Suspicious URL patterns
- ✅ Normal URL analysis
- ✅ Empty/invalid input handling

---

## 🎯 Demo Mode

The application includes 6 built-in demo examples for judges:

1. **Fake Job Offer** — Work-from-home scam with registration fee
2. **OTP Phishing** — Bank account suspension with OTP request
3. **Lottery Scam** — Prize claim with processing fee
4. **Suspicious URL** — URL shortener with login keywords
5. **Safe Message** — Normal college announcement
6. **Safe Delivery** — Legitimate courier notification

---

## 🔒 Security & Privacy

- ✅ No automatic URL fetching or execution
- ✅ URL analysis is 100% local/static
- ✅ Scan history stored only in browser localStorage
- ✅ No credentials collected
- ✅ API keys stored in environment variables
- ✅ Input validation and size limits
- ✅ CORS properly configured

---

## ⚠️ Disclaimer

> ScamShield AI is an assistive security tool. Its analysis may be incorrect. Always verify important messages through official channels. Never share OTPs, passwords, or banking credentials with anyone.

---

## 👥 Hackathon

**Event:** 36-Hour International Hackathon — Build Without Limit  
**Category:** AI/Cybersecurity  
**Theme:** Detect the Threat. Stop the Scam.

---

*Built with ❤️ and ☕ in 36 hours.*
