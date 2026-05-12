# Vercel Deployment Guide

## Overview

This guide will help you deploy the YGN TV SRT File Editor to Vercel with proper Supabase authentication setup.

## Prerequisites

- GitHub account with the repository
- Vercel account (https://vercel.com)
- Supabase project with credentials

## Step 1: Prepare Environment Variables

The project uses the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** These are public variables (prefixed with `NEXT_PUBLIC_`) and are safe to expose in the browser.

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository (`Jeff-YANGONtv/YGN-TV-SRT-FILE-EDITOR-`)
4. Configure project settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`
   - **Output Directory:** `.next`

5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

6. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Step 3: Configure Supabase Auth

### Update Supabase Auth Settings

1. Go to your Supabase project dashboard
2. Navigate to **Authentication → Providers → Email**
3. Enable email authentication if not already enabled

### Add Vercel Domain to Supabase

1. In Supabase, go to **Authentication → URL Configuration**
2. Add your Vercel deployment URL to **Redirect URLs**:
   - `https://your-vercel-app.vercel.app/auth/callback`
   - `https://your-vercel-app.vercel.app/login`
   - `https://your-vercel-app.vercel.app/`

## Step 4: Test Authentication

1. Visit your deployed app at `https://your-vercel-app.vercel.app`
2. Test the registration flow:
   - Click "Register Now" or go to `/` 
   - Fill in the registration form
   - Check your email for confirmation link
3. Test the login flow:
   - Go to `/login`
   - Enter your credentials
   - You should be redirected to `/edit/new`

## Troubleshooting

### Issue: "Auth session not syncing"

**Solution:** This is now fixed with the Supabase SSR middleware. The middleware automatically:
- Refreshes user sessions
- Syncs authentication state across pages
- Handles cookie management

### Issue: "CORS errors"

**Solution:** Make sure your Supabase project has the correct redirect URLs configured (see Step 3).

### Issue: "Environment variables not loading"

**Solution:** 
1. Verify variables are set in Vercel project settings
2. Redeploy after adding new variables
3. Check that variable names match exactly (case-sensitive)

## Architecture Changes

### What's New

1. **Middleware (`middleware.ts`)** - Handles auth session refresh on every request
2. **Server Client (`lib/supabase/server.ts`)** - For server-side operations
3. **Client Client (`lib/supabase/client.ts`)** - For browser-side operations
4. **SSR Support** - Full Server-Side Rendering support with Supabase

### Key Files Modified

- `lib/supabase.ts` - Now imports from new SSR clients
- `app/login/page.tsx` - Uses client-side Supabase client
- `app/page.tsx` - Uses client-side Supabase client
- `middleware.ts` - New file for auth state management
- `package.json` - Added `@supabase/ssr` dependency

## Performance Tips

1. **Caching:** Vercel automatically caches static assets
2. **Edge Functions:** Consider using Vercel Edge Functions for API routes
3. **Image Optimization:** Use Next.js Image component for better performance

## Security Considerations

1. **Public Keys Only:** The `NEXT_PUBLIC_` prefixed variables are safe to expose
2. **Row Level Security:** Configure RLS policies in Supabase for data protection
3. **HTTPS:** Vercel automatically provides HTTPS for all deployments

## Support

For issues with:
- **Vercel:** https://vercel.com/support
- **Supabase:** https://supabase.com/docs
- **Next.js:** https://nextjs.org/docs

## Additional Resources

- [Supabase + Next.js Documentation](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
