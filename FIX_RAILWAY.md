# 🔧 Fix Railway Deployment Issue

If you're seeing a GraphQL API message instead of your Expense Manager API, here's how to fix it:

## 🐛 The Problem

Railway might be:
1. Auto-detecting the wrong service
2. Using the wrong start command
3. Deploying a different service from your repo

## ✅ Solution

### Step 1: Check Railway Service Configuration

1. Go to your **Railway dashboard**
2. Click on your **service**
3. Go to **"Settings"** tab
4. Check **"Start Command"** - it should be:
   ```
   node server/index.js
   ```
   OR
   ```
   npm start
   ```

### Step 2: Update Start Command

If it's wrong:
1. Click **"Edit"** on Start Command
2. Set it to: `node server/index.js`
3. Click **"Save"**
4. Railway will redeploy

### Step 3: Check Service Detection

1. Go to **"Settings"** → **"Service Details"**
2. Make sure it's detecting as **Node.js**
3. If not, you can manually set:
   - **Build Command**: (leave empty or `npm install`)
   - **Start Command**: `node server/index.js`

### Step 4: Verify Root Route

After redeployment, visit your Railway URL root:
```
https://your-app.up.railway.app/
```

You should see:
```json
{
  "message": "Expense Manager API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "auth": "/api/auth",
    "expenses": "/api/expenses"
  }
}
```

### Step 5: Test Health Endpoint

Visit:
```
https://your-app.up.railway.app/api/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected"
}
```

## 🔍 Troubleshooting

### If Still Seeing GraphQL Message:

1. **Check Railway Logs**:
   - Go to your service → **"Deployments"** → Click latest → **"View Logs"**
   - Look for errors or wrong service starting

2. **Check for Multiple Services**:
   - Railway might have detected multiple services
   - Make sure only ONE service is deployed
   - Delete any duplicate services

3. **Redeploy from Scratch**:
   - Delete the current service
   - Create new service
   - Deploy from GitHub repo
   - Set start command: `node server/index.js`

4. **Check package.json**:
   - Make sure `"start"` script exists: `"start": "node server/index.js"`

5. **Verify Files**:
   - Make sure `server/index.js` exists in your repo
   - Make sure it's pushed to GitHub

## ✅ Quick Fix Commands

If you have Railway CLI installed:
```bash
railway service
railway variables set START_COMMAND="node server/index.js"
railway up
```

## 🎯 Expected Behavior

After fixing, your Railway URL should:
- **Root (`/`)**: Show Expense Manager API info
- **`/api/health`**: Show health status
- **`/api/auth/register`**: Allow user registration
- **`/api/expenses`**: Return expenses (with auth)

## 📝 Verify Deployment

1. **Check logs** show: `🚀 Expense Manager API Server running`
2. **Root route** shows Expense Manager API (not GraphQL)
3. **Health endpoint** shows database connected
4. **Frontend** can connect to backend

---

**After fixing, update your Vercel `VITE_API_URL` to point to the correct Railway URL!**

