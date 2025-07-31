# API Integration Documentation

## Environment Configuration

The API URL is configured via environment variables:

- **Development**: Set in `.env.local`
- **Production**: Set in your deployment platform's environment variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000

# Production example
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Authentication Endpoints

### Login
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "123",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe"
      },
      "token": "jwt-token-here"
    }
  }
  ```

### Signup
- **Endpoint**: `POST /api/auth/signup`
- **Request Body**:
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Account created successfully",
    "data": {
      "user": {
        "id": "123",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  }
  ```

### Logout (Optional)
- **Endpoint**: `POST /api/auth/logout`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `204 No Content`

## Error Handling

All API errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

Common error codes:
- `INVALID_CREDENTIALS`: Wrong email or password
- `EMAIL_EXISTS`: Email already registered
- `VALIDATION_ERROR`: Invalid input data
- `SERVER_ERROR`: Internal server error

## Usage in Components

```typescript
import { authAPI } from '@/lib/api/auth'

// Login
const response = await authAPI.login({ email, password })
if (response.success) {
  // Handle success
} else {
  // Handle error: response.error
}

// Check authentication
const isLoggedIn = authAPI.isAuthenticated()
const token = authAPI.getToken()
```