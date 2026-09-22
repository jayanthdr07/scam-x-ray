import React from 'react';
import { Shield, Sparkles, Scale, AlertOctagon, HelpCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { RedTeamReview } from '../types/analysis';

interface RedTeamPanelProps {
  redTeam?: RedTeamReview;
  onRunRedTeam: () => Promise<void>;
  isRunning: boolean;
  initialScore: number;
}

export const RedTeamPanel: React.FC<RedTeamPanelProps> = ({
  redTeam,
  onRunRedTeam,
  isRunning,
  initialScore,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="cyber-card rounded-2xl border border-purple-500/30 p-6 sm:p-7 shadow-xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-950/70 border border-purple-500/40 text-purple-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
                  ADVERSARIAL AI RED TEAM REVIEW
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                  Contrarian Auditor
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">
                Skeptically challenges the initial fraud assessment to prevent false positives
              </p>
            </div>
          </div>

          <button
            id="btn-run-red-team"
            type="button"
            onClick={onRunRedTeam}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs shadow-md transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isRunning ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Challenging Assessment...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{redTeam ? 'Re-Run Red Team' : 'Run Red Team Review'}</span>
              </>
            )}
          </button>
        </div>

        {redTeam ? (
          <div className="space-y-5">
            {/* Verdict Comparison Banner */}
            <div className="p-4 rounded-xl bg-slate-900 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Red Team Verdict Adjustment
                </span>
                <p className="text-sm font-bold text-white mt-0.5">
                  Recommendation:{' '}
                  <span className={
                    redTeam.verdictAdjustment === 'downward'
                      ? 'text-emerald-400'
                      : redTeam.verdictAdjustment === 'upward'
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }>
                    {redTeam.verdictAdjustment.toUpperCase()} (Reviewed Score: {redTeam.reviewedScore}/100 vs Initial: {initialScore}/100)
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400">
                  Initial: <strong className="text-white">{initialScore}</strong>
                </div>
                <span className="text-slate-600">→</span>
                <div className="px-3 py-1.5 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-300">
                  Red Team: <strong className="text-white">{redTeam.reviewedScore}</strong>
                </div>
              </div>
            </div>

            {/* Skeptical Critique */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800">
              <span className="text-xs font-mono uppercase text-purple-400 font-bold tracking-wider block mb-1.5">
                Adversarial Defense Critique
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {redTeam.skepticalCritique}
              </p>
            </div>

            {/* 2-Column Split: Strongest Fraud Evidence vs Counter-Evidence (Legitimacy Nuances) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Supporting Evidence */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30">
                <div className="flex items-center gap-1.5 text-rose-400 text-xs font-mono font-bold uppercase mb-2">
                  <AlertOctagon className="w-4 h-4" />
                  <span>Strongest Evidence for Risk</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 font-mono list-disc pl-4">
                  {redTeam.supportingEvidence?.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>

              {/* Counter-Evidence */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-bold uppercase mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Counter-Evidence / Benign Nuances</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 font-mono list-disc pl-4">
                  {redTeam.counterEvidence?.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Potential False Positives & Missing Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">
                  Potential False Positives:
                </span>
                <ul className="text-slate-400 space-y-1 list-disc pl-4">
                  {redTeam.potentialFalsePositives?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300 font-bold block mb-1">
                  Missing Information to Confirm:
                </span>
                <ul className="text-slate-400 space-y-1 list-disc pl-4">
                  {redTeam.missingInformation?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl bg-slate-900/60 border border-dashed border-slate-800">
            <Scale className="w-8 h-8 text-purple-400 mx-auto mb-2 opacity-80" />
            <p className="text-sm text-slate-300 font-medium mb-1">
              Test this assessment with an Adversarial Red Team Review
            </p>
            <p className="text-xs text-slate-500 font-mono mb-4 max-w-md mx-auto">
              Simulates a skeptical defense to investigate whether any requests have benign corporate explanations or if inferences were over-sensitive.
            </p>
            <button
              type="button"
              onClick={onRunRedTeam}
              disabled={isRunning}
              className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 text-xs font-mono transition-colors cursor-pointer"
            >
              Launch Red Team Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
