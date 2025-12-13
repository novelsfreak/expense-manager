# 🚀 Deploy to Production Guide

This guide will help you deploy your Expense Manager to production so you can access it from anywhere, including your mobile!

## 📋 Prerequisites

1. **GitHub Account** (free)
2. **Vercel Account** (free) - https://vercel.com/signup
3. **Railway Account** (free) - https://railway.app/signup
4. **MongoDB Atlas** (already set up)

## 🗄️ Step 1: Verify MongoDB Atlas Setup

Make sure your MongoDB Atlas is configured:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. **Network Access**: Make sure "Allow Access from Anywhere" (0.0.0.0/0) is enabled
3. **Database User**: Make sure you have a user with read/write permissions
4. **Connection String**: Copy your connection string (you'll need it)

## 🚂 Step 2: Deploy Backend to Railway

### 2.1. Push Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., `expense-manager`)
   - **Don't** initialize with README

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/expense-manager.git
   git branch -M main
   git push -u origin main
   ```

### 2.2. Deploy to Railway

1. **Sign up/Login to Railway**: https://railway.app
   - Click "Login with GitHub"
   - Authorize Railway

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `expense-manager` repository
   - Railway will auto-detect Node.js

3. **Configure Environment Variables**:
   - Click on your service
   - Go to "Variables" tab
   - Add these variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     PORT=3001
     JWT_SECRET=your-strong-random-secret-key-change-this
     FRONTEND_URL=https://your-vercel-app.vercel.app
     ```
   - **Important**: Replace with your actual values!
   - For `FRONTEND_URL`, you'll update this after deploying frontend

4. **Get Your Backend URL**:
   - Railway will provide a URL like: `https://your-app.up.railway.app`
   - Copy this URL - you'll need it for frontend!

5. **Deploy**:
   - Railway will automatically deploy
   - Wait for deployment to complete (green checkmark)
   - Test: Visit `https://your-app.up.railway.app/api/health`
   - Should return: `{"status":"ok","database":"connected"}`

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1. Deploy to Vercel

1. **Sign up/Login to Vercel**: https://vercel.com
   - Click "Sign Up" → "Continue with GitHub"
   - Authorize Vercel

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository (`expense-manager`)
   - Vercel will auto-detect Vite

3. **Configure Project**:
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
   - **Install Command**: `npm install` (default)

4. **Add Environment Variables**:
   - Go to "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-railway-app.up.railway.app
     ```
   - Replace with your Railway backend URL!

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment (usually 1-2 minutes)
   - You'll get a URL like: `https://expense-manager.vercel.app`

### 3.2. Update Backend CORS

1. **Go back to Railway**:
   - Update `FRONTEND_URL` environment variable:
     ```
     FRONTEND_URL=https://your-vercel-app.vercel.app
     ```
   - Replace with your actual Vercel URL
   - Railway will automatically redeploy

## ✅ Step 4: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-app.vercel.app`
2. **Sign up/Login** with your account
3. **Verify expenses** are loading correctly
4. **Test on mobile**: Open the URL on your phone's browser!

## 📱 Step 5: Access from Mobile

1. **Open your phone's browser** (Safari, Chrome, etc.)
2. **Visit**: `https://your-app.vercel.app`
3. **Bookmark it** for easy access!
4. **Add to Home Screen** (iOS/Android) for app-like experience

### iOS (Safari):
- Tap Share button → "Add to Home Screen"

### Android (Chrome):
- Menu → "Add to Home Screen"

## 🔧 Troubleshooting

### Backend not connecting to MongoDB
- Check MongoDB Atlas Network Access allows all IPs (0.0.0.0/0)
- Verify `MONGODB_URI` is correct in Railway
- Check Railway logs for connection errors

### Frontend can't reach backend
- Verify `VITE_API_URL` is set correctly in Vercel
- Check CORS settings in backend
- Make sure `FRONTEND_URL` in Railway matches your Vercel URL

### 401 Unauthorized errors
- Clear browser localStorage
- Login again
- Check JWT_SECRET is set in Railway

### Expenses not loading
- Check browser console for errors
- Verify backend is running (check Railway logs)
- Make sure you're logged in

## 🔐 Security Checklist

- [ ] Changed `JWT_SECRET` to a strong random string
- [ ] MongoDB Atlas network access configured
- [ ] CORS configured correctly
- [ ] Environment variables set in both platforms
- [ ] HTTPS enabled (automatic with Vercel/Railway)

## 📊 Monitoring

### Railway Logs:
- Go to Railway → Your Service → "Deployments" → Click deployment → "View Logs"

### Vercel Analytics:
- Vercel dashboard shows deployment status and analytics

## 🎉 You're Done!

Your app is now live and accessible from anywhere:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.up.railway.app`

Access it from:
- ✅ Desktop browser
- ✅ Mobile browser
- ✅ Any device with internet!

## 💡 Pro Tips

1. **Custom Domain**: Add your own domain in Vercel settings
2. **Auto-deploy**: Every push to GitHub auto-deploys
3. **Environment Variables**: Keep secrets in platform settings, not in code
4. **Monitoring**: Check Railway logs if something breaks

## 🆘 Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Check deployment logs in both platforms

