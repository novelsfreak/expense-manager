import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Expense from './models/Expense.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-manager';
const expensesFile = path.join(__dirname, '..', 'data', 'expenses.json');

async function migrate() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if JSON file exists
    if (!fs.existsSync(expensesFile)) {
      console.log('ℹ️  No existing data file found. Migration not needed.');
      process.exit(0);
    }

    // Read existing expenses
    console.log('📖 Reading existing expenses from JSON file...');
    const expenses = JSON.parse(fs.readFileSync(expensesFile, 'utf8'));
    
    if (!Array.isArray(expenses) || expenses.length === 0) {
      console.log('ℹ️  No expenses found in JSON file. Migration not needed.');
      process.exit(0);
    }

    console.log(`📦 Found ${expenses.length} expenses to migrate`);

    // Clear existing expenses in database (optional - comment out if you want to keep existing)
    // await Expense.deleteMany({});
    // console.log('🗑️  Cleared existing expenses in database');

    // Migrate expenses
    let migrated = 0;
    let skipped = 0;

    for (const expense of expenses) {
      try {
        // Check if expense already exists
        const existing = await Expense.findOne({ id: expense.id });
        if (existing) {
          console.log(`⏭️  Skipping expense ${expense.id} (already exists)`);
          skipped++;
          continue;
        }

        const newExpense = new Expense(expense);
        await newExpense.save();
        migrated++;
      } catch (error) {
        console.error(`❌ Error migrating expense ${expense.id}:`, error.message);
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Migrated: ${migrated} expenses`);
    console.log(`   Skipped: ${skipped} expenses`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrate();

