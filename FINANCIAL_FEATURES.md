# 💼 Financial Features - Complete Guide

## 🎉 New Features Added

Your Expense Manager now includes comprehensive financial tracking:

### 1. **Salary Management** 💰
- Set your monthly salary in USD or INR
- Automatically converts INR to USD for display
- Used to calculate monthly savings

### 2. **Savings Account** 💵
- Track your current savings balance
- Set interest rate for growth calculations
- Supports USD and INR

### 3. **SIP Investments** 📈
- Add Systematic Investment Plans (SIPs)
- Enter monthly investment amount (INR or USD)
- Set expected annual return rate (%)
- Automatic growth calculation based on:
  - Start date
  - Monthly contributions
  - Expected return rate
- View current value of all SIPs

### 4. **Fixed Deposits** 🏦
- Track Fixed Deposits
- Enter principal amount (INR or USD)
- Set interest rate and tenure
- Automatic maturity value calculation
- View current value based on time elapsed

### 5. **Financial Overview Dashboard** 📊
Shows at a glance:
- **Monthly Salary**: Your income
- **Monthly Expenses**: Current month spending
- **Monthly Savings**: Salary - Expenses
- **Total Investments**: Sum of all SIPs + FDs
- **Savings Account**: Current balance
- **Net Worth**: Investments + Savings

## 🔄 Currency Conversion

- All amounts are displayed in **USD** for consistency
- INR amounts are automatically converted using rate: **1 USD = ~83 INR** (0.012 conversion rate)
- You can enter amounts in either currency, and they'll be converted automatically

## 📐 Investment Growth Calculations

### SIP Growth Formula
Uses compound interest formula for monthly investments:
```
FV = P × [((1 + r)^n - 1) / r] × (1 + r)
```
Where:
- P = Monthly investment amount
- r = Monthly interest rate (annual rate / 12)
- n = Number of months elapsed

### Fixed Deposit Formula
Uses compound interest with monthly compounding:
```
A = P × (1 + r/n)^(n×t)
```
Where:
- P = Principal amount
- r = Annual interest rate
- n = Compounding frequency (12 for monthly)
- t = Time in years

## 🚀 How to Use

### Step 1: Set Your Salary
1. Go to **Financial Overview** tab
2. Click **Salary Settings**
3. Enter your monthly salary
4. Select currency (USD or INR)
5. Click **Save Salary**

### Step 2: Add Savings Account
1. In **Financial Overview** tab
2. Click **Savings Account**
3. Enter current balance
4. Set interest rate (optional)
5. Click **Save Savings**

### Step 3: Add SIP Investments
1. In **Financial Overview** tab
2. Click **Investment Dashboard**
3. Click **+ Add SIP**
4. Fill in:
   - Name (e.g., "Mutual Fund XYZ")
   - Monthly Amount
   - Currency (INR or USD)
   - Expected Return Rate (% per year)
   - Start Date
5. Click **Add SIP**

### Step 4: Add Fixed Deposits
1. In **Investment Dashboard**
2. Click **+ Add FD**
3. Fill in:
   - Name
   - Principal Amount
   - Currency
   - Interest Rate (% per year)
   - Start Date
   - Maturity Date
4. Click **Add FD**

### Step 5: View Financial Overview
- Switch to **Financial Overview** tab
- See all your financial metrics at a glance
- Track your net worth growth over time

## 📱 Features

- ✅ **Two Tabs**: Expenses and Financial Overview
- ✅ **Real-time Calculations**: Investment values update automatically
- ✅ **Multi-currency Support**: Enter in INR, view in USD
- ✅ **Growth Projections**: See how investments grow over time
- ✅ **Monthly Savings Tracking**: Compare income vs expenses
- ✅ **Net Worth Calculation**: Total of all assets

## 🔧 Technical Details

### API Endpoints
- `GET /api/financial/salary` - Get salary
- `POST /api/financial/salary` - Set/update salary
- `GET /api/financial/savings` - Get savings
- `POST /api/financial/savings` - Set/update savings
- `GET /api/financial/sips` - Get all SIPs
- `POST /api/financial/sips` - Add SIP
- `PUT /api/financial/sips/:id` - Update SIP
- `DELETE /api/financial/sips/:id` - Delete SIP
- `GET /api/financial/fixed-deposits` - Get all FDs
- `POST /api/financial/fixed-deposits` - Add FD
- `PUT /api/financial/fixed-deposits/:id` - Update FD
- `DELETE /api/financial/fixed-deposits/:id` - Delete FD

### Database Models
- **Salary**: One per user (monthly salary, currency)
- **Savings**: One per user (current balance, interest rate)
- **SIP**: Multiple per user (monthly investments)
- **FixedDeposit**: Multiple per user (one-time deposits)

## 💡 Tips

1. **Update Regularly**: Keep your salary and savings updated for accurate calculations
2. **Realistic Returns**: Use realistic expected return rates for SIPs (typically 8-15% for equity funds)
3. **FD Interest Rates**: Check current FD rates from your bank
4. **Monthly Review**: Review your financial overview monthly to track progress
5. **Currency Conversion**: The conversion rate is set to 0.012 (1 USD = ~83 INR). You can update this in `server/utils/currency.js` if needed.

## 🎯 Example Usage

**Scenario**: You earn ₹1,00,000/month, invest ₹10,000/month in SIPs, and have ₹5,00,000 in FDs.

1. Set salary: ₹1,00,000/month (INR) → Shows as ~$1,200 USD
2. Add SIP: ₹10,000/month at 12% return → Shows current value in USD
3. Add FD: ₹5,00,000 at 7% interest → Shows current value in USD
4. View Financial Overview to see:
   - Monthly Salary: ~$1,200
   - Monthly Expenses: (from expense tracking)
   - Monthly Savings: Salary - Expenses
   - Total Investments: SIP value + FD value
   - Net Worth: Investments + Savings

---

**Enjoy tracking your complete financial picture!** 🎉

