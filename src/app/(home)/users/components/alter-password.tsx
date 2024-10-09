'use client'
import { updatePasswordUser } from '@/app/http/update-password-user'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useModal } from '@/context/open-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { CircleCheck, CircleX } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const updatePasswordSchema = z
  .object({
    old_password: z
      .string()
      .min(8, { message: 'A senha precisa ter no mínimo 8 caracteres.' })
      .max(20),

    new_password: z
      .string()
      .min(8, { message: 'A senha precisa ter no mínimo 8 caracteres.' })
      .max(20),
    confirm_password: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.confirm_password !== value.new_password) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirm_password'],
        message: 'As senhas não coincidem.',
      })
    }
  })

type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>

interface UpdatePasswordProps {
  id: string
}

export function AlterPassword({ id }: UpdatePasswordProps) {
  const { modals, closeModal } = useModal()

  const {
    register,
    reset,
    handleSubmit,

    formState: { errors },
  } = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
  })

  const updatePasswordMutation = useMutation({
    mutationFn: updatePasswordUser,
    onSuccess: async (data) => {
      if (data.error) {
        toast.error('Senha atual inválida, verifique sua senha atual.', {
          richColors: true,
          position: 'top-right',
          icon: <CircleX />,
        })
      } else {
        toast.success('Senha atualizada com sucesso', {
          richColors: true,
          position: 'top-right',
          icon: <CircleCheck />,
        })
        closeModal('alter-password')
      }
    },
    onError: (error) => {
      console.log(error.message)
      if (error.message === 'Old password is incorrect') {
        toast.error('Senha atual inválida, verifique sua senha atual.', {
          richColors: true,
          position: 'top-right',
          icon: <CircleX />,
        })
      } else {
        toast.error('Erro encontrado, por favor tente novamente: ' + error, {
          richColors: true,
          position: 'top-right',
          icon: <CircleX />,
        })
        console.log('error' + error)
      }
    },
  })

  function handleUpdateUser(data: UpdatePasswordSchema) {
    updatePasswordMutation.mutateAsync({
      userId: id,
      oldPassword: data.old_password,
      newPassword: data.new_password,
    })
    reset()
  }

  return (
    <Dialog
      open={modals['alter-password']}
      onOpenChange={(open) => (open ? null : closeModal('alter-password'))}
    >
      <DialogDescription className="sr-only">
        Modal de alteração de senha
      </DialogDescription>

      <DialogContent
      //  className="w-11/12 rounded-md md:max-w-3xl lg:max-w-screen"
      >
        <DialogHeader>
          <DialogTitle className="text-sm lg:text-base text-left">
            Alterar senha
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleUpdateUser)}
          // className="gap-2 grid grid-cols-form md:grid-cols-2 justify-center lg:justify-between gap-x-4"
          className="flex flex-col w-full gap-2"
        >
          <div className="space-y-2 ">
            <Label htmlFor="old_password">Sua senha atual</Label>
            <Input
              id="old_password"
              type="password"
              placeholder="Digite sua senha atual..."
              autoComplete="off"
              {...register('old_password')}
            />
            {errors.old_password?.message && (
              <p className="text-red-500 text-sm font-light">
                {errors.old_password?.message}
              </p>
            )}
          </div>
          <div className="space-y-2 ">
            <Label htmlFor="new_password">Sua nova senha</Label>
            <Input
              id="new_password"
              type="password"
              placeholder="Digite sua nova senha..."
              autoComplete="off"
              {...register('new_password')}
            />
            {errors.new_password?.message && (
              <p className="text-red-500 text-sm font-light">
                {errors.new_password?.message}
              </p>
            )}
          </div>
          <div className="space-y-2 ">
            <Label htmlFor="confirm_password">Confirme sua senha</Label>
            <Input
              id="confirm_password"
              type="password"
              placeholder="Confirme sua senha..."
              autoComplete="off"
              {...register('confirm_password')}
            />
            {errors.confirm_password?.message && (
              <p className="text-red-500 text-sm font-light">
                {errors.confirm_password?.message}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-y-2 md:flex-row md:gap-4 md:col-start-2 mt-1">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                closeModal('alter-password')
                reset()
              }}
              type="button"
            >
              Cancelar
            </Button>

            <Button
              className="flex-1"
              disabled={updatePasswordMutation.isPending}
              type="submit"
            >
              {updatePasswordMutation.isPending ? 'Salvando' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
