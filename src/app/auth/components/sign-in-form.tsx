'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const signInForm = z.object({
  email: z
    .string()
    .min(3, { message: 'O e-mail precisa ser maior que 03 caracteres!' })
    .email({ message: 'Digite um e-mail válido.' }),
  password: z
    .string()
    .min(8, { message: 'A senha precisa ter no mínimo 8 caracteres.' })
    .max(20),
})

type SignInForm = z.infer<typeof signInForm>

export function SignInForm() {
  // const route = useRouter()

  // const signInMutation = useSignIn(
  //   (data) => {
  //     console.log('login success' + data.token)
  //     route.push('/')
  //   },
  //   (error) => {
  //     alert(error.message)
  //   },
  // )
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInForm>({ resolver: zodResolver(signInForm) })

  async function handleSignIn(data: SignInForm) {
    // signInMutation.mutateAsync({
    //   email: data.email,
    //   password: data.password,
    // })
    signIn('credentials', {
      ...data,
      redirectTo: '/',
    })
  }

  return (
    <form onSubmit={handleSubmit(handleSignIn)} className="w-[20rem] space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Seu e-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="Digite seu e-mail..."
          {...register('email')}
        />
        {errors.email?.message && (
          <p className="text-red-500 text-sm font-light">
            {errors.email?.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Sua senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="Digite sua senha..."
          {...register('password')}
        />
        {errors.password?.message && (
          <p className="text-red-500 text-sm font-light">
            {errors.password?.message}
          </p>
        )}
      </div>

      <Button className="w-full" disabled={isSubmitting} type="submit">
        Entrar
      </Button>
    </form>
  )
}
