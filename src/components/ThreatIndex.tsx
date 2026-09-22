import React from 'react';
import { ThreatIndexResult } from '../types/analysis';
import { Badge } from './ui/Badge';

interface ThreatIndexProps {
  threatIndex: ThreatIndexResult;
  summary: string;
  claimedCompany: string | null;
  claimedRole: string | null;
  location: string | null;
  salary: string | null;
}

export const ThreatIndex: React.FC<ThreatIndexProps> = ({
  threatIndex,
  summary,
  claimedCompany,
  claimedRole,
}) => {
  const { score, band, confidence, evidenceQuality, factorContributions } = threatIndex;

  // Determine threat classification, label, and colors
  const getRiskDetails = () => {
    switch (band) {
      case 'CRITICAL':
        return {
          label: 'CRITICAL RISK',
          title: 'High-Confidence Employment Scam',
          ringStroke: '#f43f5e',
          textColor: 'text-rose-400',
          badgeVariant: 'danger' as const,
          panelBorder: 'border-rose-500/30',
        };
      case 'HIGH':
        return {
          label: 'HIGH RISK',
          title: 'Potential Employment Scam',
          ringStroke: '#f97316',
          textColor: 'text-orange-400',
          badgeVariant: 'warning' as const,
          panelBorder: 'border-orange-500/30',
        };
      case 'MODERATE':
        return {
          label: 'MODERATE RISK',
          title: 'Suspicious Recruitment Communication',
          ringStroke: '#eab308',
          textColor: 'text-amber-400',
          badgeVariant: 'warning' as const,
          panelBorder: 'border-amber-500/30',
        };
      case 'LOW':
      default:
        return {
          label: 'LOW DETECTED RISK',
          title: 'No Major Scam Indicators Detected',
          ringStroke: '#10b981',
          textColor: 'text-emerald-400',
          badgeVariant: 'success' as const,
          panelBorder: 'border-emerald-500/30',
        };
    }
  };

  const risk = getRiskDetails();

  // SVG Circular Gauge calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const displayExplanation =
    band === 'LOW'
      ? 'No major scam indicators were detected from the available evidence. This does not prove legitimacy.'
      : summary ||
        'Multiple risk indicators were detected, including potential payment requests, urgency manipulation, or sensitive data collection.';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      {/* ONE large clean summary panel */}
      <div
        className={`bg-slate-900/70 border ${risk.panelBorder} rounded-2xl p-6 sm:p-8 shadow-xl`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* LEFT: Circular Threat Index */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  className="text-slate-800"
                />
                {/* Score Progress Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={risk.ringStroke}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-5xl font-extrabold tracking-tight ${risk.textColor}`}>
                  {score}
                </span>
                <span className="text-xs font-mono text-slate-400 font-medium">
                  / 100
                </span>
              </div>
            </div>

            <div className="mt-3">
              <Badge variant={risk.badgeVariant} size="md">
                {risk.label}
              </Badge>
            </div>
          </div>

          {/* RIGHT: Threat Classification, Explanation & Metrics */}
          <div className="md:col-span-8 flex flex-col justify-center space-y-4">
            <div>
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                THREAT INDEX
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {risk.title}
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {displayExplanation}
              </p>
            </div>

            {/* Entity metadata if present */}
            {(claimedCompany || claimedRole) && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                {claimedCompany && (
                  <span className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                    Company: <strong className="text-white">{claimedCompany}</strong>
                  </span>
                )}
                {claimedRole && (
                  <span className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                    Role: <strong className="text-white">{claimedRole}</strong>
                  </span>
                )}
              </div>
            )}

            {/* Compact Metrics Row */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-3">
              <div className="px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="block text-[11px] text-slate-400">Confidence</span>
                <span className="text-sm font-semibold text-white mt-0.5 block font-mono">
                  {confidence}%
                </span>
              </div>

              <div className="px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="block text-[11px] text-slate-400">Evidence Quality</span>
                <span className="text-sm font-semibold text-white mt-0.5 block font-mono">
                  {evidenceQuality}
                </span>
              </div>

              <div className="px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="block text-[11px] text-slate-400">Risk Factors</span>
                <span className="text-sm font-semibold text-white mt-0.5 block font-mono">
                  {factorContributions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
