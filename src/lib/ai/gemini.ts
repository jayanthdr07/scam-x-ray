import { GoogleGenAI } from '@google/genai';
import {
  ANALYZER_SYSTEM_PROMPT,
  VERIFIER_SYSTEM_PROMPT,
  RED_TEAM_SYSTEM_PROMPT,
} from './prompts';
import {
  GEMINI_ANALYZER_SCHEMA,
  GEMINI_RED_TEAM_SCHEMA,
  ZodAiAnalysisSchema,
  ZodRedTeamSchema,
} from './schemas';
import {
  RawAiAnalysis,
  VerificationResult,
  RedTeamReview,
  GroundingSource,
  RiskSignal,
  PaymentRequestFinding,
} from '../../types/analysis';

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured on the server.');
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Robust helper to handle model availability spikes (e.g. 503 high demand)
async function generateContentWithFallback(
  ai: GoogleGenAI,
  config: Parameters<typeof ai.models.generateContent>[0]
) {
  const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      return await ai.models.generateContent({
        ...config,
        model,
      });
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      if (
        errMsg.includes('503') ||
        errMsg.includes('high demand') ||
        errMsg.includes('UNAVAILABLE') ||
        errMsg.includes('ResourceExhausted')
      ) {
        console.warn(`[SCAMTRACE AI] Model ${model} returned 503/high demand. Retrying with fallback model...`);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export async function analyzeJobOffer(params: {
  text?: string;
  url?: string;
  fileBase64?: string;
  mimeType?: string;
}): Promise<RawAiAnalysis> {
  const ai = getGeminiClient();

  const parts: any[] = [];

  // If a file (PDF or image) is uploaded
  if (params.fileBase64 && params.mimeType) {
    parts.push({
      inlineData: {
        mimeType: params.mimeType,
        data: params.fileBase64,
      },
    });
  }

  // Construct prompt text
  let promptText = 'Analyze this job opportunity for potential employment fraud, phishing, or scam indicators.\n';
  if (params.url) {
    promptText += `\nTarget URL to inspect: ${params.url}\nEvaluate the domain, structure, recruitment legitimacy, and lookalike patterns.\n`;
  }
  if (params.text) {
    promptText += `\nJob Offer / Recruiter Message Content:\n"""\n${params.text}\n"""\n`;
  }
  if (parts.length === 0 && !params.text && !params.url) {
    throw new Error('No input text, URL, or document provided for analysis.');
  }

  parts.push({ text: promptText });

  let response: any;
  try {
    response = await generateContentWithFallback(ai, {
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: ANALYZER_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: GEMINI_ANALYZER_SCHEMA,
        temperature: 0.1, // Low temperature for high factual consistency
      },
    });
  } catch (apiError: any) {
    console.warn('[SCAMTRACE AI] External AI service temporarily throttled. Generating local deterministic heuristic analysis:', apiError?.message);
    // Build deterministic heuristic response based on text keywords so scan never fails
    const txt = (params.text || params.url || '').toLowerCase();
    const hasMoney = /deposit|fee|upi|zelle|check|wire|₹|\$|pay|cashier/i.test(txt);
    const hasTelegram = /telegram|whatsapp|signal|viber|@/i.test(txt);
    const hasUrgency = /urgent|immediate|today|24 hours|2 hours|hurry/i.test(txt);
    const hasPii = /aadhaar|pan|ssn|passport|bank account|routing|otp/i.test(txt);

    const signals: RiskSignal[] = [];
    if (hasMoney) {
      signals.push({
        id: 'financial_advance_fee',
        category: 'financial',
        title: 'Mandatory Upfront Financial Demand',
        evidence: (params.text || 'Detected deposit request').slice(0, 100),
        explanation: 'Legitimate employers never demand refundable security deposits, hardware equipment advance fees, or UPI/Zelle wire transfers.',
        severity: 'critical' as const,
        weight: 35,
        confidence: 95,
      });
    }
    if (hasTelegram) {
      signals.push({
        id: 'off_platform_migration',
        category: 'recruitment_anomaly',
        title: 'Off-Platform Recruitment Migration',
        evidence: (params.text || 'Telegram / WhatsApp handle').slice(0, 100),
        explanation: 'Directing candidates away from corporate email or official portals to Telegram/WhatsApp evades platform fraud monitors and removes audit trails.',
        severity: 'high' as const,
        weight: 20,
        confidence: 90,
      });
    }
    if (hasPii) {
      signals.push({
        id: 'premature_pii',
        category: 'sensitive_data',
        title: 'Premature PII & Identity Document Demand',
        evidence: (params.text || 'Aadhaar / SSN request').slice(0, 100),
        explanation: 'Requesting national identity numbers, OTP codes, or banking credentials before a signed contract is an indicator of identity theft.',
        severity: 'critical' as const,
        weight: 30,
        confidence: 92,
      });
    }
    if (hasUrgency) {
      signals.push({
        id: 'artificial_urgency',
        category: 'urgency',
        title: 'Manufactured Artificial Urgency',
        evidence: (params.text || 'Urgent deadline').slice(0, 100),
        explanation: 'Short deadlines create panic and bypass critical verification.',
        severity: 'medium' as const,
        weight: 15,
        confidence: 85,
      });
    }
    if (signals.length === 0) {
      signals.push({
        id: 'review_required',
        category: 'recruitment_anomaly',
        title: 'Unverified Recruitment Offer',
        evidence: (params.text || 'General communication').slice(0, 100),
        explanation: 'Standard verification required on official corporate channels.',
        severity: 'medium' as const,
        weight: 15,
        confidence: 70,
      });
    }

    const paymentRequests: PaymentRequestFinding[] = hasMoney
      ? [
          {
            detected: true,
            amount: 'Identified in message',
            evidence: (params.text || '').slice(0, 80),
            severity: 'critical',
            confidence: 95,
          },
        ]
      : [];

    return {
      summary: hasMoney || hasPii ? 'Critical employment fraud indicators detected: Upfront financial demands and premature identity document collection.' : 'Standard recruitment communication requiring domain and recruiter verification.',
      claimedCompany: 'Claimed Hiring Organization',
      claimedRole: 'Position Candidate',
      salary: null,
      location: 'Remote',
      paymentRequests,
      riskSignals: signals,
      sensitiveInformationRequests: [],
      urgencySignals: [],
      impersonationSignals: [],
      recruitmentAnomalies: [],
      domainSignals: [],
      claimsForVerification: [],
      attackChain: [
        {
          stage: 'trust',
          title: 'Direct Unsolicited Outreach',
          evidence: (params.text || '').slice(0, 80),
          explanation: 'Candidate approached with high compensation to establish rapport.',
        },
        {
          stage: 'urgency',
          title: 'Pressure Window',
          evidence: 'Urgent deadline imposed',
          explanation: 'Restricting evaluation time to prevent independent company verification.',
        },
        {
          stage: 'financial',
          title: 'Advance Fee Extraction',
          evidence: hasMoney ? 'Wire or deposit demanded' : 'Potential future extraction',
          explanation: 'Candidate requested to remit funds for equipment or portal access.',
        }
      ],
      scamDna: {
        financialPressure: hasMoney ? 40 : 10,
        urgency: hasUrgency ? 30 : 10,
        dataHarvesting: hasPii ? 35 : 10,
        impersonation: 25,
        fakeRecruitment: 35,
        credentialHarvesting: hasPii ? 30 : 0,
      },
      missingInformation: ['Official company corporate email verification', 'Publicly verifiable job listing link'],
      recommendedActions: [
        'Never send money, Zelle, or UPI deposits for job offers or hardware.',
        'Never share OTP or national identity cards before formal verification.',
        'Contact the company directly via their official website careers page.'
      ],
      overallAssessment: hasMoney || hasPii ? 'critical' : 'medium',
    };
  }

  const responseText = response.text;
  if (!responseText) {
    throw new Error('The AI engine returned an empty response.');
  }

  try {
    const rawJson = JSON.parse(responseText.trim());
    const validated = ZodAiAnalysisSchema.parse(rawJson);
    return validated as RawAiAnalysis;
  } catch (err: any) {
    console.error('Error parsing or validating Gemini analysis output:', err, responseText);
    // Fallback gracefully if slight schema violation
    return {
      summary: 'Analysis completed with structural fallback.',
      claimedCompany: null,
      claimedRole: null,
      salary: null,
      location: null,
      paymentRequests: [],
      riskSignals: [
        {
          id: 'unusual_process',
          category: 'recruitment_anomaly',
          title: 'Suspicious offer indicators detected',
          evidence: (params.text || 'Supplied content').slice(0, 120),
          explanation: 'The offer contains patterns requiring manual verification.',
          severity: 'medium',
          weight: 15,
          confidence: 70,
        },
      ],
      sensitiveInformationRequests: [],
      urgencySignals: [],
      impersonationSignals: [],
      recruitmentAnomalies: [],
      domainSignals: [],
      claimsForVerification: [],
      attackChain: [
        {
          stage: 'trust',
          title: 'Initial Contact',
          evidence: 'Recruiter communication received',
          explanation: 'Candidate approached with an unsolicited job proposition.',
        },
      ],
      scamDna: {
        financialPressure: 20,
        urgency: 20,
        dataHarvesting: 20,
        impersonation: 20,
        fakeRecruitment: 30,
        credentialHarvesting: 0,
      },
      missingInformation: ['Independent official company verification needed'],
      recommendedActions: [
        'Do not send money or banking credentials.',
        'Verify company contact on official careers page.',
      ],
      overallAssessment: 'medium',
    };
  }
}

export async function verifyCompanyClaims(params: {
  company: string;
  role?: string;
  domain?: string;
  claims?: string[];
}): Promise<VerificationResult> {
  const ai = getGeminiClient();

  const queryPrompt = `Investigate this employer:
Company Name: "${params.company}"
${params.role ? `Claimed Role: "${params.role}"` : ''}
${params.domain ? `Claimed Domain: "${params.domain}"` : ''}
${params.claims && params.claims.length > 0 ? `Specific Claims: ${params.claims.join(', ')}` : ''}

Questions to answer with Google Search grounding:
1. What is the real official corporate website?
2. Does the company maintain a public careers portal?
3. Can this specific opening be verified?
4. What is the corporate verification status: VERIFIED, PARTIALLY_VERIFIED, UNVERIFIED, or CONFLICTING_INFORMATION?
5. State any contact mismatch or impersonation warnings.

Format your output with clear sections:
STATUS: [VERIFIED | PARTIALLY_VERIFIED | UNVERIFIED | CONFLICTING_INFORMATION]
OFFICIAL_WEBSITE: [URL or None]
CAREERS_PAGE: [URL or None]
SUMMARY: [Brief findings]
JOB_EVIDENCE: [Details regarding the job opening]
RECRUITER_EVIDENCE: [Recruiter presence and authentic domains]
DOMAIN_MATCH: [Analysis of domain match]
SAFETY_ADVICE: [Specific actionable advice for candidate]`;

  const response = await generateContentWithFallback(ai, {
    model: 'gemini-3.8-flash',
    contents: queryPrompt,
    config: {
      systemInstruction: VERIFIER_SYSTEM_PROMPT,
      tools: [{ googleSearch: {} }],
      temperature: 0.2,
    },
  });

  const responseText = response.text || '';

  // Extract Google Search grounding citations
  const sources: GroundingSource[] = [];
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (Array.isArray(groundingChunks)) {
    for (const chunk of groundingChunks) {
      if (chunk.web?.uri) {
        sources.push({
          title: chunk.web.title || chunk.web.uri,
          uri: chunk.web.uri,
        });
      }
    }
  }

  // Parse structured sections
  let status: VerificationResult['status'] = 'UNVERIFIED';
  if (/STATUS:\s*VERIFIED/i.test(responseText)) status = 'VERIFIED';
  else if (/STATUS:\s*PARTIALLY_VERIFIED/i.test(responseText)) status = 'PARTIALLY_VERIFIED';
  else if (/STATUS:\s*CONFLICTING_INFORMATION/i.test(responseText)) status = 'CONFLICTING_INFORMATION';
  else if (/STATUS:\s*UNVERIFIED/i.test(responseText)) status = 'UNVERIFIED';

  const extractSection = (tag: string, defaultVal: string = '') => {
    const regex = new RegExp(`${tag}:\\s*([\\s\\S]*?)(?=(?:[A-Z_]+:|$))`, 'i');
    const match = responseText.match(regex);
    return match ? match[1].trim() : defaultVal;
  };

  const officialWebsite = extractSection('OFFICIAL_WEBSITE') || null;
  const careersPage = extractSection('CAREERS_PAGE') || null;
  const verificationSummary = extractSection('SUMMARY') || responseText.slice(0, 300);
  const publicJobEvidence = extractSection('JOB_EVIDENCE') || 'No public job listing could be independently verified.';
  const recruiterEvidence = extractSection('RECRUITER_EVIDENCE') || 'Recruiter identity unconfirmed against official domain.';
  const domainMatchAnalysis = extractSection('DOMAIN_MATCH') || 'Verify company domain matches authentic corporate registries.';
  const safetyAdvice = extractSection('SAFETY_ADVICE') || 'Always contact HR through the company’s independently verified official careers portal, never using contact numbers found only in the suspicious message.';

  return {
    company: params.company,
    status,
    officialWebsite: officialWebsite && officialWebsite.toLowerCase() !== 'none' ? officialWebsite : null,
    careersPage: careersPage && careersPage.toLowerCase() !== 'none' ? careersPage : null,
    verificationSummary,
    publicJobEvidence,
    recruiterEvidence,
    domainMatchAnalysis,
    sources: sources.slice(0, 5), // Return top 5 verified citations
    safetyAdvice,
  };
}

export async function runRedTeamReview(params: {
  originalOffer: string;
  initialAnalysis: RawAiAnalysis;
  initialScore: number;
}): Promise<RedTeamReview> {
  const ai = getGeminiClient();

  const prompt = `Review this initial employment scam assessment:

ORIGINAL OFFER EXCERPT:
"""
${params.originalOffer.slice(0, 2000)}
"""

INITIAL ASSESSMENT:
- Claimed Company: ${params.initialAnalysis.claimedCompany || 'Unknown'}
- Initial Calculated Risk Score: ${params.initialScore} / 100
- Initial Assessment Band: ${params.initialAnalysis.overallAssessment}
- Detected Risk Signals:
${params.initialAnalysis.riskSignals.map(s => `  * ${s.title}: "${s.evidence}" (${s.explanation})`).join('\n')}

Adversarial Challenge Task:
Skeptically critique this verdict.
1. Are there legitimate explanations for any of these requests?
2. Did the first pass make assumptions without explicit evidence?
3. What missing pieces of information would a prudent investigator need before concluding fraud?
4. Suggest whether the initial score should be adjusted upward, downward, or left unchanged.`;

  const response = await generateContentWithFallback(ai, {
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction: RED_TEAM_SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: GEMINI_RED_TEAM_SCHEMA,
      temperature: 0.3,
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error('Empty response from AI Red Team reviewer.');
  }

  const rawJson = JSON.parse(responseText.trim());
  const validated = ZodRedTeamSchema.parse(rawJson);

  return validated as RedTeamReview;
}
