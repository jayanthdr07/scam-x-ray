/**
 * Privacy & Security Redaction Helpers
 * Sanitizes sensitive personally identifiable information (PII) before logging or caching.
 */

export function redactSensitiveData(text: string): string {
  if (!text) return '';

  return text
    // Redact 12-digit Aadhaar / National ID numbers (e.g. 1234 5678 9012 or 123456789012)
    .replace(/\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/g, '[REDACTED_NATIONAL_ID]')
    // Redact Indian PAN numbers (5 letters, 4 digits, 1 letter)
    .replace(/\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi, '[REDACTED_TAX_ID]')
    // Redact US SSN (3-2-4 digits)
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_SSN]')
    // Redact 16-digit Credit/Debit card numbers
    .replace(/\b(?:\d{4}[ -]?){3}\d{4}\b/g, '[REDACTED_CARD_NUMBER]')
    // Redact Bank account numbers (9-18 digits)
    .replace(/(account\s*(?:no|num|number)?\s*[:=]?\s*)\d{8,18}/gi, '$1[REDACTED_ACCOUNT]')
    // Redact OTPs (4-6 digits with context)
    .replace(/(otp|code|pin|one[- ]time[- ]password)\s*[:=]?\s*(\d{4,8})/gi, '$1: [REDACTED_OTP]')
    // Redact Passwords
    .replace(/(password|secret|passcode)\s*[:=]?\s*\S+/gi, '$1: [REDACTED_SECRET]');
}

export function containsHighlySensitiveData(text: string): boolean {
  if (!text) return false;
  const piiPatterns = [
    /\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/,
    /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/i,
    /\b\d{3}-\d{2}-\d{4}\b/,
    /(otp|code|pin)\s*[:=]?\s*\d{4,8}/i,
    /(password)\s*[:=]?\s*\S+/i,
  ];
  return piiPatterns.some(pattern => pattern.test(text));
}
