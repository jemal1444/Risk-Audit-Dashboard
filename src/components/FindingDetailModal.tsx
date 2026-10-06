import React from 'react';
import {
  AuditFinding,
  FindingStatus,
  RiskAssessmentStatus,
  AuditRectificationStatus,
} from '../types/audit';
import {
  X,
  ShieldAlert,
  Clock,
  Sparkles,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  User,
  Calendar,
  Layers,
  ChevronRight,
  Building2,
} from 'lucide-react';

interface FindingDetailModalProps {
  finding: AuditFinding | null;
  onClose: () => void;
  onOpenAi: (finding: AuditFinding) => void;
  onUpdateStatus: (id: string, newStatus: FindingStatus) => void;
  onUpdateAssessmentAndRectification?: (
    id: string,
    assessmentStatus: RiskAssessmentStatus,
    rectificationStatus: AuditRectificationStatus
  ) => void;
}

export const FindingDetailModal: React.FC<FindingDetailModalProps> = ({
  finding,
  onClose,
  onOpenAi,
  onUpdateStatus,
  onUpdateAssessmentAndRectification,
}) => {
  if (!finding) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b2447] border border-amber-500/40 rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-xs text-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-amber-500/30 flex items-center justify-between bg-[#071933]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
              {finding.id} (Item #{finding.itemNumber})
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40 flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              <span>{finding.departmentalUnit || 'IS Security'}</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
              {finding.domain}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                finding.severity === 'Critical'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {finding.severity} Risk
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          <div>
            <h2 className="text-base font-bold text-white mb-1.5">{finding.title}</h2>
            <p className="text-slate-300 leading-relaxed bg-[#071933] p-3 rounded-lg border border-slate-800">
              {finding.description}
            </p>
          </div>

          {/* Departmental & Audit Rectification Control Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg bg-[#071933] border border-amber-500/30">
            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">
                Risk Assessment Status:
              </label>
              <select
                value={finding.riskAssessmentStatus}
                onChange={(e) => {
                  if (onUpdateAssessmentAndRectification) {
                    onUpdateAssessmentAndRectification(
                      finding.id,
                      e.target.value as RiskAssessmentStatus,
                      finding.auditRectificationStatus
                    );
                  }
                }}
                className="w-full bg-slate-900 border border-amber-500/30 rounded px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="Not Assessed">Not Assessed</option>
                <option value="Assessment In Progress">Assessment In Progress</option>
                <option value="Assessed & Mitigated">Assessed &amp; Mitigated</option>
                <option value="Overdue Assessment">Overdue Assessment</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">
                Annual Audit Rectification Status:
              </label>
              <select
                value={finding.auditRectificationStatus}
                onChange={(e) => {
                  if (onUpdateAssessmentAndRectification) {
                    onUpdateAssessmentAndRectification(
                      finding.id,
                      finding.riskAssessmentStatus,
                      e.target.value as AuditRectificationStatus
                    );
                  }
                }}
                className="w-full bg-slate-900 border border-amber-500/30 rounded px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="Rectification In-Flight">Rectification In-Flight</option>
                <option value="Fully Rectified">Fully Rectified</option>
                <option value="Pending Audit Verification">Pending Audit Verification</option>
                <option value="Repeat Adverse Finding">Repeat Adverse Finding</option>
              </select>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="p-2 rounded bg-[#071933] border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Action Owner</span>
              <span className="text-slate-200 font-semibold">{finding.owner}</span>
              <span className="text-[10px] text-slate-400 block">{finding.ownerRole}</span>
            </div>
            <div className="p-2 rounded bg-[#071933] border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Target Completion</span>
              <span className="text-slate-200 font-mono font-semibold">{finding.targetDate}</span>
              <span className="text-[10px] text-rose-400 block">{finding.agingDays} Days Aged</span>
            </div>
            <div className="p-2 rounded bg-[#071933] border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Inherent / Residual</span>
              <span className="text-rose-400 font-semibold">{finding.inherentRisk}</span>
              <span className="text-slate-400 text-[10px]"> → {finding.residualRisk} Target</span>
            </div>
            <div className="p-2 rounded bg-[#071933] border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Evidence Status</span>
              <span className="text-emerald-400 font-semibold">{finding.evidenceStatus}</span>
            </div>
          </div>

          {/* Root Cause & Business Impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-[#071933] border border-slate-800">
              <span className="font-bold text-slate-200 block mb-1">Root Cause Analysis</span>
              <p className="text-slate-300 leading-relaxed">{finding.rootCause}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#071933] border border-slate-800">
              <span className="font-bold text-slate-200 block mb-1">Business Impact &amp; Exposure</span>
              <p className="text-slate-300 leading-relaxed">{finding.businessImpact}</p>
            </div>
          </div>

          {/* Regulatory Standards Mapped */}
          <div className="p-3 rounded-lg bg-[#071933] border border-slate-800">
            <span className="font-bold text-slate-200 block mb-1.5">
              Regulatory Standards &amp; Control Frameworks Crosswalk
            </span>
            <div className="flex flex-wrap gap-1.5">
              {finding.regulatoryClauses.map((clause, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-slate-900 border border-slate-700/80 rounded font-mono text-[11px] text-slate-300"
                >
                  {clause}
                </span>
              ))}
            </div>
          </div>

          {/* Sample Testing & Workpaper */}
          <div className="p-3 rounded-lg bg-[#071933] border border-slate-800 space-y-2">
            <span className="font-bold text-slate-200 block">
              Internal Audit Testing Workpaper (Sample Testing)
            </span>
            <p className="text-slate-300 italic">{finding.sampleTesting.testProcedure}</p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Sample Tested</span>
                <span className="font-mono font-bold text-white">{finding.sampleTesting.sampleSize}</span>
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Exceptions Found</span>
                <span className="font-mono font-bold text-rose-400">
                  {finding.sampleTesting.exceptionsFound}
                </span>
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Design / Operating</span>
                <span className="font-bold text-amber-400">
                  {finding.sampleTesting.designEffectiveness} / {finding.sampleTesting.operatingEffectiveness}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#071933] border-t border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Workpaper Status:</span>
            <select
              value={finding.status}
              onChange={(e) => onUpdateStatus(finding.id, e.target.value as FindingStatus)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 font-semibold"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Under Review">Under Review</option>
              <option value="Overdue">Overdue</option>
              <option value="Remediated">Remediated</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenAi(finding);
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-slate-950" />
              <span>Generate AI Remediation</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
