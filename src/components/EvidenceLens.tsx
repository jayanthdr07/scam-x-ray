import React, { useState } from 'react';
import { Microscope, Search, ShieldAlert, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';
import { RiskSignal } from '../types/analysis';

interface EvidenceLensProps {
  signals: RiskSignal[];
  originalText?: string;
}

export const EvidenceLens: React.FC<EvidenceLensProps> = ({ signals, originalText }) => {
  const [selectedSignalId, setSelectedSignalId] = useState<string>(signals[0]?.id || '');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(signals.map(s => s.category)))];

  const filteredSignals = filterCategory === 'all'
    ? signals
    : signals.filter(s => s.category === filterCategory);

  const activeSignal = signals.find(s => s.id === selectedSignalId) || signals[0];

  // Helper to check if evidence exists in original text
  const isQuoteInOriginal = (quote: string) => {
    if (!originalText || !quote) return false;
    return originalText.toLowerCase().includes(quote.toLowerCase().slice(0, 30));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Microscope className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
            EVIDENCE LENS
          </h3>
          <span className="text-xs font-mono text-slate-400">
            ({signals.length} verifiable signals mapped)
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-all ${
                filterCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Split: Signal List & Deep Evidence Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Signal cards (5 cols) */}
        <div className="md:col-span-5 space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {filteredSignals.map((signal) => {
            const isSelected = activeSignal?.id === signal.id;
            const isCritical = signal.severity === 'critical' || signal.weight >= 20;

            return (
              <div
                key={signal.id}
                onClick={() => setSelectedSignalId(signal.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                    {signal.category.replace('_', ' ')}
                  </span>
                  <span className={`text-xs font-mono font-bold ${isCritical ? 'text-rose-400' : 'text-amber-400'}`}>
                    +{signal.weight} pts
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white mb-1">
                  {signal.title}
                </h4>

                <p className="text-[11px] font-mono text-slate-400 line-clamp-2 italic">
                  "{signal.evidence}"
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Evidence & Why It Matters (7 cols) */}
        <div className="md:col-span-7">
          {activeSignal ? (
            <div className="cyber-card rounded-xl border border-cyan-500/30 p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
                    INVESTIGATION FINDING #{activeSignal.id}
                  </span>
                  <h4 className="text-base font-bold text-white">
                    {activeSignal.title}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-mono text-slate-400">Threat Weight</span>
                  <span className="text-base font-bold font-mono text-rose-400">
                    +{activeSignal.weight} points
                  </span>
                </div>
              </div>

              {/* Observed Quote Block */}
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1.5">
                  Observed Evidence
                </span>
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/90 text-sm font-mono text-rose-200 leading-relaxed">
                  "{activeSignal.evidence || 'Evidence location unavailable.'}"
                </div>
                {originalText && (
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    {isQuoteInOriginal(activeSignal.evidence) ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Direct match confirmed in original input
                      </span>
                    ) : (
                      <span className="text-amber-400">
                        Derived from document context / multimodal inspection
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Forensic Security Rationale */}
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1.5">
                  Why This Matters (Cybersecurity Context)
                </span>
                <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
                  {activeSignal.explanation}
                </p>
              </div>

              {/* Confidence & Severity Footer */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>
                  Severity:{' '}
                  <strong className="text-rose-400 uppercase">{activeSignal.severity}</strong>
                </span>
                <span>
                  Signal Confidence: <strong className="text-white">{activeSignal.confidence}%</strong>
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
              Select a finding to inspect forensic evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
