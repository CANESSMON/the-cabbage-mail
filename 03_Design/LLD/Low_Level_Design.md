# 🛠️ Low-Level Design (LLD) — The Cabbage Mail Backend

## 1. Directory Structure (`backend/`)

```
backend/
├── prisma/
│   └── schema.prisma           # Prisma DB models & PostgreSQL connector
├── src/
│   ├── config/
│   │   ├── env.ts              # Zod environment variable parsing
│   │   └── prisma.ts           # Prisma Singleton client instance
│   ├── controllers/
│   │   ├── authController.ts   # Registration & Login endpoints
│   │   ├── domainController.ts # Live DNS audit controller
│   │   ├── campaignController.ts# Campaign creation & send handler
│   │   └── subscriberController.ts # Contact CRUD & bulk import
│   ├── middleware/
│   │   ├── authMiddleware.ts   # JWT validation & workspace context
│   │   └── errorMiddleware.ts  # Global exception handling
│   ├── services/
│   │   ├── awsSnsService.ts    # AWS SDK SNS email adapter
│   │   ├── dnsVerification.ts  # Native node:dns resolver
│   │   └── spamEngine.ts       # Deliverability & Spam scoring
│   ├── types/
│   │   └── express.d.ts        # Custom Express Request typing
│   └── server.ts               # Express app bootstrap
├── package.json
└── tsconfig.json
```

---

## 2. Design Patterns Implemented

1. **Repository & ORM Pattern**: Prisma Client acts as type-safe data mapper preventing SQL injection and standardizing CRUD transactions.
2. **Adapter Pattern (`awsSnsService.ts`)**: Decouples email sending logic from AWS SDK specifics so alternative providers (AWS SES, SendGrid, Mailgun) can be swapped seamlessly.
3. **Strategy Pattern (`spamEngine.ts`)**: Combines syntax validation, disposable domain lookup, and heuristic subject/body spam analysis into a unified pre-send pipeline.
4. **Middleware Chain**: Express route pipeline: `JWT Auth Guard` → `Zod Payload Validation` → `Workspace Scoping` → `Controller Handler`.
