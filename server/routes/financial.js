import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Salary from '../models/Salary.js';
import SIP from '../models/SIP.js';
import FixedDeposit from '../models/FixedDeposit.js';
import RecurringDeposit from '../models/RecurringDeposit.js';
import Savings from '../models/Savings.js';
import Stock from '../models/Stock.js';
import { convertToAUD } from '../utils/currency.js';
import { calculateSIPValue, calculateFDValue, calculateRDValue } from '../utils/investment.js';

const router = express.Router();

// ========== SALARY ROUTES ==========

// GET /api/financial/salary - Get user's salary
router.get('/salary', authenticateToken, async (req, res) => {
  try {
    let salary = await Salary.findOne({ userId: req.user.userId });
    if (!salary) {
      return res.json({ monthlySalary: 0, currency: 'AUD', conversionRate: 1 });
    }
    res.json(salary);
  } catch (error) {
    console.error('Error fetching salary:', error);
    res.status(500).json({ error: 'Failed to fetch salary' });
  }
});

// POST/PUT /api/financial/salary - Set or update salary
router.post('/salary', authenticateToken, async (req, res) => {
  try {
    const { monthlySalary, currency = 'AUD' } = req.body;
    
    if (!monthlySalary || monthlySalary < 0) {
      return res.status(400).json({ error: 'Invalid salary amount' });
    }

    // Handle USD to AUD conversion for migration
    let finalCurrency = currency;
    let finalSalary = monthlySalary;
    if (currency === 'USD') {
      finalCurrency = 'AUD';
      finalSalary = monthlySalary; // 1:1 conversion USD to AUD
    }
    
    const conversionRate = finalCurrency === 'INR' ? 0.018 : 1; // INR to AUD rate
    
    const salary = await Salary.findOneAndUpdate(
      { userId: req.user.userId },
      {
        monthlySalary: finalSalary,
        currency: finalCurrency,
        conversionRate,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );
    
    res.json(salary);
  } catch (error) {
    console.error('Error saving salary:', error);
    res.status(500).json({ 
      error: 'Failed to save salary',
      details: error.message 
    });
  }
});

// ========== SIP ROUTES ==========

// GET /api/financial/sips - Get all SIPs
router.get('/sips', authenticateToken, async (req, res) => {
  try {
    const sips = await SIP.find({ userId: req.user.userId });
    
    // Calculate current values using original monthlyAmount (not converted amountAUD)
    const sipsWithValues = sips.map(sip => {
      const currentValue = calculateSIPValue(
        sip.monthlyAmount, // Use original amount, not converted
        sip.expectedReturnRate,
        sip.startDate
      );
      return {
        ...sip.toObject(),
        currentValue, // This will be in the original currency
      };
    });
    
    res.json(sipsWithValues);
  } catch (error) {
    console.error('Error fetching SIPs:', error);
    res.status(500).json({ error: 'Failed to fetch SIPs' });
  }
});

// POST /api/financial/sips - Add new SIP
router.post('/sips', authenticateToken, async (req, res) => {
  try {
    const { name, monthlyAmount, originalCurrency = 'INR', expectedReturnRate, startDate, description } = req.body;
    
    if (!name || !monthlyAmount || !expectedReturnRate || !startDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Handle USD to AUD conversion for migration
    let finalCurrency = originalCurrency;
    if (originalCurrency === 'USD') {
      finalCurrency = 'AUD';
    }
    
    const amountAUD = convertToAUD(monthlyAmount, originalCurrency);
    
    const sip = new SIP({
      userId: req.user.userId,
      name,
      monthlyAmount,
      originalCurrency: finalCurrency,
      amountAUD,
      expectedReturnRate,
      startDate: new Date(startDate),
      description: description || '',
    });
    
    await sip.save();
    res.status(201).json(sip);
  } catch (error) {
    console.error('Error creating SIP:', error);
    res.status(500).json({ error: 'Failed to create SIP' });
  }
});

// PUT /api/financial/sips/:id - Update SIP
router.put('/sips/:id', authenticateToken, async (req, res) => {
  try {
    const { name, monthlyAmount, originalCurrency, expectedReturnRate, startDate, description } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (monthlyAmount !== undefined) {
      updateData.monthlyAmount = monthlyAmount;
      const currencyToUse = originalCurrency || 'INR';
      updateData.amountAUD = convertToAUD(monthlyAmount, currencyToUse);
    }
    if (originalCurrency) {
      // Handle USD to AUD conversion for migration
      updateData.originalCurrency = originalCurrency === 'USD' ? 'AUD' : originalCurrency;
    }
    if (expectedReturnRate !== undefined) updateData.expectedReturnRate = expectedReturnRate;
    if (startDate) updateData.startDate = new Date(startDate);
    if (description !== undefined) updateData.description = description;
    
    const sip = await SIP.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      updateData,
      { new: true }
    );
    
    if (!sip) {
      return res.status(404).json({ error: 'SIP not found' });
    }
    
    res.json(sip);
  } catch (error) {
    console.error('Error updating SIP:', error);
    res.status(500).json({ error: 'Failed to update SIP' });
  }
});

// DELETE /api/financial/sips/:id - Delete SIP
router.delete('/sips/:id', authenticateToken, async (req, res) => {
  try {
    const sip = await SIP.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!sip) {
      return res.status(404).json({ error: 'SIP not found' });
    }
    res.json({ message: 'SIP deleted successfully' });
  } catch (error) {
    console.error('Error deleting SIP:', error);
    res.status(500).json({ error: 'Failed to delete SIP' });
  }
});

// ========== FIXED DEPOSIT ROUTES ==========

// GET /api/financial/fixed-deposits - Get all FDs
router.get('/fixed-deposits', authenticateToken, async (req, res) => {
  try {
    const fds = await FixedDeposit.find({ userId: req.user.userId });
    
    // Calculate current values using original principalAmount (not converted principalAUD)
    const fdsWithValues = fds.map(fd => {
      const currentValue = calculateFDValue(
        fd.principalAmount, // Use original amount, not converted
        fd.interestRate,
        fd.startDate,
        fd.maturityDate
      );
      return {
        ...fd.toObject(),
        currentValue, // This will be in the original currency
      };
    });
    
    res.json(fdsWithValues);
  } catch (error) {
    console.error('Error fetching fixed deposits:', error);
    res.status(500).json({ error: 'Failed to fetch fixed deposits' });
  }
});

// POST /api/financial/fixed-deposits - Add new FD
router.post('/fixed-deposits', authenticateToken, async (req, res) => {
  try {
    const { name, principalAmount, originalCurrency = 'INR', interestRate, startDate, maturityDate, description } = req.body;
    
    if (!name || !principalAmount || !interestRate || !startDate || !maturityDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Handle USD to AUD conversion for migration
    let finalCurrency = originalCurrency;
    if (originalCurrency === 'USD') {
      finalCurrency = 'AUD';
    }
    
    const principalAUD = convertToAUD(principalAmount, originalCurrency);
    
    const fd = new FixedDeposit({
      userId: req.user.userId,
      name,
      principalAmount,
      originalCurrency: finalCurrency,
      principalAUD,
      interestRate,
      startDate: new Date(startDate),
      maturityDate: new Date(maturityDate),
      description: description || '',
    });
    
    await fd.save();
    res.status(201).json(fd);
  } catch (error) {
    console.error('Error creating fixed deposit:', error);
    res.status(500).json({ error: 'Failed to create fixed deposit' });
  }
});

// PUT /api/financial/fixed-deposits/:id - Update FD
router.put('/fixed-deposits/:id', authenticateToken, async (req, res) => {
  try {
    const { name, principalAmount, originalCurrency, interestRate, startDate, maturityDate, description } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (principalAmount !== undefined) {
      updateData.principalAmount = principalAmount;
      const currencyToUse = originalCurrency || 'INR';
      updateData.principalAUD = convertToAUD(principalAmount, currencyToUse);
    }
    if (originalCurrency) {
      // Handle USD to AUD conversion for migration
      updateData.originalCurrency = originalCurrency === 'USD' ? 'AUD' : originalCurrency;
    }
    if (interestRate !== undefined) updateData.interestRate = interestRate;
    if (startDate) updateData.startDate = new Date(startDate);
    if (maturityDate) updateData.maturityDate = new Date(maturityDate);
    if (description !== undefined) updateData.description = description;
    
    const fd = await FixedDeposit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      updateData,
      { new: true }
    );
    
    if (!fd) {
      return res.status(404).json({ error: 'Fixed deposit not found' });
    }
    
    res.json(fd);
  } catch (error) {
    console.error('Error updating fixed deposit:', error);
    res.status(500).json({ error: 'Failed to update fixed deposit' });
  }
});

// DELETE /api/financial/fixed-deposits/:id - Delete FD
router.delete('/fixed-deposits/:id', authenticateToken, async (req, res) => {
  try {
    const fd = await FixedDeposit.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!fd) {
      return res.status(404).json({ error: 'Fixed deposit not found' });
    }
    res.json({ message: 'Fixed deposit deleted successfully' });
  } catch (error) {
    console.error('Error deleting fixed deposit:', error);
    res.status(500).json({ error: 'Failed to delete fixed deposit' });
  }
});

// ========== SAVINGS ROUTES ==========

// GET /api/financial/savings - Get savings account
router.get('/savings', authenticateToken, async (req, res) => {
  try {
    let savings = await Savings.findOne({ userId: req.user.userId });
    if (!savings) {
      return res.json({ currentBalance: 0, currency: 'AUD', conversionRate: 1, interestRate: 0 });
    }
    res.json(savings);
  } catch (error) {
    console.error('Error fetching savings:', error);
    res.status(500).json({ error: 'Failed to fetch savings' });
  }
});

// POST/PUT /api/financial/savings - Set or update savings
router.post('/savings', authenticateToken, async (req, res) => {
  try {
    const { currentBalance, currency = 'AUD', interestRate = 0 } = req.body;
    
    if (currentBalance === undefined || currentBalance < 0) {
      return res.status(400).json({ error: 'Invalid balance amount' });
    }

    // Handle USD to AUD conversion for migration
    let finalCurrency = currency;
    let finalBalance = currentBalance;
    if (currency === 'USD') {
      finalCurrency = 'AUD';
      finalBalance = currentBalance; // 1:1 conversion USD to AUD
    }

    const conversionRate = finalCurrency === 'INR' ? 0.018 : 1;
    
    const savings = await Savings.findOneAndUpdate(
      { userId: req.user.userId },
      {
        currentBalance: finalBalance,
        currency: finalCurrency,
        conversionRate,
        interestRate,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );
    
    res.json(savings);
  } catch (error) {
    console.error('Error saving savings:', error);
    res.status(500).json({ error: 'Failed to save savings' });
  }
});

// ========== RECURRING DEPOSIT ROUTES ==========

// GET /api/financial/recurring-deposits - Get all RDs
router.get('/recurring-deposits', authenticateToken, async (req, res) => {
  try {
    const rds = await RecurringDeposit.find({ userId: req.user.userId });
    
    // Calculate current and maturity values
    const rdsWithValues = rds.map(rd => {
      const currentValue = calculateRDValue(
        rd.amountAUD,
        rd.interestRate,
        rd.startDate,
        rd.maturityDate,
        rd.compoundingFrequency,
        false // Current value
      );
      const maturityValue = calculateRDValue(
        rd.amountAUD,
        rd.interestRate,
        rd.startDate,
        rd.maturityDate,
        rd.compoundingFrequency,
        true // Maturity value
      );
      return {
        ...rd.toObject(),
        currentValue,
        maturityValue,
      };
    });
    
    res.json(rdsWithValues);
  } catch (error) {
    console.error('Error fetching recurring deposits:', error);
    res.status(500).json({ error: 'Failed to fetch recurring deposits' });
  }
});

// POST /api/financial/recurring-deposits - Add new RD
router.post('/recurring-deposits', authenticateToken, async (req, res) => {
  try {
    const { 
      name, 
      monthlyAmount, 
      originalCurrency = 'INR', 
      interestRate, 
      startDate, 
      maturityDate, 
      compoundingFrequency = 'quarterly',
      description 
    } = req.body;
    
    if (!name || !monthlyAmount || !interestRate || !startDate || !maturityDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Handle USD to AUD conversion for migration
    let finalCurrency = originalCurrency;
    if (originalCurrency === 'USD') {
      finalCurrency = 'AUD';
    }
    
    const amountAUD = convertToAUD(monthlyAmount, originalCurrency);
    
    const rd = new RecurringDeposit({
      userId: req.user.userId,
      name,
      monthlyAmount,
      originalCurrency: finalCurrency,
      amountAUD,
      interestRate,
      startDate: new Date(startDate),
      maturityDate: new Date(maturityDate),
      compoundingFrequency,
      description: description || '',
    });
    
    await rd.save();
    res.status(201).json(rd);
  } catch (error) {
    console.error('Error creating recurring deposit:', error);
    res.status(500).json({ error: 'Failed to create recurring deposit', details: error.message });
  }
});

// PUT /api/financial/recurring-deposits/:id - Update RD
router.put('/recurring-deposits/:id', authenticateToken, async (req, res) => {
  try {
    const { 
      name, 
      monthlyAmount, 
      originalCurrency, 
      interestRate, 
      startDate, 
      maturityDate, 
      compoundingFrequency,
      description 
    } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (monthlyAmount !== undefined) {
      updateData.monthlyAmount = monthlyAmount;
      const currencyToUse = originalCurrency || 'INR';
      updateData.amountAUD = convertToAUD(monthlyAmount, currencyToUse);
    }
    if (originalCurrency) {
      // Handle USD to AUD conversion for migration
      updateData.originalCurrency = originalCurrency === 'USD' ? 'AUD' : originalCurrency;
    }
    if (interestRate !== undefined) updateData.interestRate = interestRate;
    if (startDate) updateData.startDate = new Date(startDate);
    if (maturityDate) updateData.maturityDate = new Date(maturityDate);
    if (compoundingFrequency) updateData.compoundingFrequency = compoundingFrequency;
    if (description !== undefined) updateData.description = description;
    
    const rd = await RecurringDeposit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      updateData,
      { new: true }
    );
    
    if (!rd) {
      return res.status(404).json({ error: 'Recurring deposit not found' });
    }
    
    res.json(rd);
  } catch (error) {
    console.error('Error updating recurring deposit:', error);
    res.status(500).json({ error: 'Failed to update recurring deposit', details: error.message });
  }
});

// DELETE /api/financial/recurring-deposits/:id - Delete RD
router.delete('/recurring-deposits/:id', authenticateToken, async (req, res) => {
  try {
    const rd = await RecurringDeposit.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!rd) {
      return res.status(404).json({ error: 'Recurring deposit not found' });
    }
    res.json({ message: 'Recurring deposit deleted successfully' });
  } catch (error) {
    console.error('Error deleting recurring deposit:', error);
    res.status(500).json({ error: 'Failed to delete recurring deposit' });
  }
});

// ========== STOCK/SHARES PORTFOLIO ROUTES ==========

// GET /api/financial/stocks - Get all stocks
router.get('/stocks', authenticateToken, async (req, res) => {
  try {
    const stocks = await Stock.find({ userId: req.user.userId }).sort({ market: 1, ticker: 1 });
    res.json(stocks);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
});

// POST /api/financial/stocks - Add new stock
router.post('/stocks', authenticateToken, async (req, res) => {
  try {
    const {
      ticker,
      companyName,
      exchange,
      market,
      quantity,
      purchasePrice,
      currentPrice,
      currency,
      purchaseDate,
      description,
    } = req.body;

    if (!ticker || !companyName || !exchange || !market || !quantity || !purchasePrice || !currentPrice || !currency || !purchaseDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const stock = new Stock({
      userId: req.user.userId,
      ticker: ticker.toUpperCase(),
      companyName,
      exchange,
      market,
      quantity,
      purchasePrice,
      currentPrice,
      currency,
      purchaseDate: new Date(purchaseDate),
      description: description || '',
    });

    await stock.save();
    res.status(201).json(stock);
  } catch (error) {
    console.error('Error creating stock:', error);
    res.status(500).json({ error: 'Failed to create stock', details: error.message });
  }
});

// PUT /api/financial/stocks/:id - Update stock
router.put('/stocks/:id', authenticateToken, async (req, res) => {
  try {
    const {
      ticker,
      companyName,
      exchange,
      market,
      quantity,
      purchasePrice,
      currentPrice,
      currency,
      purchaseDate,
      description,
    } = req.body;

    const updateData = {};
    if (ticker) updateData.ticker = ticker.toUpperCase();
    if (companyName) updateData.companyName = companyName;
    if (exchange) updateData.exchange = exchange;
    if (market) updateData.market = market;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (purchasePrice !== undefined) updateData.purchasePrice = purchasePrice;
    if (currentPrice !== undefined) updateData.currentPrice = currentPrice;
    if (currency) updateData.currency = currency;
    if (purchaseDate) updateData.purchaseDate = new Date(purchaseDate);
    if (description !== undefined) updateData.description = description;

    const stock = await Stock.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      updateData,
      { new: true }
    );

    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    res.json(stock);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: 'Failed to update stock', details: error.message });
  }
});

// DELETE /api/financial/stocks/:id - Delete stock
router.delete('/stocks/:id', authenticateToken, async (req, res) => {
  try {
    const stock = await Stock.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.json({ message: 'Stock deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(500).json({ error: 'Failed to delete stock' });
  }
});

export default router;

