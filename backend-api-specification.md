# Backend API Specification

## Overview
RESTful API endpoints required for LMS frontend integration. All endpoints should return JSON and use standard HTTP status codes.

## Authentication
All endpoints except `/auth/*` require authentication via Bearer token in Authorization header.

## Base URL
`https://api.yourdomain.com/v1`

---

## 1. Authentication Service

### POST /auth/login
```json
Request:
{
  "email": "string",
  "password": "string"
}

Response:
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "admin|manager|instructor|learner",
    "organizationId": "string"
  }
}
```

### POST /auth/logout
```json
Headers: Authorization: Bearer {token}
Response: 204 No Content
```

### POST /auth/forgot-password
```json
Request:
{
  "email": "string"
}
Response: 204 No Content
```

### POST /auth/reset-password
```json
Request:
{
  "token": "string",
  "newPassword": "string"
}
Response: 204 No Content
```

### GET /auth/me
```json
Headers: Authorization: Bearer {token}
Response: Same as login user object
```

---

## 2. User Management

### GET /users
```json
Query params: ?page=1&limit=20&search=string&role=string&organizationId=string
Response:
{
  "users": [{
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "admin|manager|instructor|learner",
    "organizationId": "string",
    "managerId": "string|null",
    "status": "active|inactive",
    "createdAt": "ISO8601",
    "lastLogin": "ISO8601|null"
  }],
  "total": number,
  "page": number,
  "limit": number
}
```

### GET /users/:id
```json
Response: Single user object with additional fields:
{
  ...user,
  "enrollments": ["courseId"],
  "progress": {
    "coursesCompleted": number,
    "totalCourses": number,
    "averageScore": number
  }
}
```

### POST /users
```json
Request:
{
  "email": "string",
  "name": "string",
  "password": "string",
  "role": "admin|manager|instructor|learner",
  "organizationId": "string",
  "managerId": "string|null"
}
Response: Created user object
```

### PUT /users/:id
```json
Request: Partial user object
Response: Updated user object
```

### DELETE /users/:id
```json
Response: 204 No Content
```

### POST /users/bulk
```json
Request:
{
  "users": [array of user objects]
}
Response:
{
  "created": number,
  "failed": [{user, error}]
}
```

### GET /users/export
```json
Query params: Same as GET /users
Response: CSV file download
```

---

## 3. Organization Management

### GET /organizations
```json
Response:
{
  "organizations": [{
    "id": "string",
    "name": "string",
    "parentId": "string|null",
    "userCount": number
  }]
}
```

---

## 4. Course Management

### GET /courses
```json
Query params: ?enrolled=boolean
Response:
{
  "courses": [{
    "id": "string",
    "title": "string",
    "description": "string",
    "duration": number,
    "difficulty": "beginner|intermediate|advanced",
    "modules": [{
      "id": "string",
      "title": "string",
      "lessons": [{
        "id": "string",
        "title": "string",
        "type": "video|article|quiz|game",
        "duration": number
      }]
    }],
    "enrolled": boolean,
    "progress": number (0-100)
  }]
}
```

### GET /courses/:id
```json
Response: Single course object with full content
```

### GET /courses/:courseId/lessons/:lessonId
```json
Response:
{
  "id": "string",
  "title": "string",
  "content": "string|object",
  "type": "video|article|quiz|game",
  "resources": [{
    "type": "pdf|video|audio",
    "url": "string",
    "title": "string"
  }],
  "nextLesson": "lessonId|null",
  "previousLesson": "lessonId|null"
}
```

---

## 5. Progress Tracking

### GET /users/:userId/progress
```json
Response:
{
  "courses": [{
    "courseId": "string",
    "progress": number (0-100),
    "completedLessons": ["lessonId"],
    "lastAccessed": "ISO8601",
    "scores": {
      "lessonId": number
    }
  }]
}
```

### POST /progress/lesson
```json
Request:
{
  "lessonId": "string",
  "courseId": "string",
  "completed": boolean,
  "score": number|null,
  "timeSpent": number (seconds)
}
Response: 204 No Content
```

### POST /progress/game
```json
Request:
{
  "lessonId": "string",
  "gameTypeId": "string",
  "score": number,
  "data": object (game-specific data)
}
Response: 204 No Content
```

---

## 6. Analytics

### GET /analytics/usage
```json
Query params: ?startDate=ISO8601&endDate=ISO8601&type=tts|chat
Response:
{
  "usage": [{
    "date": "ISO8601",
    "type": "tts|chat",
    "count": number,
    "users": number
  }],
  "total": number
}
```

### GET /analytics/user/:userId
```json
Response:
{
  "coursesCompleted": number,
  "totalTimeSpent": number,
  "averageScore": number,
  "streakDays": number,
  "achievements": ["string"]
}
```

---

## 7. Enrollment Management

### POST /enrollments
```json
Request:
{
  "userId": "string",
  "courseId": "string"
}
Response: 204 No Content
```

### DELETE /enrollments/:userId/:courseId
```json
Response: 204 No Content
```

---

## Error Responses
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "field": "string|null"
  }
}
```

## Standard HTTP Status Codes
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Server Error

## Headers
- `Authorization: Bearer {token}` (required for authenticated endpoints)
- `Content-Type: application/json`
- `Accept: application/json`

## Rate Limiting
- 1000 requests per hour per user
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Pagination
Standard query params: `page`, `limit` (default: page=1, limit=20)
Response includes: `total`, `page`, `limit`

## Sorting & Filtering
- Sort: `?sort=field:asc|desc`
- Filter: Field-specific query params as documented per endpoint