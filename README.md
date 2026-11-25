# 🛡️ ScamShield AI

### Detect the Threat. Stop the Scam.

An AI-powered cybersecurity platform that detects suspicious messages, phishing attempts, fake job offers, and potentially malicious URLs through intelligent risk analysis and explainable threat detection.

---

## 🚀 About the Project

ScamShield AI is designed to help people identify online scams before they become victims. Users can analyze suspicious messages and URLs, understand potential threats, view risk scores, and receive actionable safety recommendations.

Our mission is to make digital security accessible, understandable, and safer for everyone.

---

## ✨ Features

- **AI Message Scanner** – Analyze SMS, WhatsApp messages, emails, and job offers.
- **Scam Detection** – Identify phishing, fake job offers, OTP fraud, financial scams, and impersonation.
- **Risk Scoring** – Generate a risk score from 0–100.
- **Explainable Analysis** – Understand why a message is suspicious.
- **Suspicious Phrase Highlighting** – Highlight potential scam indicators.
- **URL Scanner** – Analyze suspicious links and URL patterns without automatically opening them.
- **Security Dashboard** – Visualize scan activity and threat statistics.
- **AI Security Assistant** – Get cybersecurity explanations and practical safety guidance.
- **Threat Education Center** – Learn about common online scams and how to avoid them.
- **Scan History** – Search, filter, and manage previous scan results.
- **Demo Mode** – Test the application using fictional scam and safe-message examples.

---

## 🖥️ Application Modules

| Module | Description |
|---|---|
| Home | Introduction to ScamShield AI |
| Dashboard | Threat statistics and scan analytics |
| Message Scanner | Analyze suspicious text messages |
| URL Scanner | Detect suspicious URL patterns |
| Threat Center | Learn about different scam types |
| History | View previous scans |
| AI Assistant | Get cybersecurity guidance |
| About | Project information |

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React

### Backend
- Python
- FastAPI
- Pydantic
- REST API

### Detection Engine
- Rule-based threat detection
- Weighted risk scoring
- Explainable analysis
- Suspicious pattern detection

---

## 🏗️ Architecture

```text
                USER
                 │
                 ▼
         REACT FRONTEND
                 │
                 ▼
          FASTAPI BACKEND
                 │
                 ▼
        INPUT VALIDATION
                 │
                 ▼
       THREAT DETECTION ENGINE
          ┌──────┴──────┐
          ▼             ▼
    MESSAGE SCAN    URL ANALYSIS
          │             │
          └──────┬──────┘
                 ▼
           RISK SCORING
                 │
                 ▼
       EXPLANATION & SAFETY TIPS
                 │
                 ▼
         RESULTS DASHBOARD
```

---

## 🔍 Scam Categories

ScamShield AI focuses on detecting patterns related to:

- Phishing attacks
- Fake job offers
- OTP fraud
- Banking scams
- UPI fraud
- Lottery scams
- Investment scams
- Delivery scams
- Impersonation
- Suspicious URLs

---

## 🎯 How It Works

1. Enter a suspicious message or URL.
2. The application validates the input.
3. The detection engine analyzes suspicious indicators.
4. A risk score is calculated.
5. The detected threat category is identified.
6. Suspicious phrases and signals are explained.
7. Safety recommendations are displayed.

---

## ⚙️ Installation

### Prerequisites

- Node.js
- npm
- Python 3.10+
- Git

### Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ScamShield-AI.git
cd ScamShield-AI
```

### Backend Setup

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend:

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

Backend:

`http://127.0.0.1:8001`

API Documentation:

`http://127.0.0.1:8001/docs`

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

`http://localhost:5173`

---

## 🧪 Testing

Run backend tests:

```bash
pytest
```

The project includes test cases for scam detection, safe messages, suspicious URLs, and input validation.

---

## 🔐 Security & Privacy

- Submitted URLs are not automatically opened.
- Inputs are validated before analysis.
- The application aims to minimize unnecessary data storage.
- Users can manage scan history.
- Never share OTPs, passwords, or banking credentials.
- Risk scores are estimates and not guarantees.

---

## ⚠️ Disclaimer

ScamShield AI is an assistive cybersecurity tool. It may produce incorrect results or fail to detect some scams.

Always verify important messages using official websites and trusted communication channels. Do not rely solely on AI-generated risk assessments.

---

## 🔮 Future Scope

- Multilingual scam detection
- Browser extension
- Advanced machine learning models
- Real-time threat intelligence
- Community scam reporting
- Voice-based scam detection
- Mobile application

---

## 🏆 Hackathon Project

Developed for a 36-hour hackathon under the theme **Build Without Limit**.

### ScamShield AI

**Detect the Threat. Stop the Scam.**

*Think Before You Click.* 🔴🖤
