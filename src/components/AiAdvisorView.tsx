import React, { useState } from 'react';
import { AuditFinding } from '../types/audit';
import {
  Sparkles,
  FileCheck,
  RotateCw,
  Copy,
  Download,
  Shield,
  Layers,
  Send,
} from 'lucide-react';

interface AiAdvisorViewProps {
  findings: AuditFinding[];
  onApplyPolicyToFinding?: (findingId: string, policyText: string) => void;
}

export const AiAdvisorView: React.FC<AiAdvisorViewProps> = ({ findings }) => {
  const [selectedFindingId, setSelectedFindingId] = useState<string>(findings[0]?.id || 'F-01');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [activeGeneratorType, setActiveGeneratorType] = useState<'remediation' | 'policy' | 'board'>(
    'remediation'
  );
  const [resultText, setResultText] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const selectedFinding = findings.find((f) => f.id === selectedFindingId) || findings[0];

  const handleGenerate = async () => {
    setLoading(true);
    setResultText('');
    try {
      if (activeGeneratorType === 'remediation') {
        const res = await fetch('/api/ai/remediate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            findingId: selectedFinding.id,
            title: selectedFinding.title,
            domain: selectedFinding.domain,
            description: selectedFinding.description,
            currentStatus: selectedFinding.status,
            targetFramework: 'NIST CSF 2.0 / ISO 27001:2022 / CIS v8 / PCI-DSS v4.0 / FFIEC',
          }),
        });
        const json = await res.json();
        setResultText(JSON.stringify(json.data, null, 2));
      } else if (activeGeneratorType === 'policy') {
        const res = await fetch('/api/ai/policy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            policyTitle: selectedFinding.title,
            domain: selectedFinding.domain,
            scope: 'Banking Core, Cloud Workloads, Endpoints, HM/NHM Identities',
          }),
        });
        const json = await res.json();
        setResultText(json.policyText);
      } else {
        const res = await fetch('/api/ai/board-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            totalFindings: findings.length,
            criticalCount: findings.filter((f) => f.severity === 'Critical').length,
            highCount: findings.filter((f) => f.severity === 'High').length,
            overdueCount: findings.filter((f) => f.status === 'Overdue' || f.agingDays > 90).length,
            openAreas: Array.from(new Set(findings.map((f) => f.domain))),
          }),
        });
        const json = await res.json();
        setResultText(json.report);
      }
    } catch (err: any) {
      console.error(err);
      setResultText('Error generating content. Please verify your connection or parameters.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-300" />
              <span>AI Risk &amp; Remediation Engineering Workbench</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated generation of Board Policies, Remediation Blueprints, and Audit Committee Briefings aligned with NIST CSF 2.0, ISO 27001, and Central Bank standards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30 rounded-lg">
              Gemini 3.8 Flash Engine
            </span>
          </div>
        </div>

        {/* Generator Mode Selector */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => {
              setActiveGeneratorType('remediation');
              setResultText('');
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeGeneratorType === 'remediation'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Remediation Roadmap (Phase 1-3)
          </button>
          <button
            onClick={() => {
              setActiveGeneratorType('policy');
              setResultText('');
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeGeneratorType === 'policy'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Formal Board Policy Generator
          </button>
          <button
            onClick={() => {
              setActiveGeneratorType('board');
              setResultText('');
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeGeneratorType === 'board'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Board Audit Committee Briefing Memo
          </button>
        </div>
      </div>

      {/* Main Grid: Controls & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Controls Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Select Target Audit Finding (1 of 16):
            </label>
            <select
              value={selectedFindingId}
              onChange={(e) => setSelectedFindingId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              {findings.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.id}: {f.title.slice(0, 48)}...
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Domain:</span>
              <span className="font-semibold text-slate-200">{selectedFinding.domain}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Severity:</span>
              <span className="font-bold text-rose-400">{selectedFinding.severity}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Aging:</span>
              <span className="font-mono text-slate-200">{selectedFinding.agingDays} days</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Owner:</span>
              <span className="text-slate-200">{selectedFinding.owner}</span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-900/30 transition-all"
          >
            {loading ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" />
                <span>Synthesizing Regulatory Evidence...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>
                  {activeGeneratorType === 'remediation'
                    ? 'Generate Remediation Plan'
                    : activeGeneratorType === 'policy'
                    ? 'Draft Formal Policy Standard'
                    : 'Compile Board Committee Memo'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Output Column (Span 2) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between text-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-emerald-400" />
                <span>Generated Executive Output &amp; Deliverables</span>
              </h3>

              {resultText && (
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 border border-slate-700 transition-all"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center text-center space-y-3">
                <RotateCw className="h-8 w-8 text-blue-400 animate-spin" />
                <p className="text-sm font-semibold text-slate-200">
                  Authoring formal banking compliance documentation...
                </p>
                <p className="text-slate-400 max-w-sm text-xs">
                  Applying NIST CSF 2.0, ISO/IEC 27001:2022, and Basel Committee Operational Resilience mandates.
                </p>
              </div>
            ) : resultText ? (
              <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                {resultText}
              </pre>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                <Shield className="h-10 w-10 text-slate-700" />
                <p className="text-sm font-medium text-slate-300">
                  Select a finding and click the button to generate audit-ready materials.
                </p>
                <p className="text-xs text-slate-500 max-w-sm">
                  Produces board-approved policy text, technical 3-phase remediation timelines, or executive committee memoranda.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 mt-3 text-[11px] text-slate-400 flex items-center justify-between">
            <span>GRC Engine: AI Studio Enterprise</span>
            <span className="text-emerald-400 font-semibold">Ready for CISO &amp; Board Presentation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
