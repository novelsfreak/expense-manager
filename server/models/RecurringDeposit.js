import mongoose from 'mongoose';

const recurringDepositSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  monthlyAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  originalCurrency: {
    type: String,
    default: 'INR',
    enum: ['AUD', 'INR', 'USD'], // Allow USD temporarily for migration
  },
  // Amount in AUD (converted)
  amountAUD: {
    type: Number,
    required: true,
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100, // Annual percentage rate
  },
  startDate: {
    type: Date,
    required: true,
  },
  maturityDate: {
    type: Date,
    required: true,
  },
  compoundingFrequency: {
    type: String,
    default: 'quarterly',
    enum: ['monthly', 'quarterly', 'half-yearly', 'annually'],
  },
  // Current value calculated based on time elapsed
  currentValue: {
    type: Number,
    default: 0,
  },
  // Future maturity value (projected)
  maturityValue: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

export default mongoose.model('RecurringDeposit', recurringDepositSchema);

