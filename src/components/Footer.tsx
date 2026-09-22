import React from 'react';
import { Shield, ExternalLink, Lock, AlertTriangle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top brand & advisory */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="text-base font-bold font-display text-white">
              SCAM<span className="text-cyan-400">TRACE</span>
            </span>
            <span className="text-xs font-mono text-slate-500">| Employment Defense Intelligence</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> Ephemeral In-Memory Analysis
            </span>
            <span>•</span>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              Cybercrime Portal (India) <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://www.ic3.gov"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              FBI IC3 (US) <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 leading-relaxed text-center sm:text-left">
          <strong className="text-slate-300">ADVISORY DISCLAIMER:</strong> SCAMTRACE is an automated cybersecurity decision-support tool. It computes risk likelihood based on extracted fraud patterns, linguistic cues, and public web grounding. It does not provide formal legal determinations. Job seekers should never remit payments or sensitive banking tokens for employment.
        </div>
      </div>
    </footer>
  );
};
