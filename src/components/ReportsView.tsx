import React, { useState } from 'react';
import { AuditFinding, ControlTestMatrixRow, ITAsset, Severity } from '../types/audit';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileDown,
  Building2,
  Sliders,
  Check,
  Sparkles,
  Award,
} from 'lucide-react';
import { exportFindingsToCSV, exportAssetsToCSV } from '../utils/exportUtils';

interface ReportsViewProps {
  findings: AuditFinding[];
  assets: ITAsset[];
  controlTests: ControlTestMatrixRow[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  findings,
  assets,
  controlTests,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Critical & High' | 'Critical Only'>('All');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [includeSignatures, setIncludeSignatures] = useState(true);
  const [includeRectificationSchedule, setIncludeRectificationSchedule] = useState(true);

  const displayedFindings = findings.filter((f) => {
    if (severityFilter === 'Critical Only') return f.severity === 'Critical';
    if (severityFilter === 'Critical & High') return f.severity === 'Critical' || f.severity === 'High';
    return true;
  });

  const criticalFindings = displayedFindings.filter((f) => f.severity === 'Critical');
  const overdueFindings = displayedFindings.filter((f) => f.status === 'Overdue' || f.agingDays > 90);

  const handleGeneratePdf = () => {
    setIsGeneratingPdf(true);
    // Give browser a moment to update DOM before triggering print
    setTimeout(() => {
      window.print();
      setIsGeneratingPdf(false);
    }, 250);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-400" />
              <span>Audit Committee Pack &amp; Executive Compliance Dossier</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Formal audit committee pack summarizing the 16 IS Security Control findings, residual risk posture, and management corrective actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Generate PDF Report Button */}
            <button
              onClick={handleGeneratePdf}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-lg transition-all shadow-md shadow-amber-950/40 border border-amber-300/40 cursor-pointer"
              title="Format and generate professional PDF compliance report"
            >
              <FileDown className="h-4 w-4 stroke-[2.5]" />
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Generate PDF Report'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-all cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-blue-400" />
              <span>Quick Print</span>
            </button>

            <button
              onClick={() => exportFindingsToCSV(displayedFindings)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-sm shadow-emerald-900/30 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* PDF Report Formatting Options */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">PDF Scope:</span>
            {(['All', 'Critical & High', 'Critical Only'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setSeverityFilter(opt)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  severityFilter === opt
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {opt} ({findings.filter((f) => opt === 'All' ? true : opt === 'Critical Only' ? f.severity === 'Critical' : f.severity === 'Critical' || f.severity === 'High').length})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeRectificationSchedule}
                onChange={(e) => setIncludeRectificationSchedule(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-amber-400"
              />
              <span className="text-[11px]">Include Rectification Schedule</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeSignatures}
                onChange={(e) => setIncludeSignatures(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-amber-400"
              />
              <span className="text-[11px]">Include Executive Signatures</span>
            </label>
          </div>
        </div>
      </div>

      {/* Formal Printable Audit Committee Document */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6 text-xs text-slate-200 print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="border-b border-amber-500/30 pb-4 flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-wider uppercase text-amber-400 font-bold">
                HIJRA BANK // BOARD AUDIT &amp; RISK COMMITTEE PACK
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                CONFIDENTIAL
              </span>
            </div>
            <h1 className="text-lg font-extrabold text-white print:text-black">
              INFORMATION SYSTEMS (IS) SECURITY CONTROL AUDIT REPORT
            </h1>
            <p className="text-xs text-amber-200/70 print:text-gray-600 mt-0.5">
              Real-Time Compliance Monitoring, Departmental IS Assessment, and Annual Audit Rectification Dossier
            </p>
          </div>
          <div className="text-right font-mono text-[11px] text-slate-400 print:text-gray-600">
            <div>AUDIT REF: HB-IS-AUD-2026-Q2</div>
            <div>DATE: OCTOBER 2026</div>
            <div>STATUS: ADVERSE DEFICIENCIES NOTED</div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-white print:text-black uppercase tracking-wide flex items-center gap-2">
            <span className="text-amber-400">1.0</span> Executive Summary &amp; Fiduciary Notice
          </h2>
          <p className="text-slate-300 print:text-gray-800 leading-relaxed">
            The Internal Audit Division of Hijra Bank has concluded a comprehensive review of the Bank's Information Systems Security Controls, encompassing Governance, Asset Management, Identity and Access Management (MFA/PAM), Endpoint Protection, SIEM/SOC capabilities, and Security Awareness. A total of <strong>{findings.length} material deficiencies</strong> have been identified across IS Infrastructure, CBS Operations, MIS, IT PMO, and IS Security, of which <strong>{criticalFindings.length} are rated Critical</strong> and require immediate executive remediation.
          </p>
        </div>

        {/* Section 2: Deficiency Summary Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white print:text-black uppercase tracking-wide flex items-center gap-2">
              <span className="text-amber-400">2.0</span> Summary of Audit Deficiencies &amp; Departmental Rectification ({displayedFindings.length} Items)
            </h2>
            <span className="text-[10px] text-slate-400 print:text-gray-600 font-mono">
              Filtered Scope: {severityFilter}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 print:border-gray-300">
              <thead className="bg-[#071933] print:bg-gray-100 text-amber-300 print:text-gray-700 text-[10px] uppercase">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Departmental Unit</th>
                  <th className="p-2">Finding Title</th>
                  <th className="p-2 text-center">Severity</th>
                  <th className="p-2">Risk Assessment</th>
                  <th className="p-2">Annual Rectification</th>
                  <th className="p-2">Action Owner</th>
                  <th className="p-2">Target Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-200">
                {displayedFindings.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-800/40">
                    <td className="p-2 font-mono font-bold text-blue-400 print:text-blue-700">
                      {f.id}
                    </td>
                    <td className="p-2 text-amber-300/90 print:text-gray-700 font-medium text-[11px]">
                      {f.departmentalUnit || f.domain}
                    </td>
                    <td className="p-2 text-slate-200 print:text-black font-semibold max-w-xs truncate">
                      {f.title}
                    </td>
                    <td className="p-2 text-center">
                      <span
                        className={`px-1.5 py-0.5 text-[9px] rounded font-bold uppercase ${
                          f.severity === 'Critical'
                            ? 'bg-rose-500/20 text-rose-300 print:text-red-700'
                            : 'bg-amber-500/20 text-amber-300 print:text-yellow-700'
                        }`}
                      >
                        {f.severity}
                      </span>
                    </td>
                    <td className="p-2 text-[10px]">
                      <span
                        className={`px-1.5 py-0.5 rounded font-medium ${
                          f.riskAssessmentStatus === 'Assessed & Mitigated'
                            ? 'text-emerald-400'
                            : f.riskAssessmentStatus === 'Overdue Assessment'
                            ? 'text-rose-400 font-bold'
                            : 'text-amber-300'
                        }`}
                      >
                        {f.riskAssessmentStatus}
                      </span>
                    </td>
                    <td className="p-2 text-[10px]">
                      <span
                        className={`px-1.5 py-0.5 rounded font-semibold ${
                          f.auditRectificationStatus === 'Fully Rectified'
                            ? 'text-emerald-400'
                            : f.auditRectificationStatus === 'Repeat Adverse Finding'
                            ? 'text-rose-400 font-bold'
                            : 'text-amber-400'
                        }`}
                      >
                        {f.auditRectificationStatus}
                      </span>
                    </td>
                    <td className="p-2 text-slate-300 print:text-gray-700">
                      {f.owner}
                    </td>
                    <td className="p-2 font-mono text-slate-300 print:text-gray-700">
                      {f.targetDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2.1: Detailed Rectification Schedule & Milestones (Optional in PDF) */}
        {includeRectificationSchedule && (
          <div className="space-y-2 pt-2">
            <h2 className="text-xs font-bold text-white print:text-black uppercase tracking-wide flex items-center gap-2">
              <span className="text-amber-400">2.1</span> Departmental Action Milestones &amp; Remediation Timelines
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              {displayedFindings.slice(0, 6).map((f) => (
                <div key={f.id} className="p-2.5 rounded-lg border border-slate-800 print:border-gray-300 bg-slate-950/60 print:bg-gray-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono font-bold text-blue-400 print:text-blue-700">{f.id} • {f.departmentalUnit}</span>
                    <span className="font-mono text-slate-400 print:text-gray-600">Due: {f.targetDate}</span>
                  </div>
                  <div className="font-semibold text-slate-200 print:text-black truncate mb-1">{f.title}</div>
                  <div className="space-y-0.5 text-[10px] text-slate-400 print:text-gray-600">
                    {f.milestones?.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="truncate">• {m.title}</span>
                        <span className={m.completed ? 'text-emerald-400 print:text-green-700 font-bold' : 'text-amber-400 print:text-amber-700'}>
                          {m.completed ? 'Done' : m.targetDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Recommended Committee Action */}
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 print:bg-gray-50 print:border-gray-300 space-y-2">
          <h2 className="text-xs font-bold text-white print:text-black uppercase">
            3.0 Recommended Resolutions for Board Audit Committee
          </h2>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-300 print:text-gray-800 leading-relaxed">
            <li>
              <strong>Mandate Policy Sign-Off:</strong> Direct the Executive Committee to formally adopt the IT Risk Management Policy (Finding 1) and Information Security Policy (Finding 2) within 14 calendar days.
            </li>
            <li>
              <strong>Fund Immediate MFA &amp; PAM Enforcement:</strong> Authorize emergency capital expenditure for 100% hardware token MFA on privileged accounts and session monitoring (Findings 6 &amp; 7).
            </li>
            <li>
              <strong>Codify Vulnerability Remediation Escalation:</strong> Enforce strict SLAs: Critical vulnerabilities unpatched after 14 days must trigger automatic notification to the CRO and Board Risk Committee (Finding 4).
            </li>
            <li>
              <strong>24x7 SOC Contract Sign-Off:</strong> Expedite the procurement and integration of the 24x7 Managed Security Operations Center and SIEM pipeline (Findings 12 &amp; 13).
            </li>
            <li>
              <strong>Deploy Structured Phishing &amp; Training:</strong> Mandate quarterly simulated phishing and role-based awareness modules across all banking personnel (Findings 15 &amp; 16).
            </li>
          </ol>
        </div>

        {/* Signatures */}
        {includeSignatures && (
          <div className="pt-6 border-t border-slate-800 print:border-gray-300 grid grid-cols-2 gap-8 text-[11px] text-slate-400 print:text-gray-600">
            <div>
              <div className="h-10 border-b border-slate-700 print:border-gray-400 mb-1" />
              <div className="font-bold text-slate-200 print:text-black">Chief Internal Auditor</div>
              <div>Head of Information Systems Audit</div>
            </div>
            <div>
              <div className="h-10 border-b border-slate-700 print:border-gray-400 mb-1" />
              <div className="font-bold text-slate-200 print:text-black">Chairperson, Audit &amp; Risk Committee</div>
              <div>Board of Directors</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
