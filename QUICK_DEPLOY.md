# ⚡ Quick Deploy Checklist

Follow these steps to deploy your Expense Manager in 10 minutes!

## ✅ Pre-Deployment Checklist

- [ ] Code is pushed to GitHub
- [ ] MongoDB Atlas is set up and accessible
- [ ] You have accounts: Vercel + Railway (both free)

## 🚀 Quick Steps

### 1. Push to GitHub (2 min)
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

### 2. Deploy Backend - Railway (3 min)

1. Go to https://railway.app → Login with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add Environment Variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=3001
   JWT_SECRET=generate-a-random-string-here-min-32-chars
   ```
5. Copy your Railway URL (e.g., `https://xxx.up.railway.app`)

### 3. Deploy Frontend - Vercel (3 min)

1. Go to https://vercel.com → Login with GitHub
2. Click "Add New..." → "Project"
3. Import your repository
4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-railway-url.up.railway.app
   ```
5. Click "Deploy"
6. Copy your Vercel URL (e.g., `https://xxx.vercel.app`)

### 4. Update Backend CORS (1 min)

1. Go back to Railway
2. Add environment variable:
   ```
   FRONTEND_URL=https://your-vercel-url.vercel.app
   ```
3. Railway will auto-redeploy

### 5. Test! (1 min)

1. Visit your Vercel URL
2. Login with your account
3. Open on your phone - it works! 🎉

## 📱 Mobile Access

Just open the Vercel URL in your phone's browser and bookmark it!

**That's it!** Your app is live and accessible from anywhere! 🚀

---

For detailed instructions, see `DEPLOY_TO_PRODUCTION.md`

