import React, { useState, useMemo } from 'react';
import {
  Flame,
  Layers,
  AlertTriangle,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  FileText,
  Target,
  Sparkles,
  Zap,
  CheckCircle2,
  Info
} from 'lucide-react';
import { RiskSignal, RiskCategory } from '../types/analysis';

interface RiskHeatmapProps {
  originalText?: string;
  signals: RiskSignal[];
  claimedCompany?: string | null;
  claimedRole?: string | null;
}

interface HeatSegment {
  id: number;
  title: string;
  rawText: string;
  signals: RiskSignal[];
  densityScore: number; // 0 - 100
  heatLevel: 'critical' | 'high' | 'moderate' | 'low';
  wordCount: number;
  tacticDistribution: Record<string, number>;
  charStart: number;
  charEnd: number;
}

export const RiskHeatmap: React.FC<RiskHeatmapProps> = ({
  originalText,
  signals,
  claimedCompany,
  claimedRole,
}) => {
  const [selectedSegmentId, setSelectedSegmentId] = useState<number>(0);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'segments' | 'document'>('segments');
  const [activeTooltipSignal, setActiveTooltipSignal] = useState<RiskSignal | null>(null);

  // Compute text segments and calculate density for each segment
  const segments: HeatSegment[] = useMemo(() => {
    let rawBlocks: string[] = [];

    if (originalText && originalText.trim().length > 0) {
      // Split by double newlines or single newlines if large enough
      const paragraphs = originalText
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(p => p.length > 0);

      if (paragraphs.length >= 2) {
        rawBlocks = paragraphs;
      } else {
        // Fallback: split by single newlines or sentence boundaries if one giant paragraph
        const lines = originalText.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length >= 2) {
          rawBlocks = lines;
        } else {
          // If only 1 monolithic block, split into chunks of ~250 characters
          const sentences = originalText.match(/[^.!?]+[.!?]+/g) || [originalText];
          if (sentences.length >= 3) {
            // Group sentences into 3-4 segments
            const chunkSize = Math.ceil(sentences.length / 3);
            for (let i = 0; i < sentences.length; i += chunkSize) {
              rawBlocks.push(sentences.slice(i, i + chunkSize).join(' ').trim());
            }
          } else {
            rawBlocks = [originalText];
          }
        }
      }
    } else {
      // If no raw text was passed (e.g. URL or image mode), reconstruct synthetic segments from signals
      rawBlocks = [
        `Job Offer Notification: We are pleased to extend an employment offer for the position of ${claimedRole || 'Associate'} at ${claimedCompany || 'Enterprise Inc'}.`,
        ...signals.map(s => s.evidence),
        `Please confirm your acceptance and complete the required onboarding procedures immediately.`
      ];
    }

    let runningCharIndex = 0;

    return rawBlocks.map((blockText, idx) => {
      const lowerBlock = blockText.toLowerCase();
      const wordCount = blockText.split(/\s+/).filter(Boolean).length;

      // Find signals mapped to this block
      const matchedSignals = signals.filter(signal => {
        if (!signal.evidence) return false;
        const evidenceSnippet = signal.evidence.toLowerCase().trim();
        // Check exact or partial overlap (minimum 15 characters or whole phrase)
        const keyFragment = evidenceSnippet.slice(0, Math.min(40, evidenceSnippet.length));
        return lowerBlock.includes(keyFragment) || lowerBlock.includes(evidenceSnippet);
      });

      // Calculate tactical distribution
      const distribution: Record<string, number> = {};
      let totalWeight = 0;
      let hasCritical = false;

      matchedSignals.forEach(s => {
        distribution[s.category] = (distribution[s.category] || 0) + 1;
        totalWeight += s.weight;
        if (s.severity === 'critical' || s.weight >= 25) {
          hasCritical = true;
        }
      });

      // Also detect common manipulation keywords in the text segment if signals are sparse
      const manipulationKeywords = [
        'zelle', 'wire', 'deposit', 'check', 'equipment', 'fee', 'western union',
        'crypto', 'telegram', 'whatsapp', 'urgent', 'immediately', '24 hours',
        'ssn', 'social security', 'passport', 'bank account', 'routing number',
        'confidential', 'guarantee', 'advance'
      ];
      let keywordHits = 0;
      manipulationKeywords.forEach(kw => {
        if (lowerBlock.includes(kw)) keywordHits++;
      });

      // Normalized Density Score (0 - 100)
      // Combines signal weight, signal count, and word density
      let rawDensity = totalWeight * 1.8 + matchedSignals.length * 12 + keywordHits * 6;
      if (hasCritical) rawDensity = Math.max(rawDensity, 75);
      const densityScore = Math.min(100, Math.round(rawDensity));

      // Determine Heat Level
      let heatLevel: 'critical' | 'high' | 'moderate' | 'low' = 'low';
      if (densityScore >= 65 || hasCritical) {
        heatLevel = 'critical';
      } else if (densityScore >= 38) {
        heatLevel = 'high';
      } else if (densityScore >= 15) {
        heatLevel = 'moderate';
      }

      // Generate a descriptive section title
      let sectionTitle = `Section ${idx + 1}`;
      if (idx === 0) sectionTitle = 'Section 1: Introduction & Offer Terms';
      else if (lowerBlock.includes('equipment') || lowerBlock.includes('pay') || lowerBlock.includes('check') || lowerBlock.includes('bank')) {
        sectionTitle = `Section ${idx + 1}: Financial & Equipment Logistics`;
      } else if (lowerBlock.includes('urgent') || lowerBlock.includes('immediately') || lowerBlock.includes('hours') || lowerBlock.includes('deadline')) {
        sectionTitle = `Section ${idx + 1}: Acceptance & Urgency Deadline`;
      } else if (lowerBlock.includes('id') || lowerBlock.includes('form') || lowerBlock.includes('passport') || lowerBlock.includes('ssn')) {
        sectionTitle = `Section ${idx + 1}: Personal Identity & Onboarding Forms`;
      } else if (idx === rawBlocks.length - 1) {
        sectionTitle = `Section ${idx + 1}: Sign-off & Confirmation Directive`;
      }

      const startChar = runningCharIndex;
      runningCharIndex += blockText.length;

      return {
        id: idx,
        title: sectionTitle,
        rawText: blockText,
        signals: matchedSignals,
        densityScore,
        heatLevel,
        wordCount,
        tacticDistribution: distribution,
        charStart: startChar,
        charEnd: runningCharIndex,
      };
    });
  }, [originalText, signals, claimedCompany, claimedRole]);

  // Determine the highest risk epicenter segment
  const highestHeatSegment = useMemo(() => {
    return [...segments].sort((a, b) => b.densityScore - a.densityScore)[0] || segments[0];
  }, [segments]);

  // Filter segments based on category filter
  const filteredSegments = useMemo(() => {
    if (selectedCategoryFilter === 'all') return segments;
    return segments.filter(seg => {
      if (selectedCategoryFilter === 'critical_only') {
        return seg.heatLevel === 'critical' || seg.heatLevel === 'high';
      }
      return !!seg.tacticDistribution[selectedCategoryFilter];
    });
  }, [segments, selectedCategoryFilter]);

  const activeSegment = segments.find(s => s.id === selectedSegmentId) || segments[0] || highestHeatSegment;

  const getHeatBgColor = (level: 'critical' | 'high' | 'moderate' | 'low') => {
    switch (level) {
      case 'critical':
        return 'bg-rose-500';
      case 'high':
        return 'bg-amber-500';
      case 'moderate':
        return 'bg-yellow-500';
      default:
        return 'bg-emerald-500';
    }
  };

  const getHeatBadge = (level: 'critical' | 'high' | 'moderate' | 'low', score: number) => {
    switch (level) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/60 text-rose-300 font-bold">
            <Flame className="w-3 h-3 text-rose-400" />
            CRITICAL HOTSPOT ({score}%)
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 font-bold">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            HIGH DENSITY ({score}%)
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-yellow-950/80 border border-yellow-500/40 text-yellow-300">
            MODERATE CONCERN ({score}%)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            LOW / NEUTRAL ({score}%)
          </span>
        );
    }
  };

  // Helper to highlight suspicious quotes inside a text block
  const renderHighlightedBlock = (text: string, segSignals: RiskSignal[]) => {
    if (!segSignals || segSignals.length === 0) {
      return <span>{text}</span>;
    }

    // Collect quote snippets to highlight
    const snippets = segSignals
      .filter(s => s.evidence && s.evidence.trim().length > 0)
      .map(s => ({
        quote: s.evidence.trim(),
        signal: s,
      }))
      .sort((a, b) => b.quote.length - a.quote.length);

    let parts: Array<{ text: string; signal?: RiskSignal }> = [{ text }];

    snippets.forEach(({ quote, signal }) => {
      const newParts: Array<{ text: string; signal?: RiskSignal }> = [];

      parts.forEach(part => {
        if (part.signal) {
          // Already highlighted
          newParts.push(part);
          return;
        }

        const lowerPart = part.text.toLowerCase();
        const lowerQuote = quote.toLowerCase();
        const idx = lowerPart.indexOf(lowerQuote);

        if (idx !== -1) {
          const before = part.text.slice(0, idx);
          const matched = part.text.slice(idx, idx + quote.length);
          const after = part.text.slice(idx + quote.length);

          if (before) newParts.push({ text: before });
          newParts.push({ text: matched, signal });
          if (after) newParts.push({ text: after });
        } else {
          // Try a shorter 25-char fragment match if full quote split across line wraps
          const fragment = lowerQuote.slice(0, Math.min(25, lowerQuote.length));
          const fragIdx = lowerPart.indexOf(fragment);
          if (fragIdx !== -1 && fragment.length >= 12) {
            const before = part.text.slice(0, fragIdx);
            const matched = part.text.slice(fragIdx, fragIdx + fragment.length);
            const after = part.text.slice(fragIdx + fragment.length);
            if (before) newParts.push({ text: before });
            newParts.push({ text: matched, signal });
            if (after) newParts.push({ text: after });
          } else {
            newParts.push(part);
          }
        }
      });

      parts = newParts;
    });

    return (
      <span className="leading-relaxed">
        {parts.map((p, i) => {
          if (p.signal) {
            const isCritical = p.signal.severity === 'critical' || p.signal.weight >= 20;
            return (
              <mark
                key={i}
                onClick={() => setActiveTooltipSignal(p.signal || null)}
                title={`[${p.signal.category.toUpperCase()}] ${p.signal.title} (+${p.signal.weight} pts)`}
                className={`cursor-pointer px-1 py-0.5 rounded transition-all inline ${
                  isCritical
                    ? 'bg-rose-950/90 text-rose-200 border border-rose-500/70 font-semibold shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                    : 'bg-amber-950/90 text-amber-200 border border-amber-500/60 font-semibold'
                }`}
              >
                {p.text}
              </mark>
            );
          }
          return <span key={i}>{p.text}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="cyber-card rounded-2xl border border-rose-500/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 mb-5 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
                  RISK HEATMAP
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 font-bold">
                  Tactical Density
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">
                Visualizing manipulation cluster density across the entire offer letter
              </p>
            </div>
          </div>

          {/* View Mode Toggle: Segment Cards vs Full Document */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setViewMode('segments')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                viewMode === 'segments'
                  ? 'bg-rose-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Segment Heat</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('document')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                viewMode === 'document'
                  ? 'bg-rose-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Continuous Letter</span>
            </button>
          </div>
        </div>

        {/* Narrative Explainer */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 mb-6 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-rose-300">Density Forensic Principle:</strong> Fraudulent offers disguise themselves with professional introductions, but exhibit hyper-concentrated manipulation clusters (advance fee demands, deadline pressure, and off-platform migration) in specific operational sections. The heatmap exposes these hot clusters.
          </div>
        </div>

        {/* ========================================================
            DOCUMENT THERMAL SPECTRUM MINIMAP (Visual Scrubber)
            ======================================================== */}
        <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
              Document Thermal Spectrum (Top to Bottom Flow):
            </span>
            <span className="text-slate-400">
              Epicenter:{' '}
              <strong className="text-rose-400 font-bold">
                {highestHeatSegment.title} ({highestHeatSegment.densityScore}%)
              </strong>
            </span>
          </div>

          {/* Minimap Spectrum Bar */}
          <div className="grid grid-cols-12 gap-1.5 h-7 p-1 rounded-lg bg-slate-900 border border-slate-800">
            {segments.map((seg) => {
              const isSelected = seg.id === selectedSegmentId;
              const isEpicenter = seg.id === highestHeatSegment.id;

              return (
                <div
                  key={seg.id}
                  onClick={() => setSelectedSegmentId(seg.id)}
                  title={`${seg.title} — Density: ${seg.densityScore}% (${seg.signals.length} signals)`}
                  style={{ gridColumn: `span ${Math.max(1, Math.round(12 / segments.length))}` }}
                  className={`h-full rounded cursor-pointer transition-all relative group flex items-center justify-center ${
                    isSelected ? 'ring-2 ring-white scale-105 z-10' : 'opacity-85 hover:opacity-100'
                  } ${
                    seg.heatLevel === 'critical'
                      ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                      : seg.heatLevel === 'high'
                      ? 'bg-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                      : seg.heatLevel === 'moderate'
                      ? 'bg-yellow-500/80'
                      : 'bg-emerald-500/50'
                  }`}
                >
                  {isEpicenter && (
                    <Flame className="w-3.5 h-3.5 text-white animate-bounce pointer-events-none" />
                  )}

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                    <div className="bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded shadow-xl border border-slate-700 whitespace-nowrap">
                      {seg.title} ({seg.densityScore}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Thermal Legend */}
          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 mt-2.5 pt-2 border-t border-slate-900">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                Critical (&gt;65%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                High (38-65%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-yellow-500" />
                Moderate (15-37%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/70" />
                Low (&lt;15%)
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedSegmentId(highestHeatSegment.id)}
              className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
            >
              <span>Jump to Hotspot</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Tactical Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-cyan-400" /> Filter:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('all')}
            className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-all ${
              selectedCategoryFilter === 'all'
                ? 'bg-rose-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Sections ({segments.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('critical_only')}
            className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-all ${
              selectedCategoryFilter === 'critical_only'
                ? 'bg-rose-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            🔥 Hotspots Only
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('financial')}
            className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-all ${
              selectedCategoryFilter === 'financial'
                ? 'bg-rose-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Financial Demands
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('urgency')}
            className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-all ${
              selectedCategoryFilter === 'urgency'
                ? 'bg-rose-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Urgency Traps
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('sensitive_data')}
            className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-all ${
              selectedCategoryFilter === 'sensitive_data'
                ? 'bg-rose-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            PII Harvesting
          </button>
        </div>

        {/* ========================================================
            VIEW MODE 1: SEGMENT CARDS (Default Breakdown)
            ======================================================== */}
        {viewMode === 'segments' ? (
          <div className="space-y-4">
            {filteredSegments.map((seg) => {
              const isSelected = seg.id === selectedSegmentId;
              const isEpicenter = seg.id === highestHeatSegment.id;

              return (
                <div
                  key={seg.id}
                  onClick={() => setSelectedSegmentId(seg.id)}
                  className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-rose-500/70 bg-slate-900/90 shadow-[0_0_20px_rgba(244,63,94,0.15)] ring-1 ring-rose-500/40'
                      : 'border-slate-800/90 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  {/* Segment Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-3.5 h-3.5 rounded-full shrink-0 ${getHeatBgColor(seg.heatLevel)}`}
                      />
                      <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        <span>{seg.title}</span>
                        {isEpicenter && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 font-bold">
                            EPICENTER
                          </span>
                        )}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {getHeatBadge(seg.heatLevel, seg.densityScore)}
                    </div>
                  </div>

                  {/* Density Progress Bar for Segment */}
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-3.5 border border-slate-800">
                    <div
                      className={`h-full transition-all duration-300 ${
                        seg.heatLevel === 'critical'
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                          : seg.heatLevel === 'high'
                          ? 'bg-amber-500'
                          : seg.heatLevel === 'moderate'
                          ? 'bg-yellow-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(5, seg.densityScore)}%` }}
                    />
                  </div>

                  {/* Highlighted Offer Text */}
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/90 font-mono text-xs text-slate-300 mb-3 leading-relaxed">
                    {renderHighlightedBlock(seg.rawText, seg.signals)}
                  </div>

                  {/* Tactic Badges Detected in this Segment */}
                  {seg.signals.length > 0 ? (
                    <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">
                        Concentrated Tactics ({seg.signals.length}):
                      </span>
                      {seg.signals.map((sig) => (
                        <span
                          key={sig.id}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-rose-300 flex items-center gap-1"
                        >
                          <ShieldAlert className="w-3 h-3 text-rose-400" />
                          <span>{sig.title}</span>
                          <strong className="text-white">+{sig.weight}pts</strong>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-500">
                      No deceptive manipulation patterns identified in this paragraph.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* ========================================================
             VIEW MODE 2: CONTINUOUS DOCUMENT THERMAL VIEW
             ======================================================== */
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 pb-3 border-b border-slate-800">
              <span className="flex items-center gap-1.5 font-bold uppercase text-white">
                <FileText className="w-4 h-4 text-rose-400" /> Full Offer Document Scanner
              </span>
              <span className="text-[11px] text-slate-500">
                Gutter color reflects local manipulation concentration
              </span>
            </div>

            <div className="space-y-4">
              {segments.map((seg, idx) => (
                <div key={seg.id} className="flex items-stretch gap-3 group">
                  {/* Left Gutter Heat Indicator */}
                  <div className="flex flex-col items-center w-8 shrink-0">
                    <div
                      className={`w-2.5 h-full rounded-full transition-all ${
                        seg.heatLevel === 'critical'
                          ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                          : seg.heatLevel === 'high'
                          ? 'bg-amber-500'
                          : seg.heatLevel === 'moderate'
                          ? 'bg-yellow-500/70'
                          : 'bg-slate-800'
                      }`}
                    />
                    <span className="text-[9px] font-mono text-slate-600 mt-1">
                      P{idx + 1}
                    </span>
                  </div>

                  {/* Paragraph Body with Glowing Highlights */}
                  <div
                    className={`flex-1 p-3.5 rounded-lg border transition-colors ${
                      seg.heatLevel === 'critical'
                        ? 'border-rose-500/30 bg-rose-950/10'
                        : seg.heatLevel === 'high'
                        ? 'border-amber-500/20 bg-amber-950/10'
                        : 'border-slate-800/80 bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {seg.title}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        Density: {seg.densityScore}%
                      </span>
                    </div>

                    <div className="text-slate-200 leading-relaxed">
                      {renderHighlightedBlock(seg.rawText, seg.signals)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal / Tooltip Popover for Highlighted Signal */}
        {activeTooltipSignal && (
          <div className="mt-5 p-4 rounded-xl bg-slate-900 border border-rose-500/40 animate-in fade-in duration-200 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h5 className="text-xs font-mono font-bold text-white uppercase">
                  Suspicious Signal: {activeTooltipSignal.title}
                </h5>
              </div>
              <button
                type="button"
                onClick={() => setActiveTooltipSignal(null)}
                className="text-slate-400 hover:text-white text-xs font-mono px-2 py-0.5"
              >
                ✕ Close
              </button>
            </div>
            <p className="text-xs text-slate-300 mb-2 leading-relaxed">
              {activeTooltipSignal.explanation}
            </p>
            <div className="text-[11px] font-mono text-rose-300 flex items-center justify-between pt-2 border-t border-slate-800">
              <span>Category: <strong>{activeTooltipSignal.category}</strong></span>
              <span>Weight: <strong>+{activeTooltipSignal.weight} points</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
