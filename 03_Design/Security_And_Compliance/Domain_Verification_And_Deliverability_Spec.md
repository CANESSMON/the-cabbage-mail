# 🔐 Domain Authentication, Verification & Deliverability System Architecture

## 1. Enterprise Trust & Deliverability Workflow

To ensure high sender reputation and prevent platform abuse by spam senders, **The Cabbage Mail** implements a multi-stage Verification & Trust Pipeline before allowing high-volume email campaigns:

```
 [ Client Registration ]
            │
            ▼
 ┌────────────────────────────────────────────────────────┐
 │ 1. Business Profile & KYC Verification                 │
 │    - Website URL & Company Industry                    │
 │    - Physical Postal Address (CAN-SPAM compliance)     │
 │    - Anti-Spam Opt-In Agreement                        │
 └──────────────────────────┬─────────────────────────────┘
                            │
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │ 2. Domain Authentication & DNS Verification            │
 │    - TXT Challenge Record Verification                 │
 │    - 3 CNAME DKIM Key Records (AWS SES signing)        │
 │    - SPF Record Audit (v=spf1 include:amazonses.com)   │
 │    - DMARC Record Audit (v=DMARC1; p=quarantine/reject)│
 └──────────────────────────┬─────────────────────────────┘
                            │
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │ 3. Pre-Send Spam & List Hygiene Engine                 │
 │    - Disposable / Temporary Email Cleaner              │
 │    - Spam Trigger Word Analyzer (Score 0-100)          │
 │    - Mandatory Unsubscribe Link & Address Check        │
 └──────────────────────────┬─────────────────────────────┘
                            │
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │ 4. Account Status & Volume Tiering                     │
 │    - SANDBOX: Verified domains/emails, 200/day limit   │
 │    - PRODUCTION: Full volume quota via AWS SNS/SES     │
 │    - PAUSED: Triggered if Bounce > 5% or Complaints >0.1%│
 └────────────────────────────────────────────────────────┘
```

---

## 2. DNS Record Specifications for Client Domain Verification

| Record Type | Host / Name | Expected Value Format | Purpose | Required Status |
|---|---|---|---|---|
| **TXT** | `_cabbage-verify.yourdomain.com` | `cabbage-verify-domain=txt_7a9f...` | Domain ownership challenge | **Required** |
| **CNAME 1** | `resend1._domainkey.yourdomain.com` | `resend1.dkim.amazonses.com` | DKIM Key 1 Signing | **Required** |
| **CNAME 2** | `resend2._domainkey.yourdomain.com` | `resend2.dkim.amazonses.com` | DKIM Key 2 Signing | **Required** |
| **CNAME 3** | `resend3._domainkey.yourdomain.com` | `resend3.dkim.amazonses.com` | DKIM Key 3 Signing | **Required** |
| **TXT (SPF)** | `@` or `yourdomain.com` | `v=spf1 include:amazonses.com ~all` | Sender Policy Framework | **Required** |
| **TXT (DMARC)**| `_dmarc.yourdomain.com` | `v=DMARC1; p=quarantine; rua=mailto:...` | DMARC Policy | Recommended |

---

## 3. Pre-Send Pre-Flight Inspection Criteria

Before any campaign is published to AWS SNS:
1. **List Hygiene Inspection**:
   - Rejects disposable email domains (`mailinator.com`, `tempmail.com`, `guerrillamail.com`, `10minutemail.com`).
   - Flags role accounts (`admin@`, `support@`, `info@`, `sales@`) for review.
2. **Spam Content Score**:
   - Calculates spam score (0-100). If score > 35, blocks dispatch with actionable warnings.
   - Evaluates subject line capitalization, spam triggers ("100% FREE", "MAKE MONEY FAST", "ACT NOW", "NO COST", "$$$").
3. **CAN-SPAM Legal Enforcer**:
   - Verifies inclusion of `{{unsubscribe_link}}` or `<a href="...">Unsubscribe</a>`.
   - Verifies presence of Client Physical Address in template footer.
