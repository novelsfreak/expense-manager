# Deployment Guide

This guide will help you deploy the Expense Manager application to production using MongoDB Atlas (free cloud database) and popular hosting platforms.

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Create a new cluster (choose the FREE tier)

### Step 2: Configure Database Access
1. Go to **Database Access** → Click **Add New Database User**
2. Create a username and password (save these!)
3. Set privileges to **Read and write to any database**

### Step 3: Configure Network Access
1. Go to **Network Access** → Click **Add IP Address**
2. Click **Allow Access from Anywhere** (or add your server's IP for production)
3. Click **Confirm**

### Step 4: Get Connection String
1. Go to **Database** → Click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
4. Add your database name: `mongodb+srv://username:password@cluster.mongodb.net/expense-manager`

## 🚀 Deployment Options

### Option 1: Deploy to Vercel (Frontend) + Railway/Render (Backend)

#### Backend Deployment (Railway)

1. **Sign up for Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click **New Project** → **Deploy from GitHub repo**
   - Select your repository
   - Railway will auto-detect Node.js
   - Add environment variable:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     PORT=3001
     ```
   - Railway will provide a URL like: `https://your-app.railway.app`

#### Frontend Deployment (Vercel)

1. **Sign up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click **New Project** → Import your repository
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Add environment variable:
     ```
     VITE_API_URL=https://your-app.railway.app
     ```
   - Update `src/utils/storage.ts` to use `import.meta.env.VITE_API_URL` instead of hardcoded URL

### Option 2: Deploy to Render (Full Stack)

1. **Sign up for Render**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click **New** → **Web Service**
   - Connect your repository
   - Settings:
     - **Name**: expense-manager-api
     - **Environment**: Node
     - **Build Command**: (leave empty)
     - **Start Command**: `node server/index.js`
     - **Environment Variables**:
       ```
       MONGODB_URI=your_mongodb_atlas_connection_string
       PORT=3001
       ```

3. **Deploy Frontend**
   - Click **New** → **Static Site**
   - Connect your repository
   - Settings:
     - **Build Command**: `npm run build`
     - **Publish Directory**: `dist`
     - **Environment Variables**:
       ```
       VITE_API_URL=https://your-backend-url.onrender.com
       ```

### Option 3: Deploy to Heroku

#### Backend Deployment

1. Install Heroku CLI: `brew install heroku/brew/heroku`
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
   heroku config:set PORT=3001
   ```
5. Deploy: `git push heroku main`

## 🔧 Local Development Setup

1. **Install MongoDB locally** (optional, or use MongoDB Atlas)
   ```bash
   # macOS
   brew install mongodb-community
   brew services start mongodb-community
   ```

2. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` with your MongoDB connection string**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-manager
   PORT=3001
   ```

4. **Migrate existing data** (if you have JSON file)
   ```bash
   npm run migrate
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

## 📝 Update Frontend for Production

Update `src/utils/storage.ts` to use environment variable:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
```

Then set `VITE_API_URL` in your hosting platform's environment variables.

## ✅ Post-Deployment Checklist

- [ ] MongoDB Atlas cluster is running
- [ ] Database user has read/write permissions
- [ ] Network access allows your server IP
- [ ] Environment variables are set correctly
- [ ] Backend is accessible and returns data
- [ ] Frontend can connect to backend API
- [ ] CORS is configured correctly
- [ ] Health check endpoint works: `/api/health`

## 🐛 Troubleshooting

### Backend can't connect to MongoDB
- Check MongoDB Atlas network access settings
- Verify connection string is correct
- Ensure database user has correct permissions

### Frontend can't reach backend
- Check CORS settings in backend
- Verify `VITE_API_URL` environment variable
- Check browser console for CORS errors

### Data not persisting
- Verify MongoDB connection is successful
- Check backend logs for errors
- Ensure environment variables are set correctly

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)

