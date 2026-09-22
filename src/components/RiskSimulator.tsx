import React, { useState, useEffect } from 'react';
import { Sliders, RefreshCw, Zap, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { RawAiAnalysis, ThreatIndexResult } from '../types/analysis';
import { calculateThreatIndex } from '../lib/scoring/risk-engine';

interface RiskSimulatorProps {
  analysis: RawAiAnalysis;
  initialThreatIndex: ThreatIndexResult;
}

export const RiskSimulator: React.FC<RiskSimulatorProps> = ({
  analysis,
  initialThreatIndex,
}) => {
  // Extract all unique factors present in initial calculation
  const allInitialFactors = initialThreatIndex.factorContributions;

  // Active factor set for simulation
  const [activeFactorIds, setActiveFactorIds] = useState<string[]>(
    allInitialFactors.map((f) => f.id)
  );

  // Simulated score state
  const [simulatedIndex, setSimulatedIndex] = useState<ThreatIndexResult>(initialThreatIndex);

  // Recalculate whenever active factors toggle
  useEffect(() => {
    const updated = calculateThreatIndex(analysis, activeFactorIds);
    setSimulatedIndex(updated);
  }, [activeFactorIds, analysis]);

  const toggleFactor = (id: string) => {
    setActiveFactorIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetAll = () => {
    setActiveFactorIds(allInitialFactors.map((f) => f.id));
  };

  const scoreDiff = simulatedIndex.score - initialThreatIndex.score;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="cyber-card rounded-2xl border border-cyan-500/25 p-6 sm:p-7 shadow-xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/70 border border-cyan-500/30 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
                  RISK SIMULATOR: WHAT DRIVES THE SCORE?
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Interactive Logic Engine
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">
                Toggle signals on or off to inspect the deterministic formula weights
              </p>
            </div>
          </div>

          <button
            id="btn-reset-simulator"
            type="button"
            onClick={resetAll}
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/30 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Weights</span>
          </button>
        </div>

        {/* Live Simulation Score Differential Banner */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Original Threat Index
              </span>
              <span className="text-2xl font-black font-display text-white">
                {initialThreatIndex.score}
                <span className="text-xs font-mono text-slate-500"> / 100</span>
              </span>
            </div>

            <ArrowRight className="w-5 h-5 text-cyan-400 shrink-0" />

            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400 block">
                Simulated Threat Index
              </span>
              <span className="text-2xl font-black font-display text-cyan-300">
                {simulatedIndex.score}
                <span className="text-xs font-mono text-slate-500"> / 100</span>
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block">Simulation Delta</span>
            <span
              className={`text-sm font-mono font-bold ${
                scoreDiff < 0
                  ? 'text-emerald-400'
                  : scoreDiff > 0
                  ? 'text-rose-400'
                  : 'text-slate-400'
              }`}
            >
              {scoreDiff === 0
                ? '0 pts (All Active)'
                : `${scoreDiff > 0 ? '+' : ''}${scoreDiff} points`}
            </span>
          </div>
        </div>

        {/* Interactive Factor Toggle Checklist */}
        <div className="space-y-2.5 mb-5">
          <span className="text-xs font-mono uppercase text-slate-400 tracking-wider block mb-2">
            Active Factor Weights (Click checkbox to toggle factor):
          </span>

          {allInitialFactors.map((factor) => {
            const isActive = activeFactorIds.includes(factor.id);

            return (
              <label
                key={factor.id}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  isActive
                    ? 'border-cyan-500/40 bg-slate-900/90'
                    : 'border-slate-800 bg-slate-950/40 opacity-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => toggleFactor(factor.id)}
                  className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-950 cursor-pointer"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold font-mono ${
                        isActive ? 'text-white' : 'text-slate-500 line-through'
                      }`}
                    >
                      {factor.title}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        isActive ? 'text-cyan-400' : 'text-slate-600'
                      }`}
                    >
                      +{factor.weight} pts
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate max-w-xl">
                    "{factor.evidence}"
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Educational Callout */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 flex items-start gap-2">
          <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong>Deterministic Transparency:</strong> The SCAMTRACE risk engine uses fixed rule-based mathematical contributions. This proves how removing even one high-risk component (like a payment request) significantly lowers the threat assessment.
          </span>
        </div>
      </div>
    </div>
  );
};
