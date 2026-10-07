import React from 'react';
import {
  ShieldAlert,
  Play,
  Sparkles,
  Download,
  User,
  Filter,
  PlusCircle,
  Building2,
  FileCheck2,
  Radio,
  Lock,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { DomainKey, FindingStatus, AdminUser } from '../types/audit';

interface HeaderProps {
  selectedYear: string;
  setSelectedYear: (y: string) => void;
  selectedCycle: string;
  setSelectedCycle: (c: string) => void;
  selectedDomain: string;
  setSelectedDomain: (d: string) => void;
  selectedOwner: string;
  setSelectedOwner: (o: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  onRunScan: () => void;
  onOpenAiAdvisor: () => void;
  onExport: () => void;
  onOpenAddRisk?: () => void;
  onOpenChecklist?: () => void;
  adminUser?: AdminUser | null;
  onOpenAdminLogin?: () => void;
  onNavigateToAdmin?: () => void;
  onAdminLogout?: () => void;
  isScanning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedYear,
  setSelectedYear,
  selectedCycle,
  setSelectedCycle,
  selectedDomain,
  setSelectedDomain,
  selectedOwner,
  setSelectedOwner,
  selectedStatus,
  setSelectedStatus,
  onRunScan,
  onOpenAiAdvisor,
  onExport,
  onOpenAddRisk,
  onOpenChecklist,
  adminUser,
  onOpenAdminLogin,
  onNavigateToAdmin,
  onAdminLogout,
  isScanning,
}) => {
  return (
    <header className="bg-gradient-to-r from-[#071933] via-[#0b2447] to-[#0d2a52] text-white border-b border-amber-500/30 shadow-md sticky top-0 z-30">
      {/* Top Banner Row */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-950/40 border border-amber-300/40">
            <Building2 className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white uppercase flex items-center gap-1.5">
                <span>HIJRA BANK</span>
                <span className="text-amber-400 font-light">•</span>
                <span className="text-amber-300">IS RISK &amp; AUDIT CONTROL</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono">
                Real-Time Compliance
              </span>
            </div>
            <p className="text-xs text-slate-300 hidden sm:block">
              Continuous Risk Monitoring, Departmental IS Assessment &amp; Automated Vulnerability Governance
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          {onOpenAddRisk && (
            <button
              onClick={onOpenAddRisk}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 rounded-md shadow-md shadow-amber-950/40 border border-amber-300/50 transition-all cursor-pointer"
              title="Add risk from IS Infrastructure, Applications, MIS, PMO, or Security"
            >
              <PlusCircle className="h-3.5 w-3.5 text-slate-950 stroke-[2.5]" />
              <span>+ Log IS Risk</span>
            </button>
          )}

          {onOpenChecklist && (
            <button
              onClick={onOpenChecklist}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#0f3460] hover:bg-[#164177] text-amber-200 border border-amber-500/40 rounded-md transition-all shadow-sm"
              title="Open Regulatory Compliance & Policy Approval Checklist"
            >
              <FileCheck2 className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden md:inline">Policy Checklist</span>
            </button>
          )}

          {/* Secure Admin Portal Access (Username/Password Protected) */}
          {adminUser ? (
            <div className="flex items-center gap-1 bg-[#0b2447] border border-amber-500/50 rounded-md p-0.5 shadow-sm">
              <button
                onClick={onNavigateToAdmin}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-amber-300 hover:text-white transition-all cursor-pointer"
                title={`Open Secure Admin Dashboard (Logged in as ${adminUser.displayName})`}
              >
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">[{adminUser.role}]</span>
                <span>Admin Portal</span>
              </button>
              {onAdminLogout && (
                <button
                  onClick={onAdminLogout}
                  className="p-1 text-rose-300 hover:text-white hover:bg-rose-950/70 rounded transition-all cursor-pointer"
                  title="Sign out of Admin Session"
                >
                  <LogOut className="h-3 w-3" />
                </button>
              )}
            </div>
          ) : (
            onOpenAdminLogin && (
              <button
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#0f2d52] hover:bg-[#163f73] text-amber-300 border border-amber-500/30 rounded-md transition-all shadow-sm cursor-pointer"
                title="Sign in with username and password to access Admin Dashboard and manage broadcast messages"
              >
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden md:inline">Admin Login</span>
              </button>
            )
          )}

          <button
            onClick={onRunScan}
            disabled={isScanning}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-all ${
              isScanning
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
            }`}
          >
            <Play className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Telemetry...' : 'Run Auto Scan'}</span>
          </button>

          <button
            onClick={onOpenAiAdvisor}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md shadow-sm transition-all shadow-blue-900/20"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>AI Advisor</span>
          </button>

          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md transition-all"
            title="Export CSV / Audit Data"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <div className="h-6 w-px bg-slate-750 mx-1 hidden sm:block" />

          {/* User Profile Info */}
          <div className="flex items-center gap-2 pl-1">
            <div className="h-8 w-8 rounded-full bg-[#0f3460] border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-xs">
              HB
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-200">IS Audit Lead</div>
              <div className="text-[10px] text-amber-300/80">Hijra Bank GRC</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Row matching image header */}
      <div className="px-4 py-2 bg-slate-950/60 flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-medium mr-1">
          <Filter className="h-3.5 w-3.5 text-emerald-400" />
          <span>Filters:</span>
        </div>

        {/* Year Filter */}
        <div className="flex items-center gap-1">
          <label className="text-[11px] text-slate-400">Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>

        {/* Audit Cycle Filter */}
        <div className="flex items-center gap-1">
          <label className="text-[11px] text-slate-400">Cycle:</label>
          <select
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="All">All Cycles</option>
            <option value="Q1">Q1 Completed</option>
            <option value="Q2">Q2 Current</option>
            <option value="Q3">Q3 Scheduled</option>
            <option value="Q4">Q4 Scheduled</option>
          </select>
        </div>

        {/* Risk Area / Domain Filter */}
        <div className="flex items-center gap-1">
          <label className="text-[11px] text-slate-400">Risk Area:</label>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none max-w-[170px] truncate"
          >
            <option value="All">All Risk Domains</option>
            <option value="Governance & IT Risk">Governance &amp; IT Risk (1-4)</option>
            <option value="IT Asset Management">IT Asset Management (5)</option>
            <option value="Identity & Access Management">IAM &amp; MFA/PAM (6-7)</option>
            <option value="Endpoint Security">Endpoint &amp; EDR (8)</option>
            <option value="Security Monitoring & Logging">SIEM &amp; SOC (9-14)</option>
            <option value="Security Awareness & Human Factors">Awareness &amp; Phishing (15-16)</option>
          </select>
        </div>

        {/* Audit Owner Filter */}
        <div className="flex items-center gap-1">
          <label className="text-[11px] text-slate-400">Owner:</label>
          <select
            value={selectedOwner}
            onChange={(e) => setSelectedOwner(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="All">All Owners</option>
            <option value="Arun D.">Arun D. (CRO / Logging)</option>
            <option value="Priya M.">Priya M. (CISO)</option>
            <option value="Anita P.">Anita P. (IAM &amp; Awareness)</option>
            <option value="Ravi K.">Ravi K. (Endpoint &amp; Vulns)</option>
            <option value="Neha S.">Neha S. (Assets &amp; Architecture)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1">
          <label className="text-[11px] text-slate-400">Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Overdue">Overdue</option>
            <option value="Remediated">Remediated</option>
          </select>
        </div>

        {(selectedCycle !== 'All' ||
          selectedDomain !== 'All' ||
          selectedOwner !== 'All' ||
          selectedStatus !== 'All') && (
          <button
            onClick={() => {
              setSelectedCycle('All');
              setSelectedDomain('All');
              setSelectedOwner('All');
              setSelectedStatus('All');
            }}
            className="text-[11px] text-amber-400 hover:text-amber-300 underline ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>
    </header>
  );
};
