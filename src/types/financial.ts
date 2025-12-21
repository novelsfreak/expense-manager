export interface Salary {
  _id?: string;
  monthlySalary: number;
  currency: 'AUD' | 'INR';
  conversionRate: number;
  lastUpdated?: string;
}

export interface SIP {
  _id?: string;
  name: string;
  monthlyAmount: number;
  originalCurrency: 'AUD' | 'INR';
  amountAUD: number;
  expectedReturnRate: number; // Annual percentage
  startDate: string;
  currentValue?: number; // Calculated
  description?: string;
}

export interface FixedDeposit {
  _id?: string;
  name: string;
  principalAmount: number;
  originalCurrency: 'AUD' | 'INR';
  principalAUD: number;
  interestRate: number; // Annual percentage
  startDate: string;
  maturityDate: string;
  currentValue?: number; // Calculated
  description?: string;
}

export interface RecurringDeposit {
  _id?: string;
  name: string;
  monthlyAmount: number;
  originalCurrency: 'AUD' | 'INR';
  amountAUD: number;
  interestRate: number; // Annual percentage
  startDate: string;
  maturityDate: string;
  compoundingFrequency: 'monthly' | 'quarterly' | 'half-yearly' | 'annually';
  currentValue?: number; // Calculated - current value
  maturityValue?: number; // Calculated - projected maturity value
  description?: string;
}

export interface Savings {
  _id?: string;
  currentBalance: number;
  currency: 'AUD' | 'INR';
  conversionRate: number;
  interestRate: number; // Annual percentage
  lastUpdated?: string;
}

export interface Stock {
  _id?: string;
  userId?: string;
  ticker: string;
  companyName: string;
  exchange: 'ASX' | 'NSE' | 'BSE' | 'NYSE' | 'NASDAQ' | 'Other';
  market: 'Australian' | 'Indian' | 'US' | 'Other';
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  currency: 'AUD' | 'INR' | 'USD';
  purchaseDate: string;
  totalInvestment?: number;
  currentValue?: number;
  profitLoss?: number;
  profitLossPercentage?: number;
  description?: string;
}

export interface FinancialOverview {
  monthlySalary: number;
  monthlyExpenses: number;
  monthlySavings: number;
  totalInvestments: number;
  totalSavings: number;
  totalStocks: number;
  netWorth: number;
}

