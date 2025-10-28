# Stop de Ontkoking API Documentation

This document provides comprehensive documentation for all API endpoints in the Stop de Ontkoking application. Each section details the endpoint's functionality, request parameters, response format, and usage examples.

## Table of Contents

1. [Authentication](#authentication)
   - [Signup](#signup)
   - [Login](#login)
   - [Logout](#logout)
   - [Token Refresh](#token-refresh)
   - [User Profile](#user-profile)
2. [Recipes](#recipes)
   - [Search Recipes](#search-recipes)
3. [Security Notes](#security-notes)
4. [Running with Bun](#running-with-bun)

## Authentication

### Signup

`POST /api/auth/signup`

Create a new user account.

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "username": "johndoe" // Optional, will use email if not provided
}
```

#### Responses

##### Success (201 Created)

```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "john.doe",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "created_at": "2025-09-28T12:00:00.000Z",
    "updated_at": "2025-09-28T12:00:00.000Z"
  }
}
```

##### Error (400 Bad Request)

```json
{
  "success": false,
  "errors": {
    "email": "Email is already in use",
    "password": "Password must be at least 8 characters"
  }
}
```

#### Example Usage

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john.doe@example.com","password":"securePassword123"}'
```

```javascript
// Using fetch API
const response = await fetch("/api/auth/signup", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john.doe@example.com",
    password: "securePassword123",
  }),
});

const data = await response.json();
```

### Login

`POST /api/auth/login`

Authenticate a user and receive an authentication token.

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Response Format

##### Success (200 OK)

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user"
  }
}
```

##### Error (401 Unauthorized)

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

##### Error (429 Too Many Requests)

```json
{
  "success": false,
  "message": "Too many login attempts, please try again later"
}
```

#### Example Usage

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"securePassword123"}'
```

```javascript
// Using fetch API
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "john.doe@example.com",
    password: "securePassword123",
  }),
  credentials: "include", // Important for storing cookies
});

const data = await response.json();
```

### Logout

`POST /api/auth/logout`

Log out the current user by clearing authentication cookies.

#### Response Format

##### Success (200 OK)

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Example Usage

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json"
```

```javascript
// Using fetch API
const response = await fetch("/api/auth/logout", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Important for including cookies
});

const data = await response.json();
```

### Token Refresh

`POST /api/auth/refresh`

Refresh an expired authentication token.

#### Response Format

##### Success (200 OK)

```json
{
  "success": true,
  "message": "Token refreshed successfully"
}
```

##### Error (401 Unauthorized)

```json
{
  "success": false,
  "message": "Invalid refresh token"
}
```

#### Example Usage

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  --cookie "refresh_token=your_refresh_token_here"
```

```javascript
// Using fetch API
const response = await fetch("/api/auth/refresh", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Important for including cookies
});

const data = await response.json();
```

### User Profile

#### GET User Profile

`GET /api/auth/me`

Retrieve the current user's profile information.

##### Response Format

###### Success (200 OK)

```json
{
  "success": true,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "created_at": "2025-09-28T12:00:00.000Z",
    "updated_at": "2025-09-28T12:00:00.000Z"
  }
}
```

###### Error (401 Unauthorized)

```json
{
  "success": false,
  "message": "Authentication required"
}
```

##### Example Usage

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Content-Type: application/json" \
  --cookie "auth_token=your_jwt_token_here"
```

```javascript
// Using fetch API
const response = await fetch("/api/auth/me", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Important for including cookies
});

const data = await response.json();
```

#### UPDATE User Profile

`PUT /api/auth/me`

Update the current user's profile information.

##### Request Body

```json
{
  "name": "Updated Name",
  "username": "updated_username",
  "email": "updated.email@example.com",
  "password": "newPassword123",
  "current_password": "oldPassword123"
}
```

All fields are optional. To update the password, both `password` and `current_password` must be provided.

##### Response Format

###### Success (200 OK)

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "updated_username",
    "name": "Updated Name",
    "email": "updated.email@example.com",
    "role": "user",
    "created_at": "2025-09-28T12:00:00.000Z",
    "updated_at": "2025-09-28T13:00:00.000Z"
  }
}
```

###### Error (400 Bad Request)

```json
{
  "success": false,
  "errors": {
    "email": "Email is already in use",
    "current_password": "Current password is incorrect"
  }
}
```

##### Example Usage

```bash
curl -X PUT http://localhost:3000/api/auth/me \
  -H "Content-Type: application/json" \
  --cookie "auth_token=your_jwt_token_here" \
  -d '{"name":"Updated Name","username":"updated_username","email":"updated.email@example.com"}'
```

```javascript
// Using fetch API
const response = await fetch("/api/auth/me", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify({
    name: "Updated Name",
    username: "updated_username",
    email: "updated.email@example.com",
  }),
});

const data = await response.json();
```

## Recipes

### Search Recipes

`GET /api/recipes/search`

Search for recipes by ingredients and meal type with pagination support.

#### Query Parameters

| Parameter   | Type   | Description                                          | Required |
| ----------- | ------ | ---------------------------------------------------- | -------- |
| ingredients | string | Search for recipes containing specific ingredients   | No       |
| meal_type   | string | Filter by meal type (breakfast, lunch, dinner, etc.) | No       |
| page        | number | Page number for pagination (default: 1)              | No       |
| limit       | number | Number of results per page (default: 10, max: 50)    | No       |

#### Response Format

##### Success (200 OK)

```json
{
  "success": true,
  "data": {
    "recipes": [
      {
        "id": "b5f8dbb7-4b2f-4187-9eff-2b9239b8d9a1",
        "owner_id": "123e4567-e89b-12d3-a456-426614174001",
        "name": "Spaghetti Carbonara",
        "description": "A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper",
        "ingredients": [
          "spaghetti",
          "eggs",
          "pancetta",
          "parmesan cheese",
          "black pepper",
          "salt"
        ],
        "meal_type": "dinner",
        "preparation_time": 15,
        "cooking_time": 20,
        "servings": 4,
        "instructions": [
          "Boil water and cook pasta",
          "Mix eggs and cheese",
          "Fry pancetta",
          "Combine all ingredients"
        ],
        "created_at": "2025-09-20T12:00:00.000Z",
        "updated_at": "2025-09-20T12:00:00.000Z"
      }
    ],
    "total": 45,
    "page": 1,
    "limit": 10
  }
}
```

##### Empty Results (200 OK)

```json
{
  "success": true,
  "data": {
    "recipes": [],
    "total": 0,
    "page": 1,
    "limit": 10
  }
}
```

##### Error (500 Internal Server Error)

```json
{
  "success": false,
  "message": "An error occurred while searching for recipes"
}
```

#### Example Usage

```bash
# Basic search by ingredient
curl -X GET "http://localhost:3000/api/recipes/search?ingredients=chicken" \
  -H "Content-Type: application/json"

# Filter by meal type
curl -X GET "http://localhost:3000/api/recipes/search?meal_type=dinner" \
  -H "Content-Type: application/json"

# Combined search with pagination
curl -X GET "http://localhost:3000/api/recipes/search?ingredients=pasta&meal_type=dinner&page=2&limit=5" \
  -H "Content-Type: application/json"
```

```javascript
// Using fetch API
const response = await fetch(
  "/api/recipes/search?ingredients=tomato&meal_type=lunch",
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
);

const data = await response.json();
```

## Security Notes

- Passwords are hashed using Argon2 before storing in the database
- Authentication is implemented using JWT tokens stored in HTTP-only cookies
- Rate limiting is applied to login endpoints to prevent brute force attacks
- Password updates require verification of the current password
- All authenticated routes are protected by middleware that verifies JWT tokens

## Running with Bun

This project is optimized for Bun, a fast JavaScript runtime. To run the application with Bun:

1. Install Bun (if not already installed):

   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. Install dependencies:

   ```bash
   cd client
   bun install
   ```

3. Configure environment variables by creating a `.env.local` file in the client directory:

   ```
   DATABASE_URL=postgres://username:password@localhost:5432/your_database
   JWT_SECRET=your_secure_random_string
   COOKIE_NAME=auth_token
   COOKIE_MAX_AGE=604800
   ```

4. Set up the database by applying SQL scripts:

   ```bash
   # Apply users.sql first
   psql -U your_username -d your_database_name -f sql/users.sql

   # Apply migration_users.sql next
   psql -U your_username -d your_database_name -f sql/migration_users.sql

   # Apply recipes.sql
   psql -U your_username -d your_database_name -f sql/recipes.sql

   # Finally, apply recipe_updates.sql
   psql -U your_username -d your_database_name -f sql/recipe_updates.sql
   ```

5. Run the development server:

   ```bash
   bun run dev
   ```

6. The application will be available at `http://localhost:3000`
