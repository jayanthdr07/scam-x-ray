import React from 'react';
import { Search, ShieldCheck, GitFork, ShieldAlert, ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="how-it-works-section" className="pt-10 pb-8 text-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Small label */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/60 text-cyan-400 text-xs font-mono mb-5 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>AI-POWERED JOB OFFER INVESTIGATION</span>
        </div>

        {/* Main heading */}
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-[1.15]">
          Don't just detect the scam.{' '}
          <span className="text-cyan-400">Trace it.</span>
        </h1>

        {/* Supporting text */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-7 leading-relaxed">
          Investigate suspicious job offers, recruiter messages, URLs, PDFs and screenshots before you pay, click, or share sensitive information.
        </p>

        {/* Simple 4-step compact horizontal progression */}
        <div className="inline-flex flex-wrap items-center justify-center gap-1 sm:gap-2 px-3.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/40 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1.5 py-1 px-2">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-200">DETECT</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

          <div className="flex items-center gap-1.5 py-1 px-2">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold text-slate-200">VERIFY</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

          <div className="flex items-center gap-1.5 py-1 px-2">
            <GitFork className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-semibold text-slate-200">TRACE</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

          <div className="flex items-center gap-1.5 py-1 px-2">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-200">PROTECT</span>
          </div>
        </div>
      </div>
    </section>
  );
};
