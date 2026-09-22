import React from 'react';
import { Scale, RefreshCw } from 'lucide-react';
import { RedTeamReview } from '../types/analysis';
import { Button } from './ui/Button';

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
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base" role="img" aria-label="boxing glove">🥊</span>
            <h4 className="text-sm font-bold text-white">
              Challenge the Verdict (AI Red Team)
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Adversarial auditor that challenges the fraud assessment to test for potential false positives
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={onRunRedTeam}
          disabled={isRunning}
          isLoading={isRunning}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          {redTeam ? 'Re-Run Red Team' : 'Run Red Team'}
        </Button>
      </div>

      {redTeam ? (
        <div className="space-y-4">
          {/* Comparison */}
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Adjustment Recommendation:</span>
              <span className="font-semibold text-white uppercase mt-0.5 inline-block">
                {redTeam.verdictAdjustment}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <span className="text-slate-400">Initial: <strong className="text-slate-200">{initialScore}</strong></span>
              <span className="text-slate-600">→</span>
              <span className="text-cyan-400">Audited: <strong className="text-white">{redTeam.reviewedScore}</strong></span>
            </div>
          </div>

          {/* Skeptical Critique */}
          {redTeam.skepticalCritique && (
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Adversarial Counter-Argument
              </span>
              <p className="text-xs text-slate-300 leading-relaxed p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                {redTeam.skepticalCritique}
              </p>
            </div>
          )}

          {/* Potential False Positives */}
          {redTeam.potentialFalsePositives && redTeam.potentialFalsePositives.length > 0 && (
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Identified Potential False Positives
              </span>
              <ul className="space-y-1.5 p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
                {redTeam.potentialFalsePositives.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800/80 text-center text-xs text-slate-400">
          Run the Red Team review to test whether this offer could be a legitimate but rushed startup hiring workflow.
        </div>
      )}
    </div>
  );
};
