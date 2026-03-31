import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/authStore'
import { mockApi } from '@/lib/mockApi'
import { MockCredentials } from '@/components/MockCredentials'
import { LoginResponse } from '@/types/auth'
import { EnvelopeClosedIcon, LockClosedIcon, ArrowRightIcon, ReloadIcon } from '@radix-ui/react-icons'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

const loginUser = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
  return mockApi.login(credentials.email, credentials.password)
}

export default function LoginPage() {
  const navigate = useNavigate()
  const loginStore = useAuthStore((state) => state.login)
  const [serverError, setServerError] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.success && data.user && data.token) {
        loginStore(data.user, data.token)
        navigate('/dashboard')
      } else {
        setServerError(data.message || 'Login failed')
      }
    },
    onError: (error: any) => {
      setServerError(error.message || 'Login failed. Please try again.')
    },
  })

  const onSubmit = (data: LoginFormData) => {
    setServerError('')
    mutation.mutate(data)
  }

  /* just for mock data */
  const fillCredentials = (email: string, password: string) => {
    setValue('email', email, { shouldValidate: true })
    setValue('password', password, { shouldValidate: true })
    setServerError('')
  }

  return (
    <div className="min-h-screen flex bg-cover bg-center bg-primary bg-cover" >
      <div className="bg-white p-12 flex flex-col items-center justify-center w-1/3 min-w-[280px] ml-auto ">
        <div className="">
          <h2 className="text-3xl font-bold pb-3"> Seja bem-vindo de volta!</h2>
          <h3 className="text-1xl font-bold pb-1">  Digite seu email e sua senha</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">

          {serverError && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm text-center">
              {serverError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <EnvelopeClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="leila@financez.com"
                className="pl-10"
                autoFocus
                {...register('email')}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                className="pl-10"
                {...register('password')}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"

            disabled={!isValid || isSubmitting || mutation.isPending}
          >
            {isSubmitting || mutation.isPending ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                <span>Autorizando...</span>
              </>
            ) : (
              <>
                <span>Acessar</span>
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          
          <div className="text-sm text-center text-muted-foreground">
            Não possuí cadastro? {' '}
              <a href="#" className="text-sky-500 hover:underline">
              Crie sua conta
            </a>
          </div>
        </form>
        </div>

        

        {/* Mock Credentials Component */}
        <MockCredentials onFill={fillCredentials} />
        
        <div className="mt-4 text-xs text-muted-foreground text-center">
          <p>⚡Mock API Ativada</p>
          <p className="mt-1">Clique no botão acima para preencher o formulário de autenticação</p>
        </div>
      </div>
    </div>
  )
}