# Quick Start Guide

## Project Organization Summary

### What We've Done

1. **Cleaned Up Redundant Files**
   - Removed duplicate `next.config.ts`
   - Removed default Next.js SVG assets

2. **Created Hierarchical Documentation**
   - Root `CLAUDE.md` - General project info
   - Module-specific CLAUDE.md files:
     - `/app/(brand-book)/CLAUDE.md` - Brand book details
     - `/app/(landing)/CLAUDE.md` - Landing page guide
     - `/app/lms/CLAUDE.md` - LMS module docs
     - `/components/CLAUDE.md` - Component library docs
     - `/public/data/CLAUDE.md` - Data files docs

3. **Deployment Configuration**
   - `.gitignore.brand-book` - Deploy only brand book
   - `.gitignore.vergil-learn` - Deploy only landing
   - `.gitignore.lms` - Deploy only LMS

4. **Organized Data Files**
   - `/public/data/graph/basic/` - Basic graphs
   - `/public/data/graph/animated/` - Animated graphs
   - `/public/data/graph/staged/` - Staged animations

## How to Use

### For Development
```bash
# Install dependencies
npm install

# Run all modules locally
npm run dev
```

### For Module-Specific Deployment

**Deploy Brand Book Only:**
```bash
git checkout -b deploy-brand-book
cp .gitignore.brand-book .gitignore
git add .gitignore
git commit -m "Configure for brand book deployment"
# Push to deployment platform
```

**Deploy Landing Page Only:**
```bash
git checkout -b deploy-vergil-learn
cp .gitignore.vergil-learn .gitignore
git add .gitignore
git commit -m "Configure for landing deployment"
# Push to deployment platform
```

**Deploy LMS Only:**
```bash
git checkout -b deploy-lms
cp .gitignore.lms .gitignore
git add .gitignore
git commit -m "Configure for LMS deployment"
# Push to deployment platform
```

### Finding Documentation

- **General Info**: Read `/CLAUDE.md`
- **Brand Book**: Read `/app/(brand-book)/CLAUDE.md`
- **Landing Page**: Read `/app/(landing)/CLAUDE.md`
- **LMS**: Read `/app/lms/CLAUDE.md`
- **Components**: Read `/components/CLAUDE.md`
- **Deployment**: Read `/DEPLOYMENT.md`

### Key Benefits

1. **Reduced Bloat**: Each CLAUDE.md is focused and concise
2. **Easy Deployment**: Deploy individual modules without others
3. **Better Organization**: Clear separation of concerns
4. **Maintainable**: Update docs where they're relevant

### Next Steps

1. Continue developing your modules independently
2. Use branch-specific deployments for each product
3. Keep documentation updated in respective CLAUDE.md files
4. Consider separate repositories if modules grow significantly