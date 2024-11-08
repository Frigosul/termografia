'use client'
import { getUsers } from '@/app/http/get-users'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useModalStore } from '@/stores/useModalStore'
import { userRoles } from '@/utils/user-roles'
import { useQuery } from '@tanstack/react-query'
import { EllipsisVertical, NotebookPen, Trash2 } from 'lucide-react'
import { DeleteUser } from './delete-user'
import { SkeletonTable } from './skeleton-table'
import { UpdateUser } from './update-user'

export function ListUsers() {
  const { openModal } = useModalStore()
  const {
    data: users,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['list-users'],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  return (
    <ScrollArea>
      <ScrollBar orientation='horizontal' />
      <ScrollBar orientation='vertical' />
      <Table className="rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead className="border ">Nome</TableHead>
            <TableHead className="border">E-mail</TableHead>
            <TableHead className="border">Tipo de Usuário</TableHead>
            <TableHead className="border">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? <SkeletonTable /> : error ? <h2>Erro encontrado, tente novamente.</h2> : users?.map((user) => {
            return (
              <TableRow
                key={user.id}
                className="odd:bg-white odd:dark:bg-slate-950 even:bg-slate-50 even:dark:bg-slate-900"
              >
                <TableCell className="border min-w-52 w-96">
                  {user.name}
                </TableCell>
                <TableCell className="border min-w-52 w-96">
                  {user.email}
                </TableCell>
                <TableCell className="border min-w-40">
                  {userRoles[user.userRole] || user.userRole}
                </TableCell>
                <TableCell className="text-center w-4 border">
                  <Popover>
                    <PopoverTrigger className="h-4">
                      <EllipsisVertical size={18} />
                    </PopoverTrigger>
                    <PopoverContent className="space-y-2 w-30 mr-9">
                      <Button
                        variant="ghost"
                        className="flex gap-2 p-0 h-6 text-base text-muted-foreground font-normal items-center justify-center hover:bg-transparent hover:text-foreground"
                        onClick={() => openModal('update-modal', { id: user.id, email: user.email, name: user.name, password: '', role: user.userRole })}
                      >
                        <NotebookPen size={19} />
                        Editar
                      </Button>
                      <UpdateUser />
                      <Button
                        variant="ghost"
                        className="flex gap-2 p-0 h-6 text-base text-muted-foreground font-normal items-center justify-center hover:bg-transparent hover:text-foreground"
                        onClick={() => openModal('delete-modal', { id: user.id })}
                      >
                        <Trash2 size={20} />
                        Excluir
                      </Button>
                      <DeleteUser userId={user.id} />
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}
