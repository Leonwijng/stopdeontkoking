# Refresh Token API Documentation

This endpoint allows refreshing an authentication token using a longer-lived refresh token.

## Endpoint

```text
POST /api/auth/refresh
```

## Request Format

No request body is needed. The refresh token is automatically sent in the HTTP-only cookie.

## Example Requests

### Using curl

```bash
curl -X POST \
  http://localhost:3000/api/auth/refresh \
  -H 'Content-Type: application/json' \
  --cookie "refresh_token=your_refresh_token_here"
```

### Using JavaScript Fetch API

```javascript
const response = await fetch("/api/auth/refresh", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Important: This is needed to include cookies
});

const data = await response.json();
console.log(data);
```

### Using Bun

```typescript
const response = await fetch("http://localhost:3000/api/auth/refresh", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
});

const data = await response.json();
console.log(data);
```

## Successful Response

On successful token refresh, the API will:

1. Set a new HTTP-only cookie with a fresh authentication token
2. Return a JSON response confirming the success

```json
{
  "success": true,
  "message": "Token refreshed successfully"
}
```

## Error Responses

### Missing Refresh Token

```json
{
  "success": false,
  "message": "No refresh token provided"
}
```

### Invalid Token

```json
{
  "success": false,
  "message": "Invalid or expired refresh token"
}
```

### User Not Found

```json
{
  "success": false,
  "message": "User not found"
}
```

### Rate Limit Exceeded

```json
{
  "success": false,
  "message": "Too many token refresh attempts. Please try again later.",
  "error": "rate_limit_exceeded"
}
```

### Server Error

```json
{
  "success": false,
  "message": "An error occurred while refreshing token"
}
```

## Notes

- The refresh token is automatically sent in the request if it exists in the cookies
- The endpoint is rate-limited to prevent abuse (10 refresh attempts per minute)
- When a refresh is successful, a new access token is issued with a fresh expiration time
- The refresh token itself is not renewed by this endpoint - it maintains its original expiration
