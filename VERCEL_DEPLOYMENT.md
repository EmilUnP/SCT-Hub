# Vercel Deployment Guide

## Environment Variables Setup

Your app requires Supabase environment variables to work correctly. These must be set in your Vercel project settings.

### Required Environment Variables

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### How to Set Environment Variables in Vercel

#### Option 1: Via Vercel Dashboard (Recommended)

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project (`sct-hub`)
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

   **Variable 1:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://vinbdgvmijczcunvkjde.supabase.co`
   - **Environment**: Select all (Production, Preview, Development)

   **Variable 2:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: `sb_publishable_3XpWDm7VwOHAkjfZKpIaEw_FE-z88jJ`
   - **Environment**: Select all (Production, Preview, Development)

5. Click **Save**
6. **Important**: After adding variables, you need to **redeploy** your application:
   - Go to **Deployments** tab
   - Click the **⋯** (three dots) on the latest deployment
   - Select **Redeploy**
   - Or push a new commit to trigger a redeploy

#### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# When prompted, enter: https://vinbdgvmijczcunvkjde.supabase.co
# Select all environments (Production, Preview, Development)

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# When prompted, enter: sb_publishable_3XpWDm7VwOHAkjfZKpIaEw_FE-z88jJ
# Select all environments (Production, Preview, Development)

# Redeploy
vercel --prod
```

## Verifying Environment Variables

After setting the variables and redeploying:

1. Check the deployment logs in Vercel
2. Look for: `✅ Supabase configured:` in the logs (if logging is enabled)
3. Test the login functionality on your deployed site
4. Check browser console - you should NOT see `placeholder.supabase.co` errors

## Troubleshooting

### Still seeing "placeholder.supabase.co" errors?

1. **Verify variables are set correctly:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Make sure both variables are listed
   - Check that they're enabled for the correct environment (Production)

2. **Redeploy after setting variables:**
   - Environment variables are only loaded when the app is built
   - You MUST redeploy after adding/changing environment variables

3. **Check variable names:**
   - Must be exactly: `NEXT_PUBLIC_SUPABASE_URL` (case-sensitive)
   - Must be exactly: `NEXT_PUBLIC_SUPABASE_ANON_KEY` (case-sensitive)
   - The `NEXT_PUBLIC_` prefix is required for client-side access

4. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or use incognito/private window

### Login still not working?

1. Check browser console for specific error messages
2. Verify Supabase project is active and accessible
3. Check Supabase dashboard for any service issues
4. Verify the API keys are correct in Vercel

## Quick Checklist

- [ ] Environment variables added in Vercel Dashboard
- [ ] Variables enabled for Production environment
- [ ] Application redeployed after adding variables
- [ ] No `placeholder.supabase.co` errors in browser console
- [ ] Login functionality works on deployed site

## Security Notes

- ✅ Environment variables in Vercel are encrypted and secure
- ✅ Never commit `.env.local` to git (already in `.gitignore`)
- ✅ The `NEXT_PUBLIC_` prefix makes these variables accessible to the browser (required for Supabase client)
- ⚠️ These are public keys (anon key), but still keep them secure

