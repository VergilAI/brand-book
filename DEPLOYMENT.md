# Deployment Guide

## Overview

This guide explains how to deploy individual modules from the Vergil Design System repository.

## Module-Specific Deployment

### Option 1: Using Branch-Specific .gitignore

1. **Brand Book Only**
   ```bash
   git checkout -b deploy-brand-book
   cp .gitignore.brand-book .gitignore
   git add .gitignore
   git commit -m "Configure for brand book deployment"
   npm run build
   # Deploy to your platform
   ```

2. **Vergil Learn Landing Only**
   ```bash
   git checkout -b deploy-vergil-learn
   cp .gitignore.vergil-learn .gitignore
   git add .gitignore
   git commit -m "Configure for landing page deployment"
   npm run build
   # Deploy to your platform
   ```

3. **LMS Demo Only**
   ```bash
   git checkout -b deploy-lms
   cp .gitignore.lms .gitignore
   git add .gitignore
   git commit -m "Configure for LMS deployment"
   npm run build
   # Deploy to your platform
   ```

### Option 2: Environment-Based Routing

Configure your deployment platform to use environment variables:

```env
# For Brand Book
NEXT_PUBLIC_MODULE=brand-book

# For Vergil Learn
NEXT_PUBLIC_MODULE=vergil-learn

# For LMS
NEXT_PUBLIC_MODULE=lms
```

Then modify `next.config.mjs` to redirect based on module:

```javascript
const module = process.env.NEXT_PUBLIC_MODULE

const redirects = {
  'brand-book': [
    { source: '/', destination: '/brand', permanent: false }
  ],
  'vergil-learn': [
    { source: '/', destination: '/landing', permanent: false }
  ],
  'lms': [
    { source: '/', destination: '/lms', permanent: false }
  ]
}
```

## Vercel Deployment

### Multiple Projects Approach

1. Create separate Vercel projects:
   - `vergil-brand-book`
   - `vergil-learn`
   - `vergil-lms`

2. Configure each project:
   - Set different `Root Directory` in project settings
   - Or use environment variables to control routing

### Monorepo Configuration

Create `vercel.json` in root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/**/*.{js,jsx,ts,tsx}": {
      "memory": 1024
    }
  }
}
```

## Netlify Deployment

Use `netlify.toml` for configuration:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.brand-book]
  environment = { NEXT_PUBLIC_MODULE = "brand-book" }

[context.vergil-learn]
  environment = { NEXT_PUBLIC_MODULE = "vergil-learn" }

[context.lms]
  environment = { NEXT_PUBLIC_MODULE = "lms" }
```

## Docker Deployment

Create module-specific Dockerfiles:

```dockerfile
# Dockerfile.brand-book
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
COPY .gitignore.brand-book .gitignore
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

## Best Practices

1. **Branch Strategy**
   - Keep `main` branch with all modules
   - Create deployment branches for each module
   - Use GitHub Actions for automated deployment

2. **Environment Variables**
   - Store sensitive data in platform secrets
   - Use `.env.local` for local development
   - Never commit `.env` files

3. **Performance**
   - Enable Next.js automatic static optimization
   - Use ISR (Incremental Static Regeneration) where applicable
   - Implement proper caching headers

4. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor Core Web Vitals
   - Track deployment success rates

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed
- Check for TypeScript errors: `npm run type-check`
- Verify environment variables are set

### 404 Errors
- Check routing configuration
- Ensure pages are not excluded by .gitignore
- Verify build output includes expected pages

### Performance Issues
- Analyze bundle size: `npm run analyze`
- Check for unnecessary imports
- Optimize images and assets