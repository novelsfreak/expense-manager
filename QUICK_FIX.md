# Quick Fix: MongoDB Connection

Your server is trying to connect to MongoDB but it's not running. Here's the fastest way to fix it:

## 🚀 Quick Solution: Use MongoDB Atlas (Free Cloud Database)

### Step 1: Get MongoDB Atlas Connection String (5 minutes)

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas/register
2. **Sign up** for a free account
3. **Create a free cluster** (M0 - Free tier)
4. **Wait 2-3 minutes** for cluster to be created
5. **Click "Connect"** on your cluster
6. **Choose "Connect your application"**
7. **Copy the connection string** - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```

### Step 2: Configure Database Access

1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username and password (save these!)
5. Set privileges to **"Read and write to any database"**
6. Click **"Add User"**

### Step 3: Configure Network Access

1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (or add your IP)
4. Click **"Confirm"**

### Step 4: Update Your Connection String

1. Take the connection string from Step 1
2. Replace `<username>` with your database username
3. Replace `<password>` with your database password
4. Add `/expense-manager` at the end

**Example:**
```
mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/expense-manager
```

### Step 5: Update .env File

Open `.env` file in your project root and update:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/expense-manager
PORT=3001
JWT_SECRET=your-secret-key-change-this-in-production-12345
```

**Important:** Replace the entire `MONGODB_URI` line with your actual connection string!

### Step 6: Restart Server

```bash
npm run dev
```

You should now see:
```
✅ Connected to MongoDB
```

Then try signing up again - it will work! 🎉

---

## Alternative: Install Local MongoDB

If you prefer local MongoDB:

### macOS:
```bash
brew install mongodb-community
brew services start mongodb-community
```

### Then restart your server:
```bash
npm run dev
```

---

## Still Having Issues?

1. Make sure `.env` file exists in project root
2. Check connection string has no spaces
3. Verify username/password are correct
4. Check Network Access allows your IP
5. Wait a few minutes after creating cluster (takes time to provision)

