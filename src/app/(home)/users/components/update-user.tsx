'use client'
import { updateUser } from '@/app/http/update-user'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useModalStore } from '@/stores/useModalStore'
import { userRoles, UserRolesType } from '@/utils/user-roles'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CircleCheck, CircleX } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const updateUserSchema = z
  .object({
    name: z.string().min(3, {
      message: 'O nome de usuário precisa ser maior que 03 caracteres.',
    }),
    email: z
      .string()
      .min(3, { message: 'O e-mail precisa ser maior que 03 caracteres!' })
      .email({ message: 'Digite um e-mail válido.' })
      .toLowerCase(),
    confirm_email: z.string(),

    userRole: z.enum(
      Object.keys(userRoles) as [UserRolesType, ...UserRolesType[]],
      {
        message: `Nível de usuário inválido, Escolha entre ${Object.values(userRoles).join(', ')}`,
      },
    ),
  })
  .superRefine((value, ctx) => {
    if (value.email !== value.confirm_email) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirm_email'],
        message: 'Os e-mails não coincidem.',
      })
    }
  })

type UpdateUserForm = z.infer<typeof updateUserSchema>

export function UpdateUser() {
  const { modals, closeModal, userData } = useModalStore()
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: userData?.name,
      email: userData?.email,
      confirm_email: userData?.email,
      userRole: userData?.role,
    },
  })
  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name,
        email: userData.email,
        confirm_email: userData.email,
        userRole: userData.role,
      });
    }
  }, [userData, reset]);

  const queryClient = useQueryClient()
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['list-users'] })
      toast.success('Usuário atualizado com sucesso', {
        position: 'top-right',
        icon: <CircleCheck />,
      })
      closeModal('update-modal')
    },
    onError: (error) => {
      toast.error('Erro encontrado, por favor tente novamente.', {
        position: 'top-right',
        icon: <CircleX />,
      })
      console.error(error)
    },
  })

  function handleUpdateUser(data: UpdateUserForm) {
    updateUserMutation.mutateAsync({
      userId: String(userData?.id),
      email: data.email,
      name: data.name,
      userRole: data.userRole,
    })
    reset()
  }

  return (
    <Dialog
      open={modals['update-modal']}
      onOpenChange={() => closeModal('update-modal')}
    >
      <DialogDescription className="sr-only">
        Modal de edição de usuário
      </DialogDescription>

      <DialogContent className="w-11/12 rounded-md md:max-w-3xl lg:max-w-screen-xl">
        <DialogHeader>
          <DialogTitle className="text-sm lg:text-base text-left">
            Editar usuário
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleUpdateUser)}
          className="gap-2 grid grid-cols-form md:grid-cols-2 justify-center lg:justify-between gap-x-4"
        >
          <div className="space-y-2 ">
            <Label htmlFor="name">Seu Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome..."
              {...register('name')}
            />
            {errors.name?.message && (
              <p className="text-red-500 text-sm font-light">
                {errors.name?.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="userRole">Tipo de Usuário</Label>
            <Controller
              name="userRole"
              control={control}
              defaultValue={userData?.role}
              render={({ field: { onChange, value, ref } }) => (
                <Select onValueChange={onChange} value={value} name="userRole">
                  <SelectTrigger ref={ref}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(userRoles).map(([value, name]) => (
                      <SelectItem key={value} value={value}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.userRole && (
              <p className="text-red-500 text-sm font-light">
                {errors.userRole.message}
              </p>
            )}
          </div>
          <div className="space-y-2 ">
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
          <div className="space-y-2 ">
            <Label htmlFor="confirm_email">Confirme seu e-mail</Label>
            <Input
              id="confirm_email"
              type="email"
              placeholder="Confirme seu e-mail..."
              autoComplete="off"
              {...register('confirm_email')}
            />
            {errors.confirm_email?.message && (
              <p className="text-red-500 text-sm font-light">
                {errors.confirm_email?.message}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-y-2 md:flex-row md:gap-4 md:col-start-2 mt-1">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                closeModal('update-modal')
                reset()
              }}
              type="button"
            >
              Cancelar
            </Button>

            <Button
              className="flex-1"
              disabled={updateUserMutation.isPending}
              type="submit"
            >
              {updateUserMutation.isPending ? 'Salvando' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
