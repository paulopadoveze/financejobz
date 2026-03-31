import { User } from '@/stores/authStore'

export const MOCK_USER: User = {
  id: '1',
  email: 'user@financez.com',
  name: 'João Silva',
  role: 'user',
  createdAt: '2024-01-15T10:00:00Z',
}

export const MOCK_PASSWORD = 'user123'

export const MOCK_TOKEN = 'mock-jwt-token-abc123'

export interface Transaction {
  id: number
  description: string
  amount: number
  date: string
  type: 'sent' | 'received'
  paymentMethod: 'paypal' | 'pix' | 'bank'
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 1, description: 'Pagamento para Joana Oliveira', amount: -150.00, date: '2024-03-30', type: 'sent', paymentMethod: 'paypal' },
  { id: 2, description: 'Recebimento de Empresa Ltda.', amount: 500.00, date: '2024-03-29', type: 'received', paymentMethod: 'pix' },
  { id: 3, description: 'Compra Online', amount: -75.50, date: '2024-03-28', type: 'sent', paymentMethod: 'bank' },
  { id: 4, description: 'Depósito de Salário', amount: 3000.00, date: '2024-03-27', type: 'received', paymentMethod: 'bank' },
  { id: 5, description: 'Pagamento de Conta', amount: -120.00, date: '2024-03-26', type: 'sent', paymentMethod: 'pix' },
  { id: 6, description: 'Reembolso da Loja', amount: 45.00, date: '2024-03-25', type: 'received', paymentMethod: 'paypal' },
  { id: 7, description: 'Taxa de Assinatura', amount: -9.99, date: '2024-03-24', type: 'sent', paymentMethod: 'paypal' },
]

export const MOCK_BALANCE = {
  total: 5189.51,
  income: 3545.0,
  expenses: 1355.49,
}

