import { create } from 'zustand'
import { Transaction } from '@/lib/mockData'

type PaymentMethod =  'pix' | 'bank' | 'paypal'
type Step = 'form' | 'confirm' | 'password' | 'result'
type ResultStatus = 'idle' | 'success' | 'fail'

interface FormData {
  amount: string
  paymentMethod: PaymentMethod
  paypalEmail: string
  pixCode: string
  bankAgency: string
  bankAccountNumber: string
}

interface TransactionStore {
  transactions: Transaction[]
  addTransaction: (transaction: Transaction) => void

  step: Step
  formData: FormData
  resultStatus: ResultStatus
  setStep: (step: Step) => void
  setFormData: (data: Partial<FormData>) => void
  setResultStatus: (status: ResultStatus) => void
  resetFlow: () => void
}

const defaultFormData: FormData = {
  amount: '',
  paymentMethod: 'pix',
  paypalEmail: '',
  pixCode: '',
  bankAgency: '',
  bankAccountNumber: '',
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  step: 'form',
  formData: { ...defaultFormData },
  resultStatus: 'idle',
  setStep: (step) => set({ step }),
  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  setResultStatus: (status) => set({ resultStatus: status }),
  resetFlow: () =>
    set({ step: 'form', formData: { ...defaultFormData }, resultStatus: 'idle' }),
}))
