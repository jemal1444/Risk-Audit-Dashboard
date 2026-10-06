import React, { useState } from 'react';
import { ITAsset } from '../types/audit';
import {
  Database,
  Search,
  Plus,
  Download,
  CheckCircle,
  AlertCircle,
  Shield,
  Server,
  Key,
  Laptop,
  Cloud,
  Check,
  X,
  UserCheck,
} from 'lucide-react';
import { exportAssetsToCSV } from '../utils/exportUtils';

interface AuditUniverseViewProps {
  assets: ITAsset[];
  onUpdateAssetStatus: (id: string, newStatus: 'Verified' | 'Discrepancy' | 'Unmapped') => void;
  onAddAsset: (newAsset: Omit<ITAsset, 'id'>) => void;
}

export const AuditUniverseView: React.FC<AuditUniverseViewProps> = ({
  assets,
  onUpdateAssetStatus,
  onAddAsset,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for adding asset
  const [newTag, setNewTag] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<ITAsset['type']>('Non-Human Machine (NHM)');
  const [newClassification, setNewClassification] = useState<ITAsset['classification']>('Restricted');
  const [newOwner, setNewOwner] = useState('');
  const [newCustodian, setNewCustodian] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.businessOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.technicalCustodian.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypeFilter === 'All' || a.type === selectedTypeFilter;
    const matchesStatus = selectedStatusFilter === 'All' || a.verificationStatus === selectedStatusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const verifiedCount = assets.filter((a) => a.verificationStatus === 'Verified').length;
  const discrepancyCount = assets.filter((a) => a.verificationStatus === 'Discrepancy').length;
  const unmappedCount = assets.filter((a) => a.verificationStatus === 'Unmapped').length;

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTag.trim()) return;

    onAddAsset({
      assetTag: newTag,
      name: newName,
      type: newType,
      classification: newClassification,
      businessOwner: newOwner || 'Pending Assignment',
      technicalCustodian: newCustodian || 'Infrastructure Lead',
      location: newLocation || 'Primary Datacenter',
      verificationStatus: 'Verified',
      mfaEnforced: newType === 'Human Identity (HM)',
      edrInstalled: newType === 'Endpoint Device',
      siemIngested: true,
      lastAudited: new Date().toISOString().slice(0, 10),
    });

    // Reset form
    setNewTag('');
    setNewName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner explaining finding #5 alignment */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-400" />
              <span>Centralized IT Asset &amp; Identity Control (Finding #5 Remediation)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Reconciliation repository establishing formal ownership, whereabouts, and security enforcement across Human (HM) &amp; Non-Human Machine (NHM) Identities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportAssetsToCSV(assets)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-all"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span>Export CMDB</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-sm shadow-blue-900/30"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Register Asset / Identity</span>
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Total Scoped Assets</span>
            <span className="font-mono font-bold text-white">{assets.length}</span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <span className="text-emerald-300">Verified &amp; Assigned</span>
            <span className="font-mono font-bold text-emerald-400">{verifiedCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <span className="text-amber-300">Discrepancy / Drift</span>
            <span className="font-mono font-bold text-amber-400">{discrepancyCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
            <span className="text-rose-300">Unmapped / Shadow IT</span>
            <span className="font-mono font-bold text-rose-400">{unmappedCount}</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tag, owner, custodian, name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Asset Types</option>
              <option value="Human Identity (HM)">Human Identity (HM: Admins, Tellers)</option>
              <option value="Non-Human Machine (NHM)">Non-Human Machine (NHM: Service Accounts, APIs)</option>
              <option value="Core Banking Server">Core Banking Servers</option>
              <option value="Database">Database Engines</option>
              <option value="Endpoint Device">Endpoint Workstations</option>
              <option value="Cloud VPC / API">Cloud VPCs &amp; Microservices</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Verification Statuses</option>
              <option value="Verified">Verified &amp; Reconciled</option>
              <option value="Discrepancy">Discrepancy (Missing Custodian/Location)</option>
              <option value="Unmapped">Unmapped (Shadow Asset / Finding #5 Alert)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-2.5">Asset Tag &amp; Type</th>
                <th className="pb-2.5">Asset / Identity Name</th>
                <th className="pb-2.5">Tier / Class</th>
                <th className="pb-2.5">Assigned Business Owner</th>
                <th className="pb-2.5">Technical Custodian</th>
                <th className="pb-2.5">Whereabouts / Location</th>
                <th className="pb-2.5 text-center">Controls (MFA/EDR/SIEM)</th>
                <th className="pb-2.5 text-center">Status</th>
                <th className="pb-2.5 text-right">Attestation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5">
                    <div className="font-mono font-bold text-blue-400">{asset.assetTag}</div>
                    <span className="text-[10px] text-slate-400">{asset.type}</span>
                  </td>
                  <td className="py-2.5 pr-2 font-semibold text-slate-200">
                    {asset.name}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase ${
                        asset.classification === 'Restricted'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : asset.classification === 'Confidential'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {asset.classification}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-300 font-medium">
                    {asset.businessOwner}
                  </td>
                  <td className="py-2.5 text-slate-400">
                    {asset.technicalCustodian}
                  </td>
                  <td className="py-2.5 text-slate-400 font-mono text-[11px]">
                    {asset.location}
                  </td>
                  <td className="py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] font-mono">
                      <span
                        title="MFA Enforced"
                        className={`px-1.5 py-0.5 rounded ${
                          asset.mfaEnforced ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        MFA
                      </span>
                      <span
                        title="EDR Installed"
                        className={`px-1.5 py-0.5 rounded ${
                          asset.edrInstalled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        EDR
                      </span>
                      <span
                        title="SIEM Logging"
                        className={`px-1.5 py-0.5 rounded ${
                          asset.siemIngested ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        LOG
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 text-center">
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${
                        asset.verificationStatus === 'Verified'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : asset.verificationStatus === 'Discrepancy'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300 font-bold'
                      }`}
                    >
                      {asset.verificationStatus}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    {asset.verificationStatus !== 'Verified' ? (
                      <button
                        onClick={() => onUpdateAssetStatus(asset.id, 'Verified')}
                        className="px-2 py-1 text-[11px] bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 border border-emerald-500/40 rounded transition-all inline-flex items-center gap-1"
                      >
                        <Check className="h-3 w-3" />
                        <span>Validate</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 flex items-center justify-end gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Attested</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for registering asset / identity */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-400" />
                <span>Register Critical Asset / Identity (HM / NHM)</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Asset Tag</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NHM-SVC-9901"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Asset Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Non-Human Machine (NHM)">Non-Human Machine (NHM)</option>
                    <option value="Human Identity (HM)">Human Identity (HM)</option>
                    <option value="Core Banking Server">Core Banking Server</option>
                    <option value="Database">Database Engine</option>
                    <option value="Endpoint Device">Endpoint Workstation</option>
                    <option value="Cloud VPC / API">Cloud VPC / API</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Asset / Identity Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. svc-finacle-swift-connector or DB Admin Pool"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Classification Tier</label>
                  <select
                    value={newClassification}
                    onChange={(e) => setNewClassification(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Restricted">Restricted (Tier 0 / Critical)</option>
                    <option value="Confidential">Confidential</option>
                    <option value="Internal">Internal</option>
                    <option value="Public">Public</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Whereabouts / Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Datacenter 1 Rack 14 / Cloud EU"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Assigned Business Owner</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Head of Payments"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Technical Custodian</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Systems Engineer"
                    value={newCustodian}
                    onChange={(e) => setNewCustodian(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
