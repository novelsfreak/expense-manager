import type { Expense } from '../types/expense'

// For Vercel: use relative paths (handled by rewrites)
// For local dev: use localhost
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : import.meta.env.DEV 
    ? 'http://localhost:3001/api'
    : '/api'

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
