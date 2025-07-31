const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  name: string
  is_active: boolean
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface RegisterResponse extends TokenResponse {
  user: User
}

export interface ErrorResponse {
  error: {
    code: string
    message: string
    timestamp: string
    path: string
    method: string
    request_id: string
  }
}

class AuthAPI {
  private baseURL: string

  constructor() {
    this.baseURL = `${API_URL}/api/v1/auth`
  }

  private isErrorResponse(data: any): data is ErrorResponse {
    return data.error && typeof data.error === 'object'
  }

  private getErrorMessage(data: any): string {
    if (this.isErrorResponse(data)) {
      return data.error.message
    }
    return 'An unexpected error occurred'
  }

  async login(credentials: LoginRequest): Promise<{ success: boolean; tokens?: TokenResponse; error?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(this.getErrorMessage(data))
      }

      // Store tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
      }

      // After successful login, fetch user details
      const user = await this.getCurrentUser()
      if (user && typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user))
      }

      return {
        success: true,
        tokens: data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }
    }
  }

  async signup(userData: SignupRequest): Promise<{ success: boolean; data?: RegisterResponse; error?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(this.getErrorMessage(data))
      }

      // Store tokens and user info from registration response
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      return {
        success: true,
        data: data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getAccessToken()
      if (!token) return null

      const response = await fetch(`${this.baseURL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }

      const user = await response.json()
      return user
    } catch (error) {
      console.error('Error fetching current user:', error)
      return null
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken()
      if (!refreshToken) return false

      const response = await fetch(`${this.baseURL}/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to refresh token')
      }

      const data = await response.json()
      
      // Update stored tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
      }
      
      return true
    } catch (error) {
      console.error('Token refresh error:', error)
      // Clear tokens on refresh failure
      this.logout()
      return false
    }
  }

  logout(): void {
    // Clear all auth data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
  }

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('access_token')
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('refresh_token')
  }

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }
}

export const authAPI = new AuthAPI()