import React, { useState } from 'react';
import {
  Globe,
  Search,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Lock,
} from 'lucide-react';
import { VerificationResult, GroundingSource } from '../types/analysis';

interface VerificationPanelProps {
  claimedCompany: string | null;
  claimedRole: string | null;
  verification?: VerificationResult;
  onRunVerification: (company: string) => Promise<void>;
  isVerifying: boolean;
}

export const VerificationPanel: React.FC<VerificationPanelProps> = ({
  claimedCompany,
  claimedRole,
  verification,
  onRunVerification,
  isVerifying,
}) => {
  const [customCompany, setCustomCompany] = useState(claimedCompany || '');

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'VERIFIED':
        return {
          bg: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
          label: 'VERIFIED CORPORATE ENTITY',
        };
      case 'PARTIALLY_VERIFIED':
        return {
          bg: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          label: 'PARTIALLY VERIFIED',
        };
      case 'CONFLICTING_INFORMATION':
        return {
          bg: 'bg-rose-950/60 border-rose-500/40 text-rose-300',
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
          label: 'CONFLICTING CORPORATE EVIDENCE',
        };
      case 'UNVERIFIED':
      default:
        return {
          bg: 'bg-slate-900 border-slate-700 text-slate-300',
          icon: <HelpCircle className="w-4 h-4 text-slate-400" />,
          label: 'COULD NOT INDEPENDENTLY VERIFY',
        };
    }
  };

  const statusInfo = getStatusBadge(verification?.status);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="cyber-card rounded-2xl border border-sky-500/25 p-6 sm:p-7 shadow-xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-950/70 border border-sky-500/30 text-sky-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
                  GOOGLE SEARCH CLAIM VERIFICATION
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30">
                  Search Grounded
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">
                Independent public web investigation (Not relying on offer claims)
              </p>
            </div>
          </div>

          {/* Trigger Verification Button */}
          <button
            id="btn-verify-employer"
            type="button"
            onClick={() => onRunVerification(customCompany || claimedCompany || 'Company')}
            disabled={isVerifying || (!customCompany && !claimedCompany)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold font-mono text-xs shadow-md transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isVerifying ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Searching Google...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5 text-slate-950" />
                <span>{verification ? 'Re-Verify Employer' : 'Verify Employer Now'}</span>
              </>
            )}
          </button>
        </div>

        {/* Verification Status Banner if available */}
        {verification ? (
          <div className="space-y-5">
            {/* Status Header Pill */}
            <div className={`flex items-center gap-2.5 p-3.5 rounded-xl border ${statusInfo.bg}`}>
              {statusInfo.icon}
              <div className="flex-1">
                <span className="text-xs font-mono font-bold tracking-wide">
                  {statusInfo.label}
                </span>
                <p className="text-xs text-slate-300 mt-0.5">
                  Target Company: <strong className="text-white">{verification.company}</strong>
                </p>
              </div>
            </div>

            {/* Crucial Architectural Separation: USER-PROVIDED vs WEB-VERIFIED EVIDENCE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* User-Provided Evidence */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block mb-1">
                  [USER-PROVIDED EVIDENCE - UNTRUSTED]
                </span>
                <p className="text-xs font-mono text-slate-300 mb-2">
                  What the suspicious offer claimed:
                </p>
                <ul className="text-xs text-slate-400 space-y-1 font-mono list-disc pl-4">
                  <li>Claimed Employer: {claimedCompany || 'Unspecified'}</li>
                  <li>Claimed Position: {claimedRole || 'Unspecified'}</li>
                  <li>Contact Method: Unverified messaging channel</li>
                </ul>
              </div>

              {/* Web-Verified Evidence */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-sky-500/30">
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider block mb-1">
                  [WEB-VERIFIED EVIDENCE - INDEPENDENT]
                </span>
                <p className="text-xs font-mono text-slate-300 mb-2">
                  What Google Search Grounding discovered:
                </p>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {verification.officialWebsite ? (
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-slate-400">Official Portal:</span>
                      <a
                        href={verification.officialWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1 truncate"
                      >
                        {verification.officialWebsite}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  ) : (
                    <span className="text-slate-400">Official Portal: Could not independently verify</span>
                  )}

                  {verification.careersPage && (
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-slate-400">Careers Page:</span>
                      <a
                        href={verification.careersPage}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-400 hover:underline flex items-center gap-1 truncate"
                      >
                        {verification.careersPage}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Deep Grounded Investigation Findings */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 mb-1">
                  Public Job & Recruiter Findings
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {verification.publicJobEvidence}
                </p>
              </div>

              {verification.recruiterEvidence && (
                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-400 mb-1">
                    Recruiter Identity & Domain Analysis
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {verification.recruiterEvidence}
                  </p>
                </div>
              )}
            </div>

            {/* Google Search Citations / Grounding Chunks */}
            {verification.sources && verification.sources.length > 0 && (
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  Verified Grounding Sources ({verification.sources.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {verification.sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.uri}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 hover:text-cyan-200 transition-colors"
                    >
                      <Globe className="w-3 h-3 text-cyan-400" />
                      <span className="truncate max-w-xs">{src.title || src.uri}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Strict Safety Advice Directive */}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/40 text-xs font-mono text-amber-200 flex items-start gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">CRITICAL VERIFICATION ADVICE:</strong> {verification.safetyAdvice}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl bg-slate-900/60 border border-dashed border-slate-800">
            <Building2 className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-medium mb-1">
              Independent corporate verification ready for{' '}
              <strong className="text-white">{claimedCompany || 'this employer'}</strong>
            </p>
            <p className="text-xs text-slate-500 font-mono mb-4 max-w-md mx-auto">
              Uses Gemini Google Search Grounding to locate authentic corporate registries, careers portals, and official domains without relying on links in the offer.
            </p>
            <button
              type="button"
              onClick={() => onRunVerification(claimedCompany || 'Employer')}
              disabled={isVerifying}
              className="px-4 py-2 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-300 hover:bg-sky-500/30 text-xs font-mono transition-colors cursor-pointer"
            >
              Verify Company with Google Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
