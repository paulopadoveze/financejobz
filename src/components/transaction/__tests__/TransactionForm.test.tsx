import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { TransactionForm } from '@/components/transaction/steps/TransactionForm'
import { useTransactionStore } from '@/stores/transactionStore'

vi.mock('@/lib/mockApi', () => ({
  mockApi: {
    getBalance: vi.fn().mockResolvedValue({ total: 5189.51, income: 3545.0, expenses: 1355.49 }),
  },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
  queryClient.setQueryData(['balance'], { total: 5189.51, income: 3545.0, expenses: 1355.49 })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    )
  }
}

describe('TransactionForm', () => {
  beforeEach(() => {
    useTransactionStore.setState({
      step: 'form',
      formData: {
        amount: '',
        paymentMethod: 'paypal',
        paypalEmail: '',
        pixCode: '',
        bankAgency: '',
        bankAccountNumber: '',
      },
      resultStatus: 'idle',
    })
  })

  it('should render the form with amount input and payment methods', () => {
    render(<TransactionForm />, { wrapper: createWrapper() })
    expect(screen.getByText('Nova transferência')).toBeInTheDocument()
    expect(screen.getByLabelText('Valor')).toBeInTheDocument()
    expect(screen.getByText('Continuar')).toBeInTheDocument()
    expect(screen.getByText('PIX')).toBeInTheDocument()
    expect(screen.getByText('Conta Corrente')).toBeInTheDocument()
    expect(screen.getByText('PayPal')).toBeInTheDocument()
  })

  it('should render PayPal email field by default', () => {
    render(<TransactionForm />, { wrapper: createWrapper() })
    expect(screen.getByLabelText('Conta PayPal')).toBeInTheDocument()
  })

  it('should switch to PIX fields when PIX is selected', async () => {
    const user = userEvent.setup()
    render(<TransactionForm />, { wrapper: createWrapper() })
    await user.click(screen.getByText('PIX'))
    expect(screen.getByLabelText('Chave Pix')).toBeInTheDocument()
    expect(screen.queryByLabelText('Conta PayPal')).not.toBeInTheDocument()
  })

  it('should switch to bank fields when Conta Corrente is selected', async () => {
    const user = userEvent.setup()
    render(<TransactionForm />, { wrapper: createWrapper() })
    await user.click(screen.getByText('Conta Corrente'))
    expect(screen.getByLabelText('Agência')).toBeInTheDocument()
    expect(screen.getByLabelText('Conta')).toBeInTheDocument()
    expect(screen.queryByLabelText('Conta PayPal')).not.toBeInTheDocument()
  })

  it('should format amount input correctly', async () => {
    const user = userEvent.setup()
    render(<TransactionForm />, { wrapper: createWrapper() })
    const amountInput = screen.getByLabelText('Valor')
    await user.type(amountInput, '1234')
    expect((amountInput as HTMLInputElement).value).toBe('12.34')
  })

  it('should render PIX hint text when PIX is selected', async () => {
    const user = userEvent.setup()
    render(<TransactionForm />, { wrapper: createWrapper() })
    await user.click(screen.getByText('PIX'))
    expect(screen.getByText(/Coloque a chave PIX/)).toBeInTheDocument()
  })

  it('should show available balance from query', async () => {
    render(<TransactionForm />, { wrapper: createWrapper() })
    await waitFor(() => {
      expect(screen.getByText('$5189.51')).toBeInTheDocument()
    })
  })

  it('should disable Continue button when amount exceeds balance', () => {
    useTransactionStore.setState({
      formData: {
        amount: '99999999.00',
        paymentMethod: 'paypal',
        paypalEmail: 'test@example.com',
        pixCode: '',
        bankAgency: '',
        bankAccountNumber: '',
      },
    })
    render(<TransactionForm />, { wrapper: createWrapper() })
    const button = screen.getByText('Continuar')
    expect(button).toBeDisabled()
  })

  it('should not disable Continue button when amount is valid', async () => {
    useTransactionStore.setState({
      formData: {
        amount: '100.00',
        paymentMethod: 'paypal',
        paypalEmail: 'test@example.com',
        pixCode: '',
        bankAgency: '',
        bankAccountNumber: '',
      },
    })
    render(<TransactionForm />, { wrapper: createWrapper() })
    const button = screen.getByText('Continuar')
    expect(button).not.toBeDisabled()
  })
})
