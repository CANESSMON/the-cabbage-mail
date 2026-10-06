# ⚙️ System Requirements Specification (SRS) - The Cabbage Mail

## 1. Executive Summary & Architecture Paradigm
The Cabbage Mail is an enterprise-grade multi-tenant email marketing platform built on a decoupled architecture:
- **Frontend**: React + Vite + Tailwind CSS + Shadcn UI
- **Backend API**: Node.js + TypeScript + Express.js REST API
- **Database Layer**: PostgreSQL database with Prisma ORM
- **Cloud Infrastructure**: AWS Simple Notification Service (SNS) / Simple Email Service (SES)

---

## 2. Functional Requirements

### FR-0: User Authentication, JWT & Workspace Provisioning
- **FR-0.1 (Self-Service Signup)**: Public registration endpoint accepting Name, Email, Password, and Organization Name.
- **FR-0.2 (Password Security)**: Passwords hashed with `bcryptjs` (salt round >= 10).
- **FR-0.3 (JWT Authorization)**: Secure HTTP Bearer token issuance with role-based claims (`Owner`, `Admin`, `Editor`, `Viewer`).
- **FR-0.4 (Multi-Tenant Workspace)**: Auto-provisioning of primary workspace and isolated database records.

### FR-1: Domain Authentication & DNS Audit (SPF, DKIM, DMARC)
- **FR-1.1 (DNS Challenge)**: Node.js server executes asynchronous DNS TXT / CNAME lookups using native `dns.promises` API.
- **FR-1.2 (SPF & DKIM Audit)**: Verification of `v=spf1` policies, 3 CNAME DKIM selectors, and `v=DMARC1` record compliance.
- **FR-1.3 (AWS SES Identity Status)**: Webhook/API check of AWS SES identity verification state (`Pending`, `Success`, `Failed`).

### FR-2: Campaign Composition & Pre-Send Hygiene Engine
- **FR-2.1 (Campaign Engine)**: HTML block editor rendering, variable merge tag substitution (`{{first_name}}`, `{{unsubscribe_link}}`).
- **FR-2.2 (Deliverability Guard)**: Automated pre-send spam keyword scoring, disposable domain filtering (`@tempmail.com`), and CAN-SPAM compliance check before queueing.
- **FR-2.3 (AWS SNS Dispatch)**: Bulk dispatch of queued messages to AWS SNS topics using `@aws-sdk/client-sns`.

### FR-3: Audience Segmentation & Automations
- **FR-3.1 (Dynamic Segments)**: Rule-based evaluation engine for subscriber tags, domain patterns, and engagement scores.
- **FR-3.2 (Automation Workflow State)**: Node-based automation state execution engine tracking subscriber progress across trigger, action, delay, and condition nodes.

### FR-4: Developer API & Security Governance
- **FR-4.1 (Scoped API Keys)**: Generation and revocation of API keys with granular scopes (`subscribers.write`, `campaigns.send`, `analytics.read`).
- **FR-4.2 (Audit Logging)**: System event tracking logging actor IP, timestamp, action type, and status to `AuditLog` database table.

---

## 3. Database & System Non-Functional Requirements (NFR)
- **NFR-1 (Database Integrity)**: Foreign key constraints, cascade rules, and indexing on `workspace_id`, `email`, and `created_at` fields.
- **NFR-2 (API Throughput)**: Sub-100ms response time for core CRUD endpoints.
- **NFR-3 (Multi-Tenant Isolation)**: All Prisma query calls scoped strictly by `workspaceId`.
