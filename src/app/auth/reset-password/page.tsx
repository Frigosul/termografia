'use client'
import logo from '@/assets/frigosul.png'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'

import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const resetPassword = z
  .object({
    password: z
      .string()
      .min(8, { message: 'A senha precisa ter no mínimo 8 caracteres.' }),

    newPassword: z
      .string()
      .min(8, { message: 'A senha precisa ter no mínimo 8 caracteres.' })
      .max(20),
    confirmNewPassword: z.string(),
  })
  .superRefine((value, ctx) => {
    if (value.confirmNewPassword !== value.newPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmNewPassword'],
        message: 'As senhas não coincidem.',
      })
    }
  })

type ResetPassword = z.infer<typeof resetPassword>

export default function ResetPassword() {
  // const route = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ResetPassword>({ resolver: zodResolver(resetPassword) })

  async function handleResetPassword(data: ResetPassword) {
    console.log(data)
  }

  return (
    <div className="flex flex-col space-y-2 justify-center items-center px-2 overflow-hidden">
      <Image src={logo} className="w-60 lg:w-64" alt="Logo frigosul" priority />
      <form
        onSubmit={handleSubmit(handleResetPassword)}
        className="w-[20rem] space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="password">Sua senha antiga</Label>
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
        <div className="space-y-2">
          <Label htmlFor="newPassword">Sua nova senha</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Digite sua nova senha..."
            {...register('newPassword')}
          />
          {errors.newPassword?.message && (
            <p className="text-red-500 text-sm font-light">
              {errors.newPassword?.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmNewPassword">Confirme sua nova senha</Label>
          <Input
            id="confirmNewPassword"
            type="password"
            placeholder="Confirme sua nova senha..."
            {...register('confirmNewPassword')}
          />
          {errors.confirmNewPassword?.message && (
            <p className="text-red-500 text-sm font-light">
              {errors.confirmNewPassword?.message}
            </p>
          )}
        </div>

        <Button className="w-full" disabled={isSubmitting} type="submit">
          Resetar senha
        </Button>
      </form>
    </div>
  )
}
