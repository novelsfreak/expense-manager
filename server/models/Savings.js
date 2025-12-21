import mongoose from 'mongoose';

const savingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One savings account per user
  },
  currentBalance: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  currency: {
    type: String,
    default: 'AUD',
    enum: ['AUD', 'INR', 'USD'], // Allow USD temporarily for migration
  },
  // Conversion rate from original currency to AUD
  conversionRate: {
    type: Number,
    default: 1,
  },
  interestRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100, // Annual percentage rate
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Savings', savingsSchema);

