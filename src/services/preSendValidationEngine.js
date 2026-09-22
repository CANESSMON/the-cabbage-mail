/**
 * Pre-Send Pre-Flight Inspection Engine
 * Inspects subscriber list health, detects spam trigger words, and enforces CAN-SPAM compliance.
 */

// List of disposable/temporary email provider domains
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
  'trashmail.com',
  'getnada.com',
  'throwawaymail.com',
  'yopmail.com',
  'temp-mail.org',
  'dispostable.com',
]);

// List of common role account prefixes
const ROLE_PREFIXES = new Set([
  'admin',
  'administrator',
  'info',
  'support',
  'sales',
  'contact',
  'marketing',
  'help',
  'billing',
  'office',
]);

// Spam trigger phrase database with risk weights
const SPAM_TRIGGERS = [
  { phrase: '100% free', weight: 15 },
  { phrase: 'make money fast', weight: 25 },
  { phrase: 'act now', weight: 10 },
  { phrase: 'no cost', weight: 12 },
  { phrase: 'guaranteed', weight: 10 },
  { phrase: 'risk free', weight: 12 },
  { phrase: 'earn extra cash', weight: 20 },
  { phrase: 'click here', weight: 8 },
  { phrase: 'winner', weight: 15 },
  { phrase: 'urgent', weight: 8 },
];

export const scanSubscriberListHygiene = (subscribers = []) => {
  let validCount = 0;
  let disposableCount = 0;
  let roleCount = 0;
  const cleanedSubscribers = [];
  const warnings = [];

  subscribers.forEach((sub) => {
    const email = (sub.email || '').toLowerCase().trim();
    const parts = email.split('@');
    if (parts.length !== 2) return;

    const username = parts[0];
    const domain = parts[1];

    if (DISPOSABLE_DOMAINS.has(domain)) {
      disposableCount++;
      warnings.push(`Rejected disposable address: ${email}`);
    } else if (ROLE_PREFIXES.has(username)) {
      roleCount++;
      // Keep role accounts but count as warning
      cleanedSubscribers.push(sub);
      validCount++;
    } else {
      validCount++;
      cleanedSubscribers.push(sub);
    }
  });

  return {
    totalInput: subscribers.length,
    validCount,
    disposableCount,
    roleCount,
    cleanedSubscribers,
    warnings,
  };
};

export const analyzeContentSpamScore = (subject = '', htmlBody = '', clientPhysicalAddress = '') => {
  let spamScore = 0; // Starts at 0 (Best)
  const triggersFound = [];
  const complianceErrors = [];

  const fullText = `${subject} ${htmlBody}`.toLowerCase();

  // Check subject line ALL CAPS
  if (subject.length > 5 && subject === subject.toUpperCase() && /[A-Z]/.test(subject)) {
    spamScore += 20;
    triggersFound.push('Subject line is in ALL CAPS');
  }

  // Check excessive exclamation marks
  const exclamationCount = (subject.match(/!/g) || []).length;
  if (exclamationCount > 2) {
    spamScore += 10;
    triggersFound.push(`Excessive exclamation marks in subject (${exclamationCount})`);
  }

  // Check spam trigger phrases
  SPAM_TRIGGERS.forEach((item) => {
    if (fullText.includes(item.phrase)) {
      spamScore += item.weight;
      triggersFound.push(`Contains spam keyword: "${item.phrase}"`);
    }
  });

  // Check CAN-SPAM mandatory Unsubscribe Link
  const hasUnsubscribeTag = htmlBody.includes('{{unsubscribe_link}}') || htmlBody.toLowerCase().includes('unsubscribe');
  if (!hasUnsubscribeTag) {
    complianceErrors.push('Missing mandatory Unsubscribe link or {{unsubscribe_link}} tag.');
  }

  // Calculate deliverability risk rating
  let rating = 'EXCELLENT';
  let badgeColor = 'emerald';

  if (spamScore >= 40 || complianceErrors.length > 0) {
    rating = 'HIGH RISK (BLOCKED)';
    badgeColor = 'rose';
  } else if (spamScore >= 20) {
    rating = 'MODERATE RISK';
    badgeColor = 'amber';
  }

  return {
    spamScore: Math.min(spamScore, 100),
    rating,
    badgeColor,
    triggersFound,
    complianceErrors,
    canDispatch: complianceErrors.length === 0 && spamScore < 40,
  };
};
