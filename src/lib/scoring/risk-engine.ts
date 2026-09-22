import { RawAiAnalysis, ThreatIndexResult, RiskBand } from '../../types/analysis';
import { RISK_RULES } from './risk-rules';

export function calculateThreatIndex(
  analysis: RawAiAnalysis,
  activeFactorIds?: string[]
): ThreatIndexResult {
  const factorContributions: ThreatIndexResult['factorContributions'] = [];
  const matchedRuleIds = new Set<string>();

  // Map AI risk signals to deterministic rules
  for (const signal of analysis.riskSignals || []) {
    let ruleKey = signal.id;
    if (!RISK_RULES[ruleKey]) {
      // Fuzzy map category / title
      const normalizedTitle = (signal.title + ' ' + signal.category).toLowerCase();
      if (normalizedTitle.includes('payment') || normalizedTitle.includes('deposit') || normalizedTitle.includes('fee')) {
        ruleKey = 'payment_request';
      } else if (normalizedTitle.includes('otp') || normalizedTitle.includes('password') || normalizedTitle.includes('credential')) {
        ruleKey = 'credential_otp';
      } else if (normalizedTitle.includes('bank') || normalizedTitle.includes('upi') || normalizedTitle.includes('account number')) {
        ruleKey = 'financial_info';
      } else if (normalizedTitle.includes('aadhaar') || normalizedTitle.includes('pan') || normalizedTitle.includes('passport') || normalizedTitle.includes('identity')) {
        ruleKey = 'identity_document';
      } else if (normalizedTitle.includes('urgent') || normalizedTitle.includes('deadline') || normalizedTitle.includes('expire')) {
        ruleKey = 'urgency_pressure';
      } else if (normalizedTitle.includes('impersonat') || normalizedTitle.includes('fake hr')) {
        ruleKey = 'impersonation';
      } else if (normalizedTitle.includes('salary') || normalizedTitle.includes('compensation') || normalizedTitle.includes('too good')) {
        ruleKey = 'unrealistic_compensation';
      } else if (normalizedTitle.includes('interview') || normalizedTitle.includes('instant offer')) {
        ruleKey = 'no_interview';
      } else if (normalizedTitle.includes('domain') || normalizedTitle.includes('telegram') || normalizedTitle.includes('whatsapp')) {
        ruleKey = 'suspicious_domain';
      } else if (normalizedTitle.includes('url') || normalizedTitle.includes('link')) {
        ruleKey = 'suspicious_url';
      } else {
        ruleKey = 'unusual_process';
      }
    }

    // Prevent duplicate rule addition
    if (!matchedRuleIds.has(ruleKey)) {
      matchedRuleIds.add(ruleKey);
      const rule = RISK_RULES[ruleKey] || {
        id: ruleKey,
        name: signal.title,
        defaultWeight: Math.min(25, Math.max(5, signal.weight || 10)),
        category: signal.category,
      };

      factorContributions.push({
        id: rule.id,
        title: rule.name,
        category: rule.category,
        weight: rule.defaultWeight,
        evidence: signal.evidence || 'Observed in job offer context',
      });
    }
  }

  // Backup check: if paymentRequests detected but not in signals
  if (analysis.paymentRequests?.some(p => p.detected) && !matchedRuleIds.has('payment_request')) {
    matchedRuleIds.add('payment_request');
    const pay = analysis.paymentRequests.find(p => p.detected);
    factorContributions.push({
      id: 'payment_request',
      title: RISK_RULES.payment_request.name,
      category: 'financial',
      weight: RISK_RULES.payment_request.defaultWeight,
      evidence: pay?.evidence || 'Payment requested in offer',
    });
  }

  // Check sensitiveInformationRequests
  if (analysis.sensitiveInformationRequests?.length > 0) {
    const hasFinancial = analysis.sensitiveInformationRequests.some(s =>
      /bank|account|upi|card|deposit/i.test(s.item + ' ' + s.evidence)
    );
    const hasGovId = analysis.sensitiveInformationRequests.some(s =>
      /aadhaar|pan|ssn|passport|id|identity/i.test(s.item + ' ' + s.evidence)
    );

    if (hasFinancial && !matchedRuleIds.has('financial_info')) {
      matchedRuleIds.add('financial_info');
      const item = analysis.sensitiveInformationRequests.find(s => /bank|account|upi|card/i.test(s.item));
      factorContributions.push({
        id: 'financial_info',
        title: RISK_RULES.financial_info.name,
        category: 'financial',
        weight: RISK_RULES.financial_info.defaultWeight,
        evidence: item?.evidence || 'Bank/financial details requested',
      });
    }

    if (hasGovId && !matchedRuleIds.has('identity_document')) {
      matchedRuleIds.add('identity_document');
      const item = analysis.sensitiveInformationRequests.find(s => /aadhaar|pan|ssn|passport|id/i.test(s.item));
      factorContributions.push({
        id: 'identity_document',
        title: RISK_RULES.identity_document.name,
        category: 'sensitive_data',
        weight: RISK_RULES.identity_document.defaultWeight,
        evidence: item?.evidence || 'National identity documents requested',
      });
    }
  }

  // Check urgency signals
  if (analysis.urgencySignals?.length > 0 && !matchedRuleIds.has('urgency_pressure')) {
    matchedRuleIds.add('urgency_pressure');
    factorContributions.push({
      id: 'urgency_pressure',
      title: RISK_RULES.urgency_pressure.name,
      category: 'urgency',
      weight: RISK_RULES.urgency_pressure.defaultWeight,
      evidence: analysis.urgencySignals[0].evidence || `Deadline: ${analysis.urgencySignals[0].deadline}`,
    });
  }

  // Check impersonation signals
  if (analysis.impersonationSignals?.length > 0 && !matchedRuleIds.has('impersonation')) {
    matchedRuleIds.add('impersonation');
    factorContributions.push({
      id: 'impersonation',
      title: RISK_RULES.impersonation.name,
      category: 'impersonation',
      weight: RISK_RULES.impersonation.defaultWeight,
      evidence: analysis.impersonationSignals[0].evidence || `Claimed: ${analysis.impersonationSignals[0].targetCompany}`,
    });
  }

  // Filter if activeFactorIds is supplied (Risk Simulator feature)
  const activeFactors = activeFactorIds
    ? factorContributions.filter(f => activeFactorIds.includes(f.id))
    : factorContributions;

  // Controlled scoring algorithm:
  // Direct sum of weights with non-linear saturation to prevent over 100
  let rawScore = activeFactors.reduce((sum, factor) => sum + factor.weight, 0);

  // Synergy bonus: If BOTH payment request AND urgency exist, fraudsters combine them for social engineering.
  // Add +5 synergy, but ensure total is strictly capped at 100.
  const hasPayment = activeFactors.some(f => f.id === 'payment_request');
  const hasUrgency = activeFactors.some(f => f.id === 'urgency_pressure');
  const hasData = activeFactors.some(f => f.id === 'identity_document' || f.id === 'financial_info' || f.id === 'credential_otp');

  if (hasPayment && hasUrgency) {
    rawScore += 5;
  }
  if (hasPayment && hasData) {
    rawScore += 5;
  }

  // Clamp score strictly to 0 - 100
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  // Risk bands
  let band: RiskBand = 'LOW';
  if (score >= 75) {
    band = 'CRITICAL';
  } else if (score >= 50) {
    band = 'HIGH';
  } else if (score >= 25) {
    band = 'MODERATE';
  } else {
    band = 'LOW';
  }

  // Evidence quality assessment
  let evidenceQuality: ThreatIndexResult['evidenceQuality'] = 'LOW';
  const hasSpecificEvidence = activeFactors.some(f => f.evidence && f.evidence.length > 10);
  if (activeFactors.length >= 3 && hasSpecificEvidence) {
    evidenceQuality = 'HIGH';
  } else if (activeFactors.length >= 1 && hasSpecificEvidence) {
    evidenceQuality = 'MEDIUM';
  }

  // Confidence calculation based on evidence depth and consistency
  let baseConfidence = 60;
  if (evidenceQuality === 'HIGH') baseConfidence = 88;
  else if (evidenceQuality === 'MEDIUM') baseConfidence = 76;
  if (analysis.summary && analysis.summary.length > 50) baseConfidence += 4;
  if (score === 0) baseConfidence = 70; // Cautious confidence when no evidence detected
  const confidence = Math.min(96, Math.max(50, baseConfidence));

  return {
    score,
    band,
    confidence,
    evidenceQuality,
    activeSignalCount: activeFactors.length,
    totalPossibleWeight: 100,
    factorContributions: activeFactors,
  };
}
