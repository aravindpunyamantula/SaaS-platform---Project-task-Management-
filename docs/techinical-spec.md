# Technical Specification

Multi-Tenant SaaS Platform – Project & Task Management

---

## 1. Purpose

This document defines the **technical design, project structure, setup process, and implementation details** of the Multi-Tenant SaaS Platform. It serves as a reference for developers, reviewers, and future maintainers to understand how the system is built and how its components interact.

---

## 2. Technology Stack

### Backend

* **Runtime:** Node.js (v18+)
* **Framework:** Express.js
* **Database:** PostgreSQL 15
* **Authentication:** JSON Web Tokens (JWT)
* **Password Hashing:** bcrypt
* **Validation:** Custom middleware (extensible to Joi/express-validator)

### Frontend (Planned)

* React.js
* Context / Redux for state management
* Role-based UI rendering
* Protected routes

### DevOps

* Docker
* Docker Compose

---

## 3. Architecture Overview

### Multi-Tenancy Strategy

* **Shared database, shared schema**
* Tenant isolation enforced using `tenant_id` on all tenant-bound tables
* Super Admin users have `tenant_id = NULL`
* Tenant context is derived exclusively from JWT tokens

### Isolation Rules

* Client never sends `tenant_id`
* Backend always injects `tenant_id` from authentication middleware
* Tasks derive tenant ownership from the associated project
* Super Admin bypasses tenant filtering where allowed

---

## 4. Backend Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authCtrl.js
│   │   ├── tenantCtrl.js
│   │   ├── userCtrl.js
│   │   ├── projectCtrl.js
│   │   └── taskCtrl.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── tenantRoutes.js
│   │   ├── userRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── tenantMiddleware.js
│   │
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── password.js
│   │   └── auditLogger.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   └── app.js
│
├── migrations/
│   ├── 001_create_tenants.sql
│   ├── 002_create_users.sql
│   ├── 003_create_projects.sql
│   ├── 004_create_tasks.sql
│   └── 005_create_audit_logs.sql
│
├── seeds/
│   └── seed_data.sql
│
├── Dockerfile
├── server.js
└── package.json
```

---

## 5. Database Design

### Core Tables

* tenants
* users
* projects
* tasks
* audit_logs

### Key Constraints

* `UNIQUE (tenant_id, email)` on users
* Foreign keys with CASCADE delete where appropriate
* Indexed `tenant_id` columns for performance
* ENUM types used for role, status, priority, subscription plans

### Tenant Ownership

| Table      | Tenant Source                          |
| ---------- | -------------------------------------- |
| users      | users.tenant_id                        |
| projects   | projects.tenant_id                     |
| tasks      | tasks.tenant_id (derived from project) |
| audit_logs | audit_logs.tenant_id                   |

---

## 6. Authentication & Authorization

### JWT Payload

```json
{
  "userId": "uuid",
  "tenantId": "uuid | null",
  "role": "super_admin | tenant_admin | user"
}
```

### Authentication Flow

1. User logs in
2. JWT issued with userId, tenantId, role
3. Token validated on each request
4. Tenant context injected into request

### Authorization Rules

* Super Admin: Access to all tenants
* Tenant Admin: Full control within own tenant
* User: Limited access within own tenant

---

## 7. Subscription Management

Each tenant has a subscription plan:

| Plan       | Max Users | Max Projects |
| ---------- | --------- | ------------ |
| Free       | 5         | 3            |
| Pro        | 25        | 15           |
| Enterprise | 100       | 50           |

Enforcement:

* Checked before creating users or projects
* Rejected with HTTP 403 when limit exceeded

---

## 8. API Design Principles

* RESTful endpoints
* Consistent response format:

```json
{
  "success": true,
  "message": "optional",
  "data": {}
}
```

* Proper HTTP status codes
* Partial updates supported
* Pagination implemented for list endpoints

---

## 9. Audit Logging

All critical actions are logged:

* CREATE / UPDATE / DELETE for users, projects, tasks
* Tenant updates
* Authentication events (optional)

Stored fields:

* tenant_id
* user_id
* action
* entity_type
* entity_id
* ip_address
* timestamp

---

## 10. Docker Configuration

### Services

* database (PostgreSQL)
* backend (Express API)
* frontend (placeholder)

### Startup Behavior

* Migrations run automatically
* Seed data loaded automatically
* Health check enabled

### Health Check Endpoint

```
GET /api/health
```

Returns database and application readiness.

---

## 11. Environment Variables

### Required Variables

```
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD

JWT_SECRET
JWT_EXPIRES_IN

PORT
NODE_ENV

FRONTEND_URL
```

All variables are available via `.env` or `docker-compose.yml`.

---

## 12. Error Handling Strategy

* Centralized error handling
* Meaningful error messages
* Authorization failures return 403
* Validation failures return 400
* Resource not found returns 404

---

## 13. Future Enhancements

* Frontend implementation
* Swagger / OpenAPI documentation
* Rate limiting
* Refresh tokens
* Email notifications
* Soft deletes

---

## 14. Conclusion

This technical specification defines a **secure, scalable, and maintainable multi-tenant SaaS backend** with clear separation of concerns, strict tenant isolation, and production-ready practices. The system is designed to support growth, additional features, and frontend integration without architectural changes.

---
