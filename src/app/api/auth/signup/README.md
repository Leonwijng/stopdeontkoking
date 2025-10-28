# Signup API Route Documentation

This document provides examples for using the signup API endpoint.

## Endpoint

```text
POST /api/auth/signup
```

## Request Format

The signup endpoint accepts a JSON payload with the following fields:

```json
{
  "name": "User's full name",
  "email": "user@example.com",
  "password": "securepassword"
}
```

## Example Requests

### Using curl

```bash
curl -X POST \
  http://localhost:3000/api/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securepassword123"
}'
```

### Using JavaScript Fetch API

```javascript
const response = await fetch("/api/auth/signup", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john.doe@example.com",
    password: "securepassword123",
  }),
  credentials: "include", // Important: This is needed to include cookies
});

const data = await response.json();
console.log(data);
```

### Using Bun

```typescript
const response = await fetch("http://localhost:3000/api/auth/signup", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john.doe@example.com",
    password: "securepassword123",
  }),
});

const data = await response.json();
console.log(data);
```

## Successful Response

On successful signup, the API will:

1. Create a new user in the database
2. Set an HTTP-only cookie with the authentication token
3. Return a JSON response with user details

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "created_at": "2025-09-28T12:00:00.000Z"
  }
}
```

## Error Responses

### Validation Errors

```json
{
  "success": false,
  "errors": {
    "name": "Name is required",
    "email": "Please enter a valid email address",
    "password": "Password must be at least 8 characters"
  }
}
```

### Duplicate Email

```json
{
  "success": false,
  "errors": {
    "email": "User with this email already exists"
  }
}
```

### Server Error

```json
{
  "success": false,
  "message": "An error occurred during signup"
}
```

## Notes

- The authentication token is sent as an HTTP-only, secure cookie that will be automatically included in subsequent requests.
- The default role assigned to new users is "user".
- Password is hashed using Argon2 before storing in the database.
- The token expires after 7 days (configurable in .env file).
