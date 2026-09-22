import React from 'react';
import {
  CreditCard,
  Clock,
  ShieldAlert,
  UserX,
  FileWarning,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { RiskSignal } from '../types/analysis';

interface TopRedFlagsProps {
  signals: RiskSignal[];
  selectedSignalId?: string;
  onSelectSignal?: (signalId: string) => void;
}

export const TopRedFlags: React.FC<TopRedFlagsProps> = ({
  signals,
  selectedSignalId,
  onSelectSignal,
}) => {
  // Sort by weight/severity and pick top flags
  const topSignals = [...signals]
    .sort((a, b) => (b.weight || 0) - (a.weight || 0))
    .slice(0, 4);

  if (topSignals.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 mb-8">
        <div className="rounded-xl p-4 border border-emerald-500/30 bg-emerald-950/20 text-center">
          <p className="text-sm text-emerald-300">
            No critical red flags detected from the provided input.
          </p>
        </div>
      </div>
    );
  }

  const getSignalIcon = (signal: RiskSignal) => {
    const cat = (signal.category || '').toLowerCase();
    const title = (signal.title || '').toLowerCase();

    if (cat.includes('financial') || title.includes('deposit') || title.includes('fee') || title.includes('pay') || title.includes('money')) {
      return <CreditCard className="w-4 h-4 text-rose-400" />;
    }
    if (cat.includes('urgency') || title.includes('urgenc') || title.includes('deadline') || title.includes('hour')) {
      return <Clock className="w-4 h-4 text-amber-400" />;
    }
    if (cat.includes('sensitive') || cat.includes('data') || title.includes('aadhaar') || title.includes('pan') || title.includes('bank') || title.includes('otp')) {
      return <ShieldAlert className="w-4 h-4 text-rose-400" />;
    }
    if (cat.includes('impersonat') || title.includes('impersonat') || title.includes('recruiter')) {
      return <UserX className="w-4 h-4 text-amber-400" />;
    }
    if (cat.includes('document') || title.includes('contract') || title.includes('letter')) {
      return <FileWarning className="w-4 h-4 text-orange-400" />;
    }
    return <AlertTriangle className="w-4 h-4 text-amber-400" />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      {/* Section Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-white tracking-tight">
          Top Red Flags
        </h3>
        <span className="text-xs text-slate-500">
          Ranked by risk contribution
        </span>
      </div>

      {/* Clean, unified bordered list container */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800">
        {topSignals.map((signal) => {
          const isSelected = selectedSignalId === signal.id;
          return (
            <div
              key={signal.id}
              onClick={() => onSelectSignal?.(signal.id)}
              className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-slate-800/80'
                  : 'hover:bg-slate-800/40'
              }`}
            >
              {/* Left: Icon and Title + Subtitle */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  {getSignalIcon(signal)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-200 truncate">
                      {signal.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {signal.evidence ? `"${signal.evidence.slice(0, 70)}..."` : signal.explanation}
                  </p>
                </div>
              </div>

              {/* Right: Risk contribution score */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300">
                  +{signal.weight}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
