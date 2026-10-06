import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { AuditFinding, Severity } from '../types/audit';
import {
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  ChevronRight,
  TrendingDown,
  Layers,
} from 'lucide-react';

interface D3RiskHeatmapProps {
  findings: AuditFinding[];
  toleranceScore: number;
  onSelectFinding: (finding: AuditFinding) => void;
}

export const D3RiskHeatmap: React.FC<D3RiskHeatmapProps> = ({
  findings,
  toleranceScore,
  onSelectFinding,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewMode, setViewMode] = useState<'inherent' | 'residual'>('inherent');
  const [hoveredFinding, setHoveredFinding] = useState<AuditFinding | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');

  // Filtered findings by domain if selected
  const activeFindings = findings.filter(
    (f) => selectedDomain === 'All' || f.domain === selectedDomain
  );

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Dimensions
    const margin = { top: 35, right: 35, bottom: 55, left: 65 };
    const width = 560 - margin.left - margin.right;
    const height = 440 - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 560 440`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Likelihood (X-axis) categories: 1 to 5
    const xValues = [1, 2, 3, 4, 5];
    const yValues = [1, 2, 3, 4, 5]; // Impact (Y-axis): 1 to 5

    const xLabels = ['1: Rare', '2: Unlikely', '3: Moderate', '4: Likely', '5: Almost Certain'];
    const yLabels = ['1: Low', '2: Minor', '3: Moderate', '4: Major', '5: Critical'];

    const xScale = d3
      .scaleBand<number>()
      .domain(xValues)
      .range([0, width])
      .padding(0.04);

    const yScale = d3
      .scaleBand<number>()
      .domain(yValues.slice().reverse()) // 5 at top, 1 at bottom
      .range([0, height])
      .padding(0.04);

    // Color bands according to Score = L x I
    const getCellColor = (l: number, i: number) => {
      const score = l * i;
      if (score >= 16) return '#450a0a'; // Dark crimson for Critical (16-25)
      if (score >= 10) return '#451a03'; // Dark amber/orange for High (10-15)
      if (score >= 5) return '#422006'; // Muted dark yellow for Medium (5-9)
      return '#022c22'; // Dark emerald for Low (1-4)
    };

    const getCellBorder = (l: number, i: number) => {
      const score = l * i;
      if (score >= 16) return '#ef4444';
      if (score >= 10) return '#f59e0b';
      if (score >= 5) return '#eab308';
      return '#10b981';
    };

    // Draw Grid Cells
    yValues.forEach((impact) => {
      xValues.forEach((likelihood) => {
        const score = impact * likelihood;
        const cellX = xScale(likelihood) || 0;
        const cellY = yScale(impact) || 0;
        const cellW = xScale.bandwidth();
        const cellH = yScale.bandwidth();

        // Background Rect
        g.append('rect')
          .attr('x', cellX)
          .attr('y', cellY)
          .attr('width', cellW)
          .attr('height', cellH)
          .attr('rx', 6)
          .attr('fill', getCellColor(likelihood, impact))
          .attr('stroke', getCellBorder(likelihood, impact))
          .attr('stroke-opacity', 0.25)
          .attr('stroke-width', 1.2);

        // Score watermark text
        g.append('text')
          .attr('x', cellX + cellW - 6)
          .attr('y', cellY + 14)
          .attr('text-anchor', 'end')
          .attr('font-size', '10px')
          .attr('font-family', 'monospace')
          .attr('font-weight', 'bold')
          .attr('fill', getCellBorder(likelihood, impact))
          .attr('opacity', 0.6)
          .text(score);
      });
    });

    // Draw Tolerance boundary curve
    // Points where L * I is approximately equal to toleranceScore
    const tolerancePoints: [number, number][] = [];
    xValues.forEach((l) => {
      const targetI = Math.min(5, Math.max(1, toleranceScore / l));
      const px = (xScale(l) || 0) + xScale.bandwidth() / 2;
      const py = (yScale(Math.round(targetI)) || 0) + yScale.bandwidth() / 2;
      tolerancePoints.push([px, py]);
    });

    const lineGenerator = d3
      .line()
      .x((d) => d[0])
      .y((d) => d[1])
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(tolerancePoints)
      .attr('fill', 'none')
      .attr('stroke', '#f43f5e')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5 4')
      .attr('d', lineGenerator as any)
      .attr('opacity', 0.85);

    // Tolerance boundary text banner
    g.append('text')
      .attr('x', width - 8)
      .attr('y', 14)
      .attr('text-anchor', 'end')
      .attr('font-size', '9px')
      .attr('font-weight', 'bold')
      .attr('fill', '#f43f5e')
      .text(`-- Tolerance Ceiling: Score ≤ ${toleranceScore}`);

    // X-Axis (Likelihood)
    const xAxis = g.append('g').attr('transform', `translate(0,${height + 8})`);
    xValues.forEach((l, idx) => {
      const xPos = (xScale(l) || 0) + xScale.bandwidth() / 2;
      xAxis
        .append('text')
        .attr('x', xPos)
        .attr('y', 14)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .attr('fill', '#cbd5e1')
        .text(xLabels[idx]);
    });

    xAxis
      .append('text')
      .attr('x', width / 2)
      .attr('y', 36)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('fill', '#94a3b8')
      .text('LIKELIHOOD (FREQUENCY & PROBABILITY OF OCCURRENCE) →');

    // Y-Axis (Impact)
    const yAxis = g.append('g').attr('transform', 'translate(-10,0)');
    yValues.slice().reverse().forEach((imp, idx) => {
      const yPos = (yScale(imp) || 0) + yScale.bandwidth() / 2 + 4;
      yAxis
        .append('text')
        .attr('x', 0)
        .attr('y', yPos)
        .attr('text-anchor', 'end')
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .attr('fill', '#cbd5e1')
        .text(yLabels[4 - idx]);
    });

    yAxis
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('fill', '#94a3b8')
      .text('← IMPACT (FINANCIAL, REGULATORY, REPUTATIONAL EXPOSURE)');

    // Group findings by cell coordinate to avoid complete overlapping
    const cellGroups: { [key: string]: AuditFinding[] } = {};
    activeFindings.forEach((f) => {
      const l = viewMode === 'inherent' ? f.inherentLikelihood : f.residualLikelihood;
      const i = viewMode === 'inherent' ? f.inherentImpact : f.residualImpact;
      const key = `${l}-${i}`;
      if (!cellGroups[key]) cellGroups[key] = [];
      cellGroups[key].push(f);
    });

    // Draw Finding Nodes
    Object.entries(cellGroups).forEach(([key, items]) => {
      const [lStr, iStr] = key.split('-');
      const l = parseInt(lStr, 10);
      const imp = parseInt(iStr, 10);

      const cellX = xScale(l) || 0;
      const cellY = yScale(imp) || 0;
      const cellW = xScale.bandwidth();
      const cellH = yScale.bandwidth();

      // Distribute nodes within cell
      items.forEach((finding, idx) => {
        const cols = items.length > 4 ? 3 : 2;
        const colIdx = idx % cols;
        const rowIdx = Math.floor(idx / cols);

        const nodeX = cellX + 16 + colIdx * 28;
        const nodeY = cellY + 28 + rowIdx * 24;

        const isCritical = finding.severity === 'Critical';
        const nodeColor =
          finding.severity === 'Critical'
            ? '#f43f5e'
            : finding.severity === 'High'
            ? '#f59e0b'
            : finding.severity === 'Medium'
            ? '#eab308'
            : '#10b981';

        const nodeGroup = g
          .append('g')
          .attr('class', 'finding-node cursor-pointer')
          .style('cursor', 'pointer');

        // Outer pulse circle for Critical
        if (isCritical && viewMode === 'inherent') {
          nodeGroup
            .append('circle')
            .attr('cx', nodeX)
            .attr('cy', nodeY)
            .attr('r', 13)
            .attr('fill', 'none')
            .attr('stroke', '#f43f5e')
            .attr('stroke-width', 1.5)
            .attr('opacity', 0.45)
            .attr('class', 'animate-ping');
        }

        // Node badge rect/circle
        nodeGroup
          .append('rect')
          .attr('x', nodeX - 12)
          .attr('y', nodeY - 9)
          .attr('width', 24)
          .attr('height', 18)
          .attr('rx', 4)
          .attr('fill', '#020617')
          .attr('stroke', nodeColor)
          .attr('stroke-width', 1.8)
          .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))');

        // Finding text (e.g. 01, 06)
        nodeGroup
          .append('text')
          .attr('x', nodeX)
          .attr('y', nodeY + 3.5)
          .attr('text-anchor', 'middle')
          .attr('font-size', '9px')
          .attr('font-family', 'monospace')
          .attr('font-weight', 'bold')
          .attr('fill', nodeColor)
          .text(finding.id.replace('F-', ''));

        // Interactive hover & click
        nodeGroup
          .on('mouseenter', (event: MouseEvent) => {
            const [mouseX, mouseY] = d3.pointer(event, containerRef.current);
            setHoveredFinding(finding);
            setTooltipPos({ x: mouseX + 10, y: mouseY - 20 });
            d3.select(event.currentTarget as SVGGElement).select('rect').attr('stroke-width', 3);
          })
          .on('mouseleave', (event: MouseEvent) => {
            setHoveredFinding(null);
            setTooltipPos(null);
            d3.select(event.currentTarget as SVGGElement).select('rect').attr('stroke-width', 1.8);
          })
          .on('click', () => {
            onSelectFinding(finding);
          });
      });
    });
  }, [findings, toleranceScore, viewMode, selectedDomain]);

  return (
    <div ref={containerRef} className="relative flex flex-col space-y-3">
      {/* View Mode & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold text-[11px]">Heatmap Perspective:</span>
          <div className="flex rounded-md p-0.5 bg-slate-900 border border-slate-700">
            <button
              onClick={() => setViewMode('inherent')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                viewMode === 'inherent'
                  ? 'bg-rose-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Inherent Risk (Pre-Controls)
            </button>
            <button
              onClick={() => setViewMode('residual')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                viewMode === 'residual'
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Residual Risk (Target Controls)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Domain Filter:</span>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All 6 Domains (16 Items)</option>
            <option value="Governance & IT Risk">Governance &amp; IT Risk</option>
            <option value="IT Asset Management">IT Asset Management</option>
            <option value="Identity & Access Management">IAM &amp; MFA/PAM</option>
            <option value="Endpoint Security">Endpoint Security</option>
            <option value="Security Monitoring & Logging">SIEM &amp; SOC</option>
            <option value="Security Awareness & Human Factors">Awareness &amp; Phishing</option>
          </select>
        </div>
      </div>

      {/* D3 SVG Canvas */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-2 flex items-center justify-center overflow-x-auto shadow-inner">
        <svg ref={svgRef} className="w-full max-w-[560px] h-auto select-none" />
      </div>

      {/* Interactive Tooltip Card */}
      {hoveredFinding && tooltipPos && (
        <div
          style={{
            position: 'absolute',
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            pointerEvents: 'none',
            zIndex: 40,
          }}
          className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-2xl max-w-xs text-xs backdrop-blur-md transform -translate-y-full animate-fadeIn"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono font-bold text-blue-400 text-xs">
              {hoveredFinding.id} (Item #{hoveredFinding.itemNumber})
            </span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                hoveredFinding.severity === 'Critical'
                  ? 'bg-rose-500/20 text-rose-300'
                  : hoveredFinding.severity === 'High'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-yellow-500/20 text-yellow-300'
              }`}
            >
              {hoveredFinding.severity}
            </span>
          </div>

          <div className="font-bold text-white mb-1 leading-snug">{hoveredFinding.title}</div>
          <div className="text-[10px] text-slate-400 mb-2">{hoveredFinding.domain}</div>

          <div className="grid grid-cols-2 gap-1.5 py-1.5 border-t border-slate-800 text-[10px] font-mono">
            <div>
              <span className="text-slate-400">Inherent: </span>
              <span className="text-rose-400 font-bold">
                L{hoveredFinding.inherentLikelihood} × I{hoveredFinding.inherentImpact} = {hoveredFinding.riskScore}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Residual: </span>
              <span className="text-emerald-400 font-bold">
                L{hoveredFinding.residualLikelihood} × I{hoveredFinding.residualImpact} ={' '}
                {hoveredFinding.residualLikelihood * hoveredFinding.residualImpact}
              </span>
            </div>
            <div>
              <span className="text-slate-400">CVSS Score: </span>
              <span className="text-amber-400 font-bold">{hoveredFinding.cvssScore}</span>
            </div>
            <div>
              <span className="text-slate-400">Aged: </span>
              <span className="text-slate-200">{hoveredFinding.agingDays} days</span>
            </div>
          </div>

          <div className="mt-1 text-[10px] text-blue-300 flex items-center justify-end gap-1">
            <span>Click node to open workpaper</span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 px-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded bg-rose-500" />
            <span>Critical (16-25)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded bg-amber-500" />
            <span>High (10-15)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded bg-yellow-500" />
            <span>Medium (5-9)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded bg-emerald-500" />
            <span>Low (1-4)</span>
          </div>
        </div>
        <div className="text-slate-400 text-[10px]">
          Rendering via <strong>D3.js SVG</strong> (Hardware-Accelerated)
        </div>
      </div>
    </div>
  );
};
