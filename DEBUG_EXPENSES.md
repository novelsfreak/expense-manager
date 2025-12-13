# 🔍 Debug: Why Can't I See My Expenses?

## Quick Checks

### 1. Check Browser Console

Open browser DevTools (F12) and check Console tab. Look for:
- "Loaded expenses: X" - shows how many expenses were loaded
- Any error messages
- Network tab - check if `/api/expenses` request succeeded

### 2. Check Month Filter

Your expenses might be filtered by month. Check:
- **Month dropdown** - are there multiple months?
- **Current month** - expenses might be in a different month
- **Total count** - shows "(X total)" next to month count

### 3. Check Authentication

- Are you **logged in**? (Should see "Welcome, Shubham" at top)
- Check **localStorage** in DevTools → Application → Local Storage
- Should have `authToken` key

### 4. Check API Response

In browser DevTools → Network tab:
- Look for `/api/expenses` request
- Check if it returns 200 OK
- Check response - should be array of expenses

### 5. Verify Data in Database

Run this to check your expenses:
```bash
npm run migrate-user-expenses
```

Should show: "Total expenses for Shubham: 13"

## Common Issues

### Issue: Expenses filtered by wrong month
**Solution**: Change the month dropdown to December 2024 (or the month your expenses are in)

### Issue: Not logged in
**Solution**: Logout and login again with `shubhsharma121212@gmail.com`

### Issue: API returning empty array
**Solution**: 
1. Check MongoDB connection
2. Verify user ID matches expenses
3. Check server logs for errors

### Issue: Month selector empty
**Solution**: The app will show current month. Your expenses might be in December 2024.

## Quick Fix

1. **Open browser console** (F12)
2. **Check** "Loaded expenses: X" message
3. **Look at** month dropdown - select different months
4. **Check** Network tab for API calls

## Still Not Working?

Share:
1. Browser console errors
2. Network tab response for `/api/expenses`
3. What you see in the month dropdown

