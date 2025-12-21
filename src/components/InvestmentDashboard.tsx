import { useState, useEffect } from 'react';
import type { SIP, FixedDeposit, RecurringDeposit } from '../types/financial';
import { getSIPs, addSIP, updateSIP, deleteSIP } from '../utils/financial';
import { getFixedDeposits, addFixedDeposit, updateFixedDeposit, deleteFixedDeposit } from '../utils/financial';
import { getRecurringDeposits, addRecurringDeposit, updateRecurringDeposit, deleteRecurringDeposit } from '../utils/financial';

export default function InvestmentDashboard() {
  const [sips, setSIPs] = useState<SIP[]>([]);
  const [fixedDeposits, setFixedDeposits] = useState<FixedDeposit[]>([]);
  const [recurringDeposits, setRecurringDeposits] = useState<RecurringDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sip' | 'fd' | 'rd'>('sip');
  const [showSIPForm, setShowSIPForm] = useState(false);
  const [showFDForm, setShowFDForm] = useState(false);
  const [showRDForm, setShowRDForm] = useState(false);
  const [editingSIP, setEditingSIP] = useState<SIP | null>(null);
  const [editingFD, setEditingFD] = useState<FixedDeposit | null>(null);
  const [editingRD, setEditingRD] = useState<RecurringDeposit | null>(null);

  useEffect(() => {
    loadInvestments();
  }, []);

  const loadInvestments = async () => {
    try {
      const [sipsData, fdsData, rdsData] = await Promise.all([
        getSIPs(),
        getFixedDeposits(),
        getRecurringDeposits(),
      ]);
      setSIPs(sipsData);
      setFixedDeposits(fdsData);
      setRecurringDeposits(rdsData);
    } catch (error) {
      console.error('Error loading investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSIPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const sipData: Partial<SIP> = {
      name: formData.get('name') as string,
      monthlyAmount: parseFloat(formData.get('monthlyAmount') as string),
      originalCurrency: (formData.get('originalCurrency') as 'AUD' | 'INR') || 'INR',
      expectedReturnRate: parseFloat(formData.get('expectedReturnRate') as string),
      startDate: formData.get('startDate') as string,
      description: formData.get('description') as string || '',
    };

    try {
      if (editingSIP?._id) {
        await updateSIP(editingSIP._id, sipData);
      } else {
        await addSIP(sipData);
      }
      setShowSIPForm(false);
      setEditingSIP(null);
      await loadInvestments();
    } catch (error) {
      console.error('Error saving SIP:', error);
      alert('Failed to save SIP. Please try again.');
    }
  };

  const handleFDSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fdData: Partial<FixedDeposit> = {
      name: formData.get('name') as string,
      principalAmount: parseFloat(formData.get('principalAmount') as string),
      originalCurrency: (formData.get('originalCurrency') as 'AUD' | 'INR') || 'INR',
      interestRate: parseFloat(formData.get('interestRate') as string),
      startDate: formData.get('startDate') as string,
      maturityDate: formData.get('maturityDate') as string,
      description: formData.get('description') as string || '',
    };

    try {
      if (editingFD?._id) {
        await updateFixedDeposit(editingFD._id, fdData);
      } else {
        await addFixedDeposit(fdData);
      }
      setShowFDForm(false);
      setEditingFD(null);
      await loadInvestments();
    } catch (error) {
      console.error('Error saving FD:', error);
      alert('Failed to save Fixed Deposit. Please try again.');
    }
  };

  const handleDeleteSIP = async (id: string) => {
    if (!confirm('Are you sure you want to delete this SIP?')) return;
    try {
      await deleteSIP(id);
      await loadInvestments();
    } catch (error) {
      console.error('Error deleting SIP:', error);
      alert('Failed to delete SIP.');
    }
  };

  const handleDeleteFD = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Fixed Deposit?')) return;
    try {
      await deleteFixedDeposit(id);
      await loadInvestments();
    } catch (error) {
      console.error('Error deleting FD:', error);
      alert('Failed to delete Fixed Deposit.');
    }
  };

  const handleRDSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const rdData: Partial<RecurringDeposit> = {
        name: formData.get('name') as string,
        monthlyAmount: parseFloat(formData.get('monthlyAmount') as string),
        originalCurrency: (formData.get('originalCurrency') as 'AUD' | 'INR') || 'INR',
        interestRate: parseFloat(formData.get('interestRate') as string),
        startDate: formData.get('startDate') as string,
        maturityDate: formData.get('maturityDate') as string,
        compoundingFrequency: (formData.get('compoundingFrequency') as 'monthly' | 'quarterly' | 'half-yearly' | 'annually') || 'quarterly',
        description: formData.get('description') as string || '',
      };

      console.log('Submitting RD data:', rdData);

      if (editingRD?._id) {
        await updateRecurringDeposit(editingRD._id, rdData);
      } else {
        await addRecurringDeposit(rdData);
      }
      setShowRDForm(false);
      setEditingRD(null);
      await loadInvestments();
    } catch (error) {
      console.error('Error saving RD:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to save Recurring Deposit: ${errorMessage}. Please check console for details.`);
    }
  };

  const handleDeleteRD = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Recurring Deposit?')) return;
    try {
      await deleteRecurringDeposit(id);
      await loadInvestments();
    } catch (error) {
      console.error('Error deleting RD:', error);
      alert('Failed to delete Recurring Deposit.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="text-center text-gray-500">Loading investments...</div>
      </div>
    );
  }

  // Calculate totals in original currencies (for display purposes)
  // Group by currency and calculate totals separately
  const sipTotalsByCurrency = sips.reduce((acc, sip) => {
    const currency = sip.originalCurrency || 'INR';
    // Use original monthlyAmount, not converted currentValue
    const value = sip.monthlyAmount || 0;
    if (!acc[currency]) acc[currency] = 0;
    acc[currency] += value;
    return acc;
  }, {} as Record<string, number>);

  const fdTotalsByCurrency = fixedDeposits.reduce((acc, fd) => {
    const currency = fd.originalCurrency || 'INR';
    // Use original principalAmount, not converted currentValue
    const value = fd.principalAmount || 0;
    if (!acc[currency]) acc[currency] = 0;
    acc[currency] += value;
    return acc;
  }, {} as Record<string, number>);

  const rdTotalsByCurrency = recurringDeposits.reduce((acc, rd) => {
    const currency = rd.originalCurrency || 'INR';
    // Use original monthlyAmount, not converted currentValue
    const value = rd.monthlyAmount || 0;
    if (!acc[currency]) acc[currency] = 0;
    acc[currency] += value;
    return acc;
  }, {} as Record<string, number>);

  // Get primary currency for each investment type (most common or first)
  const getPrimaryCurrency = (items: Array<{ originalCurrency?: string }>) => {
    if (items.length === 0) return 'AUD';
    const currencies = items.map(item => item.originalCurrency || 'INR');
    const currencyCounts = currencies.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.keys(currencyCounts).reduce((a, b) => 
      currencyCounts[a] > currencyCounts[b] ? a : b
    );
  };

  const sipCurrency = getPrimaryCurrency(sips);
  const fdCurrency = getPrimaryCurrency(fixedDeposits);
  const rdCurrency = getPrimaryCurrency(recurringDeposits);

  const totalSIPValue = sipTotalsByCurrency[sipCurrency] || 0;
  const totalFDValue = fdTotalsByCurrency[fdCurrency] || 0;
  const totalRDValue = rdTotalsByCurrency[rdCurrency] || 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">📈 Investment Dashboard</h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab('sip');
              setShowSIPForm(true);
              setEditingSIP(null);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            + Add SIP
          </button>
          <button
            onClick={() => {
              setActiveTab('fd');
              setShowFDForm(true);
              setEditingFD(null);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add FD
          </button>
          <button
            onClick={() => {
              setActiveTab('rd');
              setShowRDForm(true);
              setEditingRD(null);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            + Add RD
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total SIP Value</div>
          <div className="text-xl font-bold text-green-700">
            {sipCurrency === 'INR' 
              ? formatCurrencyINR(totalSIPValue) 
              : formatCurrency(totalSIPValue)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {sips.length > 0 ? `(${sips.length} SIPs in ${sipCurrency})` : 'No SIPs'}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total FD Value</div>
          <div className="text-xl font-bold text-blue-700">
            {fdCurrency === 'INR' 
              ? formatCurrencyINR(totalFDValue) 
              : formatCurrency(totalFDValue)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {fixedDeposits.length > 0 ? `(${fixedDeposits.length} FDs in ${fdCurrency})` : 'No FDs'}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total RD Value</div>
          <div className="text-xl font-bold text-purple-700">
            {rdCurrency === 'INR' 
              ? formatCurrencyINR(totalRDValue) 
              : formatCurrency(totalRDValue)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {recurringDeposits.length > 0 ? `(${recurringDeposits.length} RDs in ${rdCurrency})` : 'No RDs'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b">
        <button
          onClick={() => setActiveTab('sip')}
          className={`px-4 py-2 font-medium ${activeTab === 'sip' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
        >
          SIPs ({sips.length})
        </button>
        <button
          onClick={() => setActiveTab('fd')}
          className={`px-4 py-2 font-medium ${activeTab === 'fd' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Fixed Deposits ({fixedDeposits.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('rd');
            setShowRDForm(false);
            setEditingRD(null);
          }}
          className={`px-4 py-2 font-medium ${activeTab === 'rd' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
        >
          Recurring Deposits ({recurringDeposits.length})
        </button>
      </div>

      {/* SIP Form */}
      {showSIPForm && activeTab === 'sip' && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold mb-4">{editingSIP ? 'Edit SIP' : 'Add New SIP'}</h4>
          <form onSubmit={handleSIPSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingSIP?.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Amount</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    name="monthlyAmount"
                    defaultValue={editingSIP?.monthlyAmount}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <select
                    name="originalCurrency"
                    defaultValue={editingSIP?.originalCurrency || 'INR'}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="INR">INR</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Return Rate (% per year)</label>
                <input
                  type="number"
                  step="0.1"
                  name="expectedReturnRate"
                  defaultValue={editingSIP?.expectedReturnRate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  defaultValue={editingSIP?.startDate ? editingSIP.startDate.split('T')[0] : ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <input
                type="text"
                name="description"
                defaultValue={editingSIP?.description}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editingSIP ? 'Update SIP' : 'Add SIP'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSIPForm(false);
                  setEditingSIP(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FD Form */}
      {showFDForm && activeTab === 'fd' && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold mb-4">{editingFD ? 'Edit Fixed Deposit' : 'Add New Fixed Deposit'}</h4>
          <form onSubmit={handleFDSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingFD?.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Principal Amount</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    name="principalAmount"
                    defaultValue={editingFD?.principalAmount}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <select
                    name="originalCurrency"
                    defaultValue={editingFD?.originalCurrency || 'INR'}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="INR">INR</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (% per year)</label>
                <input
                  type="number"
                  step="0.1"
                  name="interestRate"
                  defaultValue={editingFD?.interestRate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  defaultValue={editingFD?.startDate ? editingFD.startDate.split('T')[0] : ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maturity Date</label>
                <input
                  type="date"
                  name="maturityDate"
                  defaultValue={editingFD?.maturityDate ? editingFD.maturityDate.split('T')[0] : ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <input
                type="text"
                name="description"
                defaultValue={editingFD?.description}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingFD ? 'Update FD' : 'Add FD'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowFDForm(false);
                  setEditingFD(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SIP List */}
      {activeTab === 'sip' && (
        <div className="space-y-3">
          {sips.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No SIPs added yet. Click "Add SIP" to get started.</div>
          ) : (
            sips.map((sip) => (
              <div key={sip._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-bold text-lg">{sip.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {sip.originalCurrency === 'INR' ? formatCurrencyINR(sip.monthlyAmount) : formatCurrency(sip.monthlyAmount)}/month
                      {' • '}
                      {sip.expectedReturnRate}% p.a.
                      {' • Started: '}
                      {new Date(sip.startDate).toLocaleDateString()}
                    </div>
                    {sip.description && (
                      <div className="text-sm text-gray-500 mt-1">{sip.description}</div>
                    )}
                    <div className="mt-2 text-lg font-bold text-green-600">
                      Current Value: {sip.originalCurrency === 'INR' 
                        ? formatCurrencyINR(sip.currentValue || sip.monthlyAmount) 
                        : formatCurrency(sip.currentValue || sip.monthlyAmount)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingSIP(sip);
                        setShowSIPForm(true);
                      }}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => sip._id && handleDeleteSIP(sip._id)}
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

      {/* FD List */}
      {activeTab === 'fd' && (
        <div className="space-y-3">
          {fixedDeposits.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No Fixed Deposits added yet. Click "Add FD" to get started.</div>
          ) : (
            fixedDeposits.map((fd) => (
              <div key={fd._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-bold text-lg">{fd.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Principal: {fd.originalCurrency === 'INR' ? formatCurrencyINR(fd.principalAmount) : formatCurrency(fd.principalAmount)}
                      {' • '}
                      {fd.interestRate}% p.a.
                      {' • Matures: '}
                      {new Date(fd.maturityDate).toLocaleDateString()}
                    </div>
                    {fd.description && (
                      <div className="text-sm text-gray-500 mt-1">{fd.description}</div>
                    )}
                    <div className="mt-2 text-lg font-bold text-blue-600">
                      Current Value: {fd.originalCurrency === 'INR' 
                        ? formatCurrencyINR(fd.currentValue || fd.principalAmount) 
                        : formatCurrency(fd.currentValue || fd.principalAmount)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingFD(fd);
                        setShowFDForm(true);
                      }}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => fd._id && handleDeleteFD(fd._id)}
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

      {/* RD Form */}
      {showRDForm && activeTab === 'rd' && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold mb-4">{editingRD ? 'Edit Recurring Deposit' : 'Add New Recurring Deposit'}</h4>
          <form onSubmit={handleRDSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingRD?.name || ''}
                  placeholder="e.g., HDFC Bank RD"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Amount</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    name="monthlyAmount"
                    defaultValue={editingRD?.monthlyAmount || ''}
                    placeholder="5000"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <select
                    name="originalCurrency"
                    defaultValue={editingRD?.originalCurrency || 'INR'}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="INR">INR</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (% per year)</label>
                <input
                  type="number"
                  step="0.1"
                  name="interestRate"
                  defaultValue={editingRD?.interestRate || '7.5'}
                  placeholder="7.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Typical RD rates: 6-8% p.a.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compounding Frequency</label>
                <select
                  name="compoundingFrequency"
                  defaultValue={editingRD?.compoundingFrequency || 'quarterly'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly (Most Common)</option>
                  <option value="half-yearly">Half-Yearly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  defaultValue={editingRD?.startDate ? editingRD.startDate.split('T')[0] : new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maturity Date</label>
                <input
                  type="date"
                  name="maturityDate"
                  defaultValue={editingRD?.maturityDate ? editingRD.maturityDate.split('T')[0] : (() => {
                    const date = new Date();
                    date.setFullYear(date.getFullYear() + 1); // Default to 1 year from now
                    return date.toISOString().split('T')[0];
                  })()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Common tenure: 1-5 years</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <input
                type="text"
                name="description"
                defaultValue={editingRD?.description || ''}
                placeholder="e.g., Emergency fund RD"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                {editingRD ? 'Update RD' : 'Add RD'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRDForm(false);
                  setEditingRD(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RD List - Show when tab is active and form is not showing */}
      {activeTab === 'rd' && !showRDForm && (
        <div className="space-y-3">
          {recurringDeposits.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">No Recurring Deposits added yet.</div>
              <button
                onClick={() => {
                  setShowRDForm(true);
                  setEditingRD(null);
                }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                + Add Your First RD
              </button>
            </div>
          ) : (
            recurringDeposits.map((rd) => (
              <div key={rd._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-bold text-lg">{rd.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {rd.originalCurrency === 'INR' ? formatCurrencyINR(rd.monthlyAmount) : formatCurrency(rd.monthlyAmount)}/month
                      {' • '}
                      {rd.interestRate}% p.a.
                      {' • '}
                      {rd.compoundingFrequency}
                      {' • Matures: '}
                      {new Date(rd.maturityDate).toLocaleDateString()}
                    </div>
                    {rd.description && (
                      <div className="text-sm text-gray-500 mt-1">{rd.description}</div>
                    )}
                    <div className="mt-2 space-y-1">
                      <div className="text-lg font-bold text-purple-600">
                        Current Value: {rd.originalCurrency === 'INR' 
                          ? formatCurrencyINR(rd.currentValue || rd.monthlyAmount) 
                          : formatCurrency(rd.currentValue || rd.monthlyAmount)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Projected Maturity Value: {rd.originalCurrency === 'INR' 
                          ? formatCurrencyINR(rd.maturityValue || rd.monthlyAmount) 
                          : formatCurrency(rd.maturityValue || rd.monthlyAmount)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingRD(rd);
                        setShowRDForm(true);
                      }}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => rd._id && handleDeleteRD(rd._id)}
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

