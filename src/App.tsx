import { useState, useEffect } from 'react'
import type { Expense } from './types/expense'
import { getExpenses, addExpense, updateExpense, deleteExpense } from './utils/storage'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import ExpenseSummary from './components/ExpenseSummary'
import Login from './components/Login'
import { useAuth } from './contexts/AuthContext'

function App() {
  const { user, logout, loading } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined)

  useEffect(() => {
    loadExpenses()
  }, [])

  const loadExpenses = async () => {
    const allExpenses = await getExpenses()
    setExpenses(allExpenses)
  }

  const handleAddExpense = async (expense: Expense) => {
    if (editingExpense) {
      await updateExpense(expense.id, expense)
    } else {
      await addExpense(expense)
    }
    await loadExpenses()
    setEditingExpense(undefined)
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id)
    await loadExpenses()
    if (editingExpense?.id === id) {
      setEditingExpense(undefined)
    }
  }

  const handleCancelEdit = () => {
    setEditingExpense(undefined)
  }

  // Filter expenses by selected month
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    const expenseMonth = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`
    return expenseMonth === selectedMonth
  })

  // Get available months from expenses
  const getAvailableMonths = () => {
    const months = new Set<string>()
    expenses.forEach(expense => {
      const date = new Date(expense.date)
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      months.add(month)
    })
    return Array.from(months).sort().reverse()
  }

  const formatMonthLabel = (month: string) => {
    const [year, monthNum] = month.split('-')
    const date = new Date(parseInt(year), parseInt(monthNum) - 1)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  }

  // Show login screen if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <div className="flex items-center gap-4">
              <span className="text-white/80">Welcome, <strong>{user.username}</strong></span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            💰 Expense Manager
          </h1>
          <p className="text-white/80 text-lg">Track and manage your monthly expenses</p>
        </div>

        {/* Month Selector */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Select Month:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {getAvailableMonths().length > 0 ? (
                  getAvailableMonths().map(month => (
                    <option key={month} value={month}>
                      {formatMonthLabel(month)}
                    </option>
                  ))
                ) : (
                  <option value={selectedMonth}>
                    {formatMonthLabel(selectedMonth)}
                  </option>
                )}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''} this month
            </div>
          </div>
        </div>

        {/* Summary */}
        <ExpenseSummary expenses={filteredExpenses} selectedMonth={selectedMonth} />

        {/* Expense Form */}
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleAddExpense}
          onCancel={editingExpense ? handleCancelEdit : undefined}
        />

        {/* Expense List */}
        <ExpenseList
          expenses={filteredExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
        />
      </div>
    </div>
  )
}

export default App
