// Investment growth calculation utilities

/**
 * Calculate SIP future value using compound interest formula
 * FV = P * [((1 + r)^n - 1) / r] * (1 + r)
 * Where:
 * P = Monthly investment amount
 * r = Monthly interest rate (annual rate / 12)
 * n = Number of months
 */
export const calculateSIPValue = (monthlyAmount, annualReturnRate, startDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const monthsElapsed = Math.max(0, 
    (now.getFullYear() - start.getFullYear()) * 12 + 
    (now.getMonth() - start.getMonth())
  );
  
  if (monthsElapsed === 0) {
    return monthlyAmount; // First month
  }
  
  const monthlyRate = annualReturnRate / 100 / 12;
  
  // Future value of annuity formula
  const futureValue = monthlyAmount * 
    (((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate) * (1 + monthlyRate));
  
  return Math.round(futureValue * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate Fixed Deposit maturity value
 * A = P * (1 + r/n)^(n*t)
 * Where:
 * P = Principal amount
 * r = Annual interest rate
 * n = Compounding frequency (12 for monthly)
 * t = Time in years
 */
export const calculateFDValue = (principal, annualInterestRate, startDate, maturityDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const maturity = new Date(maturityDate);
  
  // Use current date if before maturity, otherwise use maturity date
  const endDate = now < maturity ? now : maturity;
  
  const yearsElapsed = (endDate - start) / (1000 * 60 * 60 * 24 * 365.25);
  const monthlyRate = annualInterestRate / 100 / 12;
  const monthsElapsed = yearsElapsed * 12;
  
  // Compound interest with monthly compounding
  const maturityValue = principal * Math.pow(1 + monthlyRate, monthsElapsed);
  
  return Math.round(maturityValue * 100) / 100;
};

/**
 * Calculate savings account growth with compound interest
 */
export const calculateSavingsGrowth = (principal, annualInterestRate, months) => {
  if (months === 0) return principal;
  
  const monthlyRate = annualInterestRate / 100 / 12;
  const futureValue = principal * Math.pow(1 + monthlyRate, months);
  
  return Math.round(futureValue * 100) / 100;
};

/**
 * Calculate Recurring Deposit (RD) value
 * RD formula: A = P * [((1 + r/n)^(n*t) - 1) / (r/n)] * (1 + r/n)
 * Where:
 * P = Monthly deposit amount
 * r = Annual interest rate
 * n = Compounding frequency per year (4 for quarterly, 12 for monthly, etc.)
 * t = Time in years
 * 
 * For current value: Calculate up to now
 * For maturity value: Calculate up to maturity date
 */
export const calculateRDValue = (monthlyAmount, annualInterestRate, startDate, endDate, compoundingFrequency = 'quarterly') => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calculate time elapsed in years
  const yearsElapsed = (end - start) / (1000 * 60 * 60 * 24 * 365.25);
  const monthsElapsed = yearsElapsed * 12;
  
  if (monthsElapsed <= 0) {
    return monthlyAmount; // First month
  }
  
  // Determine compounding frequency (n)
  let n; // Compounding frequency per year
  switch (compoundingFrequency) {
    case 'monthly':
      n = 12;
      break;
    case 'quarterly':
      n = 4;
      break;
    case 'half-yearly':
      n = 2;
      break;
    case 'annually':
      n = 1;
      break;
    default:
      n = 4; // Default to quarterly
  }
  
  const r = annualInterestRate / 100; // Annual rate as decimal
  const monthlyRate = r / 12; // Monthly rate
  
  // RD formula: Future value of annuity with compounding
  // A = P * [((1 + r/n)^(n*t) - 1) / (r/n)] * (1 + r/n)
  const compoundFactor = Math.pow(1 + r / n, n * yearsElapsed);
  const futureValue = monthlyAmount * 
    (((compoundFactor - 1) / (r / n)) * (1 + r / n));
  
  return Math.round(futureValue * 100) / 100;
};

