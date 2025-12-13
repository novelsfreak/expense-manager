export interface Expense {
  id: string
  title: string
  amount: number
  category: string
  date: string
  description?: string
  paymentMethod: string
}

export interface ExpenseCategory {
  name: string
  color: string
  icon: string
}

export const categories: ExpenseCategory[] = [
  { name: 'Food & Dining', color: 'bg-orange-500', icon: '🍔' },
  { name: 'Grocery', color: 'bg-lime-500', icon: '🛒' },
  { name: 'Transportation', color: 'bg-blue-500', icon: '🚗' },
  { name: 'Shopping', color: 'bg-pink-500', icon: '🛍️' },
  { name: 'Bills & Utilities', color: 'bg-yellow-500', icon: '💡' },
  { name: 'Entertainment', color: 'bg-purple-500', icon: '🎬' },
  { name: 'Healthcare', color: 'bg-red-500', icon: '🏥' },
  { name: 'Education', color: 'bg-green-500', icon: '📚' },
  { name: 'Travel', color: 'bg-cyan-500', icon: '✈️' },
  { name: 'Other', color: 'bg-gray-500', icon: '📦' },
]

export const paymentMethods = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'UPI',
  'Bank Transfer',
  'Other'
]
