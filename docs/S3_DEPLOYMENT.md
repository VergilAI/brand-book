# S3 Integration & Vercel Deployment Guide

## Overview

This guide covers deploying the Vergil Investors Portal to Vercel with AWS S3 for data storage.

## Prerequisites

1. **AWS Account** with S3 access
2. **Vercel Account** (Pro plan recommended)
3. **S3 Bucket** created with proper permissions
4. **IAM User** with S3 access credentials

## S3 Bucket Setup

### 1. Create S3 Bucket

```bash
Bucket Name: vergil-investors-data
Region: us-east-1 (or your preferred region)
Block all public access: ✓ Enabled
Versioning: ✓ Enabled
Default encryption: ✓ Enabled (SSE-S3)
```

### 2. Bucket Structure

The application will automatically create this structure:

```
vergil-investors-data/
├── production/           # Production data
│   ├── users.json
│   ├── balances.json
│   ├── expenses.json
│   ├── revenues.json
│   └── hypotheticals.json
├── staging/              # Staging data
│   └── (same files)
└── backups/             # Automatic backups
    └── daily/
        └── YYYY-MM-DD/
            └── *.json.timestamp
```

### 3. IAM Policy

Create an IAM policy with these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::vergil-investors-data/*",
        "arn:aws:s3:::vergil-investors-data"
      ]
    }
  ]
}
```

## Local Development Setup

### 1. Environment Variables

Create `.env.local` file:

```bash
# Authentication
JWT_SECRET=your-very-secure-jwt-secret-at-least-32-chars

# S3 Configuration
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1
S3_BUCKET=vergil-investors-data

# Development Mode
USE_LOCAL_FILES=true  # Set to false to test S3 locally
NODE_ENV=development
```

### 2. Test S3 Connection

```bash
# Set USE_LOCAL_FILES=false in .env.local
# Run the application
npm run dev

# Visit the status endpoint
# http://localhost:3000/api/investors/status
```

## Data Migration

### 1. Prepare Migration

Ensure your local JSON files have data:
- `/app/investors/data/users.json`
- `/app/investors/data/balances.json`
- `/app/investors/data/expenses.json`
- `/app/investors/data/revenues.json`
- `/app/investors/data/hypotheticals.json`

### 2. Run Migration Script

```bash
# Install dependencies
npm install

# Run migration
npx tsx scripts/migrate-to-s3.ts
```

Expected output:
```
🚀 Starting migration to S3...
✅ S3 configuration detected
📦 Bucket: vergil-investors-data
🌍 Region: us-east-1
🔧 Environment: staging

📤 Starting file migration...

📊 Migration Results:
✅ Successfully migrated: 5
   - users.json
   - balances.json
   - expenses.json
   - revenues.json
   - hypotheticals.json

✨ Migration completed!
```

### 3. Verify Migration

```bash
# Test with S3
USE_LOCAL_FILES=false npm run dev

# Login and verify all data is accessible
```

## Vercel Deployment

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Configure Environment Variables

```bash
# Add each variable
vercel env add JWT_SECRET production
vercel env add AWS_ACCESS_KEY_ID production
vercel env add AWS_SECRET_ACCESS_KEY production
vercel env add AWS_REGION production
vercel env add S3_BUCKET production

# Note: Do NOT set USE_LOCAL_FILES in production
```

### 3. Deploy to Vercel

```bash
# Link your project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 4. Verify Deployment

1. Visit your Vercel URL
2. Check `/api/investors/status` endpoint
3. Verify S3 connectivity shows all green
4. Test login and data operations

## Production Checklist

### Before Deployment

- [ ] S3 bucket created with versioning enabled
- [ ] IAM credentials generated and tested
- [ ] All JSON files migrated to S3
- [ ] Local testing with S3 successful
- [ ] Environment variables set in Vercel
- [ ] JWT_SECRET is strong (32+ characters)

### After Deployment

- [ ] Status endpoint shows S3 mode active
- [ ] Login functionality works
- [ ] Data read operations work
- [ ] Data write operations work (admin only)
- [ ] Backup files being created in S3

## Monitoring

### 1. Application Status

Visit: `https://your-domain.vercel.app/api/investors/status`

Expected response:
```json
{
  "service": "Vergil Investors Portal API",
  "status": "operational",
  "dataService": {
    "mode": "S3",
    "s3Configured": true
  },
  "environment": {
    "NODE_ENV": "production",
    "S3_BUCKET": "vergil-investors-data",
    "AWS_REGION": "us-east-1"
  }
}
```

### 2. S3 Monitoring

- Enable CloudWatch metrics for the S3 bucket
- Set up alerts for failed requests
- Monitor backup creation

### 3. Vercel Monitoring

- Check Function logs in Vercel dashboard
- Monitor API response times
- Set up alerts for errors

## Troubleshooting

### Issue: "S3 is not configured"

**Solution:**
- Verify all AWS environment variables are set
- Check IAM permissions are correct
- Ensure credentials are not expired

### Issue: "Failed to read from S3"

**Solution:**
- Check S3 bucket name matches environment variable
- Verify bucket region is correct
- Check network connectivity
- Review IAM permissions

### Issue: "Authentication failed"

**Solution:**
- Verify JWT_SECRET is set in production
- Check cookies are enabled
- Ensure HTTPS is used in production

### Issue: Data not persisting

**Solution:**
- Verify S3 write permissions
- Check backup files are being created
- Monitor S3 bucket for new files
- Check Vercel function logs for errors

## Security Best Practices

1. **Rotate AWS credentials** every 90 days
2. **Use strong JWT_SECRET** (minimum 32 characters)
3. **Enable S3 versioning** for data recovery
4. **Monitor access logs** for suspicious activity
5. **Use HTTPS only** in production
6. **Implement rate limiting** for API endpoints
7. **Regular backups** to separate location

## Cost Optimization

### S3 Costs (Monthly estimate)
- Storage: < $1 (JSON files are tiny)
- Requests: < $5 (with caching)
- Data Transfer: < $1
- **Total: ~$5-10/month**

### Cost Reduction Tips
1. Enable S3 Intelligent-Tiering
2. Set lifecycle rules for old backups
3. Use CloudFront for caching (if needed)
4. Monitor and optimize request patterns

## Support

For issues or questions:
1. Check Vercel function logs
2. Review S3 bucket permissions
3. Verify environment variables
4. Test with status endpoint

---

Last updated: December 2024