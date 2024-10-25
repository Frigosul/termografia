'use client'
import { AlterPassword } from '@/app/(home)/users/components/alter-password'
import { UpdateUser } from '@/app/(home)/users/components/update-user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useModeAppearance } from '@/context/appearance-mode'
import { useModal } from '@/context/open-dialog'
import { getInitials } from '@/utils/return-initials'
import { LayoutGrid, LockKeyhole, LogOut, UserPen } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { SheetSidebar } from './sheet-sidebar'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu'

export function Header() {
  const { openModal } = useModal()
  const { mode, onModeAppearance } = useModeAppearance()
  const { data: session } = useSession()
  const userName = session?.user?.name ?? ''

  return (
    <header className="flex justify-between items-center py-3 shadow-sm px-6 lg:justify-end border-b">
      <p className="sr-only text-xl capitalize tracking-tight font-medium lg:not-sr-only lg:mr-auto">
        SulTerm
      </p>
      <SheetSidebar />

      <div className="flex justify-center items-center gap-1 mr-11 lg:mr-9">
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center justify-center p-0 px-1 gap-2">
                <Avatar className="size-9 flex items-center justify-center">
                  <AvatarImage
                    className="rounded-full"
                  // src="https://github.com/joaoeduardodias.png"
                  />
                  <AvatarFallback className="flex items-center justify-center bg-slate-500/50 rounded-full size-9">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                {userName}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuList className="flex flex-col items-start space-x-0">
                  <NavigationMenuItem>
                    <Button
                      variant="ghost"
                      className="flex  gap-2 items-start justify-start  hover:bg-transparent text-sm font-light"
                      onClick={() => openModal('update-modal')}
                    >
                      <UserPen size={18} />
                      Alterar Perfil
                    </Button>
                    <UpdateUser
                      id={String(session?.id)}
                      name={String(session?.user?.name)}
                      userRole={session?.role as 'adm' | 'level1' | 'level2'}
                      email={String(session?.user?.email)}
                      password=""
                    />
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button
                      variant="ghost"
                      className="flex  gap-2   items-start hover:bg-transparent text-sm font-light"
                      onClick={() => openModal('alter-password')}
                    >
                      <LockKeyhole size={16} />
                      Alterar Senha
                    </Button>
                    <AlterPassword id={String(session?.id)} />
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button
                      variant="ghost"
                      onClick={() => signOut()}
                      className="flex  gap-2  items-start hover:bg-transparent text-sm font-light"
                    >
                      <LogOut size={16} className="rotate-180" />
                      Sair
                    </Button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <LayoutGrid />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className='text-center'>
            <DropdownMenuLabel>Aparência</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={mode === 'simple'}
              onCheckedChange={() => onModeAppearance("simple")}
            >
              Simples
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={mode === 'complete'}
              onCheckedChange={() => onModeAppearance("complete")}
            >
              Completo
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
