# User Profile Management API Documentation

This document provides examples for using the user profile management endpoints.

## Authentication Required

All endpoints in this document require authentication. The authentication token must be included as an HTTP-only cookie named `auth_token`.

## Endpoints

### GET /api/auth/me

Retrieves information about the currently authenticated user.

#### GET Example Requests

##### GET Using curl

```bash
curl -X GET \
  http://localhost:3000/api/auth/me \
  -H 'Content-Type: application/json' \
  --cookie "auth_token=your_jwt_token_here"
```

##### GET Using JavaScript Fetch API

```javascript
const response = await fetch("/api/auth/me", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Important: This is needed to include cookies
});

const data = await response.json();
console.log(data);
```

##### GET Using Bun

```typescript
const response = await fetch("http://localhost:3000/api/auth/me", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Important: This is needed to include cookies
});

const data = await response.json();
console.log(data);
```

#### GET Successful Response

```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "created_at": "2025-09-28T12:00:00.000Z",
    "updated_at": "2025-09-28T12:00:00.000Z"
  }
}
```

#### GET Error Responses

##### GET Unauthorized

```json
{
  "success": false,
  "message": "Authentication required"
}
```

##### GET User Not Found

```json
{
  "success": false,
  "message": "User not found"
}
```

### PUT /api/auth/me

Updates the profile information of the currently authenticated user.

#### PUT Request Format

The endpoint accepts a JSON payload with the following fields:

```json
{
  "name": "Updated Name",
  "email": "updated.email@example.com",
  "password": "newPassword123",
  "current_password": "oldPassword123"
}
```

All fields are optional. To update the password, both `password` and `current_password` must be provided.

#### PUT Example Requests

##### PUT Using curl

```bash
curl -X PUT \
  http://localhost:3000/api/auth/me \
  -H 'Content-Type: application/json' \
  --cookie "auth_token=your_jwt_token_here" \
  -d '{
    "name": "Updated Name",
    "email": "updated.email@example.com"
  }'
```

##### PUT Using JavaScript Fetch API

```javascript
const response = await fetch("/api/auth/me", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Important: This is needed to include cookies
  body: JSON.stringify({
    name: "Updated Name",
    email: "updated.email@example.com",
  }),
});

const data = await response.json();
console.log(data);
```

##### PUT Using Bun

```typescript
const response = await fetch("http://localhost:3000/api/auth/me", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify({
    name: "Updated Name",
    email: "updated.email@example.com",
  }),
});

const data = await response.json();
console.log(data);
```

##### Password Update Example

```typescript
const response = await fetch("/api/auth/me", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify({
    password: "newSecurePassword123",
    current_password: "oldPassword123",
  }),
});

const data = await response.json();
console.log(data);
```

#### PUT Successful Response

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "Updated Name",
    "email": "updated.email@example.com",
    "role": "user",
    "created_at": "2025-09-28T12:00:00.000Z",
    "updated_at": "2025-09-28T13:00:00.000Z"
  }
}
```

#### Error Responses

##### Validation Errors

```json
{
  "success": false,
  "errors": {
    "email": "Please enter a valid email address",
    "current_password": "Current password is required when updating password",
    "password": "Password must be at least 8 characters"
  }
}
```

##### Incorrect Password

```json
{
  "success": false,
  "errors": {
    "current_password": "Current password is incorrect"
  }
}
```

##### Email In Use

```json
{
  "success": false,
  "errors": {
    "email": "Email is already in use"
  }
}
```

##### PUT Unauthorized

```json
{
  "success": false,
  "message": "Authentication required"
}
```

## Security Notes

- Passwords are hashed using Argon2 before storing in the database
- All endpoints require a valid JWT token in an HTTP-only cookie
- Password changes require verification of the current password
- Email updates are checked for uniqueness before applying
- Authentication tokens are validated on every request
