'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useApperanceStore } from '@/stores/useAppearanceStore'
import { useModalStore } from '@/stores/useModalStore'
import { getInitials } from '@/utils/return-initials'
import { UserRolesType } from '@/utils/user-roles'
import { ChevronDown, LayoutGrid, LogOut, UserPen } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { SheetSidebar } from './sheet-sidebar'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'

export function Header() {
  const { openModal } = useModalStore()
  const { appearanceMode, onModeAppearance } = useApperanceStore()
  const { data: session } = useSession()
  const userName = session?.user?.name ?? ''

  return (
    <header className="flex justify-between items-center py-3 shadow-sm px-6 lg:justify-end border-b">
      <p className="sr-only text-xl capitalize tracking-tight font-medium lg:not-sr-only lg:mr-auto">
        SulTerm
      </p>
      <SheetSidebar />

      <div className="flex justify-center items-center gap-1 mr-11 lg:mr-9">
        <p className='text-base font-light'>Temp. em <span className='text-primary font-semibold'>ºC</span> </p>
        <DropdownMenu>
          <DropdownMenuTrigger className="hidden md:flex items-center justify-center mx-2 gap-1">
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
            <ChevronDown className='size-4' />
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel className='text-center'>Minha conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='flex items-center justify-start gap-2' onClick={() => {
              openModal('update-user', { id: String(session?.id), email: String(session?.user?.email), name: String(session?.user?.name), password: '', role: session?.role as UserRolesType })
            }}>
              <UserPen size={18} />
              Alterar Perfil
            </DropdownMenuItem>
            {/* <DropdownMenuItem className='flex items-center justify-start gap-2' onClick={() => {
              openModal('alter-password', { id: String(session?.id) })
            }}>
              <LockKeyhole size={16} />
              Alterar Senha
            </DropdownMenuItem> */}
            <DropdownMenuItem className='flex items-center justify-start gap-2' onClick={() => signOut()}>
              <LogOut size={16} className="rotate-180" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger >
            <LayoutGrid strokeWidth={2} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className='text-center'>
            <DropdownMenuLabel>Modos de Exibição</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={appearanceMode === 'simple'}
              onCheckedChange={() => onModeAppearance("simple")}
            >
              Simplificado
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={appearanceMode === 'graph'}
              onCheckedChange={() => onModeAppearance("graph")}
            >
              Gráfico
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
