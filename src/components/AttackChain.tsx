import React from 'react';
import {
  UserCheck,
  Clock,
  CreditCard,
  FileSpreadsheet,
  ArrowRight,
  ArrowDown,
  GitCommit,
} from 'lucide-react';
import { AttackChainStep } from '../types/analysis';

interface AttackChainProps {
  steps: AttackChainStep[];
}

export const AttackChain: React.FC<AttackChainProps> = ({ steps }) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  // Canonical attack stages to display in order
  const stageDefinitions = [
    {
      id: 'trust',
      title: 'TRUST',
      defaultTitle: 'Trust Establishment',
      icon: <UserCheck className="w-4 h-4 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300',
    },
    {
      id: 'urgency',
      title: 'URGENCY',
      defaultTitle: 'Urgency & Pressure',
      icon: <Clock className="w-4 h-4 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-950/20 text-amber-300',
    },
    {
      id: 'financial',
      title: 'MONEY',
      defaultTitle: 'Financial Extraction',
      icon: <CreditCard className="w-4 h-4 text-rose-400" />,
      color: 'border-rose-500/30 bg-rose-950/20 text-rose-300',
    },
    {
      id: 'data',
      title: 'DATA',
      defaultTitle: 'Data Harvesting',
      icon: <FileSpreadsheet className="w-4 h-4 text-purple-400" />,
      color: 'border-purple-500/30 bg-purple-950/20 text-purple-300',
    },
  ];

  // Match existing steps to the 4 canonical stages or use step sequence
  const displayStages = stageDefinitions.map((def, idx) => {
    const matched = steps.find(
      (s) =>
        s.stage?.toLowerCase() === def.id ||
        s.title?.toLowerCase().includes(def.id) ||
        (def.id === 'financial' && s.stage?.toLowerCase() === 'money')
    );

    const fallbackStep = steps[idx] || steps[0];
    const evidence = matched?.evidence || fallbackStep?.evidence || 'No specific quote';
    const explanation = matched?.explanation || fallbackStep?.explanation || 'Manipulation pattern observed in communication.';
    const title = matched?.title || def.defaultTitle;

    return {
      stageName: def.title,
      title,
      icon: def.icon,
      color: def.color,
      evidence,
      explanation,
    };
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Attack Chain
          </h3>
        </div>
        <span className="text-xs text-slate-500">
          Progression of social engineering tactics
        </span>
      </div>

      {/* Desktop Horizontal Progression & Mobile Vertical Progression */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        {/* Desktop View: Horizontal 4-Stage Chain */}
        <div className="hidden md:grid md:grid-cols-4 gap-3 items-stretch">
          {displayStages.map((stage, idx) => (
            <div key={idx} className="relative flex flex-col justify-between">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 h-full flex flex-col justify-between">
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-400">
                      {stage.stageName}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                      {stage.icon}
                    </div>
                  </div>

                  {/* Stage Title */}
                  <h4 className="text-xs font-semibold text-slate-200 mb-2 leading-snug">
                    {stage.title}
                  </h4>

                  {/* Evidence Snippet */}
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800/60 text-[11px] font-mono text-slate-300 italic mb-2 line-clamp-2">
                    "{stage.evidence}"
                  </div>
                </div>

                {/* One-Line Explanation */}
                <p className="text-[11px] text-slate-400 line-clamp-2 pt-2 border-t border-slate-800/60">
                  {stage.explanation}
                </p>
              </div>

              {/* Arrow connector between stages */}
              {idx < displayStages.length - 1 && (
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden">
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile View: Vertical Progression */}
        <div className="flex flex-col md:hidden space-y-2">
          {displayStages.map((stage, idx) => (
            <React.Fragment key={idx}>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {stage.stageName}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {stage.icon}
                  </div>
                </div>

                <h4 className="text-xs font-semibold text-slate-200 mb-1">
                  {stage.title}
                </h4>

                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 italic mb-2">
                  "{stage.evidence}"
                </div>

                <p className="text-xs text-slate-400">
                  {stage.explanation}
                </p>
              </div>

              {idx < displayStages.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
