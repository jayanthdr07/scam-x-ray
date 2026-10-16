import React, { useState } from 'react';
import { Shield, Search, BookOpen, Info, Play, Menu, X, Mic, Box } from 'lucide-react';
import { Button } from './ui/Button';

interface HeaderProps {
  onOpenEmailAnalyzer?: () => void;
  onNavigateToLibrary?: () => void;
  onNavigateToScanner?: () => void;
  onNavigateToHowItWorks?: () => void;
  onNavigateTo3DCore?: () => void;
  onOpenLiveVoice?: () => void;
  onTryDemo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateToLibrary,
  onNavigateToScanner,
  onNavigateToHowItWorks,
  onNavigateTo3DCore,
  onOpenLiveVoice,
  onTryDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={onNavigateToScanner}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          title="SCAMTRACE Home"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/50 transition-colors">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white font-mono">
              SCAM<span className="text-cyan-400">TRACE</span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            type="button"
            onClick={onNavigateToScanner}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-900/80 transition-colors"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Investigate</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToLibrary}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-900/80 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Patterns</span>
          </button>

          <button
            type="button"
            onClick={onNavigateTo3DCore}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-900/80 transition-colors"
          >
            <Box className="w-4 h-4 text-slate-400" />
            <span>3D Sentinel</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToHowItWorks}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-900/80 transition-colors"
          >
            <Info className="w-4 h-4 text-slate-400" />
            <span>How It Works</span>
          </button>
        </nav>

        {/* Desktop Right CTAs: Live Voice AI + Try Demo */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenLiveVoice}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-medium shadow-sm transition"
          >
            <Mic className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Live Voice AI</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-900/80 text-cyan-200">
              LIVE
            </span>
          </button>

          <Button
            size="sm"
            variant="secondary"
            icon={<Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />}
            onClick={onTryDemo}
          >
            Try Demo
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={onTryDemo}
            className="text-xs px-2.5 h-8"
          >
            Demo
          </Button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateToScanner?.();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Investigate</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateToLibrary?.();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Patterns</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateTo3DCore?.();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
          >
            <Box className="w-4 h-4 text-cyan-400" />
            <span>3D Sentinel Core</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenLiveVoice?.();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-cyan-300 hover:bg-slate-900 font-medium"
          >
            <Mic className="w-4 h-4 text-cyan-400" />
            <span>Live Voice AI (Gemini 3.8)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateToHowItWorks?.();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
          >
            <Info className="w-4 h-4 text-cyan-400" />
            <span>How It Works</span>
          </button>
        </div>
      )}
    </header>
  );
};
