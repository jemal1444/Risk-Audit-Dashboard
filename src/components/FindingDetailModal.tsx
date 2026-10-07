import React, { useState } from 'react';
import {
  AuditFinding,
  FindingStatus,
  RiskAssessmentStatus,
  AuditRectificationStatus,
  FindingChangeHistoryEntry,
  FindingNotificationRecord,
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
  History,
  Send,
  Bell,
  Check,
  PlusCircle,
  Mail,
  DollarSign,
  AlertOctagon,
  Target,
  FileText,
  BadgeCheck,
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
  onUpdateFinding?: (updatedFinding: AuditFinding) => void;
}

type ModalTab = 'overview' | 'mitigation' | 'history' | 'notifications';

export const FindingDetailModal: React.FC<FindingDetailModalProps> = ({
  finding,
  onClose,
  onOpenAi,
  onUpdateStatus,
  onUpdateAssessmentAndRectification,
  onUpdateFinding,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('overview');

  // Mitigation Plan local editable state
  const [targetRemediationDate, setTargetRemediationDate] = useState(
    finding?.mitigationPlanDetails?.targetRemediationDate || finding?.targetDate || '2026-11-15'
  );
  const [leadAssignee, setLeadAssignee] = useState(
    finding?.mitigationPlanDetails?.leadAssignee || finding?.owner || 'Technical Custodian'
  );
  const [budgetAllocation, setBudgetAllocation] = useState(
    finding?.mitigationPlanDetails?.budgetAllocation || '$45,000 USD (Approved OpEx/CapEx)'
  );
  const [compensatingControls, setCompensatingControls] = useState(
    finding?.mitigationPlanDetails?.compensatingControls ||
      'Enhanced manual quarterly dual-control reviews, IP whitelist restriction, and temporary compensating log alerting until permanent technical control is active.'
  );
  const [remediationStrategy, setRemediationStrategy] = useState<any>(
    finding?.mitigationPlanDetails?.remediationStrategy || 'Remediate'
  );

  // Milestones state
  const [milestones, setMilestones] = useState(
    finding?.milestones || [
      { title: 'Executive sponsor sign-off & vendor evaluation', targetDate: '2026-10-15', completed: true },
      { title: 'Pilot deployment in staging environment', targetDate: '2026-10-30', completed: false },
      { title: 'Full production cutover & staff training', targetDate: '2026-11-15', completed: false },
    ]
  );
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('2026-11-20');

  // Change History state with default initial records if empty
  const [changeHistory, setChangeHistory] = useState<FindingChangeHistoryEntry[]>(() => {
    if (finding?.changeHistory && finding.changeHistory.length > 0) {
      return finding.changeHistory;
    }
    return [
      {
        id: 'hist-1',
        timestamp: '2026-09-15 09:30:12',
        userName: 'Abebe T.',
        userRole: 'Head of Information Systems Audit',
        actionType: 'Status Change',
        summary: 'Audit finding created and formally logged into audit committee findings register.',
        previousValue: 'Draft',
        newValue: 'Open',
      },
      {
        id: 'hist-2',
        timestamp: '2026-09-22 14:15:40',
        userName: 'Priya M.',
        userRole: 'Chief Information Security Officer (CISO)',
        actionType: 'Risk Assessment',
        summary: 'Inherent risk score confirmed at critical severity level following root-cause analysis.',
        previousValue: 'Not Assessed',
        newValue: 'Assessment In Progress',
      },
      {
        id: 'hist-3',
        timestamp: '2026-10-02 11:00:22',
        userName: 'Ahmed K.',
        userRole: 'Action Owner / Technical Custodian',
        actionType: 'Mitigation Plan',
        summary: 'Submitted preliminary risk mitigation plan with resource allocation and milestone schedule.',
        previousValue: 'Pending',
        newValue: 'Mitigation Plan Active',
      },
    ];
  });

  // Automated Notification form state
  const [notificationRecipient, setNotificationRecipient] = useState(
    finding?.owner ? `${finding.owner.toLowerCase().replace(/[\s.]+/g, '')}@hijra-bank.com` : 'custodian@hijra-bank.com'
  );
  const [notificationChannel, setNotificationChannel] = useState<'Email' | 'In-App' | 'SMS Alert'>('Email');
  const [notificationTrigger, setNotificationTrigger] = useState<
    'Mitigation Deadline Approaching' | 'Status Changed to Overdue' | 'Executive Escalation' | 'Manual Notification'
  >(
    finding?.status === 'Overdue' || (finding?.agingDays || 0) > 60
      ? 'Status Changed to Overdue'
      : 'Mitigation Deadline Approaching'
  );
  const [notificationSubject, setNotificationSubject] = useState(
    `[HIJRA BANK AUDIT ALERT] Action Required: ${finding?.id} - ${finding?.title}`
  );
  const [notificationMessage, setNotificationMessage] = useState(
    `Dear ${finding?.owner || 'Action Owner'},\n\nThis is an automated governance notice regarding audit finding ${finding?.id} (${finding?.title}). The remediation deadline of ${finding?.targetDate} is ${finding?.status === 'Overdue' ? 'OVERDUE' : 'approaching'}. Current aging is ${finding?.agingDays} days.\n\nPlease update milestone progress and submit verification workpapers immediately.\n\nIS Internal Audit & Board Risk Committee`
  );
  const [sentNotifications, setSentNotifications] = useState<FindingNotificationRecord[]>(
    finding?.sentNotifications || [
      {
        id: 'notif-prev-1',
        timestamp: '2026-09-28 10:00:00',
        recipientName: finding?.owner || 'Action Owner',
        recipientEmail: 'action.owner@hijra-bank.com',
        recipientRole: finding?.ownerRole || 'Technical Custodian',
        channel: 'Email',
        triggerReason: 'Mitigation Deadline Approaching',
        subject: `[HIJRA BANK] Preliminary Remediation Reminder: ${finding?.id}`,
        messageBody: 'Initial remediation timeline notice dispatched to designated department owner.',
        status: 'Delivered',
      },
    ]
  );
  const [notificationSuccessMsg, setNotificationSuccessMsg] = useState<string | null>(null);

  if (!finding) return null;

  // Toggle milestone completion
  const handleToggleMilestone = (index: number) => {
    const updated = [...milestones];
    const prevStatus = updated[index].completed;
    updated[index].completed = !prevStatus;
    setMilestones(updated);

    // Log history
    const historyEntry: FindingChangeHistoryEntry = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userName: 'Audit System / User',
      userRole: 'Action Verifier',
      actionType: 'Mitigation Plan',
      summary: `Milestone "${updated[index].title}" marked as ${!prevStatus ? 'COMPLETED' : 'INCOMPLETE'}.`,
      previousValue: prevStatus ? 'Completed' : 'Incomplete',
      newValue: !prevStatus ? 'Completed' : 'Incomplete',
    };
    const nextHistory = [historyEntry, ...changeHistory];
    setChangeHistory(nextHistory);

    if (onUpdateFinding) {
      onUpdateFinding({
        ...finding,
        milestones: updated,
        changeHistory: nextHistory,
      });
    }
  };

  // Add new milestone
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;

    const newM = {
      title: newMilestoneTitle.trim(),
      targetDate: newMilestoneDate,
      completed: false,
    };
    const updated = [...milestones, newM];
    setMilestones(updated);
    setNewMilestoneTitle('');

    const historyEntry: FindingChangeHistoryEntry = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userName: 'Audit System / User',
      userRole: 'Remediation Coordinator',
      actionType: 'Mitigation Plan',
      summary: `Added new milestone "${newM.title}" with target date ${newM.targetDate}.`,
    };
    const nextHistory = [historyEntry, ...changeHistory];
    setChangeHistory(nextHistory);

    if (onUpdateFinding) {
      onUpdateFinding({
        ...finding,
        milestones: updated,
        changeHistory: nextHistory,
      });
    }
  };

  // Save mitigation plan details
  const handleSaveMitigationPlan = () => {
    const historyEntry: FindingChangeHistoryEntry = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userName: 'Audit System / User',
      userRole: 'Risk Owner Custodian',
      actionType: 'Mitigation Plan',
      summary: `Updated structured mitigation plan: Target completion set to ${targetRemediationDate}, Assignee: ${leadAssignee}.`,
      previousValue: finding.targetDate,
      newValue: targetRemediationDate,
    };
    const nextHistory = [historyEntry, ...changeHistory];
    setChangeHistory(nextHistory);

    if (onUpdateFinding) {
      onUpdateFinding({
        ...finding,
        targetDate: targetRemediationDate,
        owner: leadAssignee,
        milestones,
        changeHistory: nextHistory,
        mitigationPlanDetails: {
          leadAssignee,
          targetRemediationDate,
          budgetAllocation,
          compensatingControls,
          remediationStrategy,
        },
      });
    }

    setNotificationSuccessMsg('Mitigation plan successfully saved and logged to audit trail.');
    setTimeout(() => setNotificationSuccessMsg(null), 3500);
  };

  // Dispatch automated notification
  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord: FindingNotificationRecord = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      recipientName: finding.owner,
      recipientEmail: notificationRecipient,
      recipientRole: finding.ownerRole,
      channel: notificationChannel,
      triggerReason: notificationTrigger,
      subject: notificationSubject,
      messageBody: notificationMessage,
      status: 'Sent',
    };

    const nextNotifications = [newRecord, ...sentNotifications];
    setSentNotifications(nextNotifications);

    // Also log in change history
    const historyEntry: FindingChangeHistoryEntry = {
      id: `hist-${Date.now()}`,
      timestamp: newRecord.timestamp,
      userName: 'Automated SLA Escalation Engine',
      userRole: 'Audit Notification Dispatcher',
      actionType: 'Notification Sent',
      summary: `Dispatched ${notificationChannel} alert to ${notificationRecipient} (${notificationTrigger}).`,
    };
    const nextHistory = [historyEntry, ...changeHistory];
    setChangeHistory(nextHistory);

    if (onUpdateFinding) {
      onUpdateFinding({
        ...finding,
        sentNotifications: nextNotifications,
        changeHistory: nextHistory,
      });
    }

    setNotificationSuccessMsg(`Notification successfully dispatched via ${notificationChannel} to ${notificationRecipient}.`);
    setTimeout(() => setNotificationSuccessMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      <div className="bg-[#0b2447] border border-amber-500/40 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-xs text-slate-200">
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
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-4 py-2 bg-[#091b36] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Audit Assessment</span>
            </button>

            <button
              onClick={() => setActiveTab('mitigation')}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'mitigation'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Target className="h-3.5 w-3.5" />
              <span>Risk Mitigation Plan</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] bg-slate-900/60 font-mono">
                {milestones.filter((m) => m.completed).length}/{milestones.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span>Change History</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] bg-slate-900/60 font-mono">
                {changeHistory.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-rose-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Bell className="h-3.5 w-3.5" />
              <span>Owner Notifications</span>
              {finding.status === 'Overdue' && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] bg-rose-500 text-white font-mono animate-pulse font-bold">
                  OVERDUE
                </span>
              )}
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            SLA: <strong className="text-amber-400 font-mono">{finding.remediationSlaDays || 14}d</strong> • Aging:{' '}
            <strong className="text-rose-400 font-mono">{finding.agingDays}d</strong>
          </div>
        </div>

        {/* Global Feedback Banner if any */}
        {notificationSuccessMsg && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-4 py-2 text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{notificationSuccessMsg}</span>
          </div>
        )}

        {/* Overdue Alert Bar if status is Overdue */}
        {finding.status === 'Overdue' && (
          <div className="bg-rose-950/80 border-b border-rose-500/40 px-4 py-2 text-xs text-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-rose-400 shrink-0 animate-pulse" />
              <span>
                <strong>SLA Breach Notice:</strong> Remediation target date has passed. Mandatory automated notification can be dispatched to risk owner.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('notifications')}
              className="text-[11px] font-bold text-amber-300 hover:text-white underline cursor-pointer"
            >
              Dispatch Overdue Alert →
            </button>
          </div>
        )}

        {/* Modal Body with Tab Switching */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
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
                      const newStatus = e.target.value as RiskAssessmentStatus;
                      if (onUpdateAssessmentAndRectification) {
                        onUpdateAssessmentAndRectification(
                          finding.id,
                          newStatus,
                          finding.auditRectificationStatus
                        );
                      }
                      const historyEntry: FindingChangeHistoryEntry = {
                        id: `hist-${Date.now()}`,
                        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
                        userName: 'Audit Committee Reviewer',
                        userRole: 'Risk Officer',
                        actionType: 'Risk Assessment',
                        summary: `Risk assessment status updated to "${newStatus}".`,
                        previousValue: finding.riskAssessmentStatus,
                        newValue: newStatus,
                      };
                      setChangeHistory([historyEntry, ...changeHistory]);
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
                      const newRect = e.target.value as AuditRectificationStatus;
                      if (onUpdateAssessmentAndRectification) {
                        onUpdateAssessmentAndRectification(
                          finding.id,
                          finding.riskAssessmentStatus,
                          newRect
                        );
                      }
                      const historyEntry: FindingChangeHistoryEntry = {
                        id: `hist-${Date.now()}`,
                        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
                        userName: 'Audit Committee Reviewer',
                        userRole: 'Audit Director',
                        actionType: 'Rectification',
                        summary: `Annual audit rectification status updated to "${newRect}".`,
                        previousValue: finding.auditRectificationStatus,
                        newValue: newRect,
                      };
                      setChangeHistory([historyEntry, ...changeHistory]);
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
                <div className="p-2.5 rounded bg-[#071933] border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Action Owner</span>
                  <span className="text-slate-200 font-semibold">{finding.owner}</span>
                  <span className="text-[10px] text-slate-400 block">{finding.ownerRole}</span>
                </div>
                <div className="p-2.5 rounded bg-[#071933] border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Target Completion</span>
                  <span className="text-slate-200 font-mono font-semibold">{finding.targetDate}</span>
                  <span className="text-[10px] text-rose-400 block">{finding.agingDays} Days Aged</span>
                </div>
                <div className="p-2.5 rounded bg-[#071933] border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Inherent / Residual</span>
                  <span className="text-rose-400 font-semibold">{finding.inherentRisk}</span>
                  <span className="text-slate-400 text-[10px]"> → {finding.residualRisk} Target</span>
                </div>
                <div className="p-2.5 rounded bg-[#071933] border border-slate-800">
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
            </div>
          )}

          {/* TAB 2: STRUCTURED RISK MITIGATION PLAN */}
          {activeTab === 'mitigation' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#071933] border border-amber-500/30 space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">Structured Risk Mitigation Framework</h3>
                  </div>
                  <span className="text-[10px] text-amber-300 font-mono">GOVERNANCE MANDATED</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Target Remediation Date</label>
                    <input
                      type="date"
                      value={targetRemediationDate}
                      onChange={(e) => setTargetRemediationDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Lead Resource Assignment</label>
                    <input
                      type="text"
                      value={leadAssignee}
                      onChange={(e) => setLeadAssignee(e.target.value)}
                      placeholder="e.g. Dawit M. (Senior Systems Engineer)"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Remediation Strategy</label>
                    <select
                      value={remediationStrategy}
                      onChange={(e) => setRemediationStrategy(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none"
                    >
                      <option value="Remediate">Permanent Technical Remediation</option>
                      <option value="Compensating Control">Compensating Control Defense</option>
                      <option value="Mitigate & Transfer">Risk Transfer &amp; Contract SLA</option>
                      <option value="System Replacement">System Replacement Architecture</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Approved Budget / Resource Allocation</label>
                  <input
                    type="text"
                    value={budgetAllocation}
                    onChange={(e) => setBudgetAllocation(e.target.value)}
                    placeholder="e.g. $45,000 USD Hardware MFA Procurement"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Compensating Controls (Interim Defense)</label>
                  <textarea
                    rows={2}
                    value={compensatingControls}
                    onChange={(e) => setCompensatingControls(e.target.value)}
                    placeholder="Detail temporary safeguards implemented while permanent fix is completed..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-800">
                  <button
                    onClick={handleSaveMitigationPlan}
                    className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md cursor-pointer"
                  >
                    Save Mitigation Plan
                  </button>
                </div>
              </div>

              {/* Milestone Tracking List */}
              <div className="p-4 rounded-xl bg-[#071933] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Action Milestones Tracking</h3>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {milestones.filter((m) => m.completed).length} of {milestones.length} Completed
                  </span>
                </div>

                <div className="space-y-2">
                  {milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 transition-all ${
                        m.completed
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleToggleMilestone(idx)}
                          className={`h-5 w-5 rounded flex items-center justify-center border transition-all cursor-pointer ${
                            m.completed
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                              : 'bg-slate-800 border-slate-700 hover:border-amber-400'
                          }`}
                        >
                          {m.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </button>
                        <span className={`text-xs font-medium truncate ${m.completed ? 'line-through opacity-80' : ''}`}>
                          {m.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                        <span className="text-slate-400">{m.targetDate}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                            m.completed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {m.completed ? 'Validated' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Milestone Form */}
                <form onSubmit={handleAddMilestone} className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    required
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    placeholder="Add next remediation milestone..."
                    className="flex-1 min-w-[200px] px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-400"
                  />
                  <input
                    type="date"
                    required
                    value={newMilestoneDate}
                    onChange={(e) => setNewMilestoneDate(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Add Milestone</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: CHANGE HISTORY & AUDIT TRAIL */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-white">Immutable Finding Change History &amp; Audit Trail</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {changeHistory.length} Logged Events
                </span>
              </div>

              <div className="space-y-2">
                {changeHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-[#071933] border border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                          {item.actionType}
                        </span>
                        <span className="font-semibold text-slate-200">{item.summary}</span>
                      </div>

                      {(item.previousValue || item.newValue) && (
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          {item.previousValue && <span>From: <strong className="text-slate-300">{item.previousValue}</strong></span>}
                          {item.previousValue && item.newValue && <span>→</span>}
                          {item.newValue && <span>To: <strong className="text-amber-400">{item.newValue}</strong></span>}
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>User: <strong className="text-slate-300">{item.userName}</strong> ({item.userRole})</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono text-[10px] text-slate-400">
                      {item.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AUTOMATED OWNER NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#071933] border border-rose-500/30 space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4 text-rose-400" />
                    <h3 className="text-sm font-bold text-white">Automated SLA &amp; Overdue Notification Dispatcher</h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                    ESCALATION ENGINE
                  </span>
                </div>

                <form onSubmit={handleSendNotification} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold block">Notification Trigger</label>
                      <select
                        value={notificationTrigger}
                        onChange={(e) => setNotificationTrigger(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-rose-400 outline-none"
                      >
                        <option value="Mitigation Deadline Approaching">Mitigation Deadline Approaching (7-Day Notice)</option>
                        <option value="Status Changed to Overdue">Status Changed to Overdue (Formal Breach)</option>
                        <option value="Executive Escalation">Tier 3 CRO / Board Escalation</option>
                        <option value="Manual Notification">Ad-Hoc Auditor Workpaper Request</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold block">Delivery Channel</label>
                      <select
                        value={notificationChannel}
                        onChange={(e) => setNotificationChannel(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-rose-400 outline-none"
                      >
                        <option value="Email">Official Corporate Email</option>
                        <option value="In-App">In-App Dashboard Notification</option>
                        <option value="SMS Alert">Emergency SMS Alert (Tier 4)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold block">Recipient Risk Owner</label>
                      <input
                        type="email"
                        required
                        value={notificationRecipient}
                        onChange={(e) => setNotificationRecipient(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-rose-400 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Email / Notification Subject</label>
                    <input
                      type="text"
                      required
                      value={notificationSubject}
                      onChange={(e) => setNotificationSubject(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-rose-400 outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Notification Message Body</label>
                    <textarea
                      required
                      rows={4}
                      value={notificationMessage}
                      onChange={(e) => setNotificationMessage(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-rose-400 outline-none leading-relaxed font-sans"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-[11px] text-slate-400">
                      Dispatched notices are logged permanently in the Board Audit Committee compliance dossier.
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Dispatch Alert to Owner</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Notification History Log */}
              <div className="p-4 rounded-xl bg-[#071933] border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-blue-400" />
                    <span>Dispatched Notification History</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">{sentNotifications.length} Records</span>
                </div>

                <div className="space-y-2">
                  {sentNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{notif.subject}</span>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                            {notif.status}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{notif.messageBody}</p>
                      <div className="text-[10px] text-slate-400">
                        Recipient: <strong className="text-slate-300">{notif.recipientEmail}</strong> ({notif.recipientName}) via {notif.channel}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#071933] border-t border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Workpaper Status:</span>
            <select
              value={finding.status}
              onChange={(e) => {
                const newStat = e.target.value as FindingStatus;
                onUpdateStatus(finding.id, newStat);

                // Auto log status change
                const historyEntry: FindingChangeHistoryEntry = {
                  id: `hist-${Date.now()}`,
                  timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
                  userName: 'Audit Workpaper Custodian',
                  userRole: 'Internal Auditor',
                  actionType: 'Status Change',
                  summary: `Workpaper status changed from "${finding.status}" to "${newStat}".`,
                  previousValue: finding.status,
                  newValue: newStat,
                };
                setChangeHistory([historyEntry, ...changeHistory]);

                // If changed to Overdue, prompt user to send notification
                if (newStat === 'Overdue') {
                  setActiveTab('notifications');
                  setNotificationTrigger('Status Changed to Overdue');
                  setNotificationSubject(`[URGENT] Formal Overdue Remediation Notice: ${finding.id}`);
                }
              }}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 font-semibold outline-none"
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
