import React, { useState, useEffect } from 'react';
import { AuditFinding } from '../types/audit';
import {
  Sparkles,
  X,
  FileText,
  ShieldCheck,
  CheckCircle,
  Copy,
  Download,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';

interface AiRemediationModalProps {
  finding: AuditFinding | null;
  onClose: () => void;
  onApplyRemediation: (findingId: string, updatedNotes: string) => void;
}

export const AiRemediationModal: React.FC<AiRemediationModalProps> = ({
  finding,
  onClose,
  onApplyRemediation,
}) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'policy' | 'testing'>('roadmap');
  const [loading, setLoading] = useState(false);
  const [remediationData, setRemediationData] = useState<any>(null);
  const [policyData, setPolicyData] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!finding) return;

    const fetchAiData = async () => {
      setLoading(true);
      try {
        // Fetch remediation roadmap
        const res = await fetch('/api/ai/remediate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            findingId: finding.id,
            title: finding.title,
            domain: finding.domain,
            description: finding.description,
            currentStatus: finding.status,
            targetFramework: 'NIST CSF 2.0 / ISO 27001:2022 / CIS Controls v8 / FFIEC',
          }),
        });
        const json = await res.json();
        setRemediationData(json.data);

        // Fetch draft formal policy
        const polRes = await fetch('/api/ai/policy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            policyTitle: finding.title,
            domain: finding.domain,
            scope: 'Banking Core, HM/NHM Identities, Cloud & Datacenter',
          }),
        });
        const polJson = await polRes.json();
        setPolicyData(polJson.policyText);
      } catch (err) {
        console.error('Error fetching AI remediation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAiData();
  }, [finding]);

  if (!finding) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="h-4 w-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-400">{finding.id}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {finding.domain}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-rose-500/20 text-rose-300">
                  {finding.severity}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">{finding.title}</h3>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'roadmap'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Remediation Roadmap
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'policy'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Formal Board Policy Draft
          </button>
          <button
            onClick={() => setActiveTab('testing')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'testing'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Audit Validation Procedures
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <RotateCw className="h-8 w-8 text-blue-400 animate-spin" />
              <p className="text-sm font-semibold text-slate-200">
                Generating Executive Remediation Package...
              </p>
              <p className="text-xs text-slate-400 max-w-sm">
                Synthesizing banking regulatory standards (NIST CSF 2.0, ISO 27001, FFIEC, PCI-DSS) and drafting formal operational mandates.
              </p>
            </div>
          ) : remediationData ? (
            <>
              {activeTab === 'roadmap' && (
                <div className="space-y-3">
                  {/* Executive Summary & Impact */}
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <h4 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>Executive Risk Summary &amp; Exposure Analysis</span>
                    </h4>
                    <p className="text-slate-300 leading-relaxed">{remediationData.summary}</p>
                    <div className="mt-2 text-[11px] text-amber-300">
                      <strong>Regulatory Impact:</strong> {remediationData.regulatoryImpact}
                    </div>
                  </div>

                  {/* 3-Phase Remediation Roadmap */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-200">Three-Phase Corrective Action Roadmap</h4>
                    {remediationData.remediationRoadmap?.map((phase: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-400">{phase.phase}</span>
                          <span className="text-[10px] font-mono text-emerald-400">
                            Deliverable: {phase.deliverables}
                          </span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-slate-300">
                          {phase.actions?.map((act: string, aIdx: number) => (
                            <li key={aIdx}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* KPI Metrics */}
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <h4 className="font-bold text-slate-200 mb-1">Key Performance &amp; SLA Metrics</h4>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {remediationData.kpiMetrics?.map((metric: string, idx: number) => (
                        <div key={idx} className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          ✓ {metric}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'policy' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-200">
                      Approved Policy Specification (Ready for Board Sign-Off)
                    </h4>
                    <button
                      onClick={() => handleCopy(policyData)}
                      className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 border border-slate-700"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>{copied ? 'Copied!' : 'Copy Policy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto">
                    {policyData}
                  </pre>
                </div>
              )}

              {activeTab === 'testing' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <h4 className="font-bold text-slate-200 mb-1">
                      Independent Audit Validation Procedures (3rd Line Workpaper)
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      {remediationData.auditTestingProcedure}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="font-bold text-slate-200">Verification Checkpoints for Finding Closure:</h4>
                    <div className="space-y-1.5 text-slate-300">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Inspection of signed Board / Risk Committee minutes approving the policy/mandate.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Re-testing of 100% sample population with zero deviations or SLA aging lapses.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Centralized CMDB reconciliation validating 100% HM &amp; NHM identity ownership attestation.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            Target Remediation SLA: <strong>{finding.targetDate}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
            >
              Close
            </button>
            <button
              onClick={() => {
                onApplyRemediation(
                  finding.id,
                  'Remediation blueprint generated and assigned to operational custodian.'
                );
                onClose();
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium flex items-center gap-1.5"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Apply Roadmap to GRC</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
