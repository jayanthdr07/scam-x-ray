import React, { useState, useEffect } from 'react';
import { Microscope, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { RiskSignal } from '../types/analysis';

interface EvidenceLensProps {
  signals: RiskSignal[];
  originalText?: string;
  selectedSignalId?: string;
  onSelectSignal?: (id: string) => void;
}

export const EvidenceLens: React.FC<EvidenceLensProps> = ({
  signals,
  originalText,
  selectedSignalId: externalSelectedId,
  onSelectSignal: externalOnSelect,
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string>(signals[0]?.id || '');

  const activeId = externalSelectedId || internalSelectedId;
  const activeSignal = signals.find((s) => s.id === activeId) || signals[0];

  useEffect(() => {
    if (externalSelectedId) {
      setInternalSelectedId(externalSelectedId);
    }
  }, [externalSelectedId]);

  const handleSelect = (id: string) => {
    setInternalSelectedId(id);
    externalOnSelect?.(id);
  };

  // Build highlighted representation of text
  const renderHighlightedDocument = () => {
    if (!originalText) {
      return (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 leading-relaxed">
          <p className="mb-3 text-slate-500">// Source Content Extracted from Document / Image</p>
          <div className="space-y-2">
            {signals.map((sig) => (
              <div
                key={sig.id}
                onClick={() => handleSelect(sig.id)}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                  activeSignal?.id === sig.id
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-slate-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="text-cyan-400 font-semibold">{sig.title}</span>
                  <span className="text-rose-400">+{sig.weight}</span>
                </div>
                <p className="italic">"{sig.evidence}"</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // When originalText is available, show the document with clickable highlight tags
    return (
      <div className="space-y-3">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 max-h-[420px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
          {originalText}
        </div>

        {/* Detected Signal Badges for Quick Selection */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {signals.map((sig) => {
            const isActive = activeSignal?.id === sig.id;
            return (
              <button
                key={sig.id}
                type="button"
                onClick={() => handleSelect(sig.id)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{sig.title}</span>
                <span className={isActive ? 'text-slate-900 font-mono' : 'text-rose-400 font-mono'}>
                  +{sig.weight}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Microscope className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Evidence Lens
          </h3>
        </div>
        <span className="text-xs text-slate-500">
          {signals.length} verified signals mapped
        </span>
      </div>

      {/* Clean Two-Column Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Original Content / Document */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px] font-mono">
              Source Content
            </span>
            <span>Document View</span>
          </div>
          {renderHighlightedDocument()}
        </div>

        {/* RIGHT COLUMN: Evidence Details for Selected Signal */}
        <div className="lg:col-span-6">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px] font-mono">
              Evidence Detail
            </span>
            {activeSignal && (
              <span className="text-cyan-400 font-mono text-xs">
                Signal #{activeSignal.id}
              </span>
            )}
          </div>

          {activeSignal ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              {/* Finding Title */}
              <div>
                <h4 className="text-base font-bold text-white">
                  {activeSignal.title}
                </h4>
                <span className="text-xs text-slate-400 font-mono uppercase mt-0.5 block">
                  Category: {activeSignal.category.replace('_', ' ')}
                </span>
              </div>

              {/* OBSERVED */}
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  OBSERVED
                </span>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-sm font-mono text-rose-300 leading-relaxed">
                  "{activeSignal.evidence || 'No quote extracted'}"
                </div>
              </div>

              {/* INFERENCE */}
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  INFERENCE
                </span>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  {activeSignal.explanation}
                </p>
              </div>

              {/* RISK */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                    RISK CONTRIBUTION
                  </span>
                  <span className="text-lg font-mono font-extrabold text-rose-400">
                    +{activeSignal.weight} points
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-400 block">
                    SEVERITY
                  </span>
                  <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                    {activeSignal.severity}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-500">
              Select a signal to inspect observed evidence and risk inference.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
