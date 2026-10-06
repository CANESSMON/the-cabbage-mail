# 🏗️ High-Level Design (HLD) - The Cabbage Mail

## 1. Complete System Architecture

```
                                  +---------------------------------------+
                                  |         React Single Page App         |
                                  |     (Vite + Tailwind + Shadcn UI)     |
                                  +-------------------+-------------------+
                                                      |
                                                      | HTTPS / REST API
                                                      v
                                  +---------------------------------------+
                                  |      Node.js + TypeScript REST API    |
                                  |            (Express.js)               |
                                  |                                       |
                                  |  +-----------------+ +-------------+  |
                                  |  | Auth Middleware | | DNS Auditing|  |
                                  |  |   (JWT Guard)   | |  (SPF/DKIM) |  |
                                  |  +--------+--------+ +------+------+  |
                                  |           |                 |         |
                                  |  +--------v--------+ +------v------+  |
                                  |  |  Pre-Send Guard | | Campaign    |  |
                                  |  |  Spam Scoring   | | Dispatcher  |  |
                                  |  +-----------------+ +-------------+  |
                                  +---------+-------------------+---------+
                                            |                   |
                     Database Queries       |                   | AWS SNS SDK
                      (Prisma Client)       v                   v
+--------------------------------------------------+  +----------------------------------+
|               PostgreSQL Database                |  |        AWS Cloud Infrastructure  |
|                                                  |  |                                  |
| (Users, Workspaces, Domains, Subscribers,        |  |  +----------------------------+  |
|  Campaigns, Automations, Forms, API Keys, Logs)  |  |  |   Amazon SNS / SES Topics  |  |
+--------------------------------------------------+  |  +--------------+-------------+  |
                                                      +-----------------|----------------+
                                                                        |
                                                                        v
                                                      +----------------------------------+
                                                      |        Recipient Inboxes         |
                                                      +----------------------------------+
```

---

## 2. Core Service Components

1. **Authentication & Identity Service**: Handles user registration, password hashing (`bcrypt`), JWT token generation, and tenant middleware.
2. **Domain & DNS Resolver Service**: Asynchronously audits DNS TXT/CNAME records using Node.js native `dns.promises` to verify SPF, DKIM, and DMARC setups.
3. **Pre-Send Hygiene Engine**: Evaluates subscriber syntax, filters disposable email domains, and scores HTML campaign bodies against spam filters.
4. **Campaign & Dispatch Service**: Manages campaign drafts, schedules, recipient list resolution, and AWS SNS payload generation.
5. **Automation & Sequence Engine**: Executes node graph workflows, handling triggers, delay timers, and action nodes.
6. **Data Access Layer (Prisma ORM)**: Type-safe access layer connected to PostgreSQL with connection pooling.

---

## 3. Technology Stack Specification

| Tier | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Shadcn UI, Lucide Icons | Responsive Client Web App |
| **Backend API** | Node.js, Express, TypeScript, Zod | Type-safe REST API Server |
| **Database** | PostgreSQL | Relational Multi-Tenant Storage |
| **ORM** | Prisma ORM | Schema migrations & type-safe DB client |
| **Infrastructure** | AWS SNS / SES (`@aws-sdk/client-sns`) | Enterprise Email Dispatch |
| **Security** | JWT (`jsonwebtoken`), Bcrypt (`bcryptjs`), Cors | Authentication & Data Hygiene |
