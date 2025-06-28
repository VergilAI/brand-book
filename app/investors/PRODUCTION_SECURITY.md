# Investors Portal - Production Security Configuration

## 🚨 CRITICAL SECURITY REQUIREMENTS

This document outlines the essential security configurations required before deploying the Investors Portal to production.

## 1. Environment Variables Setup

### Required Environment Variables:
```bash
# Authentication
JWT_SECRET=<strong-random-32-byte-key>
NODE_ENV=production

# Database (replace file-based storage)
DATABASE_URL=postgresql://username:password@host:port/database
DATABASE_SSL=true

# Security
ALLOWED_ORIGINS=https://your-domain.com
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Encryption
DATA_ENCRYPTION_KEY=<strong-random-32-byte-key>
```

### Generate Secure Keys:
```bash
# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Generate data encryption key
DATA_ENCRYPTION_KEY=$(openssl rand -base64 32)
```

## 2. Database Migration

### CRITICAL: Move from JSON files to encrypted database

**Current Risk**: Financial data stored in plain JSON files
**Required Action**: Migrate to PostgreSQL with encryption

```sql
-- Example table structure
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE financial_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 3. API Security Middleware

### Authentication Middleware Required for ALL API routes:

```typescript
// Create: lib/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function requireAuth(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
```

### Apply to ALL API routes:
- `/api/investors/dashboard/route.ts`
- `/api/investors/balances/route.ts`
- `/api/investors/expenses/route.ts`
- `/api/investors/revenues/route.ts`
- `/api/investors/hypotheticals/route.ts`
- `/api/investors/history/route.ts`

## 4. Data Security

### Remove Sensitive Files from Repository:
```bash
# Remove sensitive data files
git rm app/investors/data/*.json

# Add to .gitignore
echo "app/investors/data/*.json" >> .gitignore
echo ".env*" >> .gitignore
echo "!.env.example" >> .gitignore
```

### Implement Data Encryption:
```typescript
// lib/security/encryption.ts
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.DATA_ENCRYPTION_KEY!, 'base64');

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, key);
  cipher.setAAD(Buffer.from('additional-data'));
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipher(algorithm, key);
  decipher.setAAD(Buffer.from('additional-data'));
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

## 5. Security Headers

### Add to next.config.mjs:
```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/investors/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};
```

## 6. Rate Limiting

### Implement rate limiting middleware:
```typescript
// lib/middleware/rateLimit.ts
const rateLimit = new Map();

export function checkRateLimit(ip: string, maxRequests = 100, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, []);
  }
  
  const requests = rateLimit.get(ip).filter((time: number) => time > windowStart);
  
  if (requests.length >= maxRequests) {
    return false;
  }
  
  requests.push(now);
  rateLimit.set(ip, requests);
  return true;
}
```

## 7. Input Validation

### Add Zod validation to all API routes:
```typescript
import { z } from 'zod';

const balanceSchema = z.object({
  type: z.enum(['starting', 'current']),
  amount: z.number().min(0).max(1000000000),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().max(200).optional()
});

// In API route:
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = balanceSchema.parse(body);
    // ... process validated data
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
}
```

## 8. Deployment Checklist

### Pre-deployment Security Audit:
- [ ] All sensitive data removed from repository
- [ ] JWT_SECRET environment variable set to strong value
- [ ] Database migration completed with encryption
- [ ] Authentication middleware applied to all API routes
- [ ] Input validation implemented on all endpoints
- [ ] Rate limiting configured
- [ ] Security headers configured
- [ ] Test credentials removed from production builds
- [ ] Data encryption implemented for sensitive fields
- [ ] Backup and recovery procedures established
- [ ] Monitoring and alerting configured
- [ ] SSL/TLS certificates configured
- [ ] CORS properly configured for production domain only

### Monitoring Setup:
```typescript
// lib/monitoring/security.ts
export function logSecurityEvent(event: string, details: any) {
  if (process.env.NODE_ENV === 'production') {
    // Send to security monitoring service
    console.error(`SECURITY EVENT: ${event}`, details);
    // Implement alerts for suspicious activity
  }
}
```

## 9. Incident Response

### Security Incident Procedures:
1. **Immediate Response**: Isolate affected systems
2. **Assessment**: Determine scope and impact
3. **Containment**: Stop ongoing attacks
4. **Recovery**: Restore systems with security patches
5. **Post-Incident**: Review and improve security measures

### Emergency Contacts:
- Security Team: [Contact Information]
- DevOps Team: [Contact Information]
- Management: [Contact Information]

## ⚠️ PRODUCTION DEPLOYMENT WARNINGS

**DO NOT DEPLOY** without completing ALL security requirements above.

**IMMEDIATE RISKS** if deployed without security measures:
- Financial data exposure
- Unauthorized access to sensitive information
- Potential data manipulation by attackers
- Compliance violations
- Reputation damage

## Security Review Status

- [ ] Security requirements implemented
- [ ] Code review completed
- [ ] Penetration testing performed
- [ ] Compliance audit passed
- [ ] Production deployment approved

**Last Updated**: [DATE]
**Reviewed By**: [SECURITY TEAM]