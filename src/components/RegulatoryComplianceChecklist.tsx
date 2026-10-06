import React, { useState } from 'react';
import { PolicyApprovalChecklistItem } from '../types/audit';
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCw,
  Search,
  Filter,
  Check,
  Building2,
  FileText,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface RegulatoryComplianceChecklistProps {
  checklist: PolicyApprovalChecklistItem[];
  onToggleStatus: (id: string, newStatus: 'Approved' | 'Draft' | 'Under Review') => void;
  onNavigateToTab?: (tab: string) => void;
}

export const RegulatoryComplianceChecklist: React.FC<RegulatoryComplianceChecklistProps> = ({
  checklist,
  onToggleStatus,
  onNavigateToTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Governance & Policy' | 'SIEM & Logging Architecture'>(
    'All'
  );
  const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Draft' | 'Under Review'>('All');

  const filteredItems = checklist.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mandatoryStandard.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.findingRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const approvedCount = checklist.filter((i) => i.status === 'Approved').length;
  const draftCount = checklist.filter((i) => i.status === 'Draft').length;
  const underReviewCount = checklist.filter((i) => i.status === 'Under Review').length;
  const approvalPercentage = Math.round((approvedCount / checklist.length) * 100);

  return (
    <div className="space-y-4">
      {/* Top Banner with Hijra Bank Color Branding (Deep Royal Blue & Warm Gold) */}
      <div className="bg-gradient-to-r from-[#0b2447] via-[#0f3460] to-[#16213e] border border-amber-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
        {/* Subtle decorative gold brand pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-950/40 border border-amber-300/40">
              <Building2 className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Regulatory Compliance &amp; Policy Approval Checklist
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono">
                  HIJRA BANK AUDIT STANDARD
                </span>
              </div>
              <p className="text-xs text-amber-200/70 mt-0.5">
                Governance, Policy Mandates (Findings 1 &amp; 2) &amp; SIEM Architecture Documentation Tracking (Findings 9 &amp; 10)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-[#0b2447] border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              {approvedCount} / {checklist.length} Policies Formally Approved
            </span>
          </div>
        </div>

        {/* Real-time Progress Bar */}
        <div className="pt-2 border-t border-amber-500/20 relative z-10 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-200/80 font-medium text-[11px]">
              Board &amp; CISO Formal Document Approval Maturity:
            </span>
            <span className="font-mono font-bold text-amber-300">{approvalPercentage}% Compliant</span>
          </div>
          <div className="h-2.5 w-full bg-slate-950/80 rounded-full overflow-hidden border border-amber-500/20">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${approvalPercentage}%` }}
            />
          </div>
        </div>

        {/* Summary Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-3 text-xs relative z-10">
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Total Mandatory Docs</span>
            <span className="font-mono font-bold text-white">{checklist.length}</span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <span className="text-emerald-300">Formally Approved</span>
            <span className="font-mono font-bold text-emerald-400">{approvedCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <span className="text-amber-300">Under Review</span>
            <span className="font-mono font-bold text-amber-400">{underReviewCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
            <span className="text-rose-300">Unapproved Draft (Deficient)</span>
            <span className="font-mono font-bold text-rose-400">{draftCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search policy name, standard, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="All">All Categories (10 Docs)</option>
            <option value="Governance & Policy">Governance &amp; IT Risk Policies (1-4)</option>
            <option value="SIEM & Logging Architecture">SIEM &amp; Logging Architecture (5-10)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved Only</option>
            <option value="Draft">Draft Status Only</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>
      </div>

      {/* Checklist Items Grid / Table */}
      <div className="space-y-2.5">
        {filteredItems.map((item) => {
          const isApproved = item.status === 'Approved';
          const isDraft = item.status === 'Draft';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                isApproved
                  ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-500'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                      {item.code}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {item.category}
                    </span>
                    <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      Resolves {item.findingRef}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                </div>

                {/* Status Toggle Switch */}
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center rounded-lg p-0.5 bg-slate-950 border border-slate-800 text-xs">
                    <button
                      onClick={() => onToggleStatus(item.id, 'Draft')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                        item.status === 'Draft'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Draft
                    </button>
                    <button
                      onClick={() => onToggleStatus(item.id, 'Under Review')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                        item.status === 'Under Review'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Review
                    </button>
                    <button
                      onClick={() => onToggleStatus(item.id, 'Approved')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                        item.status === 'Approved'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Approved ✓
                    </button>
                  </div>

                  <span
                    className={`text-[10px] font-bold ${
                      isApproved ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isApproved ? 'Formal Board Approved' : 'Unapproved (Finding Active)'}
                  </span>
                </div>
              </div>

              {/* Metadata Details Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2.5 mt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
                <div>
                  <span className="text-slate-500 block text-[10px]">Mandatory Standard:</span>
                  <span className="text-slate-300 font-mono text-[10px]">{item.mandatoryStandard}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Approving Authority &amp; Minute:</span>
                  <span className="text-slate-300 font-medium">
                    {item.approvedBy} ({item.resolutionMinuteRef})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Evidence Doc Artifact:</span>
                    <span className="text-amber-400 font-mono text-[10px]">{item.evidenceDocRef}</span>
                  </div>
                  {onNavigateToTab && (
                    <button
                      onClick={() => onNavigateToTab('findings')}
                      className="text-blue-400 hover:text-blue-300 text-[10px] font-semibold underline flex items-center gap-0.5"
                    >
                      <span>Finding Workpaper</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
