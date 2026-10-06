import React, { useState } from 'react';
import { AuditFinding, DepartmentalUnit } from '../types/audit';
import { D3RiskHeatmap } from './D3RiskHeatmap';
import {
  KEY_RISK_INDICATORS,
  VULNERABILITY_SLA_RULES,
  ESCALATION_PROCEDURES,
  RISK_APPETITE_FRAMEWORK,
} from '../data/auditData';
import {
  AlertTriangle,
  ShieldAlert,
  Activity,
  Sliders,
  TrendingDown,
  Clock,
  ArrowUpRight,
  FileText,
  AlertOctagon,
  CheckCircle2,
  Bell,
  Scale,
  Calendar,
  Layers,
  ChevronRight,
  Zap,
  Building2,
  PlusCircle,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface RiskMatrixViewProps {
  findings: AuditFinding[];
  onSelectFinding: (finding: AuditFinding) => void;
  onOpenAddRisk?: () => void;
}

export const RiskMatrixView: React.FC<RiskMatrixViewProps> = ({
  findings,
  onSelectFinding,
  onOpenAddRisk,
}) => {
  const [activeTab, setActiveTab] = useState<
    'heatmap' | 'monitoring' | 'appetite' | 'assessment' | 'sla' | 'escalation' | 'departmental'
  >('heatmap');
  const [toleranceScore, setToleranceScore] = useState<number>(12); // Board-defined cutoff
  const [simulatedEscalationNotice, setSimulatedEscalationNotice] = useState<string | null>(null);

  // Metrics
  const criticalFindings = findings.filter((f) => f.severity === 'Critical');
  const breachedSlaFindings = findings.filter((f) => f.agingDays > f.remediationSlaDays);

  const handleTriggerSimulatedEscalation = (tierName: string) => {
    setSimulatedEscalationNotice(
      `🚨 [ACTIVE ESCALATION DISPATCHED] ${tierName} broadcasted to Chief Risk Officer, CISO, and Board Audit Committee. Automated emergency change window opened.`
    );
    setTimeout(() => {
      setSimulatedEscalationNotice(null);
    }, 6000);
  };

  const DEPARTMENTAL_LIST: {
    unit: DepartmentalUnit;
    division: string;
    lead: string;
    role: string;
    description: string;
  }[] = [
    {
      unit: 'IS Infrastructure - Network Manager',
      division: '1. IS Infrastructure',
      lead: 'Ahmed K.',
      role: 'Network Infrastructure Manager',
      description: 'Core switches, SD-WAN, perimeter firewalls, VPN gateways, SWIFT network connectivity.',
    },
    {
      unit: 'IS Infrastructure - Data Center & Administration',
      division: '1. IS Infrastructure',
      lead: 'Dawit M.',
      role: 'Data Center Facilities Lead',
      description: 'Tier-4 primary DC, SAN storage arrays, hypervisors, cooling, dual UPS, physical access.',
    },
    {
      unit: 'IS Infrastructure - IS Operation Support',
      division: '1. IS Infrastructure',
      lead: 'Sara B.',
      role: 'Head of IS Operations Support',
      description: 'Branch workstations, teller terminals, POS networks, helpdesk ticketing, remote desktop support.',
    },
    {
      unit: 'IS Operation & Application - CBS Operation',
      division: '2. IS Operation & Application',
      lead: 'Yared T.',
      role: 'CBS Operations & EOD Batch Lead',
      description: 'Finacle core banking transactions, End-of-Day (EOD) batch processing, interest-free Islamic ledger.',
    },
    {
      unit: 'IS Operation & Application - IS Application Development',
      division: '2. IS Operation & Application',
      lead: 'Fatima A.',
      role: 'Lead Applications Architect',
      description: 'Mobile banking app, Internet Banking, payment switch APIs, CI/CD pipeline, DevSecOps.',
    },
    {
      unit: 'MIS (Management Information Systems)',
      division: '3. Management Information Systems',
      lead: 'Kassahun L.',
      role: 'MIS & Regulatory Reporting Director',
      description: 'National Bank of Ethiopia (NBE) regulatory reporting, BI data warehouses, ETL pipelines.',
    },
    {
      unit: 'IS Project Management',
      division: '4. IS Project Management',
      lead: 'Mulugeta Z.',
      role: 'IS PMO Director',
      description: 'Digital transformation initiatives, third-party vendor oversight, SLA enforcement, milestone tracking.',
    },
    {
      unit: 'IS Security',
      division: '5. IS Security (CISO Office)',
      lead: 'Priya M.',
      role: 'Chief Information Security Officer',
      description: '24x7 SOC, Threat Hunting, IAM/PAM enforcement, EDR telemetry, SIEM logging architecture.',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner with Hijra Bank Branding */}
      <div className="bg-gradient-to-r from-[#071933] via-[#0b2447] to-[#0d2a52] border border-amber-500/30 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-400" />
                <span>Enterprise IT Risk Management Program &amp; D3.js Heatmap</span>
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono">
                HIJRA BANK GRC
              </span>
            </div>
            <p className="text-xs text-amber-200/70 mt-0.5">
              Comprehensive framework addressing Finding #3 &amp; #4: Risk Appetite, Tolerance, Continuous Monitoring, Assessment, Aging Metrics, Escalation, and Departmental Rectification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAddRisk && (
              <button
                onClick={onOpenAddRisk}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md border border-amber-300/40 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5 text-slate-950 stroke-[2.5]" />
                <span>+ Log Departmental Risk</span>
              </button>
            )}

            {/* Tolerance Cutoff Control */}
            <div className="flex items-center gap-2.5 bg-slate-950/80 p-2 rounded-lg border border-amber-500/30 text-xs">
              <span className="text-slate-400 font-medium">Board Appetite Limit:</span>
              <span className="font-mono font-bold text-amber-400">Score &le; {toleranceScore}</span>
              <input
                type="range"
                min="8"
                max="20"
                value={toleranceScore}
                onChange={(e) => setToleranceScore(Number(e.target.value))}
                className="accent-amber-500 w-20 cursor-pointer"
                title="Adjust Board Risk Appetite Cutoff"
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation across IT Risk Management Program Pillars */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-amber-500/20 text-xs">
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'heatmap'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            📊 D3.js 5×5 Risk Heatmap
          </button>
          <button
            onClick={() => setActiveTab('departmental')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'departmental'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-[#0f3460] text-amber-200 hover:bg-[#164177] border border-amber-500/30'
            }`}
          >
            🏛️ Departmental Risks &amp; Rectification
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'monitoring'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            📡 Continuous Risk Monitoring (KRIs)
          </button>
          <button
            onClick={() => setActiveTab('appetite')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'appetite'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ⚖️ Risk Appetite &amp; Tolerance
          </button>
          <button
            onClick={() => setActiveTab('assessment')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'assessment'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            📐 Risk Assessment Methodology
          </button>
          <button
            onClick={() => setActiveTab('sla')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'sla'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ⏱️ Remediation SLAs &amp; Aging
          </button>
          <button
            onClick={() => setActiveTab('escalation')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'escalation'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🚨 Escalation Procedures
          </button>
        </div>
      </div>

      {/* Simulated Escalation Banner */}
      {simulatedEscalationNotice && (
        <div className="bg-rose-950 border border-rose-500 text-rose-200 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Bell className="h-4 w-4 shrink-0 text-amber-300 animate-spin" />
          <span>{simulatedEscalationNotice}</span>
        </div>
      )}

      {/* TAB 1: D3.js 5x5 Heatmap */}
      {activeTab === 'heatmap' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left 2 Cols: Interactive D3 Canvas */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <span>Interactive D3.js Likelihood vs. Impact Matrix (16 Findings Plotted)</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Click any node to inspect audit paper
              </span>
            </div>

            <D3RiskHeatmap
              findings={findings}
              toleranceScore={toleranceScore}
              onSelectFinding={onSelectFinding}
            />
          </div>

          {/* Right Col: Risk Quantification & Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between text-xs">
            <div>
              <h3 className="font-bold text-slate-200 uppercase tracking-wide pb-2 border-b border-slate-800 mb-3 flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-emerald-400" />
                <span>Inherent vs. Residual Migration</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <span className="text-slate-400 block text-[10px]">Current Inherent Risk Index</span>
                  <div className="flex items-center justify-between">
                    <span className="text-rose-400 font-bold text-sm">Critical Exposure</span>
                    <span className="font-mono text-xs text-rose-300">Score: 21.4 Avg</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {criticalFindings.length} findings exceed Board Tolerance of {toleranceScore}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <span className="text-slate-400 block text-[10px]">Target Residual Post-Controls</span>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold text-sm">Controlled Residual</span>
                    <span className="font-mono text-xs text-emerald-300">Score: 4.8 Target</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '22%' }} />
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold">
                    100% of findings migrate below Tolerance Line
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                  <strong>Risk Migration Insight:</strong> Toggle to &quot;Residual Risk&quot; above to visualize how implementing MFA (F-06), CMDB asset reconciliation (F-05), and 24x7 SOC (F-13) pulls all critical nodes into the green acceptable zone.
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Risk Register ID: RR-2026-IS</span>
              <span className="text-emerald-400 font-semibold">ISO 31000 Attested</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Departmental IT Risk & Annual Rectification Status */}
      {activeTab === 'departmental' && (
        <div className="space-y-4">
          {/* Overview summary */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#071933] via-[#0b2447] to-[#0f3460] border border-amber-500/30 text-xs shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow border border-amber-300/40">
                  <Building2 className="h-5 w-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Departmental IT Risk Assessment &amp; Annual Audit Rectification Matrix</span>
                    <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                      8 OPERATIONAL UNITS
                    </span>
                  </h3>
                  <p className="text-amber-200/70 text-xs mt-0.5">
                    Covers IS Infrastructure (Network, Data Center, Support), IS Operations &amp; Applications (CBS, App Dev), MIS, PMO &amp; IS Security.
                  </p>
                </div>
              </div>

              {onOpenAddRisk && (
                <button
                  onClick={onOpenAddRisk}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md border border-amber-300/40 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4 stroke-[2.5]" />
                  <span>+ Log Departmental Risk</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-amber-500/20 text-[11px]">
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Total Findings Tracked</span>
                <span className="font-mono font-bold text-white">{findings.length} Items</span>
              </div>
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <span className="text-emerald-300">Fully Rectified</span>
                <span className="font-mono font-bold text-emerald-400">
                  {findings.filter((f) => f.auditRectificationStatus === 'Fully Rectified').length}
                </span>
              </div>
              <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <span className="text-amber-300">Rectification In-Flight</span>
                <span className="font-mono font-bold text-amber-400">
                  {findings.filter((f) => f.auditRectificationStatus === 'Rectification In-Flight').length}
                </span>
              </div>
              <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                <span className="text-rose-300">Repeat Adverse Findings</span>
                <span className="font-mono font-bold text-rose-400">
                  {findings.filter((f) => f.auditRectificationStatus === 'Repeat Adverse Finding').length}
                </span>
              </div>
            </div>
          </div>

          {/* Cards for each of the 8 Departmental Units */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {DEPARTMENTAL_LIST.map((dept, idx) => {
              const deptFindings = findings.filter(
                (f) => f.departmentalUnit === dept.unit
              );
              const criticalCount = deptFindings.filter((f) => f.severity === 'Critical').length;
              const highCount = deptFindings.filter((f) => f.severity === 'High').length;
              const rectifiedCount = deptFindings.filter(
                (f) => f.auditRectificationStatus === 'Fully Rectified'
              ).length;
              const overdueAssessCount = deptFindings.filter(
                (f) => f.riskAssessmentStatus === 'Overdue Assessment'
              ).length;
              const rectificationPct = deptFindings.length > 0
                ? Math.round((rectifiedCount / deptFindings.length) * 100)
                : 0;

              return (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 shadow-sm transition-all flex flex-col justify-between text-xs space-y-3"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-mono">
                          {dept.division}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                          <Building2 className="h-4 w-4 text-amber-400" />
                          <span>{dept.unit}</span>
                        </h4>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Lead: <strong className="text-slate-200">{dept.lead}</strong> ({dept.role})
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/30 font-mono font-bold text-xs shrink-0">
                        {deptFindings.length} Risks Logged
                      </span>
                    </div>

                    {/* Scope description */}
                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                      {dept.description}
                    </p>

                    {/* Metrics bar */}
                    <div className="grid grid-cols-3 gap-2 mt-2.5 p-2 bg-slate-950/70 rounded-lg border border-slate-800 text-[11px]">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Critical / High:</span>
                        <span className="font-mono font-bold text-rose-400">
                          {criticalCount} Crit / {highCount} High
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Assessment Status:</span>
                        <span
                          className={`font-semibold ${
                            overdueAssessCount > 0 ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {overdueAssessCount > 0 ? `${overdueAssessCount} Overdue` : 'Current'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Rectification:</span>
                        <span className="font-mono font-bold text-amber-400">
                          {rectificationPct}% Complete
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Annual Audit Rectification Progress</span>
                        <span className="font-mono text-emerald-400">{rectifiedCount}/{deptFindings.length} Rectified</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                          style={{ width: `${Math.max(10, rectificationPct)}%` }}
                        />
                      </div>
                    </div>

                    {/* Department Findings list */}
                    <div className="mt-3 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                        Associated Audit Findings ({deptFindings.length}):
                      </span>
                      {deptFindings.length === 0 ? (
                        <div className="p-2 text-center text-slate-500 text-[11px] italic bg-slate-950/40 rounded">
                          No active audit findings currently assigned to this unit.
                        </div>
                      ) : (
                        deptFindings.map((f) => (
                          <div
                            key={f.id}
                            onClick={() => onSelectFinding(f)}
                            className="p-2 rounded bg-slate-950/50 hover:bg-slate-800 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-all flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-mono text-[10px] font-bold text-blue-400 shrink-0">
                                {f.id}
                              </span>
                              <span className="text-slate-200 truncate font-medium text-[11px]">
                                {f.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                  f.severity === 'Critical'
                                    ? 'bg-rose-500/20 text-rose-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {f.severity}
                              </span>
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                                  f.auditRectificationStatus === 'Fully Rectified'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : f.auditRectificationStatus === 'Repeat Adverse Finding'
                                    ? 'bg-rose-500/20 text-rose-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {f.auditRectificationStatus === 'Fully Rectified'
                                  ? 'Rectified'
                                  : f.auditRectificationStatus === 'Repeat Adverse Finding'
                                  ? 'Repeat'
                                  : 'In-Flight'}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Card bottom action */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">GRC SLA: 14-30 Days</span>
                    {onOpenAddRisk && (
                      <button
                        onClick={onOpenAddRisk}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Add Finding to {dept.lead.split(' ')[0]}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* TAB 2: Continuous Risk Monitoring (KRIs) */}
      {activeTab === 'monitoring' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span>Continuous Risk Monitoring &amp; Key Risk Indicators (KRIs)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated telemetry feeds measuring real-time operational risk thresholds against formal Board tolerances.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded-lg font-bold">
              5 KRIs in RED Trigger State
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2.5">KRI ID &amp; Name</th>
                  <th className="pb-2.5">Domain</th>
                  <th className="pb-2.5 text-center">Current Observed</th>
                  <th className="pb-2.5 text-center">Target Threshold</th>
                  <th className="pb-2.5 text-center">Tolerance Ceiling</th>
                  <th className="pb-2.5 text-center">Status</th>
                  <th className="pb-2.5 text-center">Trend</th>
                  <th className="pb-2.5 text-right">Telemetry Cadence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {KEY_RISK_INDICATORS.map((kri) => (
                  <tr key={kri.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5">
                      <div className="font-mono font-bold text-blue-400">{kri.id}</div>
                      <div className="font-semibold text-slate-200">{kri.name}</div>
                    </td>
                    <td className="py-2.5 text-slate-400">{kri.category}</td>
                    <td className="py-2.5 text-center font-mono font-bold text-rose-400">
                      {kri.currentValue} {kri.unit}
                    </td>
                    <td className="py-2.5 text-center font-mono text-emerald-400">
                      {kri.targetThreshold} {kri.unit}
                    </td>
                    <td className="py-2.5 text-center font-mono text-amber-400">
                      {kri.toleranceLimit} {kri.unit}
                    </td>
                    <td className="py-2.5 text-center">
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded font-bold ${
                          kri.status === 'RED'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : kri.status === 'AMBER'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {kri.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-center text-slate-300 capitalize font-medium">
                      {kri.trend}
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-400">
                      {kri.frequency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Risk Appetite & Tolerance */}
      {activeTab === 'appetite' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Scale className="h-4 w-4 text-amber-400" />
              <span>Board Risk Appetite Statement &amp; Governance Charter</span>
            </h3>
            <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800 italic">
              &quot;{RISK_APPETITE_FRAMEWORK.appetiteStatement}&quot;
            </p>

            <div className="space-y-2 pt-1">
              <span className="font-bold text-slate-200 block">Quantitative Tolerance Limits:</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Maximum Acceptable Risk Score</span>
                  <span className="text-amber-400 font-bold font-mono">Score &le; 12 / 25</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Critical Findings Tolerance</span>
                  <span className="text-rose-400 font-bold font-mono">0 (Zero Tolerance)</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">High Findings Tolerance</span>
                  <span className="text-amber-400 font-bold font-mono">Max 3 In-Flight</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Critical Patch SLA Limit</span>
                  <span className="text-emerald-400 font-bold font-mono">14 Calendar Days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Layers className="h-4 w-4 text-blue-400" />
              <span>Regulatory Alignment &amp; Standards Crosswalk</span>
            </h3>

            <div className="space-y-2">
              {RISK_APPETITE_FRAMEWORK.frameworkAlignments.map((fw, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-slate-200"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{fw}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] leading-relaxed">
              <strong>Tolerance Breach Condition:</strong> Currently 4 Critical findings (F-03, F-05, F-06, F-12) breach the Board zero-tolerance limit. Mandatory monthly reporting is currently escalated to bi-weekly reporting.
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Risk Assessment Methodology */}
      {activeTab === 'assessment' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4 text-xs">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="h-4 w-4 text-blue-400" />
              <span>Standardized 5×5 Risk Assessment Criteria</span>
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Standardized scoring rubric used to calculate Inherent and Residual Risk (Risk Score = Likelihood × Impact).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Likelihood Rubric */}
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block text-xs uppercase text-blue-400">
                Likelihood Scale (1 to 5)
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="font-bold text-slate-200">5: Almost Certain</span>
                  <span className="text-slate-400">Occurs multiple times/month or active exploit detected</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="font-bold text-slate-200">4: Likely</span>
                  <span className="text-slate-400">Occurs annually or known public exploit available</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="font-bold text-slate-200">3: Moderate</span>
                  <span className="text-slate-400">Plausible within 2-3 years; requires moderate skill</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="font-bold text-slate-200">2: Unlikely</span>
                  <span className="text-slate-400">Unlikely but possible; requires advanced threat actor</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="font-bold text-slate-200">1: Rare</span>
                  <span className="text-slate-400">Theoretical zero-day; highly controlled environment</span>
                </div>
              </div>
            </div>

            {/* Impact Rubric */}
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block text-xs uppercase text-rose-400">
                Impact Scale (1 to 5)
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="font-bold text-slate-200">5: Catastrophic</span>
                  <span className="text-slate-400">&gt;$5M loss, license revocation, core banking outage &gt;4h</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="font-bold text-slate-200">4: Major</span>
                  <span className="text-slate-400">$1M - $5M loss, regulatory sanction, branch network outage</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="font-bold text-slate-200">3: Moderate</span>
                  <span className="text-slate-400">$250k - $1M loss, formal supervisory inquiry, partial degradation</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="font-bold text-slate-200">2: Minor</span>
                  <span className="text-slate-400">&lt;$250k loss, minor regulatory report, localized downtime</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="font-bold text-slate-200">1: Insignificant</span>
                  <span className="text-slate-400">Negligible financial impact; internal administrative correction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Vulnerability Remediation Timelines & Aging Metrics */}
      {activeTab === 'sla' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <span>Vulnerability Remediation Timelines &amp; Aging Metrics (Finding #4 Remediation)</span>
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Formal SLA governance codifying patching windows, escalation thresholds, and aging velocity across all technical assets.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded-lg font-bold">
              {breachedSlaFindings.length} Audit Findings Overdue SLA
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2.5">Severity Tier</th>
                  <th className="pb-2.5">CVSS v3.1 Range</th>
                  <th className="pb-2.5 text-center">Mandatory SLA</th>
                  <th className="pb-2.5 text-center">Escalation Trigger</th>
                  <th className="pb-2.5">Authority Notified</th>
                  <th className="pb-2.5 text-right">Target Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {VULNERABILITY_SLA_RULES.map((rule) => (
                  <tr key={rule.severity} className="hover:bg-slate-800/40">
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded font-bold uppercase ${
                          rule.severity === 'Critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : rule.severity === 'High'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : rule.severity === 'Medium'
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {rule.severity}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-slate-300">{rule.cvssRange}</td>
                    <td className="py-2.5 text-center font-mono font-bold text-rose-400">
                      {rule.slaDays} Calendar Days
                    </td>
                    <td className="py-2.5 text-center font-mono text-amber-400">
                      Day {rule.agingEscalationDay}
                    </td>
                    <td className="py-2.5 text-slate-300">{rule.escalationTarget}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-400">
                      {rule.complianceTargetPct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: Escalation Procedures */}
      {activeTab === 'escalation' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertOctagon className="h-4 w-4 text-rose-400" />
                <span>Formal Tiered Escalation Procedures (Finding #4 Remediation)</span>
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Automated escalation protocol when vulnerability remediation or audit action milestones breach SLA thresholds.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {ESCALATION_PROCEDURES.map((proc, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400 text-xs">{proc.tier}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded font-mono">
                      Turnaround: {proc.turnaroundHours}h
                    </span>
                  </div>
                  <div className="text-slate-200 font-semibold">{proc.triggerCondition}</div>
                  <div className="text-slate-400 text-[11px]">
                    <strong>Mandate:</strong> {proc.actionMandate}
                  </div>
                  <div className="text-[10px] text-blue-400">
                    <strong>Responsible Authority:</strong> {proc.authority}
                  </div>
                </div>

                <button
                  onClick={() => handleTriggerSimulatedEscalation(proc.tier)}
                  className="px-3 py-1.5 bg-rose-600/30 hover:bg-rose-600 text-rose-200 border border-rose-500/40 rounded transition-all font-semibold flex items-center gap-1.5"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Simulate Escalation</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
