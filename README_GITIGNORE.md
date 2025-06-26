# Module-Specific Deployment Guide

## Overview

This project contains four separate modules that can be deployed independently:
1. **Brand Book** - Design system documentation
2. **Vergil Platform** - Main AI infrastructure landing page
3. **Vergil Learn** - Educational platform landing page
4. **LMS Demo** - Learning management system demo

We use module-specific `.gitignore` files to deploy each module separately while maintaining a single codebase.

## Available .gitignore Files

- `.gitignore` - Standard development gitignore (default)
- `.gitignore.brand-book` - Deploy only the brand book module
- `.gitignore.vergil` - Deploy only the Vergil platform landing
- `.gitignore.vergil-learn` - Deploy only the Vergil Learn landing
- `.gitignore.lms` - Deploy only the LMS demo

## How to Deploy Each Module

### Important: Branch Strategy

**Never modify the .gitignore on the main branch!** Always create deployment-specific branches.

### 1. Brand Book Deployment

```bash
# Step 1: Create a deployment branch from main
git checkout main
git checkout -b deploy-brand-book

# Step 2: Apply the brand book gitignore
cp .gitignore.brand-book .gitignore

# Step 3: Commit the gitignore change
git add .gitignore
git commit -m "Configure for brand book deployment"

# Step 4: Push to your deployment platform
git push origin deploy-brand-book

# Step 5: Configure your deployment platform to deploy from 'deploy-brand-book' branch
```

### 2. Vergil Platform Landing Deployment

```bash
# Step 1: Create a deployment branch
git checkout main
git checkout -b deploy-vergil

# Step 2: Apply the platform landing gitignore
cp .gitignore.vergil .gitignore

# Step 3: Commit the change
git add .gitignore
git commit -m "Configure for Vergil platform deployment"

# Step 4: Push to deployment
git push origin deploy-vergil
```

### 3. Vergil Learn Landing Page Deployment

```bash
# Step 1: Create a deployment branch
git checkout main
git checkout -b deploy-vergil-learn

# Step 2: Apply the Vergil Learn gitignore
cp .gitignore.vergil-learn .gitignore

# Step 3: Commit the change
git add .gitignore
git commit -m "Configure for Vergil Learn deployment"

# Step 4: Push to deployment
git push origin deploy-vergil-learn
```

### 4. LMS Demo Deployment

```bash
# Step 1: Create a deployment branch
git checkout main
git checkout -b deploy-lms

# Step 2: Apply the LMS gitignore
cp .gitignore.lms .gitignore

# Step 3: Commit the change
git add .gitignore
git commit -m "Configure for LMS deployment"

# Step 4: Push to deployment
git push origin deploy-lms
```

## Maintaining Deployment Branches

### Updating Deployment Branches with New Changes

When you make changes on the main branch, update your deployment branches:

```bash
# First, commit your changes on main
git checkout main
git add .
git commit -m "Add new feature"
git push origin main

# Update brand book deployment
git checkout deploy-brand-book
git merge main  # or use cherry-pick for specific commits
git push origin deploy-brand-book

# Update landing page deployment
git checkout deploy-vergil-learn
git merge main
git push origin deploy-vergil-learn

# Update LMS deployment
git checkout deploy-lms
git merge main
git push origin deploy-lms
```

### Using Cherry-pick for Selective Updates

If you only want specific commits in a deployment:

```bash
# Find the commit hash
git log --oneline

# Apply to specific deployment branch
git checkout deploy-brand-book
git cherry-pick <commit-hash>
git push origin deploy-brand-book
```

## Platform-Specific Setup

### Vercel

1. Create three separate Vercel projects
2. Connect each to the same GitHub repo
3. Configure different production branches:
   - Brand Book project → `deploy-brand-book` branch
   - Landing project → `deploy-vergil-learn` branch
   - LMS project → `deploy-lms` branch

### Netlify

1. Create three Netlify sites
2. Connect to the same repo
3. Set production branch for each:
   - Site Settings → Build & deploy → Production branch

### GitHub Pages

For GitHub Pages, you might need to use different approaches:
- Use GitHub Actions to build and deploy from specific branches
- Or create separate repositories for each deployment

## What Each .gitignore Does

### .gitignore.brand-book
- **Keeps**: Brand book pages, documentation components, Vergil components
- **Ignores**: Landing pages (`/app/(landing)/`), LMS (`/app/lms/`), and their components

### .gitignore.vergil-learn
- **Keeps**: Landing pages, landing components, marketing content
- **Ignores**: Brand book (`/app/(brand-book)/`), LMS (`/app/lms/`), documentation components

### .gitignore.lms
- **Keeps**: LMS pages, LMS components, educational interfaces
- **Ignores**: Brand book (`/app/(brand-book)/`), landing pages (`/app/(landing)/`)

## Best Practices

1. **Always work on main** for development
2. **Never merge deployment branches back to main**
3. **Keep deployment branches up to date** with main
4. **Test locally** before pushing deployment branches:
   ```bash
   cp .gitignore.brand-book .gitignore
   npm run build
   npm run start
   # Test that only the intended module is accessible
   git checkout .gitignore  # Revert the change locally
   ```

5. **Document deployment URLs** for your team:
   ```
   Brand Book: https://brand.vergil.ai
   Landing: https://vergil.ai
   LMS Demo: https://lms-demo.vergil.ai
   ```

## Troubleshooting

### Build Errors After Applying .gitignore

If you get build errors after applying a module-specific .gitignore:
1. Ensure you've committed all changes before switching gitignores
2. Run `git clean -fd` to remove untracked files
3. Run `npm install` to ensure dependencies are intact

### Pages Not Found in Deployment

If certain pages are 404 in deployment:
1. Check that the .gitignore isn't excluding needed files
2. Verify the build output includes expected pages
3. Check your platform's routing configuration

### Reverting Changes

To revert to the standard .gitignore:
```bash
git checkout main -- .gitignore
```

## Quick Reference

```bash
# Deploy brand book
git checkout deploy-brand-book && git merge main && git push

# Deploy landing pages
git checkout deploy-vergil-learn && git merge main && git push

# Deploy LMS
git checkout deploy-lms && git merge main && git push

# Return to development
git checkout main
```