import { AuditFinding, ITAsset } from '../types/audit';

export function exportFindingsToCSV(findings: AuditFinding[]) {
  const headers = [
    'Finding ID',
    'Domain',
    'Departmental Unit',
    'Item #',
    'Title',
    'Severity',
    'Inherent Risk',
    'Residual Risk',
    'Risk Score',
    'Risk Assessment Status',
    'Annual Audit Rectification',
    'Status',
    'Owner',
    'Target Date',
    'Aging Days',
    'Aging Bucket',
    'Evidence Status',
    'Regulatory Standards',
    'Root Cause',
    'Remediation Plan Summary',
  ];

  const rows = findings.map((f) => [
    `"${f.id}"`,
    `"${f.domain}"`,
    `"${f.departmentalUnit || ''}"`,
    f.itemNumber,
    `"${f.title.replace(/"/g, '""')}"`,
    `"${f.severity}"`,
    `"${f.inherentRisk}"`,
    `"${f.residualRisk}"`,
    f.riskScore,
    `"${f.riskAssessmentStatus || ''}"`,
    `"${f.auditRectificationStatus || ''}"`,
    `"${f.status}"`,
    `"${f.owner} (${f.ownerRole})"`,
    `"${f.targetDate}"`,
    f.agingDays,
    `"${f.agingBucket}"`,
    `"${f.evidenceStatus}"`,
    `"${f.regulatoryClauses.join('; ')}"`,
    `"${f.rootCause.replace(/"/g, '""')}"`,
    `"${f.remediationActionSummary.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `IS_Security_Audit_Findings_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAssetsToCSV(assets: ITAsset[]) {
  const headers = [
    'Asset ID',
    'Tag',
    'Asset / Identity Name',
    'Type',
    'Classification',
    'Business Owner',
    'Technical Custodian',
    'Location / Whereabouts',
    'Verification Status',
    'MFA Enforced',
    'EDR Installed',
    'SIEM Ingested',
    'Last Audited',
  ];

  const rows = assets.map((a) => [
    `"${a.id}"`,
    `"${a.assetTag}"`,
    `"${a.name.replace(/"/g, '""')}"`,
    `"${a.type}"`,
    `"${a.classification}"`,
    `"${a.businessOwner}"`,
    `"${a.technicalCustodian}"`,
    `"${a.location}"`,
    `"${a.verificationStatus}"`,
    a.mfaEnforced ? 'YES' : 'NO',
    a.edrInstalled ? 'YES' : 'NO',
    a.siemIngested ? 'YES' : 'NO',
    `"${a.lastAudited}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `IT_Asset_Identity_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
