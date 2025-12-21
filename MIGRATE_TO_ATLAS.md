# 🗄️ Migrate Expenses to MongoDB Atlas

Your expenses are currently in **local MongoDB**. To use them in production (Vercel), you need to migrate them to **MongoDB Atlas**.

## 📋 Current Status

- ✅ **12 expenses** in `data/expenses.json`
- ✅ **13 expenses** in local MongoDB (already migrated)
- ⚠️ **Need to migrate to MongoDB Atlas** for production

## 🚀 Quick Migration Steps

### Option 1: Using MongoDB Atlas Connection String (Recommended)

1. **Get your MongoDB Atlas connection string** (if you have it)
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/expense-manager`

2. **Run migration with Atlas URI:**
   ```bash
   MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/expense-manager" node migrate-to-atlas.js
   ```

### Option 2: Update .env File

1. **Add MongoDB Atlas URI to `.env`:**
   ```bash
   MONGODB_URI_ATLAS=mongodb+srv://username:password@cluster.mongodb.net/expense-manager
   ```

2. **Run migration:**
   ```bash
   node migrate-to-atlas.js
   ```

### Option 3: Set Up MongoDB Atlas First

If you don't have MongoDB Atlas yet:

1. **Sign up**: https://www.mongodb.com/cloud/atlas/register
2. **Create free cluster** (M0 tier)
3. **Database Access** → Create user (username + password)
4. **Network Access** → Allow from anywhere (0.0.0.0/0)
5. **Get connection string**:
   - Database → Connect → Connect your application
   - Copy string
   - Replace `<username>` and `<password>`
   - Add `/expense-manager` at end

6. **Run migration** (use Option 1 or 2 above)

## ✅ After Migration

1. **Verify expenses** in MongoDB Atlas:
   - Go to MongoDB Atlas dashboard
   - Browse Collections → expenses collection
   - Should see 13 expenses for your user

2. **Update Vercel environment variables**:
   - Add `MONGODB_URI` with your Atlas connection string
   - Redeploy

3. **Test in production**:
   - Visit your Vercel URL
   - Login with `shubhsharma121212@gmail.com`
   - Your expenses should appear!

## 🔍 Verify Migration

After migration, you should see:
```
✅ Migration complete!
   ✅ Migrated: 13 expenses
   ⏭️  Skipped: 0 expenses
   ❌ Errors: 0 expenses

📊 Total expenses for Shubham: 13
```

---

**Need help?** Share your MongoDB Atlas connection string and I can help migrate!

