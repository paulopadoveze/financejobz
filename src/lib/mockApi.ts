import { MOCK_USER, MOCK_PASSWORD, MOCK_TOKEN, MOCK_TRANSACTIONS, MOCK_BALANCE, Transaction } from './mockData'
import { useAuthStore } from '@/hooks/useAuth'

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export const mockApi = {
  async login(email: string, password: string) {
    await delay(300)
    if (email === MOCK_USER.email && password === MOCK_PASSWORD) {
      return { success: true, token: MOCK_TOKEN, user: MOCK_USER }
    }
    throw { status: 401, message: 'Invalid email or password' }
  },

  async getTransactions() {
    await delay(200)
    return { transactions: [...MOCK_TRANSACTIONS] }
  },

  async getBalance() {
    await delay(200)
    return { ...MOCK_BALANCE }
  },

  async getMe() {
    await delay(100)
    const token = useAuthStore.getState().token
    if (token === MOCK_TOKEN) {
      return { user: MOCK_USER }
    }
    throw { status: 401, message: 'Unauthorized' }
  },

  async createTransaction(data: { description?: string; amount: number; type: 'sent' | 'received'; paymentMethod: 'paypal' | 'pix' | 'bank' }) {
    await delay(300)
    const newTransaction: Transaction = {
      id: MOCK_TRANSACTIONS.length + 1,
      description: data.description || `Transaction via ${data.paymentMethod}`,
      amount: data.type === 'received' ? Math.abs(data.amount) : -Math.abs(data.amount),
      date: new Date().toISOString().split('T')[0],
      type: data.type,
      paymentMethod: data.paymentMethod,
    }
    MOCK_TRANSACTIONS.unshift(newTransaction)

    if (data.type === 'received') {
      MOCK_BALANCE.total += Math.abs(data.amount)
      MOCK_BALANCE.income += Math.abs(data.amount)
    } else {
      MOCK_BALANCE.total -= Math.abs(data.amount)
      MOCK_BALANCE.expenses += Math.abs(data.amount)
    }

    return { success: true, transaction: newTransaction }
  },
}
