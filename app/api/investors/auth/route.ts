import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { 
  loginSchema, 
  rateLimit, 
  getClientIP, 
  logSecurityEvent, 
  sanitizeUserData,
  authenticateRequest
} from '@/lib/investors/auth';
import { DataService } from '@/lib/investors/dataService';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || (
    process.env.NODE_ENV === 'production' 
      ? (() => { throw new Error('JWT_SECRET environment variable is required for production'); })()
      : 'vergil-investors-portal-secret-key-2024'
  )
);

interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'investor';
  name: string;
  createdAt: string;
  lastLogin: string | null;
  loginAttempts?: number;
  lockedUntil?: string;
}

interface UsersData {
  users: User[];
}

async function readUsers(): Promise<UsersData> {
  try {
    return await DataService.readJSON('users.json');
  } catch (error) {
    return { users: [] };
  }
}

async function writeUsers(data: UsersData): Promise<void> {
  await DataService.writeJSON('users.json', data);
}

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    // Rate limiting
    if (!rateLimit(`login:${clientIP}`, 5, 15 * 60 * 1000)) {
      logSecurityEvent({
        action: 'login_rate_limited',
        ip: clientIP,
        userAgent,
        success: false,
        error: 'Too many login attempts'
      });
      
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    // Validate input
    const body = await request.json();
    const validationResult = loginSchema.safeParse(body);
    
    if (!validationResult.success) {
      logSecurityEvent({
        action: 'login_invalid_input',
        ip: clientIP,
        userAgent,
        success: false,
        error: validationResult.error.issues[0].message
      });
      
      return NextResponse.json(
        { error: 'Invalid input format' },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    const data = await readUsers();
    const user = data.users.find(u => u.email === email);

    if (!user) {
      logSecurityEvent({
        action: 'login_user_not_found',
        ip: clientIP,
        userAgent,
        success: false,
        error: `User not found: ${email}`
      });
      
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check if user is locked
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      logSecurityEvent({
        userId: user.id,
        action: 'login_account_locked',
        ip: clientIP,
        userAgent,
        success: false,
        error: 'Account locked'
      });
      
      return NextResponse.json(
        { error: 'Account temporarily locked due to too many failed attempts' },
        { status: 423 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      // Increment failed login attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      // Lock account after 5 failed attempts for 30 minutes
      if (user.loginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      }
      
      await writeUsers(data);
      
      logSecurityEvent({
        userId: user.id,
        action: 'login_invalid_password',
        ip: clientIP,
        userAgent,
        success: false,
        error: `Failed attempt ${user.loginAttempts}/5`
      });
      
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockedUntil = undefined;
    user.lastLogin = new Date().toISOString();
    await writeUsers(data);

    // Create JWT token
    const token = await new SignJWT({ 
      id: user.id, 
      email: user.email, 
      role: user.role,
      name: user.name 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      user: sanitizeUserData(user)
    });

    // Set secure cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });

    logSecurityEvent({
      userId: user.id,
      action: 'login_success',
      ip: clientIP,
      userAgent,
      success: true
    });

    return response;
  } catch (error) {
    logSecurityEvent({
      action: 'login_server_error',
      ip: clientIP,
      userAgent,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  // Get user info before logging out
  const authResult = await authenticateRequest(request);
  
  const response = NextResponse.json({ success: true });
  
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  });

  logSecurityEvent({
    userId: authResult.user?.id,
    action: 'logout',
    ip: clientIP,
    userAgent,
    success: true
  });

  return response;
}

export async function GET(request: NextRequest) {
  const authResult = await authenticateRequest(request);
  
  if (!authResult.success || !authResult.user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: sanitizeUserData(authResult.user) });
}