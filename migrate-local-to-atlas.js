import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Expense from './server/models/Expense.js';
import User from './server/models/User.js';

dotenv.config();

const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/expense-manager';
const USER_EMAIL = 'shubhsharma121212@gmail.com';

// Get Atlas URI from environment or command line
const ATLAS_URI = process.env.MONGODB_URI_ATLAS || process.argv[2];

if (!ATLAS_URI) {
  console.error('❌ MongoDB Atlas connection string required!');
  console.log('\nUsage:');
  console.log('  node migrate-local-to-atlas.js "mongodb+srv://user:pass@cluster.mongodb.net/expense-manager"');
  console.log('\nOr set MONGODB_URI_ATLAS in .env file');
  process.exit(1);
}

async function migrateLocalToAtlas() {
  let localConnection, atlasConnection;
  
  try {
    // Connect to local MongoDB
    console.log('🔄 Connecting to local MongoDB...');
    localConnection = await mongoose.createConnection(LOCAL_MONGODB_URI).asPromise();
    console.log('✅ Connected to local MongoDB');

    // Connect to MongoDB Atlas
    console.log('🔄 Connecting to MongoDB Atlas...');
    atlasConnection = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('✅ Connected to MongoDB Atlas');

    // Get models from both connections
    const LocalUser = localConnection.model('User', User.schema);
    const LocalExpense = localConnection.model('Expense', Expense.schema);
    const AtlasUser = atlasConnection.model('User', User.schema);
    const AtlasExpense = atlasConnection.model('Expense', Expense.schema);

    // Find user in local database
    console.log(`\n🔍 Looking for user: ${USER_EMAIL}`);
    const localUser = await LocalUser.findOne({ email: USER_EMAIL });
    
    if (!localUser) {
      console.error(`❌ User not found in local database!`);
      process.exit(1);
    }

    console.log(`✅ Found user: ${localUser.username} (${localUser.email})`);
    console.log(`   Local User ID: ${localUser._id}`);

    // Check if user exists in Atlas
    let atlasUser = await AtlasUser.findOne({ email: USER_EMAIL });
    
    if (!atlasUser) {
      console.log('\n📝 User not found in Atlas. Creating user...');
      // Create user in Atlas (without password hash, user will need to reset password)
      atlasUser = new AtlasUser({
        username: localUser.username,
        email: localUser.email,
        password: localUser.password, // Copy password hash
      });
      await atlasUser.save();
      console.log(`✅ Created user in Atlas: ${atlasUser._id}`);
    } else {
      console.log(`✅ User exists in Atlas: ${atlasUser._id}`);
    }

    // Get all expenses from local database
    console.log('\n📖 Reading expenses from local database...');
    const localExpenses = await LocalExpense.find({ userId: localUser._id });
    console.log(`📦 Found ${localExpenses.length} expenses in local database`);

    // Check existing expenses in Atlas
    const atlasExpenseIds = await AtlasExpense.find({ userId: atlasUser._id }).select('id');
    const existingIds = new Set(atlasExpenseIds.map(e => e.id));
    console.log(`📊 Existing expenses in Atlas: ${existingIds.size}`);

    // Migrate expenses
    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    console.log('\n🚀 Starting migration to Atlas...\n');

    for (const expense of localExpenses) {
      try {
        // Check if expense already exists in Atlas
        if (existingIds.has(expense.id)) {
          skipped++;
          continue;
        }

        // Create expense in Atlas with new userId
        const atlasExpense = new AtlasExpense({
          ...expense.toObject(),
          userId: atlasUser._id,
          _id: undefined, // Let MongoDB generate new _id
        });

        await atlasExpense.save();
        migrated++;
        console.log(`✅ Migrated: ${expense.title} - $${expense.amount.toFixed(2)}`);
      } catch (error) {
        console.error(`❌ Error migrating expense ${expense.id}:`, error.message);
        errors++;
      }
    }

    const totalAtlasExpenses = await AtlasExpense.countDocuments({ userId: atlasUser._id });

    console.log(`\n✅ Migration complete!`);
    console.log(`   ✅ Migrated: ${migrated} expenses`);
    console.log(`   ⏭️  Skipped: ${skipped} expenses (already exist)`);
    console.log(`   ❌ Errors: ${errors} expenses`);
    console.log(`\n📊 Total expenses in Atlas for ${atlasUser.username}: ${totalAtlasExpenses}`);
    
    await localConnection.close();
    await atlasConnection.close();
    console.log('\n🔌 Disconnected from databases');
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
    if (localConnection) await localConnection.close();
    if (atlasConnection) await atlasConnection.close();
    process.exit(1);
  }
}

migrateLocalToAtlas();

