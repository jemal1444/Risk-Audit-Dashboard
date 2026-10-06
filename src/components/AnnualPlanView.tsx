import React from 'react';
import { AnnualAuditPlanQuarter, AuditResourceTeam } from '../types/audit';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Briefcase,
  Users,
  AlertCircle,
} from 'lucide-react';

interface AnnualPlanViewProps {
  annualPlan: AnnualAuditPlanQuarter[];
  resourceTeams: AuditResourceTeam[];
}

export const AnnualPlanView: React.FC<AnnualPlanViewProps> = ({
  annualPlan,
  resourceTeams,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              <span>Annual Audit Plan &amp; Audit Universe Scheduling (2026 Cycle)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive schedule of 24 planned internal and IS audits across the four quarters, including resource hours and execution status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-lg">
              24 Audits Scheduled
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
          <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block">Q1 Status</span>
            <span className="font-bold text-emerald-400">100% Completed</span>
          </div>
          <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block">Q2 Status (Current)</span>
            <span className="font-bold text-blue-400">75% In Progress</span>
          </div>
          <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block">Q3 Status</span>
            <span className="font-bold text-slate-300">Staffed &amp; Scoped</span>
          </div>
          <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block">Q4 Status</span>
            <span className="font-bold text-slate-400">Scheduled</span>
          </div>
        </div>
      </div>

      {/* Quarterly Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {annualPlan.map((q) => (
          <div
            key={q.quarter}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                <h3 className="font-bold text-sm text-purple-300">{q.title}</h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    q.quarter === 'Q1'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : q.quarter === 'Q2'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {q.quarter === 'Q1' ? 'Completed' : q.quarter === 'Q2' ? 'In Flight' : 'Planned'}
                </span>
              </div>

              <div className="space-y-2.5">
                {q.audits.map((audit, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-semibold text-slate-200 leading-tight">
                        {audit.name}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Lead: {audit.leadAuditor}</span>
                      <span className="font-mono">{audit.hours} hrs</span>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            audit.completionPct === 100
                              ? 'bg-emerald-500'
                              : audit.completionPct > 0
                              ? 'bg-blue-500'
                              : 'bg-slate-700'
                          }`}
                          style={{ width: `${audit.completionPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {audit.completionPct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Allocated Hours:</span>
              <span className="font-mono text-slate-200 font-bold">
                {q.audits.reduce((acc, a) => acc + a.hours, 0)} hrs
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Resource Allocation Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-400" />
          <span>Audit Team Capacity &amp; Resource Allocation Pool</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {resourceTeams.map((team, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2"
            >
              <div className="font-bold text-slate-200">{team.teamName}</div>
              <div className="text-[11px] text-slate-400">{team.specialization}</div>

              <div className="space-y-1 pt-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-300">
                  <span>Available:</span>
                  <span>{team.availableHours}h</span>
                </div>
                <div className="flex justify-between text-blue-400">
                  <span>Assigned:</span>
                  <span>{team.assignedHours}h</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Remaining:</span>
                  <span>{team.remainingHours}h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
