import type { Expense } from '../types/expense'

// Detect API base URL dynamically
// - If VITE_API_URL is set, use it
// - If in dev mode, detect current host and use port 3001 for API
// - In production, use relative paths
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}/api`;
  }
  
  if (import.meta.env.DEV) {
    // In dev mode, detect the current host (works for localhost and Tailscale IPs)
    const host = window.location.hostname;
    const port = '3001';
    return `http://${host}:${port}/api`;
  }
  
  // Production: use relative paths
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

// Debug: Log API URL in dev mode
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
  console.log('🌐 Current hostname:', window.location.hostname);
}

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken')
}

// Helper to create headers with auth token
const getHeaders = () => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  }
}

export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      headers: getHeaders(),
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - Please login again')
      }
      throw new Error('Failed to fetch expenses')
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading expenses:', error)
    return []
  }
}

export const addExpense = async (expense: Expense): Promise<Expense | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(expense),
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - Please login again')
      }
      throw new Error('Failed to add expense')
    }
    return await response.json()
  } catch (error) {
    console.error('Error adding expense:', error)
    return null
  }
}

export const updateExpense = async (id: string, updatedExpense: Expense): Promise<Expense | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updatedExpense),
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - Please login again')
      }
      throw new Error('Failed to update expense')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating expense:', error)
    return null
  }
}

export const deleteExpense = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - Please login again')
      }
      throw new Error('Failed to delete expense')
    }
    return true
  } catch (error) {
    console.error('Error deleting expense:', error)
    return false
  }
}
