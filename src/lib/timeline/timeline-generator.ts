import { AttackChainStep, RawAiAnalysis, TimelineEvent, RiskSeverity } from '../../types/analysis';

/**
 * Builds an interactive chronological timeline plotting detected attack chain events
 * alongside realistic threat escalation models.
 */
export function buildScamTimeline(
  steps: AttackChainStep[] = [],
  rawAnalysis?: RawAiAnalysis
): {
  events: TimelineEvent[];
  currentEventIndex: number;
  interventionIndex: number;
} {
  // Extract specific signals if available
  const signals = rawAnalysis?.riskSignals || [];
  const paymentFinding = rawAnalysis?.paymentRequests?.find((p) => p.detected);
  const urgencyFinding = rawAnalysis?.urgencySignals?.[0];
  const piiFinding = rawAnalysis?.sensitiveInformationRequests?.[0];
  const impersonationFinding = rawAnalysis?.impersonationSignals?.[0];

  // Helper to find matching step from attackChain
  const findStep = (keys: string[]) => {
    return steps.find((s) =>
      keys.some(
        (k) =>
          s.stage?.toLowerCase() === k.toLowerCase() ||
          s.title?.toLowerCase().includes(k.toLowerCase()) ||
          s.explanation?.toLowerCase().includes(k.toLowerCase())
      )
    );
  };

  const trustStep = findStep(['trust', 'rapport', 'outreach', 'hook', 'selection', 'congratulations']);
  const urgencyStep = findStep(['urgency', 'pressure', 'deadline', 'immediate', 'time']);
  const financialStep = findStep(['financial', 'money', 'payment', 'deposit', 'fee', 'charge']);
  const dataStep = findStep(['data', 'pii', 'identity', 'aadhaar', 'ssn', 'bank', 'document']);
  const credentialStep = findStep(['credential', 'otp', 'password', 'login', 'account']);

  // Canonical chronological progression of modern employment fraud
  const timelineBlueprint: Array<{
    id: string;
    stage: TimelineEvent['stage'];
    title: string;
    timeframe: string;
    timeLabel: string;
    relativeHours: number;
    severity: RiskSeverity;
    matchedStep?: AttackChainStep;
    evidenceFallback?: string;
    adversaryTactic: string;
    psychologicalLever: string;
    potentialVictimImpact: string;
    killChainAction: string;
    consequenceIfIgnored: string;
    preventionTips: string[];
  }> = [
    {
      id: 'timeline-initial-hook',
      stage: 'trust',
      title: 'Initial Outreach & Social Hook',
      timeframe: 'Hour 0 · Day 1',
      timeLabel: 'T+0h',
      relativeHours: 0,
      severity: 'low',
      matchedStep: trustStep,
      evidenceFallback: impersonationFinding
        ? `Claiming affiliation with ${impersonationFinding.targetCompany}`
        : 'Direct unsolicited outreach via WhatsApp/Telegram/LinkedIn',
      adversaryTactic: 'Presents an unsolicited prestigious role or attractive remote work offer to establish immediate rapport and curiosity.',
      psychologicalLever: 'Reciprocity & Halo Effect (capitalizing on reputable brand recognition and flattering the applicant).',
      potentialVictimImpact: 'Zero financial loss, but victim engages in conversation, signaling an active target.',
      killChainAction: 'Verify recruiter profile and match sending domain against the authentic corporate careers directory.',
      consequenceIfIgnored: 'Target gets drawn deeper into unverified communication channels without audit trails.',
      preventionTips: [
        'Verify sender email domain: Authentic corporate recruiters contact you from verified company domains (e.g. @company.com), never free webmail accounts (@gmail.com, @outlook.com).',
        'Cross-reference official careers directory: Search for the exact job title and requisition ID directly on the company’s authenticated careers portal before replying.',
        'Beware unsolicited messaging app outreach: Legitimate employers rarely initiate professional hiring communications over Telegram, WhatsApp, or Signal.',
        'Check recruiter’s LinkedIn presence: Confirm their profile has authentic connection history and is linked to the company’s verified corporate organization page.',
      ],
    },
    {
      id: 'timeline-rapid-selection',
      stage: 'trust',
      title: 'Accelerated Fake Selection',
      timeframe: 'Hour 2–4 · Day 1',
      timeLabel: 'T+2h',
      relativeHours: 2,
      severity: 'medium',
      matchedStep: steps.find((s) => s.title?.toLowerCase().includes('select') || s.title?.toLowerCase().includes('interview') || s.title?.toLowerCase().includes('offer')),
      evidenceFallback: 'Immediate hiring decision with superficial or zero formal technical interviews.',
      adversaryTactic: 'Eliminates traditional vetting rounds (no live panel, no coding exercise, questionnaire-only) to minimize friction.',
      psychologicalLever: 'Euphoria & Relief (bypassing critical skepticism by offering fast validation and exceptional pay).',
      potentialVictimImpact: 'Victim begins believing the opportunity is authentic and lowers psychological defenses.',
      killChainAction: 'Request a live video interview with hiring managers using their verifiable @company.com email.',
      consequenceIfIgnored: 'Victim accepts an invalid agreement and prepares to comply with subsequent administrative requests.',
      preventionTips: [
        'Demand synchronous video or panel evaluation: Legitimate salaried positions always require face-to-face video or in-person technical interviews.',
        'Reject text/questionnaire-only interviews: Receiving an immediate job offer based solely on a Google Form or Telegram chat is a primary scam indicator.',
        'Inspect offer letter formatting: Look for misaligned logos, missing corporate registration numbers (CIN/EIN), and generic template phrasing.',
        'Assess compensation realism: Drastically inflated compensation for minimal entry-level duties is intended to disable critical skepticism.',
      ],
    },
    {
      id: 'timeline-urgency-coercion',
      stage: 'urgency',
      title: 'Manufactured Velocity & Deadline Pressure',
      timeframe: 'Hour 24 · Day 2',
      timeLabel: 'T+24h',
      relativeHours: 24,
      severity: 'high',
      matchedStep: urgencyStep,
      evidenceFallback: urgencyFinding ? `Deadline: ${urgencyFinding.deadline}` : 'Strict deadline (e.g. 24–48 hours) to sign or pay.',
      adversaryTactic: 'Imposes short deadlines, threatening forfeiture of the slot or assigning it to waitlisted candidates.',
      psychologicalLever: 'Artificial Scarcity & Panic (rushing the victim prevents them from consulting family or security advisers).',
      potentialVictimImpact: 'High stress causing emotional compliance and avoidance of basic verification.',
      killChainAction: 'Pause and enforce a mandatory 24-hour verification delay. Legitimate employers never penalize due diligence.',
      consequenceIfIgnored: 'Victim acts impulsively before detecting inconsistencies.',
      preventionTips: [
        'Enforce a mandatory 24-hour cooling pause: Take time to verify all documents; urgency is manufactured specifically to prevent due diligence.',
        'Consult trusted second opinions: Review the offer and communication with a mentor, colleague, or security adviser before signing.',
        'Never let artificial deadlines bypass verification: Real employers never revoke a legitimate job offer because an applicant verified company credentials.',
        'Document all correspondence: Take screenshots and export full email headers before responding or acknowledging deadlines.',
      ],
    },
    {
      id: 'timeline-financial-extraction',
      stage: 'financial',
      title: 'Primary Advance Fee Extraction',
      timeframe: 'Hour 48 · Day 3',
      timeLabel: 'T+48h',
      relativeHours: 48,
      severity: 'critical',
      matchedStep: financialStep,
      evidenceFallback: paymentFinding ? `Demanded: ${paymentFinding.amount || 'Payment'} - ${paymentFinding.evidence}` : 'Upfront fee requested for laptop security, background check, or certification.',
      adversaryTactic: 'Requests money before employment commences under the guise of refundable deposits, training kits, or software licenses.',
      psychologicalLever: 'Sunk Cost Fallacy & Reimbursement Promise ("100% refundable with first paycheck").',
      potentialVictimImpact: 'Direct financial theft (typically $250 to $3,500 / ₹10,000 to ₹150,000) sent via irreversible methods.',
      killChainAction: 'Halt all transactions immediately! Under global labor standards, real employers never charge candidates money.',
      consequenceIfIgnored: 'Funds are permanently laundered via cryptocurrency, UPI, or prepaid cards with no legal recovery path.',
      preventionTips: [
        'Absolute zero-fee rule: Legitimate employers provide laptops, software, and training at corporate expense; they never charge applicants.',
        'Reject check-cashing & vendor schemes: Fraudulent checks sent to buy hardware from "preferred vendors" will bounce, leaving you personally liable.',
        'Never remit funds via irreversible channels: Demands for Zelle, Venmo, UPI, Wire Transfer, Crypto, or Gift Cards are definitive proof of recruitment fraud.',
        'Beware "refundable deposit" promises: Promising reimbursement with your first paycheck is the standard advance-fee hook.',
      ],
    },
    {
      id: 'timeline-data-harvesting',
      stage: 'data',
      title: 'Premature PII & Identity Exfiltration',
      timeframe: 'Hour 72 · Day 4',
      timeLabel: 'T+72h',
      relativeHours: 72,
      severity: 'critical',
      matchedStep: dataStep || credentialStep,
      evidenceFallback: piiFinding ? `Requested: ${piiFinding.item}` : 'Collection of Aadhaar, PAN, SSN, photo ID, bank accounts, or OTP verification codes.',
      adversaryTactic: 'Demands confidential identity cards and banking credentials disguised as "payroll setup" or "tax onboarding forms".',
      psychologicalLever: 'Authority & Bureaucratic Conditioning (assuming standard HR paperwork requirements).',
      potentialVictimImpact: 'Compromised identity used for synthetic identity loans, fraudulent SIM cards, or bank account hijacking.',
      killChainAction: 'Never upload government identification or banking numbers to non-company portals or chat apps.',
      consequenceIfIgnored: 'Perpetual identity theft risks, damaged credit history, and potential criminal impersonation.',
      preventionTips: [
        'Withhold sensitive identifiers until contract verification: Government IDs (SSN, Aadhaar, PAN, Passport) should only be submitted via secure, authenticated enterprise portals.',
        'Watermark identification documents: If document proof is required, watermark copies with "For Verification with [Verified Company] Only" and mask non-essential digits.',
        'Never disclose OTP or 2FA codes: One-time passwords are strictly for account security and will never be requested by an authentic recruiter.',
        'Verify payroll collection methods: Formal direct deposit setups only occur through encrypted enterprise HR platforms (Workday, ADP, Gusto), never via messaging apps.',
      ],
    },
    {
      id: 'timeline-secondary-escalation',
      stage: 'extortion',
      title: 'Secondary Demands & Threat Escalation',
      timeframe: 'Day 5–7 · Week 2',
      timeLabel: 'T+5d',
      relativeHours: 120,
      severity: 'critical',
      matchedStep: steps.find((s) => s.stage === 'isolation' || s.title?.toLowerCase().includes('escalat') || s.title?.toLowerCase().includes('fee')),
      evidenceFallback: 'Follow-up demands: "Courier insurance fee", "Customs clearance", or threats of legal action.',
      adversaryTactic: 'When the first payment succeeds, the adversary fabricates a secondary bottleneck to extort additional funds.',
      psychologicalLever: 'Fear of Loss & Coercion (claiming paid money is stuck in escrow unless an additional release fee is transferred).',
      potentialVictimImpact: 'Secondary compounding financial loss doubling or tripling the initial stolen sum.',
      killChainAction: 'Do not pay ransom or follow-up fees! Cease all communication and preserve message logs as police evidence.',
      consequenceIfIgnored: 'Scammer drains all available liquid savings before discarding the victim.',
      preventionTips: [
        'Immediately cease all contact: Do not attempt to negotiate refunds; scammers exploit ongoing engagement to apply additional emotional pressure.',
        'Ignore fake legal notices and threats: Scammers frequently send fabricated legal summons or threaten police action for "breach of contract"—these are completely fraudulent.',
        'Preserve unedited evidence: Save all chat logs, transaction numbers, bank receipts, and phone numbers in a secure folder.',
        'Notify your bank immediately: If money was transferred, alert your bank’s fraud unit right away to request a transaction recall or stop payment.',
      ],
    },
    {
      id: 'timeline-ghosting-resale',
      stage: 'other',
      title: 'Communication Cutoff & Darknet Resale',
      timeframe: 'Day 14+ · Post-Incident',
      timeLabel: 'T+14d+',
      relativeHours: 336,
      severity: 'high',
      matchedStep: undefined,
      evidenceFallback: 'Scammer deletes chat history, blocks numbers, and leaks exfiltrated victim dossiers to secondary crime rings.',
      adversaryTactic: 'Adversary terminates communication, deletes group chats, and trades verified victim phone numbers to fraud aggregators.',
      psychologicalLever: 'Disorientation & Shame (victim realizes the fraud and hesitates to file police reports).',
      potentialVictimImpact: 'Victim targeted by secondary "fund recovery" scams; stolen identity documents circulated online.',
      killChainAction: 'Place a fraud freeze with credit bureaus, file an official cybercrime complaint, and inform your bank.',
      consequenceIfIgnored: 'Secondary attack vectors launch against the victim using previously gathered intelligence.',
      preventionTips: [
        'Place credit freezes with major bureaus: Contact national credit bureaus (Equifax, Experian, TransUnion) to prevent unauthorized loans or new credit accounts.',
        'File an official cybercrime report: Report the crime to official authorities (e.g. IC3.gov, Cybercrime.gov.in, or local police cyber unit) with your preserved evidence.',
        'Beware recovery scam follow-ups: Fraudsters often pose as "recovery specialists" or "lawyers" claiming they can retrieve stolen funds for an upfront fee.',
        'Rotate all passwords & credentials: Change account passwords and enable authenticator-app 2FA on email, financial, and personal accounts.',
      ],
    },
  ];

  // Process timeline events and map observed status
  const events: TimelineEvent[] = timelineBlueprint.map((bp) => {
    const hasMatchedEvidence = !!(bp.matchedStep && bp.matchedStep.evidence && bp.matchedStep.evidence.trim().length > 0);
    const isObserved = hasMatchedEvidence || (bp.id === 'timeline-financial-extraction' && !!paymentFinding) || (bp.id === 'timeline-urgency-coercion' && !!urgencyFinding);

    const evidence = isObserved
      ? bp.matchedStep?.evidence || bp.evidenceFallback
      : `Theoretical progression: ${bp.evidenceFallback}`;

    const explanation = bp.matchedStep?.explanation || bp.adversaryTactic;

    return {
      id: bp.id,
      stage: bp.stage,
      title: bp.title,
      timeframe: bp.timeframe,
      timeLabel: bp.timeLabel,
      relativeHours: bp.relativeHours,
      severity: bp.severity,
      isObserved,
      evidence,
      explanation,
      adversaryTactic: bp.adversaryTactic,
      psychologicalLever: bp.psychologicalLever,
      potentialVictimImpact: bp.potentialVictimImpact,
      killChainAction: bp.killChainAction,
      consequenceIfIgnored: bp.consequenceIfIgnored,
      preventionTips: bp.preventionTips,
    };
  });

  // Calculate current progression index: the highest observed milestone
  let currentEventIndex = 0;
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i].isObserved) {
      currentEventIndex = i;
      break;
    }
  }

  // Critical intervention index is right before the first irreversible extraction (Financial Extraction, idx 3)
  const interventionIndex = events.findIndex((e) => e.stage === 'financial');

  return {
    events,
    currentEventIndex,
    interventionIndex: interventionIndex !== -1 ? interventionIndex : 3,
  };
}
