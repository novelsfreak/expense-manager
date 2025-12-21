import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ticker: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  exchange: {
    type: String,
    required: true,
    enum: ['ASX', 'NSE', 'BSE', 'NYSE', 'NASDAQ', 'Other'],
  },
  market: {
    type: String,
    required: true,
    enum: ['Australian', 'Indian', 'US', 'Other'],
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  purchasePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  currentPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    enum: ['AUD', 'INR', 'USD'],
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
  // Calculated fields
  totalInvestment: {
    type: Number,
    default: 0,
  },
  currentValue: {
    type: Number,
    default: 0,
  },
  profitLoss: {
    type: Number,
    default: 0,
  },
  profitLossPercentage: {
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

// Calculate values before saving
stockSchema.pre('save', function() {
  this.totalInvestment = this.quantity * this.purchasePrice;
  this.currentValue = this.quantity * this.currentPrice;
  this.profitLoss = this.currentValue - this.totalInvestment;
  this.profitLossPercentage = this.totalInvestment > 0
    ? ((this.profitLoss / this.totalInvestment) * 100)
    : 0;
});

export default mongoose.model('Stock', stockSchema);

