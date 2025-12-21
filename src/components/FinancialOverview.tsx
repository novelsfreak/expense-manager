import type { FinancialOverview } from '../types/financial';

interface FinancialOverviewProps {
  overview: FinancialOverview;
}

export default function FinancialOverview({ overview }: FinancialOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const savingsPercentage = overview.monthlySalary > 0
    ? ((overview.monthlySavings / overview.monthlySalary) * 100).toFixed(1)
    : '0';

  // Debug logging
  console.log('FinancialOverview rendering with:', overview);

  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg shadow-xl p-6 mb-6 text-white">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        💼 Financial Overview
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Monthly Salary */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-sm opacity-90 mb-1">Monthly Salary</div>
          <div className="text-2xl font-bold">{formatCurrency(overview.monthlySalary)}</div>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-sm opacity-90 mb-1">Monthly Expenses</div>
          <div className="text-2xl font-bold">{formatCurrency(overview.monthlyExpenses)}</div>
        </div>

        {/* Monthly Savings */}
        <div className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 ${overview.monthlySavings < 0 ? 'border-2 border-red-400' : ''}`}>
          <div className="text-sm opacity-90 mb-1">Monthly Savings</div>
          <div className="text-2xl font-bold">{formatCurrency(overview.monthlySavings)}</div>
          <div className="text-xs mt-1 opacity-75">{savingsPercentage}% of salary</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Investments */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-sm opacity-90 mb-1">Total Investments</div>
          <div className="text-xl font-bold">{formatCurrency(overview.totalInvestments)}</div>
          <div className="text-xs mt-1 opacity-75">SIPs + FDs + RDs</div>
        </div>

        {/* Total Stocks */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-sm opacity-90 mb-1">Stocks Portfolio</div>
          <div className="text-xl font-bold">{formatCurrency(overview.totalStocks)}</div>
          <div className="text-xs mt-1 opacity-75">Australian + Indian + US</div>
        </div>

        {/* Total Savings */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-sm opacity-90 mb-1">Savings Account</div>
          <div className="text-xl font-bold">{formatCurrency(overview.totalSavings)}</div>
        </div>

        {/* Net Worth */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border-2 border-yellow-300">
          <div className="text-sm opacity-90 mb-1">Net Worth</div>
          <div className="text-xl font-bold">{formatCurrency(overview.netWorth)}</div>
          <div className="text-xs mt-1 opacity-75">Investments + Stocks + Savings</div>
        </div>
      </div>
    </div>
  );
}

