# Logout API Route Documentation

This document provides examples for using the logout API endpoint.

## Endpoint

```text
POST /api/auth/logout
```

## Request Format

The logout endpoint doesn't require any request body or parameters. It uses the existing authentication cookies to identify the user session that needs to be terminated.

## Example Requests

### Using curl

```bash
curl -X POST \
  http://localhost:3000/api/auth/logout \
  -H 'Content-Type: application/json' \
  --cookie "auth_token=your_token_here; refresh_token=your_refresh_token_here"
```

### Using JavaScript Fetch API

```javascript
const response = await fetch("/api/auth/logout", {
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
const response = await fetch("http://localhost:3000/api/auth/logout", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Important: This is needed to include cookies
});

const data = await response.json();
console.log(data);
```

## Successful Response

On successful logout, the API will:

1. Clear the auth_token cookie
2. Clear the refresh_token cookie if it exists
3. Return a JSON response confirming the success

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Error Response

### Server Error

```json
{
  "success": false,
  "message": "An error occurred during logout"
}
```

## Notes

- This endpoint clears all authentication cookies by setting them to expire immediately
- No authentication check is performed, making this a safe operation whether the user is authenticated or not
- After logout, the browser will no longer send authentication tokens with subsequent requests
- To protect against CSRF attacks, consider implementing additional security measures in a production environment
