import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Info, CheckCircle2, Zap } from 'lucide-react';
import { ThreatIndexResult } from '../types/analysis';

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
  location,
  salary,
}) => {
  const { score, band, confidence, evidenceQuality, factorContributions } = threatIndex;

  // Determine color scheme based on band
  const getTheme = () => {
    switch (band) {
      case 'CRITICAL':
        return {
          textColor: 'text-rose-400',
          borderColor: 'border-rose-500/40',
          bgColor: 'bg-rose-950/20',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          ringStroke: '#f43f5e',
          accent: 'from-rose-500 to-red-600',
        };
      case 'HIGH':
        return {
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/40',
          bgColor: 'bg-amber-950/20',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          ringStroke: '#f59e0b',
          accent: 'from-amber-500 to-orange-600',
        };
      case 'MODERATE':
        return {
          textColor: 'text-yellow-400',
          borderColor: 'border-yellow-500/40',
          bgColor: 'bg-yellow-950/20',
          badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
          ringStroke: '#eab308',
          accent: 'from-yellow-500 to-amber-600',
        };
      case 'LOW':
      default:
        return {
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/40',
          bgColor: 'bg-emerald-950/20',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          ringStroke: '#10b981',
          accent: 'from-emerald-500 to-teal-600',
        };
    }
  };

  const theme = getTheme();

  // SVG Circular Gauge calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      <div className={`cyber-card rounded-2xl border ${theme.borderColor} p-6 sm:p-8 shadow-2xl relative overflow-hidden`}>
        {/* Top badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono tracking-wider uppercase text-slate-400">
              Deterministic Threat Engine Output
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              Formula-driven (No LLM score hallucination)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs font-mono px-3 py-1 rounded-full border border-slate-700 bg-slate-900 text-slate-300">
              Confidence: <strong className="text-white">{confidence}%</strong>
            </div>
            <div className="text-xs font-mono px-3 py-1 rounded-full border border-slate-700 bg-slate-900 text-slate-300">
              Evidence Quality:{' '}
              <strong className={evidenceQuality === 'HIGH' ? 'text-emerald-400' : 'text-amber-400'}>
                {evidenceQuality}
              </strong>
            </div>
          </div>
        </div>

        {/* Core Score Display: Dominant Circular Ring + Metric Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Circular Ring (4 cols) */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-slate-800"
                />
                {/* Score Progress Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={theme.ringStroke}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-5xl font-black font-display tracking-tighter ${theme.textColor}`}>
                  {score}
                </span>
                <span className="text-xs font-mono text-slate-400 font-semibold tracking-widest">
                  / 100
                </span>
              </div>
            </div>

            <div className={`mt-3 px-4 py-1.5 rounded-full border text-xs font-bold font-mono tracking-wider uppercase ${theme.badgeBg}`}>
              {band} RISK
            </div>
          </div>

          {/* Right: Detected Entities + One-Line Assessment (8 cols) */}
          <div className="md:col-span-8 flex flex-col justify-center space-y-4">
            {/* Section 2: ONE-LINE ASSESSMENT */}
            <div>
              <h2 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                Investigation Assessment
              </h2>
              <p className="text-lg sm:text-xl font-medium text-slate-100 leading-snug">
                {summary || 'Analysis complete: risk indicators derived from explicit evidence.'}
              </p>
            </div>

            {/* Claimed Metadata Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="block text-[10px] font-mono text-slate-400 uppercase">Company Claim</span>
                <span className="text-xs font-semibold text-white truncate block">
                  {claimedCompany || 'Unspecified'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="block text-[10px] font-mono text-slate-400 uppercase">Offered Role</span>
                <span className="text-xs font-semibold text-white truncate block">
                  {claimedRole || 'Unspecified'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="block text-[10px] font-mono text-slate-400 uppercase">Comp Mentioned</span>
                <span className="text-xs font-semibold text-cyan-300 truncate block">
                  {salary || 'Not specified'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="block text-[10px] font-mono text-slate-400 uppercase">Active Signals</span>
                <span className="text-xs font-semibold text-amber-300 block">
                  {factorContributions.length} detected
                </span>
              </div>
            </div>

            {/* Transparency Note */}
            <div className="flex items-start gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Risk Score ≠ Certainty:</strong> This mathematical index measures the concentration of fraud tactics observed in the document. Legitimacy should always be verified independently through official corporate registries.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
