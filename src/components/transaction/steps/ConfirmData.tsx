import { Button } from '@/components/ui/button'
import { useTransactionStore } from '@/stores/transactionStore'
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons'

const paymentMethodLabels: Record<string, string> = {
  pix: 'PIX',
  bank: 'Bank Account',
  paypal: 'PayPal Account',
}

export function ConfirmData() {
  const { formData, setStep } = useTransactionStore()

  const getPaymentDetail = () => {
    switch (formData.paymentMethod) {
      case 'paypal':
        return formData.paypalEmail
      case 'pix':
        return formData.pixCode
      case 'bank':
        return `Ag: ${formData.bankAgency} / Cc: ${formData.bankAccountNumber}`
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6">Confirmar transferência</h2>

      <div className="space-y-4 bg-gray-50 rounded-lg p-6 mb-6">
        <div>
          <p className="text-sm text-gray-500">Valor</p>
          <p className="text-2xl font-bold">
            ${Number(formData.amount).toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Método de Pagamento</p>
          <p className="font-medium">
            {paymentMethodLabels[formData.paymentMethod]}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Detalhes</p>
          <p className="font-medium break-all">{getPaymentDetail()}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setStep('form')}
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button className="flex-1" onClick={() => setStep('password')}>
          Confirmar
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
