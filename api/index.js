// Vercel Serverless Function - Entry point for API
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Expense from '../server/models/Expense.js';
import authRoutes from '../server/routes/auth.js';
import { authenticateToken } from '../server/middleware/auth.js';

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error.message);
    });
}

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Expense Manager API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      expenses: '/api/expenses'
    }
  });
});

// Auth Routes (public)
app.use('/api/auth', authRoutes);

// Protected API Routes - require authentication
app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

app.post('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const expenseData = {
      ...req.body,
      userId: req.user.userId,
    };
    
    if (!expenseData.id) {
      expenseData.id = Date.now().toString();
    }
    
    const existingExpense = await Expense.findOne({ 
      id: expenseData.id,
      userId: req.user.userId 
    });
    if (existingExpense) {
      return res.status(400).json({ error: 'Expense with this ID already exists' });
    }
    
    const newExpense = new Expense(expenseData);
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

app.put('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    
    const expense = await Expense.findOneAndUpdate(
      { id, userId: req.user.userId },
      updatedData,
      { new: true, runValidators: true }
    );
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const expense = await Expense.findOneAndDelete({ 
      id, 
      userId: req.user.userId 
    });
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' 
  });
});

// 404 handler (Express 5 compatible - no wildcard)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Export for Vercel Serverless
export default app;

