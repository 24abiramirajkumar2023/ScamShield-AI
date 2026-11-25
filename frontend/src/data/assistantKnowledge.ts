export interface QuickQuestion {
  id: string
  label: string
  prompt: string
}

export const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    id: 'clicked-link',
    label: 'I clicked a suspicious link — what now?',
    prompt: 'I accidentally clicked a suspicious phishing link. What immediate steps should I take?',
  },
  {
    id: 'otp-scam',
    label: 'How do OTP scams work?',
    prompt: 'How do OTP and bank KYC scams work, and how can I tell if an alert is real?',
  },
  {
    id: 'job-scam',
    label: 'Is this remote job offer a scam?',
    prompt: 'What are the red flags of fake work-from-home and job deposit scams?',
  },
  {
    id: 'investment-scam',
    label: 'How to spot crypto / investment scams?',
    prompt: 'How can I spot guaranteed-return investment and crypto scams?',
  },
  {
    id: 'report-scam',
    label: 'How do I report a scam?',
    prompt: 'Where and how should I report a cyber scam or financial fraud?',
  },
]

interface KnowledgeRule {
  keywords: string[]
  title: string
  response: string
}

const KNOWLEDGE_RULES: KnowledgeRule[] = [
  {
    keywords: ['clicked', 'link', 'url', 'opened', 'malware', 'phishing link', 'visited'],
    title: 'Incident Response: Clicked a Suspicious Link',
    response: [
      'Follow this immediate SOC containment checklist:',
      '1. **Disconnect & Close**: Close the browser tab immediately. If you downloaded any file (APK, EXE, PDF), do NOT open it and disconnect the device from Wi-Fi/mobile data.',
      '2. **Did you enter credentials?** If you typed a password, change it immediately on the official site/app—and change passwords on any other accounts sharing that password.',
      '3. **Did you enter bank/card/OTP details?** Call your bank fraud hotline right away to freeze cards, disable net-banking temporarily, and dispute unauthorized transactions.',
      '4. **Revoke Active Sessions**: Log out of all devices/sessions on email and banking accounts, then verify MFA/2FA recovery settings were not altered.',
      '5. **Scan Device**: Run a full anti-malware scan and check recently installed browser extensions or apps.',
    ].join('\n\n'),
  },
  {
    keywords: ['otp', 'kyc', 'bank', 'pin', 'cvv', 'blocked', 'suspended'],
    title: 'OTP & Banking Phishing Defense',
    response: [
      '**How OTP Scams Work:** Attackers create panic by claiming your bank account, SIM card, or KYC will be blocked today. While you stay on the line or use their fake link, they initiate a real login or fund transfer and trick you into handing over the 6-digit OTP.',
      '**Core Security Rules:**\n- Real banks and payment apps NEVER ask for your OTP, ATM PIN, CVV, or password.\n- Never share OTPs to "cancel" a transaction or "receive" a refund—OTPs authorize outgoing actions.\n- Always open your official banking app manually instead of tapping SMS or WhatsApp links.',
    ].join('\n\n'),
  },
  {
    keywords: ['job', 'salary', 'work from home', 'wfh', 'hiring', 'registration', 'deposit', 'recruit'],
    title: 'Fake Job & Registration Fee Detection',
    response: [
      '**Key Red Flags of Employment Fraud:**\n- Unrealistically high weekly pay for simple tasks (e.g., data entry, liking videos, order boosting).\n- Any request for a "refundable registration deposit", "equipment security fee", or "task unlock payment".\n- Recruiters operating exclusively via WhatsApp/Telegram without verifiable corporate email domains or structured interviews.',
      '**Verification Protocol:** Confirm the role directly on the official company careers page and never pay money to accept a job.',
    ].join('\n\n'),
  },
  {
    keywords: ['invest', 'crypto', 'bitcoin', 'trading', 'profit', 'guaranteed', 'roi', 'double'],
    title: 'Investment & Crypto Fraud Indicators',
    response: [
      '**Spotting Fraudulent Investment Schemes:**\n- Promises of guaranteed daily/weekly returns or "risk-free AI trading bots".\n- Pressure to transfer funds via cryptocurrency wallets, gift cards, or unverified personal bank accounts.\n- Fake trading dashboards that let you withdraw tiny amounts early, then demand "withdrawal taxes" or "verification deposits" when you try to cash out larger profits.',
      '**Rule of Thumb:** Verify broker registration with your national securities regulator before depositing any capital.',
    ].join('\n\n'),
  },
  {
    keywords: ['report', 'police', 'cybercrime', 'complaint', 'helpline', 'authority'],
    title: 'How to Report Scams & Preserve Evidence',
    response: [
      '**Reporting & Evidence Preservation Steps:**\n1. **Preserve Evidence First**: Take screenshots of the full message, sender phone number/email, phishing URL, transaction IDs, and wallet addresses. Do not delete chat threads.',
      '2. **Contact Financial Institutions Immediately**: Call your bank or card issuer fraud helpline within minutes—early reporting greatly increases chargeback or freeze success.',
      '3. **File an Official Cybercrime Report**:\n   - **India**: Call **1930** (National Cybercrime Helpline) or submit at **cybercrime.gov.in**\n   - **USA**: Report to **reportfraud.ftc.gov** and **ic3.gov** (FBI IC3)\n   - **UK**: Report to **actionfraud.police.uk** (forward scam SMS to **7726**)\n   - **Global / Other Regions**: Report to your local cybercrime bureau and forward phishing emails/SMS to your carrier (`7726` in many countries).',
    ].join('\n\n'),
  },
  {
    keywords: ['phishing', 'smishing', 'email', 'message', 'scam', 'verify', 'red flag'],
    title: 'Core Phishing & Social Engineering Indicators',
    response: [
      '**5 Universal Phishing Signals (The URGENT Framework):**\n- **Urgency & Fear**: Countdown threats ("blocked in 2 hours", "legal action today").\n- **Requests for Secrets**: Asking for OTPs, passwords, PINs, or private keys.\n- **Greed / Too Good to Be True**: Surprise lotteries, instant high-paying remote jobs, guaranteed ROI.\n- **External Lookalike Links**: Shorteners (`bit.ly`), plain `http://`, or misspelled brand domains.\n- **Non-Standard Payment Channels**: Upfront deposits via UPI collect, gift cards, or crypto.',
      'Paste any suspicious text into our **Message Scanner** or link into **URL Scanner** for detailed AI signal breakdown.',
    ].join('\n\n'),
  },
  {
    keywords: ['qr', 'upi', 'receive money', 'collect'],
    title: 'QR Code & Payment Collect Trap Warning',
    response: [
      '**Golden Payment Rule:** You NEVER need to scan a QR code or enter your UPI/bank PIN to **receive** money.',
      'If a buyer sends you a QR code or a "collect request" saying you must enter your PIN to accept funds, it is a debit scam designed to pull money OUT of your account.',
    ].join('\n\n'),
  },
]

export function generateLocalAssistantResponse(query: string): string {
  const normalized = query.toLowerCase().trim()
  if (!normalized) {
    return 'Please ask a cybersecurity question, paste a suspicious scenario, or select one of the quick-action queries above.'
  }

  let bestRule: KnowledgeRule | null = null
  let bestScore = 0

  for (const rule of KNOWLEDGE_RULES) {
    let matches = 0
    for (const kw of rule.keywords) {
      if (normalized.includes(kw)) {
        matches += kw.includes(' ') ? 2 : 1
      }
    }
    if (matches > bestScore) {
      bestScore = matches
      bestRule = rule
    }
  }

  if (bestRule && bestScore > 0) {
    return `**[${bestRule.title}]**\n\n${bestRule.response}`
  }

  return [
    '**[ScamShield SOC Guidance]**',
    'I can help you evaluate suspicious messages, phishing URLs, OTP/KYC fraud, fake job offers, crypto scams, or incident recovery steps.',
    'Key zero-trust verification habits:\n- Never share OTPs, PINs, or passwords over SMS, phone, or unverified links.\n- Never pay upfront "registration" or "processing" fees for jobs or prizes.\n- Independently verify alerts using official apps or known customer support numbers.\n- Use the **Message Scanner** or **URL Scanner** tabs for instant automated risk scoring.',
  ].join('\n\n')
}

export async function askSecurityAssistant(
  userQuery: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{ reply: string; source: 'openai' | 'local' }> {
  const openAiKey = import.meta.env.VITE_OPENAI_KEY

  if (openAiKey && openAiKey.trim().length > 10) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey.trim()}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.3,
          max_tokens: 450,
          messages: [
            {
              role: 'system',
              content:
                'You are ScamShield AI Security Assistant, a concise, practical SOC cybersecurity analyst helping users detect scams, phishing, fake jobs, and malicious links, and guiding post-incident containment safely.',
            },
            ...history.slice(-6),
            { role: 'user', content: userQuery },
          ],
        }),
      })

      if (response.ok) {
        const data = (await response.json()) as {
          choices?: Array<{ message?: { content?: string } }>
        }
        const aiText = data.choices?.[0]?.message?.content?.trim()
        if (aiText) {
          return { reply: aiText, source: 'openai' }
        }
      }
    } catch {
      // Fall back smoothly to local SOC knowledge engine
    }
  }

  return {
    reply: generateLocalAssistantResponse(userQuery),
    source: 'local',
  }
}
