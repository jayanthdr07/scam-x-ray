import React from 'react';
import { AlertCircle, AlertOctagon, Flame, ShieldAlert } from 'lucide-react';
import { RiskSignal } from '../types/analysis';

interface TopRedFlagsProps {
  signals: RiskSignal[];
}

export const TopRedFlags: React.FC<TopRedFlagsProps> = ({ signals }) => {
  // Sort by weight/severity and pick top 3
  const topSignals = [...signals]
    .sort((a, b) => (b.weight || 0) - (a.weight || 0))
    .slice(0, 3);

  if (topSignals.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 mb-8">
        <div className="cyber-card rounded-xl p-5 border border-emerald-500/30 bg-emerald-950/20 text-center">
          <p className="text-sm font-mono text-emerald-300">
            No critical red flags detected from the available input.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-mono uppercase tracking-wider text-slate-200 font-bold">
            Top Red Flags Requiring Immediate Caution
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Ranked by threat severity
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {topSignals.map((signal, idx) => {
          const isCritical = signal.severity === 'critical' || signal.weight >= 20;
          return (
            <div
              key={signal.id || idx}
              className={`rounded-xl p-4 border transition-all ${
                isCritical
                  ? 'border-rose-500/40 bg-rose-950/20 hover:border-rose-500/70'
                  : 'border-amber-500/40 bg-amber-950/20 hover:border-amber-500/70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wide bg-slate-900 border border-slate-800 text-slate-300">
                  FLAG #{idx + 1}
                </span>
                <span className="text-xs font-mono font-bold text-rose-400">
                  +{signal.weight} pts
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mb-1 leading-snug">
                {signal.title}
              </h4>

              <div className="my-2 p-2 rounded bg-slate-950/70 border border-slate-800/80">
                <span className="block text-[10px] font-mono text-slate-400 mb-0.5">Observed Quote:</span>
                <p className="text-xs font-mono text-rose-200 italic line-clamp-3">
                  "{signal.evidence}"
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {signal.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
