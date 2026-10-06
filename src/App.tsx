import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { AuditFindingsView } from './components/AuditFindingsView';
import { AuditUniverseView } from './components/AuditUniverseView';
import { LiveScannerView } from './components/LiveScannerView';
import { RiskMatrixView } from './components/RiskMatrixView';
import { ControlTestingView } from './components/ControlTestingView';
import { AnnualPlanView } from './components/AnnualPlanView';
import { Assurance3LODView } from './components/Assurance3LODView';
import { AiAdvisorView } from './components/AiAdvisorView';
import { ReportsView } from './components/ReportsView';
import { RegulatoryComplianceChecklist } from './components/RegulatoryComplianceChecklist';
import { FindingDetailModal } from './components/FindingDetailModal';
import { AiRemediationModal } from './components/AiRemediationModal';
import { AddDepartmentalRiskModal } from './components/AddDepartmentalRiskModal';

import {
  INITIAL_FINDINGS,
  INITIAL_ASSETS,
  INITIAL_CONTROL_TESTS,
  ANNUAL_AUDIT_PLAN,
  AUDIT_RESOURCE_TEAMS,
  INITIAL_LIVE_SCAN_CHECKS,
  INITIAL_POLICY_CHECKLIST,
} from './data/auditData';

import {
  AuditFinding,
  ITAsset,
  FindingStatus,
  LiveScanCheckResult,
  PolicyApprovalChecklistItem,
  RiskAssessmentStatus,
  AuditRectificationStatus,
} from './types/audit';

import { exportFindingsToCSV } from './utils/exportUtils';

export default function App() {
  // Primary datasets
  const [findings, setFindings] = useState<AuditFinding[]>(INITIAL_FINDINGS);
  const [assets, setAssets] = useState<ITAsset[]>(INITIAL_ASSETS);
  const [controlTests, setControlTests] = useState(INITIAL_CONTROL_TESTS);
  const [annualPlan, setAnnualPlan] = useState(ANNUAL_AUDIT_PLAN);
  const [resourceTeams, setResourceTeams] = useState(AUDIT_RESOURCE_TEAMS);
  const [scanChecks, setScanChecks] = useState<LiveScanCheckResult[]>(INITIAL_LIVE_SCAN_CHECKS);
  const [policyChecklist, setPolicyChecklist] = useState<PolicyApprovalChecklistItem[]>(INITIAL_POLICY_CHECKLIST);

  // Global Navigation & Modals
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedFindingForDetail, setSelectedFindingForDetail] = useState<AuditFinding | null>(null);
  const [selectedFindingForAi, setSelectedFindingForAi] = useState<AuditFinding | null>(null);
  const [isAddRiskModalOpen, setIsAddRiskModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Global Header Filters
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedCycle, setSelectedCycle] = useState('All');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedOwner, setSelectedOwner] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Filtered findings based on header
  const filteredFindings = useMemo(() => {
    return findings.filter((f) => {
      const matchDomain = selectedDomain === 'All' || f.domain === selectedDomain;
      const matchOwner = selectedOwner === 'All' || f.owner.startsWith(selectedOwner.split(' ')[0]);
      const matchStatus = selectedStatus === 'All' || f.status === selectedStatus;
      return matchDomain && matchOwner && matchStatus;
    });
  }, [findings, selectedDomain, selectedOwner, selectedStatus]);

  // Handlers
  const handleUpdateFindingStatus = (id: string, newStatus: FindingStatus) => {
    setFindings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
    if (selectedFindingForDetail?.id === id) {
      setSelectedFindingForDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleUpdateFindingAssessmentAndRectification = (
    id: string,
    assessmentStatus: RiskAssessmentStatus,
    rectificationStatus: AuditRectificationStatus
  ) => {
    setFindings((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              riskAssessmentStatus: assessmentStatus,
              auditRectificationStatus: rectificationStatus,
            }
          : f
      )
    );
    if (selectedFindingForDetail?.id === id) {
      setSelectedFindingForDetail((prev) =>
        prev
          ? {
              ...prev,
              riskAssessmentStatus: assessmentStatus,
              auditRectificationStatus: rectificationStatus,
            }
          : null
      );
    }
  };

  const handleToggleChecklistStatus = (
    id: string,
    newStatus: 'Approved' | 'Draft' | 'Under Review'
  ) => {
    setPolicyChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    // When a policy is approved, update corresponding finding state if linked
    const targetItem = policyChecklist.find((i) => i.id === id);
    if (targetItem && targetItem.findingRef) {
      if (newStatus === 'Approved') {
        handleUpdateFindingStatus(targetItem.findingRef, 'Under Review');
      }
    }
  };

  const handleAddDepartmentalRisk = (newFinding: AuditFinding) => {
    setFindings((prev) => [newFinding, ...prev]);
    setSelectedFindingForDetail(newFinding);
  };

  const handleUpdateAssetStatus = (id: string, newStatus: 'Verified' | 'Discrepancy' | 'Unmapped') => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, verificationStatus: newStatus } : a))
    );
  };

  const handleAddAsset = (newAssetData: Omit<ITAsset, 'id'>) => {
    const newId = `AST-${String(assets.length + 1).padStart(3, '0')}`;
    setAssets((prev) => [{ ...newAssetData, id: newId }, ...prev]);
  };

  const handleRemediateScanCheck = (checkId: string) => {
    setScanChecks((prev) =>
      prev.map((c) =>
        c.id === checkId
          ? {
              ...c,
              status: 'PASS',
              observedValue: '100% Policy Enforced (Telemetry Verified)',
              lastChecked: 'Just now',
            }
          : c
      )
    );

    // Also update corresponding finding status if open
    const targetCheck = scanChecks.find((c) => c.id === checkId);
    if (targetCheck) {
      handleUpdateFindingStatus(targetCheck.findingRef, 'In Progress');
    }
  };

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScanChecks((prev) =>
        prev.map((c) => ({
          ...c,
          lastChecked: 'Just now',
        }))
      );
      setIsScanning(false);
    }, 1800);
  };

  const openFindingsCount = filteredFindings.filter((f) => f.status !== 'Remediated').length;
  const overdueCount = filteredFindings.filter((f) => f.status === 'Overdue' || f.agingDays > 90).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header with Hijra Bank branding & Departmental Intake */}
      <Header
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedCycle={selectedCycle}
        setSelectedCycle={setSelectedCycle}
        selectedDomain={selectedDomain}
        setSelectedDomain={setSelectedDomain}
        selectedOwner={selectedOwner}
        setSelectedOwner={setSelectedOwner}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onRunScan={handleRunScan}
        onOpenAiAdvisor={() => setActiveTab('ai-advisor')}
        onExport={() => exportFindingsToCSV(filteredFindings)}
        onOpenAddRisk={() => setIsAddRiskModalOpen(true)}
        onOpenChecklist={() => setActiveTab('checklist')}
        isScanning={isScanning}
      />

      {/* Main Layout: Sidebar + Content Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openFindingsCount={openFindingsCount}
          overdueCount={overdueCount}
        />

        {/* Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950">
          <div className="max-w-[1600px] mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardOverview
                findings={findings}
                filteredFindings={filteredFindings}
                controlTests={controlTests}
                annualPlan={annualPlan}
                resourceTeams={resourceTeams}
                onSelectFinding={(f) => setSelectedFindingForDetail(f)}
                onOpenAiForFinding={(f) => setSelectedFindingForAi(f)}
                onNavigateToTab={(tab) => setActiveTab(tab as NavTab)}
                onOpenAddRiskModal={() => setIsAddRiskModalOpen(true)}
              />
            )}

            {activeTab === 'findings' && (
              <AuditFindingsView
                findings={findings}
                onSelectFinding={(f) => setSelectedFindingForDetail(f)}
                onOpenAiForFinding={(f) => setSelectedFindingForAi(f)}
                onUpdateFindingStatus={handleUpdateFindingStatus}
                onOpenAddRisk={() => setIsAddRiskModalOpen(true)}
                onUpdateFindingAssessmentAndRectification={handleUpdateFindingAssessmentAndRectification}
              />
            )}

            {activeTab === 'checklist' && (
              <RegulatoryComplianceChecklist
                checklist={policyChecklist}
                onToggleStatus={handleToggleChecklistStatus}
                onNavigateToTab={(tab) => setActiveTab(tab as NavTab)}
              />
            )}

            {activeTab === 'universe' && (
              <AuditUniverseView
                assets={assets}
                onUpdateAssetStatus={handleUpdateAssetStatus}
                onAddAsset={handleAddAsset}
              />
            )}

            {activeTab === 'scanner' && (
              <LiveScannerView
                scanChecks={scanChecks}
                onRemediateCheck={handleRemediateScanCheck}
                onRunFullScan={handleRunScan}
                isScanning={isScanning}
              />
            )}

            {activeTab === 'risk' && (
              <RiskMatrixView
                findings={findings}
                onSelectFinding={(f) => setSelectedFindingForDetail(f)}
                onOpenAddRisk={() => setIsAddRiskModalOpen(true)}
              />
            )}

            {activeTab === 'testing' && (
              <ControlTestingView controlTests={controlTests} />
            )}

            {activeTab === 'plan' && (
              <AnnualPlanView
                annualPlan={annualPlan}
                resourceTeams={resourceTeams}
              />
            )}

            {activeTab === 'assurance' && (
              <Assurance3LODView findings={findings} />
            )}

            {activeTab === 'ai-advisor' && (
              <AiAdvisorView findings={findings} />
            )}

            {activeTab === 'reports' && (
              <ReportsView
                findings={findings}
                assets={assets}
                controlTests={controlTests}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {selectedFindingForDetail && (
        <FindingDetailModal
          finding={selectedFindingForDetail}
          onClose={() => setSelectedFindingForDetail(null)}
          onOpenAi={(f) => {
            setSelectedFindingForDetail(null);
            setSelectedFindingForAi(f);
          }}
          onUpdateStatus={handleUpdateFindingStatus}
          onUpdateAssessmentAndRectification={handleUpdateFindingAssessmentAndRectification}
        />
      )}

      {selectedFindingForAi && (
        <AiRemediationModal
          finding={selectedFindingForAi}
          onClose={() => setSelectedFindingForAi(null)}
          onApplyRemediation={(id, note) => {
            handleUpdateFindingStatus(id, 'In Progress');
          }}
        />
      )}

      {isAddRiskModalOpen && (
        <AddDepartmentalRiskModal
          isOpen={isAddRiskModalOpen}
          onClose={() => setIsAddRiskModalOpen(false)}
          onAddRisk={handleAddDepartmentalRisk}
          totalFindingsCount={findings.length}
        />
      )}
    </div>
  );
}

