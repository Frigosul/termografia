'use client'
import { getUsers } from '@/app/http/get-users'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useModalStore } from '@/stores/useModalStore'
import { userRoles, UserRolesType } from '@/utils/user-roles'
import { useQuery } from '@tanstack/react-query'
import { Pencil, Trash2 } from 'lucide-react'
import { SkeletonTable } from './skeleton-table'

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
    <Table className="max-h-[70vh] rounded-md max-w-screen-2xl">
      <TableHeader>
        <TableRow>
          <TableHead className="border ">Nome</TableHead>
          <TableHead className="border">E-mail</TableHead>
          <TableHead className="border">Tipo de Usuário</TableHead>
          <TableHead className="border-t" />
          <TableHead className='border-t border-r' />
        </TableRow>
      </TableHeader>
      <TableBody className='overflow-y-auto'>
        {isLoading ? <SkeletonTable /> : error ? <p>Erro encontrado, tente novamente.</p> : users?.map((user) => {
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
              <TableCell className="text-center border p-0 w-16">
                <Button
                  variant="ghost"
                  className='p-0 m-0'
                  onClick={() => openModal('update-user', { id: String(user.id), email: String(user.email), name: String(user.name), password: user.password, role: user.userRole as UserRolesType })}
                >
                  <Pencil className='size-4' />
                </Button>
              </TableCell>
              <TableCell className="text-center  border px-2 py-0 w-16">
                <Button
                  variant="ghost"
                  className='p-0 m-0'
                  onClick={() => {
                    openModal('delete-user', { id: String(user.id) })
                  }}
                >
                  <Trash2 className='size-4' />

                </Button>

              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
