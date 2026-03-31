import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTransactionStore } from '@/stores/transactionStore'
import { useAuthStore } from '@/stores/authStore'
import { mockApi } from '@/lib/mockApi'
import { MOCK_PASSWORD } from '@/lib/mockData'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useQueryClient } from '@tanstack/react-query'

export function PasswordStep() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { formData, setStep, setResultStatus } =
    useTransactionStore()
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setError('')
    setIsSubmitting(true)

    if (password !== MOCK_PASSWORD) {
      setError('Incorrect password. Try again.')
      setIsSubmitting(false)
      return
    }

    try {
      const result = await mockApi.createTransaction({
        description:
          formData.paymentMethod === 'paypal'
            ? `PayPal (${formData.paypalEmail})`
            : formData.paymentMethod === 'pix'
              ? `PIX (${formData.pixCode})`
              : `Transferência Bancária (Ag: ${formData.bankAgency} / Cc: ${formData.bankAccountNumber})`,
        amount: Number(formData.amount),
        type: 'sent',
        paymentMethod: formData.paymentMethod,
      })

      queryClient.invalidateQueries({ queryKey: ['balance'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      setResultStatus('success')
    } catch {
      setResultStatus('fail')
    }

    setIsSubmitting(false)
    setStep('result')
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className="text-2xl font-bold mb-2">Verificar identidade</h2>
      <p className="text-gray-500 mb-6">
        Digite sua senha para confirmar a transferência.
      </p>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-500">Conectado como</p>
        <p className="font-medium">{user?.name}</p>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <p className="text-xs text-gray-400">A senha é "{MOCK_PASSWORD}"</p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setStep('confirm')}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? 'Verificando' : 'Confirmar'}
          </Button>
        </div>
      </form>
    </div>
  )
}
