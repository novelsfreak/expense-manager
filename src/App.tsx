import { useState, useEffect, useMemo } from 'react'
import type { Expense } from './types/expense'
import type { Salary, SIP, FixedDeposit, RecurringDeposit, Savings, Stock } from './types/financial'
import { getExpenses, addExpense, updateExpense, deleteExpense } from './utils/storage'
import { getSalary, getSIPs, getFixedDeposits, getRecurringDeposits, getSavings, getStocks, calculateFinancialOverview } from './utils/financial'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import ExpenseSummary from './components/ExpenseSummary'
import FinancialOverview from './components/FinancialOverview'
import SalarySettings from './components/SalarySettings'
import SavingsSettings from './components/SavingsSettings'
import InvestmentDashboard from './components/InvestmentDashboard'
import StocksPortfolio from './components/StocksPortfolio'
import Login from './components/Login'
import { useAuth } from './contexts/AuthContext'

function App() {
  const { user, logout, loading } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [salary, setSalary] = useState<Salary>({ monthlySalary: 0, currency: 'AUD', conversionRate: 1 })
  const [sips, setSIPs] = useState<SIP[]>([])
  const [fixedDeposits, setFixedDeposits] = useState<FixedDeposit[]>([])
  const [recurringDeposits, setRecurringDeposits] = useState<RecurringDeposit[]>([])
  const [savings, setSavings] = useState<Savings>({ currentBalance: 0, currency: 'AUD', conversionRate: 1, interestRate: 0 })
  const [stocks, setStocks] = useState<Stock[]>([])
  const [_financialDataLoaded, setFinancialDataLoaded] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<'expenses' | 'financial'>('expenses')

  useEffect(() => {
    if (user) {
      loadAllData()
    }
  }, [user])

  const loadAllData = async () => {
    await Promise.all([
      loadExpenses(),
      loadFinancialData(),
    ])
  }

  const loadFinancialData = async () => {
    try {
      // Load stocks separately to handle 404 gracefully
      const [salaryData, sipsData, fdsData, rdsData, savingsData] = await Promise.all([
        getSalary(),
        getSIPs(),
        getFixedDeposits(),
        getRecurringDeposits(),
        getSavings(),
      ])
      
      // Load stocks separately (may fail if route not available)
      let stocksData: Stock[] = []
      try {
        stocksData = await getStocks()
      } catch (error) {
        console.warn('Could not load stocks (route may not be available):', error)
      }
      
      console.log('Loaded financial data:', {
        salary: salaryData,
        salaryMonthly: salaryData.monthlySalary,
        salaryCurrency: salaryData.currency,
        sips: sipsData.length,
        fds: fdsData.length,
        rds: rdsData.length,
        savings: savingsData,
        stocks: stocksData.length,
      })
      setSalary(salaryData)
      setSIPs(sipsData)
      setFixedDeposits(fdsData)
      setRecurringDeposits(rdsData)
      setSavings(savingsData)
      setStocks(stocksData)
      setFinancialDataLoaded(true)
    } catch (error) {
      console.error('Error loading financial data:', error)
      setFinancialDataLoaded(true) // Set to true even on error to prevent infinite loading
    }
  }

  const loadExpenses = async () => {
    try {
      const allExpenses = await getExpenses()
      console.log('Loaded expenses:', allExpenses.length)
      setExpenses(allExpenses)
    } catch (error) {
      console.error('Error loading expenses:', error)
    }
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

  // Calculate financial overview - only calculate when we have data
  const financialOverview = useMemo(() => {
    console.log('Calculating financial overview with:', {
      salary: salary.monthlySalary,
      salaryCurrency: salary.currency,
      expensesCount: expenses.length,
      sipsCount: sips.length,
      fdsCount: fixedDeposits.length,
      rdsCount: recurringDeposits.length,
      savings: savings.currentBalance,
      stocksCount: stocks.length,
    });
    return calculateFinancialOverview(salary, expenses, sips, fixedDeposits, recurringDeposits, savings, stocks);
  }, [salary, expenses, sips, fixedDeposits, recurringDeposits, savings, stocks])

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
      if (expense.date) {
        try {
          const date = new Date(expense.date)
          if (!isNaN(date.getTime())) {
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            months.add(month)
          }
        } catch (error) {
          console.error('Error parsing date:', expense.date, error)
        }
      }
    })
    const sortedMonths = Array.from(months).sort().reverse()
    // If no months found but we have expenses, show current month
    if (sortedMonths.length === 0 && expenses.length > 0) {
      const now = new Date()
      return [`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`]
    }
    return sortedMonths
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
          <p className="text-white/80 text-lg">Track expenses, investments, and savings</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg p-2 mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'expenses'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            💸 Expenses
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'financial'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            💼 Financial Overview
          </button>
        </div>

        {/* Financial Overview Tab */}
        {activeTab === 'financial' && (
          <>
            <FinancialOverview overview={financialOverview} />
            <SalarySettings />
            <SavingsSettings />
            <InvestmentDashboard />
            <StocksPortfolio />
          </>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <>
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
                  <>
                    <option value={selectedMonth}>
                      {formatMonthLabel(selectedMonth)}
                    </option>
                    {/* Show all months if no expenses yet */}
                    {expenses.length === 0 && (
                      <option value={selectedMonth}>
                        {formatMonthLabel(selectedMonth)} (No expenses)
                      </option>
                    )}
                  </>
                )}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''} this month
              {expenses.length > 0 && (
                <span className="ml-2 text-xs">({expenses.length} total)</span>
              )}
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
          </>
        )}
      </div>
    </div>
  )
}

export default App
