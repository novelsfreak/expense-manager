# Quick Start Guide

## 🚀 For Production Deployment

### 1. Set up MongoDB Atlas (Free Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account and cluster
3. Create a database user (save username/password)
4. Allow access from anywhere in Network Access
5. Get your connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/expense-manager`)

### 2. Set Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-manager
PORT=3001
```

### 3. Migrate Existing Data (if you have JSON file)

```bash
npm run migrate
```

### 4. Run Locally

```bash
npm run dev
```

## 📦 What Changed

✅ **Database**: Switched from JSON file to MongoDB (works in production!)
✅ **Environment Variables**: Added support for `.env` file
✅ **Migration Script**: Easy way to move existing data to MongoDB
✅ **Production Ready**: Can deploy to Vercel, Railway, Render, etc.

## 🌐 Deployment

See `DEPLOYMENT.md` for detailed deployment instructions to:
- Vercel (Frontend) + Railway/Render (Backend)
- Render (Full Stack)
- Heroku

## 💡 Local Development

The app will work with:
- **Local MongoDB**: `mongodb://localhost:27017/expense-manager`
- **MongoDB Atlas**: Your cloud connection string

Just set `MONGODB_URI` in your `.env` file!

