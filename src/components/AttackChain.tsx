import React, { useState } from 'react';
import {
  GitCommit,
  ShieldAlert,
  Clock,
  CreditCard,
  FileSpreadsheet,
  KeyRound,
  UserCheck,
  Radio,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Info,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { AttackChainStep } from '../types/analysis';

interface AttackChainProps {
  steps: AttackChainStep[];
}

interface StageSafetyGuidance {
  safetyTitle: string;
  coreRule: string;
  dangerSigns: string[];
  tips: string[];
  counterAction: string;
  safeReply: string;
}

export const AttackChain: React.FC<AttackChainProps> = ({ steps }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [copiedReply, setCopiedReply] = useState<boolean>(false);

  if (!steps || steps.length === 0) {
    return null;
  }

  const currentStep = steps[activeStepIndex] || steps[0];

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'trust':
        return <UserCheck className="w-4 h-4 text-emerald-400" />;
      case 'urgency':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'financial':
        return <CreditCard className="w-4 h-4 text-rose-400" />;
      case 'data':
        return <FileSpreadsheet className="w-4 h-4 text-purple-400" />;
      case 'credential':
        return <KeyRound className="w-4 h-4 text-red-500" />;
      case 'isolation':
        return <Radio className="w-4 h-4 text-orange-400" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'trust':
        return 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300';
      case 'urgency':
        return 'border-amber-500/40 bg-amber-950/30 text-amber-300';
      case 'financial':
        return 'border-rose-500/50 bg-rose-950/30 text-rose-300';
      case 'data':
        return 'border-purple-500/40 bg-purple-950/30 text-purple-300';
      case 'credential':
        return 'border-red-500/50 bg-red-950/40 text-red-300';
      case 'isolation':
        return 'border-orange-500/40 bg-orange-950/30 text-orange-300';
      default:
        return 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300';
    }
  };

  const getStageActiveRing = (stage: string) => {
    switch (stage) {
      case 'trust':
        return 'ring-2 ring-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)]';
      case 'urgency':
        return 'ring-2 ring-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]';
      case 'financial':
        return 'ring-2 ring-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.35)]';
      case 'data':
        return 'ring-2 ring-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.3)]';
      case 'credential':
        return 'ring-2 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
      case 'isolation':
        return 'ring-2 ring-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.3)]';
      default:
        return 'ring-2 ring-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]';
    }
  };

  // Generate context-sensitive safety tips based on stage and step metadata
  const getContextualSafetyTips = (step: AttackChainStep): StageSafetyGuidance => {
    switch (step.stage) {
      case 'trust':
        return {
          safetyTitle: 'Trust & Authority Verification Protocol',
          coreRule: 'Never accept job offers sent from free email providers (Gmail, Outlook) or unsolicited chat channels without independent verification.',
          dangerSigns: [
            'Offer made without a live technical or panel video interview with hiring managers.',
            'Recruiter uses a company brand name but writes from a personal or lookalike domain.',
            'Unrealistic praise or high compensation offered immediately without portfolio or skill assessment.'
          ],
          tips: [
            'Locate the company\'s official website independently via search and check their verified Careers page.',
            'Cross-check the recruiter\'s full name on LinkedIn to confirm active employment at the claimed organization.',
            'Request an official email confirmation from the enterprise corporate domain (@company.com).'
          ],
          counterAction: 'Call or message the official corporate switchboard/HR department found on their legitimate website to confirm the recruiter and requisition ID.',
          safeReply: `Thank you for the communication. To proceed with the interview process in compliance with standard corporate security protocols, please send this correspondence directly from your official corporate email address (@company.com) alongside your job requisition ID.`
        };

      case 'urgency':
        return {
          safetyTitle: 'Urgency Deceleration & Cognitive Defense Protocol',
          coreRule: 'Artificial urgency (e.g., "accept within 24 hours or lose the role") is a deliberate psychological manipulation designed to bypass due diligence.',
          dangerSigns: [
            'Demands for instant signatures or same-day onboarding confirmations.',
            'Threats that the position will be forfeited if you take time to consult an advisor.',
            'High-pressure phrasing like "immediate start mandatory" or "offer expires tonight".'
          ],
          tips: [
            'Legitimate employers routinely provide 3 to 7 business days for candidates to review an offer letter and benefits package.',
            'Slow down your response deliberately; breaking the scammer\'s rapid conversational tempo forces them off-script.',
            'Ask for a formal written employment contract with standard legal company headers and corporate registration numbers.'
          ],
          counterAction: 'Formally request a standard 48 to 72-hour review period in writing to review the agreement and employment clauses.',
          safeReply: `Thank you for extending this offer. In accordance with standard professional practice, I require 3 business days to thoroughly review the employment contract and consult with my career advisor before signing.`
        };

      case 'financial':
        return {
          safetyTitle: 'Anti-Advance Fee & Financial Defense Protocol',
          coreRule: 'Legitimate employers NEVER ask candidates to pay for equipment, software licenses, background checks, or training fees upfront.',
          dangerSigns: [
            'Requests to send money via Zelle, Venmo, Wire Transfer, Western Union, or Cryptocurrency.',
            'Fake Check Schemes: Scammer sends an "advance check" and asks you to deposit it and wire a portion to a "certified hardware vendor".',
            'Any requirement to purchase laptops, phones, or home-office items from an unverified third-party link.'
          ],
          tips: [
            'Real enterprises ship pre-configured corporate laptops and peripherals directly from their IT department or authorized corporate suppliers (e.g., Dell, Apple, CDW).',
            'Bank clearance rule: Deposited checks can show as "available funds" in 24 hours under federal rules, but still bounce up to 30 days later, leaving you personally liable.',
            'Never accept checks from entities whose name does not match the hiring organization exactly.'
          ],
          counterAction: 'Refuse all financial transactions immediately. Cease payment discussions and report payment instructions to your local cybercrime unit (IC3.gov in the US or Action Fraud in the UK).',
          safeReply: `Under my personal security policy and standard employment regulations, I do not process financial transfers, deposit third-party equipment checks, or pay upfront onboarding fees. If equipment is provided, please arrange direct dispatch from your corporate vendor.`
        };

      case 'data':
        return {
          safetyTitle: 'PII & Identity Harvesting Defense Protocol',
          coreRule: 'Do not provide Social Security Numbers, National ID scans, passport photos, or direct deposit banking details prior to signing a verified corporate contract.',
          dangerSigns: [
            'Unencrypted web forms, Google Forms, or email requests demanding passport/ID scans.',
            'Early requests for voided checks or bank account and routing numbers before you have met team members.',
            'Vague onboarding forms that do not contain standard tax disclosure forms (W-4 / I-9 / W-8BEN).'
          ],
          tips: [
            'Sensitive personal information should only be submitted via secure, authenticated enterprise HRIS portals (e.g., Workday, Greenhouse, BambooHR).',
            'Watermark ID scans with "FOR EMPLOYMENT VERIFICATION PURPOSES ONLY AT [COMPANY] - NOT FOR CREDIT OR LOANS" before submitting anywhere.',
            'Redact sensitive national ID numbers or SSN until your first official day of employment if legitimacy is unverified.'
          ],
          counterAction: 'Decline submitting sensitive identity documentation via email or chat. Insist on using a verifiable enterprise HR portal with MFA.',
          safeReply: `To safeguard my personal data, I do not transmit sensitive identity documents (passport, SSN, banking details) via unencrypted email or chat. I will gladly enter this information upon onboarding through your official, authenticated corporate HRIS portal.`
        };

      case 'credential':
        return {
          safetyTitle: 'Credential Isolation & Account Defense Protocol',
          coreRule: 'Never enter your personal account passwords, share OTP verification codes, or create merchant accounts on behalf of an employer.',
          dangerSigns: [
            'Requests to provide temporary SMS codes sent to your phone ("to verify your identity").',
            'Links to external portals prompting you to log in with your Google, Microsoft, or Apple credentials.',
            'Instructions to register accounts on cryptocurrency exchanges, freelance sites, or payment gateways.'
          ],
          tips: [
            'One-Time Passwords (OTPs) are private authorization keys; no legitimate company will ever ask you to read back a verification code.',
            'Examine URL structures carefully before entering credentials; look for subtle misspellings (e.g., `micros0ft-careers.com`).',
            'If you have already entered credentials on a suspicious portal, immediately change your passwords and revoke active login sessions.'
          ],
          counterAction: 'Do not click links sent in chat. Enable passkeys or physical hardware security keys (FIDO2) on your primary email and banking accounts.',
          safeReply: `I cannot share verification codes or authenticate external accounts on third-party links. Please provide your corporate IT helpdesk contact and direct ticket reference so I can verify this request through standard technical channels.`
        };

      case 'isolation':
        return {
          safetyTitle: 'Off-Platform Migration Defense Protocol',
          coreRule: 'Scammers migrate victims to Telegram, WhatsApp, or Signal to evade job platform fraud filters and delete message histories.',
          dangerSigns: [
            'Direct message on LinkedIn or Indeed telling you to immediately message an "Executive Hiring Manager" on Telegram.',
            'Use of disappearing messages or auto-delete timers during official hiring discussions.',
            'Refusal to conduct voice or video calls on standard corporate platforms like Zoom, Teams, or Google Meet.'
          ],
          tips: [
            'Legitimate corporate recruiting teams maintain an audit trail and conduct candidate communications via corporate email or verified ATS portals.',
            'Platform protections (such as reporting tools on LinkedIn, Indeed, or Upwork) are lost once you switch to unmonitored messenger apps.',
            'Insist on maintaining communications within the platform where initial contact occurred.'
          ],
          counterAction: 'Firmly state that all pre-hire discussions must occur via official corporate email or standard corporate video conferencing.',
          safeReply: `I maintain all professional recruitment communications exclusively through official corporate email or this platform's verified messaging system to ensure an audit trail. Please provide your corporate email address.`
        };

      default:
        return {
          safetyTitle: 'General Forensic Defense Protocol',
          coreRule: 'When in doubt, pause all interactions and independently corroborate the opportunity through secondary corporate channels.',
          dangerSigns: [
            'Anomalous recruitment procedures, such as text-only questionnaire interviews without verbal conversation.',
            'Unclear job descriptions with generic duties and disproportionately high compensation.',
            'Vague corporate contact information with missing physical headquarters addresses.'
          ],
          tips: [
            'Trust your analytical instincts: if an opportunity feels unusually easy to obtain, scrutiny is warranted.',
            'Share the offer with an experienced peer, mentor, or career counselor before signing or paying.',
            'Remember that legitimate enterprises never penalize a candidate for taking reasonable cybersecurity precautions.'
          ],
          counterAction: 'Document all correspondence, preserve screenshots of messages and payment requests, and perform independent domain lookups.',
          safeReply: `I am currently conducting standard due diligence on this position. Please provide your company registration number, direct office extension, and the contact details of the hiring director.`
        };
    }
  };

  const currentGuidance = getContextualSafetyTips(currentStep);

  const handleCopyReply = () => {
    navigator.clipboard.writeText(currentGuidance.safeReply);
    setCopiedReply(true);
    setTimeout(() => setCopiedReply(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="cyber-card rounded-2xl border border-cyan-500/25 p-6 sm:p-7 shadow-xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 mb-5 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/70 border border-cyan-500/30 text-cyan-400">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
                  SCAM ATTACK CHAIN
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Interactive Progression
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">
                Visual Threat Progression Timeline with Stage-Specific Safety Protocols
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-300">
              {steps.length} Stages Mapped
            </span>
          </div>
        </div>

        {/* Cautious Security Narrative Explanation */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 mb-6 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-cyan-400">Forensic Pattern Sequence:</strong> Modern recruitment fraud operates as a calculated funnel. Click each stage along the <strong>Threat Progression Timeline</strong> below to uncover the psychological manipulation tactics deployed at that moment and inspect exact defensive safety protocols.
          </div>
        </div>

        {/* ========================================================
            VISUAL THREAT PROGRESSION TIMELINE (Interactive Stepper)
            ======================================================== */}
        <div className="mb-7 p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Threat Progression Timeline (Click stage to reveal safety tips):
            </span>
            <span className="text-cyan-300 font-bold">
              Stage {activeStepIndex + 1} of {steps.length}: {currentStep.stage.toUpperCase()}
            </span>
          </div>

          {/* Connected Step Track */}
          <div className="relative pt-2 pb-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-between min-w-[520px] relative px-4">
              {/* Background Connecting Line */}
              <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-800 z-0" />
              
              {/* Active Progress Fill Line */}
              <div
                className="absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-gradient-to-r from-cyan-500 via-amber-500 to-rose-500 z-0 transition-all duration-300"
                style={{
                  width: steps.length > 1 ? `${(activeStepIndex / (steps.length - 1)) * 90}%` : '0%',
                }}
              />

              {/* Step Nodes */}
              {steps.map((step, idx) => {
                const isActive = idx === activeStepIndex;
                const isPast = idx < activeStepIndex;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveStepIndex(idx)}
                    className="relative z-10 flex flex-col items-center group focus:outline-none"
                  >
                    {/* Node Circle */}
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? `${getStageColor(step.stage)} ${getStageActiveRing(step.stage)} scale-110`
                          : isPast
                          ? 'border-slate-600 bg-slate-900 text-slate-200 hover:border-slate-400'
                          : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      {getStageIcon(step.stage)}
                    </div>

                    {/* Stage Label Below */}
                    <span
                      className={`mt-2 text-[10px] font-mono uppercase tracking-wider transition-colors max-w-[80px] text-center truncate ${
                        isActive
                          ? 'text-cyan-300 font-bold'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {step.stage}
                    </span>

                    {/* Step Number Dot */}
                    <span className="text-[9px] font-mono text-slate-500">
                      Step {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================
            CONTEXT-SENSITIVE SAFETY TIPS FOR SELECTED STAGE
            ======================================================== */}
        <div className="mb-7 rounded-xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-slate-900/60 p-5 shadow-lg relative overflow-hidden">
          {/* Subtle Background Circuit Accent */}
          <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-5 text-cyan-400">
            <ShieldCheck className="w-32 h-32" />
          </div>

          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-900/60 border border-cyan-500/40 text-cyan-200 font-bold">
                    Stage {activeStepIndex + 1} Safety Protocol
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    [{currentStep.stage.toUpperCase()}]
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {currentGuidance.safetyTitle}
                </h4>
              </div>
            </div>

            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              Active Focus: {currentStep.title}
            </span>
          </div>

          {/* Cardinal Rule Box */}
          <div className="p-3 rounded-lg bg-slate-950/90 border border-amber-500/40 mb-4 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-200 leading-relaxed font-mono">
              <strong className="text-amber-300 uppercase">Core Defensive Rule:</strong> {currentGuidance.coreRule}
            </div>
          </div>

          {/* Two-Column Grid: Danger Signals & Tactical Safety Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Left: What to Spot at this Stage */}
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-300 mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> What Scammers Do At This Step:
              </h5>
              <ul className="space-y-1.5">
                {currentGuidance.dangerSigns.map((sign, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                    <span className="text-rose-400 text-sm leading-none">•</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Concrete Countermeasures */}
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Protective Countermeasures:
              </h5>
              <ul className="space-y-1.5">
                {currentGuidance.tips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-400 text-sm leading-none">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Immediate Action + Copyable Safe Response */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-cyan-500/30">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono text-cyan-300 font-bold uppercase flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Recommended Defensive Reply:
              </span>

              <button
                type="button"
                onClick={handleCopyReply}
                className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 transition-colors"
              >
                {copiedReply ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-cyan-400" />
                    <span>Copy Defensive Response</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs font-mono text-slate-300 bg-slate-900/90 p-2.5 rounded border border-slate-800 italic select-all leading-relaxed">
              "{currentGuidance.safeReply}"
            </p>
          </div>
        </div>

        {/* ========================================================
            FULL PROGRESSION STEP LIST (Interactive Cards)
            ======================================================== */}
        <div className="border-t border-slate-800 pt-5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Observed Evidence & Step Breakdown:</span>
            <span className="text-[10px] text-slate-500 normal-case">Click any card to load its safety protocol</span>
          </h4>

          <div className="relative space-y-3">
            {steps.map((step, idx) => {
              const isSelected = idx === activeStepIndex;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-500/60 bg-cyan-950/20 shadow-md ring-1 ring-cyan-500/30'
                      : 'border-slate-800/90 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full border flex items-center justify-center font-mono text-xs font-bold ${getStageColor(step.stage)}`}>
                        {idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          {getStageIcon(step.stage)}
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                            {step.stage.toUpperCase()}: {step.title}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveStepIndex(idx);
                      }}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-cyan-300'
                      }`}
                    >
                      <span>{isSelected ? 'Viewing Protocol' : 'View Safety Tips'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Quoted Evidence */}
                  <div className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800/90 my-2">
                    <span className="block text-[10px] font-mono text-slate-500 mb-0.5">Observed in offer:</span>
                    <p className="text-xs font-mono text-slate-200 italic leading-relaxed">
                      "{step.evidence}"
                    </p>
                  </div>

                  {/* Forensic Explanation */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
