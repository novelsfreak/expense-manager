import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Expense from './server/models/Expense.js';
import User from './server/models/User.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use MongoDB Atlas URI if provided, otherwise use local
const MONGODB_URI = process.env.MONGODB_URI_ATLAS || process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-manager';
const USER_EMAIL = 'shubhsharma121212@gmail.com';
const expensesFile = path.join(__dirname, 'data', 'expenses.json');

async function migrateToAtlas() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log(`📍 Using: ${MONGODB_URI.includes('mongodb.net') ? 'MongoDB Atlas' : 'Local MongoDB'}`);
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find user by email
    console.log(`\n🔍 Looking for user with email: ${USER_EMAIL}`);
    const user = await User.findOne({ email: USER_EMAIL });
    
    if (!user) {
      console.error(`❌ User with email ${USER_EMAIL} not found!`);
      console.log('\n💡 Options:');
      console.log('   1. Make sure you have registered with this email');
      console.log('   2. Or create the user first by signing up in the app');
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.username} (${user.email})`);
    console.log(`   User ID: ${user._id}`);

    // Check if JSON file exists
    if (!fs.existsSync(expensesFile)) {
      console.error(`❌ Expenses file not found: ${expensesFile}`);
      console.log('💡 Make sure data/expenses.json exists');
      process.exit(1);
    }

    // Read existing expenses
    console.log(`\n📖 Reading expenses from JSON file...`);
    const expenses = JSON.parse(fs.readFileSync(expensesFile, 'utf8'));
    
    if (!Array.isArray(expenses) || expenses.length === 0) {
      console.log('ℹ️  No expenses found in JSON file.');
      process.exit(0);
    }

    console.log(`📦 Found ${expenses.length} expenses to migrate`);

    // Check for existing expenses
    const existingExpenseIds = await Expense.find({ userId: user._id }).select('id');
    const existingIds = new Set(existingExpenseIds.map(e => e.id));
    
    console.log(`\n📊 Existing expenses in database: ${existingIds.size}`);

    // Migrate expenses
    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    console.log('\n🚀 Starting migration...\n');

    for (const expense of expenses) {
      try {
        // Check if expense already exists for this user
        if (existingIds.has(expense.id)) {
          skipped++;
          continue;
        }

        // Add userId to expense
        const expenseWithUser = {
          ...expense,
          userId: user._id,
        };

        const newExpense = new Expense(expenseWithUser);
        await newExpense.save();
        migrated++;
        console.log(`✅ Migrated: ${expense.title} - $${expense.amount.toFixed(2)}`);
      } catch (error) {
        console.error(`❌ Error migrating expense ${expense.id}:`, error.message);
        errors++;
      }
    }

    const totalExpenses = await Expense.countDocuments({ userId: user._id });

    console.log(`\n✅ Migration complete!`);
    console.log(`   ✅ Migrated: ${migrated} expenses`);
    console.log(`   ⏭️  Skipped: ${skipped} expenses (already exist)`);
    console.log(`   ❌ Errors: ${errors} expenses`);
    console.log(`\n📊 Total expenses for ${user.username}: ${totalExpenses}`);
    
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration error:', error.message);
    if (error.message.includes('authentication')) {
      console.log('\n💡 MongoDB Atlas Authentication Error:');
      console.log('   - Check your username and password in connection string');
      console.log('   - Make sure database user has read/write permissions');
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Connection Error:');
      console.log('   - Check your MongoDB Atlas connection string');
      console.log('   - Make sure Network Access allows your IP (or 0.0.0.0/0)');
    }
    process.exit(1);
  }
}

migrateToAtlas();

