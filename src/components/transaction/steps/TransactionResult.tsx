import { Button } from '@/components/ui/button'
import { useTransactionStore } from '@/stores/transactionStore'
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'

export function TransactionResult() {
  const { resultStatus, resetFlow, formData } = useTransactionStore()
  const navigate = useNavigate()

  const handleDone = () => {
    resetFlow()
    navigate('/dashboard')
  }

  const handleRetry = () => {
    resetFlow()
  }

  if (resultStatus === 'success') {
    return (
      <div className="mx-auto w-full max-w-md text-center">
        <CheckCircledIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Transferência concluída!</h2>
        <p className="text-gray-500 mb-6">
          Sua transferência de ${Number(formData.amount).toFixed(2)} foi processada.
        </p>
        <Button className="w-full" onClick={handleDone}>
          Voltar para a home
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-md text-center">
      <CrossCircledIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Transferência negada.</h2>
      <p className="text-gray-500 mb-6">
        Ocorreu um problema sua transferência. Tente novamente.
      </p>
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleDone}
        >
          Voltar para a home
        </Button>
        <Button className="flex-1" onClick={handleRetry}>
          Tentar Novamente
        </Button>
      </div>
    </div>
  )
}
