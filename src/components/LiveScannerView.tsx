import React, { useState } from 'react';
import { LiveScanCheckResult } from '../types/audit';
import {
  Radio,
  Play,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Wrench,
  Terminal,
  ShieldCheck,
  Server,
  Zap,
} from 'lucide-react';

interface LiveScannerViewProps {
  scanChecks: LiveScanCheckResult[];
  onRemediateCheck: (checkId: string) => void;
  onRunFullScan: () => void;
  isScanning: boolean;
}

export const LiveScannerView: React.FC<LiveScannerViewProps> = ({
  scanChecks,
  onRemediateCheck,
  onRunFullScan,
  isScanning,
}) => {
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[INIT] Connecting to Enterprise GRC Telemetry Bus & Active Directory...',
    '[CHECK] Probing Active Directory Domain Admins for hardware-backed FIDO2 MFA...',
    '[ALERT] Found 7 Privileged Accounts configured with legacy bypass (F-06 Non-conformance)',
    '[CHECK] Polling CrowdStrike EDR Falcon cloud console API...',
    '[ALERT] 15 workstations running outdated sensor definitions > 7 days (F-08)',
    '[CHECK] Inspecting Splunk SIEM Syslog Daemon on port 514...',
    '[WARN] 10 critical core banking hosts missing heartbeat within 120s (F-12)',
    '[CHECK] Vulnerability SLA Engine: Evaluating CVSS 9.0+ open tickets against 14-day SLA...',
    '[ALERT] 19 CVEs exceeding SLA threshold (Max: 110 days unpatched, F-04)',
    '[READY] Continuous compliance monitoring active. Next automated cycle in 180s.',
  ]);

  const [activeLogTab, setActiveLogTab] = useState<'all' | 'fails' | 'fixes'>('all');

  const failCount = scanChecks.filter((c) => c.status === 'FAIL').length;
  const warnCount = scanChecks.filter((c) => c.status === 'WARN').length;
  const passCount = scanChecks.filter((c) => c.status === 'PASS').length;

  const handleFix = (check: LiveScanCheckResult) => {
    onRemediateCheck(check.id);
    setTerminalLogs((prev) => [
      `[REMEDIATION] Automated corrective script dispatched for ${check.controlName} (${check.findingRef})...`,
      `[SUCCESS] Control state elevated to PASS. Audit evidence logged in GRC repository.`,
      ...prev,
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="h-5 w-5 text-emerald-400 animate-pulse" />
              <span>Real-Time Compliance Monitoring &amp; Automated Vulnerability Assessment</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous live telemetry probes evaluating real-time operational posture against the 16 IS Security Audit controls.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRunFullScan}
              disabled={isScanning}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all ${
                isScanning
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
              }`}
            >
              <RotateCw className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Executing Diagnostic Probes...' : 'Run Full Diagnostic Scan'}</span>
            </button>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Automated Probes</span>
            <span className="font-mono font-bold text-white">{scanChecks.length} Controls</span>
          </div>
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
            <span className="text-rose-300">Violations (FAIL)</span>
            <span className="font-mono font-bold text-rose-400">{failCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <span className="text-amber-300">Degraded (WARN)</span>
            <span className="font-mono font-bold text-amber-400">{warnCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <span className="text-emerald-300">Compliant (PASS)</span>
            <span className="font-mono font-bold text-emerald-400">{passCount}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Probe Matrix + Real-time Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Probe Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span>Active Control Probes &amp; Telemetry Sensors</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Live Ingestion Rate: 4.8 kHz</span>
          </div>

          <div className="space-y-2.5">
            {scanChecks.map((check) => (
              <div
                key={check.id}
                className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        check.status === 'PASS'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : check.status === 'WARN'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {check.status}
                    </span>
                    <span className="font-bold text-slate-200">{check.controlName}</span>
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded">
                      Ref: {check.findingRef}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300 flex items-center gap-2">
                    <span className="text-slate-400">Observed:</span>
                    <span className="font-mono text-slate-200 font-medium">{check.observedValue}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                    <span>Target Requirement:</span>
                    <span className="text-emerald-400 font-mono">{check.thresholdRequired}</span>
                    <span>• Checked: {check.lastChecked}</span>
                  </div>
                </div>

                {/* Fix / Action Button */}
                <div className="flex items-center gap-2">
                  {check.status !== 'PASS' && check.automatedRemediationAvailable ? (
                    <button
                      onClick={() => handleFix(check)}
                      className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-900/30"
                    >
                      <Wrench className="h-3.5 w-3.5" />
                      <span>Auto-Remediate</span>
                    </button>
                  ) : check.status === 'PASS' ? (
                    <div className="text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Verified Compliant</span>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-[10px] italic">
                      Manual GRC Approval Required
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Live Diagnostic Terminal */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between font-mono text-xs">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="font-bold text-[11px]">Diagnostic Log Stream</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1 text-[11px] leading-relaxed">
              {terminalLogs.map((log, idx) => {
                const isAlert = log.includes('[ALERT]');
                const isWarn = log.includes('[WARN]');
                const isSuccess = log.includes('[SUCCESS]');
                const isRemediation = log.includes('[REMEDIATION]');

                return (
                  <div
                    key={idx}
                    className={`${
                      isAlert
                        ? 'text-rose-400 font-semibold'
                        : isWarn
                        ? 'text-amber-400'
                        : isSuccess
                        ? 'text-emerald-400 font-semibold'
                        : isRemediation
                        ? 'text-blue-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {log}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 mt-3 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Log Buffer: 10/1000 lines</span>
            <button
              onClick={() => setTerminalLogs(['[STREAM CLEARED] Telemetry stream refreshed...'])}
              className="text-slate-400 hover:text-slate-300 underline"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
