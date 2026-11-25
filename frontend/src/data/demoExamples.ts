export interface DemoExample {
  id: string
  label: string
  category: string
  expectedRisk: 'CRITICAL' | 'HIGH' | 'SAFE'
  targetType: 'message' | 'url'
  content: string
  description: string
}

export const DEMO_EXAMPLES: DemoExample[] = [
  {
    id: 'fake-job-offer',
    label: 'FAKE JOB OFFER',
    category: 'Employment Fraud',
    expectedRisk: 'CRITICAL',
    targetType: 'message',
    content:
      'Congratulations! You have been selected for a work-from-home job. Salary ₹40,000 per week. Pay a refundable registration deposit immediately to confirm your position.',
    description: 'Unrealistic weekly salary combined with upfront refundable deposit urgency.',
  },
  {
    id: 'otp-phishing',
    label: 'OTP PHISHING',
    category: 'Banking Phishing',
    expectedRisk: 'CRITICAL',
    targetType: 'message',
    content:
      'Your bank account will be blocked today. Verify your account immediately using this link and submit your OTP.',
    description: 'Account suspension fear tactic requesting credential & OTP submission.',
  },
  {
    id: 'lottery-scam',
    label: 'LOTTERY SCAM',
    category: 'Advance-Fee Fraud',
    expectedRisk: 'HIGH',
    targetType: 'message',
    content: 'You have won ₹10,00,000! Pay processing fees to claim your prize.',
    description: 'Unsolicited prize win requiring advance processing fee under time pressure.',
  },
  {
    id: 'suspicious-url',
    label: 'SUSPICIOUS URL',
    category: 'Malicious Link',
    expectedRisk: 'HIGH',
    targetType: 'url',
    content: 'http://bit.ly/secure-login-verify',
    description: 'Obfuscated HTTP shortener masquerading with high-trust login verification terms.',
  },
  {
    id: 'safe-message',
    label: 'SAFE MESSAGE',
    category: 'Legitimate Notice',
    expectedRisk: 'SAFE',
    targetType: 'message',
    content:
      'Reminder: Your college laboratory session is scheduled for tomorrow at 10 AM. Please bring your record notebook.',
    description: 'Normal academic reminder with zero financial pressure or credential harvesting.',
  },
  {
    id: 'delivery-message',
    label: 'DELIVERY MESSAGE',
    category: 'Legitimate Notice',
    expectedRisk: 'SAFE',
    targetType: 'message',
    content:
      'Your parcel is scheduled for delivery today. Track your order using the official courier application.',
    description: 'Standard delivery window update directing user only to official courier app.',
  },
]
