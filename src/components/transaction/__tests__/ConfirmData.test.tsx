import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ConfirmData } from '@/components/transaction/steps/ConfirmData'
import { useTransactionStore } from '@/stores/transactionStore'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

describe('ConfirmData', () => {
  beforeEach(() => {
    useTransactionStore.setState({
      step: 'confirm',
      formData: {
        amount: '150.00',
        paymentMethod: 'paypal',
        paypalEmail: 'test@example.com',
        pixCode: 'pix-key-123',
        bankAgency: '1234',
        bankAccountNumber: '56789-0',
      },
      resultStatus: 'idle',
    })
  })

  it('should render transaction summary', () => {
    render(<ConfirmData />, { wrapper: Wrapper })
    expect(screen.getByText('Confirmar transferência')).toBeInTheDocument()
    expect(screen.getByText('$150.00')).toBeInTheDocument()
    expect(screen.getByText('PayPal Account')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('should display PIX details for pix payment method', () => {
    useTransactionStore.setState({
      formData: {
        amount: '50.00',
        paymentMethod: 'pix',
        paypalEmail: '',
        pixCode: 'pix-key-abc',
        bankAgency: '',
        bankAccountNumber: '',
      },
    })
    render(<ConfirmData />, { wrapper: Wrapper })
    expect(screen.getByText('PIX')).toBeInTheDocument()
    expect(screen.getByText('pix-key-abc')).toBeInTheDocument()
  })

  it('should display bank details for bank payment method', () => {
    useTransactionStore.setState({
      formData: {
        amount: '200.00',
        paymentMethod: 'bank',
        paypalEmail: '',
        pixCode: '',
        bankAgency: '5678',
        bankAccountNumber: '12345-6',
      },
    })
    render(<ConfirmData />, { wrapper: Wrapper })
    expect(screen.getByText('Bank Account')).toBeInTheDocument()
    expect(screen.getByText('Ag: 5678 / Cc: 12345-6')).toBeInTheDocument()
  })

  it('should navigate to form step when Back is clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmData />, { wrapper: Wrapper })
    await user.click(screen.getByText('Voltar'))
    expect(useTransactionStore.getState().step).toBe('form')
  })

  it('should navigate to password step when Confirm is clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmData />, { wrapper: Wrapper })
    await user.click(screen.getByText('Confirmar'))
    expect(useTransactionStore.getState().step).toBe('password')
  })
})
