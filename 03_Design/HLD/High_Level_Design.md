# 🏗️ High-Level Design (HLD) - The Cabbage Mail

## 1. System Architecture Overview

```
 +-------------------------------------------------------------------+
 |                       The Cabbage Mail Web App                    |
 |                                                                   |
 |  +-----------------------+  +-------------------+  +-----------+  |
 |  | Auth & Self-Service   |  | Domain & KYC      |  | Delivery  |  |
 |  | Registration Module   |  | Verification      |  | Queue     |  |
 |  +-----------+-----------+  +---------+---------+  +-----+-----+  |
 |              |                        |                  |        |
 |              v                        v                  v        |
 |  +-----------------------+  +-------------------+                 |
 |  | Pre-Send Spam & List  |  | Campaign & List   |                 |
 |  | Hygiene Engine        |  | Engine            |                 |
 |  +-----------------------+  +-------------------+                 |
 +--------------|------------------------|------------------|--------+
                |                        |                  |
                v                        v                  v
 +-------------------------------------------------------------------+
 |                        Database / Storage                         |
 |  (Users | Workspaces | DNS Records | Spam Scores | AWS Configs)   |
 +-------------------------------------------------------------------+
                                         |
                                         v
 +-------------------------------------------------------------------+
 |                 AWS Cloud Infrastructure Integration              |
 |                                                                   |
 |  +-----------------------+             +-----------------------+  |
 |  |   Amazon SNS / SES    | ----------->|   Recipient Inboxes   |  |
 |  |   Email Dispatcher    |             |                       |  |
 |  +-----------------------+             +-----------------------+  |
 +-------------------------------------------------------------------+
```

---

## 2. Core Modules

1. **Self-Service Authentication & Tenant Module**: Manages user registration, workspace creation, session security, and client profiles.
2. **Domain Authentication & KYC Verification Engine**: Audits DNS TXT/CNAME records (SPF, DKIM, DMARC), website URLs, and physical postal addresses for CAN-SPAM compliance.
3. **Pre-Send Spam & List Hygiene Engine**: Cleans disposable email addresses, flags role accounts, and calculates content spam scores (0-100).
4. **Subscriber & Audience Module**: Manages contact lists, CSV import parser, and opt-out unsubscribe lists.
5. **Campaign Composition Module**: WYSIWYG email editor with merge tags (`{{first_name}}`), live preview, and compliance validator.
6. **AWS Delivery Adapter**: Integrates AWS SDK for dispatching bulk notifications/emails via AWS SNS/SES topics.
7. **Deliverability & Reputation Guardrails**: Monitors bounce (<5%) and complaint (<0.1%) thresholds, automatically enforcing workspace safeguards.

---

## 3. Technology Stack Selection (Minimalist & Modern)
- **Frontend Framework**: React + Vite + Tailwind CSS.
- **UI Components & Icons**: **Shadcn UI** component primitives (Radix UI) + Lucide Icons (`lucide-react`).
- **Typography Standards**: `Plus Jakarta Sans` (Headings), `Inter` (Body & UI controls), `JetBrains Mono` (Merge tags & Code). See details in [`03_Design/UI_UX/Typography_And_Design_System.md`](file:///d:/email%20marketing%20tool/03_Design/UI_UX/Typography_And_Design_System.md).
- **Security & Deliverability Specs**: See [`03_Design/Security_And_Compliance/Domain_Verification_And_Deliverability_Spec.md`](file:///d:/email%20marketing%20tool/03_Design/Security_And_Compliance/Domain_Verification_And_Deliverability_Spec.md).
- **Backend / Delivery Engine**: Node.js API handlers with AWS SDK (`@aws-sdk/client-sns`).
- **Data Persistence**: Local store for users, workspace settings, DNS verification records, contacts, and campaigns.
