import React, { useState } from 'react';
import { AdminLandingMessage } from '../types/audit';
import {
  Radio,
  AlertOctagon,
  AlertTriangle,
  Bell,
  Sliders,
  ChevronRight,
  ArrowRight,
  X,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface LandingBroadcastBarProps {
  messages: AdminLandingMessage[];
  onNavigateToTab?: (tab: string) => void;
}

export const LandingBroadcastBar: React.FC<LandingBroadcastBarProps> = ({
  messages,
  onNavigateToTab,
}) => {
  const activeTicker = messages.find((m) => m.active && m.position === 'Top Broadcast Ticker') ||
    messages.find((m) => m.active);

  const [dismissed, setDismissed] = useState(false);

  if (!activeTicker || dismissed) {
    return null;
  }

  const isCritical = activeTicker.type === 'Critical Advisory';
  const isReg = activeTicker.type === 'Regulatory Notice';

  return (
    <div
      className={`rounded-xl border p-3 shadow-md transition-all flex flex-wrap items-center justify-between gap-3 ${
        isCritical
          ? 'bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border-rose-500/40'
          : isReg
          ? 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border-amber-500/40'
          : 'bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border-blue-500/30'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
            isCritical
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
              : isReg
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
          }`}
        >
          {isCritical ? (
            <AlertOctagon className="h-4 w-4" />
          ) : isReg ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <Radio className="h-4 w-4" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                isCritical
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : isReg
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}
            >
              {activeTicker.type}
            </span>
            <span className="text-xs font-bold text-white truncate max-w-xl">
              {activeTicker.title}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 truncate mt-0.5">
            {activeTicker.content}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {activeTicker.callToActionText && activeTicker.callToActionTab && onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab(activeTicker.callToActionTab!)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              isCritical
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
            }`}
          >
            <span>{activeTicker.callToActionText}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        )}

        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
          title="Dismiss banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
