import type { Salary, SIP, FixedDeposit, RecurringDeposit, Savings, Stock, FinancialOverview } from '../types/financial';
import type { Expense } from '../types/expense';

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/financial`
  : import.meta.env.DEV 
    ? `http://${window.location.hostname}:3001/api/financial`
    : '/api/financial';

const getAuthToken = () => localStorage.getItem('authToken');

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// ========== SALARY API ==========

export const getSalary = async (): Promise<Salary> => {
  try {
    const response = await fetch(`${API_BASE_URL}/salary`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      if (response.status === 404) {
        // No salary set yet, return default
        console.log('No salary found, returning default');
        return { monthlySalary: 0, currency: 'AUD', conversionRate: 1 };
      }
      throw new Error('Failed to fetch salary');
    }
    const salaryData = await response.json();
    console.log('Salary fetched:', salaryData);
    return salaryData;
  } catch (error) {
    console.error('Error fetching salary:', error);
    return { monthlySalary: 0, currency: 'AUD', conversionRate: 1 };
  }
};

export const saveSalary = async (salary: Partial<Salary>): Promise<Salary> => {
  try {
    const response = await fetch(`${API_BASE_URL}/salary`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(salary),
    });
    if (!response.ok) throw new Error('Failed to save salary');
    return await response.json();
  } catch (error) {
    console.error('Error saving salary:', error);
    throw error;
  }
};

// ========== SIP API ==========

export const getSIPs = async (): Promise<SIP[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sips`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch SIPs');
    return await response.json();
  } catch (error) {
    console.error('Error fetching SIPs:', error);
    return [];
  }
};

export const addSIP = async (sip: Partial<SIP>): Promise<SIP> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sips`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(sip),
    });
    if (!response.ok) throw new Error('Failed to add SIP');
    return await response.json();
  } catch (error) {
    console.error('Error adding SIP:', error);
    throw error;
  }
};

export const updateSIP = async (id: string, sip: Partial<SIP>): Promise<SIP> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sips/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(sip),
    });
    if (!response.ok) throw new Error('Failed to update SIP');
    return await response.json();
  } catch (error) {
    console.error('Error updating SIP:', error);
    throw error;
  }
};

export const deleteSIP = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sips/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete SIP');
    return true;
  } catch (error) {
    console.error('Error deleting SIP:', error);
    return false;
  }
};

// ========== FIXED DEPOSIT API ==========

export const getFixedDeposits = async (): Promise<FixedDeposit[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/fixed-deposits`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch fixed deposits');
    return await response.json();
  } catch (error) {
    console.error('Error fetching fixed deposits:', error);
    return [];
  }
};

export const addFixedDeposit = async (fd: Partial<FixedDeposit>): Promise<FixedDeposit> => {
  try {
    const response = await fetch(`${API_BASE_URL}/fixed-deposits`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(fd),
    });
    if (!response.ok) throw new Error('Failed to add fixed deposit');
    return await response.json();
  } catch (error) {
    console.error('Error adding fixed deposit:', error);
    throw error;
  }
};

export const updateFixedDeposit = async (id: string, fd: Partial<FixedDeposit>): Promise<FixedDeposit> => {
  try {
    const response = await fetch(`${API_BASE_URL}/fixed-deposits/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(fd),
    });
    if (!response.ok) throw new Error('Failed to update fixed deposit');
    return await response.json();
  } catch (error) {
    console.error('Error updating fixed deposit:', error);
    throw error;
  }
};

export const deleteFixedDeposit = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/fixed-deposits/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete fixed deposit');
    return true;
  } catch (error) {
    console.error('Error deleting fixed deposit:', error);
    return false;
  }
};

// ========== SAVINGS API ==========

export const getSavings = async (): Promise<Savings> => {
  try {
    const response = await fetch(`${API_BASE_URL}/savings`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch savings');
    return await response.json();
  } catch (error) {
    console.error('Error fetching savings:', error);
    return { currentBalance: 0, currency: 'AUD', conversionRate: 1, interestRate: 0 };
  }
};

export const saveSavings = async (savings: Partial<Savings>): Promise<Savings> => {
  try {
    const response = await fetch(`${API_BASE_URL}/savings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(savings),
    });
    if (!response.ok) throw new Error('Failed to save savings');
    return await response.json();
  } catch (error) {
    console.error('Error saving savings:', error);
    throw error;
  }
};

// ========== RECURRING DEPOSIT API ==========

export const getRecurringDeposits = async (): Promise<RecurringDeposit[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/recurring-deposits`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch recurring deposits');
    return await response.json();
  } catch (error) {
    console.error('Error fetching recurring deposits:', error);
    return [];
  }
};

export const addRecurringDeposit = async (rd: Partial<RecurringDeposit>): Promise<RecurringDeposit> => {
  try {
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Sending RD data:', rd);
    const response = await fetch(`${API_BASE_URL}/recurring-deposits`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(rd),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to add recurring deposit: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log('RD added successfully:', result);
    return result;
  } catch (error) {
    console.error('Error adding recurring deposit:', error);
    throw error;
  }
};

export const updateRecurringDeposit = async (id: string, rd: Partial<RecurringDeposit>): Promise<RecurringDeposit> => {
  try {
    const response = await fetch(`${API_BASE_URL}/recurring-deposits/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(rd),
    });
    if (!response.ok) throw new Error('Failed to update recurring deposit');
    return await response.json();
  } catch (error) {
    console.error('Error updating recurring deposit:', error);
    throw error;
  }
};

export const deleteRecurringDeposit = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/recurring-deposits/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete recurring deposit');
    return true;
  } catch (error) {
    console.error('Error deleting recurring deposit:', error);
    return false;
  }
};

// ========== STOCK PORTFOLIO FUNCTIONS ==========

export const getStocks = async (): Promise<Stock[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stocks`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      // If 404, stocks route might not be available yet, return empty array
      if (response.status === 404) {
        console.warn('Stocks route not found (404). Server may need restart.');
        return [];
      }
      throw new Error('Failed to fetch stocks');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return []; // Return empty array instead of throwing
  }
};

export const addStock = async (stock: Partial<Stock>): Promise<Stock> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stocks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(stock),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add stock');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding stock:', error);
    throw error;
  }
};

export const updateStock = async (id: string, stock: Partial<Stock>): Promise<Stock> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stocks/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(stock),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update stock');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};

export const deleteStock = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stocks/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete stock');
    return true;
  } catch (error) {
    console.error('Error deleting stock:', error);
    return false;
  }
};

// ========== CALCULATION HELPERS ==========

export const calculateFinancialOverview = (
  salary: Salary,
  expenses: Expense[],
  sips: SIP[],
  fixedDeposits: FixedDeposit[],
  recurringDeposits: RecurringDeposit[],
  savings: Savings,
  stocks: Stock[] = []
): FinancialOverview => {
  // Get current month expenses
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthlyExpenses = expenses
    .filter(exp => {
      const expDate = new Date(exp.date);
      const expMonth = `${expDate.getFullYear()}-${String(expDate.getMonth() + 1).padStart(2, '0')}`;
      return expMonth === currentMonth;
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  // Convert salary to AUD if needed
  const monthlySalaryAUD = salary.currency === 'AUD' 
    ? salary.monthlySalary 
    : salary.monthlySalary * salary.conversionRate;

  // Calculate monthly savings
  const monthlySavings = monthlySalaryAUD - monthlyExpenses;

  // Calculate total investments (SIPs + FDs + RDs)
  // Use currentValue if available, otherwise use original amounts converted to AUD
  const totalSIPValue = sips.reduce((sum, sip) => {
    if (sip.currentValue && sip.currentValue > 0) {
      // If currentValue exists, convert it to AUD based on original currency
      if (sip.originalCurrency === 'AUD') return sum + sip.currentValue;
      if (sip.originalCurrency === 'INR') return sum + (sip.currentValue * 0.018); // Convert INR to AUD
      return sum + sip.currentValue;
    }
    // Fallback to amountAUD if currentValue not calculated
    return sum + (sip.amountAUD || 0);
  }, 0);

  const totalFDValue = fixedDeposits.reduce((sum, fd) => {
    if (fd.currentValue && fd.currentValue > 0) {
      // If currentValue exists, convert it to AUD based on original currency
      if (fd.originalCurrency === 'AUD') return sum + fd.currentValue;
      if (fd.originalCurrency === 'INR') return sum + (fd.currentValue * 0.018); // Convert INR to AUD
      return sum + fd.currentValue;
    }
    // Fallback to principalAUD if currentValue not calculated
    return sum + (fd.principalAUD || 0);
  }, 0);

  const totalRDValue = recurringDeposits.reduce((sum, rd) => {
    if (rd.currentValue && rd.currentValue > 0) {
      // If currentValue exists, convert it to AUD based on original currency
      if (rd.originalCurrency === 'AUD') return sum + rd.currentValue;
      if (rd.originalCurrency === 'INR') return sum + (rd.currentValue * 0.018); // Convert INR to AUD
      return sum + rd.currentValue;
    }
    // Fallback to amountAUD if currentValue not calculated
    return sum + (rd.amountAUD || 0);
  }, 0);

  const totalInvestments = totalSIPValue + totalFDValue + totalRDValue;

  // Convert savings to AUD if needed
  const totalSavingsAUD = savings.currency === 'AUD'
    ? savings.currentBalance
    : savings.currentBalance * savings.conversionRate;

  // Calculate total stocks value (convert to AUD for net worth calculation)
  const totalStocksAUD = stocks.reduce((sum, stock) => {
    const stockValue = stock.currentValue || (stock.quantity * stock.currentPrice);
    if (stock.currency === 'AUD') return sum + stockValue;
    if (stock.currency === 'INR') return sum + (stockValue * 0.018); // Convert INR to AUD
    if (stock.currency === 'USD') return sum + stockValue; // Treat USD as AUD for now
    return sum + stockValue;
  }, 0);

  // Calculate net worth
  const netWorth = totalSavingsAUD + totalInvestments + totalStocksAUD;

  // Debug logging
  console.log('Financial Overview Calculation:', {
    monthlySalaryAUD,
    monthlyExpenses,
    monthlySavings,
    totalSIPValue,
    totalFDValue,
    totalRDValue,
    totalInvestments,
    totalSavingsAUD,
    totalStocksAUD,
    netWorth,
    salary: salary.monthlySalary,
    salaryCurrency: salary.currency,
    sipsCount: sips.length,
    fdsCount: fixedDeposits.length,
    rdsCount: recurringDeposits.length,
    stocksCount: stocks.length,
  });

  return {
    monthlySalary: monthlySalaryAUD,
    monthlyExpenses,
    monthlySavings,
    totalInvestments,
    totalSavings: totalSavingsAUD,
    totalStocks: totalStocksAUD,
    netWorth,
  };
};

