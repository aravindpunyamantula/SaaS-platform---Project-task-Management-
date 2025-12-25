# 🧩 Multi-Tenant SaaS Platform – Project & Task Management

A **production-ready multi-tenant SaaS backend** that enables multiple organizations to independently manage users, projects, and tasks with **strict data isolation**, **role-based access control**, and **subscription limits**.

The system is designed with scalability, security, and maintainability in mind and follows industry-standard REST API practices.

---

## 🚀 Features

- 🔐 JWT-based authentication (24-hour expiry)
- 🏢 Multi-tenant architecture with strict tenant isolation
- 👥 Role-based access control (Super Admin, Tenant Admin, User)
- 📦 Subscription plans with enforced limits
- 📁 Project management
- ✅ Task management with assignment & status tracking
- 🧾 Audit logging for critical actions
- 🐳 Fully Dockerized backend & database
- 🩺 Health check endpoint
- 📑 Consistent API response structure
- ⚙️ Automatic database migrations & seed data

---

## 🧱 Technology Stack

### Backend

- **Node.js (18+)**
- **Express.js**
- **PostgreSQL 15**
- **JWT** for authentication
- **bcrypt** for password hashing

### Frontend

> 🚧 **Frontend will be added later**
> Space reserved for React-based UI with protected routes and role-based rendering.

### DevOps

- **Docker**
- **Docker Compose**

---

## 🏗️ Architecture Overview

### Multi-Tenant Model

- Shared database with shared schema
- Tenant isolation enforced using `tenant_id`
- Super Admin users have `tenant_id = NULL`
- Authorization and tenant filtering enforced at API level

### Key Principles

- Never trust client-provided `tenant_id`
- Always derive tenant context from JWT
- All tenant-bound queries are filtered automatically

---

## 📁 Project Structure

```
saas-platform/
│
├── backend/
│   ├── src/
│   │   ├── controllers/     # API business logic
│   │   ├── middleware/      # Auth, RBAC, tenant isolation
│   │   ├── routes/          # API routes
│   │   ├── utils/           # JWT, password helpers
│   │   └── config/          # DB & app config
│   │
│   ├── migrations/          # SQL migrations
│   ├── seeds/               # Seed data
│   ├── Dockerfile
│   └── server.js
│
├── frontend/
│   └── (to be implemented)
│
├── docs/
│   ├── API.md               # Full API documentation
│   ├── architecture.md
│   ├── research.md
│   └── PRD.md
│
├── docker-compose.yml
├── submission.json
└── README.md
```

---

## 🐳 Docker Setup

### One-Command Startup

```bash
docker-compose up -d
```

This automatically:

- Starts PostgreSQL
- Runs database migrations
- Loads seed data
- Starts backend API

---

## 🔌 Service Ports

| Service     | URL                     |
| ----------- | ----------------------- |
| Database    | `localhost:5432`        |
| Backend API | `http://localhost:5000` |
| Frontend    | _(to be added)_         |

---

## 🩺 Health Check

```
GET /api/health
```

**Success Response**

```json
{
  "status": "ok",
  "database": "connected"
}
```

This endpoint is used to verify:

- API server is running
- Database is connected
- Migrations & seed data have completed

---

## 🔐 Authentication

- JWT-based authentication
- Token expiry: **24 hours**
- Required header:

```
Authorization: Bearer <JWT_TOKEN>
```

### JWT Payload

```json
{
  "userId": "uuid",
  "tenantId": "uuid | null",
  "role": "super_admin | tenant_admin | user"
}
```

---

## 🧪 Seed Data (Development / Testing)

Seed data is automatically loaded at startup.

### Super Admin

```
Email: superadmin@system.com
Password: Admin@123
Role: super_admin
```

### Demo Tenant

```
Subdomain: demo
Plan: pro
```

**Tenant Admin**

```
admin@demo.com / Demo@123
```

**Users**

```
user1@demo.com / User@123
user2@demo.com / User@123
```

---

## 📑 API Documentation

All APIs are fully documented in:

```
docs/API.md
```

Includes:

- Authentication APIs
- Tenant management
- User management
- Project management
- Task management
- Request & response examples
- Error formats

---

## 📦 Subscription Plans

| Plan       | Max Users | Max Projects |
| ---------- | --------- | ------------ |
| Free       | 5         | 3            |
| Pro        | 25        | 15           |
| Enterprise | 100       | 50           |

Limits are enforced **before resource creation**.

---

## 🧾 Audit Logging

The system logs all important actions:

- User creation, update, deletion
- Project creation, update, deletion
- Task creation, update, deletion
- Tenant updates

Stored in the `audit_logs` table for traceability.

---

## 🛡️ Security Highlights

- Passwords hashed using bcrypt
- JWT signature & expiry validation
- Role-based authorization middleware
- Tenant isolation enforced at query level
- No sensitive data stored in JWT
- Automatic rejection of cross-tenant access

---

## 🚧 Frontend (Planned)

The frontend will include:

- Registration & login pages
- Dashboard
- Projects & tasks UI
- User management
- Role-based navigation
- Responsive design

_(Implementation will be added in a future phase.)_

---
