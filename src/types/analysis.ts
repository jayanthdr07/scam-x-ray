export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';

export type RiskCategory =
  | 'financial'
  | 'sensitive_data'
  | 'urgency'
  | 'impersonation'
  | 'recruitment_anomaly'
  | 'domain_url'
  | 'credential_harvesting'
  | 'compensation';

export interface PaymentRequestFinding {
  detected: boolean;
  amount: string | null;
  evidence: string;
  severity: RiskSeverity;
  confidence: number; // 0 - 100
}

export interface RiskSignal {
  id: string;
  category: RiskCategory;
  title: string;
  evidence: string;
  explanation: string;
  severity: RiskSeverity;
  weight: number;
  confidence: number;
}

export interface AttackChainStep {
  stage: 'trust' | 'urgency' | 'financial' | 'data' | 'credential' | 'isolation' | 'other';
  title: string;
  evidence: string;
  explanation: string;
}

export interface TimelineEvent {
  id: string;
  stage: 'trust' | 'urgency' | 'financial' | 'data' | 'credential' | 'isolation' | 'extortion' | 'other';
  title: string;
  timeframe: string;
  relativeHours: number;
  timeLabel: string;
  isObserved: boolean;
  evidence?: string;
  explanation: string;
  adversaryTactic: string;
  psychologicalLever: string;
  potentialVictimImpact: string;
  killChainAction: string;
  consequenceIfIgnored: string;
  severity: RiskSeverity;
}

export interface ScamDnaProfile {
  financialPressure: number; // 0-100
  urgency: number;           // 0-100
  dataHarvesting: number;     // 0-100
  impersonation: number;      // 0-100
  fakeRecruitment: number;    // 0-100
  credentialHarvesting: number; // 0-100
}

export interface ClaimForVerification {
  claimType: 'company_existence' | 'job_opening' | 'recruiter_identity' | 'domain_match';
  claimText: string;
  importance: 'high' | 'medium' | 'low';
}

export interface RawAiAnalysis {
  summary: string;
  claimedCompany: string | null;
  claimedRole: string | null;
  salary: string | null;
  location: string | null;
  paymentRequests: PaymentRequestFinding[];
  riskSignals: RiskSignal[];
  sensitiveInformationRequests: {
    item: string;
    evidence: string;
    severity: RiskSeverity;
  }[];
  urgencySignals: {
    deadline: string;
    evidence: string;
  }[];
  impersonationSignals: {
    targetCompany: string;
    evidence: string;
  }[];
  recruitmentAnomalies: {
    anomaly: string;
    evidence: string;
  }[];
  domainSignals: {
    domain: string;
    finding: string;
    suspicious: boolean;
  }[];
  claimsForVerification: ClaimForVerification[];
  attackChain: AttackChainStep[];
  scamDna: ScamDnaProfile;
  missingInformation: string[];
  recommendedActions: string[];
  overallAssessment: RiskSeverity;
}

export type RiskBand = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface ThreatIndexResult {
  score: number; // 0 - 100
  band: RiskBand;
  confidence: number; // 0 - 100
  evidenceQuality: 'HIGH' | 'MEDIUM' | 'LOW';
  activeSignalCount: number;
  totalPossibleWeight: number;
  factorContributions: {
    id: string;
    title: string;
    category: string;
    weight: number;
    evidence: string;
  }[];
}

export type VerificationStatus = 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'UNVERIFIED' | 'CONFLICTING_INFORMATION';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface VerificationResult {
  company: string;
  status: VerificationStatus;
  officialWebsite: string | null;
  careersPage: string | null;
  verificationSummary: string;
  publicJobEvidence: string;
  recruiterEvidence: string;
  domainMatchAnalysis: string;
  sources: GroundingSource[];
  safetyAdvice: string;
}

export interface RedTeamReview {
  initialScore: number;
  reviewedScore: number;
  supportingEvidence: string[];
  counterEvidence: string[];
  missingInformation: string[];
  potentialFalsePositives: string[];
  skepticalCritique: string;
  confidence: number; // 0 - 100
  verdictAdjustment: 'upward' | 'downward' | 'unchanged';
}

export interface FullInvestigation {
  id: string;
  timestamp: string;
  inputMode: 'text' | 'url' | 'pdf' | 'image';
  originalInput: string;
  fileName?: string;
  analysis: RawAiAnalysis;
  threatIndex: ThreatIndexResult;
  verification?: VerificationResult;
  redTeam?: RedTeamReview;
}

export type InvestigationSession = FullInvestigation;
