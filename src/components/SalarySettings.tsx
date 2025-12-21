import { useState, useEffect } from 'react';
import type { Salary } from '../types/financial';
import { getSalary, saveSalary } from '../utils/financial';

export default function SalarySettings() {
  const [salary, setSalary] = useState<Salary>({ monthlySalary: 0, currency: 'AUD', conversionRate: 1 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadSalary();
  }, []);

  const loadSalary = async () => {
    try {
      const data = await getSalary();
      setSalary(data);
      setShowForm(data.monthlySalary === 0);
    } catch (error) {
      console.error('Error loading salary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSalary(salary);
      setShowForm(false);
      await loadSalary();
    } catch (error) {
      console.error('Error saving salary:', error);
      alert('Failed to save salary. Please try again.');
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
        <div className="text-center text-gray-500">Loading salary settings...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">💰 Salary Settings</h3>
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
              Monthly Salary
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={salary.monthlySalary || ''}
                onChange={(e) => setSalary({ ...salary, monthlySalary: parseFloat(e.target.value) || 0 })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <select
                value={salary.currency}
                onChange={(e) => setSalary({ ...salary, currency: e.target.value as 'AUD' | 'INR' })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="AUD">AUD</option>
                <option value="INR">INR</option>
              </select>
            </div>
            {salary.monthlySalary > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                ≈ {formatCurrency(salary.currency === 'INR' ? salary.monthlySalary * 0.018 : salary.monthlySalary, 'AUD')} AUD
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Salary'}
            </button>
            {salary.monthlySalary > 0 && (
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  loadSalary();
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
          <div className="text-gray-600 mb-2">Monthly Salary:</div>
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(salary.monthlySalary, salary.currency)}
          </div>
          {salary.currency === 'INR' && (
            <div className="text-sm text-gray-500 mt-1">
              ≈ {formatCurrency(salary.monthlySalary * 0.018, 'AUD')} AUD
            </div>
          )}
        </div>
      )}
    </div>
  );
}

