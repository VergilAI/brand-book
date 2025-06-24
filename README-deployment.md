# Vergil Learn - Deployment Branch

This is a minimal deployment branch containing only:
- `/vergil-learn` - Main learning platform page
- `/contact` - Contact form page
- `/` - Redirects to `/vergil-learn`

## Deployment to Vercel

1. Push this branch to GitHub:
```bash
git add .
git commit -m "Prepare deployment branch with vergil-learn and contact pages only"
git push origin deployment
```

2. In Vercel:
   - Import the project from GitHub
   - Select the `deployment` branch
   - Deploy

## Pages Available
- `/vergil-learn` - Main Vergil Learn landing page
- `/contact` - Contact form
- All other routes will show a 404 page

## Archived Content
All other pages have been moved to `_archived_pages/` directory and are excluded from the deployment.