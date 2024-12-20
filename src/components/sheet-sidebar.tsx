'use client'
import { NavLink } from '@/components/nav-link'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useModalStore } from '@/stores/useModalStore'
import { getInitials } from '@/utils/return-initials'
import { UserRolesType } from '@/utils/user-roles'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import {
  BetweenHorizontalEnd,
  ChevronDown,
  Database,
  House,
  LineChart,
  LogOut,
  Menu,
  ScrollText,
  UserPen,
  Users,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
export function SheetSidebar() {
  const { data: session } = useSession()
  const { openModal } = useModalStore()
  const userName = session?.user?.name ?? ''

  return (
    <Sheet>
      <SheetTrigger asChild className="lg:sr-only">
        <Button variant="ghost">
          <Menu size={28} />
        </Button>
      </SheetTrigger>
      <SheetContent className="min-h-screen px-2" side="left">
        <SheetTitle className="m-4 text-center text-xl uppercase tracking-tight font-medium">
          Termografia
        </SheetTitle>
        <SheetDescription className="sr-only">Menu</SheetDescription>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-center mx-2 gap-1">
            <Avatar className="size-9 flex items-center justify-center">
              <AvatarImage
                className="rounded-full"
                // src="https://github.com/joaoeduardodias.png"
              />
              <AvatarFallback className="flex items-center text-sm justify-center bg-slate-500/50 rounded-full size-8">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            {userName}
            <ChevronDown className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-center">
              Minha conta
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center justify-start gap-2"
              onClick={() => {
                openModal('update-user', {
                  id: String(session?.id),
                  email: String(session?.user?.email),
                  name: String(session?.user?.name),
                  password: '',
                  role: session?.role as UserRolesType,
                })
              }}
            >
              <UserPen size={18} />
              Alterar Perfil
            </DropdownMenuItem>
            {/* <DropdownMenuItem className='flex items-center justify-start gap-2' onClick={() => {
              openModal('alter-password', { id: String(session?.id) })
            }}>
              <LockKeyhole size={16} />
              Alterar Senha
            </DropdownMenuItem> */}
            <DropdownMenuItem
              className="flex items-center justify-start gap-2"
              onClick={() => signOut()}
            >
              <LogOut size={16} className="rotate-180" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <nav className="flex flex-col h-full pb-12">
          <NavLink href="/">
            <House size={20} />
            Home
          </NavLink>
          {session?.role === 'adm' && (
            <>
              <NavLink href="/data/chart">
                <LineChart size={20} />
                Gerar gráfico
              </NavLink>
              <NavLink href="/data/update-data">
                <Database size={20} />
                Editar dados
              </NavLink>
              <NavLink href="/data/generate-data">
                <ScrollText size={20} />
                Gerenciar padrões
              </NavLink>
              <NavLink href="/data/managed-equipments">
                <BetweenHorizontalEnd size={20} />
                Gerenciar equipamentos
              </NavLink>
              <NavLink href="/users">
                <Users size={20} />
                Usuários
              </NavLink>
            </>
          )}

          {session?.role === 'level2' && (
            <>
              <NavLink href="/data/chart">
                <LineChart size={20} />
                Gerar gráfico
              </NavLink>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
