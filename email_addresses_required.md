# 📧 Email Addresses Required for EmailBhejo.com

> [!IMPORTANT]
> You need **6 mandatory** emails to get started. 3 more are recommended. All can be created under your `emailbhejo.com` domain.

---

## Summary Table

| # | Email Address | Purpose | Type | Priority |
|---|--------------|---------|------|----------|
| 1 | `info@emailbhejo.com` | Business contact & AWS account email | Real Inbox | 🔴 Must Have |
| 2 | `noreply@emailbhejo.com` | Default FROM address for campaigns | Send-only | 🔴 Must Have |
| 3 | `bounce@emailbhejo.com` | Receive bounce notifications from SES | Real Inbox | 🔴 Must Have |
| 4 | `complaints@emailbhejo.com` | Receive spam complaint notifications | Real Inbox | 🔴 Must Have |
| 5 | `postmaster@emailbhejo.com` | Required by email standards (RFC 2142) | Forwarder → info@ | 🔴 Must Have |
| 6 | `abuse@emailbhejo.com` | Required by email standards (RFC 2142) | Forwarder → info@ | 🔴 Must Have |
| 7 | `dmarc@emailbhejo.com` | Receives DMARC aggregate reports | Real Inbox | 🟡 Recommended |
| 8 | `support@emailbhejo.com` | Customer support queries | Real Inbox | 🟡 Recommended |
| 9 | `admin@emailbhejo.com` | Internal admin / dev alerts | Real Inbox | 🟡 Recommended |
| 10 | `newsletter@emailbhejo.com` | Platform's own newsletter to customers | Send-only | ⚪ Optional |
| 11 | `billing@emailbhejo.com` | Payment receipts & invoices | Forwarder → info@ | ⚪ Optional |

---

## Detailed Breakdown

### 🔴 MUST HAVE (6 emails) — Create These First

---

#### 1. `info@emailbhejo.com` — Business & AWS Account

| Detail | Value |
|--------|-------|
| **Purpose** | Your main business email. Used as AWS account email, general contact |
| **Used In** | AWS Console login, domain registration contact, public-facing contact |
| **Inbox Needed?** | ✅ Yes — real inbox, you must read and reply to emails here |
| **Already Created?** | ✅ Yes (you mentioned this) |

---

#### 2. `noreply@emailbhejo.com` — Default Campaign Sender

| Detail | Value |
|--------|-------|
| **Purpose** | The FROM address on all marketing emails sent through your platform |
| **Used In** | `backend/.env` as `SES_FROM_EMAIL`, every outgoing campaign email |
| **Inbox Needed?** | ❌ No — send-only, but must be verified in SES |
| **Example Header** | `From: EmailBhejo <noreply@emailbhejo.com>` |

> [!NOTE]
> When tenants verify their own domains, campaigns will send FROM their domain (e.g., `news@their-business.com`). This `noreply@` is the **fallback** for the platform itself.

---

#### 3. `bounce@emailbhejo.com` — Bounce Handling

| Detail | Value |
|--------|-------|
| **Purpose** | Receives bounce notifications — emails that failed to deliver (invalid address, full inbox, etc.) |
| **Used In** | AWS SES → SNS Topic → Email subscription for bounce events |
| **Inbox Needed?** | ✅ Yes — you must monitor bounces to maintain sender reputation |
| **Why Critical** | AWS will **suspend your SES account** if bounce rate exceeds 5% |

---

#### 4. `complaints@emailbhejo.com` — Complaint Handling

| Detail | Value |
|--------|-------|
| **Purpose** | Receives complaint notifications — when someone marks your email as spam |
| **Used In** | AWS SES → SNS Topic → Email subscription for complaint events |
| **Inbox Needed?** | ✅ Yes — you must monitor and auto-unsubscribe complainers |
| **Why Critical** | AWS will **suspend your SES account** if complaint rate exceeds 0.1% |

> [!WARNING]
> **Bounce + Complaint monitoring is not optional.** AWS actively monitors these rates. If you ignore them, your entire SES account gets shut down — affecting ALL your tenants.

---

#### 5. `postmaster@emailbhejo.com` — Email Standards Requirement

| Detail | Value |
|--------|-------|
| **Purpose** | Required by RFC 2142 (internet email standard). ISPs and email providers expect this to exist |
| **Used In** | Email deliverability — ISPs check if this address exists |
| **Inbox Needed?** | ❌ Just set up as a forwarder → `info@emailbhejo.com` |
| **Why Critical** | Gmail, Yahoo, Outlook check this. Missing = lower trust score |

---

#### 6. `abuse@emailbhejo.com` — Abuse Reports

| Detail | Value |
|--------|-------|
| **Purpose** | Required by RFC 2142. ISPs send abuse reports here if your emails are flagged |
| **Used In** | WHOIS records, email headers, ISP abuse handling |
| **Inbox Needed?** | ❌ Just set up as a forwarder → `info@emailbhejo.com` |
| **Why Critical** | Without this, ISPs may blacklist your domain |

---

### 🟡 RECOMMENDED (3 emails) — Create These Soon

---

#### 7. `dmarc@emailbhejo.com` — DMARC Report Receiver

| Detail | Value |
|--------|-------|
| **Purpose** | Receives daily DMARC aggregate reports from email providers (Gmail, Yahoo, etc.) |
| **Used In** | Your DMARC DNS record: `v=DMARC1; p=none; rua=mailto:dmarc@emailbhejo.com` |
| **Inbox Needed?** | ✅ Yes — reports are XML files showing who's sending email from your domain |

---

#### 8. `support@emailbhejo.com` — Customer Support

| Detail | Value |
|--------|-------|
| **Purpose** | Your tenants/customers contact you for help |
| **Used In** | Website contact page, in-app help links, email footers |
| **Inbox Needed?** | ✅ Yes — real inbox for customer communication |

---

#### 9. `admin@emailbhejo.com` — Internal Admin Alerts

| Detail | Value |
|--------|-------|
| **Purpose** | Receives system alerts — server errors, high bounce rates, new signups |
| **Used In** | Backend error monitoring, cron job notifications |
| **Inbox Needed?** | ✅ Yes — or forward to your personal email |

---

### ⚪ OPTIONAL (2 emails) — Nice to Have Later

---

#### 10. `newsletter@emailbhejo.com` — Your Own Marketing

| Detail | Value |
|--------|-------|
| **Purpose** | Send YOUR platform's own newsletters to YOUR customers |
| **Inbox Needed?** | ❌ Send-only |

#### 11. `billing@emailbhejo.com` — Payment Communication

| Detail | Value |
|--------|-------|
| **Purpose** | Payment receipts, subscription reminders |
| **Inbox Needed?** | ❌ Forwarder → `info@emailbhejo.com` |

---

## 🔗 Where Each Email Goes in Config

| Email | Where It's Configured |
|-------|----------------------|
| `info@emailbhejo.com` | AWS Account, domain WHOIS, public contact |
| `noreply@emailbhejo.com` | `backend/.env` → `SES_FROM_EMAIL` |
| `bounce@emailbhejo.com` | AWS SES → Configuration Set → Bounce SNS Topic |
| `complaints@emailbhejo.com` | AWS SES → Configuration Set → Complaint SNS Topic |
| `postmaster@emailbhejo.com` | Email forwarder (no config needed) |
| `abuse@emailbhejo.com` | Email forwarder (no config needed) |
| `dmarc@emailbhejo.com` | DNS TXT record: `_dmarc.emailbhejo.com` |
| `support@emailbhejo.com` | Website footer, app help section |
| `admin@emailbhejo.com` | Backend alerting service |

---

## 🛠️ How to Create These Emails

You have two options:

### Option A: If you use a hosting provider (Hostinger, GoDaddy, etc.)
1. Go to your hosting panel → **Email Accounts**
2. Create each email address listed above
3. For forwarders (`postmaster@`, `abuse@`, `billing@`), just set up email forwarding to `info@emailbhejo.com`

### Option B: If you use Google Workspace / Zoho Mail
1. Create the main inboxes (info, bounce, complaints, support, admin, dmarc)
2. Create **aliases** or **groups** for the forwarders (postmaster, abuse, billing → forward to info@)

> [!TIP]
> **Cheapest approach**: Create only `info@` and `support@` as real inboxes, and forward ALL others to `info@`. You can always separate them later as volume grows.

---

## ✅ Action Checklist

- [ ] `info@emailbhejo.com` — Already created ✅
- [ ] `noreply@emailbhejo.com` — Create (send-only / no inbox needed)
- [ ] `bounce@emailbhejo.com` — Create (real inbox OR forward to info@)
- [ ] `complaints@emailbhejo.com` — Create (real inbox OR forward to info@)
- [ ] `postmaster@emailbhejo.com` — Create as forwarder → info@
- [ ] `abuse@emailbhejo.com` — Create as forwarder → info@
- [ ] `dmarc@emailbhejo.com` — Create (real inbox OR forward to info@)
- [ ] `support@emailbhejo.com` — Create (real inbox)
- [ ] `admin@emailbhejo.com` — Create (real inbox OR forward to info@)

---

> [!NOTE]
> **Bottom line: Create 6 email addresses right now.** You already have `info@`. You need 5 more: `noreply@`, `bounce@`, `complaints@`, `postmaster@`, `abuse@`. The rest can come later.
