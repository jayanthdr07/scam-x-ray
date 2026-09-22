import React from 'react';
import { Dna } from 'lucide-react';
import { ScamDnaProfile } from '../types/analysis';
import { Badge } from './ui/Badge';

interface ScamDnaRadarProps {
  dna: ScamDnaProfile;
}

export const ScamDnaRadar: React.FC<ScamDnaRadarProps> = ({ dna }) => {
  const bars = [
    { label: 'Financial Pressure', value: dna.financialPressure || 0, color: 'bg-rose-500' },
    { label: 'Urgency', value: dna.urgency || 0, color: 'bg-amber-500' },
    { label: 'Data Harvesting', value: dna.dataHarvesting || 0, color: 'bg-purple-500' },
    { label: 'Impersonation', value: dna.impersonation || 0, color: 'bg-sky-500' },
  ];

  // Derive primary pattern from highest vector
  const getPrimaryPattern = () => {
    const fin = dna.financialPressure || 0;
    const urg = dna.urgency || 0;
    const data = dna.dataHarvesting || 0;
    const imp = dna.impersonation || 0;

    if (fin >= 30) return 'Advance Fee Fraud';
    if (data >= 30) return 'Identity & Data Harvesting';
    if (imp >= 30) return 'Recruiter Impersonation';
    if (urg >= 30) return 'Coercive Urgency Pressure';
    if (fin > 0 || urg > 0 || data > 0 || imp > 0) return 'Suspicious Recruitment';
    return 'Baseline Behavior';
  };

  const primaryPattern = getPrimaryPattern();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Scam DNA
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Detected behavioral patterns
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Primary Pattern:</span>
            <Badge variant="warning" size="sm">
              {primaryPattern}
            </Badge>
          </div>
        </div>

        {/* Compact Horizontal Bars */}
        <div className="space-y-3">
          {bars.map((bar) => (
            <div key={bar.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">{bar.label}</span>
                <span className="font-mono text-slate-400 font-semibold">{bar.value}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/80">
                <div
                  className={`h-full rounded-full ${bar.color} transition-all duration-700`}
                  style={{ width: `${Math.min(100, Math.max(2, bar.value))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
