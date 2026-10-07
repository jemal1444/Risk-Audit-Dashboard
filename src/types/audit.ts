export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type FindingStatus = 'Open' | 'In Progress' | 'Under Review' | 'Remediated' | 'Overdue';
export type AgingBucket = '0-30 Days' | '31-60 Days' | '61-90 Days' | '91-120 Days' | '120+ Days';
export type DomainKey =
  | 'Governance & IT Risk'
  | 'IT Asset Management'
  | 'Identity & Access Management'
  | 'Endpoint Security'
  | 'Security Monitoring & Logging'
  | 'Security Awareness & Human Factors';

export type ISInfrastructureDomain =
  | 'Network Manager'
  | 'Data Center & Admin'
  | 'IS Operations Support'
  | 'CBS Operations'
  | 'IS Application Development'
  | 'MIS'
  | 'IS Project Management'
  | 'IS Security';

export type DepartmentalUnit =
  | ISInfrastructureDomain
  | 'IS Infrastructure - Network Manager'
  | 'IS Infrastructure - Data Center & Administration'
  | 'IS Infrastructure - IS Operation Support'
  | 'IS Operation & Application - CBS Operation'
  | 'IS Operation & Application - IS Application Development'
  | 'MIS (Management Information Systems)'
  | 'IS Project Management'
  | 'IS Security';

export type RiskAssessmentStatus =
  | 'Not Assessed'
  | 'Assessment In Progress'
  | 'Assessed & Mitigated'
  | 'Overdue Assessment';

export type AuditRectificationStatus =
  | 'Rectification In-Flight'
  | 'Fully Rectified'
  | 'Pending Audit Verification'
  | 'Repeat Adverse Finding';

export interface PolicyApprovalChecklistItem {
  id: string;
  title: string;
  code: string;
  category: 'Governance & Policy' | 'SIEM & Logging Architecture';
  status: 'Approved' | 'Draft' | 'Under Review';
  findingRef: string;
  mandatoryStandard: string;
  approvedBy: string;
  approvalDate: string;
  nextReviewDate: string;
  resolutionMinuteRef: string;
  evidenceDocRef: string;
  description: string;
}

export interface AuditFinding {
  id: string; // e.g. F-01
  domain: DomainKey;
  departmentalUnit: DepartmentalUnit;
  infrastructureDomain?: ISInfrastructureDomain;
  itemNumber: number; // 1 to 16 matching user prompt
  title: string;
  description: string;
  severity: Severity;
  inherentRisk: Severity;
  residualRisk: Severity;
  inherentLikelihood: number; // 1 to 5
  inherentImpact: number; // 1 to 5
  residualLikelihood: number; // 1 to 5
  residualImpact: number; // 1 to 5
  cvssScore: number; // e.g. 9.8, 8.6, 7.4
  remediationSlaDays: number; // 14, 30, 60
  escalationTier: 'Tier 1 (Custodian)' | 'Tier 2 (CISO)' | 'Tier 3 (CRO/Exec)' | 'Tier 4 (Board Committee)';
  riskScore: number; // 1 - 25 (Likelihood x Impact)
  status: FindingStatus;
  riskAssessmentStatus: RiskAssessmentStatus;
  auditRectificationStatus: AuditRectificationStatus;
  owner: string;
  ownerRole: string;
  targetDate: string;
  agingDays: number;
  agingBucket: AgingBucket;
  evidenceStatus: 'Missing' | 'Draft' | 'Pending Review' | 'Verified';
  rootCause: string;
  businessImpact: string;
  regulatoryClauses: string[];
  remediationActionSummary: string;
  milestones: { title: string; targetDate: string; completed: boolean }[];
  changeHistory?: FindingChangeHistoryEntry[];
  sentNotifications?: FindingNotificationRecord[];
  mitigationPlanDetails?: {
    leadAssignee?: string;
    targetRemediationDate?: string;
    budgetAllocation?: string;
    compensatingControls?: string;
    remediationStrategy?: 'Remediate' | 'Mitigate & Transfer' | 'Compensating Control' | 'System Replacement';
  };
  threeLines: {
    line1Operations: { status: 'Deficient' | 'Remediating' | 'Compliant'; notes: string };
    line2Risk: { status: 'Deficient' | 'Monitoring' | 'Validated'; notes: string };
    line3InternalAudit: { status: 'Adverse Finding' | 'Testing' | 'Closed'; notes: string };
  };
  sampleTesting: {
    sampleSize: number;
    exceptionsFound: number;
    testProcedure: string;
    designEffectiveness: 'Effective' | 'Partially' | 'Partially Effective' | 'Ineffective';
    operatingEffectiveness: 'Effective' | 'Partially' | 'Partially Effective' | 'Ineffective';
  };
}

export interface KeyRiskIndicator {
  id: string;
  name: string;
  category: DomainKey;
  currentValue: number | string;
  targetThreshold: number | string;
  toleranceLimit: number | string;
  unit: string;
  status: 'GREEN' | 'AMBER' | 'RED';
  trend: 'improving' | 'stable' | 'deteriorating';
  frequency: string;
  owner: string;
}

export interface VulnerabilitySlaRule {
  severity: Severity;
  cvssRange: string;
  slaDays: number;
  agingEscalationDay: number;
  escalationTarget: string;
  complianceTargetPct: number;
}

export interface EscalationProcedureItem {
  tier: string;
  triggerCondition: string;
  authority: string;
  actionMandate: string;
  turnaroundHours: number;
}

export interface ITAsset {
  id: string;
  assetTag: string;
  name: string;
  type: 'Human Identity (HM)' | 'Non-Human Machine (NHM)' | 'Core Banking Server' | 'Database' | 'Endpoint Device' | 'Cloud VPC / API';
  classification: 'Restricted' | 'Confidential' | 'Internal' | 'Public';
  businessOwner: string;
  technicalCustodian: string;
  location: string;
  verificationStatus: 'Verified' | 'Discrepancy' | 'Unmapped';
  mfaEnforced: boolean;
  edrInstalled: boolean;
  siemIngested: boolean;
  lastAudited: string;
}

export interface ControlTestMatrixRow {
  controlArea: string;
  domain: DomainKey;
  designEffectiveness: 'Effective' | 'Partially' | 'Ineffective';
  operatingEffectiveness: 'Effective' | 'Partially' | 'Ineffective';
  evidenceQuality: 'High' | 'Medium' | 'Low' | 'Missing';
  sampleCompletion: number; // percentage
  testedBy: string;
  exceptions: number;
}

export interface AnnualAuditPlanQuarter {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  title: string;
  audits: {
    name: string;
    domain: DomainKey;
    status: 'Completed' | 'In Progress' | 'Planned';
    leadAuditor: string;
    hours: number;
    completionPct: number;
  }[];
}

export interface AuditResourceTeam {
  teamName: string;
  availableHours: number;
  assignedHours: number;
  remainingHours: number;
  specialization: string;
}

export interface LiveScanCheckResult {
  id: string;
  findingRef: string;
  controlName: string;
  domain: DomainKey;
  status: 'FAIL' | 'WARN' | 'PASS';
  metric: string;
  observedValue: string;
  thresholdRequired: string;
  lastChecked: string;
  automatedRemediationAvailable: boolean;
}

export interface FindingChangeHistoryEntry {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  actionType: 'Status Change' | 'Risk Assessment' | 'Rectification' | 'Mitigation Plan' | 'Notification Sent' | 'Target Date Extension';
  summary: string;
  previousValue?: string;
  newValue?: string;
}

export interface FindingNotificationRecord {
  id: string;
  timestamp: string;
  recipientName: string;
  recipientEmail: string;
  recipientRole: string;
  channel: 'Email' | 'In-App' | 'SMS Alert';
  triggerReason: 'Mitigation Deadline Approaching' | 'Status Changed to Overdue' | 'Executive Escalation' | 'Manual Notification';
  subject: string;
  messageBody: string;
  status: 'Sent' | 'Delivered' | 'Pending';
}

export type AdminMessageBannerType = 'Critical Advisory' | 'Regulatory Notice' | 'Policy Update' | 'System Broadcast';
export type AdminMessagePosition = 'Top Broadcast Ticker' | 'Executive Notice Hero' | 'Landing Announcement Card';

export interface AdminLandingMessage {
  id: string;
  title: string;
  content: string;
  type: AdminMessageBannerType;
  position: AdminMessagePosition;
  active: boolean;
  author: string;
  authorRole: string;
  lastUpdated: string;
  priority: 'Urgent' | 'High' | 'Normal';
  callToActionText?: string;
  callToActionTab?: string;
}

export type AdminRole =
  | 'Super Admin'
  | 'Chief Internal Auditor'
  | 'IS Audit Manager'
  | 'Compliance Officer'
  | 'Viewer';

export interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: AdminRole;
  department: string;
  lastLogin?: string;
}

export interface BankingISAuditStandard {
  id: string;
  code: string;
  name: string;
  authority: string;
  category:
    | 'Payment & Messaging'
    | 'Prudential Supervision'
    | 'Banking Regulators'
    | 'Cardholder Security'
    | 'International ISMS'
    | 'IT Governance'
    | 'Operational Resilience'
    | 'Cyber Hygiene & Controls'
    | 'Third-Party & Cloud Assurance'
    | 'Threat Intelligence & Red Teaming';
  scope: string;
  mandatoryControlsCount: number;
  compliantControlsCount: number;
  adverseFindingsCount: number;
  status: 'Compliant' | 'Partially Compliant' | 'Deficient / Remediation Required';
  keyClauses: string[];
  description: string;
  applicability: string;
}


