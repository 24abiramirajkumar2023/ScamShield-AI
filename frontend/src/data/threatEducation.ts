export interface ThreatTopic {
  id: string
  title: string
  categoryTag: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM'
  iconKey:
    | 'key'
    | 'briefcase'
    | 'trophy'
    | 'link'
    | 'trending'
    | 'package'
    | 'monitor'
    | 'phone'
    | 'heart'
    | 'qr'
    | 'landmark'
  whatIsIt: string
  example: string
  warningSigns: string[]
  howScammersOperate: string[]
  howToProtect: string[]
}

export const THREAT_TOPICS: ThreatTopic[] = [
  {
    id: 'otp-phishing',
    title: 'OTP & Bank KYC Phishing',
    categoryTag: 'CREDENTIAL HARVESTING',
    severity: 'CRITICAL',
    iconKey: 'key',
    whatIsIt:
      'Attackers impersonate banks, payment wallets, or telecom providers claiming your account or KYC will be frozen today unless you share an OTP or verify via an embedded link.',
    example:
      '"URGENT: Your bank account will be blocked in 2 hours due to expired KYC. Click http://bit.ly/bank-kyc-fix and enter your OTP immediately."',
    warningSigns: [
      'Threats of immediate account suspension or card deactivation',
      'Requests to share a One-Time Password (OTP), PIN, or CVV',
      'Shortened or misspelled banking URLs sent via SMS or WhatsApp',
      'Generic greetings instead of official bank customer alerts',
    ],
    howScammersOperate: [
      'Purchase leaked phone number lists and send bulk SMS (smishing) blasts',
      'Host cloned banking login portals on lookalike domains',
      'Trigger live password-reset or fund-transfer OTPs while convincing victims to read the code aloud or type it into the fake portal',
    ],
    howToProtect: [
      'Never share OTPs, PINs, or passwords with anyone—banks never ask for them',
      'Ignore links in urgent SMS messages; open your official banking app directly',
      'Enable biometric 2FA and transaction alerts on all financial accounts',
    ],
  },
  {
    id: 'fake-job-offers',
    title: 'Fake Work-From-Home & Job Scams',
    categoryTag: 'EMPLOYMENT FRAUD',
    severity: 'CRITICAL',
    iconKey: 'briefcase',
    whatIsIt:
      'Fraudulent recruiters promise extraordinarily high weekly pay for minimal remote tasks, then demand an upfront "registration fee", "training deposit", or "laptop security fee".',
    example:
      '"Congratulations! You are shortlisted for remote data entry paying 40,000/week. Pay a refundable 1,500 onboarding deposit to receive your offer letter."',
    warningSigns: [
      'Outsized salary for entry-level or vague remote work without an interview',
      'Requests for refundable security deposits, ID processing fees, or paid tasks',
      'Communication solely via Telegram, WhatsApp, or free webmail accounts',
      'High-pressure deadlines ("confirm slot within 30 minutes")',
    ],
    howScammersOperate: [
      'Scrape job boards or spam messaging apps with enticing part-time offers',
      'Use fake HR certificates and stolen corporate logos to appear legitimate',
      'Escalate payment requests ("task unlock", "tax clearance") until the victim stops paying',
    ],
    howToProtect: [
      'Legitimate employers never charge candidates to get hired or start onboarding',
      'Verify openings directly on the official company careers domain',
      'Treat WhatsApp/Telegram unsolicited job offers as high-risk by default',
    ],
  },
  {
    id: 'lottery-prize-fraud',
    title: 'Lottery & Prize Processing Fee Scams',
    categoryTag: 'ADVANCE-FEE FRAUD',
    severity: 'HIGH',
    iconKey: 'trophy',
    whatIsIt:
      'Victims are notified they won a massive cash prize, luxury car, or promotional sweepstakes they never entered, with a small "processing" or "tax clearance" fee required first.',
    example:
      '"Congratulations! Your mobile number won 10,00,000 in the Global Digital Lucky Draw. Pay 500 processing fee today to unlock payout."',
    warningSigns: [
      'Winning a contest, raffle, or lottery you never registered for',
      'Upfront fees required to release, insure, or clear winnings',
      'Countdown timers or "claim expires tonight" urgency',
      'Requests for gift cards, crypto transfers, or personal banking details',
    ],
    howScammersOperate: [
      'Exploit excitement and urgency to bypass critical verification',
      'Collect a small initial fee, then invent customs, GST, or courier charges',
      'Disappear or block the victim as soon as payments stop',
    ],
    howToProtect: [
      'Real sweepstakes deduct taxes or never require victims to pay to collect prizes',
      'Never send money or personal IDs to claim unexpected rewards',
      'Block and report sender numbers immediately',
    ],
  },
  {
    id: 'malicious-urls',
    title: 'Shortened & Lookalike Phishing URLs',
    categoryTag: 'INFRASTRUCTURE SPOOFING',
    severity: 'HIGH',
    iconKey: 'link',
    whatIsIt:
      'Attackers disguise malicious destinations behind URL shorteners, raw IP addresses, homograph characters, or subdomains imitating trusted brands.',
    example:
      '"http://secure-login.paypa1-verify-account.xyz/auth" or "http://bit.ly/secure-login-verify"',
    warningSigns: [
      'Plain HTTP instead of HTTPS on pages requesting login credentials',
      'URL shorteners masking unexpected destination domains',
      'Misspelled brand names (e.g., rnicrosoft, paypa1, amaz0n)',
      'Excessive hyphens, suspicious TLDs (.xyz, .top, .tk), or raw IP hosts',
    ],
    howScammersOperate: [
      'Register lookalike domains via automated scripts and deploy SSL certificates',
      'Chain shorteners or open redirects to evade static email filters',
      'Capture credentials and session cookies via reverse-proxy phishing kits',
    ],
    howToProtect: [
      'Inspect the root domain right before the first single slash carefully',
      'Scan unfamiliar URLs with ScamShield URL Threat Intelligence before clicking',
      'Use password managers—they refuse to autofill on mismatched domains',
    ],
  },
  {
    id: 'crypto-investment-scams',
    title: 'Guaranteed-Return & Crypto Scams',
    categoryTag: 'INVESTMENT FRAUD',
    severity: 'CRITICAL',
    iconKey: 'trending',
    whatIsIt:
      'Fake trading platforms or Telegram VIP signal groups promise risk-free daily returns (e.g., 5% per day) via proprietary AI bots or crypto arbitrage.',
    example:
      '"Join our Institutional AI Crypto Pool—turn 5,000 into 45,000 in 72 hours. Zero risk, instant withdrawals!"',
    warningSigns: [
      'Promises of guaranteed or extraordinarily high daily/weekly ROI',
      'Testimonials filled with luxury cars and edited wallet screenshots',
      'Platforms asking for withdrawal taxes or liquidity unlocks before payout',
      'Unregistered apps sideloaded outside official app stores',
    ],
    howScammersOperate: [
      'Allow tiny initial withdrawals to build false trust ("hook phase")',
      'Display fabricated profit dashboards controlled entirely by the attacker',
      'Freeze the account once a large deposit is made and demand extra fees',
    ],
    howToProtect: [
      'No legitimate investment guarantees high returns with zero risk',
      'Verify exchange licensing with national financial regulators',
      'Never install trading APKs or profiles sent via private chat groups',
    ],
  },
  {
    id: 'delivery-customs-scams',
    title: 'Fake Parcel & Customs Hold Scams',
    categoryTag: 'LOGISTICS IMPERSONATION',
    severity: 'HIGH',
    iconKey: 'package',
    whatIsIt:
      'Messages claim a package cannot be delivered due to an incomplete address or unpaid customs fee, directing recipients to a phishing payment form.',
    example:
      '"Delivery Attempt Failed: Update your address and pay a 25 redelivery fee within 12 hours or your parcel will be returned."',
    warningSigns: [
      'Unexpected delivery alerts with no order number or merchant name',
      'Tiny "redelivery fee" designed to harvest full credit/debit card details',
      'Non-official courier links using random subdomains or shorteners',
      'Threat of parcel destruction or legal seizure within hours',
    ],
    howScammersOperate: [
      'Send mass messages timed with peak shopping seasons',
      'Capture card numbers, expiry, and CVV on a low-value checkout form',
      'Use harvested card data immediately for unauthorized high-value purchases',
    ],
    howToProtect: [
      'Track orders solely inside the shopping app or official courier website',
      'Never enter payment card info for unverified delivery fee texts',
      'Check merchant order history before acting on any courier alert',
    ],
  },
  {
    id: 'tech-support-scams',
    title: 'Tech Support & Remote Access Scams',
    categoryTag: 'REMOTE TAKEOVER',
    severity: 'HIGH',
    iconKey: 'monitor',
    whatIsIt:
      'Pop-ups or fake support agents warn your device is infected or an antivirus subscription auto-renewed, pressuring you to install remote desktop software.',
    example:
      '"Security Alert: 49,999 debited for Antivirus Renewal. Call toll-free support immediately to cancel and install AnyDesk for refund."',
    warningSigns: [
      'Unsolicited invoices for software renewals you never purchased',
      'Instructions to install remote-control tools (AnyDesk, TeamViewer, QuickSupport)',
      'Fullscreen browser alerts mimicking OS defender warnings with loud audio',
      'Requests to open online banking while the agent watches your screen',
    ],
    howScammersOperate: [
      'Send fake billing receipts with a direct scam call-center phone number',
      'Guide victims into installing remote access apps under the guise of "refund processing"',
      'Black out the victim screen while transferring funds or editing HTML balances',
    ],
    howToProtect: [
      'Never grant remote screen control to unknown support callers',
      'Verify software renewals in your bank statement or app store subscriptions',
      'Close fullscreen browser scam pop-ups via Task Manager or Ctrl+W',
    ],
  },
  {
    id: 'ai-voice-emergency',
    title: 'AI Voice Cloning & Virtual Kidnapping',
    categoryTag: 'DEEPFAKE SOCIAL ENGINEERING',
    severity: 'CRITICAL',
    iconKey: 'phone',
    whatIsIt:
      'Scammers sample seconds of a loved one’s voice from social media videos to synthesize panic calls claiming an accident, arrest, or urgent bail transfer.',
    example:
      '"Mom, I crashed my car and my phone is dead—police are here, send 25,000 immediately to this officer UPI/wallet!"',
    warningSigns: [
      'Call from an unknown number claiming an urgent family crisis',
      'Demand for instant wire, crypto, or UPI transfer while keeping you on the line',
      'Refusal to answer specific personal verification questions',
      'Robotic cadence, clipped background noise, or rushed hang-ups',
    ],
    howScammersOperate: [
      'Harvest public voice clips from Instagram, TikTok, YouTube, or voicemails',
      'Generate cloned panic dialogue with off-the-shelf voice synthesis models',
      'Prevent victims from hanging up to check on the real family member',
    ],
    howToProtect: [
      'Establish a private family safe-word for emergency verification',
      'Hang up immediately and call your family member directly on their known number',
      'Limit public audio/video exposure on social profiles',
    ],
  },
  {
    id: 'romance-pig-butchering',
    title: 'Long-Con Romance & Pig-Butchering',
    categoryTag: 'PSYCHOLOGICAL MANIPULATION',
    severity: 'HIGH',
    iconKey: 'heart',
    whatIsIt:
      'Fraudsters cultivate weeks of emotional trust via dating apps or "wrong number" texts before introducing an exclusive investment opportunity or emergency crisis.',
    example:
      '"Sorry, wrong number! You seem really kind though—by the way, my uncle showed me a safe gold trading app that gives extra monthly income."',
    warningSigns: [
      'Rapid romantic escalation combined with constant excuses avoiding video calls',
      'Casual wrong-number text that quickly transitions to personal friendship',
      'Consistent steering of conversations toward crypto, forex, or wealth coaching',
      'Requests for secrecy from family or financial advisors',
    ],
    howScammersOperate: [
      'Use scripted playbooks across weeks to build emotional dependency',
      'Move targets off monitored dating apps onto encrypted chat platforms',
      'Direct victims to fraudulent trading apps until savings are exhausted',
    ],
    howToProtect: [
      'Never mix online relationships with financial transfers or investment advice',
      'Perform reverse-image searches on profile photos and insist on live video verification',
      'Consult trusted friends if an online contact pressures you to invest',
    ],
  },
  {
    id: 'qr-upi-collect-scams',
    title: 'QR Code & Collect-Request Payment Traps',
    categoryTag: 'PAYMENT REVERSAL',
    severity: 'HIGH',
    iconKey: 'qr',
    whatIsIt:
      'Scammers posing as marketplace buyers send a QR code or payment collect request claiming you must scan it and enter your PIN to RECEIVE money.',
    example:
      '"I sent the 12,000 payment for your sofa. Just scan this QR code and enter your UPI PIN to accept the incoming funds."',
    warningSigns: [
      'Anyone claiming you must enter a PIN or scan a QR code to receive money',
      'Urgent marketplace buyers unwilling to meet or use escrow',
      'Pre-filled payment request screens labeled "Pay" disguised as "Receive"',
      'Fake payment confirmation screenshots sent before funds arrive',
    ],
    howScammersOperate: [
      'Target online classifieds sellers (furniture, electronics, rentals)',
      'Generate "Collect Money" or merchant debit QR codes',
      'Trick sellers into authorizing an outgoing debit using their own PIN',
    ],
    howToProtect: [
      'Remember the golden rule: a PIN is ONLY required to send money, never to receive it',
      'Read payment app prompts carefully to distinguish Pay vs Receive',
      'Verify funds appear in your actual bank balance—not in chat screenshots',
    ],
  },
  {
    id: 'govt-authority-impersonation',
    title: 'Government, Tax & Police Impersonation',
    categoryTag: 'AUTHORITY COERCION',
    severity: 'CRITICAL',
    iconKey: 'landmark',
    whatIsIt:
      'Callers or emails claim to represent tax authorities, cyber police, or customs—threatening "digital arrest" or warrant execution unless an immediate fine is wired.',
    example:
      '"Narcotics parcel seized under your ID. Stay on Skype video call for Digital Arrest verification and transfer security bond to clear your record."',
    warningSigns: [
      'Law enforcement demanding secrecy, continuous video calls, or online fines',
      'Requests to settle legal warrants using gift cards, crypto, or personal accounts',
      'Spoofed caller IDs or forged PDF arrest warrants bearing generic seals',
      'Intimidation discouraging you from calling local police or legal counsel',
    ],
    howScammersOperate: [
      'Use fear of legal trouble and public embarrassment to induce compliance',
      'Conduct staged "police station" video calls with fake uniforms',
      'Instruct victims to liquidate savings into "escrow safety accounts" controlled by scammers',
    ],
    howToProtect: [
      'Police and courts never conduct "digital arrests" or settle cases via video call payments',
      'Hang up and contact official government/police helplines independently',
      'Report impersonation calls immediately to national cybercrime authorities',
    ],
  },
]
