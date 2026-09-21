# 📄 Business Requirements Document (BRD) - The Cabbage Mail

## 1. Executive Summary
**The Cabbage Mail** is a modern, self-service multi-tenant Email Marketing SaaS Application. It allows business users and clients to **sign up by themselves**, create their workspace, manage subscriber lists, build email campaigns, and dispatch bulk emails using AWS SNS/SES cloud infrastructure rather than maintaining custom mail server infrastructure.

---

## 2. Business Objectives
- **Self-Service Onboarding**: Enable any client or business user to register an account independently, set up their organization, and immediately start using the tool.
- **Simplicity & Ease of Use**: Provide a clean, minimal interface requiring zero technical background.
- **Multi-Tenant Workspace Isolation**: Ensure strict data isolation between registered user accounts (subscriber lists, campaigns, templates, credentials).
- **Cost-Effective Infrastructure**: Leverage Amazon Web Services (AWS SNS/SES) for delivery and notification management instead of running dedicated SMTP servers.
- **Scalability**: Seamlessly scale delivery volume on-demand via cloud delivery channels.

---

## 3. Scope of Project

### 3.1 In Scope (Phase 1)
- Self-service User Registration (Sign Up) and Authentication (Sign In / Sign Out).
- Workspace setup & sender email verification.
- Subscriber list creation and CSV contact import.
- Email campaign creation (Rich text / HTML editor with merge tags).
- AWS SNS / SES integration for email delivery and delivery notification hooks.
- Real-time campaign dispatch status tracking (Sent, Failed, Pending).

### 3.2 Out of Scope (Phase 1)
- Complex multi-step automated drip funnels (planned for Phase 2).
- Native A/B testing (planned for Phase 2).
- Paid subscription billing gateway / Stripe integration (planned for Phase 2).

---

## 4. Key Stakeholders
- **Self-Service Registered User / Client**: Registers their own account, configures sender details, imports subscriber lists, and sends email campaigns.
- **System Admin**: Oversees platform health, system logs, and global user analytics.
