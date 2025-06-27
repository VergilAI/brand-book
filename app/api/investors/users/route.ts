import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { promises as fs } from 'fs';
import path from 'path';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'vergil-investors-portal-secret-key-2024'
);

const USERS_FILE = path.join(process.cwd(), 'app', 'investors', 'data', 'users.json');

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
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [] };
  }
}

async function writeUsers(data: UsersData): Promise<void> {
  await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));
}

async function verifyAuth(request: NextRequest): Promise<any | null> {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  
  if (!auth || auth.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await readUsers();
  const users = data.users.map(({ password, ...user }) => user);
  
  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request);
  
  if (!auth || auth.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, password, name, role = 'investor' } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const data = await readUsers();
    
    if (data.users.some(user => user.email === email)) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
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

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await verifyAuth(request);
  
  if (!auth || auth.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const data = await readUsers();
    const userIndex = data.users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (data.users[userIndex].email === 'admin@vergil.ai') {
      return NextResponse.json({ error: 'Cannot delete default admin user' }, { status: 400 });
    }

    data.users.splice(userIndex, 1);
    await writeUsers(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}