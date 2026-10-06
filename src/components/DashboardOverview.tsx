import React from 'react';
import {
  Users,
  CalendarCheck,
  CheckCircle2,
  Flag,
  Hourglass,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  AlertOctagon,
  AlertTriangle,
  Info,
  Clock,
  ChevronRight,
  TrendingUp,
  Building2,
  PlusCircle,
  FileCheck2,
} from 'lucide-react';
import {
  AuditFinding,
  ControlTestMatrixRow,
  AnnualAuditPlanQuarter,
  AuditResourceTeam,
  Severity,
} from '../types/audit';
import { RiskAppetiteIndicator } from './RiskAppetiteIndicator';
import { RiskAppetiteNotifications } from './RiskAppetiteNotifications';
import { VulnerabilityAgingTrendChart } from './VulnerabilityAgingTrendChart';
import { DepartmentalVulnerabilityAgingChart } from './DepartmentalVulnerabilityAgingChart';

interface DashboardOverviewProps {
  findings: AuditFinding[];
  filteredFindings: AuditFinding[];
  controlTests: ControlTestMatrixRow[];
  annualPlan: AnnualAuditPlanQuarter[];
  resourceTeams: AuditResourceTeam[];
  onSelectFinding: (finding: AuditFinding) => void;
  onOpenAiForFinding: (finding: AuditFinding) => void;
  onNavigateToTab: (tab: string) => void;
  onFilterSeverity?: (severity: Severity) => void;
  onOpenAddRiskModal?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  findings,
  filteredFindings,
  controlTests,
  annualPlan,
  resourceTeams,
  onSelectFinding,
  onOpenAiForFinding,
  onNavigateToTab,
  onOpenAddRiskModal,
}) => {
  const [isSimulatedPostControls, setIsSimulatedPostControls] = React.useState(false);

  // Aggregate Metrics
  const totalUniverse = 86;
  const auditsPlanned = 24;
  const auditsCompleted = 17;
  const openFindingsCount = filteredFindings.filter((f) => f.status !== 'Remediated').length;
  const overdueCount = filteredFindings.filter((f) => f.status === 'Overdue' || f.agingDays > 90).length;
  const assuranceCoverage = 78;

  // Severity counts
  const criticalCount = filteredFindings.filter((f) => f.severity === 'Critical').length;
  const highCount = filteredFindings.filter((f) => f.severity === 'High').length;
  const mediumCount = filteredFindings.filter((f) => f.severity === 'Medium').length;
  const lowCount = filteredFindings.filter((f) => f.severity === 'Low').length;

  // Aging counts
  const agingBuckets = {
    '0-30 Days': filteredFindings.filter((f) => f.agingDays <= 30).length || 2,
    '31-60 Days': filteredFindings.filter((f) => f.agingDays > 30 && f.agingDays <= 60).length || 3,
    '61-90 Days': filteredFindings.filter((f) => f.agingDays > 60 && f.agingDays <= 90).length || 6,
    '91-120 Days': filteredFindings.filter((f) => f.agingDays > 90 && f.agingDays <= 120).length || 3,
    '120+ Days': filteredFindings.filter((f) => f.agingDays > 120).length || 2,
  };

  return (
    <div className="space-y-4">
      {/* 6 Top KPI Summary Cards (Faithfully matching Image top cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* Card 1: Audit Universe */}
        <div
          onClick={() => onNavigateToTab('universe')}
          className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-xl p-3 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 group-hover:text-blue-400 transition-colors">
              Audit Universe
            </span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-400">{totalUniverse}</span>
            <span className="text-[10px] text-slate-400">IS Assets &amp; Scopes</span>
          </div>
        </div>

        {/* Card 2: Audits Planned */}
        <div
          onClick={() => onNavigateToTab('plan')}
          className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-xl p-3 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 group-hover:text-purple-400 transition-colors">
              Audits Planned
            </span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <CalendarCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-400">{auditsPlanned}</span>
            <span className="text-[10px] text-slate-400">2026 Cycle</span>
          </div>
        </div>

        {/* Card 3: Audits Completed */}
        <div
          onClick={() => onNavigateToTab('plan')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-3 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 group-hover:text-emerald-400 transition-colors">
              Audits Completed
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400">{auditsCompleted}</span>
            <span className="text-[10px] text-emerald-500/90 font-medium">70.8% executed</span>
          </div>
        </div>

        {/* Card 4: Open Findings */}
        <div
          onClick={() => onNavigateToTab('findings')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl p-3 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 group-hover:text-amber-400 transition-colors">
              Open Findings
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Flag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400">{openFindingsCount}</span>
            <span className="text-[10px] text-rose-400 font-medium">{criticalCount} Critical</span>
          </div>
        </div>

        {/* Card 5: Overdue Actions */}
        <div
          onClick={() => onNavigateToTab('findings')}
          className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-xl p-3 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 group-hover:text-rose-400 transition-colors">
              Overdue Actions
            </span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <Hourglass className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-400">{overdueCount}</span>
            <span className="text-[10px] text-rose-400/90 font-medium">&gt;SLA Threshold</span>
          </div>
        </div>

        {/* Card 6: Assurance Coverage */}
        <div
          onClick={() => onNavigateToTab('assurance')}
          className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-xl p-3 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 group-hover:text-teal-400 transition-colors">
              Assurance Coverage
            </span>
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-teal-400">{assuranceCoverage}%</span>
            <span className="text-[10px] text-teal-400 flex items-center font-medium">
              <ArrowUpRight className="h-3 w-3" /> +16% YoY
            </span>
          </div>
        </div>
      </div>

      {/* Color-Coded Risk Appetite & Tolerance Threshold Notifications Center */}
      <RiskAppetiteNotifications
        findings={filteredFindings}
        onSelectFinding={onSelectFinding}
        onNavigateToTab={onNavigateToTab}
        isSimulatedPostControls={isSimulatedPostControls}
        onToggleSimulation={() => setIsSimulatedPostControls((prev) => !prev)}
      />

      {/* Organization Risk Appetite & Tolerance Gauge Module */}
      <RiskAppetiteIndicator
        findings={filteredFindings}
        onNavigateToTab={onNavigateToTab}
        onSelectFinding={onSelectFinding}
        isSimulatedPostControls={isSimulatedPostControls}
        onToggleSimulation={() => setIsSimulatedPostControls((prev) => !prev)}
      />

      {/* Hijra Bank Departmental Risk Governance & Annual Rectification Status Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#071933] via-[#0b2447] to-[#0f3460] border border-amber-500/30 text-xs shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow border border-amber-300/40">
              <Building2 className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Departmental IT Risk Governance &amp; Annual Audit Rectification
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono">
                  HIJRA BANK GRC
                </span>
              </div>
              <p className="text-xs text-amber-200/70 mt-0.5">
                IS Infrastructure (Network, DC, Support) • CBS &amp; Application Development • MIS • IT PMO • IS Security
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAddRiskModal && (
              <button
                onClick={onOpenAddRiskModal}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md border border-amber-300/40 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>+ Log Departmental Risk</span>
              </button>
            )}

            <button
              onClick={() => onNavigateToTab('checklist')}
              className="px-3 py-1.5 bg-[#0f3460] hover:bg-[#164177] text-amber-200 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <FileCheck2 className="h-3.5 w-3.5 text-amber-400" />
              <span>Policy Checklist</span>
            </button>

            <button
              onClick={() => onNavigateToTab('risk')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>Departmental Matrix →</span>
            </button>
          </div>
        </div>

        {/* 5-Division Snapshot Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2.5 border-t border-amber-500/20 text-[11px]">
          <div
            onClick={() => onNavigateToTab('risk')}
            className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>IS Infrastructure</span>
              <span className="font-mono text-amber-400 font-bold">
                {findings.filter((f) => f.departmentalUnit && f.departmentalUnit.startsWith('IS Infrastructure')).length}
              </span>
            </div>
            <div className="text-slate-200 font-medium text-[11px] mt-0.5 truncate">
              Network, DC &amp; Support
            </div>
          </div>

          <div
            onClick={() => onNavigateToTab('risk')}
            className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>CBS &amp; Apps</span>
              <span className="font-mono text-amber-400 font-bold">
                {findings.filter((f) => f.departmentalUnit && f.departmentalUnit.startsWith('IS Operation & Application')).length}
              </span>
            </div>
            <div className="text-slate-200 font-medium text-[11px] mt-0.5 truncate">
              CBS EOD &amp; App Dev
            </div>
          </div>

          <div
            onClick={() => onNavigateToTab('risk')}
            className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>MIS Unit</span>
              <span className="font-mono text-amber-400 font-bold">
                {findings.filter((f) => f.departmentalUnit && f.departmentalUnit.startsWith('MIS')).length}
              </span>
            </div>
            <div className="text-slate-200 font-medium text-[11px] mt-0.5 truncate">
              NBE Reg &amp; Reporting
            </div>
          </div>

          <div
            onClick={() => onNavigateToTab('risk')}
            className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>IS Project Mgmt</span>
              <span className="font-mono text-amber-400 font-bold">
                {findings.filter((f) => f.departmentalUnit && f.departmentalUnit === 'IS Project Management').length}
              </span>
            </div>
            <div className="text-slate-200 font-medium text-[11px] mt-0.5 truncate">
              IT PMO &amp; Deliverables
            </div>
          </div>

          <div
            onClick={() => onNavigateToTab('risk')}
            className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-all col-span-2 md:col-span-1"
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>IS Security</span>
              <span className="font-mono text-amber-400 font-bold">
                {findings.filter((f) => f.departmentalUnit && f.departmentalUnit === 'IS Security').length}
              </span>
            </div>
            <div className="text-slate-200 font-medium text-[11px] mt-0.5 truncate">
              SOC, IAM &amp; SIEM
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Panels 1 to 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Panel 1: Audit Universe Coverage */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              1. Audit Universe Coverage
            </h3>
            <span className="text-[10px] text-blue-400 font-semibold cursor-pointer" onClick={() => onNavigateToTab('universe')}>
              View 86 Entities →
            </span>
          </div>

          {/* Donut Simulation */}
          <div className="relative py-2 flex items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1e293b" strokeWidth="12" />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="12"
                  strokeDasharray="238.76"
                  strokeDashoffset={238.76 * (1 - 0.78)}
                  strokeLinecap="round"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray="238.76"
                  strokeDashoffset={238.76 * (1 - 0.42)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-slate-400 font-medium">Coverage</span>
                <span className="text-xl font-extrabold text-white">78%</span>
                <span className="text-[9px] text-emerald-400 font-bold">Target 85%</span>
              </div>
            </div>
          </div>

          {/* Subdomain pill metrics */}
          <div className="grid grid-cols-3 gap-1.5 text-center mt-2">
            <div className="p-1.5 rounded bg-slate-800/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Gov/Risk</div>
              <div className="text-xs font-bold text-blue-400">85%</div>
            </div>
            <div className="p-1.5 rounded bg-slate-800/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Operations</div>
              <div className="text-xs font-bold text-emerald-400">82%</div>
            </div>
            <div className="p-1.5 rounded bg-slate-800/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Regulatory</div>
              <div className="text-xs font-bold text-amber-400">88%</div>
            </div>
            <div className="p-1.5 rounded bg-slate-800/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">IT / SIEM</div>
              <div className="text-xs font-bold text-indigo-400">75%</div>
            </div>
            <div className="p-1.5 rounded bg-slate-800/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">IAM &amp; Assets</div>
              <div className="text-xs font-bold text-rose-400">65%</div>
            </div>
            <div className="p-1.5 rounded bg-slate-800/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">HR / Aware</div>
              <div className="text-xs font-bold text-teal-400">70%</div>
            </div>
          </div>
        </div>

        {/* Panel 2: Annual Audit Plan Calendar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              2. Annual Audit Plan Calendar
            </h3>
            <span className="text-[10px] text-purple-400 font-semibold cursor-pointer" onClick={() => onNavigateToTab('plan')}>
              Quarterly Roadmap →
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-auto">
            {annualPlan.map((q) => (
              <div
                key={q.quarter}
                className="p-2 rounded-lg bg-slate-800/50 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-purple-300">{q.quarter}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                      q.quarter === 'Q1'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : q.quarter === 'Q2'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-slate-700/40 text-slate-400'
                    }`}
                  >
                    {q.quarter === 'Q1' ? 'Completed' : q.quarter === 'Q2' ? 'In Progress' : 'Planned'}
                  </span>
                </div>
                <div className="space-y-1">
                  {q.audits.slice(0, 2).map((a, i) => (
                    <div key={i} className="text-[10px] text-slate-300 truncate flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                      <span className="truncate">{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>24 Planned Audits</span>
            <span className="text-emerald-400 font-semibold">17 Completed / In Flight</span>
          </div>
        </div>

        {/* Panel 3: Control Testing Evidence Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              3. Control Testing Evidence Matrix
            </h3>
            <span className="text-[10px] text-blue-400 font-semibold cursor-pointer" onClick={() => onNavigateToTab('testing')}>
              Workpapers →
            </span>
          </div>

          <div className="overflow-x-auto my-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 text-[10px]">
                  <th className="pb-1 font-medium">Control Area</th>
                  <th className="pb-1 font-medium text-center">Design</th>
                  <th className="pb-1 font-medium text-center">Oper.</th>
                  <th className="pb-1 font-medium text-center">Quality</th>
                  <th className="pb-1 font-medium text-right">Sample %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {controlTests.slice(0, 4).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-1.5 text-slate-300 font-medium max-w-[95px] truncate">
                      {row.controlArea}
                    </td>
                    <td className="py-1.5 text-center">
                      {row.designEffectiveness === 'Effective' ? (
                        <span className="inline-block h-3.5 w-3.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] leading-3.5">✓</span>
                      ) : (
                        <span className="inline-block h-3.5 w-3.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] leading-3.5">!</span>
                      )}
                    </td>
                    <td className="py-1.5 text-center">
                      {row.operatingEffectiveness === 'Effective' ? (
                        <span className="inline-block h-3.5 w-3.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] leading-3.5">✓</span>
                      ) : row.operatingEffectiveness === 'Partially' ? (
                        <span className="inline-block h-3.5 w-3.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] leading-3.5">!</span>
                      ) : (
                        <span className="inline-block h-3.5 w-3.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] leading-3.5">✕</span>
                      )}
                    </td>
                    <td className="py-1.5 text-center">
                      <span className={`text-[10px] font-bold ${
                        row.evidenceQuality === 'High' ? 'text-emerald-400' : row.evidenceQuality === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {row.evidenceQuality[0]}
                      </span>
                    </td>
                    <td className="py-1.5 text-right font-mono text-slate-300 font-semibold">
                      {row.sampleCompletion}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Key: ✓ Effective | ! Warning | ✕ Deficient</span>
          </div>
        </div>

        {/* Panel 4: Finding Severity Overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              4. Finding Severity Overview
            </h3>
            <span className="text-[10px] text-amber-400 font-semibold cursor-pointer" onClick={() => onNavigateToTab('findings')}>
              All 16 Findings →
            </span>
          </div>

          {/* Horizontal lollipop / bar chart */}
          <div className="space-y-2.5 my-auto py-1">
            {/* Critical */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                  <AlertOctagon className="h-3.5 w-3.5" /> Critical
                </span>
                <span className="font-mono font-bold text-rose-400">{criticalCount}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (criticalCount / 16) * 100 * 2.5)}%` }}
                />
              </div>
            </div>

            {/* High */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <AlertTriangle className="h-3.5 w-3.5" /> High
                </span>
                <span className="font-mono font-bold text-amber-400">{highCount}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (highCount / 16) * 100 * 1.5)}%` }}
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-yellow-400 font-semibold">
                  <Info className="h-3.5 w-3.5" /> Medium
                </span>
                <span className="font-mono font-bold text-yellow-400">{mediumCount}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (mediumCount / 16) * 100 * 2)}%` }}
                />
              </div>
            </div>

            {/* Low */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Low
                </span>
                <span className="font-mono font-bold text-emerald-400">{lowCount}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: '5%' }}
                />
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Total Identified: {filteredFindings.length}</span>
            <span className="text-rose-400 font-medium">81% High/Critical Exposure</span>
          </div>
        </div>
      </div>

      {/* Row 2: Panels 5 to 8 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Panel 5: Management Action Aging */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              5. Management Action Aging
            </h3>
            <span className="text-[10px] text-amber-400 font-semibold">SLA Countdown</span>
          </div>

          <div className="space-y-1.5 my-auto py-1">
            {Object.entries(agingBuckets).map(([bucket, count], i) => {
              const colors = [
                'bg-emerald-500 text-emerald-300',
                'bg-teal-500 text-teal-300',
                'bg-amber-500 text-amber-300',
                'bg-orange-500 text-orange-300',
                'bg-rose-500 text-rose-300',
              ];
              const pct = Math.max(15, (count / (filteredFindings.length || 16)) * 100 * 2);
              return (
                <div key={bucket} className="flex items-center gap-2 text-[11px]">
                  <span className="w-18 text-slate-400 text-[10px] shrink-0 font-medium">{bucket}</span>
                  <div className="flex-1 bg-slate-800 rounded-full h-4 overflow-hidden relative">
                    <div
                      className={`h-full ${colors[i].split(' ')[0]} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    >
                      <span className="text-[9px] font-bold text-slate-950">{count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-rose-400 flex items-center justify-between">
            <span>SLA Critical: 14 Days</span>
            <span className="font-bold">5 Actions Exceeding SLA</span>
          </div>
        </div>

        {/* Panel 6: Assurance Coordination Map (3 Lines of Defense) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              6. Assurance Coordination Map
            </h3>
            <span className="text-[10px] text-teal-400 font-semibold cursor-pointer" onClick={() => onNavigateToTab('assurance')}>
              3LOD Model →
            </span>
          </div>

          {/* Three Lines of Defense Flow */}
          <div className="grid grid-cols-4 gap-1.5 my-auto text-center py-1">
            <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 flex flex-col items-center">
              <div className="h-6 w-6 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 text-[10px] font-bold mb-1">
                1st
              </div>
              <div className="text-[9px] text-slate-300 font-semibold leading-tight">First Line</div>
              <div className="text-[8px] text-slate-400">Operations</div>
              <div className="mt-1 text-xs font-bold text-teal-400">80%</div>
            </div>

            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 flex flex-col items-center">
              <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 text-[10px] font-bold mb-1">
                2nd
              </div>
              <div className="text-[9px] text-slate-300 font-semibold leading-tight">Second Line</div>
              <div className="text-[8px] text-slate-400">Risk &amp; Comp</div>
              <div className="mt-1 text-xs font-bold text-blue-400">75%</div>
            </div>

            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 flex flex-col items-center">
              <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 text-[10px] font-bold mb-1">
                3rd
              </div>
              <div className="text-[9px] text-slate-300 font-semibold leading-tight">Internal</div>
              <div className="text-[8px] text-slate-400">Audit</div>
              <div className="mt-1 text-xs font-bold text-purple-400">78%</div>
            </div>

            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 flex flex-col items-center">
              <div className="h-6 w-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-[10px] font-bold mb-1">
                Ext
              </div>
              <div className="text-[9px] text-slate-300 font-semibold leading-tight">External</div>
              <div className="text-[8px] text-slate-400">Regulators</div>
              <div className="mt-1 text-xs font-bold text-slate-300">65%</div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Harmonized Assurance: 74.5%</span>
            <span className="text-teal-400 font-medium">Basel / ISO Aligned</span>
          </div>
        </div>

        {/* Panel 7: Audit Resource Allocation */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              7. Audit Resource Allocation
            </h3>
            <span className="text-[10px] text-blue-400 font-semibold">Team Hours</span>
          </div>

          <div className="space-y-2 my-auto">
            {resourceTeams.map((team, idx) => {
              const utilPct = Math.round((team.assignedHours / team.availableHours) * 100);
              return (
                <div key={idx} className="text-[11px]">
                  <div className="flex items-center justify-between text-slate-300 mb-0.5">
                    <span className="truncate max-w-[120px] font-medium text-[10px]">{team.teamName}</span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {team.assignedHours} / {team.availableHours}h ({utilPct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        utilPct > 80 ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${utilPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Total Pool: 4,090 Hrs</span>
            <span className="text-emerald-400 font-medium">1,250 Available Buffer</span>
          </div>
        </div>

        {/* Panel 8: Issue Remediation Confidence */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              8. Issue Remediation Confidence
            </h3>
            <span className="text-[10px] text-emerald-400 font-semibold">Readiness Index</span>
          </div>

          <div className="space-y-2 my-auto py-1">
            <div>
              <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                <span>Action Ownership Validation</span>
                <span className="font-bold text-emerald-400">85%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                <span>Evidence Readiness Quality</span>
                <span className="font-bold text-teal-400">72%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '72%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                <span>Target-date Confidence</span>
                <span className="font-bold text-amber-400">65%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                <span>Repeat Finding Risk</span>
                <span className="font-bold text-rose-400">35%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '35%' }} />
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Overall Confidence: 74%</span>
            <span className="text-amber-400 font-medium">Escalation Trigger: 25%</span>
          </div>
        </div>
      </div>

      {/* IT Risk Monitoring: 12-Month Vulnerability Aging Trend (Recharts) */}
      <VulnerabilityAgingTrendChart onNavigateToTab={onNavigateToTab} />

      {/* Departmental Vulnerability Aging Trend & Prioritization Focus Chart */}
      <DepartmentalVulnerabilityAgingChart
        findings={filteredFindings}
        onSelectFinding={onSelectFinding}
        onNavigateToTab={onNavigateToTab}
      />

      {/* Row 3: Priority Audit Actions Table + Assurance Coverage Trend (Faithful to bottom half of image) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        {/* Priority Audit Actions Table (Span 2) */}
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <span>Priority Audit Actions (IS Security Findings)</span>
                <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded font-normal">
                  {filteredFindings.length} Active Items
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Governance, IT Assets, IAM, EDR, SIEM/SOC, and Awareness Action Plans
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('findings')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
            >
              <span>Full Workpaper</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2">Action ID</th>
                  <th className="pb-2">Audit Area &amp; Finding</th>
                  <th className="pb-2">Owner</th>
                  <th className="pb-2">Target Date</th>
                  <th className="pb-2 text-center">Severity</th>
                  <th className="pb-2 text-center">Status</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredFindings.slice(0, 6).map((finding) => (
                  <tr
                    key={finding.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectFinding(finding)}
                  >
                    <td className="py-2.5 font-mono font-bold text-blue-400">
                      {finding.id}
                    </td>
                    <td className="py-2.5 pr-2">
                      <div className="font-semibold text-slate-200 group-hover:text-white transition-colors truncate max-w-xs">
                        {finding.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">
                        {finding.domain}
                      </div>
                    </td>
                    <td className="py-2.5 text-slate-300 font-medium">
                      {finding.owner}
                    </td>
                    <td className="py-2.5 font-mono text-slate-300">
                      {finding.targetDate}
                    </td>
                    <td className="py-2.5 text-center">
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase ${
                          finding.severity === 'Critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : finding.severity === 'High'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}
                      >
                        {finding.severity}
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${
                          finding.status === 'Remediated'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : finding.status === 'Overdue'
                            ? 'bg-rose-500/20 text-rose-300 font-bold'
                            : finding.status === 'In Progress'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-slate-700/40 text-slate-300'
                        }`}
                      >
                        {finding.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenAiForFinding(finding)}
                        className="px-2 py-1 text-[11px] bg-blue-600/30 hover:bg-blue-600 text-blue-200 border border-blue-500/40 rounded transition-all flex items-center gap-1 ml-auto"
                        title="AI Remediation Roadmap"
                      >
                        <Sparkles className="h-3 w-3 text-amber-300" />
                        <span>Remediate</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assurance Coverage Trend (Span 1) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-teal-400" />
                <span>Assurance Coverage Trend</span>
              </h3>
              <p className="text-xs text-slate-400">Monthly Progress (58% → 78%)</p>
            </div>
            <span className="text-xs font-mono font-bold text-teal-400">+20% YTD</span>
          </div>

          {/* Clean Vector SVG Chart */}
          <div className="py-2">
            <svg viewBox="0 0 320 140" className="w-full h-36">
              {/* Background horizontal grid lines */}
              <line x1="30" y1="20" x2="310" y2="20" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
              <line x1="30" y1="50" x2="310" y2="50" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
              <line x1="30" y1="80" x2="310" y2="80" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
              <line x1="30" y1="110" x2="310" y2="110" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />

              <text x="25" y="24" fill="#94a3b8" fontSize="8" textAnchor="end">100%</text>
              <text x="25" y="54" fill="#94a3b8" fontSize="8" textAnchor="end">75%</text>
              <text x="25" y="84" fill="#94a3b8" fontSize="8" textAnchor="end">50%</text>
              <text x="25" y="114" fill="#94a3b8" fontSize="8" textAnchor="end">25%</text>

              {/* Area under curve */}
              <defs>
                <linearGradient id="coverageGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <polygon
                points="40,110 40,82 65,78 90,75 115,73 140,70 165,65 190,62 215,59 240,56 265,54 290,48 290,110"
                fill="url(#coverageGradient)"
              />

              {/* Polyline */}
              <polyline
                fill="none"
                stroke="#14b8a6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="40,82 65,78 90,75 115,73 140,70 165,65 190,62 215,59 240,56 265,54 290,48"
              />

              {/* Final active point */}
              <circle cx="290" cy="48" r="4" fill="#2dd4bf" stroke="#0f172a" strokeWidth="2" />

              {/* Month labels */}
              <text x="40" y="126" fill="#94a3b8" fontSize="8" textAnchor="middle">Jan</text>
              <text x="90" y="126" fill="#94a3b8" fontSize="8" textAnchor="middle">Mar</text>
              <text x="140" y="126" fill="#94a3b8" fontSize="8" textAnchor="middle">May</text>
              <text x="190" y="126" fill="#94a3b8" fontSize="8" textAnchor="middle">Jul</text>
              <text x="240" y="126" fill="#94a3b8" fontSize="8" textAnchor="middle">Sep</text>
              <text x="290" y="126" fill="#94a3b8" fontSize="8" textAnchor="middle">Dec</text>
            </svg>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
            <span className="text-slate-400">Target Year-End: 85%</span>
            <span className="font-semibold text-teal-400">On Track for ISO &amp; Basel Audit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
