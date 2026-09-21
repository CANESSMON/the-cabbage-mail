# 📄 Business Requirements Document (BRD) - The Cabbage Mail

## 1. Executive Summary
**The Cabbage Mail** is a minimal, lightweight, multi-tenant Email Marketing Application. It aims to empower agency owners and business administrators to onboard multiple clients, manage distinct subscriber lists, compose campaigns, and dispatch bulk emails using AWS SNS/SES cloud infrastructure rather than maintaining custom email server infrastructure.

---

## 2. Business Objectives
- **Simplicity & Ease of Use**: Provide a clean, minimal interface requiring zero technical overhead for client onboarding and campaign launching.
- **Multi-Tenant Client Onboarding**: Enable management of multiple client accounts under a single admin application with strict data isolation.
- **Cost-Effective Infrastructure**: Leverage Amazon Web Services (AWS SNS/SES) for delivery and notification management instead of running dedicated SMTP servers.
- **Scalability**: Seamlessly scale delivery volume on-demand via cloud delivery channels.

---

## 3. Scope of Project

### 3.1 In Scope (Phase 1)
- Multi-client onboarding & account management.
- Subscriber list creation and CSV import per client.
- Email campaign creation (Rich text / HTML editor).
- AWS SNS / SES integration for email delivery and delivery notification hooks.
- Campaign dispatch status tracking (Sent, Failed, Pending).

### 3.2 Out of Scope (Phase 1)
- Complex multi-step automated drip funnels (planned for Phase 2).
- Native A/B testing (planned for Phase 2).
- Dedicated IP warming workflows (handled directly via AWS).

---

## 4. Key Stakeholders
- **System Admin / Agency Owner**: Onboards client accounts, manages AWS credentials/settings, views global usage.
- **Clients**: Manage subscriber lists, create campaigns, view campaign delivery stats.
