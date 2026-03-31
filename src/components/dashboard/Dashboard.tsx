import { useQuery } from '@tanstack/react-query'
import { mockApi } from '@/lib/mockApi'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { TransactionList } from './TransactionList'


export function Dashboard() {
  const { data: balanceData, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['balance'],
    queryFn: mockApi.getBalance,
  })

  const totalBalance = balanceData?.total ?? 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="">
          <Card className="bg-gradient-to-tr from-black to-neutral-800 text-white border-none">
            <CardHeader>
              <CardDescription className="text-stone-400">
                Saldo
              </CardDescription>
              <CardTitle className="text-4xl">
                {isLoadingBalance
                  ? 'Carregando...'
                  : `$ ${totalBalance.toFixed(2)}`}
              </CardTitle>
            </CardHeader>

          </Card>
        </div>
        
        <TransactionList />
      </div>

    </div>
  )
}
