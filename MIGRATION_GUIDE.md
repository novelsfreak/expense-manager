# 🔄 USD to AUD Migration Guide

## Overview

This guide helps you migrate your database from USD to AUD currency.

## Step 1: Run the Migration Script

Run the migration script to convert all existing USD records to AUD:

```bash
npm run migrate-usd-to-aud
```

This script will:
- ✅ Convert all `currency: 'USD'` to `currency: 'AUD'` in Salary, Savings, SIP, and FixedDeposit collections
- ✅ Convert `amountUSD` fields to `amountAUD` in SIP documents
- ✅ Convert `principalUSD` fields to `principalAUD` in FixedDeposit documents
- ✅ Remove old USD fields from documents

## Step 2: Verify Migration

After running the migration, check your database:

1. **Check Salary documents:**
   ```javascript
   db.salaries.find({ currency: 'USD' }) // Should return empty
   ```

2. **Check SIP documents:**
   ```javascript
   db.sips.find({ originalCurrency: 'USD' }) // Should return empty
   db.sips.find({ amountUSD: { $exists: true } }) // Should return empty
   ```

3. **Check FixedDeposit documents:**
   ```javascript
   db.fixeddeposits.find({ originalCurrency: 'USD' }) // Should return empty
   db.fixeddeposits.find({ principalUSD: { $exists: true } }) // Should return empty
   ```

## Step 3: Restart Your Server

After migration, restart your server:

```bash
npm run dev
```

## What Changed

### Database Schema Updates

- **Salary Model**: `currency` enum now includes `'USD'` temporarily for migration
- **SIP Model**: `originalCurrency` enum includes `'USD'` temporarily, `amountUSD` → `amountAUD`
- **FixedDeposit Model**: `originalCurrency` enum includes `'USD'` temporarily, `principalUSD` → `principalAUD`
- **Savings Model**: `currency` enum includes `'USD'` temporarily

### API Changes

- All endpoints now default to `'AUD'` instead of `'USD'`
- Currency conversion automatically handles USD → AUD (1:1 conversion)
- All responses return AUD values

### Frontend Changes

- All currency displays use AUD
- Currency formatting uses `'en-AU'` locale
- All forms default to AUD

## Troubleshooting

### Error: "Invalid currency value"

If you see this error, it means there are still USD values in the database. Run the migration script again.

### Error: "Field 'amountUSD' does not exist"

This is normal after migration. The old fields are removed. The frontend should use `amountAUD` instead.

### Data Not Showing

1. Clear your browser cache
2. Log out and log back in
3. Check browser console for errors
4. Verify MongoDB connection

## After Migration

Once migration is complete and verified:

1. ✅ All new entries will use AUD
2. ✅ All existing USD entries converted to AUD
3. ✅ Old USD fields removed
4. ✅ Application fully functional with AUD

---

**Note**: The migration script is safe to run multiple times. It only updates records that need updating.

