import { useState, useEffect } from 'react';
import type { Savings } from '../types/financial';
import { getSavings, saveSavings } from '../utils/financial';

export default function SavingsSettings() {
  const [savings, setSavings] = useState<Savings>({ 
    currentBalance: 0, 
    currency: 'AUD', 
    conversionRate: 1, 
    interestRate: 0 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadSavings();
  }, []);

  const loadSavings = async () => {
    try {
      const data = await getSavings();
      setSavings(data);
      setShowForm(data.currentBalance === 0);
    } catch (error) {
      console.error('Error loading savings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSavings(savings);
      setShowForm(false);
      await loadSavings();
    } catch (error) {
      console.error('Error saving savings:', error);
      alert('Failed to save savings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="text-center text-gray-500">Loading savings...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">💵 Savings Account</h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Balance
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={savings.currentBalance || ''}
                onChange={(e) => setSavings({ ...savings, currentBalance: parseFloat(e.target.value) || 0 })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <select
                value={savings.currency}
                onChange={(e) => setSavings({ ...savings, currency: e.target.value as 'AUD' | 'INR' })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="AUD">AUD</option>
                <option value="INR">INR</option>
              </select>
            </div>
            {savings.currentBalance > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                ≈ {formatCurrency(savings.currency === 'INR' ? savings.currentBalance * 0.018 : savings.currentBalance, 'AUD')} AUD
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (% per year)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={savings.interestRate || ''}
              onChange={(e) => setSavings({ ...savings, interestRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Savings'}
            </button>
            {savings.currentBalance > 0 && (
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  loadSavings();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="text-lg">
          <div className="text-gray-600 mb-2">Current Balance:</div>
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(savings.currentBalance, savings.currency)}
          </div>
          {savings.currency === 'INR' && (
            <div className="text-sm text-gray-500 mt-1">
              ≈ {formatCurrency(savings.currentBalance * 0.018, 'AUD')} AUD
            </div>
          )}
          {savings.interestRate > 0 && (
            <div className="text-sm text-gray-500 mt-2">
              Interest Rate: {savings.interestRate}% p.a.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

