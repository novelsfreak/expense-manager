# 🚀 Deploy to Vercel - Step by Step

Your code is on GitHub: https://github.com/novelsfreak/expense-manager

## 📋 Pre-Deployment Checklist

Before deploying, make sure you have:

- [x] ✅ Code pushed to GitHub
- [ ] MongoDB Atlas account (free)
- [ ] MongoDB Atlas connection string
- [ ] Vercel account (free)

## 🗄️ Step 1: Set Up MongoDB Atlas (If Not Done)

### 1.1 Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free)
3. Create a **FREE** cluster (M0 tier)

### 1.2 Configure Database Access
1. Go to **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username and password (save these!)
5. Set privileges to **"Read and write to any database"**
6. Click **"Add User"**

### 1.3 Configure Network Access
1. Go to **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 1.4 Get Connection String
1. Go to **"Database"** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy connection string
4. Replace `<username>` and `<password>` with your database user credentials
5. Add `/expense-manager` at the end

**Example:**
```
mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/expense-manager
```

## 🌐 Step 2: Deploy to Vercel

### 2.1 Sign Up/Login to Vercel

1. Go to: **https://vercel.com**
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub

### 2.2 Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Find and select **"novelsfreak/expense-manager"**
3. Click **"Import"**

### 2.3 Configure Project Settings

Vercel will auto-detect Vite. Verify these settings:

- **Framework Preset**: Vite ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `dist` ✅
- **Install Command**: `npm install` ✅

### 2.4 Add Environment Variables

**Before clicking Deploy**, scroll down to **"Environment Variables"** and add:

```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/expense-manager
JWT_SECRET=your-strong-random-secret-key-minimum-32-characters-long-12345678901234567890
FRONTEND_URL=https://your-app.vercel.app
```

**Important:**
- Replace `MONGODB_URI` with your actual MongoDB Atlas connection string
- Replace `JWT_SECRET` with a strong random string (at least 32 characters)
- For `FRONTEND_URL`, you'll update this after first deployment with your actual Vercel URL

### 2.5 Deploy

1. Click **"Deploy"** button
2. Wait 2-3 minutes for deployment
3. Vercel will:
   - Install dependencies
   - Build frontend (React/Vite)
   - Set up serverless functions (API routes)
   - Deploy everything

### 2.6 Get Your URL

After deployment completes:
- You'll get a URL like: `https://expense-manager-xxxxx.vercel.app`
- **Copy this URL!**

### 2.7 Update FRONTEND_URL

1. Go to **Project Settings** → **Environment Variables**
2. Update `FRONTEND_URL` to your actual Vercel URL:
   ```
   FRONTEND_URL=https://expense-manager-xxxxx.vercel.app
   ```
3. Vercel will **auto-redeploy** (or click "Redeploy")

## 📊 Step 3: Migrate Your Expenses

After deployment, migrate your expenses to MongoDB Atlas:

### Option A: Run Migration Script Locally

1. Update your local `.env` file with MongoDB Atlas connection string
2. Run:
   ```bash
   npm run migrate-user-expenses
   ```

### Option B: Create User and Add Expenses via App

1. Visit your Vercel URL
2. Sign up with `shubhsharma121212@gmail.com` (or login if already exists)
3. Add expenses manually (or they'll be there if already migrated)

## ✅ Step 4: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-app.vercel.app`
2. **Test API**: Visit `https://your-app.vercel.app/api/health`
   - Should return: `{"status":"ok","database":"connected"}`
3. **Sign up/Login** with your account
4. **Verify expenses** are showing

## 📱 Step 5: Access from Mobile

1. Open your phone's browser
2. Visit: `https://your-app.vercel.app`
3. Login with your account
4. **Bookmark** or **Add to Home Screen**

## 🔄 Step 6: Future Updates

Whenever you make changes:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

2. **Vercel auto-deploys** in 1-2 minutes!

## 🆘 Troubleshooting

### API Not Working?

1. Check **Vercel Functions** logs:
   - Project → **Deployments** → Click deployment → **Functions** tab
2. Verify **Environment Variables** are set correctly
3. Check MongoDB Atlas connection string

### Database Not Connecting?

1. Check MongoDB Atlas **Network Access** allows all IPs (0.0.0.0/0)
2. Verify `MONGODB_URI` is correct in Vercel
3. Check Vercel function logs for connection errors

### Expenses Not Showing?

1. Make sure you're **logged in**
2. Check **month dropdown** - select the month with expenses
3. Check browser console (F12) for errors
4. Verify expenses were migrated to MongoDB Atlas

## 🎉 Success!

Once deployed, your app will be:
- ✅ **Live on the internet**
- ✅ **Accessible from anywhere**
- ✅ **Works on mobile**
- ✅ **HTTPS enabled**
- ✅ **Auto-deploys on git push**

**Your app URL:** `https://your-app.vercel.app`

Share this URL with anyone - they can sign up and use it too! 🚀

