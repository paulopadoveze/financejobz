import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { TransactionResult } from '@/components/transaction/steps/TransactionResult'
import { useTransactionStore } from '@/stores/transactionStore'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function Wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

describe('TransactionResult', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    useTransactionStore.setState({
      step: 'result',
      formData: {
        amount: '100.00',
        paymentMethod: 'paypal',
        paypalEmail: 'test@example.com',
        pixCode: '',
        bankAgency: '',
        bankAccountNumber: '',
      },
      resultStatus: 'success',
    })
  })

  it('should render success state with amount', () => {
    render(<TransactionResult />, { wrapper: Wrapper })
    expect(screen.getByText('Transferência concluída!')).toBeInTheDocument()
    expect(screen.getByText(/Sua transferência de \$100\.00/)).toBeInTheDocument()
    expect(screen.getByText('Voltar para a home')).toBeInTheDocument()
  })

  it('should render failure state with retry option', () => {
    useTransactionStore.setState({ resultStatus: 'fail' })
    render(<TransactionResult />, { wrapper: Wrapper })
    expect(screen.getByText('Transferência negada.')).toBeInTheDocument()
    expect(screen.getByText('Ocorreu um problema sua transferência. Tente novamente.')).toBeInTheDocument()
    expect(screen.getByText('Voltar para a home')).toBeInTheDocument()
    expect(screen.getByText('Tentar Novamente')).toBeInTheDocument()
  })

  it('should reset flow and navigate to dashboard on Back to Dashboard click', async () => {
    const user = userEvent.setup()
    render(<TransactionResult />, { wrapper: Wrapper })
    await user.click(screen.getByText('Voltar para a home'))
    expect(useTransactionStore.getState().step).toBe('form')
    expect(useTransactionStore.getState().formData.amount).toBe('')
    expect(useTransactionStore.getState().resultStatus).toBe('idle')
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })

  it('should reset flow on Try Again click (failure state)', async () => {
    const user = userEvent.setup()
    useTransactionStore.setState({ resultStatus: 'fail' })
    render(<TransactionResult />, { wrapper: Wrapper })
    await user.click(screen.getByText('Tentar Novamente'))
    expect(useTransactionStore.getState().step).toBe('form')
    expect(useTransactionStore.getState().resultStatus).toBe('idle')
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should not show Try Again button on success', () => {
    render(<TransactionResult />, { wrapper: Wrapper })
    expect(screen.queryByText('Tentar Novamente')).not.toBeInTheDocument()
  })
})
