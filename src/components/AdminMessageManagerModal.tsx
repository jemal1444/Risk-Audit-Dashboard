import React, { useState } from 'react';
import {
  AdminLandingMessage,
  AdminMessageBannerType,
  AdminMessagePosition,
} from '../types/audit';
import {
  X,
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Bell,
  Radio,
  FileText,
  Sliders,
  Sparkles,
  ArrowRight,
  Send,
  Save,
  RotateCcw,
  Filter,
} from 'lucide-react';

interface AdminMessageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: AdminLandingMessage[];
  onSaveMessages: (updatedMessages: AdminLandingMessage[]) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const AdminMessageManagerModal: React.FC<AdminMessageManagerModalProps> = ({
  isOpen,
  onClose,
  messages,
  onSaveMessages,
  onNavigateToTab,
}) => {
  const [localMessages, setLocalMessages] = useState<AdminLandingMessage[]>(messages);
  const [editingMessage, setEditingMessage] = useState<AdminLandingMessage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'All' | AdminMessagePosition>('All');

  // Form states for create/edit
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formType, setFormType] = useState<AdminMessageBannerType>('Critical Advisory');
  const [formPosition, setFormPosition] = useState<AdminMessagePosition>('Top Broadcast Ticker');
  const [formPriority, setFormPriority] = useState<'Urgent' | 'High' | 'Normal'>('Urgent');
  const [formAuthor, setFormAuthor] = useState('Audit Administrator');
  const [formAuthorRole, setFormAuthorRole] = useState('Chief Internal Auditor');
  const [formActive, setFormActive] = useState(true);
  const [formCtaText, setFormCtaText] = useState('View Details');
  const [formCtaTab, setFormCtaTab] = useState('findings');

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingMessage(null);
    setFormTitle('');
    setFormContent('');
    setFormType('Critical Advisory');
    setFormPosition('Top Broadcast Ticker');
    setFormPriority('Urgent');
    setFormAuthor('Audit Administrator');
    setFormAuthorRole('Chief Internal Auditor');
    setFormActive(true);
    setFormCtaText('View Details');
    setFormCtaTab('findings');
  };

  const handleStartEdit = (msg: AdminLandingMessage) => {
    setEditingMessage(msg);
    setIsCreating(false);
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

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

    if (isCreating) {
      const newMsg: AdminLandingMessage = {
        id: `msg-${Date.now()}`,
        title: formTitle.trim(),
        content: formContent.trim(),
        type: formType,
        position: formPosition,
        active: formActive,
        author: formAuthor.trim() || 'Administrator',
        authorRole: formAuthorRole.trim() || 'Internal Audit',
        lastUpdated: nowStr,
        priority: formPriority,
        callToActionText: formCtaText.trim() || undefined,
        callToActionTab: formCtaTab || undefined,
      };
      const updated = [newMsg, ...localMessages];
      setLocalMessages(updated);
      onSaveMessages(updated);
      setIsCreating(false);
    } else if (editingMessage) {
      const updated = localMessages.map((m) =>
        m.id === editingMessage.id
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
      setLocalMessages(updated);
      onSaveMessages(updated);
      setEditingMessage(null);
    }
  };

  const handleToggleActive = (id: string) => {
    const updated = localMessages.map((m) =>
      m.id === id ? { ...m, active: !m.active } : m
    );
    setLocalMessages(updated);
    onSaveMessages(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this landing page broadcast message?')) {
      const updated = localMessages.filter((m) => m.id !== id);
      setLocalMessages(updated);
      onSaveMessages(updated);
      if (editingMessage?.id === id) {
        setEditingMessage(null);
      }
    }
  };

  const filteredMessages = localMessages.filter((m) => {
    if (selectedFilter === 'All') return true;
    return m.position === selectedFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl shadow-amber-950/30 overflow-hidden text-slate-200">
        {/* Top Header */}
        <div className="p-4 md:p-5 bg-gradient-to-r from-[#071933] via-[#0b2447] to-[#0f3460] border-b border-amber-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-950/40 border border-amber-300/40">
              <Radio className="h-5 w-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Landing Page &amp; Dashboard Message Management GUI
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono">
                  ADMIN CONTROLS
                </span>
              </div>
              <p className="text-xs text-amber-200/70 mt-0.5">
                Manage executive broadcast notices, regulatory directives, policy warnings, and ticker announcements across all user views.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCreating && !editingMessage && (
              <button
                onClick={handleStartCreate}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md border border-amber-300/40 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <PlusCircle className="h-4 w-4 stroke-[2.5]" />
                <span>+ Create New Message</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {/* Create / Edit Form Drawer */}
          {(isCreating || editingMessage) && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/50 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Edit2 className="h-4 w-4 text-amber-400" />
                  <span>{isCreating ? 'Create New Landing Broadcast Message' : 'Edit Broadcast Message'}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingMessage(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-3.5 text-xs">
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
                      <option value="Top Broadcast Ticker">Top Broadcast Ticker (Global Banner)</option>
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
                    placeholder="e.g. Board Audit Committee Mandate: Mandatory Remediation Deadline"
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
                    placeholder="Provide full directive text, regulatory mandate reference, or maintenance window..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:border-amber-400 outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Author Name</label>
                    <input
                      type="text"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      placeholder="e.g. Abebe T."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Author Official Role</label>
                    <input
                      type="text"
                      value={formAuthorRole}
                      onChange={(e) => setFormAuthorRole(e.target.value)}
                      placeholder="e.g. Chief Internal Auditor"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Action Button Label</label>
                    <input
                      type="text"
                      value={formCtaText}
                      onChange={(e) => setFormCtaText(e.target.value)}
                      placeholder="e.g. View Findings"
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
                      <option value="findings">Audit Findings</option>
                      <option value="checklist">Policy Checklist</option>
                      <option value="risk">Risk Matrix</option>
                      <option value="reports">Audit Reports Pack</option>
                      <option value="scanner">Live Scanner</option>
                      <option value="plan">Annual Audit Plan</option>
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
                    <span className="text-slate-200 font-medium">Publish Active (Visible to all users on landing page)</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreating(false);
                        setEditingMessage(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>{isCreating ? 'Publish Message' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Messages Filter & Stats */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold mr-1 flex items-center gap-1">
                <Filter className="h-3 w-3" /> Position Filter:
              </span>
              {(['All', 'Top Broadcast Ticker', 'Executive Notice Hero', 'Landing Announcement Card'] as const).map(
                (pos) => (
                  <button
                    key={pos}
                    onClick={() => setSelectedFilter(pos)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      selectedFilter === pos
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {pos === 'Top Broadcast Ticker'
                      ? 'Ticker'
                      : pos === 'Executive Notice Hero'
                      ? 'Hero Banner'
                      : pos === 'Landing Announcement Card'
                      ? 'Cards'
                      : 'All'}{' '}
                    ({localMessages.filter((m) => pos === 'All' || m.position === pos).length})
                  </button>
                )
              )}
            </div>

            <div className="text-[11px] text-slate-400">
              Total Published Active:{' '}
              <strong className="text-emerald-400">{localMessages.filter((m) => m.active).length}</strong> /{' '}
              {localMessages.length}
            </div>
          </div>

          {/* Messages List */}
          <div className="space-y-3">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-950/60 border border-slate-800">
                <Bell className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white">No Messages Found</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Create a new broadcast notice to announce policies or audit directives on the landing page.
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isCritical = msg.type === 'Critical Advisory';
                const isReg = msg.type === 'Regulatory Notice';
                const isPolicy = msg.type === 'Policy Update';

                return (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      !msg.active
                        ? 'bg-slate-950/40 border-slate-850 opacity-60'
                        : isCritical
                        ? 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/40 shadow-sm'
                        : isReg
                        ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/40 shadow-sm'
                        : 'bg-gradient-to-r from-blue-950/30 via-slate-900 to-slate-900 border-blue-500/30'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                            isCritical
                              ? 'bg-rose-500/20 text-rose-400'
                              : isReg
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {isCritical ? (
                            <AlertOctagon className="h-4 w-4" />
                          ) : isReg ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : (
                            <Bell className="h-4 w-4" />
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h5 className="text-sm font-bold text-white">{msg.title}</h5>
                            <span
                              className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                                isCritical
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : isReg
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-blue-500/20 text-blue-300'
                              }`}
                            >
                              {msg.type}
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                              {msg.position}
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold font-mono ${
                                msg.priority === 'Urgent' ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {msg.priority}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{msg.content}</p>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 mt-2">
                            <span>Author: <strong className="text-slate-200">{msg.author}</strong> ({msg.authorRole})</span>
                            <span>•</span>
                            <span>Updated: <span className="font-mono">{msg.lastUpdated}</span></span>
                            {msg.callToActionText && (
                              <>
                                <span>•</span>
                                <span className="text-amber-400 font-medium">CTA: {msg.callToActionText} → {msg.callToActionTab}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Toggle Active Button */}
                        <button
                          onClick={() => handleToggleActive(msg.id)}
                          className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all cursor-pointer ${
                            msg.active
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          {msg.active ? '● Active' : '○ Inactive'}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleStartEdit(msg)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                          title="Edit Message"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                          title="Delete Message"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Changes are applied immediately across the Landing Page, Dashboard, and Executive Banners.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
          >
            Close GUI
          </button>
        </div>
      </div>
    </div>
  );
};
