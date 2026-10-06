import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiEnabled: Boolean(ai),
    timestamp: new Date().toISOString(),
  });
});

// Endpoint: AI-assisted Remediation Blueprint & Action Plan
app.post('/api/ai/remediate', async (req: Request, res: Response) => {
  try {
    const { findingId, title, domain, description, currentStatus, targetFramework } = req.body;

    const prompt = `You are a Principal Information Security Auditor and Chief Risk Officer specializing in Banking & Financial Institutions IT audits (NIST CSF 2.0, ISO/IEC 27001:2022, CIS Controls v8, PCI-DSS v4.0, FFIEC IT Handbook).

Analyze this specific audit finding and generate an executive-grade remediation roadmap:
Finding ID: ${findingId || 'AUDIT-FINDING'}
Domain: ${domain || 'Information Security Control'}
Title: ${title}
Description: ${description}
Current Status: ${currentStatus || 'Open'}
Target Standard: ${targetFramework || 'NIST CSF 2.0 / ISO 27001:2022 / CIS v8'}

Please return a comprehensive, structured JSON response with the following keys:
{
  "summary": "Executive summary of the risk exposure and business impact in a financial institution context.",
  "rootCauseAnalysis": "Deep root cause analysis (people, process, technology, governance).",
  "regulatoryImpact": "Specific regulatory clauses violated (e.g., NIST CSF, ISO 27001, FFIEC, EBA Guidelines, PCI-DSS).",
  "remediationRoadmap": [
    {
      "phase": "Phase 1: Immediate Containment (Days 0-15)",
      "actions": ["action 1", "action 2"],
      "deliverables": "Tangible audit evidence created"
    },
    {
      "phase": "Phase 2: Systematic Implementation (Days 16-60)",
      "actions": ["action 1", "action 2"],
      "deliverables": "Tangible audit evidence created"
    },
    {
      "phase": "Phase 3: Formal Governance & Assurance (Days 61-90)",
      "actions": ["action 1", "action 2"],
      "deliverables": "Board approval, testing workpaper"
    }
  ],
  "policyTemplateOutline": "Draft policy standard clauses to satisfy this audit requirement.",
  "auditTestingProcedure": "Specific test procedures the internal/external auditor will execute to validate closure (walkthrough, inspection, re-performance).",
  "kpiMetrics": ["Metric 1", "Metric 2"]
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text;
      if (text) {
        try {
          const parsed = JSON.parse(text);
          return res.json({ success: true, data: parsed });
        } catch {
          // If parsing failed, return text wrapped
          return res.json({ success: true, data: { rawText: text } });
        }
      }
    }

    // High quality deterministic fallback when API key is missing or testing
    return res.json({
      success: true,
      data: getDeterministicRemediation(findingId, title, domain, description),
      fallback: true,
    });
  } catch (error: any) {
    console.error('Remediation AI Error:', error);
    return res.json({
      success: true,
      data: getDeterministicRemediation(
        req.body?.findingId,
        req.body?.title,
        req.body?.domain,
        req.body?.description
      ),
      fallback: true,
      note: error?.message || 'Using domain knowledge engine',
    });
  }
});

// Endpoint: AI-assisted Formal Policy Document Generator
app.post('/api/ai/policy', async (req: Request, res: Response) => {
  try {
    const { policyTitle, domain, scope, regulatoryBasis } = req.body;

    const prompt = `Draft a formal, enterprise-ready banking IT policy document for:
Policy Title: ${policyTitle}
Domain: ${domain}
Scope: ${scope || 'All Information Systems, Human (HM) & Non-Human (NHM) Identities, Cloud, Datacenter'}
Regulatory Basis: ${regulatoryBasis || 'NIST CSF 2.0, ISO 27001:2022, FFIEC Information Security Booklet'}

Provide a structured, executive-approved policy document format including:
1. PURPOSE & OBJECTIVES
2. SCOPE & APPLICABILITY
3. POLICY STATEMENTS & MANDATES (Specific, enforceable requirements)
4. ROLES & RESPONSIBILITIES (Board, Risk Committee, CISO, Asset Owners, System Administrators)
5. COMPLIANCE METRICS & SLA AGING THRESHOLDS
6. EXCEPTION MANAGEMENT & BOARD ESCALATION
7. AUDIT EVIDENCE & LOG RETENTION REQUIREMENTS
8. APPROVAL & ANNUAL REVIEW CYCLE`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.3,
        },
      });

      return res.json({ success: true, policyText: response.text });
    }

    // Robust domain fallback
    return res.json({
      success: true,
      policyText: getDeterministicPolicy(policyTitle, domain),
      fallback: true,
    });
  } catch (error: any) {
    console.error('Policy AI Error:', error);
    return res.json({
      success: true,
      policyText: getDeterministicPolicy(req.body?.policyTitle, req.body?.domain),
      fallback: true,
    });
  }
});

// Endpoint: Audit Committee Executive Briefing
app.post('/api/ai/board-report', async (req: Request, res: Response) => {
  try {
    const { totalFindings, criticalCount, highCount, overdueCount, openAreas } = req.body;

    const prompt = `Draft a concise, executive CISO & Chief Internal Auditor Briefing Memo for the Board of Directors Audit & Risk Committee.
Metrics:
- Total Audit Findings: ${totalFindings}
- Critical Severity: ${criticalCount}
- High Severity: ${highCount}
- Overdue Actions: ${overdueCount}
- Impacted Domains: ${JSON.stringify(openAreas)}

Structure:
1. Executive Risk Posture Assessment
2. Key Systemic Deficiencies (Governance, Asset Inventory HM/NHM, IAM MFA/PAM, SIEM/SOC, Phishing)
3. Regulatory Scrutiny & Operational Exposure (Financial/Banking sector)
4. Three Lines of Defense Coordination & Corrective Action Timetable
5. Committee Resolutions Requested`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.25,
        },
      });

      return res.json({ success: true, report: response.text });
    }

    return res.json({
      success: true,
      report: getDeterministicBoardReport(criticalCount, highCount, overdueCount),
      fallback: true,
    });
  } catch (error: any) {
    console.error('Board Report AI Error:', error);
    return res.json({
      success: true,
      report: getDeterministicBoardReport(
        req.body?.criticalCount || 4,
        req.body?.highCount || 9,
        req.body?.overdueCount || 5
      ),
      fallback: true,
    });
  }
});

// Domain knowledge generators for infallible offline/fallback performance
function getDeterministicRemediation(id: string, title: string, domain: string, desc: string) {
  return {
    summary: `Audit finding ${id || 'AUDIT-DEFICIENCY'} (${title}) represents a material internal control deficiency under Bank Regulatory Guidelines. Unmitigated exposure increases likelihood of unauthorized access, lateral network movement, regulatory non-compliance enforcement actions, and unmonitored security incidents.`,
    rootCauseAnalysis: `Absence of board-approved operational mandates, fragmented IT asset tracking between infrastructure and identity directories, lack of centralized automated orchestration, and historical reliance on informal ad-hoc email communications rather than structured GRC governance workflows.`,
    regulatoryImpact: `Non-conformance with NIST CSF 2.0 (GV.RM-01, PR.AA-01), ISO/IEC 27001:2022 (Clauses 5.1, 8.1, Annex A.5.15, A.8.15), PCI-DSS v4.0 (Req 8.3, 10.2), and Basel Committee Guidelines on Operational Risk Resilience.`,
    remediationRoadmap: [
      {
        phase: 'Phase 1: Immediate Containment (Days 0-15)',
        actions: [
          'Issue interim executive memorandum defining mandatory operating requirements.',
          'Execute automated inventory discovery across all on-prem, cloud, and directory assets.',
          'Identify all exposed privileged accounts and non-human identities (NHM) lacking enforcement.',
        ],
        deliverables: 'Interim Executive Charter and Initial Risk Register Entry approved by CISO.',
      },
      {
        phase: 'Phase 2: Systematic Implementation (Days 16-60)',
        actions: [
          'Deploy automated enforcement technology (MFA gateway, EDR agents, SIEM forwarders).',
          'Establish technical aging metrics: Critical vulnerabilities <14 days, High <30 days.',
          'Implement automated weekly aging dashboards and escalation trigger to Executive Committee.',
        ],
        deliverables: 'Architectural blueprints, operational runbooks, and active log forwarder verification.',
      },
      {
        phase: 'Phase 3: Formal Governance & Assurance (Days 61-90)',
        actions: [
          'Submit formalized policy and standard operating procedures to Board Risk Committee for sign-off.',
          'Conduct independent re-testing with Internal Audit (3rd Line) to validate operational effectiveness.',
          'Close finding in Enterprise GRC with signed audit workpaper and evidentiary packet.',
        ],
        deliverables: 'Signed Board Resolution, Operational Control Testing Evidence Packet (100% sample pass).',
      },
    ],
    policyTemplateOutline: `Mandatory standard: All enterprise IT systems must maintain 100% continuous coverage under approved baseline configurations. Exceptions require CRO/CISO dual sign-off with compensating controls expiring within 90 days.`,
    auditTestingProcedure: `Auditor will inspect the Central Asset Repository, verify MFA enforcement logs for sample of 25 privileged users, inspect SIEM ingestion pipeline, and confirm Board Risk Committee approval minutes.`,
    kpiMetrics: [
      'Remediation Aging SLA Compliance Rate: 100%',
      'Privileged MFA & PAM Ingestion: 100%',
      'EDR Agent Health & Definition Freshness: >99.5%',
      'Simulated Phishing Click-Through Reduction: <3%',
    ],
  };
}

function getDeterministicPolicy(title: string, domain: string) {
  return `================================================================================
ENTERPRISE INFORMATION SECURITY POLICY SPECIFICATION
DOCUMENT REF: POL-${domain ? domain.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) : 'SEC'}-2026-v2.0
CLASSIFICATION: CONFIDENTIAL / INTERNAL AUDIT VERIFIED
STATUS: FORMAL BOARD-APPROVED (POST-AUDIT REMEDIATION)
================================================================================

1. PURPOSE & EXECUTIVE MANDATE
The purpose of this ${title || 'Information Security & IT Risk Management Policy'} is to establish rigorous, automated, and enforceable controls across all critical information assets in full compliance with Basel Committee, NIST CSF 2.0, ISO/IEC 27001:2022, and National Central Bank Cybersecurity Guidelines.

2. SCOPE & APPLICABILITY
This policy applies to:
- All banking core infrastructure, payment gateways (SWIFT, ACH, RTGS), cloud environments, and internal networks.
- All human identities (HM: employees, contractors, third-party vendors) and non-human machine identities (NHM: service accounts, API keys, CI/CD runners, robotic process automation bots).
- All endpoints, virtual machines, database engines, and network appliances.

3. CORE POLICY MANDATES & CONTROL STANDARDS
3.1 Governance & Risk Thresholds:
- A formal IT Risk Management framework must define explicit Risk Appetite and Risk Tolerance thresholds reviewed semi-annually.
- Vulnerability remediation timelines are codified: Critical (CVSS 9.0+) within 14 calendar days; High (CVSS 7.0-8.9) within 30 calendar days; Medium within 60 days. Escalation directly to the Chief Risk Officer occurs at day 10 for unpatched Criticals.

3.2 IT Asset & Identity Inventory (HM & NHM):
- 100% of all information assets must be registered in the centralized, cryptographically attested CMDB with assigned technical custodians and business owners.
- Orphaned, unclassified, or unassigned assets will be placed into network quarantine within 48 hours of detection.

3.3 Identity, Access Management & PAM:
- Multi-Factor Authentication (MFA) utilizing FIDO2/WebAuthn or hardware-backed push tokens is mandatory for 100% of privileged and critical system accesses. SMS or voice OTP is strictly prohibited for privileged access.
- Privileged Access Management (PAM) session recording and keystroke logging must be active and reviewed by 2nd Line Risk on a bi-weekly sampling basis.

3.4 Security Monitoring, SIEM & SOC:
- All security logs must stream in near-real-time to the centralized SIEM with minimum 365 days online retention and 7 years immutable cold archive.
- Security Operations Center (SOC) coverage is maintained 24x7x365 with automated alert tuning and monthly threat hunting exercises.

4. THREE LINES OF DEFENSE ROLES
- 1st Line (IT Operations): Daily control execution, asset tagging, and patch application.
- 2nd Line (Information Risk & Compliance): Policy enforcement, vulnerability aging surveillance, independent scan validation.
- 3rd Line (Internal Audit): Annual independent control design and operating effectiveness testing.

5. PENALTIES & COMPLIANCE ENFORCEMENT
Non-compliance constitutes a breach of regulatory fiduciary duty and triggers automated executive escalation to the Board Audit Committee.`;
}

function getDeterministicBoardReport(criticalCount: number, highCount: number, overdueCount: number) {
  return `MEMORANDUM TO THE BOARD AUDIT & RISK COMMITTEE
SUBJECT: CISO & INTERNAL AUDIT EXECUTIVE BRIEFING - IS SECURITY CONTROL DEFICIENCIES
PERIOD: FISCAL AUDIT CYCLE 2026

EXECUTIVE SUMMARY:
Following the comprehensive Information Systems (IS) Security Control Audit, a total of 16 findings have been identified across six core technical domains, comprising ${criticalCount} Critical, ${highCount} High, and associated operational issues. Currently, ${overdueCount} corrective action plans require immediate executive remediation oversight.

KEY FINDINGS & DEFICIENCY CLUSTERS:
1. Governance & Risk Management: Draft-only status of the Information Security Policy and absence of formal vulnerability aging escalation mechanisms expose the institution to regulatory sanctions and prolonged zero-day exposure.
2. Asset & Identity Management: Gaps in the centralized tracking of Non-Human Identities (NHM) and critical asset ownership impair rapid incident triage.
3. Access Controls & Privileged Access: Partial MFA enforcement and unmonitored privileged accounts create systemic attack paths for credential harvesting.
4. Monitoring & Endpoint Posture: Gaps in SIEM integration, absence of a formal SOC operating capability, and missing threat hunting leave advanced persistent threats (APTs) undetected.
5. Human Resilience: Ad-hoc security emails without structured phishing simulations leave the human attack surface susceptible to social engineering.

REMEDIATION TIMETABLE & RESOURCE ALLOCATION:
- 30-Day Emergency Stabilization: Board approval of IT Risk Policy, mandatory MFA enforcement on all domain controllers, and SIEM forwarder deployment to top 20 core banking servers.
- 60-Day Systematic Closure: Centralized CMDB reconciliation (HM/NHM), 24/7 Managed SOC integration, and bi-monthly automated phishing simulations.
- 90-Day Independent Re-testing: 3rd Line Internal Audit verification to formally sign off and close all 16 audit points.

RECOMMENDED COMMITTEE RESOLUTION:
Resolved, that the Audit & Risk Committee approves the accelerated IS Security Remediation Budget, codifies the proposed Vulnerability SLA Escalation Policy, and mandates bi-weekly progress reporting from the CISO until all Critical findings achieve validated closure.`;
}

// Dev server or static server
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Risk & IT Audit Control Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
