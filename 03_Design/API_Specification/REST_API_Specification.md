# 🔌 REST API Specification — The Cabbage Mail

Base URL: `http://localhost:4000/api/v1`  
Authentication: `Authorization: Bearer <JWT_TOKEN>` or `Authorization: Bearer cbm_live_<API_KEY>`

---

## 1. Authentication Endpoints

### `POST /auth/register`
- **Description**: Register a new user and provision default workspace.
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@acme.com",
  "password": "Password123!",
  "organizationName": "Acme Corp"
}
```
- **Response (201 Created)**:
```json
{
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": { "id": "usr_101", "email": "jane@acme.com", "name": "Jane Doe" },
  "workspace": { "id": "wsp_101", "name": "Acme Corp" }
}
```

### `POST /auth/login`
- **Description**: Authenticate existing user and issue JWT.
- **Request Body**: `{ "email": "jane@acme.com", "password": "Password123!" }`
- **Response (200 OK)**: `{ "token": "...", "user": {...} }`

---

## 2. Domain & DNS Verification Endpoints

### `GET /domains`
- **Description**: List verified and pending domains for current workspace.

### `POST /domains/verify-dns`
- **Description**: Perform live DNS query for SPF, DKIM, and DMARC TXT/CNAME records.
- **Request Body**: `{ "domain": "acme.com" }`
- **Response (200 OK)**:
```json
{
  "domain": "acme.com",
  "spf": { "valid": true, "record": "v=spf1 include:amazonses.com ~all" },
  "dkim": { "valid": true, "selector": "cabbage1._domainkey.acme.com" },
  "dmarc": { "valid": true, "policy": "reject" },
  "isVerified": true
}
```

---

## 3. Subscriber Endpoints

### `GET /subscribers`
- **Description**: List subscribers with pagination, search, and tag filters.

### `POST /subscribers`
- **Description**: Add subscriber.
- **Request Body**: `{ "email": "client@example.com", "firstName": "John", "tags": ["vip"] }`

### `POST /subscribers/batch`
- **Description**: Bulk CSV import.

---

## 4. Campaign & Dispatch Endpoints

### `POST /campaigns`
- **Description**: Create new campaign draft.

### `POST /campaigns/:id/send`
- **Description**: Execute pre-send hygiene checks and dispatch campaign via AWS SNS.
- **Response (200 OK)**:
```json
{
  "campaignId": "cmp_901",
  "status": "SENDING",
  "totalRecipients": 2450,
  "spamScore": 98.5
}
```

---

## 5. Automations, Forms, API Keys & Audit Endpoints

- `GET /automations`, `POST /automations` — Manage drip sequences.
- `GET /forms`, `POST /forms` — Embedded form snippets.
- `GET /api-keys`, `POST /api-keys` — Manage integration keys.
- `GET /audit-logs` — System event activity stream.
