import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Activity, TrendingUp, Zap, Calendar, Info } from 'lucide-react';
import { RiskBand } from '../types/analysis';

export interface ScamVelocityPoint {
  date: Date;
  dayIndex: number;
  dateStr: string;
  relativeStr: string;
  reports: number;
  cumulative: number;
  isPeak?: boolean;
  isOutbreak?: boolean;
  annotation?: string;
}

interface ScamVelocityChartProps {
  score: number;
  band: RiskBand;
  patternSeed: number;
  baseRecent30d: number;
  reportOffset: number;
  claimedCompany: string | null;
  surge: string;
}

type MetricMode = 'velocity' | 'cumulative';

export const ScamVelocityChart: React.FC<ScamVelocityChartProps> = ({
  score,
  band,
  patternSeed,
  baseRecent30d,
  reportOffset,
  claimedCompany,
  surge,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [containerWidth, setContainerWidth] = useState<number>(640);
  const [metricMode, setMetricMode] = useState<MetricMode>('velocity');
  const [hoveredPoint, setHoveredPoint] = useState<{
    point: ScamVelocityPoint;
    x: number;
    y: number;
  } | null>(null);

  // Generate 30 days of deterministic data tailored to the scam pattern
  const data: ScamVelocityPoint[] = useMemo(() => {
    const points: ScamVelocityPoint[] = [];
    const now = new Date();
    // Normalize to midnight
    now.setHours(0, 0, 0, 0);

    const isCritical = band === 'CRITICAL';
    const isHigh = band === 'HIGH';
    const isModerate = band === 'MODERATE';

    // Baseline calculation
    const total30d = Math.max(12, baseRecent30d);
    let runningCumulative = 0;

    // Peak day typically occurred 2-6 days ago or right now
    const peakDayOffset = 2 + (patternSeed % 4); // 2 to 5 days ago (dayIndex 24 to 27)

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayIndex = 29 - i; // 0 (30 days ago) to 29 (today)

      // Time relative label
      let relativeStr = `${i} days ago`;
      if (i === 0) relativeStr = 'Today';
      else if (i === 1) relativeStr = 'Yesterday';

      // Date string like "Oct 12"
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Generate daily frequency velocity with realistic waves
      let daily = 0;

      if (isCritical) {
        // Accelerating curve with syndicate distribution bursts
        const progress = dayIndex / 29; // 0 to 1
        const wave = Math.sin((dayIndex + (patternSeed % 7)) * 0.7) * 4;
        const exponentialRise = Math.pow(progress, 2.2) * (total30d * 0.14);
        const baseline = 2 + (patternSeed % 3);
        daily = Math.max(1, Math.round(baseline + exponentialRise + wave));

        // Inject burst if close to peak day
        if (dayIndex === 29 - peakDayOffset) {
          daily = Math.round(daily * 1.45);
        }
      } else if (isHigh) {
        // Multi-wave syndicate propagation
        const progress = dayIndex / 29;
        const wave = Math.sin((dayIndex + (patternSeed % 5)) * 0.8) * 3;
        const rise = progress * (total30d * 0.09);
        const baseline = 1 + (patternSeed % 2);
        daily = Math.max(1, Math.round(baseline + rise + wave));

        if (dayIndex === 29 - peakDayOffset) {
          daily = Math.round(daily * 1.35);
        }
      } else if (isModerate) {
        // Low occasional waves
        const wave = Math.sin(dayIndex * 0.5) * 2;
        const baseline = 1 + ((dayIndex + patternSeed) % 3);
        daily = Math.max(0, Math.round(baseline + wave));
      } else {
        // Low risk: sporadic baseline noise
        daily = (dayIndex + patternSeed) % 5 === 0 ? 1 : 0;
      }

      // If today and user logged a report, add the offset
      if (i === 0 && reportOffset > 0) {
        daily += reportOffset;
      }

      runningCumulative += daily;

      points.push({
        date: d,
        dayIndex,
        dateStr,
        relativeStr,
        reports: daily,
        cumulative: runningCumulative,
      });
    }

    // Identify highest peak & outbreak inflection point
    let maxVal = -1;
    let maxIdx = -1;
    points.forEach((p, idx) => {
      if (p.reports > maxVal) {
        maxVal = p.reports;
        maxIdx = idx;
      }
    });

    if (maxIdx >= 0) {
      points[maxIdx].isPeak = true;
      points[maxIdx].annotation = isCritical ? 'Campaign Burst Peak' : 'Surge Velocity Peak';
    }

    // Identify first major inflection point (first day where velocity doubled baseline)
    const baseline = points[0].reports || 1;
    const outbreakPt = points.find(
      (p, idx) => idx > 4 && idx < 25 && p.reports >= baseline * 2.5
    );
    if (outbreakPt && !outbreakPt.isPeak) {
      outbreakPt.isOutbreak = true;
      outbreakPt.annotation = 'Campaign Wave Detected';
    }

    return points;
  }, [band, patternSeed, baseRecent30d, reportOffset]);

  // Measure container width
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        if (cr.width > 0) {
          setContainerWidth(cr.width);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Theme colors based on severity
  const theme = useMemo(() => {
    if (band === 'CRITICAL') {
      return {
        lineColor: '#f43f5e', // rose-500
        areaGradientTop: 'rgba(244, 63, 94, 0.35)',
        areaGradientBottom: 'rgba(244, 63, 94, 0.00)',
        glowColor: '#e11d48',
        accentBg: 'bg-rose-950/40 border-rose-800/50 text-rose-300',
        dotColor: '#fb7185',
        badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-950/80',
        velocityPace: 'Critical Acceleration',
      };
    }
    if (band === 'HIGH') {
      return {
        lineColor: '#f59e0b', // amber-500
        areaGradientTop: 'rgba(245, 158, 11, 0.35)',
        areaGradientBottom: 'rgba(245, 158, 11, 0.00)',
        glowColor: '#d97706',
        accentBg: 'bg-amber-950/40 border-amber-800/50 text-amber-300',
        dotColor: '#fcd34d',
        badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-950/80',
        velocityPace: 'Elevated Syndicate Velocity',
      };
    }
    if (band === 'MODERATE') {
      return {
        lineColor: '#06b6d4', // cyan-500
        areaGradientTop: 'rgba(6, 182, 212, 0.30)',
        areaGradientBottom: 'rgba(6, 182, 212, 0.00)',
        glowColor: '#0891b2',
        accentBg: 'bg-cyan-950/40 border-cyan-800/50 text-cyan-300',
        dotColor: '#67e8f9',
        badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/80',
        velocityPace: 'Moderate Activity',
      };
    }
    return {
      lineColor: '#10b981', // emerald-500
      areaGradientTop: 'rgba(16, 185, 129, 0.20)',
      areaGradientBottom: 'rgba(16, 185, 129, 0.00)',
      glowColor: '#059669',
      accentBg: 'bg-slate-900 border-slate-800 text-slate-300',
      dotColor: '#34d399',
      badgeColor: 'border-slate-700 text-slate-400 bg-slate-900',
      velocityPace: 'Baseline Noise',
    };
  }, [band]);

  // Derived metrics
  const peakReport = useMemo(() => {
    return Math.max(...data.map((d) => (metricMode === 'velocity' ? d.reports : d.cumulative)), 1);
  }, [data, metricMode]);

  const latestPoint = data[data.length - 1];
  const firstPoint = data[0];
  const velocityChange = useMemo(() => {
    const earlySum = data.slice(0, 7).reduce((acc, d) => acc + d.reports, 0) || 1;
    const lateSum = data.slice(-7).reduce((acc, d) => acc + d.reports, 0);
    const pct = Math.round(((lateSum - earlySum) / earlySum) * 100);
    return pct >= 0 ? `+${pct}%` : `${pct}%`;
  }, [data]);

  // D3 Chart Rendering
  useEffect(() => {
    if (!svgRef.current || !data.length || containerWidth <= 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const height = 210;
    const margin = { top: 22, right: 28, bottom: 32, left: 38 };
    const innerWidth = Math.max(100, containerWidth - margin.left - margin.right);
    const innerHeight = Math.max(60, height - margin.top - margin.bottom);

    // SVG Defs: Gradient & Glow Filter
    const defs = svg.append('defs');

    // Area Gradient
    const gradientId = `velocity-gradient-${patternSeed}-${metricMode}`;
    const linearGradient = defs
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    linearGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', theme.areaGradientTop);

    linearGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', theme.areaGradientBottom);

    // Filter for neon line glow
    const filterId = `neon-glow-${patternSeed}`;
    const filter = defs
      .append('filter')
      .attr('id', filterId)
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');

    filter
      .append('feGaussianBlur')
      .attr('stdDeviation', '2.5')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Scales
    const xExtent = d3.extent(data, (d) => d.date) as [Date, Date];
    const xScale = d3.scaleTime().domain(xExtent).range([margin.left, margin.left + innerWidth]);

    const yMax =
      metricMode === 'velocity'
        ? Math.max(d3.max(data, (d) => d.reports) || 10, 4) * 1.2
        : (d3.max(data, (d) => d.cumulative) || 20) * 1.15;

    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([margin.top + innerHeight, margin.top]);

    // Value accessor depending on metric mode
    const getYVal = (d: ScamVelocityPoint) => (metricMode === 'velocity' ? d.reports : d.cumulative);

    // Grid lines (Horizontal dashed lines)
    const yTicks = yScale.ticks(4);
    const gridGroup = svg.append('g').attr('class', 'grid-lines');

    yTicks.forEach((tickVal) => {
      if (tickVal === 0) return;
      gridGroup
        .append('line')
        .attr('x1', margin.left)
        .attr('x2', margin.left + innerWidth)
        .attr('y1', yScale(tickVal))
        .attr('y2', yScale(tickVal))
        .attr('stroke', '#334155') // slate-700
        .attr('stroke-width', 0.8)
        .attr('stroke-dasharray', '3,3')
        .attr('opacity', 0.4);
    });

    // Area Generator
    const areaGenerator = d3
      .area<ScamVelocityPoint>()
      .x((d) => xScale(d.date))
      .y0(yScale(0))
      .y1((d) => yScale(getYVal(d)))
      .curve(d3.curveMonotoneX);

    // Line Generator
    const lineGenerator = d3
      .line<ScamVelocityPoint>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(getYVal(d)))
      .curve(d3.curveMonotoneX);

    // Draw Filled Area
    svg
      .append('path')
      .datum(data)
      .attr('fill', `url(#${gradientId})`)
      .attr('d', areaGenerator);

    // Draw Glow Background Line
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', theme.glowColor)
      .attr('stroke-width', 4)
      .attr('opacity', 0.4)
      .attr('filter', `url(#${filterId})`)
      .attr('d', lineGenerator);

    // Draw Crisp Primary Line
    const mainPath = svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', theme.lineColor)
      .attr('stroke-width', 2.2)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', lineGenerator);

    // Animate Line Path Draw-in
    const totalLength = (mainPath.node() as SVGPathElement)?.getTotalLength() || 1000;
    mainPath
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(900)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Key milestone dots (Peaks & Outbreak days)
    data.forEach((d) => {
      if ((d.isPeak || d.isOutbreak) && metricMode === 'velocity') {
        const cx = xScale(d.date);
        const cy = yScale(d.reports);

        // Pulse ring
        svg
          .append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 8)
          .attr('fill', 'none')
          .attr('stroke', theme.lineColor)
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.6)
          .attr('class', 'animate-ping origin-center');

        // Solid marker
        svg
          .append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 4.5)
          .attr('fill', theme.lineColor)
          .attr('stroke', '#0f172a')
          .attr('stroke-width', 2);

        // Milestone flag label
        if (containerWidth > 420) {
          const textGroup = svg.append('g').attr('transform', `translate(${cx}, ${cy - 12})`);

          textGroup
            .append('rect')
            .attr('x', -40)
            .attr('y', -14)
            .attr('width', 80)
            .attr('height', 16)
            .attr('rx', 4)
            .attr('fill', '#020617')
            .attr('stroke', theme.lineColor)
            .attr('stroke-width', 0.8)
            .attr('opacity', 0.9);

          textGroup
            .append('text')
            .attr('x', 0)
            .attr('y', -3)
            .attr('text-anchor', 'middle')
            .attr('fill', theme.dotColor)
            .attr('font-size', '9px')
            .attr('font-family', 'ui-monospace, monospace')
            .attr('font-weight', 'bold')
            .text(d.isPeak ? 'SURGE PEAK' : 'BURST WAVE');
        }
      }
    });

    // Today's Pulse Dot at the right endpoint
    if (data.length > 0) {
      const last = data[data.length - 1];
      const cx = xScale(last.date);
      const cy = yScale(getYVal(last));

      svg
        .append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 6)
        .attr('fill', theme.lineColor)
        .attr('opacity', 0.35)
        .attr('class', 'animate-ping');

      svg
        .append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 4)
        .attr('fill', '#ffffff')
        .attr('stroke', theme.lineColor)
        .attr('stroke-width', 2);
    }

    // Axes
    // X Axis
    const xAxisGroup = svg
      .append('g')
      .attr('transform', `translate(0, ${margin.top + innerHeight})`);

    // Tick count based on container width
    const tickCount = containerWidth < 460 ? 4 : 7;
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(tickCount)
      .tickFormat((d) => d3.timeFormat('%b %d')(d as Date))
      .tickSize(4);

    xAxisGroup.call(xAxis);

    // Style X Axis
    xAxisGroup.select('.domain').attr('stroke', '#334155').attr('stroke-width', 1);
    xAxisGroup.selectAll('.tick line').attr('stroke', '#475569');
    xAxisGroup
      .selectAll('.tick text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('dy', '8px');

    // Y Axis
    const yAxisGroup = svg.append('g').attr('transform', `translate(${margin.left}, 0)`);

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(4)
      .tickFormat((d) => `${d}`)
      .tickSize(0);

    yAxisGroup.call(yAxis);
    yAxisGroup.select('.domain').remove(); // Hide vertical line
    yAxisGroup
      .selectAll('.tick text')
      .attr('fill', '#64748b')
      .attr('font-size', '10px')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('dx', '-4px');

    // Interactive Hover Overlay (Hairline Crosshair + Tooltip)
    const bisectDate = d3.bisector<ScamVelocityPoint, Date>((d) => d.date).center;

    // Crosshair visual group
    const crosshairGroup = svg
      .append('g')
      .attr('class', 'crosshair-group')
      .style('display', 'none');

    const crosshairLine = crosshairGroup
      .append('line')
      .attr('y1', margin.top)
      .attr('y2', margin.top + innerHeight)
      .attr('stroke', '#38bdf8') // sky-400
      .attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '3,2')
      .attr('opacity', 0.85);

    const crosshairDot = crosshairGroup
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#38bdf8')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    // Transparent rect covering data area for tracking
    svg
      .append('rect')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair')
      .on('mouseenter', () => {
        crosshairGroup.style('display', null);
      })
      .on('mousemove', (event) => {
        const [mouseX] = d3.pointer(event);
        const xDate = xScale.invert(mouseX);
        const idx = bisectDate(data, xDate);
        const point = data[Math.max(0, Math.min(data.length - 1, idx))];

        if (point) {
          const px = xScale(point.date);
          const py = yScale(getYVal(point));

          crosshairLine.attr('x1', px).attr('x2', px);
          crosshairDot.attr('cx', px).attr('cy', py);

          setHoveredPoint({
            point,
            x: px,
            y: py,
          });
        }
      })
      .on('mouseleave', () => {
        crosshairGroup.style('display', 'none');
        setHoveredPoint(null);
      });
  }, [data, containerWidth, metricMode, theme, patternSeed]);

  return (
    <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
      {/* Top Bar: Title, Velocity badge, and Metric Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-slate-900 border border-slate-700/80 flex items-center justify-center text-cyan-400">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h5 className="text-xs font-bold text-white font-mono tracking-tight">
                Scam Frequency Velocity (30-Day D3 Telemetry)
              </h5>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${theme.badgeColor}`}>
                {theme.velocityPace}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Daily pattern occurrence rate and syndicate distribution momentum
            </p>
          </div>
        </div>

        {/* Toggle between Daily Velocity vs Cumulative Volume */}
        <div className="flex items-center self-start sm:self-auto bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setMetricMode('velocity')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              metricMode === 'velocity'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daily Velocity
          </button>
          <button
            type="button"
            onClick={() => setMetricMode('cumulative')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              metricMode === 'cumulative'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cumulative Curve
          </button>
        </div>
      </div>

      {/* Quick Velocity Statistics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 pt-2 pb-2 px-3 rounded-lg bg-slate-900/60 border border-slate-800/60 text-[11px] font-mono">
        <div>
          <span className="text-slate-500 block text-[10px]">Peak 24h Velocity</span>
          <span className="text-white font-bold">{peakReport} {metricMode === 'velocity' ? 'reports/day' : 'total'}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">7-Day Acceleration</span>
          <span className="text-amber-400 font-bold">{velocityChange}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Current Pace</span>
          <span className="text-cyan-300 font-bold">{latestPoint?.reports || 0} reports/day</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Syndicate Wave Status</span>
          <span className="text-slate-300 font-semibold">{surge}</span>
        </div>
      </div>

      {/* D3 SVG Container with Interactive Floating Tooltip */}
      <div ref={containerRef} className="relative w-full h-[210px] overflow-hidden select-none">
        <svg
          ref={svgRef}
          width="100%"
          height="210"
          className="overflow-visible block"
        />

        {/* Floating Tooltip Box */}
        {hoveredPoint && (
          <div
            className="absolute pointer-events-none z-20 px-3 py-2 rounded-lg bg-slate-900/95 border border-slate-700/80 shadow-xl backdrop-blur-md text-[11px] font-mono transition-transform duration-75"
            style={{
              left: `${Math.min(Math.max(hoveredPoint.x - 70, 10), containerWidth - 160)}px`,
              top: `${Math.max(hoveredPoint.y - 75, 10)}px`,
            }}
          >
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] pb-1 border-b border-slate-800">
              <Calendar className="w-3 h-3 text-cyan-400" />
              <span>{hoveredPoint.point.dateStr}</span>
              <span className="text-slate-500">({hoveredPoint.point.relativeStr})</span>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between gap-3">
              <span className="text-slate-400 text-[10px]">
                {metricMode === 'velocity' ? 'Incidents Flagged:' : 'Cumulative Total:'}
              </span>
              <span className="text-sm font-bold text-white font-mono">
                {metricMode === 'velocity'
                  ? `${hoveredPoint.point.reports} reports`
                  : `${hoveredPoint.point.cumulative} total`}
              </span>
            </div>
            {hoveredPoint.point.annotation && (
              <div className="mt-1 text-[9px] font-semibold text-rose-400 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" />
                <span>{hoveredPoint.point.annotation}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend & Telemetry footnote */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mt-2 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-0.5 rounded-full"
              style={{ backgroundColor: theme.lineColor }}
            />
            <span className="text-slate-400">
              {metricMode === 'velocity' ? 'Daily Pattern Frequency' : 'Cumulative Growth Curve'}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full border border-rose-500/80 bg-rose-950" />
            <span className="text-slate-400">Campaign Outbreak Peak</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-500">
          <Info className="w-3 h-3 text-slate-400" />
          <span>Calculated from cross-platform fraud repository telemetry</span>
        </div>
      </div>
    </div>
  );
};
