# 🏗️ High-Level Design (HLD) - The Cabbage Mail

## 1. System Architecture Overview

```
 +-------------------------------------------------------------------+
 |                       The Cabbage Mail Web App                    |
 |                                                                   |
 |  +--------------------+   +-------------------+  +-------------+  |
 |  | Client Workspace   |   | Campaign & List   |  | Delivery    |  |
 |  | Manager            |   | Engine            |  | Queue       |  |
 |  +---------+----------+   +---------+---------+  +------+------+  |
 +------------|------------------------|-------------------|---------+
              |                        |                   |
              v                        v                   v
 +-------------------------------------------------------------------+
 |                        Database / Storage                         |
 |  (Clients | Subscriber Lists | Campaigns | AWS Configs)           |
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

1. **Client & Tenant Module**: Manages client profiles, default sender addresses, and credentials.
2. **Subscriber & List Module**: Manages audiences, tags, status (Active, Unsubscribed, Bounced).
3. **Campaign Composition Module**: Rich text template editor, merge tags, preview engine.
4. **AWS Delivery Adapter**: Integrates AWS SDK for dispatching notifications/emails via AWS SNS/SES topics.
5. **Analytics & Status Module**: Tracks delivery stats per campaign.

---

## 3. Technology Stack Selection (Minimalist & Modern)
- **Frontend Framework**: React + Vite + Tailwind CSS.
- **UI Components & Icons**: **Shadcn UI** component primitives (Radix UI) + Lucide Icons (`lucide-react`).
- **Typography Standards**: `Plus Jakarta Sans` (Headings), `Inter` (Body & UI controls), `JetBrains Mono` (Merge tags & Code). See details in [`03_Design/UI_UX/Typography_And_Design_System.md`](file:///d:/email%20marketing%20tool/03_Design/UI_UX/Typography_And_Design_System.md).
- **Backend / Delivery Engine**: Node.js API handlers with AWS SDK (`@aws-sdk/client-sns`).
- **Data Persistence**: Lightweight local JSON/SQLite store for managing client workspaces, contacts, and campaigns.
