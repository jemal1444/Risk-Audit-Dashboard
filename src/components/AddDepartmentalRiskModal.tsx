import React, { useState } from 'react';
import {
  AuditFinding,
  DepartmentalUnit,
  ISInfrastructureDomain,
  RiskAssessmentStatus,
  AuditRectificationStatus,
  DomainKey,
  Severity,
} from '../types/audit';
import {
  X,
  PlusCircle,
  Building2,
  Server,
  Network,
  Cpu,
  Layers,
  Shield,
  Briefcase,
  Database,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface AddDepartmentalRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRisk: (newFinding: AuditFinding) => void;
  totalFindingsCount: number;
}

export const AddDepartmentalRiskModal: React.FC<AddDepartmentalRiskModalProps> = ({
  isOpen,
  onClose,
  onAddRisk,
  totalFindingsCount,
}) => {
  const [infrastructureDomain, setInfrastructureDomain] = useState<ISInfrastructureDomain>(
    'Network Manager'
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [impactedAsset, setImpactedAsset] = useState('');
  const [likelihood, setLikelihood] = useState<number>(4);
  const [impact, setImpact] = useState<number>(4);
  const [owner, setOwner] = useState('Ahmed K.');
  const [ownerRole, setOwnerRole] = useState('Network Infrastructure Manager');
  const [slaDays, setSlaDays] = useState<number>(30);
  const [riskAssessmentStatus, setRiskAssessmentStatus] = useState<RiskAssessmentStatus>(
    'Assessment In Progress'
  );
  const [rectificationStatus, setRectificationStatus] = useState<AuditRectificationStatus>(
    'Rectification In-Flight'
  );

  if (!isOpen) return null;

  // Calculate score & severity
  const score = likelihood * impact;
  const severity: Severity =
    score >= 16 ? 'Critical' : score >= 10 ? 'High' : score >= 5 ? 'Medium' : 'Low';

  // Map infrastructure domain to primary domain
  const getDomainFromDept = (dept: ISInfrastructureDomain): DomainKey => {
    switch (dept) {
      case 'Network Manager':
      case 'Data Center & Admin':
        return 'IT Asset Management';
      case 'IS Operations Support':
        return 'Endpoint Security';
      case 'CBS Operations':
      case 'IS Application Development':
        return 'Identity & Access Management';
      case 'MIS':
        return 'Security Monitoring & Logging';
      case 'IS Project Management':
        return 'Governance & IT Risk';
      case 'IS Security':
      default:
        return 'Security Monitoring & Logging';
    }
  };

  const handleDomainChange = (val: ISInfrastructureDomain) => {
    setInfrastructureDomain(val);
    switch (val) {
      case 'Network Manager':
        setOwner('Ahmed K.');
        setOwnerRole('Network Infrastructure Manager');
        break;
      case 'Data Center & Admin':
        setOwner('Dawit M.');
        setOwnerRole('Data Center Facilities Lead');
        break;
      case 'IS Operations Support':
        setOwner('Sara B.');
        setOwnerRole('Head of IS Operations Support');
        break;
      case 'CBS Operations':
        setOwner('Yared T.');
        setOwnerRole('CBS Operations & EOD Batch Lead');
        break;
      case 'IS Application Development':
        setOwner('Fatima A.');
        setOwnerRole('Lead Applications Architect');
        break;
      case 'MIS':
        setOwner('Kassahun L.');
        setOwnerRole('MIS & Regulatory Reporting Director');
        break;
      case 'IS Project Management':
        setOwner('Mulugeta Z.');
        setOwnerRole('IS PMO Director');
        break;
      case 'IS Security':
        setOwner('Priya M.');
        setOwnerRole('Chief Information Security Officer');
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const nextItemNumber = totalFindingsCount + 1;
    const newId = `F-${String(nextItemNumber).padStart(2, '0')}`;

    const newFinding: AuditFinding = {
      id: newId,
      itemNumber: nextItemNumber,
      domain: getDomainFromDept(infrastructureDomain),
      departmentalUnit: infrastructureDomain,
      infrastructureDomain: infrastructureDomain,
      title,
      description: `${description} [Target System: ${impactedAsset || 'Core Infrastructure'}]`,
      severity,
      inherentRisk: severity,
      residualRisk: severity === 'Critical' ? 'High' : 'Medium',
      inherentLikelihood: likelihood,
      inherentImpact: impact,
      residualLikelihood: Math.max(1, likelihood - 2),
      residualImpact: Math.max(1, impact - 2),
      cvssScore: score >= 20 ? 9.6 : score >= 15 ? 8.2 : 6.5,
      remediationSlaDays: slaDays,
      escalationTier:
        score >= 20
          ? 'Tier 4 (Board Committee)'
          : score >= 16
          ? 'Tier 3 (CRO/Exec)'
          : score >= 10
          ? 'Tier 2 (CISO)'
          : 'Tier 1 (Custodian)',
      riskScore: score,
      status: 'Open',
      riskAssessmentStatus,
      auditRectificationStatus: rectificationStatus,
      owner,
      ownerRole,
      targetDate: new Date(Date.now() + slaDays * 86400000).toISOString().slice(0, 10),
      agingDays: 1,
      agingBucket: '0-30 Days',
      evidenceStatus: 'Draft',
      rootCause: `Operational gap identified during departmental self-assessment in ${infrastructureDomain}.`,
      businessImpact: `Potential financial loss, regulatory sanction, or operational outage on ${impactedAsset || 'banking workloads'}.`,
      regulatoryClauses: [
        'NIST CSF 2.0 (PR.PS / DE.CM)',
        'National Central Bank Directives on Banking ICT',
        'ISO/IEC 27001:2022',
      ],
      remediationActionSummary: `Immediate containment and engineering action plan assigned to ${ownerRole} to achieve full audit rectification.`,
      milestones: [
        {
          title: `Technical containment on ${impactedAsset || 'subsystem'}`,
          targetDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
          completed: false,
        },
        {
          title: 'Internal Audit re-testing and rectification closure',
          targetDate: new Date(Date.now() + slaDays * 86400000).toISOString().slice(0, 10),
          completed: false,
        },
      ],
      threeLines: {
        line1Operations: { status: 'Remediating', notes: `Remediation initiated by ${infrastructureDomain}` },
        line2Risk: { status: 'Monitoring', notes: 'Logged in Enterprise Risk Register' },
        line3InternalAudit: { status: 'Testing', notes: 'Scheduled for annual rectification audit' },
      },
      sampleTesting: {
        sampleSize: 10,
        exceptionsFound: 1,
        testProcedure: `Inspect operational logs and configuration baseline for ${impactedAsset || 'unit'}.`,
        designEffectiveness: 'Partially',
        operatingEffectiveness: 'Ineffective',
      },
    };

    onAddRisk(newFinding);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b2447] border border-amber-500/40 rounded-xl p-5 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-xs text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/30 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Log Departmental IT Risk &amp; Audit Finding</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  HIJRA BANK GRC
                </span>
              </h3>
              <p className="text-[11px] text-amber-200/70">
                Direct departmental intake for IS infrastructure domains and banking application units.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto space-y-3.5 pr-1">
          {/* IS Infrastructure Domain Selector */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">
              IS Infrastructure Domain:
            </label>
            <select
              value={infrastructureDomain}
              onChange={(e) => handleDomainChange(e.target.value as ISInfrastructureDomain)}
              className="w-full bg-[#071933] border border-amber-500/30 rounded-lg p-2.5 text-white font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="Network Manager">Network Manager</option>
              <option value="Data Center & Admin">Data Center &amp; Admin</option>
              <option value="IS Operations Support">IS Operations Support</option>
              <option value="CBS Operations">CBS Operations</option>
              <option value="IS Application Development">IS Application Development</option>
              <option value="MIS">MIS</option>
              <option value="IS Project Management">IS Project Management</option>
              <option value="IS Security">IS Security</option>
            </select>
            <p className="text-[10px] text-amber-300/70 mt-1">
              Selected category will be persisted directly in the audit finding record and GRC risk matrix.
            </p>
          </div>

          {/* Title & Target Asset */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Risk / Deficiency Title:</label>
              <input
                type="text"
                required
                placeholder="e.g. Unpatched Firmware on Branch Perimeter Firewalls"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#071933] border border-amber-500/30 rounded-lg p-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Impacted Asset / System:</label>
              <input
                type="text"
                placeholder="e.g. Cisco ASR 1000 / SWIFT Gateway"
                value={impactedAsset}
                onChange={(e) => setImpactedAsset(e.target.value)}
                className="w-full bg-[#071933] border border-amber-500/30 rounded-lg p-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Detailed Audit Finding &amp; Technical Condition:
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe the control deficiency, unmanaged vulnerability, or deviation from approved security standards..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#071933] border border-amber-500/30 rounded-lg p-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
            />
          </div>

          {/* Risk Scoring (Likelihood x Impact) */}
          <div className="p-3 bg-[#071933] border border-amber-500/20 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">
                Inherent Risk Scoring (Likelihood &times; Impact):
              </span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                  severity === 'Critical'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : severity === 'High'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                }`}
              >
                Score: {score}/25 &bull; {severity} Risk
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Likelihood Level:</span>
                  <span className="font-bold text-amber-400">{likelihood}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={likelihood}
                  onChange={(e) => setLikelihood(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Business Impact:</span>
                  <span className="font-bold text-amber-400">{impact}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={impact}
                  onChange={(e) => setImpact(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Governance & Audit Rectification Lifecycle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-[#071933] border border-amber-500/20 rounded-lg">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Risk Assessment Status:
              </label>
              <select
                value={riskAssessmentStatus}
                onChange={(e) => setRiskAssessmentStatus(e.target.value as RiskAssessmentStatus)}
                className="w-full bg-[#0b2447] border border-amber-500/30 rounded p-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs"
              >
                <option value="Not Assessed">Not Assessed</option>
                <option value="Assessment In Progress">Assessment In Progress</option>
                <option value="Assessed & Mitigated">Assessed &amp; Mitigated</option>
                <option value="Overdue Assessment">Overdue Assessment</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Annual Audit Rectification Status:
              </label>
              <select
                value={rectificationStatus}
                onChange={(e) => setRectificationStatus(e.target.value as AuditRectificationStatus)}
                className="w-full bg-[#0b2447] border border-amber-500/30 rounded p-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs"
              >
                <option value="Rectification In-Flight">Rectification In-Flight</option>
                <option value="Fully Rectified">Fully Rectified</option>
                <option value="Pending Audit Verification">Pending Audit Verification</option>
                <option value="Repeat Adverse Finding">Repeat Adverse Finding</option>
              </select>
            </div>
          </div>

          {/* Ownership & SLA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Assigned Custodian:</label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full bg-[#071933] border border-amber-500/30 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Custodian Role:</label>
              <input
                type="text"
                value={ownerRole}
                onChange={(e) => setOwnerRole(e.target.value)}
                className="w-full bg-[#071933] border border-amber-500/30 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Mandatory SLA (Days):</label>
              <input
                type="number"
                min="7"
                max="90"
                value={slaDays}
                onChange={(e) => setSlaDays(Number(e.target.value))}
                className="w-full bg-[#071933] border border-amber-500/30 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs font-mono"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-amber-500/30 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Assigned to: <strong className="text-amber-300">{infrastructureDomain}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="h-4 w-4 stroke-[2.5]" />
                <span>Save &amp; Log Finding</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
