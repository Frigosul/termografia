'use client'
import { updateUser } from '@/app/http/update-user'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { User } from '@/types/user'
import { userRoles, UserRolesType } from '@/utils/user-roles'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NotebookPen } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
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
    password: z
      .string()
      .min(8, { message: ' A senha deve ter no mínimo 8 caracteres' })
      .max(100)
      .or(z.string().max(0)),
    confirm_password: z.string().optional(),

    userRole: z.enum(
      Object.keys(userRoles) as [UserRolesType, ...UserRolesType[]],
      {
        message: `Nível de usuário inválido, Escolha entre ${Object.values(userRoles).join(', ')}`,
      },
    ),
  })
  .superRefine((value, ctx) => {
    if (value.confirm_password !== value.password) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirm_password'],
        message: 'As senhas não coincidem.',
      })
    }
    if (value.email !== value.confirm_email) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirm_email'],
        message: 'Os e-mails não coincidem.',
      })
    }
  })

type UpdateUserForm = z.infer<typeof updateUserSchema>

export function UpdateUser({ id, email, name, userRole }: User) {
  const [isOpen, setIsOpen] = useState(false)
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name,
      email,
      confirm_email: email,
      userRole,
    },
  })

  const queryClient = useQueryClient()
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list-users'] })
      setIsOpen(false)
    },
    onError: (error) => {
      console.log('error' + error)
    },
  })

  function handleUpdateUser(data: UpdateUserForm) {
    updateUserMutation.mutateAsync({
      userId: id,
      email: data.email,
      name: data.name,
      password: data.password,
      userRole: data.userRole,
    })
    reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogDescription className="sr-only">
        Modal de edição de usuário
      </DialogDescription>
      <DialogTrigger className="flex gap-2 text-muted-foreground font-normal items-center justify-center hover:text-foreground">
        <NotebookPen size={19} />
        Editar
      </DialogTrigger>
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
          <div className="space-y-2 ">
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
          <div className="space-y-2 ">
            <Label htmlFor="userRole">Tipo de Usuário</Label>
            <Controller
              name="userRole"
              control={control}
              defaultValue={userRole}
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

          <div className="flex flex-col-reverse gap-y-2 md:flex-row md:gap-4 md:col-start-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => reset()}
                type="button"
              >
                Cancelar
              </Button>
            </DialogClose>
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
