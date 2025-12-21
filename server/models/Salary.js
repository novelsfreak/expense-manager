import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One salary per user
  },
  monthlySalary: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'AUD',
    enum: ['AUD', 'INR', 'USD'], // Allow USD temporarily for migration
  },
  // Conversion rate from original currency to AUD (for display)
  conversionRate: {
    type: Number,
    default: 1, // 1 for AUD, ~55 for INR
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Salary', salarySchema);

