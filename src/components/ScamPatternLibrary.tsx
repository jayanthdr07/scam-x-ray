import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  AlertTriangle,
  Flame,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  Tag,
  ShieldCheck,
  Send
} from 'lucide-react';

export interface ScamArchetype {
  id: string;
  name: string;
  category: 'advance_fee' | 'off_platform' | 'impersonation' | 'pii_theft' | 'mule' | 'pay_to_work';
  categoryLabel: string;
  severity: 'critical' | 'high';
  threatPoints: number;
  typicalRoles: string[];
  summary: string;
  modUsOperandi: string[];
  psychologicalLevers: string[];
  verbatimQuote: string;
  defensiveRule: string;
  sampleOfferText: string;
}

export const ARCHETYPES: ScamArchetype[] = [
  {
    id: 'equipment-check-scam',
    name: 'The Counterfeit Equipment Check Scam',
    category: 'advance_fee',
    categoryLabel: 'Advance Fee Fraud',
    severity: 'critical',
    threatPoints: 95,
    typicalRoles: ['Remote Data Entry', 'Administrative Assistant', 'Customer Service Representative'],
    summary: 'The candidate is mailed an official-looking corporate cashier’s check to buy home-office hardware from an "authorized vendor". The check later bounces, leaving the victim liable for funds wired to the scammer.',
    modUsOperandi: [
      'Candidate receives an unsolicited offer without a real video interview.',
      'Scammer sends a priority check for $3,000–$5,000 "to cover Apple/Dell equipment".',
      'Candidate is told to deposit the check and wire/Zelle the balance to an "approved hardware distributor".',
      'The check temporarily shows as "cleared" under banking availability laws, but officially bounces 7–21 days later.'
    ],
    psychologicalLevers: [
      'Generosity Illusion: Employer appears generous by fronting equipment money.',
      'Urgency: "Must purchase machines within 24 hours to begin paid training on Monday."',
      'Compliant Authority: Official invoice headers and corporate logos used.'
    ],
    verbatimQuote: '“Enclosed is your company check for $4,200 to procure your home office workstation. You must deposit this immediately and transfer $3,800 to our certified logistics vendor via Zelle or Wire today.”',
    defensiveRule: 'Legitimate employers ship physical company-owned hardware directly from IT. Never deposit third-party checks or wire money on behalf of an employer.',
    sampleOfferText: `Subject: Formal Appointment & Equipment Disbursal - Senior Operations Clerk
Company: Apex Horizon Logistics Ltd.
Dear Candidate,

Congratulations! Following your resume review, our Management Board has approved your appointment as a Remote Operations Clerk with a starting salary of $34/hour.

To prepare your remote workstation, our accounting team has mailed a cashier's check of $4,250 to your residential address. You are required to deposit this check via mobile banking immediately upon receipt. Once the initial credit reflects, you must wire $3,850 to our designated hardware vendor (vendor-support@apex-supplies.net) via Zelle or Wire Transfer within 24 hours to expedite courier dispatch of your Apple MacBook Pro and encrypted VPN router.

Please confirm receipt of this instruction immediately to avoid forfeiture of your role.

Warm regards,
Talent Acquisition Team
Apex Horizon Logistics`
  },
  {
    id: 'telegram-ghost-interview',
    name: 'The Off-Platform "Ghost Recruiter" Interview',
    category: 'off_platform',
    categoryLabel: 'Off-Platform Migration',
    severity: 'high',
    threatPoints: 80,
    typicalRoles: ['Content Moderator', 'Virtual Assistant', 'Junior Developer'],
    summary: 'Recruiter initiates contact on LinkedIn or Indeed, but immediately insists on conducting a text-only "interview" on Telegram or WhatsApp to evade platform fraud filters and erase evidence.',
    modUsOperandi: [
      'Direct message claiming candidate’s profile was selected for an urgent opening.',
      'Recruiter directs candidate to install Telegram and message a "Hiring Director" handle.',
      'Conducts an automated questionnaire of 10 generic questions via text message.',
      'Extends an immediate official offer within 30 minutes with inflated compensation.'
    ],
    psychologicalLevers: [
      'Artificial Flattery: "Your profile is exceptionally qualified."',
      'Isolation: Moving away from monitored job board protections and audit trails.',
      'Cognitive Momentum: Fast-paced text replies leave no time to verify company existence.'
    ],
    verbatimQuote: '“Your background is ideal for our open position. Our Head of Talent is waiting on Telegram right now at @Apex_Global_HR. Please message them your full name and interview code #7729.”',
    defensiveRule: 'Professional recruiters never conduct hiring interviews exclusively via messaging apps. All official discussions must remain on corporate email or verified job boards.',
    sampleOfferText: `[LinkedIn Message]
Hello there! We reviewed your profile and are very impressed with your background.
Our multinational firm is urgently recruiting Remote Project Coordinators.
Compensation: $55.00/hour (Flexible hours, 20-30 hrs/week).
No technical interview needed!

To complete your brief text screening today, please download the Telegram app and connect directly with our Head of HR: @Apex_Global_Hiring. Send him your Interview Verification Code: #HR-9081 to start immediately.

Best regards,
Sarah Jenkins
Executive Recruiter`
  },
  {
    id: 'fake-hr-impersonation',
    name: 'The Brand Impersonation & Lookalike Domain Trap',
    category: 'impersonation',
    categoryLabel: 'Executive Impersonation',
    severity: 'critical',
    threatPoints: 90,
    typicalRoles: ['Senior Software Engineer', 'Product Designer', 'Marketing Strategist'],
    summary: 'Scammers clone an existing Fortune 500 company (e.g., Stripe, Google, Meta), registering a deceptive lookalike domain (@stripe-onboard.net) to extend convincing offers to experienced talent.',
    modUsOperandi: [
      'Scammers register a domain with subtle misspellings or hyphenations.',
      'They scrape the names and headshots of real executives from LinkedIn.',
      'Offer letters include stolen corporate trademarks, letterheads, and real office addresses.',
      'Victim is pressured to sign an agreement containing sensitive personal data fields.'
    ],
    psychologicalLevers: [
      'Prestige Hijacking: Candidate lets their guard down due to the company’s reputation.',
      'High Remuneration: Offers at the 90th percentile of market rates to deter skepticism.',
      'Familiarity: Recruiter uses the name and bio of a real person working at the firm.'
    ],
    verbatimQuote: '“Following the review of your portfolio, the Leadership Council at Meta Platforms has authorized your immediate appointment at $210,000/yr. Reply with your passport scan to proceed.”',
    defensiveRule: 'Check the domain registration date using WHOIS and examine the email headers for SPF/DKIM authentication. Cross-verify job openings on the official corporate careers website.',
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
Stripe Inc.`
  },
  {
    id: 'background-credit-phish',
    name: 'The "Pre-Employment Credit Check" Phishing Trap',
    category: 'pii_theft',
    categoryLabel: 'PII & Identity Harvesting',
    severity: 'high',
    threatPoints: 85,
    typicalRoles: ['All Remote Roles', 'Entry Level Applicants'],
    summary: 'Candidate is instructed that before an interview can be scheduled, they must complete an external "credit or identity verification" on a third-party link that captures SSN, credit cards, and PII.',
    modUsOperandi: [
      'Scammer posts high-volume job listings on free boards.',
      'Responds to all applicants claiming their resume passed stage 1.',
      'Requires applicant to click a link to run a "free credit check" or pay a $19 screening fee.',
      'The affiliate portal captures sensitive financial credentials for identity theft.'
    ],
    psychologicalLevers: [
      'Regulatory Authority: Pretext of "Federal labor law compliance".',
      'Low Initial Demand: Asking for a small screening fee or simple credit pull first.',
      'Conditional Gatekeeping: "Cannot talk to the manager until report is attached."'
    ],
    verbatimQuote: '“Federal employment compliance requires all applicants to provide an active credit and identity verification score. Run your report at [link] and send the certificate before 5 PM.”',
    defensiveRule: 'Background and credit checks are conducted only AFTER a contingent job offer is accepted, and are always paid for entirely by the employer.',
    sampleOfferText: `Subject: Action Required: Schedule Your Interview for Technical Support Specialist
Company: CloudPoint Solutions

Hello,

We received your application for the Technical Support Specialist position. Your qualifications are a strong match for our requirements.

Before we can schedule your final interview with our Regional Operations Manager, company policy mandates that all prospective staff submit an Identity & Credit Background Verification Report to verify financial integrity.

Please use our secure partner link below to generate your pre-employment certificate ($19.95 fee will be reimbursed upon interview attendance):
https://verify-candidate-screening.com/cloudpoint-portal

Please email your generated report back to us by 5:00 PM today so we can finalize your interview slot for tomorrow morning.

Regards,
HR Operations Team
CloudPoint Solutions`
  },
  {
    id: 'package-mule-reshipping',
    name: 'The "Quality Inspector" Package Mule Scam',
    category: 'mule',
    categoryLabel: 'Criminal Liability / Mule',
    severity: 'critical',
    threatPoints: 95,
    typicalRoles: ['Package Forwarding Inspector', 'Merchandise Quality Controller', 'Logistics Coordinator'],
    summary: 'Candidate is recruited to receive packages of high-value electronics or luxury apparel at their personal home, inspect them, and ship them overseas using prepaid labels. Goods are bought with stolen credit cards.',
    modUsOperandi: [
      'Job advertised as "Work from Home Package Inspector" with no experience required.',
      'Candidate receives packages bought with stolen credit cards at their home.',
      'Candidate repackages goods and ships them to criminal rings overseas.',
      'The scammer disappears without paying the promised salary, and law enforcement investigates the candidate.'
    ],
    psychologicalLevers: [
      'Low Barrier to Entry: "Anyone with a home address can earn $4,000/month."',
      'Tangible Activity: Physical packages make the work feel legitimate.',
      'Deferred Gratification: Promised large monthly salaries that are never paid.'
    ],
    verbatimQuote: '“Your duty is simple: receive parcels from our retail clients, verify contents for defects, affix international shipping labels, and drop them off at UPS. Earn $750 weekly.”',
    defensiveRule: 'Never allow your personal residential address to be used as a forwarding node for commercial merchandise. This constitutes criminal package forwarding / stolen goods trafficking.',
    sampleOfferText: `Subject: Congratulations on your Selection: Home-Based Quality & Logistics Assistant
Company: TransContinental Logistics Network

Dear Candidate,

We are excited to welcome you to TransContinental Logistics as an Independent Quality Control Assistant.

Responsibilities:
- Receive inbound merchandise from our partner retailers (Best Buy, Amazon, Apple).
- Open packages and inspect items for shipping damage or manufacturing defects.
- Affix provided international airway bills and dispatch parcels at your nearest FedEx location within 48 hours.

Compensation:
$3,200 monthly base stipend + $25 bonus per forwarded parcel, paid every second Friday via direct deposit.

Please reply with a clear photo of your driver's license and your residential mailing address where parcels should be directed starting next week.

Warm regards,
Logistics Management
TransContinental Logistics`
  },
  {
    id: 'pay-to-work-training',
    name: 'The "Mandatory Training & License" Deposit Scam',
    category: 'pay_to_work',
    categoryLabel: 'Pay-to-Work Scheme',
    severity: 'high',
    threatPoints: 85,
    typicalRoles: ['Junior Copywriter', 'Graphic Designer', 'Data Analyst'],
    summary: 'Candidate is hired, but informed that to activate their corporate portal or begin client projects, they must first purchase a proprietary tool license or pay an onboarding certification fee.',
    modUsOperandi: [
      'Immediate offer without rigorous portfolio review.',
      'Offer is conditioned upon completing a paid "mandatory pre-boarding certification".',
      'Candidate is directed to an unaccredited website to pay $150–$350 for the course.',
      'Once payment is made, the recruiter ceases all communication.'
    ],
    psychologicalLevers: [
      'Sunk Cost Fallacy: Candidate has already accepted the offer and is eager to start.',
      'Reimbursement Promise: "All certification fees will be fully refunded on your first paycheck."',
      'False Exclusivity: "Only candidates who complete this training qualify for client project billings."'
    ],
    verbatimQuote: '“You have been selected! To begin your onboarding, you must acquire the Enterprise Workflow Certification from our accredited partner ($175). This is 100% reimbursed on day 30.”',
    defensiveRule: 'Employers are legally responsible for all mandatory training, certifications, and software tooling. Any requirement to pay for training to secure a job is fraudulent.',
    sampleOfferText: `Subject: Appointment Letter & Mandatory Certification Onboarding - Junior Analyst
Company: Nexus Enterprise Analytics

Dear Candidate,

We are thrilled to offer you the position of Junior Data Analyst at Nexus Enterprise Analytics with an annual salary of $68,000.

In order to comply with our client data confidentiality policies, all incoming analysts must complete the mandatory 2-hour Enterprise Data Security Certification prior to your start date on Monday.

Please register for the certification via our approved training portal:
Portal: https://nexus-accredited-training.net/enroll
Registration Fee: $185.00 (This amount is fully refundable and will be added to your first bi-weekly paycheck).

Once you have completed the module and obtained your digital badge, send the certificate to hr@nexus-analytics.net to receive your employee login credentials.

Best regards,
Onboarding Committee
Nexus Enterprise Analytics`
  }
];

interface ScamPatternLibraryProps {
  onLoadIntoScanner: (text: string) => void;
  onInterceptAction?: (url: string, reason: string, severity: 'critical' | 'high') => void;
}

export const ScamPatternLibrary: React.FC<ScamPatternLibraryProps> = ({
  onLoadIntoScanner,
  onInterceptAction,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalArchetype, setActiveModalArchetype] = useState<ScamArchetype | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Patterns' },
    { id: 'advance_fee', label: 'Advance Fee' },
    { id: 'off_platform', label: 'Off-Platform' },
    { id: 'impersonation', label: 'Impersonation' },
    { id: 'pii_theft', label: 'PII Theft' },
    { id: 'mule', label: 'Package Mule' },
    { id: 'pay_to_work', label: 'Pay-to-Work' },
  ];

  const filteredArchetypes = useMemo(() => {
    return ARCHETYPES.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.verbatimQuote.toLowerCase().includes(q) ||
        item.typicalRoles.some(r => r.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyQuote = (quote: string, id: string) => {
    navigator.clipboard.writeText(quote);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTestInScanner = (sampleText: string) => {
    onLoadIntoScanner(sampleText);
    // Smooth scroll up to scanner
    const scannerElement = document.getElementById('offer-scanner-section');
    if (scannerElement) {
      scannerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="scam-pattern-library-section" className="w-full max-w-4xl mx-auto px-4 mb-12">
      <div className="cyber-card rounded-2xl border border-cyan-500/25 p-6 sm:p-7 shadow-xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
                  SCAM PATTERN LIBRARY
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                  Intelligence Base
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">
                Browse documented recruitment fraud archetypes & behavioral manipulation levers
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400">
            {ARCHETYPES.length} Documented Archetypes
          </span>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-3 mb-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. check, telegram, laptop, ssn, training)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-[11px] font-mono px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Archetypes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArchetypes.map((archetype) => (
            <div
              key={archetype.id}
              className="p-4 sm:p-5 rounded-xl border border-slate-800/90 bg-slate-900/60 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                {/* Card Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300">
                    {archetype.categoryLabel}
                  </span>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      archetype.severity === 'critical'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    +{archetype.threatPoints} pts Risk
                  </span>
                </div>

                {/* Archetype Title */}
                <h4 className="text-sm font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {archetype.name}
                </h4>

                {/* Summary */}
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {archetype.summary}
                </p>

                {/* Verbatim Trap Quote Preview */}
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 mb-3">
                  <span className="text-[10px] font-mono text-slate-500 block mb-1 uppercase tracking-wider">
                    Classic Red-Flag Quote:
                  </span>
                  <p className="text-xs font-mono text-rose-200 italic line-clamp-2">
                    {archetype.verbatimQuote}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalArchetype(archetype)}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <span>Forensic Breakdown</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleTestInScanner(archetype.sampleOfferText)}
                  className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 transition-colors"
                  title="Load realistic sample offer into SCAMTRACE scanner to analyze it live"
                >
                  <Send className="w-3 h-3 text-cyan-400" />
                  <span>Test in Scanner</span>
                </button>
              </div>
            </div>
          ))}

          {filteredArchetypes.length === 0 && (
            <div className="col-span-2 p-8 text-center border border-dashed border-slate-800 rounded-xl font-mono text-xs text-slate-400">
              No matching fraud archetypes found for "{searchQuery}". Try a broader keyword like "check", "telegram", or "fee".
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          FORENSIC ARCHETYPE DETAIL MODAL
          ======================================================== */}
      {activeModalArchetype && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto cyber-card rounded-2xl border border-cyan-500/40 p-6 sm:p-7 shadow-2xl bg-slate-950 text-slate-100">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                    {activeModalArchetype.categoryLabel}
                  </span>
                  <span className="text-[10px] font-mono text-rose-400 font-bold">
                    Threat Index Weight: +{activeModalArchetype.threatPoints} pts
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-display">
                  {activeModalArchetype.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalArchetype(null)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-900 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-xs font-mono">
              {/* Summary */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed font-sans text-xs">
                {activeModalArchetype.summary}
              </div>

              {/* Modus Operandi Progression */}
              <div>
                <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> Modus Operandi (Attack Progression):
                </h5>
                <ol className="space-y-2">
                  {activeModalArchetype.modUsOperandi.map((step, idx) => (
                    <li key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-[10px] shrink-0 font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-slate-300 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Psychological Levers */}
              <div>
                <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Psychological Levers Deployed:
                </h5>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {activeModalArchetype.psychologicalLevers.map((lever, idx) => (
                    <li key={idx} className="p-2 rounded bg-amber-950/20 border border-amber-500/30 text-amber-200 text-[11px] leading-relaxed">
                      {lever}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verbatim Red Flag Quote */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs uppercase tracking-wider text-rose-400 font-bold">
                    Verbatim Red-Flag Quote:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyQuote(activeModalArchetype.verbatimQuote, activeModalArchetype.id)}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    {copiedId === activeModalArchetype.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Quote</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-rose-500/40 text-rose-200 italic leading-relaxed">
                  {activeModalArchetype.verbatimQuote}
                </div>
              </div>

              {/* Defensive Countermeasure Rule */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300 block mb-0.5">
                    Defensive Rule of Thumb:
                  </strong>
                  {activeModalArchetype.defensiveRule}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveModalArchetype(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  handleTestInScanner(activeModalArchetype.sampleOfferText);
                  setActiveModalArchetype(null);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Load Sample Into Scanner</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
