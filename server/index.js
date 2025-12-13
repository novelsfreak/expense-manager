import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Expense from './models/Expense.js';
import authRoutes from './routes/auth.js';
import { authenticateToken } from './middleware/auth.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-manager';

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Make sure MongoDB is running or set MONGODB_URI environment variable');
    console.log('💡 For local MongoDB: mongodb://localhost:27017/expense-manager');
    console.log('💡 For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/expense-manager');
  });

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
// GET /api/expenses - Get all expenses for logged-in user
app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// POST /api/expenses - Add a new expense
app.post('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const expenseData = {
      ...req.body,
      userId: req.user.userId,
    };
    
    if (!expenseData.id) {
      expenseData.id = Date.now().toString();
    }
    
    // Check if expense with this ID already exists for this user
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

// PUT /api/expenses/:id - Update an expense
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

// DELETE /api/expenses/:id - Delete an expense
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

// 404 handler for undefined routes (Express 5 compatible)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/verify',
      'GET /api/expenses',
      'POST /api/expenses',
      'PUT /api/expenses/:id',
      'DELETE /api/expenses/:id'
    ]
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Expense Manager API Server running on port ${PORT}`);
  console.log(`📊 Database: ${MONGODB_URI.includes('mongodb.net') ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Server ready to accept connections`);
});
