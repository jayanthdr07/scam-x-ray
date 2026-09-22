import React from 'react';
import { Shield, ShieldAlert, Terminal, Sparkles, Lock, BookOpen, Search } from 'lucide-react';

interface HeaderProps {
  onOpenEmailAnalyzer?: () => void;
  onNavigateToLibrary?: () => void;
  onNavigateToScanner?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenEmailAnalyzer,
  onNavigateToLibrary,
  onNavigateToScanner,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={onNavigateToScanner}
          title="Back to Scanner Home"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-slate-900 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Shield className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-wider font-display text-white">
                SCAM<span className="text-cyan-400">TRACE</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-cyan-500/30 text-cyan-300 bg-cyan-950/50">
                AI Defense v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">
              "Don't just detect the scam. Trace it."
            </p>
          </div>
        </div>

        {/* Center Navigation on medium+ screens */}
        <nav className="hidden lg:flex items-center gap-2">
          <button
            type="button"
            onClick={onNavigateToScanner}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-cyan-300 px-3 py-1.5 rounded-lg hover:bg-slate-900 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Investigate Offer</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToLibrary}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-cyan-300 px-3 py-1.5 rounded-lg hover:bg-slate-900 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pattern Library</span>
          </button>
        </nav>

        {/* Right side status badges & utility */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="btn-header-pattern-library"
            type="button"
            onClick={onNavigateToLibrary}
            className="lg:hidden flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-cyan-300 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60"
            title="Browse Scam Pattern Library"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Library</span>
          </button>

          <button
            id="btn-header-email-analyzer"
            type="button"
            onClick={onOpenEmailAnalyzer}
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-500/30 hover:border-cyan-400/60 bg-cyan-950/30 hover:bg-cyan-950/60 transition-colors"
            title="Inspect raw email headers for SPF/DKIM"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inspect Headers</span>
          </button>

          {/* Smart Shield Live Status indicator */}
          <div className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-300 hidden sm:inline">Shield Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
