# 🏗️ High-Level Design (HLD) - The Cabbage Mail

## 1. System Architecture Overview

```
 +-------------------------------------------------------------------+
 |                       The Cabbage Mail Web App                    |
 |                                                                   |
 |  +-----------------------+  +-------------------+  +-----------+  |
 |  | Auth & Self-Service   |  | Campaign & List   |  | Delivery  |  |
 |  | Registration Module   |  | Engine            |  | Queue     |  |
 |  +-----------+-----------+  +---------+---------+  +-----+-----+  |
 +--------------|------------------------|------------------|--------+
                |                        |                  |
                v                        v                  v
 +-------------------------------------------------------------------+
 |                        Database / Storage                         |
 |  (Users | Workspaces | Subscriber Lists | Campaigns | AWS Configs)|
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

1. **Self-Service Authentication & Tenant Module**: Manages user registration (Sign Up / Sign In), workspace creation, session security, and client profiles.
2. **Subscriber & List Module**: Manages contact lists, tags, and subscriber statuses (Active, Unsubscribed, Bounced).
3. **Campaign Composition Module**: Rich text template editor, merge tags (`{{first_name}}`), and email preview engine.
4. **AWS Delivery Adapter**: Integrates AWS SDK for dispatching notifications/emails via AWS SNS/SES topics.
5. **Analytics & Dashboard Module**: Displays delivery stats, active contact counts, and campaign history per user account.

---

## 3. Technology Stack Selection (Minimalist & Modern)
- **Frontend Framework**: React + Vite + Tailwind CSS.
- **UI Components & Icons**: **Shadcn UI** component primitives (Radix UI) + Lucide Icons (`lucide-react`).
- **Typography Standards**: `Plus Jakarta Sans` (Headings), `Inter` (Body & UI controls), `JetBrains Mono` (Merge tags & Code). See details in [`03_Design/UI_UX/Typography_And_Design_System.md`](file:///d:/email%20marketing%20tool/03_Design/UI_UX/Typography_And_Design_System.md).
- **Backend / Delivery Engine**: Node.js API handlers with AWS SDK (`@aws-sdk/client-sns`).
- **Data Persistence**: Local store for users, workspace settings, contacts, and campaigns.
