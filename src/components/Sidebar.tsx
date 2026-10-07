import React from 'react';
import {
  LayoutDashboard,
  Database,
  Calendar,
  AlertTriangle,
  ClipboardCheck,
  ShieldAlert,
  FileCheck2,
  GitFork,
  Radio,
  FileText,
  Sparkles,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { AdminUser } from '../types/audit';

export type NavTab =
  | 'dashboard'
  | 'universe'
  | 'plan'
  | 'risk'
  | 'testing'
  | 'findings'
  | 'checklist'
  | 'scanner'
  | 'assurance'
  | 'ai-advisor'
  | 'reports'
  | 'admin';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  openFindingsCount: number;
  overdueCount: number;
  adminUser?: AdminUser | null;
  onOpenAdminLogin?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  openFindingsCount,
  overdueCount,
  adminUser,
  onOpenAdminLogin,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'universe' as NavTab,
      label: 'Audit Universe',
      icon: Database,
      badge: '86',
    },
    {
      id: 'plan' as NavTab,
      label: 'Annual Audit Plan',
      icon: Calendar,
      badge: '24',
    },
    {
      id: 'risk' as NavTab,
      label: 'Risk Assessment',
      icon: AlertTriangle,
      badge: null,
    },
    {
      id: 'testing' as NavTab,
      label: 'Control Testing',
      icon: ClipboardCheck,
      badge: null,
    },
    {
      id: 'findings' as NavTab,
      label: 'Audit Findings',
      icon: ShieldAlert,
      badge: openFindingsCount > 0 ? String(openFindingsCount) : null,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    },
    {
      id: 'checklist' as NavTab,
      label: 'Policy & SIEM Checklist',
      icon: FileCheck2,
      badge: '10 Docs',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold',
    },
    {
      id: 'scanner' as NavTab,
      label: 'Live Auto Scanner',
      icon: Radio,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'assurance' as NavTab,
      label: 'Assurance Map (3LOD)',
      icon: GitFork,
      badge: null,
    },
    {
      id: 'ai-advisor' as NavTab,
      label: 'AI Remediation & Policy',
      icon: Sparkles,
      badge: 'AI',
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    },
    {
      id: 'reports' as NavTab,
      label: 'Reports & Workpapers',
      icon: FileText,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0">
      {/* Navigation Links */}
      <nav className="p-3 space-y-1 overflow-y-auto flex-1">
        <div className="px-3 py-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          Audit &amp; Risk Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] rounded-full shrink-0 font-medium ${
                    item.badgeColor || (isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Administration & GRC Category */}
        <div className="pt-3 mt-2 border-t border-slate-800">
          <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase flex items-center justify-between">
            <span>Administration &amp; GRC</span>
            <span className="text-[9px] font-mono text-amber-400">RBAC</span>
          </div>

          <button
            onClick={() => {
              if (adminUser) {
                setActiveTab('admin');
              } else if (onOpenAdminLogin) {
                onOpenAdminLogin();
              }
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-slate-950 font-bold shadow-md shadow-amber-950/40'
                : adminUser
                ? 'text-amber-300 hover:bg-slate-800/80 hover:text-white border border-amber-500/30'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              {adminUser ? (
                <ShieldCheck
                  className={`h-4 w-4 shrink-0 ${
                    activeTab === 'admin' ? 'text-slate-950 stroke-[2.5]' : 'text-amber-400'
                  }`}
                />
              ) : (
                <Lock className="h-4 w-4 shrink-0 text-slate-400" />
              )}
              <span className="truncate">
                {adminUser ? 'Admin Dashboard' : 'Admin Portal'}
              </span>
            </div>

            <span
              className={`px-1.5 py-0.5 text-[10px] rounded-full shrink-0 font-bold ${
                activeTab === 'admin'
                  ? 'bg-slate-950 text-amber-300'
                  : adminUser
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[9px]'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 text-[9px]'
              }`}
            >
              {adminUser ? adminUser.role : 'Auth Req'}
            </span>
          </button>
        </div>
      </nav>

      {/* Bottom Status Card */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <span className="text-[11px] font-medium text-slate-400">Overdue SLA Actions</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded font-bold">
              {overdueCount} Critical
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Remediation timelines require immediate CISO &amp; Audit Committee escalation.
          </p>
        </div>
      </div>
    </aside>
  );
};
