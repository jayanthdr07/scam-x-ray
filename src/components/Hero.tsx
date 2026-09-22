import React from 'react';
import { Search, ShieldAlert, GitFork, CheckCircle2, Crosshair, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-8 pb-4 text-center overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono mb-4 tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>CYBERSECURITY EMPLOYMENT FRAUD INVESTIGATION</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white mb-3">
          Don't just detect the scam.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
            Trace it.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-6">
          Investigate suspicious job offers, recruiter messages, URLs, PDFs, and screenshots before you pay, click, or disclose sensitive national identity data.
        </p>

        {/* 6-Stage Forensic Methodology Pill Chain */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-semibold">
            1. DETECT
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-sky-300 font-semibold">
            2. VERIFY
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-amber-300 font-semibold">
            3. TRACE
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-purple-300 font-semibold">
            4. EXPLAIN
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-rose-300 font-semibold">
            5. CHALLENGE
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-300 font-semibold">
            6. PROTECT
          </span>
        </div>
      </div>
    </section>
  );
};
