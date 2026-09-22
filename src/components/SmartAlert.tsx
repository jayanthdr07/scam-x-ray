import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  X,
  ShieldCheck,
  Radio,
  Lock
} from 'lucide-react';

export interface InterceptedAction {
  id: string;
  url: string;
  reason: string;
  category: 'financial' | 'domain' | 'off_platform' | 'credential' | 'other';
  severity: 'critical' | 'high' | 'medium';
  targetLabel?: string;
  timestamp: number;
}

interface SmartAlertProps {
  interceptedAction: InterceptedAction | null;
  onDismiss: () => void;
  onProceedAnyway: (url: string) => void;
}

export const SmartAlert: React.FC<SmartAlertProps> = ({
  interceptedAction,
  onDismiss,
  onProceedAnyway,
}) => {
  const [copied, setCopied] = useState(false);
  const [defangedCopied, setDefangedCopied] = useState(false);

  useEffect(() => {
    if (!interceptedAction) {
      setCopied(false);
      setDefangedCopied(false);
    }
  }, [interceptedAction]);

  if (!interceptedAction) {
    return null;
  }

  // Defang URL for safe inspection (e.g., hxxps://domain[.]com)
  const defangUrl = (url: string) => {
    return url
      .replace(/^https?:\/\//i, (match) => (match.toLowerCase().startsWith('https') ? 'hxxps://' : 'hxxp://'))
      .replace(/\./g, '[.]');
  };

  const handleCopyDefanged = () => {
    navigator.clipboard.writeText(defangUrl(interceptedAction.url));
    setDefangedCopied(true);
    setTimeout(() => setDefangedCopied(false), 2000);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/50 font-mono text-[10px] font-bold uppercase tracking-wider animate-pulse">
            🚨 CRITICAL THREAT
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/50 font-mono text-[10px] font-bold uppercase tracking-wider">
            ⚠️ HIGH RISK
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-yellow-950 text-yellow-300 border border-yellow-500/50 font-mono text-[10px] font-bold uppercase tracking-wider">
            CAUTION
          </span>
        );
    }
  };

  return (
    <aside
      aria-label="High-Risk Action Intercepted Alert"
      className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      <div className="rounded-2xl border-2 border-rose-500/80 bg-slate-950/95 p-5 shadow-[0_10px_35px_rgba(244,63,94,0.3)] backdrop-blur-xl ring-1 ring-rose-500/30 text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-400 shadow-inner">
              <ShieldAlert className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold font-display uppercase tracking-wider text-white">
                  Smart Alert Intercept
                </h4>
                {getSeverityBadge(interceptedAction.severity)}
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                SCAMTRACE Real-Time Defense Shield Triggered
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
            title="Dismiss Alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Body */}
        <div className="space-y-3 mb-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-200 leading-relaxed">
            <strong className="text-rose-400 block mb-1">
              Malicious or Unverified Action Blocked:
            </strong>
            {interceptedAction.reason}
          </div>

          {/* Target URL / Address */}
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Target Destination:
            </span>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-rose-300 font-mono text-[11px] break-all select-all flex items-center justify-between gap-2">
              <span className="truncate">{interceptedAction.url}</span>
              <button
                type="button"
                onClick={handleCopyDefanged}
                className="shrink-0 text-slate-400 hover:text-cyan-300 p-1"
                title="Copy safe defanged URL"
              >
                {defangedCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 border-t border-slate-900 font-mono text-xs">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Abort Action (Safe)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onProceedAnyway(interceptedAction.url);
              onDismiss();
            }}
            className="w-full sm:w-auto py-2 px-3 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-colors flex items-center justify-center gap-1 text-[11px]"
            title="Open in new tab despite warning"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Proceed Anyway</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
