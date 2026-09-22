import React, { useState, useEffect } from 'react';
import { Sliders, RefreshCw, ArrowRight } from 'lucide-react';
import { RawAiAnalysis, ThreatIndexResult } from '../types/analysis';
import { calculateThreatIndex } from '../lib/scoring/risk-engine';
import { Button } from './ui/Button';

interface RiskSimulatorProps {
  analysis: RawAiAnalysis;
  initialThreatIndex: ThreatIndexResult;
}

export const RiskSimulator: React.FC<RiskSimulatorProps> = ({
  analysis,
  initialThreatIndex,
}) => {
  const allInitialFactors = initialThreatIndex.factorContributions;
  const [activeFactorIds, setActiveFactorIds] = useState<string[]>(
    allInitialFactors.map((f) => f.id)
  );
  const [simulatedIndex, setSimulatedIndex] = useState<ThreatIndexResult>(initialThreatIndex);

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
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-white">
            Risk Simulator
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Toggle observed signals to see how removing specific demands impacts the final score
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={resetAll}
          icon={<RefreshCw className="w-3 h-3" />}
        >
          Reset Weights
        </Button>
      </div>

      {/* Score Shift Comparison */}
      <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Base Score</span>
            <span className="text-lg font-bold text-slate-200">{initialThreatIndex.score}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600" />
          <div>
            <span className="text-[10px] text-cyan-400 block uppercase">Simulated</span>
            <span className="text-lg font-bold text-cyan-300">{simulatedIndex.score}</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 block uppercase">Score Shift</span>
          <span
            className={`text-xs font-bold ${
              scoreDiff < 0
                ? 'text-emerald-400'
                : scoreDiff > 0
                ? 'text-rose-400'
                : 'text-slate-400'
            }`}
          >
            {scoreDiff === 0 ? '0 pts (All Active)' : `${scoreDiff > 0 ? '+' : ''}${scoreDiff} pts`}
          </span>
        </div>
      </div>

      {/* Checkbox Factor Toggles */}
      <div className="space-y-2">
        {allInitialFactors.map((factor) => {
          const isActive = activeFactorIds.includes(factor.id);
          return (
            <label
              key={factor.id}
              className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors text-xs ${
                isActive
                  ? 'border-slate-800 bg-slate-900/70 text-slate-200'
                  : 'border-slate-800/40 bg-slate-950/40 text-slate-500'
              }`}
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => toggleFactor(factor.id)}
                className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-950 cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${isActive ? 'text-slate-200' : 'line-through text-slate-500'}`}>
                    {factor.title}
                  </span>
                  <span className="font-mono text-cyan-400 ml-2">
                    +{factor.weight} pts
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  "{factor.evidence}"
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};
