import type { Expense } from '../types/expense'
import { categories } from '../types/expense'

interface ExpenseSummaryProps {
  expenses: Expense[]
  selectedMonth?: string
}

const ExpenseSummary = ({ expenses, selectedMonth }: ExpenseSummaryProps) => {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  const categoryTotals = categories.map(category => {
    const total = expenses
      .filter(e => e.category === category.name)
      .reduce((sum, expense) => sum + expense.amount, 0)
    return { ...category, total }
  }).filter(cat => cat.total > 0).sort((a, b) => b.total - a.total)

  const paymentMethodTotals = expenses.reduce((acc, expense) => {
    acc[expense.paymentMethod] = (acc[expense.paymentMethod] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const averageExpense = expenses.length > 0 ? totalAmount / expenses.length : 0
  const highestExpense = expenses.length > 0 
    ? expenses.reduce((max, e) => e.amount > max.amount ? e : max, expenses[0])
    : null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Expenses Card */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Total Expenses</h3>
          <div className="text-2xl">💰</div>
        </div>
        <div className="text-3xl font-bold">
          ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-sm opacity-75 mt-1">{expenses.length} transactions</div>
      </div>

      {/* Average Expense Card */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Average Expense</h3>
          <div className="text-2xl">📊</div>
        </div>
        <div className="text-3xl font-bold">
          ${averageExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-sm opacity-75 mt-1">Per transaction</div>
      </div>

      {/* Highest Expense Card */}
      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Highest Expense</h3>
          <div className="text-2xl">⬆️</div>
        </div>
        <div className="text-3xl font-bold">
          {highestExpense 
            ? `$${highestExpense.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : '$0.00'
          }
        </div>
        {highestExpense && (
          <div className="text-sm opacity-75 mt-1 truncate">{highestExpense.title}</div>
        )}
      </div>

      {/* Top Category Card */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Top Category</h3>
          <div className="text-2xl">{categoryTotals[0]?.icon || '📦'}</div>
        </div>
        <div className="text-3xl font-bold">
          {categoryTotals[0]
            ? `$${categoryTotals[0].total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : '$0.00'
          }
        </div>
        {categoryTotals[0] && (
          <div className="text-sm opacity-75 mt-1">{categoryTotals[0].name}</div>
        )}
      </div>

      {/* Category Breakdown */}
      {categoryTotals.length > 0 && (
        <div className="md:col-span-2 lg:col-span-4 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {categoryTotals.map((category) => {
              const percentage = (category.total / totalAmount) * 100
              return (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium text-gray-700">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-800">
                        ${category.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${category.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Payment Method Breakdown */}
      {Object.keys(paymentMethodTotals).length > 0 && (
        <div className="md:col-span-2 lg:col-span-4 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Method Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(paymentMethodTotals).map(([method, amount]) => {
              const percentage = (amount / totalAmount) * 100
              return (
                <div key={method} className="p-4 border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">{method}</div>
                  <div className="text-xl font-bold text-gray-800">
                    ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of total</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpenseSummary
