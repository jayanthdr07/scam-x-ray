import React, { useState } from 'react';
import {
  Globe,
  Search,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  AlertTriangle,
  Building2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { VerificationResult } from '../types/analysis';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

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
  const [companyInput, setCompanyInput] = useState(claimedCompany || '');

  // Derived verification checks
  const targetCompany = verification?.company || claimedCompany || 'Unspecified Employer';

  const isVerified = verification?.status === 'VERIFIED';
  const isPartiallyVerified = verification?.status === 'PARTIALLY_VERIFIED';
  const isConflicting = verification?.status === 'CONFLICTING_INFORMATION';

  // Domain match status computation
  const getDomainMatchStatus = () => {
    if (!verification) return { label: 'PENDING', variant: 'neutral' as const };
    if (isConflicting) return { label: 'MISMATCH', variant: 'danger' as const };
    if (isVerified) return { label: 'MATCHED', variant: 'success' as const };
    if (isPartiallyVerified) return { label: 'INCONCLUSIVE', variant: 'warning' as const };
    return { label: 'UNVERIFIED', variant: 'warning' as const };
  };

  const domainMatch = getDomainMatchStatus();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      {/* Section Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Verify the Claims
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-referenced with public registry data & search grounding
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => onRunVerification(companyInput || targetCompany)}
          disabled={isVerifying}
          isLoading={isVerifying}
          icon={<Search className="w-3.5 h-3.5 text-cyan-400" />}
        >
          {verification ? 'Re-Verify Claims' : 'Verify Claims'}
        </Button>
      </div>

      {/* Rows with compact status badges */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800">
        {/* Row 1: Company */}
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-200 block">
              Company
            </span>
            <span className="text-xs text-slate-400 truncate block mt-0.5">
              {targetCompany}
            </span>
          </div>
          <Badge
            variant={
              isVerified
                ? 'success'
                : isConflicting
                ? 'danger'
                : isPartiallyVerified
                ? 'warning'
                : 'neutral'
            }
            size="sm"
          >
            {verification ? (isVerified ? 'VERIFIED' : isConflicting ? 'CONFLICT' : 'CHECK') : 'PENDING'}
          </Badge>
        </div>

        {/* Row 2: Official Website */}
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-200 block">
              Official Website
            </span>
            <span className="text-xs text-slate-400 truncate block mt-0.5">
              {verification?.officialWebsite ? (
                <a
                  href={verification.officialWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline inline-flex items-center gap-1 truncate"
                >
                  {verification.officialWebsite}
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ) : (
                'Not confirmed in offer'
              )}
            </span>
          </div>
          <Badge
            variant={verification?.officialWebsite ? 'success' : 'neutral'}
            size="sm"
          >
            {verification?.officialWebsite ? 'DISCOVERED' : 'UNVERIFIED'}
          </Badge>
        </div>

        {/* Row 3: Careers Page */}
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-200 block">
              Careers Page
            </span>
            <span className="text-xs text-slate-400 truncate block mt-0.5">
              {verification?.careersPage ? (
                <a
                  href={verification.careersPage}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:underline inline-flex items-center gap-1 truncate"
                >
                  {verification.careersPage}
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ) : (
                'Official job portal check'
              )}
            </span>
          </div>
          <Badge
            variant={verification?.careersPage ? 'success' : 'neutral'}
            size="sm"
          >
            {verification?.careersPage ? 'PORTAL ACTIVE' : 'UNCONFIRMED'}
          </Badge>
        </div>

        {/* Row 4: Claimed Position */}
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-200 block">
              Claimed Position
            </span>
            <span className="text-xs text-slate-400 truncate block mt-0.5">
              {claimedRole || 'Unspecified Role'}
            </span>
          </div>
          <Badge
            variant={verification?.publicJobEvidence ? 'info' : 'neutral'}
            size="sm"
          >
            {verification?.publicJobEvidence ? 'INDEXED' : 'UNVERIFIED'}
          </Badge>
        </div>

        {/* Row 5: Recruiter */}
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-200 block">
              Recruiter
            </span>
            <span className="text-xs text-slate-400 truncate block mt-0.5">
              {verification?.recruiterEvidence || 'Communication channel legitimacy check'}
            </span>
          </div>
          <Badge
            variant={isConflicting ? 'danger' : 'neutral'}
            size="sm"
          >
            {isConflicting ? 'SUSPICIOUS' : 'UNVERIFIED'}
          </Badge>
        </div>

        {/* Row 6: Domain Match */}
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-200 block">
              Domain Match
            </span>
            <span className="text-xs text-slate-400 truncate block mt-0.5">
              Sender domain vs authentic corporate DNS
            </span>
          </div>
          <Badge variant={domainMatch.variant} size="sm">
            {domainMatch.label}
          </Badge>
        </div>
      </div>

      {/* Safety Advice Note */}
      {verification?.safetyAdvice && (
        <div className="mt-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white">Verification Note:</strong> {verification.safetyAdvice}
          </p>
        </div>
      )}
    </div>
  );
};
