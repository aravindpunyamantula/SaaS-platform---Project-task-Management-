# API Documentation

**Multi-Tenant SaaS Platform – Project & Task Management**

Base URL (Docker):

```
http://localhost:5000/api
```

Authentication:

```
Authorization: Bearer <JWT_TOKEN>
```

All responses follow:

```json
{
  "success": true,
  "message": "optional",
  "data": {}
}
```

---

## 🔐 AUTHENTICATION MODULE

---

### **API 1: Register Tenant**

**POST** `/auth/register-tenant`
Auth: ❌ Public

**Request**

```json
{
  "tenantName": "Test Company Alpha",
  "subdomain": "testalpha",
  "adminEmail": "admin@testalpha.com",
  "adminPassword": "TestPass@123",
  "adminFullName": "Alpha Admin"
}
```

**Response (201)**

```json
{
  "success": true,
  "message": "Tenant registered successfully",
  "data": {
    "tenantId": "uuid",
    "subdomain": "testalpha",
    "adminUser": {
      "id": "uuid",
      "email": "admin@testalpha.com",
      "fullName": "Alpha Admin",
      "role": "tenant_admin"
    }
  }
}
```

---

### **API 2: Login**

**POST** `/auth/login`
Auth: ❌ Public

**Request**

```json
{
  "email": "admin@demo.com",
  "password": "Demo@123",
  "tenantSubdomain": "demo"
}
```

**Response (200)**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@demo.com",
      "fullName": "Demo Admin",
      "role": "tenant_admin",
      "tenantId": "uuid"
    },
    "token": "jwt-token",
    "expiresIn": 86400
  }
}
```

---

### **API 3: Get Current User**

**GET** `/auth/me`
Auth: ✅ Required

**Response**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "admin@demo.com",
    "fullName": "Demo Admin",
    "role": "tenant_admin",
    "isActive": true,
    "tenant": {
      "id": "uuid",
      "name": "Demo Company",
      "subdomain": "demo",
      "subscriptionPlan": "pro",
      "maxUsers": 25,
      "maxProjects": 15
    }
  }
}
```

---

### **API 4: Logout**

**POST** `/auth/logout`
Auth: ✅ Required

**Response**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🏢 TENANT MANAGEMENT

---

### **API 5: Get Tenant Details**

**GET** `/tenants/:tenantId`
Auth: ✅ Required
Roles: tenant_admin (own tenant), super_admin

**Response**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Demo Company",
    "subdomain": "demo",
    "status": "active",
    "subscriptionPlan": "pro",
    "maxUsers": 25,
    "maxProjects": 15,
    "createdAt": "timestamp",
    "stats": {
      "totalUsers": 5,
      "totalProjects": 2,
      "totalTasks": 8
    }
  }
}
```

---

### **API 6: Update Tenant**

**PUT** `/tenants/:tenantId`
Auth: ✅ Required
Roles:

- tenant_admin → name only
- super_admin → all fields

**Request**

```json
{
  "name": "Updated Company Name"
}
```

**Response**

```json
{
  "success": true,
  "message": "Tenant updated successfully",
  "data": {
    "id": "uuid",
    "name": "Updated Company Name",
    "updatedAt": "timestamp"
  }
}
```

---

### **API 7: List All Tenants**

**GET** `/tenants`
Auth: ✅ Required
Roles: super_admin only

**Response**

```json
{
  "success": true,
  "data": {
    "tenants": [
      {
        "id": "uuid",
        "name": "Demo Company",
        "subdomain": "demo",
        "status": "active",
        "subscriptionPlan": "pro",
        "totalUsers": 5,
        "totalProjects": 2,
        "createdAt": "timestamp"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalTenants": 1,
      "limit": 10
    }
  }
}
```

---

## 👥 USER MANAGEMENT

---

### **API 8: Add User**

**POST** `/tenants/:tenantId/users`
Auth: ✅ Required
Roles: tenant_admin

**Response (201)**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "uuid",
    "email": "newuser@demo.com",
    "fullName": "New User",
    "role": "user",
    "tenantId": "uuid",
    "isActive": true,
    "createdAt": "timestamp"
  }
}
```

---

### **API 9: List Users**

**GET** `/tenants/:tenantId/users`
Auth: ✅ Required

**Response**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "user1@demo.com",
        "fullName": "Demo User",
        "role": "user",
        "isActive": true,
        "createdAt": "timestamp"
      }
    ],
    "total": 3,
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "limit": 50
    }
  }
}
```

---

### **API 10: Update User**

**PUT** `/users/:userId`
Auth: ✅ Required

**Response**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "uuid",
    "fullName": "Updated Name",
    "role": "user",
    "updatedAt": "timestamp"
  }
}
```

---

### **API 11: Delete User**

**DELETE** `/users/:userId`
Auth: ✅ Required

**Response**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 📁 PROJECT MANAGEMENT

---

### **API 12: Create Project**

**POST** `/projects`
Auth: ✅ Required

**Response**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "name": "Project Alpha",
    "description": "First demo project",
    "status": "active",
    "createdBy": "uuid",
    "createdAt": "timestamp"
  }
}
```

---

### **API 13: List Projects**

**GET** `/projects`
Auth: ✅ Required

**Response**

```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "uuid",
        "name": "Project Alpha",
        "description": "First demo project",
        "status": "active",
        "createdBy": {
          "id": "uuid",
          "fullName": "Demo Admin"
        },
        "taskCount": 5,
        "completedTaskCount": 2,
        "createdAt": "timestamp"
      }
    ],
    "total": 1,
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "limit": 20
    }
  }
}
```

---

### **API 14: Update Project**

**PUT** `/projects/:projectId`
Auth: ✅ Required

**Response**

```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "id": "uuid",
    "name": "Updated Project",
    "description": "Updated description",
    "status": "archived",
    "updatedAt": "timestamp"
  }
}
```

---

### **API 15: Delete Project**

**DELETE** `/projects/:projectId`
Auth: ✅ Required

**Response**

```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

## ✅ TASK MANAGEMENT

---

### **API 16: Create Task**

**POST** `/projects/:projectId/tasks`
Auth: ✅ Required

**Response**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "tenantId": "uuid",
    "title": "Design homepage",
    "description": "Create UI",
    "status": "todo",
    "priority": "high",
    "assignedTo": "uuid",
    "dueDate": "2024-07-15",
    "createdAt": "timestamp"
  }
}
```

---

### **API 17: List Tasks**

**GET** `/projects/:projectId/tasks`
Auth: ✅ Required

**Response**

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "uuid",
        "title": "Design homepage",
        "description": "Create UI",
        "status": "in_progress",
        "priority": "high",
        "assignedTo": {
          "id": "uuid",
          "fullName": "Demo Admin",
          "email": "admin@demo.com"
        },
        "dueDate": "2024-07-01",
        "createdAt": "timestamp"
      }
    ],
    "total": 5,
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "limit": 50
    }
  }
}
```

---

### **API 18: Update Task Status**

**PATCH** `/tasks/:taskId/status`
Auth: ✅ Required

**Response**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "completed",
    "updatedAt": "timestamp"
  }
}
```

---

### **API 19: Update Task**

**PUT** `/tasks/:taskId`
Auth: ✅ Required

**Response**

```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "uuid",
    "title": "Updated task title",
    "description": "Updated description",
    "status": "in_progress",
    "priority": "high",
    "assignedTo": {
      "id": "uuid",
      "fullName": "Demo Admin",
      "email": "admin@demo.com"
    },
    "dueDate": "2024-08-01",
    "updatedAt": "timestamp"
  }
}
```

---
