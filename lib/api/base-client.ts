import { authAPI } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface ApiError {
  code: string
  message: string
  timestamp: string
  path: string
  method: string
  request_id: string
}

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
}

export class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_URL) {
    this.baseURL = baseURL
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')
    
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format')
    }

    const data = await response.json()

    if (!response.ok) {
      // Handle error response
      if (data.error) {
        throw {
          code: data.error.code,
          message: data.error.message,
          status: response.status
        }
      }
      throw new Error(data.message || 'Request failed')
    }

    return data
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const refreshToken = authAPI.getRefreshToken()
      if (!refreshToken) return false

      const response = await fetch(`${this.baseURL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data = await response.json()
      
      // Update stored tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token)
      }
      
      return true
    } catch (error) {
      console.error('Token refresh error:', error)
      authAPI.logout()
      return false
    }
  }

  async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const accessToken = authAPI.getAccessToken()
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Add auth header if token exists
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const url = `${this.baseURL}${path}`
    
    try {
      let response = await fetch(url, {
        ...options,
        headers,
      })

      // If 401 Unauthorized, try to refresh token and retry
      if (response.status === 401 && accessToken) {
        const refreshed = await this.refreshAccessToken()
        if (refreshed) {
          // Retry with new token
          const newToken = authAPI.getAccessToken()
          headers['Authorization'] = `Bearer ${newToken}`
          
          response = await fetch(url, {
            ...options,
            headers,
          })
        } else {
          // Redirect to login if refresh failed
          if (typeof window !== 'undefined') {
            window.location.href = '/lms/login'
          }
          throw new Error('Authentication failed')
        }
      }

      return await this.handleResponse<T>(response)
    } catch (error) {
      // Re-throw with consistent error format
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error')
    }
  }

  async get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'GET',
    })
  }

  async post<T>(path: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(path: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'DELETE',
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()