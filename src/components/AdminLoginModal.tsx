import React, { useState } from 'react';
import { AdminUser, AdminRole } from '../types/audit';
import {
  Lock,
  X,
  ShieldCheck,
  User,
  Key,
  Building2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
}

// Preset RBAC accounts for convenience
const PRESET_ACCOUNTS: {
  username: string;
  pass: string;
  displayName: string;
  email: string;
  role: AdminRole;
  department: string;
  description: string;
}[] = [
  {
    username: 'admin@hijra-bank.com',
    pass: 'admin123',
    displayName: 'Abebe T. (Chief Auditor)',
    email: 'admin@hijra-bank.com',
    role: 'Super Admin',
    department: 'Board Internal Audit & Risk Directorate',
    description: 'Full Administrative Access: Edit & Delete Landing Messages, Manage Standards & Audit Overrides',
  },
  {
    username: 'is.audit@hijra-bank.com',
    pass: 'audit2026',
    displayName: 'Priya M. (IS Audit Manager)',
    email: 'is.audit@hijra-bank.com',
    role: 'IS Audit Manager',
    department: 'Information Systems Audit Division',
    description: 'Audit Management: Edit & Publish Broadcast Messages, Review Standards & Findings',
  },
  {
    username: 'compliance@hijra-bank.com',
    pass: 'comp2026',
    displayName: 'Dawit M. (Compliance Lead)',
    email: 'compliance@hijra-bank.com',
    role: 'Compliance Officer',
    department: 'Regulatory Compliance & GRC',
    description: 'Compliance Access: Manage Regulatory Notices & Audit Framework Crosswalks',
  },
];

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('admin@hijra-bank.com');
  const [password, setPassword] = useState('admin123');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('Super Admin');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Verify credentials
    const foundPreset = PRESET_ACCOUNTS.find(
      (acc) => acc.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (foundPreset && password !== foundPreset.pass) {
      setErrorMessage(`Incorrect password for ${username}. Try '${foundPreset.pass}' or click a preset below.`);
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }

    const authenticatedUser: AdminUser = {
      id: foundPreset ? `usr-${foundPreset.role.toLowerCase().replace(/\s+/g, '-')}` : `usr-${Date.now()}`,
      username: username.trim(),
      displayName: foundPreset ? foundPreset.displayName : username.split('@')[0],
      email: username.trim(),
      role: foundPreset ? foundPreset.role : selectedRole,
      department: foundPreset ? foundPreset.department : 'Information Systems Audit',
      lastLogin: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    onLoginSuccess(authenticatedUser);
    onClose();
  };

  const handleSelectPreset = (preset: typeof PRESET_ACCOUNTS[0]) => {
    setUsername(preset.username);
    setPassword(preset.pass);
    setSelectedRole(preset.role);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn text-slate-200">
      <div className="bg-[#0b2447] border border-amber-500/50 rounded-2xl w-full max-w-lg shadow-2xl shadow-amber-950/50 overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-5 bg-gradient-to-r from-[#071933] via-[#0b2447] to-[#0f3460] border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-md border border-amber-300/40">
              <Lock className="h-5 w-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Admin Dashboard Authentication
                </h3>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  RBAC SECURE
                </span>
              </div>
              <p className="text-xs text-amber-200/70 mt-0.5">
                Sign in with administrative credentials to edit/delete landing page messages and manage banking standards.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 md:p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-500/50 text-xs text-rose-200 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Username or Official Email</label>
              <div className="relative">
                <User className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@hijra-bank.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Password</label>
              <div className="relative">
                <Key className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Role-Based Access Level (RBAC)</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as AdminRole)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-semibold focus:border-amber-400 outline-none"
              >
                <option value="Super Admin">Super Admin (Chief Auditor - Full Control)</option>
                <option value="IS Audit Manager">IS Audit Manager (Message & Standards Editor)</option>
                <option value="Compliance Officer">Compliance Officer (Regulatory Reviewer)</option>
                <option value="Viewer">Viewer (Read-Only Admin)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-950/40 border border-amber-300/40 flex items-center justify-center gap-2 cursor-pointer transition-all mt-4"
            >
              <ShieldCheck className="h-4 w-4 stroke-[2.5]" />
              <span>Authenticate &amp; Access Admin Dashboard</span>
            </button>
          </form>

          {/* Quick-Fill Preset Accounts for Demo / Auditor Verification */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Quick Login with Bank RBAC Role Presets:</span>
            </span>

            <div className="grid grid-cols-1 gap-1.5">
              {PRESET_ACCOUNTS.map((preset) => (
                <div
                  key={preset.role}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-[11px] ${
                    username === preset.username
                      ? 'bg-amber-500/20 border-amber-500/50 text-white'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold">
                      <span>{preset.displayName}</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 font-mono text-[9px]">
                        {preset.role}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-xs">{preset.description}</div>
                  </div>
                  <span className="text-[10px] text-blue-400 font-semibold shrink-0">Click to Fill →</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
