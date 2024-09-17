"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from '@hookform/resolvers/zod';
import { NotebookPen } from "lucide-react";
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const userRoles = ["Administrador", "Nível 1", "Nível 2 ", "Nível 3"]

const updateUserSchema = z.object({
  name: z.string().min(3, { message: 'O nome de usuário precisa ser maior que 03 caracteres.' }),
  email: z.string().min(3, { message: 'O e-mail precisa ser maior que 03 caracteres!' }).email({ message: 'Digite um e-mail válido.' }).toLowerCase(),
  confirm_email: z.string(),
  password: z.string().min(8, { message: 'A senha precisa ter no mínimo 8 caracteres.' }).max(20),
  confirm_password: z.string(),

  userRole: z
    .string({ message: "Escolha um nível de usuário." })
    .refine(value => userRoles.includes(value), {
      message: "Nível de acesso inválido. Escolha entre 'Administrador', 'Nível 1', 'Nível 2' ou 'Nível 3'",
    }),



}).superRefine((value, ctx) => {
  if (value.confirm_password !== value.password) {
    ctx.addIssue({
      code: "custom",
      path: ["confirm_password"],
      message: "As senhas não coincidem."
    })
  }
  if (value.email !== value.confirm_email) {
    ctx.addIssue({
      code: 'custom',
      path: ['confirm_email'],
      message: 'Os e-mails não coincidem.'
    })
  }
})



type UpdateUserForm = z.infer<typeof updateUserSchema>
export function UpdateUser() {

  const { register, reset, handleSubmit, control, formState: { isSubmitting, errors }, } = useForm<UpdateUserForm>({ resolver: zodResolver(updateUserSchema) });

  function handleSignUp(data: UpdateUserForm) {
    console.log(data)
  }

  return (
    <Dialog>
      <DialogTrigger className="flex gap-2 text-muted-foreground font-normal items-center justify-center hover:text-foreground">
        <NotebookPen size={19} />
        Editar
      </DialogTrigger>
      <DialogContent className="max-w-screen-xl">
        <DialogHeader>
          <DialogTitle>Editar Informações</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSignUp)} className="w-full gap-2 grid grid-cols-2">

          <div className="space-y-2 ">
            <Label htmlFor="name">Seu Nome</Label>
            <Input id="name" type="text" placeholder="Digite seu nome..." {...register('name')} />
            {errors.name?.message && <p className="text-red-500 text-sm font-light" >{errors.name?.message}</p>}
          </div>
          <div className="space-y-2 ">
            <Label htmlFor="email">Seu e-mail</Label>
            <Input id="email" type="email" placeholder="Digite seu e-mail..." {...register('email')} />
            {errors.email?.message && <p className="text-red-500 text-sm font-light" >{errors.email?.message}</p>}
          </div>
          <div className="space-y-2 ">
            <Label htmlFor="confirm_email">Confirme seu e-mail</Label>
            <Input id="confirm_email" type="email" placeholder="Confirme seu e-mail..." autoComplete="off" {...register('confirm_email')} />
            {errors.confirm_email?.message && <p className="text-red-500 text-sm font-light" >{errors.confirm_email?.message}</p>}
          </div>
          <div className="space-y-2 ">
            <Label htmlFor="password">Sua senha</Label>
            <Input id="password" type="password" placeholder="Digite sua senha..." {...register('password')} />
            {errors.password?.message && <p className="text-red-500 text-sm font-light" >{errors.password?.message}</p>}
          </div>
          <div className="space-y-2 ">
            <Label htmlFor="confirm_password">Confirme sua senha</Label>
            <Input id="confirm_password" type="password" placeholder="Confirme sua senha..." autoComplete="off" {...register('confirm_password')} />
            {errors.confirm_password?.message && <p className="text-red-500 text-sm font-light" >{errors.confirm_password?.message}</p>}
          </div>
          <div className="space-y-2 ">
            <Label htmlFor="userRole">Tipo de Usuário</Label>
            <Controller
              name="userRole"
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <Select onValueChange={onChange} value={value} name="userRole"  >
                  <SelectTrigger ref={ref}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nível 1">Nível 1</SelectItem>
                    <SelectItem value="Nível 2">Nível 2</SelectItem>
                    <SelectItem value="Nível 3">Nível 3</SelectItem>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.userRole && <p className="text-red-500 text-sm font-light">{errors.userRole.message}</p>}

          </div>


          <div className="flex gap-5 ml-auto mt-auto col-span-2">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => reset()} type="button">Cancelar</Button>
            </DialogClose>
            <Button disabled={isSubmitting} type="submit">Salvar</Button>



          </div>
        </form>
      </DialogContent>
    </Dialog>

  )
}