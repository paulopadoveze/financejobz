import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTransactionStore } from '@/stores/transactionStore'
import { mockApi } from '@/lib/mockApi'

type PaymentMethod = 'paypal' | 'pix' | 'bank'

export function TransactionForm() {
  const { formData, setFormData, setStep } = useTransactionStore()
  const [touched, setTouched] = useState(false)

  const { data: balanceData } = useQuery({
    queryKey: ['balance'],
    queryFn: mockApi.getBalance,
  })

  const totalBalance = balanceData?.total ?? 0
  const amount = Number(formData.amount) || 0
  const exceedsAvailable = amount > totalBalance
  const hasError = touched && exceedsAvailable

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (exceedsAvailable) return
    setStep('confirm')
  }

  const renderPaymentFields = () => {
    switch (formData.paymentMethod) {
      case 'paypal':
        return (
          <div className="space-y-2">
            <Label htmlFor="paypal-email">Conta PayPal </Label>
            <Input
              id="paypal-email"
              type="email"
              placeholder="your-email@example.com"
              value={formData.paypalEmail}
              onChange={(e) => setFormData({ paypalEmail: e.target.value })}
              required
            />
          </div>
        )
      case 'pix':
        return (
          <div className="space-y-2">
            <Label htmlFor="pix-code">Chave Pix</Label>
            <Input
              id="pix-code"
              placeholder="e.g., email, phone, or random key"
              value={formData.pixCode}
              onChange={(e) => setFormData({ pixCode: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500">
              Coloque a chave PIX (email, telefone, CPF ou chave aleatório)
            </p>
          </div>
        )
      case 'bank':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank-agency">Agência</Label>
              <Input
                id="bank-agency"
                placeholder="0000"
                maxLength={4}
                value={formData.bankAgency}
                onChange={(e) => setFormData({ bankAgency: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank-account-number">Conta</Label>
              <Input
                id="bank-account-number"
                placeholder="00000-0"
                maxLength={7}
                value={formData.bankAccountNumber}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 6)
                  const masked = raw.length > 5 ? `${raw.slice(0, 5)}-${raw.slice(5)}` : raw
                  setFormData({ bankAccountNumber: masked })
                }}
                required
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6">Nova transferência</h2>

      <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Saldo disponível</span>
          <span className="font-medium">${totalBalance.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Valor</Label>
          <Input
            id="amount"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            autoFocus
            value={formData.amount}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d]/g, '')
              const num = Number(raw) / 100
              setFormData({ amount: raw === '' ? '' : num.toFixed(2) })
            }}
            onFocus={(e) => {
              if (formData.amount) {
                const sel = formData.amount.replace('.', '')
                e.target.setSelectionRange(sel.length, sel.length)
              }
            }}
            className={hasError ? 'border-red-500 focus:ring-red-500' : ''}
            required
          />
          {hasError && exceedsAvailable && (
            <p className="text-sm text-red-500">
              Esse valor de transferência excede seu saldo de ${totalBalance.toFixed(2)} .
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Método de Pagamento</Label>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {([
              { key: 'pix' as PaymentMethod, label: 'PIX' },
              { key: 'bank' as PaymentMethod, label: 'Conta Corrente' },
              { key: 'paypal' as PaymentMethod, label: 'PayPal' },
            ]).map((method) => (
              <Card
                key={method.key}
                role="button"
                tabIndex={0}
                onClick={() => setFormData({ paymentMethod: method.key })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setFormData({ paymentMethod: method.key })
                  }
                }}
                className={`cursor-pointer transition-colors ${
                  formData.paymentMethod === method.key
                    ? 'border-primary ring-2 ring-primary bg-primary/5'
                    : 'hover:border-muted-foreground/50'
                }`}
              >
                <CardContent className="flex items-center justify-center p-3">
                  <span className="text-sm font-medium">{method.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {renderPaymentFields()}

        <Button
          type="submit"
          className="w-full"
          disabled={hasError || exceedsAvailable}
        >
          Continuar
        </Button>
      </form>
    </div>
  )
}
