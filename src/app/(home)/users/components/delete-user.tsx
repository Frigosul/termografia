'use client'
import { deleteUser } from '@/app/http/delete-user'
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
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Trash2 } from 'lucide-react'
import { FormEvent } from 'react'

interface DeleteUserProps {
  userId: string
}

export function DeleteUser({ userId }: DeleteUserProps) {
  const queryClient = useQueryClient()
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list-users'] })
    },
    onError: (error) => {
      console.log('error' + error)
    },
  })

  function handleDeleteUser(e: FormEvent, id: string) {
    e.preventDefault()
    deleteUserMutation.mutateAsync({ userId: id })
  }

  return (
    <Dialog>
      <DialogTrigger className="flex gap-2 text-muted-foreground font-normal items-center justify-center hover:text-foreground">
        <Trash2 size={20} />
        Excluir
      </DialogTrigger>
      <DialogContent className="w-11/12 rounded-md">
        <DialogHeader className="flex items-center justify-center pb-4 border-b">
          <Trash2 className="text-red-600" size={48} strokeWidth={1} />
          <DialogTitle className="font-normal pt-4 pb-1">
            Excluir Usuário
          </DialogTitle>
          <DialogDescription className="sr-only">
            Excluir usuário
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => handleDeleteUser(event, userId)}
          className="flex gap-5 mx-auto md:w-80 "
        >
          <DialogClose asChild>
            <Button
              variant="outline"
              className="flex-1"
              type="button"
              size="sm"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            size="sm"
            className="bg-red-500 hover:bg-red-600 flex-1"
            disabled={deleteUserMutation.isPending}
          >
            {deleteUserMutation.isPending ? 'Excluindo' : ' Excluir'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
