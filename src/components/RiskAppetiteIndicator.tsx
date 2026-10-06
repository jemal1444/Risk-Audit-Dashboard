import React, { useState, useMemo } from 'react';
import { AuditFinding } from '../types/audit';
import {
  Scale,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  RotateCcw,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface RiskAppetiteIndicatorProps {
  findings: AuditFinding[];
  onNavigateToTab?: (tab: string) => void;
  onSelectFinding?: (finding: AuditFinding) => void;
  isSimulatedPostControls?: boolean;
  onToggleSimulation?: () => void;
}

export const RiskAppetiteIndicator: React.FC<RiskAppetiteIndicatorProps> = ({
  findings,
  onNavigateToTab,
  onSelectFinding,
  isSimulatedPostControls: externalIsSimulated,
  onToggleSimulation: externalToggleSim,
}) => {
  const [internalSimulated, setInternalSimulated] = useState(false);
  const isSimulatedPostControls = externalIsSimulated !== undefined ? externalIsSimulated : internalSimulated;
  const toggleSimulation = externalToggleSim || (() => setInternalSimulated((prev) => !prev));

  // Dynamic calculation of aggregate risk score (0 to 100 scale)
  // Based on open findings count and severity weighting: Critical = 10pts, High = 6pts, Medium = 3pts, Low = 1pt
  const { currentScore, maxScore, appetiteThreshold, toleranceThreshold, breachMagnitude } = useMemo(() => {
    const criticals = findings.filter((f) => f.severity === 'Critical' && f.status !== 'Remediated').length;
    const highs = findings.filter((f) => f.severity === 'High' && f.status !== 'Remediated').length;
    const mediums = findings.filter((f) => f.severity === 'Medium' && f.status !== 'Remediated').length;

    // Inherent unmitigated score
    const rawScore = criticals * 10 + highs * 6 + mediums * 3;
    // Normalize to 0-100 scale (16 findings max ~ 110pts)
    const normalizedInherent = Math.min(100, Math.round((rawScore / 105) * 100));

    // Post-controls residual target
    const simulatedResidual = 28; // controlled safe state

    const score = isSimulatedPostControls ? simulatedResidual : normalizedInherent;
    const appetite = 40; // Board Risk Appetite Target (<= 40)
    const tolerance = 58; // Tolerance Ceiling boundary (<= 58)

    return {
      currentScore: score,
      maxScore: 100,
      appetiteThreshold: appetite,
      toleranceThreshold: tolerance,
      breachMagnitude: score > tolerance ? score - tolerance : 0,
    };
  }, [findings, isSimulatedPostControls]);

  // Gauge geometry
  // Half-circle from -180 deg to 0 deg
  const radius = 100;
  const strokeWidth = 18;
  const cx = 130;
  const cy = 120;

  // Convert value (0 to 100) to angle in radians (-Math.PI to 0)
  const scoreRatio = currentScore / maxScore;
  const needleAngleDeg = -180 + scoreRatio * 180;
  const needleAngleRad = (needleAngleDeg * Math.PI) / 180;

  const needleLength = radius - 16;
  const needleX = cx + needleLength * Math.cos(needleAngleRad);
  const needleY = cy + needleLength * Math.sin(needleAngleRad);

  // Status classification
  const isWithinAppetite = currentScore <= appetiteThreshold;
  const isWithinTolerance = currentScore <= toleranceThreshold;

  const statusLabel = isWithinAppetite
    ? 'Within Board Appetite'
    : isWithinTolerance
    ? 'Within Risk Tolerance'
    : 'Tolerance Ceiling Breached';

  const statusColor = isWithinAppetite
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    : isWithinTolerance
    ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    : 'text-rose-400 bg-rose-500/10 border-rose-500/30';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Scale className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              Risk Appetite &amp; Tolerance Gauge
            </h3>
            <span className="text-[10px] text-slate-400">
              Aggregate Exposure vs. Board Thresholds
            </span>
          </div>
        </div>

        {/* Simulation Toggle */}
        <button
          onClick={toggleSimulation}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-all cursor-pointer ${
            isSimulatedPostControls
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm shadow-emerald-900/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
          title="Toggle residual post-remediation exposure simulation"
        >
          {isSimulatedPostControls ? (
            <>
              <RotateCcw className="h-3 w-3" />
              <span>Simulated Controls (Residual)</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 text-amber-300" />
              <span>Simulate Remediation</span>
            </>
          )}
        </button>
      </div>

      {/* Main Gauge & Reading Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center my-auto py-1">
        {/* Left: Semi-circular SVG Gauge Chart */}
        <div className="flex flex-col items-center justify-center relative">
          <svg viewBox="0 0 260 145" className="w-full max-w-[240px] select-none">
            <defs>
              {/* Gradients for Arc Zones */}
              <linearGradient id="gaugeGreen" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="gaugeAmber" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="gaugeRed" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>

            {/* Background Arc Track */}
            <path
              d="M 30,120 A 100,100 0 0,1 230,120"
              fill="none"
              stroke="#1e293b"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Zone 1: Green Arc (0 to 40% - Appetite Zone) */}
            {/* Angles: -180 deg to -108 deg */}
            <path
              d="M 30,120 A 100,100 0 0,1 99.1,39.1"
              fill="none"
              stroke="url(#gaugeGreen)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* Zone 2: Amber Arc (40 to 58% - Tolerance Buffer Zone) */}
            {/* Angles: -108 deg to -75.6 deg */}
            <path
              d="M 99.1,39.1 A 100,100 0 0,1 154.9,23.1"
              fill="none"
              stroke="url(#gaugeAmber)"
              strokeWidth={strokeWidth}
              opacity="0.9"
            />

            {/* Zone 3: Red Arc (58 to 100% - Breached Zone) */}
            {/* Angles: -75.6 deg to 0 deg */}
            <path
              d="M 154.9,23.1 A 100,100 0 0,1 230,120"
              fill="none"
              stroke="url(#gaugeRed)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              opacity="0.95"
            />

            {/* Appetite Threshold Marker (40%) */}
            <line
              x1="99.1"
              y1="39.1"
              x2="95.5"
              y2="28"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text x="82" y="22" fill="#10b981" fontSize="8" fontWeight="bold">
              Appetite (40)
            </text>

            {/* Tolerance Ceiling Marker (58%) */}
            <line
              x1="154.9"
              y1="23.1"
              x2="159"
              y2="12"
              stroke="#f43f5e"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text x="165" y="14" fill="#f43f5e" fontSize="8" fontWeight="bold">
              Tolerance (58)
            </text>

            {/* Dynamic Needle */}
            <line
              x1={cx}
              y1={cy}
              x2={needleX}
              y2={needleY}
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />

            {/* Needle Pivot Center Hub */}
            <circle cx={cx} cy={cy} r="8" fill="#0f172a" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx={cx} cy={cy} r="3" fill="#38bdf8" />

            {/* Min and Max labels */}
            <text x="24" y="138" fill="#94a3b8" fontSize="9" fontWeight="bold">0</text>
            <text x="230" y="138" fill="#94a3b8" fontSize="9" fontWeight="bold">100</text>
          </svg>

          {/* Central Score readout */}
          <div className="text-center mt-[-10px]">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-black text-white font-mono tracking-tight">
                {currentScore}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 100</span>
            </div>
            <span
              className={`inline-block px-2.5 py-0.5 mt-0.5 rounded-full text-[10px] font-bold border ${statusColor}`}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Right: Comparative Breakdown Cards */}
        <div className="space-y-2 text-xs">
          {/* Card 1: Exposure vs Appetite */}
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Board Appetite Ceiling</span>
              <span className="font-mono font-bold text-emerald-400">&le; {appetiteThreshold}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Tolerance Breach Point</span>
              <span className="font-mono font-bold text-amber-400">&le; {toleranceThreshold}</span>
            </div>
            <div className="pt-1 border-t border-slate-850 flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-medium">Variance vs. Tolerance:</span>
              <span
                className={`font-mono font-bold ${
                  breachMagnitude > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {breachMagnitude > 0 ? `+${breachMagnitude} pts (BREACH)` : '-30 pts (COMPLIANT)'}
              </span>
            </div>
          </div>

          {/* Card 2: Root Drivers of Exposure */}
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300">Primary Risk Drivers:</span>
              <span className="text-[10px] text-slate-500">Click to inspect</span>
            </div>
            <div className="space-y-1 text-slate-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 truncate">
                  <span className="text-slate-400">• MFA &amp; PAM Privilege:</span>
                  {findings.find((f) => f.id === 'F-06') && onSelectFinding && (
                    <button
                      onClick={() => {
                        const f = findings.find((x) => x.id === 'F-06');
                        if (f) onSelectFinding(f);
                      }}
                      className="px-1.5 py-0.2 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded font-mono text-[10px] font-bold hover:bg-rose-500/30 cursor-pointer transition-colors"
                    >
                      F-06
                    </button>
                  )}
                  {findings.find((f) => f.id === 'F-07') && onSelectFinding && (
                    <button
                      onClick={() => {
                        const f = findings.find((x) => x.id === 'F-07');
                        if (f) onSelectFinding(f);
                      }}
                      className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-mono text-[10px] font-bold hover:bg-amber-500/30 cursor-pointer transition-colors"
                    >
                      F-07
                    </button>
                  )}
                </div>
                <span className="text-rose-400 font-mono shrink-0 font-bold">+28 pts</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 truncate">
                  <span className="text-slate-400">• Asset Inventory:</span>
                  {findings.find((f) => f.id === 'F-05') && onSelectFinding && (
                    <button
                      onClick={() => {
                        const f = findings.find((x) => x.id === 'F-05');
                        if (f) onSelectFinding(f);
                      }}
                      className="px-1.5 py-0.2 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded font-mono text-[10px] font-bold hover:bg-rose-500/30 cursor-pointer transition-colors"
                    >
                      F-05
                    </button>
                  )}
                </div>
                <span className="text-rose-400 font-mono shrink-0 font-bold">+25 pts</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 truncate">
                  <span className="text-slate-400">• Vulnerability SLA:</span>
                  {findings.find((f) => f.id === 'F-04') && onSelectFinding && (
                    <button
                      onClick={() => {
                        const f = findings.find((x) => x.id === 'F-04');
                        if (f) onSelectFinding(f);
                      }}
                      className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-mono text-[10px] font-bold hover:bg-amber-500/30 cursor-pointer transition-colors"
                    >
                      F-04
                    </button>
                  )}
                </div>
                <span className="text-amber-400 font-mono shrink-0 font-bold">+18 pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span className="truncate max-w-[240px]">
          Governance Mandate: <strong>Zero Tolerance for Critical Findings</strong>
        </span>
        {onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab('risk')}
            className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 shrink-0 transition-colors"
          >
            <span>Risk Framework</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};
