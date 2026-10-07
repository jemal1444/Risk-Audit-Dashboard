import { AdminLandingMessage } from '../types/audit';

export const INITIAL_LANDING_MESSAGES: AdminLandingMessage[] = [
  {
    id: 'msg-01',
    title: 'Board Audit Committee Mandate: Mandatory Remediation of Critical Deficiencies',
    content:
      'Pursuant to Board Resolution HB-BR-2026-88, all high and critical deficiencies in MFA, PAM, and Asset Management must achieve validated closure before the statutory examination deadline.',
    type: 'Critical Advisory',
    position: 'Top Broadcast Ticker',
    active: true,
    author: 'Abebe T.',
    authorRole: 'Chief Internal Auditor',
    lastUpdated: '2026-10-06 18:30:00',
    priority: 'Urgent',
    callToActionText: 'View 16 Findings',
    callToActionTab: 'findings',
  },
  {
    id: 'msg-02',
    title: 'NBE Regulatory Compliance Notice: SIEM Log Retention & Privileged Access Control',
    content:
      'The National Bank of Ethiopia (NBE) Cyber Security Framework mandates 365-day tamper-evident log retention and 100% MFA deployment on all Core Banking System (CBS) privileged accounts.',
    type: 'Regulatory Notice',
    position: 'Executive Notice Hero',
    active: true,
    author: 'Priya M.',
    authorRole: 'Chief Information Security Officer (CISO)',
    lastUpdated: '2026-10-05 14:15:00',
    priority: 'High',
    callToActionText: 'Policy Checklist',
    callToActionTab: 'checklist',
  },
  {
    id: 'msg-03',
    title: 'Annual IS Audit Rectification: Infrastructure & CBS Batch Remediation Drive',
    content:
      'All Departmental Custodians (Network Manager, Data Center & Admin, CBS Operations) must submit milestone completion evidence for in-flight rectifications before Friday close-of-business.',
    type: 'Policy Update',
    position: 'Landing Announcement Card',
    active: true,
    author: 'Dawit M.',
    authorRole: 'Head of IT Risk & Compliance',
    lastUpdated: '2026-10-04 10:00:00',
    priority: 'Normal',
    callToActionText: 'Audit Plan',
    callToActionTab: 'plan',
  },
  {
    id: 'msg-04',
    title: 'Scheduled Security Assessment: Core Banking System (CBS) Batch Window',
    content:
      'Automated vulnerability scanning and PAM credential rotation verification will execute Sunday 01:00 - 04:00 UTC. No service interruption to live POS/ATM switching is expected.',
    type: 'System Broadcast',
    position: 'Landing Announcement Card',
    active: true,
    author: 'Sara B.',
    authorRole: 'Head of IS Operations Support',
    lastUpdated: '2026-10-03 16:45:00',
    priority: 'Normal',
    callToActionText: 'Live Scanner',
    callToActionTab: 'scanner',
  },
];
