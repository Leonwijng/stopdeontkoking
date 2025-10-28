# Recipe Search API Documentation

This document provides documentation for the recipe search endpoint.

## GET /api/recipes/search

Search for recipes by ingredients and meal type with pagination support.

### Query Parameters

| Parameter   | Type   | Description                                               | Required |
| ----------- | ------ | --------------------------------------------------------- | -------- |
| ingredients | string | Search for recipes containing the specified ingredient(s) | No       |
| meal_type   | string | Filter by meal type (breakfast, lunch, dinner, etc.)      | No       |
| page        | number | Page number for pagination (default: 1)                   | No       |
| limit       | number | Number of results per page (default: 10, max: 50)         | No       |

### Example Requests

#### Basic Search by Ingredient

```bash
curl -X GET "http://localhost:3000/api/recipes/search?ingredients=chicken" \
  -H "Content-Type: application/json"
```

#### Filter by Meal Type

```bash
curl -X GET "http://localhost:3000/api/recipes/search?meal_type=dinner" \
  -H "Content-Type: application/json"
```

#### Combined Search with Pagination

```bash
curl -X GET "http://localhost:3000/api/recipes/search?ingredients=pasta&meal_type=dinner&page=2&limit=5" \
  -H "Content-Type: application/json"
```

### Using JavaScript Fetch API

```javascript
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
console.log(data);
```

### Using Bun

```typescript
const response = await fetch(
  "http://localhost:3000/api/recipes/search?ingredients=rice&meal_type=dinner",
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
);

const data = await response.json();
console.log(data);
```

### Successful Response

```json
{
  "success": true,
  "data": {
    "recipes": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "owner_id": "123e4567-e89b-12d3-a456-426614174001",
        "name": "Chicken Parmesan",
        "description": "A classic Italian dish with breaded chicken, tomato sauce, and cheese",
        "ingredients": [
          "chicken breast",
          "breadcrumbs",
          "parmesan cheese",
          "tomato sauce",
          "mozzarella"
        ],
        "meal_type": "dinner",
        "preparation_time": 20,
        "cooking_time": 30,
        "servings": 4,
        "instructions": [
          "Preheat oven to 350°F",
          "Bread the chicken",
          "Cook until golden brown",
          "Top with sauce and cheese",
          "Bake until cheese is melted"
        ],
        "created_at": "2025-09-20T14:30:00.000Z",
        "updated_at": "2025-09-20T14:30:00.000Z"
      }
      // More recipes...
    ],
    "total": 45,
    "page": 1,
    "limit": 10
  }
}
```

### Empty Results Response

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

### Error Response

```json
{
  "success": false,
  "message": "An error occurred while searching for recipes"
}
```

## Notes

- The search by ingredients performs a partial match (e.g., searching for "chicken" will match "chicken breast")
- Both query parameters are optional - if none are provided, the endpoint will return the most recent recipes
- Results are paginated by default, with 10 items per page
- Maximum limit per request is 50 items
