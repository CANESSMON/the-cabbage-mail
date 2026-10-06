# 🥬 The Cabbage Mail — Full Stack Email Marketing Platform

**The Cabbage Mail** is a complete email marketing platform built for client onboarding, domain verification, email campaigns, drag-and-drop templates, automation flows, and analytics.

---

## 🏗️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Shadcn UI (`http://localhost:3000`)
- **Backend API**: Node.js + TypeScript + Express (`http://localhost:4000/api/v1`)
- **Database Layer**: PostgreSQL + Prisma ORM
- **Email Delivery**: Dynamic Provider Switch (**Gmail / Universal SMTP**, **AWS SNS / SES**, or **Mock Mode**)

---

## 📁 Project Folder Structure

All documentation and source code are organized cleanly:

```
email-marketing-tool/
├── 01_Contract_And_Commercial/  # Commercial agreement & SOW
├── 02_Requirements/             # SRS, BRD & User Stories
├── 03_Design/                   # High-Level Design, Low-Level Design, DB Schema & API Specs
├── 04_Project_Management/       # Project Plan & Status Reports
├── 05_Development/              # Technical & Architecture Notes
├── 06_QA_And_Testing/           # Test Cases & Validation Reports
├── 07_Release_And_Deployment/   # Release Notes & Deployment Guide
├── 08_Handover_And_Support/     # User Guide & Operations Manual
├── backend/                     # Node.js + TypeScript REST API Server & Prisma Schema
└── src/                         # React Web App Source Code
```

---

## 🚀 How to Run the Project

### 1. Start the Frontend Web App
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 2. Start the Backend API Server
```bash
cd backend
npm start
```
Runs the API server on **`http://localhost:4000/api/v1`**.

---

## ⚙️ How to Change Email Provider

Open `backend/.env` and set `EMAIL_PROVIDER`:

- `EMAIL_PROVIDER=SMTP` → Sends via Gmail / SMTP (`smtp.gmail.com`)
- `EMAIL_PROVIDER=AWS` → Sends via AWS Cloud Infrastructure
- `EMAIL_PROVIDER=MOCK` → Instant testing without credentials
