import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoginPage from '@/pages/Login'
import DashboardPage from '@/pages/Dashboard'
import TransactionPage from '@/pages/Transaction'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { BaseLayout } from '@/components/layout/BaseLayout'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/financejobz">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<BaseLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/transaction" element={<TransactionPage />} />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App