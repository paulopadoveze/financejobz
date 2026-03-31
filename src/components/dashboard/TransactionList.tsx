import { useQuery } from '@tanstack/react-query'
import { mockApi } from '@/lib/mockApi'
import { Transaction as TransactionType } from '@/lib/mockData'
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { useTransactionStore } from '@/stores/transactionStore'
import { Link } from 'react-router-dom'

export function TransactionList() {
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: mockApi.getTransactions,
  })

  const storeTransactions = useTransactionStore((s) => s.transactions)

  const apiTransactions: TransactionType[] = transactionsData?.transactions ?? []
  const transactions: TransactionType[] = [...storeTransactions, ...apiTransactions]

  return (
    <div>
      <div className="flex pb-4 items-center">
        <h3 className="font-bold size flex-1">Últimas transferências</h3>
        <Link to="/transaction">
          <Button size="lg">Nova transferência</Button>
        </Link>
      </div>
 
      <div className="bg-white p-8 rounded-lg">
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando transferências...</p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center gap-4 justify-between rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`flex items-center gap-1  font-semibold p-2 rounded  ${
                      transaction.type === 'received'
                        ? 'text-green-600 bg-green-100'
                        : 'text-black-100 bg-gray-100'
                    }`}
                  >
                  {transaction.type === 'received' ? (
                    <ArrowUpIcon className="h-4 w-4" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-2">
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
                <div
                  className={`flex items-center gap-1 font-semibold ${
                    transaction.type === 'received'
                      ? 'text-green-600'
                      : 'text-black-600'
                  }`}
                >
                  {transaction.type === 'received' ? '+' : '-'}$
                  {Math.abs(transaction.amount).toFixed(2)}
                </div>
              </div>
            ))
          )}
            <Button variant="outline" className="w-full">
              Ver todas as transferências
            </Button>
        </div>
      </div>
    </div>
  )
}
