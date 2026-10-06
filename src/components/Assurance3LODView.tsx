import React from 'react';
import { AuditFinding } from '../types/audit';
import {
  GitFork,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ExternalLink,
} from 'lucide-react';

interface Assurance3LODViewProps {
  findings: AuditFinding[];
}

export const Assurance3LODView: React.FC<Assurance3LODViewProps> = ({ findings }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <GitFork className="h-5 w-5 text-teal-400" />
              <span>Three Lines of Defense Assurance Coordination Map (3LOD)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Integrated Governance &amp; Assurance Framework synchronizing 1st Line Operations, 2nd Line Risk/Compliance, 3rd Line Internal Audit, and External Regulatory Examiners.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30 rounded-lg">
              Basel / IIA Aligned
            </span>
          </div>
        </div>

        {/* 4 Pillars Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-xs">
          {/* 1st Line */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-teal-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-400">1st Line: Management &amp; IT</span>
              <span className="font-mono font-bold text-xs bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded">
                80%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Day-to-day control execution, asset tagging, operational patch management, and IAM provisioning.
            </p>
          </div>

          {/* 2nd Line */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-blue-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-400">2nd Line: Risk &amp; Compliance</span>
              <span className="font-mono font-bold text-xs bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                75%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Policy drafting, vulnerability aging oversight, KRI monitoring, and independent risk challenge.
            </p>
          </div>

          {/* 3rd Line */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-purple-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-400">3rd Line: Internal Audit</span>
              <span className="font-mono font-bold text-xs bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
                78%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Independent assurance testing, control design and operating validation, and Board reporting.
            </p>
          </div>

          {/* External */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300">External: Regulators</span>
              <span className="font-mono font-bold text-xs bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                65%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Central Bank examiners, ISO 27001 registrars, PCI-DSS Qualified Security Assessors (QSAs).
            </p>
          </div>
        </div>
      </div>

      {/* Assurance Gap Matrix Table across the 16 findings */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Assurance Coverage Breakdown by Finding</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-2.5">Finding Ref &amp; Domain</th>
                <th className="pb-2.5">Specific Audit Deficiency</th>
                <th className="pb-2.5 text-center">1st Line (Ops)</th>
                <th className="pb-2.5 text-center">2nd Line (Risk)</th>
                <th className="pb-2.5 text-center">3rd Line (Audit)</th>
                <th className="pb-2.5 text-right">Harmonized Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {findings.map((f) => (
                <tr key={f.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5">
                    <span className="font-mono font-bold text-blue-400">{f.id}</span>
                    <div className="text-[10px] text-slate-400">{f.domain}</div>
                  </td>
                  <td className="py-2.5 pr-2 max-w-xs">
                    <span className="font-semibold text-slate-200 block truncate">{f.title}</span>
                  </td>
                  <td className="py-2.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        f.threeLines.line1Operations.status === 'Compliant'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : f.threeLines.line1Operations.status === 'Remediating'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {f.threeLines.line1Operations.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        f.threeLines.line2Risk.status === 'Validated'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : f.threeLines.line2Risk.status === 'Monitoring'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {f.threeLines.line2Risk.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        f.threeLines.line3InternalAudit.status === 'Closed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : f.threeLines.line3InternalAudit.status === 'Testing'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {f.threeLines.line3InternalAudit.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-medium">
                    <span
                      className={`text-xs ${
                        f.status === 'Remediated'
                          ? 'text-emerald-400'
                          : f.status === 'Overdue'
                          ? 'text-rose-400 font-bold'
                          : 'text-amber-400'
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
