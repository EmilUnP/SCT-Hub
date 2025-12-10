# Deployment Checklist for Vercel

## ✅ Pre-Deployment Checks

### 1. Environment Variables
Ensure these are set in Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Build Configuration
- ✅ `next.config.js` is properly configured
- ✅ No `generateBuildId` that changes on every build
- ✅ Image domains are configured

### 3. File Structure
- ✅ `app/page.tsx` exists and exports default component
- ✅ `app/layout.tsx` exists and exports default component
- ✅ All routes have proper `page.tsx` files

### 4. Dependencies
- ✅ All dependencies are in `package.json`
- ✅ No missing peer dependencies

## 🔧 Common Issues & Fixes

### Issue: 404 on Root Route
**Possible Causes:**
1. Root page not being generated during build
2. Runtime error preventing page from loading
3. Environment variables missing

**Solutions:**
- Check Vercel build logs for errors
- Verify environment variables are set
- Check browser console for runtime errors
- Ensure `app/page.tsx` has proper default export

### Issue: Build Fails
**Check:**
- TypeScript errors
- Missing dependencies
- Import errors
- Environment variable issues

## 📋 Post-Deployment Verification

1. ✅ Root route (`/`) loads correctly
2. ✅ All static routes work
3. ✅ Dynamic routes work
4. ✅ Images load correctly
5. ✅ No console errors
6. ✅ Environment variables are accessible

## 🚀 Deployment Steps

1. Push code to Git repository
2. Vercel will automatically detect and deploy
3. Check build logs for any errors
4. Verify environment variables are set
5. Test the deployed site

## 🔍 Debugging

### Check Vercel Logs
- Go to Vercel Dashboard → Your Project → Logs
- Look for runtime errors
- Check function logs

### Check Build Output
- Verify all routes are listed in build output
- Check if root route (`/`) is generated
- Look for any warnings or errors

### Test Locally
```bash
npm run build
npm start
```
Visit `http://localhost:3000` to test production build locally.

