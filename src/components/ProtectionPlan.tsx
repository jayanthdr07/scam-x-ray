import React, { useState } from 'react';
import {
  CreditCard,
  FileX,
  Globe,
  UserCheck,
  AlertTriangle,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react';
import { Button } from './ui/Button';

interface ProtectionPlanProps {
  claimedCompany: string | null;
}

export const ProtectionPlan: React.FC<ProtectionPlanProps> = ({ claimedCompany }) => {
  const [copied, setCopied] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);

  const companyName = claimedCompany || 'the organization';

  const defensiveTemplate = `Thank you for reaching out regarding the opportunity with ${companyName}.

Before proceeding, please provide:
1. Your official corporate email address on the company domain.
2. A direct link to this role on your official careers page.
3. Your corporate recruiter identification details.

Please note that I do not make advance payments, deposits, or share national identity documents prior to independent verification through official corporate channels.

Best regards,
Candidate`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(defensiveTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const steps = [
    {
      num: '01',
      title: 'Do not pay',
      desc: 'Never transfer funds for security deposits, equipment, or training. Legitimate employers never charge candidates.',
      icon: <CreditCard className="w-4 h-4 text-rose-400" />,
    },
    {
      num: '02',
      title: 'Do not send identity documents',
      desc: 'Withhold Aadhaar, PAN, SSN, passport, or banking OTPs until you have verified the offer out-of-band.',
      icon: <FileX className="w-4 h-4 text-amber-400" />,
    },
    {
      num: '03',
      title: 'Verify the official website',
      desc: 'Open a clean browser tab and locate the company’s authentic careers page directly to verify the vacancy.',
      icon: <Globe className="w-4 h-4 text-sky-400" />,
    },
    {
      num: '04',
      title: 'Search the recruiter on LinkedIn',
      desc: 'Check if the recruiter actually works at the firm and compare contact details and message style.',
      icon: <UserCheck className="w-4 h-4 text-cyan-400" />,
    },
    {
      num: '05',
      title: 'Report the communication',
      desc: 'Flag the account on WhatsApp, Telegram, or LinkedIn, and report suspicious fraud to official cybercrime portals.',
      icon: <AlertTriangle className="w-4 h-4 text-purple-400" />,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-12">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7">
        {/* Section Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white tracking-tight">
            What should you do now?
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Immediate tactical guidance to protect your finances, identity, and personal accounts
          </p>
        </div>

        {/* Numbered Steps: 01 to 05 */}
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 flex items-start gap-4"
            >
              {/* Number and Icon */}
              <div className="flex items-center gap-2 shrink-0 pt-0.5">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {step.num}
                </span>
                <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>

              {/* Title and Description */}
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-slate-200">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Collapsible Defensive Response Template */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setShowTemplate(!showTemplate)}
            className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-white py-1 transition-colors"
          >
            <span className="font-semibold text-slate-300">
              Need a safe reply? View defensive response template
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                showTemplate ? 'rotate-180 text-cyan-400' : ''
              }`}
            />
          </button>

          {showTemplate && (
            <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Send this standardized response to verify recruiter legitimacy:
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleCopy}
                  icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <pre className="p-3.5 rounded-lg bg-slate-900 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                {defensiveTemplate}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
