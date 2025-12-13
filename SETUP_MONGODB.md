# MongoDB Setup Guide

The authentication error you're seeing is because MongoDB isn't connected. Here's how to fix it:

## Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Sign up for free MongoDB Atlas account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Create a free cluster (M0 tier)

2. **Get your connection string**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your database password
   - Add database name: `mongodb+srv://username:password@cluster.mongodb.net/expense-manager`

3. **Configure network access**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (or add your IP)

4. **Create .env file**
   ```bash
   cp .env.example .env
   ```

5. **Update .env file**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-manager
   PORT=3001
   JWT_SECRET=your-secret-key-change-this-in-production
   ```

6. **Restart the server**
   ```bash
   npm run dev
   ```

## Option 2: Local MongoDB

1. **Install MongoDB locally**
   ```bash
   # macOS
   brew install mongodb-community
   brew services start mongodb-community
   
   # Or download from https://www.mongodb.com/try/download/community
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   ```

3. **Update .env file** (default is already set for local)
   ```env
   MONGODB_URI=mongodb://localhost:27017/expense-manager
   PORT=3001
   JWT_SECRET=your-secret-key-change-this-in-production
   ```

4. **Restart the server**
   ```bash
   npm run dev
   ```

## Verify Connection

After setting up, check the server logs. You should see:
```
✅ Connected to MongoDB
```

If you see an error, check:
- MongoDB is running (for local)
- Connection string is correct
- Network access is configured (for Atlas)
- .env file exists and has correct values

## Quick Fix

If you just want to test quickly, use MongoDB Atlas (free) - it's the fastest option!

