# 📖 Simple User Guide — The Cabbage Mail

Welcome to **The Cabbage Mail**! Here is a simple guide on how to use every feature in your tool.

---

## 1. Workspaces & Clients
- Use the **Top Left Dropdown** in the sidebar to switch between client accounts (e.g. *Acme Corp*, *CyberDyne*).
- Each workspace keeps contacts, campaigns, and settings completely separate.

---

## 2. Onboarding & Verifying a Domain
1. Go to **Settings > Domain Verification**.
2. Enter your domain name (e.g. `company.com`).
3. Add the generated **TXT & CNAME records** into your DNS provider (Cloudflare, GoDaddy, Namecheap).
4. Click **Verify DNS Records** to perform a live check.

---

## 3. Creating & Sending Email Campaigns
1. Go to **Campaigns > Create New Campaign**.
2. Write your Subject Line and choose your Audience Segment.
3. Use the **Drag-and-Drop Editor** or choose a pre-built template from the **Template Gallery**.
4. The system runs a **Pre-Send Deliverability Guard** to check for spam words before sending.

---

## 4. Automation Workflows & Signup Forms
- **Automations**: Build visual welcome sequences and drip flows with trigger and delay nodes.
- **Signup Forms**: Customize form colors and copy the generated `<script>` code to embed on your website.

---

## 5. Changing Email Delivery Provider
Open `backend/.env` and change `EMAIL_PROVIDER`:
- `EMAIL_PROVIDER=SMTP` → Sends via Gmail/SMTP.
- `EMAIL_PROVIDER=AWS` → Sends via AWS Cloud.
- `EMAIL_PROVIDER=MOCK` → Testing mode without credentials.
