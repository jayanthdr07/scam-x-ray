import { Type } from '@google/genai';
import { z } from 'zod';

// Gemini SDK Response Schema for the Primary Analyzer
export const GEMINI_ANALYZER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: 'One-sentence objective summary of the analysis findings',
    },
    claimedCompany: {
      type: Type.STRING,
      description: 'The name of the company or employer claimed in the offer, or null if unknown',
    },
    claimedRole: {
      type: Type.STRING,
      description: 'The job title or role offered, or null if unspecified',
    },
    salary: {
      type: Type.STRING,
      description: 'The claimed compensation or salary mentioned, or null',
    },
    location: {
      type: Type.STRING,
      description: 'Claimed job location or work-from-home status',
    },
    paymentRequests: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          detected: { type: Type.BOOLEAN },
          amount: { type: Type.STRING },
          evidence: { type: Type.STRING },
          severity: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
        },
        required: ['detected', 'evidence', 'severity', 'confidence'],
      },
    },
    riskSignals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: 'Identifier like payment_request, credential_otp, etc.' },
          category: { type: Type.STRING, description: 'financial, sensitive_data, urgency, impersonation, recruitment_anomaly, domain_url, credential_harvesting, compensation' },
          title: { type: Type.STRING },
          evidence: { type: Type.STRING },
          explanation: { type: Type.STRING },
          severity: { type: Type.STRING, description: 'low, medium, high, critical' },
          weight: { type: Type.NUMBER, description: 'suggested contribution weight 5 to 25' },
          confidence: { type: Type.NUMBER },
        },
        required: ['id', 'category', 'title', 'evidence', 'explanation', 'severity', 'weight', 'confidence'],
      },
    },
    sensitiveInformationRequests: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          evidence: { type: Type.STRING },
          severity: { type: Type.STRING },
        },
        required: ['item', 'evidence', 'severity'],
      },
    },
    urgencySignals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          deadline: { type: Type.STRING },
          evidence: { type: Type.STRING },
        },
        required: ['deadline', 'evidence'],
      },
    },
    impersonationSignals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          targetCompany: { type: Type.STRING },
          evidence: { type: Type.STRING },
        },
        required: ['targetCompany', 'evidence'],
      },
    },
    recruitmentAnomalies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          anomaly: { type: Type.STRING },
          evidence: { type: Type.STRING },
        },
        required: ['anomaly', 'evidence'],
      },
    },
    domainSignals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          domain: { type: Type.STRING },
          finding: { type: Type.STRING },
          suspicious: { type: Type.BOOLEAN },
        },
        required: ['domain', 'finding', 'suspicious'],
      },
    },
    claimsForVerification: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          claimType: { type: Type.STRING },
          claimText: { type: Type.STRING },
          importance: { type: Type.STRING },
        },
        required: ['claimType', 'claimText', 'importance'],
      },
    },
    attackChain: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stage: { type: Type.STRING, description: 'trust, urgency, financial, data, credential, or other' },
          title: { type: Type.STRING },
          evidence: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ['stage', 'title', 'evidence', 'explanation'],
      },
    },
    scamDna: {
      type: Type.OBJECT,
      properties: {
        financialPressure: { type: Type.NUMBER, description: '0 to 100' },
        urgency: { type: Type.NUMBER, description: '0 to 100' },
        dataHarvesting: { type: Type.NUMBER, description: '0 to 100' },
        impersonation: { type: Type.NUMBER, description: '0 to 100' },
        fakeRecruitment: { type: Type.NUMBER, description: '0 to 100' },
        credentialHarvesting: { type: Type.NUMBER, description: '0 to 100' },
      },
      required: [
        'financialPressure',
        'urgency',
        'dataHarvesting',
        'impersonation',
        'fakeRecruitment',
        'credentialHarvesting',
      ],
    },
    missingInformation: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    recommendedActions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    overallAssessment: {
      type: Type.STRING,
      description: 'low, medium, high, or critical',
    },
  },
  required: [
    'summary',
    'paymentRequests',
    'riskSignals',
    'sensitiveInformationRequests',
    'urgencySignals',
    'impersonationSignals',
    'recruitmentAnomalies',
    'domainSignals',
    'claimsForVerification',
    'attackChain',
    'scamDna',
    'missingInformation',
    'recommendedActions',
    'overallAssessment',
  ],
};

// Gemini Red Team Schema
export const GEMINI_RED_TEAM_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    initialScore: { type: Type.NUMBER },
    reviewedScore: { type: Type.NUMBER, description: 'Skeptical re-evaluated score between 0 and 100' },
    supportingEvidence: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Evidence supporting the fraud risk',
    },
    counterEvidence: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Legitimate hiring nuances or reasons this could be benign',
    },
    missingInformation: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    potentialFalsePositives: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    skepticalCritique: {
      type: Type.STRING,
      description: 'Detailed skeptical breakdown questioning the first assessment',
    },
    confidence: { type: Type.NUMBER },
    verdictAdjustment: {
      type: Type.STRING,
      description: 'upward, downward, or unchanged',
    },
  },
  required: [
    'initialScore',
    'reviewedScore',
    'supportingEvidence',
    'counterEvidence',
    'missingInformation',
    'potentialFalsePositives',
    'skepticalCritique',
    'confidence',
    'verdictAdjustment',
  ],
};

// Zod Validation Schemas for Runtime Safety
export const ZodAiAnalysisSchema = z.object({
  summary: z.string().default(''),
  claimedCompany: z.string().nullable().optional(),
  claimedRole: z.string().nullable().optional(),
  salary: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  paymentRequests: z.array(z.object({
    detected: z.boolean(),
    amount: z.string().nullable().optional(),
    evidence: z.string().default(''),
    severity: z.enum(['low', 'medium', 'high', 'critical']).catch('medium'),
    confidence: z.number().default(50),
  })).default([]),
  riskSignals: z.array(z.object({
    id: z.string(),
    category: z.enum(['financial', 'sensitive_data', 'urgency', 'impersonation', 'recruitment_anomaly', 'domain_url', 'credential_harvesting', 'compensation']).catch('recruitment_anomaly'),
    title: z.string(),
    evidence: z.string(),
    explanation: z.string(),
    severity: z.enum(['low', 'medium', 'high', 'critical']).catch('medium'),
    weight: z.number().default(10),
    confidence: z.number().default(50),
  })).default([]),
  sensitiveInformationRequests: z.array(z.object({
    item: z.string(),
    evidence: z.string(),
    severity: z.enum(['low', 'medium', 'high', 'critical']).catch('medium'),
  })).default([]),
  urgencySignals: z.array(z.object({
    deadline: z.string(),
    evidence: z.string(),
  })).default([]),
  impersonationSignals: z.array(z.object({
    targetCompany: z.string(),
    evidence: z.string(),
  })).default([]),
  recruitmentAnomalies: z.array(z.object({
    anomaly: z.string(),
    evidence: z.string(),
  })).default([]),
  domainSignals: z.array(z.object({
    domain: z.string(),
    finding: z.string(),
    suspicious: z.boolean(),
  })).default([]),
  claimsForVerification: z.array(z.object({
    claimType: z.enum(['company_existence', 'job_opening', 'recruiter_identity', 'domain_match']).catch('company_existence'),
    claimText: z.string(),
    importance: z.enum(['high', 'medium', 'low']).catch('medium'),
  })).default([]),
  attackChain: z.array(z.object({
    stage: z.enum(['trust', 'urgency', 'financial', 'data', 'credential', 'isolation', 'other']).catch('other'),
    title: z.string(),
    evidence: z.string(),
    explanation: z.string(),
  })).default([]),
  scamDna: z.object({
    financialPressure: z.number().default(0),
    urgency: z.number().default(0),
    dataHarvesting: z.number().default(0),
    impersonation: z.number().default(0),
    fakeRecruitment: z.number().default(0),
    credentialHarvesting: z.number().default(0),
  }).default({
    financialPressure: 0,
    urgency: 0,
    dataHarvesting: 0,
    impersonation: 0,
    fakeRecruitment: 0,
    credentialHarvesting: 0,
  }),
  missingInformation: z.array(z.string()).default([]),
  recommendedActions: z.array(z.string()).default([]),
  overallAssessment: z.enum(['low', 'medium', 'high', 'critical']).catch('medium'),
});

export const ZodRedTeamSchema = z.object({
  initialScore: z.number(),
  reviewedScore: z.number(),
  supportingEvidence: z.array(z.string()).default([]),
  counterEvidence: z.array(z.string()).default([]),
  missingInformation: z.array(z.string()).default([]),
  potentialFalsePositives: z.array(z.string()).default([]),
  skepticalCritique: z.string(),
  confidence: z.number().default(75),
  verdictAdjustment: z.enum(['upward', 'downward', 'unchanged']).catch('unchanged'),
});
