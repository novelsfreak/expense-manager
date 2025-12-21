// Migration script to convert USD to AUD in database
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Salary from './models/Salary.js';
import SIP from './models/SIP.js';
import FixedDeposit from './models/FixedDeposit.js';
import Savings from './models/Savings.js';
import { convertToAUD } from './utils/currency.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-manager';

async function migrateUSDToAUD() {
  try {
    console.log('🔄 Starting USD to AUD migration...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    let updatedCount = 0;

    // Migrate Salary documents
    console.log('\n📊 Migrating Salary documents...');
    const salaries = await Salary.find({ currency: 'USD' });
    for (const salary of salaries) {
      await Salary.updateOne(
        { _id: salary._id },
        { 
          $set: { currency: 'AUD' },
          $unset: { amountUSD: '' } // Remove old field if exists
        }
      );
      updatedCount++;
      console.log(`  ✓ Updated salary for user: ${salary.userId}`);
    }
    console.log(`  ✅ Updated ${salaries.length} salary records`);

    // Migrate SIP documents
    console.log('\n📈 Migrating SIP documents...');
    const sips = await SIP.find({});
    let sipUpdated = 0;
    for (const sip of sips) {
      const updateData = {};
      
      // If old amountUSD field exists, convert to amountAUD
      if (sip.amountUSD !== undefined && sip.amountAUD === undefined) {
        updateData.amountAUD = sip.amountUSD; // USD and AUD are 1:1 for existing USD amounts
      }
      
      // Update currency enum if needed
      if (sip.originalCurrency === 'USD') {
        updateData.originalCurrency = 'AUD';
        sipUpdated++;
      }
      
      if (Object.keys(updateData).length > 0) {
        await SIP.updateOne(
          { _id: sip._id },
          { 
            $set: updateData,
            $unset: { amountUSD: '' } // Remove old field
          }
        );
        console.log(`  ✓ Updated SIP: ${sip.name}`);
      }
    }
    console.log(`  ✅ Updated ${sipUpdated} SIP records`);

    // Migrate Fixed Deposit documents
    console.log('\n🏦 Migrating Fixed Deposit documents...');
    const fds = await FixedDeposit.find({});
    let fdUpdated = 0;
    for (const fd of fds) {
      const updateData = {};
      
      // If old principalUSD field exists, convert to principalAUD
      if (fd.principalUSD !== undefined && fd.principalAUD === undefined) {
        updateData.principalAUD = fd.principalUSD; // USD and AUD are 1:1 for existing USD amounts
      }
      
      // Update currency enum if needed
      if (fd.originalCurrency === 'USD') {
        updateData.originalCurrency = 'AUD';
        fdUpdated++;
      }
      
      if (Object.keys(updateData).length > 0) {
        await FixedDeposit.updateOne(
          { _id: fd._id },
          { 
            $set: updateData,
            $unset: { principalUSD: '' } // Remove old field
          }
        );
        console.log(`  ✓ Updated FD: ${fd.name}`);
      }
    }
    console.log(`  ✅ Updated ${fdUpdated} FD records`);

    // Migrate Savings documents
    console.log('\n💵 Migrating Savings documents...');
    const savings = await Savings.find({ currency: 'USD' });
    for (const saving of savings) {
      await Savings.updateOne(
        { _id: saving._id },
        { 
          $set: { currency: 'AUD' },
          $unset: { amountUSD: '' } // Remove old field if exists
        }
      );
      updatedCount++;
      console.log(`  ✓ Updated savings for user: ${saving.userId}`);
    }
    console.log(`  ✅ Updated ${savings.length} savings records`);

    console.log(`\n✅ Migration complete! Updated ${updatedCount + sipUpdated + fdUpdated} total records`);
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run migration
migrateUSDToAUD()
  .then(() => {
    console.log('\n🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });

