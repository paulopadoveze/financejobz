import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { PasswordStep } from '@/components/transaction/steps/PasswordStep'
import { useTransactionStore } from '@/stores/transactionStore'
import { useAuthStore } from '@/stores/authStore'
import { MOCK_USER, MOCK_PASSWORD } from '@/lib/mockData'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    )
  }
}

describe('PasswordStep', () => {
  beforeEach(() => {
    useTransactionStore.setState({
      step: 'password',
      formData: {
        amount: '100.00',
        paymentMethod: 'paypal',
        paypalEmail: 'test@example.com',
        pixCode: '',
        bankAgency: '',
        bankAccountNumber: '',
      },
      resultStatus: 'idle',
    })
    useAuthStore.setState({
      user: MOCK_USER,
      token: 'mock-token',
      isAuthenticated: true,
    })
  })

  it('should render password form with user info', () => {
    render(<PasswordStep />, { wrapper: createWrapper() })
    expect(screen.getByText('Verificar identidade')).toBeInTheDocument()
    expect(screen.getByText(MOCK_USER.name)).toBeInTheDocument()
    expect(screen.getByText(MOCK_USER.email)).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('should show error for incorrect password', async () => {
    const user = userEvent.setup()
    render(<PasswordStep />, { wrapper: createWrapper() })
    const passwordInput = screen.getByLabelText('Senha')
    await user.type(passwordInput, 'wrong-password')
    await user.click(screen.getByText('Confirmar'))
    expect(screen.getByText('Incorrect password. Try again.')).toBeInTheDocument()
    expect(useTransactionStore.getState().step).toBe('password')
  })

  it('should proceed to result step on correct password', async () => {
    const user = userEvent.setup()
    render(<PasswordStep />, { wrapper: createWrapper() })
    const passwordInput = screen.getByLabelText('Senha')
    await user.type(passwordInput, MOCK_PASSWORD)
    await user.click(screen.getByText('Confirmar'))
    await waitFor(() => {
      expect(useTransactionStore.getState().step).toBe('result')
    })
    expect(useTransactionStore.getState().resultStatus).toBe('success')
  })

  it('should navigate back to confirm step when Back is clicked', async () => {
    const user = userEvent.setup()
    render(<PasswordStep />, { wrapper: createWrapper() })
    await user.click(screen.getByText('Voltar'))
    expect(useTransactionStore.getState().step).toBe('confirm')
  })

  it('should show Authorizing state while submitting', async () => {
    const user = userEvent.setup()
    render(<PasswordStep />, { wrapper: createWrapper() })
    const passwordInput = screen.getByLabelText('Senha')
    await user.type(passwordInput, MOCK_PASSWORD)
    await user.click(screen.getByText('Confirmar'))
    expect(useTransactionStore.getState().step).toBe('password')
  })

  it('should construct description for PIX payment method', async () => {
    const user = userEvent.setup()
    useTransactionStore.setState({
      formData: {
        amount: '50.00',
        paymentMethod: 'pix',
        paypalEmail: '',
        pixCode: 'pix@test.com',
        bankAgency: '',
        bankAccountNumber: '',
      },
    })
    render(<PasswordStep />, { wrapper: createWrapper() })
    const passwordInput = screen.getByLabelText('Senha')
    await user.type(passwordInput, MOCK_PASSWORD)
    await user.click(screen.getByText('Confirmar'))
    await waitFor(() => {
      expect(useTransactionStore.getState().resultStatus).toBe('success')
    })
  })

  it('should construct description for bank payment method', async () => {
    const user = userEvent.setup()
    useTransactionStore.setState({
      formData: {
        amount: '75.00',
        paymentMethod: 'bank',
        paypalEmail: '',
        pixCode: '',
        bankAgency: '9999',
        bankAccountNumber: '11111-2',
      },
    })
    render(<PasswordStep />, { wrapper: createWrapper() })
    const passwordInput = screen.getByLabelText('Senha')
    await user.type(passwordInput, MOCK_PASSWORD)
    await user.click(screen.getByText('Confirmar'))
    await waitFor(() => {
      expect(useTransactionStore.getState().resultStatus).toBe('success')
    })
  })
})
