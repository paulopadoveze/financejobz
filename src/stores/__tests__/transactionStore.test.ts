import { describe, it, expect, beforeEach } from 'vitest'
import { useTransactionStore } from '@/stores/transactionStore'
import type { Transaction } from '@/lib/mockData'

const mockTransaction: Transaction = {
  id: 999,
  description: 'Test transaction',
  amount: -100,
  date: '2024-01-01',
  type: 'sent',
  paymentMethod: 'paypal',
}

describe('transactionStore', () => {
  beforeEach(() => {
    useTransactionStore.setState({
      transactions: [],
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

  it('should have correct initial state', () => {
    const state = useTransactionStore.getState()
    expect(state.transactions).toEqual([])
    expect(state.step).toBe('form')
    expect(state.formData.paymentMethod).toBe('paypal')
    expect(state.resultStatus).toBe('idle')
  })

  it('should add a transaction at the beginning of the list', () => {
    const existing: Transaction = {
      id: 1,
      description: 'Existing',
      amount: 50,
      date: '2024-01-01',
      type: 'received',
      paymentMethod: 'pix',
    }
    useTransactionStore.setState({ transactions: [existing] })
    useTransactionStore.getState().addTransaction(mockTransaction)
    const state = useTransactionStore.getState()
    expect(state.transactions).toHaveLength(2)
    expect(state.transactions[0]).toEqual(mockTransaction)
  })

  it('should set step', () => {
    useTransactionStore.getState().setStep('confirm')
    expect(useTransactionStore.getState().step).toBe('confirm')
    useTransactionStore.getState().setStep('password')
    expect(useTransactionStore.getState().step).toBe('password')
  })

  it('should merge formData partially', () => {
    useTransactionStore.getState().setFormData({ amount: '100.00', pixCode: 'abc' })
    const state = useTransactionStore.getState()
    expect(state.formData.amount).toBe('100.00')
    expect(state.formData.pixCode).toBe('abc')
    expect(state.formData.paymentMethod).toBe('paypal')
  })

  it('should set resultStatus', () => {
    useTransactionStore.getState().setResultStatus('success')
    expect(useTransactionStore.getState().resultStatus).toBe('success')
    useTransactionStore.getState().setResultStatus('fail')
    expect(useTransactionStore.getState().resultStatus).toBe('fail')
  })

  it('should resetFlow to default state', () => {
    useTransactionStore.setState({
      step: 'password',
      formData: {
        amount: '50.00',
        paymentMethod: 'bank',
        paypalEmail: '',
        pixCode: '',
        bankAgency: '1234',
        bankAccountNumber: '56789-0',
      },
      resultStatus: 'success',
    })
    useTransactionStore.getState().resetFlow()
    const state = useTransactionStore.getState()
    expect(state.step).toBe('form')
    expect(state.formData.amount).toBe('')
    expect(state.formData.paymentMethod).toBe('pix')
    expect(state.formData.bankAgency).toBe('')
    expect(state.formData.bankAccountNumber).toBe('')
    expect(state.resultStatus).toBe('idle')
  })
})
