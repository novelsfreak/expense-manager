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

const MONGODB_URI = process.env.MONGODB_URI;
const USER_EMAIL = 'shubhsharma121212@gmail.com';
const expensesFile = path.join(__dirname, 'data', 'expenses.json');

async function setupMongoDBAtlas() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not set in .env file!');
      console.log('💡 Please set your MongoDB Atlas connection string in .env file');
      process.exit(1);
    }

    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Find or create user
    console.log(`\n🔍 Looking for user with email: ${USER_EMAIL}`);
    let user = await User.findOne({ email: USER_EMAIL });
    
    if (!user) {
      console.log('👤 User not found. Creating new user...');
      // You'll need to set a password - for now, create with a default
      console.log('⚠️  Please register your account first through the app, then run this script again.');
      console.log('   Or manually create user in MongoDB Atlas.');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.username} (${user.email})`);
    console.log(`   User ID: ${user._id}`);

    // Check if JSON file exists
    if (!fs.existsSync(expensesFile)) {
      console.log('ℹ️  No expenses.json file found. Skipping migration.');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Read existing expenses
    console.log(`\n📖 Reading expenses from JSON file...`);
    const expenses = JSON.parse(fs.readFileSync(expensesFile, 'utf8'));
    
    if (!Array.isArray(expenses) || expenses.length === 0) {
      console.log('ℹ️  No expenses found in JSON file.');
      await mongoose.disconnect();
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
        console.log(`✅ Migrated: ${expense.title} - $${expense.amount}`);
      } catch (error) {
        console.error(`❌ Error migrating expense ${expense.id}:`, error.message);
        errors++;
      }
    }

    console.log(`\n✅ Setup complete!`);
    console.log(`   Migrated: ${migrated} expenses`);
    console.log(`   Skipped: ${skipped} expenses (already exist)`);
    console.log(`   Errors: ${errors} expenses`);
    console.log(`\n📊 Total expenses for ${user.username}: ${existingIds.size + migrated}`);
    console.log(`\n🎉 Your MongoDB Atlas is ready for production!`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup error:', error.message);
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Check your MongoDB Atlas username and password');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Check your MongoDB Atlas connection string');
    }
    process.exit(1);
  }
}

setupMongoDBAtlas();

