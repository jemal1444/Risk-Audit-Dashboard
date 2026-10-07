import React, { useState } from 'react';
import {
  AdminLandingMessage,
  AdminMessageBannerType,
  AdminMessagePosition,
  AdminUser,
  BankingISAuditStandard,
} from '../types/audit';
import {
  ShieldAlert,
  Sliders,
  PlusCircle,
  Edit2,
  Trash2,
  Lock,
  LogOut,
  Radio,
  FileCheck2,
  Building2,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Users,
  Key,
  Save,
  Search,
  Filter,
  Eye,
  ExternalLink,
  BookOpen,
  Award,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { BANKING_IS_AUDIT_STANDARDS } from '../data/bankingStandards';

interface AdminPortalViewProps {
  currentUser: AdminUser;
  onLogout: () => void;
  landingMessages: AdminLandingMessage[];
  onSaveMessages: (updatedMessages: AdminLandingMessage[]) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  currentUser,
  onLogout,
  landingMessages,
  onSaveMessages,
  onNavigateToTab,
}) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'standards' | 'users'>('messages');

  // Messages management state
  const [messages, setMessages] = useState<AdminLandingMessage[]>(landingMessages);
  const [isCreatingMessage, setIsCreatingMessage] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formType, setFormType] = useState<AdminMessageBannerType>('Critical Advisory');
  const [formPosition, setFormPosition] = useState<AdminMessagePosition>('Top Broadcast Ticker');
  const [formPriority, setFormPriority] = useState<'Urgent' | 'High' | 'Normal'>('Urgent');
  const [formAuthor, setFormAuthor] = useState(currentUser.displayName);
  const [formAuthorRole, setFormAuthorRole] = useState<string>(currentUser.role);
  const [formActive, setFormActive] = useState(true);
  const [formCtaText, setFormCtaText] = useState('View Details');
  const [formCtaTab, setFormCtaTab] = useState('findings');

  // Standards management state
  const [standards, setStandards] = useState<BankingISAuditStandard[]>(BANKING_IS_AUDIT_STANDARDS);
  const [standardSearch, setStandardSearch] = useState('');
  const [selectedStandardCategory, setSelectedStandardCategory] = useState<string>('All');
  const [isAddingStandard, setIsAddingStandard] = useState(false);
  const [newStdCode, setNewStdCode] = useState('');
  const [newStdName, setNewStdName] = useState('');
  const [newStdAuthority, setNewStdAuthority] = useState('');
  const [newStdCategory, setNewStdCategory] = useState<BankingISAuditStandard['category']>('Operational Resilience');
  const [newStdScope, setNewStdScope] = useState('');
  const [newStdMandatoryControls, setNewStdMandatoryControls] = useState(50);
  const [newStdCompliantControls, setNewStdCompliantControls] = useState(38);
  const [newStdAdverseFindings, setNewStdAdverseFindings] = useState(3);
  const [newStdStatus, setNewStdStatus] = useState<BankingISAuditStandard['status']>('Partially Compliant');
  const [newStdClauses, setNewStdClauses] = useState('Clause 1: Continuous logging\nClause 2: Dual authorization on payments');
  const [newStdDescription, setNewStdDescription] = useState('');
  const [newStdApplicability, setNewStdApplicability] = useState('Enterprise Core Banking Infrastructure');

  // Permission check
  const canEditMessages = currentUser.role === 'Super Admin' || currentUser.role === 'IS Audit Manager' || currentUser.role === 'Compliance Officer';
  const canDeleteMessages = currentUser.role === 'Super Admin' || currentUser.role === 'IS Audit Manager';

  // Start create message
  const handleStartCreate = () => {
    setIsCreatingMessage(true);
    setEditingMessageId(null);
    setFormTitle('');
    setFormContent('');
    setFormType('Critical Advisory');
    setFormPosition('Top Broadcast Ticker');
    setFormPriority('Urgent');
    setFormAuthor(currentUser.displayName);
    setFormAuthorRole(currentUser.role);
    setFormActive(true);
    setFormCtaText('View Details');
    setFormCtaTab('findings');
  };

  // Start edit message
  const handleStartEdit = (msg: AdminLandingMessage) => {
    setEditingMessageId(msg.id);
    setIsCreatingMessage(false);
    setFormTitle(msg.title);
    setFormContent(msg.content);
    setFormType(msg.type);
    setFormPosition(msg.position);
    setFormPriority(msg.priority);
    setFormAuthor(msg.author);
    setFormAuthorRole(msg.authorRole);
    setFormActive(msg.active);
    setFormCtaText(msg.callToActionText || 'View Details');
    setFormCtaTab(msg.callToActionTab || 'findings');
  };

  // Save create/edit
  const handleSaveMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

    if (isCreatingMessage) {
      const newMsg: AdminLandingMessage = {
        id: `msg-${Date.now()}`,
        title: formTitle.trim(),
        content: formContent.trim(),
        type: formType,
        position: formPosition,
        active: formActive,
        author: formAuthor.trim() || currentUser.displayName,
        authorRole: formAuthorRole.trim() || currentUser.role,
        lastUpdated: nowStr,
        priority: formPriority,
        callToActionText: formCtaText.trim() || undefined,
        callToActionTab: formCtaTab || undefined,
      };
      const updated = [newMsg, ...messages];
      setMessages(updated);
      onSaveMessages(updated);
      setIsCreatingMessage(false);
    } else if (editingMessageId) {
      const updated = messages.map((m) =>
        m.id === editingMessageId
          ? {
              ...m,
              title: formTitle.trim(),
              content: formContent.trim(),
              type: formType,
              position: formPosition,
              active: formActive,
              author: formAuthor.trim() || m.author,
              authorRole: formAuthorRole.trim() || m.authorRole,
              lastUpdated: nowStr,
              priority: formPriority,
              callToActionText: formCtaText.trim() || undefined,
              callToActionTab: formCtaTab || undefined,
            }
          : m
      );
      setMessages(updated);
      onSaveMessages(updated);
      setEditingMessageId(null);
    }
  };

  // Delete message
  const handleDeleteMessage = (id: string) => {
    if (!canDeleteMessages) {
      alert('Permission Denied: Only Super Admin and IS Audit Manager can delete broadcast messages.');
      return;
    }
    if (confirm('Permanently delete this landing page broadcast message?')) {
      const updated = messages.filter((m) => m.id !== id);
      setMessages(updated);
      onSaveMessages(updated);
      if (editingMessageId === id) setEditingMessageId(null);
    }
  };

  // Toggle active
  const handleToggleActive = (id: string) => {
    const updated = messages.map((m) =>
      m.id === id ? { ...m, active: !m.active } : m
    );
    setMessages(updated);
    onSaveMessages(updated);
  };

  // Save new banking standard
  const handleSaveNewStandard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStdCode.trim() || !newStdName.trim()) return;

    const clausesList = newStdClauses
      .split('\n')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const createdStd: BankingISAuditStandard = {
      id: `std-${Date.now()}`,
      code: newStdCode.trim().toUpperCase(),
      name: newStdName.trim(),
      authority: newStdAuthority.trim() || 'Central Banking Authority',
      category: newStdCategory,
      scope: newStdScope.trim() || 'Core Banking & IT Infrastructure Operations',
      mandatoryControlsCount: Number(newStdMandatoryControls) || 50,
      compliantControlsCount: Number(newStdCompliantControls) || 35,
      adverseFindingsCount: Number(newStdAdverseFindings) || 2,
      status: newStdStatus,
      keyClauses: clausesList.length > 0 ? clausesList : ['Mandatory annual independent penetration testing and SLA remediation'],
      description: newStdDescription.trim() || 'Statutory banking IS audit standard ensuring fiduciary cyber resiliency.',
      applicability: newStdApplicability.trim() || 'Enterprise Financial IT Infrastructure',
    };

    setStandards((prev) => [createdStd, ...prev]);
    setIsAddingStandard(false);
    setNewStdCode('');
    setNewStdName('');
    setNewStdAuthority('');
    setNewStdDescription('');
  };

  const handleDeleteStandard = (stdId: string) => {
    if (currentUser.role !== 'Super Admin') {
      alert('Only Super Admin can deregister Banking Audit Standards.');
      return;
    }
    if (confirm('Deregister this Banking IS Audit Standard from the active repository?')) {
      setStandards((prev) => prev.filter((s) => s.id !== stdId));
    }
  };

  // Filtered standards
  const filteredStandards = standards.filter((std) => {
    const matchesSearch =
      std.name.toLowerCase().includes(standardSearch.toLowerCase()) ||
      std.code.toLowerCase().includes(standardSearch.toLowerCase()) ||
      std.authority.toLowerCase().includes(standardSearch.toLowerCase());
    const matchesCategory =
      selectedStandardCategory === 'All' || std.category === selectedStandardCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4 text-slate-200">
      {/* Admin Portal Header Banner */}
      <div className="bg-gradient-to-r from-[#071933] via-[#0b2447] to-[#163664] border border-amber-500/40 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-lg border border-amber-300/40">
              <Lock className="h-6 w-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-white tracking-tight">
                  HIJRA BANK // SECURE IS AUDIT ADMIN PORTAL
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono">
                  {currentUser.role.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                Authenticated session for <strong>{currentUser.displayName}</strong> • {currentUser.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block text-[11px] font-mono text-slate-400">
              <div>AUTH ID: {currentUser.id}</div>
              <div className="text-emerald-400">SESSION ACTIVE</div>
            </div>

            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer border border-rose-500/40"
              title="Terminate Admin Session"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out Admin</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation in Admin Portal */}
        <div className="mt-4 pt-3 border-t border-amber-500/20 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Radio className="h-4 w-4" />
            <span>Landing Page Messages GUI ({messages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('standards')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'standards'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Banking IS Audit Standards ({standards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>RBAC Governance &amp; Permissions</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LANDING PAGE MESSAGES GUI */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-amber-400" />
                <span>Front-End Landing Page Message Controller</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Front-side landing page messages can only be added, edited, or deleted through this authenticated admin dashboard.
              </p>
            </div>

            {canEditMessages && !isCreatingMessage && !editingMessageId && (
              <button
                onClick={handleStartCreate}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md border border-amber-300/40 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <PlusCircle className="h-4 w-4 stroke-[2.5]" />
                <span>+ Create New Broadcast Message</span>
              </button>
            )}
          </div>

          {/* Create / Edit Form Drawer */}
          {(isCreatingMessage || editingMessageId) && (
            <div className="p-4 md:p-5 rounded-xl bg-slate-950 border border-amber-500/50 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Edit2 className="h-4 w-4 text-amber-400" />
                  <span>
                    {isCreatingMessage ? 'Compose New Landing Broadcast Directive' : 'Edit Broadcast Directive'}
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingMessage(false);
                    setEditingMessageId(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveMessage} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Message Type / Alert Tier</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as AdminMessageBannerType)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:border-amber-400 outline-none"
                    >
                      <option value="Critical Advisory">Critical Advisory (Red)</option>
                      <option value="Regulatory Notice">Regulatory Notice (Gold/Amber)</option>
                      <option value="Policy Update">Policy Update (Blue)</option>
                      <option value="System Broadcast">System Broadcast (Emerald)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Placement / Surface</label>
                    <select
                      value={formPosition}
                      onChange={(e) => setFormPosition(e.target.value as AdminMessagePosition)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:border-amber-400 outline-none"
                    >
                      <option value="Top Broadcast Ticker">Top Broadcast Ticker (Landing Page Banner)</option>
                      <option value="Executive Notice Hero">Executive Notice Hero (Dashboard Top)</option>
                      <option value="Landing Announcement Card">Landing Announcement Card (Overview Grid)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Priority</label>
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:border-amber-400 outline-none"
                    >
                      <option value="Urgent">Urgent (Flashing Indicator)</option>
                      <option value="High">High</option>
                      <option value="Normal">Normal</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Message Title / Subject</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Board Audit Mandate: 100% MFA Enforcement Deadline"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:border-amber-400 outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Message Body / Directive Content</label>
                  <textarea
                    required
                    rows={3}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Detail the mandatory audit requirement, regulatory directive clause, or maintenance window..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:border-amber-400 outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Author Official Name</label>
                    <input
                      type="text"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Author Executive Role</label>
                    <input
                      type="text"
                      value={formAuthorRole}
                      onChange={(e) => setFormAuthorRole(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Action Button Label</label>
                    <input
                      type="text"
                      value={formCtaText}
                      onChange={(e) => setFormCtaText(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Target View / Module</label>
                    <select
                      value={formCtaTab}
                      onChange={(e) => setFormCtaTab(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 outline-none"
                    >
                      <option value="findings">Audit Findings (16 Items)</option>
                      <option value="checklist">Policy Checklist</option>
                      <option value="risk">Risk Matrix</option>
                      <option value="reports">Audit Committee Reports</option>
                      <option value="scanner">Live Scanner</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formActive}
                      onChange={(e) => setFormActive(e.target.checked)}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-slate-200 font-medium">Publish Active to Front Landing Page</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingMessage(false);
                        setEditingMessageId(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>{isCreatingMessage ? 'Publish Broadcast' : 'Save Modifications'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Messages Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#071933] border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Status</th>
                    <th className="p-3">Title &amp; Directive</th>
                    <th className="p-3">Alert Type</th>
                    <th className="p-3">Placement</th>
                    <th className="p-3">Author</th>
                    <th className="p-3">Last Updated</th>
                    <th className="p-3 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {messages.map((msg) => (
                    <tr key={msg.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleActive(msg.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                            msg.active
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {msg.active ? '● Active' : '○ Inactive'}
                        </button>
                      </td>
                      <td className="p-3 max-w-sm">
                        <div className="font-bold text-white truncate">{msg.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{msg.content}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            msg.type === 'Critical Advisory'
                              ? 'bg-rose-500/20 text-rose-300'
                              : msg.type === 'Regulatory Notice'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}
                        >
                          {msg.type}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-slate-300">{msg.position}</td>
                      <td className="p-3 text-slate-300">
                        <div>{msg.author}</div>
                        <div className="text-[10px] text-slate-400">{msg.authorRole}</div>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-slate-400">{msg.lastUpdated}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {canEditMessages && (
                            <button
                              onClick={() => handleStartEdit(msg)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 cursor-pointer"
                              title="Edit Message"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {canDeleteMessages && (
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 cursor-pointer"
                              title="Delete Message"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BANKING IS AUDIT STANDARDS REGISTRY */}
      {activeTab === 'standards' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-400" />
                <span>Banking Information Systems Audit Standards Repository</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Statutory and international banking cybersecurity standards mapped to Hijra Bank IT infrastructure and audit findings.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  value={standardSearch}
                  onChange={(e) => setStandardSearch(e.target.value)}
                  placeholder="Search standard (e.g. SWIFT, Basel, NBE)..."
                  className="pl-8 pr-3 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <select
                value={selectedStandardCategory}
                onChange={(e) => setSelectedStandardCategory(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300 outline-none"
              >
                <option value="All">All Categories ({standards.length})</option>
                <option value="Banking Regulators">Banking Regulators (NBE / FFIEC)</option>
                <option value="Payment & Messaging">Payment &amp; Messaging (SWIFT)</option>
                <option value="Prudential Supervision">Prudential Supervision (Basel BCBS)</option>
                <option value="Cardholder Security">Cardholder Security (PCI-DSS)</option>
                <option value="Operational Resilience">Operational Resilience (DORA)</option>
                <option value="Cyber Hygiene & Controls">Cyber Hygiene &amp; Controls (NIST / MAS)</option>
                <option value="Threat Intelligence & Red Teaming">Threat Intelligence &amp; Red Teaming (TIBER/CBEST)</option>
                <option value="Third-Party & Cloud Assurance">Third-Party &amp; Cloud Assurance (SOC 1/2)</option>
                <option value="International ISMS">International ISMS (ISO 27001)</option>
                <option value="IT Governance">IT Governance (COBIT)</option>
              </select>

              {(currentUser.role === 'Super Admin' || currentUser.role === 'IS Audit Manager') && (
                <button
                  onClick={() => setIsAddingStandard((prev) => !prev)}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <PlusCircle className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>{isAddingStandard ? 'Close Form' : '+ Add Standard'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Add Standard Form Drawer */}
          {isAddingStandard && (
            <div className="p-4 md:p-5 rounded-xl bg-slate-950 border border-amber-500/50 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-amber-400" />
                  <span>Register Banking Information Systems Audit Standard</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingStandard(false)}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveNewStandard} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Standard Code / Identifier *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BCBS-O-RESIL-2026"
                      value={newStdCode}
                      onChange={(e) => setNewStdCode(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-slate-300 font-semibold block">Full Standard Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Principles for Operational Resilience in Banking"
                      value={newStdName}
                      onChange={(e) => setNewStdName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Regulatory Authority</label>
                    <input
                      type="text"
                      placeholder="e.g. Basel Committee / National Bank of Ethiopia"
                      value={newStdAuthority}
                      onChange={(e) => setNewStdAuthority(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Framework Category</label>
                    <select
                      value={newStdCategory}
                      onChange={(e) => setNewStdCategory(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:border-amber-400 outline-none"
                    >
                      <option value="Operational Resilience">Operational Resilience</option>
                      <option value="Cyber Hygiene & Controls">Cyber Hygiene &amp; Controls</option>
                      <option value="Banking Regulators">Banking Regulators</option>
                      <option value="Payment & Messaging">Payment &amp; Messaging</option>
                      <option value="Prudential Supervision">Prudential Supervision</option>
                      <option value="Cardholder Security">Cardholder Security</option>
                      <option value="Threat Intelligence & Red Teaming">Threat Intelligence &amp; Red Teaming</option>
                      <option value="Third-Party & Cloud Assurance">Third-Party &amp; Cloud Assurance</option>
                      <option value="International ISMS">International ISMS</option>
                      <option value="IT Governance">IT Governance</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Initial Compliance Status</label>
                    <select
                      value={newStdStatus}
                      onChange={(e) => setNewStdStatus(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:border-amber-400 outline-none"
                    >
                      <option value="Partially Compliant">Partially Compliant</option>
                      <option value="Deficient / Remediation Required">Deficient / Remediation Required</option>
                      <option value="Compliant">Compliant</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Mandatory Controls</label>
                    <input
                      type="number"
                      value={newStdMandatoryControls}
                      onChange={(e) => setNewStdMandatoryControls(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Compliant Controls</label>
                    <input
                      type="number"
                      value={newStdCompliantControls}
                      onChange={(e) => setNewStdCompliantControls(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 font-mono focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Adverse Findings</label>
                    <input
                      type="number"
                      value={newStdAdverseFindings}
                      onChange={(e) => setNewStdAdverseFindings(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-rose-400 font-mono focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Technical Scope &amp; Applicability</label>
                  <input
                    type="text"
                    placeholder="e.g. Core Banking System, SWIFT Alliance, Payment Switch, Disaster Recovery Site"
                    value={newStdScope}
                    onChange={(e) => setNewStdScope(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Standard Summary &amp; Fiduciary Purpose</label>
                  <textarea
                    rows={2}
                    placeholder="Describe how this standard enforces IT security, regulatory compliance, and risk containment."
                    value={newStdDescription}
                    onChange={(e) => setNewStdDescription(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Key Enforced Clauses (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Clause 1: 100% MFA for privileged admin access&#10;Clause 2: SIEM log retention with WORM storage"
                    value={newStdClauses}
                    onChange={(e) => setNewStdClauses(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddingStandard(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save &amp; Register Standard</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Standards Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredStandards.map((std) => {
              const compliancePct = Math.round((std.compliantControlsCount / std.mandatoryControlsCount) * 100);
              const isDeficient = std.status.includes('Deficient');

              return (
                <div
                  key={std.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                    isDeficient
                      ? 'bg-slate-950/90 border-rose-500/40 shadow-sm'
                      : 'bg-slate-950/80 border-slate-800 hover:border-amber-500/40'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {std.code}
                          </span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold bg-slate-800 text-slate-300 font-mono">
                            {std.category}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-1 leading-snug">{std.name}</h3>
                        <span className="text-[10px] text-amber-300/80 font-medium">Authority: {std.authority}</span>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                          std.status === 'Compliant'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : isDeficient
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {std.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{std.description}</p>

                    {/* Progress Metrics */}
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-850 space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Control Adherence Rate:</span>
                        <span className="font-bold text-white font-mono">{compliancePct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            compliancePct >= 80 ? 'bg-emerald-500' : compliancePct >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${compliancePct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                        <span>Mandatory Controls: <strong>{std.mandatoryControlsCount}</strong></span>
                        <span>Compliant: <strong className="text-emerald-400">{std.compliantControlsCount}</strong></span>
                        <span>Adverse Findings: <strong className="text-rose-400 font-bold">{std.adverseFindingsCount}</strong></span>
                      </div>
                    </div>

                    {/* Key Clauses */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Critical Requirement Clauses:</span>
                      <div className="space-y-1 text-[11px] text-slate-300">
                        {std.keyClauses.map((clause, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-400 shrink-0">•</span>
                            <span className="leading-tight">{clause}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 text-[10px]">Scope: {std.applicability}</span>
                    <div className="flex items-center gap-2">
                      {currentUser.role === 'Super Admin' && (
                        <button
                          onClick={() => handleDeleteStandard(std.id)}
                          className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-rose-950/40"
                          title="Deregister standard"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="text-[10px]">Deregister</span>
                        </button>
                      )}
                      {onNavigateToTab && (
                        <button
                          onClick={() => onNavigateToTab('checklist')}
                          className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Inspect in Checklist</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: RBAC USER & ROLE GOVERNANCE */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="h-4 w-4 text-amber-400" />
              <span>Role-Based Access Control (RBAC) Governance Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Defines access rights for editing landing page broadcast messages, approving policy exceptions, and exporting regulatory workpapers.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#071933] border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Role Tier</th>
                  <th className="p-3">Landing Message GUI Editing</th>
                  <th className="p-3">Message Deletion Rights</th>
                  <th className="p-3">Audit Standards Override</th>
                  <th className="p-3">Statutory PDF Sign-Off</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-amber-300">Super Admin (Chief Auditor)</td>
                  <td className="p-3 text-emerald-400 font-semibold">✓ Full Edit &amp; Publish</td>
                  <td className="p-3 text-emerald-400 font-semibold">✓ Full Delete</td>
                  <td className="p-3 text-emerald-400 font-semibold">✓ Authorize Overrides</td>
                  <td className="p-3 text-emerald-400 font-semibold">✓ Fiduciary Sign-Off</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-blue-300">IS Audit Manager</td>
                  <td className="p-3 text-emerald-400 font-semibold">✓ Edit &amp; Publish</td>
                  <td className="p-3 text-emerald-400 font-semibold">✓ Delete Rights</td>
                  <td className="p-3 text-slate-400 font-semibold">— Review Only</td>
                  <td className="p-3 text-emerald-400 font-semibold">✓ Review Sign-Off</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-200">Compliance Officer</td>
                  <td className="p-3 text-amber-400 font-semibold">✓ Regulatory Directives Only</td>
                  <td className="p-3 text-rose-400 font-semibold">✕ No Deletion</td>
                  <td className="p-3 text-slate-400 font-semibold">— Read Only</td>
                  <td className="p-3 text-slate-400 font-semibold">— Reviewer</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-400">Front Landing Page User (Auditor / Staff)</td>
                  <td className="p-3 text-rose-400 font-semibold">✕ No Edit (Front GUI Hidden)</td>
                  <td className="p-3 text-rose-400 font-semibold">✕ No Delete</td>
                  <td className="p-3 text-slate-400 font-semibold">— Read Only</td>
                  <td className="p-3 text-slate-400 font-semibold">— View Only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
