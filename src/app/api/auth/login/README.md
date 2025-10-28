# Login API Route Documentation

This document provides examples for using the login API endpoint.

## Endpoint

```text
POST /api/auth/login
```

## Request Format

The login endpoint accepts a JSON payload with the following fields:

```json
{
  "email": "user@example.com",
  "password": "yourpassword",
  "rememberMe": true
}
```

### Fields

- `email`: (Required) The email address of the registered user
- `password`: (Required) The user's password
- `rememberMe`: (Optional, boolean) Whether to create a persistent cookie or a session cookie

## Example Requests

### Using curl

```bash
curl -X POST \
  http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "john.doe@example.com",
    "password": "securepassword123",
    "rememberMe": true
}'
```

### Using JavaScript Fetch API

```javascript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "john.doe@example.com",
    password: "securepassword123",
    rememberMe: true,
  }),
  credentials: "include", // Important: This is needed to include cookies
});

const data = await response.json();
console.log(data);
```

### Using Bun

```typescript
const response = await fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "john.doe@example.com",
    password: "securepassword123",
    rememberMe: true,
  }),
});

const data = await response.json();
console.log(data);
```

## Successful Response

On successful login, the API will:

1. Set an HTTP-only cookie with the authentication token
2. Return a JSON response with user details

```json
{
  "success": true,
  "message": "Login successful",
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
    "email": "Email is required",
    "password": "Password is required"
  }
}
```

### Invalid Credentials

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Rate Limit Exceeded

```json
{
  "success": false,
  "message": "Too many login attempts. Please try again in a minute.",
  "error": "rate_limit_exceeded"
}
```

### Server Error

```json
{
  "success": false,
  "message": "An error occurred during login"
}
```

## Rate Limiting

The login endpoint is rate-limited to prevent brute-force attacks:

- 5 login attempts per minute per IP address
- Additional headers are returned showing the rate limit status:
  - `X-RateLimit-Limit`: The maximum number of requests allowed per window
  - `X-RateLimit-Remaining`: The number of requests remaining in the current window
  - `X-RateLimit-Reset`: The timestamp (in seconds) when the rate limit window resets

## Notes

- The authentication token is sent as an HTTP-only, secure cookie that will be automatically included in subsequent requests
- If `rememberMe` is true, the cookie will persist for 7 days; otherwise, it will be a session cookie that expires when the browser is closed
- Password verification is done using Argon2 for secure comparison
