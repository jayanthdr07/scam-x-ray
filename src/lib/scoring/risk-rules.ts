import { RiskCategory, RiskSeverity } from '../../types/analysis';

export interface BaseRiskRule {
  id: string;
  category: RiskCategory;
  name: string;
  defaultWeight: number;
  severity: RiskSeverity;
  description: string;
}

export const RISK_RULES: Record<string, BaseRiskRule> = {
  payment_request: {
    id: 'payment_request',
    category: 'financial',
    name: 'Payment / Security Deposit Request',
    defaultWeight: 25,
    severity: 'critical',
    description: 'Solicits money, security deposit, registration fee, or equipment purchase before employment.'
  },
  credential_otp: {
    id: 'credential_otp',
    category: 'credential_harvesting',
    name: 'Credential or OTP Request',
    defaultWeight: 25,
    severity: 'critical',
    description: 'Requests one-time passwords, online banking credentials, or private account authorizations.'
  },
  financial_info: {
    id: 'financial_info',
    category: 'financial',
    name: 'Sensitive Financial Information Request',
    defaultWeight: 20,
    severity: 'high',
    description: 'Requests direct bank account details, UPI PIN, card numbers, or online payment mandates prematurely.'
  },
  identity_document: {
    id: 'identity_document',
    category: 'sensitive_data',
    name: 'Identity Document Harvesting',
    defaultWeight: 15,
    severity: 'high',
    description: 'Demands scans of national ID (Aadhaar, PAN, SSN, Passport) prior to legitimate formal hiring stages.'
  },
  urgency_pressure: {
    id: 'urgency_pressure',
    category: 'urgency',
    name: 'Urgency & Pressure Tactics',
    defaultWeight: 15,
    severity: 'high',
    description: 'Imposes extreme artificial deadlines (e.g. "within 2 hours") to impede independent verification.'
  },
  impersonation: {
    id: 'impersonation',
    category: 'impersonation',
    name: 'Company or Recruiter Impersonation',
    defaultWeight: 15,
    severity: 'high',
    description: 'Claims to represent a recognized brand while using unverified channels, free mailboxes, or mismatched details.'
  },
  job_company_mismatch: {
    id: 'job_company_mismatch',
    category: 'recruitment_anomaly',
    name: 'Entity or Communication Mismatch',
    defaultWeight: 15,
    severity: 'high',
    description: 'Severe discrepancy between claimed company, sender identity, and official corporate channels.'
  },
  unrealistic_compensation: {
    id: 'unrealistic_compensation',
    category: 'compensation',
    name: 'Unrealistic Compensation / Effort Ratio',
    defaultWeight: 10,
    severity: 'medium',
    description: 'Promises disproportionately high salaries or daily returns for minimal work or unspecified duties.'
  },
  no_interview: {
    id: 'no_interview',
    category: 'recruitment_anomaly',
    name: 'No Meaningful Interview / Instant Offer',
    defaultWeight: 10,
    severity: 'medium',
    description: 'Extends a formal hiring contract without formal interviews, technical evaluation, or verification.'
  },
  suspicious_domain: {
    id: 'suspicious_domain',
    category: 'domain_url',
    name: 'Suspicious Domain or Channel',
    defaultWeight: 10,
    severity: 'medium',
    description: 'Uses unofficial domains (Gmail/Hotmail, lookalike domains, or informal messaging apps like Telegram/WhatsApp).'
  },
  unusual_process: {
    id: 'unusual_process',
    category: 'recruitment_anomaly',
    name: 'Unusual Recruitment Workflow',
    defaultWeight: 10,
    severity: 'medium',
    description: 'Deviates from standard corporate protocols (demanding secrecy, non-standard application forms, odd payment steps).'
  },
  suspicious_url: {
    id: 'suspicious_url',
    category: 'domain_url',
    name: 'Suspicious Job Application URL',
    defaultWeight: 10,
    severity: 'medium',
    description: 'Links point to phishing pages, URL shorteners, or deceptive registration gateways.'
  }
};
