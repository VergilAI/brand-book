import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { requireAdmin, createUserSchema, logSecurityEvent, getClientIP } from '@/lib/investors/auth';
import { DataService } from '@/lib/investors/dataService';

interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'investor';
  name: string;
  createdAt: string;
  lastLogin: string | null;
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

export const GET = requireAdmin(async (request: NextRequest, user) => {
  const clientIP = getClientIP(request);
  
  try {
    const data = await readUsers();
    const users = data.users.map(({ password, ...user }) => user);
    
    logSecurityEvent({
      userId: user.id,
      action: 'users_list_accessed',
      ip: clientIP,
      success: true
    });
    
    return NextResponse.json({ users });
  } catch (error) {
    logSecurityEvent({
      userId: user.id,
      action: 'users_list_error',
      ip: clientIP,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
});

export const POST = requireAdmin(async (request: NextRequest, user) => {
  const clientIP = getClientIP(request);
  
  try {
    const body = await request.json();
    const validationResult = createUserSchema.safeParse(body);
    
    if (!validationResult.success) {
      logSecurityEvent({
        userId: user.id,
        action: 'user_creation_invalid_input',
        ip: clientIP,
        success: false,
        error: validationResult.error.issues[0].message
      });
      
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, name, role } = validationResult.data;

    const data = await readUsers();
    
    if (data.users.some(existingUser => existingUser.email === email)) {
      logSecurityEvent({
        userId: user.id,
        action: 'user_creation_duplicate_email',
        ip: clientIP,
        success: false,
        error: `Attempt to create user with existing email: ${email}`
      });
      
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password: hashedPassword,
      role,
      name,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    data.users.push(newUser);
    await writeUsers(data);

    logSecurityEvent({
      userId: user.id,
      action: 'user_created',
      ip: clientIP,
      success: true,
      error: `Created user: ${email} with role: ${role}`
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    logSecurityEvent({
      userId: user.id,
      action: 'user_creation_error',
      ip: clientIP,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
});

export const DELETE = requireAdmin(async (request: NextRequest, user) => {
  const clientIP = getClientIP(request);
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const data = await readUsers();
    const userIndex = data.users.findIndex(targetUser => targetUser.id === userId);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const targetUser = data.users[userIndex];

    // Prevent deletion of default admin and self-deletion
    if (targetUser.email === 'admin@vergil.ai') {
      logSecurityEvent({
        userId: user.id,
        action: 'user_deletion_blocked_default_admin',
        ip: clientIP,
        success: false,
        error: 'Attempt to delete default admin user'
      });
      
      return NextResponse.json({ error: 'Cannot delete default admin user' }, { status: 400 });
    }

    if (targetUser.id === user.id) {
      logSecurityEvent({
        userId: user.id,
        action: 'user_deletion_blocked_self',
        ip: clientIP,
        success: false,
        error: 'Attempt to delete own account'
      });
      
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    data.users.splice(userIndex, 1);
    await writeUsers(data);

    logSecurityEvent({
      userId: user.id,
      action: 'user_deleted',
      ip: clientIP,
      success: true,
      error: `Deleted user: ${targetUser.email} (${targetUser.id})`
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logSecurityEvent({
      userId: user.id,
      action: 'user_deletion_error',
      ip: clientIP,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
});