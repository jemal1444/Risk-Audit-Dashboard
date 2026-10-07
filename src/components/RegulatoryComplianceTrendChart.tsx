import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  ExternalLink,
  Award,
  ChevronRight,
} from 'lucide-react';

interface RegulatoryComplianceTrendChartProps {
  onNavigateToTab?: (tab: string) => void;
}

// 6 Months Historical Compliance Score Data (May 2026 - Oct 2026)
const COMPLIANCE_TREND_DATA = [
  { month: 'May 26', overall: 58.4, nbeDirective: 52.0, iso27001: 64.5, pciDss: 56.2, cisControls: 61.0, boardTarget: 85.0 },
  { month: 'Jun 26', overall: 62.1, nbeDirective: 56.4, iso27001: 67.8, pciDss: 60.1, cisControls: 64.2, boardTarget: 85.0 },
  { month: 'Jul 26', overall: 66.8, nbeDirective: 61.2, iso27001: 71.5, pciDss: 65.0, cisControls: 69.5, boardTarget: 85.0 },
  { month: 'Aug 26', overall: 71.5, nbeDirective: 65.8, iso27001: 75.2, pciDss: 70.4, cisControls: 74.6, boardTarget: 85.0 },
  { month: 'Sep 26', overall: 76.2, nbeDirective: 70.1, iso27001: 79.4, pciDss: 75.8, cisControls: 79.5, boardTarget: 85.0 },
  { month: 'Oct 26', overall: 81.4, nbeDirective: 74.2, iso27001: 84.1, pciDss: 80.5, cisControls: 86.8, boardTarget: 85.0 },
];

export const RegulatoryComplianceTrendChart: React.FC<RegulatoryComplianceTrendChartProps> = ({
  onNavigateToTab,
}) => {
  const [viewMode, setViewMode] = useState<'composite' | 'frameworks'>('composite');

  const latestScore = COMPLIANCE_TREND_DATA[COMPLIANCE_TREND_DATA.length - 1];
  const baselineScore = COMPLIANCE_TREND_DATA[0];
  const progressDiff = (latestScore.overall - baselineScore.overall).toFixed(1);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-xl text-xs backdrop-blur-md">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1.5 flex items-center justify-between gap-3">
            <span>Period: {label}</span>
            <span className="text-[10px] text-amber-400 font-mono">
              Target: 85.0%
            </span>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex justify-between gap-4" style={{ color: entry.color }}>
                <span>{entry.name}:</span>
                <span className="font-bold">{entry.value}%</span>
              </div>
            ))}
          </div>
          <div className="mt-1.5 pt-1 border-t border-slate-800 text-[10px] text-slate-400">
            Variance vs. Board Target:{' '}
            <strong className={latestScore.overall >= 85 ? 'text-emerald-400' : 'text-amber-400'}>
              {(latestScore.overall - 85).toFixed(1)}%
            </strong>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-950/40 border border-emerald-300/40">
            <ShieldCheck className="h-5 w-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>6-Month Regulatory Compliance Score Trend</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-mono">
                  +23.0% PROGRESS
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracking institutional adherence to National Bank of Ethiopia (NBE), ISO 27001, PCI-DSS, and CIS Controls benchmarks.
            </p>
          </div>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('composite')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              viewMode === 'composite'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Composite Trend
          </button>
          <button
            onClick={() => setViewMode('frameworks')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              viewMode === 'frameworks'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            By Regulatory Framework
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-0.5">
          <span className="text-slate-400 text-[11px] block">Current Composite Score</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-emerald-400">{latestScore.overall}%</span>
            <span className="text-[10px] text-emerald-300 font-semibold flex items-center">
              <ArrowUpRight className="h-3 w-3" /> +{progressDiff}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block truncate">Target: 85.0% by Q4 2026</span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-0.5">
          <span className="text-slate-400 text-[11px] block">NBE Cyber Directive</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-amber-400">{latestScore.nbeDirective}%</span>
            <span className="text-[10px] text-amber-300 font-medium">In Progress</span>
          </div>
          <span className="text-[10px] text-slate-400 block truncate">Primary Focus Area (F-01, F-06)</span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-0.5">
          <span className="text-slate-400 text-[11px] block">ISO/IEC 27001:2022</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-teal-400">{latestScore.iso27001}%</span>
            <span className="text-[10px] text-emerald-300 font-medium">Near Target</span>
          </div>
          <span className="text-[10px] text-slate-400 block truncate">ISMS Audit Ready</span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-0.5">
          <span className="text-slate-400 text-[11px] block">PCI-DSS v4.0 Readiness</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-blue-400">{latestScore.pciDss}%</span>
            <span className="text-[10px] text-blue-300 font-medium">CDE Scoped</span>
          </div>
          <span className="text-[10px] text-slate-400 block truncate">Cardholder Boundary Protected</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full select-none pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'composite' ? (
            <AreaChart data={COMPLIANCE_TREND_DATA} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="complianceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[40, 100]} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '10px', paddingTop: '6px' }}
                iconSize={8}
                formatter={(value) => <span className="text-slate-300">{value}</span>}
              />
              <ReferenceLine
                y={85}
                stroke="#d4af37"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: 'Board Target: 85.0%',
                  fill: '#d4af37',
                  fontSize: 10,
                  fontWeight: 'bold',
                  position: 'insideTopRight',
                }}
              />
              <Area
                type="monotone"
                dataKey="overall"
                name="Overall Compliance Rate"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#complianceGradient)"
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          ) : (
            <LineChart data={COMPLIANCE_TREND_DATA} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[40, 100]} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '10px', paddingTop: '6px' }}
                iconSize={8}
                formatter={(value) => <span className="text-slate-300">{value}</span>}
              />
              <ReferenceLine
                y={85}
                stroke="#d4af37"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: 'Target 85%',
                  fill: '#d4af37',
                  fontSize: 9,
                  position: 'insideTopRight',
                }}
              />
              <Line type="monotone" dataKey="overall" name="Overall Rate" stroke="#ffffff" strokeWidth={2} />
              <Line type="monotone" dataKey="nbeDirective" name="NBE Directive" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="iso27001" name="ISO 27001" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="pciDss" name="PCI-DSS" stroke="#38bdf8" strokeWidth={2} />
              <Line type="monotone" dataKey="cisControls" name="CIS Controls" stroke="#a855f7" strokeWidth={2} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Navigation */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>Formal Statutory Audit Inspection: <strong>Scheduled Q4 2026</strong></span>
        {onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab('checklist')}
            className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Policy Compliance Checklist</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
