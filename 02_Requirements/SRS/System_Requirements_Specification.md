# ⚙️ System Requirements Specification (SRS) - The Cabbage Mail

## 1. Functional Requirements

### FR-0: User Authentication & Self-Service Registration
- **FR-0.1**: Users can register independently by submitting Full Name, Business Email, Password, and Organization Name.
- **FR-0.2**: Users can log in securely using Email and Password, and log out of active sessions.
- **FR-0.3**: Automatic provisioning of an isolated workspace upon successful registration.
- **FR-0.4**: Session state persistence and protected router navigation.

### FR-1: Workspace & Sender Settings
- **FR-1.1**: User can configure their default Sender Name, Sender Email, and Reply-To Address.
- **FR-1.2**: User can configure AWS SNS / SES credentials or API connection parameters for their workspace.
- **FR-1.3**: Support for updating account profile and organization details.

### FR-2: Subscriber & List Management
- **FR-2.1**: Support creating multiple contact lists per user workspace.
- **FR-2.2**: Allow CSV batch import of subscribers with fields: Email, First Name, Last Name, Custom Tags.
- **FR-2.3**: Allow single subscriber manual add/delete/unsubscribe.

### FR-3: Campaign & Email Builder
- **FR-3.1**: Minimalistic WYSIWYG / HTML email editor.
- **FR-3.2**: Ability to save draft campaigns and select target subscriber list.
- **FR-3.3**: Personalization merge tags (e.g., `{{first_name}}`, `{{unsubscribe_link}}`).

### FR-4: AWS SNS / Cloud Infrastructure Integration
- **FR-4.1**: Integration with AWS SNS (Simple Notification Service) / SES for email message dispatching.
- **FR-4.2**: Handling bounce and complaint notification events via webhooks/topics.
- **FR-4.3**: Environment variable / secure key configuration for AWS credentials.

---

### 🛡️ Enterprise Trust, Compliance & Verification Requirements

### FR-5: Domain & Identity Verification (SPF, DKIM, DMARC, MX)
- **FR-5.1 (TXT Challenge)**: Generate a unique verification token (`cabbage-verify-domain=txt_...`) for clients to publish in DNS.
- **FR-5.2 (DKIM CNAME Check)**: Provide 3 CNAME DKIM keys for AWS SES domain signing and check live DNS propagation.
- **FR-5.3 (SPF & DMARC)**: Audit client DNS for valid `v=spf1` and `v=DMARC1` policies prior to granting production sending rights.
- **FR-5.4 (SES Identity Verification)**: Query AWS SES identity status (`PendingVerification`, `Success`, `Failed`).

### FR-6: Client Business Vetting & KYC Onboarding
- **FR-6.1 (Business Profile)**: Collect Website URL, Company Industry, Physical Postal Address (CAN-SPAM required), and Target Monthly Email Volume.
- **FR-6.2 (Anti-Spam Policy Declaration)**: Require explicit agreement prohibiting purchased, rented, or scraped contact lists.
- **FR-6.3 (Account Status Pipeline)**: Enforce sending restrictions based on status:
  - `SANDBOX` (Max 200 emails/day, verified recipient addresses only).
  - `PENDING_REVIEW` (Under manual/automated domain review).
  - `VERIFIED_PRODUCTION` (Full sending quota enabled).
  - `PAUSED_RISK` (Auto-suspended due to high bounce/complaint rates).

### FR-7: Pre-Send Campaign Spam & Hygiene Engine
- **FR-7.1 (List Hygiene)**: Automatically flag & reject invalid syntax emails, temporary/disposable domains (`@mailinator.com`, `@tempmail.com`), and role accounts (`admin@`, `support@`).
- **FR-7.2 (Spam Content Score)**: Scan campaign subject lines and HTML for high-risk spam triggers (e.g. ALL CAPS, "100% FREE", "ACT NOW", excessive dollar signs `$$$`).
- **FR-7.3 (Compliance Enforcer)**: Block dispatch if `{{unsubscribe_link}}` or physical sender address is missing from email body.

---

## 2. Non-Functional Requirements
- **NFR-1 (Performance)**: Fast page load (<1.5s) and responsive UI.
- **NFR-2 (Security)**: Password hashing, encrypted storage of tokens/keys, strict tenant data isolation.
- **NFR-3 (Usability)**: Intuitive self-service flow with step-by-step onboarding wizard.
- **NFR-4 (Reliability & Deliverability Guardrails)**: Asynchronous queue processing; auto-pause workspace if bounce rate > 5% or complaint rate > 0.1%.
