'use client'
import { createUnionInstrumentFn } from '@/app/http/create-union-instrument'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useInstrumentsStore } from '@/stores/useInstrumentsStore'
import { useModalStore } from '@/stores/useModalStore'
import { zodResolver } from '@hookform/resolvers/zod'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CircleCheck, CircleX } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'


const createUnionInstrument = z
  .object({
    name: z.string().min(3, { message: 'O nome da junção precisa ser maior que 03 caracteres.', }),
    firstInstrument: z.string({ message: "Selecione o instrumento" }),
    secondInstrument: z.string({ message: "Selecione o instrumento" })
  }).superRefine((value, ctx) => {
    if (value.secondInstrument === value.firstInstrument) {
      ctx.addIssue({
        code: 'custom',
        path: ['secondInstrument'],
        message: 'Os instrumentos não podem ser iguais',
      })
      ctx.addIssue({
        code: 'custom',
        path: ['firstInstrument'],
        message: 'Os instrumentos não podem ser iguais',
      })
    }

  })


type CreateUnionInstrument = z.infer<typeof createUnionInstrument>

export function CreateUnionInstruments() {
  const { modals, closeModal, toggleModal } = useModalStore()
  const queryClient = useQueryClient()
  const { instrumentList, isLoading } = useInstrumentsStore();


  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUnionInstrument>({ resolver: zodResolver(createUnionInstrument) })

  const createUnionInstrumentMutation = useMutation({
    mutationFn: createUnionInstrumentFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['list-users'] })
      toast.success('União cadastrada com sucesso', {
        position: 'top-right',
        icon: <CircleCheck />,
      })
      closeModal('create-union-instrument')
    },
    onError: (error) => {
      if (error.message === 'Union already exists') {
        toast.error("União já existente, por favor tente novamente.", {
          position: 'top-right',
          icon: <CircleX />,
        })
        console.error(error)
      } else {
        toast.error('Erro encontrado, por favor tente novamente. ', {
          position: 'top-right',
          icon: <CircleX />,
        })
        console.error(error)
      }

    },
  })
  function handleCreateUnionInstrunent(data: CreateUnionInstrument) {
    createUnionInstrumentMutation.mutateAsync({
      name: data.name,
      firstInstrument: data.firstInstrument,
      secondInstrument: data.secondInstrument,
    })
    // reset()
  }

  return (
    <Dialog open={modals['create-union-instrument']} onOpenChange={() => toggleModal('create-union-instrument')}>
      <DialogDescription className="sr-only">
        Criação da União.
      </DialogDescription>

      <DialogContent className="w-11/12 rounded-md md:max-w-3xl lg:max-w-screen-xl">
        <DialogHeader>
          <DialogTitle className="text-sm lg:text-base text-left">
            Criar União.
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleCreateUnionInstrunent)}
          className="gap-2 grid grid-cols-form md:grid-cols-2 justify-center lg:justify-between gap-x-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nome da união</Label>
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
            <Label htmlFor="firstInstrument">Selecione o primeiro instrumento</Label>
            <Controller
              name="firstInstrument"
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <Select disabled={isLoading} onValueChange={onChange} value={value} name="firstInstrument">
                  <SelectTrigger ref={ref}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {instrumentList?.map(item => {
                      return (
                        <SelectItem value={item.id} key={item.id} >{item.name}</SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.firstInstrument && (
              <p className="text-red-500 text-sm font-light">
                {errors.firstInstrument.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondInstrument">Selecione o segundo instrumento</Label>
            <Controller
              name="secondInstrument"
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <Select disabled={isLoading} onValueChange={onChange} value={value} name="secondInstrument">
                  <SelectTrigger ref={ref}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {instrumentList?.map(item => {
                      return (
                        <SelectItem value={item.id} key={item.id} >{item.name}</SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.secondInstrument && (
              <p className="text-red-500 text-sm font-light">
                {errors.secondInstrument.message}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-y-2 md:flex-row md:gap-4 md:col-start-2 lg:mt-2 lg:items-end">
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
              disabled={createUnionInstrumentMutation.isPending}
              type="submit"
            >
              {createUnionInstrumentMutation.isPending ? 'Criando' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
