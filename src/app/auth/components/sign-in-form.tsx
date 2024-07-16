"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const signInForm = z.object({
  username: z.string().min(3, { message: 'O nome de usuário precisa ser maior que 03 caracteres!' }),
  password: z.string().min(8, { message: 'A senha precisa ter no mínimo 8 caracteres.' }).max(20),
})

type SignInForm = z.infer<typeof signInForm>

export function SignInForm() {


  const { register, handleSubmit, formState: { isSubmitting } } = useForm<SignInForm>({ resolver: zodResolver(signInForm) });

  function handleSignIn(data: SignInForm) {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(handleSignIn)} className="w-[20rem] space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Seu usuário</Label>
        <Input id="username" type="username" placeholder="Digite seu usuário..." {...register('username')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Seu nome</Label>
        <Input id="password" type="password" placeholder="Digite sua senha..." {...register('password')} />
      </div>

      <Button className="w-full" disabled={isSubmitting} type="submit">Entrar</Button>
    </form>
  )
}