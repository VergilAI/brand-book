import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { z } from 'zod';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || (
    process.env.NODE_ENV === 'production' 
      ? (() => { throw new Error('JWT_SECRET environment variable is required for production'); })()
      : 'vergil-investors-portal-secret-key-2024'
  )
);

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'admin' | 'investor';
  name: string;
  iat?: number;
  exp?: number;
}

export interface AuthResult {
  success: boolean;
  user?: AuthenticatedUser;
  error?: string;
}

// Input validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  role: z.enum(['admin', 'investor'], { required_error: 'Role must be admin or investor' }),
});

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const key = `login:${identifier}`;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxAttempts) {
    return false;
  }

  record.count++;
  return true;
}

export async function authenticateRequest(request: NextRequest): Promise<AuthResult> {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return { success: false, error: 'No authentication token provided' };
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Validate payload structure
    if (!payload.id || !payload.email || !payload.role || !payload.name) {
      return { success: false, error: 'Invalid token payload' };
    }

    return {
      success: true,
      user: {
        id: payload.id as string,
        email: payload.email as string,
        role: payload.role as 'admin' | 'investor',
        name: payload.name as string,
        iat: payload.iat as number,
        exp: payload.exp as number,
      }
    };
  } catch (error) {
    return { success: false, error: 'Invalid or expired token' };
  }
}

export function requireAuth(handler: (request: NextRequest, user: AuthenticatedUser) => Promise<Response>) {
  return async (request: NextRequest): Promise<Response> => {
    const authResult = await authenticateRequest(request);
    
    if (!authResult.success || !authResult.user) {
      return new Response(
        JSON.stringify({ error: authResult.error || 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return handler(request, authResult.user);
  };
}

export function requireAdmin(handler: (request: NextRequest, user: AuthenticatedUser) => Promise<Response>) {
  return requireAuth(async (request: NextRequest, user: AuthenticatedUser): Promise<Response> => {
    if (user.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return handler(request, user);
  });
}

export function getClientIP(request: NextRequest): string {
  // Try multiple headers for getting real client IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// Security audit logging
interface AuditLogEntry {
  timestamp: string;
  userId?: string;
  action: string;
  ip: string;
  userAgent?: string;
  success: boolean;
  error?: string;
}

export function logSecurityEvent(entry: Omit<AuditLogEntry, 'timestamp'>): void {
  const logEntry: AuditLogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };
  
  // In production, send to logging service (DataDog, Sentry, etc.)
  console.log('[SECURITY AUDIT]', JSON.stringify(logEntry));
}

export function sanitizeUserData(user: any): Omit<AuthenticatedUser, 'iat' | 'exp'> {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
}