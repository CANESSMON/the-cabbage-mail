# 🚀 Simple Deployment & Setup Guide — The Cabbage Mail

## 1. Quick Requirements
- **Node.js** (v18 or higher)
- **PostgreSQL Database** (Installed locally or hosted on Supabase / Render / AWS RDS)

---

## 2. Environment Variables Setup (`backend/.env`)

Copy `backend/.env.example` to `backend/.env`:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cabbagemail?schema=public
JWT_SECRET=your_custom_secret_key_here
EMAIL_PROVIDER=SMTP

# Gmail Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_google_app_password
SMTP_FROM=The Cabbage Mail <your_email@gmail.com>
```

---

## 3. Running the System

1. **Database Migration**:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

2. **Start Backend Server**:
   ```bash
   npm start
   ```
   *(Backend starts at `http://localhost:4000/api/v1`)*

3. **Start Frontend App**:
   ```bash
   # In project root folder
   npm run dev
   ```
   *(Frontend starts at `http://localhost:3000`)*
