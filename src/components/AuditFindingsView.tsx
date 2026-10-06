import React, { useState } from 'react';
import {
  AuditFinding,
  DomainKey,
  Severity,
  FindingStatus,
  DepartmentalUnit,
  RiskAssessmentStatus,
  AuditRectificationStatus,
} from '../types/audit';
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  Clock,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  Check,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  Layers,
  PlusCircle,
  Building2,
  RotateCw,
} from 'lucide-react';

interface AuditFindingsViewProps {
  findings: AuditFinding[];
  onSelectFinding: (finding: AuditFinding) => void;
  onOpenAiForFinding: (finding: AuditFinding) => void;
  onUpdateFindingStatus: (id: string, newStatus: FindingStatus) => void;
  onOpenAddRisk?: () => void;
  onUpdateFindingAssessmentAndRectification?: (
    id: string,
    assessmentStatus: RiskAssessmentStatus,
    rectificationStatus: AuditRectificationStatus
  ) => void;
}

export const AuditFindingsView: React.FC<AuditFindingsViewProps> = ({
  findings,
  onSelectFinding,
  onOpenAiForFinding,
  onUpdateFindingStatus,
  onOpenAddRisk,
  onUpdateFindingAssessmentAndRectification,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('All');
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<string>('All');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [selectedAssessmentStatusFilter, setSelectedAssessmentStatusFilter] = useState<string>('All');
  const [selectedRectificationFilter, setSelectedRectificationFilter] = useState<string>('All');

  const filtered = findings.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.departmentalUnit && f.departmentalUnit.toLowerCase().includes(searchTerm.toLowerCase())) ||
      f.regulatoryClauses.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDomain =
      selectedDomainFilter === 'All' || f.domain === selectedDomainFilter;
    const matchesDepartment =
      selectedDepartmentFilter === 'All' || f.departmentalUnit === selectedDepartmentFilter;
    const matchesSeverity =
      selectedSeverityFilter === 'All' || f.severity === selectedSeverityFilter;
    const matchesStatus =
      selectedStatusFilter === 'All' || f.status === selectedStatusFilter;
    const matchesAssessment =
      selectedAssessmentStatusFilter === 'All' || f.riskAssessmentStatus === selectedAssessmentStatusFilter;
    const matchesRectification =
      selectedRectificationFilter === 'All' || f.auditRectificationStatus === selectedRectificationFilter;

    return (
      matchesSearch &&
      matchesDomain &&
      matchesDepartment &&
      matchesSeverity &&
      matchesStatus &&
      matchesAssessment &&
      matchesRectification
    );
  });

  // Departmental and Rectification Counts
  const rectificationInFlightCount = findings.filter(
    (f) => f.auditRectificationStatus === 'Rectification In-Flight'
  ).length;
  const fullyRectifiedCount = findings.filter(
    (f) => f.auditRectificationStatus === 'Fully Rectified'
  ).length;
  const pendingVerificationCount = findings.filter(
    (f) => f.auditRectificationStatus === 'Pending Audit Verification'
  ).length;
  const repeatAdverseCount = findings.filter(
    (f) => f.auditRectificationStatus === 'Repeat Adverse Finding'
  ).length;

  return (
    <div className="space-y-4">
      {/* Top Banner & Search Controls with Hijra Bank GRC Branding */}
      <div className="bg-gradient-to-r from-[#071933] via-[#0b2447] to-[#0d2a52] border border-amber-500/30 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-400" />
                <span>IS Security Control Audit Findings &amp; Departmental Risk Register</span>
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-mono">
                HIJRA BANK GRC
              </span>
            </div>
            <p className="text-xs text-amber-200/70 mt-0.5">
              16 Core IS Security Control Findings plus active departmental risk items from Network, Data Center, CBS, App Dev, MIS, PMO &amp; Security.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAddRisk && (
              <button
                onClick={onOpenAddRisk}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md border border-amber-300/40 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5 text-slate-950 stroke-[2.5]" />
                <span>+ Add Departmental Risk</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs">
              <span className="px-2 py-1 text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg">
                {findings.filter((f) => f.severity === 'Critical').length} Critical
              </span>
              <span className="px-2 py-1 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg">
                {findings.filter((f) => f.severity === 'High').length} High
              </span>
              <span className="px-2 py-1 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg font-mono">
                {findings.length} Total
              </span>
            </div>
          </div>
        </div>

        {/* Annual Audit Rectification Status Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2.5 pb-2 border-t border-amber-500/20 text-xs">
          <div
            onClick={() => setSelectedRectificationFilter('Rectification In-Flight')}
            className={`p-2 rounded-lg border cursor-pointer transition-all ${
              selectedRectificationFilter === 'Rectification In-Flight'
                ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">Rectification In-Flight</span>
              <span className="font-mono font-bold text-amber-400">{rectificationInFlightCount}</span>
            </div>
          </div>

          <div
            onClick={() => setSelectedRectificationFilter('Fully Rectified')}
            className={`p-2 rounded-lg border cursor-pointer transition-all ${
              selectedRectificationFilter === 'Fully Rectified'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">Fully Rectified</span>
              <span className="font-mono font-bold text-emerald-400">{fullyRectifiedCount}</span>
            </div>
          </div>

          <div
            onClick={() => setSelectedRectificationFilter('Pending Audit Verification')}
            className={`p-2 rounded-lg border cursor-pointer transition-all ${
              selectedRectificationFilter === 'Pending Audit Verification'
                ? 'bg-blue-500/20 border-blue-500 text-blue-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">Pending Verification</span>
              <span className="font-mono font-bold text-blue-400">{pendingVerificationCount}</span>
            </div>
          </div>

          <div
            onClick={() => setSelectedRectificationFilter('Repeat Adverse Finding')}
            className={`p-2 rounded-lg border cursor-pointer transition-all ${
              selectedRectificationFilter === 'Repeat Adverse Finding'
                ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-rose-400">Repeat Adverse</span>
              <span className="font-mono font-bold text-rose-400">{repeatAdverseCount}</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar - Full Multi-dimensional Filtering */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 pt-2.5 border-t border-slate-800/80">
          {/* Search box */}
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search findings, department, CVEs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDepartmentFilter}
              onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Departments (8)</option>
              <option value="IS Infrastructure - Network Manager">Network Manager</option>
              <option value="IS Infrastructure - Data Center & Administration">Data Center &amp; Admin</option>
              <option value="IS Infrastructure - IS Operation Support">IS Operation Support</option>
              <option value="IS Operation & Application - CBS Operation">CBS Operation</option>
              <option value="IS Operation & Application - IS Application Development">IS App Development</option>
              <option value="MIS (Management Information Systems)">MIS</option>
              <option value="IS Project Management">IS Project Mgmt</option>
              <option value="IS Security">IS Security</option>
            </select>
          </div>

          {/* Risk Assessment Status Filter */}
          <div>
            <select
              value={selectedAssessmentStatusFilter}
              onChange={(e) => setSelectedAssessmentStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Assessment Statuses</option>
              <option value="Not Assessed">Not Assessed</option>
              <option value="Assessment In Progress">Assessment In Progress</option>
              <option value="Assessed & Mitigated">Assessed &amp; Mitigated</option>
              <option value="Overdue Assessment">Overdue Assessment</option>
            </select>
          </div>

          {/* Rectification Filter */}
          <div>
            <select
              value={selectedRectificationFilter}
              onChange={(e) => setSelectedRectificationFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Rectifications</option>
              <option value="Rectification In-Flight">Rectification In-Flight</option>
              <option value="Fully Rectified">Fully Rectified</option>
              <option value="Pending Audit Verification">Pending Verification</option>
              <option value="Repeat Adverse Finding">Repeat Adverse Finding</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Workpaper Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Under Review">Under Review</option>
              <option value="Overdue">Overdue</option>
              <option value="Remediated">Remediated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Findings List Cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-xs">
            No audit findings match the current filter criteria.
          </div>
        )}

        {filtered.map((finding) => (
          <div
            key={finding.id}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 shadow-sm transition-all group"
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                  {finding.id} (Item #{finding.itemNumber})
                </span>

                {/* Responsible Departmental Unit Pill */}
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#0b2447] text-amber-300 border border-amber-500/40 font-semibold flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-amber-400" />
                  <span>{finding.departmentalUnit || 'IS Security'}</span>
                </span>

                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium border border-slate-700/60">
                  {finding.domain}
                </span>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    finding.severity === 'Critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : finding.severity === 'High'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  }`}
                >
                  {finding.severity} (Score: {finding.riskScore}/25)
                </span>
              </div>

              {/* Status and SLA Aging */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Aged: {finding.agingDays}d</span>
                  <span className="text-slate-400">({finding.agingBucket})</span>
                </div>

                <select
                  value={finding.status}
                  onChange={(e) => onUpdateFindingStatus(finding.id, e.target.value as FindingStatus)}
                  className={`text-xs rounded px-2 py-1 font-semibold border ${
                    finding.status === 'Remediated'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                      : finding.status === 'Overdue'
                      ? 'bg-rose-950/80 text-rose-300 border-rose-600'
                      : finding.status === 'In Progress'
                      ? 'bg-blue-950/80 text-blue-300 border-blue-600'
                      : 'bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Remediated">Remediated</option>
                </select>
              </div>
            </div>

            {/* Title & Description */}
            <h3
              onClick={() => onSelectFinding(finding)}
              className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors cursor-pointer mb-1.5"
            >
              {finding.title}
            </h3>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              {finding.description}
            </p>

            {/* Risk Assessment Status & Annual Audit Rectification Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 mb-3 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-medium">Risk Assessment Status:</span>
                <select
                  value={finding.riskAssessmentStatus}
                  onChange={(e) => {
                    const newAssess = e.target.value as RiskAssessmentStatus;
                    if (onUpdateFindingAssessmentAndRectification) {
                      onUpdateFindingAssessmentAndRectification(
                        finding.id,
                        newAssess,
                        finding.auditRectificationStatus
                      );
                    }
                  }}
                  className={`text-[11px] rounded px-2 py-1 font-semibold border ${
                    finding.riskAssessmentStatus === 'Assessed & Mitigated'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : finding.riskAssessmentStatus === 'Overdue Assessment'
                      ? 'bg-rose-950 text-rose-300 border-rose-700'
                      : finding.riskAssessmentStatus === 'Assessment In Progress'
                      ? 'bg-amber-950 text-amber-300 border-amber-700'
                      : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  <option value="Not Assessed">Not Assessed</option>
                  <option value="Assessment In Progress">Assessment In Progress</option>
                  <option value="Assessed & Mitigated">Assessed &amp; Mitigated</option>
                  <option value="Overdue Assessment">Overdue Assessment</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-medium">Annual Audit Rectification:</span>
                <select
                  value={finding.auditRectificationStatus}
                  onChange={(e) => {
                    const newRect = e.target.value as AuditRectificationStatus;
                    if (onUpdateFindingAssessmentAndRectification) {
                      onUpdateFindingAssessmentAndRectification(
                        finding.id,
                        finding.riskAssessmentStatus,
                        newRect
                      );
                    }
                  }}
                  className={`text-[11px] rounded px-2 py-1 font-semibold border ${
                    finding.auditRectificationStatus === 'Fully Rectified'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : finding.auditRectificationStatus === 'Repeat Adverse Finding'
                      ? 'bg-rose-950 text-rose-300 border-rose-700'
                      : finding.auditRectificationStatus === 'Pending Audit Verification'
                      ? 'bg-blue-950 text-blue-300 border-blue-700'
                      : 'bg-amber-950 text-amber-300 border-amber-700'
                  }`}
                >
                  <option value="Rectification In-Flight">Rectification In-Flight</option>
                  <option value="Fully Rectified">Fully Rectified</option>
                  <option value="Pending Audit Verification">Pending Audit Verification</option>
                  <option value="Repeat Adverse Finding">Repeat Adverse Finding</option>
                </select>
              </div>
            </div>

            {/* 3-Lines of Defense Status Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 px-3 bg-slate-950/60 rounded-lg border border-slate-800/80 mb-3 text-[11px]">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">1st Line (Operations):</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-block h-2 w-2 rounded-full ${
                    finding.threeLines.line1Operations.status === 'Compliant'
                      ? 'bg-emerald-400'
                      : finding.threeLines.line1Operations.status === 'Remediating'
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                  }`} />
                  <span className="font-medium text-slate-200">{finding.threeLines.line1Operations.status}</span>
                  <span className="text-[10px] text-slate-400 truncate">({finding.threeLines.line1Operations.notes})</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">2nd Line (Risk &amp; Comp):</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-block h-2 w-2 rounded-full ${
                    finding.threeLines.line2Risk.status === 'Validated'
                      ? 'bg-emerald-400'
                      : finding.threeLines.line2Risk.status === 'Monitoring'
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                  }`} />
                  <span className="font-medium text-slate-200">{finding.threeLines.line2Risk.status}</span>
                  <span className="text-[10px] text-slate-400 truncate">({finding.threeLines.line2Risk.notes})</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">3rd Line (Internal Audit):</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-block h-2 w-2 rounded-full ${
                    finding.threeLines.line3InternalAudit.status === 'Closed'
                      ? 'bg-emerald-400'
                      : finding.threeLines.line3InternalAudit.status === 'Testing'
                      ? 'bg-blue-400'
                      : 'bg-rose-400'
                  }`} />
                  <span className="font-medium text-slate-200">{finding.threeLines.line3InternalAudit.status}</span>
                  <span className="text-[10px] text-slate-400 truncate">({finding.threeLines.line3InternalAudit.notes})</span>
                </div>
              </div>
            </div>

            {/* Bottom Meta & Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400">
                  Owner: <strong className="text-slate-200">{finding.owner}</strong> ({finding.ownerRole})
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400">
                  Target: <span className="font-mono text-slate-300">{finding.targetDate}</span>
                </span>
                <span className="text-slate-400">•</span>
                <div className="flex items-center gap-1">
                  {finding.regulatoryClauses.slice(0, 2).map((reg, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded font-mono"
                    >
                      {reg.split(':')[0]}
                    </span>
                  ))}
                  {finding.regulatoryClauses.length > 2 && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      +{finding.regulatoryClauses.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectFinding(finding)}
                  className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-all"
                >
                  Workpaper Details
                </button>

                <button
                  onClick={() => onOpenAiForFinding(finding)}
                  className="px-2.5 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded transition-all flex items-center gap-1.5 shadow-sm shadow-blue-900/30"
                >
                  <Sparkles className="h-3 w-3 text-amber-300" />
                  <span>AI Remediation Blueprint</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
