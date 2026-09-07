import { useState, useEffect } from 'react';
import type { Stock } from '../types/financial';
import { getStocks, addStock, updateStock, deleteStock } from '../utils/financial';

export default function StocksPortfolio() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMarket, setActiveMarket] = useState<'all' | 'Australian' | 'Indian' | 'US'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      const data = await getStocks();
      setStocks(data);
    } catch (error) {
      console.error('Error loading stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const stockData: Partial<Stock> = {
        ticker: (formData.get('ticker') as string).toUpperCase(),
        companyName: formData.get('companyName') as string,
        exchange: formData.get('exchange') as Stock['exchange'],
        market: formData.get('market') as Stock['market'],
        quantity: parseFloat(formData.get('quantity') as string),
        purchasePrice: parseFloat(formData.get('purchasePrice') as string),
        currentPrice: parseFloat(formData.get('currentPrice') as string),
        currency: formData.get('currency') as Stock['currency'],
        purchaseDate: formData.get('purchaseDate') as string,
        description: formData.get('description') as string || '',
      };

      if (editingStock?._id) {
        await updateStock(editingStock._id, stockData);
      } else {
        await addStock(stockData);
      }
      setShowForm(false);
      setEditingStock(null);
      await loadStocks();
    } catch (error) {
      console.error('Error saving stock:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to save stock: ${errorMessage}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stock?')) return;
    try {
      await deleteStock(id);
      await loadStocks();
    } catch (error) {
      console.error('Error deleting stock:', error);
      alert('Failed to delete stock.');
    }
  };

  const filteredStocks = activeMarket === 'all' 
    ? stocks 
    : stocks.filter(stock => stock.market === activeMarket);


  const totalProfitLoss = stocks.reduce((sum, s) => sum + (s.profitLoss || 0), 0);
  const totalInvestment = stocks.reduce((sum, s) => sum + (s.totalInvestment || 0), 0);
  const totalCurrentValue = stocks.reduce((sum, s) => sum + (s.currentValue || 0), 0);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="text-center text-gray-500">Loading stocks portfolio...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">📊 Stocks Portfolio</h3>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingStock(null);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Add Stock
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Investment</div>
          <div className="text-xl font-bold text-indigo-700">
            {stocks.length > 0 ? formatCurrency(totalInvestment, stocks[0].currency) : '$0'}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Current Value</div>
          <div className="text-xl font-bold text-green-700">
            {stocks.length > 0 ? formatCurrency(totalCurrentValue, stocks[0].currency) : '$0'}
          </div>
        </div>
        <div className={`rounded-lg p-4 ${totalProfitLoss >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="text-sm text-gray-600 mb-1">Profit/Loss</div>
          <div className={`text-xl font-bold ${totalProfitLoss >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {stocks.length > 0 ? formatCurrency(totalProfitLoss, stocks[0].currency) : '$0'}
          </div>
          {totalInvestment > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {((totalProfitLoss / totalInvestment) * 100).toFixed(2)}%
            </div>
          )}
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Stocks</div>
          <div className="text-xl font-bold text-blue-700">{stocks.length}</div>
        </div>
      </div>

      {/* Market Tabs */}
      <div className="flex gap-2 mb-4 border-b">
        <button
          onClick={() => setActiveMarket('all')}
          className={`px-4 py-2 font-medium ${activeMarket === 'all' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
        >
          All ({stocks.length})
        </button>
        <button
          onClick={() => setActiveMarket('Australian')}
          className={`px-4 py-2 font-medium ${activeMarket === 'Australian' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
        >
          Australian ({stocks.filter(s => s.market === 'Australian').length})
        </button>
        <button
          onClick={() => setActiveMarket('Indian')}
          className={`px-4 py-2 font-medium ${activeMarket === 'Indian' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
        >
          Indian ({stocks.filter(s => s.market === 'Indian').length})
        </button>
        <button
          onClick={() => setActiveMarket('US')}
          className={`px-4 py-2 font-medium ${activeMarket === 'US' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
        >
          US ({stocks.filter(s => s.market === 'US').length})
        </button>
      </div>

      {/* Stock Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold mb-4">{editingStock ? 'Edit Stock' : 'Add New Stock'}</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ticker Symbol</label>
                <input
                  type="text"
                  name="ticker"
                  defaultValue={editingStock?.ticker || ''}
                  placeholder="e.g., AAPL, RELIANCE"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  defaultValue={editingStock?.companyName || ''}
                  placeholder="e.g., Apple Inc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Market</label>
                <select
                  name="market"
                  defaultValue={editingStock?.market || 'Australian'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="Australian">Australian</option>
                  <option value="Indian">Indian</option>
                  <option value="US">US</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exchange</label>
                <select
                  name="exchange"
                  defaultValue={editingStock?.exchange || 'ASX'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="ASX">ASX (Australian)</option>
                  <option value="NSE">NSE (Indian)</option>
                  <option value="BSE">BSE (Indian)</option>
                  <option value="NYSE">NYSE (US)</option>
                  <option value="NASDAQ">NASDAQ (US)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  step="0.01"
                  name="quantity"
                  defaultValue={editingStock?.quantity || ''}
                  placeholder="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    name="purchasePrice"
                    defaultValue={editingStock?.purchasePrice || ''}
                    placeholder="150.00"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <select
                    name="currency"
                    defaultValue={editingStock?.currency || 'AUD'}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="AUD">AUD</option>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="currentPrice"
                  defaultValue={editingStock?.currentPrice || ''}
                  placeholder="160.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                <input
                  type="date"
                  name="purchaseDate"
                  defaultValue={editingStock?.purchaseDate ? editingStock.purchaseDate.split('T')[0] : new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <input
                type="text"
                name="description"
                defaultValue={editingStock?.description || ''}
                placeholder="e.g., Long-term investment"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {editingStock ? 'Update Stock' : 'Add Stock'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingStock(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stocks List */}
      {!showForm && (
        <div className="space-y-3">
          {filteredStocks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                {activeMarket === 'all' 
                  ? 'No stocks added yet.' 
                  : `No ${activeMarket} stocks found.`}
              </div>
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingStock(null);
                }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                + Add Your First Stock
              </button>
            </div>
          ) : (
            filteredStocks.map((stock) => (
              <div key={stock._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-lg">{stock.ticker}</div>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">{stock.exchange}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        stock.market === 'Australian' ? 'bg-blue-100 text-blue-700' :
                        stock.market === 'Indian' ? 'bg-orange-100 text-orange-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {stock.market}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{stock.companyName}</div>
                    <div className="text-sm text-gray-600 mt-2">
                      Quantity: {stock.quantity} shares
                      {' • '}
                      Purchase: {formatCurrency(stock.purchasePrice, stock.currency)}/share
                      {' • '}
                      Current: {formatCurrency(stock.currentPrice, stock.currency)}/share
                      {' • '}
                      Purchased: {new Date(stock.purchaseDate).toLocaleDateString()}
                    </div>
                    {stock.description && (
                      <div className="text-sm text-gray-500 mt-1">{stock.description}</div>
                    )}
                    <div className="mt-3 grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-gray-500">Investment</div>
                        <div className="text-sm font-semibold">
                          {formatCurrency(stock.totalInvestment || 0, stock.currency)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Current Value</div>
                        <div className="text-sm font-semibold text-green-600">
                          {formatCurrency(stock.currentValue || 0, stock.currency)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Profit/Loss</div>
                        <div className={`text-sm font-semibold ${
                          (stock.profitLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(stock.profitLoss || 0, stock.currency)}
                          {' '}
                          ({stock.profitLossPercentage?.toFixed(2) || '0.00'}%)
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingStock(stock);
                        setShowForm(true);
                      }}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => stock._id && handleDelete(stock._id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

