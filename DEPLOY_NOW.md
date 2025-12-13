# 🚀 Deploy Now - Step by Step Guide

I'll guide you through deploying your Expense Manager to Vercel with MongoDB Atlas.

## ⚠️ Important: Local MongoDB Won't Work

Vercel runs in the cloud and **cannot access your local MongoDB**. We need to use **MongoDB Atlas** (cloud database). Don't worry - it's free and I'll help you set it up!

## 📋 Step 1: Set Up MongoDB Atlas (5 minutes)

### 1.1 Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email (or use Google/GitHub)
3. Choose **FREE** tier (M0)

### 1.2 Create Cluster

1. Choose **AWS** as cloud provider
2. Select a region close to you
3. Click **"Create Cluster"** (takes 2-3 minutes)

### 1.3 Create Database User

1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter:
   - **Username**: `expenseuser` (or any username)
   - **Password**: Create a strong password (save it!)
5. Set privileges to **"Read and write to any database"**
6. Click **"Add User"**

### 1.4 Configure Network Access

1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 1.5 Get Connection String

1. Go to **"Database"** → Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```
4. **Replace** `<username>` and `<password>` with your database user credentials
5. **Add** database name at the end: `/expense-manager`
   
   **Final format:**
   ```
   mongodb+srv://expenseuser:yourpassword@cluster0.xxxxx.mongodb.net/expense-manager
   ```

### 1.6 Update Your .env File

Open `.env` file and update:
```env
MONGODB_URI=mongodb+srv://expenseuser:yourpassword@cluster0.xxxxx.mongodb.net/expense-manager
PORT=3001
JWT_SECRET=your-strong-random-secret-key-change-this-12345678901234567890
```

### 1.7 Migrate Your Data

Run this command to migrate your expenses to MongoDB Atlas:
```bash
npm run migrate-user-expenses
```

This will:
- Connect to MongoDB Atlas
- Find your user account
- Migrate all expenses from `data/expenses.json`

## 📦 Step 2: Push Code to GitHub

### 2.1 Initialize Git (if not done)

```bash
git init
git add .
git commit -m "Ready for Vercel deployment"
```

### 2.2 Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `expense-manager`
3. **Don't** check "Initialize with README"
4. Click **"Create repository"**

### 2.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/expense-manager.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## 🚂 Step 3: Deploy Backend to Railway

### 3.1 Sign Up for Railway

1. Go to: https://railway.app
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway

### 3.2 Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `expense-manager` repository
4. Railway will auto-detect Node.js

### 3.3 Configure Environment Variables

1. Click on your service
2. Go to **"Variables"** tab
3. Add these variables:

   ```
   MONGODB_URI=mongodb+srv://expenseuser:yourpassword@cluster0.xxxxx.mongodb.net/expense-manager
   PORT=3001
   JWT_SECRET=your-strong-random-secret-key-change-this-12345678901234567890
   ```

   **Important:** Use the same values from your `.env` file!

4. Railway will auto-deploy

### 3.4 Get Your Backend URL

1. Wait for deployment to complete (green checkmark)
2. Click on your service → **"Settings"** → **"Domains"**
3. Railway provides a URL like: `https://expense-manager-production.up.railway.app`
4. **Copy this URL** - you'll need it!

### 3.5 Test Backend

Visit: `https://your-railway-url.up.railway.app/api/health`

Should return: `{"status":"ok","database":"connected"}`

## 🌐 Step 4: Deploy Frontend to Vercel

### 4.1 Sign Up for Vercel

1. Go to: https://vercel.com
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel

### 4.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Find and select your `expense-manager` repository
3. Click **"Import"**

### 4.3 Configure Project

Vercel will auto-detect Vite. Verify:
- **Framework Preset**: Vite ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `dist` ✅

### 4.4 Add Environment Variable

1. Scroll to **"Environment Variables"**
2. Add:
   ```
   VITE_API_URL=https://your-railway-url.up.railway.app
   ```
   Replace with your actual Railway URL!

### 4.5 Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for deployment
3. You'll get a URL like: `https://expense-manager.vercel.app`
4. **Copy this URL** - this is your live app!

### 4.6 Update Backend CORS

1. Go back to **Railway**
2. Add another environment variable:
   ```
   FRONTEND_URL=https://your-vercel-url.vercel.app
   ```
   Replace with your actual Vercel URL!
3. Railway will auto-redeploy

## ✅ Step 5: Test Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Click **"Sign Up"** or **"Sign In"**
3. Login with: `shubhsharma121212@gmail.com`
4. You should see all your expenses! 🎉

## 📱 Step 6: Access from Mobile

1. Open your phone's browser
2. Visit: `https://your-app.vercel.app`
3. Login with your account
4. **Bookmark it** or **Add to Home Screen** for easy access!

### Add to Home Screen:

**iOS (Safari):**
- Tap Share button (square with arrow)
- Scroll down → "Add to Home Screen"

**Android (Chrome):**
- Tap Menu (3 dots)
- "Add to Home Screen"

## 🎉 You're Done!

Your Expense Manager is now:
- ✅ Live on the internet
- ✅ Accessible from anywhere
- ✅ Works on mobile
- ✅ Secure (HTTPS)
- ✅ Auto-deploys on git push

## 🔄 Future Updates

Whenever you make changes:
1. Push to GitHub: `git push`
2. Vercel and Railway auto-deploy
3. Changes go live in 1-2 minutes!

## 🆘 Troubleshooting

**Can't connect to MongoDB?**
- Check Network Access allows 0.0.0.0/0
- Verify username/password in connection string
- Make sure database name is `/expense-manager`

**Frontend can't reach backend?**
- Check `VITE_API_URL` matches Railway URL
- Verify `FRONTEND_URL` in Railway matches Vercel URL
- Check Railway logs for errors

**401 Unauthorized?**
- Clear browser localStorage
- Login again
- Check `JWT_SECRET` is set in Railway

## 📞 Need Help?

Check the logs:
- **Railway**: Service → Deployments → View Logs
- **Vercel**: Project → Deployments → Click deployment → View Logs

---

**Your app URL will be:** `https://your-app.vercel.app`

Share this URL with anyone - they can sign up and use it too! 🚀

