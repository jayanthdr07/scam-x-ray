import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export interface ScamArchetype {
  id: string;
  name: string;
  category: 'all' | 'advance_fee' | 'impersonation' | 'off_platform' | 'pii_theft' | 'equipment_scam' | 'credential_theft';
  categoryLabel: string;
  severity: 'critical' | 'high';
  threatPoints: number;
  summary: string;
  signals: string[];
  defensiveRule: string;
  sampleOfferText: string;
}

export const ARCHETYPES: ScamArchetype[] = [
  {
    id: 'equipment-check-scam',
    name: 'Counterfeit Equipment Check Scam',
    category: 'equipment_scam',
    categoryLabel: 'Equipment Scam',
    severity: 'critical',
    threatPoints: 95,
    summary: 'Candidate receives a fake cashier’s check to buy home office hardware from an "approved vendor". Check bounces later, victim loses money.',
    signals: [
      'Employer mails check before any work begins',
      'Mandatory hardware purchase through specific vendor',
      'Payment demanded via Zelle, Wire, or Crypto',
    ],
    defensiveRule: 'Legitimate employers ship pre-configured laptops directly. Never cash a check on behalf of an employer.',
    sampleOfferText: `Subject: Formal Appointment & Equipment Disbursal - Senior Operations Clerk
Company: Apex Horizon Logistics Ltd.
Dear Candidate,

Congratulations! Following your resume review, our Management Board has approved your appointment as a Remote Operations Clerk with a starting salary of $34/hour.

To prepare your remote workstation, our accounting team has mailed a cashier's check of $4,250 to your residential address. You are required to deposit this check via mobile banking immediately upon receipt. Once the initial credit reflects, you must wire $3,850 to our designated hardware vendor (vendor-support@apex-supplies.net) via Zelle or Wire Transfer within 24 hours to expedite courier dispatch of your Apple MacBook Pro.

Please confirm receipt of this instruction immediately to avoid forfeiture of your role.

Warm regards,
Talent Acquisition Team
Apex Horizon Logistics`,
  },
  {
    id: 'telegram-ghost-interview',
    name: 'Off-Platform "Ghost Recruiter" Scam',
    category: 'off_platform',
    categoryLabel: 'Off-Platform',
    severity: 'high',
    threatPoints: 80,
    summary: 'Recruiter starts contact on LinkedIn but quickly redirects to Telegram or WhatsApp for text-only interview to evade fraud detection.',
    signals: [
      'Immediate migration to Telegram/WhatsApp',
      'Text-only screening with instant selection',
      'Unusually high hourly rate for entry-level work',
    ],
    defensiveRule: 'Professional recruiters communicate from official company domains and conduct live video or in-person interviews.',
    sampleOfferText: `[LinkedIn Message]
Hello there! We reviewed your profile and are very impressed with your background.
Our multinational firm is urgently recruiting Remote Project Coordinators.
Compensation: $55.00/hour (Flexible hours, 20-30 hrs/week).
No technical interview needed!

To complete your brief text screening today, please download the Telegram app and connect directly with our Head of HR: @Apex_Global_Hiring. Send him your Interview Verification Code: #HR-9081 to start immediately.

Best regards,
Sarah Jenkins
Executive Recruiter`,
  },
  {
    id: 'fake-hr-impersonation',
    name: 'Executive & Brand Impersonation',
    category: 'impersonation',
    categoryLabel: 'Impersonation',
    severity: 'critical',
    threatPoints: 90,
    summary: 'Scammers clone legitimate brands using lookalike domains to send official-looking employment contracts and harvest sensitive IDs.',
    signals: [
      'Sender domain slightly misspelled (e.g. stripe-portal.net)',
      'High-salary offer without technical evaluation',
      'Demands passport/ID scan within 24 hours',
    ],
    defensiveRule: 'Verify job openings on the authentic company website careers section before sharing sensitive documents.',
    sampleOfferText: `From: careers@stripe-recruitment-portal.com
To: candidate@portfolio.io
Subject: Official Offer of Employment: Senior UI Engineer - Stripe Inc.

Dear Candidate,

Following the review of your open-source repositories and online portfolio, our Executive Engineering Board has unanimously selected you for the Senior UI Engineer position at Stripe Inc.

Position: Senior UI Engineer (100% Remote)
Base Compensation: $198,000 USD + Comprehensive Benefits
Signing Bonus: $15,000 USD (payable on first pay cycle)

To ratify this employment contract and initiate your background onboarding, please complete the attached Personnel Verification Document, attach a colored scan of your Passport or National ID, and return it within 24 hours.

Sincerely,
David Singleton
Chief Technology Officer (Impersonated)
Stripe Inc.`,
  },
  {
    id: 'background-credit-phish',
    name: 'Pre-Employment Credit Verification Phish',
    category: 'pii_theft',
    categoryLabel: 'PII Theft',
    severity: 'high',
    threatPoints: 85,
    summary: 'Candidate must complete an external "credit check" or identity verification link capturing SSN and card data before getting an interview.',
    signals: [
      'Interview conditional on external credit link',
      'Small screening fee ($19.95) requested',
      'Third-party domain collects sensitive KYC data',
    ],
    defensiveRule: 'Legitimate employers pay for background checks and only run them after a formal contingent offer is made.',
    sampleOfferText: `Subject: Action Required: Schedule Your Interview for Technical Support Specialist
Company: CloudPoint Solutions

Hello,

Before we can schedule your final interview with our Regional Operations Manager, company policy mandates that all prospective staff submit an Identity & Credit Background Verification Report to verify financial integrity.

Please use our secure partner link below to generate your pre-employment certificate ($19.95 fee will be reimbursed upon interview attendance):
https://verify-candidate-screening.com/cloudpoint-portal

Please email your generated report back to us by 5:00 PM today so we can finalize your interview slot.

Regards,
HR Operations Team
CloudPoint Solutions`,
  },
  {
    id: 'advance-fee-portal',
    name: 'Mandatory Training & Deposit Scam',
    category: 'advance_fee',
    categoryLabel: 'Advance Fee',
    severity: 'critical',
    threatPoints: 92,
    summary: 'Candidate is required to pay a "refundable onboarding deposit" or software license fee before receiving their employment contract.',
    signals: [
      'Refundable deposit demanded via UPI or Wire',
      'Artificial deadline (e.g. within 2 hours)',
      'Threat of cancelling appointment if not paid',
    ],
    defensiveRule: 'Never pay to receive a job. Legitimate corporations bear all onboarding and software licensing expenses.',
    sampleOfferText: `Subject: Official Appointment Letter - Senior Software Engineer
Company: Apex Future Technologies Ltd.
Dear Candidate,

Congratulations! Following your profile review, you have been directly selected for Senior Software Engineer at ₹28,50,000 CTC.

To activate your corporate portal and secure your company MacBook Pro M3, you are required to submit a mandatory refundable security deposit of ₹12,500 via UPI (apex-onboarding@fakeupi) within the next two (2) hours. Failure to remit this fee before 3:00 PM will result in immediate cancellation of your appointment.

Regards,
HR Onboarding Team`,
  },
  {
    id: 'credential-theft-portal',
    name: 'Corporate Portal Credential Phish',
    category: 'credential_theft',
    categoryLabel: 'Credential Theft',
    severity: 'critical',
    threatPoints: 94,
    summary: 'Target is sent a link to a fake single-sign-on (SSO) page mimicking Google Workspace or Microsoft 365 to harvest passwords and session tokens.',
    signals: [
      'Fake login screen imitating Microsoft or Google',
      'Request for multi-factor authentication (MFA/OTP)',
      'Unverified domain hosting login form',
    ],
    defensiveRule: 'Never enter your corporate or personal login credentials into an unfamiliar URL received via email.',
    sampleOfferText: `From: no-reply@workday-onboarding-access.com
Subject: Action Required: Authenticate your Employee Workspace

Dear New Hire,

Your company email and corporate intranet workspace have been generated. To finalize setup, please click below to authenticate with your existing Google Workspace or Microsoft credentials:

https://auth-workspace-portal.com/login?token=891024

Failure to authenticate within 4 hours will suspend your onboarding profile.`,
  },
];

interface ScamPatternLibraryProps {
  onLoadExampleInScanner: (sampleText: string) => void;
}

export const ScamPatternLibrary: React.FC<ScamPatternLibraryProps> = ({
  onLoadExampleInScanner,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalPattern, setActiveModalPattern] = useState<ScamArchetype | null>(null);

  const filterChips = [
    { id: 'all', label: 'All' },
    { id: 'advance_fee', label: 'Advance Fee' },
    { id: 'impersonation', label: 'Impersonation' },
    { id: 'off_platform', label: 'Off-Platform' },
    { id: 'pii_theft', label: 'PII Theft' },
    { id: 'equipment_scam', label: 'Equipment Scam' },
    { id: 'credential_theft', label: 'Credential Theft' },
  ];

  const filteredPatterns = useMemo(() => {
    return ARCHETYPES.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.signals.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div id="pattern-library-section" className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Pattern Library
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Cybersecurity threat intelligence database of documented recruitment fraud vectors
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patterns by tactic, keyword, or signal..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {filterChips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setSelectedCategory(chip.id)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedCategory === chip.id
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Compact Pattern Cards Grid with Consistent Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPatterns.map((pattern) => (
          <div
            key={pattern.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div>
              {/* Card Header: Pattern Name & Risk Level */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-sm font-bold text-white leading-snug">
                  {pattern.name}
                </h3>
                <Badge
                  variant={pattern.severity === 'critical' ? 'danger' : 'warning'}
                  size="sm"
                >
                  {pattern.severity === 'critical' ? 'CRITICAL' : 'HIGH'}
                </Badge>
              </div>

              {/* Short Explanation */}
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                {pattern.summary}
              </p>

              {/* 3 Common Signals */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/60 mb-4">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
                  Common Signals
                </span>
                {pattern.signals.slice(0, 3).map((sig, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span className="line-clamp-1">{sig}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions: View Pattern & Test in Scanner */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-800/60">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setActiveModalPattern(pattern)}
                className="flex-1 text-xs"
              >
                View Pattern
              </Button>

              <Button
                size="sm"
                variant="primary"
                onClick={() => onLoadExampleInScanner(pattern.sampleOfferText)}
                icon={<Play className="w-3 h-3 fill-current" />}
                className="flex-1 text-xs"
              >
                Test in Scanner
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredPatterns.length === 0 && (
        <div className="p-8 text-center rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-slate-500">
          No patterns found matching your search.
        </div>
      )}

      {/* Detail Modal */}
      {activeModalPattern && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <Badge
                  variant={activeModalPattern.severity === 'critical' ? 'danger' : 'warning'}
                  size="sm"
                >
                  {activeModalPattern.categoryLabel}
                </Badge>
                <h3 className="text-lg font-bold text-white mt-1">
                  {activeModalPattern.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalPattern(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {activeModalPattern.summary}
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono font-semibold text-cyan-400 uppercase block mb-1">
                Defensive Security Rule
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeModalPattern.defensiveRule}
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setActiveModalPattern(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  onLoadExampleInScanner(activeModalPattern.sampleOfferText);
                  setActiveModalPattern(null);
                }}
              >
                Test in Scanner
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
