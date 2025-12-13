import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  paymentMethod: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Compound index to ensure id is unique per user
expenseSchema.index({ userId: 1, id: 1 }, { unique: true });

export default mongoose.model('Expense', expenseSchema);

