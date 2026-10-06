import React, { useState, useMemo } from 'react';
import {
  AuditFinding,
  Severity,
  DomainKey,
} from '../types/audit';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Bell,
  ShieldAlert,
  ExternalLink,
  ChevronRight,
  Filter,
  Sparkles,
  RotateCcw,
  Info,
  X,
  Flame,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowRight,
  Building2,
} from 'lucide-react';

export interface RiskAppetiteNotificationItem {
  id: string;
  type: 'tolerance-breach' | 'zero-tolerance-critical' | 'domain-appetite-exceeded' | 'aging-escalation' | 'compliant';
  severity: 'Critical' | 'High' | 'Medium' | 'Compliant';
  title: string;
  thresholdName: string;
  thresholdLimit: string;
  currentValue: string;
  varianceText: string;
  governanceMandate: string;
  description: string;
  relevantFindingIds: string[];
  department?: string;
  domain?: DomainKey;
}

interface RiskAppetiteNotificationsProps {
  findings: AuditFinding[];
  onSelectFinding: (finding: AuditFinding) => void;
  onNavigateToTab?: (tab: string) => void;
  isSimulatedPostControls?: boolean;
  onToggleSimulation?: () => void;
}

export const RiskAppetiteNotifications: React.FC<RiskAppetiteNotificationsProps> = ({
  findings,
  onSelectFinding,
  onNavigateToTab,
  isSimulatedPostControls: externalIsSimulated,
  onToggleSimulation: externalToggleSim,
}) => {
  const [internalIsSimulated, setInternalIsSimulated] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'warning' | 'domain'>('all');
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState<Set<string>>(new Set());

  // Use external or internal simulation state
  const isSimulated = externalIsSimulated !== undefined ? externalIsSimulated : internalIsSimulated;
  const toggleSimulation = externalToggleSim || (() => setInternalIsSimulated((prev) => !prev));

  // Map findings by ID for rapid lookup
  const findingsMap = useMemo(() => {
    const map = new Map<string, AuditFinding>();
    findings.forEach((f) => map.set(f.id, f));
    return map;
  }, [findings]);

  // Aggregate Exposure & Threshold Calculations
  const metrics = useMemo(() => {
    const activeFindings = findings.filter((f) => f.status !== 'Remediated');
    const criticals = activeFindings.filter((f) => f.severity === 'Critical');
    const highs = activeFindings.filter((f) => f.severity === 'High');
    const mediums = activeFindings.filter((f) => f.severity === 'Medium');

    const rawInherent = criticals.length * 10 + highs.length * 6 + mediums.length * 3;
    const normalizedInherent = Math.min(100, Math.round((rawInherent / 105) * 100));
    const simulatedResidual = 28;

    const currentScore = isSimulated ? simulatedResidual : normalizedInherent;
    const appetiteThreshold = 40;
    const toleranceThreshold = 58;

    // Domain breakdown scores
    const domainScores: Record<string, { raw: number; findings: AuditFinding[] }> = {};
    activeFindings.forEach((f) => {
      const d = f.domain;
      if (!domainScores[d]) domainScores[d] = { raw: 0, findings: [] };
      const weight = f.severity === 'Critical' ? 10 : f.severity === 'High' ? 6 : 3;
      domainScores[d].raw += weight;
      domainScores[d].findings.push(f);
    });

    return {
      currentScore,
      appetiteThreshold,
      toleranceThreshold,
      isToleranceBreached: currentScore > toleranceThreshold,
      isAppetiteExceeded: currentScore > appetiteThreshold,
      breachMargin: currentScore > toleranceThreshold ? currentScore - toleranceThreshold : 0,
      appetiteMargin: currentScore > appetiteThreshold ? currentScore - appetiteThreshold : 0,
      criticalFindings: criticals,
      domainScores,
    };
  }, [findings, isSimulated]);

  // Generate color-coded notifications based on thresholds
  const notifications: RiskAppetiteNotificationItem[] = useMemo(() => {
    const list: RiskAppetiteNotificationItem[] = [];

    // 1. Critical Tolerance Ceiling Breach Notification
    if (metrics.isToleranceBreached) {
      const primaryDriverIds = findings
        .filter((f) => f.status !== 'Remediated' && (f.severity === 'Critical' || f.cvssScore >= 8.5))
        .map((f) => f.id)
        .slice(0, 5);

      list.push({
        id: 'notif-tolerance-breach',
        type: 'tolerance-breach',
        severity: 'Critical',
        title: 'CRITICAL TOLERANCE CEILING BREACH: Aggregate Risk Exposure at ' + metrics.currentScore + '/100',
        thresholdName: 'Board Risk Tolerance Limit',
        thresholdLimit: `≤ ${metrics.toleranceThreshold} pts`,
        currentValue: `${metrics.currentScore} pts`,
        varianceText: `+${metrics.breachMargin} pts above ceiling`,
        governanceMandate: 'Board Governance Tier 4: Immediate Fiduciary Escalation to Board Audit & Risk Committee',
        description:
          'Aggregate institutional IS risk exposure exceeds the maximum tolerable ceiling defined in the Board Risk Appetite Charter. Material unmitigated deficiencies across IAM, Asset Management, and SIEM infrastructure jeopardize banking confidentiality and integrity.',
        relevantFindingIds: primaryDriverIds.length > 0 ? primaryDriverIds : ['F-06', 'F-05', 'F-12', 'F-04', 'F-01'],
      });
    }

    // 2. Zero-Tolerance Policy: Unmitigated Critical Deficiencies
    if (!isSimulated && metrics.criticalFindings.length > 0) {
      list.push({
        id: 'notif-zero-tolerance-critical',
        type: 'zero-tolerance-critical',
        severity: 'Critical',
        title: `ZERO-TOLERANCE MANDATE BREACH: ${metrics.criticalFindings.length} Critical Deficiencies Active`,
        thresholdName: 'Critical Findings Policy Limit',
        thresholdLimit: '0 Allowable Active',
        currentValue: `${metrics.criticalFindings.length} Active Findings`,
        varianceText: `+${metrics.criticalFindings.length} over limit`,
        governanceMandate: 'Mandatory 14-Day Remediation SLA: Unmitigated criticals trigger automatic operational restriction',
        description:
          'Hijra Bank Risk Appetite Charter stipulates ZERO TOLERANCE for unmitigated Critical severity findings in production banking environments. The following items require immediate containment actions and compensatory controls.',
        relevantFindingIds: metrics.criticalFindings.map((f) => f.id),
      });
    }

    // 3. Risk Appetite Target Exceeded (Warning)
    if (!metrics.isToleranceBreached && metrics.isAppetiteExceeded) {
      const topIds = findings
        .filter((f) => f.status !== 'Remediated')
        .slice(0, 4)
        .map((f) => f.id);

      list.push({
        id: 'notif-appetite-exceeded',
        type: 'tolerance-breach',
        severity: 'High',
        title: `RISK APPETITE TARGET EXCEEDED: Aggregate Score at ${metrics.currentScore}/100`,
        thresholdName: 'Board Baseline Risk Appetite',
        thresholdLimit: `≤ ${metrics.appetiteThreshold} pts`,
        currentValue: `${metrics.currentScore} pts`,
        varianceText: `+${metrics.appetiteMargin} pts into Tolerance Buffer`,
        governanceMandate: 'Executive Committee Notice: Requires bi-weekly remediation status tracking',
        description:
          'The Bank is currently operating inside the Amber Tolerance Buffer Zone. While not yet breaching the catastrophic ceiling, remediation progress must accelerate to return to the baseline appetite target of 40 pts.',
        relevantFindingIds: topIds,
      });
    }

    // 4. Domain-Specific Risk Appetite Breaches
    const domainLimits: Record<string, { limit: number; name: string }> = {
      'Identity & Access Management': { limit: 15, name: 'IAM & Privileged Access' },
      'IT Asset Management': { limit: 15, name: 'IT Asset & Infrastructure Inventory' },
      'Security Monitoring & Logging': { limit: 18, name: 'SIEM & SOC Real-Time Monitoring' },
      'Endpoint Security': { limit: 12, name: 'Endpoint Protection & Antivirus' },
      'Governance & IT Risk': { limit: 10, name: 'IT Governance & Policy Approvals' },
    };

    if (!isSimulated) {
      Object.entries(metrics.domainScores).forEach(([domain, data]) => {
        const threshold = domainLimits[domain];
        if (threshold && data.raw > threshold.limit) {
          const domainFindingIds = data.findings.map((f) => f.id);
          const variance = data.raw - threshold.limit;
          list.push({
            id: `notif-domain-${domain.toLowerCase().replace(/\s+/g, '-')}`,
            type: 'domain-appetite-exceeded',
            severity: variance >= 10 ? 'Critical' : 'High',
            title: `DOMAIN RISK THRESHOLD EXCEEDED: ${threshold.name}`,
            thresholdName: `${threshold.name} Tolerance Limit`,
            thresholdLimit: `≤ ${threshold.limit} pts`,
            currentValue: `${data.raw} pts`,
            varianceText: `+${variance} pts over threshold`,
            governanceMandate: `Domain Owner SLA: Assigned to ${data.findings[0]?.ownerRole || 'Domain Custodian'}`,
            description: `Accumulated risk findings in ${domain} have surpassed divisional risk tolerance limits due to ${data.findings.length} unclosed findings.`,
            relevantFindingIds: domainFindingIds,
            domain: domain as DomainKey,
          });
        }
      });
    }

    // 5. Vulnerability Aging SLA Notification
    const overdueFindings = findings.filter(
      (f) => f.status !== 'Remediated' && (f.status === 'Overdue' || f.agingDays > 60)
    );
    if (!isSimulated && overdueFindings.length > 0) {
      list.push({
        id: 'notif-aging-sla',
        type: 'aging-escalation',
        severity: 'Medium',
        title: `VULNERABILITY REMEDIATION AGING ALERT: ${overdueFindings.length} Items Past SLA`,
        thresholdName: 'Remediation Aging SLA Boundary',
        thresholdLimit: '≤ 30-60 Days Max',
        currentValue: `${overdueFindings.length} Overdue Findings`,
        varianceText: 'Aged beyond tolerance',
        governanceMandate: 'Escalation Tier 3: Chief Risk Officer (CRO) formal notice for delayed closure',
        description:
          'Audit findings remain unrectified past contractual remediation deadlines. Persistent aging heightens exploitability and recurrence risk during statutory regulatory audits.',
        relevantFindingIds: overdueFindings.map((f) => f.id).slice(0, 6),
      });
    }

    // 6. Compliant Confirmation when within appetite
    if (isSimulated || (!metrics.isAppetiteExceeded && !metrics.isToleranceBreached)) {
      list.push({
        id: 'notif-compliant',
        type: 'compliant',
        severity: 'Compliant',
        title: `AGGREGATE RISK EXPOSURE WITHIN BOARD RISK APPETITE (${metrics.currentScore}/100)`,
        thresholdName: 'Board Baseline Risk Appetite',
        thresholdLimit: `≤ ${metrics.appetiteThreshold} pts`,
        currentValue: `${metrics.currentScore} pts`,
        varianceText: `${metrics.appetiteThreshold - metrics.currentScore} pts within comfort zone`,
        governanceMandate: 'Governance Status: Fully Compliant with Hijra Bank Risk Appetite Charter',
        description:
          'Simulated post-controls residual risk confirms that applying MFA tokens, completing asset inventory, and formalizing SIEM policies successfully restores institutional security within Board tolerance boundaries.',
        relevantFindingIds: ['F-06', 'F-05', 'F-04', 'F-01'],
      });
    }

    return list;
  }, [findings, metrics, isSimulated]);

  // Filtered notifications
  const visibleNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      if (dismissedNotificationIds.has(notif.id)) return false;
      if (filterType === 'all') return true;
      if (filterType === 'critical') return notif.severity === 'Critical';
      if (filterType === 'warning') return notif.severity === 'High' || notif.severity === 'Medium';
      if (filterType === 'domain') return notif.type === 'domain-appetite-exceeded';
      return true;
    });
  }, [notifications, dismissedNotificationIds, filterType]);

  const criticalCount = notifications.filter((n) => n.severity === 'Critical' && !dismissedNotificationIds.has(n.id)).length;
  const warningCount = notifications.filter(
    (n) => (n.severity === 'High' || n.severity === 'Medium') && !dismissedNotificationIds.has(n.id)
  ).length;

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedNotificationIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleResetDismissed = () => {
    setDismissedNotificationIds(new Set());
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-all">
      {/* Header Banner */}
      <div
        className={`p-3.5 flex flex-wrap items-center justify-between gap-3 border-b transition-colors ${
          metrics.isToleranceBreached && !isSimulated
            ? 'bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border-rose-500/40'
            : metrics.isAppetiteExceeded && !isSimulated
            ? 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border-amber-500/40'
            : 'bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border-emerald-500/40'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold shadow-md ${
              metrics.isToleranceBreached && !isSimulated
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                : metrics.isAppetiteExceeded && !isSimulated
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}
          >
            <Bell className="h-4 w-4" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>Risk Appetite &amp; Tolerance Threshold Notifications</span>
                {visibleNotifications.length > 0 && (
                  <span
                    className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      criticalCount > 0
                        ? 'bg-rose-500 text-white'
                        : warningCount > 0
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-emerald-500 text-slate-950'
                    }`}
                  >
                    {visibleNotifications.length} {visibleNotifications.length === 1 ? 'Alert' : 'Alerts'}
                  </span>
                )}
              </h3>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Automated institutional notifications generated when aggregate risk exposure breaches Board Appetite (≤40) or Tolerance Ceiling (≤58).
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Simulation Toggle */}
          <button
            onClick={toggleSimulation}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              isSimulated
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-sm shadow-emerald-900/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Simulate post-remediation controls"
          >
            {isSimulated ? (
              <>
                <RotateCcw className="h-3 w-3" />
                <span>Simulated Controls (Active)</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span>Test Post-Controls Simulation</span>
              </>
            )}
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label={isCollapsed ? 'Expand notifications' : 'Collapse notifications'}
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Body */}
      {!isCollapsed && (
        <div className="p-4 space-y-3">
          {/* Filters and Counter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="h-3 w-3" /> Filter:
              </span>
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilterType('critical')}
                className={`px-2.5 py-1 rounded-md font-medium text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                  filterType === 'critical'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-slate-800 hover:bg-slate-700 text-rose-300'
                }`}
              >
                <AlertOctagon className="h-3 w-3" />
                Critical Breaches ({notifications.filter((n) => n.severity === 'Critical').length})
              </button>
              <button
                onClick={() => setFilterType('warning')}
                className={`px-2.5 py-1 rounded-md font-medium text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                  filterType === 'warning'
                    ? 'bg-amber-600 text-slate-950 font-bold'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
                }`}
              >
                <AlertTriangle className="h-3 w-3" />
                Appetite Warnings ({notifications.filter((n) => n.severity === 'High' || n.severity === 'Medium').length})
              </button>
              <button
                onClick={() => setFilterType('domain')}
                className={`px-2.5 py-1 rounded-md font-medium text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                  filterType === 'domain'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-800 hover:bg-slate-700 text-indigo-300'
                }`}
              >
                <Layers className="h-3 w-3" />
                Domain Thresholds ({notifications.filter((n) => n.type === 'domain-appetite-exceeded').length})
              </button>
            </div>

            {dismissedNotificationIds.size > 0 && (
              <button
                onClick={handleResetDismissed}
                className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
              >
                Restore {dismissedNotificationIds.size} dismissed
              </button>
            )}
          </div>

          {/* Notifications List */}
          {visibleNotifications.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-slate-950/60 border border-slate-800">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">No Active Threshold Notifications</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                All aggregate risk metrics are currently acknowledged or within defined board appetite tolerances.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleNotifications.map((notif) => {
                const isCritical = notif.severity === 'Critical';
                const isWarning = notif.severity === 'High' || notif.severity === 'Medium';
                const isCompliant = notif.severity === 'Compliant';

                // Look up actual finding objects for the linked IDs
                const linkedFindings: AuditFinding[] = notif.relevantFindingIds
                  .map((id) => findingsMap.get(id))
                  .filter((f): f is AuditFinding => f !== undefined);

                return (
                  <div
                    key={notif.id}
                    className={`rounded-xl border transition-all p-3.5 relative overflow-hidden ${
                      isCritical
                        ? 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/40 shadow-sm shadow-rose-950/20'
                        : isWarning
                        ? 'bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border-amber-500/40 shadow-sm shadow-amber-950/20'
                        : 'bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 border-emerald-500/40 shadow-sm shadow-emerald-950/20'
                    }`}
                  >
                    {/* Top Meta Line: Title + Badges + Dismiss */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                            isCritical
                              ? 'bg-rose-500/20 text-rose-400'
                              : isWarning
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {isCritical ? (
                            <AlertOctagon className="h-4 w-4" />
                          ) : isWarning ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4
                              className={`text-xs md:text-sm font-bold tracking-tight ${
                                isCritical ? 'text-rose-200' : isWarning ? 'text-amber-200' : 'text-emerald-200'
                              }`}
                            >
                              {notif.title}
                            </h4>
                            <span
                              className={`px-2 py-0.5 text-[10px] rounded font-bold uppercase tracking-wider ${
                                isCritical
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : isWarning
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {notif.severity}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-300 mt-1">
                            <span>
                              <strong className="text-slate-400">Threshold:</strong> {notif.thresholdLimit}
                            </span>
                            <span>•</span>
                            <span>
                              <strong className="text-slate-400">Current Exposure:</strong>{' '}
                              <span
                                className={`font-mono font-bold ${
                                  isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                                }`}
                              >
                                {notif.currentValue}
                              </span>
                            </span>
                            <span>•</span>
                            <span
                              className={`font-semibold font-mono ${
                                isCritical ? 'text-rose-300' : isWarning ? 'text-amber-300' : 'text-emerald-300'
                              }`}
                            >
                              [{notif.varianceText}]
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Dismiss Action */}
                      <button
                        onClick={(e) => handleDismiss(notif.id, e)}
                        className="text-slate-500 hover:text-slate-300 p-1 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                        title="Acknowledge and hide alert"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Description & Mandate */}
                    <div className="space-y-1.5 my-2 text-xs text-slate-300 leading-relaxed pl-8">
                      <p>{notif.description}</p>
                      <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center gap-2 text-[11px]">
                        <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span className="text-slate-200">
                          <strong>Mandate:</strong> {notif.governanceMandate}
                        </span>
                      </div>
                    </div>

                    {/* Direct Links to Relevant Risk Assessment Findings */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800 pl-8">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                          <span>Direct Links to Breaching Risk Findings</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            (Click finding to inspect full assessment &amp; workpapers):
                          </span>
                        </span>

                        {onNavigateToTab && (
                          <button
                            onClick={() => onNavigateToTab('findings')}
                            className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Open in Findings Module</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      {/* Finding Interactive Chips Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {linkedFindings.map((finding) => {
                          const isFindingCritical = finding.severity === 'Critical';
                          return (
                            <div
                              key={finding.id}
                              onClick={() => onSelectFinding(finding)}
                              className={`p-2 rounded-lg border cursor-pointer transition-all group flex items-start justify-between gap-2 ${
                                isFindingCritical
                                  ? 'bg-slate-950/80 border-rose-500/30 hover:border-rose-400 hover:bg-slate-900'
                                  : 'bg-slate-950/80 border-slate-800 hover:border-amber-400 hover:bg-slate-900'
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span
                                    className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                      isFindingCritical
                                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                    }`}
                                  >
                                    {finding.id}
                                  </span>
                                  <span
                                    className={`text-[9px] font-bold uppercase ${
                                      isFindingCritical ? 'text-rose-400' : 'text-amber-400'
                                    }`}
                                  >
                                    {finding.severity}
                                  </span>
                                  <span className="text-[10px] text-slate-500">•</span>
                                  <span className="text-[10px] text-slate-400 truncate">
                                    {finding.departmentalUnit || finding.domain}
                                  </span>
                                </div>
                                <h5 className="text-[11px] font-medium text-slate-200 group-hover:text-amber-300 transition-colors truncate">
                                  {finding.title}
                                </h5>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                                  <span>Score: <strong className="text-white font-mono">{finding.riskScore}/25</strong></span>
                                  <span>•</span>
                                  <span>Aging: <strong className="text-slate-300">{finding.agingDays}d</strong></span>
                                  <span>•</span>
                                  <span className="text-amber-400/90">{finding.auditRectificationStatus}</span>
                                </div>
                              </div>

                              <div className="p-1 rounded bg-slate-800/80 group-hover:bg-amber-500/20 group-hover:text-amber-400 text-slate-400 transition-colors shrink-0 mt-0.5">
                                <ExternalLink className="h-3 w-3" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
