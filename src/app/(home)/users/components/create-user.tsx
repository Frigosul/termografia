'use client'
import { createUser } from '@/app/http/create-user'
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
import { userRoles, UserRolesType } from '@/utils/user-roles'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const signUpForm = z
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
      .min(8, { message: 'A senha precisa ter no mínimo 8 caracteres.' })
      .max(20),
    confirm_password: z.string(),

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

type SignUpForm = z.infer<typeof signUpForm>
export function CreateUser() {
  const [open, setIsOpen] = useState<boolean>(false)

  const queryClient = useQueryClient()
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list-users'] })
      setIsOpen(false)
    },
    onError: (error) => {
      console.log('error' + error)
    },
  })

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpForm>({ resolver: zodResolver(signUpForm) })

  function handleSignUp(data: SignUpForm) {
    createUserMutation.mutateAsync({
      name: data.name,
      email: data.email,
      userRole: data.userRole,
      password: data.password,
    })
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogDescription className="sr-only">
        Criação de usuários.
      </DialogDescription>
      <DialogTrigger asChild>
        <Button>
          <span className="max-w-0 overflow-hidden  lg:max-w-xs ">
            Adicionar usuário <span className="pr-2"></span>
          </span>
          <Plus className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 rounded-md md:max-w-3xl lg:max-w-screen-xl">
        <DialogHeader>
          <DialogTitle className="text-sm lg:text-base text-left">
            Criar usuário
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleSignUp)}
          className="gap-2 grid grid-cols-form md:grid-cols-2 justify-center lg:justify-between gap-x-4"
        >
          <div className="space-y-2">
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
          <div className="space-y-2">
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
          <div className="space-y-2">
            <Label htmlFor="userRole">Tipo de Usuário</Label>
            <Controller
              name="userRole"
              control={control}
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
              disabled={createUserMutation.isPending}
              type="submit"
            >
              {createUserMutation.isPending ? 'Salvando' : ' Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
