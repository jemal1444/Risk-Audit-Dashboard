import React from 'react';
import { ControlTestMatrixRow } from '../types/audit';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck2,
  User,
} from 'lucide-react';

interface ControlTestingViewProps {
  controlTests: ControlTestMatrixRow[];
}

export const ControlTestingView: React.FC<ControlTestingViewProps> = ({ controlTests }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-emerald-400" />
              <span>Control Testing Evidence Matrix (Internal Audit Workpapers)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Independent evaluation of Design Effectiveness (TOD) and Operating Effectiveness (TOE) across tested sample populations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30 rounded-lg">
              6 Core Control Areas
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
          <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block">Average Sample Completion</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">77.5%</span>
          </div>
          <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block">Design Effective Rate</span>
            <span className="font-mono font-bold text-blue-400 text-sm">66.7%</span>
          </div>
          <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block">Operating Effective Rate</span>
            <span className="font-mono font-bold text-rose-400 text-sm">16.7% (Deficient)</span>
          </div>
          <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block">Total Testing Exceptions</span>
            <span className="font-mono font-bold text-amber-400 text-sm">70 Deviations</span>
          </div>
        </div>
      </div>

      {/* Control Testing Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Control Domain &amp; Area</th>
                <th className="pb-3 text-center">Design Effectiveness (TOD)</th>
                <th className="pb-3 text-center">Operating Effectiveness (TOE)</th>
                <th className="pb-3 text-center">Evidence Quality</th>
                <th className="pb-3 text-center">Sample Completion</th>
                <th className="pb-3 text-center">Exceptions Logged</th>
                <th className="pb-3 text-right">Lead Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {controlTests.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3">
                    <div className="font-bold text-slate-200">{row.controlArea}</div>
                    <div className="text-[10px] text-slate-400">{row.domain}</div>
                  </td>

                  <td className="py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        row.designEffectiveness === 'Effective'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : row.designEffectiveness === 'Partially'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {row.designEffectiveness === 'Effective' && <CheckCircle2 className="h-3 w-3" />}
                      {row.designEffectiveness === 'Partially' && <AlertTriangle className="h-3 w-3" />}
                      {row.designEffectiveness === 'Ineffective' && <XCircle className="h-3 w-3" />}
                      <span>{row.designEffectiveness}</span>
                    </span>
                  </td>

                  <td className="py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        row.operatingEffectiveness === 'Effective'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : row.operatingEffectiveness === 'Partially'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {row.operatingEffectiveness === 'Effective' && <CheckCircle2 className="h-3 w-3" />}
                      {row.operatingEffectiveness === 'Partially' && <AlertTriangle className="h-3 w-3" />}
                      {row.operatingEffectiveness === 'Ineffective' && <XCircle className="h-3 w-3" />}
                      <span>{row.operatingEffectiveness}</span>
                    </span>
                  </td>

                  <td className="py-3 text-center">
                    <span
                      className={`font-semibold text-xs ${
                        row.evidenceQuality === 'High'
                          ? 'text-emerald-400'
                          : row.evidenceQuality === 'Medium'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {row.evidenceQuality} Quality
                    </span>
                  </td>

                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-20 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${row.sampleCompletion}%` }}
                        />
                      </div>
                      <span className="font-mono font-semibold text-slate-200">
                        {row.sampleCompletion}%
                      </span>
                    </div>
                  </td>

                  <td className="py-3 text-center font-mono font-bold text-rose-400">
                    {row.exceptions}
                  </td>

                  <td className="py-3 text-right text-slate-300 font-medium">
                    {row.testedBy}
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
