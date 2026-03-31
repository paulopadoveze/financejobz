import { Button } from '@/components/ui/button'
import { MOCK_USER, MOCK_PASSWORD } from '@/lib/mockData'

interface MockCredentialsProps {
  onFill?: (email: string, password: string) => void
}

export function MockCredentials({ onFill }: MockCredentialsProps) {
  return (
    <div className="mt-4 w-full max-w-md">
      <p className="text-sm text-muted-foreground mb-2 text-center">
        Login para testes:
      </p>
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => onFill?.(MOCK_USER.email, MOCK_PASSWORD)}
        >
          {MOCK_USER.email} / {MOCK_PASSWORD}
        </Button>
      </div>
    </div>
  )
}
