export interface SpamCheckResult {
  score: number;
  grade: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'CRITICAL_RISK';
  passed: boolean;
  warnings: string[];
}

const HIGH_RISK_KEYWORDS = [
  '100% free', 'act now', 'apply now', 'instant cash', 'guaranteed',
  'no credit check', 'risk free', 'urgent', 'winner', 'congratulations',
  'make money', 'fast cash', 'buy direct', 'limited time'
];

const DISPOSABLE_DOMAINS = [
  'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'trashmail.com'
];

export const evaluateCampaignSpamScore = (subject: string, bodyHtml: string): SpamCheckResult => {
  const warnings: string[] = [];
  let score = 100;

  const contentLower = `${subject} ${bodyHtml}`.toLowerCase();

  // Keyword check
  for (const keyword of HIGH_RISK_KEYWORDS) {
    if (contentLower.includes(keyword)) {
      score -= 10;
      warnings.push(`High-risk spam keyword detected: "${keyword}"`);
    }
  }

  // ALL CAPS Subject Check
  if (subject === subject.toUpperCase() && subject.length > 5) {
    score -= 15;
    warnings.push('Subject line is in ALL CAPS');
  }

  // Unsubscribe link check (CAN-SPAM)
  if (!contentLower.includes('unsubscribe')) {
    score -= 25;
    warnings.push('CRITICAL: Missing required {{unsubscribe_link}} opt-out notice');
  }

  // Physical address check
  if (!contentLower.includes('address') && !contentLower.includes('suite') && !contentLower.includes('p.o. box')) {
    score -= 10;
    warnings.push('Physical postal address notice missing (CAN-SPAM required)');
  }

  let grade: SpamCheckResult['grade'] = 'EXCELLENT';
  if (score >= 90) grade = 'EXCELLENT';
  else if (score >= 75) grade = 'GOOD';
  else if (score >= 60) grade = 'NEEDS_IMPROVEMENT';
  else grade = 'CRITICAL_RISK';

  return {
    score: Math.max(0, score),
    grade,
    passed: score >= 60,
    warnings
  };
};

export const isDisposableEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? DISPOSABLE_DOMAINS.includes(domain) : false;
};
