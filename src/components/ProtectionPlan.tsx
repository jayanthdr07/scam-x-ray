import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, AlertTriangle, LifeBuoy, FileText, Send } from 'lucide-react';

interface ProtectionPlanProps {
  claimedCompany: string | null;
}

export const ProtectionPlan: React.FC<ProtectionPlanProps> = ({ claimedCompany }) => {
  const [copied, setCopied] = useState(false);

  const companyName = claimedCompany || 'your organization';

  const defensiveTemplate = `Thank you for reaching out regarding the opportunity with ${companyName}.

To proceed with onboarding compliance, please provide:
1. Your official corporate email address associated with the company domain.
2. A direct link to this specific requisition on your official careers portal.
3. Your corporate identification number or recruiter registration details.

Please note that in accordance with standard hiring security protocols, I do not make advance payments, security deposits, or disclose national identity documents (such as Aadhaar, PAN, or banking OTPs) prior to independent verification through official corporate channels.

Best regards,
Candidate`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(defensiveTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-12">
      <div className="cyber-card rounded-2xl border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
                CANDIDATE PROTECTION PLAN
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Actionable tactical defenses and escalation protocol
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-emerald-400 font-bold px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30">
            Immediate Defense Actions
          </span>
        </div>

        {/* 4 Core Protection Directives */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>1. Zero Financial Transfers</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Never pay security deposits, laptop fees, training charges, or courier fees. Legitimate corporate employers bear all onboarding expenses.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>2. Safeguard National Identity</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Do not share full Aadhaar, PAN, SSN, cancelled cheques, or OTPs on WhatsApp, Telegram, or Gmail. Withhold KYC until the contract is verified.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>3. Independent Out-of-Band Verification</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Locate the company's authentic website yourself via a clean browser search. Contact their HR department directly using their official directory.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>4. Cybercrime Reporting</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If an extortion or impersonation threat occurred, file a report on official cybercrime portals: National Cyber Crime Reporting Portal (cybercrime.gov.in) or IC3 (ic3.gov).
            </p>
          </div>
        </div>

        {/* Copyable Defensive Response Template */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/90">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono uppercase font-bold text-slate-200">
                Copyable Defensive Response Template
              </span>
            </div>

            <button
              id="btn-copy-defensive-response"
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-colors cursor-pointer shadow-md"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-950" />
                  <span>Copy Response</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] font-mono text-slate-400 mb-3">
            Send this standardized verification reply if you wish to challenge an unsolicited recruiter without disclosing private information:
          </p>

          <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
            {defensiveTemplate}
          </pre>
        </div>
      </div>
    </div>
  );
};
