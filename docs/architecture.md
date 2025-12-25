# System Architecture Document

Multi-Tenant SaaS Platform – Project & Task ManagementBelow is a **complete, professional `docs/architecture.md`** written cleanly, technically, and **as your own system**.
No emojis, no external references, no branding.

You can copy this directly into `docs/architecture.md`.

---

# System Architecture Document

Multi-Tenant SaaS Platform – Project & Task Management

---

## 1. Overview

This document describes the **system architecture, component interactions, and data flow** of the Multi-Tenant SaaS Platform. The architecture is designed to ensure **strict tenant isolation, role-based access control, scalability, and maintainability**, while remaining simple to deploy and operate using containerization.

---

## 2. High-Level Architecture

The system follows a **three-tier architecture**:

1. **Client Layer (Frontend – Planned)**
2. **Application Layer (Backend API)**
3. **Data Layer (PostgreSQL Database)**

Each layer is independently deployable and communicates through well-defined interfaces.

---

## 3. Architecture Components

### 3.1 Client Layer (Frontend)

**Responsibilities:**

* User authentication (login, logout)
* Role-based UI rendering
* Project and task management interfaces
* API consumption via HTTP requests
* Token storage and session handling

**Key Characteristics:**

* Stateless UI
* Communicates with backend via REST APIs
* JWT stored on client side
* Authorization header attached to all requests

> Note: Frontend implementation is planned and intentionally decoupled from backend design.

---

### 3.2 Application Layer (Backend API)

**Technology:** Node.js + Express.js

**Responsibilities:**

* Authentication and authorization
* Tenant isolation enforcement
* Business logic processing
* Subscription limit enforcement
* Audit logging
* Database access

#### Core Modules

* Auth Module
* Tenant Management Module
* User Management Module
* Project Management Module
* Task Management Module

Each module is implemented using:

* Controller (business logic)
* Route definitions
* Middleware (auth, tenant isolation, RBAC)

---

### 3.3 Data Layer (PostgreSQL)

**Responsibilities:**

* Persistent data storage
* Transaction management
* Referential integrity
* Enforcing schema-level constraints

**Key Characteristics:**

* Shared database, shared schema
* Tenant data isolated using `tenant_id`
* Foreign key relationships with CASCADE rules
* Indexed tenant columns for performance

---

## 4. Multi-Tenancy Design

### 4.1 Tenant Identification

* Each tenant is uniquely identified by:

  * `tenant_id` (UUID)
  * `subdomain` (human-readable identifier)
* Tenant context is derived from JWT token
* Client never supplies tenant identifiers directly

---

### 4.2 Tenant Isolation Strategy

| Entity     | Isolation Method                       |
| ---------- | -------------------------------------- |
| Users      | users.tenant_id                        |
| Projects   | projects.tenant_id                     |
| Tasks      | tasks.tenant_id (derived from project) |
| Audit Logs | audit_logs.tenant_id                   |

All database queries automatically filter by `tenant_id` unless the requester is a super admin.

---

### 4.3 Super Admin Exception

* Super Admin users have `tenant_id = NULL`
* They can access data across tenants
* Authorization middleware explicitly checks this role
* No tenant filtering applied for super admin operations

---

## 5. Authentication & Authorization Flow

### 5.1 Login Flow

1. User submits credentials with tenant subdomain
2. Backend verifies tenant status
3. User credentials validated using bcrypt
4. JWT token issued containing:

   * userId
   * tenantId
   * role
5. Token returned to client

---

### 5.2 Request Authorization Flow

1. Client sends request with `Authorization: Bearer <token>`
2. Auth middleware verifies token signature and expiry
3. Tenant middleware extracts tenant context
4. Role middleware validates permissions
5. Controller executes business logic

---

## 6. API Communication Flow

```
Client
  ↓ HTTP Request (JWT)
Backend API
  ↓ Middleware (Auth, Tenant, Role)
Controller
  ↓ SQL Query
PostgreSQL
  ↑ Result
Controller
  ↑ JSON Response
Client
```

---

## 7. Database Architecture

### 7.1 Schema Design Principles

* Normalized relational schema
* UUIDs as primary keys
* ENUM types for controlled fields
* Foreign keys for integrity
* CASCADE deletes where applicable

---

### 7.2 Core Tables

* tenants
* users
* projects
* tasks
* audit_logs

Each table follows strict ownership and relationship rules to ensure tenant safety.

---

## 8. Subscription Enforcement Architecture

Subscription limits are enforced at the application layer:

1. Query tenant limits (`max_users`, `max_projects`)
2. Count existing resources
3. Reject creation if limit exceeded
4. Return appropriate HTTP 403 response

This ensures business rules are applied consistently.

---

## 9. Audit Logging Architecture

Audit logging is centralized:

* Each critical action triggers an audit log entry
* Stored fields:

  * tenant_id
  * user_id
  * action
  * entity_type
  * entity_id
  * timestamp
* Logs are immutable and not exposed to modification APIs

---

## 10. Error Handling Architecture

* Centralized error responses
* Consistent JSON error format
* Meaningful HTTP status codes
* Authorization and validation failures handled early

---

## 11. Docker & Deployment Architecture

### 11.1 Containerized Services

| Service  | Responsibility       |
| -------- | -------------------- |
| database | PostgreSQL storage   |
| backend  | API server           |
| frontend | UI service (planned) |

---

### 11.2 Inter-Service Communication

* Services communicate via Docker service names
* Backend connects to database using `database:5432`
* Frontend consumes API via `backend:5000`

---

### 11.3 Health Check Architecture

* Backend exposes `/api/health`
* Health check verifies:

  * API availability
  * Database connectivity
* Docker Compose waits for healthy services before startup completion

---

## 12. Scalability & Extensibility

The architecture supports future growth:

* Horizontal scaling of backend containers
* Stateless API design
* Read replicas for database (future)
* Microservice extraction if required
* Caching and background jobs can be added without refactoring

---

## 13. Security Architecture Summary

* JWT-based authentication
* Strict tenant isolation
* Role-based authorization
* Secure password hashing
* Audit trail for all critical operations

---

## 14. Conclusion

This architecture provides a **robust foundation for a production-ready multi-tenant SaaS system**. It balances simplicity and scalability while ensuring security, data isolation, and maintainability. The modular design allows future enhancements without architectural changes.

---

If you want next, I can generate:

* `PRD.md`
* Improve `API.md` with examples
* Final `README.md` polish

Just tell me what to do next.


---

## 1. Overview

This document describes the **system architecture, component interactions, and data flow** of the Multi-Tenant SaaS Platform. The architecture is designed to ensure **strict tenant isolation, role-based access control, scalability, and maintainability**, while remaining simple to deploy and operate using containerization.

---

## 2. High-Level Architecture

The system follows a **three-tier architecture**:

1. **Client Layer (Frontend – Planned)**
2. **Application Layer (Backend API)**
3. **Data Layer (PostgreSQL Database)**

Each layer is independently deployable and communicates through well-defined interfaces.

---

## 3. Architecture Components

### 3.1 Client Layer (Frontend)

**Responsibilities:**

* User authentication (login, logout)
* Role-based UI rendering
* Project and task management interfaces
* API consumption via HTTP requests
* Token storage and session handling

**Key Characteristics:**

* Stateless UI
* Communicates with backend via REST APIs
* JWT stored on client side
* Authorization header attached to all requests

> Note: Frontend implementation is planned and intentionally decoupled from backend design.

---

### 3.2 Application Layer (Backend API)

**Technology:** Node.js + Express.js

**Responsibilities:**

* Authentication and authorization
* Tenant isolation enforcement
* Business logic processing
* Subscription limit enforcement
* Audit logging
* Database access

#### Core Modules

* Auth Module
* Tenant Management Module
* User Management Module
* Project Management Module
* Task Management Module

Each module is implemented using:

* Controller (business logic)
* Route definitions
* Middleware (auth, tenant isolation, RBAC)

---

### 3.3 Data Layer (PostgreSQL)

**Responsibilities:**

* Persistent data storage
* Transaction management
* Referential integrity
* Enforcing schema-level constraints

**Key Characteristics:**

* Shared database, shared schema
* Tenant data isolated using `tenant_id`
* Foreign key relationships with CASCADE rules
* Indexed tenant columns for performance

---

## 4. Multi-Tenancy Design

### 4.1 Tenant Identification

* Each tenant is uniquely identified by:

  * `tenant_id` (UUID)
  * `subdomain` (human-readable identifier)
* Tenant context is derived from JWT token
* Client never supplies tenant identifiers directly

---

### 4.2 Tenant Isolation Strategy

| Entity     | Isolation Method                       |
| ---------- | -------------------------------------- |
| Users      | users.tenant_id                        |
| Projects   | projects.tenant_id                     |
| Tasks      | tasks.tenant_id (derived from project) |
| Audit Logs | audit_logs.tenant_id                   |

All database queries automatically filter by `tenant_id` unless the requester is a super admin.

---

### 4.3 Super Admin Exception

* Super Admin users have `tenant_id = NULL`
* They can access data across tenants
* Authorization middleware explicitly checks this role
* No tenant filtering applied for super admin operations

---

## 5. Authentication & Authorization Flow

### 5.1 Login Flow

1. User submits credentials with tenant subdomain
2. Backend verifies tenant status
3. User credentials validated using bcrypt
4. JWT token issued containing:

   * userId
   * tenantId
   * role
5. Token returned to client

---

### 5.2 Request Authorization Flow

1. Client sends request with `Authorization: Bearer <token>`
2. Auth middleware verifies token signature and expiry
3. Tenant middleware extracts tenant context
4. Role middleware validates permissions
5. Controller executes business logic

---

## 6. API Communication Flow

```
Client
  ↓ HTTP Request (JWT)
Backend API
  ↓ Middleware (Auth, Tenant, Role)
Controller
  ↓ SQL Query
PostgreSQL
  ↑ Result
Controller
  ↑ JSON Response
Client
```

---

## 7. Database Architecture

### 7.1 Schema Design Principles

* Normalized relational schema
* UUIDs as primary keys
* ENUM types for controlled fields
* Foreign keys for integrity
* CASCADE deletes where applicable

---

### 7.2 Core Tables

* tenants
* users
* projects
* tasks
* audit_logs

Each table follows strict ownership and relationship rules to ensure tenant safety.

---

## 8. Subscription Enforcement Architecture

Subscription limits are enforced at the application layer:

1. Query tenant limits (`max_users`, `max_projects`)
2. Count existing resources
3. Reject creation if limit exceeded
4. Return appropriate HTTP 403 response

This ensures business rules are applied consistently.

---

## 9. Audit Logging Architecture

Audit logging is centralized:

* Each critical action triggers an audit log entry
* Stored fields:

  * tenant_id
  * user_id
  * action
  * entity_type
  * entity_id
  * timestamp
* Logs are immutable and not exposed to modification APIs

---

## 10. Error Handling Architecture

* Centralized error responses
* Consistent JSON error format
* Meaningful HTTP status codes
* Authorization and validation failures handled early

---

## 11. Docker & Deployment Architecture

### 11.1 Containerized Services

| Service  | Responsibility       |
| -------- | -------------------- |
| database | PostgreSQL storage   |
| backend  | API server           |
| frontend | UI service (planned) |

---

### 11.2 Inter-Service Communication

* Services communicate via Docker service names
* Backend connects to database using `database:5432`
* Frontend consumes API via `backend:5000`

---

### 11.3 Health Check Architecture

* Backend exposes `/api/health`
* Health check verifies:

  * API availability
  * Database connectivity
* Docker Compose waits for healthy services before startup completion

---

## 12. Scalability & Extensibility

The architecture supports future growth:

* Horizontal scaling of backend containers
* Stateless API design
* Read replicas for database (future)
* Microservice extraction if required
* Caching and background jobs can be added without refactoring

---

## 13. Security Architecture Summary

* JWT-based authentication
* Strict tenant isolation
* Role-based authorization
* Secure password hashing
* Audit trail for all critical operations

---

## 14. Conclusion

This architecture provides a **robust foundation for a production-ready multi-tenant SaaS system**. It balances simplicity and scalability while ensuring security, data isolation, and maintainability. The modular design allows future enhancements without architectural changes.

---

