import React from 'react';
import { Dna, Info, AlertTriangle, Shield } from 'lucide-react';
import { ScamDnaProfile } from '../types/analysis';

interface ScamDnaRadarProps {
  dna: ScamDnaProfile;
}

export const ScamDnaRadar: React.FC<ScamDnaRadarProps> = ({ dna }) => {
  const metrics = [
    { label: 'Financial Pressure', value: dna.financialPressure || 0, color: 'from-rose-500 to-red-600', text: 'text-rose-400' },
    { label: 'Urgency & Pressure', value: dna.urgency || 0, color: 'from-amber-500 to-orange-600', text: 'text-amber-400' },
    { label: 'Data Harvesting', value: dna.dataHarvesting || 0, color: 'from-purple-500 to-indigo-600', text: 'text-purple-400' },
    { label: 'Credential Harvesting', value: dna.credentialHarvesting || 0, color: 'from-red-600 to-rose-700', text: 'text-red-400' },
    { label: 'Impersonation Signals', value: dna.impersonation || 0, color: 'from-sky-500 to-blue-600', text: 'text-sky-400' },
    { label: 'Fake Recruitment Anomalies', value: dna.fakeRecruitment || 0, color: 'from-cyan-500 to-teal-600', text: 'text-cyan-400' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="cyber-card rounded-2xl border border-cyan-500/25 p-6 sm:p-7 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-400">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
                SCAM DNA PROFILE
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Multi-dimensional forensic intensity mapping
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400">
            6 Vector Metrics
          </span>
        </div>

        {/* DNA Bars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800"
            >
              <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                <span className="text-slate-300 font-medium">{metric.label}</span>
                <span className={`font-bold ${metric.text}`}>{metric.value} / 100</span>
              </div>
              {/* Progress track */}
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/80">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${metric.color} transition-all duration-1000`}
                  style={{ width: `${Math.max(4, metric.value)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mandatory Forensic Disclaimer */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
          <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <span>
            <strong>Forensic Notice:</strong> Scam DNA represents detected behavioral patterns across standard fraud categories, not a definitive legal or criminal classification.
          </span>
        </div>
      </div>
    </div>
  );
};
