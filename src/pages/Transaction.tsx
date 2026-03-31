import { useTransactionStore } from '@/stores/transactionStore'
import { TransactionForm } from '@/components/transaction/steps/TransactionForm'
import { ConfirmData } from '@/components/transaction/steps/ConfirmData'
import { PasswordStep } from '@/components/transaction/steps/PasswordStep'
import { TransactionResult } from '@/components/transaction/steps/TransactionResult'

export default function TransactionPage() {
  const step = useTransactionStore((s) => s.step)

  const renderStep = () => {
    switch (step) {
      case 'form':
        return <TransactionForm />
      case 'confirm':
        return <ConfirmData />
      case 'password':
        return <PasswordStep />
      case 'result':
        return <TransactionResult />
    }
  }

  return (
    <div className="p-6">
      {renderStep()}
    </div>
  )
}
