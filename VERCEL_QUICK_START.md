# ⚡ Vercel Quick Start - 5 Minutes

Deploy everything to Vercel in 5 minutes!

## 🚀 Quick Steps

### 1. Push to GitHub (1 min)

```bash
# If you haven't pushed yet:
git remote add origin https://github.com/YOUR_USERNAME/expense-manager.git
git push -u origin main

# Or if repo exists:
git push origin main
```

### 2. Deploy to Vercel (2 min)

1. Go to: https://vercel.com → **Login with GitHub**
2. Click **"Add New..."** → **"Project"**
3. **Import** your `expense-manager` repo
4. Click **"Deploy"** (Vercel auto-detects Vite)

### 3. Add Environment Variables (1 min)

After first deployment, go to **Project Settings** → **Environment Variables**:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-manager
JWT_SECRET=your-strong-random-secret-key-min-32-chars
FRONTEND_URL=https://your-app.vercel.app
```

**Then redeploy** (or wait for auto-redeploy)

### 4. Test! (1 min)

Visit: `https://your-app.vercel.app`

✅ **Done!** Your app is live!

## 📱 Mobile Access

Just open the Vercel URL on your phone!

## 🎉 Benefits

- ✅ **One platform** (no Railway needed)
- ✅ **Free** hosting
- ✅ **Auto-deploys** on git push
- ✅ **Serverless** (scales automatically)
- ✅ **HTTPS** enabled

---

**That's it!** See `DEPLOY_VERCEL_ONLY.md` for detailed guide.

